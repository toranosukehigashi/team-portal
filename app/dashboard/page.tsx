"use client";

import useSWR from "swr";
import { useState, useRef, useEffect } from "react";

const MASTER_SHEET_ID = "1gXTpTFfp5f5I83P0FVbJbzX-bEsvgLY_DpNl6YDo9-w";

const SHEET_CONFIGS = [
  { 
    name: "シンプル獲得（侍、その他）", 
    id: MASTER_SHEET_ID, 
    range: "シンプル獲得（じげん、侍）!A2:F",
    cols: ["獲得時間", "メールアドレス", "電話番号", "プラン", "シンプル割", "重説"],
    theme: { primary: "#3b82f6", light: "rgba(59, 130, 246, 0.08)", shadow: "rgba(59, 130, 246, 0.2)", nebula: "#3b82f611", name: "Blue" }
  },
  { 
    name: "名古屋同意", 
    id: MASTER_SHEET_ID, 
    range: "名古屋オフィス同意!A2:E",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "プラン", "重説"],
    theme: { primary: "#8b5cf6", light: "rgba(139, 92, 246, 0.08)", shadow: "rgba(139, 92, 246, 0.2)", nebula: "#8b5cf611", name: "Violet" }
  },
  { 
    name: "名古屋FF同意", 
    id: MASTER_SHEET_ID, 
    range: "名古屋オフィスFF同意!A2:E",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "プラン", "重説"],
    theme: { primary: "#d946ef", light: "rgba(217, 70, 239, 0.08)", shadow: "rgba(217, 70, 239, 0.2)", nebula: "#d946ef11", name: "Fuchsia" }
  },
  { 
    name: "電気ガスセット割", 
    id: MASTER_SHEET_ID, 
    range: "電気ガスセット割!A2:F",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "プラン", "ガスセット割", "重説"],
    theme: { primary: "#f59e0b", light: "rgba(245, 158, 11, 0.08)", shadow: "rgba(245, 158, 11, 0.2)", nebula: "#f59e0b11", name: "Amber" }
  },
  { 
    name: "デンワde割", 
    id: MASTER_SHEET_ID, 
    range: "グリーン　デンワde割!A2:E",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "重説", "サクッと割"],
    theme: { primary: "#10b981", light: "rgba(16, 185, 129, 0.08)", shadow: "rgba(16, 185, 129, 0.2)", nebula: "#10b98111", name: "Emerald" }
  },
  { 
    name: "空室通電", 
    id: MASTER_SHEET_ID, 
    range: "フォームの回答 1!A2:E",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "プラン", "重説"],
    theme: { primary: "#f43f5e", light: "rgba(244, 63, 94, 0.08)", shadow: "rgba(244, 63, 94, 0.2)", nebula: "#f43f5e11", name: "Rose" }
  }
];

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
};

// 💡 背景に漂う光の粒を生成するコンポーネント
const BackgroundParticles = () => {
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; delay: string; size: string }[]>([]);
  useEffect(() => {
    const generated = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      delay: `${Math.random() * 5}s`,
      size: `${Math.random() * 3 + 1}px`
    }));
    setParticles(generated);
  }, []);
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-50">
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full bg-current animate-pulse" style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDelay: p.delay, color: 'var(--theme-nebula)' }} />
      ))}
    </div>
  );
};

