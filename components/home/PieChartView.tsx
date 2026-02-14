"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type Expense = {
  category: string;
  amount: number;
};

type Props = {
  expenses: Expense[];
};

const theme = {
  primary: "#1D4E89",
  accent: "#D6B58A",

  surface: "rgba(255,255,255,0.86)",
  surfaceSolid: "#FFFFFF",
  text: "#0F172A",
  subtext: "#64748B",
  border: "rgba(15,23,42,0.10)",
};

// ✅ 多色禁止：青の濃淡だけ（混色なし）
const BLUE_STEPS = [
  "#1D4E89",
  "#163E6D",
  "#0F335C",
  "#2A5FA0",
  "#3B73B6",
  "#0B2A4C",
  "#245A94",
  "#1A466F",
];

export default function PieChartView({ expenses }: Props) {
  const map: Record<string, number> = {};

  expenses.forEach((e) => {
    const key = e.category || "未分類";
    map[key] = (map[key] || 0) + (Number(e.amount) || 0);
  });

  // 降順にして見た目も安定
  const data = Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div style={card}>
      {/* 金ライン（混色なし） */}
      <div style={goldLine} />

      <div style={layout}>
        {/* ===== 左：円グラフ ===== */}
        <div style={{ width: "100%", height: 210 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={54}
                outerRadius={84}
                stroke="rgba(255,255,255,0.9)"
                strokeWidth={2}
                paddingAngle={2}
                isAnimationActive={true}
                animationDuration={650}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={BLUE_STEPS[i % BLUE_STEPS.length]} />
                ))}
              </Pie>

              {/* Tooltipもアプリっぽく */}
              <Tooltip
                contentStyle={{
                  background: theme.surfaceSolid,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 12,
                  boxShadow: "0 14px 30px rgba(2,6,23,0.10)",
                  fontSize: 12,
                }}
                formatter={(value: any) => [`¥${Number(value).toLocaleString()}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* 中央ラベル（アプリ感UP） */}
          <div style={centerLabel}>
            <div style={centerLabelTitle}>合計</div>
            <div style={centerLabelValue}>¥{total.toLocaleString()}</div>
          </div>
        </div>

        {/* ===== 右：凡例 ===== */}
        <div style={{ display: "grid", gap: 10 }}>
          <div style={titleRow}>
            <span style={titleDot} />
            <div style={titleText}>カテゴリ割合</div>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {data.map((d, i) => {
              const percent = total ? Math.round((d.value / total) * 100) : 0;
              const color = BLUE_STEPS[i % BLUE_STEPS.length];

              return (
                <div key={d.name} style={legendRow}>
                  {/* 左：色 + 名前 */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        background: color, // ✅ 青の濃淡のみ
                        boxShadow: "0 0 0 4px rgba(29,78,137,0.12)",
                      }}
                    />
                    <span style={legendName}>{d.name}</span>
                  </div>

                  {/* 右：金額 + % */}
                  <div style={{ textAlign: "right" }}>
                    <div style={legendValue}>¥{d.value.toLocaleString()}</div>
                    <div style={legendPercent}>{percent}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   styles
========================= */

const card: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 18,
  padding: 16,
  background: theme.surfaceSolid,
  border: `1px solid rgba(29,78,137,0.12)`, // ✅ 青の薄枠
  boxShadow: "0 14px 28px rgba(2,6,23,0.06)",
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

const layout: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
  alignItems: "center",
  minHeight: 260,
};

const centerLabel: React.CSSProperties = {
  position: "absolute",
  // Pieの中央へ（左カラム内の中央付近）
  left: "25%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  pointerEvents: "none",
};

const centerLabelTitle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
};

const centerLabelValue: React.CSSProperties = {
  marginTop: 2,
  fontSize: 16,
  fontWeight: 950,
  color: theme.primary,
  letterSpacing: 0.2,
};

const titleRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 2,
};

const titleDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 999,
  background: theme.accent, // ✅ 金
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const titleText: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 950,
  color: theme.text,
  letterSpacing: 0.2,
};

const legendRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: 13,
};

const legendName: React.CSSProperties = {
  fontWeight: 750,
  color: theme.text,
};

const legendValue: React.CSSProperties = {
  fontWeight: 900,
  color: theme.primary, // ✅ 青
  letterSpacing: 0.2,
};

const legendPercent: React.CSSProperties = {
  fontSize: 11,
  color: theme.subtext,
};
