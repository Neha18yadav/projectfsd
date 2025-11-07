import React, { useEffect, useState } from "react";
import axios from "../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, posts: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get("/api/admin/users"),
      axios.get("/api/posts"),
    ])
      .then(([u, p]) => setStats({ users: u.data.length, posts: p.data.length }))
      .catch((e) => setError(e.response?.data?.message || e.message));
  }, []);

  return (
    <div className="container">
      <h2>Admin Home</h2>
      <div className="card">
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            <p><strong>Total Users:</strong> {stats.users}</p>
            <p><strong>Total Posts:</strong> {stats.posts}</p>
          </>
        )}
      </div>
    </div>
  );
}
