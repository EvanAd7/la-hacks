import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export function Navigation() {
  // Start with a neutral state that doesn't affect SSR
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  // Function to toggle theme
  const toggleTheme = () => {
    if (!theme) return; // Guard clause in case theme is not yet initialized
    
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  // Apply theme to document
  const applyTheme = (newTheme: "light" | "dark") => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Reset animation on double click of logo
  const resetAnimation = () => {
    try {
      sessionStorage.removeItem('animationHasRun');
      window.location.reload();
    } catch (error) {
      console.error('Error accessing sessionStorage:', error);
      // Fallback - just reload
      window.location.reload();
    }
  };

  // Only render theme toggle on client-side to avoid hydration issues
  const themeToggle = mounted ? (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-muted/50 hover:bg-muted dark:bg-muted/30 dark:hover:bg-muted/50 text-foreground/70 hover:text-primary transition-all"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === "light" ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
        </svg>
      )}
    </button>
  ) : (
    // Placeholder with same dimensions to avoid layout shift
    <div className="w-10 h-10"></div>
  );

  return (
    <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-10 bg-white/80 dark:bg-black/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex-shrink-0 cursor-pointer"
            onDoubleClick={resetAnimation}
            title="Double-click to replay animation"
          >
            <Image 
              src="/Brew Logo.png" 
              alt="BREW Logo" 
              width={64} 
              height={64} 
              className="object-contain" 
              style={{ backgroundColor: 'transparent' }}
              unoptimized={true}
            />
          </div>
          <div className="flex items-center space-x-4">
            {themeToggle}
            <Link 
              href="/" 
              className="px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-muted/30 transition-colors"
            >
              Send
            </Link>
            <Link 
              href="/profile" 
              className="px-3 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/30 transition-colors"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 