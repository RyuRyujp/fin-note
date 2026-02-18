import type { ReactNode } from "react";
import { theme } from "@/lib/theme";
import { input, cancelBtn, saveBtn } from "./styles";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
      {children}
    </div>
  );
}

export function FormButtons({
  onClose,
  onSubmit,
  saving,
}: {
  onClose: () => void;
  onSubmit: () => void | Promise<void>;
  saving: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
      <button onClick={onClose} style={cancelBtn}>
        キャンセル
      </button>
      <button onClick={onSubmit} style={saveBtn} disabled={saving}>
        {saving ? "保存中..." : "保存"}
      </button>
    </div>
  );
}

export function DoneToggle({ done, onToggle }: { done: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        ...input,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontWeight: 700,
        borderColor: done ? `${theme.primary}55` : theme.border,
      }}
    >
      <span style={{ color: theme.text }}>{done ? "済（ON）" : "未（OFF）"}</span>
      <span
        style={{
          width: 44,
          height: 26,
          borderRadius: 999,
          background: done ? `${theme.primary}` : "rgba(148,163,184,.55)",
          position: "relative",
          transition: "background 180ms ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: done ? 22 : 3,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "white",
            transition: "left 180ms ease",
          }}
        />
      </span>
    </button>
  );
}
