export const THEME_PRESETS = {
  blue: {
    primary: "#1D4E89",
    accent: "#D6B58A",
    background: "#FAFAFA",
    textOnPrimary: "#0D1B2A",
    textSubtleOnPrimary: "#DDDDDD",
  },

  red: {
    primary: "#8B2C2C",
    accent: "#D6B58A",
    background: "#FAFAFA",
    textOnPrimary: "#0D1B2A",
    textSubtleOnPrimary: "#DDDDDD",
  },
  green: {
    primary: "#2F6B4F",
    accent: "#D6B58A",
    background: "#FAFAFA",
    textOnPrimary: "#0D1B2A",
    textSubtleOnPrimary: "#DDDDDD",
  },
  navy: {
    primary: "#243A5E",
    accent: "#D6B58A",
    background: "#FAFAFA",
    textOnPrimary: "#0D1B2A",
    textSubtleOnPrimary: "#DDDDDD",
  },
  brown: {
    primary: "#6B4F3F",
    accent: "#D6B58A",
    background: "#FAFAFA",
    textOnPrimary: "#0D1B2A",
    textSubtleOnPrimary: "#DDDDDD",
  },
  olive: {
    primary: "#5A6B3C",
    accent: "#D6B58A",
    background: "#FAFAFA",
    textOnPrimary: "#0D1B2A",
    textSubtleOnPrimary: "#DDDDDD",
  },
  violet: {
    primary: "#5B4B8A",
    accent: "#F2C94C",
    background: "#F7F7FB",
    textOnPrimary: "#0D1B2A",
    textSubtleOnPrimary: "#E0E0E0",
  },
  teal: {
    primary: "#1F7A8C",
    accent: "#F4A261",
    background: "#F6FAFB",
    textOnPrimary: "#0D1B2A",
    textSubtleOnPrimary: "#D9E5EA",
  },
  charcoal: {
    primary: "#2B2E34",
    accent: "#E09F3E",
    background: "#F5F5F5",
    textOnPrimary: "#0D1B2A",
    textSubtleOnPrimary: "#CCCCCC",
  },
  coral: {
    primary: "#E76F51",
    accent: "#D6B58A",
    background: "#FFF8F6",
    textOnPrimary: "#0D1B2A",
    textSubtleOnPrimary: "#F0DAD4",
  },
  indigo: {
    primary: "#3A3F9D",
    accent: "#A8DADC",
    background: "#F4F6FB",
    textOnPrimary: "#0D1B2A",
    textSubtleOnPrimary: "#D6DAF0",
  },
  slate: {
    primary: "#4A5D73",
    accent: "#F28482",
    background: "#F7F9FA",
    textOnPrimary: "#0D1B2A",
    textSubtleOnPrimary: "#D1D9E0",
  },
} as const;

export type ThemeName = keyof typeof THEME_PRESETS;

export const THEME_STORAGE_KEY = "moneynote_theme";
export const DEFAULT_THEME: ThemeName = "blue";

export const theme = {
  primary: "var(--primary)",
  accent: "var(--accent)",
  background: "var(--background)",
  surface: "var(--surface)",

  text: "var(--text)",
  subtext: "var(--subtext)",

  border: "var(--border)",

  textOnPrimary: "var(--text-on-primary)",
  textSubtleOnPrimary: "var(--text-subtle-on-primary)",
} as const;

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function applyTheme(name: ThemeName) {
  if (typeof window === "undefined") return;

  const t = THEME_PRESETS[name] ?? THEME_PRESETS[DEFAULT_THEME];
  const root = document.documentElement;

  root.style.setProperty("--primary", t.primary);
  root.style.setProperty("--accent", t.accent);
  root.style.setProperty("--background", t.background);

  // 既存デザインを壊さないため、カード面は白固定（必要ならここを t.background にしてもOK）
  root.style.setProperty("--surface", "#FFFFFF");

  // 基本文字色は今まで通り（必要ならここもプリセット化可）
  root.style.setProperty("--text", "#0F172A");
  root.style.setProperty("--subtext", "#64748B");

  // 汎用ボーダー（今までの theme.border 相当）
  root.style.setProperty("--border", "rgba(15,23,42,0.10)");

  // “テーマ色っぽい薄枠” を primary から自動生成（blueBorderの後継）
  root.style.setProperty("--primary-border", hexToRgba(t.primary, 0.12));

  root.style.setProperty("--text-on-primary", t.textOnPrimary);
  root.style.setProperty("--text-subtle-on-primary", t.textSubtleOnPrimary);
}

export function getStoredTheme(): ThemeName {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const v = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
  return v && v in THEME_PRESETS ? v : DEFAULT_THEME;
}

export function setTheme(name: ThemeName) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_STORAGE_KEY, name);
  applyTheme(name);
}

export function initTheme() {
  applyTheme(getStoredTheme());
}
