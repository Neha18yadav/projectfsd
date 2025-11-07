import React, { useEffect, useState } from "react";
import axios from "../api";

export default function ViewerExplore() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const isGuest = token === "GUEST";

  useEffect(() => {
    if (isGuest) {
      setPosts([
        { _id: "d1", title: "Welcome post", content: "Browsing in guest mode." },
        { _id: "d2", title: "Explore content", content: "Login to create and edit posts." },
      ]);
      return;
    }
    axios.get("/api/posts").then((res) => setPosts(res.data)).catch((e)=>setError(e.response?.data?.message || e.message));
  }, [isGuest]);

  return (
    <div className="container">
      <h2>Explore</h2>
      {error && <p>Error: {error}</p>}
      <div className="card">
        {posts.length === 0 ? (
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
