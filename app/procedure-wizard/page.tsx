"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// --- 背景コンポーネント (共通) ---
const DataMesh = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext("2d"); if (!ctx) return;
    let animationFrameId: number; let particles: { x: number, y: number, vx: number, vy: number, size: number }[] = [];
    const particleCount = 40;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize); resize();
    for (let i = 0; i < particleCount; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 1.0, vy: (Math.random() - 0.5) * 1.0, size: Math.random() * 2 + 1 });
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); const colorRGB = "56, 189, 248"; 
      for (let i = 0; i < particleCount; i++) {
        let p = particles[i]; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1; if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(${colorRGB}, 0.8)`; ctx.fill();
        for (let j = i + 1; j < particleCount; j++) {
          let p2 = particles[j]; let dist = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
          if (dist < 150) { ctx.beginPath(); ctx.strokeStyle = `rgba(${colorRGB}, ${1 - dist / 150})`; ctx.lineWidth = 1; ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animationFrameId); };
  }, [isDarkMode]);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: "-50%", left: "-50%", width: "200%", height: "200%", zIndex: -2, pointerEvents: "none" }} />;
};

// ==========================================
// 📚 マニュアルのデータ構造
// ✨ imgUrl を空文字 ("") で全ステップに追加しました！ここに画像のパス（例: "/step1.png"）を書いてください！
// ==========================================
const MANUAL_DATA = [
  {
    id: "dup-email",
    icon: "📧",
    title: "メアド重複対処法",
    desc: "Krakenでメールアドレスが重複した場合の統合・回避手順です。",
    steps: [
      { step: 1, title: "アカウント画面開く", content: "クラーケンの「メッセージ送信」から「パスワードリセット」を選択。", imgUrl: "/dup-email-1.png" },
      { step: 2, title: "パスワードリセットURLコピー", content: "本文のURLをCommand＋Cではなく、右クリックでコピー。", imgUrl: "" },
      { step: 3, title: "URLをブラウザで検索", content: "初期パスワードを”名前＋電話番号下４桁”などわかりやすいもので変更。（受付時に事前にお客さんに伝えておくとベスト！）", imgUrl: ""},
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
      <DataMesh isDarkMode={true} />
      
      <style dangerouslySetInnerHTML={{ __html: `
        html, body { background-color: #020617 !important; margin: 0; padding: 0; min-height: 100vh; overflow-x: hidden; }
        .app-wrapper { padding: 40px; position: relative; z-index: 10; opacity: 0; transition: 0.8s ease; max-width: 1400px; margin: 0 auto; }
        .app-wrapper.ready { opacity: 1; }

        .kpi-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
        .btn-back { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 10px 20px; border-radius: 12px; cursor: pointer; transition: 0.3s; font-weight: 900; }
        .btn-back:hover { background: #38bdf8; color: #fff; }

        .layout-grid { display: grid; grid-template-columns: 320px 1fr; gap: 30px; align-items: start; }
        
        .sidebar-menu { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(30px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 8px; position: sticky; top: 40px; }
        .menu-item { padding: 16px 20px; border-radius: 16px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 12px; border: 1px solid transparent; background: rgba(255,255,255,0.02); }
        .menu-item:hover { background: rgba(255,255,255,0.05); transform: translateX(5px); }
        .menu-item.active { background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.4); box-shadow: 0 0 20px rgba(56,189,248,0.1); }
        .menu-icon { font-size: 20px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); border-radius: 10px; }
        .menu-title { font-weight: 800; font-size: 14px; color: #cbd5e1; flex: 1; }
        .menu-item.active .menu-title { color: #38bdf8; font-weight: 900; }
        .badge { background: #ef4444; color: #fff; font-size: 9px; padding: 2px 6px; border-radius: 10px; font-weight: 900; letter-spacing: 1px; }

        .content-panel { display: flex; flex-direction: column; gap: 20px; }
        .manual-header { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(30px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .m-title { font-size: 28px; font-weight: 900; color: #fff; margin: 0 0 10px 0; display: flex; align-items: center; gap: 12px; }
        .m-desc { color: #94a3b8; font-size: 14px; font-weight: 700; line-height: 1.6; margin: 0; }

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
        
        /* 📸 画像コンテナのスタイル */
        .actual-image-container { width: 100%; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .actual-image-container img { width: 100%; height: auto; display: block; }
        
        .image-placeholder { width: 100%; border: 2px dashed rgba(255,255,255,0.1); border-radius: 16px; background: rgba(0,0,0,0.2); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #64748b; font-weight: 800; font-size: 12px; padding: 30px; text-align: center; gap: 10px;}
        .image-placeholder span { display: block; }

      `}} />

      <main className={`app-wrapper ${isReady ? "ready" : ""}`}>
        <header className="kpi-header">
          <button className="btn-back" onClick={() => router.push("/")}>◀ BACK TO HUB</button>
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
                      
                      {/* ✨ ここが復活した「画像表示ロジック」です！！ */}
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