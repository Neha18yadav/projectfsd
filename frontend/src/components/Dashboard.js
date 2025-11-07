import "./Dashboard.css";
import React, { useEffect, useState } from "react";
import axios from "../api";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [role, setRole] = useState(localStorage.getItem("role"));
  const token = localStorage.getItem("token");
  const isGuest = token === "GUEST";

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (!role) {
      const savedRole = localStorage.getItem("role");
      if (savedRole) setRole(savedRole);
    }

    if (isGuest) {
      // Demo data for guest mode (no backend calls)
      setPosts([
        { _id: "d1", title: "Welcome post", content: "Browsing in guest mode." },
        { _id: "d2", title: "Try logging in", content: "Create and manage posts as Editor or Admin." },
      ]);
      return;
    }

    axios
      .get("/api/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, [token, role]);

  const createPost = async () => {
    if (isGuest) {
      alert("Guest mode: creating posts is disabled.");
      return;
    }
    const title = prompt("Enter post title:");
    const content = prompt("Enter post content:");
    try {
      await axios.post("/api/posts", { title, content });
      alert("✅ Post created!");
      window.location.reload();
    } catch (err) {
      alert("❌ You don’t have permission to create posts.");
    }
  };

  const deletePost = async (id) => {
    if (isGuest) {
      alert("Guest mode: deleting posts is disabled.");
      return;
    }
    try {
      await axios.delete(`/api/posts/${id}`);
      alert("🗑️ Post deleted!");
      window.location.reload();
    } catch (e) {
      alert(e.response?.data?.message || "❌ Delete failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="container">
      <h1>Welcome, {role}</h1>
      {role !== "Viewer" && (
        <button onClick={createPost}>➕ Create Post</button>
      )}

      <ul>
        {posts.map((p) => (
          <li key={p._id}>
            <strong>{p.title}</strong> — {p.content}
            {role === "Admin" && (
              <button title="Delete post" onClick={() => deletePost(p._id)}>🗑️ Delete</button>
            )}
          </li>
        ))}
      </ul>

      <button onClick={logout} title="Clear session and go to Login">🚪 Logout</button>
    </div>
  );
}
