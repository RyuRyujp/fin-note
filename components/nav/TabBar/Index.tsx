"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, Repeat, Wallet, Plus, type LucideIcon } from "lucide-react";

import BottomSheet from "@/components/ui/BottomSheet";
import { theme } from "@/lib/theme";
import { useExpenseStore } from "@/lib/store/expenseStore";

import {
  ExpenseForm,
  IncomeForm,
  FixedExpenseForm,
  LivingExpenseForm,
} from "./SheetForms";
import { fabStyle, navStyle, tabStyle } from "./styles";

/* ===============================
   型
================================ */
type Tab = {
  href: string;
  label: string;
  Icon: LucideIcon;
};

export type SheetMode = "expense" | "fixedExpense" | "livingExpense" | "income";

type Props = {
  /**
   * ここを渡すと、pathname判定より優先されます。
   * 例）/subscription 内で「固定費/生活費」タブを切り替えているなら、
   * TabBar sheetMode を親（subscription page）から渡すのが一番安全です。
   */
  sheetMode?: SheetMode;
};

/* ===== タブ4つ ===== */
const leftTabs: Tab[] = [
  { href: "/dashboard", label: "ホーム", Icon: Home },
  { href: "/list", label: "一覧", Icon: List },
];

const rightTabs: Tab[] = [
  { href: "/subscription", label: "サブスク", Icon: Repeat },
  { href: "/income", label: "収入", Icon: Wallet },
];

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* ===============================
   store actions（any禁止に寄せて型を明示）
================================ */
type AddExpenseInput = {
  date: string;
  detail: string;
  amount: number;
  category: string;
  payment: string;
  memo: string;
};

type AddIncomeInput = {
  date: string;
  detail: string;
  amount: number;
  category: string;
};

type AddFixedExpenseInput = {
  day: number;
  detail: string;
  amount: number;
  category: string;
  payment: string;
  done: boolean;
  memo: string;
};

type AddLivingExpenseInput = {
  day: number;
  detail: string;
  amount: number;
  category: string;
  payment: string;
  done: boolean;
  memo: string;
};

type ExpenseStoreActions = {
  addExpense: (input: AddExpenseInput) => Promise<void>;
  addIncome: (input: AddIncomeInput) => Promise<void>;

  // 固定費：理想は addFixedExpense。既存が addSubscription なら後方互換で拾う
  addFixedExpense?: (input: AddFixedExpenseInput) => Promise<void>;
  addSubscription?: (input: AddFixedExpenseInput) => Promise<void>;

  // 生活費（不規則費用）：今回追加で想定
  addLivingExpense?: (input: AddLivingExpenseInput) => Promise<void>;
};

