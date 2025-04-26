import { NextResponse } from 'next/server';
import { generateOutreachMessage, generateBulkOutreachMessages } from '@/services/message-generator';
import { UserResult } from '@/services/linkd-api';

export async function POST(request: Request) {
  console.log(`[${new Date().toISOString()}] [generate-messages API] Request received`);
  
  try {
    // Parse request body
    const body = await request.json();
    const { 
      userProfile, 
      userObjective, 
      selectedProfiles, 
      bulkGenerate = false
    } = body;
    
    // Validate required fields
    if (!userProfile || !userObjective) {
      console.log(`[${new Date().toISOString()}] [generate-messages API] Missing required fields`);
      return NextResponse.json(
        { error: 'userProfile and userObjective are required' },
        { status: 400 }
      );
    }
    
    // Validate profiles
    if (!Array.isArray(selectedProfiles) || selectedProfiles.length === 0) {
      console.log(`[${new Date().toISOString()}] [generate-messages API] No profiles selected`);
      return NextResponse.json(
        { error: 'At least one profile must be selected' },
        { status: 400 }
      );
    }
    
    // Generate messages based on the selected mode
    let results;
    
    if (bulkGenerate) {
      // Generate messages for all selected profiles
      results = await generateBulkOutreachMessages(
        userProfile,
        userObjective,
        selectedProfiles as UserResult[]
      );
    } else {
      // Generate a message for just the first selected profile
      const message = await generateOutreachMessage(
        userProfile,
        userObjective,
        selectedProfiles[0] as UserResult
      );
      
      results = {
        profile: selectedProfiles[0],
        message
      };
    }
    
    return NextResponse.json({
      success: true,
      results
    });
  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] [generate-messages API] Error:`, error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while generating messages' },
      { status: 500 }
    );
  }
}