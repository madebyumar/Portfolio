export interface PaletteColors {
  accent: string
  accentInk: string
  accentDim: string
  bg: string
  card: string
  tag: string
}

export interface ThemePalette {
  id: string
  name: string
  badge?: string
  dot: string
  light: PaletteColors
  dark: PaletteColors
}

export const DEFAULT_PALETTE_ID = 'volt'

export const THEME_PALETTES: ThemePalette[] = [
  {
    id: 'volt',
    name: 'Volt / Neon Lime',
    badge: 'Signature',
    dot: '#d4ff3f',
    light: { accent: '#84cc16', accentInk: '#0e0e0c', accentDim: 'rgba(212, 255, 63, 0.25)', bg: '#f8f8f6', card: '#ffffff', tag: '#d4ff3f' },
    dark: { accent: '#d4ff3f', accentInk: '#0e0e0c', accentDim: 'rgba(212, 255, 63, 0.05)', bg: '#0e0e0c', card: '#181815', tag: '#d4ff3f' },
  },
  {
    id: 'matrix',
    name: 'Cyber Matrix',
    dot: '#00ff66',
    light: { accent: '#059669', accentInk: '#ffffff', accentDim: 'rgba(0, 255, 102, 0.15)', bg: '#f7faf8', card: '#ffffff', tag: '#00ff66' },
    dark: { accent: '#00ff66', accentInk: '#0e0e0c', accentDim: 'rgba(0, 255, 102, 0.06)', bg: '#0b0f0c', card: '#121a14', tag: '#00ff66' },
  },
  {
    id: 'emerald',
    name: 'Cyber Emerald',
    dot: '#10b981',
    light: { accent: '#059669', accentInk: '#ffffff', accentDim: 'rgba(5, 150, 105, 0.08)', bg: '#ffffff', card: '#f8fafc', tag: '#10b981' },
    dark: { accent: '#10b981', accentInk: '#0e0e0c', accentDim: 'rgba(16, 185, 129, 0.08)', bg: '#0b0f0d', card: '#141c17', tag: '#10b981' },
  },
  {
    id: 'mint',
    name: 'Electric Mint',
    dot: '#00f5a0',
    light: { accent: '#0d9488', accentInk: '#ffffff', accentDim: 'rgba(0, 245, 160, 0.15)', bg: '#f5faf9', card: '#ffffff', tag: '#00f5a0' },
    dark: { accent: '#00f5a0', accentInk: '#0e0e0c', accentDim: 'rgba(0, 245, 160, 0.07)', bg: '#090f0e', card: '#111b19', tag: '#00f5a0' },
  },
  {
    id: 'pine',
    name: 'Deep Forest',
    dot: '#15803d',
    light: { accent: '#15803d', accentInk: '#ffffff', accentDim: 'rgba(21, 128, 61, 0.08)', bg: '#f8faf8', card: '#ffffff', tag: '#15803d' },
    dark: { accent: '#22c55e', accentInk: '#0e0e0c', accentDim: 'rgba(34, 197, 94, 0.06)', bg: '#0a0d0a', card: '#131913', tag: '#22c55e' },
  },
  {
    id: 'chartreuse',
    name: 'Acid Olive',
    dot: '#a3e635',
    light: { accent: '#65a30d', accentInk: '#ffffff', accentDim: 'rgba(163, 230, 53, 0.15)', bg: '#f9faf6', card: '#ffffff', tag: '#a3e635' },
    dark: { accent: '#a3e635', accentInk: '#0e0e0c', accentDim: 'rgba(163, 230, 53, 0.06)', bg: '#0d0e0a', card: '#181912', tag: '#a3e635' },
  },
  {
    id: 'blue',
    name: 'Electric Cobalt',
    dot: '#2563eb',
    light: { accent: '#2563eb', accentInk: '#ffffff', accentDim: 'rgba(37, 99, 235, 0.08)', bg: '#fafafa', card: '#ffffff', tag: '#2563eb' },
    dark: { accent: '#3b82f6', accentInk: '#ffffff', accentDim: 'rgba(59, 130, 246, 0.08)', bg: '#0a0c10', card: '#121620', tag: '#3b82f6' },
  },
  {
    id: 'cyan',
    name: 'Cyber Cyan',
    dot: '#00d2ff',
    light: { accent: '#0891b2', accentInk: '#ffffff', accentDim: 'rgba(0, 210, 255, 0.15)', bg: '#f5fafc', card: '#ffffff', tag: '#00d2ff' },
    dark: { accent: '#00d2ff', accentInk: '#0e0e0c', accentDim: 'rgba(0, 210, 255, 0.07)', bg: '#080d12', card: '#0f1822', tag: '#00d2ff' },
  },
  {
    id: 'sky',
    name: 'Hyper Sky',
    dot: '#0ea5e9',
    light: { accent: '#0284c7', accentInk: '#ffffff', accentDim: 'rgba(14, 165, 233, 0.08)', bg: '#f8fafc', card: '#ffffff', tag: '#0ea5e9' },
    dark: { accent: '#38bdf8', accentInk: '#0e0e0c', accentDim: 'rgba(56, 189, 248, 0.08)', bg: '#090d12', card: '#111922', tag: '#38bdf8' },
  },
  {
    id: 'indigo',
    name: 'Quantum Indigo',
    dot: '#6366f1',
    light: { accent: '#4f46e5', accentInk: '#ffffff', accentDim: 'rgba(99, 102, 241, 0.08)', bg: '#fafafc', card: '#ffffff', tag: '#6366f1' },
    dark: { accent: '#818cf8', accentInk: '#0e0e0c', accentDim: 'rgba(129, 140, 248, 0.08)', bg: '#0b0b12', card: '#141422', tag: '#818cf8' },
  },
  {
    id: 'sapphire',
    name: 'Royal Sapphire',
    dot: '#0052ff',
    light: { accent: '#0052ff', accentInk: '#ffffff', accentDim: 'rgba(0, 82, 255, 0.08)', bg: '#fafbfc', card: '#ffffff', tag: '#0052ff' },
    dark: { accent: '#3d7aff', accentInk: '#ffffff', accentDim: 'rgba(61, 122, 255, 0.08)', bg: '#090b14', card: '#101526', tag: '#3d7aff' },
  },
  {
    id: 'violet',
    name: 'Neon Violet',
    dot: '#8b5cf6',
    light: { accent: '#7c3aed', accentInk: '#ffffff', accentDim: 'rgba(139, 92, 246, 0.08)', bg: '#faf8fc', card: '#ffffff', tag: '#8b5cf6' },
    dark: { accent: '#a78bfa', accentInk: '#0e0e0c', accentDim: 'rgba(167, 139, 250, 0.08)', bg: '#0d0a12', card: '#181220', tag: '#a78bfa' },
  },
  {
    id: 'purple',
    name: 'Cyber Purple',
    dot: '#c084fc',
    light: { accent: '#9333ea', accentInk: '#ffffff', accentDim: 'rgba(192, 132, 252, 0.12)', bg: '#faf8fc', card: '#ffffff', tag: '#c084fc' },
    dark: { accent: '#c084fc', accentInk: '#0e0e0c', accentDim: 'rgba(192, 132, 252, 0.08)', bg: '#0e0a14', card: '#1b1226', tag: '#c084fc' },
  },
  {
    id: 'magenta',
    name: 'Acid Magenta',
    dot: '#f43f5e',
    light: { accent: '#e11d48', accentInk: '#ffffff', accentDim: 'rgba(244, 63, 94, 0.08)', bg: '#fdf8f9', card: '#ffffff', tag: '#f43f5e' },
    dark: { accent: '#fb7185', accentInk: '#0e0e0c', accentDim: 'rgba(251, 113, 133, 0.08)', bg: '#120a0d', card: '#201217', tag: '#fb7185' },
  },
  {
    id: 'tokyo',
    name: 'Tokyo Neon Pink',
    dot: '#ff007f',
    light: { accent: '#d9006c', accentInk: '#ffffff', accentDim: 'rgba(255, 0, 127, 0.12)', bg: '#fef7fa', card: '#ffffff', tag: '#ff007f' },
    dark: { accent: '#ff007f', accentInk: '#ffffff', accentDim: 'rgba(255, 0, 127, 0.08)', bg: '#14080f', card: '#240f1c', tag: '#ff007f' },
  },
  {
    id: 'rose',
    name: 'Hot Rose',
    dot: '#ec4899',
    light: { accent: '#db2777', accentInk: '#ffffff', accentDim: 'rgba(236, 72, 153, 0.08)', bg: '#fdf8fa', card: '#ffffff', tag: '#ec4899' },
    dark: { accent: '#f472b6', accentInk: '#0e0e0c', accentDim: 'rgba(244, 114, 182, 0.08)', bg: '#12090e', card: '#22111b', tag: '#f472b6' },
  },
  {
    id: 'sunset',
    name: 'Electric Sunset',
    dot: '#f97316',
    light: { accent: '#ea580c', accentInk: '#ffffff', accentDim: 'rgba(249, 115, 22, 0.08)', bg: '#faf8f6', card: '#ffffff', tag: '#f97316' },
    dark: { accent: '#fb923c', accentInk: '#0e0e0c', accentDim: 'rgba(251, 146, 60, 0.08)', bg: '#120c08', card: '#20150e', tag: '#fb923c' },
  },
  {
    id: 'amber',
    name: 'Cyber Amber',
    dot: '#f59e0b',
    light: { accent: '#d97706', accentInk: '#ffffff', accentDim: 'rgba(245, 158, 11, 0.08)', bg: '#faf9f6', card: '#ffffff', tag: '#f59e0b' },
    dark: { accent: '#fbbf24', accentInk: '#0e0e0c', accentDim: 'rgba(251, 191, 36, 0.08)', bg: '#120f08', card: '#201b0f', tag: '#fbbf24' },
  },
  {
    id: 'gold',
    name: 'Solar Gold',
    dot: '#eab308',
    light: { accent: '#ca8a04', accentInk: '#ffffff', accentDim: 'rgba(234, 179, 8, 0.1)', bg: '#fafaf6', card: '#ffffff', tag: '#eab308' },
    dark: { accent: '#facc15', accentInk: '#0e0e0c', accentDim: 'rgba(250, 204, 21, 0.08)', bg: '#121108', card: '#211f0e', tag: '#facc15' },
  },
  {
    id: 'crimson',
    name: 'Scarlet Red',
    dot: '#ef4444',
    light: { accent: '#dc2626', accentInk: '#ffffff', accentDim: 'rgba(239, 68, 68, 0.08)', bg: '#fdf8f8', card: '#ffffff', tag: '#ef4444' },
    dark: { accent: '#f87171', accentInk: '#ffffff', accentDim: 'rgba(248, 113, 113, 0.08)', bg: '#120909', card: '#221111', tag: '#f87171' },
  },
  {
    id: 'copper',
    name: 'Warm Copper',
    dot: '#b45309',
    light: { accent: '#b45309', accentInk: '#ffffff', accentDim: 'rgba(180, 83, 9, 0.08)', bg: '#faf8f5', card: '#ffffff', tag: '#b45309' },
    dark: { accent: '#f59e0b', accentInk: '#0e0e0c', accentDim: 'rgba(245, 158, 11, 0.08)', bg: '#120e0a', card: '#201812', tag: '#f59e0b' },
  },
  {
    id: 'monochrome',
    name: 'Obsidian Mono',
    dot: '#0e0e0c',
    light: { accent: '#0e0e0c', accentInk: '#ffffff', accentDim: 'rgba(14, 14, 12, 0.06)', bg: '#ffffff', card: '#f4f4f5', tag: '#0e0e0c' },
    dark: { accent: '#f2f0e8', accentInk: '#0e0e0c', accentDim: 'rgba(242, 240, 232, 0.06)', bg: '#0e0e0c', card: '#181815', tag: '#f2f0e8' },
  },
  {
    id: 'slate',
    name: 'Titanium Slate',
    dot: '#64748b',
    light: { accent: '#475569', accentInk: '#ffffff', accentDim: 'rgba(100, 116, 139, 0.08)', bg: '#f8fafc', card: '#ffffff', tag: '#64748b' },
    dark: { accent: '#94a3b8', accentInk: '#0e0e0c', accentDim: 'rgba(148, 163, 184, 0.08)', bg: '#0b0e12', card: '#141a22', tag: '#94a3b8' },
  },
  {
    id: 'zinc',
    name: 'Minimalist Zinc',
    dot: '#71717a',
    light: { accent: '#52525b', accentInk: '#ffffff', accentDim: 'rgba(113, 113, 122, 0.08)', bg: '#fafafa', card: '#ffffff', tag: '#71717a' },
    dark: { accent: '#a1a1aa', accentInk: '#0e0e0c', accentDim: 'rgba(161, 161, 170, 0.08)', bg: '#0c0c0e', card: '#17171a', tag: '#a1a1aa' },
  },
]

