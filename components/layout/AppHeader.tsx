"use client";

import { useState } from "react";
import Image from "next/image";
import { theme } from "@/lib/theme";

type Props = {
  title: string;
  subtitle?: string;
  onMenu?: () => void;
  right?: React.ReactNode;
};

export default function AppHeader({ title, subtitle, onMenu, right }: Props) {
  return (
    <header style={header}>
      {/* 金ライン（混色なし） */}
      <div style={goldLine} />

      <div style={inner}>
        {/* ===== 左：メニュー + タイトル ===== */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          {onMenu && <MenuButton onClick={onMenu} />}

          <div style={{ minWidth: 0 }}>
            <div style={titleStyle}>
              {/* ✅ ロゴ */}
              <Image
                src="/logo.png"
                alt={`${title} logo`}
                width={36}
                height={36}
                priority
                style={logoStyle}
              />

              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {title}
              </span>
            </div>

            {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
          </div>
        </div>

        {/* ===== 右：アクション ===== */}
        {right && <div style={rightWrap}>{right}</div>}
      </div>
    </header>
  );
}

function MenuButton({ onClick }: { onClick: () => void }) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      aria-label="メニュー"
      style={{
        ...menuBtn,
        ...(pressed ? menuBtnPressed : {}),
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
    >
      <span style={menuIcon}>☰</span>
    </button>
  );
}

/* =========================
   styles
========================= */

const header: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,

  background: theme.surface,
  backdropFilter: "blur(16px)",

  borderBottom: `1px solid ${theme.border}`,
  boxShadow: "0 10px 22px rgba(2,6,23,0.06)",

  // iPhone safe area
  paddingTop: "env(safe-area-inset-top)",
};

const goldLine: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  height: 2,
  background: theme.accent,
  opacity: 0.95,
  pointerEvents: "none",
};

const inner: React.CSSProperties = {
  maxWidth: 520,
  margin: "0 auto",
  padding: "12px 16px 10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const titleStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,

  fontSize: 22,
  fontWeight: 950,
  letterSpacing: -0.2,
  lineHeight: 1.12, 
  color: theme.primary,
};


const logoStyle: React.CSSProperties = {
  borderRadius: 4,
  flexShrink: 0,
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  marginTop: 3,
  letterSpacing: 0.2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const rightWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexShrink: 0,
};

const menuBtn: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 14,

  border: `1px solid ${theme.border}`,
  background: "rgba(255,255,255,0.92)",

  display: "grid",
  placeItems: "center",

  cursor: "pointer",
  boxShadow: "0 10px 18px rgba(2,6,23,0.08)",
  transition: "transform .12s ease, opacity .12s ease, box-shadow .18s ease",
};

const menuBtnPressed: React.CSSProperties = {
  transform: "scale(0.985)",
  opacity: 0.92,
  boxShadow: "0 8px 14px rgba(2,6,23,0.07)",
};

const menuIcon: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 900,
  color: theme.primary,
  lineHeight: 1,
};
