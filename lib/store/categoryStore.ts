import { create } from "zustand";

export type Category = {
  categoryId: string;
  name: string;
  color: string; // "#RRGGBB"
  icon: string;  // 文字列（後でLucide対応などに）
};

export const CATEGORIES = [
  { categoryId: "Utensils", name: "食費", color: "#FFB703", icon: "utensils" },
  { categoryId: "ShoppingBag", name: "生活費", color: "#8ECAE6", icon: "home" },
  { categoryId: "Bus", name: "交通費", color: "#219EBC", icon: "train" },
  { categoryId: "Gift", name: "雑貨", color: "#21bc29", icon: "gift" },
  { categoryId: "daily", name: "日用品", color: "#ADB5BD", icon: "shopping-bag" },
  { categoryId: "CircleDollarSign", name: "サブスク", color: "#DDA15E", icon: "repeat" },
  { categoryId: "fun", name: "娯楽・趣味", color: "#FB8500", icon: "gamepad-2" },
  { categoryId: "other", name: "未分類", color: "#6C757D", icon: "circle-help" },
] satisfies readonly Category[];

const LS_KEY = "moneynote:categories:v1";

function safeParseCategories(raw: string | null): Category[] | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return null;

    const ok = data.every((x) => {
      const o = x as Partial<Category>;
      return (
        typeof o.categoryId === "string" &&
        typeof o.name === "string" &&
        typeof o.color === "string" &&
        typeof o.icon === "string"
      );
    });
    return ok ? (data as Category[]) : null;
  } catch {
    return null;
  }
}

function readLocal(): Category[] | null {
  if (typeof window === "undefined") return null;
  return safeParseCategories(localStorage.getItem(LS_KEY));
}

function writeLocal(categories: Category[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(categories));
  } catch {
    // ignore
  }
}

function makeId(): string {
  // GASに移行しても衝突しにくい id 生成
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 8);
  return `cat_${t}_${r}`;
}

type CategoryState = {
  categories: Category[];
  initialized: boolean;

  init: () => void;

  addCategory: (input: Omit<Category, "categoryId">) => void;
  updateCategory: (categoryId: string, patch: Partial<Omit<Category, "categoryId">>) => void;
  deleteCategory: (categoryId: string) => void;

  moveCategory: (categoryId: string, dir: "up" | "down") => void;

  resetToMaster: () => void;
};

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [...CATEGORIES],
  initialized: false,

  init: () => {
    if (get().initialized) return;
    const saved = readLocal();
    set({ categories: saved ?? [...CATEGORIES], initialized: true });
  },

  addCategory: (input) => {
    const next: Category = { categoryId: makeId(), ...input };
    set((s) => {
      const categories = [next, ...s.categories];
      writeLocal(categories);
      return { categories };
    });
  },

  updateCategory: (categoryId, patch) => {
    set((s) => {
      const categories = s.categories.map((c) =>
        c.categoryId === categoryId ? { ...c, ...patch } : c
      );
      writeLocal(categories);
      return { categories };
    });
  },

  deleteCategory: (categoryId) => {
    set((s) => {
      const categories = s.categories.filter((c) => c.categoryId !== categoryId);
      writeLocal(categories);
      return { categories };
    });
  },

  moveCategory: (categoryId, dir) => {
    set((s) => {
      const idx = s.categories.findIndex((c) => c.categoryId === categoryId);
      if (idx < 0) return s;

      const nextIdx = dir === "up" ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= s.categories.length) return s;

      const categories = [...s.categories];
      const tmp = categories[idx];
      categories[idx] = categories[nextIdx];
      categories[nextIdx] = tmp;

      writeLocal(categories);
      return { categories };
    });
  },

  resetToMaster: () => {
    const categories = [...CATEGORIES];
    writeLocal(categories);
    set({ categories });
  },
}));
