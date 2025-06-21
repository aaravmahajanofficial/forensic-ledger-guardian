
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Modern brand colors
        brand: {
          50: "hsl(var(--brand-50))",
          100: "hsl(var(--brand-100))",
          200: "hsl(var(--brand-200))",
          300: "hsl(var(--brand-300))",
          400: "hsl(var(--brand-400))",
          500: "hsl(var(--brand-500))",
          600: "hsl(var(--brand-600))",
          700: "hsl(var(--brand-700))",
          800: "hsl(var(--brand-800))",
          900: "hsl(var(--brand-900))",
        },
        security: {
          50: "hsl(var(--security-50))",
          100: "hsl(var(--security-100))",
          200: "hsl(var(--security-200))",
          300: "hsl(var(--security-300))",
          400: "hsl(var(--security-400))",
          500: "hsl(var(--security-500))",
          600: "hsl(var(--security-600))",
          700: "hsl(var(--security-700))",
          800: "hsl(var(--security-800))",
          900: "hsl(var(--security-900))",
        },
        warning: {
          50: "hsl(var(--warning-50))",
          100: "hsl(var(--warning-100))",
          200: "hsl(var(--warning-200))",
          300: "hsl(var(--warning-300))",
          400: "hsl(var(--warning-400))",
          500: "hsl(var(--warning-500))",
          600: "hsl(var(--warning-600))",
          700: "hsl(var(--warning-700))",
          800: "hsl(var(--warning-800))",
          900: "hsl(var(--warning-900))",
        },
        danger: {
          50: "hsl(var(--danger-50))",
          100: "hsl(var(--danger-100))",
          200: "hsl(var(--danger-200))",
          300: "hsl(var(--danger-300))",
          400: "hsl(var(--danger-400))",
          500: "hsl(var(--danger-500))",
          600: "hsl(var(--danger-600))",
          700: "hsl(var(--danger-700))",
          800: "hsl(var(--danger-800))",
          900: "hsl(var(--danger-900))",
        },
        evidence: {
          50: "hsl(var(--evidence-50))",
          100: "hsl(var(--evidence-100))",
          200: "hsl(var(--evidence-200))",
          300: "hsl(var(--evidence-300))",
          400: "hsl(var(--evidence-400))",
          500: "hsl(var(--evidence-500))",
          600: "hsl(var(--evidence-600))",
          700: "hsl(var(--evidence-700))",
          800: "hsl(var(--evidence-800))",
          900: "hsl(var(--evidence-900))",
        },
        legal: {
          50: "hsl(var(--legal-50))",
          100: "hsl(var(--legal-100))",
          200: "hsl(var(--legal-200))",
          300: "hsl(var(--legal-300))",
          400: "hsl(var(--legal-400))",
          500: "hsl(var(--legal-500))",
          600: "hsl(var(--legal-600))",
          700: "hsl(var(--legal-700))",
          800: "hsl(var(--legal-800))",
          900: "hsl(var(--legal-900))",
        },
        dark: {
          50: "hsl(var(--dark-50))",
          100: "hsl(var(--dark-100))",
          200: "hsl(var(--dark-200))",
          300: "hsl(var(--dark-300))",
          400: "hsl(var(--dark-400))",
          500: "hsl(var(--dark-500))",
          600: "hsl(var(--dark-600))",
          700: "hsl(var(--dark-700))",
          800: "hsl(var(--dark-800))",
          900: "hsl(var(--dark-900))",
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out", 
        "slide-up": "slide-up 0.4s ease-out",
        "slide-down": "slide-down 0.4s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 1s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite linear",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" }
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        "glow": {
          "0%": { "box-shadow": "0 0 5px rgb(14 165 233 / 0.5)" },
          "100%": { "box-shadow": "0 0 20px rgb(14 165 233 / 0.8), 0 0 30px rgb(14 165 233 / 0.4)" }
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" }
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" }
        },
        "shimmer": {
          "0%": { "background-position": "-200% 0" },
          "100%": { "background-position": "200% 0" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        }
      },
      boxShadow: {
        "brand": "0 4px 14px 0 hsl(var(--brand-500) / 0.15)",
        "security": "0 4px 14px 0 hsl(var(--security-500) / 0.15)",
        "warning": "0 4px 14px 0 hsl(var(--warning-500) / 0.15)",
        "danger": "0 4px 14px 0 hsl(var(--danger-500) / 0.15)",
        "glow": "0 0 20px hsl(var(--primary) / 0.3)",
        "glow-sm": "0 0 10px hsl(var(--primary) / 0.2)",
        "glow-lg": "0 0 30px hsl(var(--primary) / 0.4)",
      },
      backdropBlur: {
        "xs": "2px",
        "3xl": "64px",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      screens: {
        "xs": "480px",
        "3xl": "1920px",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [],
} satisfies Config;
