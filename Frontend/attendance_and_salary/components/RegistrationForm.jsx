"use client";
import { useState, useEffect } from "react";
import axios from "axios";

// Corrected port to 8081
const API_BASE = "http://localhost:8081/api";

export default function RegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  
  // Hydration fix: delay rendering until mounted on the client
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/staff/register`, { 
        name, 
        email 
      });
      setUser(res.data);
    } catch (err) {
      console.error("API Error:", err);
      setError(err.response?.data?.error || err.message || "Registration failed");
    }
  };

  // Hydration fix: prevent server-side render mismatch
  if (!isMounted) return null;

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "20px", color: "#111" }}>Staff Registration</h2>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter staff name"
          required
          style={{ 
            padding: "16px", 
            fontSize: "16px", 
            borderRadius: "8px", 
            border: "2px solid #ccc",
            outline: "none"
          }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          style={{ 
            padding: "16px", 
            fontSize: "16px", 
            borderRadius: "8px", 
            border: "2px solid #ccc",
            outline: "none"
          }}
        />
        <button 
          type="submit"
          style={{ 
            padding: "16px", 
            fontSize: "18px", 
            fontWeight: "bold", 
            backgroundColor: "#000", 
            color: "#fff", 
            border: "none", 
            borderRadius: "8px", 
            cursor: "pointer" 
          }}
        >
          Register
        </button>
      </form>

      {error && (
        <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "#ffe6e6", border: "2px solid #ff0000", color: "#cc0000", borderRadius: "8px", fontWeight: "bold" }}>
          {error}
        </div>
      )}

      {user && (
        <div style={{ marginTop: "24px", padding: "20px", border: "3px solid #000", borderRadius: "12px", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "20px" }}>Registration Successful</h3>
          <p style={{ fontSize: "16px", marginBottom: "8px" }}>User ID: <strong>{user.userId}</strong></p>
          <p style={{ fontSize: "16px", marginBottom: "16px", color: "#555" }}>Scan this QR code for attendance:</p>
          <img 
            src={user.qrCodeBase64} 
            alt="QR Code" 
            width={250} 
            style={{ margin: "0 auto", display: "block" }} 
          />
        </div>
      )}
    </div>
  );
}