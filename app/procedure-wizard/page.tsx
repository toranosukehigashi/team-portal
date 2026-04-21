"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- 🌊 ノイズ完全ゼロ！深海オーロラ背景 ---
const KrakenAuroraBackground = () => (
  <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: -2, backgroundColor: "var(--app-bg)", overflow: "hidden", transition: "background-color 0.3s ease" }}>
    <div className="kraken-gradient grad-1"></div>
    <div className="kraken-gradient grad-2"></div>
    <div className="kraken-gradient grad-3"></div>
    <style>{`
      .kraken-gradient { position: absolute; border-radius: 50%; animation: floatGrad 25s infinite ease-in-out alternate; pointer-events: none; }
      .grad-1 { width: 80vw; height: 80vw; background: radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(56,189,248,0) 70%); top: -20vw; left: -20vw; animation-delay: 0s; }
      .grad-2 { width: 90vw; height: 90vw; background: radial-gradient(circle, rgba(192,132,252,0.15) 0%, rgba(192,132,252,0) 70%); bottom: -20vw; right: -20vw; animation-delay: -7s; }
      .grad-3 { width: 70vw; height: 70vw; background: radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(14,165,233,0) 70%); top: 20vh; left: 15vw; animation-delay: -12s; }
      @keyframes floatGrad { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(5vw, 5vh) scale(1.1); } }
      .theme-light .grad-1 { background: radial-gradient(circle, rgba(56,189,248,0.3) 0%, rgba(56,189,248,0) 70%); }
      .theme-light .grad-2 { background: radial-gradient(circle, rgba(192,132,252,0.3) 0%, rgba(192,132,252,0) 70%); }
      .theme-light .grad-3 { background: radial-gradient(circle, rgba(14,165,233,0.3) 0%, rgba(14,165,233,0) 70%); }
    `}</style>
  </div>
);

// ==========================================
// 💡 TypeScriptの型定義
// ==========================================
type StepData = {
  step: number;
  title: string;
  content: string;
  imgUrl: string; 
  aiImgDesc?: string; 
};

type ManualData = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  badge?: string;
  steps: StepData[];
};

