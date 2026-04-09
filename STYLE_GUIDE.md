# Rental App — Style Guide

## Brand Identity
**Premium outdoor rental experience** — clean, modern, adventure-inspired.
The design communicates trust, quality equipment, and easy booking.

---

## Color Palette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Midnight** | `#0F172A` | Headings, primary text, dark backgrounds |
| **Slate** | `#1E293B` | Secondary text, dark UI elements |
| **Ocean** | `#2563EB` | Primary CTA, links, accent |
| **Ocean Dark** | `#1D4ED8` | Hover states |
| **Ocean Light** | `#3B82F6` | Active states, highlights |

### Neutral Colors
| Name | Hex | Usage |
|------|-----|-------|
| **White** | `#FFFFFF` | Backgrounds, cards |
| **Snow** | `#F8FAFC` | Section alternate backgrounds |
| **Cloud** | `#F1F5F9` | Input backgrounds, borders |
| **Silver** | `#E2E8F0` | Borders, dividers |
| **Muted** | `#94A3B8` | Placeholder text, captions |
| **Subtle** | `#64748B` | Body text, descriptions |

### Accent Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Emerald** | `#059669` | Success, availability |
| **Amber** | `#D97706` | Warnings, popular badges |
| **Rose** | `#E11D48` | Errors, unavailable |

---

## Typography

### Font Family
- **Headings**: `Plus Jakarta Sans` (weight: 600, 700, 800)
- **Body**: `Inter` (weight: 400, 500, 600)

### Scale
| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| **Hero Title** | 72px / 4.5rem | 800 | 1.0 | -0.02em |
| **H1** | 48px / 3rem | 700 | 1.1 | -0.02em |
| **H2** | 36px / 2.25rem | 700 | 1.2 | -0.01em |
| **H3** | 24px / 1.5rem | 600 | 1.3 | 0 |
| **H4** | 20px / 1.25rem | 600 | 1.4 | 0 |
| **Body Large** | 18px / 1.125rem | 400 | 1.7 | 0 |
| **Body** | 16px / 1rem | 400 | 1.6 | 0 |
| **Body Small** | 14px / 0.875rem | 400 | 1.5 | 0 |
| **Caption** | 12px / 0.75rem | 500 | 1.4 | 0.05em |
| **Overline** | 12px / 0.75rem | 600 | 1.4 | 0.1em |

### Mobile Scale (< 768px)
| Element | Size |
|---------|------|
| **Hero Title** | 40px / 2.5rem |
| **H1** | 32px / 2rem |
| **H2** | 28px / 1.75rem |
| **H3** | 22px / 1.375rem |

---

## Spacing System

Based on 4px grid:
| Token | Value |
|-------|-------|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 32px |
| `2xl` | 48px |
| `3xl` | 64px |
| `4xl` | 96px |
| `5xl` | 128px |

### Section Padding
- **Desktop**: 96px top/bottom, 64px side (max-width: 1280px)
- **Tablet**: 64px top/bottom, 32px side
- **Mobile**: 48px top/bottom, 20px side

---

## Components

### Buttons

#### Primary (CTA)
```
Background: #2563EB → hover: #1D4ED8
Text: #FFFFFF
Padding: 16px 32px
Border-radius: 12px
Font: 16px, weight 600
Shadow: 0 4px 14px rgba(37, 99, 235, 0.3)
Transition: all 0.2s ease
```

#### Secondary (Ghost)
```
Background: transparent → hover: #F1F5F9
Text: #0F172A
Border: 1.5px solid #E2E8F0
Padding: 16px 32px
Border-radius: 12px
```

#### Small Button
```
Padding: 10px 20px
Font: 14px, weight 600
```

### Cards

#### Product Card
```
Background: #FFFFFF
Border: 1px solid #F1F5F9
Border-radius: 16px
Shadow: 0 1px 3px rgba(0,0,0,0.04)
Hover shadow: 0 12px 40px rgba(0,0,0,0.08)
Transition: all 0.3s ease
Overflow: hidden
```

#### Content Card
```
Background: #F8FAFC
Border-radius: 16px
Padding: 32px
No shadow
```

### Inputs
```
Background: #F8FAFC
Border: 1.5px solid #E2E8F0 → focus: #2563EB
Border-radius: 12px
Padding: 14px 16px
Font: 16px
Transition: border 0.2s ease
```

### Navbar
```
Position: fixed, top: 0
Background: transparent → solid white (on scroll)
Height: 80px
Padding: 0 64px (desktop), 0 20px (mobile)
Shadow (on scroll): 0 1px 3px rgba(0,0,0,0.06)
Transition: all 0.3s ease
z-index: 50
```

---

## Grid & Layout

### Container
```
max-width: 1280px
margin: 0 auto
padding: 0 64px (desktop)
padding: 0 20px (mobile)
```

### Grid
- **Product grid**: 4 columns (desktop), 2 (tablet), 1 (mobile)
- **Feature grid**: 3 columns → 1 on mobile
- **Gap**: 24px (desktop), 16px (mobile)

---

## Animations & Interactions

### Scroll Animations (Fade In Up)
```
Initial: opacity 0, translateY(30px)
Final: opacity 1, translateY(0)
Duration: 0.6s
Easing: cubic-bezier(0.16, 1, 0.3, 1)
Stagger: 0.1s between items
```

### Hover Effects
```
Cards: translateY(-4px) + shadow increase
Buttons: background darken + scale(1.02)
Images: scale(1.05) with overflow hidden
Links: color transition 0.2s
```

### Page Transitions
```
Fade in: 0.3s ease
```

---

## Imagery

### Style
- **Hero**: Full-width, high-quality outdoor lifestyle photos
- **Products**: Clean white/light background, consistent angles
- **Categories**: Lifestyle action shots with overlay gradient
- **Aspect ratios**: Hero 16:9, Products 4:3, Categories 3:2

### Overlays
```
Gradient: linear-gradient(to bottom, transparent, rgba(15,23,42,0.7))
For text on images
```

---

## Breakpoints

| Name | Width |
|------|-------|
| **Mobile** | < 640px |
| **Tablet** | 640px - 1024px |
| **Desktop** | > 1024px |
| **Wide** | > 1280px |

---

## Shadows

| Name | Value |
|------|-------|
| **sm** | `0 1px 2px rgba(0,0,0,0.04)` |
| **md** | `0 4px 14px rgba(0,0,0,0.06)` |
| **lg** | `0 12px 40px rgba(0,0,0,0.08)` |
| **xl** | `0 24px 60px rgba(0,0,0,0.12)` |
| **cta** | `0 4px 14px rgba(37,99,235,0.3)` |

---

## Border Radius

| Name | Value |
|------|-------|
| **sm** | `8px` |
| **md** | `12px` |
| **lg** | `16px` |
| **xl** | `24px` |
| **full** | `9999px` |
