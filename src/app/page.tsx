"use client";

import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/navigation";
import { SearchForm } from "@/components/search-form";
import { ProfilesSection } from "@/components/profiles-section";
import { MessagesSection } from "@/components/messages-section";
import { UserResult } from "@/services/linkd-api";
import { OutreachMessage, runLinkedInOutreach, runGmailOutreach } from "@/app/stagehand/main";
import Image from "next/image";
import { motion, stagger, useAnimate } from "framer-motion";

// Define the UserProfile interface
interface UserProfile {
  universityName: string;
  fullName: string;
  year: string;
  clubs: string[];
  societies: string[];
  location: string;
}

// Default user profile
const defaultUserProfile: UserProfile = {
  universityName: "USC",
  fullName: "Student",
  year: "Senior",
  clubs: ["Student Organization"],
  societies: ["Honor Society"],
  location: "Los Angeles"
};

// Function to get user profile from localStorage
function getUserProfileFromStorage(): UserProfile {
  if (typeof window === 'undefined') {
    return defaultUserProfile;
  }
  
  const savedProfile = localStorage.getItem("userProfile");
  if (!savedProfile) {
    return defaultUserProfile;
  }
  
  try {
    const profileData = JSON.parse(savedProfile);
    
    // Convert clubs and societies from strings to arrays if they're strings
    const clubs = typeof profileData.clubs === 'string' 
      ? profileData.clubs.split('\n').filter(Boolean) 
      : (profileData.clubs || ["Student Organization"]);
      
    const societies = typeof profileData.societies === 'string'
      ? profileData.societies.split('\n').filter(Boolean)
      : (profileData.societies || ["Honor Society"]);

    return {
      universityName: profileData.university || "USC",
      fullName: profileData.fullName || "Student",
      year: profileData.year || "Senior",
      clubs: clubs,
      societies: societies,
      location: profileData.location || "Los Angeles"
    };
  } catch (error) {
    console.error("Error parsing saved profile:", error);
    return defaultUserProfile;
  }
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeneratingMessages, setIsGeneratingMessages] = useState(false);
  const [isSendingMessages, setIsSendingMessages] = useState(false);
  const [isEmailingMessages, setIsEmailingMessages] = useState(false);
  const [profiles, setProfiles] = useState<UserResult[]>([]);
  const [generatedMessages, setGeneratedMessages] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<OutreachMessage[]>([]);
  const [limit, setLimit] = useState<string>("5");
  const [searchQuery, setSearchQuery] = useState("");
  const [userProfile, setUserProfile] = useState(getUserProfileFromStorage());
  const [alumniOnly, setAlumniOnly] = useState<boolean>(true);
  const [showBackground, setShowBackground] = useState(true);
  
  // Simple bubble state type
  const [bubbles, setBubbles] = useState<Array<{id: number, left: number, size: number, duration: number}>>([]);
  const bubblesContainerRef = useRef<HTMLDivElement>(null);

  // Add a state to track if the component is mounted on the client
  const [isMounted, setIsMounted] = useState(false);
  
  // Animation scope for Framer Motion
  const [scope, animate] = useAnimate();

  // Set isMounted to true once the component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load user profile from localStorage when component mounts
  useEffect(() => {
    setUserProfile(getUserProfileFromStorage());
  }, []);

  // Use Framer Motion to animate text
  useEffect(() => {
    if (!isMounted) return;
    
    // Reset animation state when component mounts
    try {
      sessionStorage.removeItem('animationHasRun');
    } catch (error) {
      console.error('Error accessing sessionStorage:', error);
    }

    // Create bubbles
    const newBubbles = [];
    for (let i = 0; i < 30; i++) { 
      const duration = 5 + (Math.random() * 5);
      
      newBubbles.push({
        id: i,
        left: Math.random() * 100,
        size: 6 + Math.random() * 10,
        duration: duration
      });
    }
    setBubbles(newBubbles);

    // Animate with Framer Motion - faster sequence
    animate([
      // Fade in brew text as one unit
      [".brew-container", { opacity: 1, y: 0 }, { 
        duration: 0.3, 
        ease: "easeOut",
      }],
      // Fade in the rest of the text
      [".rest-of-text", { opacity: 1, y: 0 }, { 
        duration: 0.3, 
        ease: "easeOut",
        delay: 0.1 
      }],
      // Fade in subtitle
      [".subtitle", { opacity: 1, y: 0 }, { 
        duration: 0.3, 
        ease: "easeOut",
        delay: 0.1
      }],
      // Show bubbles
      [".bubbles-container", { opacity: 1 }, { 
        duration: 0.6, 
        ease: "easeInOut",
        delay: 0.4 
      }]
    ]);
  }, [isMounted, animate]);

  // Update messages whenever generatedMessages or profiles change
  useEffect(() => {
    // Only update when we have both profiles and messages
    if (profiles.length > 0 && Object.keys(generatedMessages).length > 0) {
      const newMessages = profiles
        .filter((profile, index) => {
          const uniqueId = `${profile.profile.id}-${index}`;
          return (generatedMessages[uniqueId] || generatedMessages[profile.profile.id]) && profile.profile.linkedin_url;
        })
        .map((profile, index) => {
          const uniqueId = `${profile.profile.id}-${index}`;
          return {
            linkedinUrl: profile.profile.linkedin_url || "",
            body: generatedMessages[uniqueId] || generatedMessages[profile.profile.id] || "",
            subject: "Curious about your experience",
            name: profile.profile.name || ""
          };
        });
      
      setMessages(newMessages);
    }
  }, [profiles, generatedMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hide the background gradient
    setShowBackground(false);
    
    if (!prompt) {
      alert("Please enter your objective");
      return;
    }
    
    // Reset state for a new search
    setProfiles([]);
    setGeneratedMessages({});
    setMessages([]);
    
    setIsLoading(true);
    setIsSearching(true);
    
    console.log(`[${new Date().toISOString()}] [page] Starting search process`);
    const startTime = performance.now();
    
    try {
      // Get latest user profile
      const latestProfile = getUserProfileFromStorage();
      setUserProfile(latestProfile);
      
      console.log(`[${new Date().toISOString()}] [page] Step 1: Generating search query using Gemini API`);
      const queryStartTime = performance.now();
      
      // 1. Generate a search query using Gemini API
      const queryResponse = await fetch('/api/gemini-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile: latestProfile,
          userObjective: prompt
        }),
      });
      
      const queryData = await queryResponse.json();
      
      const queryEndTime = performance.now();
      console.log(`[${new Date().toISOString()}] [page] Query generation completed in ${(queryEndTime - queryStartTime).toFixed(2)}ms`);
      console.log(`[${new Date().toISOString()}] [page] Generated query: "${queryData.text}"`);
      
      if (!queryData.success) {
        throw new Error(queryData.error || 'Failed to generate search query');
      }
      
      const generatedQuery = queryData.text;
      setSearchQuery(generatedQuery);
      
      // 2. Use the generated query to search LinkedIn profiles
      console.log(`[${new Date().toISOString()}] [page] Step 2: Searching LinkedIn profiles with generated query`);
      const searchStartTime = performance.now();
      
      const searchResponse = await fetch('/api/linkd-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile: latestProfile,
          userObjective: prompt,
          limit: parseInt(limit),
          generatedQuery: generatedQuery,
          alumniOnly: alumniOnly
        }),
      });
      
      const searchData = await searchResponse.json();
      
      const searchEndTime = performance.now();
      console.log(`[${new Date().toISOString()}] [page] LinkedIn search completed in ${(searchEndTime - searchStartTime).toFixed(2)}ms`);
      console.log(`[${new Date().toISOString()}] [page] Found ${searchData.results ? searchData.results.length : 0} profiles in initial search`);
      
      if (searchData.error) {
        throw new Error(searchData.error);
      }
      
      // Use the results we got, regardless of how many
      console.log(`[${new Date().toISOString()}] [page] Proceeding with ${searchData.results?.length || 0} profiles for message generation`);
      setProfiles(searchData.results || []);
      setIsSearching(false);
      
      // Start generating messages
      setIsGeneratingMessages(true);
      const foundProfiles = searchData.results || [];
      if (foundProfiles.length > 0) {
        const profilesForMessages = foundProfiles.slice(0, Math.min(parseInt(limit), foundProfiles.length));
        console.log(`[${new Date().toISOString()}] [page] Starting message generation for ${profilesForMessages.length} profiles`);
        await generateMessagesForProfiles(profilesForMessages);
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] [page] Error:`, error);
      // Show error as a profile
      setProfiles([{
        profile: {
          id: "error",
          name: "Error",
          location: "",
          headline: "Failed to process request",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          title: "",
          profile_picture_url: "",
          linkedin_url: ""
        },
        experience: [],
        education: []
      }]);
    } finally {
      const endTime = performance.now();
      console.log(`[${new Date().toISOString()}] [page] Total process completed in ${(endTime - startTime).toFixed(2)}ms`);
      setIsLoading(false);
      setIsSearching(false);
      setIsGeneratingMessages(false);
    }
  };

  const generateMessagesForProfiles = async (profilesData: UserResult[]) => {
    // Process profiles in sequence to avoid rate limits
    const messages: Record<string, string> = {};
    console.log(`[${new Date().toISOString()}] [page] generateMessagesForProfiles: Starting generation for ${profilesData.length} profiles`);
    
    // Get latest user profile data
    const latestProfile = getUserProfileFromStorage();
    
    for (let i = 0; i < profilesData.length; i++) {
      const profile = profilesData[i];
      const messageStartTime = performance.now();
      console.log(`[${new Date().toISOString()}] [page] Generating message ${i+1}/${profilesData.length} for ${profile.profile.name}`);
      
      // Create a unique ID by appending the index to handle potential duplicate IDs
      const uniqueProfileId = `${profile.profile.id}-${i}`;
      
      try {
        // Set placeholder
        messages[uniqueProfileId] = "Generating personalized message...";
        setGeneratedMessages(prev => ({
          ...prev,
          [uniqueProfileId]: "Generating personalized message..."
        }));
        
        // Generate message for this profile
        const messageResponse = await fetch('/api/generate-messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userProfile: latestProfile,
            userObjective: prompt,
            selectedProfiles: [profile],
            bulkGenerate: false
          }),
        });
        
        const messageData = await messageResponse.json();
        const messageEndTime = performance.now();
        
        if (messageData.success && messageData.results) {
          console.log(`[${new Date().toISOString()}] [page] Message ${i+1} generated successfully in ${(messageEndTime - messageStartTime).toFixed(2)}ms`);
          messages[uniqueProfileId] = messageData.results.message;
          // Update one by one to prevent full refresh
          setGeneratedMessages(prev => ({
            ...prev,
            [uniqueProfileId]: messageData.results.message
          }));
        } else {
          console.error(`[${new Date().toISOString()}] [page] Failed to generate message ${i+1}:`, messageData.error);
          messages[uniqueProfileId] = "Failed to generate a personalized message.";
          setGeneratedMessages(prev => ({
            ...prev,
            [uniqueProfileId]: "Failed to generate a personalized message."
          }));
        }
      } catch (error) {
        console.error(`[${new Date().toISOString()}] [page] Error generating message ${i+1}:`, error);
        messages[uniqueProfileId] = "Error generating message.";
        setGeneratedMessages(prev => ({
          ...prev,
          [uniqueProfileId]: "Error generating message."
        }));
      }
    }
    
    console.log(`[${new Date().toISOString()}] [page] All messages generated. Total: ${Object.keys(messages).length}`);
  };

  const handleMessageChange = (profileId: string, newMessage: string) => {
    // Find the profile in the profiles array
    const index = profiles.findIndex(p => p.profile.id === profileId);
    if (index !== -1) {
      const uniqueId = `${profileId}-${index}`;
      setGeneratedMessages(prev => ({
        ...prev,
        [uniqueId]: newMessage
      }));
    } else {
      // Fallback to the old ID format if profile not found
      setGeneratedMessages(prev => ({
        ...prev,
        [profileId]: newMessage
      }));
    }
  };

  const handleRegenerateMessage = async (profileId: string) => {
    // Find the profile and its index
    const profileIndex = profiles.findIndex(p => p.profile.id === profileId);
    if (profileIndex === -1) return;
    
    const profile = profiles[profileIndex];
    const uniqueId = `${profileId}-${profileIndex}`;
    
    const regenerateStartTime = performance.now();
    console.log(`[${new Date().toISOString()}] [page] Regenerating message for ${profile.profile.name}`);
    
    try {
      // Show loading state for this message
      setGeneratedMessages(prev => ({
        ...prev,
        [uniqueId]: "Regenerating message..."
      }));
      
      // Get latest user profile data
      const latestProfile = getUserProfileFromStorage();
      
      // Generate a new message
      const messageResponse = await fetch('/api/generate-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile: latestProfile,
          userObjective: prompt,
          selectedProfiles: [profile],
          bulkGenerate: false
        }),
      });
      
      const messageData = await messageResponse.json();
      const regenerateEndTime = performance.now();
      
      if (messageData.success && messageData.results) {
        console.log(`[${new Date().toISOString()}] [page] Message regenerated successfully in ${(regenerateEndTime - regenerateStartTime).toFixed(2)}ms`);
        setGeneratedMessages(prev => ({
          ...prev,
          [uniqueId]: messageData.results.message
        }));
      } else {
        throw new Error(messageData.error || "Failed to regenerate message");
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] [page] Error regenerating message:`, error);
      setGeneratedMessages(prev => ({
        ...prev,
        [uniqueId]: "Error regenerating message. Please try again."
      }));
    }
  };

  const handleSendAllMessages = async () => {
    try {
      if (messages.length === 0) {
        throw new Error("No messages to send");
      }
      
      setIsSendingMessages(true);
      
      // Directly call the runLinkedInOutreach function from stagehand/main
      const success = await runLinkedInOutreach(messages);
      
      if (success) {
        alert("Messages sent successfully!");
      } else {
        throw new Error("Failed to send messages");
      }
    } catch (error) {
      console.error("Error sending messages:", error);
      alert("Error sending messages: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSendingMessages(false);
    }
  };

  const handleEmailAllMessages = async () => {
    try {
      if (messages.length === 0) {
        throw new Error("No messages to email");
      }
      
      setIsEmailingMessages(true);
      
      // Call the runGmailOutreach function from stagehand/main
      const success = await runGmailOutreach(messages);
      
      if (success) {
        alert("Emails drafted successfully!");
      } else {
        throw new Error("Failed to create email drafts");
      }
    } catch (error) {
      console.error("Error creating email drafts:", error);
      alert("Error creating email drafts: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsEmailingMessages(false);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${showBackground ? 'bg-gradient-to-t from-yellow-950/70 via-yellow-950/20 to-white' : 'bg-white'}`}>
      <Navigation />

      {/* Main Content */}
      <div className="pt-12 px-4 sm:px-6 md:px-8 pb-20">
        <div className="w-full max-w-2xl mx-auto space-y-12" ref={scope}>
          <div className="relative">
            {/* Bubbles Container */}
            {isMounted && (
              <div 
                className="bubbles-container absolute inset-0 bottom-0 top-0 opacity-0 pointer-events-none overflow-hidden"
                style={{ 
                  zIndex: 0,
                  height: '350%', 
                  width: '140%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  top: '-150%'
                }}
              >
                {bubbles.map((bubble, index) => (
                  <div
                    key={bubble.id}
                    className="brewing-bubble absolute bottom-0 rounded-full"
                    style={{
                      left: index < 15 ? `${15 + (index * 5)}%` : `${bubble.left}%`,
                      width: `${bubble.size}px`,
                      height: `${bubble.size}px`,
                      animationDuration: `${bubble.duration}s, ${bubble.duration}s`,
                      animationDelay: `${index * 0.3}s`
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Title with higher z-index to ensure it's above bubbles */}
            <h1 className="text-5xl font-bold text-center tracking-tight relative" style={{ zIndex: 1 }}>
              <motion.span 
                className="brew-container text-primary inline-block"
                initial={{ opacity: 0, y: 15 }}
              >
                BREW
              </motion.span>
              <motion.span className="rest-of-text inline-block" initial={{ opacity: 0, y: 15 }}> up your first conversation...</motion.span>
            </h1>
          </div>
          
          <motion.p className="subtitle text-center text-medium text-xl text-muted-foreground relative" style={{ zIndex: 1 }} initial={{ opacity: 0, y: 15 }}>
            Find and connect with anybody, your way
          </motion.p>
          
          <SearchForm 
            prompt={prompt}
            setPrompt={setPrompt}
            limit={limit}
            setLimit={setLimit}
            alumniOnly={alumniOnly}
            setAlumniOnly={setAlumniOnly}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            isSearching={isSearching}
          />
          
          {/* Loading Animation */}
          {isLoading && (
            <div className="flex justify-center mt-6 w-full">
              <div className="relative w-[500px] h-[500px] -mt-30">
                <Image
                  src="/Loading Animation.gif"
                  alt="Loading Animation"
                  fill
                  className="object-contain"
                  priority
                  unoptimized={true}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* LinkedIn Profiles Section */}
        <ProfilesSection profiles={profiles} limit={limit} />
        
        {/* Generated Messages Section */}
        <MessagesSection 
          profiles={profiles}
          limit={limit}
          generatedMessages={generatedMessages}
          onMessageChange={handleMessageChange}
          onRegenerateMessage={handleRegenerateMessage}
          onSendAll={handleSendAllMessages}
          onEmailAll={handleEmailAllMessages}
          isSendingMessages={isSendingMessages}
          isEmailingMessages={isEmailingMessages}
        />
      </div>
    </div>
  );
}
