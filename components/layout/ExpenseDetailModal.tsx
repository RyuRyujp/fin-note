"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useExpenseStore, Expense } from "@/lib/store/expenseStore";
import { theme } from "@/lib/theme";

type InputChange =
  React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;


type Option = { value: string; label: string };

const CATEGORY_OPTIONS: Option[] = [
  { value: "食費", label: "食費" },
  { value: "交通費", label: "交通費" },
  { value: "日用品", label: "日用品" },
  { value: "雑貨", label: "雑貨" },
  { value: "サブスク", label: "サブスク" },
  { value: "娯楽・趣味", label: "娯楽・趣味" },
  { value: "その他", label: "その他" },
];

const PAYMENT_OPTIONS: Option[] = [
  { value: "クレジット：三菱UFJ", label: "クレジット：三菱UFJ" },
  { value: "クレジット：楽天", label: "クレジット：楽天" },
  { value: "クレジット：EPOS", label: "クレジット：EPOS" },
  { value: "クレジット：三井住友", label: "クレジット：三井住友" },
  { value: "PayPay", label: "PayPay" },
  { value: "現金", label: "現金" },
  { value: "その他", label: "その他" },
];

export default function ExpenseDetailModal() {
  const { selectedExpense, selectExpense, deleteExpense, updateExpense } =
    useExpenseStore();

  const [form, setForm] = useState<Expense | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const busy = saving || deleting;

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

  const close = () => {
    if (busy) return;
    selectExpense(null);
  };

  const onDelete = async () => {
    if (busy) return;
    setDeleting(true);
    try {
      await Promise.resolve(deleteExpense(form.id));
      selectExpense(null);
    } finally {
      setDeleting(false);
    }
  };

  const onSave = async () => {
    if (busy) return;
    setSaving(true);
    try {
      await Promise.resolve(updateExpense(form));
      selectExpense(null);
    } finally {
      setSaving(false);
    }
  };

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

          <button
            style={{
              ...xBtn,
              ...(busy ? btnDisabled : {}),
            }}
            onClick={close}
            aria-label="閉じる"
            disabled={busy}
          >
            ✕
          </button>
        </div>

        {/* ===== フォーム ===== */}
        <div style={formGrid}>
          <Input label="内容" value={form.detail} onChange={change("detail")} />
          <Input
            label="金額"
            value={form.amount}
            onChange={change("amount")}
            type="number"
          />
          <Input
            label="日付"
            value={form.date}
            onChange={change("date")}
            type="text"
          />
          <Select
            label="カテゴリ"
            value={form.category}
            onChange={change("category")}
            options={CATEGORY_OPTIONS}
          />

          <Select
            label="支払方法"
            value={form.payment}
            onChange={change("payment")}
            options={PAYMENT_OPTIONS}
          />
        </div>

        {/* ===== ボタン ===== */}
        <div style={actions}>
          <button
            style={{
              ...deleteBtn,
              ...btnInner,
              ...(busy ? btnDisabled : {}),
            }}
            onClick={onDelete}
            disabled={busy}
            aria-busy={deleting}
          >
            {deleting ? (
              <>
                <InlineSpinner />
                削除中
              </>
            ) : (
              "削除"
            )}
          </button>

          <button
            style={{
              ...saveBtn,
              ...btnInner,
              ...(busy ? btnDisabled : {}),
            }}
            onClick={onSave}
            disabled={busy}
            aria-busy={saving}
          >
            {saving ? (
              <>
                <InlineSpinner />
                保存中
              </>
            ) : (
              "保存"
            )}
          </button>
        </div>

        <button
          style={{
            ...closeBtn,
            ...(busy ? btnDisabled : {}),
          }}
          onClick={close}
          disabled={busy}
        >
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

function InlineSpinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block" }}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 1-9 9"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder = "選択してください",
}: {
  label: string;
  value: string;
  onChange: (e: InputChange) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const [focus, setFocus] = useState(false);

  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={labelStyle}>{label}</span>

      <select
        value={value ?? ""}
        onChange={onChange}
        style={{
          ...input,
          ...(focus ? inputFocus : {}),
          appearance: "none",
          WebkitAppearance: "none",
          backgroundImage:
            "linear-gradient(45deg, transparent 50%, rgba(15,23,42,0.55) 50%)," +
            "linear-gradient(135deg, rgba(15,23,42,0.55) 50%, transparent 50%)",
          backgroundPosition: "calc(100% - 18px) 55%, calc(100% - 12px) 55%",
          backgroundSize: "6px 6px, 6px 6px",
          backgroundRepeat: "no-repeat",
          paddingRight: 36,
          cursor: "pointer",
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
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

  background: theme.surface,
  borderRadius: 22,
  padding: 18,

  border: `1px solid ${theme.border}`,
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
  fontSize: 16,
  fontWeight: 750,
  color: theme.text,
  outline: "none",
  transition: "box-shadow .18s ease, border-color .18s ease, transform .12s ease",
};

const inputFocus: React.CSSProperties = {
  borderColor: "rgba(29,78,137,0.55)",
  boxShadow: "0 0 0 4px rgba(29,78,137,0.18)",
};

const actions: React.CSSProperties = {
  display: "flex",
  gap: 10,
  marginTop: 16,
};

const btnInner: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

const btnDisabled: React.CSSProperties = {
  opacity: 0.6,
  cursor: "not-allowed",
  filter: "grayscale(0.1)",
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
  background: theme.primary,
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
