"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideMenu from "@/app/components/SideMenu"; // 💡 共通メニューを呼び出し！

// ✨ 背景の光の粒（データフローをイメージしたエメラルド系）
const FlowParticles = () => {
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; delay: string; size: string }[]>([]);
  useEffect(() => {
    const generatedParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      delay: `${Math.random() * 5}s`,
      size: `${Math.random() * 3 + 1}px`
    }));
    setParticles(generatedParticles);
  }, []);
  return (
    <div className="particles-container">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDelay: p.delay }} />
      ))}
    </div>
  );
};

export default function SimulatorTest() {
  const router = useRouter();

  // 🌟 状態管理
  const [usedMonths, setUsedMonths] = useState<number>(12); // 初期値12ヶ月
  const [isReady, setIsReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  // ==========================================
  // 💡 スプレッドシート関数の移植ロジック
  // ==========================================
  
  // マスタ設定値
  const TOTAL_INSTALLMENT = 31680; // 工事費総額
  const MONTHLY_INSTALLMENT = 1320; // 月々の支払額（B列：月々の支払額）
  
  const FIXED_CB_NEW_INSTALLMENT = 7920; // ◉1320×6（新住所分 半年分工事費）
  const FIXED_CB_PENALTY = 10560;        // ◉4180+6380（現・新解約金）
  const FIXED_CB_DOWNGRADE = 8030;       // ◉3850+4180（1G戻し初期費用等）

  // 【H3セルの再現】 XLOOKUP(G3, B3:B26, E3:E26...) 相当のロジック
  // 条件分岐：もし利用月数が24ヶ月以上なら残債は0にする
  let remainingDebt = 0;
  if (usedMonths < 24) {
    // スプシのE列（残債）の計算式：総額 - (月額 * 利用月数)
    remainingDebt = TOTAL_INSTALLMENT - (MONTHLY_INSTALLMENT * usedMonths);
    if (remainingDebt < 0) remainingDebt = 0;
  } else {
    remainingDebt = 0; // 24ヶ月以上は完済扱い
  }

  // 【H9セルの再現】 =7920 + 10560 + 8030 + H3
  const rawCbTotal = FIXED_CB_NEW_INSTALLMENT + FIXED_CB_PENALTY + FIXED_CB_DOWNGRADE + remainingDebt;
  
  // 【条件付き調整】 ※工事費残債だけを補填するときは4万円になるように調整してあげる
  // （ここでは「残債が0円＝既に工事費を払い終えている場合」に最低保証の4万円を提示するロジックとして実装）
  const finalCbTotal = remainingDebt > 0 ? rawCbTotal : 40000;

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
    showToast(!isDarkMode ? "🌙 ダークモードに切り替えました" : "☀️ ライトモードに切り替えました", "info");
  };

  const showToast = (msg: string, type: "success" | "info" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  };

  return (
    <>
      <div className={`entrance-bg ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <FlowParticles />
      </div>

      <main className={`app-wrapper ${isReady ? "ready" : ""} ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <style dangerouslySetInnerHTML={{ __html: `
          .app-wrapper * { box-sizing: border-box; }

          /* 🎨 エメラルド・ティール系テーマ（信頼と清潔感） */
          .theme-light {
            --bg-gradient: linear-gradient(135deg, #ecfdf5 0%, #ccfbf1 50%, #f0fdfa 100%);
            --text-main: #0f766e;
            --text-sub: #115e59;
            --card-bg: rgba(255, 255, 255, 0.85);
            --card-border: rgba(255, 255, 255, 1);
            --card-hover-border: #10b981; 
            --card-hover-bg: rgba(255, 255, 255, 0.95);
            --card-shadow: 0 10px 30px rgba(0,0,0,0.04);
            --title-color: #047857; 
            --accent-color: #14b8a6; 
            --input-bg: rgba(255, 255, 255, 0.9);
            --input-border: rgba(94, 234, 212, 0.5); 
            --svg-color: rgba(16, 185, 129, 0.2);
            --particle-color: #6ee7b7; 
          }
          
          .theme-dark {
            --bg-gradient: radial-gradient(ellipse at top left, #064e3b 0%, #020617 100%);
            --text-main: #f8fafc;
            --text-sub: #ccfbf1;
            --card-bg: rgba(13, 25, 20, 0.65);
            --card-border: rgba(255, 255, 255, 0.1);
            --card-hover-border: #34d399;
            --card-hover-bg: rgba(20, 40, 30, 0.85);
            --card-shadow: 0 20px 50px rgba(0,0,0,0.8);
            --title-color: #6ee7b7; 
            --accent-color: #34d399;
            --input-bg: rgba(0, 0, 0, 0.4);
            --input-border: rgba(52, 211, 153, 0.3);
            --svg-color: rgba(16, 185, 129, 0.15);
            --particle-color: #a7f3d0;
          }

          .app-wrapper { 
            min-height: 100vh; padding: 20px 40px 100px 40px; 
            font-family: 'Inter', 'Noto Sans JP', sans-serif; 
            color: var(--text-main); font-size: 13px; 
            transition: color 0.5s; position: relative;
          }

          .entrance-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -2; transition: background 0.8s ease; }
          .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; }
          .particle { position: absolute; border-radius: 50%; background: var(--particle-color); box-shadow: 0 0 10px var(--particle-color); animation: flowUp 8s infinite ease-in-out; }
          @keyframes flowUp { 0% { opacity: 0.1; transform: translateY(20px) scale(0.5); } 50% { opacity: 0.8; transform: translateY(-50px) scale(1.2); } 100% { opacity: 0.1; transform: translateY(-100px) scale(0.5); } }

          /* 🎈 ナビゲーション */
          .glass-nav-wrapper { display: flex; justify-content: center; margin-bottom: 30px; margin-top: 20px;}
          .glass-nav { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: var(--card-bg); backdrop-filter: blur(16px); border: 1px solid var(--card-border); border-radius: 50px; box-shadow: var(--card-shadow); max-width: 800px; width: 100%; }
          .nav-left { display: flex; gap: 12px; align-items: center; }
          .glass-nav-link { text-decoration: none; padding: 10px 20px; border-radius: 30px; font-weight: 800; background: var(--input-bg); color: var(--text-sub); border: 1px solid var(--card-border); transition: 0.2s; font-size: 14px; }
          .glass-nav-active { padding: 10px 20px; border-radius: 30px; font-weight: 900; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); font-size: 14px; }
          .theme-toggle-btn { background: var(--input-bg); border: 1px solid var(--card-border); padding: 10px 20px; border-radius: 30px; cursor: pointer; transition: 0.3s; font-size: 14px; color: var(--text-main); font-weight: 800; }

          /* 🌟 レイアウト */
          .main-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; max-width: 1200px; margin: 0 auto; }
          @media (max-width: 950px) { .main-layout { grid-template-columns: 1fr; } }

          .glass-panel { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 24px; padding: 30px; box-shadow: var(--card-shadow); transition: 0.3s ease; position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 20px;}
          .glass-panel:hover { border-color: var(--card-hover-border); transform: translateY(-2px); }
          .glass-panel::before { content: ''; position: absolute; top: 0; left: 0; width: 6px; height: 100%; background: linear-gradient(180deg, #10b981, #14b8a6); opacity: 0.8; }

          .section-title { font-weight: 900; font-size: 18px; color: var(--title-color); margin-bottom: 5px; border-bottom: 2px dashed var(--card-border); padding-bottom: 15px;}

          /* UIパーツ */
          .slider-container { background: var(--input-bg); padding: 20px; border-radius: 16px; border: 1px solid var(--input-border); }
          .slider-label { display: flex; justify-content: space-between; align-items: baseline; font-size: 14px; font-weight: 800; color: var(--text-sub); margin-bottom: 10px; }
          .slider-value { font-size: 32px; font-weight: 900; color: var(--accent-color); }
          .util-slider { -webkit-appearance: none; width: 100%; height: 8px; border-radius: 4px; background: var(--input-border); outline: none; }
          .util-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; border-radius: 50%; background: var(--accent-color); cursor: pointer; border: 2px solid #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); }

          .result-box { display: flex; justify-content: space-between; align-items: center; background: var(--input-bg); padding: 14px 18px; border-radius: 12px; border: 1px solid var(--input-border); transition: 0.2s; }
          .result-label { font-size: 13px; font-weight: 800; color: var(--text-sub); display: flex; align-items: center; gap: 8px; }
          .result-value { font-size: 18px; font-weight: 900; color: var(--text-main); }
          .total-box { background: linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(16, 185, 129, 0.2)); border: 2px solid var(--accent-color); }
          .total-box .result-label { color: var(--accent-color); font-size: 15px; }
          .total-box .result-value { font-size: 26px; color: var(--accent-color); }

          .script-bubble { background: var(--input-bg); padding: 20px; border-radius: 16px 16px 16px 0; border: 1px solid var(--input-border); font-size: 14px; line-height: 1.8; font-weight: 700; color: var(--text-main); position: relative; margin-bottom: 15px; border-left: 4px solid var(--accent-color); }
          .script-highlight { color: #e11d48; font-weight: 900; background: rgba(225, 29, 72, 0.08); padding: 1px 4px; border-radius: 4px; }

          .fade-up-element { opacity: 0; transform: translateY(30px); transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
          .fade-up-element.visible { opacity: 1; transform: translateY(0); }

          #toast { visibility: hidden; position: fixed; bottom: 30px; right: 30px; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--accent-color); padding: 12px 20px; border-radius: 10px; font-weight: 800; z-index: 100; opacity: 0; transition: 0.4s; }
          #toast.show { visibility: visible; opacity: 1; transform: translateY(-5px); }
        `}} />

        <SideMenu />

        <div className="glass-nav-wrapper fade-up-element">
          <div className="glass-nav">
            <div className="nav-left">
              <a href="/" className="glass-nav-link">← 司令室に戻る</a>
              <div className="glass-nav-active">🆚 シミュレーター(TEST版)</div>
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {isDarkMode ? "🎇 NIGHT" : "☀️ DAY"}
            </button>
          </div>
        </div>

        <div className="main-layout">
          {/* 🧮 計算機セクション */}
          <section className="glass-panel fade-up-element">
            <h2 className="section-title">📉 SB光 (StoStoS) 残債・CB計算</h2>
            
            <div className="slider-container">
              <div className="slider-label">
                <span>現在の利用月数 (G3セル)：</span>
                <span className="slider-value">{usedMonths}<span style={{fontSize: "14px", marginLeft:"5px"}}>ヶ月</span></span>
              </div>
              <input type="range" min="1" max="48" value={usedMonths} onChange={(e) => setUsedMonths(Number(e.target.value))} className="util-slider" />
            </div>

            <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
              <div className="result-box">
                <div className="result-label"><span>📉</span> 工事費残債 (H3セル)</div>
                <div className="result-value" style={remainingDebt === 0 ? {color:"#10b981"} : {}}>¥{remainingDebt.toLocaleString()}</div>
              </div>
              <div className="result-box">
                <div className="result-label"><span>🎁</span> 新住所工事費補填 (固定)</div>
                <div className="result-value">¥{FIXED_CB_NEW_INSTALLMENT.toLocaleString()}</div>
              </div>
              <div className="result-box">
                <div className="result-label"><span>✂️</span> 現・新解約金補填 (固定)</div>
                <div className="result-value">¥{FIXED_CB_PENALTY.toLocaleString()}</div>
              </div>
              <div className="result-box">
                <div className="result-label"><span>🔄</span> 1G戻し初期費用 (固定)</div>
                <div className="result-value">¥{FIXED_CB_DOWNGRADE.toLocaleString()}</div>
              </div>
              <div className="result-box total-box">
                <div className="result-label">💰 提示キャッシュバック合計</div>
                <div className="result-value">¥{finalCbTotal.toLocaleString()}</div>
              </div>
              {remainingDebt === 0 && (
                <div style={{fontSize:"11px", color:"#f59e0b", fontWeight:800, textAlign:"right"}}>
                  ※完済済みのため、CBは4万円に自動調整されています。
                </div>
              )}
            </div>
          </section>

          {/* 💬 トークスクリプトセクション */}
          <section className="glass-panel fade-up-element" style={{ transitionDelay: "0.1s" }}>
            <h2 className="section-title">💬 案内用トークスクリプト</h2>
            
            <div className="script-bubble">
              まず、ご新居先でも<span className="script-highlight">SB光をご継続いただくことできます</span>のでご安心ください！
            </div>
            
            <div className="script-bubble">
              今回、SB光お使いの方に、<span className="script-highlight">半年間月額料金無料で使える10G（高速回線）</span>のキャンペーンがありまして、今一番好評でおすすめしております。
            </div>

            <div className="script-bubble">
              10G開通に伴っての今お使いのSB光の解約金や残債（<span className="script-highlight">¥{remainingDebt.toLocaleString()}</span>）にかかる費用は、無料期間が終わる半年後に<span className="script-highlight">全額CB（¥{finalCbTotal.toLocaleString()}）で補填</span>させていただきます！
            </div>

            <div className="script-bubble">
              まずは半年間、実質タダで10Gを試していただき、CBを受け取った後に改めて1Gに戻すなどスマホに合わせた切り替えも自由にできます。その際の残債なども乗り換え先で全額補填されるので安心してください。
            </div>

            <div className="script-bubble" style={{background:"var(--card-hover-bg)", borderColor:"var(--accent-color)"}}>
              つまり、<span className="script-highlight">『実質半年間タダで高速回線を使って、一番いいタイミングでお得に乗り換える』</span>という、今のトレンドの使い方ができます！
            </div>
          </section>
        </div>

        <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>
      </main>
    </>
  );
}