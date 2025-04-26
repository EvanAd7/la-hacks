import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Input
          placeholder="I want to cold email alumni from my school who work in FAANG about setting up a coffee chat..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="h-24 py-2 px-3 resize-none"
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox 
            id="alumniOnly" 
            checked={alumniOnly} 
            onCheckedChange={(checked) => setAlumniOnly(checked as boolean)} 
          />
          <Label htmlFor="alumniOnly">Alumni Only</Label>
        </div>
        <Select value={limit} onValueChange={setLimit}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Limit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 Results</SelectItem>
            <SelectItem value="10">10 Results</SelectItem>
            <SelectItem value="20">20 Results</SelectItem>
            <SelectItem value="30">30 Results</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? (
            isSearching ? "Searching profiles..." : "Generating messages..."
          ) : "Generate Outreach Messages"}
        </Button>
      </div>
    </form>
  );
} 