import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface SearchFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  limit: string;
  setLimit: (limit: string) => void;
  alumniOnly: boolean;
  setAlumniOnly: (alumniOnly: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  isSearching: boolean;
}

export function SearchForm({
  prompt,
  setPrompt,
  limit,
  setLimit,
  alumniOnly,
  setAlumniOnly,
  handleSubmit,
  isLoading,
  isSearching,
}: SearchFormProps) {
  // State for the animated placeholder text
  const [placeholderText, setPlaceholderText] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  
  // Array of different placeholder texts all starting with "I want to"
  const placeholderTexts = [
    "I want to email alumni from my school who work in FAANG about setting up a coffee chat...",
    "I'd like to connect with recent graduates who are working in healthcare tech...",
    "Can you help me find recruiters in my city who specialize in product management roles...",
    "I'm looking to meet founders of AI startups for mentorship opportunities...",
    "I want to message professionals in my field who have transitioned to remote work..."
  ];

  // Animation variants for the form
  const formAnimationVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        delay: 0.2 
      }
    }
  };

  // Animation effect for typing out the placeholder text
  useEffect(() => {
    let currentText = placeholderTexts[currentPlaceholderIndex];
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingPause = false;

    const animationInterval = setInterval(() => {
      // When typing
      if (!isDeleting && !typingPause) {
        if (currentCharIndex < currentText.length) {
          setPlaceholderText(currentText.slice(0, currentCharIndex + 1));
          currentCharIndex++;
        } else {
          // Pause at the end of typing before deleting
          typingPause = true;
          setTimeout(() => {
            isDeleting = true;
            typingPause = false;
          }, 1500);
        }
      }
      // When deleting
      else if (isDeleting) {
        if (currentCharIndex > 0) {
          setPlaceholderText(currentText.slice(0, currentCharIndex - 1));
          currentCharIndex--;
        } else {
          // Move to the next placeholder text
          isDeleting = false;
          setCurrentPlaceholderIndex((prevIndex) => 
            prevIndex === placeholderTexts.length - 1 ? 0 : prevIndex + 1
          );
          currentText = placeholderTexts[(currentPlaceholderIndex + 1) % placeholderTexts.length];
        }
      }
    }, 20); // Speed of typing/deleting

    return () => clearInterval(animationInterval);
  }, [currentPlaceholderIndex]);

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6 bg-muted/30 p-4 rounded-xl border border-border/50 shadow-sm dark:bg-muted/10 dark:border-border/30 relative" 
      style={{ zIndex: 1 }}
      initial="hidden"
      animate="visible"
      variants={formAnimationVariants}
    >
      <div className="space-y-3">
        <span className="font-medium text-sm text-foreground/80">What are you looking to accomplish?</span>
        <div className="mt-4 relative">
          <motion.textarea
            placeholder={placeholderText}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full min-h-32 py-4 px-5 rounded-lg border border-border bg-background resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-muted-foreground/70 dark:bg-black/50 dark:border-border/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2 bg-white dark:bg-black/70 p-2 rounded-md border border-border/50 shadow-sm dark:border-border/30">
          <Checkbox
            id="alumniOnly"
            checked={alumniOnly}
            onCheckedChange={(checked) => setAlumniOnly(checked as boolean)}
            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <Label htmlFor="alumniOnly" className="text-sm font-medium">Alumni Only</Label>
        </div>

        <Select value={limit} onValueChange={setLimit}>
          <SelectTrigger className="w-32 bg-white dark:bg-black/70 border-border/50 shadow-sm dark:border-border/30">
            <SelectValue placeholder="Limit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 Results</SelectItem>
            <SelectItem value="10">10 Results</SelectItem>
            <SelectItem value="20">20 Results</SelectItem>
            <SelectItem value="30">30 Results</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1 flex items-center">
          <Button
            type="submit"
            className="flex-1 w-full h-12 cursor-pointer bg-primary hover:bg-primary/90 font-medium text-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isSearching ? "Finding connections..." : "Brewing messages..."}
              </span>
            ) : (
              "Start connecting"
            )}
          </Button>
        </div>
      </div>
    </motion.form>
  );
} 