import { NextResponse } from 'next/server';
import { searchUsers } from '@/services/linkd-api';
import { generateLinkedInQuery } from '@/services/gemini-api';

export async function POST(request: Request) {
  console.log(`[${new Date().toISOString()}] [linkd-search API] Request received`);
  const startTime = performance.now();
  
  try {
    // Parse request body
    const body = await request.json();
    const { userProfile, userObjective, limit, generatedQuery, alumniOnly = true } = body;
    
    console.log(`[${new Date().toISOString()}] [linkd-search API] Request body parsed. Looking for: ${generatedQuery}`);
    console.log(`[${new Date().toISOString()}] [linkd-search API] Requested limit: ${limit}`);
    console.log(`[${new Date().toISOString()}] [linkd-search API] Alumni only: ${alumniOnly}`);
    
    // Validate required fields
    if (!userProfile || !userObjective) {
      console.log(`[${new Date().toISOString()}] [linkd-search API] Missing required fields`);
      return NextResponse.json(
        { error: 'userProfile and userObjective are required' },
        { status: 400 }
      );
    }
    
    // Check for required profile fields
    const requiredFields = ['universityName', 'fullName', 'year', 'clubs', 'societies', 'location'];
    for (const field of requiredFields) {
      if (!userProfile[field]) {
        console.log(`[${new Date().toISOString()}] [linkd-search API] Missing required profile field: ${field}`);
        return NextResponse.json(
          { error: `${field} is required in userProfile` },
          { status: 400 }
        );
      }
    }
    
    let searchResults;
    const searchStartTime = performance.now();
    
    // If we have a query, use it directly
    if (generatedQuery) {
      console.log(`[${new Date().toISOString()}] [linkd-search API] Using provided query: "${generatedQuery}"`);
      
      // Only include school in search parameters if alumniOnly is true
      const schools = alumniOnly ? [userProfile.universityName] : [];
      
      if (schools.length > 0) {
        console.log(`[${new Date().toISOString()}] [linkd-search API] Searching for schools: ${schools.join(', ')}`);
      } else {
        console.log(`[${new Date().toISOString()}] [linkd-search API] Not filtering by school (alumni-only disabled)`);
      }
      
      // Use the direct search with the generated query
      searchResults = await searchUsers({
        query: generatedQuery,
        limit: limit || 10,
        school: schools
      });
    } else {
      console.log(`[${new Date().toISOString()}] [linkd-search API] No query provided`);
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }
    
    const searchEndTime = performance.now();
    console.log(`[${new Date().toISOString()}] [linkd-search API] Search completed in ${(searchEndTime - searchStartTime).toFixed(2)}ms`);
    console.log(`[${new Date().toISOString()}] [linkd-search API] Found ${searchResults.results ? searchResults.results.length : 0} results`);
    
    const endTime = performance.now();
    console.log(`[${new Date().toISOString()}] [linkd-search API] Request completed in ${(endTime - startTime).toFixed(2)}ms`);
    
    return NextResponse.json(searchResults);
  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] [linkd-search API] Error:`, error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred during search' },
      { status: 500 }
    );
  }
} 