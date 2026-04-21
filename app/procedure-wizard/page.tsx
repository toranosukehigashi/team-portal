"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// --- 🐙 復活！オクトパスライン背景コンポーネント ---
const OctopusBackground = () => (
  <>
    {/* 奥のグラデーション背景 */}
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "#020617", zIndex: -3 }} />
    
    {/* ✨ うねる8本のオクトパスライン */}
    <svg style={{ position: "fixed", top: "-50%", left: "-50%", width: "200%", height: "200%", zIndex: -2, pointerEvents: "none", opacity: 0.4 }} viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="tentacleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path fill="none" stroke="url(#tentacleGrad)" strokeWidth="0.5" d="M0,20 Q30,50 60,10 T100,80" style={{ animation: "wave 15s infinite alternate ease-in-out" }} />
      <path fill="none" stroke="url(#tentacleGrad)" strokeWidth="0.8" d="M0,40 Q40,10 70,70 T100,30" style={{ animation: "wave 18s infinite alternate-reverse ease-in-out" }} />
      <path fill="none" stroke="url(#tentacleGrad)" strokeWidth="0.6" d="M0,60 Q50,90 80,40 T100,90" style={{ animation: "wave 20s infinite alternate ease-in-out" }} />
      <path fill="none" stroke="url(#tentacleGrad)" strokeWidth="0.4" d="M0,80 Q20,20 50,60 T100,10" style={{ animation: "wave 22s infinite alternate-reverse ease-in-out" }} />
      
      <path fill="none" stroke="url(#tentacleGrad)" strokeWidth="0.7" d="M100,20 Q70,50 40,10 T0,80" style={{ animation: "wave 16s infinite alternate ease-in-out" }} />
      <path fill="none" stroke="url(#tentacleGrad)" strokeWidth="0.5" d="M100,40 Q60,10 30,70 T0,30" style={{ animation: "wave 19s infinite alternate-reverse ease-in-out" }} />
      <path fill="none" stroke="url(#tentacleGrad)" strokeWidth="0.9" d="M100,60 Q50,90 20,40 T0,90" style={{ animation: "wave 21s infinite alternate ease-in-out" }} />
      <path fill="none" stroke="url(#tentacleGrad)" strokeWidth="0.3" d="M100,80 Q80,20 50,60 T0,10" style={{ animation: "wave 23s infinite alternate-reverse ease-in-out" }} />
    </svg>
    <style>{`@keyframes wave { 0% { transform: translateY(0) scaleY(1); } 100% { transform: translateY(5px) scaleY(1.1); } }`}</style>
  </>
);

// ==========================================
// 📚 マニュアルのデータ構造（ご主人様の入力データ完全維持！）
// ==========================================
const MANUAL_DATA = [
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
      { step: 1, title: "アカウントの無効化", content: "管理画面から「アカウントを無効化する」オプションを選択します。", aiImgDesc: "アカウント設定画面で「無効化」ボタンが強調されている。", imgUrl: "" },
      { step: 2, title: "BH送りの設定", content: "システム上でBHフラグを立て、これ以上の通知がいかないように設定します。", aiImgDesc: "BHフラグのチェックボックスが表示された画面。", imgUrl: "" }
    ]
  },
  {
    id: "plan-cancel",
    icon: "🔄",
    title: "プラン変更＆申込取消",
    desc: "お客様からのプラン変更依頼、または申し込みキャンセルの処理手順です。",
    steps: [
      { step: 1, title: "プランの確認", content: "Customer ページから現在の適用プランを確認します。", aiImgDesc: "プラン詳細が表示されたCustomer画面。", imgUrl: "" },
      { step: 2, title: "プラン変更の実行", content: "アクションメニューから「Change Plan」を選択し、新しいプランを選びます。", aiImgDesc: "プラン変更プルダウンが表示された画面。", imgUrl: "" },
      { step: 3, title: "キャンセルの実行", content: "申し込みキャンセルの場合は、「Cancel Account」をクリックして処理します。", aiImgDesc: "キャンセル確認画面。", imgUrl: "" },
    ]
  },
  {
    id: "move-out",
    icon: "🏠",
    title: "MOVE OUT（退去処理）",
    badge: "未完成",
    desc: "引越し等に伴う退去（Move Out）の処理手順です。",
    steps: [
      { step: 1, title: "退去日の入力", content: "お客様から申告された退去日をシステムに入力します。", aiImgDesc: "退去日入力フィールドがある画面。", imgUrl: "" },
      { step: 2, title: "最終検針の確認", content: "※現在フロー整備中につき、管理者に確認してください。", aiImgDesc: "検針ステータスが「未確認」となっている画面。", imgUrl: "" }
    ]
  },
  {
    id: "re-ignition",
    icon: "🔥",
    title: "直近再点対応",
    desc: "直近で供給停止になったお客様の再点火（再契約）フローです。",
    steps: [
      { step: 1, title: "停止理由の確認", content: "直近の供給停止理由（未払い等）をヒストリーから確認します。", aiImgDesc: "アカウントヒストリー画面。", imgUrl: "" },
      { step: 2, title: "再点処理の実行", content: "問題が解消されている場合、再点火のプロシージャを実行します。", aiImgDesc: "再点火実行ボタンがある画面。", imgUrl: "" }
    ]
  },
  {
    id: "inv-address",
    icon: "❌",
    title: "無効なアドレス対処法",
    desc: "送信エラー（バウンス）になったメールアドレスの修正手順です。",
    steps: [
      { step: 1, title: "エラーログの確認", content: "バウンスログから「無効なアドレス」であることを確認します。", aiImgDesc: "エラーログ詳細画面。", imgUrl: "" },
      { step: 2, title: "お客様への連絡と修正", content: "お客様に確認し、正しいアドレスに修正してシステムを上書きします。", aiImgDesc: "アドレス修正画面。", imgUrl: "" }
    ]
  },
  {
    id: "addr-spin",
    icon: "📍",
    title: "住所変更＆SPIN入力",
    desc: "供給先住所の変更と、SPIN（供給地点特定番号）の入力手順です。",
    steps: [
      { step: 1, title: "新住所の特定", content: "新しい住所を検索し、正確な表記を確認します。", aiImgDesc: "住所検索ツール。", imgUrl: "" },
      { step: 2, title: "SPIN番号の紐付け", content: "取得した22桁のSPIN番号を入力フォームに貼り付けます。", aiImgDesc: "SPIN入力フィールド。", imgUrl: "" }
    ]
  }
];

