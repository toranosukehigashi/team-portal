"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// 🌟 高度技術①：ジェネレーティブUI (遊園地のネオンライト生成)
const CarnivalLights = () => {
  const [lights, setLights] = useState<{ id: number; left: string; top: string; delay: string; duration: string; color: string; scale: number }[]>([]);
  
  useEffect(() => {
    const colors = ['#fde047', '#ef4444', '#38bdf8', '#22c55e', '#ec4899'];
    const newLights = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      delay: `${Math.random() * 2}s`,
      duration: `${Math.random() * 1.5 + 0.5}s`,
      color: colors[Math.floor(Math.random() * colors.length)],
      scale: Math.random() * 1.5 + 0.5
    }));
    setLights(newLights);
  }, []);

  return (
    <div className="lights-container">
      {lights.map(light => (
        <div 
          key={light.id} 
          className="floating-light" 
          style={{ 
            left: light.left, top: light.top, 
            animationDelay: light.delay, animationDuration: light.duration, 
            backgroundColor: light.color, boxShadow: `0 0 20px 5px ${light.color}`,
            transform: `scale(${light.scale})`
          }} 
        />
      ))}
    </div>
  );
};

// 🌟 高度技術⑩＆④：本物の3Dパララックス・コンポーネント
const TiltWrapper = ({ children, title, icon }: { children: React.ReactNode, title: string, icon: string }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    // マウス位置から傾きを計算（数字が小さいほど傾きが強烈に！）
    const x = (e.clientX - rect.left - rect.width / 2) / 10;
    const y = -(e.clientY - rect.top - rect.height / 2) / 10;
    setTilt({ x: y, y: x });
  };

  return (
    <section 
      ref={wrapperRef} 
      className="tilt-wrapper fade-up-element" 
      onMouseMove={handleMouseMove} 
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="tilt-card" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        <h2 className="panel-title">
          <span className="title-icon">{icon}</span> {title}
        </h2>
        <div className="panel-content-3d">
          {children}
        </div>
      </div>
    </section>
  );
};

