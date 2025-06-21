import type { Config } from "tailwindcss";

// This file is mostly for compatibility with tools that expect it
// Tailwind CSS v4 uses CSS-first configuration in src/index.css
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
} satisfies Config;
