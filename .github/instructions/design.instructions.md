---
applyTo: "**"
---

Here’s a **Design Document** for a modern and professional visual overhaul of **Forensic Ledger Guardian** website, focused on conveying **trust, innovation, security, and clarity** – which are critical for a blockchain-based forensic evidence management system.

---

# 🎨 **Design Document: Forensic Ledger Guardian – Visual Redesign**

## 🎯 Goals

* Establish **professionalism** and **credibility**
* Emphasize **security**, **integrity**, and **transparency**
* Deliver a **clean, modern, and intuitive user experience**
* Ensure responsiveness across devices
* Maintain existing functionality while updating visual aesthetics

---

## 🧱 1. Design Principles

| Principle         | Description                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------- |
| **Clarity**       | Prioritize legibility and content hierarchy. Use whitespace effectively.                    |
| **Trust**         | Use a sober, professional color palette that reflects seriousness and dependability.        |
| **Innovation**    | Add subtle motion, gradients, and modern UI elements to signal cutting-edge technology.     |

---

## 🎨 2. Color Palette

| Purpose                | Color         | Hex Code  | Notes                                 |
| ---------------------- | ------------- | --------- | ------------------------------------- |
| **Primary Color**      | Deep Navy     | `#1C1F2A` | Represents professionalism & security |
| **Secondary Color**    | Cerulean Blue | `#1976D2` | Adds contrast and a modern tech feel  |
| **Accent Color**       | Emerald Green | `#2ECC71` | Suggests success, verification, trust |
| **Background (light)** | Ghost White   | `#F9FAFB` | Clean and minimal background          |
| **Background (dark)**  | Charcoal Grey | `#121212` | For dark mode toggle                  |
| **Text (primary)**     | Jet Black     | `#202124` | For high contrast and readability     |
| **Text (secondary)**   | Slate Grey    | `#5F6368` | Subtle, used for secondary labels     |
| **Error**              | Crimson Red   | `#E53935` | For error messages or alerts          |
| **Warning**            | Amber         | `#FFB300` | For caution or pending statuses       |

---

## 🔤 3. Typography

### **Primary Typeface**

* **Font Family:** `Inter`, sans-serif
* **Backup Stack:** `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
* **Why Inter?** Clean, geometric, legible, designed for screen UIs.

### **Type Scale**

| Type         | Size | Weight | Usage                 |
| ------------ | ---- | ------ | --------------------- |
| Heading 1    | 36px | 700    | Hero titles           |
| Heading 2    | 28px | 600    | Section headers       |
| Heading 3    | 22px | 600    | Subsection headers    |
| Body Large   | 18px | 400    | Paragraphs, long-form |
| Body Regular | 16px | 400    | Labels, general text  |
| Caption      | 14px | 400    | Metadata, tooltips    |

Use **rem units** in CSS (`1rem = 16px`) for better scalability.

---

## 📐 4. Layout & Structure

### **Grid System**

* **12-column fluid grid**
* Responsive breakpoints:

  * Mobile: `0–767px`
  * Tablet: `768–1023px`
  * Desktop: `1024px+`

### **Spacing**

* Base unit: `8px`
* Recommended spacing scale: `4, 8, 16, 24, 32, 48px`

### **Components**

| Component              | Notes                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------- |
| **Navbar**             | Sticky, minimal, includes logo, nav links, and login button                           |
| **Sidebar (optional)** | Collapsible for admin/data views                                                      |
| **Cards**              | Soft shadows, border-radius `12px`, padding `24px`                                    |
| **Buttons**            | Primary (blue), Secondary (outline), Danger (red), with consistent hover/focus states |
| **Modals**             | Centered, scrollable, with dimmed overlay                                             |
| **Tables**             | Sticky headers, zebra striping, icons for status                                      |

---

## 🌑 5. Dark Mode

Enable optional dark mode with:

* Background: `#121212`
* Surface: `#1E1E1E`
* Text: `#FFFFFF` (primary), `#B0BEC5` (secondary)
* Accent & Primary: Remain the same, with lightened/darkened contrast

Switch via:

```css
@media (prefers-color-scheme: dark) { ... }
```

---

## 🧪 6. Interactivity & Animations

| Element | Behavior                                        |
| ------- | ----------------------------------------------- |
| Buttons | Subtle scale on hover, smooth transition `0.2s` |
| Modals  | Fade-in + slight upward motion                  |
| Loading | Spinner or skeleton loader with shimmer         |
| Alerts  | Slide-in notifications with dismiss button      |

---

## 📁 7. CSS / SCSS Structure

Organize CSS like this:

```
/styles
  ├── base/
  │   ├── _reset.scss
  │   ├── _typography.scss
  │   └── _variables.scss
  ├── components/
  │   ├── _buttons.scss
  │   ├── _cards.scss
  │   └── _modals.scss
  ├── layout/
  │   ├── _grid.scss
  │   ├── _navbar.scss
  │   └── _footer.scss
  ├── themes/
  │   ├── _light.scss
  │   └── _dark.scss
  └── main.scss
```

Use CSS custom properties for colors and spacing to simplify theme switching.

---

## 📱 8. Mobile

* Touch-friendly tap targets (at least 44px height)
* Keyboard navigable menus, modals, buttons

---

## ✅ 9. Tools & Framework Suggestions

| Need            | Suggestion                                                         |
| --------------- | ------------------------------------------------------------------ |
| CSS Framework   | Tailwind CSS (recommended for rapid UI building)                   |
| Icons           | Lucide or Material Icons                                           |
| Font            | [Inter (Google Fonts)](https://fonts.google.com/specimen/Inter)    |
| Animations      | Framer Motion or Animate.css                                       |
| Color Generator | [Coolors.co](https://coolors.co) or [Huemint](https://huemint.com) |

---