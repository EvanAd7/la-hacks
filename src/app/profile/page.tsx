"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function ProfilePage() {
  const [university, setUniversity] = useState("");
  const [linkedInConnected, setLinkedInConnected] = useState(false);

  const universities = [
    "UC Berkeley",
    "UCLA",
    "Stanford",
    "Harvard",
    "MIT",
    "Caltech",
    "USC",
    "UCSD",
    "UC Davis",
    "UC Irvine"
  ];

  const handleLinkedInSignIn = () => {
    // This would be replaced with actual LinkedIn OAuth logic
    setLinkedInConnected(true);
  };

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
                <Select value={university} onValueChange={setUniversity}>
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
                <Input placeholder="Your name" />
              </div>

              {/* Grade */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Grade / Year
                </label>
                <Select>
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
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Location
                </label>
                <Input placeholder="Your current location (e.g., Los Angeles, CA)" />
              </div>

              <Button className="w-full mt-4">Save Profile</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 