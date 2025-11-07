import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "../api";
const hasGoogleClientId = !!(process.env.REACT_APP_GOOGLE_CLIENT_ID);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await axios.post("/api/auth/login", { email, password }, { timeout: 10000 });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      setMsg("✅ Login successful!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card glass" style={{ maxWidth: 420 }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="divider" />

        {hasGoogleClientId ? (
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const credential = credentialResponse?.credential;
                if (!credential) {
                  setMsg("❌ Google login failed: missing credential");
                  return;
                }
                const res = await axios.post("/api/auth/google", { credential });
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("role", res.data.user.role);
                setMsg("✅ Logged in with Google");
                navigate("/dashboard", { replace: true });
              } catch (err) {
                setMsg("❌ " + (err.response?.data?.message || err.message));
              }
            }}
            onError={() => setMsg("❌ Google login failed")}
            useOneTap
          />
        ) : (
          <div style={{ opacity: 0.8, marginBottom: "0.5rem" }}>
          </div>
        )}

        <button
          className="btn btn--ghost"
          type="button"
          onClick={() => {
            // Client-only guest session (no backend required)
            localStorage.setItem("token", "GUEST");
            localStorage.setItem("role", "Viewer");
            navigate("/dashboard", { replace: true });
          }}
        >
          Continue as Guest
        </button>

        <p>{msg}</p>
        <p style={{ opacity: 0.8 }}>
          No account? <Link to="/signup">SignUp</Link>
        </p>
      </div>
    </div>
  );
}
