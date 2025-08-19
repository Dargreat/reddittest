export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return new Response(JSON.stringify({ error: "Missing search query" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const res = await fetch(
      `https://www.reddit.com/r/${query}/hot.json?limit=10`,
      {
        headers: {
          // Use your Reddit username in the User-Agent
          "User-Agent": "web:reddit-search-app:v1.0.0 (by /u/Miracle_Uchenna1)"
        }
      }
    );

    if (!res.ok) {
      throw new Error(`Reddit API error: ${res.status}`);
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Something went wrong" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
