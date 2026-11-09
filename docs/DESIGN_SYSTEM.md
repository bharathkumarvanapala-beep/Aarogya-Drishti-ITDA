# AAROGYA DRISHTI — Official Design System Specification
**Theme Name:** *Nature-Inspired Premium Community Healthcare Theme*  
**Aesthetic Direction:** Warm, trustworthy, community-oriented Indian rural healthcare identity with deep forest greens, crisp white content cards, soft natural accents, and modern high-legibility typography.  
**Document Version:** 1.0.0 (Phase 0 Design Tokens)

---

## 1. Color Palette & Tokens

The color system reflects the forested landscape of the Eastern Ghats in Alluri Sitharama Raju district, blending clinical credibility with compassionate community warmth.

```css
:root {
  /* Brand Core */
  --color-primary-forest: #075B4D;  /* Primary brand, headers, deep navigation */
  --color-secondary-green: #087653; /* Secondary buttons, active highlights */
  --color-accent-green:    #398F72; /* Subtle tags, success elements, icons */
  
  /* Surfaces & Backgrounds */
  --color-bg-light:        #E8F5EF; /* Application background, soft nature tint */
  --color-bg-accent:       #DCEFEA; /* Card borders, subtle hover fills */
  --color-surface-white:   #FFFFFF; /* Elevated content cards, modals */
  
  /* Typography */
  --color-text-main:       #173B36; /* High-contrast headers and primary body */
  --color-text-secondary:  #64748B; /* Meta labels, timestamps, helper text */
  --color-text-inverse:    #FFFFFF; /* Text on dark green containers */
  
  /* Semantic Status Tokens (Workflow-Only, NOT Clinical Stage) */
  --color-status-info:     #2865A5; /* New / Informational blue */
  --color-status-warning:  #986000; /* Pending / Attention amber */
  --color-status-success:  #087653; /* Completed green */
  --color-status-danger:   #B44838; /* Needs urgent attention / Error red */
  --color-status-neutral:  #94A3B8; /* Unavailable / Inactive grey */
}
```

### Tailwind Configuration Mapping (`tailwind.config.js`)
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        forest: {
          900: '#075B4D',
          800: '#087653',
          700: '#398F72',
          100: '#DCEFEA',
          50:  '#E8F5EF',
        },
        ink: {
          DEFAULT: '#173B36',
          muted: '#64748B',
        },
        status: {
          info: '#2865A5',
          warning: '#986000',
          success: '#087653',
          danger: '#B44838',
          neutral: '#94A3B8',
        }
      }
    }
  }
}
```

---

## 2. Typography & Bilingual Font Pairing

All typography is optimized for bilingual English and Telugu rendering, preventing character clipping and preserving baseline alignment.

- **Primary Font (English & Numbers):** `'Outfit', 'Inter', system-ui, sans-serif`
- **Telugu Glyph Engine:** `'Noto Sans Telugu', 'Tenali Ramakrishna', sans-serif`
- **Typographic Scale:**
  - `Display / Hero`: `2.25rem` to `3rem` (36px - 48px), bold
  - `H1 / Page Title`: `1.75rem` (28px), semibold
  - `H2 / Section Title`: `1.375rem` (22px), semibold
  - `H3 / Card Title`: `1.125rem` (18px), medium
  - `Body Regular`: `1rem` (16px), line-height `1.6`
  - `Body Small / Caption`: `0.875rem` (14px), line-height `1.5`
  - `Micro / Badge`: `0.75rem` (12px), uppercase tracking

---

## 3. Workflow Status System

Status badges communicate **process status** across care stages.  
**Critical Clinical Safety Rule:** Colors alone must NEVER communicate a status, and red NEVER indicates a cancer diagnosis.

| Status Key | English Display | Telugu Display | Hex Accent | Background Tint | Meaning |
|---|---|---|---|---|---|
| `NEW` | New | కొత్తది | `#2865A5` | `#EBF5FF` | Record received in queue |
| `PENDING` | Pending | పెండింగ్లో ఉంది | `#986000` | `#FEF3C7` | Frontline or clinical action required |
| `IN_PROGRESS` | In Progress | పురోగతిలో ఉంది | `#2563EB` | `#EFF6FF` | Currently being reviewed or processed |
| `COMPLETED` | Completed | పూర్తయింది | `#087653` | `#E6F4EA` | Workflow step successfully concluded |
| `NEEDS_ATTENTION` | Needs Attention | శ్రద్ధ అవసరం | `#B44838` | `#FEE2E2` | Timely intervention required (e.g. missed visit) |
| `NOT_AVAILABLE` | Unavailable | అందుబాటులో లేదు | `#94A3B8` | `#F1F5F9` | Offline or sensor data unavailable |

---

## 4. UI Primitives Specification

### 4.1 Buttons
- **Touch Target:** Minimum `48px` height for Android touch usability.
- **Variants:**
  - `Primary`: Deep forest green background (`#075B4D`), white text, soft shadow, hover `#087653`.
  - `Secondary`: Soft nature accent (`#DCEFEA`), ink text (`#173B36`), hover `#c8e5dd`.
  - `Outline`: 1.5px border `#398F72`, transparent fill, hover `#E8F5EF`.
  - `Danger`: Muted red border and text (`#B44838`), hover `#FEE2E2`.
  - `Ghost`: Minimalist padding, forest text, subtle hover highlight.

### 4.2 Content Cards
- Pure white background (`#FFFFFF`), rounded corners (`rounded-2xl` / 16px radius).
- Subtle 1px border (`#DCEFEA`).
- Soft multi-stop shadow: `0 4px 16px -2px rgba(7, 91, 77, 0.06)`.

### 4.3 Form Inputs
- Clear floating or persistent labels in English + Telugu.
- Border: 1.5px border `#CBD5E1`, active focus ring `#075B4D`.
- Generous padding: `py-3 px-4`, font size minimum `16px` to prevent iOS/Android unwanted zoom.

### 4.4 Stat Cards
- Clear large numeric metric (28px - 36px font).
- Informational icon inside soft circular badge.
- Secondary label with Telugu translation.
- Subtle trend indicator or status dot.

---

## 5. Accessibility & Humanized UX Standards

1. **Contrast Compliance:** All text-to-background combinations exceed WCAG 2.1 AA minimum contrast (4.5:1 for normal text, 3:1 for large text).
2. **Plain Language Feedback:**
   - Network failure: *"Your record is saved on this device. It will be synchronized when internet is available."* (మీ రికార్డు ఈ పరికరంలో సురక్షితంగా ఉంది. ఇంటర్నెట్ వచ్చినప్పుడు సర్వర్‌కి పంపబడుతుంది.)
   - AI failure: *"Research analysis is temporarily unavailable. Your screening record is safe. The doctor can still review the case."*
3. **No Flashing Content:** Micro-animations use gentle cubic-bezier transitions (`200ms ease-out`).
