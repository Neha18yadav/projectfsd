import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Viewer");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await axios.post(
        "/api/auth/register",
        { name, email, password, role },
        { timeout: 10000 }
      );
      setMsg(res.data.message || "✅ Signup successful");
      navigate("/login", { replace: true });
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        setMsg("❌ Signup timed out. Is the API running on http://localhost:5050?");
      } else {
        setMsg("❌ " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card glass" style={{ maxWidth: 480 }}>
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <input
            className="input"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Signup"}
          </button>
        </form>
        <p>{msg}</p>
        <p style={{ opacity: 0.8 }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
