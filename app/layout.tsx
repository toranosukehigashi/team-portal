import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthGuard from "./AuthGuard"; 
import GlobalAddressSearch from "@/app/components/GlobalAddressSearch";

// 💡 作成したウィジェットをインポート！
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
        
        {/* 💡 【修正ポイント】レイアウト・Z-indexのグローバル調整CSS */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* 1. ヘッダーを常に最前面に配置（退勤・ログアウトボタンを保護） */
          .portal-header {
            position: relative;
            z-index: 9999999 !important; /* 小窓の99999より高く設定 */
          }

          /* 2. 画面幅が狭い場合（ノートPCなど）の小窓の自動退避処理 */
          @media (max-width: 1250px) {
            /* 住所検索バーを少し下（ヘッダーの下）にずらす */
            .rainbow-border-wrapper {
              top: 75px !important;
            }
            /* Live Feedの配置（トップ）を少し下にずらす */
            .fixed.top-\\[85px\\] {
              top: 140px !important;
            }
          }
        `}} />

        <AuthGuard>
          {/* グローバルコンポーネント（小窓たち） */}
          <GlobalAddressSearch />
          <LiveFeedWidget />
          
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}