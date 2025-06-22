import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

// Create root and render app
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <App />
        <Toaster />
      </ThemeProvider>
    </React.StrictMode>
  );
}
