import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion } from "motion/react";

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
  const fullPlaceholderText = "I want to cold email alumni from my school who work in FAANG about setting up a coffee chat...";
  
  // Animation effect for typing out the placeholder text
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullPlaceholderText.length) {
        setPlaceholderText(fullPlaceholderText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50); // Speed of typing
    
    return () => clearInterval(typingInterval);
  }, []);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-muted/30 p-6 rounded-xl border border-border/50 shadow-sm dark:bg-muted/10 dark:border-border/30 relative" style={{ zIndex: 1 }}>
      <div className="space-y-3">
        <label className="font-medium text-sm text-foreground/80">What are you looking to accomplish?</label>
        <div className="relative">
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1"
          >
            <Button 
              type="submit" 
              className="flex-1 w-full h-12 bg-primary hover:bg-primary/90 font-medium dark:hover:bg-primary/80"
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
                "Brew Your Connections"
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </form>
  );
} 