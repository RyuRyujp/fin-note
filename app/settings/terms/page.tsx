// app/settings/terms/page.tsx
"use client";

import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import SideMenu from "@/components/layout/SideMenu";
import TabBar from "@/components/nav/TabBar/Index";
import { theme } from "@/lib/theme";
import { FileText, ShieldCheck, ScrollText } from "lucide-react";

export default function TermsPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <AppHeader title="MoneyNote" subtitle="利用規約" onMenu={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main style={page}>
        <div style={container}>
          <div style={heroCard}>
            <div style={heroTopRow}>
              <div style={heroLeft}>
                <div style={iconBadge}>
                  <FileText size={16} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={heroTitle}>利用規約（ドラフト）</div>
                  <div style={heroSub}>個人利用向けの簡易版です（後で正式版に差し替え）</div>
                </div>
              </div>

              <div style={pill}>
                <span style={pillDot} />
                Draft
              </div>
            </div>

            <div style={heroLine} />
          </div>

          <div style={docCard}>
            <DocSection
              icon={<ShieldCheck size={18} />}
              title="1. 利用について"
              body={
                <>
                  <p style={p}>
                    MoneyNote は、個人の家計管理を目的としたアプリです。ユーザーは自己責任で本アプリを利用し、
                    記録内容の正確性や保存結果についてはユーザー自身が確認してください。
                  </p>
                  <p style={p}>
                    本アプリは予告なく仕様変更・停止される場合があります。
                  </p>
                </>
              }
            />

            <Divider />

            <DocSection
              icon={<ScrollText size={18} />}
              title="2. データの取り扱い"
              body={
                <>
                  <p style={p}>
                    入力されたデータは、アプリ内の保存先（あなたの実装：スプレッドシート / API 等）に記録されます。
                    重要なデータは定期的にバックアップしてください。
                  </p>
                  <p style={p}>
                    本アプリの利用により発生した損害について、開発者は責任を負いません。
                  </p>
                </>
              }
              last
            />
          </div>

          <div style={note}>
            ※ このページは仮です。公開する場合は、プライバシーポリシーやお問い合わせ窓口も追加するのがおすすめです。
          </div>
        </div>
      </main>

      <TabBar />
    </>
  );
}

function DocSection({
  icon,
  title,
  body,
  last,
}: {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div style={{ padding: 14, borderBottom: last ? "none" : "1px solid rgba(15,23,42,0.07)" }}>
      <div style={secHead}>
        <div style={secIcon}>{icon}</div>
        <div style={secTitle}>{title}</div>
      </div>
      <div style={secBody}>{body}</div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(15,23,42,0.07)" }} />;
}

/* styles */
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
  paddingBottom: 110,
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

const heroTopRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
};

const heroLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  minWidth: 0,
};

const iconBadge: React.CSSProperties = {
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

const pill: React.CSSProperties = {
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
};

const pillDot: React.CSSProperties = {
  width: 7,
  height: 7,
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

const docCard: React.CSSProperties = {
  marginTop: 14,
  borderRadius: 18,
  overflow: "hidden",
  border: "1px solid rgba(29,78,137,0.12)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.78) 100%)",
  boxShadow: "0 16px 30px rgba(2,6,23,0.06)",
};

const secHead: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const secIcon: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 16,
  display: "grid",
  placeItems: "center",
  border: "1px solid rgba(29,78,137,0.14)",
  background: "rgba(255,255,255,0.88)",
  color: theme.primary,
  boxShadow: "0 12px 18px rgba(2,6,23,0.06)",
  flexShrink: 0,
};

const secTitle: React.CSSProperties = {
  fontWeight: 950,
  color: theme.text,
  letterSpacing: 0.2,
};

const secBody: React.CSSProperties = {
  marginTop: 10,
};

const p: React.CSSProperties = {
  margin: "0 0 10px 0",
  fontSize: 13,
  fontWeight: 800,
  color: "rgba(15,23,42,0.70)",
  lineHeight: 1.7,
};

const note: React.CSSProperties = {
  marginTop: 10,
  fontSize: 12,
  fontWeight: 800,
  color: "rgba(15,23,42,0.55)",
};
