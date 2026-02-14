"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { theme } from "@/lib/theme";
import {
    Home,
    List,
    Repeat,
    Wallet,
    Plus,
    LucideIcon,
} from "lucide-react";

import BottomSheet from "@/components/ui/BottomSheet";

/* ===============================
   型
================================ */
type Tab = {
    href: string;
    label: string;
    Icon: LucideIcon;
};

/* ===== タブ4つ ===== */
const leftTabs: Tab[] = [
    { href: "/dashboard", label: "ホーム", Icon: Home },
    { href: "/list", label: "一覧", Icon: List },
];

const rightTabs: Tab[] = [
    { href: "/subscription", label: "サブスク", Icon: Repeat },
    { href: "/income", label: "収入", Icon: Wallet },
];

/* ===============================
   TabBar
================================ */
export default function TabBar() {
    const pathname = usePathname();
    const todayISO = new Date().toISOString().slice(0, 10);
    const [date, setDate] = useState(todayISO);

    /* ===== Sheet状態 ===== */
    const [open, setOpen] = useState(false);

    /* ===== Form状態 ===== */
    const [detail, setDetail] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("食費");
    const [payment, setPayment] = useState("現金");
    const [memo, setMemo] = useState("");
    const [saving, setSaving] = useState(false);

    /* ===== 保存処理 ===== */
    async function submit() {
        if (!detail || !amount) return;

        setSaving(true);

        await fetch("/api/add-expense", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date,
                detail,
                amount: Number(amount),
                category,
                payment,
                memo,
            }),
        });

        setSaving(false);
        setOpen(false);

        setDetail("");
        setAmount("");
        setCategory("食費");

        // 必要ならここで再取得イベント発火
        window.dispatchEvent(new Event("expense-updated"));
    }

    return (
        <>
            {/* ================= FAB ================= */}
            <button
                onClick={() => setOpen(true)}
                style={fabStyle}
            >
                <Plus size={28} strokeWidth={2.8} />
            </button>

            {/* ================= TabBar ================= */}
            <nav style={navStyle}>
                {leftTabs.map((t) => {
                    const active = pathname === t.href;
                    const Icon = t.Icon;

                    return (
                        <Link key={t.href} href={t.href} style={tabStyle(active)}>
                            {active && <ActivePill />}
                            <Icon size={20} strokeWidth={active ? 2.6 : 2} />
                            <span>{t.label}</span>
                        </Link>
                    );
                })}

                <div />

                {rightTabs.map((t) => {
                    const active = pathname === t.href;
                    const Icon = t.Icon;

                    return (
                        <Link key={t.href} href={t.href} style={tabStyle(active)}>
                            {active && <ActivePill />}
                            <Icon size={20} strokeWidth={active ? 2.6 : 2} />
                            <span>{t.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* ================= BottomSheet ================= */}
            <div
                style={{
                    position: "fixed",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    transform: open ? "translateY(0%)" : "translateY(100%)",
                    transition: "transform 0.32s cubic-bezier(.22,.9,.32,1)",
                    zIndex: 1001, // ★Overlayより上
                    pointerEvents: open ? "auto" : "none",
                }}
            >
                <BottomSheet open={open} title="支出を追加" onClose={() => setOpen(false)}>
                    <SheetForm
                        date={date}
                        setDate={setDate}
                        detail={detail}
                        setDetail={setDetail}
                        amount={amount}
                        setAmount={setAmount}
                        category={category}
                        setCategory={setCategory}
                        payment={payment}
                        setPayment={setPayment}
                        memo={memo}
                        setMemo={setMemo}
                        onSubmit={submit}
                        saving={saving}
                        onClose={() => setOpen(false)}
                    />

                </BottomSheet>
            </div>
        </>
    );
}

/* ===============================
   Sheet Form
================================ */
type SheetFormProps = {
    date: string;
    setDate: (v: string) => void;
    detail: string;
    setDetail: (v: string) => void;
    amount: string;
    setAmount: (v: string) => void;
    category: string;
    setCategory: (v: string) => void;
    payment: string;
    setPayment: (v: string) => void;
    memo: string;
    setMemo: (v: string) => void;
    onSubmit: () => Promise<void>;
    saving: boolean;
    onClose: () => void;
};

function SheetForm({
    date,
    setDate,
    detail,
    setDetail,
    amount,
    setAmount,
    category,
    setCategory,
    payment,
    setPayment,
    memo,
    setMemo,
    onSubmit,
    saving,
    onClose,
}: SheetFormProps) {
    return (
        <div style={{ display: "grid", gap: 18 }}>
            {/* 日付 */}
            <Field label="日付">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={input}
                />
            </Field>

            {/* 詳細 */}
            <Field label="詳細">
                <input
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    style={input}
                />
            </Field>

            {/* 金額 */}
            <Field label="金額">
                <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputMode="numeric"
                    style={input}
                />
            </Field>

            {/* カテゴリ */}
            <Field label="カテゴリ">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={input}
                >
                    <option>食費</option>
                    <option>生活費</option>
                    <option>交通費</option>
                    <option>日用品</option>
                    <option>娯楽・趣味</option>
                    <option>未分類</option>
                </select>
            </Field>

            {/* 支払方法 */}
            <Field label="支払方法">
                <select
                    value={payment}
                    onChange={(e) => setPayment(e.target.value)}
                    style={input}
                >
                    <option>クレジット：三菱UFJ</option>
                    <option>クレジット：楽天</option>
                    <option>クレジット：EPOS</option>
                    <option>クレジット：三井住友</option>
                    <option>PayPay</option>
                    <option>現金</option>
                    <option>その他</option>
                </select>
            </Field>

            {/* メモ */}
            <Field label="メモ">
                <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    rows={3}
                    style={{ ...input, resize: "none" }}
                />
            </Field>

            {/* ボタン */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button onClick={onClose} style={cancelBtn}>キャンセル</button>
                <button onClick={onSubmit} style={saveBtn} disabled={saving}>
                    {saving ? "保存中..." : "保存"}
                </button>
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
            {children}
        </div>
    );
}

/* ===============================
   styles
================================ */
const fabStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "calc(var(--tabbar-h) - 50px + env(safe-area-inset-bottom))",
    left: "50%",
    transform: "translateX(-50%)",

    width: 54,
    height: 54,
    borderRadius: "50%",
    border: "none",

    background: `linear-gradient(135deg, ${theme.primary}, #163E6D)`,
    color: "white",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    boxShadow: "0 10px 24px rgba(29,78,137,0.35)",
    zIndex: 80,
    cursor: "pointer",
};

const navStyle: React.CSSProperties = {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: "env(safe-area-inset-bottom)",
    paddingTop: "10px",

    background: "rgba(255,255,255,0.82)",
    backdropFilter: "blur(20px)",
    borderTop: `1px solid ${theme.border}`,

    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
    alignItems: "center",

    zIndex: 70,
};

function tabStyle(active: boolean): React.CSSProperties {
    return {
        textDecoration: "none",
        display: "grid",
        justifyItems: "center",
        gap: 3,
        paddingTop: 6,

        fontSize: 10.5,
        fontWeight: 600,

        color: active ? theme.primary : theme.subtext,
        position: "relative",
    };
}

function ActivePill() {
    return (
        <div
            style={{
                position: "absolute",
                top: 4,
                width: 42,
                height: 24,
                borderRadius: 999,
                background: `${theme.primary}18`,
                zIndex: -1,
            }}
        />
    );
}

const input: React.CSSProperties = {
    padding: "13px 14px",
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: theme.surface,
    fontSize: 16,
    color: theme.text,
};

const cancelBtn: React.CSSProperties = {
    padding: "11px 16px",
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: theme.surface,
    fontWeight: 600,
    color: theme.subtext,
    cursor: "pointer",
};

const saveBtn: React.CSSProperties = {
    padding: "11px 20px",
    borderRadius: 12,
    border: "none",
    background: `linear-gradient(135deg, ${theme.primary}, #163E6D)`,
    color: "white",
    fontWeight: 700,
    letterSpacing: 0.2,
    cursor: "pointer",
};
