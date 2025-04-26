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
  const [selectedProfiles, setSelectedProfiles] = useState<any[]>([]);
  const [generatingMessages, setGeneratingMessages] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageError, setMessageError] = useState<string | null>(null);
  
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
  
  const handleGenerateMessages = async () => {
    if (selectedProfiles.length === 0) {
      setMessageError("Please select at least one profile to generate a message");
      return;
    }
    
    setMessageError(null);
    setGeneratingMessages(true);
    setMessages([]);
    
    try {
      const response = await fetch('/api/generate-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          userObjective,
          selectedProfiles,
          bulkGenerate: selectedProfiles.length > 1
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setMessageError(data.error);
      } else if (data.success) {
        if (Array.isArray(data.results)) {
          setMessages(data.results);
        } else {
          setMessages([data.results]);
        }
      }
    } catch (err: any) {
      setMessageError(err.message || 'An error occurred generating messages');
    } finally {
      setGeneratingMessages(false);
    }
  };
  
  const handleAutoGenerateAllMessages = async () => {
    if (!results || !results.results || results.results.length === 0) {
      setMessageError("No profiles found to generate messages for");
      return;
    }
    
    setMessageError(null);
    setGeneratingMessages(true);
    setMessages([]);
    
    try {
      const response = await fetch('/api/generate-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          userObjective,
          autoGenerateAll: true,
          allProfiles: results.results
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setMessageError(data.error);
      } else if (data.success && data.filePath) {
        // Navigate to the messages page
        window.location.href = `/messages/${data.filePath.split('/').pop()}`;
      }
    } catch (err: any) {
      setMessageError(err.message || 'An error occurred generating messages');
    } finally {
      setGeneratingMessages(false);
    }
  };
  
  const toggleProfileSelection = (profile: any) => {
    if (selectedProfiles.some(p => p.profile.id === profile.profile.id)) {
      setSelectedProfiles(selectedProfiles.filter(p => p.profile.id !== profile.profile.id));
    } else {
      setSelectedProfiles([...selectedProfiles, profile]);
    }
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Search Results</h2>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleAutoGenerateAllMessages}
                disabled={!results || !results.results || results.results.length === 0 || generatingMessages}
                className={`px-3 py-1 text-sm rounded ${
                  !results || !results.results || results.results.length === 0 || generatingMessages
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                Auto-Generate All Messages
              </button>
              <button
                type="button"
                onClick={() => setSelectedProfiles(results.results || [])}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => setSelectedProfiles([])}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                Clear Selection
              </button>
            </div>
          </div>
          
          {results.results && results.results.length > 0 ? (
            <>
              <div className="space-y-4 mb-6">
                {results.results.map((user: any, index: number) => {
                  const isSelected = selectedProfiles.some(p => p.profile.id === user.profile.id);
                  
                  return (
                    <div 
                      key={index} 
                      className={`bg-white p-4 rounded border transition-colors ${
                        isSelected ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProfileSelection(user)}
                          className="mt-1 h-5 w-5 text-blue-600 rounded"
                        />
                        <div className="flex flex-1 items-center gap-4">
                          {user.profile.profile_picture_url && (
                            <img 
                              src={user.profile.profile_picture_url} 
                              alt={user.profile.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          )}
                          <div className="flex-1">
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
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleGenerateMessages}
                  disabled={selectedProfiles.length === 0 || generatingMessages}
                  className={`w-full p-3 rounded font-medium text-white ${
                    selectedProfiles.length === 0 || generatingMessages
                      ? 'bg-green-300'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {generatingMessages
                    ? 'Generating Messages...'
                    : `Generate Outreach ${selectedProfiles.length > 1 ? 'Messages' : 'Message'} (${selectedProfiles.length} selected)`}
                </button>
              </div>
            </>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}
      
      {messageError && (
        <div className="mt-6 bg-red-50 p-4 rounded-lg border border-red-200">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Error Generating Messages:</h2>
          <p>{messageError}</p>
        </div>
      )}
      
      {messages.length > 0 && (
        <div className="mt-6 bg-green-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Generated Outreach Messages</h2>
          
          <div className="space-y-6">
            {messages.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded border">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b">
                  {item.profile.profile.profile_picture_url && (
                    <img 
                      src={item.profile.profile.profile_picture_url} 
                      alt={item.profile.profile.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{item.profile.profile.name}</h3>
                    <p className="text-sm text-gray-600">{item.profile.profile.headline}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Outreach Message:</h4>
                  <div className="bg-gray-50 p-3 rounded whitespace-pre-wrap text-sm">
                    {item.message}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.message);
                      alert('Message copied to clipboard!');
                    }}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 