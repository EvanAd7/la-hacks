import { GoogleGenAI } from "@google/genai";
import { UserResult } from "@/services/linkd-api";

// Interface for the user's profile information
interface UserProfile {
  universityName: string;
  fullName: string;
  year: string;
  clubs: string[];
  societies: string[];
  location: string;
}

// Interface for the message format
export interface MessageEntry {
  linkedinURL: string;
  coldMessage: string;
}

// Interface for the messages collection
export interface MessagesCollection {
  messages: MessageEntry[];
}

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

/**
 * Generate a personalized outreach message for a LinkedIn connection
 * 
 * @param userProfile - The sender's profile information
 * @param userObjective - What the sender wants to achieve (e.g., internship, coffee chat)
 * @param targetProfile - The LinkedIn profile of the person to contact
 * @returns A personalized message for outreach
 */
export async function generateOutreachMessage(
  userProfile: UserProfile,
  userObjective: string,
  targetProfile: UserResult
): Promise<string> {
  console.log(`[${new Date().toISOString()}] [message-generator] Generating message for ${targetProfile.profile.name}`);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
      You are an expert in professional communication and cold outreach emails. Your task is to draft a personalized, concise, and effective outreach message.

      Here's information about the sender:
      - Name: ${userProfile.fullName}
      - University: ${userProfile.universityName}
      - Year/Grade: ${userProfile.year}
      - Clubs: ${userProfile.clubs.join(', ')}
      - Societies: ${userProfile.societies.join(', ')}
      - Location: ${userProfile.location}

      Their objective is: "${userObjective}"

      Here's information about the recipient (from LinkedIn):
      - Name: ${targetProfile.profile.name}
      - Current Title: ${targetProfile.profile.title || targetProfile.profile.headline || 'Professional'}
      - Location: ${targetProfile.profile.location || 'Unknown'}
      ${targetProfile.experience && targetProfile.experience.length > 0 ? 
        `- Current Company: ${targetProfile.experience[0].company_name}
        - Role: ${targetProfile.experience[0].title}` : ''}
      ${targetProfile.education && targetProfile.education.length > 0 ? 
        `- Education: ${targetProfile.education.map(edu => 
          `${edu.school_name} (${edu.degree || ''} ${edu.field_of_study || ''})`).join(', ')}` : ''}

      Draft a personalized LinkedIn/email message that the sender can use to reach out to the recipient. The message should:
      1. Be concise (max 5-7 sentences)
      2. Include a personalized greeting
      3. Briefly introduce the sender
      4. Establish a common connection (university, location, industry, etc.)
      5. Clearly state the purpose aligned with the sender's objective
      6. Include a specific, low-commitment ask (e.g., 15-minute call)
      7. End with a polite closing

      IMPORTANT INSTRUCTIONS:
      - Return only the message text without any additional explanations or notes.
      - No subject line needed at the beginning of the message.
      - NEVER include placeholder text like "[mention X if known]" or "[insert Y here]" - only use information that is actually provided.
      - If information is missing, craft the message without mentioning it - do not include placeholders or instructions.
      - Focus on being genuine, specific, and respectful of the recipient's time.
      - Avoid generic templates or overly formal language.
      `,
    });

    // Extract the generated message from the response
    const message = response.text || "Failed to generate a message. Please try again.";
    
    return message;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [message-generator] Error:`, error);
    throw error;
  }
}

/**
 * Generate personalized outreach messages for multiple LinkedIn profiles
 * 
 * @param userProfile - The sender's profile information
 * @param userObjective - What the sender wants to achieve
 * @param targetProfiles - Array of LinkedIn profiles to contact
 * @returns Array of generated messages with profile information
 */
export async function generateBulkOutreachMessages(
  userProfile: UserProfile,
  userObjective: string,
  targetProfiles: UserResult[]
): Promise<Array<{profile: UserResult, message: string}>> {
  console.log(`[${new Date().toISOString()}] [message-generator] Generating messages for ${targetProfiles.length} profiles`);
  
  const results = [];
  
  // Generate messages for each profile (sequentially to avoid rate limits)
  for (let i = 0; i < targetProfiles.length; i++) {
    const profile = targetProfiles[i];
    
    try {
      const message = await generateOutreachMessage(userProfile, userObjective, profile);
      results.push({
        profile,
        message
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] [message-generator] Error generating message for ${profile.profile.name}:`, error);
      results.push({
        profile,
        message: "Failed to generate a personalized message."
      });
    }
  }
  
  return results;
}
