"use client";

import { useMemo, useState } from "react";
import { FixedExpense, LivingExpense, useExpenseStore } from "@/lib/store/expenseStore";
import AppHeader from "@/components/layout/AppHeader";
import SideMenu from "@/components/layout/SideMenu";
import TabBar from "@/components/nav/TabBar";
import { CategoryIcon } from "@/components/layout/CategoryIcon";
import { theme } from "@/lib/theme";

type SubTab = "fixed" | "living";

/* ===============================
   Page
================================ */
export default function SubscriptionsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<SubTab>("fixed");
  const idx = tab === "fixed" ? 0 : 1;

  const { fixedExpenses } = useExpenseStore() as { fixedExpenses: FixedExpense[] };
  const { livingExpenses } = useExpenseStore() as { livingExpenses: LivingExpense[] };

  /** 今月合計 */
  const fixedTotal = useMemo(
    () => fixedExpenses.reduce((s, e) => s + e.amount, 0),
    [fixedExpenses]
  );

  // LivingExpense 側に amount が無い/undefined の可能性に備えて安全に合計
  const livingTotal = useMemo(() => {
    return livingExpenses.reduce((s, e) => {
      const a =
        typeof (e as unknown as { amount?: number }).amount === "number"
          ? (e as unknown as { amount: number }).amount
          : 0;
      return s + a;
    }, 0);
  }, [livingExpenses]);

  const isFixed = tab === "fixed";
  const title = isFixed ? "サブスク" : "毎月・生活費";
  const count = isFixed ? fixedExpenses.length : livingExpenses.length;
  const total = isFixed ? fixedTotal : livingTotal;
  const hint = isFixed ? "毎月発生する固定費の合計" : "毎月発生する生活費の合計";

  return (
    <>
      <AppHeader title="Fin Note" subtitle="サブスク" onMenu={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div style={pageWrap}>
        {/* ===== 豪華サブタブ（DailyViewと同じ思想） ===== */}
        <div style={subWrap}>
          <div style={goldTopLine} />

          {/* スライドするインジケータ（幅50%追従＝ズレない） */}
          <div style={indicatorRail}>
            <div
              style={{
                ...indicator,
                transform: `translateX(${idx * 100}%)`,
              }}
            >
              <div style={goldPin} />
            </div>
          </div>

          <SubTabButton
            active={tab === "fixed"}
            onClick={() => setTab("fixed")}
            label="サブスク"
            count={fixedExpenses.length}
          />
          <SubTabButton
            active={tab === "living"}
            onClick={() => setTab("living")}
            label="毎月・生活費"
            count={livingExpenses.length}
          />
        </div>

        {/* ===== 合計カード ===== */}
        <div style={{ ...totalCard, marginTop: 14 }}>
          <div style={goldLine} />

          <div style={totalTopRow}>
            <div style={totalTitleRow}>
              <span style={titleDot} />
              <div style={totalTitle}>{title}</div>
            </div>

            <div style={countBadge}>
              <span style={countDot} />
              {count} 件
            </div>
          </div>

          <div style={totalAmount}>¥{total.toLocaleString()}</div>
          <div style={totalHint}>{hint}</div>
        </div>

        {/* ===== リスト ===== */}
        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          {isFixed
            ? fixedExpenses.map((e) => <SubRowForFixedExpense key={e.id} item={e} />)
            : livingExpenses.map((e) => <SubRowForLivingExpense key={e.id} item={e} />)}
        </div>
      </div>

      <TabBar />
    </>
  );
}

/* ===============================
   Tab button（豪華サブタブ用）
================================ */
function SubTabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...btn,
        color: active ? theme.primary : theme.subtext,
        fontWeight: active ? 850 : 650,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(.985)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        {label}
        <span style={miniCount}>{count}</span>
      </span>
    </button>
  );
}

/* ===============================
   行UI
================================ */
function SubRowForFixedExpense({ item }: { item: FixedExpense }) {
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

function SubRowForLivingExpense({ item }: { item: LivingExpense }) {
  // LivingExpense に amount がある場合は表示（無ければ右側は非表示）
  const amount =
    typeof (item as unknown as { amount?: number }).amount === "number"
      ? (item as unknown as { amount: number }).amount
      : null;

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

      {/* 右（amount がある時だけ） */}
      {amount !== null && (
        <div style={right}>
          <div style={price}>¥{amount.toLocaleString()}</div>
          <div style={chevWrap}>
            <span style={chevDot} />
            <span style={chev}>›</span>
          </div>
        </div>
      )}
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

/* ===== 豪華サブタブ（DailyViewのやつを移植） ===== */
const subWrap: React.CSSProperties = {
  position: "relative",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  alignItems: "center",

  padding: 6,
  borderRadius: 18,
  overflow: "hidden",

  background: theme.surface,
  backdropFilter: "blur(16px)",

  border: `1px solid rgba(214,181,138,0.38)`,
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.70), 0 12px 26px rgba(2,6,23,0.08)",
};

const goldTopLine: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 2,
  background: theme.primary,
  opacity: 0.95,
  pointerEvents: "none",
};

const indicatorRail: React.CSSProperties = {
  position: "absolute",
  inset: 6,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  pointerEvents: "none",
};

const indicator: React.CSSProperties = {
  gridColumn: "1 / 2",
  height: "100%",
  borderRadius: 14,

  transition: "transform .30s cubic-bezier(.22,.9,.32,1)",
  willChange: "transform",

  outline: "1px solid rgba(214,181,138,0.55)",
  outlineOffset: -1,

  position: "relative",
};

const goldPin: React.CSSProperties = {
  position: "absolute",
  right: 10,
  top: "50%",
  transform: "translateY(-50%)",
  width: 8,
  height: 8,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const btn: React.CSSProperties = {
  position: "relative",
  zIndex: 2,

  border: "none",
  background: "transparent",
  borderRadius: 14,

  padding: "10px 0",
  cursor: "pointer",

  fontSize: 13,
  letterSpacing: 0.2,

  transition: "color .18s ease, font-weight .18s ease, transform .12s ease",
};

const miniCount: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 26,
  height: 18,
  padding: "0 8px",
  borderRadius: 999,
  background: "rgba(15,23,42,0.06)",
  color: theme.subtext,
  fontSize: 11,
  fontWeight: 900,
};

/* ===== 合計カード（そのまま） ===== */
const totalCard: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  background: theme.primary,
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
  background: theme.accent,
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

/* ===== 行UI（そのまま） ===== */
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
  color: theme.primary,
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
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.16)",
};

const chev: React.CSSProperties = {
  fontSize: 22,
  opacity: 0.35,
  color: theme.text,
};
