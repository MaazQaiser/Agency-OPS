# Dark Obsidian Theme

Reusable color, effect, spacing, and radius reference for Agency OPS.  
Source of truth: `src/app/globals.css` (`:root` / `html[data-theme="obsidian"]`).

**Includes:** colors, backgrounds, header chrome, glass effects, borders, status/accent tokens, spacing, corner radius, shadows & glows.  
**Excludes:** layout structure, typography (font family, sizes, weights).

---

## Activation

```html
<html lang="en" data-theme="obsidian">
```

Tokens are defined on both `:root` and `html[data-theme="obsidian"]` in `globals.css`.

---

## Quick Apply — CSS Custom Properties

Copy this block to bootstrap the theme in any project:

```css
:root,
html[data-theme="obsidian"] {
  /* Base palette */
  --obsidian: #0A0C10;
  --navy: #10151F;
  --navy-mid: #1A2233;
  --navy-card: #222B42;
  --navy-border: #2E3A52;

  /* Surfaces */
  --surface-canvas: var(--obsidian);
  --surface-header: var(--navy);
  --surface-card: var(--navy-card);
  --surface-card-hover: #283350;
  --surface-inset: var(--navy);
  --surface-elevated: var(--navy-mid);

  /* Glass */
  --glass-blur: 20px;
  --glass-blur-sm: 12px;
  --glass-blur-lg: 28px;
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  --glass-shadow-sm: 0 4px 16px rgba(0, 0, 0, 0.12);
  --glass-highlight: rgba(255, 255, 255, 0.22);
  --glass-highlight-soft: rgba(255, 255, 255, 0.10);

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-default: var(--navy-border);
  --border-strong: #3B4A63;
  --border: var(--border-default);
  --border-mid: var(--border-strong);

  /* Text colors */
  --text-primary: #F0F4FF;
  --text-secondary: #A8B8CC;
  --text-tertiary: #7B8FA6;

  /* Primary & accent */
  --blue: #3B82F6;
  --violet: #8B5CF6;
  --indigo: #6366F1;
  --primary: var(--blue);
  --primary-light: #93C5FD;
  --primary-dim: var(--blue);
  --primary-glow: rgba(59, 130, 246, 0.12);
  --primary-muted: rgba(59, 130, 246, 0.08);
  --violet-muted: rgba(139, 92, 246, 0.15);
  --violet-bg: rgba(139, 92, 246, 0.08);

  /* Status */
  --green: #10B981;
  --green-bg: rgba(16, 185, 129, 0.08);
  --rose: #F43F5E;
  --rose-bg: rgba(244, 63, 94, 0.08);
  --red: var(--rose);
  --red-bg: var(--rose-bg);
  --amber: #F59E0B;
  --amber-bg: rgba(245, 158, 11, 0.08);
  --yellow: #F59E0B;
  --yellow-bg: rgba(245, 158, 11, 0.08);
  --blue-bg: rgba(59, 130, 246, 0.08);
  --purple: var(--violet);
  --purple-bg: var(--violet-bg);
  --gray: #6C7A89;
  --gray-bg: rgba(108, 122, 137, 0.12);

  /* Legacy aliases (used across existing CSS) */
  --navy-light: var(--surface-elevated);
  --text-muted: var(--text-secondary);
  --text-dim: var(--text-tertiary);
  --text-main: var(--text-primary);
  --white: var(--text-primary);
  --muted: var(--text-secondary);

  /* Radius */
  --radius: 8px;
  --radius-lg: var(--radius);

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --top-header-height: 56px;

  /* Canvas glow tokens */
  --bg-glow-a: rgba(59, 130, 246, 0.32);
  --bg-glow-b: rgba(37, 99, 235, 0.26);
  --bg-glow-c: rgba(59, 130, 246, 0.22);
  --bg-glow-d: rgba(96, 165, 250, 0.24);
  --bg-glow-e: rgba(139, 92, 246, 0.14);
  --bg-spotlight: rgba(255, 255, 255, 0.08);
}
```

