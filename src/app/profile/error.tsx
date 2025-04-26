'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Profile page error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Profile Page Error</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {error.message || 'An error occurred loading your profile. Please try again.'}
      </p>
      <div className="flex space-x-4">
        <Button
          onClick={reset}
          className="px-4 py-2"
        >
          Try again
        </Button>
        <Link href="/">
          <Button variant="outline" className="px-4 py-2">
            Return to home
          </Button>
        </Link>
      </div>
    </div>
  );
} 