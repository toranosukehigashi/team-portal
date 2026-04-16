"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// 🌟 高度技術①：ジェネレーティブUI (背景のカーニバルライト生成)
const CarnivalLights = () => {
  const [lights, setLights] = useState<{ id: number; left: string; top: string; delay: string; duration: string; color: string }[]>([]);
  useEffect(() => {
    const colors = ['#fde047', '#ef4444', '#38bdf8', '#22c55e'];
    const newLights = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      delay: `${Math.random() * 2}s`,
      duration: `${Math.random() * 2 + 1}s`,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setLights(newLights);
  }, []);

  return (
    <div className="lights-container">
      {lights.map(light => (
        <div key={light.id} className="floating-light" style={{ left: light.left, top: light.top, animationDelay: light.delay, animationDuration: light.duration, backgroundColor: light.color, boxShadow: `0 0 15px ${light.color}` }} />
      ))}
    </div>
  );
};

// 🌟 高度技術⑩＆⑫：3Dパララックスパネル（マウスに合わせて傾く）
const TiltPanel = ({ children, title, icon }: { children: React.ReactNode, title: string, icon: string }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({ x: -(y / 30), y: x / 30 }); // 緩やかな傾き
  };

  return (
    <section 
      ref={panelRef} className="glass-panel fade-up-element" 
      onMouseMove={handleMouseMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
    >
      <h2 className="panel-title">
        <span className="title-icon">{icon}</span> {title}
      </h2>
      <div className="panel-content-3d">
        {children}
      </div>
    </section>
  );
};

