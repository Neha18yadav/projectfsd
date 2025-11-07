import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./components/AdminPanel";
import Profile from "./components/Profile";
import PostsPage from "./components/PostsPage";
import Settings from "./components/Settings";
import AdminDashboard from "./components/AdminDashboard";
import AdminReports from "./components/AdminReports";
import EditorTools from "./components/EditorTools";
import EditorMyPosts from "./components/EditorMyPosts";
import ViewerExplore from "./components/ViewerExplore";
import "./App.css";

function Nav() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
  return (
    <nav className="nav">
      <div className="nav__inner">
        <div className="nav__brand"><Link to="/">RBAC</Link></div>
        <div className="nav__links">
          <Link to="/" className="nav__link">Home</Link>
          {!token && <Link to="/login" className="nav__link">Login</Link>}
          {!token && <Link to="/signup" className="nav__link">Signup</Link>}
          {token && <Link to="/dashboard" className="nav__link">Dashboard</Link>}
          {token && <Link to="/profile" className="nav__link">Profile</Link>}
          {token && <Link to="/posts" className="nav__link">Posts</Link>}
          {token && <Link to="/settings" className="nav__link">Settings</Link>}
          {role === "Admin" && <Link to="/admin" className="nav__link">Panel</Link>}
          {role === "Admin" && <Link to="/admin/home" className="nav__link">Admin Home</Link>}
          {role === "Admin" && <Link to="/admin/reports" className="nav__link">Reports</Link>}
          {role === "Editor" && <Link to="/editor/tools" className="nav__link">Editor Tools</Link>}
          {role === "Editor" && <Link to="/editor/myposts" className="nav__link">My Posts</Link>}
          {token && <Link to="/viewer/explore" className="nav__link">Explore</Link>}
        </div>
        <div className="nav__actions">
          {!token && <Link to="/signup" className="btn btn--primary btn--nav">Get Started</Link>}
          {token && (role === "Admin" || role === "Editor") && (
            <Link to="/editor/tools" className="btn btn--nav">Create</Link>
          )}
          {token && (
            <button
              className="btn btn--ghost btn--nav"
              onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
            >Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/posts" element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={["Admin"]}><AdminPanel /></ProtectedRoute>} />
          <Route path="/admin/home" element={<ProtectedRoute roles={["Admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute roles={["Admin"]}><AdminReports /></ProtectedRoute>} />
          <Route path="/editor/tools" element={<ProtectedRoute roles={["Admin","Editor"]}><EditorTools /></ProtectedRoute>} />
          <Route path="/editor/myposts" element={<ProtectedRoute roles={["Admin","Editor"]}><EditorMyPosts /></ProtectedRoute>} />
          <Route path="/viewer/explore" element={<ProtectedRoute roles={["Admin","Editor","Viewer"]}><ViewerExplore /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}
