import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { UserResult, Experience, Education } from "@/services/linkd-api";

interface MessageCardProps {
  profile: UserResult;
  message: string;
  onMessageChange: (message: string) => void;
  onRegenerateMessage: () => void;
}

export function MessageCard({
  profile,
  message,
  onMessageChange,
  onRegenerateMessage,
}: MessageCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Profile Info */}
        <div className="md:w-1/3 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile.profile.profile_picture_url} />
              <AvatarFallback>
                {profile.profile.name.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{profile.profile.name}</h3>
              <p className="text-sm text-muted-foreground">{profile.profile.headline}</p>
            </div>
          </div>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium block">Current:</span>
              <span>{profile.profile.title}</span>
            </div>
            
            {profile.experience && profile.experience.length > 0 && (
              <div>
                <span className="font-medium block">Experience:</span>
                <ul className="list-disc pl-4 space-y-1">
                  {profile.experience.slice(0, 2).map((exp: Experience, idx: number) => (
                    <li key={idx}>
                      {exp.title} at {exp.company_name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {profile.education && profile.education.length > 0 && (
              <div>
                <span className="font-medium block">Education:</span>
                <ul className="list-disc pl-4 space-y-1">
                  {profile.education.slice(0, 2).map((edu: Education, idx: number) => (
                    <li key={idx}>
                      {edu.degree} in {edu.field_of_study}, {edu.school_name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <span className="font-medium block">Location:</span>
              <span>{profile.profile.location}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <a 
              href={profile.profile.linkedin_url} 
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
        
        {/* Message Content */}
        <div className="md:w-2/3 p-6">
          <h3 className="font-semibold mb-4">Message</h3>
          <Textarea 
            className="min-h-[300px] font-mono text-sm"
            value={message || ''}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Generating LinkedIn message..."
          />
          <div className="flex justify-end mt-4 space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRegenerateMessage}
            >
              Regenerate
            </Button>
            <Button 
              variant="default" 
              size="sm"
              className="bg-primary text-primary-foreground"
            >
              <Send className="mr-1 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
} 