"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 💡 ここを編集するだけで、全ページのメニューが一撃で切り替わります！！
const MENU_ITEMS = [
  { href: "/", icon: "🏠", label: "HOME" },
  { href: "/affiliate-links", icon: "🔗", label: "アフィリエイトリンク" },
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
  const pathname = usePathname();

  return (
    <>
      {/* 💡 ここにメニュー専用のCSSを内包させることで、どのページでも絶対にデザインが崩れません！！ */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hamburger-btn { position: fixed; top: 15px; left: 15px; z-index: 1001; background: var(--card-bg, rgba(255,255,255,0.8)); backdrop-filter: blur(15px); border: 1px solid var(--card-border, rgba(200,200,200,0.5)); border-radius: 8px; padding: 8px; cursor: pointer; display: flex; flex-direction: column; gap: 4px; box-shadow: var(--card-shadow, 0 4px 10px rgba(0,0,0,0.1)); transition: 0.3s; }
        .hamburger-btn:hover { background: var(--card-hover-bg, rgba(255,255,255,0.95)); transform: scale(1.05); }
        .hamburger-line { width: 18px; height: 2px; background: var(--text-sub, #475569); border-radius: 2px; transition: 0.4s; }
        .hamburger-btn.open .line1 { transform: translateY(6px) rotate(45deg); background: var(--nav-accent, #0ea5e9); }
        .hamburger-btn.open .line2 { opacity: 0; }
        .hamburger-btn.open .line3 { transform: translateY(-6px) rotate(-45deg); background: var(--nav-accent, #0ea5e9); }
        
        .menu-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(5px); z-index: 999; opacity: 0; pointer-events: none; transition: 0.4s ease; }
        .menu-overlay.open { opacity: 1; pointer-events: auto; }
        
        .side-menu { position: fixed; top: 0; left: -280px; width: 260px; height: 100vh; background: var(--card-bg, rgba(255,255,255,0.9)); backdrop-filter: blur(30px); border-right: 1px solid var(--card-border, rgba(200,200,200,0.5)); z-index: 1000; box-shadow: var(--card-shadow, 0 10px 30px rgba(0,0,0,0.1)); transition: 0.5s; padding: 70px 16px 20px; display: flex; flex-direction: column; gap: 6px; overflow-y: auto; }
        .side-menu.open { left: 0; }
        .menu-title { font-size: 11px; font-weight: 900; color: var(--text-sub, #475569); margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dashed var(--card-border, rgba(200,200,200,0.5)); letter-spacing: 1px; }
        .side-link { text-decoration: none; padding: 10px 14px; border-radius: 8px; background: var(--input-bg, rgba(255,255,255,0.6)); color: var(--text-main, #1e293b); font-weight: 800; border: 1px solid var(--card-border, rgba(200,200,200,0.5)); transition: 0.2s; display: flex; align-items: center; gap: 8px; font-size: 12px;}
        .side-link:hover { border-color: var(--nav-accent, #0ea5e9); transform: translateX(5px); color: var(--nav-accent, #0ea5e9); }
        .side-link.current-page { background: linear-gradient(135deg, var(--nav-accent, #0ea5e9), #4f46e5); color: #fff; border: none; pointer-events: none; box-shadow: 0 4px 10px rgba(14,165,233,0.3); }
      `}} />

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