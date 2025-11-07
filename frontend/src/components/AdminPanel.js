import React, { useEffect, useState } from "react";
import axios from "../api";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await axios.put(`/api/admin/users/${id}/role`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="container">Loading users...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <div className="container">
      <h2>Admin Panel</h2>
      <table style={{ width: "100%", maxWidth: 600 }}>
        <thead>
          <tr>
            <th align="center">Name</th>
            <th align="center">Email</th>
            <th align="center">Role</th>
            <th align="center">Provider</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)}>
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </td>
              <td>{u.provider}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
