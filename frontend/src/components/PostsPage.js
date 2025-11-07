import React, { useEffect, useState } from "react";
import axios from "../api";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const isGuest = token === "GUEST";

  useEffect(() => {
    if (isGuest) {
      setPosts([
        { _id: "d1", title: "Welcome post", content: "Browsing in guest mode." },
        { _id: "d2", title: "Try logging in", content: "Create and manage posts as Editor or Admin." },
      ]);
      return;
    }
    axios
      .get("/api/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  }, [isGuest]);

  return (
    <div className="container">
      <h2>Posts</h2>
      {error && <p>Error: {error}</p>}
      <div className="card">
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <ul>
            {posts.map((p) => (
              <li key={p._id}>
                <strong>{p.title}</strong> — {p.content}
                {(role === "Admin") && !isGuest && (
                  <button title="Delete post" className="btn btn--ghost" style={{ marginLeft: 8 }} onClick={async () => {
                    try { await axios.delete(`/api/posts/${p._id}`); setPosts((prev)=>prev.filter(x=>x._id!==p._id)); }
                    catch (e) { alert(e.response?.data?.message || "❌ Delete failed"); }
                  }}>Delete🗑️</button>
                )}
                {(role === "Admin" || role === "Editor") && !isGuest && (
                  <button title="Edit post" className="btn" style={{ marginLeft: 8 }} onClick={async () => {
                    const title = prompt("New title", p.title);
                    const content = prompt("New content", p.content);
                    if (title == null || content == null) return;
                    try { await axios.put(`/api/posts/${p._id}`, { title, content }); setPosts((prev)=>prev.map(x=>x._id===p._id?{...x,title,content}:x)); }
                    catch (e) { alert(e.response?.data?.message || "❌ Update failed"); }
                  }}>Edit✏️</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
