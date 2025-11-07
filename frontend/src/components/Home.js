import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function Home() {
  const navigate = useNavigate();
  const hasToken = !!localStorage.getItem("token");

  const loginAsGuest = () => {
    // Client-only guest session (no backend required)
    localStorage.setItem("token", "GUEST");
    localStorage.setItem("role", "Viewer");
    navigate("/dashboard", { replace: true });
  };

  return (
    <section className="home">
      <div className="home__content">
        <h1>RBAC</h1>
        <p>Role-based auth with posts. Sign up, log in, and manage posts.</p>
        <div className="home__actions">
          {hasToken ? (
            <Link to="/dashboard" className="btn">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/signup" className="btn btn--primary">Get Started</Link>
              <Link to="/login" className="btn">Login</Link>
              <button className="btn" type="button" onClick={loginAsGuest}>Browse as Guest</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
