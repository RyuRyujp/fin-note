// app/export/page.tsx
"use client";

import type React from "react";
import { useMemo, useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import SideMenu from "@/components/layout/SideMenu";
import TabBar from "@/components/nav/TabBar/Index";
import { theme } from "@/lib/theme";
import {
  Download,
  FileSpreadsheet,
  ShieldCheck,
  AlertTriangle,
  SlidersHorizontal,
  Layers,
} from "lucide-react";

import { useExpenseStore } from "@/lib/store/expenseStore";

/* =========================
   Types
========================= */

type DataKey = "expense" | "income" | "fixedExpense" | "livingExpense";
type Toggles = Record<DataKey, boolean>;

/** ここは “最低限” でOK。プロジェクトの実型とズレてもCSV化はできるように緩めにしてる */
type ExpenseLike = {
  date?: string;
  detail?: string;
  category?: string;
  amount?: number | string;
  payment?: string;
  memo?: string;
};

type IncomeLike = {
  date?: string;
  detail?: string;
  amount?: number | string;
  payment?: string;
  memo?: string;
};

type FixedExpenseLike = {
  day?: string | number;
  detail?: string;
  category?: string;
  amount?: number | string;
  payment?: string;
  memo?: string;
};

type LivingExpenseLike = {
  day?: string | number;
  detail?: string;
  category?: string;
  amount?: number | string;
  payment?: string;
  done?: string;
  memo?: string;
};

const DATA_LABEL: Record<DataKey, { title: string; sub: string }> = {
  expense: { title: "支出 (Expense)", sub: "通常の支出明細" },
  income: { title: "収入 (Income)", sub: "入金・給与など" },
  fixedExpense: { title: "固定費 (Fixed)", sub: "定期支払い（毎月など）" },
  livingExpense: { title: "生活費予定 (Living)", sub: "当月の支払い予定（通知用）" },
};

/* =========================
   Page
========================= */

export default function ExportPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [err, setErr] = useState<string>("");

  // ✅ CSVに含めるデータ
  const [csvPick, setCsvPick] = useState<Toggles>({
    expense: true,
    income: false,
    fixedExpense: false,
    livingExpense: false,
  });

  // ✅ ストアからデータ取得（あなたの store に合わせてフィールド名を調整してOK）
  const store = useExpenseStore() as unknown as {
    expenses?: ExpenseLike[];
    incomes?: IncomeLike[];
    fixedExpenses?: FixedExpenseLike[];
    livingExpenses?: LivingExpenseLike[];
  };

  const expenses = store.expenses ?? [];
  const incomes = store.incomes ?? [];
  const fixedExpenses = store.fixedExpenses ?? [];
  const livingExpenses = store.livingExpenses ?? [];

  const anyPicked = useMemo(() => Object.values(csvPick).some(Boolean), [csvPick]);
  const pickedCount = useMemo(() => Object.values(csvPick).filter(Boolean).length, [csvPick]);

  const pickedSize = useMemo(() => {
    const size =
      (csvPick.expense ? expenses.length : 0) +
      (csvPick.income ? incomes.length : 0) +
      (csvPick.fixedExpense ? fixedExpenses.length : 0) +
      (csvPick.livingExpense ? livingExpenses.length : 0);
    return size;
  }, [csvPick, expenses.length, incomes.length, fixedExpenses.length, livingExpenses.length]);

  const toggle = (k: DataKey) => setCsvPick((p) => ({ ...p, [k]: !p[k] }));
  const selectAll = () =>
    setCsvPick({ expense: true, income: true, fixedExpense: true, livingExpense: true });
  const clearAll = () =>
    setCsvPick({ expense: false, income: false, fixedExpense: false, livingExpense: false });

  const handleDownloadCsv = async () => {
    setErr("");
    setMsg("");

    if (!anyPicked) {
      setErr("CSVに含めるデータを1つ以上選んでください");
      return;
    }

    if (pickedSize === 0) {
      setErr("選択したデータに出力対象がありません（ストアが空かもしれません）");
      return;
    }

    setBusy(true);
    try {
      // ちょい演出（不要なら消してOK）
      await new Promise((r) => setTimeout(r, 150));

      const csv = buildCsvFromStore({
        pick: csvPick,
        expenses,
        incomes,
        fixedExpenses,
        livingExpenses,
      });

      const filename = `moneynote-export-${todayKey()}.csv`;
      downloadText(filename, csv, "text/csv");
      setMsg(`CSVをダウンロードしました（${pickedCount}種類 / ${pickedSize}行）`);
    } catch {
      setErr("CSVの生成に失敗しました");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AppHeader title="MoneyNote" subtitle="エクスポート" onMenu={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main style={page}>
        <div style={container}>
          {/* ===== Hero ===== */}
          <div style={heroCard}>
            <div style={heroTop}>
              <div style={heroLeft}>
                <div style={heroIcon}>
                  <Download size={16} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={heroTitle}>CSVエクスポート</div>
                  <div style={heroSub}>選択した項目のCSVを生成します</div>
                </div>
              </div>

              <div style={heroPill}>
                <span style={heroPillDot} />
                Local
              </div>
            </div>

            <div style={heroMiniRow}>
              <div style={miniChip}>
                <SlidersHorizontal size={14} />
                対象選択
              </div>
              <div style={miniChip}>
                <FileSpreadsheet size={14} />
                CSV
              </div>
              <div style={miniChip}>
                <ShieldCheck size={14} />
                ローカル生成
              </div>
            </div>

            <div style={heroLine} />
          </div>

          {/* ===== Messages ===== */}
          {err ? (
            <div style={alertErr}>
              <AlertTriangle size={16} />
              <div style={{ minWidth: 0 }}>{err}</div>
            </div>
          ) : null}

          {msg ? (
            <div style={alertOk}>
              <ShieldCheck size={16} />
              <div style={{ minWidth: 0 }}>{msg}</div>
            </div>
          ) : null}

          {/* ===== Picker ===== */}
          <div style={{ marginTop: 14 }}>
            <div style={secTitleRow}>
              <span style={secDot} />
              <div style={secTitle}>CSVに含めるデータ</div>
              <div style={secRail} />
              <div style={countChip}>
                <span style={countDot} />
                {pickedCount} 種類 / {pickedSize} 行
              </div>
            </div>

            <div style={pickerCard}>
              <div style={pickerTop}>
                <div style={pickerLead}>
                  <div style={pickerIcon}>
                    <Layers size={16} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={pickerTitle}>出力対象を選択</div>
                    <div style={pickerSub}>選んだデータだけを1つのCSVにまとめます</div>
                  </div>
                </div>

                <div style={pickerBtns}>
                  <button type="button" style={ghostBtnSmall} onClick={selectAll}>
                    全選択
                  </button>
                  <button type="button" style={ghostBtnSmall} onClick={clearAll}>
                    解除
                  </button>
                </div>
              </div>

              <div style={toggleGrid}>
                <ToggleCard
                  checked={csvPick.expense}
                  title={DATA_LABEL.expense.title}
                  sub={`${DATA_LABEL.expense.sub}（${expenses.length}件）`}
                  onClick={() => toggle("expense")}
                />
                <ToggleCard
                  checked={csvPick.income}
                  title={DATA_LABEL.income.title}
                  sub={`${DATA_LABEL.income.sub}（${incomes.length}件）`}
                  onClick={() => toggle("income")}
                />
                <ToggleCard
                  checked={csvPick.fixedExpense}
                  title={DATA_LABEL.fixedExpense.title}
                  sub={`${DATA_LABEL.fixedExpense.sub}（${fixedExpenses.length}件）`}
                  onClick={() => toggle("fixedExpense")}
                />
                <ToggleCard
                  checked={csvPick.livingExpense}
                  title={DATA_LABEL.livingExpense.title}
                  sub={`${DATA_LABEL.livingExpense.sub}（${livingExpenses.length}件）`}
                  onClick={() => toggle("livingExpense")}
                />
              </div>

              {!anyPicked ? (
                <div style={pickerWarn}>
                  <AlertTriangle size={16} />
                  <div style={{ minWidth: 0 }}>1つ以上選択してください</div>
                </div>
              ) : null}
            </div>
          </div>

          {/* ===== Download ===== */}
          <div style={{ marginTop: 12 }}>
            <div style={card}>
              <div style={cardHead}>
                <div style={cardIcon}>
                  <FileSpreadsheet size={18} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={cardTitle}>CSVをダウンロード</div>
                  <div style={cardSub}>
                    選択したデータをセクション分けして1ファイルに出力
                  </div>
                </div>
              </div>

              <div style={cardBody}>
                <button
                  type="button"
                  style={{
                    ...primaryBtn,
                    ...((busy || !anyPicked || pickedSize === 0) ? btnBusy : {}),
                  }}
                  onClick={() => void handleDownloadCsv()}
                  disabled={busy || !anyPicked || pickedSize === 0}
                >
                  <Download size={16} />
                  {busy ? "生成中..." : "CSVをダウンロード"}
                </button>
              </div>
            </div>
          </div>

          <div style={footNote}>
            CSVは外部共有前に内容を確認してください（個人情報やメモ欄など）
          </div>
        </div>
      </main>

      <TabBar />
    </>
  );
}

/* =========================
   UI parts
========================= */

function ToggleCard({
  checked,
  title,
  sub,
  onClick,
}: {
  checked: boolean;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...toggleCard,
        ...(checked ? toggleCardOn : {}),
        ...(pressed ? toggleCardPressed : {}),
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      aria-pressed={checked}
    >
      <div style={{ minWidth: 0 }}>
        <div style={toggleTitle}>{title}</div>
        <div style={toggleSub}>{sub}</div>
      </div>

      <div style={switchWrap}>
        <div style={{ ...switchTrack, ...(checked ? switchTrackOn : {}) }}>
          <div style={{ ...switchKnob, ...(checked ? switchKnobOn : {}) }} />
        </div>
      </div>

      <div style={shine} />
    </button>
  );
}

/* =========================
   CSV builder
========================= */

function buildCsvFromStore(args: {
  pick: Toggles;
  expenses: ExpenseLike[];
  incomes: IncomeLike[];
  fixedExpenses: FixedExpenseLike[];
  livingExpenses: LivingExpenseLike[];
}): string {
  const { pick, expenses, incomes, fixedExpenses, livingExpenses } = args;

  const lines: string[] = [];
  lines.push(`# MoneyNote CSV Export`);
  lines.push(`# ExportedAt: ${new Date().toISOString()}`);
  lines.push("");

  if (pick.expense) {
    lines.push(`# Expense`);
    lines.push("date,detail,category,amount,payment,memo");
    for (const r of expenses) {
      lines.push(
        [
          esc(r.date),
          esc(r.detail),
          esc(r.category),
          escNum(r.amount),
          esc(r.payment),
          esc(r.memo),
        ].join(",")
      );
    }
    lines.push("");
  }

  if (pick.income) {
    lines.push(`# Income`);
    lines.push("date,detail,amount,payment,memo");
    for (const r of incomes) {
      lines.push([esc(r.date), esc(r.detail), escNum(r.amount), esc(r.payment), esc(r.memo)].join(","));
    }
    lines.push("");
  }

  if (pick.fixedExpense) {
    lines.push(`# FixedExpense`);
    lines.push("day,detail,category,amount,payment,memo");
    for (const r of fixedExpenses) {
      lines.push(
        [
          esc(String(r.day ?? "")),
          esc(r.detail),
          esc(r.category),
          escNum(r.amount),
          esc(r.payment),
          esc(r.memo),
        ].join(",")
      );
    }
    lines.push("");
  }

  if (pick.livingExpense) {
    lines.push(`# LivingExpense`);
    lines.push("day,detail,category,amount,payment,done,memo");
    for (const r of livingExpenses) {
      lines.push(
        [
          esc(String(r.day ?? "")),
          esc(r.detail),
          esc(r.category),
          escNum(r.amount),
          esc(r.payment),
          esc(r.done),
          esc(r.memo),
        ].join(",")
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

function esc(v?: string): string {
  const s = (v ?? "").toString();
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function escNum(v?: number | string): string {
  if (v === undefined || v === null) return "";
  const n = typeof v === "string" ? Number(v) : v;
  if (!Number.isFinite(n)) return esc(String(v));
  return String(n);
}

/* =========================
   helpers
========================= */

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

/* =========================
   styles
========================= */

const page: React.CSSProperties = {
  height: "100dvh",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  background: theme.background,
};

const container: React.CSSProperties = {
  paddingTop: 76,
  paddingLeft: 16,
  paddingRight: 16,
  paddingBottom: 150,
};

const heroCard: React.CSSProperties = {
  marginTop: 10,
  borderRadius: 20,
  border: "1px solid rgba(29,78,137,0.14)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 100%)",
  boxShadow: "0 20px 40px rgba(2,6,23,0.08)",
  padding: 14,
  position: "relative",
  overflow: "hidden",
};

const heroTop: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 10,
};

const heroLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  minWidth: 0,
};

const heroIcon: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 14,
  display: "grid",
  placeItems: "center",
  border: "1px solid rgba(29,78,137,0.14)",
  background: "rgba(29,78,137,0.08)",
  color: theme.primary,
  boxShadow: "0 12px 18px rgba(2,6,23,0.06)",
  flexShrink: 0,
};

const heroTitle: React.CSSProperties = {
  fontWeight: 950,
  fontSize: 14,
  letterSpacing: 0.2,
  color: theme.text,
};

const heroSub: React.CSSProperties = {
  marginTop: 3,
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  lineHeight: 1.45,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const heroPill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "7px 10px",
  borderRadius: 999,
  border: "1px solid rgba(214,181,138,0.30)",
  background: "rgba(214,181,138,0.14)",
  color: "rgba(120,82,37,0.92)",
  fontSize: 12,
  fontWeight: 950,
  letterSpacing: 0.2,
  flexShrink: 0,
  whiteSpace: "nowrap",
};

const heroPillDot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.14)",
};

const heroMiniRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  marginTop: 12,
  flexWrap: "wrap",
};

const miniChip: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid rgba(29,78,137,0.10)",
  background: "rgba(255,255,255,0.80)",
  color: theme.text,
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: 0.2,
};

