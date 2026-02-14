type Props = {
  amount: number;
  dateLabel: string;
  monthLabel: string;
};

const theme = {
  primary: "#1D4E89", // Blue
  accent: "#D6B58A",  // Gold

  surface: "#FFFFFF",
  textOnBlue: "rgba(255,255,255,0.92)",
  textOnBlueSub: "rgba(255,255,255,0.72)",
  borderOnBlue: "rgba(255,255,255,0.14)",
};

export default function MonthlyTotalCard({ amount, dateLabel, monthLabel }: Props) {
  return (
    <div style={wrap}>
      {/* 金のアクセントライン（混ぜない） */}
      <div style={goldLine} />

      <div style={topRow}>
        <div style={dateText}>{dateLabel}</div>

        {/* 金のバッジ（混ぜない） */}
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

      <div style={sub}>{monthLabel} 集計</div>
    </div>
  );
}

/* =========================
   styles
========================= */

const wrap: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 22,
  padding: 18,

  // ✅ 青だけ（混ぜない）
  background: "#1D4E89",
  border: `1px solid rgba(255,255,255,0.10)`,

  // iOSっぽい奥行き（色は混ぜない）
  boxShadow:
    "0 18px 38px rgba(2, 6, 23, 0.22), 0 6px 14px rgba(2, 6, 23, 0.14)",
};

const goldLine: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 2,
  background: "#D6B58A", // ✅ 金だけ
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

  // ✅ 金だけ（背景も枠も金）
  background: "rgba(214,181,138,0.18)",
  border: "1px solid rgba(214,181,138,0.45)",

  // うっすら奥行き（色は混ぜない）
  boxShadow: "0 10px 22px rgba(2,6,23,0.18)",
};

const badgeDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 999,
  background: "#D6B58A", // ✅ 金だけ
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const badgeText: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: "#D6B58A", // ✅ 金だけ
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

  // 上品な立体感（色は混ぜない：影は黒系のみ）
  textShadow: "0 10px 26px rgba(2, 6, 23, 0.35)",
};

const sub: React.CSSProperties = {
  marginTop: 10,
  fontSize: 12,
  color: "rgba(255,255,255,0.70)",
};
