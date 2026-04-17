import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
    // 💡 日本語サイトに最適化！
    <html lang="ja">
      <body className={inter.className}>
        {/* ✨ 激重だったカスタムカーソルを完全に消し去りました！これで動作は超サクサクです！ */}
        {children}
      </body>
    </html>
  );
}