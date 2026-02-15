"use client";

import { useRouter } from "next/navigation";
import type { Expense } from "@/lib/store/expenseStore";
import { theme } from "@/lib/theme";

/* ===============================
   型
================================ */
type Item = { category: string; total: number };

type YM = { year: string; month: string } | null;

/* ===============================
   Utils
================================ */
function pickYearMonthFromExpenses(expenses: Expense[]): YM {
  for (const e of expenses) {
    const d = (e.date || "").trim();
    // "yyyy/MM/dd" or "yyyy-MM-dd"
    const m = d.match(/^(\d{4})[\/-](\d{1,2})/);
    if (m) {
      const year = m[1];
      const month = String(m[2]).padStart(2, "0");
      return { year, month };
    }
  }
  return null;
}

export default function CategoryBreakdown({ expenses }: { expenses: Expense[] }) {
  const router = useRouter();

  // 集計（カテゴリ→合計）
  const map: Record<string, number> = {};
  for (const e of expenses) {
    const key = e.category || "未分類";
    map[key] = (map[key] || 0) + (Number(e.amount) || 0);
  }

  // 配列化して降順ソート
  const items: Item[] = Object.entries(map)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  const max = items.length ? Math.max(...items.map((x) => x.total)) : 0;

  // この内訳が「どの年月」のデータか推測して一緒に渡す（取れなければ category だけ渡す）
  const ym = pickYearMonthFromExpenses(expenses);

  const goListWithCategory = (category: string) => {
    const params = new URLSearchParams();
    params.set("category", category);

    if (ym) {
      params.set("year", ym.year);
      params.set("month", ym.month);
    }

    router.push(`/list?${params.toString()}`);
  };

  return (
    <div style={{ marginTop: 14 }}>
      {/* 見出し */}
      <div style={titleRow}>
        <span style={titleDot} />
        <div style={titleText}>カテゴリ別</div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {items.map((it) => {
          const ratio = max > 0 ? Math.min(1, it.total / max) : 0;

          return (
            <button
              key={it.category}
              type="button"
              style={cardButton}
              onClick={() => goListWithCategory(it.category)}
              aria-label={`${it.category} の明細を見る`}
            >
              {/* 金ライン（混色なし） */}
              <div style={goldLine} />

              <div style={row}>
                <div style={{ display: "grid", gap: 6 }}>
                  <div style={catName}>{it.category}</div>

                  {/* 比率バー（青のみ） */}
                  <div style={barRail}>
                    <div
                      style={{
                        ...barFill,
                        width: `${Math.round(ratio * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div style={amountText}>¥{it.total.toLocaleString()}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================
   styles
========================= */

const titleRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 10,
};

const titleDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const titleText: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 950,
  letterSpacing: 0.2,
  color: theme.text,
};

const card: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 16,
  padding: "14px 14px",
  background: theme.surface,
  border: `1px solid rgba(29,78,137,0.12)`,
  boxShadow: "0 14px 28px rgba(2,6,23,0.06)",
};

const cardButton: React.CSSProperties = {
  ...card,
  width: "100%",
  textAlign: "left",
  cursor: "pointer",
  appearance: "none",
  outline: "none",
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

const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 14,
};

const catName: React.CSSProperties = {
  fontWeight: 900,
  color: theme.primary,
  letterSpacing: 0.2,
};

const amountText: React.CSSProperties = {
  fontWeight: 950,
  letterSpacing: 0.2,
  color: theme.primary,
};

const barRail: React.CSSProperties = {
  width: 180,
  maxWidth: "52vw",
  height: 8,
  borderRadius: 999,
  background: "rgba(29,78,137,0.10)",
  overflow: "hidden",
};

const barFill: React.CSSProperties = {
  height: "100%",
  borderRadius: 999,
  background: theme.primary,
  transition: "width .28s cubic-bezier(.22,.9,.32,1)",
};
