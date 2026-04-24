"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// 💡 高品質なSVGアイコン
const Icons = {
  Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Filter: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Download: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Sync: () => <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
};

export default function SheetsDashboard() {
  const { data, error, isValidating } = useSWR("/api/sheets-data", fetcher, {
    refreshInterval: 7000,
    revalidateOnFocus: true,
  });

  if (error) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-200 font-bold shadow-sm">
        通信エラーが発生しました 😭 リロードをお試しください。
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-blue-200">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-inner">
              <span className="text-white font-black text-sm">TP</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Team Portal Feed</h1>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold tracking-widest uppercase ml-2 border border-slate-200">
              Workspace
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              {isValidating ? (
                <span className="flex items-center gap-1.5 text-blue-500 text-[11px] font-bold bg-blue-50 px-2.5 py-1 rounded-full">
                  <Icons.Sync /> Syncing...
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live (7s)
                </span>
              )}
            </div>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 border-2 border-white shadow-sm"></div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500">
              <Icons.Search />
            </div>
            <input 
              type="text" 
              placeholder="Search records..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64 shadow-sm"
              disabled
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50">
              <Icons.Filter /> Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50">
              <Icons.Download /> Export
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-sm border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">獲得時間</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">メールアドレス</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">電話番号</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">プラン名</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">シンプル割</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">重説</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!data ? (
                  Array(10).fill(0).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="py-5 px-6"><div className="h-3 bg-slate-200 rounded w-24"></div></td>
                      <td className="py-5 px-6"><div className="h-4 bg-slate-200 rounded w-48"></div></td>
                      <td className="py-5 px-6"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
                      <td className="py-5 px-6"><div className="h-5 bg-slate-200 rounded w-16"></div></td>
                      <td className="py-5 px-6 flex justify-center"><div className="h-5 bg-slate-200 rounded-full w-16"></div></td>
                      <td className="py-5 px-6"><div className="h-5 bg-slate-200 rounded-full w-12 mx-auto"></div></td>
                    </tr>
                  ))
                ) : (
                  data.map((row: any, index: number) => (
                    <tr key={index} className="group hover:bg-blue-50/40 transition-all duration-200 relative">
                      <td className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></td>
                      
                      <td className="py-4 px-6 text-[11px] text-slate-400 font-medium whitespace-nowrap">
                        {row.timestamp}
                      </td>
                      <td className="py-4 px-6 text-[13px] font-semibold text-slate-800">
                        {row.email}
                      </td>
                      <td className="py-4 px-6 text-[13px] text-slate-500 font-mono">
                        {row.phone}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wide">
                          {row.plan || "---"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {/* 💡 ここをご指定通り「確認しました」に変更しました！ */}
                        {row.simpleWari === "確認しました" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                            確認しました
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-medium italic">未確認</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black shadow-sm ${
                          row.jusetsu === "はい" 
                          ? "bg-indigo-50 text-indigo-600 border border-indigo-200" 
                          : "bg-slate-50 text-slate-400 border border-slate-200"
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
        </div>
      </main>
    </div>
  );
}