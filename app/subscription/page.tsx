"use client";

import { useMemo, useState } from "react";
import { useExpenseStore } from "@/lib/store/expenseStore";
import AppHeader from "@/components/layout/AppHeader";
import SideMenu from "@/components/layout/SideMenu";
import TabBar from "@/components/nav/TabBar";
import { CategoryIcon } from "@/components/layout/CategoryIcon";
import { theme } from "@/lib/theme";

/* ===============================
   型
================================ */
type FixedExpense = {
  id: string;
  detail: string;
  amount: number;
  day: number; // 支払日
  category: string;
};

/* ===============================
   Page
================================ */
export default function SubscriptionsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { fixedExpenses } = useExpenseStore() as { fixedExpenses: FixedExpense[] };

  /** 今月合計 */
  const total = useMemo(
    () => fixedExpenses.reduce((s, e) => s + e.amount, 0),
    [fixedExpenses]
  );

  return (
    <>
      <AppHeader title="Fin Note" subtitle="サブスク" onMenu={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div style={pageWrap}>
        {/* ===== 合計カード ===== */}
        <div style={totalCard}>
          <div style={goldLine} />

          <div style={totalTopRow}>
            <div style={totalTitleRow}>
              <span style={titleDot} />
              <div style={totalTitle}>今月の固定費</div>
            </div>

            <div style={countBadge}>
              <span style={countDot} />
              {fixedExpenses.length} 件
            </div>
          </div>

          <div style={totalAmount}>¥{total.toLocaleString()}</div>

          <div style={totalHint}>毎月発生する固定費の合計</div>
        </div>

        {/* ===== リスト ===== */}
        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          {fixedExpenses.map((e) => (
            <SubRow key={e.id} item={e} />
          ))}
        </div>
      </div>

      <TabBar />
    </>
  );
}

/* ===============================
   行UI
================================ */
function SubRow({ item }: { item: FixedExpense }) {
  return (
    <div style={card}>
      <div style={goldLineThin} />

      {/* 左 */}
      <div style={left}>
        <CategoryIcon category={item.category} />

        <div style={{ minWidth: 0 }}>
          <div style={rowTitle}>{item.detail}</div>
          <div style={meta}>
            毎月 {item.day} 日 ・ {item.category}
          </div>
        </div>
      </div>

      {/* 右 */}
      <div style={right}>
        <div style={price}>¥{item.amount.toLocaleString()}</div>
        <div style={chevWrap}>
          <span style={chevDot} />
          <span style={chev}>›</span>
        </div>
      </div>
    </div>
  );
}

/* ===============================
   styles
================================ */

const pageWrap: React.CSSProperties = {
  paddingTop: 76,
  paddingLeft: 16,
  paddingRight: 16,
  paddingBottom: 90,
};

const totalCard: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  background: theme.primary, // ✅ 青ベタ（混色なし）
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
  background: theme.accent, // ✅ 金
  boxShadow: "0 0 0 5px rgba(214,181,138,0.20)",
  flexShrink: 0,
};

const totalTitle: React.CSSProperties = {
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
  background: "rgba(255,255,255,0.12)", // ✅ 白の透過（色混ぜではなく白）
  border: "1px solid rgba(255,255,255,0.18)",
  fontSize: 12,
  fontWeight: 900,
};

const countDot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: 999,
  background: theme.accent, // ✅ 金
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

const left: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  minWidth: 0,
};

const rowTitle: React.CSSProperties = {
  fontWeight: 900,
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

const price: React.CSSProperties = {
  fontWeight: 950,
  fontSize: 15,
  color: theme.primary, // ✅ 金額は青で統一
  letterSpacing: 0.2,
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
  background: theme.accent, // ✅ 金
  boxShadow: "0 0 0 4px rgba(214,181,138,0.16)",
};

const chev: React.CSSProperties = {
  fontSize: 22,
  opacity: 0.35,
  color: theme.text,
};
