import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export function Navigation() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState(0);

  // Initialize theme on component mount - always use light mode
  useEffect(() => {
    setMounted(true);
    // Always apply light mode
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    // Add event listener
    window.addEventListener("scroll", handleScroll);

    // Call once to set initial position
    handleScroll();

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Reset animation on double click of logo
  const resetAnimation = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    try {
      sessionStorage.removeItem('animationHasRun');
      window.location.reload();
    } catch (error) {
      console.error('Error accessing sessionStorage:', error);
      // Fallback - just reload
      window.location.reload();
    }
  };

  // Handle logo click
  const handleLogoClick = (e: React.MouseEvent) => {
    // Single click navigates to home
    if (pathname !== "/") {
      router.push("/");
    }
  };

  // Calculate background opacity based on scroll position
  // Start with 0 opacity, gradually increase to 0.8 as user scrolls down 50px
  const bgOpacity = Math.min(scrollPosition / 50, 1) * 0.8;
  
  // Calculate border opacity based on scroll position
  // Start with 0 opacity, gradually increase to 1 as user scrolls down 50px
  const borderOpacity = Math.min(scrollPosition / 50, 1);

  return (
    <nav 
      className="border-b backdrop-blur-sm sticky top-0 z-10 transition-all duration-200"
      style={{ 
        backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`,
        borderColor: `rgba(var(--border-rgb), ${borderOpacity})` 
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link 
            href="/"
            className="flex-shrink-0 cursor-pointer relative"
            onClick={handleLogoClick}
            onDoubleClick={resetAnimation}
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
            title="Click to go home, double-click to replay animation"
          >
            {!mounted ? (
              // Placeholder while loading to prevent flicker
              <div className="w-12 h-12"></div>
            ) : (
              <div className="transition-transform duration-300" style={{ transform: isLogoHovered ? 'scale(1.15)' : 'scale(1)' }}>
                <Image 
                  src="/Brew Logo (Light).png" 
                  alt="BREW Logo" 
                  width={48} 
                  height={48} 
                  className="object-contain" 
                  style={{ backgroundColor: 'transparent' }}
                  unoptimized={true}
                />
              </div>
            )}
          </Link>
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/" 
                  ? "text-primary"
                  : "text-foreground/80 hover:text-primary"
              } hover:bg-muted/30 transition-colors`}
            >
              Brew
            </Link>
            <Link 
              href="/dashboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/dashboard" 
                  ? "text-primary"
                  : "text-foreground/80 hover:text-primary"
              } hover:bg-muted/30 transition-colors`}
            >
              Dashboard
            </Link>
            <Link 
              href="/explore" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/explore" 
                  ? "text-primary"
                  : "text-foreground/80 hover:text-primary"
              } hover:bg-muted/30 transition-colors`}
            >
              Explore
            </Link>
            <Link 
              href="/profile" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/profile" 
                  ? "text-primary"
                  : "text-foreground/80 hover:text-primary"
              } hover:bg-muted/30 transition-colors`}
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 