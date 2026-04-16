"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// 🌟 高度技術①：ジェネレーティブUI (青空に舞う風船)
const CarnivalBalloons = () => {
  const [balloons, setBalloons] = useState<{ id: number; left: string; delay: string; duration: string; color: string; scale: number }[]>([]);
  
  useEffect(() => {
    const colors = ['#ef4444', '#3b82f6', '#fde047', '#22c55e', '#a855f7'];
    const newBalloons = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 10 + 10}s`, // ゆっくり昇る
      color: colors[Math.floor(Math.random() * colors.length)],
      scale: Math.random() * 0.8 + 0.4
    }));
    setBalloons(newBalloons);
  }, []);

  return (
    <div className="balloons-container">
      {balloons.map(b => (
        <div 
          key={b.id} className="floating-balloon" 
          style={{ 
            left: b.left, animationDelay: b.delay, animationDuration: b.duration, 
            backgroundColor: b.color, transform: `scale(${b.scale})`
          }} 
        />
      ))}
    </div>
  );
};

// ✨ 高度技術④：SVGアニメーション背景 (おもちゃの要素を追加)
const ToyArmyPart = () => {
  const [toyArmy, setToyArmy] = useState<{ id: number; left: string; top: string; delay: string; duration: string; scale: number }[]>([]);
  
  useEffect(() => {
    // 画面のあちこちに小さなグリーンアーミーメンを配置
    const newToyArmy = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 95}vw`,
      top: `${Math.random() * 95}vh`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 10 + 20}s`, // ゆっくり回転
      scale: Math.random() * 0.2 + 0.1
    }));
    setToyArmy(newToyArmy);
  }, []);

  return (
    <div className="toy-army-container">
      {/* 背景のターゲットと、兵隊たちのシルエット */}
      <svg className="svg-target-bg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeDasharray="4 6" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(239,68,68,0.5)" strokeWidth="6" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(253,224,71,0.5)" strokeWidth="8" />
      </svg>
      {toyArmy.map(toy => (
        <div key={toy.id} className="floating-toy-army" style={{ left: toy.left, top: toy.top, animationDelay: toy.delay, animationDuration: toy.duration, transform: `scale(${toy.scale}) rotate(${Math.random() * 360}deg)` }}>
          🔫 {/* グリーンアーミーメンのアイコン（薄く） */}
        </div>
      ))}
    </div>
  );
};

// 🌟 高度技術⑩＆④：おもちゃ箱風 3Dパララックスパネル
const TiltWrapper = ({ children, title, icon, borderColor }: { children: React.ReactNode, title: string, icon: string, borderColor: string }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 25; // 傾きを少しマイルドに
    const y = -(e.clientY - rect.top - rect.height / 2) / 25;
    setTilt({ x: y, y: x });
  };

  return (
    <section 
      ref={wrapperRef} className="tilt-wrapper fade-up-element" 
      onMouseMove={handleMouseMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="tilt-card" style={{ transform: `perspective(1500px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, borderColor: borderColor }}>
        <h2 className="panel-title" style={{ color: borderColor }}>
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

  // 📊 データ群（項目を大幅追加！）
  const ranking = [
    { rank: 1, name: "佐藤", count: 8, trend: "up" },
    { rank: 2, name: "山田", count: 7, trend: "stable" },
    { rank: 3, name: "鈴木", count: 5, trend: "up" },
    { rank: 4, name: "高橋", count: 4, trend: "down" },
  ];

  const myDailyGoal = { current: 5, target: 8, progress: Math.floor((5/8)*100) };
  const myMonthlyGoal = { current: 85, target: 150, progress: Math.floor((85/150)*100) };
  
  const listStats = [
    { name: "Aエリア 新規", count: 3, target: 5, color: "#f97316" }, // ウッディ色
    { name: "既存乗り換え", count: 2, target: 3, color: "#a855f7" }, // バズ色
    { name: "紹介キャンペーン", count: 0, target: 2, color: "#10b981" }, // レックス色
  ];

  useEffect(() => {
    setIsReady(true);
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
      <style dangerouslySetInnerHTML={{ __html: `
        .detail-wrapper * { box-sizing: border-box; }
        
        /* 🌤️ 1. 背景切れの修正：背景を画面に固定 (デイライト・カーニバル) */
        .detail-wrapper {
          min-height: 100vh;
          /* 背景専用の固定要素を作成し、そこにグラデーションをかける */
          position: relative; z-index: 1;
        }

        /* 🌟 背景専用の固定レイヤー */
        .app-background {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -3;
          background: linear-gradient(180deg, #38bdf8 0%, #1e3a8a 100%);
        }

        /* 🎪 背景のカーニバルストライプ（固定） */
        .circus-bg {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -2; pointer-events: none; opacity: 0.1;
          background: repeating-linear-gradient(45deg, #fff, #fff 40px, transparent 40px, transparent 80px);
        }

        /* 🎈 風船アニメーション（固定） */
        .balloons-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; overflow: hidden; }
        .floating-balloon { position: absolute; bottom: -50px; width: 30px; height: 40px; border-radius: 50%; opacity: 0.8; animation: floatUp linear infinite; box-shadow: inset -5px -5px 10px rgba(0,0,0,0.2); }
        @keyframes floatUp { 0% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-60vh) rotate(5deg); } 100% { transform: translateY(-120vh) rotate(-5deg); } }

        /* ✨ おもちゃの要素を追加：グリーンアーミーメンとターゲット（固定） */
        .toy-army-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; pointer-events: none; overflow: hidden; }
        .svg-target-bg { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90vh; height: 90vh; opacity: 0.05; animation: spinTarget 40s linear infinite; filter: drop-shadow(0 0 20px rgba(255,255,255,0.5)); }
        @keyframes spinTarget { to { transform: translate(-50%, -50%) rotate(360deg); } }
        .floating-toy-army { position: absolute; font-size: 24px; opacity: 0.05; animation: spinToy Army infinite alternate ease-in-out; }
        @keyframes spinToyArmy { from { transform: rotate(0); } to { transform: rotate(360deg); } }

        /* 🤠背景シルエット：ウッディとバズ（固定、超薄く） */
        .andy-toys-watermark { position: fixed; bottom: 10%; right: 10%; font-size: 200px; opacity: 0.01; z-index: -2; }
        .andy-toys-watermark-2 { position: fixed; top: 10%; left: 10%; font-size: 150px; opacity: 0.01; z-index: -2; }

        .container { max-width: 1200px; margin: 0 auto; position: relative; z-index: 10; padding: 30px 15px; }
        
        /* 🔘 ヘッダーと戻るボタン */
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; }
        .btn-back { 
          padding: 10px 20px; background: #fff; border: 4px solid #fde047; border-radius: 30px; 
          font-weight: 900; color: #1e3a8a; cursor: pointer; transition: 0.2s; 
          box-shadow: 0 6px 0 #ca8a04, 0 10px 15px rgba(0,0,0,0.2); text-transform: uppercase; font-size: 13px;
          list-style: none; /* ユーティリティのdetailsの影響を消す */
        }
        .btn-back:active { transform: translateY(6px); box-shadow: 0 0 0 #ca8a04, 0 4px 5px rgba(0,0,0,0.2); }

        /* 🔠 ポップな3Dタイトル */
        .page-title { 
          font-size: 36px; font-weight: 900; margin: 0; letter-spacing: 2px; color: #fff; 
          text-shadow: 3px 3px 0 #ef4444, 6px 6px 0 #b91c1c, 0 10px 15px rgba(0,0,0,0.4);
          transform: rotate(-2deg); animation: floatTitle 3s ease-in-out infinite alternate;
        }
        @keyframes floatTitle { to { transform: rotate(1deg) translateY(-5px); } }

        /* Bento UI グリッド */
        .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
        @media (max-width: 900px) { .dashboard-grid { grid-template-columns: 1fr; } }

        /* 3Dパララックス・プラスチックパネル */
        .tilt-wrapper { perspective: 1500px; }
        .tilt-card { 
          background: rgba(255, 255, 255, 0.95); border: 5px solid; border-radius: 24px; padding: 25px; 
          box-shadow: 0 15px 30px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,1);
          transform-style: preserve-3d; transition: transform 0.15s ease-out; 
        }
        
        /* タイトル */
        .panel-title { 
          font-size: 20px; font-weight: 900; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; 
          border-bottom: 3px dashed #e2e8f0; padding-bottom: 12px; transform: translateZ(30px); 
        }
        .title-icon { font-size: 24px; }
        
        .panel-content-3d { transform: translateZ(20px); transform-style: preserve-3d; }

        /* 🎯 円形プログレス (ウッディ色に変更) */
        .goal-container { text-align: center; }
        .circular-progress { 
          width: 140px; height: 140px; border-radius: 50%; margin: 0 auto 15px; position: relative;
          background: conic-gradient(#f97316 ${myDailyGoal.progress}%, #e2e8f0 0); /* ウッディ色 */
          display: flex; align-items: center; justify-content: center; 
          box-shadow: 0 8px 15px rgba(249,115,22,0.3), inset 0 4px 8px rgba(0,0,0,0.1);
          border: 4px solid #fff;
        }
        .circular-progress::before { content: ""; position: absolute; width: 100px; height: 100px; background: #fff; border-radius: 50%; box-shadow: inset 0 4px 8px rgba(0,0,0,0.1); }
        
        .progress-text { position: relative; z-index: 1; display: flex; flex-direction: column; transform: translateZ(20px); }
        .percent { font-size: 36px; font-weight: 900; color: #c2410c; font-variant-numeric: tabular-nums; line-height: 1; }
        
        .goal-nums { font-size: 16px; font-weight: 900; color: #64748b; margin-top: 10px; }
        .goal-current-val { color: #fde047; font-size: 28px; margin: 0 5px; }

        /* 📅 月間プログレス (バズ色に変更) */
        .monthly-bar-wrap { width: 100%; height: 24px; background: #e2e8f0; border-radius: 12px; border: 3px solid #cbd5e1; overflow: hidden; position: relative; box-shadow: inset 0 4px 6px rgba(0,0,0,0.1); }
        .monthly-bar-fill { height: 100%; background: repeating-linear-gradient(45deg, #a855f7, #a855f7 15px, #9333ea 15px, #9333ea 30px); width: ${myMonthlyGoal.progress}%; transition: 1s ease-out; } /* バズ色 */
        .monthly-text { display: flex; justify-content: space-between; font-weight: 900; font-size: 14px; margin-bottom: 8px; color: #334155; }

        /* 📋 リスト別獲得数 */
        .list-stats-container { display: flex; flex-direction: column; gap: 12px; }
        .list-item { display: flex; flex-direction: column; gap: 4px; }
        .list-item-header { display: flex; justify-content: space-between; font-size: 13px; font-weight: 800; color: #475569; }
        .list-bar-bg { width: 100%; height: 12px; background: #f1f5f9; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0; }
        .list-bar-fill { height: 100%; border-radius: 6px; }

        /* 🏆 ランキング（おもちゃのブロック風） */
        .ranking-list { display: flex; flex-direction: column; gap: 12px; }
        .rank-card { 
          display: flex; align-items: center; padding: 12px 18px; border-radius: 16px; 
          background: #f8fafc; border: 2px solid #e2e8f0; border-bottom: 6px solid #cbd5e1; /* おもちゃのブロック感 */
          transition: 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: default; transform-style: preserve-3d; 
          opacity: 0;
        }
        .fade-up-element.visible .rank-card {
          animation: popBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          animation-delay: calc(var(--rank) * 0.1s);
        }
        @keyframes popBounce { 0% { opacity: 0; transform: translateX(-30px) scale(0.9); } 100% { opacity: 1; transform: translateX(0) scale(1); } }
        
        .rank-card:hover { 
          transform: translateZ(20px) translateY(-4px) !important; 
          background: #fff; border-color: #38bdf8; border-bottom-color: #0284c7;
          box-shadow: 0 10px 20px rgba(56,189,248,0.2); z-index: 10; 
        }
        
        .rank-num { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 10px; font-size: 18px; font-weight: 900; color: #fff; background: #94a3b8; margin-right: 15px; box-shadow: inset 0 -2px 0 rgba(0,0,0,0.2); }
        .rank-card.rank-1 { border-color: #fde047; border-bottom-color: #ca8a04; background: #fffbeb; }
        .rank-card.rank-1 .rank-num { background: #f59e0b; font-size: 20px; }
        .rank-card.rank-2 .rank-num { background: #cbd5e1; }
        .rank-card.rank-3 .rank-num { background: #fca5a5; }
        
        .rank-name { flex: 1; font-weight: 900; color: #1e293b; font-size: 16px; transform: translateZ(5px); }
        
        .trend-badge { font-size: 11px; font-weight: 900; padding: 4px 10px; border-radius: 8px; margin-right: 15px; transform: translateZ(10px); }
        .trend-up { background: #fee2e2; color: #e11d48; border: 1px solid #fda4af; }
        .trend-stable { background: #fef9c3; color: #ca8a04; border: 1px solid #fde047; }
        .trend-down { background: #e0f2fe; color: #0284c7; border: 1px solid #7dd3fc; }

        .rank-count { font-size: 24px; font-weight: 900; color: #2563eb; transform: translateZ(10px); font-family: 'Fredoka One', 'Inter', sans-serif; }
        .rank-unit { font-size: 12px; color: #64748b; margin-left: 4px; font-weight: 800; }
        
        /* アニメーション用クラス */
        .fade-up-element { opacity: 0; transform: translateY(40px); transition: all 0.6s ease-out; }
        .fade-up-element.visible { opacity: 1; transform: translateY(0); }
      `}} />

      {/* 🎪 明るいデザイン専用の固定背景要素群（実用性：固定化） */}
      <div className="app-background"></div>
      <div className="circus-bg"></div>
      <CarnivalBalloons />
      <ToyArmyPart />
      
      {/* 🤠 おもちゃのシルエット（超薄く固定） */}
      <div className="andy-toys-watermark">🤠</div>
      <div className="andy-toys-watermark-2">レックス🦖</div>

      <div className="container">
        <header className="header">
          <button className="btn-back" onClick={() => router.push("/")}>← ホームに戻る</button>
          <h1 className="page-title">TOY STORY MANIA!</h1>
        </header>

        <div className="dashboard-grid">
          {/* 🎯 左上：個人目標 (Daily / ウッディ色) */}
          <TiltWrapper title="DAILY TARGET" icon="⭐" borderColor="#f97316">
            <div className="goal-container">
              <div className="circular-progress">
                <div className="progress-text">
                  <span className="percent">{myDailyGoal.progress}<span style={{fontSize:"18px"}}>%</span></span>
                </div>
              </div>
              <div className="goal-nums">
                現在 <span className="goal-current-val">{myDailyGoal.current}</span> / 目標 {myDailyGoal.target}
              </div>
              <div style={{ background: "#fef3c7", color: "#b45309", padding: "10px", borderRadius: "10px", fontSize: "13px", fontWeight: 800, marginTop: "15px", border: "2px dashed #fcd34d" }}>
                目標達成まであと <span style={{color:"#ef4444", fontSize:"18px"}}>{myDailyGoal.target - myDailyGoal.current}</span>HIT！🤠
              </div>
            </div>
          </TiltWrapper>

          {/* 🏆 右側：ランキングボード (Team / バズ色) */}
          <div style={{ gridRow: "span 2" }}>
            <TiltWrapper title="TEAM RANKING" icon="🚀" borderColor="#a855f7">
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

          {/* 📅 左下(1)：月間目標 (Monthly / レックス色) */}
          <TiltWrapper title="MONTHLY GOAL" icon="🦖" borderColor="#10b981">
            <div className="monthly-text">
              <span style={{ color: "#64748b" }}>今月の進捗</span>
              <span style={{ color: "#059669", fontSize: "18px" }}>{myMonthlyGoal.current} / {myMonthlyGoal.target} HIT!</span>
            </div>
            <div className="monthly-bar-wrap">
              <div className="monthly-bar-fill"></div>
            </div>
            <div style={{ textAlign: "right", marginTop: "5px", fontSize: "16px", fontWeight: 900, color: "#9333ea" }}>
              {myMonthlyGoal.progress}%
            </div>
          </TiltWrapper>

          {/* 📋 左下(2)：リスト別ステータス (ハム・エイリアン色) */}
          <TiltWrapper title="LIST STATUS" icon="👽" borderColor="#10b981">
            <div className="list-stats-container">
              {listStats.map((list, i) => (
                <div key={i} className="list-item">
                  <div className="list-item-header">
                    <span>{list.name}</span>
                    <span style={{ color: list.color, fontVariantNumeric:"tabular-nums" }}>{list.count} / {list.target}</span>
                  </div>
                  <div className="list-bar-bg">
                    <div className="list-bar-fill" style={{ width: `${Math.min(100, (list.count/list.target)*100)}%`, backgroundColor: list.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </TiltWrapper>

        </div>
      </div>
    </div>
  );
}