"use client";

import { runLinkedInOutreach, OutreachMessage, isAuthSetup } from "@/app/stagehand/main";
import { useState, useEffect } from "react";

// Dummy LinkedIn outreach messages for testing
const dummyMessages: OutreachMessage[] = [
  {
    linkedinUrl: "https://www.linkedin.com/in/justinjiang37/",
    body: "Hi there! I noticed your profile and thought we could connect. I'm working on an interesting project that might align with your expertise."
  },
  {
    linkedinUrl: "https://www.linkedin.com/in/selena-corpuz-521060342/",
    body: "Hello! I came across your profile and was impressed by your background. I'd love to connect and potentially discuss collaboration opportunities."
  }
];

export function StagehandEmbed() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [refreshAuthTrigger, setRefreshAuthTrigger] = useState(0);

  // Check if authenticated on mount and when refreshAuthTrigger changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await isAuthSetup();
        setIsAuthenticated(authStatus);
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [refreshAuthTrigger]);

  // Function to manually refresh auth status
  const refreshAuthStatus = () => {
    setRefreshAuthTrigger(prev => prev + 1);
  };

  const startOutreach = async () => {
    try {
      // Check authentication again before starting
      const authStatus = await isAuthSetup();
      if (!authStatus) {
        setResult("Authentication required. The browser will open for you to log into LinkedIn.");
      }

      setIsRunning(true);
      setResult(authStatus ? "LinkedIn outreach started..." : "Opening browser for LinkedIn login...");
      
      const success = await runLinkedInOutreach(dummyMessages);
      
      if (success) {
        setResult("LinkedIn outreach completed successfully!");
        // Refresh auth status after successful run
        refreshAuthStatus();
      } else {
        setResult("LinkedIn outreach failed. Please check the console for more details.");
      }
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
      console.error("Error running LinkedIn outreach:", error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">LinkedIn Outreach</h2>
          <button 
            onClick={refreshAuthStatus}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Refresh Auth Status
          </button>
        </div>
        
        <p className="mb-4">This will run a demo LinkedIn outreach using dummy data.</p>
        
        {isAuthenticated === false && (
          <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
            ⚠️ LinkedIn authentication required. Click the button below to start the process.
          </div>
        )}
        
        {isAuthenticated === true && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
            ✅ LinkedIn authentication detected! You can run the outreach.
          </div>
        )}
        
        <button 
          onClick={startOutreach}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isRunning ? "Running..." : (isAuthenticated ? "Start LinkedIn Outreach" : "Authenticate & Start")}
        </button>
        
        {result && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}