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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  
  try {
    const redditUrl = `https://www.reddit.com/subreddits/search.json?q=${encodeURIComponent(query)}`;
    
    const response = await fetch(redditUrl, {
      signal: controller.signal,
      headers: { 
        'User-Agent': 'RedditSearchApp/1.0 (by /u/Bubbly-Afternoon-298)',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Reddit API error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data.children)) {
      throw new Error('Invalid Reddit response structure');
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
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      }
    });
  } catch (error) {
    console.error('API Error Details:', {
      error: error.message,
      query,
      timestamp: new Date().toISOString()
    });
    
    return new Response(JSON.stringify({ 
      error: 'Search failed',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
  }
}



