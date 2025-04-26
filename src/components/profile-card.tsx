import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserResult } from "@/services/linkd-api";

interface ProfileCardProps {
  profile: UserResult;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile.profile.profile_picture_url} />
            <AvatarFallback>
              {profile.profile.name.split(" ").map((n: string) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{profile.profile.name}</CardTitle>
            <CardDescription className="text-xs line-clamp-1">
              {profile.profile.headline}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="font-medium text-xs">{profile.profile.title}</p>
        
        {profile.education && profile.education.length > 0 && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {profile.education[0].degree} in {profile.education[0].field_of_study}, {profile.education[0].school_name}
          </p>
        )}
        
        <p className="text-xs text-muted-foreground">
          {profile.profile.location}
        </p>
        
        <a 
          href={profile.profile.linkedin_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline flex items-center mt-2"
        >
          View LinkedIn
          <svg className="h-3 w-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5z" />
          </svg>
        </a>
      </CardContent>
    </Card>
  );
} 