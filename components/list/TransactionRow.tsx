"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { CreditCard, Tag } from "lucide-react";

import { CategoryIcon } from "@/components/layout/CategoryIcon";
import { useExpenseStore, type Expense } from "@/lib/store/expenseStore";
import { theme } from "@/lib/theme";

export default function TransactionRow({ expense }: { expense: Expense }) {
  const { selectExpense } = useExpenseStore();
  const [pressed, setPressed] = useState(false);

  const minus = expense.amount < 0;

  const dateLabel = useMemo(() => String(expense.date || "").trim() || "—", [expense.date]);
  const categoryLabel = useMemo(() => String(expense.category || "未分類"), [expense.category]);
  const paymentLabel = useMemo(() => String(expense.payment || "—"), [expense.payment]);

  return (
    <button
      type="button"
      style={{ ...card, ...(pressed ? cardPressed : {}) }}
      onClick={() => selectExpense(expense)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
    >
      <div style={goldLine} />

      <div style={left}>
        <div style={iconWrap}>
          <CategoryIcon category={expense.category} />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          {/* Row A: 日付チップ と タイトル（同じ高さ） */}
          <div style={rowA}>
            <div style={title}>{expense.detail}</div>
            <span style={dateChip}>
              <span style={chipText}>{dateLabel}</span>
            </span>

          </div>

          {/* Row B: カテゴリチップ と 支払チップ（右は少し強調） */}
          <div style={rowB}>
            <span style={chip}>
              <Tag size={13} style={chipIcon} />
              <span style={chipText}>{categoryLabel}</span>
            </span>

            <span style={{ ...chip, ...chipStrong }}>
              <CreditCard size={13} style={chipIcon} />
              <span style={chipText}>{paymentLabel}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 右：金額 + 矢印 */}
      <div style={right}>
        <div style={{ ...amount, color: minus ? "#16a34a" : theme.primary }}>
          ¥{Math.abs(expense.amount).toLocaleString()}
        </div>
        <div style={chevWrap}>
          <span style={chevDot} />
          <span style={chev}>›</span>
        </div>
      </div>
    </button>
  );
}

/* ===============================
   styles
================================ */

const card: React.CSSProperties = {
  width: "100%",
  position: "relative",
  overflow: "hidden",

  background: theme.surface,
  borderRadius: 16,
  padding: "10px 12px",

  display: "flex",
  alignItems: "center",
  gap: 10,

  border: `1px solid ${theme.border}`,
  boxShadow: "0 10px 18px rgba(2,6,23,0.05)",

  cursor: "pointer",
  transition: "transform .12s ease, box-shadow .18s ease, opacity .12s ease",
  outline: "none",
  textAlign: "left",
};

const cardPressed: React.CSSProperties = {
  transform: "scale(0.988)",
  opacity: 0.93,
  boxShadow: "0 8px 14px rgba(2,6,23,0.045)",
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

const left: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  minWidth: 0,
  flex: 1,
};

const iconWrap: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 12,
  display: "grid",
  placeItems: "center",
  background: "rgba(255,255,255,0.05)",
  border: `1px solid ${theme.border}`,
  flexShrink: 0,
};

const rowA: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "max-content 1fr",
  alignItems: "center", 
  columnGap: 10,
  minWidth: 0,
};

const dateChip: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "2px 8px",
  background: "rgba(255,255,255,0.04)",
  maxWidth: "100%",
  minWidth: 0,
};

const title: React.CSSProperties = {
  fontWeight: 900,
  color: theme.text,
  fontSize: 14,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  letterSpacing: 0.2,
  minWidth: 0,
};

const rowB: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "max-content 1fr",
  alignItems: "center",
  columnGap: 8,
  marginTop: 6,
  minWidth: 0,
};

const chip: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  borderRadius: 999,
  padding: "4px 8px",
  border: `1px solid ${theme.border}`,
  background: "rgba(255,255,255,0.04)",
  maxWidth: "100%",
  minWidth: 0,
};

const chipStrong: React.CSSProperties = {
  background: "rgba(214,181,138,0.10)",
  border: "1px solid rgba(214,181,138,0.32)",
  justifySelf: "start",
};

const chipIcon: React.CSSProperties = {
  opacity: 0.65,
  flexShrink: 0,
};

const chipText: React.CSSProperties = {
  fontSize: 11.5,
  color: theme.subtext,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  minWidth: 0,
};

/* 右：金額 */
const right: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexShrink: 0,
};

const amount: React.CSSProperties = {
  fontWeight: 950,
  fontSize: 15,
  letterSpacing: 0.2,
  lineHeight: 1.05,
};

const chevWrap: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
};

const chevDot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.14)",
};

const chev: React.CSSProperties = {
  fontSize: 20,
  opacity: 0.36,
  color: theme.text,
};
