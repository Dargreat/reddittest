'use client';

import { useState } from 'react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchSubreddits = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    setResults([]);
    
    try {
      const response = await fetch(`/api/search?query=${searchTerm}`);
      const data = await response.json();
      
      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Reddit Subreddit Search</h1>
        
        <div className="flex mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search subreddits..."
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && searchSubreddits()}
          />
          <button
            onClick={searchSubreddits}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div className="space-y-4">
          {results.length > 0 ? (
            results.map((subreddit) => (
              <div key={subreddit.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center mb-2">
                  {subreddit.icon && (
                    <img 
                      src={subreddit.icon} 
                      alt={subreddit.name} 
                      className="w-10 h-10 rounded-full mr-3"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                  <div>
                    <h2 className="font-bold">
                      <a 
                        href={`https://reddit.com${subreddit.url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        r/{subreddit.name}
                      </a>
                    </h2>
                    <p className="text-gray-600">{subreddit.subscribers.toLocaleString()} subscribers</p>
                  </div>
                </div>
                <p className="font-semibold">{subreddit.title}</p>
                <p className="text-gray-700">{subreddit.description}</p>
              </div>
            ))
          ) : (
            !loading && <p className="text-center text-gray-500">No results found. Try searching for something like "programming" or "gaming"</p>
          )}
        </div>
      </div>
    </div>
  );
}
