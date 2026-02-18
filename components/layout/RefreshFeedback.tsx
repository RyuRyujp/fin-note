"use client";

import { theme } from "@/lib/theme";

export function RefreshButton({
  onClick,
  loading,
}: {
  onClick: () => Promise<void> | void;
  loading: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick()}
      disabled={loading}
      style={{
        border: "none",
        background: loading ? "rgba(148,163,184,0.25)" : theme.primary,
        color: loading ? "#64748b" : theme.accent,
        padding: "8px 14px",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 13,
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.85 : 1,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {loading && (
        <span
          aria-hidden
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            border: `2px solid ${theme.accent}`,
            borderTop: `2px solid ${theme.primary}`,
            animation: "spin 0.9s linear infinite",
          }}
        />
      )}
      {loading ? "更新中…" : "更新"}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}


export function RefreshOverlay({ open }: { open: boolean }) {
  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(15, 23, 42, 0.25)",
        border: `1px solid ${theme.accent}`,
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
      }}
    >
      <div
        style={{
          width: "min(360px, 92vw)",
          background: "rgba(255,255,255,0.92)",
          border: `2px solid ${theme.accent}`,
          borderRadius: 18,
          boxShadow: "0 18px 50px rgba(15,23,42,0.18)",
          padding: "16px 16px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          aria-hidden
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: `3px solid ${theme.accent}`,
            borderTop: `3px solid ${theme.primary}`,
            animation: "spin 0.9s linear infinite",
            flex: "0 0 auto",
          }}
        />
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>
            データを更新しています…
          </div>
          <div style={{ marginTop: 4, fontSize: 12, color: "#475569" }}>
            少々お待ちください
          </div>
        </div>
      </div>
    </div>
  );
}

export function CenterSpinner() {
  return (
    <div
      style={{
        height: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: `3px solid ${theme.accent}`,
          borderTop: `3px solid ${theme.primary}`,
          animation: "spin 0.9s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