// ==========================================
// 📚 マニュアルのデータ構造
// ==========================================
const MANUAL_DATA: ManualData[] = [
  {
    id: "dup-email",
    icon: "📧",
    title: "メアド重複対処法",
    desc: "Krakenでメールアドレスが重複した場合の統合・回避手順です。",
    steps: [
      { step: 1, title: "アカウント画面開く", content: "クラーケンの「メッセージ送信」から「パスワードリセット」を選択。", imgUrl: "/dup-email-1.png" },
      { step: 2, title: "パスワードリセットURLコピー", content: "本文のURLをCommand＋Cではなく、右クリックでコピー。", imgUrl: "/dup-email-2.png" },
      { step: 3, title: "URLをブラウザで検索", content: "初期パスワードを”名前＋電話番号下４桁”などわかりやすいもので変更。（受付時に事前にお客さんに伝えておくとベスト！）", imgUrl: "/dup-email-3.png"},
    ]
  },
  {
    id: "inv-bh",
    icon: "🛑",
    title: "無効化＆BH処理",
    desc: "契約の無効化処理と、BH（ブラックホール）送りの手順です。",
    steps: [
      { step: 1, title: "アカウントの無効化", content: "管理画面から「アカウントを無効化する」オプションを選択します。", imgUrl: "", aiImgDesc: "アカウント設定画面で「無効化」ボタンが強調されている。" },
      { step: 2, title: "BH送りの設定", content: "システム上でBHフラグを立て、これ以上の通知がいかないように設定します。", imgUrl: "", aiImgDesc: "BHフラグのチェックボックスが表示された画面。" }
    ]
  },
  {
    id: "plan-cancel",
    icon: "🔄",
    title: "プラン変更＆申込取消",
    desc: "お客様からのプラン変更依頼、または申し込みキャンセルの処理手順です。",
    steps: [
      { step: 1, title: "プランの確認", content: "Customer ページから現在の適用プランを確認します。", imgUrl: "", aiImgDesc: "プラン詳細が表示されたCustomer画面。" },
      { step: 2, title: "プラン変更の実行", content: "アクションメニューから「Change Plan」を選択し、新しいプランを選びます。", imgUrl: "", aiImgDesc: "プラン変更プルダウンが表示された画面。" },
      { step: 3, title: "キャンセルの実行", content: "申し込みキャンセルの場合は、「Cancel Account」をクリックして処理します。", imgUrl: "", aiImgDesc: "キャンセル確認画面。" },
    ]
  },
  {
    id: "move-out",
    icon: "🏠",
    title: "MOVE OUT（退去処理）",
    badge: "未完成",
    desc: "引越し等に伴う退去（Move Out）の処理手順です。",
    steps: [
      { step: 1, title: "退去日の入力", content: "お客様から申告された退去日をシステムに入力します。", imgUrl: "", aiImgDesc: "退去日入力フィールドがある画面。" },
      { step: 2, title: "最終検針の確認", content: "※現在フロー整備中につき、管理者に確認してください。", imgUrl: "", aiImgDesc: "検針ステータスが「未確認」となっている画面。" }
    ]
  },
  {
    id: "re-ignition",
    icon: "🔥",
    title: "直近再点対応",
    desc: "直近で供給停止になったお客様の再点火（再契約）フローです。",
    steps: [
      { step: 1, title: "停止理由の確認", content: "直近の供給停止理由（未払い等）をヒストリーから確認します。", imgUrl: "", aiImgDesc: "アカウントヒストリー画面。" },
      { step: 2, title: "再点処理の実行", content: "問題が解消されている場合、再点火のプロシージャを実行します。", imgUrl: "", aiImgDesc: "再点火実行ボタンがある画面。" }
    ]
  },
  {
    id: "inv-address",
    icon: "❌",
    title: "無効なアドレス対処法",
    desc: "送信エラー（バウンス）になったメールアドレスの修正手順です。",
    steps: [
      { step: 1, title: "エラーログの確認", content: "バウンスログから「無効なアドレス」であることを確認します。", imgUrl: "", aiImgDesc: "エラーログ詳細画面。" },
      { step: 2, title: "お客様への連絡と修正", content: "お客様に確認し、正しいアドレスに修正してシステムを上書きします。", imgUrl: "", aiImgDesc: "アドレス修正画面。" }
    ]
  },
  {
    id: "addr-spin",
    icon: "📍",
    title: "住所変更＆SPIN入力",
    desc: "供給先住所の変更と、SPIN（供給地点特定番号）の入力手順です。",
    steps: [
      { step: 1, title: "新住所の特定", content: "新しい住所を検索し、正確な表記を確認します。", imgUrl: "", aiImgDesc: "住所検索ツール。" },
      { step: 2, title: "SPIN番号の紐付け", content: "取得した22桁のSPIN番号を入力フォームに貼り付けます。", imgUrl: "", aiImgDesc: "SPIN入力フィールド。" }
    ]
  }
];

