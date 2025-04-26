export interface Experience {
    title: string;
    company_name: string;
    start_date: string;
    end_date: string | null;
    description: string;
    location: string;
    company_logo: string;
  }
  
  export interface Education {
    degree: string;
    field_of_study: string;
    school_name: string;
    start_date: string;
    end_date: string;
    description: string;
    school_logo: string;
  }
  
  export interface Profile {
    id: string;
    name: string;
    location: string;
    headline: string;
    description: string;
    title: string;
    profile_picture_url: string;
    linkedin_url: string;
  }
  
  export interface UserResult {
    profile: Profile;
    experience: Experience[];
    education: Education[];
  }
  
  export interface SearchResponse {
    results: UserResult[];
    total: number;
    query: string;
    error: string | null;
  }
  
  export interface SearchParams {
    query: string;
    limit?: number;
    school?: string[];
  } 