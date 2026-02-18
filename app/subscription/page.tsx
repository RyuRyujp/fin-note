// app/subscription/page.tsx
"use client";

import { useMemo, useState } from "react";
import { FixedExpense, LivingExpense, useExpenseStore } from "@/lib/store/expenseStore";
import AppHeader from "@/components/layout/AppHeader";
import SideMenu from "@/components/layout/SideMenu";
import TabBar from "@/components/nav/TabBar/Index";
import { CategoryIcon } from "@/components/layout/CategoryIcon";
import { theme } from "@/lib/theme";

import SubscriptionDetailModal, { type SelectedSub } from "@/components/subscription/SubscriptionDetailModal";
import {
  pageWrap,
  subWrap,
  goldTopLine,
  indicatorRail,
  indicator,
  goldPin,
  btn,
  miniCount,
  totalCard,
  goldLine,
  totalTopRow,
  totalTitleRow,
  titleDot,
  totalTitle,
  countBadge,
  countDot,
  totalAmount,
  totalHint,
  card,
  cardBtnReset,
  goldLineThin,
  left,
  rowTitle,
  meta,
  right,
  price,
  chevWrap,
  chevDot,
  chev,
} from "@/components/subscription/subscriptionStyles";

type SubTab = "fixed" | "living";

/* ===============================
   Page
================================ */
export default function SubscriptionsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<SubTab>("fixed");
  const idx = tab === "fixed" ? 0 : 1;

  const { fixedExpenses, livingExpenses } = useExpenseStore() as {
    fixedExpenses: FixedExpense[];
    livingExpenses: LivingExpense[];
  };

  const [selectedSub, setSelectedSub] = useState<SelectedSub | null>(null);

  /** 今月合計 */
  const fixedTotal = useMemo(() => fixedExpenses.reduce((s, e) => s + e.amount, 0), [fixedExpenses]);

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
        <div style={subWrap}>
          <div style={goldTopLine} />

          <div style={indicatorRail}>
            <div style={{ ...indicator, transform: `translateX(${idx * 100}%)` }}>
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

          {/* fixed のときだけ金額・ヒント表示（あなたの仕様） */}
          {isFixed && (
            <>
              <div style={totalAmount}>¥{total.toLocaleString()}</div>
              <div style={totalHint}>{hint}</div>
            </>
          )}
        </div>

        {/* ===== リスト ===== */}
        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          {isFixed
            ? fixedExpenses.map((e) => (
                <SubRowForFixedExpense
                  key={e.id}
                  item={e}
                  onOpen={(item) => setSelectedSub({ kind: "fixed", item })}
                />
              ))
            : livingExpenses.map((e) => (
                <SubRowForLivingExpense
                  key={e.id}
                  item={e}
                  onOpen={(item) => setSelectedSub({ kind: "living", item })}
                />
              ))}
        </div>
      </div>

      {/* ✅ 詳細モーダル */}
      <SubscriptionDetailModal selected={selectedSub} onClose={() => setSelectedSub(null)} />

      <TabBar sheetMode={tab === "living" ? "livingExpense" : "fixedExpense"} />
    </>
  );
}

/* ===============================
   Sub tab button
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
   Rows
================================ */
function SubRowForFixedExpense({
  item,
  onOpen,
}: {
  item: FixedExpense;
  onOpen: (item: FixedExpense) => void;
}) {
  return (
    <button type="button" onClick={() => onOpen(item)} style={{ ...cardBtnReset, ...card }}>
      <div style={goldLineThin} />

      <div style={left}>
        <CategoryIcon category={item.category} />

        <div style={{ minWidth: 0 }}>
          <div style={rowTitle}>{item.detail}</div>
          <div style={meta}>毎月 {item.day} 日 ・ {item.category}</div>
        </div>
      </div>

      <div style={right}>
        <div style={price}>¥{item.amount.toLocaleString()}</div>
        <div style={chevWrap}>
          <span style={chevDot} />
          <span style={chev}>›</span>
        </div>
      </div>
    </button>
  );
}

function SubRowForLivingExpense({
  item,
  onOpen,
}: {
  item: LivingExpense;
  onOpen: (item: LivingExpense) => void;
}) {
  const amount =
    typeof (item as unknown as { amount?: number }).amount === "number"
      ? (item as unknown as { amount: number }).amount
      : null;

  return (
    <button type="button" onClick={() => onOpen(item)} style={{ ...cardBtnReset, ...card }}>
      <div style={goldLineThin} />

      <div style={left}>
        <CategoryIcon category={item.category} />

        <div style={{ minWidth: 0 }}>
          <div style={rowTitle}>{item.detail}</div>
          <div style={meta}>毎月 {item.day} 日 ・ {item.category}</div>
        </div>
      </div>

      {amount !== null && (
        <div style={right}>
          <div style={price}>¥{amount.toLocaleString()}</div>
          <div style={chevWrap}>
            <span style={chevDot} />
            <span style={chev}>›</span>
          </div>
        </div>
      )}
    </button>
  );
}
