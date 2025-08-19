"use client";
import { useState } from "react";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError("");
    setPosts([]);

    try {
      const res = await fetch(`/api/search?query=${query}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setPosts(data.data.children || []);
      }
    } catch (err) {
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🔎 Reddit Subreddit Search</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter subreddit name (e.g. javascript)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading posts...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.data.id} className="border p-4 rounded shadow">
            <a
              href={`https://reddit.com${post.data.permalink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-lg hover:underline"
            >
              {post.data.title}
            </a>
            <p className="text-sm text-gray-600">
              👍 {post.data.ups} | 💬 {post.data.num_comments}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
