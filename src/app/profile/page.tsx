"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";

export default function ProfilePage() {
  // State management for all profile fields
  const [profileData, setProfileData] = useState({
    university: "",
    fullName: "",
    year: "",
    major: "",
    clubs: "",
    societies: "",
    location: "",
    dreamCompany: ""
  });
  const [isSaved, setIsSaved] = useState(false);

  const universities = [
    "American University",
    "Baylor University",
    "Boston College",
    "Boston University",
    "Brandeis University",
    "Brown University",
    "Caltech",
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
    "Louisiana State University",
    "Loyola Marymount University",
    "Marquette University",
    "Massachusetts Institute of Technology",
    "Michigan State University",
    "New York University",
    "Northeastern University",
    "Northwestern University",
    "Ohio State University",
    "Pennsylvania State University",
    "Pepperdine University",
    "Princeton University",
    "Purdue University",
    "Rensselaer Polytechnic Institute",
    "Rice University",
    "Rutgers University",
    "Santa Clara University",
    "Southern Methodist University",
    "Stanford University",
    "Stevens Institute of Technology",
    "Syracuse University",
    "Texas A&M University",
    "Texas Christian University",
    "Tufts University",
    "Tulane University",
    "UC Berkeley",
    "UC Davis",
    "UCI",
    "UCLA",
    "UCSD",
    "UCSB",
    "University of Alabama",
    "University of Arizona",
    "University of Arkansas",
    "University of Chicago",
    "University of Colorado Boulder",
    "University of Connecticut",
    "University of Delaware",
    "University of Denver",
    "University of Florida",
    "University of Georgia",
    "University of Illinois Urbana-Champaign",
    "University of Iowa",
    "University of Kansas",
    "University of Kentucky",
    "University of Maryland, College Park",
    "University of Massachusetts Amherst",
    "University of Miami",
    "University of Michigan, Ann Arbor",
    "University of Minnesota, Twin Cities",
    "University of Missouri",
    "University of Nebraska",
    "University of North Carolina at Chapel Hill",
    "University of Notre Dame",
    "University of Oklahoma",
    "University of Oregon",
    "University of Pennsylvania",
    "University of Pittsburgh",
    "University of Rochester",
    "University of San Diego",
    "University of South Carolina",
    "University of Southern California",
    "University of Tennessee, Knoxville",
    "University of Texas at Austin",
    "University of Vermont",
    "University of Virginia",
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
      <Navigation />

      {/* Profile Page Content */}
      <div className="flex items-center justify-center flex-1 p-6">
        <div className="w-full max-w-4xl">
          {/* Profile Form Card */}
          <Card className="w-full border-border/50 shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Your Profile</CardTitle>
              <CardDescription>
                Customize your profile to help create personalized cold emails
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
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

              {/* Grade */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Year
                </label>
                <Select
                  value={profileData.year}
                  onValueChange={(value) => handleInputChange("year", value)}
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

              {/* Major */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Major
                </label>
                <Input
                  placeholder="Your field of study (e.g. Computer Science, Business Administration)"
                  value={profileData.major}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                />
              </div>

              <Separator className="my-2" />

              {/* University Clubs */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  University Clubs
                </label>
                <Textarea
                  placeholder="List the clubs you're involved with (e.g. Computer Science Club, Chess Club)"
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
                  placeholder="List the societies you're a part of (e.g. Honor Society, Professional Fraternities)"
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
                  placeholder="Your current location (e.g. Los Angeles, CA)"
                  value={profileData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>

              {/* Dream Company */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Dream Company
                </label>
                <Input
                  placeholder="Company you'd love to work for (e.g. Google, Microsoft, Deloitte)"
                  value={profileData.dreamCompany}
                  onChange={(e) => handleInputChange("dreamCompany", e.target.value)}
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