export default function KpiDetail() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // 📊 ダミーデータ（一切変更していません！）
  const ranking = [
    { rank: 1, name: "佐藤", count: 8, trend: "up" },
    { rank: 2, name: "山田", count: 7, trend: "stable" },
    { rank: 3, name: "鈴木", count: 5, trend: "up" },
    { rank: 4, name: "高橋", count: 4, trend: "down" },
  ];

  const myGoal = {
    current: 5,
    target: 8,
    progress: 62.5
  };

  useEffect(() => {
    setIsReady(true);
    // 🌟 高度技術⑮：スクロール連動トリガー
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <span style={{ color: "#ef4444", textShadow: "0 0 10px #ef4444" }}>🔥 UP</span>;
    if (trend === "stable") return <span style={{ color: "#fde047", textShadow: "0 0 10px #fde047" }}>⭐ KEEP</span>;
    return <span style={{ color: "#38bdf8", textShadow: "0 0 10px #38bdf8" }}>💧 DOWN</span>;
  };

  return (
    <div className={`detail-wrapper ${isReady ? "ready" : ""}`}>
      {/* ✨ 究極魔法のCSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .detail-wrapper * { box-sizing: border-box; }
        
        /* 🌌 3. アクセシビリティとダークモード標準化 (夜の遊園地) */
        .detail-wrapper {
          min-height: 100vh;
          background: radial-gradient(circle at center, #1e1b4b 0%, #0f172a 100%);
          padding: 40px 20px; color: #fff; font-family: 'Inter', 'Noto Sans JP', sans-serif;
          overflow-x: hidden; position: relative; z-index: 1;
        }

        /* 🎪 9. イマーシブ要素 (サーカステントのストライプ透かし) */
        .circus-bg {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -2; pointer-events: none; opacity: 0.03;
          background: repeating-linear-gradient(45deg, #000, #000 40px, #fff 40px, #fff 80px);
        }

        /* ✨ 1. ジェネレーティブUI (光の粒) */
        .lights-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; overflow: hidden; }
        .floating-light { position: absolute; width: 6px; height: 6px; border-radius: 50%; opacity: 0; animation: floatLight infinite alternate ease-in-out; }
        @keyframes floatLight { 0% { transform: translateY(0) scale(0.8); opacity: 0.2; } 100% { transform: translateY(-50px) scale(1.5); opacity: 0.8; } }

        /* 🎡 13. SVGアニメーション (背景の巨大な的) */
        .svg-target-bg { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80vh; height: 80vh; opacity: 0.05; z-index: -1; animation: spinTarget 60s linear infinite; pointer-events: none; }
        @keyframes spinTarget { to { transform: translate(-50%, -50%) rotate(360deg); } }

        .container { max-width: 1000px; margin: 0 auto; position: relative; z-index: 10; }
        
        /* 🔘 6. アクション・ファースト (戻るボタン) */
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
        .btn-back { padding: 12px 24px; background: rgba(15,23,42,0.8); border: 2px solid #38bdf8; border-radius: 30px; font-weight: 900; color: #38bdf8; cursor: pointer; transition: 0.3s; backdrop-filter: blur(10px); box-shadow: 0 4px 15px rgba(56,189,248,0.2); text-transform: uppercase; letter-spacing: 1px; }
        .btn-back:hover { background: #38bdf8; color: #0f172a; transform: translateX(-5px); box-shadow: 0 0 20px rgba(56,189,248,0.5); }

        /* 🔠 5. ダイナミック・タイポグラフィ */
        .page-title { 
          font-size: 32px; font-weight: 900; margin: 0; letter-spacing: 3px;
          color: #fde047; text-shadow: 3px 3px 0 #ef4444, 6px 6px 0 #b91c1c, 0 0 20px rgba(253,224,71,0.4);
          transform: rotate(-2deg); animation: floatTitle 3s ease-in-out infinite alternate;
        }
        @keyframes floatTitle { to { transform: rotate(1deg) translateY(-5px); } }

        /* 📦 2. Bento UI & 8. バーティカルUI */
        .dashboard-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 30px; perspective: 1200px; }
        @media (max-width: 800px) { .dashboard-grid { grid-template-columns: 1fr; } }

        /* 🪄 スクロール連動カスケード */
        .fade-up-element { opacity: 0; transform: translateY(50px) scale(0.95); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .fade-up-element.visible { opacity: 1; transform: translateY(0) scale(1); }

        /* 🃏 10. 3Dパララックスガラスパネル */
        .glass-panel { 
          background: rgba(30, 41, 59, 0.7); border: 2px solid rgba(255, 255, 255, 0.1); border-top-color: rgba(253,224,71,0.4);
          border-radius: 30px; padding: 35px; box-shadow: 0 20px 50px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.4);
          backdrop-filter: blur(20px); transform-style: preserve-3d; transition: border-color 0.3s, box-shadow 0.3s;
        }
        .glass-panel:hover { border-color: rgba(253,224,71,0.8); box-shadow: 0 30px 60px rgba(0,0,0,0.9), inset 0 0 40px rgba(253,224,71,0.1); }
        
        .panel-title { font-size: 22px; font-weight: 900; color: #fff; margin-bottom: 30px; display: flex; align-items: center; gap: 12px; letter-spacing: 1px; text-shadow: 0 2px 5px rgba(0,0,0,0.8); transform: translateZ(30px); border-bottom: 2px dashed rgba(255,255,255,0.2); padding-bottom: 15px; }
        .title-icon { font-size: 28px; filter: drop-shadow(0 0 10px rgba(253,224,71,0.8)); }
        
        .panel-content-3d { transform: translateZ(40px); transform-style: preserve-3d; }

        /* 🎯 11. マスク・クリップパス (ネオンターゲット型プログレス) */
        .goal-container { text-align: center; padding: 10px 0; }
        .circular-progress { 
          width: 200px; height: 200px; border-radius: 50%; margin: 0 auto 30px; position: relative;
          background: conic-gradient(#ef4444 ${myGoal.progress}%, rgba(255,255,255,0.05) 0);
          display: flex; align-items: center; justify-content: center; 
          box-shadow: 0 0 30px rgba(239, 68, 68, 0.4), inset 0 0 20px rgba(0,0,0,0.8);
          border: 4px solid #1e1b4b; transition: 1s ease-out;
        }
        /* マスクで中をくり抜き、光るリングにする */
        .circular-progress::before { content: ""; position: absolute; width: 160px; height: 160px; background: #0f172a; border-radius: 50%; box-shadow: inset 0 0 20px rgba(0,0,0,0.9), 0 0 15px rgba(239, 68, 68, 0.5); border: 2px dashed rgba(255,255,255,0.1); }
        
        .progress-text { position: relative; z-index: 1; display: flex; flex-direction: column; transform: translateZ(20px); }
        .percent { font-size: 48px; font-weight: 900; color: #fff; text-shadow: 0 0 20px rgba(239, 68, 68, 0.8), 0 4px 0 #b91c1c; font-variant-numeric: tabular-nums; }
        
        .goal-nums { font-size: 18px; font-weight: 900; color: #cbd5e1; margin-top: 10px; letter-spacing: 1px; }
        .goal-current-val { color: #fde047; font-size: 32px; text-shadow: 0 0 15px rgba(253,224,71,0.6); margin: 0 5px; }

        /* 🏆 14. 動的ループ生成＆⑫高度なホバー (アーケードランキング) */
        .ranking-list { display: flex; flex-direction: column; gap: 18px; }
        .rank-card { 
          display: flex; align-items: center; padding: 18px 25px; border-radius: 20px; 
          background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.05); 
          transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); cursor: default;
          transform-style: preserve-3d; position: relative; overflow: hidden;
          animation: cascadeIn 0.5s ease-out backwards; animation-delay: calc(var(--rank) * 0.15s); opacity: 0;
        }
        @keyframes cascadeIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        
        /* ホバーで手前に飛び出す */
        .rank-card:hover { transform: scale(1.03) translateZ(20px) translateX(10px); background: rgba(0,0,0,0.6); border-color: rgba(56,189,248,0.5); box-shadow: 0 15px 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(56,189,248,0.2); z-index: 10; }
        
        /* 王冠・順位バッジ */
        .rank-num { width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 12px; font-size: 22px; font-weight: 900; color: #fff; background: #334155; margin-right: 15px; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5); text-shadow: 0 2px 2px rgba(0,0,0,0.5); }
        .rank-card.rank-1 { border-color: rgba(251,191,36,0.6); background: linear-gradient(90deg, rgba(251,191,36,0.1), rgba(0,0,0,0.4)); box-shadow: 0 0 20px rgba(251,191,36,0.1); }
        .rank-card.rank-1 .rank-num { background: linear-gradient(135deg, #fde047, #b45309); color: #fff; box-shadow: 0 0 15px rgba(251,191,36,0.6); border: 2px solid #fef08a; }
        .rank-card.rank-2 .rank-num { background: linear-gradient(135deg, #e2e8f0, #64748b); }
        .rank-card.rank-3 .rank-num { background: linear-gradient(135deg, #fca5a5, #9f1239); }
        
        .rank-name { flex: 1; font-weight: 900; color: #fff; font-size: 18px; letter-spacing: 1px; }
        .rank-trend { font-size: 12px; font-weight: 900; padding: 4px 10px; background: rgba(0,0,0,0.5); border-radius: 20px; margin-right: 15px; border: 1px solid rgba(255,255,255,0.1); }
        .rank-count { font-size: 28px; font-weight: 900; color: #38bdf8; text-shadow: 0 0 15px rgba(56,189,248,0.5); }
        .rank-unit { font-size: 14px; color: #94a3b8; margin-left: 6px; font-weight: 800; text-shadow: none; }
      `}} />

      {/* 🎪 イマーシブ背景 */}
      <div className="circus-bg"></div>
      <CarnivalLights />
      <svg className="svg-target-bg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(239,68,68,0.5)" strokeWidth="4" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(253,224,71,0.5)" strokeWidth="6" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      </svg>

      <div className="container">
        <header className="header">
          <button className="btn-back" onClick={() => router.push("/")}>← EXIT DASHBOARD</button>
          <h1 className="page-title">TOY STORY MANIA!</h1>
        </header>

        <div className="dashboard-grid">
          {/* 🎯 個人目標管理 (ターゲットパネル) */}
          <TiltPanel title="MY TARGET SCORE" icon="🎯">
            <div className="goal-container">
              <div className="circular-progress">
                <div className="progress-text">
                  <span className="percent">{myGoal.progress}<span style={{fontSize:"20px"}}>%</span></span>
                </div>
              </div>
              <div className="goal-nums">
                SCORE <span className="goal-current-val">{myGoal.current}</span> / TARGET {myGoal.target}
              </div>
              <p style={{fontSize: "14px", color: "#94a3b8", marginTop: "20px", fontWeight: 800, background: "rgba(0,0,0,0.4)", padding: "12px", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.2)"}}>
                目標達成まであと <span style={{color:"#ef4444", fontSize:"18px", fontWeight:900}}>{myGoal.target - myGoal.current}</span> HIT！
              </p>
            </div>
          </TiltPanel>

          {/* 🏆 ランキングボード (ハイスコアパネル) */}
          <TiltPanel title="TODAY'S HIGH SCORES" icon="🏆">
            <div className="ranking-list">
              {ranking.map((user, index) => (
                <div key={user.rank} className={`rank-card rank-${user.rank}`} style={{ "--rank": index + 1 } as React.CSSProperties}>
                  <div className="rank-num">{user.rank === 1 ? "👑" : user.rank}</div>
                  <div className="rank-name">{user.name}</div>
                  <div className="rank-trend">{getTrendIcon(user.trend)}</div>
                  <div className="rank-count">{user.count}<span className="rank-unit">HIT</span></div>
                </div>
              ))}
            </div>
          </TiltPanel>
        </div>
      </div>
    </div>
  );
}