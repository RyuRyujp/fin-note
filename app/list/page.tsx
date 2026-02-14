"use client";

import { useMemo, useState } from "react";
import { useExpenseStore, type Expense } from "@/lib/store/expenseStore";
import AppHeader from "@/components/layout/AppHeader";
import SideMenu from "@/components/layout/SideMenu";
import FilterBar from "@/components/list/FilterBar";
import TransactionRow from "@/components/list/TransactionRow";
import TabBar from "@/components/nav/TabBar";

export default function ListPage() {
    const { expenses, loadExpenses } = useExpenseStore() as {
        expenses: Expense[];
        loadExpenses: () => Promise<void>;
    };
    const [year, setYear] = useState("2026");
    const [month, setMonth] = useState("02");
    const [category, setCategory] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [payment, setPayment] = useState("");

    /** フィルター */
    /** フィルター */
    const filtered = useMemo(() => {
        const kw = keyword.trim().toLowerCase();
        const pay = payment.trim();

        return expenses.filter((e) => {
            const date = (e.date ?? "").trim(); // "2026/02/15"
            if (!date.startsWith(`${year}/${month}`)) return false;
            if (category && (e.category ?? "") !== category) return false;
            if (pay && (e.payment ?? "").trim() !== pay) return false;
            if (kw) {
                const hay = `${e.detail ?? ""} ${e.memo ?? ""}`.toLowerCase();
                if (!hay.includes(kw)) return false;
            }

            return true;
        });
    }, [expenses, year, month, category, keyword, payment]);

    /** 合計 */
    const total = useMemo(
        () => filtered.reduce((s, e) => s + e.amount, 0),
        [filtered]
    );

    return (
        <>
            <AppHeader
                title="MoneyNote"
                subtitle="一覧"
                onMenu={() => setMenuOpen(true)}
                right={<RefreshButton onClick={loadExpenses} />}
            />

            <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

            {/* ★ ヘッダー高さ分の余白を確保 */}
            <div
                style={{
                    paddingTop: 76,   // ← これが重要
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingBottom: 90,
                }}
            >

                {/* フィルター */}
                <FilterBar
                    year={year}
                    month={month}
                    category={category}
                    setYear={setYear}
                    setMonth={setMonth}
                    setCategory={setCategory}
                    keyword={keyword}
                    payment={payment}
                    setKeyword={setKeyword}
                    setPayment={setPayment}
                />

                {/* 合計カード */}
                <div className="card-ios" style={{ padding: 18, marginTop: 16 }}>
                    <div style={{ fontSize: 14, opacity: 0.6 }}>
                        {category || "全カテゴリ"} の合計
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 900 }}>
                        ¥{total.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.5 }}>
                        {year}年{Number(month)}月
                    </div>
                </div>

                {/* 一覧 */}
                <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
                    {filtered.map((e) => (
                        <TransactionRow key={e.id} expense={e} />
                    ))}
                </div>
            </div>

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