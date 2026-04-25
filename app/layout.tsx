import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthGuard from "./AuthGuard"; 
import GlobalAddressSearch from "@/app/components/GlobalAddressSearch";

// 💡 1. 作成したウィジェットをインポート！
import LiveFeedWidget from "@/app/components/LiveFeedWidget"; 

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="ja">
      <body className={inter.className}>
        <AuthGuard>
          <GlobalAddressSearch />
          
          {/* 💡 2. ここに置くだけで全ページにLive Feedが追従します！ */}
          <LiveFeedWidget />
          
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}