const heroLine: React.CSSProperties = {
  marginTop: 12,
  height: 1,
  width: "100%",
  background:
    "linear-gradient(90deg, rgba(29,78,137,0.18) 0%, rgba(29,78,137,0.06) 55%, rgba(29,78,137,0) 100%)",
};

const alertBase: React.CSSProperties = {
  marginTop: 12,
  borderRadius: 16,
  padding: "12px 12px",
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: 0.2,
  boxShadow: "0 14px 26px rgba(2,6,23,0.06)",
  border: "1px solid rgba(29,78,137,0.12)",
  background: "rgba(255,255,255,0.86)",
};

const alertErr: React.CSSProperties = {
  ...alertBase,
  border: "1px solid rgba(239,68,68,0.22)",
  background: "rgba(239,68,68,0.08)",
  color: "rgba(153,27,27,0.95)",
};

const alertOk: React.CSSProperties = {
  ...alertBase,
  border: "1px solid rgba(34,197,94,0.22)",
  background: "rgba(34,197,94,0.08)",
  color: "rgba(22,101,52,0.95)",
};

const secTitleRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  margin: "10px 6px",
};

const secDot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const secTitle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 950,
  color: theme.subtext,
  letterSpacing: 0.22,
};

const secRail: React.CSSProperties = {
  flex: 1,
  height: 1,
  background:
    "linear-gradient(90deg, rgba(29,78,137,0.16) 0%, rgba(29,78,137,0.06) 60%, rgba(29,78,137,0) 100%)",
};

