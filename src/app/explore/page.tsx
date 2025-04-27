"use client";

import { useEffect, useRef, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { exploreData } from "./data";

// Define the ConnectionNode type to fix TypeScript errors
interface Person {
  profile: {
    id: string | number;
    name: string;
    imageUrl?: string;
    profile_picture_url?: string;
    headline?: string;
    description?: string | null;
    title?: string | null;
    location?: string;
    linkedin_url?: string;
  };
  experience?: Array<{
    title: string;
    company_name: string;
    description?: string | null;
    start_date?: string;
    end_date?: string;
    location?: string;
    company_logo?: string;
  }>;
  education?: Array<{
    degree?: string;
    field_of_study?: string;
    school_name?: string;
    start_date?: string;
    end_date?: string;
    description?: string | null;
    school_logo?: string;
  }>;
}

interface ConnectionNode {
  id: string;
  label: string;
  size: number;
  people: Person[];
  color?: string;
}

// The base brown color for bubbles
const BUBBLE_COLOR = "oklch(0.42 0.14 62)";

// More varied shades of brown for the bubbles
const BROWN_COLORS = [
  "oklch(0.42 0.15 65)",     // Warm medium brown
  "oklch(0.35 0.12 60)",     // Dark chocolate brown
  "oklch(0.48 0.16 70)",     // Caramel brown
  "oklch(0.39 0.14 55)",     // Reddish brown
  "oklch(0.45 0.13 75)",     // Golden brown
  "oklch(0.38 0.10 62)"      // Muted brown
];

// Center bubble color (gray)
const CENTER_BUBBLE_COLOR = "oklch(0.55 0.03 250)"; // Cool gray

// Increased bubble sizes and modified orbit configurations for better scatter
const BUBBLE_CONFIGS = [
  { size: 140, orbitRadius: 220, orbitSpeed: 4, startAngle: 30, colorIndex: 0, initialProgress: 0.1 },
  { size: 150, orbitRadius: 260, orbitSpeed: 6, startAngle: 90, colorIndex: 1, initialProgress: 0.3 },
  { size: 145, orbitRadius: 300, orbitSpeed: 5, startAngle: 150, colorIndex: 2, initialProgress: 0.5 },
  { size: 160, orbitRadius: 340, orbitSpeed: 4.5, startAngle: 210, colorIndex: 3, initialProgress: 0.7 },
  { size: 135, orbitRadius: 380, orbitSpeed: 5.5, startAngle: 270, colorIndex: 4, initialProgress: 0.9 },
  { size: 155, orbitRadius: 420, orbitSpeed: 3, startAngle: 330, colorIndex: 5, initialProgress: 0.2 }
];

export default function Explore() {
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState<ConnectionNode | null>(null);
  const [nodes, setNodes] = useState<ConnectionNode[]>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Initialize nodes
  useEffect(() => {
    // Get connection data from the imported file
    const connectionData = exploreData.connections;
    
    // Initialize nodes with colors
    const initializedNodes = connectionData.map((node, index) => {
      const config = BUBBLE_CONFIGS[index % BUBBLE_CONFIGS.length];
      
      return {
        ...node,
        color: BROWN_COLORS[config.colorIndex]
      };
    });
    
    setNodes(initializedNodes);
  }, []);

  const handleBubbleClick = (node: ConnectionNode) => {
    setSelectedNode(node);
  };

  const handleCloseModal = () => {
    setSelectedNode(null);
  };

  const handleCenterClick = () => {
    router.push('/profile');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <Navigation />
      
      <main className="flex-1 flex flex-col relative">
        {/* Header - aligned with nav content (matching dashboard style) */}
        <div className="container max-w-6xl mx-auto px-4 py-8 z-10 relative">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Explore Your Network</h1>
          <p className="text-muted-foreground">
            Discover potential connections based on your profile and shared interests
          </p>
        </div>
        
        {/* Full-screen visualization container */}
        <div className="flex-1 relative">
          
          {/* Center "You are here" bubble */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div
              className="rounded-full flex items-center justify-center cursor-pointer shadow-lg text-white font-bold"
              style={{ 
                width: '120px', // Smaller size
                height: '120px', // Smaller size
                background: `radial-gradient(circle at 30% 30%, oklch(0.7 0.02 250 / 0.4), ${CENTER_BUBBLE_COLOR} 70%, oklch(0.45 0.02 250) 100%)`,
              }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut"
              }}
              onClick={handleCenterClick}
              onMouseEnter={() => document.body.style.cursor = 'pointer'}
              onMouseLeave={() => document.body.style.cursor = 'default'}
              whileHover={{ scale: 1.12, boxShadow: "0 0 15px rgba(255,255,255,0.3)" }}
            >
              <span className="text-lg">You are here</span>
            </motion.div>
          </div>
          
          {/* Orbiting bubbles */}
          {nodes.map((node, index) => {
            const config = BUBBLE_CONFIGS[index % BUBBLE_CONFIGS.length];
            // Calculate initial position along the orbit path
            const initialAngle = config.startAngle + (config.initialProgress * 360);
            const initialRadians = (initialAngle * Math.PI) / 180;
            const initialX = Math.cos(initialRadians) * config.orbitRadius;
            const initialY = Math.sin(initialRadians) * config.orbitRadius;
            
            return (
              <motion.div
                key={node.id}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ 
                  opacity: 0
                }}
                animate={{
                  rotateZ: [initialAngle, initialAngle + 360],
                  opacity: 1
                }}
                transition={{
                  duration: 360 / config.orbitSpeed,
                  repeat: Infinity,
                  ease: "linear",
                  opacity: { duration: 1, delay: index * 0.15 }
                }}
                style={{
                  width: config.orbitRadius * 2,
                  height: config.orbitRadius * 2,
                  zIndex: 5 + index, // Give each orbit a slightly different z-index
                  pointerEvents: "none", // Prevent the orbit element from blocking clicks
                }}
              >
                <motion.div
                  className="absolute rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                  style={{
                    width: `${config.size}px`,
                    height: `${config.size}px`,
                    background: `radial-gradient(circle at 30% 30%, oklch(0.7 0.03 62 / 0.4), ${node.color || BUBBLE_COLOR} 70%, oklch(${parseFloat((node.color || BUBBLE_COLOR).match(/\d+\.\d+/)![0]) - 0.05} ${parseFloat((node.color || BUBBLE_COLOR).match(/\d+\.\d+/g)![1])} ${parseFloat((node.color || BUBBLE_COLOR).match(/\d+\.\d+/g)![2] || '62')}) 100%)`,
                    transformOrigin: 'center',
                    left: '50%',
                    top: '0%',
                    transform: `translate(-50%, -50%) rotate(${-initialAngle}deg)`, // Counter-rotate to keep text upright
                    pointerEvents: "auto", // Ensure the bubble itself can be clicked
                    zIndex: 10, // Ensure bubbles are above their orbit paths
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: `-=${initialAngle}` // Keep text orientation consistent
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 2,
                    rotate: {
                      duration: 360 / config.orbitSpeed,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  }}
                  onClick={() => handleBubbleClick(node)}
                  onMouseEnter={() => {
                    setHoveredNodeId(node.id);
                    document.body.style.cursor = 'pointer';
                  }}
                  onMouseLeave={() => {
                    setHoveredNodeId(null);
                    document.body.style.cursor = 'default';
                  }}
                  whileHover={{ 
                    scale: 1.15, 
                    boxShadow: `0 0 20px ${node.color || BUBBLE_COLOR}`,
                    zIndex: 20 // Ensure hovered bubbles appear on top
                  }}
                >
                  <div className="text-white font-bold text-center px-4 max-w-[90%]">
                    <span 
                      className={`text-white font-bold ${config.size > 145 ? 'text-xl' : 'text-lg'} drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]`}
                      style={{ 
                        display: 'inline-block', 
                        maxWidth: '100%',
                        wordBreak: 'break-word',
                        lineHeight: 1.2,
                        textAlign: 'center',
                        padding: '4px'
                      }}
                    >
                      {node.label}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Connections Modal - slides in from right */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div 
              className="absolute top-0 right-0 bottom-0 w-full sm:w-[450px] bg-background border-l border-border shadow-xl z-30"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="h-full flex flex-col">
                <div className="p-5 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedNode.label} Connections
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedNode.people.length} potential connections found
                    </p>
                  </div>
                  
                  <button 
                    onClick={handleCloseModal} 
                    className="p-2 rounded-full hover:bg-muted transition-colors"
                    aria-label="Close modal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  <AnimatePresence>
                    {selectedNode.people.map((person, index) => (
                      <motion.div
                        key={`${selectedNode.id}-${person.profile.id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Link href={person.profile.linkedin_url || "#"} target="_blank" rel="noopener noreferrer">
                          <Card className="p-4 border-border hover:border-primary/50 transition-all mb-4 cursor-pointer">
                            <div className="flex items-start gap-3">
                              <Avatar className="w-12 h-12 border border-border">
                                <AvatarImage src={person.profile.profile_picture_url} />
                                <AvatarFallback>{person.profile.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium">{person.profile.name}</h3>
                                <p className="text-sm text-muted-foreground">{person.profile.title}</p>
                                <p className="text-sm text-muted-foreground">{person.profile.location}</p>
                                
                                {person.profile.headline && (
                                  <p className="text-sm mt-2 line-clamp-2 font-medium">{person.profile.headline}</p>
                                )}
                                
                                {person.experience && person.experience[0] && (
                                  <div className="mt-2">
                                    <p className="text-sm text-muted-foreground">{person.experience[0].title} at {person.experience[0].company_name}</p>
                                  </div>
                                )}
                                
                                {person.profile.description && (
                                  <p className="mt-2 text-sm line-clamp-3">{person.profile.description}</p>
                                )}
                                
                                <div className="mt-3">
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs" 
                                    style={{ 
                                      backgroundColor: `${selectedNode.color?.replace(')', ' / 0.1)')}` || `${BUBBLE_COLOR.replace(')', ' / 0.1)')}`,
                                      borderColor: selectedNode.color || BUBBLE_COLOR
                                    }}
                                  >
                                    {selectedNode.label}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
} 