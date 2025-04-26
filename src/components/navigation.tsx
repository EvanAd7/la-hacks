import React from "react";
import Link from "next/link";

export function Navigation() {
  return (
    <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-10">
      <div className="w-full grid grid-cols-2 divide-x divide-border/30">
        <Link 
          href="/" 
          className="py-5 text-center text-sm font-medium text-primary hover:bg-muted/30 transition-colors"
        >
          Send
        </Link>
        <Link 
          href="/profile" 
          className="py-5 text-center text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/30 transition-colors"
        >
          Profile
        </Link>
      </div>
    </nav>
  );
} 