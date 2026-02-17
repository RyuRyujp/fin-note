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
import TabBar from "@/components/nav/TabBar";
import { theme } from "@/lib/theme";

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
    const { expenses, loadExpenses, loading, livingExpenses } = useExpenseStore();

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
        await loadExpenses({ force: true });
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

    /* ===== 裏面用：詳細データ（6枠） ===== */
    const monthlyDetails = useMemo(() => {
        const yen = (n: number) => `¥${Math.round(n).toLocaleString()}`;
        const todayDate = now.getDate();

        const total = expenseTotal;
        const count = monthlyExpenses.length;

        // 1日平均（今月の今日まで）
        const avgPerDay = total / Math.max(1, todayDate);

        // 最高支出日（日別合計の最大）
        const byDay = new Map<string, number>();
        for (const e of monthlyExpenses) {
            const d = parseJPDate(e.date);
            if (!d) continue;
            const key = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(
                d.getDate()
            ).padStart(2, "0")}`;
            byDay.set(key, (byDay.get(key) || 0) + (Number(e.amount) || 0));
        }

        // Topカテゴリ
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

        // 前月比
        let py = y;
        let pm = m - 1; // m は 0-based
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

    return (
        <>
            {/* ===== Header ===== */}
            <AppHeader
                title="Fin Note"
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

                    <LivingNotice livingExpenses={livingExpenses} />

                    {/* 月合計カード */}
                    <MonthlyTotalCard
                        amount={expenseTotal}
                        dateLabel={dateLabel}
                        monthLabel={monthLabel}
                        details={monthlyDetails}
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
                background: loading ? "rgba(148,163,184,0.25)" : theme.primary,
                color: loading ? "#64748b" : theme.accent,
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
