import { theme } from "@/lib/theme";

type Props = {
  year: string;
  month: string;
  category: string;
  setYear: (v: string) => void;
  setMonth: (v: string) => void;
  setCategory: (v: string) => void;
};

export default function FilterBar({
  year,
  month,
  category,
  setYear,
  setMonth,
  setCategory,
}: Props) {
  return (
    <div style={card}>
      <div style={goldLine} />

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
            <option>食費</option>
            <option>生活費</option>
            <option>交通費</option>
            <option>日用品</option>
            <option>娯楽・趣味</option>
            <option>その他</option>
          </select>
        </SelectShell>
      </Field>
    </div>
  );
}

/* ===== 小コンポーネント ===== */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={labelStyle}>
        <span style={labelDot} />
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

function SelectShell({ children }: { children: React.ReactNode }) {
  return <div style={selectShell}>{children}</div>;
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
  border: `1px solid rgba(29,78,137,0.12)`, // ✅ 青の薄枠
};

const goldLine: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 2,
  background: theme.accent, // ✅ 金
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
  background: theme.accent, // ✅ 金
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

// ▼アイコンを疑似的に作る（OS依存の見た目を抑える）
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
