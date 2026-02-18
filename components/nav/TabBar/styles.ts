import { theme } from "@/lib/theme";

export const fabStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "calc(var(--tabbar-h) - 50px + env(safe-area-inset-bottom))",
  left: "50%",
  transform: "translateX(-50%)",
  width: 54,
  height: 54,
  borderRadius: "50%",
  border: "none",
  background: theme.primary,
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 10px 24px rgba(29,78,137,0.35)",
  zIndex: 80,
  cursor: "pointer",
};

export const navStyle: React.CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  paddingBottom: "env(safe-area-inset-bottom)",
  paddingTop: "10px",
  background: "rgba(255,255,255,0.82)",
  backdropFilter: "blur(20px)",
  borderTop: `1px solid ${theme.border}`,
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
  alignItems: "center",
  zIndex: 70,
};

export function tabStyle(active: boolean): React.CSSProperties {
  return {
    textDecoration: "none",
    display: "grid",
    justifyItems: "center",
    gap: 3,
    paddingTop: 6,
    fontSize: 10.5,
    fontWeight: 600,
    color: active ? theme.primary : theme.subtext,
    position: "relative",
  };
}

export const input: React.CSSProperties = {
  padding: "13px 14px",
  borderRadius: 12,
  border: `1px solid ${theme.border}`,
  background: theme.surface,
  fontSize: 16,
  color: theme.text,
};

export const cancelBtn: React.CSSProperties = {
  padding: "11px 16px",
  borderRadius: 12,
  border: `1px solid ${theme.border}`,
  background: theme.surface,
  fontWeight: 600,
  color: theme.subtext,
  cursor: "pointer",
};

export const saveBtn: React.CSSProperties = {
  padding: "11px 20px",
  borderRadius: 12,
  border: "none",
  background: `linear-gradient(135deg, ${theme.primary}, #163E6D)`,
  color: "white",
  fontWeight: 700,
  letterSpacing: 0.2,
  cursor: "pointer",
};
