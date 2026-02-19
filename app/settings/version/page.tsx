// app/settings/version/page.tsx
"use client";

import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import SideMenu from "@/components/layout/SideMenu";
import TabBar from "@/components/nav/TabBar/Index";
import { theme } from "@/lib/theme";
import { Info, GitCommit, Calendar, ChevronRight } from "lucide-react";

export default function VersionPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <AppHeader title="MoneyNote" subtitle="バージョン" onMenu={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main style={page}>
        <div style={container}>
          <div style={heroCard}>
            <div style={heroTopRow}>
              <div style={heroLeft}>
                <div style={iconBadge}>
                  <Info size={16} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={heroTitle}>アプリ情報</div>
                  <div style={heroSub}>現在のバージョンとリリース情報</div>
                </div>
              </div>

              <div style={pill}>
                <span style={pillDot} />
                v0.1.8
              </div>
            </div>

            <div style={heroLine} />
          </div>

          <div style={card}>
            <Row icon={<GitCommit size={18} />} title="バージョン" value="v0.1.8" />
            <Row icon={<Calendar size={18} />} title="リリース日" value="2026/02/19" last />
          </div>

          <div style={note}>
            ※ ここは仮のページです。リリース日やビルド番号は後で自動化できます。
          </div>

          <div style={miniNavCard}>
            <button
              type="button"
              style={miniNavBtn}
              onClick={() => (location.href = "/settings/terms")}
            >
              <div style={miniNavLeft}>
                <div style={miniNavTitle}>利用規約</div>
                <div style={miniNavSub}>アプリの利用条件</div>
              </div>
              <ChevronRight size={18} style={{ opacity: 0.4 }} />
            </button>
          </div>
        </div>
      </main>

      <TabBar />
    </>
  );
}

function Row({
  icon,
  title,
  value,
  last,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        ...row,
        borderBottom: last ? "none" : "1px solid rgba(15,23,42,0.07)",
      }}
    >
      <div style={rowLeft}>
        <div style={rowIcon}>{icon}</div>
        <div style={rowTitle}>{title}</div>
      </div>
      <div style={rowValue}>{value}</div>
    </div>
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
  paddingBottom: 110,
};

const heroCard: React.CSSProperties = {
  marginTop: 10,
  borderRadius: 20,
  border: "1px solid rgba(29,78,137,0.14)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 100%)",
  boxShadow: "0 20px 40px rgba(2,6,23,0.08)",
  padding: 14,
  position: "relative",
  overflow: "hidden",
};

const heroTopRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
};

const heroLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  minWidth: 0,
};

const iconBadge: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 14,
  display: "grid",
  placeItems: "center",
  border: "1px solid rgba(29,78,137,0.14)",
  background: "rgba(29,78,137,0.08)",
  color: theme.primary,
  boxShadow: "0 12px 18px rgba(2,6,23,0.06)",
  flexShrink: 0,
};

const heroTitle: React.CSSProperties = {
  fontWeight: 950,
  fontSize: 14,
  letterSpacing: 0.2,
  color: theme.text,
};

const heroSub: React.CSSProperties = {
  marginTop: 3,
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  lineHeight: 1.45,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const pill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "7px 10px",
  borderRadius: 999,
  border: "1px solid rgba(214,181,138,0.30)",
  background: "rgba(214,181,138,0.14)",
  color: "rgba(120,82,37,0.92)",
  fontSize: 12,
  fontWeight: 950,
  letterSpacing: 0.2,
  flexShrink: 0,
};

const pillDot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.14)",
};

const heroLine: React.CSSProperties = {
  marginTop: 12,
  height: 1,
  width: "100%",
  background:
    "linear-gradient(90deg, rgba(29,78,137,0.18) 0%, rgba(29,78,137,0.06) 55%, rgba(29,78,137,0) 100%)",
};

const card: React.CSSProperties = {
  marginTop: 14,
  borderRadius: 18,
  overflow: "hidden",
  border: "1px solid rgba(29,78,137,0.12)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.78) 100%)",
  boxShadow: "0 16px 30px rgba(2,6,23,0.06)",
};

const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  padding: "14px 14px",
};

const rowLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  minWidth: 0,
};

const rowIcon: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 16,
  display: "grid",
  placeItems: "center",
  border: "1px solid rgba(29,78,137,0.14)",
  background: "rgba(255,255,255,0.88)",
  color: theme.primary,
  boxShadow: "0 12px 18px rgba(2,6,23,0.06)",
  flexShrink: 0,
};

const rowTitle: React.CSSProperties = {
  fontWeight: 950,
  color: theme.text,
  letterSpacing: 0.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const rowValue: React.CSSProperties = {
  fontWeight: 950,
  color: theme.primary,
  letterSpacing: 0.2,
  whiteSpace: "nowrap",
  flexShrink: 0,
};

const note: React.CSSProperties = {
  marginTop: 10,
  fontSize: 12,
  fontWeight: 800,
  color: "rgba(15,23,42,0.55)",
};

const miniNavCard: React.CSSProperties = {
  marginTop: 12,
  borderRadius: 18,
  overflow: "hidden",
  border: "1px solid rgba(29,78,137,0.10)",
  background: "rgba(255,255,255,0.86)",
  boxShadow: "0 14px 26px rgba(2,6,23,0.06)",
};

const miniNavBtn: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const miniNavLeft: React.CSSProperties = {
  minWidth: 0,
};

const miniNavTitle: React.CSSProperties = {
  fontWeight: 950,
  color: theme.text,
  letterSpacing: 0.2,
};

const miniNavSub: React.CSSProperties = {
  marginTop: 3,
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
