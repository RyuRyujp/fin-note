"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import AppHeader from "@/components/layout/AppHeader";
import SideMenu from "@/components/layout/SideMenu";
import TabBar from "@/components/nav/TabBar/Index";
import { theme, THEME_PRESETS, type ThemeName, getStoredTheme } from "@/lib/theme";

import {
  Palette,
  Tags,
  CreditCard,
  Bell,
  BellRing,
  Cloud,
  RefreshCw,
  Info,
  FileText,
  ChevronRight,
} from "lucide-react";

const THEME_LABELS: Record<ThemeName, string> = {
  blue: "Blue",
  red: "Red",
  green: "Green",
  navy: "Navy",
  brown: "Brown",
  olive: "Olive",
  violet: "Violet",
  teal: "Teal",
  charcoal: "Charcoal",
  coral: "Coral",
  indigo: "Indigo",
  slate: "Slate",
};

type RowDef = {
  icon: React.ReactNode;
  title: string;
  sub: string;
  right?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

export default function SettingsPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const [themeName] = useState<ThemeName>(() => getStoredTheme());
  const currentPreset = useMemo(() => THEME_PRESETS[themeName], [themeName]);

  const sections = useMemo(() => {
    const display: RowDef[] = [
      {
        icon: <Palette size={18} />,
        title: "テーマカラー",
        sub: `現在：${THEME_LABELS[themeName]}`,
        right: (
          <ThemePreview
            primary={currentPreset.primary}
            accent={currentPreset.accent}
            bg={currentPreset.background}
          />
        ),
        onClick: () => router.push("/settings/theme"),
      },
      {
        icon: <Tags size={18} />,
        title: "カテゴリ",
        sub: "カテゴリオプションを管理できます",
        right: <Badge text="管理" />,
        onClick: () => router.push("/settings/category"),
      },
      {
        icon: <CreditCard size={18} />,
        title: "支払方法",
        sub: "支払い方法オプションを管理できます",
        right: <Badge text="管理" />,
        onClick: () => router.push("/settings/payment"),
      },
    ];

    const notify: RowDef[] = [
      {
        icon: <Bell size={18} />,
        title: "通知",
        sub: "ON/OFF（後で対応）",
        right: <Badge text="準備中" tone="muted" />,
        onClick: () => { },
        disabled: true,
      },
      {
        icon: <BellRing size={18} />,
        title: "リマインド",
        sub: "固定費の支払日（後で対応）",
        right: <Badge text="準備中" tone="muted" />,
        onClick: () => { },
        disabled: true,
      },
    ];

    const data: RowDef[] = [
      {
        icon: <Cloud size={18} />,
        title: "バックアップ",
        sub: "エクスポート/復元（後で対応）",
        right: <Badge text="準備中" tone="muted" />,
        onClick: () => { },
        disabled: true,
      },
      {
        icon: <RefreshCw size={18} />,
        title: "同期",
        sub: "外部ストレージ連携（後で対応）",
        right: <Badge text="準備中" tone="muted" />,
        onClick: () => { },
        disabled: true,
      },
    ];

    const about: RowDef[] = [
      {
        icon: <Info size={18} />,
        title: "バージョン",
        sub: "v0.1.8",
        right: <Badge text="beta" />,
        onClick: () => router.push("/settings/version"),
      },
      {
        icon: <FileText size={18} />,
        title: "利用規約",
        sub: "ドラフト",
        onClick: () => router.push("/settings/terms"),
      },
    ];

    return [
      { title: "表示 / テーマ", hint: "見た目と入力の基本設定", rows: display },
      { title: "通知", hint: "通知と支払リマインド", rows: notify },
      { title: "データ", hint: "バックアップと同期", rows: data },
      { title: "アプリ情報", hint: "バージョン / 規約", rows: about },
    ] as const;
  }, [router, themeName, currentPreset]);

  return (
    <>
      <AppHeader title="MoneyNote" subtitle="設定" onMenu={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main style={page}>
        <div style={container}>
          {/* ===== Hero card ===== */}
          <div style={heroCard}>
            <div style={heroTopRow}>
              <div style={heroTitleRow}>
                <span style={heroDot} />
                <div style={heroTitle}>Settings</div>
              </div>

              <div style={heroThemeChip}>
                <span style={heroThemeDot} />
                {THEME_LABELS[themeName]}
              </div>
            </div>

            <div style={heroSub}>
              よく使う設定をまとめました。各項目はアプリ内で完結するように段階的に拡張できます。
            </div>

            <div style={heroMiniRow}>
              <div style={miniStat}>
                <span style={miniDot} />
                表示
              </div>
              <div style={miniStat}>
                <span style={miniDot} />
                通知
              </div>
              <div style={miniStat}>
                <span style={miniDot} />
                データ
              </div>
            </div>

            <div style={heroLine} />
          </div>

          {sections.map((sec) => (
            <Section key={sec.title} title={sec.title} hint={sec.hint}>
              {sec.rows.map((r, i) => (
                <SettingRow
                  key={`${sec.title}-${r.title}`}
                  icon={r.icon}
                  title={r.title}
                  sub={r.sub}
                  right={r.right}
                  onClick={r.onClick}
                  disabled={r.disabled}
                  last={i === sec.rows.length - 1}
                />
              ))}
            </Section>
          ))}
        </div>
      </main>

      <TabBar />
    </>
  );
}

/* =========================
   Parts
========================= */

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: 16 }}>
      <div style={sectionTitleRow}>
        <span style={sectionDot} />
        <div style={{ minWidth: 0 }}>
          <div style={sectionTitle}>{title}</div>
          {hint ? <div style={sectionHint}>{hint}</div> : null}
        </div>
        <div style={sectionRail} />
      </div>
      <div style={sectionCard}>{children}</div>
    </div>
  );
}