---

## Quick Apply — TypeScript Palette

Use in React/Next when inline styles or JS-driven charts need the same values:

```ts
export const darkObsidianTheme = {
  surface: {
    canvas: "#0A0C10",
    body: "#0B0E15", // obsidian body override (with gradient layers on top)
    header: "#10151F",
    card: "#222B42",
    cardHover: "#283350",
    inset: "#10151F",
    elevated: "#1A2233",
  },
  glass: {
    blur: "20px",
    blurSm: "12px",
    blurLg: "28px",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.18)",
    shadowSm: "0 4px 16px rgba(0, 0, 0, 0.12)",
    highlight: "rgba(255, 255, 255, 0.22)",
    highlightSoft: "rgba(255, 255, 255, 0.10)",
  },
  border: {
    subtle: "rgba(255, 255, 255, 0.06)",
    default: "#2E3A52",
    strong: "#3B4A63",
  },
  text: {
    primary: "#F0F4FF",
    secondary: "#A8B8CC",
    tertiary: "#7B8FA6",
  },
  primary: {
    DEFAULT: "#3B82F6",
    light: "#93C5FD",
    glow: "rgba(59, 130, 246, 0.12)",
    muted: "rgba(59, 130, 246, 0.08)",
  },
  accent: {
    violet: "#8B5CF6",
    indigo: "#6366F1",
    violetMuted: "rgba(139, 92, 246, 0.15)",
    violetBg: "rgba(139, 92, 246, 0.08)",
  },
  status: {
    green: "#10B981",
    greenBg: "rgba(16, 185, 129, 0.08)",
    red: "#F43F5E",
    redBg: "rgba(244, 63, 94, 0.08)",
    amber: "#F59E0B",
    amberBg: "rgba(245, 158, 11, 0.08)",
    blue: "#3B82F6",
    blueBg: "rgba(59, 130, 246, 0.08)",
    purple: "#8B5CF6",
    purpleBg: "rgba(139, 92, 246, 0.08)",
    gray: "#6C7A89",
    grayBg: "rgba(108, 122, 137, 0.12)",
  },
  chart: {
    grid: "rgba(35, 43, 62, 0.5)",
    tick: "#94A3B8", // runtime charts read src/lib/colors.ts today
    status: ["#10B981", "#F59E0B", "#F43F5E", "#6C7A89", "#3B82F6"],
    lob: ["#10B981", "#F59E0B", "#8B5CF6", "#F43F5E", "#6366F1"],
    bar: "#3B82F6",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    topHeaderHeight: "56px",
  },
  radius: {
    default: "8px",
    lg: "8px",
    pill: "999px",
    inset: "6px", /* calc(8px - 2px) */
  },
} as const;
```

---

## Color Reference

### Base palette

| Token | Hex / value | Use |
|-------|-------------|-----|
| `--obsidian` | `#0A0C10` | Deepest canvas base |
| `--navy` | `#10151F` | Header, inset surfaces |
| `--navy-mid` | `#1A2233` | Elevated panels, module nav base |
| `--navy-card` | `#222B42` | Cards, buttons default fill |
| `--navy-border` | `#2E3A52` | Default border color |

### Surface roles

| Token | Resolves to | Use |
|-------|-------------|-----|
| `--surface-canvas` | `#0A0C10` | Page background base |
| `--surface-header` | `#10151F` | Top app header |
| `--surface-card` | `#222B42` | Cards, panels |
| `--surface-card-hover` | `#283350` | Hover state on interactive surfaces |
| `--surface-inset` | `#10151F` | Recessed inputs, header buttons |
| `--surface-elevated` | `#1A2233` | Banners, raised strips |

### Text colors

| Token | Hex |
|-------|-----|
| `--text-primary` | `#F0F4FF` |
| `--text-secondary` | `#A8B8CC` |
| `--text-tertiary` | `#7B8FA6` |

