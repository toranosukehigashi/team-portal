"use client";

import useSWR from "swr";
import { useState, useRef } from "react";

const MASTER_SHEET_ID = "1gXTpTFfp5f5I83P0FVbJbzX-bEsvgLY_DpNl6YDo9-w";

const SHEET_CONFIGS = [
  { 
    name: "シンプル獲得（侍、その他）", id: MASTER_SHEET_ID, range: "シンプル獲得（じげん、侍）!A2:F",
    cols: ["獲得時間", "メールアドレス", "電話番号", "プラン", "シンプル割", "重説"],
    theme: { primary: "#3b82f6", light: "rgba(59, 130, 246, 0.1)", ambient: "#eff6ff", darkAmbient: "#082f49", shadow: "rgba(59, 130, 246, 0.4)", name: "Blue" }
  },
  { 
    name: "名古屋同意", id: MASTER_SHEET_ID, range: "名古屋オフィス同意!A2:E",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "プラン", "重説"],
    theme: { primary: "#8b5cf6", light: "rgba(139, 92, 246, 0.1)", ambient: "#f5f3ff", darkAmbient: "#2e1065", shadow: "rgba(139, 92, 246, 0.4)", name: "Violet" }
  },
  { 
    name: "名古屋FF同意", id: MASTER_SHEET_ID, range: "名古屋オフィスFF同意!A2:E",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "プラン", "重説"],
    theme: { primary: "#d946ef", light: "rgba(217, 70, 239, 0.1)", ambient: "#fdf4ff", darkAmbient: "#4a044e", shadow: "rgba(217, 70, 239, 0.4)", name: "Fuchsia" }
  },
  { 
    name: "電気ガスセット割", id: MASTER_SHEET_ID, range: "電気ガスセット割!A2:F",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "プラン", "ガスセット割", "重説"],
    theme: { primary: "#f59e0b", light: "rgba(245, 158, 11, 0.1)", ambient: "#fffbeb", darkAmbient: "#451a03", shadow: "rgba(245, 158, 11, 0.4)", name: "Amber" }
  },
  { 
    name: "デンワde割", id: MASTER_SHEET_ID, range: "グリーン　デンワde割!A2:E",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "重説", "サクッと割"],
    theme: { primary: "#10b981", light: "rgba(16, 185, 129, 0.1)", ambient: "#ecfdf5", darkAmbient: "#022c22", shadow: "rgba(16, 185, 129, 0.4)", name: "Emerald" }
  },
  // 🚀 変更：フォーム回答1 を 「空室通電」へ
  { 
    name: "空室通電", id: MASTER_SHEET_ID, range: "空室通電!A2:E",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "プラン", "重説"],
    theme: { primary: "#f43f5e", light: "rgba(244, 63, 94, 0.1)", ambient: "#fff1f2", darkAmbient: "#4c0519", shadow: "rgba(244, 63, 94, 0.4)", name: "Rose" }
  }
];

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
};

