import React, { useEffect, useState } from "react";
import axios from "../api";

export default function AdminReports() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get("/api/admin/users"),
      axios.get("/api/posts"),
    ])
      .then(([u, p]) => { setUsers(u.data); setPosts(p.data); })
      .catch((e) => setError(e.response?.data?.message || e.message));
  }, []);

  return (
    <div className="container">
      <h2>Reports</h2>
      {error && <p>Error: {error}</p>}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <h3>Users by Role</h3>
        <ul>
          {Object.entries(users.reduce((acc, u) => { acc[u.role] = (acc[u.role]||0)+1; return acc; }, {})).map(([role, count]) => (
            <li key={role}><strong>{role}:</strong> {count}</li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h3>Recent Posts</h3>
        <ul>
          {posts.slice(0, 10).map((p) => (
            <li key={p._id}><strong>{p.title}</strong> — {p.content}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
