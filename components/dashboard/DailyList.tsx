"use client";

import { useEffect, useState } from "react";
import { CategoryIcon } from "../layout/CategoryIcon";
import { useExpenseStore, type Expense } from "@/lib/store/expenseStore";
import { theme } from "@/lib/theme";

export default function DailyList({ expenses }: { expenses: Expense[] }) {
  const { selectExpense } = useExpenseStore();

  const groups: Record<string, Expense[]> = {};
  for (const e of expenses) {
    const key = e.date;
    if (!key) continue;
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  }

  const sortedDates = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1));

  const now = new Date();
  const today =
    `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(
      now.getDate()
    ).padStart(2, "0")}`;

  // ✅ スクロールしたらTopボタン表示
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let ticking = false;

    const calc = () => {
      const y =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setShowTop(y > 420);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        calc();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    calc(); // 初期判定
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ marginTop: 16 }}>
      {sortedDates.map((date) => {
        const isToday = date === today;
        const label = isToday ? "Today" : date;

        return (
          <div key={date} style={{ marginBottom: 18 }}>
            {/* 日付ラベル */}
            <div style={dateLabelRow}>
              <span style={dateLabelText}>{label}</span>
              {isToday && <span style={todayDot} />}
            </div>

            {/* 日付カード */}
            <div style={dayCard}>
              {/* 金ライン（混色なし） */}
              <div style={goldLine} />

              <div style={list}>
                {groups[date].map((e) => (
                  <DailyRow
                    key={e.id}
                    expense={e}
                    onClick={() => selectExpense(e)} // ✅ モーダルへ
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* ✅ 一番上へ戻るボタン */}
      <button
        type="button"
        aria-label="一番上へ戻る"
        onClick={scrollToTop}
        style={{
          ...topFab,
          ...(showTop ? topFabOn : topFabOff),
        }}
      >
        <span style={topFabArrow}>↑</span>
      </button>
    </div>
  );
}

/* =========================
   Row (TransactionRow準拠)
========================= */

function DailyRow({
  expense,
  onClick,
}: {
  expense: Expense;
  onClick: () => void;
}) {
  const [pressed, setPressed] = useState(false);

  const minus = expense.amount < 0;
  const paymentLabel = expense.payment || "未分類";

  return (
    <>
      <button
        type="button"
        style={{
          ...rowCard,
          ...(pressed ? rowCardPressed : {}),
        }}
        onClick={onClick}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
      >
        {/* ===== 左 ===== */}
        <div style={left}>
          <CategoryIcon category={expense.category} />

          <div style={{ minWidth: 0 }}>
            <div style={title}>{expense.detail}</div>

            {/* ✅ ここ：カテゴリ + 支払方法タグ */}
            <div style={metaRow}>
              <span style={tagPill}>{expense.category}</span>
              <span style={tagPillSub}>{paymentLabel}</span>
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
    </>
  );
}

/* =========================
   styles
========================= */

const dateLabelRow: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 8,
};

const dateLabelText: React.CSSProperties = {
  fontSize: 12.5,
  fontWeight: 800,
  letterSpacing: 0.2,
  color: theme.accent,
};

const todayDot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const dayCard: React.CSSProperties = {
  position: "relative",
  background: theme.surface,
  borderRadius: 18,
  padding: 10,
  border: `1px solid rgba(29,78,137,0.12)`,
  boxShadow: "0 10px 24px rgba(2,6,23,0.06)",
  overflow: "hidden",
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

const list: React.CSSProperties = {
  display: "grid",
  gap: 6,
};

/* ===== Row card（TransactionRowのcardを小型化） ===== */

const rowCard: React.CSSProperties = {
  width: "100%",
  position: "relative",

  background: "transparent",
  borderRadius: 14,
  padding: "10px 8px",

  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 14,

  border: "none",
  cursor: "pointer",
  outline: "none",
  textAlign: "left",

  transition: "transform .12s ease, background .12s ease, opacity .12s ease",
};

const rowCardPressed: React.CSSProperties = {
  transform: "scale(0.985)",
  opacity: 0.92,
  background: "rgba(29,78,137,0.06)",
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

const metaRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  marginTop: 4,
  minWidth: 0,
  flexWrap: "nowrap",
  overflow: "hidden",
};

const tagPill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  height: 20,
  padding: "0 8px",
  borderRadius: 999,
  fontSize: 11.5,
  fontWeight: 800,
  color: theme.text,
  background: "rgba(29,78,137,0.06)",
  border: "1px solid rgba(29,78,137,0.12)",
  whiteSpace: "nowrap",
};

const tagPillSub: React.CSSProperties = {
  ...tagPill,
  fontWeight: 750,
  color: theme.text,
  background: theme.accent,
  border: "1px solid rgba(2,6,23,0.08)",
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

/* ===== Top FAB ===== */

const topFab: React.CSSProperties = {
  position: "fixed",
  right: 12,
  bottom: 100, 
  zIndex: 60,

  width: 46,
  height: 46,
  borderRadius: 999,

  background: theme.surface,
  border: "1px solid rgba(2,6,23,0.10)",
  boxShadow: "0 16px 34px rgba(2,6,23,0.14)",

  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",

  cursor: "pointer",
  outline: "none",
  transition: "opacity .18s ease, transform .18s ease",
};

const topFabOn: React.CSSProperties = {
  opacity: 1,
  transform: "translateY(0)",
  pointerEvents: "auto",
};

const topFabOff: React.CSSProperties = {
  opacity: 0,
  transform: "translateY(10px)",
  pointerEvents: "none",
};

const topFabArrow: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 950,
  color: theme.primary,
  lineHeight: 1,
};
