"use client";

import { useEffect, useMemo, useState } from "react";
import { useExpenseStore } from "@/lib/store/expenseStore";
import MonthlyTotalCard from "@/components/home/MonthlyTotalCard";
import HomeSegment from "@/components/home/HomeSegment";
import CategoryBreakdown from "@/components/home/CategoryBreakdown";
import DailyView from "@/components/home/DailyView";
import PieChartView from "@/components/home/PieChartView";
import MonthlyView from "@/components/home/MonthlyView";

import AppHeader from "@/components/layout/AppHeader";
import SideMenu from "@/components/layout/SideMenu";
import TabBar from "@/components/nav/TabBar";
import Fab from "@/components/ui/Fab";
import BottomSheet from "@/components/ui/BottomSheet";

/* ===============================
   型定義
================================ */
type Mode = "category" | "daily" | "pie" | "monthly";

type Expense = {
    id: string;
    date: string; // "YYYY/MM/DD"
    detail: string;
    amount: number;
    category: string;
};

/* ===============================
   Dashboard
================================ */
export default function DashboardPage() {
    const { expenses, loadExpenses } = useExpenseStore() as {
        expenses: Expense[];
        loadExpenses: () => Promise<void>;
    };

    const [mode, setMode] = useState<Mode>("daily");
    const [openAdd, setOpenAdd] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const [detail, setDetail] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("食費");
    const [loading, setLoading] = useState(false);

    async function handleRefresh() {
        setLoading(true);
        await loadExpenses();
        setLoading(false);
    }

    /* ===== 初回ロード ===== */
    useEffect(() => {
        const init = async () => {
            if (expenses.length === 0) {
                setLoading(true);
                await loadExpenses();
                setLoading(false);
            }
        };
        init();
    }, [expenses.length, loadExpenses]);


    /* ===== 今月判定 ===== */
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth(); // 0-based

    /* ===== 今月データ ===== */
    const monthlyExpenses = useMemo<Expense[]>(() => {
        return expenses.filter((e) => {
            if (!e.date) return false;
            const d = new Date(e.date);
            return d.getFullYear() === y && d.getMonth() === m;
        });
    }, [expenses, y, m]);

    /* ===== 今月合計 ===== */
    const expenseTotal = useMemo<number>(() => {
        return monthlyExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    }, [monthlyExpenses]);

    /* ===== 追加処理 ===== */
    const submitAdd = async () => {
        if (!detail || !amount) return;

        await fetch("/api/add-expense", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                detail,
                amount: Number(amount),
                category,
            }),
        });

        setOpenAdd(false);
        setDetail("");
        setAmount("");
        setCategory("食費");

        await loadExpenses();
    };

    const dateLabel = `今日：${now.toLocaleDateString("ja-JP")}`;
    const monthLabel = `${y}年${m + 1}月`;

    return (
        <>
            {/* ===== Header ===== */}
            <AppHeader
                title="MoneyNote"
                subtitle="ホーム"
                onMenu={() => setMenuOpen(true)}
                right={<RefreshButton onClick={handleRefresh} />}
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
function RefreshButton({ onClick }: { onClick: () => Promise<void> }) {
    return (
        <button
            onClick={onClick}
            style={{
                border: "none",
                background: "rgba(37,99,235,0.12)",
                color: "#2563eb",
                padding: "8px 14px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
            }}
        >
            更新
        </button>
    );
}

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

/* ===============================
   styles
================================ */
const inputStyle: React.CSSProperties = {
    padding: "14px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    fontSize: 16,
    outline: "none",
};

const inputStyleDisabled: React.CSSProperties = {
    ...inputStyle,
    background: "#f3f4f6",
    color: "#6b7280",
};

const cancelBtn: React.CSSProperties = {
    padding: "12px 18px",
    borderRadius: 12,
    border: "1px solid #d1d5db",
    background: "white",
    fontWeight: 600,
    cursor: "pointer",
};

const saveBtn: React.CSSProperties = {
    padding: "12px 22px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#3b82f6,#2563eb)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
};
