import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

// Nuke the local storage on version bump

if (localStorage.getItem("storage-version") !== import.meta.env.VITE_STORAGE_VERSION) {
  localStorage.clear();

  localStorage.setItem("storage-version", import.meta.env.VITE_STORAGE_VERSION);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
