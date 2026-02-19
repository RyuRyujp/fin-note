"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Save, ChevronRight, CheckCircle2 } from "lucide-react";
import { theme } from "@/lib/theme";
import type { LivingExpense } from "@/lib/store/expenseStore";

type Props = {
  livingExpenses: LivingExpense[];
};

type NoticeItem = LivingExpense & {
  dueDate: Date;
  dueDay: number;
  daysLate: number;
};

function clampDueDay(year: number, monthIndex: number, day: number): number {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const d = Math.max(1, Math.floor(day || 1));
  return Math.min(d, lastDay);
}

function normalizeDone(s: string): string {
  return (s || "").trim().replace(/[ \u3000]/g, "").toLowerCase();
}

function isDoneThisMonth(doneRaw: string, year: number, monthIndex: number): boolean {
  const s = normalizeDone(doneRaw);
  if (!s) return false;

  const hasDone = s.includes("済") || s.includes("done");
  if (!hasDone) return false;

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

function formatJPY(n: number): string {
  try {
    return `¥${Math.round(n).toLocaleString()}`;
  } catch {
    return `¥${Math.round(n)}`;
  }
}

/** iPhone幅で崩れないための簡易レスポンシブ */
function useNarrow(breakpoint = 420) {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const apply = () => setNarrow(window.innerWidth <= breakpoint);
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [breakpoint]);

  return narrow;
}

