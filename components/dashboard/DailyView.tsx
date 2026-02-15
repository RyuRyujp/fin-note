"use client";

import { useState } from "react";
import DailyList from "./DailyList";
import DailyCalendar from "./DailyCalendar";
import type { Expense } from "@/lib/store/expenseStore";
import { theme } from "@/lib/theme";

export default function DailyView({ expenses }: { expenses: Expense[] }) {
  const [tab, setTab] = useState<"list" | "calendar">("list");
  const idx = tab === "list" ? 0 : 1;

  return (
    <div style={{ marginTop: 12 }}>
      {/* ===== 豪華サブタブ（ズレない・リッチ） ===== */}
      <div style={subWrap}>
        {/* gold top hairline */}
        <div style={goldTopLine} />

        {/* スライドする青のインジケータ（幅50%に追従＝ズレない） */}
        <div style={indicatorRail}>
          <div
            style={{
              ...indicator,
              transform: `translateX(${idx * 100}%)`,
            }}
          >
            {/* 金のピン（active側のみ） */}
            <div style={goldPin} />
          </div>
        </div>

        <SubTab
          active={tab === "list"}
          onClick={() => setTab("list")}
          label="日別一覧"
        />
        <SubTab
          active={tab === "calendar"}
          onClick={() => setTab("calendar")}
          label="カレンダー"
        />
      </div>

      {/* ===== 中身 ===== */}
      <div style={{ marginTop: 12 }}>
        {tab === "list" ? (
          <DailyList expenses={expenses} />
        ) : (
          <DailyCalendar expenses={expenses} />
        )}
      </div>
    </div>
  );
}

function SubTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...btn,
        color: active ? theme.primary : theme.subtext,
        fontWeight: active ? 850 : 650,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(.985)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {label}
    </button>
  );
}

/* =========================
   styles（豪華版）
========================= */

const subWrap: React.CSSProperties = {
  position: "relative",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  alignItems: "center",

  padding: 6,
  borderRadius: 18,
  overflow: "hidden",

  background: theme.surface,
  backdropFilter: "blur(16px)",

  // 金の“リム”感（混色なし：borderだけ金を使う）
  border: `1px solid rgba(214,181,138,0.38)`,

  // 内側のハイライトで高級感
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.70), 0 12px 26px rgba(2,6,23,0.08)",
};

const goldTopLine: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 2,
  background: theme.primary,
  opacity: 0.95,
  pointerEvents: "none",
};

const indicatorRail: React.CSSProperties = {
  position: "absolute",
  inset: 6,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  pointerEvents: "none",
};

const indicator: React.CSSProperties = {
  gridColumn: "1 / 2",
  height: "100%",
  borderRadius: 14,

  // ズレない移動
  transition: "transform .30s cubic-bezier(.22,.9,.32,1)",
  willChange: "transform",

  // 金の細枠で“豪華”
  outline: "1px solid rgba(214,181,138,0.55)",
  outlineOffset: -1,

  position: "relative",
};

const goldPin: React.CSSProperties = {
  position: "absolute",
  right: 10,
  top: "50%",
  transform: "translateY(-50%)",
  width: 8,
  height: 8,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const btn: React.CSSProperties = {
  position: "relative",
  zIndex: 2,

  border: "none",
  background: "transparent",
  borderRadius: 14,

  padding: "10px 0",
  cursor: "pointer",

  fontSize: 13,
  letterSpacing: 0.2,

  transition: "color .18s ease, font-weight .18s ease, transform .12s ease",
};
