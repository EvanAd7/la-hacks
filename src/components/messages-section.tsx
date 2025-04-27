import React from "react";
import { MessageCard } from "@/components/message-card";
import { UserResult } from "@/services/linkd-api";
import { Button } from "@/components/ui/button";
import { Linkedin, Mail } from "lucide-react";

interface MessagesSectionProps {
  profiles: UserResult[];
  limit: string;
  generatedMessages: Record<string, string>;
  onMessageChange: (profileId: string, message: string) => void;
  onRegenerateMessage: (profileId: string) => Promise<void>;
  onSendAll: () => Promise<void>;
  onEmailAll: () => Promise<void>;
  isSendingMessages: boolean;
  isEmailingMessages: boolean;
}

export function MessagesSection({
  profiles,
  limit,
  generatedMessages,
  onMessageChange,
  onRegenerateMessage,
  onSendAll,
  onEmailAll,
  isSendingMessages,
  isEmailingMessages,
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
        
        <div className="mt-4 flex items-center justify-center space-x-4">
          <Button 
            onClick={onSendAll} 
            disabled={isSendingMessages || isEmailingMessages || profiles.length === 0}
            className="px-6 py-3 text-lg flex items-center gap-2"
          >
            <Linkedin size={20} />
            {isSendingMessages ? "Sending..." : "Send All Messages"}
          </Button>
          
          <Button 
            onClick={onEmailAll}
            disabled={isSendingMessages || isEmailingMessages || profiles.length === 0}
            className="px-6 py-3 text-lg flex items-center gap-2"
            variant="outline"
          >
            <Mail size={20} />
            {isEmailingMessages ? "Emailing..." : "Email All Messages"}
          </Button>
        </div>
      </div>
      
      <div className="space-y-8">
        {displayedProfiles.map((profile, index) => (
          <MessageCard
            key={`${profile.profile.id}-${index}`}
            profile={profile}
            message={generatedMessages[`${profile.profile.id}-${index}`] || generatedMessages[profile.profile.id] || ""}
            onMessageChange={(message) => onMessageChange(profile.profile.id, message)}
            onRegenerateMessage={() => onRegenerateMessage(profile.profile.id)}
          />
        ))}
      </div>
    </div>
  );
} 