const countChip: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid rgba(29,78,137,0.12)",
  background: "rgba(255,255,255,0.86)",
  color: theme.subtext,
  fontSize: 12,
  fontWeight: 950,
  letterSpacing: 0.2,
  flexShrink: 0,
  whiteSpace: "nowrap",
};

const countDot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: theme.primary,
  boxShadow: "0 0 0 4px rgba(29,78,137,0.12)",
};

const pickerCard: React.CSSProperties = {
  borderRadius: 18,
  overflow: "hidden",
  border: "1px solid rgba(29,78,137,0.12)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.78) 100%)",
  boxShadow: "0 16px 30px rgba(2,6,23,0.06)",
  padding: 14,
};

const pickerTop: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const pickerLead: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  minWidth: 0,
  flex: "1 1 260px",
};

const pickerIcon: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 14,
  display: "grid",
  placeItems: "center",
  border: "1px solid rgba(29,78,137,0.14)",
  background: "rgba(29,78,137,0.08)",
  color: theme.primary,
  boxShadow: "0 12px 18px rgba(2,6,23,0.06)",
  flexShrink: 0,
};

const pickerTitle: React.CSSProperties = {
  fontWeight: 950,
  color: theme.text,
  letterSpacing: 0.2,
};

const pickerSub: React.CSSProperties = {
  marginTop: 3,
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  lineHeight: 1.45,
};

