import axios from 'axios';

export default async function handler(req, res) {
  const { endpoint } = req.query;
  
  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint parameter' });
  }

  try {
    const response = await axios.get(`https://www.reddit.com/${endpoint}.json`, {
      headers: {
        'User-Agent': 'Next.js Reddit Proxy/1.0'
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch from Reddit API',
      details: error.message
    });
  }
}
