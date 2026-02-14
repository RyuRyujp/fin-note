"use client";

import { useMemo, useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import SideMenu from "@/components/layout/SideMenu";
import TabBar from "@/components/nav/TabBar";

type Category = {
  id: string;
  name: string;
  // 後で「カテゴリ色」を本実装するならここに追加（今は使わない）
  // color?: string;
};

const theme = {
  primary: "#1D4E89",
  accent: "#D6B58A",
  surface: "#FFFFFF",
  text: "#0F172A",
  subtext: "#64748B",
  blueBorder: "rgba(29,78,137,0.12)",
};

export default function CategoryPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  // 仮データ（後で store から取得に置き換え）
  const categories = useMemo<Category[]>(
    () => [
      { id: "c1", name: "食費" },
      { id: "c2", name: "生活費" },
      { id: "c3", name: "交通費" },
      { id: "c4", name: "日用品" },
      { id: "c5", name: "娯楽・趣味" },
      { id: "c6", name: "未分類" },
    ],
    []
  );

  return (
    <>
      <AppHeader title="MoneyNote" subtitle="カテゴリ" onMenu={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div style={container}>
        {/* 上部カード（説明） */}
        <div style={infoCard}>
          <div style={goldLine} />
          <div style={infoTitleRow}>
            <span style={titleDot} />
            <div style={infoTitle}>カテゴリ管理</div>
          </div>
          <div style={infoSub}>
            色の変更・並び替え・追加/削除は後で実装します（今回はUI土台だけ）
          </div>
        </div>

        {/* 一覧 */}
        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
          {categories.map((c) => (
            <CategoryRow key={c.id} name={c.name} />
          ))}
        </div>

        {/* フッターヒント */}
        <div style={hint}>
          <span style={hintDot} />
          ここは “準備中” ですが、後で色ピッカー・D&D並び替え・追加ボタンを載せられる構造です。
        </div>
      </div>

      <TabBar />
    </>
  );
}

function CategoryRow({ name }: { name: string }) {
  return (
    <div style={rowCard}>
      <div style={goldLineThin} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <div style={categoryMark} />
        <div style={{ minWidth: 0 }}>
          <div style={rowTitle}>{name}</div>
          <div style={rowSub}>色 / 並び替え（準備中）</div>
        </div>
      </div>

      <div style={rightSide}>
        <div style={badge}>
          <span style={badgeDot} />
          準備中
        </div>
        <div style={chevWrap}>
          <span style={chevDot} />
          <span style={chev}>›</span>
        </div>
      </div>
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

const infoCard: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 18,
  background: theme.surface,
  border: `1px solid ${theme.blueBorder}`,
  boxShadow: "0 14px 26px rgba(2,6,23,0.06)",
  padding: 16,
};

const goldLine: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 2,
  background: theme.accent,
  opacity: 0.95,
};

const infoTitleRow: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
};

const titleDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 5px rgba(214,181,138,0.20)",
};

const infoTitle: React.CSSProperties = {
  fontWeight: 950,
  color: theme.primary,
  letterSpacing: 0.2,
};

const infoSub: React.CSSProperties = {
  marginTop: 8,
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  lineHeight: 1.5,
};

const rowCard: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  background: theme.surface,
  borderRadius: 18,
  padding: "14px 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 14,
  border: `1px solid ${theme.blueBorder}`,
  boxShadow: "0 14px 28px rgba(2,6,23,0.06)",
};

const goldLineThin: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 2,
  background: theme.accent,
  opacity: 0.95,
};

const categoryMark: React.CSSProperties = {
  width: 14,
  height: 14,
  borderRadius: 999,
  background: theme.primary, // 今は青固定（色管理は後で）
  boxShadow: "0 0 0 4px rgba(29,78,137,0.14)",
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

const rowSub: React.CSSProperties = {
  marginTop: 3,
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const rightSide: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  flexShrink: 0,
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

const hint: React.CSSProperties = {
  marginTop: 14,
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  opacity: 0.95,
};

const hintDot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};
