"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Expense } from "@/lib/store/expenseStore";
import { theme } from "@/lib/theme";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/* ===============================
   MonthlyView
================================ */
export default function MonthlyView({ expenses }: { expenses: Expense[] }) {
  const [tab, setTab] = useState<"list" | "chart">("list");
  const router = useRouter();

  const goMonth = (year: string, month: string) => {
    router.push(`/list?category?year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}`);
  };

  /* ===== 月別集計 ===== */
  const monthly = useMemo(() => {
    const map: Record<string, number> = {};

    expenses.forEach((e) => {
      if (!e.date) return;
      const key = e.date.slice(0, 7); // YYYY/MM
      map[key] = (map[key] || 0) + e.amount;
    });

    return Object.entries(map)
      .map(([month, total]) => {
        const days = new Date(
          Number(month.slice(0, 4)),
          Number(month.slice(5, 7)),
          0
        ).getDate();

        return {
          month,
          total,
          avg: Math.round(total / days),
        };
      })
      .sort((a, b) => (a.month < b.month ? 1 : -1)); // 新しい順
  }, [expenses]);

  return (
    <div style={{ marginTop: 12 }}>
      <div style={subNavWrap}>
        <SubTabsIndicator active={tab} />
        <SubTab active={tab === "list"} onClick={() => setTab("list")} label="月一覧" />
        <SubTab active={tab === "chart"} onClick={() => setTab("chart")} label="グラフ" />
      </div>

      <div style={{ marginTop: 12 }}>
        {tab === "list" ? (
          <MonthlyList data={monthly} onPickMonth={goMonth} />
        ) : (
          <MonthlyChart data={monthly} />
        )}
      </div>
    </div>
  );
}

/* ===============================
   月一覧UI
================================ */
function MonthlyList({
  data,
  onPickMonth,
}: {
  data: { month: string; total: number; avg: number }[];
  onPickMonth: (year: string, month: string) => void;
}) {
  const splitYearMonth = (ym: string): { year: string; month: string } => {
    // ym: "YYYY/MM" 想定
    const y = ym.slice(0, 4);
    const m = String(Number(ym.slice(5, 7)));
    return { year: y, month: m };
  };

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {data.map((m) => {
        const { year, month } = splitYearMonth(m.month);

        return (
          <button
            key={m.month}
            type="button"
            style={monthCardButton}
            onClick={() => onPickMonth(year, month)} // ✅ ここが修正
            aria-label={`${m.month} のカテゴリ別明細へ`}
          >
            <div style={monthCard}>
              <div style={goldLineThin} />

              <div style={{ display: "grid", gap: 4 }}>
                <div style={monthTitle}>
                  <span style={monthTitleDot} />
                  <span>{m.month}月</span>
                </div>
                <div style={monthSub}>1日平均 ¥{m.avg.toLocaleString()}</div>
              </div>

              <div style={monthTotal}>¥{m.total.toLocaleString()}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}


/* ===============================
   棒グラフ
================================ */
function MonthlyChart({
  data,
}: {
  data: { month: string; total: number }[];
}) {
  const chartData = [...data].reverse(); // 古い→新しい

  return (
    <div style={chartCard}>
      <div style={goldLineThin} />

      <div style={chartTitleRow}>
        <span style={titleDot} />
        <div style={chartTitle}>月別累計</div>
      </div>

      <ResponsiveContainer width="100%" height="82%">
        <BarChart data={chartData} barCategoryGap={18}>
          <CartesianGrid stroke="rgba(15,23,42,0.06)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(15,23,42,0.04)" }}
            contentStyle={{
              background: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: 12,
              boxShadow: "0 14px 30px rgba(2,6,23,0.10)",
              fontSize: 12,
            }}
            formatter={(value) => `¥${Number(value).toLocaleString()}`}
          />
          <Bar dataKey="total" fill={theme.primary} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ===============================
   サブタブ（下線インジケータ）
================================ */
function SubTabsIndicator({ active }: { active: "list" | "chart" }) {
  const idx = active === "list" ? 0 : 1;

  return (
    <div style={indicatorRail}>
      <div
        style={{
          ...indicatorSlot,
          transform: `translateX(${idx * 100}%)`,
        }}
      >
        <div style={indicatorBar} />
      </div>
    </div>
  );
}

function SubTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...subBtn,
        color: active ? theme.text : theme.subtext,
        fontWeight: active ? 900 : 700,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(.985)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {active && <span style={goldPin} />}
      {label}
    </button>
  );
}

/* =========================
   styles
========================= */

const subNavWrap: React.CSSProperties = {
  position: "relative",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  alignItems: "center",
  padding: "8px 10px",
  borderRadius: 16,
  background: theme.surface,
  backdropFilter: "blur(14px)",
  border: `1px solid ${theme.border}`,
  boxShadow: "0 10px 22px rgba(2,6,23,0.07)",
  overflow: "hidden",
};

const indicatorRail: React.CSSProperties = {
  position: "absolute",
  left: 10,
  right: 10,
  bottom: 6,
  height: 3,
  pointerEvents: "none",
  overflow: "hidden",
};

const indicatorSlot: React.CSSProperties = {
  width: "50%",              // ← 1タブ分の幅
  height: "100%",
  transition: "transform .28s cubic-bezier(.22,.9,.32,1)",
  willChange: "transform",
  display: "flex",
  justifyContent: "center",  // ← 中央寄せ
};

const indicatorBar: React.CSSProperties = {
  width: "64%",
  height: 3,
  borderRadius: 999,
  background: theme.primary,
  boxShadow: "0 10px 18px rgba(2,6,23,0.18)",
};

const subBtn: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  border: "none",
  background: "transparent",
  borderRadius: 12,
  padding: "10px 0",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontSize: 13,
  letterSpacing: 0.2,
  transition: "color .18s ease, font-weight .18s ease, transform .12s ease",
};

const goldPin: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: theme.accent, // ✅ 金
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const monthCardButton: React.CSSProperties = {
  border: "none",
  background: "transparent",
  padding: 0,
  textAlign: "left",
  cursor: "pointer",
};

const monthCard: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  background: theme.surface,
  borderRadius: 18,
  padding: "14px 16px",
  border: `1px solid rgba(29,78,137,0.12)`,
  boxShadow: "0 14px 28px rgba(2,6,23,0.06)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "transform .12s ease, box-shadow .18s ease",
};

const goldLineThin: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 2,
  background: theme.accent, // ✅ 金
  opacity: 0.95,
  pointerEvents: "none",
};

const monthTitle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontWeight: 950,
  color: theme.text,
  letterSpacing: 0.2,
};

const monthTitleDot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: theme.accent, // ✅ 金
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const monthSub: React.CSSProperties = {
  fontSize: 12,
  color: theme.subtext,
};

const monthTotal: React.CSSProperties = {
  fontWeight: 950,
  fontSize: 16,
  color: theme.primary, // ✅ 青
  letterSpacing: 0.2,
};

const chartCard: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  background: theme.surface,
  borderRadius: 20,
  padding: 16,
  border: `1px solid rgba(29,78,137,0.12)`,
  boxShadow: "0 14px 28px rgba(2,6,23,0.06)",
  height: 270,
};

const chartTitleRow: React.CSSProperties = {
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

const chartTitle: React.CSSProperties = {
  fontWeight: 950,
  color: theme.text,
  letterSpacing: 0.2,
};