/* ===============================
   TabBar
================================ */
export default function TabBar({ sheetMode }: Props) {
  const pathname = usePathname();

  // ===== pathname からのデフォルト判定 =====
  const derivedMode: SheetMode = useMemo(() => {
    if (pathname === "/income" || pathname.startsWith("/income/")) return "income";
    if (pathname === "/subscription" || pathname.startsWith("/subscription/"))
      return "fixedExpense";
    return "expense";
  }, [pathname]);

  // ===== 最終モード（props優先）=====
  const mode: SheetMode = sheetMode ?? derivedMode;

  /* ===== Sheet状態 ===== */
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const actions = useExpenseStore() as unknown as ExpenseStoreActions;

  const addFixedExpense = actions.addFixedExpense ?? actions.addSubscription; // 後方互換
  const addLivingExpense = actions.addLivingExpense;

  /* ===============================
     支出（expense）
  ================================ */
  const [exDate, setExDate] = useState<string>(() => ymd(new Date()));
  const [exDetail, setExDetail] = useState("");
  const [exAmount, setExAmount] = useState("");
  const [exCategory, setExCategory] = useState("食費");
  const [exPayment, setExPayment] = useState("クレジット：三菱UFJ");
  const [exMemo, setExMemo] = useState("");

  /* ===============================
     固定費（fixedExpense）
  ================================ */
  const [fxDay, setFxDay] = useState(String(new Date().getDate()));
  const [fxDetail, setFxDetail] = useState("");
  const [fxAmount, setFxAmount] = useState("");
  const [fxCategory, setFxCategory] = useState("サブスク");
  const [fxPayment, setFxPayment] = useState("クレジット：三菱UFJ");
  const [fxDone, setFxDone] = useState(false);
  const [fxMemo, setFxMemo] = useState("");

  /* ===============================
     生活費（livingExpense）
  ================================ */
  const [lvDay, setLvDay] = useState(String(new Date().getDate())); // 1〜31
  const [lvDetail, setLvDetail] = useState("");
  const [lvAmount, setLvAmount] = useState("");
  const [lvCategory, setLvCategory] = useState("生活費");
  const [lvPayment, setLvPayment] = useState("クレジット：三菱UFJ");
  const [lvDone, setLvDone] = useState(false);
  const [lvMemo, setLvMemo] = useState("");

  /* ===============================
     収入（income）
  ================================ */
  const [inDate, setInDate] = useState<string>(() => ymd(new Date()));
  const [inDetail, setInDetail] = useState("");
  const [inAmount, setInAmount] = useState("");
  const [inCategory, setInCategory] = useState("給与");

  function openSheet() {
    // 開くたびに「今日」へ寄せたい場合
    if (mode === "expense") setExDate(ymd(new Date()));
    if (mode === "income") setInDate(ymd(new Date()));
    if (mode === "fixedExpense") setFxDay(String(new Date().getDate()));
    if (mode === "livingExpense") setLvDay(String(new Date().getDate()));

    setOpen(true);
  }

  function closeSheet() {
    setOpen(false);
  }

  function resetAfterSave() {
    if (mode === "expense") {
      setExDetail("");
      setExAmount("");
      setExCategory("食費");
      setExPayment("クレジット：三菱UFJ");
      setExMemo("");
    } else if (mode === "fixedExpense") {
      setFxDetail("");
      setFxAmount("");
      setFxCategory("サブスク");
      setFxPayment("クレジット：三菱UFJ");
      setFxDone(false);
      setFxMemo("");
    } else if (mode === "livingExpense") {
      setLvDetail("");
      setLvAmount("");
      setLvCategory("生活費");
      setLvPayment("クレジット：三菱UFJ");
      setLvDone(false);
      setLvMemo("");
    } else {
      setInDetail("");
      setInAmount("");
      setInCategory("給与");
    }
  }

  function dispatchUpdatedEvent() {
    const ev =
      mode === "expense"
        ? "expense-updated"
        : mode === "fixedExpense"
          ? "fixedExpense-updated"
          : mode === "livingExpense"
            ? "livingExpense-updated"
            : "income-updated";
    window.dispatchEvent(new Event(ev));
  }

  /* ===== 保存処理（モードで分岐）===== */
  async function submit() {
    if (saving) return;

    closeSheet();
    setSaving(true);

    try {
      if (mode === "expense") {
        if (!exDetail || !exAmount) return;

        await actions.addExpense({
          date: exDate,
          detail: exDetail,
          amount: Number(exAmount),
          category: exCategory,
          payment: exPayment,
          memo: exMemo,
        });
      }

      if (mode === "fixedExpense") {
        if (!fxDetail || !fxAmount || !fxDay) return;
        if (!addFixedExpense)
          throw new Error("addFixedExpense（または addSubscription）が未実装です。");

        await addFixedExpense({
          day: Number(fxDay),
          detail: fxDetail,
          amount: Number(fxAmount),
          category: fxCategory,
          payment: fxPayment,
          done: fxDone,
          memo: fxMemo,
        });
      }

      if (mode === "livingExpense") {
        if (!lvDetail || !lvAmount || !lvDay) return;
        if (!addLivingExpense) throw new Error("addLivingExpense が未実装です。");

        await addLivingExpense({
          day: Number(lvDay),
          detail: lvDetail,
          amount: Number(lvAmount),
          category: lvCategory,
          payment: lvPayment,
          done: lvDone,
          memo: lvMemo,
        });
      }

      if (mode === "income") {
        if (!inDetail || !inAmount) return;

        await actions.addIncome({
          date: inDate,
          detail: inDetail,
          amount: Number(inAmount),
          category: inCategory,
        });
      }

      resetAfterSave();
      dispatchUpdatedEvent();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  const sheetTitle =
    mode === "fixedExpense"
      ? "サブスクを追加"
      : mode === "livingExpense"
        ? "生活費を追加"
        : mode === "income"
          ? "収入を追加"
          : "支出を追加";

  // ✅ 非アクティブでも見える色（透明すぎない）
  const inactiveColor = theme.text ?? "rgba(255,255,255,0.86)";
  const inactiveSub = theme.subtext;

  function tabMergedStyle(active: boolean): React.CSSProperties {
    return {
      ...tabStyle(active),
      position: "relative",
      // tabStyle 側で color が薄くされていても、ここで上書きして見えるようにする
      color: active ? theme.primary : inactiveColor,
      fontWeight: active ? 800 : 650,
      transform: active ? "translateY(-2px)" : "translateY(0px)",
      paddingBottom: 10, // ✅ 下線とラベルが被らないように余白確保
      transition:
        "transform .18s ease, color .18s ease, font-weight .18s ease, padding .18s ease",
    };
  }

  function iconStyle(active: boolean): React.CSSProperties {
    return {
      filter: active ? `drop-shadow(0 2px 10px ${theme.primary}55)` : "none",
      opacity: active ? 1 : 0.92,
      transition: "filter .18s ease, opacity .18s ease",
    };
  }

  function labelStyle(active: boolean): React.CSSProperties {
    return {
      fontSize: 12,
      lineHeight: "12px",
      marginTop: 6,
      color: active ? theme.primary : inactiveSub,
      letterSpacing: active ? 0.2 : 0,
      transition: "color .18s ease, letter-spacing .18s ease",
      paddingBottom: 2,
    };
  }

  return (
    <>
      {/* ================= FAB ================= */}
      <button onClick={openSheet} style={fabStyle}>
        <Plus size={28} strokeWidth={2.8} />
      </button>

      {/* ================= TabBar ================= */}
      <nav style={navStyle}>
        {leftTabs.map((t) => {
          const active = pathname === t.href || pathname.startsWith(t.href + "/");
          const Icon = t.Icon;
          return (
            <Link key={t.href} href={t.href} style={tabMergedStyle(active)}>
              {active && (
                <>
                  <ActivePill />
                  <ActiveUnderline />
                </>
              )}

              <Icon
                size={20}
                strokeWidth={active ? 2.8 : 2.2}
                style={iconStyle(active)}
              />
              <span style={labelStyle(active)}>{t.label}</span>
            </Link>
          );
        })}

        <div />

        {rightTabs.map((t) => {
          const active = pathname === t.href || pathname.startsWith(t.href + "/");
          const Icon = t.Icon;
          return (
            <Link key={t.href} href={t.href} style={tabMergedStyle(active)}>
              {active && (
                <>
                  <ActivePill />
                  <ActiveUnderline />
                </>
              )}

              <Icon
                size={20}
                strokeWidth={active ? 2.8 : 2.2}
                style={iconStyle(active)}
              />
              <span style={labelStyle(active)}>{t.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ================= BottomSheet ================= */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          transform: open ? "translateY(0%)" : "translateY(100%)",
          transition: "transform 0.32s cubic-bezier(.22,.9,.32,1)",
          zIndex: 1001,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <BottomSheet open={open} title={sheetTitle} onClose={closeSheet}>
          {mode === "fixedExpense" ? (
            <FixedExpenseForm
              day={fxDay}
              setDay={setFxDay}
              detail={fxDetail}
              setDetail={setFxDetail}
              amount={fxAmount}
              setAmount={setFxAmount}
              category={fxCategory}
              setCategory={setFxCategory}
              payment={fxPayment}
              setPayment={setFxPayment}
              done={fxDone}
              setDone={setFxDone}
              memo={fxMemo}
              setMemo={setFxMemo}
              onSubmit={submit}
              saving={saving}
              onClose={closeSheet}
            />
          ) : mode === "livingExpense" ? (
            <LivingExpenseForm
              day={lvDay}
              setDay={setLvDay}
              detail={lvDetail}
              setDetail={setLvDetail}
              amount={lvAmount}
              setAmount={setLvAmount}
              category={lvCategory}
              setCategory={setLvCategory}
              payment={lvPayment}
              setPayment={setLvPayment}
              done={lvDone}
              setDone={setLvDone}
              memo={lvMemo}
              setMemo={setLvMemo}
              onSubmit={submit}
              saving={saving}
              onClose={closeSheet}
            />
          ) : mode === "income" ? (
            <IncomeForm
              date={inDate}
              setDate={setInDate}
              detail={inDetail}
              setDetail={setInDetail}
              amount={inAmount}
              setAmount={setInAmount}
              category={inCategory}
              setCategory={setInCategory}
              onSubmit={submit}
              saving={saving}
              onClose={closeSheet}
            />
          ) : (
            <ExpenseForm
              date={exDate}
              setDate={setExDate}
              detail={exDetail}
              setDetail={setExDetail}
              amount={exAmount}
              setAmount={setExAmount}
              category={exCategory}
              setCategory={setExCategory}
              payment={exPayment}
              setPayment={setExPayment}
              memo={exMemo}
              setMemo={setExMemo}
              onSubmit={submit}
              saving={saving}
              onClose={closeSheet}
            />
          )}
        </BottomSheet>
      </div>
    </>
  );
}

/* ===============================
   Active indicators
================================ */
function ActivePill() {
  return (
    <div
      style={{
        position: "absolute",
        top: 4,
        left: "50%",
        transform: "translateX(-50%)",
        width: 48,
        height: 26,
        borderRadius: 999,
        background: `${theme.primary}2A`, // 濃度UP
        boxShadow: `0 10px 28px ${theme.primary}2A, 0 0 0 1px ${theme.primary}33 inset`,
        zIndex: -1,
      }}
    />
  );
}

function ActiveUnderline() {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 4, 
        transform: "translateX(-50%)",
        width: 22,
        height: 3,
        borderRadius: 999,
        background: theme.primary,
        boxShadow: `0 6px 16px ${theme.primary}55`,
        pointerEvents: "none",
      }}
    />
  );
}
