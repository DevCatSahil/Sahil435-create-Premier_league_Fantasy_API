// src/auth/LoginPage.jsx
// Handles both login and register in one component.
// On success it calls onSuccess(username) so the parent can swap to the dashboard.

import { useState } from "react";
import axios from "axios";

const API = "http://localhost:9090/api/auth";

export default function LoginPage({ onSuccess }) {
  // "login" or "register" — controls which endpoint we hit
  const [mode, setMode]         = useState("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");   // register only
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  // ── Switch tab ──────────────────────────────────────────────────────────────
  function switchMode(m) {
    setMode(m);
    setError("");
    setUsername("");
    setPassword("");
    setConfirm("");
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Basic client-side validation
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }
    if (mode === "register" && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (mode === "register" && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const url = mode === "login"
        ? `${API}/login`
        : `${API}/register`;

      const { data } = await axios.post(url, { username, password });

      // Save the token so App.jsx / axios can use it on every future request
      localStorage.setItem("pl_token",    data.token);
      localStorage.setItem("pl_username", username);

      onSuccess(username);

    } catch (err) {
      // Show the error message the backend sends, or a generic fallback
      const msg = err.response?.data?.error;
      setError(msg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    fontSize: 14,
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    outline: "none",
    boxSizing: "border-box",
    color: "#111827",
    background: "#fff",
  };

  const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 500,
    color: "#6b7280",
    marginBottom: 5,
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f9fafb",
      fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: "2rem",
        width: "100%",
        maxWidth: 380,
      }}>

        {/* ── Logo ── */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 40 }}>⚽</div>
          <h1 style={{ fontSize: 20, fontWeight: 500, margin: "8px 0 4px", color: "#111827" }}>
            Premier Zone
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
            {mode === "login" ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>

        {/* ── Tab toggle ── */}
        <div style={{
          display: "flex",
          background: "#f3f4f6",
          borderRadius: 8,
          padding: 3,
          marginBottom: 24,
        }}>
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{
                flex: 1,
                padding: "7px 0",
                fontSize: 13,
                fontWeight: 500,
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                background: mode === m ? "#fff" : "transparent",
                color: mode === m ? "#111827" : "#6b7280",
                transition: "all 0.15s",
              }}
            >
              {m === "login" ? "Sign in" : "Register"}
            </button>
          ))}
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit}>

          {/* Username */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: mode === "register" ? 14 : 20 }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              style={inputStyle}
            />
          </div>

          {/* Confirm password — only shown on register */}
          {mode === "register" && (
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                autoComplete="new-password"
                style={inputStyle}
              />
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div style={{
              background: "#FCEBEB",
              border: "1px solid #F7C1C1",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 13,
              color: "#A32D2D",
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              border: "none",
              borderRadius: 8,
              background: "#185FA5",
              color: "#fff",
              fontSize: 14,
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {loading
              ? "Please wait…"
              : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        {/* Hint for dev / testing */}
        {mode === "login" && (
          <p style={{
            textAlign: "center",
            fontSize: 12,
            color: "#9ca3af",
            marginTop: 16,
            marginBottom: 0,
          }}>
            Default admin:{" "}
            <code style={{ background: "#f3f4f6", padding: "1px 5px", borderRadius: 4 }}>admin</code>
            {" / "}
            <code style={{ background: "#f3f4f6", padding: "1px 5px", borderRadius: 4 }}>admin123</code>
          </p>
        )}
      </div>
    </div>
  );
}