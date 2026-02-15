"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useExpenseStore, type Expense } from "@/lib/store/expenseStore";
import AppHeader from "@/components/layout/AppHeader";
import SideMenu from "@/components/layout/SideMenu";
import FilterBar from "@/components/list/FilterBar";
import TransactionRow from "@/components/list/TransactionRow";
import TabBar from "@/components/nav/TabBar";

/** Reactの setState と同じ型（string or updater）に合わせる */
type SetStr = (next: string | ((prev: string) => string)) => void;

function pad2(s: string) {
  return String(s).padStart(2, "0");
}

export default function ListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { expenses, loadExpenses } = useExpenseStore() as {
    expenses: Expense[];
    loadExpenses: () => Promise<void>;
  };

  const [menuOpen, setMenuOpen] = useState(false);

  /* ===============================
     URL = 状態（source of truth）
  ================================ */
  const year = (searchParams.get("year") ?? "2026").trim() || "2026";
  const monthRaw = (searchParams.get("month") ?? "02").trim() || "02";
  const month = pad2(monthRaw);

  const category = (searchParams.get("category") ?? "").trim();
  const keyword = (searchParams.get("keyword") ?? "").trim();
  const payment = (searchParams.get("payment") ?? "").trim();

  const replaceParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const v = value.trim();

    if (v) params.set(key, v);
    else params.delete(key);

    const qs = params.toString();
    router.replace(qs ? `/list?${qs}` : "/list", { scroll: false });
  };

  const setYear: SetStr = (next) => {
    const v = typeof next === "function" ? next(year) : next;
    replaceParam("year", v);
  };

  const setMonth: SetStr = (next) => {
    const v = typeof next === "function" ? next(month) : next;
    replaceParam("month", pad2(v));
  };

  const setCategory: SetStr = (next) => {
    const v = typeof next === "function" ? next(category) : next;
    replaceParam("category", v);
  };

  const setKeyword: SetStr = (next) => {
    const v = typeof next === "function" ? next(keyword) : next;
    replaceParam("keyword", v);
  };

  const setPayment: SetStr = (next) => {
    const v = typeof next === "function" ? next(payment) : next;
    replaceParam("payment", v);
  };

  /** フィルター */
  const filtered = useMemo(() => {
    const kw = keyword.toLowerCase();
    const pay = payment;

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
  const total = useMemo(() => filtered.reduce((s, e) => s + e.amount, 0), [filtered]);

  return (
    <>
      <AppHeader
        title="MoneyNote"
        subtitle="一覧"
        onMenu={() => setMenuOpen(true)}
        right={<RefreshButton onClick={loadExpenses} />}
      />

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div
        style={{
          paddingTop: 76,
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 90,
        }}
      >
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

        <div className="card-ios" style={{ padding: 18, marginTop: 16 }}>
          <div style={{ fontSize: 14, opacity: 0.6 }}>{category || "全カテゴリ"} の合計</div>
          <div style={{ fontSize: 32, fontWeight: 900 }}>¥{total.toLocaleString()}</div>
          <div style={{ fontSize: 12, opacity: 0.5 }}>
            {year}年{Number(month)}月
          </div>
        </div>

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
