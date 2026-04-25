import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthGuard from "./AuthGuard"; 
import GlobalAddressSearch from "@/app/components/GlobalAddressSearch";
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
        
        {/* 💡 【最強の重なり防止策】 */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* ヘッダーの右側に「小窓専用のスペース」を強制確保 */
          .portal-header {
            position: relative;
            z-index: 10000;
            /* 小窓(約350px幅)と被らないよう、右側に巨大な余白を作る */
            padding-right: 380px !important;
          }

          /* 画面幅が1200px以下のノートPC等の場合、さらに小窓を下に避ける */
          @media (max-width: 1200px) {
            .portal-header {
              padding-right: 20px !important; /* ボタンを左に寄せず、小窓を下に落とす */
            }
            .rainbow-border-wrapper {
              top: 80px !important; /* 住所検索をヘッダーの下へ */
            }
            .fixed.top-\\[85px\\] {
              top: 150px !important; /* LIVE FEEDをさらにその下へ */
            }
          }
        `}} />

        <AuthGuard>
          <GlobalAddressSearch />
          <LiveFeedWidget />
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}