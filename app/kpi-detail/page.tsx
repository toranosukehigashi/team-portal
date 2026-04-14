"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function KpiDetail() {
  const router = useRouter();

  // ダミーデータ
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

  return (
    <div className="detail-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        .detail-wrapper {
          min-height: 100vh;
          background: #f8fafc;
          padding: 40px 20px;
          font-family: 'Inter', 'Noto Sans JP', sans-serif;
        }
        .container { max-width: 1000px; margin: 0 auto; }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
        .btn-back { padding: 10px 20px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; font-weight: 800; color: #64748b; cursor: pointer; transition: 0.2s; }
        .btn-back:hover { background: #f1f5f9; }

        .dashboard-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 30px; }
        @media (max-width: 800px) { .dashboard-grid { grid-template-columns: 1fr; } }

        .glass-panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .panel-title { font-size: 20px; font-weight: 900; color: #1e293b; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }

        /* ランキングボード */
        .ranking-list { display: flex; flex-direction: column; gap: 16px; }
        .rank-card { display: flex; align-items: center; padding: 16px 20px; background: #f8fafc; border-radius: 16px; border: 1px solid #f1f5f9; transition: 0.3s; }
        .rank-card:hover { transform: scale(1.02); box-shadow: 0 10px 20px rgba(0,0,0,0.02); }
        .rank-num { width: 40px; font-size: 24px; font-weight: 900; color: #94a3b8; }
        .rank-1 .rank-num { color: #f59e0b; }
        .rank-name { flex: 1; font-weight: 800; color: #334155; font-size: 16px; }
        .rank-count { font-size: 20px; font-weight: 900; color: #4f46e5; }
        .rank-unit { font-size: 12px; color: #64748b; margin-left: 4px; }

        /* 個人の目標管理 */
        .goal-container { text-align: center; padding: 20px 0; }
        .circular-progress { width: 180px; height: 180px; border-radius: 50%; background: conic-gradient(#4f46e5 ${myGoal.progress}%, #f1f5f9 0); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; position: relative; }
        .circular-progress::after { content: ""; position: absolute; width: 140px; height: 140px; background: #fff; border-radius: 50%; }
        .progress-text { position: relative; z-index: 1; display: flex; flex-direction: column; }
        .percent { font-size: 32px; font-weight: 900; color: #1e293b; }
        .goal-nums { font-size: 16px; font-weight: 800; color: #64748b; margin-top: 10px; }
      `}} />

      <div className="container">
        <header className="header">
          <button className="btn-back" onClick={() => router.push("/")}>← ダッシュボードへ戻る</button>
          <h1 style={{ fontWeight: 900, color: "#1e293b" }}>獲得進捗分析</h1>
        </header>

        <div className="dashboard-grid">
          {/* 目標管理ウィジェット */}
          <section className="glass-panel">
            <h2 className="panel-title">🎯 個人目標達成率</h2>
            <div className="goal-container">
              <div className="circular-progress">
                <div className="progress-text">
                  <span className="percent">{myGoal.progress}%</span>
                </div>
              </div>
              <div className="goal-nums">
                現在 <span style={{color: "#4f46e5", fontSize: "24px"}}>{myGoal.current}</span> / 目標 {myGoal.target} 件
              </div>
              <p style={{fontSize: "13px", color: "#94a3b8", marginTop: "15px"}}>目標達成まであと 3件 です。頑張りましょう！</p>
            </div>
          </section>

          {/* ランキングボード */}
          <section className="glass-panel">
            <h2 className="panel-title">🏆 チームランキング (本日)</h2>
            <div className="ranking-list">
              {ranking.map((user) => (
                <div key={user.rank} className={`rank-card rank-${user.rank}`}>
                  <span className="rank-num">{user.rank}</span>
                  <span className="rank-name">{user.name}</span>
                  <span className="rank-count">{user.count}<span className="rank-unit">件</span></span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}