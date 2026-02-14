"use client";

import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import SideMenu from "@/components/layout/SideMenu";
import TabBar from "@/components/nav/TabBar";

const theme = {
  primary: "#1D4E89",
  accent: "#D6B58A",
  surface: "#FFFFFF",
  text: "#0F172A",
  subtext: "#64748B",
  border: "rgba(15,23,42,0.10)",
  blueBorder: "rgba(29,78,137,0.12)",
};

export default function SettingsPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <AppHeader title="MoneyNote" subtitle="設定" onMenu={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div style={container}>
        <Section title="表示 / テーマ">
          <SettingRow
            title="テーマカラー"
            sub="青（primary）と金（accent）※後で変更機能を実装"
            right={<ThemePreview />}
            onClick={() => {}}
          />
          <SettingRow title="表示密度" sub="コンパクト / 標準（後で対応）" onClick={() => {}} />
        </Section>

        <Section title="通知">
          <SettingRow title="通知" sub="ON/OFF（後で対応）" right={<Badge text="準備中" />} onClick={() => {}} />
          <SettingRow title="リマインド" sub="固定費の支払日（後で対応）" right={<Badge text="準備中" />} onClick={() => {}} />
        </Section>

        <Section title="データ">
          <SettingRow title="バックアップ" sub="エクスポート/復元（後で対応）" right={<Badge text="準備中" />} onClick={() => {}} />
          <SettingRow title="同期" sub="外部ストレージ連携（後で対応）" right={<Badge text="準備中" />} onClick={() => {}} />
        </Section>

        <Section title="アプリ情報">
          <SettingRow title="バージョン" sub="v0.1.0" right={<Badge text="beta" />} onClick={() => {}} />
          <SettingRow title="利用規約" sub="後で追加" onClick={() => {}} last />
        </Section>
      </div>

      <TabBar />
    </>
  );
}

/* =========================
   Parts
========================= */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={sectionTitleRow}>
        <span style={sectionDot} />
        <div style={sectionTitle}>{title}</div>
      </div>
      <div style={sectionCard}>{children}</div>
    </div>
  );
}

function SettingRow({
  title,
  sub,
  right,
  onClick,
  last,
}: {
  title: string;
  sub: string;
  right?: React.ReactNode;
  onClick: () => void;
  last?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...row,
        borderBottom: last ? "none" : "1px solid rgba(15,23,42,0.06)",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={rowTitle}>{title}</div>
        <div style={rowSub}>{sub}</div>
      </div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        {right}
        <div style={chevWrap}>
          <span style={chevDot} />
          <span style={chev}>›</span>
        </div>
      </div>
    </button>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <div style={badge}>
      <span style={badgeDot} />
      {text}
    </div>
  );
}

function ThemePreview() {
  return (
    <div style={previewWrap}>
      <span style={{ ...previewDot, background: theme.primary }} />
      <span style={{ ...previewDot, background: theme.accent }} />
    </div>
  );
}

/* =========================
   styles
========================= */

const container: React.CSSProperties = {
  paddingTop: 76,
  paddingLeft: 16,
  paddingRight: 16,
  paddingBottom: 90,
};

const sectionTitleRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  margin: "10px 6px",
};

const sectionDot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  color: theme.subtext,
  letterSpacing: 0.2,
};

const sectionCard: React.CSSProperties = {
  background: theme.surface,
  borderRadius: 16,
  overflow: "hidden",
  border: `1px solid ${theme.blueBorder}`,
  boxShadow: "0 14px 26px rgba(2,6,23,0.06)",
};

const row: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "14px 14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
};

const rowTitle: React.CSSProperties = {
  fontWeight: 950,
  color: theme.text,
  letterSpacing: 0.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const rowSub: React.CSSProperties = {
  marginTop: 3,
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const chevWrap: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const chevDot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.16)",
};

const chev: React.CSSProperties = {
  fontSize: 22,
  opacity: 0.35,
  color: theme.text,
};

const badge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(214,181,138,0.18)",
  border: "1px solid rgba(214,181,138,0.40)",
  color: theme.accent,
  fontSize: 11,
  fontWeight: 950,
  letterSpacing: 0.3,
};

const badgeDot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.16)",
};

const previewWrap: React.CSSProperties = {
  display: "inline-flex",
  gap: 8,
  alignItems: "center",
  padding: "6px 8px",
  borderRadius: 999,
  border: `1px solid ${theme.blueBorder}`,
  background: "rgba(255,255,255,0.9)",
};

const previewDot: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: 999,
};
