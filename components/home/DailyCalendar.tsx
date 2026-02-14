"use client";

import { useMemo, useState, useRef } from "react";
import { CategoryIcon } from "./CategoryIcon";
import { useExpenseStore } from "@/lib/store/expenseStore";

/* ===============================
   型
================================ */
const theme = {
  primary: "#1D4E89",
  accent: "#D6B58A",

  surface: "rgba(255,255,255,0.86)",
  surfaceSolid: "#FFFFFF",
  border: "rgba(15,23,42,0.10)",
  text: "#0F172A",
  subtext: "#64748B",
};

/* ===============================
   Component
================================ */
export default function DailyCalendar() {
  const { expenses } = useExpenseStore();
  const [monthOffset, setMonthOffset] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const base = new Date();
  const viewDate = new Date(base.getFullYear(), base.getMonth() + monthOffset);

  const y = viewDate.getFullYear();
  const m = viewDate.getMonth();

  /* ===== 今日キー ===== */
  const today = new Date();
  const todayKey = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}/${String(today.getDate()).padStart(2, "0")}`;

  const [activeDate, setActiveDate] = useState<string>(todayKey);

  /* ===== カレンダー計算 ===== */
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0).getDate();
  const startWeek = firstDay.getDay();

  /* ===== 月フィルタ ===== */
  const monthlyExpenses = useMemo(
    () =>
      expenses.filter((e) => {
        // e.date が YYYY/MM/DD 想定なので parse は一応補正
        const parts = e.date.split("/").map(Number);
        const d = parts.length === 3 ? new Date(parts[0], parts[1] - 1, parts[2]) : new Date(e.date);
        return d.getFullYear() === y && d.getMonth() === m;
      }),
    [expenses, y, m]
  );

  /* ===== 日別合計 ===== */
  const totals = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    monthlyExpenses.forEach((e) => {
      map[e.date] = (map[e.date] || 0) + e.amount;
    });
    return map;
  }, [monthlyExpenses]);

  /* ===== アクティブ日の支出 ===== */
  const dailyExpenses = useMemo(
    () => monthlyExpenses.filter((e) => e.date === activeDate),
    [monthlyExpenses, activeDate]
  );

  /* ===== スワイプ ===== */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;

    if (diff > 60) setMonthOffset((v) => v - 1);
    if (diff < -60) setMonthOffset((v) => v + 1);

    touchStartX.current = null;
  };

  /* ===== 日配列 ===== */
  const days: (number | null)[] = [];
  for (let i = 0; i < startWeek; i++) days.push(null);
  for (let d = 1; d <= lastDay; d++) days.push(d);

  const monthLabel = `${y}年${m + 1}月`;

  return (
    <div style={{ marginTop: 12 }}>
      {/* ================= 月ヘッダー ================= */}
      <div style={headerStyle}>
        <button
          onClick={() => setMonthOffset((v) => v - 1)}
          style={navBtn}
          aria-label="前の月"
        >
          ←
        </button>

        <div style={monthTitle}>
          <span style={{ color: theme.accent, fontWeight: 900 }}>●</span>
          <span>{monthLabel}</span>
        </div>

        <button
          onClick={() => setMonthOffset((v) => v + 1)}
          style={navBtn}
          aria-label="次の月"
        >
          →
        </button>
      </div>

      {/* ================= カレンダー ================= */}
      <div style={calendarCard} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* 金ライン（混色なし） */}
        <div style={goldLine} />

        {/* 曜日 */}
        <div style={weekRow}>
          {["日", "月", "火", "水", "木", "金", "土"].map((d, idx) => (
            <div
              key={d}
              style={{
                color: idx === 0 ? "rgba(239,68,68,0.85)" : idx === 6 ? "rgba(59,130,246,0.85)" : theme.subtext,
                fontWeight: 800,
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* 日付 */}
        <div style={grid}>
          {days.map((d, i) => {
            if (!d) return <div key={i} />;

            const key = `${y}/${String(m + 1).padStart(2, "0")}/${String(d).padStart(2, "0")}`;
            const total = totals[key];
            const hasTotal = typeof total === "number" && total !== 0;

            const isToday = key === todayKey;
            const isActive = key === activeDate;

            // 表現を変える：activeは塗り（青）＋下バー（金）、todayはリング（金）
            return (
              <button
                key={key}
                onClick={() => setActiveDate(key)}
                style={{
                  ...dayBtn,
                  ...(isActive ? dayBtnActive : {}),
                  ...(isToday && !isActive ? dayBtnTodayRing : {}),
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(.985)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <div
                  style={{
                    fontWeight: isActive ? 900 : isToday ? 850 : 700,
                    color: isActive ? "rgba(255,255,255,0.96)" : theme.text,
                    letterSpacing: 0.1,
                  }}
                >
                  {d}
                </div>

                {hasTotal && (
                  <div
                    style={{
                      fontSize: 10,
                      marginTop: 3,
                      fontWeight: 800,
                      color: isActive ? "rgba(255,255,255,0.92)" : theme.primary,
                    }}
                  >
                    ¥{Math.abs(total!).toLocaleString()}
                  </div>
                )}

                {/* activeだけ金の下バー（混色なし） */}
                {isActive && <div style={activeGoldBar} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 日別リスト ================= */}
      <div style={{ marginTop: 16 }}>
        <DaySection date={activeDate} expenses={dailyExpenses} />
      </div>
    </div>
  );
}

/* ===============================
   日別セクション
================================ */
function DaySection({ date }: { date: string }) {
  const { expenses } = useExpenseStore();
  return (
    <div>
      {/* 日付ラベル（アクセント金） */}
      <div style={dateLabelRow}>
        <span style={dateLabelText}>{date}</span>
        <span style={dateLabelDot} />
      </div>

      {expenses.length === 0 ? (
        <EmptyDay />
      ) : (
        <div style={listCard}>
          <div style={goldLineThin} />

          {expenses.map((e, i) => (
            <div
              key={e.id}
              style={{
                ...row,
                borderBottom:
                  i === expenses.length - 1 ? "none" : `1px solid rgba(15,23,42,0.06)`,
              }}
            >
              {/* 左側：アイコン＋内容 */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CategoryIcon category={e.category || "未分類"} />

                <div style={{ display: "grid", gap: 2 }}>
                  <div style={rowTitle}>{e.detail || "支出"}</div>
                  <div style={rowMeta}>{e.category || "未分類"}</div>
                </div>
              </div>

              {/* 右：金額（基本は青） */}
              <div style={{ fontWeight: 900, letterSpacing: 0.2, color: theme.primary }}>
                ¥{e.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===============================
   空
================================ */
function EmptyDay() {
  return <div style={empty}>この日の支出はありません</div>;
}

/* ===============================
   Styles
================================ */
const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
};

const monthTitle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  fontSize: 16,
  fontWeight: 900,
  color: theme.text,
  letterSpacing: 0.2,
};

const navBtn: React.CSSProperties = {
  border: `1px solid ${theme.border}`,
  background: theme.surface,
  backdropFilter: "blur(14px)",
  borderRadius: 12,
  padding: "8px 12px",
  cursor: "pointer",
  fontWeight: 900,
  color: theme.primary,
  boxShadow: "0 10px 22px rgba(2,6,23,0.07)",
};

const calendarCard: React.CSSProperties = {
  position: "relative",
  background: theme.surface,
  backdropFilter: "blur(14px)",
  borderRadius: 20,
  padding: 14,
  border: `1px solid ${theme.border}`,
  boxShadow: "0 14px 30px rgba(2,6,23,0.08)",
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

const weekRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(7,1fr)",
  marginBottom: 10,
  fontSize: 12,
  textAlign: "center",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(7,1fr)",
  gap: 8,
};

const dayBtn: React.CSSProperties = {
  position: "relative",
  border: `1px solid rgba(15,23,42,0.08)`,
  background: theme.surfaceSolid,
  borderRadius: 14,
  padding: "8px 6px",
  minHeight: 58,
  cursor: "pointer",
  transition: "transform .12s ease, box-shadow .18s ease, border-color .18s ease",
  boxShadow: "0 6px 14px rgba(2,6,23,0.05)",
};

const dayBtnActive: React.CSSProperties = {
  background: theme.primary, // ✅ 青だけ
  borderColor: "rgba(255,255,255,0.18)",
  boxShadow: "0 16px 28px rgba(2,6,23,0.22)",
};

const dayBtnTodayRing: React.CSSProperties = {
  borderColor: "rgba(214,181,138,0.65)", // ✅ 金リング（混色なし）
  boxShadow: "0 12px 22px rgba(2,6,23,0.10)",
};

const activeGoldBar: React.CSSProperties = {
  position: "absolute",
  left: 10,
  right: 10,
  bottom: 7,
  height: 3,
  borderRadius: 999,
  background: theme.accent, // ✅ 金だけ
  opacity: 0.95,
};

const dateLabelRow: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 8,
};

const dateLabelText: React.CSSProperties = {
  fontSize: 12.5,
  fontWeight: 900,
  letterSpacing: 0.2,
  color: theme.accent, // ✅ 金
};

const dateLabelDot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const listCard: React.CSSProperties = {
  position: "relative",
  background: theme.surface,
  backdropFilter: "blur(14px)",
  borderRadius: 18,
  padding: 8,
  border: `1px solid rgba(29,78,137,0.12)`, // ✅ 青の薄枠
  boxShadow: "0 14px 28px rgba(2,6,23,0.06)",
  overflow: "hidden",
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

const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 10px",
  borderRadius: 14,
};

const rowTitle: React.CSSProperties = {
  fontWeight: 850,
  color: theme.text,
};

const rowMeta: React.CSSProperties = {
  fontSize: 12,
  color: theme.subtext,
};

const empty: React.CSSProperties = {
  background: theme.surface,
  borderRadius: 18,
  padding: 20,
  textAlign: "center",
  color: theme.subtext,
  border: `1px solid ${theme.border}`,
  boxShadow: "0 10px 22px rgba(2,6,23,0.06)",
};
