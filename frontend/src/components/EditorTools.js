import React, { useState } from "react";
import axios from "../api";

export default function EditorTools() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("");

  const create = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await axios.post("/api/posts", { title, content });
      setMsg("✅ Post created");
      setTitle("");
      setContent("");
    } catch (e) {
      setMsg(e.response?.data?.message || e.message);
    }
  };

  return (
    <div className="container">
      <h2>Editor Tools</h2>
      <div className="card">
        <form onSubmit={create}>
          <input className="input" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required />
          <textarea className="input" placeholder="Content" value={content} onChange={(e)=>setContent(e.target.value)} required />
          <button className="btn" type="submit">Create Post</button>
        </form>
        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
}
