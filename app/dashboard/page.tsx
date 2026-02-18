"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useExpenseStore, type Expense } from "@/lib/store/expenseStore";

import MonthlyTotalCard from "@/components/dashboard/MonthlyTotalCard";
import HomeSegment from "@/components/dashboard/HomeSegment";
import DailyView from "@/components/dashboard/DailyView";
import PieChartView from "@/components/dashboard/PieChartView";
import MonthlyView from "@/components/dashboard/MonthlyView";
import LivingNotice from "@/components/dashboard/LivingNotice";

import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import AppHeader from "@/components/layout/AppHeader";
import SideMenu from "@/components/layout/SideMenu";
import { RefreshButton, RefreshOverlay, CenterSpinner  } from "@/components/layout/RefreshFeedback";
import TabBar from "@/components/nav/TabBar/Index";

/* ===============================
   型定義
================================ */
type Mode = "category" | "daily" | "pie" | "monthly";

/* ===============================
   Utils
================================ */
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
    const { expenses, loadExpenses, loading, livingExpenses } = useExpenseStore();
    const [refreshing, setRefreshing] = useState(false);

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
        setRefreshing(true);
        try {
            await loadExpenses({ force: true }); 
        } finally {
            setRefreshing(false);
        }
    }

    /* ===== 今月判定 ===== */
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();

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

    /* ===== 裏面用：詳細データ ===== */
    const monthlyDetails = useMemo(() => {
        const yen = (n: number) => `¥${Math.round(n).toLocaleString()}`;
        const todayDate = now.getDate();

        const total = expenseTotal;
        const count = monthlyExpenses.length;

        const avgPerDay = total / Math.max(1, todayDate);

        const byCat = new Map<string, number>();
        for (const e of monthlyExpenses) {
            const c = e.category || "未分類";
            byCat.set(c, (byCat.get(c) || 0) + (Number(e.amount) || 0));
        }
        let topCat = "未分類";
        let topCatAmount = 0;
        for (const [c, v] of byCat.entries()) {
            if (v > topCatAmount) {
                topCatAmount = v;
                topCat = c;
            }
        }
        const topCatText = topCatAmount ? `${topCat} ${yen(topCatAmount)}` : "—";

        let py = y;
        let pm = m - 1;
        if (pm < 0) {
            pm = 11;
            py = y - 1;
        }

        const prevTotal = expenses.reduce((sum, e) => {
            if (!e.date) return sum;
            const d = parseJPDate(e.date);
            if (!d) return sum;
            if (d.getFullYear() === py && d.getMonth() === pm) {
                return sum + (Number(e.amount) || 0);
            }
            return sum;
        }, 0);

        const diff = total - prevTotal;
        const sign = (n: number) => (n >= 0 ? "+" : "-");
        const diffText = `${sign(diff)}${yen(Math.abs(diff))}`;

        return [
            { label: "件数", value: `${count}件` },
            { label: "1日平均", value: yen(avgPerDay) },
            { label: "Topカテゴリ", value: topCatText },
            { label: "前月比", value: diffText },
        ];
    }, [expenses, monthlyExpenses, expenseTotal, y, m, now]);

    const isBusy = loading || refreshing;

    return (
        <>
            {/* ===== Header ===== */}
            <AppHeader
                title="Fin Note"
                subtitle="ホーム"
                onMenu={() => setMenuOpen(true)}
                right={<RefreshButton onClick={handleRefresh} loading={isBusy} />}
            />

            {/* ===== SideMenu ===== */}
            <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

            <RefreshOverlay open={refreshing} />

            {/* ===== Main ===== */}
            <div
                aria-busy={isBusy}
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
                    <LivingNotice livingExpenses={livingExpenses} />

                    <MonthlyTotalCard
                        amount={expenseTotal}
                        dateLabel={dateLabel}
                        monthLabel={monthLabel}
                        details={monthlyDetails}
                    />

                    <div style={{ marginTop: 18 }}>
                        <HomeSegment value={mode} onChange={setMode} />
                    </div>

                    <div style={{ marginTop: 14 }}>
                        {loading ? (
                            <CenterSpinner />
                        ) : mode === "daily" ? (
                            <DailyView expenses={expenses} />
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