### Primary & accent

| Token | Value |
|-------|-------|
| `--primary` / `--blue` | `#3B82F6` |
| `--primary-light` | `#93C5FD` |
| `--primary-glow` | `rgba(59, 130, 246, 0.12)` |
| `--primary-muted` | `rgba(59, 130, 246, 0.08)` |
| `--violet` / `--purple` | `#8B5CF6` |
| `--indigo` | `#6366F1` |
| `--violet-muted` | `rgba(139, 92, 246, 0.15)` |
| `--violet-bg` | `rgba(139, 92, 246, 0.08)` |

### Status colors

| Role | Foreground | Background |
|------|------------|------------|
| Success | `#10B981` | `rgba(16, 185, 129, 0.08)` |
| Error | `#F43F5E` | `rgba(244, 63, 94, 0.08)` |
| Warning | `#F59E0B` | `rgba(245, 158, 11, 0.08)` |
| Info | `#3B82F6` | `rgba(59, 130, 246, 0.08)` |
| Neutral | `#6C7A89` | `rgba(108, 122, 137, 0.12)` |

### KPI / card accent borders

| Variant | Border color |
|---------|--------------|
| Primary | `var(--blue)` |
| Green | `rgba(16, 185, 129, 0.3)` |
| Red | `rgba(244, 63, 94, 0.3)` |
| Yellow | `rgba(245, 158, 11, 0.3)` |

### Chart colors

Chart.js components currently import `src/lib/colors.ts` (not CSS vars). Values below match that runtime file.

| Token | Value |
|-------|-------|
| Grid | `rgba(35, 43, 62, 0.5)` |
| Tick labels | `#94A3B8` |
| Status series | `#10B981`, `#F59E0B`, `#F43F5E`, `#6C7A89`, `#3B82F6` |
| LOB series | `#10B981`, `#F59E0B`, `#8B5CF6`, `#F43F5E`, `#6366F1` |
| Bar fill | `#3B82F6` |

> **Note:** CSS text secondary is `#A8B8CC`; chart ticks still use the older `#94A3B8` from `colors.ts`. Sync `colors.ts` to CSS when porting.

---

## Backgrounds

### Page canvas

The token `--surface-canvas` is `#0A0C10`, but the obsidian body uses a slightly lighter base (`#0B0E15`) plus layered radial glows (fixed attachment):

```css
html[data-theme="obsidian"] body {
  background-color: #0B0E15;
  background-image:
    radial-gradient(ellipse 110% 65% at 50% -12%, var(--bg-spotlight), transparent 58%),
    radial-gradient(ellipse 80% 55% at 50% 45%, rgba(59, 130, 246, 0.08), transparent 72%),
    radial-gradient(ellipse 120% 80% at 8% -15%, var(--bg-glow-a), transparent 58%),
    radial-gradient(ellipse 100% 70% at 100% 0%, var(--bg-glow-b), transparent 55%),
    radial-gradient(ellipse 90% 60% at 50% 100%, var(--bg-glow-c), transparent 52%),
    radial-gradient(ellipse 70% 50% at 85% 65%, var(--bg-glow-d), transparent 50%),
    radial-gradient(ellipse 65% 45% at 12% 78%, var(--bg-glow-e), transparent 55%);
  background-attachment: fixed;
}
```

### Glow tokens

| Token | Value |
|-------|-------|
| `--bg-spotlight` | `rgba(255, 255, 255, 0.08)` |
| `--bg-glow-a` | `rgba(59, 130, 246, 0.32)` |
| `--bg-glow-b` | `rgba(37, 99, 235, 0.26)` |
| `--bg-glow-c` | `rgba(59, 130, 246, 0.22)` |
| `--bg-glow-d` | `rgba(96, 165, 250, 0.24)` |
| `--bg-glow-e` | `rgba(139, 92, 246, 0.14)` |

### Glass card fill (KPI, chart, table, producer cards)

