"use client";

import { useState } from "react";
import { CategoryIcon } from "@/components/layout/CategoryIcon";
import { useExpenseStore, type Expense } from "@/lib/store/expenseStore";
import { theme } from "@/lib/theme";

export default function TransactionRow({ expense }: { expense: Expense }) {
  const { selectExpense } = useExpenseStore();
  const [pressed, setPressed] = useState(false);

  // 収入/支出が混ざる可能性もあるので一応
  const minus = expense.amount < 0;

  return (
    <button
      style={{
        ...card,
        ...(pressed ? cardPressed : {}),
      }}
      onClick={() => selectExpense(expense)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
    >
      {/* 金ライン（混色なし） */}
      <div style={goldLine} />

      {/* ===== 左 ===== */}
      <div style={left}>
        <CategoryIcon category={expense.category} />

        <div style={{ minWidth: 0 }}>
          <div style={title}>{expense.detail}</div>
          <div style={meta}>
            {expense.date} ・ {expense.category} ・ {expense.payment}
          </div>
        </div>
      </div>

      {/* ===== 右 ===== */}
      <div style={right}>
        <div
          style={{
            ...amount,
            color: minus ? "#16a34a" : theme.primary, 
          }}
        >
          ¥{Math.abs(expense.amount).toLocaleString()}
        </div>
        <div style={chevronWrap}>
          <span style={chevronDot} />
          <div style={chevron}>›</div>
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
  borderRadius: 18,
  padding: "14px 16px",

  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 14,

  border: `1px solid ${theme.border}`, 
  boxShadow: "0 14px 28px rgba(2,6,23,0.06)",

  cursor: "pointer",
  transition: "transform .12s ease, box-shadow .18s ease, opacity .12s ease",

  // buttonのデフォルトを消す
  outline: "none",
  textAlign: "left",
};

const cardPressed: React.CSSProperties = {
  transform: "scale(0.985)",
  opacity: 0.92,
  boxShadow: "0 10px 18px rgba(2,6,23,0.05)",
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

const left: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  minWidth: 0,
};

const title: React.CSSProperties = {
  fontWeight: 850,
  color: theme.text,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  letterSpacing: 0.2,
};

const meta: React.CSSProperties = {
  fontSize: 12,
  color: theme.subtext,
  marginTop: 2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const right: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexShrink: 0,
};

const amount: React.CSSProperties = {
  fontWeight: 950,
  fontSize: 16,
  letterSpacing: 0.2,
};

const chevronWrap: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const chevronDot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: 999,
  background: theme.accent, 
  boxShadow: "0 0 0 4px rgba(214,181,138,0.16)",
};

const chevron: React.CSSProperties = {
  fontSize: 22,
  opacity: 0.35,
  color: theme.text,
};
