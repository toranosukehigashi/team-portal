"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideMenu from "@/app/components/SideMenu";

// ✨ 背景の光の粒
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

  // 🌟 全体状態管理
  const [isReady, setIsReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
  
  // 💡 追加：シミュレーターのタブ切り替え
  const [activeTab, setActiveTab] = useState<"sb-hikari" | "sb-air">("sb-hikari");

  // ==========================================
  // 🧮 SB光 (StoStoS) 用ステート＆ロジック
  // ==========================================
  const [hikariUsedMonths, setHikariUsedMonths] = useState<number>(12);
  const [useHikariNewInstall, setUseHikariNewInstall] = useState(true);
  const [useHikariPenalty, setUseHikariPenalty] = useState(true);
  const [useHikariDowngrade, setUseHikariDowngrade] = useState(true);

  const HIKARI_TOTAL = 31680; 
  const HIKARI_MONTHLY = 1320; 
  const HIKARI_FIXED_NEW = 7920; 
  const HIKARI_FIXED_PENALTY = 10560;        
  const HIKARI_FIXED_DOWNGRADE = 8030;       

  let hikariRemaining = 0;
  if (hikariUsedMonths < 24) {
    hikariRemaining = HIKARI_TOTAL - (HIKARI_MONTHLY * hikariUsedMonths);
    if (hikariRemaining < 0) hikariRemaining = 0;
  } else {
    hikariRemaining = 0; 
  }

  const curHikariNew = useHikariNewInstall ? HIKARI_FIXED_NEW : 0;
  const curHikariPenalty = useHikariPenalty ? HIKARI_FIXED_PENALTY : 0;
  const curHikariDowngrade = useHikariDowngrade ? HIKARI_FIXED_DOWNGRADE : 0;
  const rawHikariCbTotal = curHikariNew + curHikariPenalty + curHikariDowngrade + hikariRemaining;
  const finalHikariCbTotal = hikariRemaining > 0 ? rawHikariCbTotal : 40000;


  // ==========================================
  // 🧮 SB Air (StoStoS) 用ステート＆ロジック
  // ==========================================
  const [airUsedMonths, setAirUsedMonths] = useState<number>(24);
  const [useAirNewInstall, setUseAirNewInstall] = useState(true);

  const AIR_TOTAL = 71280; 
  const AIR_MONTHLY = 1485; 
  const AIR_FIXED_NEW = 7920; // 10G工事費半年分

  let airRemaining = 0;
  if (airUsedMonths < 48) {
    airRemaining = AIR_TOTAL - (AIR_MONTHLY * airUsedMonths);
    if (airRemaining < 0) airRemaining = 0;
  } else {
    airRemaining = 0; 
  }

  const curAirNew = useAirNewInstall ? AIR_FIXED_NEW : 0;
  // SB Airは残債 ＋ (ONなら新住所工事費) がそのままCBになる（下限・上限なし）
  const finalAirCbTotal = airRemaining + curAirNew;


  useEffect(() => {
    setIsReady(true);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeTab]); // タブが切り替わった時もアニメーションを発火させる

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

          .app-wrapper { min-height: 100vh; padding: 20px 40px 100px 40px; font-family: 'Inter', 'Noto Sans JP', sans-serif; color: var(--text-main); font-size: 13px; transition: color 0.5s; position: relative; }
          .entrance-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -2; transition: background 0.8s ease; }
          .theme-light.entrance-bg { background: var(--bg-gradient); }
          .theme-dark.entrance-bg { background: var(--bg-gradient); }

          .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; }
          .particle { position: absolute; border-radius: 50%; background: var(--particle-color); box-shadow: 0 0 10px var(--particle-color); animation: flowUp 8s infinite ease-in-out; }
          @keyframes flowUp { 0% { opacity: 0.1; transform: translateY(20px) scale(0.5); } 50% { opacity: 0.8; transform: translateY(-50px) scale(1.2); } 100% { opacity: 0.1; transform: translateY(-100px) scale(0.5); } }

          .data-svg-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none; opacity: 0.8; }
          .data-path { fill: none; stroke: var(--svg-color); stroke-width: 2; stroke-dasharray: 1500; stroke-dashoffset: 1500; animation: drawDataFlow 15s linear infinite; transition: stroke 0.5s; }
          @keyframes drawDataFlow { 0% { stroke-dashoffset: 1500; } 100% { stroke-dashoffset: -1500; } }

          .glass-nav-wrapper { display: flex; justify-content: center; margin-bottom: 20px; margin-top: 20px;}
          .glass-nav { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: var(--card-bg); backdrop-filter: blur(16px); border: 1px solid var(--card-border); border-radius: 50px; box-shadow: var(--card-shadow); max-width: 800px; width: 100%; }
          .nav-left { display: flex; gap: 12px; align-items: center; }
          .glass-nav-link { text-decoration: none; padding: 10px 20px; border-radius: 30px; font-weight: 800; background: var(--input-bg); color: var(--text-sub); border: 1px solid var(--card-border); transition: 0.2s; font-size: 14px; }
          .glass-nav-link:hover { color: var(--accent-color); border-color: var(--card-hover-border); }
          .glass-nav-active { padding: 10px 20px; border-radius: 30px; font-weight: 900; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); font-size: 14px; }
          .theme-toggle-btn { background: var(--input-bg); border: 1px solid var(--card-border); padding: 10px 20px; border-radius: 30px; cursor: pointer; transition: 0.3s; font-size: 14px; color: var(--text-main); font-weight: 800; }

          /* 💡 タブ切り替えUI */
          .sim-tabs-wrapper { display: flex; justify-content: center; margin-bottom: 30px; }
          .sim-tabs { display: flex; background: var(--input-bg); padding: 6px; border-radius: 20px; border: 1px solid var(--card-border); box-shadow: var(--card-shadow); }
          .sim-tab-btn { padding: 12px 30px; border: none; border-radius: 14px; font-size: 15px; font-weight: 900; cursor: pointer; transition: 0.3s; background: transparent; color: var(--text-sub); letter-spacing: 1px; }
          .sim-tab-btn.active { background: linear-gradient(135deg, #10b981, #14b8a6); color: #fff; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); pointer-events: none; }
          .sim-tab-btn:hover:not(.active) { color: var(--accent-color); background: rgba(255,255,255,0.5); }

          .main-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; max-width: 1200px; margin: 0 auto; }
          @media (max-width: 950px) { .main-layout { grid-template-columns: 1fr; } }

          .glass-panel { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 24px; padding: 30px; box-shadow: var(--card-shadow); transition: 0.3s ease; position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 20px;}
          .glass-panel:hover { border-color: var(--card-hover-border); transform: translateY(-2px); }
          .glass-panel.highlight-panel::before { content: ''; position: absolute; top: 0; left: 0; width: 6px; height: 100%; background: linear-gradient(180deg, #10b981, #14b8a6); opacity: 0.8; }

          .section-title { font-weight: 900; font-size: 18px; color: var(--title-color); margin-bottom: 5px; border-bottom: 2px dashed var(--card-border); padding-bottom: 15px;}

          .slider-container { display: flex; flex-direction: column; gap: 10px; background: var(--input-bg); padding: 20px; border-radius: 16px; border: 1px solid var(--input-border); }
          .slider-label { display: flex; justify-content: space-between; align-items: baseline; font-size: 14px; font-weight: 800; color: var(--text-sub); margin-bottom: 10px; }
          .slider-value { font-size: 32px; font-weight: 900; color: var(--accent-color); text-shadow: 0 2px 10px rgba(20, 184, 166, 0.2); }
          .util-slider { -webkit-appearance: none; width: 100%; height: 8px; border-radius: 4px; background: var(--input-border); outline: none; transition: 0.2s; }
          .util-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; border-radius: 50%; background: var(--accent-color); cursor: pointer; border: 2px solid #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); }

          .result-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
          .result-box { display: flex; justify-content: space-between; align-items: center; background: var(--input-bg); padding: 14px 18px; border-radius: 12px; border: 1px solid var(--input-border); transition: 0.2s; }
          .result-box:hover { border-color: var(--accent-color); transform: translateX(5px); }
          .result-label { font-size: 13px; font-weight: 800; color: var(--text-sub); display: flex; align-items: center; gap: 8px; }
          .result-value { font-size: 18px; font-weight: 900; color: var(--text-main); transition: 0.3s; }
          
          .toggle-btn { background: var(--card-bg); border: 1px solid var(--card-border); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 900; cursor: pointer; transition: 0.3s; color: var(--text-sub); letter-spacing: 1px;}
          .toggle-btn.on { background: rgba(16, 185, 129, 0.15); border-color: var(--accent-color); color: var(--accent-color); box-shadow: 0 2px 10px rgba(16, 185, 129, 0.2);}
          .toggle-btn.off { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #ef4444; }

          .total-box { background: linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(16, 185, 129, 0.2)); border: 2px solid var(--accent-color); margin-top: 10px;}
          .total-box .result-label { color: var(--accent-color); font-size: 15px; }
          .total-box .result-value { font-size: 28px; color: var(--accent-color); text-shadow: 0 2px 5px rgba(20, 184, 166, 0.3); }

          .script-bubble { background: var(--input-bg); padding: 20px; border-radius: 16px 16px 16px 0; border: 1px solid var(--input-border); font-size: 14px; line-height: 1.8; font-weight: 700; color: var(--text-main); position: relative; margin-bottom: 15px; border-left: 4px solid var(--accent-color); transition: 0.3s; }
          .script-bubble::after { content: ''; position: absolute; bottom: -10px; left: -1px; border-width: 10px 10px 0 0; border-style: solid; border-color: var(--accent-color) transparent transparent transparent; }
          .script-highlight { color: #e11d48; font-weight: 900; background: rgba(225, 29, 72, 0.08); padding: 1px 4px; border-radius: 4px; transition: 0.3s; }
          .theme-dark .script-highlight { color: #fb7185; background: rgba(251, 113, 133, 0.15); }

          .fade-up-element { opacity: 0; transform: translateY(40px); transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
          .fade-up-element.visible { opacity: 1; transform: translateY(0); }

          #toast { visibility: hidden; position: fixed; bottom: 30px; right: 30px; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--accent-color); padding: 12px 20px; border-radius: 10px; font-weight: 800; z-index: 100; opacity: 0; transition: 0.4s; }
          #toast.show { visibility: visible; opacity: 1; transform: translateY(-5px); }
        `}} />

        <svg className="data-svg-bg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path className="data-path" d="M -10,20 L 30,20 L 40,50 L 80,50 L 110,20" />
          <path className="data-path" d="M -10,80 L 40,80 L 60,30 L 90,30 L 110,80" style={{animationDelay: "3s", opacity: 0.5}} />
        </svg>

        <SideMenu />

        <div className="glass-nav-wrapper fade-up-element" style={{ "--delay": "0s" } as any}>
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

        {/* 💡 シミュレーター切り替えタブ */}
        <div className="sim-tabs-wrapper fade-up-element">
          <div className="sim-tabs">
            <button className={`sim-tab-btn ${activeTab === "sb-hikari" ? "active" : ""}`} onClick={() => setActiveTab("sb-hikari")}>
              🏢 SB光 (StoStoS)
            </button>
            <button className={`sim-tab-btn ${activeTab === "sb-air" ? "active" : ""}`} onClick={() => setActiveTab("sb-air")}>
              🏠 SB Air (StoStoS)
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 🏢 SB光 (StoStoS) の画面 */}
        {/* ======================================================== */}
        {activeTab === "sb-hikari" && (
          <div className="main-layout">
            <section className="glass-panel highlight-panel fade-up-element">
              <h2 className="section-title">🧮 SB光 (StoStoS) 残債・CB計算</h2>
              
              <div className="slider-container">
                <div className="slider-label">
                  <span>現在の利用月数を入力：</span>
                  <span className="slider-value">{hikariUsedMonths}<span style={{fontSize: "14px", marginLeft:"5px"}}>ヶ月</span></span>
                </div>
                <input type="range" min="1" max="48" value={hikariUsedMonths} onChange={(e) => setHikariUsedMonths(Number(e.target.value))} className="util-slider" />
                <div style={{display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-sub)", fontWeight: 800, marginTop:"5px"}}>
                  <span>1ヶ月</span><span>24ヶ月</span><span>48ヶ月</span>
                </div>
              </div>

              <div className="result-grid">
                <div className="result-box">
                  <div className="result-label"><span>📉</span> 工事費 残債</div>
                  <div className="result-value" style={hikariRemaining === 0 ? {color: "#10b981"} : {}}>¥{hikariRemaining.toLocaleString()}</div>
                </div>

                <div className="result-box">
                  <div className="result-label"><span>🎁</span> 新住所半年分 工事費補填</div>
                  <div style={{display: "flex", alignItems: "center", gap: "15px"}}>
                    <div className="result-value" style={{ textDecoration: !useHikariNewInstall ? "line-through" : "none", opacity: !useHikariNewInstall ? 0.4 : 1 }}>
                      ¥{HIKARI_FIXED_NEW.toLocaleString()}
                    </div>
                    <button className={`toggle-btn ${useHikariNewInstall ? "on" : "off"}`} onClick={() => setUseHikariNewInstall(!useHikariNewInstall)}>
                      {useHikariNewInstall ? "🟢 ON" : "🔴 OFF"}
                    </button>
                  </div>
                </div>

                <div className="result-box">
                  <div className="result-label"><span>✂️</span> 現・新住所 解約金補填</div>
                  <div style={{display: "flex", alignItems: "center", gap: "15px"}}>
                    <div className="result-value" style={{ textDecoration: !useHikariPenalty ? "line-through" : "none", opacity: !useHikariPenalty ? 0.4 : 1 }}>
                      ¥{HIKARI_FIXED_PENALTY.toLocaleString()}
                    </div>
                    <button className={`toggle-btn ${useHikariPenalty ? "on" : "off"}`} onClick={() => setUseHikariPenalty(!useHikariPenalty)}>
                      {useHikariPenalty ? "🟢 ON" : "🔴 OFF"}
                    </button>
                  </div>
                </div>

                <div className="result-box">
                  <div className="result-label"><span>🔄</span> 1G変更時 初期費用・解約金</div>
                  <div style={{display: "flex", alignItems: "center", gap: "15px"}}>
                    <div className="result-value" style={{ textDecoration: !useHikariDowngrade ? "line-through" : "none", opacity: !useHikariDowngrade ? 0.4 : 1 }}>
                      ¥{HIKARI_FIXED_DOWNGRADE.toLocaleString()}
                    </div>
                    <button className={`toggle-btn ${useHikariDowngrade ? "on" : "off"}`} onClick={() => setUseHikariDowngrade(!useHikariDowngrade)}>
                      {useHikariDowngrade ? "🟢 ON" : "🔴 OFF"}
                    </button>
                  </div>
                </div>

                <div className="result-box total-box">
                  <div className="result-label">💰 お客様へ提示する CB Total</div>
                  <div className="result-value">¥{finalHikariCbTotal.toLocaleString()}</div>
                </div>
                
                {hikariRemaining === 0 && (
                   <div style={{fontSize: "11px", color: "#f59e0b", fontWeight: 800, textAlign: "right", marginTop: "-5px"}}>
                     ※工事費残債がないため、CBは最低保証の4万円に調整されています。
                   </div>
                )}
              </div>
            </section>

            <section className="glass-panel fade-up-element" style={{ transitionDelay: "0.1s" }}>
              <h2 className="section-title">💬 乗換提案 トークスクリプト</h2>
              <div className="script-bubble">まず、ご新居先でも<span className="script-highlight">SB光をご継続いただくことできます</span>のでご安心ください！</div>
              <div className="script-bubble">今回、SB光お使いの方に、<span className="script-highlight">半年間月額料金無料で使える10G（高速回線）</span>のキャンペーンがありまして、今一番好評でおすすめしております。</div>
              <div className="script-bubble">また、10G開通に伴っての今お使いのSB光の解約金や残債（¥{hikariRemaining.toLocaleString()}）にかかる費用は、無料期間が終わるちょうど半年後に<span className="script-highlight" style={{ fontSize: "16px" }}>全額CB（¥{finalHikariCbTotal.toLocaleString()}）で補填</span>させていただきます！</div>
              <div className="script-bubble">実際のSB光10Gの月額料金は1Gより1000円ほど上がるため、まずはこのキャンペーンで<span className="script-highlight">半年間は実質タダ</span>でネットを使っていただき、CBを受け取ったちょうど半年後に、改めてスマホに合わせたネット回線に切り替えて（SB光1Gに戻すなど）いただくこともできます。</div>
              <div className="script-bubble">切り替え時の残債なども、乗り換え先のキャンペーンが適応されてしっかり全額補填されますのでご安心ください！</div>
              <div className="script-bubble" style={{background: "var(--card-hover-bg)", borderColor: "var(--accent-color)"}}>つまり、<span className="script-highlight">『実質半年間はタダで使って、一番いいタイミングで携帯キャリアに合わせて割安料金帯のものに乗り換えることもできる』</span>という、お客様の負担が一番少なく、かつお得になる『今人気のトレンドの使い方』ができます！</div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* 🏠 SB Air (StoStoS) の画面 */}
        {/* ======================================================== */}
        {activeTab === "sb-air" && (
          <div className="main-layout">
            <section className="glass-panel highlight-panel fade-up-element">
              <h2 className="section-title">🧮 SB Air (StoStoS) 残債・CB計算</h2>
              
              <div className="slider-container">
                <div className="slider-label">
                  <span>現在の利用月数を入力：</span>
                  <span className="slider-value">{airUsedMonths}<span style={{fontSize: "14px", marginLeft:"5px"}}>ヶ月</span></span>
                </div>
                <input type="range" min="1" max="48" value={airUsedMonths} onChange={(e) => setAirUsedMonths(Number(e.target.value))} className="util-slider" />
                <div style={{display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-sub)", fontWeight: 800, marginTop:"5px"}}>
                  <span>1ヶ月</span><span>24ヶ月</span><span>48ヶ月</span>
                </div>
              </div>

              <div className="result-grid">
                <div className="result-box">
                  <div className="result-label"><span>📉</span> ターミナル 残債 (最大48回)</div>
                  <div className="result-value" style={airRemaining === 0 ? {color: "#10b981"} : {}}>
                    ¥{airRemaining.toLocaleString()}
                  </div>
                </div>

                <div className="result-box">
                  <div className="result-label"><span>🎁</span> 新住所半年分 工事費補填</div>
                  <div style={{display: "flex", alignItems: "center", gap: "15px"}}>
                    <div className="result-value" style={{ textDecoration: !useAirNewInstall ? "line-through" : "none", opacity: !useAirNewInstall ? 0.4 : 1 }}>
                      ¥{AIR_FIXED_NEW.toLocaleString()}
                    </div>
                    <button className={`toggle-btn ${useAirNewInstall ? "on" : "off"}`} onClick={() => setUseAirNewInstall(!useAirNewInstall)}>
                      {useAirNewInstall ? "🟢 ON" : "🔴 OFF"}
                    </button>
                  </div>
                </div>

                <div className="result-box total-box">
                  <div className="result-label">💰 お客様へ提示する CB Total</div>
                  <div className="result-value">¥{finalAirCbTotal.toLocaleString()}</div>
                </div>
                
                {airUsedMonths >= 12 && (
                   <div style={{fontSize: "11px", color: "#10b981", fontWeight: 800, textAlign: "right", marginTop: "-5px"}}>
                     ※1年以上ご利用のため、ターミナル残債を全額CB補填可能です！
                   </div>
                )}
              </div>
            </section>

            <section className="glass-panel fade-up-element" style={{ transitionDelay: "0.1s" }}>
              <h2 className="section-title">💬 Air用 乗換提案 トークスクリプト</h2>
              
              <div className="script-bubble">
                今回、SB Air お使いの方に、<span className="script-highlight">SB光の10G（高速回線）を半年間月額料金無料で使えるキャンペーン</span>がありまして、今一番好評でおすすめしております。
              </div>

              <div className="script-bubble">
                また、10G開通に伴っての、今お使いのSB Airの解約金等にかかる費用は無料期間が終わるちょうど半年間後に<span className="script-highlight" style={{ fontSize: "16px" }}>全額CB（¥{finalAirCbTotal.toLocaleString()}）で補填</span>させていただきます。
              </div>

              <div className="script-bubble">
                実際のSB光10Gの月額料金はSB Airより1000円ほど上がるため、まずはこのCPで、半年間は実質タダでネットを使っていただき、CBを受け取ったちょうど半年後に、改めてスマホに合わせてたネット回線に切り替えて（SB光1Gなど）いただくこともできます。
              </div>

              <div className="script-bubble">
                切り替え時の残債なども、乗り換え先のキャンペーン適応されてしっかり全額補填されますのでご安心ください。
              </div>

              <div className="script-bubble" style={{background: "var(--card-hover-bg)", borderColor: "var(--accent-color)"}}>
                つまり、<span className="script-highlight">『実質半年間はタダで使って、一番いいタイミングで携帯キャリアに合わせて割安料金帯のものに乗り換えることもできる』</span>という、お客様の負担が一番少なく、かつお得になる『今人気のトレンドの使い方』ができます！
              </div>

              <div className="script-bubble">
                基本的にはこの使い方を、多くの方がを選ばれていますが… こういった人気のご内容でしたら、<span className="script-highlight">ご新居先ではSB光10Gの方で開通部分お任せいただいても、ご迷惑無かったでしょうか？</span>
              </div>
            </section>
          </div>
        )}

        <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>
      </main>
    </>
  );
}