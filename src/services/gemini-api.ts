import { GoogleGenAI } from "@google/genai";

// Use environment variable for the API key
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

// Define an interface for user profile
interface UserProfile {
  universityName: string;
  fullName: string;
  gradeYear: string;
  clubs: string[];
  societies: string[];
  location: string;
}

// Function to generate LinkedIn query
export async function generateLinkedInQuery(userProfile: any, userObjective: string) {
  console.log(`[${new Date().toISOString()}] [gemini-api] Generating search query for: "${userObjective}"`);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: 
      `You are helping to generate a prompt for the Linkd API which is a model that takes in the user's university name and its query to find a list of linkedin profiles.

      Your task is to generate this query for the Linkd API to return the most appropriate list of LinkedIn profiles.

      There is only 1 input you should consider when generating the query:
      Their desired objective: ${userObjective}
         (Our app helps users cold email people based on this objective)

      Generate a prompt for the Linkd API that returns the most appropriate list of LinkedIn Profiles.
      
      While input query is asking for cold emails or coffee chats, the linkd API only searches for keywords that appear on a traditional linkedin profile. Therefore, phrases like "coffee chats" or "summer internships" will not be found.
      Therefore, extract the most important information from the user's objective and use that to generate the query.
      
      An example query format would be:
      "Recruiters who work at Google"
      
      Your generated query should follow this example format but be tailored to the user's specific profile and objective. Make sure its format is correct and punctuated properly.
      That is, remove any quotations marks, they are not needed.
      `,
    });
    
    const generatedQuery = response.text;
    console.log(`[${new Date().toISOString()}] [gemini-api] Generated query: "${generatedQuery}"`);
    
    return generatedQuery;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [gemini-api] Error:`, error);
    throw error;
  }
}
