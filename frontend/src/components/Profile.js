import React, { useEffect, useState } from "react";
import axios from "../api";

export default function Profile() {
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/api/protected/dashboard")
      .then((res) => setMe(res.data.user))
      .catch((err) => setError(err.response?.data?.message || err.message));
  }, []);

  return (
    <div className="container">
      <h2>My Profile</h2>
      <div className="card">
        {me ? (
          <>
            <p><strong>ID:</strong> {me.id}</p>
            <p><strong>Role:</strong> {me.role}</p>
          </>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