const pickerBtns: React.CSSProperties = {
  display: "inline-flex",
  gap: 8,
  flexShrink: 0,
};

const ghostBtnSmall: React.CSSProperties = {
  height: 34,
  padding: "0 10px",
  borderRadius: 12,
  border: "1px solid rgba(29,78,137,0.12)",
  background: "rgba(255,255,255,0.84)",
  color: theme.subtext,
  fontWeight: 950,
  letterSpacing: 0.2,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const toggleGrid: React.CSSProperties = {
  marginTop: 12,
  display: "grid",
  gap: 10,
  gridTemplateColumns: "1fr",
};

const toggleCard: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  border: "1px solid rgba(29,78,137,0.12)",
  background: "rgba(255,255,255,0.86)",
  borderRadius: 16,
  padding: 12,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  position: "relative",
  overflow: "hidden",
  transition: "transform .12s ease, opacity .12s ease, background .14s ease, border .14s ease",
};

const toggleCardOn: React.CSSProperties = {
  border: "1px solid rgba(29,78,137,0.20)",
  background: "rgba(29,78,137,0.08)",
};

const toggleCardPressed: React.CSSProperties = {
  transform: "scale(0.993)",
  opacity: 0.95,
};

const toggleTitle: React.CSSProperties = {
  fontWeight: 950,
  color: theme.text,
  letterSpacing: 0.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const toggleSub: React.CSSProperties = {
  marginTop: 3,
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const switchWrap: React.CSSProperties = {
  flexShrink: 0,
};

const switchTrack: React.CSSProperties = {
  width: 44,
  height: 24,
  borderRadius: 999,
  border: "1px solid rgba(15,23,42,0.12)",
  background: "rgba(15,23,42,0.08)",
  position: "relative",
};

const switchTrackOn: React.CSSProperties = {
  border: "1px solid rgba(29,78,137,0.22)",
  background: theme.primary,
};

const switchKnob: React.CSSProperties = {
  position: "absolute",
  top: 3,
  left: 3,
  width: 18,
  height: 18,
  borderRadius: 999,
  background: "white",
  boxShadow: "0 8px 12px rgba(2,6,23,0.16)",
  transition: "transform .16s ease",
};

const switchKnobOn: React.CSSProperties = {
  transform: "translateX(20px)",
};

const pickerWarn: React.CSSProperties = {
  marginTop: 12,
  borderRadius: 16,
  padding: "12px 12px",
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: 0.2,
  border: "1px solid rgba(245,158,11,0.22)",
  background: "rgba(245,158,11,0.10)",
  color: "rgb(180,83,9)",
};

const card: React.CSSProperties = {
  marginTop: 12,
  borderRadius: 18,
  overflow: "hidden",
  border: "1px solid rgba(29,78,137,0.12)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.78) 100%)",
  boxShadow: "0 16px 30px rgba(2,6,23,0.06)",
};

const cardHead: React.CSSProperties = {
  padding: 14,
  display: "flex",
  gap: 10,
  alignItems: "center",
  borderBottom: "1px solid rgba(15,23,42,0.07)",
};

const cardIcon: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 16,
  display: "grid",
  placeItems: "center",
  border: "1px solid rgba(29,78,137,0.14)",
  background: "rgba(255,255,255,0.88)",
  color: theme.primary,
  boxShadow: "0 12px 18px rgba(2,6,23,0.06)",
  flexShrink: 0,
};

const cardTitle: React.CSSProperties = {
  fontWeight: 950,
  color: theme.text,
  letterSpacing: 0.2,
};

const cardSub: React.CSSProperties = {
  marginTop: 3,
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const cardBody: React.CSSProperties = {
  padding: 14,
  display: "grid",
  gap: 10,
};

const primaryBtn: React.CSSProperties = {
  width: "100%",
  height: 42,
  borderRadius: 14,
  border: "1px solid rgba(29,78,137,0.18)",
  background: theme.primary,
  color: theme.textSubtleOnPrimary,
  fontWeight: 950,
  letterSpacing: 0.2,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  cursor: "pointer",
  boxShadow: "0 14px 20px rgba(2,6,23,0.06)",
};

const btnBusy: React.CSSProperties = {
  opacity: 0.75,
  cursor: "not-allowed",
};

const footNote: React.CSSProperties = {
  marginTop: 12,
  fontSize: 12,
  fontWeight: 800,
  color: "rgba(15,23,42,0.55)",
};

const shine: React.CSSProperties = {
  pointerEvents: "none",
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(140px 70px at 16% 30%, rgba(255,255,255,0.52), rgba(255,255,255,0) 60%)",
  opacity: 0.8,
};
