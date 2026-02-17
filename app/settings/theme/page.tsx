"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import SideMenu from "@/components/layout/SideMenu";
import TabBar from "@/components/nav/TabBar";
import { theme, THEME_PRESETS, type ThemeName, getStoredTheme, setTheme } from "@/lib/theme";

const THEME_LABELS: Record<ThemeName, string> = {
  blue: "Blue",
  red: "Red",
  green: "Green",
  navy: "Navy",
  brown: "Brown",
  olive: "Olive",
  violet: "Violet",
  teal: "Teal",
  charcoal: "Charcoal",
  coral: "Coral",
  indigo: "Indigo",
  slate: "Slate",
};

export default function ThemeSettingsPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const [current, setCurrent] = useState<ThemeName>(() => getStoredTheme());
  const keys = useMemo(() => Object.keys(THEME_PRESETS) as ThemeName[], []);

  return (
    <>
      <AppHeader title="MoneyNote" subtitle="テーマカラー" onMenu={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main style={page}>
        <div style={container}>
          <div style={{ display: "grid", gap: 10 }}>
            {keys.map((k) => {
              const t = THEME_PRESETS[k];
              const active = k === current;

              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setTheme(k);      // ✅ 即反映
                    setCurrent(k);    // ✅ 表示更新
                  }}
                  style={{
                    ...themeOption,
                    border: active ? `2px solid ${theme.accent}` : "1px solid rgba(15,23,42,0.10)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={swatches}>
                      <span style={{ ...swatch, background: t.primary }} />
                      <span style={{ ...swatch, background: t.accent }} />
                      <span
                        style={{
                          ...swatch,
                          background: t.background,
                          border: "1px solid rgba(15,23,42,0.10)",
                        }}
                      />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 950, color: theme.text, letterSpacing: 0.2 }}>
                        {THEME_LABELS[k]}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: theme.subtext }}>
                        primary / accent / background
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, fontWeight: 900, color: active ? theme.accent : theme.subtext }}>
                    {active ? "選択中" : "選ぶ"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <TabBar />
    </>
  );
}

/* styles */

const page: React.CSSProperties = {
  height: "100dvh",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  background: theme.background,
};

const container: React.CSSProperties = {
  paddingTop: 76,
  paddingLeft: 16,
  paddingRight: 16,
  paddingBottom: 90,
};

const themeOption: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 12px",
  borderRadius: 14,
  background: "rgba(255,255,255,0.92)",
  cursor: "pointer",
};

const swatches: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 8px",
  borderRadius: 999,
  border: "1px solid rgba(15,23,42,0.10)",
  background: "rgba(255,255,255,0.9)",
};

const swatch: React.CSSProperties = {
  width: 12,
  height: 12,
  borderRadius: 999,
};
