import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata = {
  title: "MoneyNote",
  manifest: "/manifest.json",
};

import ThemeBoot from "@/components/providers/ThemeBoot";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <ThemeBoot />
        {children}
      </body>
    </html>
  );
}
