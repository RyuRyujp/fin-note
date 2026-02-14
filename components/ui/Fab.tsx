"use client";

type Props = {
  onClick: () => void;
};

export default function Fab({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label="追加"
      style={{
        position: "fixed",
        right: `max(16px, env(safe-area-inset-right))`,
        bottom: `calc(var(--tabbar-h) + env(safe-area-inset-bottom) + 16px)`,
        width: "var(--fab-size)",
        height: "var(--fab-size)",
        borderRadius: 999,
        border: "none",
        background: "#2563eb",
        color: "white",
        fontSize: 28,
        fontWeight: 900,
        boxShadow: "0 14px 30px rgba(37, 99, 235, 0.35)",
        cursor: "pointer",
        zIndex: 60,
      }}
    >
      +
    </button>
  );
}
