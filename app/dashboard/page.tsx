"use client";

import useSWR from "swr";
import { useState, useRef } from "react";

const MASTER_SHEET_ID = "1gXTpTFfp5f5I83P0FVbJbzX-bEsvgLY_DpNl6YDo9-w";

const SHEET_CONFIGS = [
  { 
    name: "シンプル獲得（侍、その他）", 
    id: MASTER_SHEET_ID, 
    range: "シンプル獲得（じげん、侍）!A2:F",
    cols: ["獲得時間", "メールアドレス", "電話番号", "プラン", "シンプル割", "重説"],
    theme: { primary: "#3b82f6", light: "rgba(59, 130, 246, 0.1)", shadow: "rgba(59, 130, 246, 0.3)", name: "Blue" }
  },
  { 
    name: "名古屋同意", 
    id: MASTER_SHEET_ID, 
    range: "名古屋オフィス同意!A2:E",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "プラン", "重説"],
    theme: { primary: "#8b5cf6", light: "rgba(139, 92, 246, 0.1)", shadow: "rgba(139, 92, 246, 0.3)", name: "Violet" }
  },
  { 
    name: "名古屋FF同意", 
    id: MASTER_SHEET_ID, 
    range: "名古屋オフィスFF同意!A2:E",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "プラン", "重説"],
    theme: { primary: "#d946ef", light: "rgba(217, 70, 239, 0.1)", shadow: "rgba(217, 70, 239, 0.3)", name: "Fuchsia" }
  },
  { 
    name: "電気ガスセット割", 
    id: MASTER_SHEET_ID, 
    range: "電気ガスセット割!A2:F",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "プラン", "ガスセット割", "重説"],
    theme: { primary: "#f59e0b", light: "rgba(245, 158, 11, 0.1)", shadow: "rgba(245, 158, 11, 0.3)", name: "Amber" }
  },
  { 
    name: "デンワde割", 
    id: MASTER_SHEET_ID, 
    range: "グリーン　デンワde割!A2:E",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "重説", "サクッと割"],
    theme: { primary: "#10b981", light: "rgba(16, 185, 129, 0.1)", shadow: "rgba(16, 185, 129, 0.3)", name: "Emerald" }
  },
  { 
    name: "フォーム回答 1", // 画面のボタン表示用
    id: MASTER_SHEET_ID, 
    // 🚀 修正：半角スペースを追加して完全一致させました！
    range: "フォームの回答 1!A2:E",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "プラン", "重説"],
    theme: { primary: "#f43f5e", light: "rgba(244, 63, 94, 0.1)", shadow: "rgba(244, 63, 94, 0.3)", name: "Rose" }
  }
];

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
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
    <div 
      style={{
        '--theme-primary': activeSheet.theme.primary,
        '--theme-light': activeSheet.theme.light,
        '--theme-shadow': activeSheet.theme.shadow,
      } as React.CSSProperties}
      className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? "bg-[#0f172a] text-slate-100" : "bg-[#f8fafc] text-slate-800"}`}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .saas-glass {
          background: ${isDarkMode ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.8)"};
          backdrop-filter: blur(24px);
          border: 1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 1)"};
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
        }
        .tab-scroll::-webkit-scrollbar { display: none; }
        .tab-btn { position: relative; overflow: hidden; }
        .tab-active { 
          background: var(--theme-primary);
          color: #ffffff !important;
          box-shadow: 0 6px 20px var(--theme-shadow);
          transform: translateY(-2px);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--theme-primary); border-radius: 10px; opacity: 0.5; }
        .hover-row:hover { background-color: var(--theme-light); }
        .pulse-dot { box-shadow: 0 0 0 0 var(--theme-primary); animation: pulse-ring 2s infinite cubic-bezier(0.66, 0, 0, 1); }
        @keyframes pulse-ring { 100% { box-shadow: 0 0 0 10px rgba(0,0,0,0); } }
      `}} />

      <div className="max-w-[1500px] mx-auto p-4 md:p-8">
        <header className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-md text-[10px] font-black tracking-[0.2em] uppercase" style={{ backgroundColor: 'var(--theme-light)', color: 'var(--theme-primary)' }}>
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
              className={`px-5 py-2.5 rounded-full border text-[11px] font-black tracking-widest transition-all ${isDarkMode ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-100 text-slate-600"}`}
            >
              {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
          
          <div className="saas-glass p-2 rounded-2xl w-full overflow-x-auto tab-scroll mb-8">
            <div className="flex gap-2 min-w-max">
              {SHEET_CONFIGS.map((sheet) => (
                <button
                  key={sheet.name}
                  onClick={() => setActiveSheet(sheet)}
                  className={`tab-btn px-6 py-3 rounded-xl text-[12px] font-bold transition-all duration-300 ${
                    activeSheet.name === sheet.name ? "tab-active" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
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
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: 'var(--theme-primary)' }}></div>
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">System Status</p>
                <p className="text-xl font-bold flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full pulse-dot" style={{ backgroundColor: isValidating ? 'var(--theme-primary)' : '#94a3b8' }}></span>
                  {isValidating ? <span style={{ color: 'var(--theme-primary)' }}>Syncing Latest Data...</span> : <span className="text-slate-500">Standby (Live)</span>}
                </p>
              </div>
              <button onClick={scrollToBottom} className="relative z-10 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-xl text-[11px] font-black transition-all">
                ⬇️ Bottom
              </button>
            </div>
          </div>
        </header>

        {error ? (
          <div className="saas-glass p-24 text-center rounded-[3rem] border-red-100 dark:border-red-900/30">
            <p className="text-red-500 font-black text-3xl mb-4">Connection Failed</p>
            <p className="text-slate-500 font-medium">{error.message}</p>
          </div>
        ) : (
          <main className="saas-glass rounded-[2.5rem] overflow-hidden relative">
            <div ref={scrollContainerRef} className="overflow-x-auto max-h-[60vh] overflow-y-auto scroll-smooth custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className={`sticky top-0 z-20 backdrop-blur-xl border-b ${isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-100"}`}>
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
                    Array(8).fill(0).map((_, i) => (
                      <tr key={`skeleton-${i}`} className="animate-pulse">
                        <td className="py-5 px-8"><div className="h-3 rounded-full w-24" style={{ backgroundColor: 'var(--theme-light)' }}></div></td>
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
                      <tr key={index} className={`group hover-row transition-colors duration-200 ${index % 2 !== 0 ? (isDarkMode ? 'bg-slate-800/20' : 'bg-slate-50/50') : ''}`}>
                        
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
                            <span className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black border uppercase tracking-wider ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`}>
                              {row.plan || "---"}
                            </span>
                          </td>
                        )}

                        {activeSheet.cols.includes("シンプル割") && (
                          <td className="py-4 px-8">
                            {row.simpleWari === "確認しました" ? 
                              <span className="px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-black rounded-full border border-blue-200 dark:border-blue-800/50">確認済</span> : 
                              <span className="text-slate-300 text-[10px]">---</span>}
                          </td>
                        )}

                        {activeSheet.cols.includes("ガスセット割") && (
                          <td className="py-4 px-8">
                            <span className="px-3 py-1 bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-black rounded-full border border-amber-200 dark:border-amber-800/50">
                              {row.gasSet || "---"}
                            </span>
                          </td>
                        )}

                        {activeSheet.cols.includes("重説") && (
                          <td className="py-4 px-8">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black ${row.jusetsu === "はい" ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-md" : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"}`}>
                              {row.jusetsu || "---"}
                            </span>
                          </td>
                        )}

                        {activeSheet.cols.includes("サクッと割") && (
                          <td className="py-4 px-8">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-black rounded-full border border-emerald-200 dark:border-emerald-800/50">
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
        style={{ backgroundColor: 'var(--theme-primary)', boxShadow: '0 10px 25px var(--theme-shadow)' }}
        className="fixed bottom-10 right-10 w-14 h-14 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
      >
        <span className="text-xl group-hover:animate-bounce">↓</span>
      </button>
    </div>
  );
}