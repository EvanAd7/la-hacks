import { NextResponse } from 'next/server';
import { generateLinkedInQuery } from '@/services/gemini-api';

// Support for POST requests (user-provided data)
export async function POST(request: Request) {
  console.log(`[${new Date().toISOString()}] [gemini-test API] Request received`);
  const startTime = performance.now();
  
  try {
    // Parse request body
    const body = await request.json();
    const { userProfile, userObjective } = body;
    
    console.log(`[${new Date().toISOString()}] [gemini-test API] Request parsed. Objective: "${userObjective}"`);
    
    // Validate required fields
    if (!userProfile || !userObjective) {
      console.log(`[${new Date().toISOString()}] [gemini-test API] Missing required fields`);
      return NextResponse.json(
        { error: 'userProfile and userObjective are required' },
        { status: 400 }
      );
    }
    
    // Generate query using Gemini API
    console.log(`[${new Date().toISOString()}] [gemini-test API] Calling generateLinkedInQuery`);
    const queryStartTime = performance.now();
    
    const text = await generateLinkedInQuery(userProfile, userObjective);
    
    const queryEndTime = performance.now();
    console.log(`[${new Date().toISOString()}] [gemini-test API] Query generation completed in ${(queryEndTime - queryStartTime).toFixed(2)}ms`);
    console.log(`[${new Date().toISOString()}] [gemini-test API] Generated query: "${text}"`);
    
    const endTime = performance.now();
    console.log(`[${new Date().toISOString()}] [gemini-test API] Request completed in ${(endTime - startTime).toFixed(2)}ms`);
    
    return NextResponse.json({
      success: true,
      text
    });
  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] [gemini-test API] Error:`, error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred during query generation' },
      { status: 500 }
    );
  }
} 