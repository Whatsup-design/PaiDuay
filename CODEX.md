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

## 2. Color Palette (The "Dekup Green" Theme)
We use a fresh academic green as the core brand color, balanced by deep evergreen and slate tones so the product feels helpful, trustworthy, and calm rather than flashy.

### Theme Variable Rule
All product colors must be expressed through centralized CSS theme variables, not repeated as raw hex values inside components. Keep light and dark mode values beside each other in one owned theme location, such as `app/globals.css` or a future dedicated theme variables file, so brand changes and dark mode toggles remain easy to maintain.

### Backgrounds & Surfaces
* **App Background:** `#F7FAF3` (A warm green-tinted off-white, reduces eye strain compared to `#FFFFFF`)
* **Card/Surface:** `#FFFFFF` (Pure white for contrast against the background)
* **Subtle Fill:** `#EEF5E8` (For secondary containers or hover states)

### Typography
* **Primary Text:** `#102014` (Deep green-black - Never use pure black `#000000`)
* **Secondary Text:** `#536454` (Muted green-slate - For descriptions, timestamps)
* **Disabled Text:** `#93A38E` (Soft green-slate)

### Brand & Accents
* **Primary Brand:** `#7EC626` (Dekup green)
* **Primary Hover:** `#6FB31F`
* **Secondary Brand:** `#1E4D3A` (Deep evergreen, chosen to pair with the bright primary while preserving strong contrast)
* **Secondary Hover:** `#163B2C`
* **Success:** `#2F7D32` (Grounded success green)
* **Destructive/Error:** `#B91C1C` (Muted Brick Red)
* **Warning:** `#CA8A04` (Ochre/Mustard)

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

