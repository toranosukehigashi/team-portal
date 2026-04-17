"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// 🌐 案A: ライブ・データメッシュ（HOME画面と完全統一）
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
      ctx.clearRect(0, 0, canvas.width, canvas.height); const colorRGB = isDarkMode ? "56, 189, 248" : "14, 165, 233"; 
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
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -2, pointerEvents: "none" }} />;
};

// 🌊 流体ダッシュボード用 Gooey バックグラウンド（HOME画面と完全統一）
const GooeyBackground = () => (
  <>
    <svg style={{ position: 'fixed', width: 0, height: 0, pointerEvents: 'none' }}>
      <filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -15" result="goo" /><feBlend in="SourceGraphic" in2="goo" /></filter>
    </svg>
    <div className="gooey-container">
      <div className="gooey-blob blob-1"></div><div className="gooey-blob blob-2"></div><div className="gooey-blob blob-3"></div>
    </div>
  </>
);

// 📊 ダミーのKPIデータ（後でスプシのAPIから流し込む想定の構造です！）
const TEAM_KPI = {
  target: 150,
  current: 102,
  projected: 165,
  daysLeft: 12,
};

const LEADERBOARD_DATA = [
  { rank: 1, name: "Toranosuke.H", target: 20, current: 22, trend: "+2" },
  { rank: 2, name: "Motoki.O", target: 15, current: 14, trend: "+1" },
  { rank: 3, name: "Yuki.T", target: 15, current: 12, trend: "0" },
  { rank: 4, name: "Kenji.S", target: 10, current: 8, trend: "-1" },
  { rank: 5, name: "Ayaka.M", target: 10, current: 6, trend: "-2" },
  { rank: 6, name: "Daiki.K", target: 10, current: 5, trend: "0" },
];

