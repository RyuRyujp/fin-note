"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import SideMenu from "@/components/layout/SideMenu";
import TabBar from "@/components/nav/TabBar/Index";
import { usePaymentStore, type Payment } from "@/lib/store/paymentStore";
import { theme } from "@/lib/theme";

type Draft = { name: string };

export default function PaymentPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    payments,
    init,
    addPayment,
    updatePayment,
    deletePayment,
    movePayment,
    resetToMaster,
  } = usePaymentStore();

  useEffect(() => {
    init();
  }, [init]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editing = useMemo(() => {
    if (!editingId) return null;
    return payments.find((p) => p.paymentId === editingId) ?? null;
  }, [payments, editingId]);

  const [draft, setDraft] = useState<Draft>({ name: "" });

  const openAdd = () => {
    setEditingId(null);
    setDraft({ name: "" });
    setModalOpen(true);
  };

  const openEdit = (p: Payment) => {
    setEditingId(p.paymentId);
    setDraft({ name: p.name });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const save = () => {
    const name = draft.name.trim();
    if (!name) return;

    if (editingId) updatePayment(editingId, name);
    else addPayment(name);

    closeModal();
  };

  const remove = (paymentId: string) => {
    deletePayment(paymentId);
  };

  return (
    <>
      <AppHeader title="MoneyNote" subtitle="支払方法" onMenu={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div style={container}>
        {/* 上部カード */}
        <div style={infoCard}>
          <div style={goldLine} />
          <div style={infoTitleRow}>
            <span style={titleDot} />
            <div style={infoTitle}>支払方法管理</div>
          </div>
          <div style={infoSub}>追加/編集/削除/並び替えはローカルに保存されます（GAS連携は後で差し替え）</div>

          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <button style={primaryBtn} onClick={openAdd}>
              ＋ 追加
            </button>
            <button style={ghostBtn} onClick={resetToMaster}>
              初期化
            </button>
          </div>
        </div>

        {/* 一覧 */}
        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
          {payments.map((p) => (
            <PaymentRow
              key={p.paymentId}
              item={p}
              onEdit={() => openEdit(p)}
              onDelete={() => remove(p.paymentId)}
              onUp={() => movePayment(p.paymentId, "up")}
              onDown={() => movePayment(p.paymentId, "down")}
            />
          ))}
        </div>

        <div style={hint}>
          <span style={hintDot} />
          次は「アイコン付け / 既定（デフォルト）設定 / GAS保存・読込」に発展できます。
        </div>
      </div>

      <TabBar />

      {modalOpen && (
        <div style={overlay} onClick={closeModal}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <div style={goldLine} />
            <div style={modalHeader}>
              <div style={infoTitle}>{editing ? "支払方法編集" : "支払方法追加"}</div>
              <button style={xBtn} onClick={closeModal} aria-label="閉じる">
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={labelStyle}>名前</span>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ name: e.target.value })}
                  style={input}
                  placeholder="例）クレジット：JCB / 楽天Pay / 口座振替"
                />
              </label>

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button style={ghostBtn} onClick={closeModal}>
                  キャンセル
                </button>
                <button style={primaryBtn} onClick={save} disabled={!draft.name.trim()}>
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PaymentRow({
  item,
  onEdit,
  onDelete,
  onUp,
  onDown,
}: {
  item: Payment;
  onEdit: () => void;
  onDelete: () => void;
  onUp: () => void;
  onDown: () => void;
}) {
  return (
    <div style={rowCard}>
      <div style={goldLineThin} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <div style={payMark} />
        <div style={{ minWidth: 0 }}>
          <div style={rowTitle}>{item.name}</div>
          <div style={rowSub}>並び替え / 編集 / 削除</div>
        </div>
      </div>

      <div style={rightSide}>
        <button style={miniBtn} onClick={onUp} aria-label="上へ">
          ↑
        </button>
        <button style={miniBtn} onClick={onDown} aria-label="下へ">
          ↓
        </button>

        <button style={miniBtn} onClick={onEdit}>
          編集
        </button>
        <button style={{ ...miniBtn, ...dangerMini }} onClick={onDelete}>
          削除
        </button>

        <div style={chevWrap}>
          <span style={chevDot} />
          <span style={chev}>›</span>
        </div>
      </div>
    </div>
  );
}

/* =========================
   styles（カテゴリページと統一）
========================= */

const container: React.CSSProperties = {
  paddingTop: 76,
  paddingLeft: 16,
  paddingRight: 16,
  paddingBottom: 90,
};

const infoCard: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 18,
  background: theme.surface,
  border: `1px solid ${theme.border}`,
  boxShadow: "0 14px 26px rgba(2,6,23,0.06)",
  padding: 16,
};

const goldLine: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 2,
  background: theme.accent,
  opacity: 0.95,
};

const infoTitleRow: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
};

const titleDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 5px rgba(214,181,138,0.20)",
};

const infoTitle: React.CSSProperties = {
  fontWeight: 950,
  color: theme.primary,
  letterSpacing: 0.2,
};

const infoSub: React.CSSProperties = {
  marginTop: 8,
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  lineHeight: 1.5,
};

const rowCard: React.CSSProperties = {
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

const goldLineThin: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 2,
  background: theme.accent,
  opacity: 0.95,
};

const payMark: React.CSSProperties = {
  width: 14,
  height: 14,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
  flexShrink: 0,
};

const rowTitle: React.CSSProperties = {
  fontWeight: 950,
  color: theme.text,
  letterSpacing: 0.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const rowSub: React.CSSProperties = {
  marginTop: 3,
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const rightSide: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  flexShrink: 0,
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const miniBtn: React.CSSProperties = {
  border: `1px solid ${theme.border}`,
  background: "rgba(255,255,255,0.9)",
  padding: "7px 10px",
  borderRadius: 12,
  fontWeight: 900,
  color: theme.subtext,
  cursor: "pointer",
};

const dangerMini: React.CSSProperties = {
  borderColor: "rgba(239,68,68,0.35)",
  color: "rgba(239,68,68,0.9)",
};

const chevWrap: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const chevDot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.16)",
};

const chev: React.CSSProperties = {
  fontSize: 22,
  opacity: 0.35,
  color: theme.text,
};

const hint: React.CSSProperties = {
  marginTop: 14,
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  opacity: 0.95,
};

const hintDot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const primaryBtn: React.CSSProperties = {
  flex: 1,
  background: theme.primary,
  color: "white",
  border: "none",
  padding: 12,
  borderRadius: 14,
  fontWeight: 950,
  cursor: "pointer",
  boxShadow: "0 14px 26px rgba(29,78,137,0.22)",
};

const ghostBtn: React.CSSProperties = {
  flex: 1,
  border: `1px solid ${theme.border}`,
  background: "rgba(255,255,255,0.9)",
  padding: 12,
  borderRadius: 14,
  fontWeight: 900,
  color: theme.subtext,
  cursor: "pointer",
};

const overlay: React.CSSProperties = {
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

const modal: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  width: "100%",
  maxWidth: 420,
  background: theme.surface,
  borderRadius: 22,
  padding: 18,
  border: `1px solid ${theme.border}`,
  boxShadow: "0 22px 60px rgba(2,6,23,0.32)",
};

const modalHeader: React.CSSProperties = {
  marginTop: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const xBtn: React.CSSProperties = {
  border: `1px solid ${theme.border}`,
  background: "rgba(255,255,255,0.9)",
  borderRadius: 12,
  width: 36,
  height: 36,
  cursor: "pointer",
  fontWeight: 900,
  color: theme.subtext,
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  letterSpacing: 0.2,
};

const input: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  borderRadius: 14,
  border: `1px solid ${theme.border}`,
  background: "rgba(255,255,255,0.96)",
  fontSize: 16,
  fontWeight: 750,
  color: theme.text,
  outline: "none",
};