export default function ProcedureWizard() {
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);
  const [activeManualId, setActiveManualId] = useState(MANUAL_DATA[0].id);
  const [expandedSteps, setExpandedSteps] = useState<number[]>([1]); 
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  useEffect(() => {
    setIsReady(true);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const activeManual = MANUAL_DATA.find(m => m.id === activeManualId) || MANUAL_DATA[0];

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps(prev => 
      prev.includes(stepNumber) ? prev.filter(s => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    showToast(!isDarkMode ? "🌙 ダークモードに切り替えました" : "☀️ ライトモードに切り替えました", "info");
  };

  const showToast = (msg: string, type: "success" | "info" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  };

  return (
    <div className={`procedure-wrapper ${isDarkMode ? "theme-dark" : "theme-light"}`} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", color: "var(--text-main)", zIndex: 9999, overflowX: "hidden", overflowY: "auto", margin: 0, padding: 0, fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}>
      <KrakenAuroraBackground />
      
      <style dangerouslySetInnerHTML={{ __html: `
        .procedure-wrapper * { box-sizing: border-box; }

        .theme-light {
          --app-bg: #f0f9ff;
          --text-main: #0f172a;
          --text-sub: #334155;
          --card-bg: rgba(255, 255, 255, 0.7);
          --card-border: rgba(255, 255, 255, 1);
          --card-hover-border: #38bdf8;
          --card-hover-bg: rgba(255, 255, 255, 0.95);
          --card-shadow: 0 10px 30px rgba(2, 132, 199, 0.05);
          --title-color: #0284c7; 
          --accent-color: #0ea5e9; 
          --input-bg: rgba(255, 255, 255, 0.9);
          --accordion-text-bg: rgba(2, 132, 199, 0.05);
          --toast-bg: #ffffff;
        }
        
        .theme-dark {
          --app-bg: #020617;
          --text-main: #f8fafc;
          --text-sub: #94a3b8;
          --card-bg: rgba(15, 23, 42, 0.65);
          --card-border: rgba(255, 255, 255, 0.1);
          --card-hover-border: #38bdf8;
          --card-hover-bg: rgba(30, 41, 59, 0.85);
          --card-shadow: 0 20px 50px rgba(0,0,0,0.8);
          --title-color: #38bdf8; 
          --accent-color: #38bdf8;
          --input-bg: rgba(0, 0, 0, 0.4);
          --accordion-text-bg: rgba(0, 0, 0, 0.3);
          --toast-bg: rgba(30, 41, 59, 0.85);
        }

        .app-wrapper { padding: 20px 40px 100px 40px; position: relative; z-index: 10; opacity: 0; transition: opacity 0.8s ease; max-width: 1400px; margin: 0 auto; }
        .app-wrapper.ready { opacity: 1; }

        .hamburger-btn { position: fixed; top: 20px; left: 20px; z-index: 10001; background: var(--card-bg); backdrop-filter: blur(15px); border: 1px solid var(--card-border); border-radius: 12px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; gap: 5px; box-shadow: var(--card-shadow); transition: 0.3s; }
        .hamburger-btn:hover { background: var(--card-hover-bg); transform: scale(1.05); }
        .hamburger-line { width: 22px; height: 3px; background: var(--text-sub); border-radius: 3px; transition: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .hamburger-btn.open .line1 { transform: translateY(8px) rotate(45deg); background: var(--accent-color); }
        .hamburger-btn.open .line2 { opacity: 0; transform: translateX(-10px); }
        .hamburger-btn.open .line3 { transform: translateY(-8px) rotate(-45deg); background: var(--accent-color); }

        .menu-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(5px); z-index: 9999; opacity: 0; pointer-events: none; transition: 0.4s ease; }
        .menu-overlay.open { opacity: 1; pointer-events: auto; }

        .side-menu { position: fixed; top: 0; left: -320px; width: 300px; height: 100vh; background: var(--card-bg); backdrop-filter: blur(30px); border-right: 1px solid var(--card-border); z-index: 10000; box-shadow: var(--card-shadow); transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); padding: 90px 24px 30px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
        .side-menu.open { left: 0; }
        .menu-title-sidebar { font-size: 13px; font-weight: 900; color: var(--title-color); margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed var(--card-border); letter-spacing: 1px; }

        .side-link { text-decoration: none; padding: 14px 20px; border-radius: 14px; background: var(--input-bg); color: var(--text-main); font-weight: 800; font-size: 14px; border: 1px solid var(--card-border); transition: all 0.2s; display: flex; align-items: center; gap: 12px; }
        .side-link:hover { border-color: var(--card-hover-border); transform: translateX(8px); color: var(--accent-color); }
        .side-link.current-page { background: linear-gradient(135deg, #0ea5e9, #4f46e5); color: #fff; border: none; box-shadow: 0 6px 15px rgba(14, 165, 233, 0.3); pointer-events: none; }

        .glass-nav-wrapper { display: flex; justify-content: center; margin-bottom: 40px; margin-top: 10px; }
        .glass-nav { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: var(--card-bg); backdrop-filter: blur(16px); border: 1px solid var(--card-border); border-radius: 50px; box-shadow: var(--card-shadow); max-width: 800px; width: 100%; }
        
        .nav-left { display: flex; gap: 12px; align-items: center; }
        .glass-nav-link { text-decoration: none; padding: 10px 20px; border-radius: 30px; font-weight: 800; background: var(--input-bg); color: var(--text-sub); border: 1px solid var(--card-border); transition: 0.2s; font-size: 14px; }
        .glass-nav-link:hover { color: var(--accent-color); border-color: var(--card-hover-border); }
        .glass-nav-active { padding: 10px 20px; border-radius: 30px; font-weight: 900; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); font-size: 14px; }

        .theme-toggle-btn { background: var(--input-bg); border: 1px solid var(--card-border); padding: 10px 20px; border-radius: 30px; cursor: pointer; transition: 0.3s; font-size: 14px; color: var(--text-main); font-weight: 800; }
        .theme-toggle-btn:hover { border-color: var(--card-hover-border); transform: scale(1.05); }

        .layout-grid { display: grid; grid-template-columns: 320px 1fr; gap: 30px; align-items: start; }
        @media (max-width: 950px) { .layout-grid { grid-template-columns: 1fr; } }
        
        .categories-menu { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 24px; padding: 20px; box-shadow: var(--card-shadow); display: flex; flex-direction: column; gap: 8px; position: sticky; top: 100px; }
        .menu-item { padding: 16px 20px; border-radius: 16px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 12px; border: 1px solid transparent; background: var(--input-bg); color: var(--text-main); font-weight: 800; }
        .menu-item:hover { border-color: var(--card-hover-border); transform: translateX(5px); }
        .menu-item.active { background: var(--card-hover-bg); border-color: var(--card-hover-border); color: var(--accent-color); box-shadow: 0 0 20px rgba(56,189,248,0.1); }
        .menu-icon { font-size: 20px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.1); border-radius: 10px; }
        .menu-item.active .menu-title { color: var(--accent-color); font-weight: 900; }
        .menu-title { font-weight: 800; font-size: 14px; flex: 1; }
        .badge { background: #ef4444; color: #fff; font-size: 9px; padding: 2px 6px; border-radius: 10px; font-weight: 900; letter-spacing: 1px; }

        .content-panel { display: flex; flex-direction: column; gap: 20px; }
        .manual-header { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 24px; padding: 30px; box-shadow: var(--card-shadow); }
        .m-title { font-size: 28px; font-weight: 900; color: var(--title-color); margin: 0 0 10px 0; display: flex; align-items: center; gap: 12px; }
        .m-desc { color: var(--text-sub); font-size: 14px; font-weight: 700; line-height: 1.6; margin: 0; }

        .accordion-item { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 20px; overflow: hidden; transition: 0.3s; }
        .accordion-item.open { border-color: var(--card-hover-border); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        
        .accordion-header { padding: 20px 30px; display: flex; align-items: center; cursor: pointer; background: transparent; transition: 0.3s; }
        .accordion-header:hover { background: var(--card-hover-bg); }
        .step-badge { background: linear-gradient(135deg, #0ea5e9, #4f46e5); color: #fff; font-size: 12px; font-weight: 900; padding: 6px 12px; border-radius: 12px; margin-right: 15px; letter-spacing: 1px; }
        .accordion-title { font-size: 16px; font-weight: 900; color: var(--text-main); flex: 1; }
        .chevron { font-size: 14px; color: var(--text-sub); transition: 0.3s; }
        .accordion-item.open .chevron { transform: rotate(180deg); color: var(--accent-color); }

        .accordion-body { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .accordion-item.open .accordion-body { max-height: 2000px; } 
        
        .accordion-content { padding: 0 30px 30px 30px; display: flex; flex-direction: column; gap: 20px; }
        .accordion-text { color: var(--text-main); font-size: 14px; font-weight: 700; line-height: 1.8; background: var(--accordion-text-bg); padding: 20px; border-radius: 16px; border-left: 4px solid var(--accent-color); }
        
        .actual-image-container { width: 100%; border-radius: 16px; overflow: hidden; border: 1px solid var(--card-border); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .actual-image-container img { width: 100%; height: auto; display: block; }
        
        .image-placeholder { width: 100%; border: 2px dashed var(--card-border); border-radius: 16px; background: var(--accordion-text-bg); display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-sub); font-weight: 800; font-size: 12px; padding: 30px; text-align: center; gap: 10px;}
        .image-placeholder span { display: block; }

        #toast { visibility: hidden; position: fixed; bottom: 40px; right: 40px; background: var(--toast-bg); color: var(--accent-color); border: 1px solid var(--accent-color); padding: 16px 24px; border-radius: 12px; font-weight: 800; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 20000; opacity: 0; transition: 0.4s; backdrop-filter: blur(10px); }
        #toast.show { visibility: visible; opacity: 1; transform: translateY(-10px); }

        .fade-up-element { opacity: 0; transform: translateY(40px); transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .fade-up-element.visible { opacity: 1; transform: translateY(0); }
      `}} />

      {/* 🍔 ハンバーガーボタン */}
      <div className={`hamburger-btn ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <div className="hamburger-line line1"></div>
        <div className="hamburger-line line2"></div>
        <div className="hamburger-line line3"></div>
      </div>

      {/* 🌌 メニュー展開時の背景オーバーレイ */}
      <div className={`menu-overlay ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(false)}></div>

      {/* 🗄️ サイドメニュー（全項目網羅！） */}
      <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="menu-title-sidebar">🧭 TOOL MENU</div>
        <a href="/kpi-detail" className="side-link">📊 獲得進捗・KPI</a>
        <a href="/bulk-register" className="side-link">📦 データ一括登録</a>
        <a href="/net-toss" className="side-link">🌐 ネットトス連携</a>
        <a href="/self-close" className="side-link">🤝 自己クロ連携</a>
        <a href="/sms-kraken" className="side-link">📱 SMS (Kraken)送信</a>
        <a href="/email-template" className="side-link">✉️ メールテンプレート</a>
        <a href="/procedure-wizard" className="side-link current-page">🗺️ Kraken 手順辞書</a>
        <a href="/simulator" className="side-link">🆚 料金シミュレーター</a>
        <a href="/trouble-nav" className="side-link">⚡ トラブル解決ナビ</a>
      </div>

      <main className={`app-wrapper ${isReady ? "ready" : ""}`}>
        
        {/* 🎈 ナビゲーション & テーマ切り替え（中央配置） */}
        <div className="glass-nav-wrapper fade-up-element">
          <div className="glass-nav">
            <div className="nav-left">
              <a href="/" className="glass-nav-link">← 司令室に戻る</a>
              <div className="glass-nav-active">🗺️ Kraken 手順辞書</div>
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {isDarkMode ? "🎇 NIGHT" : "☀️ DAY"}
            </button>
          </div>
        </div>

        <div className="layout-grid">
          
          {/* 左側：カテゴリーメニュー */}
          <div className="categories-menu fade-up-element" style={{ transitionDelay: "0.1s" }}>
            <h3 style={{fontSize:"11px", color:"var(--text-sub)", fontWeight:900, letterSpacing:"2px", margin:"0 0 10px 10px"}}>CATEGORIES</h3>
            {MANUAL_DATA.map(manual => (
              <div 
                key={manual.id} 
                className={`menu-item ${activeManualId === manual.id ? "active" : ""}`}
                onClick={() => { setActiveManualId(manual.id); setExpandedSteps([1]); }}
              >
                <div className="menu-icon">{manual.icon}</div>
                <div className="menu-title">{manual.title}</div>
                {manual.badge && <span className="badge">{manual.badge}</span>}
              </div>
            ))}
          </div>

          {/* 右側：マニュアルコンテンツ */}
          <div className="content-panel">
            <div className="manual-header fade-up-element" style={{ transitionDelay: "0.2s" }}>
              <h2 className="m-title"><span style={{fontSize: "32px"}}>{activeManual.icon}</span> {activeManual.title}</h2>
              <p className="m-desc">{activeManual.desc}</p>
            </div>

            {activeManual.steps.map((step, index) => {
              const isOpen = expandedSteps.includes(step.step);
              return (
                // 💡 ここが修正ポイント！アニメーションの箱と、中身の箱を分離しました！
                <div key={step.step} className="fade-up-element" style={{ transitionDelay: `${0.3 + (index * 0.1)}s` }}>
                  <div className={`accordion-item ${isOpen ? "open" : ""}`}>
                    
                    <div className="accordion-header" onClick={() => toggleStep(step.step)}>
                      <div className="step-badge">STEP {step.step}</div>
                      <div className="accordion-title">{step.title}</div>
                      <div className="chevron">▼</div>
                    </div>

                    <div className="accordion-body">
                      <div className="accordion-content">
                        <div className="accordion-text">{step.content}</div>
                        
                        {step.imgUrl ? (
                          <div className="actual-image-container">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={step.imgUrl} alt={step.title} />
                          </div>
                        ) : (
                          <div className="image-placeholder">
                            <span style={{fontSize: "24px"}}>📸</span>
                            <span>ここにAI生成画像が入ります！</span>
                            {step.aiImgDesc && <span style={{color: "var(--accent-color)", opacity: 0.8}}>{step.aiImgDesc}</span>}
                            <span style={{fontSize: "10px", opacity: 0.7}}>publicフォルダに画像を保存し、コード内のimgUrlを設定してください</span>
                          </div>
                        )}
                        
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>

      {/* 🍞 通知トースト */}
      <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>
    </div>
  );
}