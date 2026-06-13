@CODEX.md
# Frontend & UI/UX Design Codex

**Version:** 1.0.0
**Philosophy:** Grounded, Tactile, and Human-Centric.
**Anti-Patterns:** No neon glows, no excessive glassmorphism, no dark-mode-only enforcement, no "AI" sci-fi aesthetics. We build for reliability and clarity.

---

## 1. Core Principles
* **Content First:** The interface should recede; the user's data and tasks are the hero.
* **Tactile Reality:** Elements should behave like physical objects on a desk. They cast realistic shadows, have distinct boundaries, and do not emit light.
* **Predictability:** Buttons look like buttons. Links look like links. 

---

## 2. Color Palette (The "Phuket Blue Ocean" Theme)
We use a calm blue ocean palette inspired by Phuket's sea, coastal sky, and responsible tourism mission. The product should feel trustworthy, clean, local, and travel-ready without becoming neon, luxury-resort generic, or sci-fi.

### Theme Variable Rule
All product colors must be expressed through centralized CSS theme variables, not repeated as raw hex values inside components. Keep light and dark mode values beside each other in one owned theme location, such as `app/globals.css` or a future dedicated theme variables file, so brand changes and dark mode toggles remain easy to maintain.

### Backgrounds & Surfaces
* **App Background:** `#F4FAFC` (A soft ocean-tinted off-white, calm and readable for tourist flows)
* **Card/Surface:** `#FFFFFF` (Pure white for route cards, dashboards, forms, and readable content)
* **Subtle Fill:** `#E8F4F8` (For secondary containers, selected states, and gentle hover states)
* **Muted Ocean Surface:** `#D7EEF5` (For route highlights, empty states, and light informational panels)

### Typography
Use **Inter** as the primary product font across the app. Load it through `next/font/google` in the root layout and expose it as the centralized sans font variable, so headings, forms, buttons, dashboard labels, and tourist-facing copy share one clean identity.

Recommended font weights:

* **Brand / page title:** `600` or `700` only when strong emphasis is needed.
* **Section heading:** `600`.
* **Button / CTA:** `600`.
* **Input value / compact label:** `500`.
* **Body copy / helper text:** `400`.
* Avoid making entire forms `700`; it reduces readability and makes the UI feel heavy.

* **Primary Text:** `#0B1F2A` (Deep ocean ink - Never use pure black `#000000`)
* **Secondary Text:** `#4E6570` (Muted blue-slate - For descriptions, timestamps, and metadata)
* **Disabled Text:** `#8CA4AE` (Soft blue-gray)

### Brand & Accents
* **Primary Brand:** `#0EA5C6` (Andaman blue, used for primary CTAs and quest progress)
* **Primary Hover:** `#078BAD`
* **Secondary Brand:** `#075985` (Deep ocean blue, used for headers, key dashboard moments, and strong contrast)
* **Secondary Hover:** `#06476A`
* **Accent:** `#38BDF8` (Clear sky blue, use sparingly for highlights and active states)
* **Success:** `#168A5B` (Sea-grass green for completed check-ins, verified coupons, and positive impact)
* **Destructive/Error:** `#B42318` (Muted coral red)
* **Warning:** `#B7791F` (Sandy amber for caution and pending states)
* **Impact Highlight:** `#0F766E` (Teal for People/Profit impact metrics and sustainability callouts)

---

## 3. Depth & Shadows (Strictly "No Glow")
Shadows must simulate a single, natural light source casting downward. **Rule: No colored shadows. No spread without blur. No glowing borders.**

We use a 3-tier elevation system using precise `rgba(0,0,0, X)` values.

### CSS Variables for Elevation
```css
:root {
  /* Elevation 1: Buttons, Dropdown items, subtle cards */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  
  /* Elevation 2: Floating cards, panels, popovers */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 
               0 2px 4px -2px rgba(0, 0, 0, 0.04);
  
  /* Elevation 3: Modals, Dialogs, Dropdown Menus */
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 
               0 4px 6px -4px rgba(0, 0, 0, 0.04);
               
  /* Inner Shadow: Pressed buttons, well/inset containers */
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}
