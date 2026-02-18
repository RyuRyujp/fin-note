"use client";

import { useState, useMemo } from "react";
import { useExpenseStore } from "@/lib/store/expenseStore";
import AppHeader from "@/components/layout/AppHeader";
import SideMenu from "@/components/layout/SideMenu";
import TabBar from "@/components/nav/TabBar/Index";
import { CategoryIcon } from "@/components/layout/CategoryIcon";
import { theme } from "@/lib/theme";

/* ===============================
   型
================================ */
type Income = {
  id: string;
  date: string;
  detail: string;
  amount: number;
};

/* ===============================
   Page
================================ */
export default function IncomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { incomes, loading } = useExpenseStore() as {
    incomes: Income[];
    loading: boolean;
  };

  /** 今月合計 */
  const total = useMemo(() => incomes.reduce((s, e) => s + e.amount, 0), [incomes]);

  return (
    <>
      <AppHeader title="Fin Note" subtitle="収入" onMenu={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div style={container}>
        {/* ===== 合計カード ===== */}
        <div style={totalCard}>
          <div style={goldLine} />

          <div style={totalTopRow}>
            <div style={totalTitleRow}>
              <span style={titleDot} />
              <div style={totalLabel}>今月の収入合計</div>
            </div>

            <div style={countBadge}>
              <span style={countDot} />
              {incomes.length} 件
            </div>
          </div>

          <div style={totalAmount}>¥{total.toLocaleString()}</div>

          <div style={totalHint}>入金・収入の記録</div>
        </div>

        {/* ===== Loading ===== */}
        {loading && <div style={loadingText}>読み込み中...</div>}

        {/* ===== Empty ===== */}
        {!loading && incomes.length === 0 && (
          <div style={emptyBox}>
            <div style={goldLineThin} />
            <div style={emptyTitle}>収入データがありません</div>
            <div style={emptySub}>新しい収入を追加してください</div>
          </div>
        )}

        {/* ===== List ===== */}
        <div style={list}>
          {incomes.map((e) => (
            <IncomeRow key={e.id} item={e} />
          ))}
        </div>
      </div>

      <TabBar />
    </>
  );
}

/* ===============================
   Row Component
================================ */
function IncomeRow({ item }: { item: Income }) {
  return (
    <div style={card}>
      <div style={goldLineThin} />

      <div style={left}>
        <CategoryIcon category="収入" />

        <div style={{ minWidth: 0 }}>
          <div style={title}>{item.detail}</div>
          <div style={meta}>{item.date}</div>
        </div>
      </div>

      <div style={right}>
        <div style={incomeBadge}>+ Income</div>
        <div style={price}>¥{item.amount.toLocaleString()}</div>
      </div>
    </div>
  );
}

/* ===============================
   styles
================================ */
const container: React.CSSProperties = {
  paddingTop: 76,
  paddingLeft: 16,
  paddingRight: 16,
  paddingBottom: 90,
};

const totalCard: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  background: theme.primary, // ✅ 青ベタ（統一）
  borderRadius: 22,
  padding: 18,
  color: "white",
  boxShadow: "0 18px 46px rgba(29,78,137,0.30)",
};

const goldLine: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 2,
  background: theme.accent, // ✅ 金
  opacity: 0.95,
  pointerEvents: "none",
};

const totalTopRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const totalTitleRow: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  minWidth: 0,
};

const titleDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 5px rgba(214,181,138,0.20)",
  flexShrink: 0,
};

const totalLabel: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 900,
  letterSpacing: 0.2,
  opacity: 0.95,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const countBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.18)",
  fontSize: 12,
  fontWeight: 900,
};

const countDot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const totalAmount: React.CSSProperties = {
  fontSize: 34,
  fontWeight: 950,
  marginTop: 10,
  letterSpacing: 0.2,
};

const totalHint: React.CSSProperties = {
  marginTop: 8,
  fontSize: 12,
  fontWeight: 800,
  opacity: 0.75,
};

const loadingText: React.CSSProperties = {
  marginTop: 18,
  fontSize: 13,
  fontWeight: 800,
  color: theme.subtext,
};

const emptyBox: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  marginTop: 18,
  padding: 22,
  borderRadius: 18,
  background: theme.surface,
  textAlign: "center",
  border: `1px solid ${theme.border}`,
  boxShadow: "0 14px 26px rgba(2,6,23,0.06)",
};

const goldLineThin: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 2,
  background: theme.accent,
  opacity: 0.95,
  pointerEvents: "none",
};

const emptyTitle: React.CSSProperties = {
  fontWeight: 950,
  fontSize: 15,
  color: theme.text,
  letterSpacing: 0.2,
};

const emptySub: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  marginTop: 6,
};

const list: React.CSSProperties = {
  marginTop: 18,
  display: "grid",
  gap: 12,
};

const card: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  background: theme.surface,
  borderRadius: 18,
  padding: "14px 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 14,
  border: `1px solid ${theme.border}`,
  boxShadow: "0 14px 28px rgba(2,6,23,0.06)",
};

const left: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  minWidth: 0,
};

const title: React.CSSProperties = {
  fontWeight: 900,
  fontSize: 14,
  color: theme.text,
  letterSpacing: 0.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const meta: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  marginTop: 2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const right: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  flexShrink: 0,
};

const incomeBadge: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(214,181,138,0.18)", // ✅ 金の薄面
  border: "1px solid rgba(214,181,138,0.40)",
  color: theme.accent, // ✅ 金文字
  fontSize: 11,
  fontWeight: 950,
  letterSpacing: 0.3,
};

const price: React.CSSProperties = {
  fontWeight: 950,
  fontSize: 15,
  color: theme.primary, // ✅ 金額も青で統一
  letterSpacing: 0.2,
};
