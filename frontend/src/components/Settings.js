import React from "react";

export default function Settings() {
  return (
    <div className="container">
      <h2>Settings</h2>
      <div className="card">
        <p>Theme: <span>Default</span></p>
        <p>Notifications: <span>Enabled</span></p>
        <p style={{ opacity: 0.8 }}>This is a demo settings page shown after login.</p>
      </div>
    </div>
  );
}
