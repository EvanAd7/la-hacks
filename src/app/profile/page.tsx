"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  // State management for all profile fields
  const [profileData, setProfileData] = useState({
    university: "",
    fullName: "",
    gradeYear: "",
    clubs: "",
    societies: "",
    location: ""
  });
  const [linkedInConnected, setLinkedInConnected] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const universities = [
    "American University",
    "Baylor University",
    "Boston College",
    "Boston University",
    "Brandeis University",
    "Brown University",
    "California Institute of Technology (Caltech)",
    "Carnegie Mellon University",
    "Case Western Reserve University",
    "Chapman University",
    "Clemson University",
    "Colorado School of Mines",
    "Columbia University",
    "Cornell University",
    "Dartmouth College",
    "Drexel University",
    "Duke University",
    "Emory University",
    "Florida State University",
    "Fordham University",
    "George Washington University",
    "Georgetown University",
    "Gonzaga University",
    "Harvard University",
    "Indiana University Bloomington",
    "Johns Hopkins University",
    "Lehigh University",
    "Louisiana State University (LSU)",
    "Loyola Marymount University",
    "Marquette University",
    "Massachusetts Institute of Technology (MIT)",
    "Michigan State University",
    "New York University (NYU)",
    "Northeastern University",
    "Northwestern University",
    "Ohio State University",
    "Pennsylvania State University (Penn State)",
    "Pepperdine University",
    "Princeton University",
    "Purdue University",
    "Rensselaer Polytechnic Institute (RPI)",
    "Rice University",
    "Rutgers University–New Brunswick",
    "Santa Clara University",
    "Southern Methodist University (SMU)",
    "Stanford University",
    "Stevens Institute of Technology",
    "Syracuse University",
    "Texas A&M University",
    "Texas Christian University (TCU)",
    "Tufts University",
    "Tulane University",
    "University of Alabama",
    "University of Arizona",
    "University of Arkansas",
    "University of California, Berkeley (UC Berkeley)",
    "University of California, Davis",
    "University of California, Irvine (UCI)",
    "University of California, Los Angeles (UCLA)",
    "University of California, San Diego (UCSD)",
    "University of California, Santa Barbara (UCSB)",
    "University of Chicago",
    "University of Colorado Boulder",
    "University of Connecticut (UConn)",
    "University of Delaware",
    "University of Denver",
    "University of Florida",
    "University of Georgia",
    "University of Illinois Urbana-Champaign (UIUC)",
    "University of Iowa",
    "University of Kansas",
    "University of Kentucky",
    "University of Maryland, College Park",
    "University of Massachusetts Amherst",
    "University of Miami",
    "University of Michigan, Ann Arbor",
    "University of Minnesota, Twin Cities",
    "University of Missouri",
    "University of Nebraska–Lincoln",
    "University of North Carolina at Chapel Hill (UNC)",
    "University of Notre Dame",
    "University of Oklahoma",
    "University of Oregon",
    "University of Pennsylvania",
    "University of Pittsburgh",
    "University of Rochester",
    "University of San Diego",
    "University of South Carolina",
    "University of Southern California (USC)",
    "University of Tennessee, Knoxville",
    "University of Texas at Austin",
    "University of Vermont",
    "University of Virginia (UVA)",
    "University of Washington, Seattle",
    "University of Wisconsin–Madison",
    "Vanderbilt University",
    "Villanova University",
    "Wake Forest University",
    "Washington University in St. Louis",
    "Yale University"
  ];

  // Handle input changes for all fields
  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset saved state when any field changes
    if (isSaved) setIsSaved(false);
  };

  const handleLinkedInSignIn = () => {
    // This would be replaced with actual LinkedIn OAuth logic
    setLinkedInConnected(true);
  };
  
  // Handle LinkedIn data population
  const handlePopulateFromLinkedIn = () => {
    // This would be replaced with actual data from LinkedIn API
    // For now, just populate with sample data
    setProfileData({
      university: "University of Southern California (USC)",
      fullName: "LinkedIn User",
      gradeYear: "senior",
      clubs: "Tech Club\nProgramming Club",
      societies: "Honor Society",
      location: "Los Angeles, CA"
    });
    
    // Reset saved state
    setIsSaved(false);
  };

  // Save profile data to localStorage (or it could be sent to a server)
  const saveProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profileData));
    setIsSaved(true);
  };
  
  // Load profile data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        setProfileData(JSON.parse(savedProfile));
      } catch (error) {
        console.error("Error parsing saved profile:", error);
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Minimalistic Navbar */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="w-full grid grid-cols-2 divide-x divide-border/30">
          <Link 
            href="/" 
            className="py-5 text-center text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/30 transition-colors"
          >
            Send
          </Link>
          <Link 
            href="/profile" 
            className="py-5 text-center text-sm font-medium text-primary hover:bg-muted/30 transition-colors"
          >
            Profile
          </Link>
        </div>
      </nav>

      {/* Profile Page Content */}
      <div className="flex items-center justify-center flex-1 p-6">
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl">
          {/* LinkedIn Import Card */}
          <div className="md:w-1/3">
            <Card className="h-full border-border/50 shadow-sm bg-muted/50">
              <CardContent className="flex flex-col justify-center items-center h-full p-6">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">Import from LinkedIn</h3>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  Automatically fill your profile information using your LinkedIn account
                </p>
                
                <div className="space-y-3 w-full">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                    onClick={handleLinkedInSignIn}
                  >
                    {linkedInConnected ? "Connected to LinkedIn" : "Sign in to LinkedIn"}
                  </Button>
                  
                  <Button 
                    className="w-full" 
                    variant="outline"
                    disabled={!linkedInConnected}
                    onClick={handlePopulateFromLinkedIn}
                  >
                    Populate with LinkedIn
                  </Button>
                </div>
                
                {linkedInConnected && (
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    Your LinkedIn account is connected. Click above to import your data.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        
          {/* Profile Form Card */}
          <Card className="md:w-2/3 border-border/50 shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Your Profile</CardTitle>
              <CardDescription>
                Customize your profile to help create personalized cold emails
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* University Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  University
                </label>
                <Select 
                  value={profileData.university} 
                  onValueChange={(value) => handleInputChange("university", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your university" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((uni) => (
                      <SelectItem key={uni} value={uni}>
                        {uni}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Full Name
                </label>
                <Input 
                  placeholder="Your name" 
                  value={profileData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                />
              </div>

              {/* Grade */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Grade / Year
                </label>
                <Select 
                  value={profileData.gradeYear}
                  onValueChange={(value) => handleInputChange("gradeYear", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freshman">Freshman</SelectItem>
                    <SelectItem value="sophomore">Sophomore</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="graduate">Graduate Student</SelectItem>
                    <SelectItem value="alumni">Alumni</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="my-2" />

              {/* University Clubs */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  University Clubs
                </label>
                <Textarea 
                  placeholder="List the clubs you're involved with (e.g., Computer Science Club, Chess Club)"
                  className="min-h-[80px] resize-none"
                  value={profileData.clubs}
                  onChange={(e) => handleInputChange("clubs", e.target.value)}
                />
              </div>

              {/* University Societies */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  University Societies
                </label>
                <Textarea 
                  placeholder="List the societies you're a part of (e.g., Honor Society, Professional Fraternities)"
                  className="min-h-[80px] resize-none"
                  value={profileData.societies}
                  onChange={(e) => handleInputChange("societies", e.target.value)}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Location
                </label>
                <Input 
                  placeholder="Your current location (e.g., Los Angeles, CA)" 
                  value={profileData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>

              <Button 
                className="w-full mt-4" 
                onClick={saveProfile}
              >
                {isSaved ? "Profile Saved ✓" : "Save Profile"}
              </Button>
              
              {isSaved && (
                <p className="text-sm text-green-600 text-center mt-2">
                  Your profile has been saved successfully!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 