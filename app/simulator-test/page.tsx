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

  // 🌟 状態管理
  const [usedMonths, setUsedMonths] = useState<number>(12);
  const [isReady, setIsReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  // 💡 追加：固定費用のON/OFF状態を管理するState
  const [useNewInstallment, setUseNewInstallment] = useState(true);
  const [usePenalty, setUsePenalty] = useState(true);
  const [useDowngrade, setUseDowngrade] = useState(true);

  // ==========================================
  // 💡 スプレッドシート関数の移植ロジック
  // ==========================================
  
  const TOTAL_INSTALLMENT = 31680; 
  const MONTHLY_INSTALLMENT = 1320; 
  
  const FIXED_CB_NEW_INSTALLMENT = 7920; 
  const FIXED_CB_PENALTY = 10560;        
  const FIXED_CB_DOWNGRADE = 8030;       

  // H3セル：残債の計算（24ヶ月以上なら残債は0）
  let remainingDebt = 0;
  if (usedMonths < 24) {
    remainingDebt = TOTAL_INSTALLMENT - (MONTHLY_INSTALLMENT * usedMonths);
    if (remainingDebt < 0) remainingDebt = 0;
  } else {
    remainingDebt = 0; 
  }

  // ON/OFFの状態に応じて足し合わせる金額を決定！
  const currentNewInstallment = useNewInstallment ? FIXED_CB_NEW_INSTALLMENT : 0;
  const currentPenalty = usePenalty ? FIXED_CB_PENALTY : 0;
  const currentDowngrade = useDowngrade ? FIXED_CB_DOWNGRADE : 0;

  // H9セル：合計キャッシュバック
  const rawCbTotal = currentNewInstallment + currentPenalty + currentDowngrade + remainingDebt;
  
  // 残債が0円の時は4万円（最低保証）にするロジック
  // ※もしすべてのチェックを外した時はどうするか？などを考慮し、今回は残債0の時は問答無用で4万になります。
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

          .glass-nav-wrapper { display: flex; justify-content: center; margin-bottom: 30px; margin-top: 20px;}
          .glass-nav { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: var(--card-bg); backdrop-filter: blur(16px); border: 1px solid var(--card-border); border-radius: 50px; box-shadow: var(--card-shadow); max-width: 800px; width: 100%; }
          .nav-left { display: flex; gap: 12px; align-items: center; }
          .glass-nav-link { text-decoration: none; padding: 10px 20px; border-radius: 30px; font-weight: 800; background: var(--input-bg); color: var(--text-sub); border: 1px solid var(--card-border); transition: 0.2s; font-size: 14px; }
          .glass-nav-link:hover { color: var(--accent-color); border-color: var(--card-hover-border); }
          .glass-nav-active { padding: 10px 20px; border-radius: 30px; font-weight: 900; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); font-size: 14px; }
          .theme-toggle-btn { background: var(--input-bg); border: 1px solid var(--card-border); padding: 10px 20px; border-radius: 30px; cursor: pointer; transition: 0.3s; font-size: 14px; color: var(--text-main); font-weight: 800; }

          .main-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; max-width: 1200px; margin: 0 auto; }
          @media (max-width: 950px) { .main-layout { grid-template-columns: 1fr; } }

          .glass-panel { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 24px; padding: 30px; box-shadow: var(--card-shadow); transition: 0.3s ease; position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 20px;}
          .glass-panel:hover { border-color: var(--card-hover-border); transform: translateY(-2px); }
          .glass-panel.highlight-panel::before { content: ''; position: absolute; top: 0; left: 0; width: 6px; height: 100%; background: linear-gradient(180deg, #10b981, #14b8a6); opacity: 0.8; }

          .section-title { font-weight: 900; font-size: 18px; color: var(--title-color); margin-bottom: 5px; border-bottom: 2px dashed var(--card-border); padding-bottom: 15px;}

          .slider-container { display: flex; flex-direction: column; gap: 10px; background: var(--input-bg); padding: 20px; border-radius: 16px; border: 1px solid var(--input-border); }
          .slider-label { display: flex; justify-content: space-between; align-items: baseline; font-size: 14px; font-weight: 800; color: var(--text-sub); }
          .slider-value { font-size: 32px; font-weight: 900; color: var(--accent-color); text-shadow: 0 2px 10px rgba(20, 184, 166, 0.2); }
          .util-slider { -webkit-appearance: none; width: 100%; height: 8px; border-radius: 4px; background: var(--input-border); outline: none; transition: 0.2s; }
          .util-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; border-radius: 50%; background: var(--accent-color); cursor: pointer; box-shadow: 0 0 10px rgba(20, 184, 166, 0.5); border: 2px solid #fff; }

          .result-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
          .result-box { display: flex; justify-content: space-between; align-items: center; background: var(--input-bg); padding: 15px 20px; border-radius: 12px; border: 1px solid var(--input-border); transition: 0.3s; }
          .result-box:hover { border-color: var(--accent-color); transform: translateX(5px); }
          .result-label { font-size: 13px; font-weight: 800; color: var(--text-sub); display: flex; align-items: center; gap: 8px; }
          .result-value { font-size: 20px; font-weight: 900; color: var(--text-main); transition: 0.3s; }
          
          /* 💡 追加：ON/OFF トグルボタンのスタイル */
          .toggle-btn { background: var(--card-bg); border: 1px solid var(--card-border); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 900; cursor: pointer; transition: 0.3s; color: var(--text-sub); letter-spacing: 1px;}
          .toggle-btn.on { background: rgba(16, 185, 129, 0.15); border-color: var(--accent-color); color: var(--accent-color); box-shadow: 0 2px 10px rgba(16, 185, 129, 0.2);}
          .toggle-btn.off { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #ef4444; }

          .total-box { background: linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(16, 185, 129, 0.2)); border: 2px solid var(--accent-color); margin-top: 10px;}
          .total-box .result-label { color: var(--accent-color); font-size: 15px; }
          .total-box .result-value { font-size: 28px; color: var(--accent-color); text-shadow: 0 2px 5px rgba(20, 184, 166, 0.3); }

          .script-bubble { background: var(--input-bg); padding: 20px; border-radius: 16px 16px 16px 0; border: 1px solid var(--input-border); font-size: 14px; line-height: 1.8; font-weight: 700; color: var(--text-main); position: relative; margin-bottom: 15px; border-left: 4px solid var(--accent-color); transition: 0.3s; }
          .script-bubble::after { content: ''; position: absolute; bottom: -10px; left: -1px; border-width: 10px 10px 0 0; border-style: solid; border-color: var(--accent-color) transparent transparent transparent; }
          .script-highlight { color: #e11d48; font-weight: 900; background: rgba(225, 29, 72, 0.1); padding: 2px 6px; border-radius: 6px; transition: 0.3s; }
          .theme-dark .script-highlight { color: #fb7185; background: rgba(251, 113, 133, 0.15); }

          .fade-up-element { opacity: 0; transform: translateY(40px); transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
          .fade-up-element.visible { opacity: 1; transform: translateY(0); }
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

        <div className="main-layout">
          
          <section className="glass-panel highlight-panel fade-up-element">
            <h2 className="section-title">🧮 SB光 (StoStoS) 乗換シミュレーター</h2>
            
            <div className="slider-container">
              <div className="slider-label">
                <span>現在の利用月数を入力：</span>
                <span className="slider-value">{usedMonths}<span style={{fontSize: "14px", color:"var(--text-sub)", marginLeft:"5px"}}>ヶ月</span></span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="48" 
                value={usedMonths} 
                onChange={(e) => setUsedMonths(Number(e.target.value))} 
                className="util-slider" 
              />
              <div style={{display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-sub)", fontWeight: 800, marginTop:"5px"}}>
                <span>1ヶ月</span>
                <span>24ヶ月</span>
                <span>48ヶ月</span>
              </div>
            </div>

            <div className="result-grid">
              
              <div className="result-box">
                <div className="result-label"><span>📉</span> 工事費 残債</div>
                <div className="result-value" style={remainingDebt === 0 ? {color: "#10b981"} : {}}>
                  ¥{remainingDebt.toLocaleString()}
                </div>
              </div>

              {/* 💡 新住所工事費 の ON/OFF */}
              <div className="result-box">
                <div className="result-label"><span>🎁</span> 新住所半年分 工事費補填</div>
                <div style={{display: "flex", alignItems: "center", gap: "15px"}}>
                  <div className="result-value" style={{ textDecoration: !useNewInstallment ? "line-through" : "none", opacity: !useNewInstallment ? 0.4 : 1 }}>
                    ¥{FIXED_CB_NEW_INSTALLMENT.toLocaleString()}
                  </div>
                  <button className={`toggle-btn ${useNewInstallment ? "on" : "off"}`} onClick={() => setUseNewInstallment(!useNewInstallment)}>
                    {useNewInstallment ? "🟢 ON" : "🔴 OFF"}
                  </button>
                </div>
              </div>

              {/* 💡 解約金補填 の ON/OFF */}
              <div className="result-box">
                <div className="result-label"><span>✂️</span> 現・新住所 解約金補填</div>
                <div style={{display: "flex", alignItems: "center", gap: "15px"}}>
                  <div className="result-value" style={{ textDecoration: !usePenalty ? "line-through" : "none", opacity: !usePenalty ? 0.4 : 1 }}>
                    ¥{FIXED_CB_PENALTY.toLocaleString()}
                  </div>
                  <button className={`toggle-btn ${usePenalty ? "on" : "off"}`} onClick={() => setUsePenalty(!usePenalty)}>
                    {usePenalty ? "🟢 ON" : "🔴 OFF"}
                  </button>
                </div>
              </div>

              {/* 💡 1G戻し初期費用 の ON/OFF */}
              <div className="result-box">
                <div className="result-label"><span>🔄</span> 1G変更時 初期費用・解約金</div>
                <div style={{display: "flex", alignItems: "center", gap: "15px"}}>
                  <div className="result-value" style={{ textDecoration: !useDowngrade ? "line-through" : "none", opacity: !useDowngrade ? 0.4 : 1 }}>
                    ¥{FIXED_CB_DOWNGRADE.toLocaleString()}
                  </div>
                  <button className={`toggle-btn ${useDowngrade ? "on" : "off"}`} onClick={() => setUseDowngrade(!useDowngrade)}>
                    {useDowngrade ? "🟢 ON" : "🔴 OFF"}
                  </button>
                </div>
              </div>

              <div className="result-box total-box">
                <div className="result-label">💰 お客様へ提示する CB Total</div>
                <div className="result-value">¥{finalCbTotal.toLocaleString()}</div>
              </div>
              
              {remainingDebt === 0 && (
                 <div style={{fontSize: "11px", color: "#f59e0b", fontWeight: 800, textAlign: "right", marginTop: "-5px"}}>
                   ※工事費残債がないため、CBは最低保証の4万円に調整されています。
                 </div>
              )}

            </div>
          </section>

          {/* 💬 右カラム：営業トークスクリプト */}
          <section className="glass-panel fade-up-element" style={{ transitionDelay: "0.1s" }}>
            <h2 className="section-title">💬 乗換提案 トークスクリプト</h2>
            
            <div className="script-bubble">
              まず、ご新居先でも<span className="script-highlight">SB光をご継続いただくことできます</span>のでご安心ください！
            </div>
            
            <div className="script-bubble">
              今回、SB光お使いの方に、<span className="script-highlight">半年間月額料金無料で使える10G（高速回線）</span>のキャンペーンがありまして、今一番好評でおすすめしております。
            </div>

            <div className="script-bubble">
              また、10G開通に伴っての今お使いのSB光の解約金や残債（¥{remainingDebt.toLocaleString()}）にかかる費用は、無料期間が終わるちょうど半年後に<span className="script-highlight" style={{ fontSize: "16px" }}>全額CB（¥{finalCbTotal.toLocaleString()}）で補填</span>させていただきます！
            </div>

            <div className="script-bubble">
              実際のSB光10Gの月額料金は1Gより1000円ほど上がるため、まずはこのキャンペーンで<span className="script-highlight">半年間は実質タダ</span>でネットを使っていただき、CBを受け取ったちょうど半年後に、改めてスマホに合わせたネット回線に切り替えて（SB光1Gに戻すなど）いただくこともできます。
            </div>

            <div className="script-bubble">
              切り替え時の残債なども、乗り換え先のキャンペーンが適応されてしっかり全額補填されますのでご安心ください！
            </div>

            <div className="script-bubble" style={{background: "var(--card-hover-bg)", borderColor: "var(--accent-color)"}}>
              つまり、<span className="script-highlight">『実質半年間はタダで使って、一番いいタイミングで携帯キャリアに合わせて割安料金帯のものに乗り換えることもできる』</span>という、お客様の負担が一番少なく、かつお得になる『今人気のトレンドの使い方』ができます！
            </div>

          </section>

        </div>

      </main>
    </>
  );
}