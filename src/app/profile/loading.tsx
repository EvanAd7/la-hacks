import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export default function ProfileLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Minimalistic Navbar */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="w-full grid grid-cols-2 divide-x divide-border/30">
          <Link 
            href="/" 
            className="py-5 text-center text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/30 transition-colors"
          >
            Send
          </Link>
          <Link 
            href="/profile" 
            className="py-5 text-center text-sm font-medium text-primary hover:bg-muted/30 transition-colors"
          >
            Profile
          </Link>
        </div>
      </nav>

      {/* Profile Page Content */}
      <div className="flex items-center justify-center flex-1 p-6">
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl">
          {/* LinkedIn Import Card */}
          <div className="md:w-1/3">
            <Card className="h-full border-border/50 shadow-sm bg-muted/50">
              <CardContent className="flex flex-col justify-center items-center h-full p-6">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="h-6 w-3/4 mt-4" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-10 w-full mt-6" />
                <Skeleton className="h-10 w-full mt-3" />
              </CardContent>
            </Card>
          </div>
        
          {/* Profile Form Card */}
          <Card className="md:w-2/3 border-border/50 shadow-sm">
            <CardHeader className="space-y-1">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* University Selection */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Grade */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>

              <Skeleton className="h-px w-full" />

              {/* University Clubs */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-20 w-full" />
              </div>

              {/* University Societies */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-20 w-full" />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>

              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 