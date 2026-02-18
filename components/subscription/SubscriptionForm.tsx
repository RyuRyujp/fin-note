"use client";

import type React from "react";
import { theme } from "@/lib/theme";

export type SubscriptionFormProps = {
  day: string;
  setDay: (v: string) => void;

  detail: string;
  setDetail: (v: string) => void;

  /** amount は living では非表示になるので props は維持（呼び出し側も楽） */
  amount: string;
  setAmount: (v: string) => void;

  /** ✅ 追加：金額フィールドを表示するか（デフォルト true） */
  showAmount?: boolean;

  category: string;
  setCategory: (v: string) => void;

  payment: string;
  setPayment: (v: string) => void;

  done: boolean;
  setdone: (v: boolean) => void;

  onSubmit: () => void | Promise<void>;
  saving: boolean;
  onClose: () => void;
};

export default function SubscriptionForm({
  day,
  setDay,
  detail,
  setDetail,
  amount,
  setAmount,
  showAmount = true, // ✅ デフォルトは表示
  category,
  setCategory,
  payment,
  setPayment,
  done,
  setdone,
  onSubmit,
  saving,
  onClose,
}: SubscriptionFormProps) {
  const dayOptions = Array.from({ length: 31 }, (_, i) => String(i + 1));

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Field label="日（毎月）">
        <select value={day} onChange={(e) => setDay(e.target.value)} style={input}>
          {dayOptions.map((d) => (
            <option key={d} value={d}>
              {d}日
            </option>
          ))}
        </select>
      </Field>

      <Field label="詳細">
        <input value={detail} onChange={(e) => setDetail(e.target.value)} style={input} />
      </Field>

      {/* ✅ living のときだけ金額フィールドを消す */}
      {showAmount && (
        <Field label="金額">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="numeric"
            style={input}
          />
        </Field>
      )}

      <Field label="カテゴリ">
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={input}>
          <option>サブスク</option>
          <option>生活費</option>
          <option>その他</option>
        </select>
      </Field>

      <Field label="支払方法">
        <select value={payment} onChange={(e) => setPayment(e.target.value)} style={input}>
          <option>クレジット：三菱UFJ</option>
          <option>クレジット：楽天</option>
          <option>クレジット：EPOS</option>
          <option>クレジット：三井住友</option>
          <option>PayPay</option>
          <option>現金</option>
          <option>その他</option>
        </select>
      </Field>

      <Field label="今月済">
        <button
          type="button"
          onClick={() => setdone(!done)}
          style={{
            ...input,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 700,
            borderColor: done ? `${theme.primary}55` : theme.border,
          }}
        >
          <span style={{ color: theme.text }}>{done ? "済（ON）" : "未（OFF）"}</span>
          <span
            style={{
              width: 44,
              height: 26,
              borderRadius: 999,
              background: done ? `${theme.primary}` : "rgba(148,163,184,.55)",
              position: "relative",
              transition: "background 180ms ease",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 3,
                left: done ? 22 : 3,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "white",
                transition: "left 180ms ease",
              }}
            />
          </span>
        </button>
      </Field>

      <FormButtons onClose={onClose} onSubmit={onSubmit} saving={saving} />
    </div>
  );
}

/* ===============================
   Small components
================================ */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <div style={labelStyle}>{label}</div>
      {children}
    </label>
  );
}

function FormButtons({
  onClose,
  onSubmit,
  saving,
}: {
  onClose: () => void;
  onSubmit: () => void | Promise<void>;
  saving: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button
        type="button"
        onClick={onClose}
        disabled={saving}
        style={{ ...ghostBtn, ...(saving ? btnDisabled : {}) }}
      >
        閉じる
      </button>

      <button
        type="button"
        onClick={onSubmit}
        disabled={saving}
        style={{ ...primaryBtn, ...(saving ? btnDisabled : {}) }}
      >
        {saving ? "保存中..." : "保存"}
      </button>
    </div>
  );
}

/* ===============================
   styles
================================ */

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  letterSpacing: 0.2,
};

export const input: React.CSSProperties = {
  width: "100%",
  padding: "11px 12px",
  borderRadius: 14,
  border: `1px solid ${theme.border}`,
  background: "rgba(255,255,255,0.96)",
  fontSize: 16,
  fontWeight: 750,
  color: theme.text,
  outline: "none",
};

const primaryBtn: React.CSSProperties = {
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

const ghostBtn: React.CSSProperties = {
  flex: 1,
  border: `1px solid ${theme.border}`,
  background: "rgba(255,255,255,0.9)",
  padding: 12,
  borderRadius: 14,
  fontWeight: 900,
  color: theme.subtext,
  cursor: "pointer",
};

const btnDisabled: React.CSSProperties = {
  opacity: 0.6,
  cursor: "not-allowed",
};
