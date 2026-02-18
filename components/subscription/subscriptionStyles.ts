import type React from "react";
import { theme } from "@/lib/theme";

/* ===============================
   Page styles
================================ */
export const pageWrap: React.CSSProperties = {
  paddingTop: 76,
  paddingLeft: 16,
  paddingRight: 16,
  paddingBottom: 90,
};

export const subWrap: React.CSSProperties = {
  position: "relative",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  alignItems: "center",

  padding: 6,
  borderRadius: 18,
  overflow: "hidden",

  background: theme.surface,
  backdropFilter: "blur(16px)",

  border: `1px solid rgba(214,181,138,0.38)`,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.70), 0 12px 26px rgba(2,6,23,0.08)",
};

export const goldTopLine: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 2,
  background: theme.primary,
  opacity: 0.95,
  pointerEvents: "none",
};

export const indicatorRail: React.CSSProperties = {
  position: "absolute",
  inset: 6,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  pointerEvents: "none",
};

export const indicator: React.CSSProperties = {
  gridColumn: "1 / 2",
  height: "100%",
  borderRadius: 14,

  transition: "transform .30s cubic-bezier(.22,.9,.32,1)",
  willChange: "transform",

  outline: "1px solid rgba(214,181,138,0.55)",
  outlineOffset: -1,

  position: "relative",
};

export const goldPin: React.CSSProperties = {
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

export const btn: React.CSSProperties = {
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

export const miniCount: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 26,
  height: 18,
  padding: "0 8px",
  borderRadius: 999,
  background: "rgba(15,23,42,0.06)",
  color: theme.subtext,
  fontSize: 11,
  fontWeight: 900,
};

/* ===============================
   Total card styles
================================ */
export const totalCard: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  background: theme.primary,
  borderRadius: 22,
  padding: 18,
  color: "white",
  boxShadow: "0 18px 46px rgba(29,78,137,0.30)",
};

export const goldLine: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 2,
  background: theme.accent,
  opacity: 0.95,
  pointerEvents: "none",
};

export const totalTopRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

export const totalTitleRow: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  minWidth: 0,
};

export const titleDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 5px rgba(214,181,138,0.20)",
  flexShrink: 0,
};

export const totalTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 900,
  letterSpacing: 0.2,
  opacity: 0.95,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const countBadge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.18)",
  fontSize: 12,
  fontWeight: 900,
};

export const countDot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

export const totalAmount: React.CSSProperties = {
  fontSize: 34,
  fontWeight: 950,
  marginTop: 10,
  letterSpacing: 0.2,
};

export const totalHint: React.CSSProperties = {
  marginTop: 8,
  fontSize: 12,
  fontWeight: 800,
  opacity: 0.75,
};

/* ===============================
   Row card styles
================================ */
export const card: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  background: theme.surface,
  borderRadius: 18,
  padding: "14px 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 14,
  border: `1px solid ${theme.border}`,
  boxShadow: "0 14px 28px rgba(2,6,23,0.06)",
};

export const cardBtnReset: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: 0,
};

export const goldLineThin: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 2,
  background: theme.accent,
  opacity: 0.95,
  pointerEvents: "none",
};

export const left: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  minWidth: 0,
};

export const rowTitle: React.CSSProperties = {
  fontWeight: 900,
  color: theme.text,
  letterSpacing: 0.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const meta: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  marginTop: 2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const right: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  flexShrink: 0,
};

export const price: React.CSSProperties = {
  fontWeight: 950,
  fontSize: 15,
  color: theme.primary,
  letterSpacing: 0.2,
};

export const chevWrap: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

export const chevDot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.16)",
};

export const chev: React.CSSProperties = {
  fontSize: 22,
  opacity: 0.35,
  color: theme.text,
};

/* ===============================
   Modal styles
================================ */
export const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(2,6,23,0.42)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
  padding: 16,
};

export const modal: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  width: "100%",
  maxWidth: 390,
  background: theme.surface,
  borderRadius: 22,
  padding: 18,
  border: `1px solid ${theme.border}`,
  boxShadow: "0 22px 60px rgba(2,6,23,0.32)",
};

export const goldLineModal: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 2,
  background: theme.accent,
  opacity: 0.95,
  pointerEvents: "none",
};

export const headerRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

export const titleRowModal: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
};

export const titleDotModal: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

export const titleModal: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 950,
  color: theme.text,
  letterSpacing: 0.2,
};

export const xBtn: React.CSSProperties = {
  border: `1px solid ${theme.border}`,
  background: "rgba(255,255,255,0.9)",
  borderRadius: 12,
  width: 36,
  height: 36,
  cursor: "pointer",
  fontWeight: 900,
  color: theme.subtext,
  boxShadow: "0 10px 18px rgba(2,6,23,0.08)",
};

export const btnDisabled: React.CSSProperties = {
  opacity: 0.6,
  cursor: "not-allowed",
  filter: "grayscale(0.1)",
};

export const dangerRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  marginTop: 12,
};

export const deleteBtn: React.CSSProperties = {
  flex: 1,
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: 12,
  borderRadius: 14,
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: "0 14px 26px rgba(239,68,68,0.22)",
};
