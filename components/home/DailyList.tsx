import { CategoryIcon } from "./CategoryIcon";
import type { Expense } from "@/lib/store/expenseStore";
import { theme } from "@/lib/theme";

export default function DailyList({ expenses }: { expenses: Expense[] }) {
  const groups: Record<string, Expense[]> = {};

  for (const e of expenses) {
    const key = e.date;
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  }

  const sortedDates = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1));

  // expenses.date が "yyyy/MM/dd" の前提ならこれで一致する
  const today = new Date().toLocaleDateString("ja-JP");

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

              {groups[date].map((e) => (
                <Row key={e.id} expense={e} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Row({ expense }: { expense: Expense }) {
  const minus = expense.amount < 0;

  return (
    <div style={row}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <CategoryIcon category={expense.category} />

        <div style={{ display: "grid", gap: 2 }}>
          <div style={rowTitle}>{expense.detail}</div>
          <div style={rowMeta}>{expense.category}</div>
        </div>
      </div>

      <div
        style={{
          fontWeight: 850,
          letterSpacing: 0.2,
          color: minus ? "#ef4444" : theme.primary, // ✅ プラスは青
        }}
      >
        ¥{Math.abs(expense.amount).toLocaleString()}
      </div>
    </div>
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
  color: theme.accent, // ✅ 金
};

const todayDot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: theme.accent, // ✅ 金
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const dayCard: React.CSSProperties = {
  position: "relative",
  background: theme.surface,
  borderRadius: 18,
  padding: 10,
  border: `1px solid rgba(29,78,137,0.12)`, // ✅ 青の薄枠
  boxShadow: "0 10px 24px rgba(2,6,23,0.06)",
  display: "grid",
  gap: 6,
  overflow: "hidden",
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

const row: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 8px",
  borderRadius: 14,
  transition: "transform .12s ease, background .12s ease",

  // 行ごとに軽い区切り（派手にしない）
  background: "transparent",
};

const rowTitle: React.CSSProperties = {
  fontWeight: 800,
  color: theme.text,
};

const rowMeta: React.CSSProperties = {
  fontSize: 12,
  color: theme.subtext,
  opacity: 0.9,
};
