"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { theme } from "@/lib/theme";
import {
  Home,
  List,
  Repeat,
  Wallet,
  Settings,
  Database,
  Download,
  Tag,
} from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SideMenu({ open, onClose }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* ===== Overlay ===== */}
      <div
        onClick={onClose}
        style={{
          ...overlay,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* ===== Drawer ===== */}
      <aside
        style={{
          ...drawer,
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
        aria-hidden={!open}
      >
        {/* 金ライン */}
        <div style={goldLine} />

        {/* ===== Header ===== */}
        <div style={drawerHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={logoWrap}>
              <div style={logoYen}>¥</div>
              <div style={logoDot} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={menuTitle}>メニュー</div>
              <div style={menuSub}>ショートカット / 設定</div>
            </div>

            <CloseButton onClick={onClose} />
          </div>
        </div>

        {/* ===== Scroll Area ===== */}
        <div style={scrollArea}>
          <MenuSection title="ショートカット">
            <MenuItem
              icon={Home}
              href="/dashboard"
              title="ホーム"
              sub="今日の合計 / ダッシュボード"
              active={pathname === "/dashboard"}
              onClick={onClose}
            />
            <MenuItem
              icon={List}
              href="/list"
              title="一覧"
              sub="明細検索 / フィルター"
              active={pathname === "/list"}
              onClick={onClose}
            />
            <MenuItem
              icon={Repeat}
              href="/subscription"
              title="サブスク"
              sub="定期支払い / 管理"
              active={pathname === "/subscription"}
              onClick={onClose}
            />
            <MenuItem
              icon={Wallet}
              href="/income"
              title="収入"
              sub="入金 / 収入一覧"
              active={pathname === "/income"}
              onClick={onClose}
            />
          </MenuSection>

          <MenuSection title="データ">
            <MenuItem
              icon={Database}
              href="https://docs.google.com/spreadsheets/d/1h7jeQdRQvgwF_PRXLZAPJ7UAVtVEJxbOVK2LATDubuM"
              title="Spreadsheet"
              sub="データ確認 / 直接編集"
              active={false}
              external
            />
            <MenuItem
              icon={Download}
              href="/export"
              title="エクスポート"
              sub="CSV / バックアップ"
              active={pathname === "/export"}
              onClick={onClose}
            />
          </MenuSection>

          <MenuSection title="管理">
            <MenuItem
              icon={Settings}
              href="/settings"
              title="設定"
              sub="表示 / 通知 / 端末"
              active={pathname === "/settings"}
              onClick={onClose}
            />
            <MenuItem
              icon={Tag}
              href="/category"
              title="カテゴリ"
              sub="色 / 並び替え"
              active={pathname === "/category"}
              onClick={onClose}
              last
            />
          </MenuSection>
        </div>
      </aside>
    </>
  );
}

/* ===============================
   Section
================================ */

function MenuSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={sectionTitleRow}>
        <span style={sectionDot} />
        <div style={sectionTitle}>{title}</div>
      </div>

      <div style={sectionCard}>{children}</div>
    </div>
  );
}

/* ===============================
   Item
================================ */

type MenuItemProps = {
  icon: LucideIcon; 
  href: string;
  title: string;
  sub: string;
  active: boolean;
  external?: boolean;
  onClick?: () => void;
  last?: boolean;
};

function MenuItem({
  icon: Icon,
  href,
  title,
  sub,
  active,
  external,
  onClick,
  last,
}: MenuItemProps) {
  const [pressed, setPressed] = useState(false);

  const body = (
    <div
      style={{
        ...itemRow,
        ...(active ? itemActive : {}),
        ...(pressed ? itemPressed : {}),
        borderBottom: last ? "none" : `1px solid rgba(15,23,42,0.06)`,
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
    >
      {/* active 左バー（金） */}
      {active && <div style={activeGoldBar} />}

      <div style={iconWrap(active)}>
        <Icon size={18} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...itemTitle, color: active ? theme.primary : theme.text }}>
          {title}
        </div>
        <div style={itemSub}>{sub}</div>
      </div>

      <div style={chevWrap}>
        <span style={chevDot} />
        <span style={chev}>›</span>
      </div>
    </div>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        style={{ textDecoration: "none" }}
      >
        {body}
      </a>
    );
  }

  return (
    <Link href={href} style={{ textDecoration: "none" }} onClick={onClick}>
      {body}
    </Link>
  );
}

/* ===============================
   Close Button
================================ */