export default function ProcedureWizard() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [activeManualId, setActiveManualId] = useState(MANUAL_DATA[0].id);
  const [expandedSteps, setExpandedSteps] = useState<number[]>([1]); 
  
  // ✨ ハンバーガーメニュー用のステート
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsReady(true), 100);
  }, []);

  const activeManual = MANUAL_DATA.find(m => m.id === activeManualId) || MANUAL_DATA[0];

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps(prev => 
      prev.includes(stepNumber) 
        ? prev.filter(s => s !== stepNumber) 
        : [...prev, stepNumber]
    );
  };

  return (
    <div className="global-theme-wrapper theme-dark">
      <OctopusBackground />
      
      <style dangerouslySetInnerHTML={{ __html: `
        html, body { background-color: #020617 !important; margin: 0; padding: 0; min-height: 100vh; overflow-x: hidden; }
        .app-wrapper { padding: 40px; position: relative; z-index: 10; opacity: 0; transition: 0.8s ease; max-width: 1400px; margin: 0 auto; }
        .app-wrapper.ready { opacity: 1; }

        /* 🍔 グローバル・サイドバー (ハンバーガーメニュー) */
        .global-sidebar { position: fixed; top: 0; left: -300px; width: 300px; height: 100vh; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(20px); border-right: 1px solid rgba(255,255,255,0.1); z-index: 9999; transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); box-shadow: 20px 0 50px rgba(0,0,0,0.5); padding: 40px 20px; display: flex; flex-direction: column; gap: 15px; }
        .global-sidebar.open { left: 0; }
        .sidebar-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); z-index: 9998; opacity: 0; pointer-events: none; transition: 0.3s; }
        .sidebar-overlay.open { opacity: 1; pointer-events: auto; }
        .gs-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 15px 20px; border-radius: 16px; color: #f8fafc; font-weight: 900; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 12px; }
        .gs-btn:hover { background: rgba(56, 189, 248, 0.2); border-color: #38bdf8; transform: translateX(5px); }
        .gs-close { position: absolute; top: 20px; right: 20px; background: transparent; border: none; color: #94a3b8; font-size: 24px; cursor: pointer; }

        .kpi-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
        .btn-hamburger { background: transparent; border: none; color: #f8fafc; font-size: 28px; cursor: pointer; transition: 0.3s; padding: 0; margin-right: 20px; }
        .btn-hamburger:hover { color: #38bdf8; transform: scale(1.1); }
        .header-left { display: flex; align-items: center; }

        .layout-grid { display: grid; grid-template-columns: 320px 1fr; gap: 30px; align-items: start; }
        
        /* 📁 左側メニュー */
        .sidebar-menu { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(30px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 8px; position: sticky; top: 40px; }
        .menu-item { padding: 16px 20px; border-radius: 16px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 12px; border: 1px solid transparent; background: rgba(255,255,255,0.02); }
        .menu-item:hover { background: rgba(255,255,255,0.05); transform: translateX(5px); }
        .menu-item.active { background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.4); box-shadow: 0 0 20px rgba(56,189,248,0.1); }
        .menu-icon { font-size: 20px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); border-radius: 10px; }
        .menu-title { font-weight: 800; font-size: 14px; color: #cbd5e1; flex: 1; }
        .menu-item.active .menu-title { color: #38bdf8; font-weight: 900; }
        .badge { background: #ef4444; color: #fff; font-size: 9px; padding: 2px 6px; border-radius: 10px; font-weight: 900; letter-spacing: 1px; }

        /* 📖 右側コンテンツ */
        .content-panel { display: flex; flex-direction: column; gap: 20px; }
        .manual-header { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(30px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .m-title { font-size: 28px; font-weight: 900; color: #fff; margin: 0 0 10px 0; display: flex; align-items: center; gap: 12px; }
        .m-desc { color: #94a3b8; font-size: 14px; font-weight: 700; line-height: 1.6; margin: 0; }

        /* アコーディオン要素 */
        .accordion-item { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(30px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; overflow: hidden; transition: 0.3s; }
        .accordion-item.open { border-color: rgba(56, 189, 248, 0.4); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        
        .accordion-header { padding: 20px 30px; display: flex; align-items: center; cursor: pointer; background: rgba(255,255,255,0.02); transition: 0.3s; }
        .accordion-header:hover { background: rgba(255,255,255,0.05); }
        .step-badge { background: linear-gradient(135deg, #38bdf8, #818cf8); color: #fff; font-size: 12px; font-weight: 900; padding: 6px 12px; border-radius: 12px; margin-right: 15px; letter-spacing: 1px; }
        .accordion-title { font-size: 16px; font-weight: 900; color: #f8fafc; flex: 1; }
        .chevron { font-size: 14px; color: #64748b; transition: 0.3s; }
        .accordion-item.open .chevron { transform: rotate(180deg); color: #38bdf8; }

        .accordion-body { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .accordion-item.open .accordion-body { max-height: 2000px; } 
        
        .accordion-content { padding: 0 30px 30px 30px; display: flex; flex-direction: column; gap: 20px; }
        .accordion-text { color: #cbd5e1; font-size: 14px; font-weight: 700; line-height: 1.8; background: rgba(0,0,0,0.3); padding: 20px; border-radius: 16px; border-left: 4px solid #38bdf8; }
        
        .actual-image-container { width: 100%; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .actual-image-container img { width: 100%; height: auto; display: block; }
        
        .image-placeholder { width: 100%; border: 2px dashed rgba(255,255,255,0.1); border-radius: 16px; background: rgba(0,0,0,0.2); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #64748b; font-weight: 800; font-size: 12px; padding: 30px; text-align: center; gap: 10px;}
        .image-placeholder span { display: block; }

      `}} />

      {/* 🍔 グローバル・サイドバー */}
      <div className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`} onClick={() => setIsSidebarOpen(false)}></div>
      <div className={`global-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="gs-close" onClick={() => setIsSidebarOpen(false)}>×</button>
        <h2 style={{color: "#38bdf8", fontWeight: 900, fontSize: "16px", marginBottom: "20px", letterSpacing: "2px"}}>🌐 MENU</h2>
        <button className="gs-btn" onClick={() => router.push("/")}>🏠 Workspace Home</button>
        <button className="gs-btn" onClick={() => router.push("/kpi-detail")}>📊 KPI Dashboard</button>
        <button className="gs-btn" onClick={() => router.push("/simulator")}>🆚 Cost Simulator</button>
        <button className="gs-btn" onClick={() => router.push("/net-toss")}>🌐 Net Toss</button>
        <button className="gs-btn" onClick={() => router.push("/sms-kraken")}>📱 SMS Kraken</button>
      </div>

      <main className={`app-wrapper ${isReady ? "ready" : ""}`}>
        <header className="kpi-header">
          <div className="header-left">
            <button className="btn-hamburger" onClick={() => setIsSidebarOpen(true)}>☰</button>
          </div>
          <div style={{textAlign: "right", color: "#f8fafc"}}>
            <h1 style={{fontSize:"24px", fontWeight:900, margin:0, letterSpacing:"2px"}}>KRAKEN PROCEDURE WIZARD</h1>
            <p style={{fontSize:"11px", color:"#94a3b8", fontWeight:800, margin:0}}>INTERACTIVE OPERATION MANUAL</p>
          </div>
        </header>

        <div className="layout-grid">
          
          <div className="sidebar-menu">
            <h3 style={{fontSize:"11px", color:"#94a3b8", fontWeight:900, letterSpacing:"2px", margin:"0 0 10px 10px"}}>CATEGORIES</h3>
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

          <div className="content-panel">
            <div className="manual-header">
              <h2 className="m-title"><span style={{fontSize: "32px"}}>{activeManual.icon}</span> {activeManual.title}</h2>
              <p className="m-desc">{activeManual.desc}</p>
            </div>

            {activeManual.steps.map((step) => {
              const isOpen = expandedSteps.includes(step.step);
              return (
                <div key={step.step} className={`accordion-item ${isOpen ? "open" : ""}`}>
                  
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
                          <span>ここにAI生成画像が入ります</span>
                          <span style={{color: "#38bdf8", opacity: 0.8}}>{(step as any).aiImgDesc}</span>
                          <span style={{fontSize: "10px", opacity: 0.7}}>publicフォルダに画像を保存し、コード内のimgUrlを設定してください</span>
                        </div>
                      )}
                      
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}