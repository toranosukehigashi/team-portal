"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// --- 背景コンポーネント (200%拡張・絶対固定版) ---
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

export default function KpiDetailDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");
  
  const [data, setData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 🛠️ ここに新しく発行した最新のデプロイURLを貼り付けてください！
  const GAS_API_URL = "https://script.google.com/a/macros/octopusenergy.co.jp/s/AKfycbxT82SG21OPZUdP2Ix7RG4PYi9qv3KCJNJ81hF3DgFRZATdkp7EpcxpkRBajGJ7RrJBsw/exec";

  useEffect(() => {
    setTimeout(() => setIsReady(true), 100);

    const fetchWithJSONP = () => {
      setLoading(true);
      const callbackName = 'jsonpCallback_' + Date.now();
      (window as any)[callbackName] = (jsonData: any) => {
        if(jsonData.success) { setData(jsonData); } 
        else { setErrorMsg("スプシ処理エラー: " + jsonData.error); }
        setLoading(false);
        delete (window as any)[callbackName];
      };

      const script = document.createElement('script');
      script.src = `${GAS_API_URL}?callback=${callbackName}`;
      script.onerror = () => { setErrorMsg("通信エラーが発生しました。"); setLoading(false); };
      document.body.appendChild(script);
    };

    fetchWithJSONP();
  }, []);

  if (errorMsg) {
    return (
      <div style={{ background: "#020617", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "40px", textAlign: "center", color: "#fff" }}>
        <h2>🚨 接続エラー</h2>
        <p>{errorMsg}</p>
        <button onClick={() => router.push("/")} style={{padding: "12px 30px", marginTop: "20px"}}>◀ HOMEへ戻る</button>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div style={{ background: "#020617", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8", flexDirection: "column", gap: "20px" }}>
        <p style={{ fontWeight: 900, letterSpacing: "3px" }}>SYNCING WITH SPREADSHEET...</p>
      </div>
    );
  }

  const currentStats = viewMode === "daily" ? data.daily : data.monthly;
  const progressPercent = Math.min(100, Math.round((currentStats.total / (currentStats.target || 1)) * 100)) || 0;

  return (
    <div className="global-theme-wrapper theme-dark">
      <DataMesh isDarkMode={true} />
      <style dangerouslySetInnerHTML={{ __html: `
        /* 🎨 背景切れを根本から殺すCSS */
        html, body { background-color: #020617 !important; margin: 0; padding: 0; min-height: 100vh; }
        .global-theme-wrapper { min-height: 100vh; width: 100%; position: relative; color: #f8fafc; font-family: 'Inter', 'Noto Sans JP', sans-serif; overflow-x: hidden; }
        .app-wrapper { padding: 40px; position: relative; z-index: 10; opacity: 0; transition: 0.8s ease; max-width: 1400px; margin: 0 auto; }
        .app-wrapper.ready { opacity: 1; }

        .kpi-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
        .btn-back { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 10px 20px; border-radius: 12px; cursor: pointer; transition: 0.3s; font-weight: 900; }
        .btn-back:hover { background: #38bdf8; color: #fff; }

        .mode-switcher { display: flex; background: rgba(0,0,0,0.4); padding: 5px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 30px; width: fit-content; }
        .mode-btn { padding: 10px 30px; border-radius: 12px; border: none; background: transparent; color: #64748b; font-weight: 900; cursor: pointer; transition: 0.3s; }
        .mode-btn.active { background: #38bdf8; color: #fff; }

        .glass-panel { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(30px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); margin-bottom: 30px; }
        .dashboard-grid { display: grid; grid-template-columns: 320px 1fr; gap: 30px; }

        .ring-svg { width: 180px; height: 180px; transform: rotate(-90deg); margin-bottom: 15px; }
        .ring-bg { fill: none; stroke: rgba(255,255,255,0.05); stroke-width: 3; }
        .ring-fill { fill: none; stroke: #38bdf8; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 100; stroke-dashoffset: ${100 - progressPercent}; transition: 2s ease-out; }

        .list-row { display: flex; justify-content: space-between; padding: 12px 20px; background: rgba(255,255,255,0.03); border-radius: 12px; margin-bottom: 10px; }
        .lb-row { display: flex; align-items: center; gap: 20px; background: rgba(255,255,255,0.03); padding: 15px 25px; border-radius: 16px; margin-bottom: 12px; }
        .rank-badge { width: 32px; height: 32px; border-radius: 50%; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-weight: 900; }
        .prog-bg { width: 100%; height: 8px; background: rgba(0,0,0,0.4); border-radius: 4px; overflow: hidden; margin-top: 8px; }
        .prog-fill { height: 100%; background: linear-gradient(90deg, #38bdf8, #818cf8); transition: 1.5s ease-out; }

        .cross-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
        .cross-table th { padding: 12px; color: #38bdf8; border-bottom: 2px solid rgba(255,255,255,0.1); }
        .cross-table td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 700; }
        .cell-highlight { color: #fde047; font-weight: 900; }
      `}} />

      <main className={`app-wrapper ${isReady ? "ready" : ""}`}>
        <header className="kpi-header">
          <button className="btn-back" onClick={() => router.push("/")}>◀ BACK TO WORKSPACE</button>
          <div style={{textAlign: "right"}}>
            <h1 style={{fontSize:"24px", fontWeight:900, margin:0}}>KPI COMMAND CENTER</h1>
            <p style={{fontSize:"11px", color:"#94a3b8", fontWeight:800}}>SYNCHRONIZED BY GID</p>
          </div>
        </header>

        <div className="mode-switcher">
          <button className={`mode-btn ${viewMode === "daily" ? "active" : ""}`} onClick={() => setViewMode("daily")}>TODAY</button>
          <button className={`mode-btn ${viewMode === "monthly" ? "active" : ""}`} onClick={() => setViewMode("monthly")}>MONTHLY</button>
        </div>

        <div className="dashboard-grid">
          <div>
            <div className="glass-panel" style={{textAlign:"center"}}>
              <h3 style={{fontSize:"10px", color:"#94a3b8", letterSpacing:"2px"}}>PROGRESS</h3>
              <div style={{position:"relative", display:"inline-block"}}>
                <svg className="ring-svg" viewBox="0 0 36 36">
                  <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="ring-fill" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div style={{position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)"}}>
                  <div style={{fontSize:"32px", fontWeight:900}}>{progressPercent}%</div>
                </div>
              </div>
              <div style={{fontSize:"20px", fontWeight:900}}>{currentStats.total} / {currentStats.target}</div>
            </div>

            <div className="glass-panel">
              <h3 style={{fontSize:"10px", color:"#94a3b8", marginBottom:"15px"}}>LIST BREAKDOWN</h3>
              {currentStats.lists.map((l:any, i:number) => (
                <div key={i} className="list-row"><span>{l.name}</span><span style={{fontWeight:900}}>{l.value}</span></div>
              ))}
            </div>
          </div>

          <div className="glass-panel">
            <h3 style={{fontSize:"10px", color:"#94a3b8", marginBottom:"20px"}}>OP RANKING</h3>
            {currentStats.ops.sort((a:any, b:any) => b.value - a.value).map((op:any, i:number) => {
              const maxVal = currentStats.ops[0]?.value || 1;
              const p = Math.round((op.value / maxVal) * 100);
              return (
                <div key={i} style={{marginBottom:"20px"}}>
                  <div style={{display:"flex", justifyContent:"space-between", fontWeight:900, fontSize:"14px"}}>
                    <span>{i === 0 ? "🥇" : "👤"} {op.name}</span>
                    <span>{op.value} 件</span>
                  </div>
                  <div className="prog-bg"><div className="prog-fill" style={{width: `${p}%`}}></div></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel">
          <h3 style={{fontSize:"10px", color:"#94a3b8", marginBottom:"15px"}}>CROSS-TABULATION MATRIX</h3>
          <div style={{overflowX:"auto"}}>
            <table className="cross-table">
              <thead>
                <tr><th>OPERATOR</th>{currentStats.cross.headers.map((h:string, i:number) => <th key={i}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {currentStats.cross.rows.map((row:any, i:number) => (
                  <tr key={i}>
                    <td style={{fontWeight:900, color:"#38bdf8"}}>{row.opName}</td>
                    {currentStats.cross.headers.map((h:string, j:number) => (
                      <td key={j} className={row.counts[h] > 0 ? "cell-highlight" : ""}>{row.counts[h]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel">
          <h3 style={{fontSize:"10px", color:"#94a3b8", marginBottom:"15px"}}>PERFORMANCE HISTORY ({data.history.month})</h3>
          <div style={{display:"flex", gap:"10px", overflowX:"auto"}}>
            {data.history.stats.map((s:any, i:number) => (
              <div key={i} style={{minWidth:"100px", background:"rgba(255,255,255,0.03)", padding:"15px", borderRadius:"12px", textAlign:"center"}}>
                <div style={{fontSize:"10px", color:"#94a3b8"}}>{s.name}</div>
                <div style={{fontSize:"20px", fontWeight:900, color:"#38bdf8"}}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}