```css
background: linear-gradient(
  145deg,
  rgba(34, 43, 66, 0.55) 0%,
  rgba(59, 130, 246, 0.08) 55%,
  rgba(96, 165, 250, 0.05) 100%
);
border: 1px solid rgba(255, 255, 255, 0.14);
box-shadow:
  var(--glass-shadow-sm),
  inset 0 1px 0 var(--glass-highlight),
  inset 0 -1px 0 rgba(255, 255, 255, 0.04);
```

### Card top sheen (`::before` overlay)

```css
background: linear-gradient(
  180deg,
  rgba(255, 255, 255, 0.10) 0%,
  rgba(255, 255, 255, 0.03) 40%,
  transparent 100%
);
```

### Retention KPI card override

```css
html[data-theme="obsidian"] .kpi-card.retention {
  border: none;
  box-shadow:
    var(--glass-shadow-sm),
    inset 0 1px 0 var(--glass-highlight-soft);
}
```

### Commercial module KPI cards (status-tinted glass)

Default commercial KPI glass uses a darker base than standard cards:

```css
background: linear-gradient(
  145deg,
  rgba(22, 27, 34, 0.32) 0%,
  rgba(59, 130, 246, 0.1) 52%,
  rgba(96, 165, 250, 0.08) 100%
);
border: 1px solid rgba(255, 255, 255, 0.12);
backdrop-filter: blur(var(--glass-blur-lg)) saturate(170%);
box-shadow:
  0 8px 28px rgba(0, 0, 0, 0.22),
  inset 0 1px 0 rgba(255, 255, 255, 0.16),
  inset 0 -1px 0 rgba(255, 255, 255, 0.04);
```

| Variant | Border tint |
|---------|---------------|
| `.primary` | `rgba(96, 165, 250, 0.28)` + blue outer glow |
| `.green` | `rgba(46, 204, 113, 0.24)` |
| `.red` | `rgba(231, 76, 60, 0.24)` |
| `.yellow` | `rgba(241, 196, 15, 0.24)` |

---

## Header & Chrome Colors

### App top header (`.app-top-header`)

| Property | Value |
|----------|-------|
| Background | `var(--surface-header)` → `#10151F` |
| Border bottom | `1px solid var(--glass-highlight-soft)` |
| Box shadow | `var(--glass-shadow)` |
| Horizontal padding | `var(--space-lg)` → `24px` |
| Gap | `var(--space-md)` → `16px` |

**Obsidian glass override** (header, module nav, tab bar):

```css
background: linear-gradient(
  180deg,
  rgba(255, 255, 255, 0.04) 0%,
  rgba(16, 21, 31, 0.92) 100%
);
border-bottom-color: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(var(--glass-blur-lg));
box-shadow: var(--glass-shadow);
```

### Module nav (`.module-nav`)

| Property | Value |
|----------|-------|
| Base background | `var(--navy-mid)` → `#1A2233` |
| Border bottom | `1px solid var(--border-mid)` |
| Horizontal padding | `24px` |

Under `data-theme="obsidian"`, module nav uses the **glass header gradient** (same as app top header) and `--glass-blur-lg` — the base `#1A2233` fill is overridden.

### Header nav link states

| State | Color | Background | Border |
|-------|-------|------------|--------|
| Default | `var(--text-secondary)` | none | `2px solid transparent` (bottom) |
| Hover | `var(--text-primary)` | `var(--primary-muted)` | transparent |
| Active | `var(--primary-light)` | `var(--primary-muted)` | `2px solid var(--primary)` (bottom) |

### Header button (`.top-header-btn`)

| Property | Value |
|----------|-------|
| Background | `var(--surface-inset)` |
| Border | `1px solid var(--border-default)` |
| Border radius | `var(--radius)` |
| Hover background | `var(--surface-card-hover)` |
| Hover border | `var(--border-strong)` |
| Padding | `0 12px` |
| Inner gap | `6px` |

### AI action button (`.top-header-btn-ai`)

