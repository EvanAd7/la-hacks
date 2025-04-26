import { NextResponse } from 'next/server';
import { searchUsersWithAI, searchUsers } from '@/services/linkd-api';

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { userProfile, userObjective, limit, additionalSchools, generatedQuery } = body;
    
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
    
    let searchResults;
    
    // If we have a generated query from Gemini, use it directly
    if (generatedQuery) {
      // Create a schools array that includes the user's university
      const schools = [userProfile.universityName];
      
      // Add any additional schools if provided
      if (additionalSchools && additionalSchools.length > 0) {
        schools.push(...additionalSchools);
      }
      
      // Use the direct search with the generated query
      searchResults = await searchUsers({
        query: generatedQuery,
        limit: limit || 10,
        school: schools
      });
    } else {
      // Use the AI-powered search that will generate its own query
      searchResults = await searchUsersWithAI(
        userProfile,
        userObjective,
        limit || 10,
        additionalSchools
      );
    }
    
    return NextResponse.json(searchResults);
  } catch (error: any) {
    console.error('Error in Linkd search:', error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred during search' },
      { status: 500 }
    );
  }
} 