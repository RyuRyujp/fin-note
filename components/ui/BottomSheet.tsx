"use client";

import { useEffect } from "react";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function BottomSheet({ open, title, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2,6,23,0.42)",
        backdropFilter: "blur(6px)",
        zIndex: 80,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          background: "white",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 16,
          paddingBottom: `calc(16px + env(safe-area-inset-bottom))`,
          boxShadow: "0 -18px 40px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>{title}</div>
          <button
            onClick={onClose}
            style={{
              border: "1px solid var(--line)",
              background: "white",
              borderRadius: 12,
              padding: "8px 10px",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            閉じる
          </button>
        </div>

        <div style={{ marginTop: 12 }}>{children}</div>
      </div>
    </div>
  );
}
