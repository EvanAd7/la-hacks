import { NextResponse } from 'next/server';
import { searchUsersWithAI } from '@/services/linkd-api';

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { userProfile, userObjective, limit, additionalSchools } = body;
    
    // Validate required fields
    if (!userProfile || !userObjective) {
      return NextResponse.json(
        { error: 'userProfile and userObjective are required' },
        { status: 400 }
      );
    }
    
    // Check for required profile fields
    const requiredFields = ['universityName', 'fullName', 'gradeYear', 'clubs', 'societies', 'location'];
    for (const field of requiredFields) {
      if (!userProfile[field]) {
        return NextResponse.json(
          { error: `${field} is required in userProfile` },
          { status: 400 }
        );
      }
    }
    
    // Perform the AI-powered search
    const searchResults = await searchUsersWithAI(
      userProfile,
      userObjective,
      limit || 10,
      additionalSchools
    );
    
    return NextResponse.json(searchResults);
  } catch (error: any) {
    console.error('Error in Linkd search:', error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred during search' },
      { status: 500 }
    );
  }
} 