function SettingRow({
  icon,
  title,
  sub,
  right,
  onClick,
  last,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  right?: React.ReactNode;
  onClick: () => void;
  last?: boolean;
  disabled?: boolean;
}) {
  const [pressed, setPressed] = useState(false);

  const canPress = !disabled;
  const handleClick = () => {
    if (!canPress) return;
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      disabled={!canPress}
      style={{
        ...row,
        ...(pressed && canPress ? rowPressed : {}),
        ...(disabled ? rowDisabled : {}),
        borderBottom: last ? "none" : "1px solid rgba(15,23,42,0.07)",
      }}
      onMouseDown={() => canPress && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => canPress && setPressed(true)}
      onTouchEnd={() => setPressed(false)}
    >
      <div style={left}>
        <div style={iconWrap(disabled)}>{icon}</div>
        <div style={{ minWidth: 0 }}>
          <div style={rowTitle}>{title}</div>
          <div style={rowSub}>{sub}</div>
        </div>
      </div>

      <div style={rightWrap}>
        {right}
        <ChevronRight size={18} style={chevIcon(disabled)} />
      </div>

      {/* 本格っぽい：軽いハイライト */}
      <div style={shine} />
    </button>
  );
}

function Badge({
  text,
  tone = "gold",
}: {
  text: string;
  tone?: "gold" | "muted";
}) {
  const s = tone === "muted" ? badgeMuted : badge;
  const d = tone === "muted" ? badgeDotMuted : badgeDot;

  return (
    <div style={s}>
      <span style={d} />
      {text}
    </div>
  );
}

function ThemePreview({ primary, accent, bg }: { primary: string; accent: string; bg: string }) {
  return (
    <div style={previewWrap}>
      <span style={{ ...previewDot, background: primary }} />
      <span style={{ ...previewDot, background: accent }} />
      <span style={{ ...previewDot, background: bg, border: "1px solid rgba(15,23,42,0.12)" }} />
    </div>
  );
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

/* ===== Hero ===== */

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

const heroTopRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
};

const heroTitleRow: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  minWidth: 0,
};

const heroDot: React.CSSProperties = {
  width: 9,
  height: 9,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 5px rgba(214,181,138,0.16)",
  flexShrink: 0,
};

const heroTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 950,
  color: theme.primary,
  letterSpacing: 0.2,
};

const heroThemeChip: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "7px 10px",
  borderRadius: 999,
  border: "1px solid rgba(29,78,137,0.12)",
  background: "rgba(255,255,255,0.85)",
  color: theme.subtext,
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: 0.2,
  flexShrink: 0,
};

const heroThemeDot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: theme.primary,
  boxShadow: "0 0 0 4px rgba(29,78,137,0.12)",
};

