type Expense = {
  id: string;
  date: string;
  detail: string;
  amount: number;
  category: string;
  memo: string;
  payment: string;
};

type Item = { category: string; total: number };

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

export default function CategoryBreakdown({ expenses }: Props) {
  // 集計（カテゴリ→合計）
  const map: Record<string, number> = {};
  for (const e of expenses) {
    const key = e.category || "未分類";
    map[key] = (map[key] || 0) + (Number(e.amount) || 0);
  }

  // 配列化して降順ソート
  const items: Item[] = Object.entries(map)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  const max = items.length ? Math.max(...items.map((x) => x.total)) : 0;

  return (
    <div style={{ marginTop: 14 }}>
      {/* 見出し */}
      <div style={titleRow}>
        <span style={titleDot} />
        <div style={titleText}>カテゴリ別</div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {items.map((it) => {
          const ratio = max > 0 ? Math.min(1, it.total / max) : 0;

          return (
            <div key={it.category} style={card}>
              {/* 金ライン（混色なし） */}
              <div style={goldLine} />

              <div style={row}>
                <div style={{ display: "grid", gap: 6 }}>
                  <div style={catName}>{it.category}</div>

                  {/* 比率バー（青のみ） */}
                  <div style={barRail}>
                    <div
                      style={{
                        ...barFill,
                        width: `${Math.round(ratio * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div style={amountText}>¥{it.total.toLocaleString()}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================
   styles
========================= */

const titleRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 10,
};

const titleDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 999,
  background: theme.accent, // ✅ 金
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const titleText: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 950,
  letterSpacing: 0.2,
  color: theme.text,
};

const card: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 16,
  padding: "14px 14px",
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

const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 14,
};

const catName: React.CSSProperties = {
  fontWeight: 900,
  color: theme.primary, // ✅ カテゴリ名は青
  letterSpacing: 0.2,
};

const amountText: React.CSSProperties = {
  fontWeight: 950,
  letterSpacing: 0.2,
  color: theme.primary, // ✅ 金額は青
};

const barRail: React.CSSProperties = {
  width: 180,
  maxWidth: "52vw",
  height: 8,
  borderRadius: 999,
  background: "rgba(29,78,137,0.10)", // ✅ 青の薄いレール
  overflow: "hidden",
};

const barFill: React.CSSProperties = {
  height: "100%",
  borderRadius: 999,
  background: theme.primary, // ✅ 青のみ
  transition: "width .28s cubic-bezier(.22,.9,.32,1)",
};
