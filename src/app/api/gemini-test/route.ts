import { NextResponse } from 'next/server';
import { generateLinkedInQuery } from '@/services/gemini-api';

// Support for GET requests (sample data)
export async function GET() {
  try {
    // Sample test data
    const sampleProfile = {
      universityName: "USC",
      fullName: "John Doe",
      gradeYear: "Freshman",
      clubs: ["Lavalab", "Startup Incubator"],
      societies: ["BAP", "Marketing Association"],
      location: "Los Angeles"
    };
    
    const sampleObjective = "I want to cold email senior developers who work at Google about setting up coffee chats";
    
    // Generate the query using our service
    const generatedQuery = await generateLinkedInQuery(sampleProfile, sampleObjective);
    
    return NextResponse.json({ 
      success: true, 
      text: generatedQuery,
      sampleData: {
        profile: sampleProfile,
        objective: sampleObjective
      }
    });
  } catch (error: unknown) {
    console.error('Error calling Gemini API:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}

// Support for POST requests (user-provided data)
export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { userProfile, userObjective } = body;
    
    // Validate required fields
    if (!userProfile || !userObjective) {
      return NextResponse.json(
        { 
          success: false,
          error: 'userProfile and userObjective are required' 
        },
        { status: 400 }
      );
    }
    
    // Generate the query using our service
    const generatedQuery = await generateLinkedInQuery(userProfile, userObjective);
    
    return NextResponse.json({ 
      success: true, 
      text: generatedQuery
    });
  } catch (error: unknown) {
    console.error('Error calling Gemini API:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
} 