// src/auth/authUtils.js

import axios from "axios";

// ── Token helpers ─────────────────────────────────────────────────────────────

export function getToken()    { return localStorage.getItem("pl_token"); }
export function getUsername() { return localStorage.getItem("pl_username"); }

export function saveAuth(token, username) {
  localStorage.setItem("pl_token",    token);
  localStorage.setItem("pl_username", username);
}

export function clearAuth() {
  localStorage.removeItem("pl_token");
  localStorage.removeItem("pl_username");
}

// ── Token expiry check ────────────────────────────────────────────────────────
// A JWT is three Base64 parts separated by dots: header.payload.signature
// The payload contains an "exp" field (Unix timestamp in seconds).
// We decode it client-side to check if it's expired WITHOUT hitting the server.

export function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // exp is in seconds, Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // if we can't decode it, treat it as expired
  }
}

// Returns true only if a token exists AND is not expired
export function isLoggedIn() {
  const token = getToken();
  if (!token) return false;
  if (isTokenExpired(token)) {
    clearAuth(); // clean up stale token automatically
    return false;
  }
  return true;
}

// ── Axios interceptor ─────────────────────────────────────────────────────────
// Call this once at app startup. After this, every axios request automatically
// carries "Authorization: Bearer <token>" — no manual headers needed anywhere.

export function setupAxiosInterceptors(onUnauthorized) {
  // REQUEST: attach token to every outgoing request
  axios.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // RESPONSE: if the server returns 401, clear auth and show login page
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        clearAuth();
        onUnauthorized();
      }
      return Promise.reject(error);
    }
  );
}