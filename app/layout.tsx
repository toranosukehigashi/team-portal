import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthGuard from "./AuthGuard"; // 🛡️ 先ほど作った鉄壁の門番を呼び出す！
import GlobalAddressSearch from "@/app/components/GlobalAddressSearch"; // 👈 魔法の検索バーをインポート！


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
        
        {/* 🛡️ アプリのすべてを門番で包み込む！これで全ページに一撃で鍵がかかる！ */}
        <AuthGuard>
          {/* 🌐 グローバル住所検索バー！AuthGuardの内側に置くことで、ログイン後のみ表示されます！ */}
          <GlobalAddressSearch />
          
          {children}
        </AuthGuard>
        
      </body>
    </html>
  );
}