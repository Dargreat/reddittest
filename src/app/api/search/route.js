export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  if (!query) {
    return new Response(JSON.stringify({ error: 'Missing search query' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const redditUrl = `https://www.reddit.com/subreddits/search.json?q=${encodeURIComponent(query)}`;
    const response = await fetch(redditUrl, {
      headers: { 
        'User-Agent': 'RedditSearchApp/1.0 (by /u/YourRedditUsername)' 
      }
    });
    
    // Check for non-200 responses
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Reddit API error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    // Validate Reddit response structure
    if (!data.data || !Array.isArray(data.data.children)) {
      throw new Error('Invalid response structure from Reddit API');
    }

    const subreddits = data.data.children.map(sub => ({
      id: sub.data.id,
      name: sub.data.display_name,
      title: sub.data.title,
      url: sub.data.url,
      subscribers: sub.data.subscribers,
      description: sub.data.public_description,
      icon: sub.data.icon_img || sub.data.community_icon || null
    }));

    return new Response(JSON.stringify(subreddits), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch subreddits',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
