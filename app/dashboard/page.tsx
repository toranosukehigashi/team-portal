"use client";

import useSWR from "swr";
import { useState, useRef } from "react";

const MASTER_SHEET_ID = "1gXTpTFfp5f5I83P0FVbJbzX-bEsvgLY_DpNl6YDo9-w";

const SHEET_CONFIGS = [
  { 
    name: "シンプル獲得（侍、その他）", 
    id: MASTER_SHEET_ID, 
    range: "シンプル獲得（じげん、侍）!A2:F",
    cols: ["獲得時間", "メールアドレス", "電話番号", "プラン", "シンプル割", "重説"]
  },
  { 
    name: "名古屋同意", 
    id: MASTER_SHEET_ID, 
    range: "名古屋オフィス同意!A2:E",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "プラン", "重説"]
  },
  { 
    name: "名古屋FF同意", 
    id: MASTER_SHEET_ID, 
    range: "名古屋オフィスFF同意!A2:E",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "プラン", "重説"]
  },
  { 
    name: "電気ガスセット割", 
    id: MASTER_SHEET_ID, 
    range: "電気ガスセット割!A2:F",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "プラン", "ガスセット割", "重説"]
  },
  { 
    name: "グリーン デンワde割", 
    id: MASTER_SHEET_ID, 
    range: "グリーン　デンワde割!A2:E",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "重説", "サクッと割"]
  },
  { 
    name: "フォーム回答1", 
    id: MASTER_SHEET_ID, 
    range: "フォームの回答１!A2:E",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "プラン", "重説"]
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
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? "bg-[#020617] text-white" : "bg-[#f0fdf4] text-slate-900"}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        .analytics-panel {
          background: ${isDarkMode ? "rgba(15, 23, 42, 0.7)" : "rgba(255, 255, 255, 0.7)"};
          backdrop-filter: blur(20px);
          border: 1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.8)"};
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
        }
        .tab-scroll::-webkit-scrollbar { display: none; }
        .tab-active { 
          background: linear-gradient(135deg, #10b981, #059669);
          color: white !important;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
      `}} />

      <div className="max-w-[1500px] mx-auto p-4 md:p-8">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-4xl font-black tracking-tighter ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>Multi Feed Analytics.</h1>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="px-4 py-2 rounded-full border border-emerald-500/30 text-[10px] font-black tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
            >
              {isDarkMode ? "☀️ LIGHT" : "🌙 DARK"}
            </button>
          </div>
          
          <div className="analytics-panel p-1.5 rounded-2xl w-full overflow-x-auto tab-scroll mb-8">
            <div className="flex gap-1.5 min-w-max">
              {SHEET_CONFIGS.map((sheet) => (
                <button
                  key={sheet.name}
                  onClick={() => setActiveSheet(sheet)}
                  className={`px-6 py-2.5 rounded-xl text-[11px] font-black transition-all duration-300 ${
                    activeSheet.name === sheet.name ? "tab-active" : "text-slate-500 hover:bg-emerald-500/10"
                  }`}
                >
                  {sheet.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="analytics-panel p-6 rounded-3xl">
              <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-1">Sheet Active</p>
              <p className="text-xl font-black">{activeSheet.name}</p>
            </div>
            <div className="bg-emerald-600 p-6 rounded-3xl shadow-xl text-white md:col-span-2 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest mb-1">Live Status</p>
                <p className="text-xl font-bold flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full bg-white ${isValidating ? "animate-ping" : "opacity-50"}`}></span>
                  {isValidating ? "📡 Syncing Latest Data..." : "✅ System Standby"}
                </p>
              </div>
              <button onClick={scrollToBottom} className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-[11px] font-black transition-all">
                ⬇️ BOTTOM JUMP
              </button>
            </div>
          </div>
        </header>

        {error ? (
          <div className="analytics-panel p-20 text-center rounded-[3rem]">
            <p className="text-red-500 font-black text-2xl mb-2">😭 読み込みエラー</p>
            <p className="text-slate-400 font-bold">{error.message}</p>
          </div>
        ) : (
          <main className="analytics-panel rounded-[2.5rem] overflow-hidden relative">
            <div ref={scrollContainerRef} className="overflow-x-auto max-h-[60vh] overflow-y-auto scroll-smooth custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className={`sticky top-0 z-10 border-b ${isDarkMode ? "bg-slate-900/90 border-slate-700" : "bg-emerald-50/90 border-emerald-100"}`}>
                  <tr>
                    {activeSheet.cols.map((col) => (
                      <th key={col} className={`py-6 px-8 text-[10px] font-black uppercase tracking-widest ${isDarkMode ? "text-emerald-400/60" : "text-emerald-700/60"} ${col.includes("割") || col.includes("重説") ? "text-center" : ""}`}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-slate-800" : "divide-emerald-50"}`}>
                  {!data ? (
                    <tr><td colSpan={activeSheet.cols.length} className="p-20 text-center animate-pulse text-emerald-500 font-black tracking-widest">LOADING...</td></tr>
                  ) : data.length === 0 ? (
                    <tr><td colSpan={activeSheet.cols.length} className="p-20 text-center text-slate-400 font-bold">データが見つかりません</td></tr>
                  ) : (
                    data.map((row: any, index: number) => (
                      <tr key={index} className={`group hover:bg-emerald-500/5 transition-colors ${index % 2 !== 0 ? (isDarkMode ? 'bg-slate-800/30' : 'bg-emerald-50/20') : ''}`}>
                        
                        <td className="relative py-4 px-8 text-[11px] font-mono opacity-60">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          {row.timestamp}
                        </td>

                        <td className="py-4 px-8 text-[13px] font-bold">{row.email}</td>
                        <td className="py-4 px-8 text-[13px] font-mono text-slate-500">{row.phone || "---"}</td>

                        {activeSheet.cols.includes("プラン") && (
                          <td className="py-4 px-8">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-black border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-emerald-100 text-emerald-700"}`}>
                              {row.plan || "---"}
                            </span>
                          </td>
                        )}

                        {activeSheet.cols.includes("シンプル割") && (
                          <td className="py-4 px-8 text-center">
                            {row.simpleWari === "確認しました" ? 
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-200">確認済み</span> : 
                              <span className="text-slate-300 text-[10px]">---</span>}
                          </td>
                        )}

                        {activeSheet.cols.includes("ガスセット割") && (
                          <td className="py-4 px-8 text-center">
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-[10px] font-black rounded-full border border-orange-200">
                              {row.gasSet || "---"}
                            </span>
                          </td>
                        )}

                        {activeSheet.cols.includes("重説") && (
                          <td className="py-4 px-8 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black ${row.jusetsu === "はい" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                              {row.jusetsu || "---"}
                            </span>
                          </td>
                        )}

                        {activeSheet.cols.includes("サクッと割") && (
                          <td className="py-4 px-8 text-center">
                            <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-[10px] font-black rounded-full border border-cyan-200">
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
      
      <button onClick={scrollToBottom} className="fixed bottom-10 right-10 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <span className="text-xl group-hover:animate-bounce">↓</span>
      </button>
    </div>
  );
}