export default function KpiDetail() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // 📊 ダミーデータ（一切変更なし！）
  const ranking = [
    { rank: 1, name: "佐藤", count: 8, trend: "up" },
    { rank: 2, name: "山田", count: 7, trend: "stable" },
    { rank: 3, name: "鈴木", count: 5, trend: "up" },
    { rank: 4, name: "高橋", count: 4, trend: "down" },
  ];

  const myGoal = { current: 5, target: 8, progress: 62.5 };

  useEffect(() => {
    setIsReady(true);
    // 🌟 高度技術⑮：スクロール連動トリガー（要素が画面に入ったら発火）
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const getTrendBadge = (trend: string) => {
    if (trend === "up") return <span className="trend-badge trend-up">🔥 UP</span>;
    if (trend === "stable") return <span className="trend-badge trend-stable">⭐ KEEP</span>;
    return <span className="trend-badge trend-down">💧 DOWN</span>;
  };

  return (
    <div className={`detail-wrapper ${isReady ? "ready" : ""}`}>
      {/* ✨ 究極のアーケード魔法 CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .detail-wrapper * { box-sizing: border-box; }
        
        /* 🌌 イマーシブ背景（ネオンが映える深い夜空） */
        .detail-wrapper {
          min-height: 100vh;
          background: radial-gradient(circle at center, #1e1b4b 0%, #020617 100%);
          padding: 40px 20px; color: #fff; font-family: 'Fredoka One', 'Noto Sans JP', sans-serif;
          overflow-x: hidden; position: relative; z-index: 1;
        }

        /* ✨ ジェネレーティブ・ライト */
        .lights-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; }
        .floating-light { position: absolute; border-radius: 50%; opacity: 0; animation: blinkLight infinite alternate ease-in-out; }
        @keyframes blinkLight { 0% { opacity: 0.1; } 100% { opacity: 0.8; } }

        /* 🎡 SVGアニメーション（巨大な的が奥で回る） */
        .svg-target-bg { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90vh; height: 90vh; opacity: 0.05; z-index: -2; animation: spinTarget 40s linear infinite; pointer-events: none; filter: drop-shadow(0 0 20px rgba(255,255,255,0.5)); }
        @keyframes spinTarget { to { transform: translate(-50%, -50%) rotate(360deg); } }

        .container { max-width: 1100px; margin: 0 auto; position: relative; z-index: 10; }
        
        /* 🔘 アクションファースト（光る戻るボタン） */
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 50px; }
        .btn-back { 
          padding: 12px 28px; background: #0f172a; border: 3px solid #38bdf8; border-radius: 50px; 
          font-weight: 900; color: #38bdf8; cursor: pointer; transition: 0.2s; 
          box-shadow: 0 8px 0 #0284c7, 0 15px 20px rgba(0,0,0,0.5); text-transform: uppercase; letter-spacing: 2px;
        }
        .btn-back:active { transform: translateY(8px); box-shadow: 0 0 0 #0284c7, 0 5px 10px rgba(0,0,0,0.5); }

        /* 🔠 ダイナミック・タイポグラフィ（物理的な厚みを持つ3Dタイトル） */
        .page-title { 
          font-size: 42px; font-weight: 900; margin: 0; letter-spacing: 4px; color: #fde047; 
          text-shadow: 3px 3px 0 #eab308, 6px 6px 0 #d97706, 9px 9px 0 #b45309, 0 15px 20px rgba(0,0,0,0.8);
          transform: rotate(-3deg); animation: floatTitle 2s ease-in-out infinite alternate;
        }
        @keyframes floatTitle { to { transform: rotate(1deg) translateY(-10px); } }

        /* 📦 Bento UI グリッド */
        .dashboard-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 40px; }
        @media (max-width: 850px) { .dashboard-grid { grid-template-columns: 1fr; } }

        /* 🪄 10. 本物の3Dパララックスラッパー */
        .tilt-wrapper { perspective: 1500px; }
        .tilt-card { 
          background: rgba(30, 41, 59, 0.85); border: 4px solid #fde047; border-radius: 30px; padding: 40px; 
          box-shadow: 0 0 30px rgba(253,224,71,0.2), inset 0 0 40px rgba(253,224,71,0.1), 0 20px 50px rgba(0,0,0,0.8);
          backdrop-filter: blur(20px); transform-style: preserve-3d; transition: transform 0.15s ease-out; 
        }
        
        /* タイトルが手前に浮き出る！ */
        .panel-title { 
          font-size: 26px; font-weight: 900; color: #fff; margin-bottom: 30px; display: flex; align-items: center; gap: 15px; 
          text-shadow: 0 4px 10px rgba(0,0,0,0.8); border-bottom: 3px dashed rgba(253,224,71,0.4); padding-bottom: 20px;
          transform: translateZ(60px); /* 🚨ここが3Dのキモ！ */
        }
        .title-icon { font-size: 34px; filter: drop-shadow(0 0 15px rgba(253,224,71,0.8)); }
        
        /* コンテンツ群も手前に浮き出る！ */
        .panel-content-3d { transform: translateZ(40px); transform-style: preserve-3d; }

        /* 🎯 11. マスク・クリップパス (光るネオンターゲット) */
        .goal-container { text-align: center; padding: 10px 0; }
        .circular-progress { 
          width: 220px; height: 220px; border-radius: 50%; margin: 0 auto 30px; position: relative;
          background: conic-gradient(#ef4444 ${myGoal.progress}%, #1e293b 0);
          display: flex; align-items: center; justify-content: center; 
          box-shadow: 0 0 40px rgba(239, 68, 68, 0.6), inset 0 0 30px rgba(0,0,0,0.9), 0 0 0 10px #0f172a, 0 0 0 16px #fde047;
          transition: 1s ease-out;
        }
        /* 中をくり抜き、奥行きを出す */
        .circular-progress::before { content: ""; position: absolute; width: 150px; height: 150px; background: #0f172a; border-radius: 50%; box-shadow: inset 0 10px 20px rgba(0,0,0,0.9); border: 4px dashed rgba(255,255,255,0.1); }
        
        .progress-text { position: relative; z-index: 1; display: flex; flex-direction: column; transform: translateZ(30px); }
        .percent { font-size: 56px; font-weight: 900; color: #fff; text-shadow: 0 0 20px rgba(239, 68, 68, 0.8), 0 6px 0 #b91c1c; }
        
        .goal-nums { font-size: 20px; font-weight: 900; color: #94a3b8; margin-top: 15px; letter-spacing: 2px; transform: translateZ(20px); }
        .goal-current-val { color: #fde047; font-size: 40px; text-shadow: 0 0 20px rgba(253,224,71,0.8); margin: 0 10px; }

        /* 🏆 14. 動的ループ生成＆⑫高度なホバー (物理ブロックのようなランキング) */
        .ranking-list { display: flex; flex-direction: column; gap: 20px; }
        
        .rank-card { 
          display: flex; align-items: center; padding: 20px 25px; border-radius: 20px; 
          background: #1e293b; border: 3px solid #38bdf8; border-bottom: 8px solid #0284c7; /* 物理的な厚み */
          transition: 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; transform-style: preserve-3d; 
          
          /* 🪄 スクロール連動バウンドアニメーション */
          opacity: 0;
        }
        .fade-up-element.visible .rank-card {
          animation: popBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          animation-delay: calc(var(--rank) * 0.15s);
        }
        @keyframes popBounce { 0% { opacity: 0; transform: translateX(-50px) scale(0.8); } 100% { opacity: 1; transform: translateX(0) scale(1); } }
        
        /* 💥 ホバーで「手前に飛び出す」エフェクト */
        .rank-card:hover { 
          transform: translateZ(50px) translateY(-8px) scale(1.05) !important; 
          background: #0f172a; border-color: #fde047; border-bottom-color: #b45309;
          box-shadow: 0 25px 40px rgba(0,0,0,0.8), 0 0 30px rgba(253,224,71,0.3); z-index: 20; 
        }
        
        /* 王冠・順位バッジ */
        .rank-num { width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; border-radius: 16px; font-size: 26px; font-weight: 900; color: #fff; background: #334155; margin-right: 20px; box-shadow: inset 0 4px 0 rgba(255,255,255,0.2), 0 4px 10px rgba(0,0,0,0.5); text-shadow: 0 2px 4px rgba(0,0,0,0.8); transform: translateZ(15px); }
        .rank-card.rank-1 { border-color: #fde047; border-bottom-color: #b45309; background: linear-gradient(90deg, rgba(253,224,71,0.15), #1e293b); }
        .rank-card.rank-1 .rank-num { background: linear-gradient(135deg, #fef08a, #f59e0b); border: 3px solid #fff; box-shadow: 0 0 20px #f59e0b; color: #78350f; text-shadow: none; }
        .rank-card.rank-2 .rank-num { background: linear-gradient(135deg, #f1f5f9, #94a3b8); color: #0f172a; text-shadow: none; }
        .rank-card.rank-3 .rank-num { background: linear-gradient(135deg, #fca5a5, #dc2626); }
        
        .rank-name { flex: 1; font-weight: 900; color: #fff; font-size: 22px; letter-spacing: 2px; transform: translateZ(10px); text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
        
        /* クリップパスを用いたトレンドバッジ */
        .trend-badge { font-size: 13px; font-weight: 900; padding: 6px 14px; border-radius: 8px; margin-right: 20px; letter-spacing: 1px; box-shadow: 0 4px 10px rgba(0,0,0,0.4); transform: translateZ(20px); clip-path: polygon(10% 0, 100% 0, 90% 100%, 0% 100%); }
        .trend-up { background: #ef4444; color: #fff; text-shadow: 0 2px 2px #9f1239; border: 1px solid #fca5a5; }
        .trend-stable { background: #fde047; color: #0f172a; }
        .trend-down { background: #38bdf8; color: #fff; }

        .rank-count { font-size: 38px; font-weight: 900; color: #38bdf8; text-shadow: 0 4px 0 #0284c7, 0 0 20px rgba(56,189,248,0.6); transform: translateZ(25px); font-family: 'Inter', sans-serif; }
        .rank-unit { font-size: 16px; color: #94a3b8; margin-left: 8px; font-weight: 800; text-shadow: none; }
      `}} />

      {/* 🎪 イマーシブ背景群 */}
      <div className="circus-bg"></div>
      <CarnivalLights />
      <svg className="svg-target-bg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeDasharray="4 6" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(239,68,68,0.5)" strokeWidth="6" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(253,224,71,0.5)" strokeWidth="8" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      </svg>

      <div className="container">
        <header className="header">
          <button className="btn-back" onClick={() => router.push("/")}>INSERT COIN (戻る)</button>
          <h1 className="page-title">TOY STORY MANIA!</h1>
        </header>

        <div className="dashboard-grid">
          {/* 🎯 個人目標管理 (ターゲットパネル) */}
          <TiltWrapper title="MY TARGET SCORE" icon="🎯">
            <div className="goal-container">
              <div className="circular-progress">
                <div className="progress-text">
                  <span className="percent">{myGoal.progress}<span style={{fontSize:"24px"}}>%</span></span>
                </div>
              </div>
              <div className="goal-nums">
                SCORE <span className="goal-current-val">{myGoal.current}</span> / TARGET {myGoal.target}
              </div>
              <p style={{
                fontSize: "15px", color: "#fde047", marginTop: "25px", fontWeight: 900, 
                background: "rgba(0,0,0,0.6)", padding: "16px", borderRadius: "16px", 
                border: "2px dashed rgba(253,224,71,0.4)", transform: "translateZ(10px)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.5)"
              }}>
                目標達成まであと <span style={{color:"#ef4444", fontSize:"22px", textShadow:"0 0 10px rgba(239,68,68,0.8)"}}>{myGoal.target - myGoal.current}</span> HIT！
              </p>
            </div>
          </TiltWrapper>

          {/* 🏆 ランキングボード (ハイスコアパネル) */}
          <TiltWrapper title="TODAY'S HIGH SCORES" icon="🏆">
            <div className="ranking-list">
              {ranking.map((user, index) => (
                <div key={user.rank} className={`rank-card rank-${user.rank}`} style={{ "--rank": index + 1 } as React.CSSProperties}>
                  <div className="rank-num">{user.rank === 1 ? "👑" : user.rank}</div>
                  <div className="rank-name">{user.name}</div>
                  {getTrendBadge(user.trend)}
                  <div className="rank-count">{user.count}<span className="rank-unit">HIT</span></div>
                </div>
              ))}
            </div>
          </TiltWrapper>
        </div>
      </div>
    </div>
  );
}