export function getPalette(id?: string | null): ThemePalette {
  return THEME_PALETTES.find((p) => p.id === id) || THEME_PALETTES[0]
}

/** CSS variables for dark (:root) and light ([data-theme=light]) modes. */
export function buildPaletteCSS(pal: ThemePalette): string {
  const l = pal.light
  const d = pal.dark
  return `
:root {
  --bg: ${d.bg};
  --ink: #f2f0e8;
  --ink-85: rgba(242, 240, 232, 0.85);
  --ink-80: rgba(242, 240, 232, 0.80);
  --ink-72: rgba(242, 240, 232, 0.72);
  --ink-65: rgba(242, 240, 232, 0.65);
  --ink-60: rgba(242, 240, 232, 0.60);
  --ink-55: rgba(242, 240, 232, 0.55);
  --ink-50: rgba(242, 240, 232, 0.50);
  --ink-45: rgba(242, 240, 232, 0.45);
  --line: rgba(242, 240, 232, 0.14);
  --line-18: rgba(242, 240, 232, 0.18);
  --line-25: rgba(242, 240, 232, 0.25);
  --line-30: rgba(242, 240, 232, 0.30);
  --line-35: rgba(242, 240, 232, 0.35);
  --line-40: rgba(242, 240, 232, 0.40);
  --nav-bg: rgba(14, 14, 12, 0.82);
  --card: ${d.card};
  --accent: ${d.accent};
  --accent-ink: ${d.accentInk};
  --accent-dim: ${d.accentDim};
}
[data-theme="light"] {
  --bg: ${l.bg};
  --ink: #09090b;
  --ink-85: rgba(9, 9, 11, 0.85);
  --ink-80: rgba(9, 9, 11, 0.80);
  --ink-72: rgba(9, 9, 11, 0.72);
  --ink-65: rgba(9, 9, 11, 0.65);
  --ink-60: rgba(9, 9, 11, 0.60);
  --ink-55: rgba(9, 9, 11, 0.55);
  --ink-50: rgba(9, 9, 11, 0.50);
  --ink-45: rgba(9, 9, 11, 0.45);
  --line: rgba(9, 9, 11, 0.08);
  --line-18: rgba(9, 9, 11, 0.12);
  --line-25: rgba(9, 9, 11, 0.16);
  --line-30: rgba(9, 9, 11, 0.20);
  --line-35: rgba(9, 9, 11, 0.24);
  --line-40: rgba(9, 9, 11, 0.28);
  --nav-bg: rgba(250, 250, 250, 0.85);
  --card: ${l.card};
  --accent: ${l.accent};
  --accent-ink: ${l.accentInk};
  --accent-dim: ${l.accentDim};
}
body {
  background: var(--bg) !important;
  color: var(--ink) !important;
  transition: background 0.3s ease, color 0.3s ease;
}
[data-theme="light"] body::after { opacity: 0.015 !important; }
[data-theme="light"] #splash { background: var(--bg) !important; }
[data-theme="light"] ::selection {
  background: var(--accent);
  color: var(--accent-ink);
}
[data-hover-bg] {
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease !important;
}
[data-hover-bg]:hover {
  background: var(--accent) !important;
  color: var(--accent-ink) !important;
}
[data-hover-bg]:hover * { color: var(--accent-ink) !important; }
[data-hover-bg]:hover span[style*="border"],
[data-hover-bg]:hover div[style*="border"] {
  border-color: var(--accent-ink) !important;
}
[data-hover-bg]:hover [style*="opacity"] { opacity: 0.85 !important; }
#site-footer a {
  transition: color 0.2s ease, transform 0.2s ease, opacity 0.2s ease !important;
  display: inline-block;
}
#site-footer a:hover {
  color: var(--accent) !important;
  transform: translateX(4px);
}
#back-to-top {
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease !important;
}
#back-to-top:hover {
  background: var(--accent) !important;
  color: var(--accent-ink) !important;
  border-color: var(--accent) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--accent-dim);
}
#contact a[style*="border-bottom"] {
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease !important;
  display: inline-block;
}
#contact a[style*="border-bottom"]:hover {
  color: var(--accent) !important;
  border-bottom-color: var(--accent) !important;
  transform: translateY(-2px);
}
#theme-toggle {
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease !important;
}
#theme-toggle:hover {
  border-color: var(--accent) !important;
  color: var(--accent) !important;
  transform: rotate(15deg) scale(1.08);
}
`.trim()
}
