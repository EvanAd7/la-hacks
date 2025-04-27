"use client";

import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Link from "next/link";
import { ContactProfile, mockProfiles, outreachMetrics, uniqueCompanies } from "./data";
import { motion, AnimatePresence } from "framer-motion";
import { X, Filter } from "lucide-react";

export default function Dashboard() {
  const [profiles, setProfiles] = useState<ContactProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<ContactProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProfile, setSelectedProfile] = useState<ContactProfile | null>(null);
  const [sortByDate, setSortByDate] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Initialize profiles
  useEffect(() => {
    setProfiles(mockProfiles);
    setFilteredProfiles(mockProfiles);
  }, []);

  // Close sidebar on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSelectedProfile(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Apply filters when search query, category filter, company filter, active tab, or sort changes
  useEffect(() => {
    let filtered = [...profiles];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        profile =>
          profile.profile.name.toLowerCase().includes(query) ||
          profile.experience.some(exp => exp.company_name.toLowerCase().includes(query)) ||
          profile.experience.some(exp => exp.title.toLowerCase().includes(query)) ||
          profile.education.some(edu => edu.school_name.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(profile =>
        profile.category.includes(categoryFilter)
      );
    }

    // Filter by company
    if (companyFilter !== "all") {
      filtered = filtered.filter(profile =>
        profile.experience.some(exp => exp.company_name === companyFilter)
      );
    }

    // Filter by tab
    if (activeTab === "responded") {
      filtered = filtered.filter(profile => profile.responded);
    } else if (activeTab === "not_responded") {
      filtered = filtered.filter(profile => !profile.responded);
    }

    // Sort by contact date if enabled
    if (sortByDate) {
      filtered.sort((a, b) => {
        return new Date(b.lastContactDate).getTime() - new Date(a.lastContactDate).getTime();
      });
    }

    setFilteredProfiles(filtered);
  }, [searchQuery, categoryFilter, companyFilter, activeTab, profiles, sortByDate]);

  // Toggle response status
  const toggleResponseStatus = (profileId: string) => {
    setProfiles(prevProfiles =>
      prevProfiles.map(profile => {
        if (profile.id === profileId) {
          const now = new Date().toISOString().split('T')[0];
          return {
            ...profile,
            responded: !profile.responded,
            responseDate: !profile.responded ? now : undefined
          };
        }
        return profile;
      })
    );
  };

  // Calculate metrics
  const totalContacts = profiles.length;
  const respondedCount = profiles.filter(p => p.responded).length;
  const responseRate = Math.round((respondedCount / totalContacts) * 100) || 0;

  // Get unique categories from profiles
  const uniqueCategories = Array.from(
    new Set(profiles.flatMap(profile => profile.category))
  );

  // Format date to more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Outreach Dashboard</h1>
          <p className="text-muted-foreground">Track and manage your network connections</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 border border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Messages</h3>
            <p className="text-3xl font-bold">{totalContacts}</p>
          </Card>

          <Card className="p-4 border border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Response Rate</h3>
            <p className="text-3xl font-bold">{responseRate}%</p>
          </Card>

          <Card className="p-4 border border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Responses</h3>
            <p className="text-3xl font-bold">{respondedCount}</p>
          </Card>

          <Card className="p-4 border border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Messages This Week</h3>
            <p className="text-3xl font-bold">{outreachMetrics.sentThisWeek}</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by name, company, position..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="w-34">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-34">
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {uniqueCompanies.map(company => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={() => setSortByDate(!sortByDate)}
            className={`p-2 h-9 rounded-md border ${sortByDate ? 'bg-muted border-primary' : 'bg-background border-input'} hover:bg-accent transition-colors`}
            title="Sort by contact date"
          >
            <Filter size={20} className={sortByDate ? 'text-primary' : 'text-muted-foreground'} />
          </button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="responded">Responded</TabsTrigger>
            <TabsTrigger value="not_responded">Not Responded</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="space-y-6">
              {filteredProfiles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No contacts found matching your filters.</p>
                </div>
              ) : (
                filteredProfiles.map(profile => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className="p-5 border border-border hover:border-primary/50 transition-all cursor-pointer"
                      onClick={() => setSelectedProfile(profile)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-shrink-0">
                          <Avatar className="w-16 h-16 border-2 border-muted">
                            <AvatarImage src={profile.profile.profile_picture_url} alt={profile.profile.name} />
                            <AvatarFallback>{profile.profile.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                            <h3 className="text-lg font-medium truncate">{profile.profile.name}</h3>
                            <div className="flex flex-wrap gap-2">
                              {profile.category.map(cat => (
                                <Badge key={cat} variant="outline" className="bg-muted/50">
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row md:items-center text-sm text-muted-foreground gap-x-4 gap-y-1">
                            <span>{profile.experience[0].title}</span>
                            <span>•</span>
                            <span>{profile.experience[0].company_name}</span>
                            <span>•</span>
                            <span>{profile.education[0].school_name}</span>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-3">
                            <Badge variant={profile.responded ? "secondary" : "outline"}>
                              {profile.responded ? "Responded" : "Contacted"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Contacted on {profile.lastContactDate}
                            </span>
                            {profile.responseDate && (
                              <span className="text-xs text-muted-foreground">
                                • Responded on {profile.responseDate}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            id={`response-${profile.id}`}
                            checked={profile.responded}
                            onCheckedChange={() => toggleResponseStatus(profile.id)}
                          />
                          <label
                            htmlFor={`response-${profile.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Responded
                          </label>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Sliding Profile Detail Sidebar */}
      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            className="fixed top-0 right-0 h-screen w-full md:w-1/2 lg:w-1/3 bg-card shadow-lg z-50 overflow-auto"
            ref={sidebarRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Profile Details</h2>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="p-2 rounded-full hover:bg-muted"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-20 h-20 border-2 border-muted">
                  <AvatarImage src={selectedProfile.profile.profile_picture_url} alt={selectedProfile.profile.name} />
                  <AvatarFallback>{selectedProfile.profile.name.substring(0, 2)}</AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="text-xl font-bold">{selectedProfile.profile.name}</h3>
                  <p className="text-muted-foreground">{selectedProfile.profile.headline}</p>
                  <p className="text-sm">{selectedProfile.profile.location}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">About</h4>
                <p className="text-muted-foreground">{selectedProfile.profile.description}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">Experience</h4>
                <div className="space-y-4">
                  {selectedProfile.experience.map((exp, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden bg-muted">
                        {exp.company_logo && (
                          <img src={exp.company_logo} alt={exp.company_name} className="w-full h-full object-contain" />
                        )}
                      </div>
                      <div>
                        <h5 className="font-medium">{exp.title}</h5>
                        <p className="text-sm">{exp.company_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {exp.start_date} - {exp.end_date === "present" ? "Present" : exp.end_date}
                        </p>
                        {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">Education</h4>
                <div className="space-y-4">
                  {selectedProfile.education.map((edu, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden bg-muted">
                        {edu.school_logo && (
                          <img src={edu.school_logo} alt={edu.school_name} className="w-full h-full object-contain" />
                        )}
                      </div>
                      <div>
                        <h5 className="font-medium">{edu.school_name}</h5>
                        <p className="text-sm">{edu.degree}, {edu.field_of_study}</p>
                        <p className="text-xs text-muted-foreground">
                          {edu.start_date} - {edu.end_date}
                        </p>
                        {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6 border p-4 rounded-lg bg-muted/20">
                <h4 className="text-lg font-medium mb-2">Message Sent</h4>
                <p className="text-sm italic">{selectedProfile.message}</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  Sent on {selectedProfile.lastContactDate}
                </div>
              </div>

              <div className="mt-auto mx-auto w-56 pb-6">
                <Link
                  href={selectedProfile.profile.linkedin_url}
                  target="_blank"
                  className="inline-flex items-center justify-center w-full rounded-md text-sm font-medium py-3 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  View LinkedIn Profile
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop when sidebar is open */}
      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProfile(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 