export default function KpiDetailDashboard() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const isDarkMode = true; // KPI画面はプロ仕様のダークモード固定（または連携可能）

  useEffect(() => {
    // 画面マウント時にフワッと表示するアニメーション用
    setTimeout(() => setIsReady(true), 100);
    
    // スクロール時のフェードイン監視
    const observer = new IntersectionObserver((entries) => { 
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); }); 
    }, { threshold: 0.05, rootMargin: "0px 0px 50px 0px" });
    document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  const progressPercent = Math.round((TEAM_KPI.current / TEAM_KPI.target) * 100);

  return (
    <div className={`global-theme-wrapper theme-dark`}>
      {/* 🌍 背景要素（HOME画面と完全に同じ・切れ目なし！） */}
      <div className={`entrance-bg`} style={{ background: "radial-gradient(ellipse at bottom, #1e1b4b 0%, #020617 100%)", transition: "background 2s ease" }}>
        <DataMesh isDarkMode={isDarkMode} />
      </div>
      <GooeyBackground />
      <svg className="magic-svg-bg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="magic-path" d="M -10,30 Q 30,80 50,50 T 110,40" />
        <path className="magic-path" d="M -10,70 Q 40,20 70,60 T 110,80" style={{animationDelay: "4s", opacity: 0.5}} />
      </svg>

      <main className={`app-wrapper kpi-page ${isReady ? "ready" : ""}`}>
        
        <style dangerouslySetInnerHTML={{ __html: `
          body { background-color: #020617; overflow-x: hidden; }
          .global-theme-wrapper * { box-sizing: border-box; }
          .global-theme-wrapper { width: 100%; min-height: 100vh; position: relative; overflow-x: clip; color: #f8fafc; font-family: 'Inter', 'Noto Sans JP', sans-serif; }

          .app-wrapper { padding: 20px 40px; position: relative; z-index: 10; opacity: 0; filter: blur(5px); transform: translateY(20px); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); max-width: 1400px; margin: 0 auto; }
          .app-wrapper.ready { opacity: 1; filter: blur(0); transform: translateY(0); }

          /* 背景要素 */
          .entrance-bg { position: fixed; top: -20vh; left: -20vw; width: 140vw; height: 140vh; z-index: -3; }
          .gooey-container { position: fixed; top: -20vh; left: -20vw; width: 140vw; height: 140vh; z-index: -2; pointer-events: none; filter: url(#goo); opacity: 0.15; overflow: hidden; }
          .gooey-blob { position: absolute; border-radius: 50%; background: #38bdf8; filter: blur(20px); }
          .blob-1 { width: 60vw; height: 60vw; top: 20%; left: 20%; animation: floatBlob 15s ease-in-out infinite alternate; }
          .blob-2 { width: 70vw; height: 70vw; top: 50%; right: 10%; animation: floatBlob 20s ease-in-out infinite alternate-reverse; background: #8b5cf6; }
          .blob-3 { width: 50vw; height: 50vw; bottom: 10%; left: 40%; animation: floatBlob 12s ease-in-out infinite alternate; background: #fde047; opacity: 0.5; }
          @keyframes floatBlob { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(100px, 100px) scale(1.2); } }

          .magic-svg-bg { position: fixed; top: -20vh; left: -20vw; width: 140vw; height: 140vh; z-index: -1; pointer-events: none; opacity: 0.7; }
          .magic-path { fill: none; stroke: rgba(255, 255, 255, 0.2); stroke-width: 3; stroke-dasharray: 3000; stroke-dashoffset: 3000; animation: drawMagic 10s ease-in-out infinite alternate; }
          @keyframes drawMagic { 0% { stroke-dashoffset: 3000; } 100% { stroke-dashoffset: 0; } }

          /* ヘッダー＆戻るボタン */
          .kpi-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
          .btn-back { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; padding: 10px 20px; border-radius: 12px; font-weight: 900; font-size: 12px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 8px; letter-spacing: 1px; }
          .btn-back:hover { background: rgba(255,255,255,0.1); color: #fff; transform: translateX(-5px); border-color: #38bdf8; box-shadow: 0 0 15px rgba(56, 189, 248, 0.3); }
          .kpi-title-wrap { display: flex; flex-direction: column; align-items: flex-end; }
          .kpi-main-title { font-size: 28px; font-weight: 900; margin: 0; background: linear-gradient(135deg, #fde047, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 2px; }
          .kpi-sub-title { font-size: 11px; color: #94a3b8; font-weight: 800; letter-spacing: 4px; text-transform: uppercase; margin-top: 5px; }

          .fade-up-element { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: var(--delay); }
          .fade-up-element.visible { opacity: 1; transform: translateY(0); }

          /* 📊 KPI グリッドレイアウト */
          .kpi-grid { display: grid; grid-template-columns: 300px 1fr; gap: 30px; margin-bottom: 30px; }
          @media (max-width: 1024px) { .kpi-grid { grid-template-columns: 1fr; } }

          /* グラスモーフィズム・パネル共通 */
          .glass-panel { background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); position: relative; overflow: hidden; }
          .glass-panel::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at top left, rgba(255,255,255,0.05) 0%, transparent 60%); pointer-events: none; }

          /* ⭕ リング型プログレスバー */
          .ring-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 20px; }
          .circular-chart { display: block; margin: 0 auto; max-width: 80%; max-height: 250px; filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.4)); }
          .circle-bg { fill: none; stroke: rgba(255, 255, 255, 0.05); stroke-width: 2.5; }
          .circle { fill: none; stroke-width: 2.5; stroke-linecap: round; animation: progress 1.5s ease-out forwards; }
          @keyframes progress { 0% { stroke-dasharray: 0 100; } }
          
          .ring-content { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; top: 50%; left: 50%; transform: translate(-50%, -50%); margin-top: -10px; }
          .ring-percent { font-size: 48px; font-weight: 900; color: #fff; line-height: 1; text-shadow: 0 0 20px rgba(56, 189, 248, 0.5); }
          .ring-label { font-size: 12px; color: #94a3b8; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px; }

          .metrics-row { display: flex; width: 100%; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 10px; }
          .metric-box { text-align: center; }
          .metric-val { font-size: 20px; font-weight: 900; color: #fde047; }
          .metric-name { font-size: 10px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

          /* 📉 トレンド＆リーダーボードエリア */
          .main-board-area { display: flex; flex-direction: column; gap: 30px; }

          /* トレンドチャート (SVGダミー) */
          .trend-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
          .panel-title { font-size: 16px; font-weight: 900; color: #fff; letter-spacing: 1px; display: flex; align-items: center; gap: 8px; }
          .panel-title-icon { background: rgba(56, 189, 248, 0.2); color: #38bdf8; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 14px; }
          
          .chart-wrapper { width: 100%; height: 180px; position: relative; border-bottom: 1px solid rgba(255,255,255,0.1); border-left: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; padding-left: 10px; display: flex; align-items: flex-end; }
          .chart-svg { width: 100%; height: 100%; overflow: visible; }
          .chart-area-path { fill: url(#chart-grad); opacity: 0.6; animation: fadeArea 2s ease-out forwards; }
          .chart-line-path { fill: none; stroke: #38bdf8; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; filter: drop-shadow(0 5px 5px rgba(56,189,248,0.5)); stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: drawLine 2s ease-out forwards; }
          @keyframes drawLine { to { stroke-dashoffset: 0; } }
          @keyframes fadeArea { 0% { opacity: 0; } 100% { opacity: 0.6; } }
          
          .chart-points circle { fill: #0f172a; stroke: #fde047; stroke-width: 2; transition: 0.3s; cursor: pointer; }
          .chart-points circle:hover { transform: scale(1.5); fill: #fde047; filter: drop-shadow(0 0 10px #fde047); }

          /* 🏆 リーダーボード */
          .leaderboard-list { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
          .lb-row { display: grid; grid-template-columns: 40px 1fr 150px 80px; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 12px 20px; border-radius: 16px; transition: 0.3s; cursor: default; }
          .lb-row:hover { background: rgba(255,255,255,0.08); border-color: rgba(56, 189, 248, 0.4); transform: translateX(5px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
          
          .lb-rank { font-size: 16px; font-weight: 900; color: #64748b; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background: rgba(0,0,0,0.3); }
          .lb-row.rank-1 .lb-rank { background: linear-gradient(135deg, #fbbf24, #d97706); color: #fff; box-shadow: 0 0 15px rgba(251, 191, 36, 0.5); }
          .lb-row.rank-2 .lb-rank { background: linear-gradient(135deg, #94a3b8, #475569); color: #fff; }
          .lb-row.rank-3 .lb-rank { background: linear-gradient(135deg, #b45309, #78350f); color: #fff; }
          
          .lb-user { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 14px; letter-spacing: 1px; }
          .lb-avatar { width: 32px; height: 32px; border-radius: 50%; background: rgba(56, 189, 248, 0.2); border: 1px solid #38bdf8; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #38bdf8; font-weight: 900; }
          .lb-row.rank-1 .lb-avatar { border-color: #fde047; color: #fde047; background: rgba(253, 224, 71, 0.2); }
          
          .lb-progress-wrap { display: flex; flex-direction: column; gap: 6px; padding-right: 20px; }
          .lb-numbers { display: flex; justify-content: space-between; font-size: 11px; font-weight: 900; color: #94a3b8; }
          .lb-numbers span.val { color: #fff; font-size: 13px; }
          .lb-bar-bg { width: 100%; height: 6px; background: rgba(0,0,0,0.5); border-radius: 3px; overflow: hidden; }
          .lb-bar-fill { height: 100%; background: linear-gradient(90deg, #38bdf8, #818cf8); border-radius: 3px; box-shadow: 0 0 10px rgba(56,189,248,0.5); }
          .lb-row.rank-1 .lb-bar-fill { background: linear-gradient(90deg, #fde047, #f59e0b); box-shadow: 0 0 10px rgba(253,224,71,0.5); }
          .lb-row.target-cleared .lb-bar-fill { background: linear-gradient(90deg, #34d399, #10b981); box-shadow: 0 0 10px rgba(16,185,129,0.5); }

          .lb-status { font-size: 11px; font-weight: 900; padding: 4px 8px; border-radius: 8px; text-align: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
          .lb-status.cleared { background: rgba(16, 185, 129, 0.15); color: #34d399; border-color: rgba(16, 185, 129, 0.3); }

          @media (max-width: 768px) {
            .lb-row { grid-template-columns: 30px 1fr; gap: 15px; }
            .lb-progress-wrap { grid-column: span 2; padding-right: 0; }
            .lb-status { display: none; }
          }
        `}} />

        <header className="kpi-header fade-up-element" style={{ "--delay": "0.1s" } as any}>
          <button className="btn-back" onClick={() => router.push("/")}>
            <span>◀</span> HOME WORKSPACE
          </button>
          <div className="kpi-title-wrap">
            <h1 className="kpi-main-title">TEAM KPI DASHBOARD</h1>
            <div className="kpi-sub-title">Live Performance Tracking</div>
          </div>
        </header>

        <div className="kpi-grid">
          
          {/* 左側：チーム全体の月間目標（リングメーター） */}
          <div className="glass-panel fade-up-element" style={{ "--delay": "0.2s" } as any}>
            <div className="ring-container">
              <div style={{ position: "relative", width: "100%" }}>
                <svg viewBox="0 0 36 36" className="circular-chart">
                  {/* グラデーション定義 */}
                  <defs>
                    <linearGradient id="ring-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#fde047" />
                    </linearGradient>
                  </defs>
                  {/* 背景の円 */}
                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  {/* プログレスの円 */}
                  <path 
                    className="circle" 
                    stroke="url(#ring-grad)"
                    strokeDasharray={`${progressPercent}, 100`} 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  />
                </svg>
                <div className="ring-content">
                  <div className="ring-percent">{progressPercent}%</div>
                  <div className="ring-label">Target Achieved</div>
                </div>
              </div>

              <div className="metrics-row">
                <div className="metric-box">
                  <div className="metric-val" style={{color: "#fff"}}>{TEAM_KPI.current} <span style={{fontSize:"12px", color:"#64748b"}}>/ {TEAM_KPI.target}</span></div>
                  <div className="metric-name">Total Activations</div>
                </div>
                <div className="metric-box">
                  <div className="metric-val" style={{color: "#34d399"}}>{TEAM_KPI.projected}</div>
                  <div className="metric-name">Projected EOM</div>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：メインボード（チャート ＆ リーダーボード） */}
          <div className="main-board-area">
            
            {/* 📈 トレンドチャート */}
            <div className="glass-panel fade-up-element" style={{ "--delay": "0.3s", paddingBottom: "20px" } as any}>
              <div className="trend-header">
                <div className="panel-title"><div className="panel-title-icon">📈</div> Acquisition Trend (Last 7 Days)</div>
                <div style={{fontSize:"11px", fontWeight:800, color:"#10b981", background:"rgba(16,185,129,0.1)", padding:"4px 10px", borderRadius:"10px", border:"1px solid rgba(16,185,129,0.3)"}}>+15% vs Last Week</div>
              </div>
              
              <div className="chart-wrapper">
                <svg className="chart-svg" viewBox="0 0 500 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5"/>
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {/* ダミーの波形データ */}
                  <path className="chart-area-path" d="M0,150 L0,120 C50,100 100,130 150,90 C200,50 250,80 300,40 C350,0 400,60 450,20 L500,30 L500,150 Z" />
                  <path className="chart-line-path" d="M0,120 C50,100 100,130 150,90 C200,50 250,80 300,40 C350,0 400,60 450,20 L500,30" />
                  
                  <g className="chart-points">
                    <circle cx="0" cy="120" r="4" />
                    <circle cx="150" cy="90" r="4" />
                    <circle cx="300" cy="40" r="4" />
                    <circle cx="450" cy="20" r="4" />
                    <circle cx="500" cy="30" r="4" />
                  </g>
                </svg>
              </div>
              <div style={{display:"flex", justifyContent:"space-between", color:"#64748b", fontSize:"10px", fontWeight:800, marginTop:"10px", padding:"0 10px"}}>
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>

            {/* 🏆 リーダーボード（スプシ連動想定） */}
            <div className="glass-panel fade-up-element" style={{ "--delay": "0.4s" } as any}>
              <div className="trend-header">
                <div className="panel-title"><div className="panel-title-icon" style={{background:"rgba(253,224,71,0.2)", color:"#fde047"}}>🏆</div> Team Leaderboard</div>
                <div style={{fontSize:"11px", fontWeight:800, color:"#94a3b8"}}>Updated: Just now</div>
              </div>

              <div className="leaderboard-list">
                {LEADERBOARD_DATA.map((user) => {
                  const percent = Math.min(100, Math.round((user.current / user.target) * 100));
                  const isCleared = user.current >= user.target;
                  return (
                    <div key={user.name} className={`lb-row rank-${user.rank} ${isCleared ? 'target-cleared' : ''}`}>
                      <div className="lb-rank">{user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : user.rank === 3 ? "🥉" : user.rank}</div>
                      
                      <div className="lb-user">
                        <div className="lb-avatar">{user.name.charAt(0)}</div>
                        <span>{user.name}</span>
                      </div>
                      
                      <div className="lb-progress-wrap">
                        <div className="lb-numbers">
                          <span><span className="val">{user.current}</span> / {user.target}</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="lb-bar-bg">
                          <div className="lb-bar-fill" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                      
                      <div className={`lb-status ${isCleared ? 'cleared' : ''}`}>
                        {isCleared ? "CLEARED" : "ON TRACK"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}