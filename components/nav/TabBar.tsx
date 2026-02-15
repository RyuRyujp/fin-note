"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { theme } from "@/lib/theme";
import { Home, List, Repeat, Wallet, Plus, LucideIcon } from "lucide-react";

import BottomSheet from "@/components/ui/BottomSheet";

/* ===============================
   型
================================ */
type Tab = {
  href: string;
  label: string;
  Icon: LucideIcon;
};

type SheetMode = "expense" | "subscription" | "income";

/* ===== タブ4つ ===== */
const leftTabs: Tab[] = [
  { href: "/dashboard", label: "ホーム", Icon: Home },
  { href: "/list", label: "一覧", Icon: List },
];

const rightTabs: Tab[] = [
  { href: "/subscription", label: "サブスク", Icon: Repeat },
  { href: "/income", label: "収入", Icon: Wallet },
];

/* ===============================
   TabBar
================================ */
export default function TabBar() {
  const pathname = usePathname();

  // ===== 今どのモーダルにするか（アクティブタブ基準）=====
  const mode: SheetMode = useMemo(() => {
    if (pathname === "/subscription" || pathname.startsWith("/subscription/")) return "subscription";
    if (pathname === "/income" || pathname.startsWith("/income/")) return "income";
    return "expense";
  }, [pathname]);

  const todayISO = new Date().toISOString().slice(0, 10);

  /* ===== Sheet状態 ===== */
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ===============================
     支出（expense）
  ================================ */
  const [exDate, setExDate] = useState(todayISO);
  const [exDetail, setExDetail] = useState("");
  const [exAmount, setExAmount] = useState("");
  const [exCategory, setExCategory] = useState("食費");
  const [exPayment, setExPayment] = useState("現金");
  const [exMemo, setExMemo] = useState("");

  /* ===============================
     サブスク（subscription）
  ================================ */
  const [subDay, setSubDay] = useState(String(new Date().getDate())); // 1〜31
  const [subDetail, setSubDetail] = useState("");
  const [subAmount, setSubAmount] = useState("");
  const [subCategory, setSubCategory] = useState("サブスク");
  const [subPayment, setSubPayment] = useState("クレジット：三菱UFJ");
  const [subDone, setSubDone] = useState(false);
  const [subMemo, setSubMemo] = useState("");

  /* ===============================
     収入（income）
  ================================ */
  const [inDate, setInDate] = useState(todayISO);
  const [inDetail, setInDetail] = useState("");
  const [inAmount, setInAmount] = useState("");
  const [inCategory, setInCategory] = useState("給与");

  function openSheet() {
    // 開いた瞬間に「そのモードの初期値」に寄せたい場合はここで整える
    if (mode === "expense") {
      setExDate(todayISO);
    } else if (mode === "income") {
      setInDate(todayISO);
    }
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
      setExPayment("現金");
      setExMemo("");
    } else if (mode === "subscription") {
      setSubDetail("");
      setSubAmount("");
      setSubCategory("サブスク");
      setSubPayment("クレジット：三菱UFJ");
      setSubDone(false);
      setSubMemo("");
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
        : mode === "subscription"
          ? "subscription-updated"
          : "income-updated";
    window.dispatchEvent(new Event(ev));
  }

  /* ===== 保存処理（モードで分岐）===== */
  async function submit() {
    if (saving) return;

    // --- validate & build request ---
    let endpoint = "";
    let body = null;

    if (mode === "expense") {
      if (!exDetail || !exAmount) return;
      endpoint = "/api/add-expense";
      body = {
        date: exDate,
        detail: exDetail,
        amount: Number(exAmount),
        category: exCategory,
        payment: exPayment,
        memo: exMemo,
      };
    }

    if (mode === "subscription") {
      if (!subDetail || !subAmount || !subDay) return;
      endpoint = "/api/add-subscription";
      body = {
        day: Number(subDay), 
        detail: subDetail,
        amount: Number(subAmount),
        category: subCategory,
        payment: subPayment,
        done: subDone,
        memo: subMemo,
      };
    }

    if (mode === "income") {
      if (!inDetail || !inAmount) return;
      endpoint = "/api/add-income";
      body = {
        date: inDate,
        detail: inDetail,
        amount: Number(inAmount),
        category: inCategory,
      };
    }

    setSaving(true);
    try {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      setSaving(false);
      closeSheet();
      resetAfterSave();
      dispatchUpdatedEvent();
    } catch (e) {
      setSaving(false);
      // 必要ならエラー表示に変えてOK
      console.error(e);
    }
  }

  const sheetTitle =
    mode === "subscription" ? "サブスクを追加" : mode === "income" ? "収入を追加" : "支出を追加";

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
            <Link key={t.href} href={t.href} style={tabStyle(active)}>
              {active && <ActivePill />}
              <Icon size={20} strokeWidth={active ? 2.6 : 2} />
              <span>{t.label}</span>
            </Link>
          );
        })}

        <div />

        {rightTabs.map((t) => {
          const active = pathname === t.href || pathname.startsWith(t.href + "/");
          const Icon = t.Icon;

          return (
            <Link key={t.href} href={t.href} style={tabStyle(active)}>
              {active && <ActivePill />}
              <Icon size={20} strokeWidth={active ? 2.6 : 2} />
              <span>{t.label}</span>
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
          zIndex: 1001, // ★Overlayより上
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <BottomSheet open={open} title={sheetTitle} onClose={closeSheet}>
          {mode === "subscription" ? (
            <SubscriptionForm
              day={subDay}
              setDay={setSubDay}
              detail={subDetail}
              setDetail={setSubDetail}
              amount={subAmount}
              setAmount={setSubAmount}
              category={subCategory}
              setCategory={setSubCategory}
              payment={subPayment}
              setPayment={setSubPayment}
              done={subDone}
              setdone={setSubDone}
              memo={subMemo}
              setMemo={setSubMemo}
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
   Forms
================================ */
type ExpenseFormProps = {
  date: string;
  setDate: (v: string) => void;
  detail: string;
  setDetail: (v: string) => void;
  amount: string;
  setAmount: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  payment: string;
  setPayment: (v: string) => void;
  memo: string;
  setMemo: (v: string) => void;
  onSubmit: () => Promise<void>;
  saving: boolean;
  onClose: () => void;
};

function ExpenseForm({
  date,
  setDate,
  detail,
  setDetail,
  amount,
  setAmount,
  category,
  setCategory,
  payment,
  setPayment,
  memo,
  setMemo,
  onSubmit,
  saving,
  onClose,
}: ExpenseFormProps) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Field label="日付">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={input} />
      </Field>

      <Field label="詳細">
        <input value={detail} onChange={(e) => setDetail(e.target.value)} style={input} />
      </Field>

      <Field label="金額">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="numeric"
          style={input}
        />
      </Field>

      <Field label="カテゴリ">
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={input}>
          <option>食費</option>
          <option>生活費</option>
          <option>交通費</option>
          <option>日用品</option>
          <option>娯楽・趣味</option>
          <option>未分類</option>
        </select>
      </Field>

      <Field label="支払方法">
        <select value={payment} onChange={(e) => setPayment(e.target.value)} style={input}>
          <option>クレジット：三菱UFJ</option>
          <option>クレジット：楽天</option>
          <option>クレジット：EPOS</option>
          <option>クレジット：三井住友</option>
          <option>PayPay</option>
          <option>現金</option>
          <option>その他</option>
        </select>
      </Field>

      <Field label="メモ">
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          style={{ ...input, resize: "none" }}
        />
      </Field>

      <FormButtons onClose={onClose} onSubmit={onSubmit} saving={saving} />
    </div>
  );
}

type SubscriptionFormProps = {
  day: string;
  setDay: (v: string) => void;
  detail: string;
  setDetail: (v: string) => void;
  amount: string;
  setAmount: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  payment: string;
  setPayment: (v: string) => void;
  done: boolean;
  setdone: (v: boolean) => void;
  memo: string;
  setMemo: (v: string) => void;
  onSubmit: () => Promise<void>;
  saving: boolean;
  onClose: () => void;
};

function SubscriptionForm({
  day,
  setDay,
  detail,
  setDetail,
  amount,
  setAmount,
  category,
  setCategory,
  payment,
  setPayment,
  done,
  setdone,
  memo,
  setMemo,
  onSubmit,
  saving,
  onClose,
}: SubscriptionFormProps) {
  const dayOptions = Array.from({ length: 31 }, (_, i) => String(i + 1));

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Field label="日（毎月）">
        <select value={day} onChange={(e) => setDay(e.target.value)} style={input}>
          {dayOptions.map((d) => (
            <option key={d} value={d}>
              {d}日
            </option>
          ))}
        </select>
      </Field>

      <Field label="詳細">
        <input value={detail} onChange={(e) => setDetail(e.target.value)} style={input} />
      </Field>

      <Field label="金額">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="numeric"
          style={input}
        />
      </Field>

      <Field label="カテゴリ">
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={input}>
          <option>サブスク</option>
          <option>生活費</option>
          <option>その他</option>
        </select>
      </Field>

      <Field label="支払方法">
        <select value={payment} onChange={(e) => setPayment(e.target.value)} style={input}>
          <option>クレジット：三菱UFJ</option>
          <option>クレジット：楽天</option>
          <option>クレジット：EPOS</option>
          <option>クレジット：三井住友</option>
          <option>PayPay</option>
          <option>現金</option>
          <option>その他</option>
        </select>
      </Field>

      <Field label="今月済">
        <button
          type="button"
          onClick={() => setdone(!done)}
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
      </Field>

      <Field label="メモ">
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          style={{ ...input, resize: "none" }}
        />
      </Field>

      <FormButtons onClose={onClose} onSubmit={onSubmit} saving={saving} />
    </div>
  );
}

type IncomeFormProps = {
  date: string;
  setDate: (v: string) => void;
  detail: string;
  setDetail: (v: string) => void;
  amount: string;
  setAmount: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  onSubmit: () => Promise<void>;
  saving: boolean;
  onClose: () => void;
};

function IncomeForm({
  date,
  setDate,
  detail,
  setDetail,
  amount,
  setAmount,
  category,
  setCategory,
  onSubmit,
  saving,
  onClose,
}: IncomeFormProps) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Field label="日付">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={input} />
      </Field>

      <Field label="詳細">
        <input value={detail} onChange={(e) => setDetail(e.target.value)} style={input} />
      </Field>

      <Field label="金額">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="numeric"
          style={input}
        />
      </Field>

      <Field label="カテゴリ">
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={input}>
          <option>給与</option>
          <option>ボーナス</option>
          <option>その他</option>
        </select>
      </Field>

      <FormButtons onClose={onClose} onSubmit={onSubmit} saving={saving} />
    </div>
  );
}

function FormButtons({
  onClose,
  onSubmit,
  saving,
}: {
  onClose: () => void;
  onSubmit: () => void;
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
      {children}
    </div>
  );
}

/* ===============================
   styles
================================ */
const fabStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "calc(var(--tabbar-h) - 50px + env(safe-area-inset-bottom))",
  left: "50%",
  transform: "translateX(-50%)",

  width: 54,
  height: 54,
  borderRadius: "50%",
  border: "none",

  background: `linear-gradient(135deg, ${theme.primary}, #163E6D)`,
  color: "white",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  boxShadow: "0 10px 24px rgba(29,78,137,0.35)",
  zIndex: 80,
  cursor: "pointer",
};

const navStyle: React.CSSProperties = {
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

function tabStyle(active: boolean): React.CSSProperties {
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

function ActivePill() {
  return (
    <div
      style={{
        position: "absolute",
        top: 4,
        width: 42,
        height: 24,
        borderRadius: 999,
        background: `${theme.primary}18`,
        zIndex: -1,
      }}
    />
  );
}

const input: React.CSSProperties = {
  padding: "13px 14px",
  borderRadius: 12,
  border: `1px solid ${theme.border}`,
  background: theme.surface,
  fontSize: 16,
  color: theme.text,
};

const cancelBtn: React.CSSProperties = {
  padding: "11px 16px",
  borderRadius: 12,
  border: `1px solid ${theme.border}`,
  background: theme.surface,
  fontWeight: 600,
  color: theme.subtext,
  cursor: "pointer",
};

const saveBtn: React.CSSProperties = {
  padding: "11px 20px",
  borderRadius: 12,
  border: "none",
  background: `linear-gradient(135deg, ${theme.primary}, #163E6D)`,
  color: "white",
  fontWeight: 700,
  letterSpacing: 0.2,
  cursor: "pointer",
};