| Property | Value |
|----------|-------|
| Background | `linear-gradient(135deg, #1d4ed8 0%, #2563eb 38%, #3b82f6 100%)` |
| Hover background | `linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)` |
| Text color | `#ffffff` |
| Box shadow | `0 1px 0 rgba(255,255,255,0.18) inset, 0 4px 18px rgba(37,99,235,0.42)` |
| Hover shadow | `0 1px 0 rgba(255,255,255,0.24) inset, 0 8px 26px rgba(59,130,246,0.55)` |
| Active shadow | `0 1px 0 rgba(255,255,255,0.14) inset, 0 2px 10px rgba(37,99,235,0.38)` |

### Conf banner (`.conf-banner`)

| Property | Value |
|----------|-------|
| Background | `var(--surface-elevated)` |
| Text color | `var(--text-secondary)` |
| Left accent | `3px solid var(--primary)` |
| Border bottom | `1px solid var(--glass-highlight-soft)` |
| Padding | `10px 20px` |
| Gap | `8px` |

---

## Glass & Effects

### Blur tiers

| Token | Value | Applied to |
|-------|-------|------------|
| `--glass-blur-sm` | `12px` | Small buttons, mini panels |
| `--glass-blur` | `20px` | Cards, panels, dropdowns |
| `--glass-blur-lg` | `28px` | Header, nav, tab bar, alerts |

### Shadow tiers

| Token | Value |
|-------|-------|
| `--glass-shadow-sm` | `0 4px 16px rgba(0, 0, 0, 0.12)` |
| `--glass-shadow` | `0 8px 32px rgba(0, 0, 0, 0.18)` |

### Highlights

| Token | Value |
|-------|-------|
| `--glass-highlight` | `rgba(255, 255, 255, 0.22)` |
| `--glass-highlight-soft` | `rgba(255, 255, 255, 0.10)` |

### Standard glass stack (cards, header chrome, panels)

Most obsidian surfaces use blur only — no saturation boost:

```css
backdrop-filter: blur(var(--glass-blur));
-webkit-backdrop-filter: blur(var(--glass-blur));
box-shadow: var(--glass-shadow-sm);
```

Header-tier chrome uses `--glass-blur-lg` and `--glass-shadow` instead.

### Enhanced glass stack (alerts, alert boxes, commercial KPIs)

```css
backdrop-filter: blur(var(--glass-blur-lg)) saturate(170%);
-webkit-backdrop-filter: blur(var(--glass-blur-lg)) saturate(170%);
box-shadow:
  var(--glass-shadow-sm),
  inset 0 1px 0 rgba(255, 255, 255, 0.14);
```

### Featured KPI glow

```css
color: var(--primary-light);
text-shadow: 0 0 20px rgba(96, 165, 250, 0.28);
```

---

## Borders

| Token | Value | Use |
|-------|-------|-----|
| `--border-subtle` | `rgba(255, 255, 255, 0.06)` | Dividers, tab bars |
| `--border-default` | `#2E3A52` | Cards, inputs, buttons |
| `--border-strong` | `#3B4A63` | Emphasis borders, module nav |
| Glass card border | `rgba(255, 255, 255, 0.14)` | Frosted card edge |
| Alert border | `rgba(255, 255, 255, 0.10)` | Alert containers |

---

## Alert & Status Surface Gradients

Each alert uses a 135° gradient from dark base → tinted mid → tinted end, plus a 3px left accent.

### Red

```css
background: linear-gradient(135deg, rgba(22,27,34,0.62) 0%, rgba(153,27,27,0.28) 45%, rgba(239,68,68,0.14) 100%);
border-color: rgba(239, 68, 68, 0.32);
border-left: 3px solid #ef4444;
```

### Yellow / amber

```css
background: linear-gradient(135deg, rgba(22,27,34,0.62) 0%, rgba(154,52,18,0.28) 45%, rgba(249,115,22,0.14) 100%);
border-color: rgba(249, 115, 22, 0.32);
border-left: 3px solid #f97316;
```

