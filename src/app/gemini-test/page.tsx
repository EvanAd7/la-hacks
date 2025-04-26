'use client';

import { useState, useEffect } from 'react';

export default function GeminiTest() {
  const [result, setResult] = useState<string>('Loading...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testGeminiAPI() {
      try {
        const response = await fetch('/api/gemini-test');
        const data = await response.json();
        
        if (data.success) {
          setResult(data.text);
        } else {
          setError(data.error || 'Unknown error occurred');
          setResult('');
        }
      } catch (err) {
        console.error('Error testing Gemini API:', err);
        setError('Failed to test Gemini API');
        setResult('');
      }
    }

    testGeminiAPI();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gemini API Test</h1>
      
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      ) : null}

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Response:</h2>
        <p>{result}</p>
      </div>
    </div>
  );
} 