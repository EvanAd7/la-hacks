'use client';

import { useState } from 'react';

interface UserProfile {
  universityName: string;
  fullName: string;
  gradeYear: string;
  clubs: string[];
  societies: string[];
  location: string;
}

export default function LinkdSearchPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedQuery, setGeneratedQuery] = useState<string | null>(null);
  
  // Form state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    universityName: 'USC',
    fullName: 'John Smith',
    gradeYear: 'Senior',
    clubs: ['Robotics Club', 'AI Society'],
    societies: ['Phi Beta Kappa', 'Tau Beta Pi'],
    location: 'Los Angeles'
  });
  
  const [userObjective, setUserObjective] = useState(
    'I want to connect with software engineers at Google for internship opportunities'
  );
  
  const [searchLimit, setSearchLimit] = useState(5);
  const [additionalSchools, setAdditionalSchools] = useState<string[]>([]);
  const [additionalSchoolInput, setAdditionalSchoolInput] = useState('');
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);
    setGeneratedQuery(null);
    
    try {
      // First, get the generated query to show the user
      const queryResponse = await fetch('/api/gemini-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          userObjective
        }),
      });
      
      const queryData = await queryResponse.json();
      
      if (queryData.success && queryData.text) {
        setGeneratedQuery(queryData.text);
      }
      
      // Then, perform the actual search
      const searchResponse = await fetch('/api/linkd-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          userObjective,
          limit: searchLimit,
          additionalSchools: additionalSchools.length > 0 ? additionalSchools : undefined
        }),
      });
      
      const searchData = await searchResponse.json();
      
      if (searchData.error) {
        setError(searchData.error);
      } else {
        setResults(searchData);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to handle array input fields
  const handleArrayInput = (
    field: 'clubs' | 'societies',
    value: string
  ) => {
    setUserProfile({
      ...userProfile,
      [field]: value.split(',').map(item => item.trim())
    });
  };
  
  // Add function to handle adding additional schools
  const handleAddAdditionalSchool = () => {
    if (additionalSchoolInput.trim()) {
      setAdditionalSchools([...additionalSchools, additionalSchoolInput.trim()]);
      setAdditionalSchoolInput('');
    }
  };
  
  // Add function to remove an additional school
  const handleRemoveAdditionalSchool = (index: number) => {
    const updatedSchools = [...additionalSchools];
    updatedSchools.splice(index, 1);
    setAdditionalSchools(updatedSchools);
  };
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Linkd Search with Gemini</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">User Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                University Name
              </label>
              <input
                type="text"
                value={userProfile.universityName}
                onChange={(e) => setUserProfile({...userProfile, universityName: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={userProfile.fullName}
                onChange={(e) => setUserProfile({...userProfile, fullName: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade/Year
              </label>
              <select
                value={userProfile.gradeYear}
                onChange={(e) => setUserProfile({...userProfile, gradeYear: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={userProfile.location}
                onChange={(e) => setUserProfile({...userProfile, location: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clubs (comma separated)
              </label>
              <input
                type="text"
                value={userProfile.clubs.join(', ')}
                onChange={(e) => handleArrayInput('clubs', e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Societies (comma separated)
              </label>
              <input
                type="text"
                value={userProfile.societies.join(', ')}
                onChange={(e) => handleArrayInput('societies', e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Search Parameters</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Objective (What are you trying to accomplish?)
              </label>
              <textarea
                value={userObjective}
                onChange={(e) => setUserObjective(e.target.value)}
                className="w-full p-2 border rounded h-24"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Result Limit
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={searchLimit}
                onChange={(e) => setSearchLimit(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Schools (optional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={additionalSchoolInput}
                  onChange={(e) => setAdditionalSchoolInput(e.target.value)}
                  placeholder="Enter another university name"
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={handleAddAdditionalSchool}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Add
                </button>
              </div>
              
              {additionalSchools.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">Added Schools:</p>
                  <div className="flex flex-wrap gap-2">
                    {additionalSchools.map((school, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                      >
                        {school}
                        <button
                          type="button"
                          onClick={() => handleRemoveAdditionalSchool(index)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded font-medium text-white ${
            loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Searching...' : 'Search LinkedIn Profiles'}
        </button>
      </form>
      
      {generatedQuery && (
        <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Generated Query:</h2>
          <p className="italic">"{generatedQuery}"</p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-200">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Error:</h2>
          <p>{error}</p>
        </div>
      )}
      
      {results && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          
          {results.results && results.results.length > 0 ? (
            <div className="space-y-4">
              {results.results.map((user: any, index: number) => (
                <div key={index} className="bg-white p-4 rounded border">
                  <div className="flex items-center gap-4">
                    {user.profile.profile_picture_url && (
                      <img 
                        src={user.profile.profile_picture_url} 
                        alt={user.profile.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-lg">{user.profile.name}</h3>
                      <p className="text-gray-600">{user.profile.headline}</p>
                      <p className="text-sm text-gray-500">{user.profile.location}</p>
                      {user.profile.linkedin_url && (
                        <a 
                          href={user.profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View LinkedIn Profile
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}
    </div>
  );
} 