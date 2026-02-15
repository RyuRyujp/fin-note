"use client";

import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Expense } from "@/lib/store/expenseStore";
import { theme } from "@/lib/theme";

// ✅ 見分けやすい多色パレット（Tableau系でコントラスト強め）
const PALETTE = [
  "#4E79A7", // blue
  "#F28E2B", // orange
  "#E15759", // red
  "#76B7B2", // teal
  "#59A14F", // green
  "#EDC948", // yellow
  "#B07AA1", // purple
  "#FF9DA7", // pink
  "#9C755F", // brown
  "#BAB0AC", // gray
  "#2F5597", // deep blue
  "#8CD17D", // light green
];

// ✅ カテゴリ名→色 を固定（並び順が変わっても同じカテゴリは同じ色）
function hashString(str: string) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return Math.abs(h);
}
function colorForCategory(name: string) {
  return PALETTE[hashString(name) % PALETTE.length];
}

export default function PieChartView({ expenses }: { expenses: Expense[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const map: Record<string, number> = {};
  expenses.forEach((e) => {
    const key = e.category || "未分類";
    map[key] = (map[key] || 0) + (Number(e.amount) || 0);
  });

  const data = Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);

  return (
    <div style={card}>
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
                stroke="rgba(255,255,255,0.96)"
                strokeWidth={3}
                paddingAngle={1}
                cornerRadius={4}
                isAnimationActive={true}
                animationDuration={650}
                onMouseEnter={(_, idx) => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((d, i) => {
                  const fill = colorForCategory(d.name);
                  const isActive = activeIndex === i;

                  return (
                    <Cell
                      key={d.name}
                      fill={fill}
                      fillOpacity={isActive ? 1 : 0.92}
                      // ✅ hover 中だけ金で輪郭強調（視認性UP）
                      stroke={isActive ? theme.accent : "rgba(255,255,255,0.96)"}
                      strokeWidth={isActive ? 4 : 3}
                    />
                  );
                })}
              </Pie>

              <Tooltip
                contentStyle={{
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 12,
                  boxShadow: "0 14px 30px rgba(2,6,23,0.10)",
                  fontSize: 12,
                }}
                formatter={(value) => [`¥${Number(value).toLocaleString()}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>

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
              const color = colorForCategory(d.name);
              const isActive = activeIndex === i;

              return (
                <div
                  key={d.name}
                  style={{
                    ...legendRow,
                    opacity: activeIndex == null || isActive ? 1 : 0.55,
                    transition: "opacity 120ms ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        background: color,
                        border: "1px solid rgba(15,23,42,0.18)",
                        boxShadow: "0 0 0 4px rgba(15,23,42,0.06)", // ✅ 中立の影
                      }}
                    />
                    <span style={legendName}>{d.name}</span>
                  </div>

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
  background: theme.surface,
  border: `1px solid rgba(29,78,137,0.12)`,
  boxShadow: "0 14px 28px rgba(2,6,23,0.06)",
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

const layout: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
  alignItems: "center",
  minHeight: 260,
};

const centerLabel: React.CSSProperties = {
  position: "absolute",
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
  background: theme.accent,
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
  color: theme.primary,
  letterSpacing: 0.2,
};

const legendPercent: React.CSSProperties = {
  fontSize: 11,
  color: theme.subtext,
};
