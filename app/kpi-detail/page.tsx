"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// ✨ 背景の光の粒
const PixieDust = () => {
  const [stars, setStars] = useState<{ id: number; left: string; top: string; delay: string; size: string }[]>([]);
  useEffect(() => {
    const generatedStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i, left: `${Math.random() * 100}vw`, top: `${Math.random() * 100}vh`, delay: `${Math.random() * 5}s`, size: `${Math.random() * 3 + 1}px`
    }));
    setStars(generatedStars);
  }, []);
  return (
    <div className="particles-container">
      {stars.map(star => (
        <div key={star.id} className="star" style={{ left: star.left, top: star.top, width: star.size, height: star.size, animationDelay: star.delay }} />
      ))}
    </div>
  );
};

// 🌐 ライブ・データメッシュ（昼夜対応版）
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
      ctx.clearRect(0, 0, canvas.width, canvas.height); 
      // 💡 ライトモード（DAY）の時は温かみのあるオレンジ色、ダークは水色に！
      const colorRGB = isDarkMode ? "56, 189, 248" : "245, 158, 11"; 
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
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -2, pointerEvents: "none", opacity: 0.6 }} />;
};

export default function KpiDetailDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");
  
  const [data, setData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [toast, setToast] = useState({ show: false, msg: "" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const GAS_API_URL = "https://script.google.com/a/macros/octopusenergy.co.jp/s/AKfycbxT82SG21OPZUdP2Ix7RG4PYi9qv3KCJNJ81hF3DgFRZATdkp7EpcxpkRBajGJ7RrJBsw/exec";

  useEffect(() => {
    setTimeout(() => setIsReady(true), 100);

    const fetchWithJSONP = () => {
      setLoading(true);
      const callbackName = 'jsonpCallback_' + Date.now();
      (window as any)[callbackName] = (jsonData: any) => {
        if(jsonData.success) { 
          setData(jsonData); 
          const daily = jsonData.daily || { total: 0, target: 20 };
          localStorage.setItem("team_portal_kpi", JSON.stringify({
            current: daily.total,
            target: daily.target
          }));
        } else { 
          setErrorMsg("スプシ処理エラー: " + jsonData.error); 
        }
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

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, viewMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    showToast(!isDarkMode ? "🌙 ダークモードに切り替えました" : "☀️ ライトモードに切り替えました");
  };

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  if (errorMsg) {
    return (
      <div style={{ background: "var(--bg-gradient)", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "40px", textAlign: "center", color: "var(--text-main)", fontFamily: "'Inter', sans-serif" }}>
        <h2 style={{fontSize: "24px", fontWeight: 900, color: "#ef4444", marginBottom: "15px"}}>🚨 接続エラー</h2>
        <p style={{fontWeight: 800}}>{errorMsg}</p>
        <button onClick={() => router.push("/")} style={{padding: "12px 30px", marginTop: "20px", background: "linear-gradient(135deg, var(--accent-color), #000)", color: "#fff", border: "none", borderRadius: "12px", fontWeight: 900, cursor: "pointer"}}>◀ HOMEへ戻る</button>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className={`global-theme-wrapper ${isDarkMode ? "theme-dark" : "theme-light"}`} style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px", background: "var(--bg-gradient)" }}>
        <DataMesh isDarkMode={isDarkMode} />
        <div style={{ width: "50px", height: "50px", border: "4px solid var(--card-border)", borderTopColor: "var(--accent-color)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ fontWeight: 900, letterSpacing: "3px", color: "var(--accent-color)" }}>SYNCING DATA...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const currentStats = viewMode === "daily" ? data.daily : data.monthly;
  const progressPercent = Math.min(100, Math.round((currentStats.total / (currentStats.target || 1)) * 100)) || 0;

  return (
    <>
      <div className={`entrance-bg ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <PixieDust />
        <DataMesh isDarkMode={isDarkMode} />
      </div>

      <main className={`app-wrapper ${isDarkMode ? "theme-dark" : "theme-light"} ${isReady ? "ready" : ""}`}>
        <style dangerouslySetInnerHTML={{ __html: `
          .app-wrapper * { box-sizing: border-box; }
          
          /* 💡 ライトモードのカラーを活気ある【サンセット・オレンジ】へ大刷新！！ */
          .theme-light { 
            --bg-gradient: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%); 
            --text-main: #1e293b; --text-sub: #475569; 
            --card-bg: rgba(255, 255, 255, 0.75); --card-border: rgba(255, 255, 255, 1); 
            --card-hover-border: #f59e0b; /* アンバー */
            --card-hover-bg: rgba(255, 255, 255, 0.95); 
            --card-shadow: 0 10px 30px rgba(0,0,0,0.05); 
            --title-color: #b45309; /* 濃いオレンジ */
            --accent-color: #f97316; /* オレンジ */
            --input-bg: rgba(255, 255, 255, 0.9); --input-border: rgba(203, 213, 225, 0.8); 
            --star-color: #f59e0b; 
            --nav-accent: #f97316;
            --nav-bg-hover: rgba(249, 115, 22, 0.1);
            --table-header: rgba(249, 115, 22, 0.1);
            --table-border: rgba(203, 213, 225, 0.5);
            /* グラフ等のグラデーションカラー */
            --prog-grad: linear-gradient(90deg, #f97316, #fbbf24);
          }
          
          .theme-dark { 
            --bg-gradient: radial-gradient(ellipse at bottom, #0f172a 0%, #020617 100%); 
            --text-main: #f8fafc; --text-sub: #cbd5e1; 
            --card-bg: rgba(15, 23, 42, 0.7); --card-border: rgba(255, 255, 255, 0.15); 
            --card-hover-border: #38bdf8; --card-hover-bg: rgba(30, 41, 59, 0.9); 
            --card-shadow: 0 20px 50px rgba(0,0,0,0.8); 
            --title-color: #38bdf8; --accent-color: #0ea5e9; 
            --input-bg: rgba(0, 0, 0, 0.4); --input-border: rgba(255, 255, 255, 0.2); 
            --star-color: #fef08a; 
            --nav-accent: #38bdf8;
            --nav-bg-hover: rgba(56, 189, 248, 0.2);
            --table-header: rgba(56, 189, 248, 0.1);
            --table-border: rgba(255, 255, 255, 0.1);
            /* グラフ等のグラデーションカラー */
            --prog-grad: linear-gradient(90deg, #0ea5e9, #8b5cf6);
          }

          .app-wrapper { min-height: 100vh; padding: 70px 20px 80px 20px; font-family: 'Inter', sans-serif; color: var(--text-main); font-size: 13px; position: relative; transition: opacity 0.8s; opacity: 0; }
          .app-wrapper.ready { opacity: 1; }
          .entrance-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -2; background: var(--bg-gradient); transition: 0.5s; }
          .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; }
          .star { position: absolute; border-radius: 50%; background: var(--star-color); box-shadow: 0 0 10px var(--star-color); animation: twinkle 4s infinite ease-in-out; }
          @keyframes twinkle { 0% { opacity: 0.1; transform: scale(0.5) translateY(0); } 50% { opacity: 1; transform: scale(1.2) translateY(-20px); } 100% { opacity: 0.1; transform: scale(0.5) translateY(0); } }

          /* ナビ＆メニュー */
          .hamburger-btn { position: fixed; top: 15px; left: 15px; z-index: 1001; background: var(--card-bg); backdrop-filter: blur(15px); border: 1px solid var(--card-border); border-radius: 8px; padding: 8px; cursor: pointer; display: flex; flex-direction: column; gap: 4px; box-shadow: var(--card-shadow); transition: 0.3s; }
          .hamburger-btn:hover { background: var(--card-hover-bg); transform: scale(1.05); }
          .hamburger-line { width: 18px; height: 2px; background: var(--text-sub); border-radius: 2px; transition: 0.4s; }
          .hamburger-btn.open .line1 { transform: translateY(6px) rotate(45deg); background: var(--nav-accent); }
          .hamburger-btn.open .line2 { opacity: 0; }
          .hamburger-btn.open .line3 { transform: translateY(-6px) rotate(-45deg); background: var(--nav-accent); }
          
          .menu-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(5px); z-index: 999; opacity: 0; pointer-events: none; transition: 0.4s ease; }
          .menu-overlay.open { opacity: 1; pointer-events: auto; }
          
          .side-menu { position: fixed; top: 0; left: -280px; width: 260px; height: 100vh; background: var(--card-bg); backdrop-filter: blur(30px); border-right: 1px solid var(--card-border); z-index: 1000; box-shadow: var(--card-shadow); transition: 0.5s; padding: 70px 16px 20px; display: flex; flex-direction: column; gap: 6px; overflow-y: auto; }
          .side-menu.open { left: 0; }
          .menu-title { font-size: 11px; font-weight: 900; color: var(--text-sub); margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dashed var(--card-border); letter-spacing: 1px; }
          .side-link { text-decoration: none; padding: 10px 14px; border-radius: 8px; background: var(--input-bg); color: var(--text-main); font-weight: 800; border: 1px solid var(--card-border); transition: 0.2s; display: flex; align-items: center; gap: 8px; font-size: 12px;}
          .side-link.current-page { background: var(--prog-grad); color: #fff; border: none; pointer-events: none; }
          
          .glass-nav-wrapper { display: flex; justify-content: center; margin-bottom: 30px; }
          .glass-nav { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding: 10px 16px; background: var(--card-bg); backdrop-filter: blur(16px); border: 1px solid var(--card-border); border-radius: 20px; box-shadow: var(--card-shadow); max-width: 900px; width: 100%; }
          .nav-left { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
          
          .glass-nav-link { text-decoration: none; padding: 6px 12px; border-radius: 12px; font-weight: 800; background: var(--input-bg); color: var(--text-sub); border: 1px solid var(--card-border); font-size: 12px; transition: 0.2s; white-space: nowrap; }
          .glass-nav-link:hover { color: var(--nav-accent); border-color: var(--nav-accent); }
          .glass-nav-active { padding: 6px 12px; border-radius: 12px; font-weight: 900; background: var(--nav-bg-hover); color: var(--nav-accent); border: 1px solid var(--nav-accent); font-size: 12px; white-space: nowrap; }
          .theme-toggle-btn { background: var(--input-bg); border: 1px solid var(--card-border); padding: 6px 12px; border-radius: 12px; cursor: pointer; font-weight: 800; font-size: 12px; color: var(--text-main); transition: 0.3s; white-space: nowrap; }

          .main-container { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 30px; }

          .kpi-header-content { text-align: center; margin-bottom: 10px; }
          .kpi-main-title { font-size: 28px; font-weight: 900; margin: 0; color: var(--title-color); letter-spacing: 2px; }
          .kpi-sub-title { font-size: 11px; color: var(--text-sub); font-weight: 800; letter-spacing: 3px; }

          .mode-switcher { display: flex; background: var(--input-bg); padding: 6px; border-radius: 20px; border: 1px solid var(--card-border); margin: 0 auto 20px auto; width: fit-content; box-shadow: var(--card-shadow); }
          .mode-btn { padding: 10px 30px; border-radius: 14px; border: none; background: transparent; color: var(--text-sub); font-weight: 900; cursor: pointer; transition: 0.3s; font-size: 13px; letter-spacing: 1px; }
          .mode-btn:hover { color: var(--nav-accent); }
          .mode-btn.active { background: var(--nav-accent); color: #fff; box-shadow: 0 4px 15px var(--nav-bg-hover); }

          .glass-panel { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 24px; padding: 24px; box-shadow: var(--card-shadow); transition: 0.3s; }
          .glass-panel:hover { border-color: var(--card-hover-border); box-shadow: 0 15px 40px rgba(0,0,0,0.1); }
          .panel-title { font-size: 12px; font-weight: 900; color: var(--text-sub); letter-spacing: 2px; margin-bottom: 20px; text-transform: uppercase; border-bottom: 1px dashed var(--card-border); padding-bottom: 10px; }

          .dashboard-grid { display: grid; grid-template-columns: 350px 1fr; gap: 30px; }
          @media (max-width: 900px) { .dashboard-grid { grid-template-columns: 1fr; } }

          /* 💡 進捗リングのズレを完全に修正！ */
          .ring-container { display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 20px; position: relative; }
          .ring-svg { width: 200px; height: 200px; transform: rotate(-90deg); }
          .ring-bg { fill: none; stroke: var(--input-bg); stroke-width: 4; }
          /* 💡 リングの色もテーマに合わせて変化！ */
          .ring-fill { fill: none; stroke: var(--accent-color); stroke-width: 4; stroke-linecap: round; stroke-dasharray: 100; stroke-dashoffset: ${100 - progressPercent}; transition: 1.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
          
          /* 💡 ここがズレの原因でした！ topとleftとtransformを追加してド真ん中に固定！ */
          .ring-text-container { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
          .ring-percent { font-size: 36px; font-weight: 900; color: var(--text-main); line-height: 1; }
          .ring-target { font-size: 13px; font-weight: 800; color: var(--text-sub); margin-top: 6px; }

          .list-row { display: flex; justify-content: space-between; padding: 12px 16px; background: var(--input-bg); border-radius: 12px; margin-bottom: 8px; border: 1px solid var(--input-border); font-size: 13px; font-weight: 800; transition: 0.2s; }
          .list-row:hover { transform: translateX(5px); border-color: var(--card-hover-border); color: var(--nav-accent); }

          /* オペレーターランキング */
          .op-row { margin-bottom: 16px; }
          .op-header { display: flex; justify-content: space-between; font-weight: 900; font-size: 13px; margin-bottom: 6px; color: var(--text-main); }
          .op-prog-bg { width: 100%; height: 8px; background: var(--input-bg); border-radius: 4px; overflow: hidden; border: 1px solid var(--input-border); }
          /* 💡 プログレスバーの色もテーマに追従！ */
          .op-prog-fill { height: 100%; background: var(--prog-grad); transition: width 1.5s cubic-bezier(0.2, 0.8, 0.2, 1); border-radius: 4px; }

          /* クロス集計テーブル */
          .table-container { overflow-x: auto; background: var(--input-bg); border-radius: 16px; border: 1px solid var(--input-border); }
          .cross-table { width: 100%; border-collapse: collapse; font-size: 12px; text-align: center; }
          .cross-table th { padding: 14px 10px; color: var(--title-color); font-weight: 900; background: var(--table-header); border-bottom: 2px solid var(--table-border); white-space: nowrap; }
          .cross-table td { padding: 12px 10px; border-bottom: 1px solid var(--table-border); font-weight: 800; color: var(--text-sub); transition: 0.2s; }
          .cross-table tr:hover td { background: var(--nav-bg-hover); color: var(--text-main); }
          .cross-table td:first-child { text-align: left; font-weight: 900; color: var(--text-main); position: sticky; left: 0; background: var(--input-bg); border-right: 2px solid var(--table-border); }
          .cell-highlight { color: var(--nav-accent) !important; font-weight: 900 !important; background: var(--nav-bg-hover); }

          /* パフォーマンス履歴 */
          .history-container { display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px; }
          .history-card { min-width: 110px; background: var(--input-bg); padding: 16px; border-radius: 16px; text-align: center; border: 1px solid var(--input-border); transition: 0.3s; flex: 1; }
          .history-card:hover { transform: translateY(-5px); border-color: var(--card-hover-border); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
          .history-label { font-size: 11px; color: var(--text-sub); font-weight: 900; margin-bottom: 8px; white-space: nowrap; }
          .history-val { font-size: 24px; font-weight: 900; color: var(--title-color); }

          #toast { visibility: hidden; min-width: 200px; background: var(--nav-accent); color: #fff; text-align: center; border-radius: 8px; padding: 10px 16px; position: fixed; z-index: 9999; right: 20px; bottom: 20px; font-size: 12px; font-weight: bold; transition: 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.2); opacity: 0; transform: translateY(20px); }
          #toast.show { visibility: visible; opacity: 1; transform: translateY(0); }

          .fade-up-element { opacity: 0; transform: translateY(20px); transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
          .fade-up-element.visible { opacity: 1; transform: translateY(0); }
        `}} />

        <div className={`hamburger-btn ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className="hamburger-line line1"></div><div className="hamburger-line line2"></div><div className="hamburger-line line3"></div>
        </div>
        <div className={`menu-overlay ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(false)}></div>
        
        <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
          <div className="menu-title">🧭 TOOL MENU</div>
          <a href="/kpi-detail" className="side-link current-page">📊 獲得進捗・KPI</a>
          <a href="/bulk-register" className="side-link">📦 データ一括登録</a>
          <a href="/net-toss" className="side-link">🌐 ネットトス連携</a>
          <a href="/self-close" className="side-link">🤝 自己クロ連携</a>
          <a href="/sms-kraken" className="side-link">📱 SMS送信</a>
          <a href="/procedure-wizard" className="side-link">🗺️ 手順辞書</a>
          <a href="/affiliate-links" className="side-link">🔗 OBJリンクポータル</a>
        </div>

        <div className="glass-nav-wrapper fade-up-element">
          <div className="glass-nav">
            <div className="nav-left">
              <a href="/" className="glass-nav-link">← 司令室に戻る</a>
              <div className="glass-nav-active">📊 獲得進捗・KPI</div>
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {isDarkMode ? "🎇 NIGHT" : "☀️ DAY"}
            </button>
          </div>
        </div>

        <div className="main-container">
          
          <div className="kpi-header-content fade-up-element">
            <h1 className="kpi-main-title">KPI COMMAND CENTER</h1>
            <p className="kpi-sub-title">SYNCHRONIZED BY GID</p>
          </div>

          <div className="mode-switcher fade-up-element">
            <button className={`mode-btn ${viewMode === "daily" ? "active" : ""}`} onClick={() => setViewMode("daily")}>TODAY</button>
            <button className={`mode-btn ${viewMode === "monthly" ? "active" : ""}`} onClick={() => setViewMode("monthly")}>MONTHLY</button>
          </div>

          <div className="dashboard-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              <div className="glass-panel fade-up-element" style={{ transitionDelay: "0.1s" }}>
                <div className="panel-title">🎯 PROGRESS</div>
                <div className="ring-container">
                  <svg className="ring-svg" viewBox="0 0 36 36">
                    <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="ring-fill" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="ring-text-container">
                    <div className="ring-percent">{progressPercent}%</div>
                    <div className="ring-target">{currentStats.total} / {currentStats.target} 件</div>
                  </div>
                </div>
              </div>

              <div className="glass-panel fade-up-element" style={{ transitionDelay: "0.2s" }}>
                <div className="panel-title">📦 LIST BREAKDOWN</div>
                {currentStats.lists.map((l:any, i:number) => (
                  <div key={i} className="list-row"><span>{l.name}</span><span style={{ color: "var(--title-color)" }}>{l.value} 件</span></div>
                ))}
              </div>
            </div>

            <div className="glass-panel fade-up-element" style={{ transitionDelay: "0.3s" }}>
              <div className="panel-title">🏆 OP RANKING</div>
              {currentStats.ops.sort((a:any, b:any) => b.value - a.value).map((op:any, i:number) => {
                const maxVal = currentStats.ops[0]?.value || 1;
                const p = Math.round((op.value / maxVal) * 100);
                return (
                  <div key={i} className="op-row">
                    <div className="op-header">
                      <span>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "👤"} {op.name}</span>
                      <span style={{ color: "var(--accent-color)" }}>{op.value} 件</span>
                    </div>
                    <div className="op-prog-bg"><div className="op-prog-fill" style={{ width: `${p}%` }}></div></div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-panel fade-up-element" style={{ transitionDelay: "0.4s" }}>
            <div className="panel-title">📊 CROSS-TABULATION MATRIX</div>
            <div className="table-container">
              <table className="cross-table">
                <thead>
                  <tr><th>OPERATOR</th>{currentStats.cross.headers.map((h:string, i:number) => <th key={i}>{h}</th>)}</tr>
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

          <div className="glass-panel fade-up-element" style={{ transitionDelay: "0.5s" }}>
            <div className="panel-title">📈 PERFORMANCE HISTORY ({data.history.month})</div>
            <div className="history-container">
              {data.history.stats.map((s:any, i:number) => (
                <div key={i} className="history-card">
                  <div className="history-label">{s.name}</div>
                  <div className="history-val">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
        
        <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>
      </main>
    </>
  );
}