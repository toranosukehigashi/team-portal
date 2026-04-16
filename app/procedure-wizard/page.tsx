"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ✨ 背景のエナジー・パーティクル
const EnergyParticles = () => {
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; delay: string; size: string; type: string }[]>([]);
  useEffect(() => {
    const types = ['particle-pink', 'particle-cyan'];
    const generatedParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      delay: `${Math.random() * 5}s`,
      size: `${Math.random() * 4 + 2}px`,
      type: types[Math.floor(Math.random() * types.length)]
    }));
    setParticles(generatedParticles);
  }, []);
  return (
    <div className="particles-container">
      {particles.map(p => (
        <div key={p.id} className={`particle ${p.type}`} style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDelay: p.delay }} />
      ))}
    </div>
  );
};

type MenuId = 
  | "plan_change" | "cancel_process" | "status_check" 
  | "sw_error" | "email_dup" | "bh_process" | "move_out" 
  | "recent_repoint" | "invalid_address" | "address_spin";

export default function ProcedureWizard() {
  const router = useRouter();

  // 🌟 状態管理
  const [activeTab, setActiveTab] = useState<MenuId>("plan_change");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  // 🗂️ 統合されたメニューリスト
  const menuItems: { id: MenuId; icon: string; label: string }[] = [
    { id: "plan_change", icon: "📝", label: "プラン変更" },
    { id: "cancel_process", icon: "❌", label: "申込取消" },
    { id: "status_check", icon: "⚡", label: "キャンセル確認" },
    { id: "sw_error", icon: "⚙️", label: "SWエラー対応" }, // トラブルナビから移植
    { id: "email_dup", icon: "📧", label: "メアド重複対処法" }, // トラブルナビのUIで更新
    { id: "bh_process", icon: "🗑️", label: "無効化＆BH処理" }, // トラブルナビのUIで更新
    { id: "move_out", icon: "📦", label: "MOVE OUT（未完成）" },
    { id: "recent_repoint", icon: "⏱️", label: "直近再点対応" },
    { id: "invalid_address", icon: "🚫", label: "無効なアドレス対処法" },
    { id: "address_spin", icon: "🏠", label: "住所変更＆SPIN入力" }
  ];

  useEffect(() => {
    setIsReady(true);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    showToast(!isDarkMode ? "🌙 ダークモードに切り替えました" : "☀️ ライトモードに切り替えました");
  };

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  return (
    <>
      <div className={`entrance-bg ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <EnergyParticles />
      </div>

      <main className={`app-wrapper ${isReady ? "ready" : ""} ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <style dangerouslySetInnerHTML={{ __html: `
          .app-wrapper * { box-sizing: border-box; }

          /* 🐙 オクトパスエナジー公式カラーテーマ */
          .theme-light {
            --bg-gradient: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #fce7f3 100%);
            --text-main: #1e293b;
            --text-sub: #475569;
            --card-bg: rgba(255, 255, 255, 0.85);
            --card-border: rgba(255, 255, 255, 1);
            --card-hover-border: #e5007e;
            --card-hover-bg: rgba(255, 255, 255, 0.95);
            --card-shadow: 0 10px 30px rgba(0,0,0,0.05);
            --title-color: #1f0e45;
            --accent-pink: #e5007e;
            --accent-cyan: #00c4b5;
            --input-bg: rgba(255, 255, 255, 0.9);
            /* ✨ SVGの線の透明度を極限まで下げる（濃くする） */
            --svg-color: rgba(229, 0, 126, 0.6); /* クッキリ濃く */
          }
          
          .theme-dark {
            --bg-gradient: radial-gradient(ellipse at top left, #1f0e45 0%, #020617 100%);
            --text-main: #f8fafc;
            --text-sub: #cbd5e1;
            --card-bg: rgba(15, 23, 42, 0.65);
            --card-border: rgba(255, 255, 255, 0.1);
            --card-hover-border: #00c4b5;
            --card-hover-bg: rgba(30, 41, 59, 0.85);
            --card-shadow: 0 20px 50px rgba(0,0,0,0.8);
            --title-color: #00c4b5; 
            --accent-pink: #f43f5e;
            --accent-cyan: #2dd4bf;
            --input-bg: rgba(0, 0, 0, 0.4);
            /* ✨ SVGの線の透明度を極限まで下げる（濃くする） */
            --svg-color: rgba(0, 196, 181, 0.8); /* クッキリ濃く */
          }

          .app-wrapper { 
            min-height: 100vh; padding: 20px 40px 100px 40px; 
            font-family: 'Inter', 'Noto Sans JP', sans-serif; 
            color: var(--text-main); font-size: 14px; 
            transition: color 0.5s; overflow-x: hidden; position: relative;
          }

          .entrance-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -2; transition: background 0.8s ease; }
          .entrance-bg.theme-light { background: var(--bg-gradient); }
          .entrance-bg.theme-dark { background: var(--bg-gradient); }

          .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; }
          .particle { position: absolute; border-radius: 50%; animation: energyFlow 6s infinite cubic-bezier(0.2, 0.8, 0.2, 1); transition: 0.5s; }
          .particle-pink { background: var(--accent-pink); box-shadow: 0 0 12px var(--accent-pink); }
          .particle-cyan { background: var(--accent-cyan); box-shadow: 0 0 12px var(--accent-cyan); }
          @keyframes energyFlow { 0% { opacity: 0; transform: translateY(30px) scale(0.5); } 50% { opacity: 0.6; transform: translateY(-40px) scale(1.5); } 100% { opacity: 0; transform: translateY(-100px) scale(0.5); } }

          /* 🌟 テンタクル・ウェーブ（SVG背景）: クッキリ発光＆本数増量！ */
          .energy-svg-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none; opacity: 1; }
          .energy-path { 
            fill: none; stroke: var(--svg-color); 
            stroke-width: 6; /* ✨ 太く */
            stroke-dasharray: 2000; stroke-dashoffset: 2000; 
            animation: drawEnergy 12s ease-in-out infinite alternate; transition: stroke 0.5s; 
            /* ✨ 発光（drop-shadow）をより広く、強く！ */
            filter: drop-shadow(0 0 20px var(--svg-color)); 
          }
          @keyframes drawEnergy { 0% { stroke-dashoffset: 2000; } 100% { stroke-dashoffset: 0; } }

          /* ハンバーガーボタン */
          .hamburger-btn { position: fixed; top: 20px; left: 20px; z-index: 1001; background: var(--card-bg); backdrop-filter: blur(15px); border: 1px solid var(--card-border); border-radius: 12px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; gap: 5px; box-shadow: var(--card-shadow); transition: 0.3s; }
          .hamburger-btn:hover { background: var(--card-hover-bg); transform: scale(1.05); }
          .hamburger-line { width: 22px; height: 3px; background: var(--text-sub); border-radius: 3px; transition: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
          .hamburger-btn.open .line1 { transform: translateY(8px) rotate(45deg); background: var(--accent-cyan); }
          .hamburger-btn.open .line2 { opacity: 0; transform: translateX(-10px); }
          .hamburger-btn.open .line3 { transform: translateY(-8px) rotate(-45deg); background: var(--accent-cyan); }

          .menu-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(5px); z-index: 999; opacity: 0; pointer-events: none; transition: 0.4s ease; }
          .menu-overlay.open { opacity: 1; pointer-events: auto; }

          /* サイドメニュー */
          .side-menu { position: fixed; top: 0; left: -320px; width: 300px; height: 100vh; background: var(--card-bg); backdrop-filter: blur(30px); border-right: 1px solid var(--card-border); z-index: 1000; box-shadow: var(--card-shadow); transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); padding: 90px 24px 30px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
          .side-menu.open { left: 0; }
          .menu-title { font-size: 13px; font-weight: 900; color: var(--title-color); margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed var(--card-border); letter-spacing: 1px; }

          .side-link { text-decoration: none; padding: 14px 20px; border-radius: 14px; background: var(--input-bg); color: var(--text-main); font-weight: 800; font-size: 14px; border: 1px solid var(--card-border); transition: all 0.2s; display: flex; align-items: center; gap: 12px; }
          .side-link:hover { border-color: var(--card-hover-border); transform: translateX(8px); color: var(--accent-cyan); }
          .side-link.current-page { background: linear-gradient(135deg, var(--accent-pink), #be123c); color: #fff; border: none; box-shadow: 0 6px 15px rgba(229, 0, 126, 0.3); pointer-events: none; }

          /* 🎈 ナビゲーション */
          .glass-nav-wrapper { display: flex; justify-content: center; margin-bottom: 30px; }
          .glass-nav { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: var(--card-bg); backdrop-filter: blur(16px); border: 1px solid var(--card-border); border-radius: 50px; box-shadow: var(--card-shadow); max-width: 800px; width: 100%; }
          .nav-left { display: flex; gap: 12px; align-items: center; }
          .glass-nav-link { text-decoration: none; padding: 10px 20px; border-radius: 30px; font-weight: 800; background: var(--input-bg); color: var(--text-sub); border: 1px solid var(--card-border); transition: 0.2s; font-size: 14px; }
          .glass-nav-link:hover { color: var(--accent-cyan); border-color: var(--card-hover-border); }
          .glass-nav-active { padding: 10px 20px; border-radius: 30px; font-weight: 900; background: var(--card-hover-bg); color: var(--accent-pink); border: 1px solid var(--accent-pink); font-size: 14px; }
          .theme-dark .glass-nav-active { color: var(--accent-cyan); border-color: var(--accent-cyan); }

          .theme-toggle-btn { background: var(--input-bg); border: 1px solid var(--card-border); padding: 10px 20px; border-radius: 30px; cursor: pointer; transition: 0.3s; font-size: 14px; color: var(--text-main); font-weight: 800; }
          .theme-toggle-btn:hover { border-color: var(--card-hover-border); transform: scale(1.05); }

          /* 🌟 レイアウト：Bento UI */
          .main-layout { display: grid; grid-template-columns: 280px 1fr; gap: 30px; max-width: 1200px; margin: 0 auto; }
          @media (max-width: 850px) { .main-layout { grid-template-columns: 1fr; } }

          /* Left Sidebar */
          .manual-sidebar { display: flex; flex-direction: column; gap: 10px; }
          .topic-btn { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 16px; padding: 16px 20px; text-align: left; font-weight: 800; font-size: 14px; color: var(--text-sub); cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 12px; box-shadow: var(--card-shadow); }
          .topic-btn:hover { background: var(--card-hover-bg); border-color: var(--accent-cyan); color: var(--accent-cyan); transform: translateX(5px); }
          .topic-btn.active { background: var(--card-hover-bg); color: var(--accent-pink); border-color: var(--accent-pink); border-left: 6px solid var(--accent-pink); box-shadow: 0 10px 20px rgba(229, 0, 126, 0.1); pointer-events: none; }
          .theme-dark .topic-btn.active { color: var(--accent-cyan); border-color: var(--accent-cyan); box-shadow: 0 10px 20px rgba(0, 196, 181, 0.15); border-left: 6px solid var(--accent-cyan); }

          /* 右コンテンツ */
          .dictionary-card { background: var(--card-bg); backdrop-filter: blur(25px); border: 1px solid var(--card-border); border-radius: 24px; padding: 40px; box-shadow: var(--card-shadow); animation: slideIn 0.4s ease-out forwards; }
          @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

          .card-title { font-size: 24px; font-weight: 900; color: var(--title-color); margin: 0 0 30px 0; display: flex; align-items: center; gap: 12px; border-bottom: 2px dashed var(--card-border); padding-bottom: 15px; }

          .step-list { display: flex; flex-direction: column; gap: 16px; }
          .step-item { display: flex; align-items: flex-start; gap: 16px; padding: 20px; background: var(--input-bg); border-radius: 16px; border: 1px solid var(--input-border); transition: 0.3s; box-shadow: inset 0 2px 5px rgba(0,0,0,0.02); }
          .step-item:hover { border-color: var(--card-hover-border); transform: translateX(5px); box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
          
          .step-badge { width: 36px; height: 36px; background: linear-gradient(135deg, var(--accent-cyan), var(--accent-pink)); color: #fff; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
          
          .step-text { font-size: 15px; font-weight: 700; color: var(--text-main); line-height: 1.6; padding-top: 6px; }
          .step-text b { color: var(--accent-pink); background: linear-gradient(transparent 70%, rgba(229,0,126,0.1) 0%); padding: 0 4px; border-radius: 4px; }
          .theme-dark .step-text b { color: var(--accent-cyan); background: linear-gradient(transparent 70%, rgba(0,196,181,0.2) 0%); }

          /* トラブルナビ用 解決パネル */
          .solution-panel { background: rgba(16, 185, 129, 0.1); border: 2px solid rgba(16, 185, 129, 0.4); padding: 20px; border-radius: 16px; margin-top: 20px; text-align: left; }
          .solution-title { font-weight: 900; color: #10b981; font-size: 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }

          /* 特殊ステータス表示 */
          .status-box { margin-top: 30px; padding: 24px; border-radius: 20px; border: 2px dashed var(--card-border); background: var(--input-bg); text-align: center; }
          .status-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px; }
          .status-item { padding: 20px; border-radius: 16px; text-align: center; font-family: 'Inter', sans-serif; }
          .status-ok { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.4); color: #10b981; }
          .status-ng { background: rgba(225, 29, 72, 0.1); border: 1px solid rgba(225, 29, 72, 0.4); color: #e11d48; }
          .status-label { font-size: 13px; font-weight: 800; margin-bottom: 8px; opacity: 0.8; }
          .status-val { font-size: 20px; font-weight: 900; }

          .note-tag { display: inline-block; padding: 10px 16px; background: rgba(245, 158, 11, 0.1); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; font-size: 13px; font-weight: 800; margin-top: 20px; display: flex; align-items: center; gap: 8px; }

          #toast { visibility: hidden; position: fixed; bottom: 40px; right: 40px; background: var(--card-hover-bg); color: var(--accent-pink); border: 1px solid var(--accent-pink); padding: 16px 24px; border-radius: 12px; font-weight: 800; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 200; opacity: 0; transition: 0.4s; backdrop-filter: blur(10px); }
          #toast.show { visibility: visible; opacity: 1; transform: translateY(-10px); }

          .fade-up-element { opacity: 0; transform: translateY(40px); transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
          .fade-up-element.visible { opacity: 1; transform: translateY(0); }
        `}} />

        {/* 🌟 🐙 オクトパス・テンタクル（SVG背景）: クッキリ発光＆8本増量！ */}
        <svg className="energy-svg-bg" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* 1本目: メイン (delay: 0s, opacity: 1) */}
          <path className="energy-path" d="M -10,50 Q 25,20 50,50 T 110,50" />
          
          {/* 2本目: (delay: 2s, opacity: 0.8) */}
          <path className="energy-path" d="M -10,80 Q 30,100 60,60 T 110,20" style={{animationDelay: "2s", opacity: 0.8}} />
          
          {/* 3本目: (delay: 4s, opacity: 0.6) */}
          <path className="energy-path" d="M -10,20 Q 40,80 70,30 T 110,90" style={{animationDelay: "4s", opacity: 0.6}} />
          
          {/* 4本目: (delay: 6s, opacity: 0.5) */}
          <path className="energy-path" d="M -10,100 Q 45,60 80,110 T 110,110" style={{animationDelay: "6s", opacity: 0.5}} />
          
          {/* 5本目: (delay: 1s, opacity: 0.4) */}
          <path className="energy-path" d="M -10,30 Q 30,10 60,40 T 110,0" style={{animationDelay: "1s", opacity: 0.4}} />
          
          {/* 6本目: (delay: 3s, opacity: 0.3) */}
          <path className="energy-path" d="M -10,70 Q 40,50 70,80 T 110,40" style={{animationDelay: "3s", opacity: 0.3}} />

          {/* 7本目: (delay: 5s, opacity: 0.2) */}
          <path className="energy-path" d="M -10,0 Q 20,30 50,0 T 110,30" style={{animationDelay: "5s", opacity: 0.2}} />

          {/* 8本目: (delay: 7s, opacity: 0.1) */}
          <path className="energy-path" d="M -10,90 Q 50,70 80,90 T 110,60" style={{animationDelay: "7s", opacity: 0.1}} />
        </svg>

        {/* 🍔 ハンバーガーボタン */}
        <div className={`hamburger-btn ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className="hamburger-line line1"></div>
          <div className="hamburger-line line2"></div>
          <div className="hamburger-line line3"></div>
        </div>

        <div className={`menu-overlay ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(false)}></div>

        {/* 🗄️ サイドメニュー（トラブル解決ナビは辞書に統合されたため削除） */}
        <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
          <div className="menu-title">🧭 TOOL MENU</div>
          <a href="/kpi-detail" className="side-link">📊 獲得進捗・KPI</a>
          <a href="/bulk-register" className="side-link">📦 データ一括登録</a>
          <a href="/net-toss" className="side-link">🌐 ネットトス連携</a>
          <a href="/self-close" className="side-link">🤝 自己クロ連携</a>
          <a href="/sms-kraken" className="side-link">📱 SMS (Kraken)送信</a>
          <a href="/email-template" className="side-link">✉️ メールテンプレート</a>
          <a href="/procedure-wizard" className="side-link current-page">🗺️ Kraken 手順辞書</a>
          <a href="/simulator" className="side-link">🆚 料金シミュレーター</a>
        </div>

        {/* 🎈 ナビゲーション & テーマ切り替え */}
        <div className="glass-nav-wrapper fade-up-element" style={{ "--delay": "0s" } as any}>
          <div className="glass-nav">
            <div className="nav-left">
              <a href="/" className="glass-nav-link">← 司令室に戻る</a>
              <div className="glass-nav-active">🐙 Kraken 手順辞書（トラブル解決統合版）</div>
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {isDarkMode ? "🎇 NIGHT" : "☀️ DAY"}
            </button>
          </div>
        </div>

        {/* 🌟 メインレイアウト（Bento UI） */}
        <div className="main-layout">
          
          {/* 🗂️ 左側：ローカル・マニュアルメニュー */}
          <aside className="manual-sidebar fade-up-element">
            {menuItems.map((item, index) => (
              <button 
                key={item.id}
                className={`topic-btn ${activeTab === item.id ? "active" : ""}`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setActiveTab(item.id)}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </aside>

          {/* 📖 右側：マニュアルコンテンツ */}
          <div className="form-main-area">
            
            {/* --- 📝 プラン変更 --- */}
            {activeTab === "plan_change" && (
              <div className="dictionary-card">
                <h2 className="card-title">📝 プラン変更の手順</h2>
                <div className="step-list">
                  <div className="step-item"><div className="step-badge">1</div><div className="step-text">Kraken画面内の <b>「契約」</b> タブをクリック</div></div>
                  <div className="step-item"><div className="step-badge">2</div><div className="step-text"><b>「料金メニュー変更」</b> ボタンをクリック</div></div>
                  <div className="step-item"><div className="step-badge">3</div><div className="step-text"><b>「全商品を含む」</b> のチェックをONにする</div></div>
                  <div className="step-item"><div className="step-badge">4</div><div className="step-text">表示された <b>Product</b> のリストから、変更先のプランを選択し保存</div></div>
                </div>
              </div>
            )}

            {/* --- ❌ 申込取消 --- */}
            {activeTab === "cancel_process" && (
              <div className="dictionary-card">
                <h2 className="card-title">❌ 申込取消の手順</h2>
                <div className="step-list">
                  <div className="step-item"><div className="step-badge">1</div><div className="step-text">対象アカウントのダッシュボードで <b>「取消にする」</b> をクリック</div></div>
                  <div className="step-item"><div className="step-badge">2</div><div className="step-text"><b>「ユーザータブ」</b> へ移動し <b>「編集」</b> をクリック</div></div>
                  <div className="step-item"><div className="step-badge">3</div><div className="step-text"><b>「お客様がメールアドレスを持っていない」</b> にチェックを入れる</div></div>
                  <div className="step-item" style={{ borderColor: "rgba(245, 158, 11, 0.3)", background: "rgba(245, 158, 11, 0.05)" }}>
                    <div className="step-badge" style={{ background: "#f59e0b", boxShadow: "none" }}>!</div>
                    <div className="step-text" style={{ color: "#d97706" }}>警告が表示されますが、そのまま <b>「無視」</b> して進めてOKです。</div>
                  </div>
                </div>
              </div>
            )}

            {/* --- ⚡ キャンセル確認 --- */}
            {activeTab === "status_check" && (
              <div className="dictionary-card">
                <h2 className="card-title">⚡ キャンセル状況の確認方法</h2>
                <div className="step-list">
                  <div className="step-item"><div className="step-badge">1</div><div className="step-text"><b>「インダストリー⚡️」</b> タブから該当地点情報を検索する</div></div>
                  <div className="step-item"><div className="step-badge">2</div><div className="step-text"><b>「異動申込受付情報」</b> の現在のステータスを確認する</div></div>
                </div>
                <div className="status-box">
                  <div style={{ fontSize: "14px", fontWeight: 900, textAlign: "center", color: "var(--text-sub)", letterSpacing: "1px" }}>ステータス判定ガイド</div>
                  <div className="status-grid">
                    <div className="status-item status-ok"><div className="status-label">完了（正常）</div><div className="status-val">None</div></div>
                    <div className="status-item status-ng"><div className="status-label">未完了（処理中）</div><div className="status-val">再点 / 申込処理中</div></div>
                  </div>
                  <div className="note-tag">💡 判定基準：Noneと表示されていれば、キャンセル処理は無事に完了しています。</div>
                </div>
              </div>
            )}

            {/* --- ⚙️ SWエラー対応 (トラブルナビから統合) --- */}
            {activeTab === "sw_error" && (
              <div className="dictionary-card">
                <h2 className="card-title">⚙️ スイッチング(SW)エラーへの対応</h2>
                <div className="step-list">
                  <div className="step-item">
                    <div className="step-badge">1</div>
                    <div className="step-text"><b>供給地点特定番号（22桁）</b>が現在の電力会社のものと完全に一致しているか確認してください。</div>
                  </div>
                  <div className="step-item">
                    <div className="step-badge">2</div>
                    <div className="step-text">名義人が現在契約中の名義（旧姓や家族名義でないか）と一致しているか確認。</div>
                  </div>
                </div>
                <div className="status-box">
                  <div style={{ fontWeight: 900, color: "var(--text-sub)", marginBottom: "15px" }}>💡 チェック後のアクション</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <div className="solution-panel" style={{ background: "rgba(225, 29, 72, 0.1)", borderColor: "rgba(225, 29, 72, 0.4)", marginTop: 0 }}>
                      <div className="solution-title" style={{ color: "#e11d48" }}>❌ 番号/名義ミス</div>
                      <div style={{ fontSize: "12px", color: "var(--text-main)", fontWeight: 800 }}>正しい情報を再確認し、システム上の情報を修正して<b>再連携</b>を行ってください。</div>
                    </div>
                    <div className="solution-panel" style={{ marginTop: 0 }}>
                      <div className="solution-title">✅ 全て一致している</div>
                      <div style={{ fontSize: "12px", color: "var(--text-main)", fontWeight: 800 }}>特殊な契約状態の可能性があるため、<b>管理者へエスカレーション</b>してください。</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- 📧 メアド重複 (トラブルナビから統合リッチ版) --- */}
            {activeTab === "email_dup" && (
              <div className="dictionary-card">
                <h2 className="card-title">📧 メールアドレス重複エラーへの対応</h2>
                <div className="step-list">
                  <div className="step-item">
                    <div className="step-badge">1</div>
                    <div className="step-text">ユーザー検索で<b>重複している過去アカウント</b>を特定します。</div>
                  </div>
                  <div className="step-item">
                    <div className="step-badge">2</div>
                    <div className="step-text">過去のアカウントが現在も「有効」かを確認します。</div>
                  </div>
                </div>
                <div className="solution-panel" style={{ marginTop: "30px" }}>
                  <div className="solution-title">💡 解決策 A：エイリアスの活用</div>
                  <div style={{ fontSize: "13px", color: "var(--text-main)", fontWeight: 700 }}>
                    Gmail等の場合、既存アドレスに<b>「+1」</b>などを付けたアドレスでの登録をご案内してください。<br/>
                    例: sample<b>+1</b>@gmail.com
                  </div>
                </div>
                <div className="solution-panel" style={{ marginTop: "15px", background: "rgba(59, 130, 246, 0.1)", borderColor: "rgba(59, 130, 246, 0.4)" }}>
                  <div className="solution-title" style={{ color: "#2563eb" }}>💡 解決策 B：完全削除依頼</div>
                  <div style={{ fontSize: "13px", color: "var(--text-main)", fontWeight: 700 }}>
                    旧アカウントが不要な場合は、サポート窓口へ<b>「退会処理（データ削除）」</b>を依頼してから再登録を行ってください。
                  </div>
                </div>
              </div>
            )}

            {/* --- ❌ 無効化＆BH処理 (トラブルナビから統合版) --- */}
            {activeTab === "bh_process" && (
              <div className="dictionary-card">
                <h2 className="card-title">🗑️ 無効化 ＆ ブラックホール(BH)処理</h2>
                <div className="step-list">
                  <div className="step-item">
                    <div className="step-badge">1</div>
                    <div className="step-text">Kraken上でステータスを<b>「無効（Inactive）」</b>に変更します。</div>
                  </div>
                  <div className="step-item">
                    <div className="step-badge">2</div>
                    <div className="step-text">BH処理用専用シートへ<b>顧客IDと理由</b>を正確に入力してください。</div>
                  </div>
                  <div className="step-item">
                    <div className="step-badge">3</div>
                    <div className="step-text">完了！翌日のバッチ処理で自動的に除外されます。</div>
                  </div>
                </div>
                <div style={{ marginTop: "30px", padding: "15px", background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.4)", borderRadius: "12px", fontSize: "13px", fontWeight: 800, color: "#d97706" }}>
                  ⚠️ 注意：お客様には「キャンセル処理が完了しました」とお伝えして問題ありません。
                </div>
              </div>
            )}

            {/* --- 📦 MOVE OUT（未完成） --- */}
            {activeTab === "move_out" && (
              <div className="dictionary-card">
                <h2 className="card-title">📦 MOVE OUT（引越退去）処理</h2>
                <div className="step-list">
                  <div className="step-item"><div className="step-badge">1</div><div className="step-text">対象物件の <b>「契約情報」</b> タブを開く</div></div>
                  <div className="step-item"><div className="step-badge">2</div><div className="step-text"><b>「Move Out（退去）」</b> ボタンをクリックする</div></div>
                  <div className="step-item" style={{ borderColor: "var(--input-border)", background: "var(--input-bg)", opacity: 0.7 }}>
                    <div className="step-badge" style={{ background: "var(--text-sub)" }}>🚧</div>
                    <div className="step-text">（※このマニュアル項目は現在作成中です。追加の手順を後日追記してください。）</div>
                  </div>
                </div>
              </div>
            )}

            {/* --- ⏱️ 直近再点対応 --- */}
            {activeTab === "recent_repoint" && (
              <div className="dictionary-card">
                <h2 className="card-title">⏱️ 直近再点対応</h2>
                <div className="step-list">
                  <div className="step-item"><div className="step-badge">1</div><div className="step-text">インダストリータブから <b>過去の再点日（スイッチング日）</b> を確認する</div></div>
                  <div className="step-item"><div className="step-badge">2</div><div className="step-text">前回から「3ヶ月以内」の再点である場合, <b>直近再点アラート</b> を確認する</div></div>
                  <div className="step-item"><div className="step-badge">3</div><div className="step-text">お客様に状況をヒアリングし, 必要に応じて <b>特記事項</b> に理由を記載する</div></div>
                </div>
              </div>
            )}

            {/* --- 🚫 無効なアドレス対処法 --- */}
            {activeTab === "invalid_address" && (
              <div className="dictionary-card">
                <h2 className="card-title">🚫 無効なアドレス（住所）対処法</h2>
                <div className="step-list">
                  <div className="step-item"><div className="step-badge">1</div><div className="step-text">入力された住所がKraken上で <b>「住所不明エラー」</b> となる場合</div></div>
                  <div className="step-item"><div className="step-badge">2</div><div className="step-text">日本郵便のサイト等で <b>正式な郵便番号・丁目・番地</b> を検索する</div></div>
                  <div className="step-item"><div className="step-badge">3</div><div className="step-text">「大字（おおあざ）」「字（あざ）」などを除外し、システムが認識できるフォーマットに修正する</div></div>
                </div>
              </div>
            )}

            {/* --- 🏠 住所変更＆SPIN入力 --- */}
            {activeTab === "address_spin" && (
              <div className="dictionary-card">
                <h2 className="card-title">🏠 住所変更＆SPIN入力</h2>
                <div className="step-list">
                  <div className="step-item"><div className="step-badge">1</div><div className="step-text">ユーザー情報の <b>「プロパティ（物件情報）」</b> を開く</div></div>
                  <div className="step-item"><div className="step-badge">2</div><div className="step-text">正しい引越先住所を入力し、保存する</div></div>
                  <div className="step-item"><div className="step-badge">3</div><div className="step-text"><b>「SPIN（供給地点特定番号）」</b> が空欄の場合は、一般送配電事業者の検索サイトから取得して入力する</div></div>
                  <div className="step-item"><div className="step-badge">4</div><div className="step-text"><b>「同期」</b> ボタンを押してステータスが正常になるか確認する</div></div>
                </div>
              </div>
            )}

          </div>
        </div>

        <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>
      </main>
    </>
  );
}