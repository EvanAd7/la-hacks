"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { searchUsers } from "@/services/linkd-api";
import { generateOutreachMessage } from "@/services/message-generator";

// Define types for the API response
interface ProfileType {
  id: string;
  name: string;
  location: string;
  headline: string;
  description: string;
  title: string;
  profile_picture_url: string;
  linkedin_url: string;
}

interface ExperienceType {
  title: string;
  company_name: string;
  start_date: string;
  end_date: string | null;
  description: string;
  location: string;
  company_logo: string;
}

interface EducationType {
  degree: string;
  field_of_study: string;
  school_name: string;
  start_date: string;
  end_date: string;
  description: string;
  school_logo: string;
}

interface ProfileResultType {
  profile: ProfileType;
  experience: ExperienceType[];
  education: EducationType[];
}

interface ApiResponseType {
  results: ProfileResultType[];
  total: number;
  query: string;
  error: string | null;
}

// Add interface for messages object
interface MessageEntry {
  linkedURL: string;
  coldMessage: string;
}

interface MessagesObject {
  [key: string]: MessageEntry;
}

// Sample data to simulate API response
const sampleData: ApiResponseType = {
  "results": [
    {
      "profile": {
        "id": "p12345",
        "name": "Jane Smith",
        "location": "San Francisco, CA",
        "headline": "Senior Software Engineer",
        "description": "Experienced software engineer with 8+ years in full-stack development",
        "title": "Senior Software Engineer at TechCorp",
        "profile_picture_url": "https://i.pravatar.cc/150?img=1",
        "linkedin_url": "https://linkedin.com/in/janesmith"
      },
      "experience": [
        {
          "title": "Senior Software Engineer",
          "company_name": "TechCorp",
          "start_date": "2020-01-15",
          "end_date": null,
          "description": "Leading development of cloud-based solutions",
          "location": "San Francisco, CA",
          "company_logo": "https://example.com/logos/techcorp.png"
        },
        {
          "title": "Software Engineer",
          "company_name": "InnovateTech",
          "start_date": "2016-03-01",
          "end_date": "2019-12-31",
          "description": "Developed web applications using React and Node.js",
          "location": "Seattle, WA",
          "company_logo": "https://example.com/logos/innovatetech.png"
        }
      ],
      "education": [
        {
          "degree": "Master of Science",
          "field_of_study": "Computer Science",
          "school_name": "Stanford University",
          "start_date": "2014-09-01",
          "end_date": "2016-06-30",
          "description": "Focus on distributed systems and machine learning",
          "school_logo": "https://example.com/logos/stanford.png"
        },
        {
          "degree": "Bachelor of Science",
          "field_of_study": "Computer Engineering",
          "school_name": "UC Berkeley",
          "start_date": "2010-09-01",
          "end_date": "2014-05-30",
          "description": "Member of ACM student chapter",
          "school_logo": "https://example.com/logos/berkeley.png"
        }
      ]
    },
    {
      "profile": {
        "id": "p67890",
        "name": "John Doe",
        "location": "Boston, MA",
        "headline": "Machine Learning Engineer",
        "description": "ML engineer with focus on NLP and computer vision",
        "title": "ML Engineer at AI Solutions",
        "profile_picture_url": "https://i.pravatar.cc/150?img=2",
        "linkedin_url": "https://linkedin.com/in/johndoe"
      },
      "experience": [
        {
          "title": "Machine Learning Engineer",
          "company_name": "AI Solutions",
          "start_date": "2019-05-10",
          "end_date": null,
          "description": "Building ML models for enterprise clients",
          "location": "Boston, MA",
          "company_logo": "https://example.com/logos/aisolutions.png"
        }
      ],
      "education": [
        {
          "degree": "PhD",
          "field_of_study": "Computer Science",
          "school_name": "MIT",
          "start_date": "2016-09-01",
          "end_date": "2019-05-01",
          "description": "Thesis on deep learning for natural language processing",
          "school_logo": "https://example.com/logos/mit.png"
        }
      ]
    },
    {
      "profile": {
        "id": "p24680",
        "name": "Emily Johnson",
        "location": "Austin, TX",
        "headline": "Product Manager",
        "description": "Product manager with focus on user-centered design",
        "title": "Senior Product Manager at Tech Innovations",
        "profile_picture_url": "https://i.pravatar.cc/150?img=3",
        "linkedin_url": "https://linkedin.com/in/emilyjohnson"
      },
      "experience": [
        {
          "title": "Senior Product Manager",
          "company_name": "Tech Innovations",
          "start_date": "2018-06-01",
          "end_date": null,
          "description": "Leading product strategy for consumer applications",
          "location": "Austin, TX",
          "company_logo": "https://example.com/logos/techinnovations.png"
        }
      ],
      "education": [
        {
          "degree": "MBA",
          "field_of_study": "Business Administration",
          "school_name": "University of Texas",
          "start_date": "2016-09-01",
          "end_date": "2018-05-30",
          "description": "Specialization in technology management",
          "school_logo": "https://example.com/logos/ut.png"
        }
      ]
    }
  ],
  "total": 3,
  "query": "technology professionals with leadership experience",
  "error": null
};

