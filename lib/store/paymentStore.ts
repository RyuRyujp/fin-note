import { create } from "zustand";

export type Payment = {
  paymentId: string;
  name: string;
};

export const MASTER_PAYMENTS = [
  { paymentId: "ufj", name: "クレジット：三菱UFJ" },
  { paymentId: "rakuten", name: "クレジット：楽天" },
  { paymentId: "epos", name: "クレジット：EPOS" },
  { paymentId: "smbc", name: "クレジット：三井住友" },
  { paymentId: "paypay", name: "PayPay" },
  { paymentId: "cash", name: "現金" },
  { paymentId: "other", name: "その他" },
] satisfies readonly Payment[];

const LS_KEY = "moneynote:payments:v1";

function safeParsePayments(raw: string | null): Payment[] | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return null;

    const ok = data.every((x) => {
      const o = x as Partial<Payment>;
      return typeof o.paymentId === "string" && typeof o.name === "string";
    });
    return ok ? (data as Payment[]) : null;
  } catch {
    return null;
  }
}

function readLocal(): Payment[] | null {
  if (typeof window === "undefined") return null;
  return safeParsePayments(localStorage.getItem(LS_KEY));
}

function writeLocal(payments: Payment[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(payments));
  } catch {
    // ignore
  }
}

function makeId(): string {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 8);
  return `pay_${t}_${r}`;
}

type PaymentState = {
  payments: Payment[];
  initialized: boolean;

  init: () => void;

  addPayment: (name: string) => void;
  updatePayment: (paymentId: string, name: string) => void;
  deletePayment: (paymentId: string) => void;

  movePayment: (paymentId: string, dir: "up" | "down") => void;

  resetToMaster: () => void;
};

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: [...MASTER_PAYMENTS],
  initialized: false,

  init: () => {
    if (get().initialized) return;
    const saved = readLocal();
    set({ payments: saved ?? [...MASTER_PAYMENTS], initialized: true });
  },

  addPayment: (name) => {
    const n = name.trim();
    if (!n) return;

    const next: Payment = { paymentId: makeId(), name: n };
    set((s) => {
      const payments = [next, ...s.payments];
      writeLocal(payments);
      return { payments };
    });
  },

  updatePayment: (paymentId, name) => {
    const n = name.trim();
    if (!n) return;

    set((s) => {
      const payments = s.payments.map((p) => (p.paymentId === paymentId ? { ...p, name: n } : p));
      writeLocal(payments);
      return { payments };
    });
  },

  deletePayment: (paymentId) => {
    set((s) => {
      const payments = s.payments.filter((p) => p.paymentId !== paymentId);
      writeLocal(payments);
      return { payments };
    });
  },

  movePayment: (paymentId, dir) => {
    set((s) => {
      const idx = s.payments.findIndex((p) => p.paymentId === paymentId);
      if (idx < 0) return s;

      const nextIdx = dir === "up" ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= s.payments.length) return s;

      const payments = [...s.payments];
      const tmp = payments[idx];
      payments[idx] = payments[nextIdx];
      payments[nextIdx] = tmp;

      writeLocal(payments);
      return { payments };
    });
  },

  resetToMaster: () => {
    const payments = [...MASTER_PAYMENTS];
    writeLocal(payments);
    set({ payments });
  },
}));