### Blue

```css
background: linear-gradient(135deg, rgba(22,27,34,0.62) 0%, rgba(30,58,138,0.3) 45%, rgba(59,130,246,0.16) 100%);
border-color: rgba(59, 130, 246, 0.32);
border-left: 3px solid #3b82f6;
```

### Green

```css
background: linear-gradient(135deg, rgba(22,27,34,0.62) 0%, rgba(21,128,61,0.28) 45%, rgba(16,185,129,0.14) 100%);
border-color: rgba(16, 185, 129, 0.32);
border-left: 3px solid #10b981;
```

### Alert dot glow colors

| Variant | Fill | Glow |
|---------|------|------|
| Red | `#f87171` | `0 0 10px rgba(239, 68, 68, 0.55)` |
| Yellow | `#fb923c` | `0 0 10px rgba(249, 115, 22, 0.55)` |
| Blue | `#60a5fa` | `0 0 10px rgba(59, 130, 246, 0.55)` |
| Green | `#34d399` | `0 0 10px rgba(16, 185, 129, 0.55)` |

---

## Spacing Scale

| Token | Value | Typical use |
|-------|-------|-------------|
| `--space-xs` | `4px` | Tight inner gaps, chip padding |
| `--space-sm` | `8px` | Button groups, icon gaps, banner gap |
| `--space-md` | `16px` | Header gap, grid gaps, section spacing |
| `--space-lg` | `24px` | Header horizontal padding, page padding |
| `--space-xl` | `32px` | Large section padding |
| `--top-header-height` | `56px` | App header height (chrome spacing) |

### Common component spacing (color-adjacent chrome)

| Element | Padding / gap |
|---------|---------------|
| App header | `0 24px`, gap `16px` |
| Header nav links | `0 12px` horizontal |
| Header buttons | `0 12px`, gap `6px` |
| Module nav | `0 24px` |
| Module nav links | `0 16px` |
| Conf banner | `10px 20px`, gap `8px` |
| KPI card | `14px 16px` or `18px 16px` |
| Tab panel | `24px` |
| Tab content | `28px` |
| Badge / pill | `6px 14px` |
| Segmented control inner | `7px 12px`, outer padding `4px`, gap `8px` |

---

## Corner Radius

| Token / pattern | Value | Use |
|-----------------|-------|-----|
| `--radius` | `8px` | Default — cards, buttons, inputs, bars |
| `--radius-lg` | `8px` | Same as default in this theme |
| Pill pattern | `999px` | Badges, pills, avatars, status chips (hard-coded, not a CSS var) |
| Inset pattern | `calc(var(--radius) - 2px)` → `6px` | Segmented control inner items |
| Nav / tabs (obsidian) | `0` | Underline-style nav — no corner radius |
| Circle | `50%` | Dot indicators, round avatars |

### Bottom-only radius (drawer footers)

```css
border-radius: 0 0 var(--radius-lg) var(--radius-lg);
```

---

## Transition Timing (color / effect only)

| Property | Duration | Easing |
|----------|----------|--------|
| Color, background, border | `0.15s` | default |
| Nav link color/border | `0.2s` | default |
| Card hover (bg/shadow/border) | `0.2s` | default |
| AI button transform/shadow | `0.22s` | `ease` |
| Progress bar width | `0.4s` | `ease` |

---

## Applying to a New Project

1. Paste the **CSS Custom Properties** block into your global stylesheet.
2. Set `data-theme="obsidian"` on `<html>`.
3. Apply the **page canvas** background gradient to `body`.
4. Use `--surface-*` for fills, `--border-*` for edges, `--glass-*` for frosted chrome.
5. Use `--space-*` and `--radius` for consistent spacing and rounding.
6. Optional: copy the **TypeScript palette** into a `theme.ts` for charts and inline styles.

---

## Legacy Aliases

These resolve to the tokens above and appear throughout existing CSS:

