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
  
  // 💡 4つのタブをすべて管理！
  const [activeTab, setActiveTab] = useState<"sb-hikari" | "sb-air" | "docomo-hikari" | "flets-hikari">("sb-hikari");

  // ==========================================
  // 🧮 1. SB光 (StoStoS) ロジック
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
  // 🧮 2. SB Air (StoStoS) ロジック
  // ==========================================
  const [airUsedMonths, setAirUsedMonths] = useState<number>(24);
  const [useAirNewInstall, setUseAirNewInstall] = useState(true);

  const AIR_TOTAL = 71280; 
  const AIR_MONTHLY = 1485; 
  const AIR_FIXED_NEW = 7920; 

  let airRemaining = 0;
  if (airUsedMonths < 48) {
    airRemaining = AIR_TOTAL - (AIR_MONTHLY * airUsedMonths);
    if (airRemaining < 0) airRemaining = 0;
  } else {
    airRemaining = 0; 
  }

  const curAirNew = useAirNewInstall ? AIR_FIXED_NEW : 0;
  const finalAirCbTotal = airRemaining + curAirNew;

  // ==========================================
  // 🧮 3. docomo光 (D to D) ロジック
  // ==========================================
  const [docomoMonths, setDocomoMonths] = useState<number>(12);
  const [docomoPlan, setDocomoPlan] = useState<"mansion" | "family">("mansion");
  const [useDocomoPenalty, setUseDocomoPenalty] = useState(true);
  const [useDocomoInitial, setUseDocomoInitial] = useState(true);

  const DOCOMO_CONSTRUCTION_FEE = 22000;
  const DOCOMO_INITIAL_FEE = 3300; 
  const DOCOMO_RELOCATION_FEE = 2200;

  let docomoRemaining = 0;
  if (docomoMonths === 0) docomoRemaining = 22000;
  else if (docomoMonths >= 24) docomoRemaining = 0;
  else docomoRemaining = 22000 - (932 + (docomoMonths - 1) * 916);

  const docomoPenaltyBase = docomoPlan === "mansion" ? 4180 : 5500;
  const curDocomoPenalty = useDocomoPenalty ? docomoPenaltyBase : 0;
  const curDocomoInitial = useDocomoInitial ? DOCOMO_INITIAL_FEE : 0;
  
  const finalDocomoCbTotal = docomoRemaining + curDocomoPenalty + curDocomoInitial;
  const totalRelocationCost = DOCOMO_CONSTRUCTION_FEE + DOCOMO_RELOCATION_FEE + docomoRemaining;

  // ==========================================
  // 🌐 4. フレッツ光（半年間無料）ロジック
  // ==========================================
  const MASTER_DATA = {
    "ドコモ光": { total: 22000, split: 24, penalty: 4180, years: 2 },
    "SB光": { total: 31680, split: 24, penalty: 4180, years: 2 },
    "BIGLOBE光": { total: 28600, split: 36, penalty: 3000, years: 3 },
    "au光": { total: 33000, split: 36, penalty: 4730, years: 3 },
    "SB Air": { total: 71280, split: 48, penalty: 0, years: 4 },
  };
  
  const FLETS_PLANS = {
    "MS_P2": { name: "マンション P2", monthly: 4675, initial: 880, install: 22000, penalty: 2200 },
    "MS_P1": { name: "マンション P1", monthly: 5115, initial: 880, install: 22000, penalty: 2200 },
    "MS_MINI": { name: "マンション ミニ", monthly: 5885, initial: 880, install: 22000, penalty: 2200 },
    "FM_1G": { name: "ファミリー 1G", monthly: 6490, initial: 880, install: 22000, penalty: 4400 },
  };

  const [hasCurrentLine, setHasCurrentLine] = useState(true);
  const [fletsSelectedLine, setFletsSelectedLine] = useState<keyof typeof MASTER_DATA>("ドコモ光");
  const [fletsUsedMonths, setFletsUsedMonths] = useState<number>(12);
  const [fletsPlan, setFletsPlan] = useState<keyof typeof FLETS_PLANS>("MS_P2");
  const [fletsTalkScenario, setFletsTalkScenario] = useState<number>(1);

  const currentLineData = MASTER_DATA[fletsSelectedLine];
  
  let oldLineRemaining = 0;
  if (fletsUsedMonths < currentLineData.split) {
    const monthlyInstallment = currentLineData.total / currentLineData.split;
    oldLineRemaining = Math.floor(currentLineData.total - (monthlyInstallment * fletsUsedMonths));
    if (oldLineRemaining < 0) oldLineRemaining = 0;
  }
  const oldLineTotalCost = oldLineRemaining + currentLineData.penalty;

  const selectedFlets = FLETS_PLANS[fletsPlan];
  const halfYearMonthlyCost = selectedFlets.monthly * 6;
  const fixedFletsInstallHalf = 7365; 

  let fletsCbTotal = 0;
  if (hasCurrentLine) {
    fletsCbTotal = oldLineTotalCost + selectedFlets.initial + fixedFletsInstallHalf + halfYearMonthlyCost;
  } else {
    fletsCbTotal = selectedFlets.initial + selectedFlets.install + selectedFlets.penalty + halfYearMonthlyCost;
  }

  useEffect(() => {
    setIsReady(true);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeTab]);

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
          .theme-light { --bg-gradient: linear-gradient(135deg, #ecfdf5 0%, #ccfbf1 50%, #f0fdfa 100%); --text-main: #0f766e; --text-sub: #115e59; --card-bg: rgba(255, 255, 255, 0.85); --card-border: rgba(255, 255, 255, 1); --card-hover-border: #10b981; --card-hover-bg: rgba(255, 255, 255, 0.95); --card-shadow: 0 10px 30px rgba(0,0,0,0.04); --title-color: #047857; --accent-color: #14b8a6; --input-bg: rgba(255, 255, 255, 0.9); --input-border: rgba(94, 234, 212, 0.5); --svg-color: rgba(16, 185, 129, 0.2); --particle-color: #6ee7b7; }
          .theme-dark { --bg-gradient: radial-gradient(ellipse at top left, #064e3b 0%, #020617 100%); --text-main: #f8fafc; --text-sub: #ccfbf1; --card-bg: rgba(13, 25, 20, 0.65); --card-border: rgba(255, 255, 255, 0.1); --card-hover-border: #34d399; --card-hover-bg: rgba(20, 40, 30, 0.85); --card-shadow: 0 20px 50px rgba(0,0,0,0.8); --title-color: #6ee7b7; --accent-color: #34d399; --input-bg: rgba(0, 0, 0, 0.4); --input-border: rgba(52, 211, 153, 0.3); --svg-color: rgba(16, 185, 129, 0.15); --particle-color: #a7f3d0; }
          .app-wrapper { min-height: 100vh; padding: 20px 40px 100px 40px; font-family: 'Inter', 'Noto Sans JP', sans-serif; color: var(--text-main); font-size: 13px; transition: color 0.5s; position: relative; }
          .entrance-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -2; transition: background 0.8s ease; }
          .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; }
          .particle { position: absolute; border-radius: 50%; background: var(--particle-color); box-shadow: 0 0 10px var(--particle-color); animation: flowUp 8s infinite ease-in-out; }
          @keyframes flowUp { 0% { opacity: 0.1; transform: translateY(20px) scale(0.5); } 50% { opacity: 0.8; transform: translateY(-50px) scale(1.2); } 100% { opacity: 0.1; transform: translateY(-100px) scale(0.5); } }
          
          .glass-nav-wrapper { display: flex; justify-content: center; margin-bottom: 20px; margin-top: 20px;}
          .glass-nav { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: var(--card-bg); backdrop-filter: blur(16px); border: 1px solid var(--card-border); border-radius: 50px; box-shadow: var(--card-shadow); max-width: 800px; width: 100%; }
          .nav-left { display: flex; gap: 12px; align-items: center; }
          .glass-nav-link { text-decoration: none; padding: 10px 20px; border-radius: 30px; font-weight: 800; background: var(--input-bg); color: var(--text-sub); border: 1px solid var(--card-border); transition: 0.2s; font-size: 14px; }
          .glass-nav-active { padding: 10px 20px; border-radius: 30px; font-weight: 900; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); font-size: 14px; }
          .theme-toggle-btn { background: var(--input-bg); border: 1px solid var(--card-border); padding: 10px 20px; border-radius: 30px; cursor: pointer; transition: 0.3s; font-size: 14px; color: var(--text-main); font-weight: 800; }
          
          .sim-tabs-wrapper { display: flex; justify-content: center; margin-bottom: 30px; }
          .sim-tabs { display: flex; background: var(--input-bg); padding: 6px; border-radius: 20px; border: 1px solid var(--card-border); box-shadow: var(--card-shadow); gap: 5px; flex-wrap: wrap; justify-content: center;}
          .sim-tab-btn { padding: 10px 20px; border: none; border-radius: 14px; font-size: 13px; font-weight: 900; cursor: pointer; transition: 0.3s; background: transparent; color: var(--text-sub); }
          .sim-tab-btn.active { background: linear-gradient(135deg, #10b981, #14b8a6); color: #fff; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); pointer-events: none; }

          .main-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; max-width: 1200px; margin: 0 auto; }
          @media (max-width: 950px) { .main-layout { grid-template-columns: 1fr; } }
          .glass-panel { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 24px; padding: 30px; box-shadow: var(--card-shadow); transition: 0.3s ease; position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 20px;}
          .glass-panel.highlight-panel::before { content: ''; position: absolute; top: 0; left: 0; width: 6px; height: 100%; background: linear-gradient(180deg, #10b981, #14b8a6); opacity: 0.8; }
          .section-title { font-weight: 900; font-size: 18px; color: var(--title-color); margin-bottom: 5px; border-bottom: 2px dashed var(--card-border); padding-bottom: 15px;}
          
          .slider-container { display: flex; flex-direction: column; gap: 10px; background: var(--input-bg); padding: 20px; border-radius: 16px; border: 1px solid var(--input-border); }
          .slider-label { display: flex; justify-content: space-between; align-items: baseline; font-size: 14px; font-weight: 800; color: var(--text-sub); }
          .slider-value { font-size: 32px; font-weight: 900; color: var(--accent-color); }
          .util-slider { -webkit-appearance: none; width: 100%; height: 8px; border-radius: 4px; background: var(--input-border); outline: none; }
          .util-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; border-radius: 50%; background: var(--accent-color); cursor: pointer; border: 2px solid #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          
          .result-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
          .result-box { display: flex; justify-content: space-between; align-items: center; background: var(--input-bg); padding: 14px 18px; border-radius: 12px; border: 1px solid var(--input-border); transition: 0.2s; }
          .result-label { font-size: 13px; font-weight: 800; color: var(--text-sub); display: flex; align-items: center; gap: 8px; }
          .result-value { font-size: 18px; font-weight: 900; color: var(--text-main); transition: 0.3s; }
          
          .toggle-btn { background: var(--card-bg); border: 1px solid var(--card-border); padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 900; cursor: pointer; color: var(--text-sub); }
          .toggle-btn.on { background: rgba(16, 185, 129, 0.15); border-color: var(--accent-color); color: var(--accent-color); }
          .toggle-btn.off { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #ef4444; }
          .total-box { background: linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(16, 185, 129, 0.2)); border: 2px solid var(--accent-color); margin-top: 10px;}
          .total-box .result-label { color: var(--accent-color); font-size: 15px; }
          .total-box .result-value { font-size: 26px; color: var(--accent-color); }
          
          .script-bubble { background: var(--input-bg); padding: 20px; border-radius: 16px 16px 16px 0; border: 1px solid var(--input-border); font-size: 14px; line-height: 1.8; font-weight: 700; color: var(--text-main); position: relative; margin-bottom: 15px; border-left: 4px solid var(--accent-color); }
          .script-bubble::after { content: ''; position: absolute; bottom: -10px; left: -1px; border-width: 10px 10px 0 0; border-style: solid; border-color: var(--accent-color) transparent transparent transparent; }
          .script-highlight { color: #e11d48; font-weight: 900; background: rgba(225, 29, 72, 0.08); padding: 1px 4px; border-radius: 4px; }
          
          .script-guest { background: rgba(0,0,0,0.03); border-left: 4px solid #64748b; margin-left: 20px; border-radius: 16px 16px 0 16px;}
          .script-guest::after { right: -1px; left: auto; border-width: 10px 0 0 10px; border-color: #64748b transparent transparent transparent; }
          .script-me { background: rgba(16, 185, 129, 0.05); border-left: 4px solid #10b981; }
          .script-me::after { border-color: #10b981 transparent transparent transparent; }

          .fade-up-element { opacity: 0; transform: translateY(40px); transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
          .fade-up-element.visible { opacity: 1; transform: translateY(0); }

          .vs-container { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
          .vs-card { padding: 15px; border-radius: 16px; border: 1px solid var(--card-border); background: var(--input-bg); position: relative;}
          .vs-card.bad { border-color: #ef4444; background: rgba(239, 68, 68, 0.05); }
          .vs-card.good { border-color: #10b981; background: rgba(16, 185, 129, 0.05); border-width: 2px;}
          .vs-label { font-size: 11px; font-weight: 900; margin-bottom: 8px; display: block; }
          .vs-price { font-size: 22px; font-weight: 900; }
          .vs-detail { font-size: 10px; color: var(--text-sub); margin-top: 5px; line-height: 1.4; font-weight: 800;}
          .vs-badge { position: absolute; top: -10px; right: 10px; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 900; color: #fff;}

          .plan-switcher { display: flex; gap: 8px; background: var(--card-bg); padding: 4px; border-radius: 12px; border: 1px solid var(--card-border); margin-bottom: 5px; flex-wrap: wrap;}
          .plan-btn { flex: 1; padding: 10px 4px; border: none; border-radius: 8px; font-weight: 900; font-size: 11px; cursor: pointer; background: transparent; color: var(--text-sub); transition: 0.2s; text-align: center; white-space: nowrap;}
          .plan-btn.active { background: var(--accent-color); color: #fff; box-shadow: 0 2px 8px rgba(20, 184, 166, 0.3); }
          .select-input { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--input-border); background: var(--input-bg); color: var(--text-main); font-weight: 800; outline: none; margin-bottom: 10px; appearance: none; cursor: pointer;}
          
          .prompter-tabs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 15px; }
          .prompter-btn { padding: 8px 12px; border-radius: 8px; font-size: 11px; font-weight: 900; border: 1px solid var(--card-border); background: var(--card-bg); color: var(--text-sub); cursor: pointer; transition: 0.2s; }
          .prompter-btn.active { background: var(--card-hover-bg); color: var(--accent-color); border-color: var(--accent-color); box-shadow: 0 2px 8px rgba(20, 184, 166, 0.15); }
        `}} />

        <SideMenu />

        <div className="glass-nav-wrapper fade-up-element">
          <div className="glass-nav">
            <div className="nav-left">
              <a href="/" className="glass-nav-link">← 司令室に戻る</a>
              <div className="glass-nav-active">🆚 シミュレーター(TEST版)</div>
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme}>{isDarkMode ? "🎇 NIGHT" : "☀️ DAY"}</button>
          </div>
        </div>

        {/* 🌟 メインタブ切り替え 🌟 */}
        <div className="sim-tabs-wrapper fade-up-element">
          <div className="sim-tabs">
            <button className={`sim-tab-btn ${activeTab === "sb-hikari" ? "active" : ""}`} onClick={() => setActiveTab("sb-hikari")}>🏢 SB光</button>
            <button className={`sim-tab-btn ${activeTab === "sb-air" ? "active" : ""}`} onClick={() => setActiveTab("sb-air")}>🏠 SB Air</button>
            <button className={`sim-tab-btn ${activeTab === "docomo-hikari" ? "active" : ""}`} onClick={() => setActiveTab("docomo-hikari")}>📱 docomo光</button>
            <button className={`sim-tab-btn ${activeTab === "flets-hikari" ? "active" : ""}`} onClick={() => setActiveTab("flets-hikari")}>🌐 フレッツ光</button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 1. 🏢 SB光 (StoStoS) 画面 */}
        {/* ======================================================== */}
        {activeTab === "sb-hikari" && (
          <div className="main-layout">
            <section className="glass-panel highlight-panel fade-up-element">
              <h2 className="section-title">🧮 SB光 (StoStoS) 乗換シミュレーター</h2>
              
              <div className="slider-container">
                <div className="slider-label">
                  <span>現在の利用月数を入力：</span>
                  <span className="slider-value">{hikariUsedMonths}<span style={{fontSize: "14px", color:"var(--text-sub)", marginLeft:"5px"}}>ヶ月</span></span>
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
        {/* 2. 🏠 SB Air (StoStoS) 画面 */}
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
                  <div className="result-value" style={airRemaining === 0 ? {color: "#10b981"} : {}}>¥{airRemaining.toLocaleString()}</div>
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
              <div className="script-bubble">今回、SB Air お使いの方に、<span className="script-highlight">SB光の10G（高速回線）を半年間月額料金無料で使えるキャンペーン</span>がありまして、今一番好評でおすすめしております。</div>
              <div className="script-bubble">また、10G開通に伴っての、今お使いのSB Airの解約金等にかかる費用は無料期間が終わるちょうど半年間後に<span className="script-highlight" style={{ fontSize: "16px" }}>全額CB（¥{finalAirCbTotal.toLocaleString()}）で補填</span>させていただきます。</div>
              <div className="script-bubble">実際のSB光10Gの月額料金はSB Airより1000円ほど上がるため、まずはこのCPで、半年間は実質タダでネットを使っていただき、CBを受け取ったちょうど半年後に、改めてスマホに合わせてたネット回線に切り替えて（SB光1Gなど）いただくこともできます。</div>
              <div className="script-bubble">切り替え時の残債なども、乗り換え先のキャンペーン適応されてしっかり全額補填されますのでご安心ください。</div>
              <div className="script-bubble" style={{background: "var(--card-hover-bg)", borderColor: "var(--accent-color)"}}>つまり、<span className="script-highlight">『実質半年間はタダで使って、一番いいタイミングで携帯キャリアに合わせて割安料金帯のものに乗り換えることもできる』</span>という、お客様の負担が一番少なく、かつお得になる『今人気のトレンドの使い方』ができます！</div>
              <div className="script-bubble">基本的にはこの使い方を、多くの方がを選ばれていますが… こういった人気のご内容でしたら、<span className="script-highlight">ご新居先ではSB光10Gの方で開通部分お任せいただいても、ご迷惑無かったでしょうか？</span></div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. 📱 docomo光 (D to D) 画面 (魂の完全版) */}
        {/* ======================================================== */}
        {activeTab === "docomo-hikari" && (
          <div className="main-layout">
            <section className="glass-panel highlight-panel fade-up-element">
              <h2 className="section-title">🧮 docomo光 (D to D) 残債・CB計算</h2>
              
              <div className="plan-switcher">
                <button className={`plan-btn ${docomoPlan === "mansion" ? "active" : ""}`} onClick={() => setDocomoPlan("mansion")}>マンション (4180円)</button>
                <button className={`plan-btn ${docomoPlan === "family" ? "active" : ""}`} onClick={() => setDocomoPlan("family")}>ファミリー (5500円)</button>
              </div>

              <div className="slider-container">
                <div className="slider-label"><span>現在の経過月数：</span><span className="slider-value">{docomoMonths}ヶ月</span></div>
                <input type="range" min="1" max="24" value={docomoMonths} onChange={(e) => setDocomoMonths(Number(e.target.value))} className="util-slider" />
              </div>

              <div className="result-grid">
                <div className="result-box"><div className="result-label"><span>📉</span> 旧宅 工事費残債</div><div className="result-value">¥{docomoRemaining.toLocaleString()}</div></div>
                <div className="result-box"><div className="result-label"><span>✂️</span> 現プラン解約金</div><div style={{display:"flex", gap:"10px"}}><div className="result-value" style={{ opacity: !useDocomoPenalty ? 0.3 : 1 }}>¥{docomoPenaltyBase.toLocaleString()}</div><button className={`toggle-btn ${useDocomoPenalty ? "on" : "off"}`} onClick={() => setUseDocomoPenalty(!useDocomoPenalty)}>{useDocomoPenalty ? "ON" : "OFF"}</button></div></div>
                <div className="result-box"><div className="result-label"><span>📝</span> 新規事務手数料</div><div style={{display:"flex", gap:"10px"}}><div className="result-value" style={{ opacity: !useDocomoInitial ? 0.3 : 1 }}>¥{DOCOMO_INITIAL_FEE.toLocaleString()}</div><button className={`toggle-btn ${useDocomoInitial ? "on" : "off"}`} onClick={() => setUseDocomoInitial(!useDocomoInitial)}>{useDocomoInitial ? "ON" : "OFF"}</button></div></div>
                <div className="result-box total-box"><div className="result-label" style={{color:"var(--accent-color)", fontSize:"15px", fontWeight:900}}>💰 お客様へ渡す合計CB</div><div className="result-value" style={{color:"var(--accent-color)", fontSize:"26px"}}>¥{finalDocomoCbTotal.toLocaleString()}</div></div>
              </div>

              <div className="vs-container">
                <div className="vs-card bad">
                  <span className="vs-badge" style={{background:"#ef4444"}}>損</span>
                  <span className="vs-label">❌ 通常の移転手続き</span>
                  <span className="vs-price">¥{totalRelocationCost.toLocaleString()}</span>
                  <div className="vs-detail">工事費(2.2万) ＋ 事務手(2.2k) ＋ 残債(¥{docomoRemaining.toLocaleString()}) が全額自己負担。特典なし。</div>
                </div>
                <div className="vs-card good">
                  <span className="vs-badge" style={{background:"#10b981"}}>得</span>
                  <span className="vs-label">✅ 今回のD to D提案</span>
                  <span className="vs-price">¥0<span style={{fontSize:"10px", marginLeft:"5px"}}>※実質</span></span>
                  <div className="vs-detail">新居工事費は公式で実質無料。残債・解約金は私どもで全額CB補填！</div>
                </div>
              </div>
            </section>

            <section className="glass-panel fade-up-element" style={{ transitionDelay: "0.1s" }}>
              <h2 className="section-title">💬 docomo光 (D to D) 促しトーク</h2>
              
              <div className="script-bubble">
                ご新居先の設備を確認いたしましたところ、問題なくドコモ光がご利用いただけますのでご安心ください！<br/>
                ただ、継続いただく方の中で今人気でトレンドの使い方がありまして、お手続きの進め方によって、お客様の最終的なご負担額が大きく変わってしまうんです。
              </div>
              <div className="script-bubble">
                大きく分けて方法は2つあります。 1つ目は、お客様ご自身で**『移転（お引越し）』**の手続きをする方法。 2つ目は、今回私どもで引き続きドコモのご利用お申し込みをする方法です。
              </div>
              <div className="script-bubble">
                正直に申し上げますと、1つ目の『ご自身での移転』手続きは、あまりお勧めしておりません。<br/>
                なぜなら、移転でも新規でも、新居での開通工事費は基本的には発生してしまうのですが、 ご自身で移転手続きをされると、さらに**『移転事務手数料』**などが余計にかかってしまう上に、工事費補填する特典などが一切つかないため、単純にお客様の持ち出し（ご負担）になってしまうからです。
              </div>
              <div className="script-bubble">
                そこで、私どもでは2つ目の**『私どもの方でドコモご利用のお申し込みをする方法』**を推奨しております。（すなわち解約新規）<br/>
                この方法ですと、まず移転事務手数料はかからずに、工事費もdポイントで全額還元されます！<br/>
                また『現金キャッシュバック』もついてくるため、移転手続きしていただくよりもかなりお得にご継続いただけます！
              </div>
              <div className="script-bubble script-me">
                ちなみに、今のドコモ光はどのくらいの期間ご利用されていましたでしょうか？
              </div>
              <div className="script-bubble script-guest">
                お客様： 「えーっと、たしか〇年くらいかな…」
              </div>

              {docomoMonths < 12 ? (
                <div className="script-bubble script-me">東（あなた）： 「ありがとうございます！ （1年未満の場合）あ、それでしたら一番ランクの高い補填特典が適用できます！」</div>
              ) : (
                <div className="script-bubble script-me">東（あなた）： 「ありがとうございます！ （2年以上の場合）なるほど、長期で使っていただいているので感謝特典が適用できます！」</div>
              )}

              <div className="script-bubble script-me" style={{background: "var(--card-hover-bg)", borderColor: "var(--accent-color)"}}>
                具体的には、今回こちらで進めさせていただくことで… 今のドコモ光の解約手数料分も こちらから<span className="script-highlight" style={{fontSize:"16px"}}>現金【{finalDocomoCbTotal.toLocaleString()}円】のキャッシュバック</span>をお付けしますので、お渡しまで一度ご負担いただきますが、後で十分にお釣りがくる計算になります！
              </div>
              <div className="script-bubble">
                もちろん、携帯料金のセット割（550円〜1,100円）も、これまで通り適用可能です。<br/>
                今のドコモ光の解約方法なども含めて、一番スムーズな流れでサポートさせていただきますので、引越し先のドコモ光についてはこちらで進めさせていただいてよろしいでしょうか？
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* 🌐 4. フレッツ光（半年無料）画面 */}
        {/* ======================================================== */}
        {activeTab === "flets-hikari" && (
          <div className="main-layout">
            <section className="glass-panel highlight-panel fade-up-element">
              <h2 className="section-title">🧮 フレッツ光（半年無料）CB計算</h2>
              
              <div style={{display: "flex", gap: "10px", marginBottom: "5px"}}>
                <button className={`plan-btn ${hasCurrentLine ? "active" : ""}`} onClick={() => setHasCurrentLine(true)} style={{fontSize:"13px", padding:"12px"}}>✅ 利用中回線 あり</button>
                <button className={`plan-btn ${!hasCurrentLine ? "active" : ""}`} onClick={() => setHasCurrentLine(false)} style={{fontSize:"13px", padding:"12px"}}>❌ 利用中回線 なし</button>
              </div>

              {hasCurrentLine && (
                <div style={{background: "var(--input-bg)", padding: "15px", borderRadius: "16px", border: `1px solid var(--input-border)`}}>
                  <div className="section-title" style={{fontSize:"13px", borderBottom:"none", paddingBottom:0}}>📝 旧回線（マスタ）の設定</div>
                  <select className="select-input" value={fletsSelectedLine} onChange={(e) => setFletsSelectedLine(e.target.value as any)}>
                    {Object.keys(MASTER_DATA).map(key => ( <option key={key} value={key}>{key}</option> ))}
                  </select>
                  <div className="slider-container" style={{padding: "10px", background:"transparent", border:"none"}}>
                    <div className="slider-label"><span>利用月数 (MAX {currentLineData.split}ヶ月):</span><span className="slider-value" style={{fontSize:"24px"}}>{fletsUsedMonths}</span></div>
                    <input type="range" min="1" max={currentLineData.split} value={fletsUsedMonths} onChange={(e) => setFletsUsedMonths(Number(e.target.value))} className="util-slider" />
                  </div>
                </div>
              )}

              <div className="section-title" style={{fontSize:"13px", marginTop:"10px", borderBottom:"none", paddingBottom:0}}>🏢 フレッツのプランを選択</div>
              <div className="plan-switcher">
                {Object.entries(FLETS_PLANS).map(([key, plan]) => (
                  <button key={key} className={`plan-btn ${fletsPlan === key ? "active" : ""}`} onClick={() => setFletsPlan(key as any)}>
                    {plan.name}<br/><span style={{fontSize:"10px", opacity:0.8}}>¥{plan.monthly}</span>
                  </button>
                ))}
              </div>

              <div className="result-grid" style={{marginTop:"10px"}}>
                {hasCurrentLine ? (
                  <>
                    <div className="result-box"><div className="result-label"><span>📉</span> 旧回線の解約総費用 (残債＋解約金)</div><div className="result-value">¥{oldLineTotalCost.toLocaleString()}</div></div>
                    <div className="result-box"><div className="result-label"><span>📝</span> 初期費用</div><div className="result-value">¥{selectedFlets.initial.toLocaleString()}</div></div>
                    <div className="result-box"><div className="result-label"><span>🎁</span> フレッツ半年分 工事費補填</div><div className="result-value">¥{fixedFletsInstallHalf.toLocaleString()}</div></div>
                    <div className="result-box"><div className="result-label"><span>📅</span> フレッツ半年分 月額料金</div><div className="result-value">¥{halfYearMonthlyCost.toLocaleString()}</div></div>
                  </>
                ) : (
                  <>
                    <div className="result-box"><div className="result-label"><span>📝</span> 初期費用</div><div className="result-value">¥{selectedFlets.initial.toLocaleString()}</div></div>
                    <div className="result-box"><div className="result-label"><span>🎁</span> フレッツ工事費 全額補填</div><div className="result-value">¥{selectedFlets.install.toLocaleString()}</div></div>
                    <div className="result-box"><div className="result-label"><span>✂️</span> フレッツ解約金 補填</div><div className="result-value">¥{selectedFlets.penalty.toLocaleString()}</div></div>
                    <div className="result-box"><div className="result-label"><span>📅</span> フレッツ半年分 月額料金</div><div className="result-value">¥{halfYearMonthlyCost.toLocaleString()}</div></div>
                  </>
                )}
                <div className="result-box total-box">
                  <div className="result-label" style={{color:"var(--accent-color)", fontSize:"16px", fontWeight:900}}>💰 提示する補填額 (CB Total)</div>
                  <div className="result-value" style={{color:"var(--accent-color)", fontSize:"28px"}}>¥{fletsCbTotal.toLocaleString()}</div>
                </div>
              </div>
            </section>

            <section className="glass-panel fade-up-element" style={{ transitionDelay: "0.1s" }}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom: "2px dashed var(--card-border)", paddingBottom: "10px", marginBottom:"5px"}}>
                <h2 className="section-title" style={{borderBottom:"none", paddingBottom:0, marginBottom:0}}>💬 トーク切り替え</h2>
              </div>
              
              <div className="prompter-tabs">
                <button className={`prompter-btn ${fletsTalkScenario===1 ? "active":""}`} onClick={()=>setFletsTalkScenario(1)}>①回線有×ネット希望</button>
                <button className={`prompter-btn ${fletsTalkScenario===2 ? "active":""}`} onClick={()=>setFletsTalkScenario(2)}>②回線無×ネット希望</button>
                <button className={`prompter-btn ${fletsTalkScenario===3 ? "active":""}`} onClick={()=>setFletsTalkScenario(3)}>③回線有×現契約継続</button>
                <button className={`prompter-btn ${fletsTalkScenario===4 ? "active":""}`} onClick={()=>setFletsTalkScenario(4)}>④回線有×無料ネット</button>
                <button className={`prompter-btn ${fletsTalkScenario===5 ? "active":""}`} onClick={()=>setFletsTalkScenario(5)}>⑤回線無×無料ネット</button>
                <button className={`prompter-btn ${fletsTalkScenario===6 ? "active":""}`} onClick={()=>setFletsTalkScenario(6)}>⑥回線有×利用予定無</button>
              </div>

              {fletsTalkScenario === 1 && (
                <div className="fade-up-element visible">
                  <div className="script-bubble">通常、そのまま移転手続きをしてしまうと、移転費用かかったり『特典』が何もつかないケースがほとんどです。</div>
                  <div className="script-bubble">まずはフレッツ光でスタートしていただくと、今なら『実質半年間無料キャンペーン』として、半年分の月額料金と工事費・旧回線解約金相当額を<span className="script-highlight">全額キャッシュバック（¥{fletsCbTotal.toLocaleString()}）</span>させていただきます。</div>
                  <div className="script-bubble">キャッシュバックを受け取った半年後に、改めてスマホに合わせて切り替えていただくのが、一番負担が少なくお得な今のトレンドです！</div>
                </div>
              )}
              {fletsTalkScenario === 2 && (
                <div className="fade-up-element visible">
                  <div className="script-bubble">ネット利用ご希望ですね！今なら『実質半年間無料キャンペーン』でフレッツ光を導入できます。</div>
                  <div className="script-bubble">発生する初期費用や工事費全額、半年分の月額料金など<span className="script-highlight">全費用（¥{fletsCbTotal.toLocaleString()}）</span>を後日キャッシュバックいたします。</div>
                  <div className="script-bubble">継続して使う場合でも今後の開通工事は不要ですし、実質無料で半年間ネットが使えて、高速回線設備までついてくる非常にオトクなご案内です！</div>
                </div>
              )}
              {(fletsTalkScenario >= 3) && (
                <div className="fade-up-element visible">
                  <div className="script-bubble" style={{borderColor:"#f59e0b", background:"rgba(245, 158, 11, 0.05)"}}>
                    ⚠️ （プレースホルダー）<br/>
                    シナリオ {fletsTalkScenario} の具体的なトーク内容は準備でき次第ここに表示されます！
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>
      </main>
    </>
  );
}