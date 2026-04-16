"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// ✨ 背景の光の粒（エメラルドグリーンのデータパーティクル）
const FlowParticles = () => {
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; delay: string; size: string; opacity: number }[]>([]);
  useEffect(() => {
    const generatedParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      delay: `${Math.random() * 5}s`,
      size: `${Math.random() * 3 + 1}px`,
      opacity: Math.random() * 0.5 + 0.3
    }));
    setParticles(generatedParticles);
  }, []);
  return (
    <div className="particles-container">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDelay: p.delay, opacity: p.opacity }} />
      ))}
    </div>
  );
};

export default function KpiDetail() {
  const router = useRouter();

  // 🌟 メニューとテーマ状態
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  // 📊 データ群（モックデータ）
  const ranking = [
    { rank: 1, name: "佐藤 一郎", count: 12, trend: "up", diff: "+3" },
    { rank: 2, name: "山田 太郎", count: 9, trend: "stable", diff: "±0" },
    { rank: 3, name: "鈴木 花子", count: 8, trend: "up", diff: "+1" },
    { rank: 4, name: "高橋 次郎", count: 6, trend: "down", diff: "-2" },
    { rank: 5, name: "田中 健太", count: 4, trend: "stable", diff: "±0" },
  ];

  const myDailyGoal = { current: 5, target: 8, progress: Math.floor((5/8)*100) };
  const myMonthlyGoal = { current: 85, target: 150, progress: Math.floor((85/150)*100) };
  
  const listStats = [
    { name: "Aエリア 新規開拓", count: 45, target: 50, color: "#10b981" }, // エメラルド
    { name: "既存乗り換え（他社）", count: 28, target: 60, color: "#3b82f6" }, // ブルー
    { name: "紹介キャンペーン", count: 12, target: 40, color: "#8b5cf6" }, // パープル
  ];

  const weeklyData = [12, 19, 15, 22, 28, 24, 30]; // 過去7日間の推移モック
  const maxWeekly = Math.max(...weeklyData);

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

  const getTrendBadge = (trend: string, diff: string) => {
    if (trend === "up") return <span className="trend-badge trend-up">↗ {diff}</span>;
    if (trend === "stable") return <span className="trend-badge trend-stable">→ {diff}</span>;
    return <span className="trend-badge trend-down">↘ {diff}</span>;
  };

  return (
    <>
      <div className={`entrance-bg ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <FlowParticles />
      </div>

      <main className={`app-wrapper ${isReady ? "ready" : ""} ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <style dangerouslySetInnerHTML={{ __html: `
          .app-wrapper * { box-sizing: border-box; }

          /* 🎨 新しい洗練されたカラーパレット：エメラルド・グリーン＆オーシャン・ブルー */
          .theme-light {
            --bg-gradient: linear-gradient(135deg, #ecfdf5 0%, #e0f2fe 50%, #f1f5f9 100%); /* エメラルド〜ブルー */
            --text-main: #1e293b;
            --text-sub: #475569;
            --card-bg: rgba(255, 255, 255, 0.85);
            --card-border: rgba(255, 255, 255, 1);
            --card-hover-border: #10b981; /* Emerald 500 */
            --card-hover-bg: rgba(255, 255, 255, 0.95);
            --card-shadow: 0 10px 30px rgba(0,0,0,0.04);
            --title-color: #047857; /* Emerald 700 */
            --accent-color: #059669; /* Emerald 600 */
            --input-bg: rgba(255, 255, 255, 0.9);
            --input-border: rgba(110, 231, 183, 0.5); /* Emerald 300 */
            --svg-color: rgba(16, 185, 129, 0.15);
            --particle-color: #6ee7b7; /* Emerald 300 */
          }
          
          .theme-dark {
            --bg-gradient: radial-gradient(ellipse at top left, #064e3b 0%, #0f172a 100%); /* ディープグリーン〜ミッドナイト */
            --text-main: #f8fafc;
            --text-sub: #cbd5e1;
            --card-bg: rgba(15, 23, 42, 0.65); 
            --card-border: rgba(255, 255, 255, 0.1);
            --card-hover-border: #34d399; /* Emerald 400 */
            --card-hover-bg: rgba(30, 41, 59, 0.85);
            --card-shadow: 0 20px 50px rgba(0,0,0,0.8);
            --title-color: #6ee7b7; 
            --accent-color: #34d399;
            --input-bg: rgba(0, 0, 0, 0.4);
            --input-border: rgba(16, 185, 129, 0.3);
            --svg-color: rgba(52, 211, 153, 0.15);
            --particle-color: #a7f3d0;
          }

          .app-wrapper { 
            min-height: 100vh; padding: 20px 40px 100px 40px; 
            font-family: 'Inter', 'Noto Sans JP', sans-serif; 
            color: var(--text-main); font-size: 13px; 
            transition: color 0.5s; overflow-x: hidden; position: relative;
          }

          .entrance-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -2; transition: background 0.8s ease; }
          .entrance-bg.theme-light { background: var(--bg-gradient); }
          .entrance-bg.theme-dark { background: var(--bg-gradient); }

          .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; }
          .particle { position: absolute; border-radius: 50%; background: var(--particle-color); box-shadow: 0 0 10px var(--particle-color); animation: flowUp 15s linear infinite; transition: background 0.5s, box-shadow 0.5s; }
          @keyframes flowUp { 0% { transform: translateY(100vh) scale(0.5); } 100% { transform: translateY(-20vh) scale(1.5); } }

          /* 🌟 SVGデータフロー背景（波打つグラフ線） */
          .data-svg-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none; opacity: 0.8; }
          .data-path { fill: none; stroke: var(--svg-color); stroke-width: 2; stroke-dasharray: 2000; stroke-dashoffset: 2000; animation: drawDataFlow 20s linear infinite; transition: stroke 0.5s; }
          @keyframes drawDataFlow { 0% { stroke-dashoffset: 2000; } 100% { stroke-dashoffset: 0; } }

          /* 🍔 ハンバーガーボタン */
          .hamburger-btn { position: fixed; top: 20px; left: 20px; z-index: 1001; background: var(--card-bg); backdrop-filter: blur(15px); border: 1px solid var(--card-border); border-radius: 12px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; gap: 5px; box-shadow: var(--card-shadow); transition: 0.3s; }
          .hamburger-btn:hover { background: var(--card-hover-bg); transform: scale(1.05); }
          .hamburger-line { width: 22px; height: 3px; background: var(--text-sub); border-radius: 3px; transition: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
          .hamburger-btn.open .line1 { transform: translateY(8px) rotate(45deg); background: var(--accent-color); }
          .hamburger-btn.open .line2 { opacity: 0; transform: translateX(-10px); }
          .hamburger-btn.open .line3 { transform: translateY(-8px) rotate(-45deg); background: var(--accent-color); }

          /* 🌌 メニューオーバーレイ */
          .menu-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(5px); z-index: 999; opacity: 0; pointer-events: none; transition: 0.4s ease; }
          .menu-overlay.open { opacity: 1; pointer-events: auto; }

          /* 🗄️ サイドメニュー */
          .side-menu { position: fixed; top: 0; left: -320px; width: 300px; height: 100vh; background: var(--card-bg); backdrop-filter: blur(30px); border-right: 1px solid var(--card-border); z-index: 1000; box-shadow: var(--card-shadow); transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); padding: 90px 24px 30px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
          .side-menu.open { left: 0; }
          .menu-title { font-size: 13px; font-weight: 900; color: var(--title-color); margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed var(--card-border); letter-spacing: 1px; }

          .side-link { text-decoration: none; padding: 14px 20px; border-radius: 14px; background: var(--input-bg); color: var(--text-main); font-weight: 800; font-size: 14px; border: 1px solid var(--card-border); transition: all 0.2s; display: flex; align-items: center; gap: 12px; }
          .side-link:hover { border-color: var(--card-hover-border); transform: translateX(8px); color: var(--accent-color); }
          .side-link.current-page { background: linear-gradient(135deg, #10b981, #059669); color: #fff; border: none; box-shadow: 0 6px 15px rgba(16, 185, 129, 0.3); pointer-events: none; }
          .theme-dark .side-link.current-page { background: linear-gradient(135deg, #34d399, #059669); }

          /* 🎈 ナビゲーション（中央配置） */
          .glass-nav-wrapper { display: flex; justify-content: center; margin-bottom: 30px; }
          .glass-nav { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: var(--card-bg); backdrop-filter: blur(16px); border: 1px solid var(--card-border); border-radius: 50px; box-shadow: var(--card-shadow); max-width: 800px; width: 100%; }
          
          .nav-left { display: flex; gap: 12px; align-items: center; }
          .glass-nav-link { text-decoration: none; padding: 10px 20px; border-radius: 30px; font-weight: 800; background: var(--input-bg); color: var(--text-sub); border: 1px solid var(--card-border); transition: 0.2s; font-size: 14px; }
          .glass-nav-link:hover { color: var(--accent-color); border-color: var(--card-hover-border); }
          .glass-nav-active { padding: 10px 20px; border-radius: 30px; font-weight: 900; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); font-size: 14px; }

          /* テーマ切り替えボタン */
          .theme-toggle-btn { background: var(--input-bg); border: 1px solid var(--card-border); padding: 10px 20px; border-radius: 30px; cursor: pointer; transition: 0.3s; font-size: 14px; color: var(--text-main); font-weight: 800; }
          .theme-toggle-btn:hover { border-color: var(--card-hover-border); transform: scale(1.05); }

          /* 🌟 レイアウト：Bento UI（ダッシュボード・グリッド） */
          .dashboard-layout { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; max-width: 1200px; margin: 0 auto; perspective: 1000px; }
          @media (max-width: 1000px) { .dashboard-layout { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 700px) { .dashboard-layout { grid-template-columns: 1fr; } }

          /* 🗃️ Bento UI（パネル） */
          .glass-panel { 
            background: var(--card-bg); backdrop-filter: blur(25px); 
            border: 1px solid var(--card-border); border-radius: 24px; padding: 30px; 
            box-shadow: var(--card-shadow); display: flex; flex-direction: column; 
            transform-style: preserve-3d; transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.2s;
          }
          .glass-panel:hover { transform: translateY(-5px); box-shadow: 0 30px 60px rgba(0,0,0,0.1); border-color: var(--card-hover-border); }
          .theme-dark .glass-panel:hover { box-shadow: 0 30px 60px rgba(0,0,0,0.8); }
          
          .glass-panel.span-2 { grid-column: span 2; }
          @media (max-width: 1000px) { .glass-panel.span-2 { grid-column: span 1; } }

          .panel-title { font-size: 16px; font-weight: 900; color: var(--title-color); margin: 0 0 20px 0; display: flex; align-items: center; gap: 10px; border-bottom: 2px dashed var(--card-border); padding-bottom: 12px; letter-spacing: 1px; transform: translateZ(10px); }

          /* 🎯 円形プログレス (デイリー目標) */
          .goal-container { text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; }
          .circular-progress { 
            width: 140px; height: 140px; border-radius: 50%; margin: 0 auto 15px; position: relative;
            background: conic-gradient(var(--accent-color) ${myDailyGoal.progress}%, var(--input-border) 0); 
            display: flex; align-items: center; justify-content: center; 
            box-shadow: 0 8px 20px rgba(16,185,129,0.2), inset 0 4px 8px rgba(0,0,0,0.05);
            border: 4px solid var(--card-border); transition: 0.5s;
          }
          .theme-dark .circular-progress { box-shadow: 0 8px 20px rgba(52,211,153,0.1), inset 0 4px 8px rgba(0,0,0,0.5); }
          .circular-progress::before { content: ""; position: absolute; width: 100px; height: 100px; background: var(--card-bg); border-radius: 50%; box-shadow: inset 0 4px 8px rgba(0,0,0,0.05); }
          .theme-dark .circular-progress::before { box-shadow: inset 0 4px 8px rgba(0,0,0,0.5); }
          
          .progress-text { position: relative; z-index: 1; display: flex; flex-direction: column; transform: translateZ(20px); }
          .percent { font-size: 32px; font-weight: 900; color: var(--accent-color); font-variant-numeric: tabular-nums; line-height: 1; }
          .goal-nums { font-size: 14px; font-weight: 900; color: var(--text-sub); margin-top: 10px; background: var(--input-bg); padding: 8px 16px; border-radius: 20px; border: 1px solid var(--input-border); }
          .goal-current-val { color: var(--accent-color); font-size: 20px; margin: 0 4px; }

          /* 🏆 ランキングリスト */
          .ranking-list { display: flex; flex-direction: column; gap: 12px; }
          .rank-card { 
            display: flex; align-items: center; padding: 12px 18px; border-radius: 16px; 
            background: var(--input-bg); border: 1px solid var(--input-border);
            transition: 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: default; transform-style: preserve-3d; 
          }
          .rank-card:hover { transform: translateZ(10px) translateX(5px); background: var(--card-hover-bg); border-color: var(--card-hover-border); box-shadow: 0 10px 20px rgba(16,185,129,0.1); }
          .theme-dark .rank-card:hover { box-shadow: 0 10px 20px rgba(52,211,153,0.1); }
          
          .rank-num { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 10px; font-size: 15px; font-weight: 900; color: #fff; background: #94a3b8; margin-right: 15px; box-shadow: inset 0 -2px 0 rgba(0,0,0,0.2); }
          .rank-card.rank-1 { border-color: #fde047; background: rgba(253,224,71,0.1); }
          .rank-card.rank-1 .rank-num { background: linear-gradient(135deg, #fbbf24, #d97706); font-size: 18px; box-shadow: 0 4px 10px rgba(245,158,11,0.3); }
          .rank-card.rank-2 .rank-num { background: linear-gradient(135deg, #cbd5e1, #94a3b8); }
          .rank-card.rank-3 .rank-num { background: linear-gradient(135deg, #fca5a5, #ef4444); }
          
          .rank-name { flex: 1; font-weight: 900; color: var(--text-main); font-size: 15px; }
          
          .trend-badge { font-size: 11px; font-weight: 900; padding: 4px 10px; border-radius: 8px; margin-right: 15px; font-family: monospace; letter-spacing: 1px; }
          .trend-up { background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3); }
          .trend-stable { background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3); }
          .trend-down { background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }

          .rank-count { font-size: 22px; font-weight: 900; color: var(--accent-color); font-variant-numeric: tabular-nums; }
          .rank-unit { font-size: 11px; color: var(--text-sub); margin-left: 4px; font-weight: 800; }

          /* 📈 ウィークリーチャート（棒グラフ） */
          .chart-container { display: flex; align-items: flex-end; justify-content: space-between; height: 180px; padding: 20px 10px 0 10px; gap: 8px; border-bottom: 2px solid var(--input-border); margin-bottom: 10px; }
          .chart-bar-group { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 100%; }
          .chart-bar { width: 100%; max-width: 40px; background: linear-gradient(0deg, var(--accent-color), rgba(16,185,129,0.2)); border-radius: 6px 6px 0 0; transition: height 1s cubic-bezier(0.2, 0.8, 0.2, 1); position: relative; }
          .chart-bar:hover { background: linear-gradient(0deg, #38bdf8, rgba(56,189,248,0.2)); cursor: pointer; }
          .chart-val { font-size: 11px; font-weight: 900; color: var(--text-sub); }
          .chart-label { font-size: 11px; font-weight: 800; color: var(--text-sub); margin-top: 5px; }

          /* 📋 リスト別獲得数 */
          .list-stats-container { display: flex; flex-direction: column; gap: 16px; margin-top: 10px; }
          .list-item { display: flex; flex-direction: column; gap: 6px; }
          .list-item-header { display: flex; justify-content: space-between; font-size: 13px; font-weight: 800; color: var(--text-main); }
          .list-bar-bg { width: 100%; height: 10px; background: var(--input-border); border-radius: 5px; overflow: hidden; }
          .list-bar-fill { height: 100%; border-radius: 5px; transition: width 1s ease-out; }

          /* 📅 月間プログレス */
          .monthly-bar-wrap { width: 100%; height: 20px; background: var(--input-border); border-radius: 10px; overflow: hidden; position: relative; margin-top: 20px; }
          .monthly-bar-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #0ea5e9); width: ${myMonthlyGoal.progress}%; transition: 1s ease-out; }
          .monthly-text { display: flex; justify-content: space-between; font-weight: 900; font-size: 14px; margin-bottom: 8px; color: var(--text-main); }

          #toast { visibility: hidden; position: fixed; bottom: 40px; right: 40px; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); padding: 16px 24px; border-radius: 12px; font-weight: 800; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 200; opacity: 0; transition: 0.4s; backdrop-filter: blur(10px); }
          #toast.show { visibility: visible; opacity: 1; transform: translateY(-10px); }

          /* 🪄 スクロール連動 */
          .fade-up-element { opacity: 0; transform: translateY(40px); transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
          .fade-up-element.visible { opacity: 1; transform: translateY(0); }
        `}} />

        {/* 🌟 SVGデータフロー背景（波打つグラフ線） */}
        <svg className="data-svg-bg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path className="data-path" d="M -10,60 Q 20,40 50,60 T 110,60" />
          <path className="data-path" d="M -10,80 Q 30,100 60,70 T 110,90" style={{animationDelay: "2s", opacity: 0.5, strokeWidth: "1"}} />
        </svg>

        {/* 🍔 ハンバーガーボタン */}
        <div className={`hamburger-btn ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className="hamburger-line line1"></div>
          <div className="hamburger-line line2"></div>
          <div className="hamburger-line line3"></div>
        </div>

        {/* 🌌 メニュー展開時の背景オーバーレイ */}
        <div className={`menu-overlay ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(false)}></div>

        {/* 🗄️ サイドメニュー（全ツール網羅） */}
        <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
          <div className="menu-title">🧭 TOOL MENU</div>
          <a href="/kpi-detail" className="side-link current-page">📊 獲得進捗・KPI</a>
          <a href="/bulk-register" className="side-link">📦 データ一括登録</a>
          <a href="/net-toss" className="side-link">🌐 ネットトス連携</a>
          <a href="/self-close" className="side-link">🤝 自己クロ連携</a>
          <a href="/sms-kraken" className="side-link">📱 SMS (Kraken)送信</a>
          <a href="/email-template" className="side-link">✉️ メールテンプレート</a>
          <a href="/procedure-wizard" className="side-link">🗺️ Kraken 手順辞書</a>
          <a href="/simulator" className="side-link">🆚 料金シミュレーター</a>
          <a href="/trouble-nav" className="side-link">⚡ トラブル解決ナビ</a>
        </div>

        {/* 🎈 ナビゲーション & テーマ切り替え */}
        <div className="glass-nav-wrapper fade-up-element" style={{ "--delay": "0s" } as any}>
          <div className="glass-nav">
            <div className="nav-left">
              <a href="/" className="glass-nav-link">← 司令室に戻る</a>
              <div className="glass-nav-active">📊 獲得進捗・KPI</div>
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {isDarkMode ? "🎇 NIGHT" : "☀️ DAY"}
            </button>
          </div>
        </div>

        {/* 🌟 メインレイアウト（Bento UI ダッシュボード） */}
        <div className="dashboard-layout">
          
          {/* 🎯 左上：個人目標 (Daily) */}
          <div className="glass-panel fade-up-element">
            <h2 className="panel-title">🎯 DAILY TARGET</h2>
            <div className="goal-container">
              <div className="circular-progress">
                <div className="progress-text">
                  <span className="percent">{myDailyGoal.progress}<span style={{fontSize:"16px", color:"var(--text-sub)"}}>%</span></span>
                </div>
              </div>
              <div className="goal-nums">
                Current <span className="goal-current-val">{myDailyGoal.current}</span> / Target {myDailyGoal.target}
              </div>
              <div style={{ fontSize: "12px", fontWeight: 800, marginTop: "12px", color: "var(--text-sub)" }}>
                目標達成まであと <span style={{color:"var(--accent-color)", fontSize:"16px"}}>{myDailyGoal.target - myDailyGoal.current}</span> 件！
              </div>
            </div>
          </div>

          {/* 📈 中央上〜右上：週間推移チャート (span-2) */}
          <div className="glass-panel span-2 fade-up-element" style={{ transitionDelay: "0.1s" }}>
            <h2 className="panel-title">📈 WEEKLY TREND (TEAM)</h2>
            <div className="chart-container">
              {weeklyData.map((val, i) => {
                const heightPercent = Math.max(10, (val / maxWeekly) * 100);
                const days = ["月", "火", "水", "木", "金", "土", "日"];
                return (
                  <div key={i} className="chart-bar-group">
                    <span className="chart-val">{val}</span>
                    <div className="chart-bar" style={{ height: `${heightPercent}%` }}></div>
                    <span className="chart-label">{days[i]}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "right", fontSize: "12px", color: "var(--text-sub)", fontWeight: 800, marginTop: "10px" }}>
              ※過去7日間のチーム合計獲得数推移
            </div>
          </div>

          {/* 🏆 左下〜中央下：ランキングボード (span-2) */}
          <div className="glass-panel span-2 fade-up-element" style={{ transitionDelay: "0.2s" }}>
            <h2 className="panel-title">🏆 TEAM RANKING</h2>
            <div className="ranking-list">
              {ranking.map((user, index) => (
                <div key={user.rank} className={`rank-card rank-${user.rank}`}>
                  <div className="rank-num">{user.rank === 1 ? "👑" : user.rank}</div>
                  <div className="rank-name">{user.name}</div>
                  {getTrendBadge(user.trend, user.diff)}
                  <div className="rank-count">{user.count}<span className="rank-unit">件</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* 📋 右下：月間＆リスト別 (Monthly) */}
          <div className="glass-panel fade-up-element" style={{ transitionDelay: "0.3s" }}>
            <h2 className="panel-title">📋 MONTHLY & LIST STATUS</h2>
            
            <div style={{ marginBottom: "30px" }}>
              <div className="monthly-text">
                <span style={{ color: "var(--text-sub)" }}>今月の進捗（個人）</span>
                <span style={{ color: "var(--accent-color)" }}>{myMonthlyGoal.current} / {myMonthlyGoal.target}</span>
              </div>
              <div className="monthly-bar-wrap">
                <div className="monthly-bar-fill"></div>
              </div>
              <div style={{ textAlign: "right", marginTop: "5px", fontSize: "15px", fontWeight: 900, color: "#3b82f6" }}>
                {myMonthlyGoal.progress}%
              </div>
            </div>

            <div style={{ fontSize: "12px", fontWeight: 900, color: "var(--text-sub)", marginBottom: "10px", borderBottom: "1px dashed var(--card-border)", paddingBottom: "5px" }}>リスト別 獲得内訳</div>
            <div className="list-stats-container">
              {listStats.map((list, i) => (
                <div key={i} className="list-item">
                  <div className="list-item-header">
                    <span>{list.name}</span>
                    <span style={{ color: list.color, fontVariantNumeric:"tabular-nums" }}>{list.count} / {list.target}</span>
                  </div>
                  <div className="list-bar-bg">
                    <div className="list-bar-fill" style={{ width: `${Math.min(100, (list.count/list.target)*100)}%`, backgroundColor: list.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 🍞 通知 */}
        <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>
      </main>
    </>
  );
}