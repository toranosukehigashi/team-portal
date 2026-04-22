"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 💡 ここを編集するだけで、全ページのメニューが一撃で切り替わります！！
// （HOME画面のカードの項目名と完全に一致させています！）
const MENU_ITEMS = [
  { href: "/", icon: "🏠", label: "司令室 (HOME)" },
  { href: "/affiliate-links", icon: "🔗", label: "OBJリンクポータル" },
  { href: "/kpi-detail", icon: "📊", label: "獲得進捗・KPI" },
  { href: "/bulk-register", icon: "📦", label: "データ一括登録" },
  { href: "/net-toss", icon: "🌐", label: "ネットトス連携" },
  { href: "/self-close", icon: "🤝", label: "自己クロ連携" },
  { href: "/sms-kraken", icon: "📱", label: "SMS 送信" },
  { href: "/email-template", icon: "✉️", label: "メールテンプレ" },
  { href: "/procedure-wizard", icon: "🐙", label: "Kraken マニュアル" },
  { href: "/simulator", icon: "🆚", label: "料金シミュレーター" },
];

export default function SideMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); // 💡 現在いるページのURLを自動で取得！

  return (
    <>
      {/* 🍔 ハンバーガーボタン */}
      <div className={`hamburger-btn ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <div className="hamburger-line line1"></div>
        <div className="hamburger-line line2"></div>
        <div className="hamburger-line line3"></div>
      </div>

      {/* 🌌 メニュー展開時の背景オーバーレイ */}
      <div className={`menu-overlay ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(false)}></div>

      {/* 🗄️ サイドメニュー本体 */}
      <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="menu-title">🧭 TOOL MENU</div>
        
        {MENU_ITEMS.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            // 💡 現在のページと一致していれば、自動で「current-page（色付き）」にする魔法！
            className={`side-link ${pathname === item.href ? "current-page" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}