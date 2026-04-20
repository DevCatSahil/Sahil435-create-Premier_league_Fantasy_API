// src/main.jsx
// Only change needed here: render <Root /> instead of <App />

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Root from "./Root.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);