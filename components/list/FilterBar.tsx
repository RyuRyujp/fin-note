import React, { useMemo, useState } from "react";
import { theme } from "@/lib/theme";
import { useCategoryStore } from "@/lib/store/categoryStore";
import { usePaymentStore } from "@/lib/store/paymentStore";

type Props = {
  year: string;
  month: string;
  category: string;
  setYear: (v: string) => void;
  setMonth: (v: string) => void;
  setCategory: (v: string) => void;
  keyword: string;
  payment: string;
  setKeyword: (v: string) => void;
  setPayment: (v: string) => void;
};

export default function FilterBar({
  year,
  month,
  category,
  setYear,
  setMonth,
  setCategory,
  keyword,
  payment,
  setKeyword,
  setPayment,
}: Props) {
  const [openMore, setOpenMore] = useState(false);
  const categories = useCategoryStore((s) => s.categories);
  const payments = usePaymentStore((s) => s.payments);

  const moreLabel = useMemo(() => {
    const parts: string[] = [];
    if (keyword.trim()) parts.push(`検索:「${keyword.trim()}」`);
    if (payment) parts.push(`支払: ${payment}`);
    return parts.length ? parts.join(" / ") : "未設定";
  }, [keyword, payment]);

  return (
    <div style={card}>
      <div style={goldLine} />

      {/* ===== 基本フィルター（3列） ===== */}
      <Field label="年">
        <SelectShell>
          <select value={year} onChange={(e) => setYear(e.target.value)} style={select}>
            <option>2026</option>
            <option>2025</option>
          </select>
        </SelectShell>
      </Field>

      <Field label="月">
        <SelectShell>
          <select value={month} onChange={(e) => setMonth(e.target.value)} style={select}>
            <option value="01">1月</option>
            <option value="02">2月</option>
          </select>
        </SelectShell>
      </Field>

      <Field label="カテゴリ">
        <SelectShell>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={select}
          >
            <option value="">全て</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </SelectShell>
      </Field>

      {/* ===== 詳細フィルター：トグル ===== */}
      <div style={{ gridColumn: "1 / -1", marginTop: 2 }}>
        <button
          type="button"
          onClick={() => setOpenMore((v) => !v)}
          style={moreBtn}
          aria-expanded={openMore}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={moreIcon(openMore)} />
            <span style={{ fontWeight: 900, color: theme.primary }}>詳細フィルター</span>
          </span>

          <span style={moreMeta}>
            {moreLabel}
            <span style={{ marginLeft: 8, opacity: 0.9 }}>{openMore ? "閉じる" : "開く"}</span>
          </span>
        </button>
      </div>

      {/* ===== 詳細フィルター：本体（折りたたみ） ===== */}
      <div style={moreWrap(openMore)}>

        <div style={moreGrid}>
          <Field
            label="名前・内容検索"
            action={
              <button
                type="button"
                onClick={() => setKeyword("")}
                style={{ ...clearMiniBtn, marginTop: 0 }}
                aria-label="検索キーワードをクリア"
                disabled={!keyword.trim()}
              >
                クリア
              </button>
            }
          >
            <InputShell>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="例）スタバ"
                style={input}
              />
            </InputShell>
          </Field>


          <Field
            label="支払方法"
            action={
              <button
                type="button"
                onClick={() => setPayment("")}
                style={{ ...clearMiniBtn, marginTop: 0 }}
                aria-label="支払方法をクリア"
                disabled={!payment}
              >
                クリア
              </button>
            }
          >
            <SelectShell>
              <select value={payment} onChange={(e) => setPayment(e.target.value)} style={select}>
                <option value="">全て</option>
                {payments.map((p) => (
                  <option key={p.paymentId} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </SelectShell>
          </Field>

        </div>
      </div>
    </div>
  );
}

/* ===== 小コンポーネント ===== */

function Field({
  label,
  action,
  children,
}: {
  label: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={labelStyle}>
          <span style={labelDot} />
          <span>{label}</span>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function SelectShell({ children }: { children: React.ReactNode }) {
  return <div style={selectShell}>{children}</div>;
}

function InputShell({ children }: { children: React.ReactNode }) {
  return <div style={inputShell}>{children}</div>;
}

/* ===== styles ===== */

const card: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  background: theme.surface,
  backdropFilter: "blur(14px)",
  borderRadius: 18,
  padding: 14,
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: 10,
  boxShadow: "0 14px 28px rgba(2,6,23,0.06)",
  border: `1px solid rgba(29,78,137,0.12)`,
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

const labelStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontSize: 11.5,
  fontWeight: 850,
  color: theme.subtext,
  letterSpacing: 0.2,
};

const labelDot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const selectShell: React.CSSProperties = {
  position: "relative",
  borderRadius: 14,
  border: `1px solid ${theme.border}`,
  background: theme.surface,
  boxShadow: "0 10px 18px rgba(2,6,23,0.05)",
  overflow: "hidden",
};

const inputShell: React.CSSProperties = {
  position: "relative",
  borderRadius: 14,
  border: `1px solid ${theme.border}`,
  background: theme.surface,
  boxShadow: "0 10px 18px rgba(2,6,23,0.05)",
  overflow: "hidden",
};

const select: React.CSSProperties = {
  width: "100%",
  padding: "11px 38px 11px 12px",
  borderRadius: 14,
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: 14,
  fontWeight: 800,
  color: theme.text,
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  cursor: "pointer",
  backgroundImage:
    `linear-gradient(45deg, transparent 50%, ${theme.primary} 50%),` +
    `linear-gradient(135deg, ${theme.primary} 50%, transparent 50%)`,
  backgroundPosition: "calc(100% - 18px) 50%, calc(100% - 12px) 50%",
  backgroundSize: "6px 6px, 6px 6px",
  backgroundRepeat: "no-repeat",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "11px 12px",
  borderRadius: 14,
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: 16,
  fontWeight: 800,
  color: theme.text,
};

const moreBtn: React.CSSProperties = {
  width: "100%",
  border: `1px solid rgba(29,78,137,0.14)`,
  background: "rgba(255,255,255,0.72)",
  borderRadius: 14,
  padding: "10px 12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  cursor: "pointer",
  boxShadow: "0 10px 18px rgba(2,6,23,0.05)",
};

const moreMeta: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 850,
  color: theme.subtext,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "68%",
  textAlign: "right",
};

const moreIcon = (open: boolean): React.CSSProperties => ({
  width: 10,
  height: 10,
  borderRight: `2px solid ${theme.primary}`,
  borderBottom: `2px solid ${theme.primary}`,
  transform: open ? "rotate(225deg)" : "rotate(45deg)",
  transition: "transform 160ms ease",
  borderRadius: 1,
});

const moreWrap = (open: boolean): React.CSSProperties => ({
  gridColumn: "1 / -1",
  overflow: "hidden",
  maxHeight: open ? 160 : 0,
  opacity: open ? 1 : 0,
  transform: open ? "translateY(0px)" : "translateY(-4px)",
  transition: "max-height 220ms ease, opacity 160ms ease, transform 220ms ease",
});

const moreGrid: React.CSSProperties = {
  marginTop: 10,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
};

const clearMiniBtn: React.CSSProperties = {
  marginTop: 8,
  alignSelf: "start",
  justifySelf: "start",
  border: `1px solid rgba(29,78,137,0.14)`,
  background: "rgba(255,255,255,0.7)",
  borderRadius: 999,
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 900,
  color: theme.primary,
  cursor: "pointer",
};
