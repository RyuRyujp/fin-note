import { input } from "./styles";
import { Field, FormButtons, DoneToggle } from "./ui";

/* ===============================
   共通
================================ */
const PAYMENT_OPTIONS = [
  "クレジット：三菱UFJ",
  "クレジット：楽天",
  "クレジット：EPOS",
  "クレジット：三井住友",
  "PayPay",
  "現金",
  "その他",
] as const;

function thisMonthDoneLabel() {
  const m = new Date().getMonth() + 1; // 1-12
  return `${m}月済`;
}

/* ===============================
   Expense
================================ */
export type ExpenseFormProps = {
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

export function ExpenseForm({
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
        <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" style={input} />
      </Field>

      <Field label="カテゴリ">
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={input}>
          <option>食費</option>
          <option>生活費</option>
          <option>交通費</option>
          <option>日用品</option>
          <option>雑貨</option>
          <option>娯楽・趣味</option>
          <option>未分類</option>
        </select>
      </Field>

      <Field label="支払方法">
        <select value={payment} onChange={(e) => setPayment(e.target.value)} style={input}>
          {PAYMENT_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </Field>

      <Field label="メモ">
        <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={3} style={{ ...input, resize: "none" }} />
      </Field>

      <FormButtons onClose={onClose} onSubmit={onSubmit} saving={saving} />
    </div>
  );
}

/* ===============================
   FixedExpense（旧 subscription）
================================ */
export type FixedExpenseFormProps = {
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
  setDone: (v: boolean) => void;
  memo: string;
  setMemo: (v: string) => void;
  onSubmit: () => Promise<void>;
  saving: boolean;
  onClose: () => void;
};

export function FixedExpenseForm({
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
  setDone,
  onSubmit,
  saving,
  onClose,
}: FixedExpenseFormProps) {
  const dayOptions = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const doneLabel = thisMonthDoneLabel();

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
        <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" style={input} />
      </Field>

      <Field label="カテゴリ">
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={input}>
          <option>サブスク</option>
          <option>固定費</option>
          <option>生活費</option>
          <option>その他</option>
        </select>
      </Field>

      <Field label="支払方法">
        <select value={payment} onChange={(e) => setPayment(e.target.value)} style={input}>
          {PAYMENT_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </Field>

      <Field label={doneLabel}>
        <DoneToggle done={done} onToggle={() => setDone(!done)} />
      </Field>

      <FormButtons onClose={onClose} onSubmit={onSubmit} saving={saving} />
    </div>
  );
}

/* ===============================
   LivingExpense（追加）
================================ */
export type LivingExpenseFormProps = {
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
  setDone: (v: boolean) => void;
  memo: string;
  setMemo: (v: string) => void;
  onSubmit: () => Promise<void>;
  saving: boolean;
  onClose: () => void;
};

export function LivingExpenseForm({
  day,
  setDay,
  detail,
  setDetail,
  category,
  setCategory,
  payment,
  setPayment,
  done,
  setDone,
  memo,
  setMemo,
  onSubmit,
  saving,
  onClose,
}: LivingExpenseFormProps) {
  const dayOptions = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const doneLabel = thisMonthDoneLabel();

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

      <Field label="カテゴリ">
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={input}>
          <option>生活費</option>
          <option>日用品</option>
          <option>交通費</option>
          <option>サブスク</option>
          <option>その他</option>
        </select>
      </Field>

      <Field label="支払方法">
        <select value={payment} onChange={(e) => setPayment(e.target.value)} style={input}>
          {PAYMENT_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </Field>

      <Field label={doneLabel}>
        <DoneToggle done={done} onToggle={() => setDone(!done)} />
      </Field>

      <Field label="メモ">
        <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={3} style={{ ...input, resize: "none" }} />
      </Field>

      <FormButtons onClose={onClose} onSubmit={onSubmit} saving={saving} />
    </div>
  );
}

/* ===============================
   Income
================================ */
export type IncomeFormProps = {
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

export function IncomeForm({
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
        <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" style={input} />
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