const SyncIcon = () => (
  <svg className="w-4 h-4 animate-spin drop-shadow-md" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--theme-primary)' }}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 30" strokeLinecap="round" opacity="0.8" />
  </svg>
);

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
    <div 
      style={{
        '--theme-primary': activeSheet.theme.primary,
        '--theme-light': activeSheet.theme.light,
        '--theme-ambient': isDarkMode ? activeSheet.theme.darkAmbient : activeSheet.theme.ambient,
        '--theme-shadow': activeSheet.theme.shadow,
      } as React.CSSProperties}
      className={`min-h-screen font-sans transition-all duration-1000 relative overflow-hidden ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: var(--theme-ambient); transition: background-color 1s cubic-bezier(0.4, 0, 0.2, 1); }
        .cyber-grid {
          position: fixed; inset: 0; z-index: -2;
          background-image: ${isDarkMode ? `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0v40M0 40h40' stroke='rgba(255,255,255,0.03)' stroke-width='1' fill='none'/%3E%3C/svg%3E")` : `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0v40M0 40h40' stroke='rgba(0,0,0,0.03)' stroke-width='1' fill='none'/%3E%3C/svg%3E")`};
          mask-image: radial-gradient(ellipse at 50% 30%, black 10%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at 50% 30%, black 10%, transparent 80%);
          animation: grid-float 20s linear infinite;
        }
        @keyframes grid-float { 0% { transform: translateY(0); } 100% { transform: translateY(40px); } }

        .aurora-blob {
          position: fixed; width: 60vw; height: 60vw; border-radius: 50%;
          background: var(--theme-primary); filter: blur(150px);
          opacity: ${isDarkMode ? 0.15 : 0.08}; z-index: -1;
          animation: aurora-drift 15s ease-in-out infinite alternate; pointer-events: none;
        }
        .blob-1 { top: -20%; left: -10%; }
        .blob-2 { bottom: -20%; right: -10%; animation-delay: -5s; }
        @keyframes aurora-drift { 0% { transform: scale(1) translate(0, 0); } 100% { transform: scale(1.2) translate(5%, 5%); } }

        .saas-card {
          background: ${isDarkMode ? "rgba(15, 23, 42, 0.4)" : "rgba(255, 255, 255, 0.5)"};
          backdrop-filter: blur(24px) saturate(150%);
          -webkit-backdrop-filter: blur(24px) saturate(150%);
          border: 1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.8)"};
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }
        .saas-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px var(--theme-light); }

        .tab-container { display: flex; gap: 8px; overflow-x: auto; padding: 6px; }
        .tab-container::-webkit-scrollbar { display: none; }
        .tab-pill {
          position: relative; padding: 12px 24px; border-radius: 100px; font-weight: 800; font-size: 13px;
          color: ${isDarkMode ? "#cbd5e1" : "#64748b"}; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent; border: 1px solid transparent; white-space: nowrap; cursor: pointer;
        }
        .tab-pill::before {
          content: ''; position: absolute; inset: 0; border-radius: 100px;
          background: var(--theme-primary); opacity: 0; transform: scale(0.9); transition: all 0.4s ease; z-index: -1;
        }
        .tab-pill:hover { color: ${isDarkMode ? "#fff" : "#0f172a"}; background: ${isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"}; }
        .tab-pill.active { color: #fff; box-shadow: 0 8px 20px var(--theme-shadow); transform: translateY(-2px); border-color: rgba(255,255,255,0.2); }
        .tab-pill.active::before { opacity: 1; transform: scale(1); }

        .table-row { transition: all 0.2s ease; border-bottom: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}; }
        .row-odd { background: ${isDarkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.4)"}; }
        .row-even { background: transparent; }
        .table-row:hover { background: var(--theme-light) !important; transform: scale(1.002); }
        .row-indicator { position: absolute; left: 0; top: 4px; bottom: 4px; width: 3px; border-radius: 0 4px 4px 0; background: var(--theme-primary); transform: scaleY(0); transition: transform 0.2s ease; opacity: 0; }
        .table-row:hover .row-indicator { transform: scaleY(1); opacity: 1; }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--theme-primary); border-radius: 10px; opacity: 0.3; }
      `}} />

      <div className="cyber-grid" />
      <div className="aurora-blob blob-1" />
      <div className="aurora-blob blob-2" />

      <div className="max-w-[1500px] mx-auto p-4 md:p-8 relative z-10">
        <header className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-md text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-md" style={{ color: 'var(--theme-primary)', background: 'var(--theme-light)' }}>
                  Workspace
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-50">Data Console</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-sm">
                Growth <span style={{ color: 'var(--theme-primary)' }}>Matrix.</span>
              </h1>
            </div>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="saas-card px-6 py-3 rounded-full text-[11px] font-black tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              {isDarkMode ? "☀️ SWITCH TO LIGHT" : "🌙 SWITCH TO DARK"}
            </button>
          </div>
          
          <div className="saas-card rounded-[2rem] p-2 mb-8">
            <div className="tab-container">
              {SHEET_CONFIGS.map((sheet) => (
                <button
                  key={sheet.name}
                  onClick={() => setActiveSheet(sheet)}
                  className={`tab-pill ${activeSheet.name === sheet.name ? "active" : ""}`}
                >
                  {sheet.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="saas-card p-6 rounded-[2rem] flex flex-col justify-center">
              <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1">Active Pipeline</p>
              <p className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, var(--theme-primary), ${isDarkMode ? '#fff' : '#000'})` }}>
                {activeSheet.name}
              </p>
            </div>
            <div className="saas-card p-6 rounded-[2rem] md:col-span-2 flex justify-between items-center relative overflow-hidden group">
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--theme-light)', color: 'var(--theme-primary)' }}>
                  {isValidating ? <SyncIcon /> : <span className="text-xl">⚡️</span>}
                </div>
                <div>
                  <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1">System Engine</p>
                  <p className="text-xl font-bold flex items-center gap-2">
                    {isValidating ? <span style={{ color: 'var(--theme-primary)' }}>Synchronizing...</span> : <span>Live Active</span>}
                  </p>
                </div>
              </div>
              <button onClick={scrollToBottom} className="relative z-10 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md px-6 py-3 rounded-xl text-[11px] font-black transition-all hover:scale-105 active:scale-95 shadow-sm">
                ↓ Scroll Bottom
              </button>
            </div>
          </div>
        </header>

        {error ? (
          <div className="saas-card p-24 text-center rounded-[3rem] border-red-500/20" style={{ background: isDarkMode ? 'rgba(239, 68, 68, 0.05)' : 'rgba(254, 242, 242, 0.8)' }}>
            <p className="text-red-500 font-black text-3xl mb-4">Connection Failed</p>
            <p className="opacity-70 font-medium">{error.message}</p>
          </div>
        ) : (
          <main className="saas-card rounded-[2.5rem] overflow-hidden relative z-10">
            <div ref={scrollContainerRef} className="overflow-x-auto max-h-[65vh] overflow-y-auto scroll-smooth custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className={`sticky top-0 z-20 backdrop-blur-3xl border-b ${isDarkMode ? "bg-slate-900/90 border-slate-700/50" : "bg-white/90 border-slate-200/50"}`}>
                  <tr>
                    {activeSheet.cols.map((col) => (
                      <th key={col} className="py-6 px-8 text-[10px] font-black uppercase tracking-widest opacity-50">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!data ? (
                    Array(10).fill(0).map((_, i) => (
                      <tr key={`skeleton-${i}`} className={`animate-pulse ${i % 2 !== 0 ? 'row-odd' : 'row-even'}`}>
                        <td className="py-6 px-8"><div className="h-3 rounded-full w-24" style={{ backgroundColor: 'var(--theme-light)' }}></div></td>
                        <td className="py-6 px-8"><div className="h-4 rounded-full w-48 bg-slate-300/30"></div></td>
                        <td className="py-6 px-8"><div className="h-4 rounded-full w-28 bg-slate-300/30"></div></td>
                        <td className="py-6 px-8"><div className="h-5 rounded-md w-16 bg-slate-300/30"></div></td>
                        <td colSpan={2}></td>
                      </tr>
                    ))
                  ) : data.length === 0 ? (
                    <tr><td colSpan={activeSheet.cols.length} className="p-32 text-center opacity-40 font-bold text-lg tracking-widest">NO RECORDS.</td></tr>
                  ) : (
                    data.map((row: any, index: number) => (
                      <tr key={index} className={`table-row relative group ${index % 2 !== 0 ? 'row-odd' : 'row-even'}`}>
                        
                        <td className="relative py-5 px-8 text-[11px] font-mono opacity-50 whitespace-nowrap">
                          <div className="row-indicator"></div>
                          {row.timestamp}
                        </td>

                        <td className="py-5 px-8 text-[13px] font-bold">{row.email}</td>
                        
                        {activeSheet.cols.includes("電話番号") && (
                          <td className="py-5 px-8 text-[13px] font-mono opacity-60 whitespace-nowrap">{row.phone || "---"}</td>
                        )}

                        {activeSheet.cols.includes("プラン") && (
                          <td className="py-5 px-8 whitespace-nowrap">
                            <span className="px-3 py-1.5 rounded-lg text-[10px] font-black border shadow-sm uppercase tracking-widest" style={{ borderColor: 'var(--theme-light)', color: 'var(--theme-primary)', background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.8)' }}>
                              {row.plan || "---"}
                            </span>
                          </td>
                        )}

                        {activeSheet.cols.includes("シンプル割") && (
                          <td className="py-5 px-8">
                            {row.simpleWari === "確認しました" ? 
                              <span className="px-4 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-full border border-blue-500/20 backdrop-blur-sm whitespace-nowrap">✔️ 確認済</span> : 
                              <span className="opacity-30 text-[10px] font-bold">---</span>}
                          </td>
                        )}

                        {activeSheet.cols.includes("ガスセット割") && (
                          <td className="py-5 px-8 whitespace-nowrap">
                            <span className="px-4 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black rounded-full border border-amber-500/20 backdrop-blur-sm">
                              {row.gasSet || "---"}
                            </span>
                          </td>
                        )}

                        {activeSheet.cols.includes("重説") && (
                          <td className="py-5 px-8 whitespace-nowrap">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border backdrop-blur-sm ${row.jusetsu === "はい" ? "shadow-lg bg-slate-800 border-slate-700 text-white dark:bg-white dark:border-slate-200 dark:text-slate-900" : "bg-transparent border-slate-300/30 opacity-50"}`}>
                              {row.jusetsu || "---"}
                            </span>
                          </td>
                        )}

                        {activeSheet.cols.includes("サクッと割") && (
                          <td className="py-5 px-8 whitespace-nowrap">
                            <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-full border border-emerald-500/20 backdrop-blur-sm">
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
      
      <button 
        onClick={scrollToBottom} 
        style={{ backgroundColor: 'var(--theme-primary)', boxShadow: '0 12px 30px var(--theme-shadow)' }}
        className="fixed bottom-10 right-10 w-14 h-14 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-300 z-50 group border border-white/20 backdrop-blur-md"
      >
        <svg className="w-6 h-6 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
      </button>
    </div>
  );
}