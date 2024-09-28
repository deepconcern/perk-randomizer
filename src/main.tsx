import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

// Nuke the local storage on version bump
const storageVersion = localStorage.getItem("storage-version");

if (storageVersion !== import.meta.env.VITE_STORAGE_VERSION) {
  for (let keyIndex = 0, length = localStorage.length; keyIndex < length; keyIndex++) {
    const key = localStorage.key(keyIndex);

    if (!key) continue;

    localStorage.removeItem(key);
  }

  localStorage.setItem("storage-version", import.meta.env.VITE_STORAGE_VERSION);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
