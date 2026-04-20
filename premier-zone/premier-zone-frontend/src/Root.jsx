// src/Root.jsx

import { useState } from "react";
import LoginPage from "./auth/LoginPage";
import App from "./App.js";
import {
  getUsername,
  isLoggedIn,
  clearAuth,
  setupAxiosInterceptors,
} from "./auth/AuthUtils";

let interceptorsReady = false;

export default function Root() {
  // isLoggedIn() now checks BOTH that a token exists AND that it isn't expired.
  // If the token is stale, it clears localStorage and returns false automatically.
  const [user, setUser] = useState(() => isLoggedIn() ? getUsername() : null);

  if (!interceptorsReady) {
    setupAxiosInterceptors(() => setUser(null));
    interceptorsReady = true;
  }

  function handleLogin(username) {
    setUser(username);
  }

  function handleLogout() {
    clearAuth();
    setUser(null);
  }

  if (!user) {
    return <LoginPage onSuccess={handleLogin} />;
  }

  return <App username={user} onLogout={handleLogout} />;
}