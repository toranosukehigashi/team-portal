import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// ✨ ここでさっき作ったカスタムカーソルを読み込みます！
import CustomCursor from "./CustomCursor";

const inter = Inter({ subsets: ["latin"] });

// 🌟 ここがブラウザのタブ名や検索結果に出る設定です！
export const metadata: Metadata = {
  title: "Team Portal Workspace",
  description: "業務を加速させる、次世代の統合システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 💡 ついでに、ここを "en" から "ja" に変えて日本語サイトに最適化しました！
    <html lang="ja">
      <body className={inter.className}>
        {/* ✨ bodyの直下に置くことで、全てのページにカーソルが降臨します！ */}
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}