"use client";

import { useEffect, useMemo, useState } from "react";
import { FixedExpense, LivingExpense, useExpenseStore } from "@/lib/store/expenseStore";
import SubscriptionForm from "@/components/subscription/SubscriptionForm";
import {
  overlay,
  modal,
  goldLineModal,
  headerRow,
  titleRowModal,
  titleDotModal,
  titleModal,
  xBtn,
  btnDisabled,
  dangerRow,
  deleteBtn,
} from "@/components/subscription/subscriptionStyles";

export type SelectedSub =
  | { kind: "fixed"; item: FixedExpense }
  | { kind: "living"; item: LivingExpense };

type Props = {
  selected: SelectedSub | null;
  onClose: () => void;
};

type StoreActions = {
  updateFixedExpense?: (x: FixedExpense) => Promise<void> | void;
  deleteFixedExpense?: (id: string) => Promise<void> | void;
  updateLivingExpense?: (x: LivingExpense) => Promise<void> | void;
  deleteLivingExpense?: (id: string) => Promise<void> | void;
};

export default function SubscriptionDetailModal({ selected, onClose }: Props) {
  const store = useExpenseStore() as unknown as StoreActions;

  const [day, setDay] = useState("1");
  const [detail, setDetail] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("サブスク");
  const [payment, setPayment] = useState("クレジット：三菱UFJ");

  // ✅ UI用は boolean のまま
  const [done, setdone] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const busy = saving || deleting;

  // ✅ done(string) ⇄ done(boolean) の変換
  const thisMonthDoneStr = () => `${new Date().getMonth() + 1}月済`;
  const doneStrToBool = (s: string) => String(s ?? "").trim() === thisMonthDoneStr();
  const boolToDoneStr = (b: boolean) => (b ? thisMonthDoneStr() : "");

  useEffect(() => {
    if (!selected) return;

    const src = selected.item;

    setDay(String(src.day ?? 1));
    setDetail(String(src.detail ?? ""));
    setAmount(src.amount != null ? String(src.amount) : "");
    setCategory(String(src.category ?? (selected.kind === "fixed" ? "サブスク" : "生活費")));
    setPayment(String(src.payment ?? "クレジット：三菱UFJ"));

    // ✅ string → boolean
    setdone(doneStrToBool(src.done));
  }, [selected]);

  const amountNumber = useMemo(() => {
    const n = Number(String(amount).replace(/,/g, "").trim());
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  if (!selected) return null;

  const close = () => {
    if (busy) return;
    onClose();
  };

  const onSubmit = async () => {
    if (busy) return;
    setSaving(true);

    try {
      const doneString = boolToDoneStr(done);

      if (selected.kind === "fixed") {
        // ✅ FixedExpense は done: string にする
        const next: FixedExpense = {
          ...selected.item,
          day: Number(day),
          detail,
          amount: amountNumber,
          category,
          payment,
          done: doneString,
        };

        if (!store.updateFixedExpense) throw new Error("updateFixedExpense が store にありません");
        await Promise.resolve(store.updateFixedExpense(next));
      } else {
        // ✅ LivingExpense は memo が必須なので必ず維持する
        const next: LivingExpense = {
          ...selected.item,
          day: Number(day),
          detail,
          amount: amountNumber,
          category,
          payment,
          done: doneString,
          memo: selected.item.memo ?? "", // 念のため（型上は必須だけど安全に）
        };

        if (!store.updateLivingExpense) throw new Error("updateLivingExpense が store にありません");
        await Promise.resolve(store.updateLivingExpense(next));
      }

      onClose();
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (busy) return;
    setDeleting(true);

    try {
      if (selected.kind === "fixed") {
        if (!store.deleteFixedExpense) throw new Error("deleteFixedExpense が store にありません");
        await Promise.resolve(store.deleteFixedExpense(selected.item.id));
      } else {
        if (!store.deleteLivingExpense) throw new Error("deleteLivingExpense が store にありません");
        await Promise.resolve(store.deleteLivingExpense(selected.item.id));
      }

      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={overlay} onClick={close}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={goldLineModal} />

        <div style={headerRow}>
          <div style={titleRowModal}>
            <span style={titleDotModal} />
            <div style={titleModal}>
              {selected.kind === "fixed" ? "サブスクの詳細" : "毎月・生活費の詳細"}
            </div>
          </div>

          <button style={{ ...xBtn, ...(busy ? btnDisabled : {}) }} onClick={close} disabled={busy}>
            ✕
          </button>
        </div>

        <div style={{ marginTop: 14 }}>
          <SubscriptionForm
            day={day}
            setDay={setDay}
            detail={detail}
            setDetail={setDetail}
            amount={amount}
            setAmount={setAmount}
            showAmount={selected.kind === "fixed"} 
            category={category}
            setCategory={setCategory}
            payment={payment}
            setPayment={setPayment}
            done={done}
            setdone={setdone}
            onSubmit={onSubmit}
            saving={saving}
            onClose={close}
          />
        </div>

        <div style={dangerRow}>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            style={{ ...deleteBtn, ...(busy ? btnDisabled : {}) }}
          >
            {deleting ? "削除中..." : "削除"}
          </button>
        </div>
      </div>
    </div>
  );
}
