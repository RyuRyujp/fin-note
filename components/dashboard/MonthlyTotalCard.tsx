"use client";

import { useState } from "react";
import { theme } from "@/lib/theme";

type DetailItem = { label: string; value: string };

type Props = {
  amount: number;
  dateLabel: string;
  monthLabel: string;
  details?: DetailItem[];
  flipEnabled?: boolean;
};

export default function MonthlyTotalCard({
  amount,
  dateLabel,
  monthLabel,
  details = [],
  flipEnabled = true,
}: Props) {
  const [flipped, setFlipped] = useState(false);

  const onToggle = () => {
    if (!flipEnabled) return;
    setFlipped(v => !v);
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={flipped}
      style={{
        ...buttonReset,
        display: "block",
        width: "100%",
        textAlign: "left",
        cursor: flipEnabled ? "pointer" : "default",
      }}
    >
      <div style={scene}>
        <div
          style={{
            ...card3d,
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* 表 */}
          <div style={{ ...face, ...front }}>
            <div style={wrap}>
              <div style={goldLine} />

              <div style={topRow}>
                <div style={dateText}>{dateLabel}</div>
                <div style={badge}>
                  <span style={badgeDot} />
                  <span style={badgeText}>{monthLabel}</span>
                </div>
              </div>

              <div style={title}>今月の累計利用金額</div>

              <div style={amountRow}>
                <span style={yen}>¥</span>
                <span style={amountText}>{amount.toLocaleString()}</span>
              </div>

              <div style={sub}>
                {monthLabel} 集計
                <span style={hint}>・タップで詳細</span>
              </div>
            </div>
          </div>

          {/* 裏 */}
          <div style={{ ...face, ...back }}>
            <div style={backWrap}>
              <div style={goldLine} />

              <div style={backHeaderRow}>
                <div style={backTitle}>詳細</div>
                <div style={backBadge}>{monthLabel}</div>
              </div>

              {details.length ? (
                <div style={grid}>
                  {details.slice(0, 6).map((d, i) => (
                    <div key={i} style={metricCard}>
                      <div style={metricLabel}>{d.label}</div>
                      <div style={metricValue}>{d.value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={emptyNote}>
                  詳細データはまだ準備中です
                  <div style={emptySub}>（タップで戻る）</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ========= styles ========= */

const buttonReset: React.CSSProperties = {
  background: "transparent",
  border: "none",
  padding: 0,
  margin: 0,
  font: "inherit",
  color: "inherit",
};

const scene: React.CSSProperties = {
  perspective: 900,
  // ✅ gridで“高さ”をちゃんと確保（absolute多用より被りにくい）
  display: "grid",
};

const card3d: React.CSSProperties = {
  position: "relative",
  display: "grid", // faceを重ねる
  transformStyle: "preserve-3d",
  WebkitTransformStyle: "preserve-3d",
  transition: "transform 520ms cubic-bezier(.2,.8,.2,1)",
};

const face: React.CSSProperties = {
  gridArea: "1 / 1", // ✅ 表と裏を同じセルに重ねる
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};

const front: React.CSSProperties = { transform: "rotateY(0deg)" };
const back: React.CSSProperties = { transform: "rotateY(180deg)" };

const wrap: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 22,
  padding: 18,
  background: theme.primary,
  border: `1px solid rgba(255,255,255,0.10)`,
  boxShadow: "0 18px 38px rgba(2, 6, 23, 0.22), 0 6px 14px rgba(2, 6, 23, 0.14)",
};

const backWrap: React.CSSProperties = {
  ...wrap,
  paddingTop: 16,
};

const goldLine: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 2,
  background: theme.accent,
  opacity: 0.95,
};

const topRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const dateText: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "rgba(255,255,255,0.75)",
  letterSpacing: 0.2,
};

const badge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 10px",
  borderRadius: 999,
  background: "rgba(214,181,138,0.18)",
  border: "1px solid rgba(214,181,138,0.45)",
  boxShadow: "0 10px 22px rgba(2,6,23,0.18)",
};

const badgeDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const badgeText: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: theme.accent,
  letterSpacing: 0.2,
};

const title: React.CSSProperties = {
  marginTop: 12,
  fontSize: 14,
  fontWeight: 800,
  color: "rgba(255,255,255,0.92)",
};

const amountRow: React.CSSProperties = {
  marginTop: 10,
  display: "flex",
  alignItems: "baseline",
  gap: 6,
};

const yen: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: "rgba(255,255,255,0.90)",
  opacity: 0.95,
};

const amountText: React.CSSProperties = {
  fontSize: 40,
  fontWeight: 900,
  letterSpacing: 0.4,
  lineHeight: 1.05,
  color: "#FFFFFF",
  textShadow: "0 10px 26px rgba(2, 6, 23, 0.35)",
};

const sub: React.CSSProperties = {
  marginTop: 10,
  fontSize: 12,
  color: "rgba(255,255,255,0.70)",
};

const hint: React.CSSProperties = {
  marginLeft: 6,
  fontSize: 12,
  color: "rgba(255,255,255,0.72)",
};

const backHeaderRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 12,
};

const backTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 900,
  color: "rgba(255,255,255,0.92)",
};

const backBadge: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: theme.accent,
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid rgba(214,181,138,0.45)",
  background: "rgba(214,181,138,0.14)",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 10,
};

const metricCard: React.CSSProperties = {
  borderRadius: 16,
  padding: "10px 12px",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.06)",
  boxShadow: "0 10px 22px rgba(2,6,23,0.14)",
};

const metricLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "rgba(255,255,255,0.72)",
};

const metricValue: React.CSSProperties = {
  marginTop: 6,
  fontSize: 16,
  fontWeight: 900,
  color: "rgba(255,255,255,0.95)",
  letterSpacing: 0.2,
};

const emptyNote: React.CSSProperties = {
  borderRadius: 16,
  padding: "14px 12px",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.88)",
  fontWeight: 800,
};

const emptySub: React.CSSProperties = {
  marginTop: 6,
  fontSize: 12,
  fontWeight: 700,
  color: "rgba(255,255,255,0.70)",
};

