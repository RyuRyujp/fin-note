import { create } from "zustand";

export type Expense = {
  id: string;
  date: string;
  detail: string;
  amount: number;
  category: string;
  memo: string;
  payment: string;
};

export type Income = {
  id: string;
  date: string;
  detail: string;
  amount: number;
};

export type FixedExpense = {
  id: string;
  detail: string;
  amount: number;
  day: number;
  category: string;
};

export type LivingExpense = {
  id: string;
  detail: string;
  amount: number;
  day: number;
  category: string;
  payment: string;
  done: string;
  memo: string;
};

type LoadOptions = {
  /** trueなら必ずfetch */
  force?: boolean;
  /** キャッシュ有効期間(ms) */
  maxAgeMs?: number;
  /** TTL切れ時に「キャッシュ表示→裏で更新」する */
  revalidate?: boolean;
};

type State = {
  expenses: Expense[];
  selectedExpense: Expense | null;

  selectExpense: (e: Expense | null) => void;
  deleteExpense: (id: string) => Promise<void>;
  updateExpense: (e: Expense) => Promise<void>;

  incomes: Income[];
  fixedExpenses: FixedExpense[];
  livingExpenses: LivingExpense[];

  loading: boolean;
  loadExpenses: (opts?: LoadOptions) => Promise<void>;
};

/* ===============================
   Cache (localStorage)
================================ */
type CachePayload = {
  v: number;
  savedAt: number;
  expenses: Expense[];
  incomes: Income[];
  fixedExpenses: FixedExpense[];
  livingExpenses: LivingExpense[];
};

const CACHE_KEY = "moneynote:expenseStore:v1";
const CACHE_VERSION = 1;
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5分（好みで調整）

function readCache(): CachePayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as CachePayload;

    if (!data || data.v !== CACHE_VERSION) return null;
    if (!Array.isArray(data.expenses)) return null;
    if (!Array.isArray(data.incomes)) return null;
    if (!Array.isArray(data.fixedExpenses)) return null;
    if (!Array.isArray(data.livingExpenses)) return null;

    return data;
  } catch {
    return null;
  }
}

function writeCache(s: Pick<State, "expenses" | "incomes" | "fixedExpenses" | "livingExpenses">) {
  if (typeof window === "undefined") return;
  try {
    const payload: CachePayload = {
      v: CACHE_VERSION,
      savedAt: Date.now(),
      expenses: s.expenses,
      incomes: s.incomes,
      fixedExpenses: s.fixedExpenses,
      livingExpenses: s.livingExpenses,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // 容量不足などは無視（アプリは動かす）
  }
}

let inFlight: Promise<void> | null = null;

export const useExpenseStore = create<State>((set, get) => ({
  expenses: [],
  incomes: [],
  fixedExpenses: [],
  livingExpenses: [],
  loading: false,
  selectedExpense: null,

  selectExpense: (e) => set({ selectedExpense: e }),

  deleteExpense: async (id) => {
    await fetch("/api/delete-expense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recordId: id }),
    });

    set((state) => {
      const nextExpenses = state.expenses.filter((e) => e.id !== id);
      const next = { ...state, expenses: nextExpenses, selectedExpense: null };
      writeCache(next);
      return { expenses: nextExpenses, selectedExpense: null };
    });
  },

  updateExpense: async (expense) => {
    await fetch("/api/update-expense", {
      method: "POST",
      body: JSON.stringify(expense),
    });

    set((state) => {
      const nextExpenses = state.expenses.map((e) => (e.id === expense.id ? expense : e));
      const next = { ...state, expenses: nextExpenses, selectedExpense: null };
      writeCache(next);
      return { expenses: nextExpenses, selectedExpense: null };
    });
  },

  loadExpenses: async (opts) => {
    const force = opts?.force ?? false;
    const maxAgeMs = opts?.maxAgeMs ?? DEFAULT_TTL_MS;
    const revalidate = opts?.revalidate ?? true;

    // 連打対策：同じfetchを共有
    if (!force && inFlight) return inFlight;

    const cached = !force ? readCache() : null;

    if (cached) {
      // まずキャッシュを即反映
      set({
        expenses: cached.expenses ?? [],
        incomes: cached.incomes ?? [],
        fixedExpenses: cached.fixedExpenses ?? [],
        livingExpenses: cached.livingExpenses ?? [],
      });

      const age = Date.now() - cached.savedAt;
      const fresh = age <= maxAgeMs;

      // TTL内ならfetchしない（ロード頻度を下げる）
      if (fresh) return;

      // TTL切れでも「裏で更新しない」なら終了
      if (!revalidate) return;
    }

    const doFetch = async () => {
      // キャッシュが無い場合だけ loading=true（画面を真っ白スピナーにしないため）
      const hasAny =
        get().expenses.length > 0 ||
        get().incomes.length > 0 ||
        get().fixedExpenses.length > 0 ||
        get().livingExpenses.length > 0;

      if (!hasAny) set({ loading: true });

      try {
        const res = await fetch("/api/get-expense", { cache: "no-store" });
        const json = await res.json();

        set({
          expenses: json.data.expenses ?? [],
          incomes: json.data.incomes ?? [],
          fixedExpenses: json.data.fixedExpenses ?? [],
          livingExpenses: json.data.livingExpenses ?? [],
        });

        // 取得結果をキャッシュ保存
        const snapshot = get();
        writeCache(snapshot);
      } finally {
        set({ loading: false });
      }
    };

    inFlight = doFetch().finally(() => {
      inFlight = null;
    });

    return inFlight;
  },
}));