// Sample email templates
const generateEmailTemplate = (profileData: ProfileResultType): string => {
  const { profile, experience, education } = profileData;
  const company = experience && experience.length > 0 ? experience[0].company_name : "your current company";
  const school = education && education.length > 0 ? education[0].school_name : "your university";
  
  return `Dear ${profile.name},

I found your profile on LinkedIn and I'm impressed by your experience as a ${profile.headline}. I noticed you previously worked at ${company} and studied at ${school}.

I'm a fellow ${school} alum looking to connect with experienced professionals in the field. Would you be open to a brief 15-minute coffee chat to discuss your career journey?

Best regards,
[Your Name]`;
};

// Define a function to get user profile from localStorage
const getUserProfileFromStorage = () => {
  if (typeof window !== 'undefined') {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
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
          gradeYear: profileData.gradeYear || "Senior",
          clubs: clubs,
          societies: societies,
          location: profileData.location || "Los Angeles"
        };
      } catch (error) {
        console.error("Error parsing saved profile:", error);
      }
    }
  }
  
  // Return default profile if no saved profile exists or there was an error
  return {
    universityName: "USC",
    fullName: "Student",
    gradeYear: "Senior",
    clubs: ["Student Organization"],
    societies: ["Honor Society"],
    location: "Los Angeles"
  };
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeneratingEmails, setIsGeneratingEmails] = useState(false);
  const [profiles, setProfiles] = useState<ProfileResultType[]>([]);
  const [generatedEmails, setGeneratedEmails] = useState<Record<string, string>>({});
  const [limit, setLimit] = useState<string>("5");
  const [searchQuery, setSearchQuery] = useState("");
  const [userProfile, setUserProfile] = useState(getUserProfileFromStorage());
  const [messages, setMessages] = useState<MessagesObject>({});
  const [emailSent, setEmailSent] = useState<Record<string, boolean>>({});
  
  // Load saved state from localStorage when component mounts
  useEffect(() => {
    setUserProfile(getUserProfileFromStorage());
    
    // Try to load saved state from localStorage
    try {
      const savedPrompt = localStorage.getItem('savedPrompt');
      if (savedPrompt) setPrompt(savedPrompt);
      
      const savedLimit = localStorage.getItem('savedLimit');
      if (savedLimit) setLimit(savedLimit);
      
      const savedProfiles = localStorage.getItem('savedProfiles');
      if (savedProfiles) {
        const parsedProfiles = JSON.parse(savedProfiles);
        setProfiles(parsedProfiles);
      }
      
      const savedEmails = localStorage.getItem('savedEmails');
      if (savedEmails) {
        const parsedEmails = JSON.parse(savedEmails);
        setGeneratedEmails(parsedEmails);
      }
      
      const savedQuery = localStorage.getItem('savedQuery');
      if (savedQuery) setSearchQuery(savedQuery);
      
      // Load saved messages object
      const savedMessages = localStorage.getItem('savedMessages');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      }
      
      // Load sent status
      const savedSentStatus = localStorage.getItem('emailSentStatus');
      if (savedSentStatus) {
        const parsedSentStatus = JSON.parse(savedSentStatus);
        setEmailSent(parsedSentStatus);
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
  }, []);
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    // Don't save during loading states
    if (isLoading || isSearching || isGeneratingEmails) return;
    
    // Save current state to localStorage
    try {
      localStorage.setItem('savedPrompt', prompt);
      localStorage.setItem('savedLimit', limit);
      
      if (profiles.length > 0) {
        localStorage.setItem('savedProfiles', JSON.stringify(profiles));
      }
      
      if (Object.keys(generatedEmails).length > 0) {
        localStorage.setItem('savedEmails', JSON.stringify(generatedEmails));
      }
      
      if (searchQuery) {
        localStorage.setItem('savedQuery', searchQuery);
      }
      
      // Save messages object
      if (Object.keys(messages).length > 0) {
        localStorage.setItem('savedMessages', JSON.stringify(messages));
      }
      
      // Save sent status
      if (Object.keys(emailSent).length > 0) {
        localStorage.setItem('emailSentStatus', JSON.stringify(emailSent));
      }
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }, [
    prompt, 
    limit, 
    profiles, 
    generatedEmails, 
    searchQuery, 
    isLoading,
    isSearching,
    isGeneratingEmails,
    messages,
    emailSent
  ]);
  
  // Clear saved state
  const clearSavedState = () => {
    localStorage.removeItem('savedPrompt');
    localStorage.removeItem('savedLimit');
    localStorage.removeItem('savedProfiles');
    localStorage.removeItem('savedEmails');
    localStorage.removeItem('savedQuery');
    localStorage.removeItem('savedMessages');
    localStorage.removeItem('emailSentStatus');
    
    setPrompt("");
    setProfiles([]);
    setGeneratedEmails({});
    setSearchQuery("");
    setLimit("5");
    setMessages({});
    setEmailSent({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSearching(true);
    
    try {
      // Update user profile one more time to ensure latest data
      const latestProfile = getUserProfileFromStorage();
      setUserProfile(latestProfile);
      
      // 1. First generate a search query using Gemini API
      const queryResponse = await fetch('/api/gemini-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile: latestProfile,
          userObjective: prompt // Use the user's prompt as the objective
        }),
      });
      
      const queryData = await queryResponse.json();
      
      if (!queryData.success) {
        throw new Error(queryData.error || 'Failed to generate search query');
      }
      
      const generatedQuery = queryData.text;
      setSearchQuery(generatedQuery);
      
      // 2. Use the generated query to search LinkedIn profiles
      const searchResponse = await fetch('/api/linkd-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile: latestProfile,
          userObjective: prompt,
          limit: parseInt(limit) * 2, // Request more profiles than needed to ensure we meet the limit
          generatedQuery: generatedQuery
        }),
      });
      
      const searchData = await searchResponse.json();
      
      if (searchData.error) {
        throw new Error(searchData.error);
      }
      
      // 3. Set the profiles from the search results
      if (searchData.results && searchData.results.length < parseInt(limit)) {
        // If we didn't get enough results, try to search with a more generic query
        console.log(`Only found ${searchData.results.length} profiles, attempting to find more...`);
        
        // Make a second search with a more generic query
        const backupSearchResponse = await fetch('/api/linkd-search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userProfile: latestProfile,
            userObjective: prompt,
            limit: parseInt(limit) * 3, // Request even more results
            generatedQuery: generatedQuery + " OR " + latestProfile.universityName + " alumni" // Add more generic terms
          }),
        });
        
        const backupSearchData = await backupSearchResponse.json();
        
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
          
          setProfiles(allProfiles);
          setIsSearching(false);
          
          // Start generating emails for all found profiles
          setIsGeneratingEmails(true);
          if (allProfiles.length > 0) {
            await generateEmailsForProfiles(allProfiles.slice(0, parseInt(limit)));
          }
        } else {
          // Use original results if backup search failed
          setProfiles(searchData.results || []);
          setIsSearching(false);
          
          // Start generating emails
          setIsGeneratingEmails(true);
          const foundProfiles = searchData.results || [];
          if (foundProfiles.length > 0) {
            await generateEmailsForProfiles(foundProfiles);
          }
        }
      } else {
        // We got enough results, use them
        setProfiles(searchData.results || []);
        setIsSearching(false);
        
        // Start generating emails
        setIsGeneratingEmails(true);
        const foundProfiles = searchData.results || [];
        if (foundProfiles.length > 0) {
          await generateEmailsForProfiles(foundProfiles.slice(0, parseInt(limit)));
        }
      }
    } catch (error) {
      console.error("Error:", error);
      // Show error as a profile with error message
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
      setIsLoading(false);
      setIsSearching(false);
      setIsGeneratingEmails(false);
    }
  };

  const generateEmailsForProfiles = async (profilesData: ProfileResultType[]) => {
    // Process profiles in sequence to avoid rate limits
    const emails: Record<string, string> = {};
    
    // Get latest user profile data
    const latestProfile = getUserProfileFromStorage();
    
    for (const profile of profilesData) {
      try {
        // Set placeholder first
        emails[profile.profile.id] = "Generating personalized email...";
        setGeneratedEmails(prev => ({
          ...prev,
          [profile.profile.id]: "Generating personalized email..."
        }));
        
        // Generate email for this profile
        const emailResponse = await fetch('/api/generate-messages', {
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
        
        const emailData = await emailResponse.json();
        
        if (emailData.success && emailData.results) {
          emails[profile.profile.id] = emailData.results.message;
          // Update one by one to prevent full refresh
          setGeneratedEmails(prev => ({
            ...prev,
            [profile.profile.id]: emailData.results.message
          }));
        } else {
          emails[profile.profile.id] = "Failed to generate a personalized email.";
          setGeneratedEmails(prev => ({
            ...prev,
            [profile.profile.id]: "Failed to generate a personalized email."
          }));
        }
      } catch (error) {
        console.error("Error generating email:", error);
        emails[profile.profile.id] = "Error generating email.";
        setGeneratedEmails(prev => ({
          ...prev,
          [profile.profile.id]: "Error generating email."
        }));
      }
    }
  };

  const handleEmailChange = (profileId: string, newEmail: string) => {
    setGeneratedEmails(prev => ({
      ...prev,
      [profileId]: newEmail
    }));
  };

  const handleRegenerateEmail = async (profileId: string) => {
    const profile = profiles.find(p => p.profile.id === profileId);
    if (!profile) return;
    
    try {
      // Show loading state for this email
      setGeneratedEmails(prev => ({
        ...prev,
        [profileId]: "Regenerating email..."
      }));
      
      // Get latest user profile data
      const latestProfile = getUserProfileFromStorage();
      
      // Generate a new email
      const emailResponse = await fetch('/api/generate-messages', {
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
      
      const emailData = await emailResponse.json();
      
      if (emailData.success && emailData.results) {
        setGeneratedEmails(prev => ({
          ...prev,
          [profileId]: emailData.results.message
        }));
      } else {
        throw new Error(emailData.error || "Failed to regenerate email");
      }
    } catch (error) {
      console.error("Error regenerating email:", error);
      setGeneratedEmails(prev => ({
        ...prev,
        [profileId]: "Error regenerating email. Please try again."
      }));
    }
  };

  // Function to handle sending an email
  const handleSendEmail = (profileId: string) => {
    const profile = profiles.find(p => p.profile.id === profileId);
    if (!profile) return;
    
    // Get the current message from the textarea
    const currentMessage = generatedEmails[profileId] || "";
    
    // Update the messages object with the structure required
    setMessages(prev => ({
      ...prev,
      [profileId]: {
        linkedURL: profile.profile.linkedin_url || "",
        coldMessage: currentMessage
      }
    }));
    
    // Mark as sent
    setEmailSent(prev => ({
      ...prev,
      [profileId]: true
    }));
    
    // Optional: Show success notification or UI change
    console.log(`Email to ${profile.profile.name} has been sent`);
    console.log("Updated messages object:", {
      ...messages,
      [profileId]: {
        linkedURL: profile.profile.linkedin_url || "",
        coldMessage: currentMessage
      }
    });
  };

  // Function to handle sending all emails at once
  const handleSendAllEmails = () => {
    if (profiles.length === 0) return;
    
    const updatedMessages: MessagesObject = { ...messages };
    const updatedSentStatus: Record<string, boolean> = { ...emailSent };
    
    // Process each profile
    profiles.forEach(profile => {
      const profileId = profile.profile.id;
      const currentMessage = generatedEmails[profileId] || "";
      
      // Skip if already sent
      if (emailSent[profileId]) return;
      
      // Update the messages object
      updatedMessages[profileId] = {
        linkedURL: profile.profile.linkedin_url || "",
        coldMessage: currentMessage
      };
      
      // Mark as sent
      updatedSentStatus[profileId] = true;
    });
    
    // Update state
    setMessages(updatedMessages);
    setEmailSent(updatedSentStatus);
    
    // Log the updated messages object
    console.log("All emails sent, updated messages object:", updatedMessages);
  };

  const displayedProfiles = profiles.slice(0, parseInt(limit));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Minimalistic Navbar */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="w-full grid grid-cols-2 divide-x divide-border/30">
          <Link 
            href="/" 
            className="py-5 text-center text-sm font-medium text-primary hover:bg-muted/30 transition-colors"
          >
            Send
          </Link>
          <Link 
            href="/profile" 
            className="py-5 text-center text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/30 transition-colors"
          >
            Profile
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-12 px-4 sm:px-6 md:px-8 pb-20">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-center">Alumni Connect</h1>
          <p className="text-center text-muted-foreground">
            Find and connect with alumni from your school
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <Input
                placeholder="I want to cold email alumni from my school who work in FAANG about setting up a coffee chat..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-24 py-2 px-3 resize-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  isSearching ? "Searching profiles..." : "Generating emails..."
                ) : "Generate Emails"}
              </Button>
              <div className="w-32">
                <Select value={limit} onValueChange={setLimit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Results</SelectItem>
                    <SelectItem value="10">10 Results</SelectItem>
                    <SelectItem value="20">20 Results</SelectItem>
                    <SelectItem value="30">30 Results</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(profiles.length > 0 || Object.keys(generatedEmails).length > 0) && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={clearSavedState}
                  className="shrink-0"
                >
                  Clear
                </Button>
              )}
            </div>
          </form>
        </div>
        
        {/* LinkedIn Profiles Section */}
        {profiles.length > 0 && (
          <div className="w-full max-w-4xl mx-auto mt-12 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Found LinkedIn Profiles</h2>
              <p className="text-muted-foreground mt-2">
                Select a profile to view the generated email
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedProfiles.map((result) => (
                <Card key={result.profile.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={result.profile.profile_picture_url} />
                        <AvatarFallback>{result.profile.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{result.profile.name}</CardTitle>
                        <CardDescription className="text-xs line-clamp-1">
                          {result.profile.headline}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p className="font-medium text-xs">{result.profile.title}</p>
                    
                    {result.education && result.education.length > 0 && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {result.education[0].degree} in {result.education[0].field_of_study}, {result.education[0].school_name}
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      {result.profile.location}
                    </p>
                    
                    <a 
                      href={result.profile.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center mt-2"
                    >
                      View LinkedIn Profile
                      <svg className="h-3 w-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5z" />
                      </svg>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* Results Section */}
        {profiles.length > 0 && (
          <div className="w-full max-w-4xl mx-auto mt-16 space-y-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Generated Emails</h2>
              <p className="text-muted-foreground mt-2">
                Here are the personalized emails for each contact
              </p>
              
              {/* Send All Emails Button */}
              <div className="mt-4">
                <Button 
                  onClick={handleSendAllEmails}
                  className="mx-auto"
                  disabled={profiles.length === 0 || profiles.every(p => emailSent[p.profile.id])}
                >
                  Send All Emails
                </Button>
              </div>
            </div>
            
            <div className="space-y-8">
              {displayedProfiles.map((result) => (
                <Card key={result.profile.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Profile Info */}
                    <div className="md:w-1/3 p-6 bg-muted/30 border-r border-border/30">
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={result.profile.profile_picture_url} />
                          <AvatarFallback>{result.profile.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-lg">{result.profile.name}</h3>
                          <p className="text-sm text-muted-foreground">{result.profile.headline}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium block">Current:</span>
                          <span>{result.profile.title}</span>
                        </div>
                        
                        {result.experience && result.experience.length > 0 && (
                          <div>
                            <span className="font-medium block">Experience:</span>
                            <ul className="list-disc pl-4 space-y-1">
                              {result.experience.map((exp, idx) => (
                                <li key={idx}>
                                  {exp.title} at {exp.company_name}
                                </li>
                              )).slice(0, 2)}
                            </ul>
                          </div>
                        )}
                        
                        {result.education && result.education.length > 0 && (
                          <div>
                            <span className="font-medium block">Education:</span>
                            <ul className="list-disc pl-4 space-y-1">
                              {result.education.map((edu, idx) => (
                                <li key={idx}>
                                  {edu.degree} in {edu.field_of_study}, {edu.school_name}
                                </li>
                              )).slice(0, 2)}
                            </ul>
                          </div>
                        )}
                        
                        <div>
                          <span className="font-medium block">Location:</span>
                          <span>{result.profile.location}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <a 
                          href={result.profile.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          View LinkedIn Profile
                          <svg className="h-4 w-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                    
                    {/* Email Content */}
                    <div className="md:w-2/3 p-6">
                      <h3 className="font-semibold mb-4">Personalized Email</h3>
                      <Textarea 
                        className="min-h-[300px] font-mono text-sm"
                        value={generatedEmails[result.profile.id] || ''}
                        onChange={(e) => handleEmailChange(result.profile.id, e.target.value)}
                      />
                      <div className="flex justify-end mt-4 space-x-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRegenerateEmail(result.profile.id)}
                        >
                          Regenerate
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleSendEmail(result.profile.id)}
                          disabled={emailSent[result.profile.id]}
                        >
                          {emailSent[result.profile.id] ? "Email Sent ✓" : "Send Email"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
