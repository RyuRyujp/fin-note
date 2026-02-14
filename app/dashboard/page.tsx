"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useExpenseStore, type Expense } from "@/lib/store/expenseStore";

import MonthlyTotalCard from "@/components/home/MonthlyTotalCard";
import HomeSegment from "@/components/home/HomeSegment";
import CategoryBreakdown from "@/components/home/CategoryBreakdown";
import DailyView from "@/components/home/DailyView";
import PieChartView from "@/components/home/PieChartView";
import MonthlyView from "@/components/home/MonthlyView";

import AppHeader from "@/components/layout/AppHeader";
import SideMenu from "@/components/layout/SideMenu";
import TabBar from "@/components/nav/TabBar";

/* ===============================
   型定義
================================ */
type Mode = "category" | "daily" | "pie" | "monthly";

/* ===============================
   Utils
================================ */
// "yyyy/MM/dd" や "yyyy-MM-dd" を安全に Date にする（new Date("yyyy/MM/dd") は環境で壊れることがある）
function parseJPDate(dateStr: string): Date | null {
  const parts = dateStr.split(/[\/\-]/).map((v) => Number(v));
  if (parts.length < 3) return null;

  const [y, m, d] = parts;
  if (!y || !m || !d) return null;

  const dt = new Date(y, m - 1, d);
  if (Number.isNaN(dt.getTime())) return null;

  return dt;
}

/* ===============================
   Dashboard
================================ */
export default function DashboardPage() {
  const { expenses, loadExpenses, loading } = useExpenseStore();

  const [mode, setMode] = useState<Mode>("daily");
  const [menuOpen, setMenuOpen] = useState(false);

  const didInitRef = useRef(false);

  /* ===== 初回ロード（マウント時に1回） ===== */
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    loadExpenses();
  }, [loadExpenses]);

  async function handleRefresh() {
    await loadExpenses();
  }

  /* ===== 今月判定 ===== */
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth(); // 0-based

  const dateLabel = `今日：${now.toLocaleDateString("ja-JP")}`;
  const monthLabel = `${y}年${m + 1}月`;

  /* ===== 今月データ ===== */
  const monthlyExpenses = useMemo((): Expense[] => {
    return expenses.filter((e) => {
      if (!e.date) return false;

      const d = parseJPDate(e.date);
      if (!d) return false;

      return d.getFullYear() === y && d.getMonth() === m;
    });
  }, [expenses, y, m]);

  /* ===== 今月合計 ===== */
  const expenseTotal = useMemo((): number => {
    return monthlyExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [monthlyExpenses]);

  return (
    <>
      {/* ===== Header ===== */}
      <AppHeader
        title="MoneyNote"
        subtitle="ホーム"
        onMenu={() => setMenuOpen(true)}
        right={<RefreshButton onClick={handleRefresh} loading={loading} />}
      />

      {/* ===== SideMenu ===== */}
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ===== Main ===== */}
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 40%, #eef2f7 100%)",
          paddingTop: 76,
        }}
      >
        <main
          style={{
            maxWidth: 520,
            margin: "0 auto",
            padding: "20px 18px 110px",
          }}
        >
          {/* 月合計カード */}
          <MonthlyTotalCard
            amount={expenseTotal}
            dateLabel={dateLabel}
            monthLabel={monthLabel}
          />

          {/* セグメント */}
          <div style={{ marginTop: 18 }}>
            <HomeSegment value={mode} onChange={setMode} />
          </div>

          {/* コンテンツ */}
          <div style={{ marginTop: 14 }}>
            {loading ? (
              <CenterSpinner />
            ) : mode === "daily" ? (
              <DailyView expenses={monthlyExpenses} />
            ) : mode === "category" ? (
              <CategoryBreakdown expenses={monthlyExpenses} />
            ) : mode === "pie" ? (
              <PieChartView expenses={monthlyExpenses} />
            ) : mode === "monthly" ? (
              <MonthlyView expenses={expenses} />
            ) : (
              <div style={{ opacity: 0.5 }}>未実装</div>
            )}
          </div>
        </main>
      </div>

      {/* ===== TabBar ===== */}
      <TabBar />
    </>
  );
}

/* ===============================
   Refresh Button
================================ */
function RefreshButton({
  onClick,
  loading,
}: {
  onClick: () => Promise<void>;
  loading: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick()}
      disabled={loading}
      style={{
        border: "none",
        background: loading ? "rgba(148,163,184,0.25)" : "rgba(37,99,235,0.12)",
        color: loading ? "#64748b" : "#2563eb",
        padding: "8px 14px",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 13,
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.85 : 1,
      }}
    >
      {loading ? "更新中…" : "更新"}
    </button>
  );
}

/* ===============================
   Spinner
================================ */
function CenterSpinner() {
  return (
    <div
      style={{
        height: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "3px solid #e5e7eb",
          borderTop: "3px solid #3b82f6",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