function CloseButton({ onClick }: { onClick: () => void }) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        ...closeBtn,
        ...(pressed ? closeBtnPressed : {}),
      }}
      aria-label="閉じる"
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
    >
      ✕
    </button>
  );
}

/* ===============================
   styles
================================ */

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(2,6,23,0.42)",
  backdropFilter: "blur(8px)",
  transition: "opacity .22s ease",
  zIndex: 90,
};

const drawer: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100dvh",
  width: 306,

  background: theme.surface,
  backdropFilter: "blur(16px)",

  transform: "translateX(-100%)",
  transition: "transform .28s cubic-bezier(.4,0,.2,1)",
  zIndex: 100,

  display: "flex",
  flexDirection: "column",

  borderRight: `1px solid ${theme.border}`,
  boxShadow: "20px 0 60px rgba(2,6,23,0.22)",
};

const goldLine: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 2,
  background: theme.accent,
  opacity: 0.95,
  pointerEvents: "none",
};

const drawerHeader: React.CSSProperties = {
  padding: "18px 16px 12px",
  borderBottom: `1px solid ${theme.border}`,
};

const logoWrap: React.CSSProperties = {
  position: "relative",
  width: 44,
  height: 44,
  borderRadius: 14,
  background: theme.primary, // ✅ 青のみ
  display: "grid",
  placeItems: "center",
  boxShadow: "0 14px 28px rgba(29,78,137,0.22)",
};

const logoYen: React.CSSProperties = {
  color: "white",
  fontWeight: 950,
  fontSize: 18,
  letterSpacing: 0.2,
};

const logoDot: React.CSSProperties = {
  position: "absolute",
  right: -2,
  bottom: -2,
  width: 10,
  height: 10,
  borderRadius: 999,
  background: theme.accent, // ✅ 金
  boxShadow: "0 0 0 4px rgba(214,181,138,0.18)",
};

const menuTitle: React.CSSProperties = {
  fontWeight: 950,
  color: theme.primary,
  letterSpacing: 0.2,
};

const menuSub: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  marginTop: 2,
};

const closeBtn: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 12,
  border: `1px solid ${theme.border}`,
  background: "rgba(255,255,255,0.92)",
  cursor: "pointer",
  color: theme.subtext,
  fontWeight: 900,
  boxShadow: "0 10px 18px rgba(2,6,23,0.10)",
  transition: "transform .12s ease, opacity .12s ease, box-shadow .18s ease",
};

const closeBtnPressed: React.CSSProperties = {
  transform: "scale(0.985)",
  opacity: 0.92,
  boxShadow: "0 8px 14px rgba(2,6,23,0.08)",
};

const scrollArea: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  padding: "10px 16px 22px",
};

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
  fontWeight: 900,
  color: theme.subtext,
  letterSpacing: 0.2,
};

const sectionCard: React.CSSProperties = {
  background: theme.surface,
  borderRadius: 16,
  overflow: "hidden",
  border: `1px solid rgba(29,78,137,0.12)`,
  boxShadow: "0 14px 26px rgba(2,6,23,0.06)",
};

const itemRow: React.CSSProperties = {
  position: "relative",
  display: "flex",
  gap: 12,
  alignItems: "center",
  padding: "13px 14px",
  transition: "background .15s ease, transform .12s ease, opacity .12s ease",
  background: theme.surface,
};

const itemActive: React.CSSProperties = {
  background: "rgba(29,78,137,0.07)", // ✅ 青の面
};

const itemPressed: React.CSSProperties = {
  transform: "scale(0.992)",
  opacity: 0.94,
};

const activeGoldBar: React.CSSProperties = {
  position: "absolute",
  left: 0,
  top: 10,
  bottom: 10,
  width: 3,
  borderRadius: 999,
  background: theme.accent, // ✅ 金
};

const iconWrap = (active: boolean): React.CSSProperties => ({
  width: 34,
  height: 34,
  borderRadius: 14,
  display: "grid",
  placeItems: "center",
  border: `1px solid ${theme.border}`,
  color: active ? theme.primary : theme.subtext,
  background: "rgba(255,255,255,0.9)",
  boxShadow: "0 10px 16px rgba(2,6,23,0.06)",
});

const itemTitle: React.CSSProperties = {
  fontWeight: 900,
  letterSpacing: 0.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const itemSub: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: theme.subtext,
  marginTop: 2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const chevWrap: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  flexShrink: 0,
};

const chevDot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: 999,
  background: theme.accent,
  boxShadow: "0 0 0 4px rgba(214,181,138,0.16)",
};

const chev: React.CSSProperties = {
  fontSize: 22,
  opacity: 0.35,
  color: theme.text,
};
