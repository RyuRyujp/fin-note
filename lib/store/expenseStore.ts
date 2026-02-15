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
    loadExpenses: () => Promise<void>;
}

export const useExpenseStore = create<State>((set) => ({
    expenses: [],
    incomes: [],
    fixedExpenses: [],
    livingExpenses: [],
    loading: false,
    selectedExpense: null,

    selectExpense: (e) => set({ selectedExpense: e }),

    deleteExpense: async (id) => {
        await fetch(`/api/delete-expense`, { method: "DELETE" });

        set((state) => ({
            expenses: state.expenses.filter((e) => e.id !== id),
            selectedExpense: null,
        }));
    },

    updateExpense: async (expense) => {
        await fetch("/api/update-expense", {
            method: "POST",
            body: JSON.stringify(expense),
        });

        set((state) => ({
            expenses: state.expenses.map((e) =>
                e.id === expense.id ? expense : e
            ),
            selectedExpense: null,
        }));
    },


    loadExpenses: async () => {
        set({ loading: true });

        const res = await fetch("/api/get-expense", { cache: "no-store" });
        const json = await res.json();

        set({
            expenses: json.data.expenses ?? [],
            incomes: json.data.incomes ?? [],
            fixedExpenses: json.data.fixedExpenses ?? [],
            livingExpenses: json.data.livingExpenses ?? [],
            loading: false,
        });
    },
}));
