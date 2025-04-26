import { NextResponse } from 'next/server';
import { generateOutreachMessage, generateBulkOutreachMessages, saveMessagesToFile } from '@/services/message-generator';
import { UserResult } from '@/types';

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { 
      userProfile, 
      userObjective, 
      selectedProfiles, 
      bulkGenerate = false,
      autoGenerateAll = false,
      allProfiles = []
    } = body;
    
    // Validate required fields for normal message generation
    if (!userProfile || !userObjective) {
      return NextResponse.json(
        { error: 'userProfile and userObjective are required' },
        { status: 400 }
      );
    }
    
    // For auto generation mode, we use all profiles
    if (autoGenerateAll) {
      if (!Array.isArray(allProfiles) || allProfiles.length === 0) {
        return NextResponse.json(
          { error: 'No profiles available for automatic message generation' },
          { status: 400 }
        );
      }
      
      // Generate messages for all profiles
      const results = await generateBulkOutreachMessages(
        userProfile,
        userObjective,
        allProfiles as UserResult[]
      );
      
      // Save messages to a JSON file
      const filePath = await saveMessagesToFile(userProfile, userObjective, results);
      
      return NextResponse.json({
        success: true,
        results,
        filePath
      });
    }
    
    // Regular message generation (for selected profiles)
    if (!Array.isArray(selectedProfiles)) {
      return NextResponse.json(
        { error: 'selectedProfiles must be an array' },
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
      if (selectedProfiles.length === 0) {
        return NextResponse.json(
          { error: 'At least one profile must be selected' },
          { status: 400 }
        );
      }
      
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
    console.error('Error generating messages:', error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while generating messages' },
      { status: 500 }
    );
  }
} 