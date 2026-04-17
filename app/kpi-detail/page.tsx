"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// --- 背景・アニメーション用コンポーネント ---
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

export default function KpiDetailDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");
  const [timeTheme, setTimeTheme] = useState("morning");
  
  const [data, setData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 🛠️ 新しくデプロイして発行された最新のURLをここに貼り付けてください！
  const GAS_API_URL = "https://script.google.com/a/macros/octopusenergy.co.jp/s/AKfycbwZVKEPoal1XzHD-zunYWxD8gd4nJjeOXaok0u62kVzKbNsARViK_z_F1eOwUWtVAGcig/exec";

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 17 && hour < 20) setTimeTheme("evening");
    setTimeout(() => setIsReady(true), 100);

    // ✨ 【最終奥義】JSONP通信（スクリプト注入）でセキュリティを完全突破！
    const fetchWithJSONP = () => {
      setLoading(true);
      const callbackName = 'jsonpCallback_' + Date.now();
      
      // データの受け取り口をグローバルに用意
      (window as any)[callbackName] = (jsonData: any) => {
        if(jsonData.success) {
          setData(jsonData);
        } else {
          setErrorMsg("スプレッドシート処理エラー: " + jsonData.error);
        }
        setLoading(false);
        delete (window as any)[callbackName]; // お掃除
        const scriptElem = document.getElementById(callbackName);
        if (scriptElem) scriptElem.remove();
      };

      // プログラムのフリをしてGASを呼び出す（これなら絶対弾かれない！）
      const script = document.createElement('script');
      script.id = callbackName;
      script.src = `${GAS_API_URL}?callback=${callbackName}`;
      script.onerror = () => {
        setErrorMsg("⚠️ セキュリティブロック：通信が弾かれました。お使いのブラウザで「Octopusenergy」のGoogleアカウントにログインしているか確認してください！");
        setLoading(false);
        delete (window as any)[callbackName];
      };
      document.body.appendChild(script);
    };

    fetchWithJSONP();

  }, []);

  if (errorMsg) {
    return (
      <div style={{ background: "#020617", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "25px", padding: "40px", textAlign: "center" }}>
        <div style={{fontSize: "60px"}}>🚨</div>
        <h2 style={{color: "#ef4444", fontWeight: 900, letterSpacing: "2px", margin: 0}}>接続エラーが発生しました</h2>
        <div style={{background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.4)", padding: "20px", borderRadius: "16px", color: "#f8fafc", fontWeight: 800, maxWidth: "600px", lineHeight: "1.6"}}>
          {errorMsg}
        </div>
        <button onClick={() => router.push("/")} style={{padding: "12px 30px", background: "#f8fafc", color: "#0f172a", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: 900, marginTop: "20px"}}>◀ HOMEへ戻る</button>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div style={{ background: "#020617", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8", flexDirection: "column", gap: "20px" }}>
        <div className="spinner"></div>
        <p style={{ fontWeight: 900, letterSpacing: "3px" }}>SYNCING SECURELY WITH GOOGLE SHEETS...</p>
        <style>{`.spinner { width: 50px; height: 50px; border: 4px solid rgba(56,189,248,0.1); border-top-color: #38bdf8; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const currentStats = viewMode === "daily" ? data.daily : data.monthly;
  const safeTarget = currentStats.target > 0 ? currentStats.target : 1;
  const progressPercent = Math.min(100, Math.round((currentStats.total / safeTarget) * 100)) || 0;

  return (
    <div className={`global-theme-wrapper theme-dark`}>
      <DataMesh isDarkMode={true} />
      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: #020617; overflow-x: hidden; }
        .app-wrapper { padding: 40px; position: relative; z-index: 10; opacity: 0; filter: blur(10px); transition: 0.8s ease; max-width: 1400px; margin: 0 auto; }
        .app-wrapper.ready { opacity: 1; filter: blur(0); }
        
        .kpi-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
        .btn-back { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 10px 20px; border-radius: 12px; font-weight: 900; cursor: pointer; transition: 0.3s; }
        .btn-back:hover { background: #38bdf8; color: #fff; transform: translateX(-5px); }
        
        .mode-switcher { display: flex; background: rgba(0,0,0,0.4); padding: 5px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 30px; width: fit-content; }
        .mode-btn { padding: 10px 30px; border-radius: 12px; border: none; background: transparent; color: #64748b; font-weight: 900; cursor: pointer; transition: 0.3s; }
        .mode-btn.active { background: #38bdf8; color: #fff; box-shadow: 0 4px 15px rgba(56,189,248,0.4); }

        .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
        .glass-panel { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(30px); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        
        .stat-card { text-align: center; }
        .ring-svg { width: 180px; height: 180px; transform: rotate(-90deg); margin-bottom: 15px; }
        .ring-bg { fill: none; stroke: rgba(255,255,255,0.05); stroke-width: 3; }
        .ring-fill { fill: none; stroke: #38bdf8; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 100; stroke-dashoffset: ${100 - progressPercent}; transition: 2s ease-out; }
        
        .list-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 12px 20px; background: rgba(255,255,255,0.03); border-radius: 12px; }
        .list-label { font-weight: 800; font-size: 14px; color: #38bdf8; }
        .list-val { font-weight: 900; font-size: 18px; }

        .cross-tab-wrap { overflow-x: auto; margin-top: 20px; }
        .cross-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .cross-table th { text-align: left; padding: 12px; color: #38bdf8; border-bottom: 2px solid rgba(255,255,255,0.1); white-space: nowrap; }
        .cross-table td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 700; white-space: nowrap; }
        .cross-table tr:hover { background: rgba(255,255,255,0.02); }
        .cell-highlight { color: #fde047; font-weight: 900; }

        .time-evening .mode-btn.active { background: #ea580c; box-shadow: 0 4px 15px rgba(234,88,12,0.4); }
        .time-evening .ring-fill { stroke: #ea580c; }
        .time-evening .list-label, .time-evening .cross-table th { color: #fb923c; }
      `}} />

      <main className={`app-wrapper ${isReady ? "ready" : ""} time-${timeTheme}`}>
        <header className="kpi-header">
          <button className="btn-back" onClick={() => router.push("/")}>◀ BACK TO HUB</button>
          <div style={{textAlign: "right"}}>
            <h1 style={{fontSize:"24px", fontWeight:900, margin:0, letterSpacing:"2px"}}>KPI COMMAND CENTER</h1>
            <p style={{fontSize:"11px", color:"#94a3b8", fontWeight:800, margin:0}}>SECURE SPREADSHEET SYNC</p>
          </div>
        </header>

        <div className="mode-switcher">
          <button className={`mode-btn ${viewMode === "daily" ? "active" : ""}`} onClick={() => setViewMode("daily")}>TODAY (DAILY)</button>
          <button className={`mode-btn ${viewMode === "monthly" ? "active" : ""}`} onClick={() => setViewMode("monthly")}>THIS MONTH (MONTHLY)</button>
        </div>

        <div className="dashboard-grid">
          {/* 左：達成率リング & リスト別 */}
          <div style={{display:"flex", flexDirection:"column", gap:"30px"}}>
            <div className="glass-panel stat-card">
              <h3 style={{fontSize:"12px", fontWeight:900, color:"#94a3b8", letterSpacing:"3px", marginBottom:"20px"}}>TOTAL PERFORMANCE</h3>
              <div style={{position:"relative", display:"inline-block"}}>
                <svg className="ring-svg" viewBox="0 0 36 36">
                  <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="ring-fill" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div style={{position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center"}}>
                  <div style={{fontSize:"32px", fontWeight:900}}>{progressPercent}%</div>
                  <div style={{fontSize:"10px", fontWeight:800, color:"#64748b"}}>ACHIEVED</div>
                </div>
              </div>
              <div style={{fontSize:"20px", fontWeight:900, marginTop:"10px"}}>{currentStats.total} <span style={{fontSize:"14px", color:"#64748b"}}>/ {currentStats.target}</span></div>
              <div style={{fontSize:"11px", color:"#64748b", fontWeight:800}}>TOTAL ACQUISITION</div>
            </div>

            <div className="glass-panel">
              <h3 style={{fontSize:"12px", fontWeight:900, color:"#94a3b8", letterSpacing:"3px", marginBottom:"20px"}}>LIST BREAKDOWN</h3>
              {currentStats.lists.map((l:any, i:number) => (
                <div key={i} className="list-row">
                  <span className="list-label">{l.name}</span>
                  <span className="list-val">{l.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 右：OPランキング */}
          <div className="glass-panel">
            <h3 style={{fontSize:"12px", fontWeight:900, color:"#94a3b8", letterSpacing:"3px", marginBottom:"20px"}}>OP RANKING</h3>
            {currentStats.ops.sort((a:any, b:any) => b.value - a.value).map((op:any, i:number) => {
              const maxVal = currentStats.ops[0]?.value || 1;
              const p = Math.min(100, Math.round((op.value / maxVal) * 100));
              return (
                <div key={i} style={{marginBottom:"20px"}}>
                  <div style={{display:"flex", justifySelf:"space-between", fontWeight:900, fontSize:"14px", marginBottom:"8px"}}>
                    <span>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "👤"} {op.name}</span>
                    <span style={{marginLeft:"auto"}}>{op.value} <span style={{fontSize:"10px", color:"#64748b"}}>件</span></span>
                  </div>
                  <div style={{height:"6px", background:"rgba(0,0,0,0.3)", borderRadius:"3px", overflow:"hidden"}}>
                    <div style={{height:"100%", width:`${p}%`, background: i === 0 ? "linear-gradient(90deg, #fde047, #f59e0b)" : "linear-gradient(90deg, #38bdf8, #818cf8)", borderRadius:"3px", transition:"1s ease-out"}}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 下：クロス集計マトリクス */}
        <div className="glass-panel">
          <h3 style={{fontSize:"12px", fontWeight:900, color:"#94a3b8", letterSpacing:"3px", marginBottom:"10px"}}>CROSS-TABULATION MATRIX (OP × LIST)</h3>
          <div className="cross-tab-wrap">
            <table className="cross-table">
              <thead>
                <tr>
                  <th>OPERATOR</th>
                  {currentStats.cross.headers.map((h:string, i:number) => <th key={i}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {currentStats.cross.rows.map((row:any, i:number) => (
                  <tr key={i}>
                    <td>{row.opName}</td>
                    {currentStats.cross.headers.map((h:string, j:number) => (
                      <td key={j} className={row.counts[h] > 0 ? "cell-highlight" : ""}>{row.counts[h]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 過去実績（ヒストリー） */}
        <div className="glass-panel" style={{marginTop:"30px"}}>
          <h3 style={{fontSize:"12px", fontWeight:900, color:"#94a3b8", letterSpacing:"3px", marginBottom:"20px"}}>PERFORMANCE HISTORY ({data.history.month})</h3>
          <div style={{display:"flex", gap:"10px", overflowX:"auto", paddingBottom:"10px"}}>
            {data.history.stats.map((s:any, i:number) => (
              <div key={i} style={{minWidth:"80px", textAlign:"center", background:"rgba(255,255,255,0.03)", padding:"15px", borderRadius:"12px"}}>
                <div style={{fontSize:"10px", color:"#94a3b8", fontWeight:800}}>{s.name}</div>
                <div style={{fontSize:"20px", fontWeight:900, color:"#38bdf8"}}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}