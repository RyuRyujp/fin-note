"use client";

import { useState, useEffect } from "react";
import { useExpenseStore, Expense } from "@/lib/store/expenseStore";

const theme = {
  primary: "#1D4E89",
  accent: "#D6B58A",

  surface: "rgba(255,255,255,0.92)",
  surfaceSolid: "#FFFFFF",
  text: "#0F172A",
  subtext: "#64748B",
  border: "rgba(15,23,42,0.10)",
  blueBorder: "rgba(29,78,137,0.14)",
};

type InputChange = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

export default function ExpenseDetailModal() {
  const { selectedExpense, selectExpense, deleteExpense, updateExpense } = useExpenseStore();

  const [form, setForm] = useState<Expense | null>(null);

  useEffect(() => {
    setForm(selectedExpense);
  }, [selectedExpense]);

  if (!selectedExpense || !form) return null;

  const change =
    (key: keyof Expense) =>
    (e: InputChange) => {
      const v = e.target.value;
      setForm({
        ...form,
        [key]: key === "amount" ? Number(v) : v,
      });
    };

  const close = () => selectExpense(null);

  return (
    <div style={overlay} onClick={close}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        {/* 金ライン */}
        <div style={goldLine} />

        {/* ===== タイトル ===== */}
        <div style={headerRow}>
          <div style={titleRow}>
            <span style={titleDot} />
            <div style={title}>支出の詳細</div>
          </div>

          <button style={xBtn} onClick={close} aria-label="閉じる">
            ✕
          </button>
        </div>

        {/* ===== フォーム ===== */}
        <div style={formGrid}>
          <Input label="内容" value={form.detail} onChange={change("detail")} />
          <Input label="金額" value={form.amount} onChange={change("amount")} type="number" />
          <Input label="日付" value={form.date} onChange={change("date")} type="text" />
          <Input label="カテゴリ" value={form.category} onChange={change("category")} />
          <Input label="支払方法" value={form.payment} onChange={change("payment")} />
        </div>

        {/* ===== ボタン ===== */}
        <div style={actions}>
          <button
            style={deleteBtn}
            onClick={() => deleteExpense(form.id)}
          >
            削除
          </button>

          <button
            style={saveBtn}
            onClick={() => updateExpense(form)}
          >
            保存
          </button>
        </div>

        <button style={closeBtn} onClick={close}>
          閉じる
        </button>
      </div>
    </div>
  );
}

/* ===== 小コンポ ===== */

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (e: InputChange) => void;
  type?: string;
}) {
  const [focus, setFocus] = useState(false);

  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={labelStyle}>{label}</span>

      <input
        value={value}
        onChange={onChange}
        type={type}
        style={{
          ...input,
          ...(focus ? inputFocus : {}),
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </label>
  );
}

/* ===== styles ===== */

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(2,6,23,0.42)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
  padding: 16,
};

const modal: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",

  width: "100%",
  maxWidth: 390,

  background: theme.surfaceSolid,
  borderRadius: 22,
  padding: 18,

  border: `1px solid ${theme.blueBorder}`,
  boxShadow: "0 22px 60px rgba(2,6,23,0.32)",
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

const headerRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const titleRow: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
};

const titleDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const title: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 950,
  color: theme.text,
  letterSpacing: 0.2,
};

const xBtn: React.CSSProperties = {
  border: `1px solid ${theme.border}`,
  background: "rgba(255,255,255,0.9)",
  borderRadius: 12,
  width: 36,
  height: 36,
  cursor: "pointer",
  fontWeight: 900,
  color: theme.subtext,
  boxShadow: "0 10px 18px rgba(2,6,23,0.08)",
};

const formGrid: React.CSSProperties = {
  display: "grid",
  gap: 12,
  marginTop: 14,
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  letterSpacing: 0.2,
};

const input: React.CSSProperties = {
  padding: "11px 12px",
  borderRadius: 14,
  border: `1px solid ${theme.border}`,
  background: "rgba(255,255,255,0.96)",
  fontSize: 14,
  fontWeight: 750,
  color: theme.text,
  outline: "none",
  transition: "box-shadow .18s ease, border-color .18s ease, transform .12s ease",
};

const inputFocus: React.CSSProperties = {
  borderColor: "rgba(29,78,137,0.55)", // ✅ 青
  boxShadow: "0 0 0 4px rgba(29,78,137,0.18)", // ✅ 青リング（混色なし）
};

const actions: React.CSSProperties = {
  display: "flex",
  gap: 10,
  marginTop: 16,
};

const deleteBtn: React.CSSProperties = {
  flex: 1,
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: 12,
  borderRadius: 14,
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: "0 14px 26px rgba(239,68,68,0.22)",
};

const saveBtn: React.CSSProperties = {
  flex: 1,
  background: theme.primary, // ✅ 青
  color: "white",
  border: "none",
  padding: 12,
  borderRadius: 14,
  fontWeight: 950,
  cursor: "pointer",
  boxShadow: "0 14px 26px rgba(29,78,137,0.22)",
};

const closeBtn: React.CSSProperties = {
  marginTop: 10,
  width: "100%",
  border: `1px solid ${theme.border}`,
  background: "rgba(255,255,255,0.9)",
  padding: 11,
  borderRadius: 14,
  fontWeight: 900,
  color: theme.subtext,
  cursor: "pointer",
};
