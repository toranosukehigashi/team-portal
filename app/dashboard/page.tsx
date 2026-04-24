"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// 💡 洗練されたアニメーション付きアイコン
const Icons = {
  Pulse: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="animate-pulse">
      <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.4" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>
  ),
  Sync: () => (
    <svg width="14" height="14" className="animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
};

export default function SheetsDashboard() {
  const { data, error, isValidating } = useSWR("/api/sheets-data", fetcher, {
    refreshInterval: 7000,
    revalidateOnFocus: true,
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (error) return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <div className="bg-red-500/10 text-red-400 px-8 py-6 rounded-2xl border border-red-500/20 backdrop-blur-md">
        <p className="font-bold tracking-widest text-sm">SYSTEM ERROR_</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7f9] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-[#f4f7f9] to-slate-100 text-slate-800 font-sans selection:bg-blue-600 selection:text-white p-4 md:p-8 overflow-hidden relative">
      
      {/* 💡 アンビエント・グロウ（深度表現） */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-400/10 blur-[120px] pointer-events-none"></div>

      <div className={`max-w-[1400px] mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* 💡 ヘッダー（Bento UI） */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="px-2.5 py-1 rounded-md bg-blue-600/10 border border-blue-600/20 text-blue-600 text-[10px] font-black tracking-[0.2em] uppercase">
                Acquisition Data
              </div>
              <div className={`flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors duration-500 ${isValidating ? 'text-blue-500' : 'text-emerald-500'}`}>
                {isValidating ? <Icons.Sync /> : <Icons.Pulse />}
                {isValidating ? 'Syncing...' : 'Live System'}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">
              Team Portal Feed.
            </h1>
          </div>

          {data && (
            <div className="flex gap-4">
              <div className="bg-white/60 backdrop-blur-xl border border-white rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-w-[140px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Records</p>
                <p className="text-2xl font-black text-slate-800">{data.length}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-xl border border-white rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-w-[140px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Latest Update</p>
                <p className="text-sm font-bold text-slate-800 mt-1.5">{data[data.length - 1]?.timestamp.split(' ')[1] || "---"}</p>
              </div>
            </div>
          )}
        </header>

        {/* 💡 ここの <main> が閉じていなかったのを完全に修正しました！！ */}
        <main className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto max-h-[calc(100vh-280px)] custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
                <tr>
                  <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">獲得時間</th>
                  <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">メールアドレス</th>
                  <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">電話番号</th>
                  <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">プラン</th>
                  <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-center">シンプル割</th>
                  <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-center">重説</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {!data ? (
                  Array(10).fill(0).map((_, i) => (
                    <tr key={`skeleton-${i}`} className={`animate-pulse ${i % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/50'}`}>
                      <td className="py-5 px-6"><div className="h-2.5 bg-slate-200/60 rounded-full w-24"></div></td>
                      <td className="py-5 px-6"><div className="h-3 bg-slate-200/60 rounded-full w-48"></div></td>
                      <td className="py-5 px-6"><div className="h-3 bg-slate-200/60 rounded-full w-28"></div></td>
                      <td className="py-5 px-6"><div className="h-4 bg-slate-200/60 rounded-md w-16"></div></td>
                      <td className="py-5 px-6 flex justify-center"><div className="h-4 bg-slate-200/60 rounded-full w-20"></div></td>
                      <td className="py-5 px-6"><div className="h-4 bg-slate-200/60 rounded-full w-12 mx-auto"></div></td>
                    </tr>
                  ))
                ) : (
                  data.map((row: any, index: number) => (
                    <tr 
                      key={index} 
                      className={`
                        group relative transition-all duration-300 ease-out hover:z-10 cursor-default
                        ${index % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/60'}
                        hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-[2px] hover:scale-[1.002]
                      `}
                      style={{ 
                        animation: `fadeInUp 0.5s ease-out forwards ${index * 0.03}s`,
                        opacity: mounted ? 1 : 0
                      }}
                    >
                      {/* 💡 ホバー時の左端インジケーター */}
                      <td className="absolute left-0 top-1 bottom-1 w-1 bg-blue-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-y-50 group-hover:scale-y-100"></td>
                      
                      <td className="py-4 px-6 text-[11px] text-slate-400 font-mono tracking-tight whitespace-nowrap group-hover:text-blue-500 transition-colors">
                        {row.timestamp}
                      </td>
                      <td className="py-4 px-6 text-[13px] font-bold text-slate-800">
                        {row.email}
                      </td>
                      <td className="py-4 px-6 text-[12px] text-slate-500 font-mono">
                        {row.phone}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black bg-slate-100 text-slate-500 uppercase tracking-wider group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          {row.plan || "---"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {row.simpleWari === "確認しました" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                            確認しました
                          </span>
                        ) : (
                          <span className="text-slate-300 text-[10px] font-bold tracking-wider">---</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black shadow-sm ${
                          row.jusetsu === "はい" 
                          ? "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20" 
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                        }`}>
                          {row.jusetsu || "---"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>

      </div>
    </div>
  );
}