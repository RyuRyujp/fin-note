type Mode = "category" | "daily" | "pie" | "monthly";

type Props = {
  value: Mode;
  onChange: (v: Mode) => void;
};

const theme = {
  primary: "#1D4E89", // Blue
  accent: "#D6B58A",  // Gold

  surface: "rgba(255,255,255,0.78)",
  border: "rgba(15,23,42,0.10)",
  text: "#0F172A",
  subtext: "#475569",
};

const items: { key: Mode; label: string }[] = [
  { key: "daily", label: "日別" },
  { key: "category", label: "カテゴリ" },
  { key: "pie", label: "円グラフ" },
  { key: "monthly", label: "月間" },
];

export default function HomeSegment({ value, onChange }: Props) {
  const activeIndex = Math.max(0, items.findIndex((x) => x.key === value));

  return (
    <div style={wrap}>
      {/* 金のアクセントライン（混色なし） */}
      <div style={goldLine} />

      {/* スライドする青ピル（混色なし） */}
      <div style={indicatorRail}>
        <div
          style={{
            ...indicator,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      </div>

      {items.map((it) => {
        const active = it.key === value;

        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            style={{
              ...btn,
              color: active ? "rgba(255,255,255,0.95)" : theme.subtext,
              fontWeight: active ? 800 : 650,
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {/* 金のドット（activeだけ） */}
            {active && <span style={activeDot} />}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

/* =========================
   styles
========================= */

const wrap: React.CSSProperties = {
  position: "relative",
  display: "grid",
  gridTemplateColumns: `repeat(${items.length}, 1fr)`,
  gap: 0,

  padding: 4,
  borderRadius: 18,

  background: theme.surface,
  backdropFilter: "blur(14px)",
  border: `1px solid ${theme.border}`,

  boxShadow: "0 10px 26px rgba(2,6,23,0.08)",
  overflow: "hidden",
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

const indicatorRail: React.CSSProperties = {
  position: "absolute",
  inset: 4,
  display: "grid",
  gridTemplateColumns: `repeat(${items.length}, 1fr)`,
  pointerEvents: "none",
};

const indicator: React.CSSProperties = {
  gridColumn: "1 / 2",
  height: "100%",
  borderRadius: 14,

  background: theme.primary, // ✅ 青だけ
  boxShadow: "0 14px 28px rgba(2,6,23,0.20)",

  transition: "transform .32s cubic-bezier(.22,.9,.32,1)",
  willChange: "transform",
};

const btn: React.CSSProperties = {
  position: "relative",
  zIndex: 2,

  border: "none",
  background: "transparent",
  borderRadius: 14,

  padding: "10px 0",
  fontSize: 13,
  cursor: "pointer",

  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,

  transition: "color .18s ease, font-weight .18s ease, transform .12s ease",
};

const activeDot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: theme.accent, // ✅ 金だけ
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};
