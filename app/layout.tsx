import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalAddressSearch from "@/app/components/GlobalAddressSearch";
import LiveFeedWidget from "@/app/components/LiveFeedWidget"; 
import NextAuthProvider from "./NextAuthProvider"; // 🌟 後ほど作成するクライアントコンポーネント

const inter = Inter({ subsets: ["latin"] });

// 🌟 メタデータはサーバーコンポーネントとしてしっかり維持！
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
        
        {/* 💡 【最強の重なり防止策】を完全継承 */}
        <style dangerouslySetInnerHTML={{ __html: `
          .portal-header {
            position: relative;
            z-index: 10000;
            padding-right: 380px !important;
          }
          @media (max-width: 1200px) {
            .portal-header {
              padding-right: 20px !important;
            }
            .rainbow-border-wrapper {
              top: 80px !important;
            }
            .fixed.top-\\[85px\\] {
              top: 150px !important;
            }
          }
        `}} />

        {/* 🌟 AuthGuardを「NextAuthProvider」に変更して包む！ */}
        <NextAuthProvider>
          <GlobalAddressSearch />
          <LiveFeedWidget />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}