const heroSub: React.CSSProperties = {
  marginTop: 10,
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  lineHeight: 1.55,
};

const heroMiniRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  marginTop: 12,
  flexWrap: "wrap",
};

const miniStat: React.CSSProperties = {
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

const miniDot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.14)",
};

const heroLine: React.CSSProperties = {
  marginTop: 12,
  height: 1,
  width: "100%",
  background:
    "linear-gradient(90deg, rgba(29,78,137,0.18) 0%, rgba(29,78,137,0.06) 55%, rgba(29,78,137,0) 100%)",
};

/* ===== Section ===== */

const sectionTitleRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  margin: "10px 6px",
};

const sectionDot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 950,
  color: theme.subtext,
  letterSpacing: 0.22,
  lineHeight: 1.2,
};

const sectionHint: React.CSSProperties = {
  marginTop: 2,
  fontSize: 11,
  fontWeight: 800,
  color: "rgba(15,23,42,0.46)",
  letterSpacing: 0.16,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const sectionRail: React.CSSProperties = {
  flex: 1,
  height: 1,
  background:
    "linear-gradient(90deg, rgba(29,78,137,0.16) 0%, rgba(29,78,137,0.06) 60%, rgba(29,78,137,0) 100%)",
};

const sectionCard: React.CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.76) 100%)",
  borderRadius: 18,
  overflow: "hidden",
  border: "1px solid rgba(29,78,137,0.12)",
  boxShadow: "0 16px 30px rgba(2,6,23,0.06)",
};

/* ===== Row ===== */

const row: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "14px 14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  position: "relative",
  transition: "transform .12s ease, opacity .12s ease, background .14s ease",
};

const rowPressed: React.CSSProperties = {
  transform: "scale(0.992)",
  opacity: 0.94,
};

const rowDisabled: React.CSSProperties = {
  cursor: "default",
  opacity: 0.62,
};

const left: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  minWidth: 0,
};

const iconWrap = (disabled?: boolean): React.CSSProperties => ({
  width: 36,
  height: 36,
  borderRadius: 16,
  display: "grid",
  placeItems: "center",
  border: "1px solid rgba(29,78,137,0.14)",
  color: disabled ? "rgba(15,23,42,0.42)" : theme.primary,
  background: "rgba(255,255,255,0.88)",
  boxShadow: "0 12px 18px rgba(2,6,23,0.06)",
  flexShrink: 0,
});

const rowTitle: React.CSSProperties = {
  fontWeight: 950,
  color: theme.text,
  letterSpacing: 0.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const rowSub: React.CSSProperties = {
  marginTop: 3,
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const rightWrap: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  flexShrink: 0,
};

const chevIcon = (disabled?: boolean): React.CSSProperties => ({
  opacity: disabled ? 0.25 : 0.45,
  color: theme.text,
});

const shine: React.CSSProperties = {
  pointerEvents: "none",
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(140px 70px at 16% 30%, rgba(255,255,255,0.52), rgba(255,255,255,0) 60%)",
  opacity: 0.8,
};

/* ===== Badge / Preview ===== */

const badge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(214,181,138,0.18)",
  border: "1px solid rgba(214,181,138,0.38)",
  color: "rgba(120,82,37,0.92)",
  fontSize: 11,
  fontWeight: 950,
  letterSpacing: 0.3,
};

const badgeDot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.16)",
};

const badgeMuted: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(15,23,42,0.06)",
  border: "1px solid rgba(15,23,42,0.10)",
  color: "rgba(15,23,42,0.48)",
  fontSize: 11,
  fontWeight: 950,
  letterSpacing: 0.3,
};

const badgeDotMuted: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: 999,
  background: "rgba(15,23,42,0.30)",
  boxShadow: "0 0 0 4px rgba(15,23,42,0.06)",
};

const previewWrap: React.CSSProperties = {
  display: "inline-flex",
  gap: 8,
  alignItems: "center",
  padding: "6px 8px",
  borderRadius: 999,
  border: "1px solid rgba(29,78,137,0.12)",
  background: "rgba(255,255,255,0.88)",
  boxShadow: "0 10px 16px rgba(2,6,23,0.05)",
};

const previewDot: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: 999,
};
