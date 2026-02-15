"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Save } from "lucide-react";
import type { LivingExpense } from "@/lib/store/expenseStore";

type Props = {
    livingExpenses: LivingExpense[];
};

type NoticeItem = LivingExpense & {
    dueDate: Date;
    dueDay: number;
};

function clampDueDay(year: number, monthIndex: number, day: number): number {
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();
    const d = Math.max(1, Math.floor(day || 1));
    return Math.min(d, lastDay);
}

function formatYMDSlash(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}/${m}/${day}`;
}

function normalizeDone(s: string): string {
    return (s || "").trim().replace(/[ \u3000]/g, "").toLowerCase();
}

/**
 * Done を見て「今月済」なら true
 * - 例: "2026/02済", "2026-02 済", "2026年2月済", "2月済", "今月済"
 */
function isDoneThisMonth(doneRaw: string, year: number, monthIndex: number): boolean {
    const s = normalizeDone(doneRaw);
    if (!s) return false;

    const hasSumi = s.includes("済") || s.includes("done");
    if (!hasSumi) return false;

    // 「今月済」も許容
    if (s.includes("今月")) return true;

    const mm = String(monthIndex + 1).padStart(2, "0");
    const mNum = String(monthIndex + 1);

    const tokens = [
        `${year}/${mm}`,
        `${year}-${mm}`,
        `${year}年${mNum}月`,
        `${mNum}月`,
        `${mm}月`,
    ].map(normalizeDone);

    return tokens.some((t) => s.includes(t));
}

export default function LivingNotice({ livingExpenses }: Props) {
    // 入力・状態（id -> value）
    const [amountDraft, setAmountDraft] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<Record<string, string>>({});

    // 保存後すぐ消すため（done をローカルで上書き）
    const [doneOverride, setDoneOverride] = useState<Record<string, string>>({});

    const notices = useMemo<NoticeItem[]>(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const y = today.getFullYear();
        const mIdx = today.getMonth();
        const todayDay = today.getDate();

        return (livingExpenses || [])
            .map((le) => {
                const dueDay = clampDueDay(y, mIdx, le.day);
                const dueDate = new Date(y, mIdx, dueDay);
                dueDate.setHours(0, 0, 0, 0);
                return { ...le, dueDay, dueDate };
            })
            .filter((le) => {
                // ✅ Done が「今月済」なら表示しない
                const done = doneOverride[le.id] ?? le.done ?? "";
                if (isDoneThisMonth(done, y, mIdx)) return false;

                return le.dueDay <= todayDay;
            })
            .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    }, [livingExpenses, doneOverride]);

    const handleSave = async (n: NoticeItem) => {
        const key = n.id;
        setError((p) => ({ ...p, [key]: "" }));

        const raw = (amountDraft[key] ?? String(n.amount ?? "")).trim();
        const amount = Number(raw);

        if (!Number.isFinite(amount) || amount <= 0) {
            setError((p) => ({ ...p, [key]: "料金を正しく入力してください" }));
            return;
        }

        try {
            setSaving((p) => ({ ...p, [key]: true }));

            const now = new Date();
            const date = formatYMDSlash(now);

            const res = await fetch("/api/add-expense", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date,
                    detail: n.detail,
                    amount,
                    category: n.category,
                    payment: n.payment,
                    memo: n.memo ?? "",
                }),
            });

            if (!res.ok) {
                setError((p) => ({ ...p, [key]: "保存に失敗しました" }));
                return;
            }

            // ✅ 保存後すぐ非表示（今月済をローカルで付与）
            const y = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, "0");
            setDoneOverride((p) => ({ ...p, [key]: `${y}/${mm}済` }));

            // 必要ならここで再取得イベント発火（あなたの submit と同じ）
            window.dispatchEvent(new Event("expense-updated"));

            // 入力値は保持（消したければ "" にしてOK）
            setAmountDraft((p) => ({ ...p, [key]: String(amount) }));
        } catch {
            setError((p) => ({ ...p, [key]: "保存に失敗しました" }));
        } finally {
            setSaving((p) => ({ ...p, [key]: false }));
        }
    };

    if (notices.length === 0) return null;

    return (
        <div style={wrap}>
            <div style={titleRow}>
                <AlertTriangle size={18} />
                <div style={title}>今月の支払い予定</div>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
                {notices.map((n) => {
                    const key = n.id;
                    const value = amountDraft[key] ?? String(n.amount ?? "");
                    const isSaving = !!saving[key];
                    const err = error[key];

                    return (
                        <div key={key} style={card}>
                            <div style={left}>
                                <div style={name}>{n.detail}</div>

                                <div style={meta}>
                                    予定：{n.dueDate.getMonth() + 1}/{n.dueDay}
                                    {" ・ "}
                                    支払：{n.payment}
                                </div>

                                {err ? <div style={errorText}>{err}</div> : null}
                            </div>


                            <div style={right}>
                                <div style={badge}>未処理</div>

                                <div style={formRow}>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        placeholder="料金"
                                        value={value}
                                        onChange={(e) =>
                                            setAmountDraft((p) => ({ ...p, [key]: e.target.value }))
                                        }
                                        style={amountInput}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleSave(n)}
                                        disabled={isSaving}
                                        style={{ ...saveBtn, ...(isSaving ? saveBtnDisabled : {}) }}
                                    >
                                        <Save size={16} />
                                        <span>{isSaving ? "保存中" : "保存"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ===== styles ===== */

const wrap: React.CSSProperties = {
    marginTop: 12,
    marginBottom: 14,
    padding: 14,
    borderRadius: 16,
    border: "1px solid rgba(245, 158, 11, 0.25)",
    background: "rgba(255, 255, 255, 0.9)",
    boxShadow: "0 10px 24px rgba(2, 6, 23, 0.06)",
};

const titleRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
};

const title: React.CSSProperties = {
    fontWeight: 800,
    fontSize: 14,
};

const card: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(15, 23, 42, 0.08)",
    background: "white",
};

const left: React.CSSProperties = {
    display: "grid",
    gap: 4,
};

const name: React.CSSProperties = {
    fontWeight: 800,
    fontSize: 14,
};

const meta: React.CSSProperties = {
    fontSize: 12,
    color: "rgba(15, 23, 42, 0.65)",
};

const right: React.CSSProperties = {
    display: "grid",
    gap: 8,
    justifyItems: "end",
};

const badge: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 800,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(245, 158, 11, 0.12)",
    color: "rgb(180, 83, 9)",
};

const formRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
};

const amountInput: React.CSSProperties = {
    width: 120,
    height: 34,
    padding: "0 10px",
    borderRadius: 10,
    border: "1px solid rgba(15, 23, 42, 0.12)",
    outline: "none",
    fontSize: 13,
    fontWeight: 700,
};

const saveBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    height: 34,
    padding: "0 10px",
    borderRadius: 10,
    border: "1px solid rgba(15, 23, 42, 0.10)",
    background: "rgba(15, 23, 42, 0.06)",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
};

const saveBtnDisabled: React.CSSProperties = {
    opacity: 0.6,
    cursor: "not-allowed",
};

const errorText: React.CSSProperties = {
    marginTop: 2,
    fontSize: 12,
    fontWeight: 700,
    color: "rgb(185, 28, 28)",
};
