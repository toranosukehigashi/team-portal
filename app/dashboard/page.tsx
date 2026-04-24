"use client";

import useSWR from "swr";
import { useState, useRef } from "react";

const SHEET_CONFIGS = [
  { 
    name: "標準獲得", 
    id: "1_YibJDSTzg7erVehfAE_ShuM3LY7PgNyN1KEMICdJK0", 
    range: "シンプル獲得（じげん、侍）!A2:F",
    cols: ["獲得時間", "メールアドレス", "電話番号", "プラン", "シンプル割", "重説"]
  },
  { 
    name: "名古屋オフィス同意", 
    id: "1_YibJDSTzg7erVehfAE_ShuM3LY7PgNyN1KEMICdJK0", 
    range: "名古屋オフィス同意!A2:E",
    cols: ["タイムスタンプ", "メールアドレス", "電話番号", "プラン", "重説"]
  }
];

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  if (!Array.isArray(data)) throw new Error("データの形式が不正です");
  return data;
};

export default function SheetsDashboard() {
  const [activeSheet, setActiveSheet] = useState(SHEET_CONFIGS[0]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 🚀 修正：日本語やカッコでクラッシュしないように「encodeURIComponent」で翻訳してAPIに渡す！！
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

  if (error) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="bg-red-50 text-red-600 px-8 py-6 rounded-2xl border border-red-200 shadow-lg text-center">
        <p className="font-black text-xl mb-2">通信エラーが発生しました 😭</p>
        <p className="font-bold text-sm opacity-80">理由: {error.message}</p>
        <p className="text-xs mt-4 text-slate-500">APIコードの更新忘れや、タブ名の誤字がないか確認してください！</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 md:p-8 relative">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-black tracking-tighter mb-6">Multi Feed Analytics.</h1>
          
          <div className="flex gap-2 p-1.5 bg-slate-200/50 backdrop-blur-md rounded-2xl w-fit mb-8">
            {SHEET_CONFIGS.map((sheet) => (
              <button
                key={sheet.name}
                onClick={() => setActiveSheet(sheet)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300 ${
                  activeSheet.name === sheet.name ? "bg-white text-blue-600 shadow-sm scale-100" : "text-slate-500 hover:text-slate-700 scale-95 opacity-70"
                }`}
              >
                {sheet.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sheet Active</p>
              <p className="text-xl font-black text-slate-800">{activeSheet.name}</p>
            </div>
            <div className="bg-blue-600 p-6 rounded-3xl shadow-xl text-white md:col-span-2 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Live Status</p>
                <p className="text-xl font-bold">{isValidating ? "📡 Syncing Latest..." : "✅ System Standby"}</p>
              </div>
              <button onClick={scrollToBottom} className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-xs font-black transition-all">
                ⬇️ 一番下へジャンプ
              </button>
            </div>
          </div>
        </header>

        <main className="bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
          <div ref={scrollContainerRef} className="overflow-x-auto max-h-[60vh] overflow-y-auto scroll-smooth custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                <tr>
                  {activeSheet.cols.map((col) => (
                    <th key={col} className={`py-6 px-8 text-[11px] font-black text-slate-500 uppercase tracking-widest ${col.includes("割") || col.includes("重説") ? "text-center" : ""}`}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!data ? (
                  <tr><td colSpan={activeSheet.cols.length} className="p-20 text-center animate-pulse text-slate-400">Loading {activeSheet.name}...</td></tr>
                ) : (
                  data.map((row: any, index: number) => (
                    <tr key={index} className={`group ${index % 2 !== 0 ? 'bg-slate-50/50' : 'bg-white'} hover:bg-blue-50/80 transition-colors`}>
                      <td className="py-4 px-8 text-[11px] text-slate-400 font-mono">{row.timestamp}</td>
                      <td className="py-4 px-8 text-[14px] font-bold text-slate-800">{row.email}</td>
                      <td className="py-4 px-8 text-[13px] text-slate-600 font-mono">{row.phone}</td>
                      <td className="py-4 px-8"><span className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-black text-slate-500 uppercase">{row.plan || "---"}</span></td>
                      {activeSheet.cols.includes("シンプル割") && (
                        <td className="py-4 px-8 text-center">{row.simpleWari === "確認しました" ? <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-200">確認しました</span> : <span className="text-slate-300 text-[10px]">---</span>}</td>
                      )}
                      <td className="py-4 px-8 text-center"><span className={`px-3 py-1 rounded-full text-[10px] font-black ${row.jusetsu === "はい" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>{row.jusetsu || "---"}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <button onClick={scrollToBottom} className="fixed bottom-10 right-10 w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"><span className="text-xl group-hover:animate-bounce">↓</span></button>
    </div>
  );
}