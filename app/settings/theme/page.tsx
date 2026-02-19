"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import AppHeader from "@/components/layout/AppHeader";
import SideMenu from "@/components/layout/SideMenu";
import TabBar from "@/components/nav/TabBar/Index";
import {
  theme,
  THEME_PRESETS,
  type ThemeName,
  getStoredTheme,
  setTheme,
} from "@/lib/theme";

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
          {/* 見出し行：戻る + タイトル */}
          <div style={headRow}>
            <button
              type="button"
              onClick={() => router.back()}
              style={backBtn}
              aria-label="戻る"
            >
              ← 戻る
            </button>

            <div style={{ minWidth: 0 }}>
              <div style={title}>テーマを選択</div>
              <div style={subTitle}>色名・プレビュー・適用状態だけをシンプルに表示</div>
            </div>
          </div>

          <div style={grid}>
            {keys.map((k) => {
              const t = THEME_PRESETS[k];
              const active = k === current;

              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setTheme(k);
                    setCurrent(k);
                  }}
                  style={{
                    ...card,
                    border: active ? `2px solid ${theme.accent}` : "1px solid rgba(15,23,42,0.10)",
                    boxShadow: active ? "0 10px 30px rgba(2, 6, 23, 0.12)" : "0 8px 22px rgba(2, 6, 23, 0.08)",
                    transform: active ? "translateY(-1px)" : "translateY(0px)",
                  }}
                  aria-pressed={active}
                >
                  {/* 上段：色タイトル + 適用状態 */}
                  <div style={topRow}>
                    <div style={{ minWidth: 0 }}>
                      <div style={labelRow}>
                        <div style={{ ...label, color: theme.text }}>{THEME_LABELS[k]}</div>
                        <span style={{ ...chip, ...(active ? chipActive : chipIdle) }}>
                          {active ? "適用中" : "未適用"}
                        </span>
                      </div>
                      <div style={{ ...caption, color: theme.subtext }}>
                        {active ? "現在テーマとして設定されています" : "タップするとこのテーマを適用します"}
                      </div>
                    </div>

                    <div style={rightBadgeWrap}>
                      <span style={{ ...radio, ...(active ? radioOn : radioOff) }}>
                        <span style={{ ...radioDot, opacity: active ? 1 : 0 }} />
                      </span>
                    </div>
                  </div>

                  {/* 下段：色プレビュー（ラベルなし、色だけ） */}
                  <div style={previewRow}>
                    <div style={{ ...preview, background: t.primary }} aria-label="color preview 1" />
                    <div style={{ ...preview, background: t.accent }} aria-label="color preview 2" />
                    <div
                      style={{
                        ...preview,
                        background: t.background,
                        border: "1px solid rgba(15,23,42,0.14)",
                      }}
                      aria-label="color preview 3"
                    />
                  </div>

                  {/* 最下段：右寄せの一言 */}
                  <div style={bottomRow}>
                    <span style={{ ...applyPill, ...(active ? applyPillOn : applyPillOff) }}>
                      {active ? "選択中" : "適用する"}
                    </span>
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

/* ===============================
   styles
================================ */

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
  paddingBottom: 96,
  maxWidth: 980,
  margin: "0 auto",
};

const headRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  alignItems: "start",
  gap: 12,
  marginTop: 6,
  marginBottom: 14,
};

const backBtn: React.CSSProperties = {
  height: 36,
  padding: "0 10px",
  borderRadius: 12,
  border: "1px solid rgba(15,23,42,0.12)",
  background: "rgba(255,255,255,0.92)",
  fontWeight: 900,
  cursor: "pointer",
  color: theme.text,
  whiteSpace: "nowrap",
};

const title: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 950,
  letterSpacing: 0.2,
  color: theme.text,
};

const subTitle: React.CSSProperties = {
  marginTop: 6,
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
};

const grid: React.CSSProperties = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
};

const card: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  padding: 14,
  borderRadius: 18,
  background: "rgba(255,255,255,0.92)",
  cursor: "pointer",
  transition: "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease",
};

const topRow: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
};

const labelRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  minWidth: 0,
  flexWrap: "wrap",
};

const label: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 950,
  letterSpacing: 0.2,
  whiteSpace: "nowrap",
};

const caption: React.CSSProperties = {
  marginTop: 6,
  fontSize: 12,
  fontWeight: 850,
};

const chip: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 950,
  padding: "4px 8px",
  borderRadius: 999,
  letterSpacing: 0.2,
  border: "1px solid rgba(15,23,42,0.10)",
};

const chipActive: React.CSSProperties = {
  background: "rgba(255,255,255,0.60)",
  color: theme.accent,
};

const chipIdle: React.CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  color: theme.subtext,
};

const rightBadgeWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  paddingTop: 2,
};

const radio: React.CSSProperties = {
  width: 20,
  height: 20,
  borderRadius: 999,
  display: "grid",
  placeItems: "center",
  flex: "0 0 auto",
};

const radioOn: React.CSSProperties = {
  border: `2px solid ${theme.accent}`,
  background: "rgba(255,255,255,0.60)",
};

const radioOff: React.CSSProperties = {
  border: "2px solid rgba(15,23,42,0.18)",
  background: "rgba(255,255,255,0.85)",
};

const radioDot: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: 999,
  background: theme.accent,
  transition: "opacity 120ms ease",
};

const previewRow: React.CSSProperties = {
  marginTop: 12,
  display: "grid",
  gap: 10,
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
};

const preview: React.CSSProperties = {
  height: 22,
  borderRadius: 999,
  border: "1px solid rgba(0,0,0,0.06)",
};

const bottomRow: React.CSSProperties = {
  marginTop: 12,
  display: "flex",
  justifyContent: "flex-end",
};

const applyPill: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 950,
  padding: "8px 10px",
  borderRadius: 999,
  letterSpacing: 0.2,
  whiteSpace: "nowrap",
};

const applyPillOn: React.CSSProperties = {
  color: theme.accent,
  border: "1px solid rgba(0,0,0,0.0)",
  background: "rgba(255,255,255,0.40)",
};

const applyPillOff: React.CSSProperties = {
  color: theme.text,
  border: "1px solid rgba(15,23,42,0.12)",
  background: "rgba(255,255,255,0.92)",
};
