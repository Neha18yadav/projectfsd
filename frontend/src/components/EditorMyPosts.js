import React, { useEffect, useState } from "react";
import axios from "../api";

export default function EditorMyPosts() {
  const [me, setMe] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("/api/protected/me").then((res) => setMe(res.data.user));
  }, []);

  useEffect(() => {
    if (!me) return;
    axios.get("/api/posts").then((res) => {
      setPosts(res.data.filter((p) => p.userId === me.id || p.userId?._id === me.id));
    }).catch((e)=>setError(e.response?.data?.message || e.message));
  }, [me]);

  return (
    <div className="container">
      <h2>My Posts</h2>
      {error && <p>Error: {error}</p>}
      <div className="card">
        {!me ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <ul>
            {posts.map((p) => (
              <li key={p._id}><strong>{p.title}</strong> — {p.content}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
