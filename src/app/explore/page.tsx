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
    id: string;
    name: string;
    imageUrl?: string;
    profile_picture_url?: string;
  };
  connectReason: string;
  experience?: Array<{
    title: string;
    company_name: string;
  }>;
}

interface ConnectionNode {
  id: string;
  label: string;
  size: number;
  people: Person[];
}

// The brown color for all bubbles
const BUBBLE_COLOR = "oklch(0.42 0.14 62)";

// Fixed bubble configurations for consistent layout
const BUBBLE_CONFIGS = [
  { size: 85, orbitRadius: 200, orbitSpeed: 0.00004, startAngle: 0 },
  { size: 95, orbitRadius: 240, orbitSpeed: 0.00006, startAngle: 1.3 },
  { size: 90, orbitRadius: 280, orbitSpeed: 0.00008, startAngle: 2.6 },
  { size: 100, orbitRadius: 320, orbitSpeed: 0.00005, startAngle: 3.9 },
  { size: 80, orbitRadius: 360, orbitSpeed: 0.00007, startAngle: 5.2 },
  { size: 105, orbitRadius: 400, orbitSpeed: 0.00003, startAngle: 0.7 }
];

export default function Explore() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const visualizationRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const [selectedNode, setSelectedNode] = useState<ConnectionNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<ConnectionNode | null>(null);
  const [nodes, setNodes] = useState<(ConnectionNode & { 
    x: number; 
    y: number;
    baseSize: number;
    breathPhase: number;
    orbitSpeed: number; 
    orbitRadius: number;
    orbitAngle: number;
  })[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const centerNodeRef = useRef({ x: 0, y: 0, radius: 90, breathPhase: 0 });
  const timeRef = useRef(0);

  // Initialize nodes with positions
  useEffect(() => {
    if (!visualizationRef.current) return;
    
    const containerRect = visualizationRef.current.getBoundingClientRect();
    setDimensions({
      width: containerRect.width,
      height: containerRect.height
    });
    
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    centerNodeRef.current = { x: centerX, y: centerY, radius: 90, breathPhase: 0 };
    
    // Get connection data from the imported file
    const connectionData = exploreData.connections;
    
    // Use fixed configurations for each bubble - scale based on container size
    const containerSize = Math.min(containerRect.width, containerRect.height);
    const scaleFactor = containerSize / 1000; // Scale factor based on reference size of 1000px
    
    const initializedNodes = connectionData.map((node, index) => {
      const config = BUBBLE_CONFIGS[index % BUBBLE_CONFIGS.length];
      
      // Scale orbit radius based on container size
      const scaledRadius = config.orbitRadius * scaleFactor;
      
      // Calculate initial position based on orbit
      const x = centerX + scaledRadius * Math.cos(config.startAngle);
      const y = centerY + scaledRadius * Math.sin(config.startAngle);
      
      return {
        ...node,
        x,
        y,
        baseSize: config.size * scaleFactor,
        breathPhase: Math.random() * Math.PI * 2, // Random starting phase for breathing
        orbitSpeed: config.orbitSpeed,
        orbitRadius: scaledRadius,
        orbitAngle: config.startAngle
      };
    });
    
    setNodes(initializedNodes);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!visualizationRef.current) return;
      
      const containerRect = visualizationRef.current.getBoundingClientRect();
      setDimensions({
        width: containerRect.width,
        height: containerRect.height
      });
      
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;
      centerNodeRef.current = { 
        ...centerNodeRef.current,
        x: centerX, 
        y: centerY
      };
      
      // Resize nodes based on new container size
      const containerSize = Math.min(containerRect.width, containerRect.height);
      const scaleFactor = containerSize / 1000; // Scale factor based on reference size
      
      setNodes(prevNodes => {
        return prevNodes.map((node, index) => {
          const config = BUBBLE_CONFIGS[index % BUBBLE_CONFIGS.length];
          const scaledRadius = config.orbitRadius * scaleFactor;
          
          return {
            ...node,
            baseSize: config.size * scaleFactor,
            orbitRadius: scaledRadius
          };
        });
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth orbital animation
  useEffect(() => {
    if (nodes.length === 0 || !dimensions.width || !dimensions.height) return;
    
    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      // Calculate delta time for smooth animation regardless of frame rate
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      timeRef.current += deltaTime;
      
      // Update center node breathing
      centerNodeRef.current = {
        ...centerNodeRef.current,
        breathPhase: (centerNodeRef.current.breathPhase + 0.0003 * deltaTime) % (Math.PI * 2)
      };
      
      setNodes(prevNodes => {
        return prevNodes.map(node => {
          // Update orbit angle based on orbit speed (very slow movement)
          const orbitAngle = node.orbitAngle + node.orbitSpeed * deltaTime;
          
          // Calculate target position based on orbit
          const targetX = centerNodeRef.current.x + node.orbitRadius * Math.cos(orbitAngle);
          const targetY = centerNodeRef.current.y + node.orbitRadius * Math.sin(orbitAngle);
          
          // Smooth movement towards target position (lerp)
          const lerpFactor = 0.01; // Very small for smoother, slower movement
          const x = node.x + (targetX - node.x) * lerpFactor;
          const y = node.y + (targetY - node.y) * lerpFactor;
          
          // Update breath phase (very slow breathing)
          const breathSpeed = 0.0003; // Controls breath speed
          const breathPhase = (node.breathPhase + breathSpeed * deltaTime) % (Math.PI * 2);
          
          // Add slight random movement (much reduced)
          const randomStrength = 0.02;
          const randomX = Math.sin(timeRef.current * 0.0005 + node.orbitAngle * 7) * randomStrength;
          const randomY = Math.cos(timeRef.current * 0.0005 + node.orbitAngle * 11) * randomStrength;
          
          // Ensure bubbles stay within boundaries by gently forcing them back
          const maxDistance = Math.min(dimensions.width, dimensions.height) / 2 - node.baseSize;
          const distanceFromCenter = Math.sqrt(
            (x - centerNodeRef.current.x) ** 2 + 
            (y - centerNodeRef.current.y) ** 2
          );
          
          let finalX = x + randomX;
          let finalY = y + randomY;
          
          // If bubble is going out of bounds, pull it back in
          if (distanceFromCenter > maxDistance) {
            const angle = Math.atan2(finalY - centerNodeRef.current.y, finalX - centerNodeRef.current.x);
            finalX = centerNodeRef.current.x + Math.cos(angle) * maxDistance;
            finalY = centerNodeRef.current.y + Math.sin(angle) * maxDistance;
          }
          
          return {
            ...node,
            x: finalX,
            y: finalY,
            orbitAngle,
            breathPhase
          };
        });
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [dimensions, nodes.length]);

  // Draw canvas
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Adjust for device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw floating bubbles
    nodes.forEach(node => {
      const isHighlighted = hoveredNode?.id === node.id || selectedNode?.id === node.id;
      
      // Calculate breathing effect (scale between 0.9 and 1.1 of original size)
      const breathScale = 1 + 0.1 * Math.sin(node.breathPhase);
      const nodeSize = node.baseSize * breathScale;
      
      // Create bubble gradient (with highlight for selected/hovered)
      const gradient = ctx.createRadialGradient(
        node.x - nodeSize * 0.4, 
        node.y - nodeSize * 0.4, 
        nodeSize * 0.1,
        node.x, 
        node.y, 
        nodeSize
      );
      
      const baseColor = BUBBLE_COLOR;
      const highlightColor = isHighlighted ? 'oklch(0.5 0.15 62)' : 'oklch(0.4 0.13 62)';
      
      // Add gradient stops for bubble effect with subtle white shine (larger but more subtle)
      gradient.addColorStop(0, 'oklch(0.76 0.04 62 / 0.85)'); // Lighter, more transparent shine
      gradient.addColorStop(0.5, baseColor);  // Moved from 0.3 to 0.5 to make gradient larger
      gradient.addColorStop(1, highlightColor);
      
      // Draw bubble with translucent effect
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Reset opacity for text
      ctx.globalAlpha = 1;
      
      // Draw node text - larger and always bold with better sizing
      const fontSize = Math.min(Math.max(nodeSize * 0.4, 16), 24); // Between 16-24px, scaled with bubble
      
      ctx.font = `bold ${fontSize}px var(--font-outfit)`;
      
      // Measure text to ensure it fits
      const textMetrics = ctx.measureText(node.label);
      let displayText = node.label;
      
      // If text is too wide, truncate with ellipsis
      if (textMetrics.width > nodeSize * 1.6) {
        let truncated = node.label;
        while (ctx.measureText(truncated + "...").width > nodeSize * 1.6 && truncated.length > 0) {
          truncated = truncated.slice(0, -1);
        }
        displayText = truncated + "...";
      }
      
      ctx.fillStyle = 'oklch(0.985 0 0)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayText, node.x, node.y);
    });
    
    // Draw center "You are here" bubble with breathing effect
    const centerBreathScale = 1 + 0.08 * Math.sin(centerNodeRef.current.breathPhase);
    const centerRadius = centerNodeRef.current.radius * centerBreathScale;
    
    // Create radial gradient for the center bubble
    const centerGradient = ctx.createRadialGradient(
      centerNodeRef.current.x - centerRadius * 0.4, 
      centerNodeRef.current.y - centerRadius * 0.4, 
      centerRadius * 0.1,
      centerNodeRef.current.x, 
      centerNodeRef.current.y, 
      centerRadius
    );
    
    centerGradient.addColorStop(0, 'oklch(0.76 0.04 62 / 0.85)'); // Subtle shine
    centerGradient.addColorStop(0.5, BUBBLE_COLOR);
    centerGradient.addColorStop(1, 'oklch(0.35 0.14 62)');
    
    // Add hover effect to center bubble ONLY when hovering center (fixed)
    const mousePos = { x: 0, y: 0 }; // Default position
    const rect = canvas.getBoundingClientRect();
    
    if (canvasRef.current.matches(':hover')) {
      const clientX = parseFloat(canvas.getAttribute('data-mouse-x') || '0');
      const clientY = parseFloat(canvas.getAttribute('data-mouse-y') || '0');
      mousePos.x = clientX - rect.left;
      mousePos.y = clientY - rect.top;
    }
    
    const distanceToCenter = Math.sqrt(
      (mousePos.x - centerNodeRef.current.x) ** 2 + 
      (mousePos.y - centerNodeRef.current.y) ** 2
    );
    
    const isHoveringCenter = distanceToCenter <= centerRadius;
    
    ctx.globalAlpha = isHoveringCenter ? 1 : 0.9;
    ctx.beginPath();
    ctx.arc(
      centerNodeRef.current.x, 
      centerNodeRef.current.y, 
      centerRadius, 
      0, Math.PI * 2
    );
    ctx.fillStyle = centerGradient;
    ctx.fill();
    
    // Reset opacity
    ctx.globalAlpha = 1;
    
    // Add text to center node with larger bold font
    const centerFontSize = Math.min(centerRadius * 0.45, 26);
    ctx.font = `bold ${centerFontSize}px var(--font-outfit)`;
    ctx.fillStyle = 'oklch(0.985 0 0)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('You are here', centerNodeRef.current.x, centerNodeRef.current.y);
  }, [dimensions, nodes, hoveredNode, selectedNode]);

  // Handle node clicking and hovering
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if center node was clicked (navigate to profile)
    const dx = centerNodeRef.current.x - x;
    const dy = centerNodeRef.current.y - y;
    const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
    
    if (distanceToCenter <= centerNodeRef.current.radius) {
      router.push('/profile');
      return;
    }
    
    // Check if a node was clicked
    let clickedNode = null;
    for (const node of nodes) {
      const dx = node.x - x;
      const dy = node.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Use the breathing node size for interaction
      const breathScale = 1 + 0.1 * Math.sin(node.breathPhase);
      const nodeSize = node.baseSize * breathScale;
      
      if (distance <= nodeSize) {
        clickedNode = node;
        break;
      }
    }
    
    setSelectedNode(clickedNode);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Store mouse position as data attributes for hover detection in render
    if (canvasRef.current) {
      canvasRef.current.setAttribute('data-mouse-x', e.clientX.toString());
      canvasRef.current.setAttribute('data-mouse-y', e.clientY.toString());
    }
    
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if hovering over center node
    const dx = centerNodeRef.current.x - x;
    const dy = centerNodeRef.current.y - y;
    const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
    
    if (distanceToCenter <= centerNodeRef.current.radius) {
      document.body.style.cursor = 'pointer';
      setHoveredNode(null);
      return;
    }
    
    // Check if a node is being hovered
    let hoveredNodeFound = null;
    for (const node of nodes) {
      const dx = node.x - x;
      const dy = node.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Use the breathing node size for interaction
      const breathScale = 1 + 0.1 * Math.sin(node.breathPhase);
      const nodeSize = node.baseSize * breathScale;
      
      if (distance <= nodeSize) {
        hoveredNodeFound = node;
        break;
      }
    }
    
    if (hoveredNodeFound?.id !== hoveredNode?.id) {
      setHoveredNode(hoveredNodeFound);
      document.body.style.cursor = hoveredNodeFound ? 'pointer' : 'default';
    } else if (!hoveredNodeFound) {
      document.body.style.cursor = 'default';
      setHoveredNode(null);
    }
  };

  const handleCanvasMouseLeave = () => {
    setHoveredNode(null);
    document.body.style.cursor = 'default';
  };

  const handleCloseModal = () => {
    setSelectedNode(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <Navigation />
      
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="container mx-auto px-4 py-6 z-10 relative">
          <h1 className="text-3xl font-bold tracking-tight">Explore Your Network</h1>
          <p className="text-muted-foreground mt-2">
            Discover potential connections based on your profile and shared interests
          </p>
        </div>
        
        {/* Full-screen visualization container */}
        <div 
          ref={containerRef}
          className="flex-1 relative"
        >
          {/* Visualization div */}
          <div 
            ref={visualizationRef}
            className="absolute inset-0"
          >
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0"
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={handleCanvasMouseLeave}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          
          {!selectedNode && (
            <div className="absolute left-8 bottom-8 max-w-lg p-5 bg-background/70 backdrop-blur-sm rounded-lg border border-border z-20">
              <h2 className="text-lg font-medium mb-2">Network Visualization</h2>
              <p className="text-sm text-muted-foreground">
                Click on any bubble to see potential connections related to that aspect of your profile. 
                Click "You are here" to return to your profile.
              </p>
            </div>
          )}
        </div>
        
        {/* Connections Modal - slides in from right */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div 
              className="absolute top-0 right-0 bottom-0 w-full sm:w-[450px] bg-background border-l border-border shadow-xl z-30"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
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
                        key={person.profile.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="p-4 border-border hover:border-primary/50 transition-all mb-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-12 h-12 border border-border">
                              <AvatarImage src={person.profile.profile_picture_url} />
                              <AvatarFallback>{person.profile.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium">{person.profile.name}</h3>
                              {person.experience && person.experience[0] && (
                                <>
                                  <p className="text-sm text-muted-foreground">{person.experience[0].title}</p>
                                  <p className="text-xs text-muted-foreground">{person.experience[0].company_name}</p>
                                </>
                              )}
                              
                              <div className="mt-3">
                                <Badge 
                                  variant="outline" 
                                  className="text-xs" 
                                  style={{ 
                                    backgroundColor: `${BUBBLE_COLOR.replace(')', ' / 0.1)')}`,
                                    borderColor: BUBBLE_COLOR
                                  }}
                                >
                                  {selectedNode.label}
                                </Badge>
                              </div>
                              
                              <p className="mt-3 text-sm">{person.connectReason}</p>
                              
                              <div className="mt-3">
                                <Link 
                                  href="#" 
                                  className="text-sm text-primary hover:text-primary/90 font-medium"
                                >
                                  View full profile
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Card>
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