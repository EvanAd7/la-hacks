'use client';

import { useEffect, useState } from 'react';
import { MessagesCollection } from '@/services/message-generator';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function MessagesPage() {
  const params = useParams();
  const [messages, setMessages] = useState<MessagesCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!params.filename) {
          throw new Error('No filename provided');
        }
        
        const response = await fetch(`/messages/${params.filename}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load messages: ${response.status}`);
        }
        
        const data = await response.json();
        setMessages(data);
      } catch (err: any) {
        console.error('Error loading messages:', err);
        setError(err.message || 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [params.filename]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 border-4 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Error</h2>
          <p>{error}</p>
          <Link href="/linkd-search" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to Search
          </Link>
        </div>
      </div>
    );
  }
  
  if (!messages || !messages.messages || messages.messages.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h2 className="text-lg font-semibold text-yellow-700 mb-2">No Messages Found</h2>
          <p>The requested messages file was not found or is empty.</p>
          <Link href="/linkd-search" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to Search
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Generated Outreach Messages</h1>
        <Link href="/linkd-search" className="text-blue-600 hover:underline">
          Back to Search
        </Link>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Messages ({messages.messages.length})
        </h2>
        
        <div className="space-y-6">
          {messages.messages.map((message, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border">
              {message.linkedinURL && (
                <div className="mb-3 pb-3 border-b">
                  <h3 className="font-medium">LinkedIn Profile</h3>
                  <a 
                    href={message.linkedinURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {message.linkedinURL}
                  </a>
                </div>
              )}
              
              <div className="mb-3">
                <h4 className="font-medium text-sm text-gray-700 mb-2">Outreach Message:</h4>
                <div className="bg-gray-50 p-3 rounded whitespace-pre-wrap text-sm">
                  {message.coldMessage}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(message.coldMessage);
                    alert('Message copied to clipboard!');
                  }}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <button
          onClick={() => {
            // Create a downloadable JSON
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(messages, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `messages-${Date.now()}.json`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download Messages JSON
        </button>
      </div>
    </div>
  );
} 