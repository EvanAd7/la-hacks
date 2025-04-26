import { SearchParams, SearchResponse } from '@/types/index';

const API_BASE_URL = 'https://search.linkd.inc/api';
const authToken = process.env.LINKD_API_KEY || null;

// Function to search users
export const searchUsers = async (params: SearchParams): Promise<SearchResponse> => {
  try {
    const { query, limit = 10, school } = params;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('query', query);
    
    if (limit) {
      queryParams.append('limit', limit.toString());
    }
    
    if (school && school.length > 0) {
      school.forEach(s => queryParams.append('school', s));
    }
    
    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add auth token if available
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    // Make the request
    const response = await fetch(
      `${API_BASE_URL}/search/users?${queryParams.toString()}`,
      {
        method: 'GET',
        headers,
        next: {
          revalidate: 60, // Optional: Use Next.js revalidation (adjust as needed)
        },
      }
    );
    
    // Handle non-OK responses
    if (!response.ok) {
      // Handle 401 specifically
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        const errorDetail = errorData?.detail || "Invalid or expired API key";
        throw new Error(errorDetail);
      }
      
      // Handle other errors
      try {
        const errorData = await response.json();
        const errorMessage = 
          errorData.error || 
          errorData.detail || 
          errorData.message || 
          JSON.stringify(errorData);
        throw new Error(errorMessage);
      } catch (jsonError) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
    }
    
    // Parse and return successful response
    return await response.json() as SearchResponse;
    
  } catch (error) {
    // Handle fetch errors or errors thrown above
    if (error instanceof Error) {
      throw error;
    }
    
    // Generic error
    throw new Error('Failed to perform search. Please check your connection and try again.');
  }
};