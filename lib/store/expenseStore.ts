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
    category: string;
};

export type FixedExpense = {
    id: string;
    day: number;
    detail: string;
    amount: number;
    category: string;
    payment: string;
    done: string;
};

export type LivingExpense = {
    id: string;
    detail: string;
    day: number;
    amount: number;
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

type AddExpenseInput = Omit<Expense, "id">;
type AddIncomeInput = Omit<Income, "id">;

type AddSubscriptionInput = {
    day: number;
    detail: string;
    amount: number;
    category: string;
    payment: string;
    done: boolean;
    memo: string;
};

type State = {
    expenses: Expense[];
    selectedExpense: Expense | null;

    selectExpense: (e: Expense | null) => void;
    deleteExpense: (id: string) => Promise<void>;
    updateExpense: (e: Expense) => Promise<void>;

    addExpense: (input: AddExpenseInput) => Promise<void>;
    addIncome: (input: AddIncomeInput) => Promise<void>;
    addSubscription: (input: AddSubscriptionInput) => Promise<void>;

    updateFixedExpense: (e: FixedExpense) => Promise<void>;
    deleteFixedExpense: (id: string) => Promise<void>;
    updateLivingExpense: (e: LivingExpense) => Promise<void>;
    deleteLivingExpense: (id: string) => Promise<void>;

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

    addExpense: async (input) => {
        const makeTmpId = (): string => {
            const hasCrypto =
                typeof crypto !== "undefined" &&
                typeof (crypto as unknown as { randomUUID?: () => string }).randomUUID === "function";
            return hasCrypto
                ? `tmp_${(crypto as unknown as { randomUUID: () => string }).randomUUID()}`
                : `tmp_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        };

        const normalized: AddExpenseInput = { ...input, date: normalizeSlashDate(input.date) };
        const optimistic: Expense = { id: makeTmpId(), ...normalized };

        // ✅ 1) 先にUIへ反映
        set((state) => {
            const nextExpenses = [optimistic, ...state.expenses];
            const next = { ...state, expenses: nextExpenses };
            writeCache(next);
            return { expenses: nextExpenses };
        });

        try {
            // ✅ 2) 永続化
            const res = await fetch("/api/add-expense", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(normalized),
            });

            const payload: unknown = await res.json();
            if (!res.ok || !isRecord(payload) || payload.ok !== true) {
                throw new Error("add-expense failed");
            }

            // ✅ 3) ID差し替え（取れなければforce再取得で整合）
            const newId = extractId(payload);
            if (newId) {
                set((state) => {
                    const nextExpenses = state.expenses.map((e) =>
                        e.id === optimistic.id ? { ...e, id: newId } : e
                    );
                    const next = { ...state, expenses: nextExpenses };
                    writeCache(next);
                    return { expenses: nextExpenses };
                });
            } else {
                void get().loadExpenses({ force: true });
            }
        } catch (e) {
            // ❌ 失敗ならロールバック
            set((state) => {
                const nextExpenses = state.expenses.filter((x) => x.id !== optimistic.id);
                const next = { ...state, expenses: nextExpenses };
                writeCache(next);
                return { expenses: nextExpenses };
            });
            throw e;
        }
    },

    addIncome: async (input) => {
        const makeTmpId = (): string => `tmp_${Date.now()}_${Math.random().toString(16).slice(2)}`;

        const normalized: AddIncomeInput = { ...input, date: normalizeSlashDate(input.date) };
        const optimistic: Income = { id: makeTmpId(), ...normalized };

        // ✅ 1) 先にUIへ反映
        set((state) => {
            const nextIncomes = [optimistic, ...state.incomes];
            const next = { ...state, incomes: nextIncomes };
            writeCache(next);
            return { incomes: nextIncomes };
        });

        try {
            const res = await fetch("/api/add-income", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(normalized),
            });

            const payload: unknown = await res.json();
            if (!res.ok || !isRecord(payload) || payload.ok !== true) {
                throw new Error("add-income failed");
            }

            const newId = extractId(payload);
            if (newId) {
                set((state) => {
                    const nextIncomes = state.incomes.map((x) =>
                        x.id === optimistic.id ? { ...x, id: newId } : x
                    );
                    const next = { ...state, incomes: nextIncomes };
                    writeCache(next);
                    return { incomes: nextIncomes };
                });
            } else {
                void get().loadExpenses({ force: true });
            }
        } catch (e) {
            set((state) => {
                const nextIncomes = state.incomes.filter((x) => x.id !== optimistic.id);
                const next = { ...state, incomes: nextIncomes };
                writeCache(next);
                return { incomes: nextIncomes };
            });
            throw e;
        }
    },

    addSubscription: async (input) => {
        const makeTmpId = (): string => `tmp_${Date.now()}_${Math.random().toString(16).slice(2)}`;

        // ✅ done(boolean) → done(string) に変換
        const monthDone = input.done ? `${new Date().getMonth() + 1}月済` : "";

        // ✅ FixedExpense に合わせる
        const optimistic: FixedExpense = {
            id: makeTmpId(),
            day: input.day,
            detail: input.detail,
            amount: input.amount,
            category: input.category,
            payment: input.payment,
            done: monthDone,
        };

        // ✅ 1) 先に fixedExpenses へ反映
        set((state) => {
            const nextFixed = [optimistic, ...state.fixedExpenses];
            const next = { ...state, fixedExpenses: nextFixed };
            writeCache(next);
            return { fixedExpenses: nextFixed };
        });

        try {
            // ✅ 2) 永続化
            const res = await fetch("/api/add-subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });

            const payload: unknown = await res.json();
            if (!res.ok || !isRecord(payload) || payload.ok !== true) {
                throw new Error("add-subscription failed");
            }

            // ✅ 3) ID差し替え（fixedExpenses を対象にする）
            const newId = extractId(payload);
            if (newId) {
                set((state) => {
                    const nextFixed = state.fixedExpenses.map((x) =>
                        x.id === optimistic.id ? { ...x, id: newId } : x
                    );
                    const next = { ...state, fixedExpenses: nextFixed };
                    writeCache(next);
                    return { fixedExpenses: nextFixed };
                });
            } else {
                void get().loadExpenses({ force: true });
            }
        } catch (e) {
            // ❌ 失敗なら fixedExpenses をロールバック
            set((state) => {
                const nextFixed = state.fixedExpenses.filter((x) => x.id !== optimistic.id);
                const next = { ...state, fixedExpenses: nextFixed };
                writeCache(next);
                return { fixedExpenses: nextFixed };
            });
            throw e;
        }
    },


    updateFixedExpense: async (fixed) => {
        // done は string 型（"2月済" など）なのでそのまま送る
        await fetch("/api/update-fixed-expense", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fixed),
        });

        set((state) => {
            const nextFixed = state.fixedExpenses.map((x) => (x.id === fixed.id ? fixed : x));
            const next = { ...state, fixedExpenses: nextFixed };
            writeCache(next);
            return { fixedExpenses: nextFixed };
        });
    },

    deleteFixedExpense: async (id) => {
        await fetch("/api/delete-expense", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recordId: id }),
        });

        set((state) => {
            const nextFixed = state.fixedExpenses.filter((x) => x.id !== id);
            const next = { ...state, fixedExpenses: nextFixed };
            writeCache(next);
            return { fixedExpenses: nextFixed };
        });
    },

    updateLivingExpense: async (living) => {
        await fetch("/api/update-living-expense", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(living),
        });

        set((state) => {
            const nextLiving = state.livingExpenses.map((x) => (x.id === living.id ? living : x));
            const next = { ...state, livingExpenses: nextLiving };
            writeCache(next);
            return { livingExpenses: nextLiving };
        });
    },

    deleteLivingExpense: async (id) => {
        await fetch("/api/delete-expense", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recordId: id }),
        });

        set((state) => {
            const nextLiving = state.livingExpenses.filter((x) => x.id !== id);
            const next = { ...state, livingExpenses: nextLiving };
            writeCache(next);
            return { livingExpenses: nextLiving };
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

function isRecord(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null;
}
function getString(o: Record<string, unknown>, k: string): string | null {
    const v = o[k];
    return typeof v === "string" ? v : null;
}
function getObj(o: Record<string, unknown>, k: string): Record<string, unknown> | null {
    const v = o[k];
    return isRecord(v) ? v : null;
}
function extractId(payload: unknown): string | null {
    if (!isRecord(payload)) return null;

    // 直下
    const direct = getString(payload, "recordId") ?? getString(payload, "id");
    if (direct) return direct;

    // expense / income / livingExpense など
    const exp = getObj(payload, "expense");
    if (exp) return getString(exp, "id") ?? getString(exp, "recordId");

    const inc = getObj(payload, "income");
    if (inc) return getString(inc, "id") ?? getString(inc, "recordId");

    const liv = getObj(payload, "livingExpense");
    if (liv) return getString(liv, "id") ?? getString(liv, "recordId");

    // data 配下
    const data = getObj(payload, "data");
    if (data) return getString(data, "recordId") ?? getString(data, "id");

    return null;
}

// "yyyy-MM-dd" -> "yyyy/MM/dd" に統一（Listの startsWith 対策）
export function normalizeSlashDate(date: string): string {
    if (!date) return "";

    // "2026-02-17T..." みたいなのが来ても先頭10文字だけ使う
    const head = date.includes("T") ? date.slice(0, 10) : date;

    const m = head.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/);
    if (!m) return date;

    const y = m[1];
    const mm = m[2].padStart(2, "0");
    const dd = m[3].padStart(2, "0");
    return `${y}/${mm}/${dd}`;
}
