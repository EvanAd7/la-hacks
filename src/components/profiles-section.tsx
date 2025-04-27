import React from "react";
import { ProfileCard } from "@/components/profile-card";
import { UserResult } from "@/services/linkd-api";

interface ProfilesSectionProps {
  profiles: UserResult[];
  limit: string;
}

export function ProfilesSection({ profiles, limit }: ProfilesSectionProps) {
  const displayedProfiles = profiles.slice(0, parseInt(limit));

  if (profiles.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Found People</h2>
        <p className="text-muted-foreground mt-2">
          Scroll to view the generated outreach messages
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedProfiles.map((profile, index) => (
          <ProfileCard key={`${profile.profile.id}-${index}`} profile={profile} />
        ))}
      </div>
    </div>
  );
} 