| Alias | Resolves to |
|-------|-------------|
| `--text-muted`, `--muted` | `--text-secondary` |
| `--text-dim` | `--text-tertiary` |
| `--text-1`, `--text-main`, `--white` | `--text-primary` |
| `--text-2` | `--text-secondary` |
| `--text-3` | `--text-tertiary` |
| `--navy-light` | `--surface-elevated` |
| `--border` | `--border-default` |
| `--border-mid` | `--border-strong` |
| `--red`, `--red-bg` | `--rose`, `--rose-bg` |
| `--purple`, `--purple-bg` | `--violet`, `--violet-bg` |

---

## Glass-Enabled Components

When `data-theme="obsidian"` is set, these selectors receive frosted glass treatment:

`.glass-panel`, `.app-top-header`, `.conf-banner`, `.module-nav`, `.top-bar`, `.tab-bar`, `.kpi-card`, `.system-health-summary-card`, `.system-health-alert-item`, `.producer-card`, `.roi-section`, `.roi-result`, `.roi-mini`, `.card`, `.chart-card`, `.formula-card`, `.snapshot-card`, `.metric-highlight`, `.table-wrap`, `.alert-box`, `.top-header-btn`, `.commercial-module-bar`, `.snapshot-header`, `.acc-card`, `.pipeline-legend-bar`, `.top-header-profile-dropdown`

Header-tier blur (`--glass-blur-lg`): `.app-top-header`, `.conf-banner`, `.module-nav`, `.top-bar`, `.tab-bar`, `.commercial-module-bar`

Small blur (`--glass-blur-sm`): `.top-header-btn`, `.roi-mini`, `.snapshot-header`

---

## Known Drift — `colors.ts` vs CSS

`src/lib/colors.ts` is **out of sync** with `globals.css` on `main`. Prefer CSS tokens when porting. Current differences:

| Token | `globals.css` (correct) | `colors.ts` (stale) |
|-------|-------------------------|---------------------|
| Surface header | `#10151F` | `#0D1117` |
| Surface card | `#222B42` | `#1A2035` |
| Surface card hover | `#283350` | `#1E2640` |
| Surface elevated | `#1A2233` | `#161B27` |
| Border subtle | `rgba(255,255,255,0.06)` | `rgba(35,43,62,0.5)` |
| Border default | `#2E3A52` | `#232B3E` |
| Border strong | `#3B4A63` | `#2d3748` |
| Text secondary | `#A8B8CC` | `#94A3B8` |
| Text tertiary | `#7B8FA6` | `#64748B` |
| Glass shadow | `0.18 opacity` | `0.28 opacity` |
| Glass highlight | `0.22 alpha` | `0.14 alpha` |

---

## Verification Checklist

Audited against `src/app/globals.css` lines 3–151, 154–451, 766–793, 2462–2669, 2958–3033 and `src/app/layout.tsx` on `main`. Re-checked in full on June 26, 2026.

- [x] All `:root` color, glass, border, radius, spacing, and glow tokens
- [x] Obsidian body canvas gradient (`#0B0E15` base)
- [x] Glass card fill, sheen, header chrome overrides
- [x] Alert/status gradient surfaces and dot glows
- [x] Header button + AI button states (hover/active shadows)
- [x] Commercial KPI status-tinted variants
- [x] Chart colors flagged as `colors.ts` runtime source
- [x] Legacy alias tokens documented
- [x] `colors.ts` drift table added
- [x] Glass blur tiers split: base (no saturate) vs enhanced (saturate 170%)

---

## Source Files

| File | Role |
|------|------|
| `src/app/globals.css` | **Source of truth** — all CSS tokens and obsidian effect rules |
| `src/app/layout.tsx` | Sets `data-theme="obsidian"` on `<html>` |
| `src/lib/colors.ts` | JS palette for Chart.js — stale vs CSS, sync before reuse |

---

*Last verified against `main` branch — June 26, 2026*