export default function LivingNotice({ livingExpenses }: Props) {
  const narrow = useNarrow(420);

  const [amountDraft, setAmountDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string>>({});
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
        const diff = Math.floor((today.getTime() - dueDate.getTime()) / (24 * 60 * 60 * 1000));
        const daysLate = Math.max(0, diff);
        return { ...le, dueDay, dueDate, daysLate };
      })
      .filter((le) => {
        const done = doneOverride[le.id] ?? le.done ?? "";
        if (isDoneThisMonth(done, y, mIdx)) return false;
        return le.dueDay <= todayDay;
      })
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }, [livingExpenses, doneOverride]);

  const totalDue = useMemo(() => {
    let sum = 0;
    for (const n of notices) {
      const raw = (amountDraft[n.id] ?? String(n.amount ?? "")).trim();
      const v = Number(raw);
      if (Number.isFinite(v) && v > 0) sum += v;
      else if (typeof n.amount === "number" && Number.isFinite(n.amount) && n.amount > 0) sum += n.amount;
    }
    return sum;
  }, [notices, amountDraft]);

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
      const res = await fetch("/api/add-livingExpense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          livingId: n.id,
          amount,
          payment: n.payment,
        }),
      });

      if (!res.ok) {
        setError((p) => ({ ...p, [key]: "保存に失敗しました" }));
        return;
      }

      const y = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      setDoneOverride((p) => ({ ...p, [key]: `${y}/${mm}済` }));

      window.dispatchEvent(new Event("expense-updated"));
      setAmountDraft((p) => ({ ...p, [key]: String(amount) }));
    } catch {
      setError((p) => ({ ...p, [key]: "保存に失敗しました" }));
    } finally {
      setSaving((p) => ({ ...p, [key]: false }));
    }
  };

  if (notices.length === 0) return null;

  return (
    <section style={wrap} aria-label="今月の支払い予定">
      {/* ===== Header ===== */}
      <div style={head}>
        <div style={headLeft}>
          <div style={iconBadge}>
            <AlertTriangle size={16} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={title}>今月の支払い予定</div>
            <div style={sub}>
              期限が来た生活費の支払いです
            </div>
          </div>
        </div>

        <div style={headRight}>
          <div style={sumChip}>
            <span style={sumDot} />
            {notices.length} 件
          </div>
          <div style={sumAmount}>{formatJPY(totalDue)}</div>
        </div>

        <div style={goldLine} />
      </div>

      {/* ===== List ===== */}
      <div style={list}>
        {notices.map((n) => {
          const key = n.id;
          const value = amountDraft[key] ?? String(n.amount ?? "");
          const isSaving = !!saving[key];
          const err = error[key];

          const urgency: "today" | "warn" | "danger" =
            n.daysLate >= 7 ? "danger" : n.daysLate >= 1 ? "warn" : "today";

          return (
            <div
              key={key}
              style={{
                ...card,
                ...(narrow ? cardNarrow : {}),
                ...(urgency === "danger" ? cardDanger : {}),
                ...(urgency === "warn" ? cardWarn : {}),
              }}
            >
              {/* left */}
              <div style={{ ...left, minWidth: 0, ...(narrow ? leftNarrow : {}) }}>
                <div style={topRow}>
                  <div style={nameRow}>
                    <span style={dotFor(urgency)} />
                    <div style={name}>{n.detail}</div>
                  </div>

                  <div style={statusPillFor(urgency)}>
                    <span style={statusPillDotFor(urgency)} />
                    {urgency === "today"
                      ? "本日"
                      : urgency === "warn"
                        ? `${n.daysLate}日遅れ`
                        : `${n.daysLate}日超過`}
                  </div>
                </div>

                <div style={meta}>
                  期限：{n.dueDate.getMonth() + 1}/{n.dueDay}
                  <span style={metaSep}>•</span>
                  支払：{n.payment}
                </div>

                {err ? <div style={errorText}>{err}</div> : null}
              </div>

              {/* right */}
              <div style={{ ...right, ...(narrow ? rightNarrow : {}) }}>

                <div style={{ ...formRow, ...(narrow ? formRowNarrow : {}) }}>
                  <div style={{ ...amountWrap, ...(narrow ? amountWrapNarrow : {}) }}>
                    <span style={yen}>¥</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="料金"
                      value={value}
                      onChange={(e) => setAmountDraft((p) => ({ ...p, [key]: e.target.value }))}
                      style={{ ...amountInput, ...(narrow ? amountInputNarrow : {}) }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSave(n)}
                    disabled={isSaving}
                    style={{
                      ...saveBtn,
                      ...(narrow ? saveBtnNarrow : {}),
                      ...(isSaving ? saveBtnDisabled : {}),
                    }}
                  >
                    {isSaving ? <CheckCircle2 size={16} /> : <Save size={16} />}
                    <span>{isSaving ? "保存中" : "保存"}</span>
                  </button>
                </div>
              </div>

              <div style={shine} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* =========================
   styles
========================= */

const wrap: React.CSSProperties = {
  marginTop: 12,
  marginBottom: 14,
  borderRadius: 20,
  border: "1px solid rgba(214,181,138,0.32)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.80) 100%)",
  boxShadow: "0 18px 40px rgba(2,6,23,0.08)",
  overflow: "hidden",
};

const head: React.CSSProperties = {
  position: "relative",
  padding: 14,
  borderBottom: "1px solid rgba(15,23,42,0.08)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.84) 100%)",
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

const headLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
};

const headRight: React.CSSProperties = {
  marginTop: 12,
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 10,
};

const iconBadge: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 14,
  display: "grid",
  placeItems: "center",
  border: "1px solid rgba(245,158,11,0.25)",
  background: "rgba(245,158,11,0.10)",
  color: "rgb(180,83,9)",
  boxShadow: "0 12px 18px rgba(2,6,23,0.06)",
  flexShrink: 0,
};

const title: React.CSSProperties = {
  fontWeight: 950,
  fontSize: 14,
  letterSpacing: 0.2,
  color: theme.text,
};

const sub: React.CSSProperties = {
  marginTop: 3,
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  lineHeight: 1.45,
};

const sumChip: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "7px 10px",
  borderRadius: 999,
  border: "1px solid rgba(29,78,137,0.12)",
  background: "rgba(255,255,255,0.82)",
  color: theme.subtext,
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: 0.2,
};

const sumDot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.14)",
};

const sumAmount: React.CSSProperties = {
  fontWeight: 950,
  color: theme.primary,
  letterSpacing: 0.2,
  whiteSpace: "nowrap",
};

const list: React.CSSProperties = {
  padding: 12,
  display: "grid",
  gap: 10,
};

const card: React.CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "stretch",
  justifyContent: "space-between",
  gap: 12,
  padding: 12,
  borderRadius: 18,
  border: "1px solid rgba(29,78,137,0.12)",
  background: "rgba(255,255,255,0.88)",
  boxShadow: "0 16px 28px rgba(2,6,23,0.06)",
  overflow: "hidden",
};

const cardNarrow: React.CSSProperties = {
  flexDirection: "column",
  alignItems: "stretch",
  gap: 10,
};

const cardWarn: React.CSSProperties = {
  border: "1px solid rgba(245,158,11,0.22)",
};

const cardDanger: React.CSSProperties = {
  border: "1px solid rgba(239,68,68,0.22)",
};

const shine: React.CSSProperties = {
  pointerEvents: "none",
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(160px 80px at 14% 26%, rgba(255,255,255,0.52), rgba(255,255,255,0) 60%)",
  opacity: 0.75,
};

const left: React.CSSProperties = {
  display: "grid",
  gap: 6,
  minWidth: 0,
};

const leftNarrow: React.CSSProperties = {
  paddingRight: 0,
};

const topRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  minWidth: 0,
};

const nameRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  minWidth: 0,
};

const name: React.CSSProperties = {
  fontWeight: 1000,
  color: theme.text,
  fontSize: 14,
  letterSpacing: 0.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  minWidth: 0,
};

const meta: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const metaSep: React.CSSProperties = {
  margin: "0 8px",
  opacity: 0.55,
};

const right: React.CSSProperties = {
  display: "grid",
  gap: 8,
  justifyItems: "end",
  alignContent: "space-between",
  minWidth: 0,
};

const rightNarrow: React.CSSProperties = {
  justifyItems: "stretch",
};

const formRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const formRowNarrow: React.CSSProperties = {
  width: "100%",
  justifyContent: "space-between",
  gap: 10,
};

const amountWrap: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  height: 36,
  padding: "0 10px",
  borderRadius: 12,
  border: "1px solid rgba(29,78,137,0.12)",
  background: "rgba(255,255,255,0.90)",
  boxShadow: "0 10px 16px rgba(2,6,23,0.05)",
};

const amountWrapNarrow: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const yen: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 950,
  color: theme.subtext,
  opacity: 0.8,
  flexShrink: 0,
};

const amountInput: React.CSSProperties = {
  width: 96,
  height: 34,
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: 16,
  fontWeight: 900,
  color: theme.text,
  minWidth: 0,
};

const amountInputNarrow: React.CSSProperties = {
  width: "100%",
};

const saveBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  height: 36,
  padding: "0 12px",
  borderRadius: 12,
  border: "1px solid rgba(29,78,137,0.14)",
  background: theme.primary,
  color: theme.accent,
  fontSize: 13,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 12px 18px rgba(2,6,23,0.06)",
  transition: "transform .12s ease, opacity .12s ease, box-shadow .18s ease",
  whiteSpace: "nowrap",
};

const saveBtnNarrow: React.CSSProperties = {
  flexShrink: 0,
  minWidth: 96,
};

const saveBtnDisabled: React.CSSProperties = {
  opacity: 0.6,
  cursor: "not-allowed",
};

const errorText: React.CSSProperties = {
  marginTop: 2,
  fontSize: 12,
  fontWeight: 800,
  color: "rgb(185, 28, 28)",
};

/* ===== urgency helpers ===== */

function dotFor(level: "today" | "warn" | "danger"): React.CSSProperties {
  const base: React.CSSProperties = {
    width: 7,
    height: 7,
    borderRadius: 999,
    flexShrink: 0,
  };

  if (level === "danger") {
    return {
      ...base,
      background: "rgb(239, 68, 68)",
      boxShadow: "0 0 0 4px rgba(239,68,68,0.12)",
    };
  }
  if (level === "warn") {
    return {
      ...base,
      background: "rgb(245, 158, 11)",
      boxShadow: "0 0 0 4px rgba(245,158,11,0.12)",
    };
  }
  return {
    ...base,
    background: theme.accent,
    boxShadow: "0 0 0 4px rgba(214,181,138,0.14)",
  };
}

function statusPillFor(level: "today" | "warn" | "danger"): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: 0.2,
    flexShrink: 0,
    background: "rgba(214,181,138,0.14)",
    border: "1px solid rgba(214,181,138,0.22)",
    color: "rgba(120,82,37,0.92)",
    whiteSpace: "nowrap",
  };

  if (level === "danger") {
    return {
      ...base,
      background: "rgba(239,68,68,0.10)",
      border: "1px solid rgba(239,68,68,0.18)",
      color: "rgba(153,27,27,0.95)",
    };
  }
  if (level === "warn") {
    return {
      ...base,
      background: "rgba(245,158,11,0.12)",
      border: "1px solid rgba(245,158,11,0.20)",
      color: "rgb(180, 83, 9)",
    };
  }
  return base;
}

function statusPillDotFor(level: "today" | "warn" | "danger"): React.CSSProperties {
  const base: React.CSSProperties = {
    width: 6,
    height: 6,
    borderRadius: 999,
  };

  if (level === "danger") {
    return {
      ...base,
      background: "rgb(239, 68, 68)",
      boxShadow: "0 0 0 3px rgba(239,68,68,0.10)",
    };
  }
  if (level === "warn") {
    return {
      ...base,
      background: "rgb(245, 158, 11)",
      boxShadow: "0 0 0 3px rgba(245,158,11,0.10)",
    };
  }
  return {
    ...base,
    background: theme.accent,
    boxShadow: "0 0 0 3px rgba(214,181,138,0.12)",
  };
}
