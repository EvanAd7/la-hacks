import React from "react";
import { MessageCard } from "@/components/message-card";
import { UserResult } from "@/services/linkd-api";
import { Button } from "@/components/ui/button";

interface MessagesSectionProps {
  profiles: UserResult[];
  limit: string;
  generatedMessages: Record<string, string>;
  onMessageChange: (profileId: string, message: string) => void;
  onRegenerateMessage: (profileId: string) => Promise<void>;
  onSendAll: () => Promise<void>;
  isSendingMessages: boolean;
}

export function MessagesSection({
  profiles,
  limit,
  generatedMessages,
  onMessageChange,
  onRegenerateMessage,
  onSendAll,
  isSendingMessages,
}: MessagesSectionProps) {
  const displayedProfiles = profiles.slice(0, parseInt(limit));

  if (profiles.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 space-y-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Generated Outreach Messages</h2>
        <p className="text-muted-foreground mt-2">
          Here are the personalized messages for each contact
        </p>
        
        <div className="mt-4 flex items-center justify-center space-x-6">
          <Button 
            onClick={onSendAll} 
            disabled={isSendingMessages || profiles.length === 0}
            className="px-8 py-3 text-lg"
          >
            {isSendingMessages ? "Sending..." : "Send All Messages"}
          </Button>
        </div>
      </div>
      
      <div className="space-y-8">
        {displayedProfiles.map((profile) => (
          <MessageCard
            key={profile.profile.id}
            profile={profile}
            message={generatedMessages[profile.profile.id] || ""}
            onMessageChange={(message) => onMessageChange(profile.profile.id, message)}
            onRegenerateMessage={() => onRegenerateMessage(profile.profile.id)}
          />
        ))}
      </div>
    </div>
  );
} 