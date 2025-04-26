"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { SearchForm } from "@/components/search-form";
import { ProfilesSection } from "@/components/profiles-section";
import { MessagesSection } from "@/components/messages-section";
import { UserResult } from "@/services/linkd-api";
import { OutreachMessage, runLinkedInOutreach } from "@/app/stagehand/main";

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
  const [profiles, setProfiles] = useState<UserResult[]>([]);
  const [generatedMessages, setGeneratedMessages] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<OutreachMessage[]>([]);
  const [limit, setLimit] = useState<string>("5");
  const [searchQuery, setSearchQuery] = useState("");
  const [userProfile, setUserProfile] = useState(getUserProfileFromStorage());
  const [alumniOnly, setAlumniOnly] = useState<boolean>(true);

  // Load user profile from localStorage when component mounts
  useEffect(() => {
    setUserProfile(getUserProfileFromStorage());
  }, []);

  // Update messages whenever generatedMessages or profiles change
  useEffect(() => {
    // Only update when we have both profiles and messages
    if (profiles.length > 0 && Object.keys(generatedMessages).length > 0) {
      const newMessages = profiles
        .filter(profile => generatedMessages[profile.profile.id] && profile.profile.linkedin_url)
        .map(profile => ({
          linkedinUrl: profile.profile.linkedin_url || "",
          body: generatedMessages[profile.profile.id] || ""
        }));
      
      setMessages(newMessages);
    }
  }, [profiles, generatedMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      // 3. Check for sufficient results
      if (searchData.results && searchData.results.length < parseInt(limit)) {
        // Try with a more generic query if we didn't get enough results
        console.log(`[${new Date().toISOString()}] [page] Only found ${searchData.results.length} profiles, attempting backup search...`);
        const backupSearchStartTime = performance.now();
        
        const backupQuery = generatedQuery + (alumniOnly ? ` OR ${latestProfile.universityName} alumni` : " OR professionals");
        
        const backupSearchResponse = await fetch('/api/linkd-search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userProfile: latestProfile,
            userObjective: prompt,
            limit: parseInt(limit) * 3,
            generatedQuery: backupQuery,
            alumniOnly: alumniOnly
          }),
        });
        
        const backupSearchData = await backupSearchResponse.json();
        
        const backupSearchEndTime = performance.now();
        console.log(`[${new Date().toISOString()}] [page] Backup search completed in ${(backupSearchEndTime - backupSearchStartTime).toFixed(2)}ms`);
        console.log(`[${new Date().toISOString()}] [page] Found ${backupSearchData.results ? backupSearchData.results.length : 0} profiles in backup search`);
        
        if (!backupSearchData.error && backupSearchData.results) {
          // Combine results, avoiding duplicates
          const allProfiles = [...searchData.results];
          const existingIds = new Set(allProfiles.map(p => p.profile.id));
          
          for (const profile of backupSearchData.results) {
            if (!existingIds.has(profile.profile.id)) {
              allProfiles.push(profile);
              existingIds.add(profile.profile.id);
            }
          }
          
          console.log(`[${new Date().toISOString()}] [page] Combined unique profiles: ${allProfiles.length}`);
          setProfiles(allProfiles);
          setIsSearching(false);
          
          // Start generating messages for all found profiles
          setIsGeneratingMessages(true);
          if (allProfiles.length > 0) {
            const profilesForMessages = allProfiles.slice(0, parseInt(limit));
            console.log(`[${new Date().toISOString()}] [page] Starting message generation for ${profilesForMessages.length} profiles`);
            await generateMessagesForProfiles(profilesForMessages);
          }
        } else {
          // Use original results if backup search failed
          console.log(`[${new Date().toISOString()}] [page] Backup search failed, using original ${searchData.results?.length || 0} profiles`);
          setProfiles(searchData.results || []);
          setIsSearching(false);
          
          // Start generating messages
          setIsGeneratingMessages(true);
          const foundProfiles = searchData.results || [];
          if (foundProfiles.length > 0) {
            console.log(`[${new Date().toISOString()}] [page] Starting message generation for ${foundProfiles.length} profiles`);
            await generateMessagesForProfiles(foundProfiles);
          }
        }
      } else {
        // We got enough results, use them
        console.log(`[${new Date().toISOString()}] [page] Found sufficient profiles (${searchData.results?.length || 0}), proceeding with message generation`);
        setProfiles(searchData.results || []);
        setIsSearching(false);
        
        // Start generating messages
        setIsGeneratingMessages(true);
        const foundProfiles = searchData.results || [];
        if (foundProfiles.length > 0) {
          const profilesForMessages = foundProfiles.slice(0, parseInt(limit));
          console.log(`[${new Date().toISOString()}] [page] Starting message generation for ${profilesForMessages.length} profiles`);
          await generateMessagesForProfiles(profilesForMessages);
        }
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
      
      try {
        // Set placeholder
        messages[profile.profile.id] = "Generating personalized message...";
        setGeneratedMessages(prev => ({
          ...prev,
          [profile.profile.id]: "Generating personalized message..."
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
          messages[profile.profile.id] = messageData.results.message;
          // Update one by one to prevent full refresh
          setGeneratedMessages(prev => ({
            ...prev,
            [profile.profile.id]: messageData.results.message
          }));
        } else {
          console.error(`[${new Date().toISOString()}] [page] Failed to generate message ${i+1}:`, messageData.error);
          messages[profile.profile.id] = "Failed to generate a personalized message.";
          setGeneratedMessages(prev => ({
            ...prev,
            [profile.profile.id]: "Failed to generate a personalized message."
          }));
        }
      } catch (error) {
        console.error(`[${new Date().toISOString()}] [page] Error generating message ${i+1}:`, error);
        messages[profile.profile.id] = "Error generating message.";
        setGeneratedMessages(prev => ({
          ...prev,
          [profile.profile.id]: "Error generating message."
        }));
      }
    }
    
    console.log(`[${new Date().toISOString()}] [page] All messages generated. Total: ${Object.keys(messages).length}`);
  };

  const handleMessageChange = (profileId: string, newMessage: string) => {
    setGeneratedMessages(prev => ({
      ...prev,
      [profileId]: newMessage
    }));
  };

  const handleRegenerateMessage = async (profileId: string) => {
    const profile = profiles.find(p => p.profile.id === profileId);
    if (!profile) return;
    
    const regenerateStartTime = performance.now();
    console.log(`[${new Date().toISOString()}] [page] Regenerating message for ${profile.profile.name}`);
    
    try {
      // Show loading state for this message
      setGeneratedMessages(prev => ({
        ...prev,
        [profileId]: "Regenerating message..."
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
          [profileId]: messageData.results.message
        }));
      } else {
        throw new Error(messageData.error || "Failed to regenerate message");
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] [page] Error regenerating message:`, error);
      setGeneratedMessages(prev => ({
        ...prev,
        [profileId]: "Error regenerating message. Please try again."
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navigation />

      {/* Main Content */}
      <div className="pt-12 px-4 sm:px-6 md:px-8 pb-20">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-center">Alumni Connect</h1>
          <p className="text-center text-muted-foreground">
            Find and connect with alumni from your school
          </p>
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
          isSendingMessages={isSendingMessages}
        />
      </div>
    </div>
  );
}
