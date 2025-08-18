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
      headers: { 'User-Agent': 'Next.js Reddit Search/1.0' }
    });
    
    if (!response.ok) {
      throw new Error(`Reddit API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Format response
    const subreddits = data.data.children.map(sub => ({
      id: sub.data.id,
      name: sub.data.display_name,
      title: sub.data.title,
      url: sub.data.url,
      subscribers: sub.data.subscribers,
      description: sub.data.public_description,
      icon: sub.data.icon_img || sub.data.community_icon
    }));

    return new Response(JSON.stringify(subreddits), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Reddit API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch subreddits',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