export default function SheetsDashboard() {
  const [activeSheet, setActiveSheet] = useState(SHEET_CONFIGS[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data, error, isValidating } = useSWR(
    `/api/sheets-data?id=${activeSheet.id}&range=${encodeURIComponent(activeSheet.range)}`, 
    fetcher, 
    { refreshInterval: 7000 }
  );

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    // 💡 デザインの根幹：相対位置、オーバーフロー非表示、フォント設定
    <div 
      style={{
        '--theme-primary': activeSheet.theme.primary,
        '--theme-light': activeSheet.theme.light,
        '--theme-shadow': activeSheet.theme.shadow,
        '--theme-nebula': activeSheet.theme.nebula,
      } as React.CSSProperties}
      className={`min-h-screen font-sans transition-colors duration-500 relative overflow-hidden ${isDarkMode ? "bg-[#020617] text-slate-100" : "bg-[#f8fafc] text-slate-800"}`}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        /* 🌌 SaaS Immersive 背景デザイン：グリッドとオーロラブラー */
        .immersive-grid {
          position: fixed; inset: 0; z-index: -2;
          background-image: ${isDarkMode ? `radial-gradient(#1e293b 1px, transparent 1px)` : `radial-gradient(#e2e8f0 1px, transparent 1px)`};
          background-size: 24px 24px;
          opacity: 0.8;
        }
        /* 💡 動的な色の霧 */
        .nebula-blob {
          position: fixed; width: 800px; height: 800px; border-radius: 50%;
          filter: blur(160px); z-index: -1; opacity: ${isDarkMode ? 0.3 : 0.4};
          transition: background-color 1s ease, transform 10s ease-in-out infinite alternate;
          pointer-events: none;
        }

        .saas-glass {
          background: ${isDarkMode ? "rgba(15, 23, 42, 0.65)" : "rgba(255, 255, 255, 0.75)"};
          backdrop-filter: blur(30px) saturate(120%);
          -webkit-backdrop-filter: blur(30px) saturate(120%);
          border: 1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 1)"};
          box-shadow: 0 15px 45px ${isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0, 0, 0, 0.04)'};
        }
        .tab-scroll::-webkit-scrollbar { display: none; }
        .tab-btn { position: relative; overflow: hidden; }
        .tab-active { 
          background: var(--theme-primary);
          color: #ffffff !important;
          box-shadow: 0 8px 25px var(--theme-shadow);
          transform: translateY(-2px);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--theme-primary); border-radius: 10px; opacity: 0.5; }
        .hover-row:hover { background-color: ${isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.01)"}; }
        .pulse-dot { box-shadow: 0 0 0 0 var(--theme-primary); animation: pulse-ring 2s infinite cubic-bezier(0.66, 0, 0, 1); }
        @keyframes pulse-ring { 100% { box-shadow: 0 0 0 10px rgba(0,0,0,0); } }
      `}} />

      {/* 🌌 背景レイヤー（グリッド） */}
      <div className="immersive-grid" />
      
      {/* 💡 動的背景レイヤー（オーロラブラー） */}
      <div className="nebula-blob top-[-200px] left-[-200px]" style={{ backgroundColor: 'var(--theme-nebula)' }} />
      <div className="nebula-blob bottom-[-200px] right-[-100px]" style={{ backgroundColor: 'var(--theme-nebula)' }} />
      <div className="nebula-blob top-[30%] left-[40%] width-[400px] height-[400px] opacity-[0.15]" style={{ backgroundColor: 'var(--theme-nebula)' }} />

      {/* ✨ 背景の光の粒 */}
      <BackgroundParticles />

      <div className="max-w-[1500px] mx-auto p-4 md:p-8 relative z-10">
        <header className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-md text-[10px] font-black tracking-[0.2em] uppercase saas-glass" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'var(--theme-primary)', color: 'var(--theme-primary)', background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'var(--theme-light)' }}>
                  Workspace
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Omni-Channel Data Console</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: 'var(--theme-primary)' }}>
                Growth <span className={isDarkMode ? "text-slate-100" : "text-slate-900"}>Matrix.</span>
              </h1>
            </div>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`saas-glass px-5 py-2.5 rounded-full border text-[11px] font-black tracking-widest transition-all ${isDarkMode ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}
            >
              {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
          
          {/* 📱 カスタムテーマ連動型タブ */}
          <div className="saas-glass p-2 rounded-2xl w-full overflow-x-auto tab-scroll mb-8">
            <div className="flex gap-2 min-w-max">
              {SHEET_CONFIGS.map((sheet) => (
                <button
                  key={sheet.name}
                  onClick={() => setActiveSheet(sheet)}
                  className={`tab-btn px-6 py-3 rounded-xl text-[12px] font-bold transition-all duration-300 ${
                    activeSheet.name === sheet.name ? "tab-active" : "text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {sheet.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="saas-glass p-6 rounded-3xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Source</p>
              <p className="text-2xl font-black" style={{ color: 'var(--theme-primary)' }}>{activeSheet.name}</p>
            </div>
            <div className="saas-glass p-6 rounded-3xl md:col-span-2 flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">System Status</p>
                <p className="text-xl font-bold flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full pulse-dot" style={{ backgroundColor: isValidating ? 'var(--theme-primary)' : '#94a3b8' }}></span>
                  {isValidating ? <span style={{ color: 'var(--theme-primary)' }}>Syncing Latest Data...</span> : <span className="text-slate-500">Standby (Live)</span>}
                </p>
              </div>
              <button onClick={scrollToBottom} className="relative z-10 saas-glass hover:bg-white/90 dark:hover:bg-slate-700/90 border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-xl text-[11px] font-black transition-all">
                ⬇️ Bottom
              </button>
            </div>
          </div>
        </header>

        {error ? (
          <div className="saas-glass p-24 text-center rounded-[3rem] border-red-100 dark:border-red-900/30" style={{ backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 242, 242, 0.8)' }}>
            <p className="text-red-500 font-black text-3xl mb-4">Connection Failed</p>
            <p className="text-slate-500 font-medium">{error.message}</p>
          </div>
        ) : (
          <main className="saas-glass rounded-[2.5rem] overflow-hidden relative z-10">
            <div ref={scrollContainerRef} className="overflow-x-auto max-h-[60vh] overflow-y-auto scroll-smooth custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className={`sticky top-0 z-20 backdrop-blur-xl border-b ${isDarkMode ? "bg-slate-950/80 border-slate-800" : "bg-white/80 border-slate-100"}`}>
                  <tr>
                    {activeSheet.cols.map((col) => (
                      <th key={col} className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-slate-800/50" : "divide-slate-50"}`}>
                  {!data ? (
                    // 💡 スケルトンローディングの背景色もテーマに合わせる
                    Array(8).fill(0).map((_, i) => (
                      <tr key={`skeleton-${i}`} className="animate-pulse">
                        <td className="py-5 px-8"><div className="h-3 rounded-full w-24" style={{ backgroundColor: isDarkMode ? 'var(--theme-nebula)' : 'var(--theme-light)' }}></div></td>
                        <td className="py-5 px-8"><div className="h-4 rounded-full w-48 bg-slate-200 dark:bg-slate-700"></div></td>
                        <td className="py-5 px-8"><div className="h-4 rounded-full w-28 bg-slate-200 dark:bg-slate-700"></div></td>
                        <td className="py-5 px-8"><div className="h-5 rounded-md w-16 bg-slate-200 dark:bg-slate-700"></div></td>
                        <td colSpan={2}></td>
                      </tr>
                    ))
                  ) : data.length === 0 ? (
                    <tr><td colSpan={activeSheet.cols.length} className="p-32 text-center text-slate-400 font-bold text-lg">No records found.</td></tr>
                  ) : (
                    data.map((row: any, index: number) => (
                      <tr key={index} className={`group hover-row transition-colors duration-200 ${index % 2 !== 0 ? (isDarkMode ? 'bg-slate-800/10' : 'bg-slate-50/30') : ''}`}>
                        
                        {/* 左端のアクセント＆タイムスタンプ */}
                        <td className="relative py-4 px-8 text-[11px] font-mono text-slate-400">
                          <div className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: 'var(--theme-primary)' }}></div>
                          {row.timestamp}
                        </td>

                        <td className={`py-4 px-8 text-[13px] font-bold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>{row.email}</td>
                        
                        {activeSheet.cols.includes("電話番号") && (
                          <td className="py-4 px-8 text-[13px] font-mono text-slate-500">{row.phone || "---"}</td>
                        )}

                        {activeSheet.cols.includes("プラン") && (
                          <td className="py-4 px-8">
                            <span className={`saas-glass px-2.5 py-1.5 rounded-lg text-[10px] font-black border uppercase tracking-wider ${isDarkMode ? "bg-slate-800/50 border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`}>
                              {row.plan || "---"}
                            </span>
                          </td>
                        )}

                        {activeSheet.cols.includes("シンプル割") && (
                          <td className="py-4 px-8">
                            {row.simpleWari === "確認しました" ? 
                              <span className="px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 text-[10px] font-black rounded-full border border-blue-200 dark:border-blue-900">確認済</span> : 
                              <span className="text-slate-300 text-[10px]">---</span>}
                          </td>
                        )}

                        {activeSheet.cols.includes("ガスセット割") && (
                          <td className="py-4 px-8">
                            <span className="px-3 py-1 bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 text-[10px] font-black rounded-full border border-amber-200 dark:border-amber-900">
                              {row.gasSet || "---"}
                            </span>
                          </td>
                        )}

                        {activeSheet.cols.includes("重説") && (
                          <td className="py-4 px-8">
                            <span className={`saas-glass px-3 py-1 rounded-full text-[10px] font-black ${row.jusetsu === "はい" ? "shadow-md bg-white text-slate-900" : "text-slate-400"}`} style={{ borderColor: row.jusetsu === "はい" ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.1)', background: row.jusetsu === "はい" ? (isDarkMode ? '#f8fafc' : '#ffffff') : (isDarkMode ? '#1e293b' : '#f1f5f9') }}>
                              {row.jusetsu || "---"}
                            </span>
                          </td>
                        )}

                        {activeSheet.cols.includes("サクッと割") && (
                          <td className="py-4 px-8">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 text-[10px] font-black rounded-full border border-emerald-200 dark:border-emerald-900">
                              {row.sakutto || "---"}
                            </span>
                          </td>
                        )}

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </main>
        )}
      </div>
      
      {/* 🚀 フロートボタン */}
      <button 
        onClick={scrollToBottom} 
        style={{ backgroundColor: 'var(--theme-primary)', boxShadow: `0 10px 25px ${isDarkMode ? 'rgba(0,0,0,0.5)' : 'var(--theme-shadow)'}` }}
        className="fixed bottom-10 right-10 w-14 h-14 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
      >
        <span className="text-xl group-hover:animate-bounce">↓</span>
      </button>
    </div>
  );
}