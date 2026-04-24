"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// 💡 エラーの原因になりやすい複雑なSVGアニメを標準化
const Icons = {
  Pulse: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="animate-pulse text-emerald-500">
      <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.4" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>
  ),
  Sync: () => (
    <svg width="14" height="14" className="animate-spin text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
};

export default function SheetsDashboard() {
  const { data, error, isValidating } = useSWR("/api/sheets-data", fetcher, {
    refreshInterval: 7000,
    revalidateOnFocus: true,
  });

  if (error) return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <div className="bg-red-500/10 text-red-400 px-8 py-6 rounded-2xl border border-red-500/20 backdrop-blur-md">
        <p className="font-bold tracking-widest text-sm">通信エラーが発生しました</p>
      </div>
    </div>
  );

  return (
    // 💡 デザインの根幹：背景グラデーションとフォント
    <div className="min-h-screen bg-slate-50 bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 text-slate-800 font-sans p-4 md:p-8">
      
      <div className="max-w-[1400px] mx-auto">
        
        {/* 💡 Bento UI: ヘッダーとデータサマリー */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="px-3 py-1 rounded-md bg-blue-600/10 border border-blue-600/20 text-blue-700 text-[10px] font-black tracking-[0.2em] uppercase">
                Acquisition Data
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-500">
                {isValidating ? <Icons.Sync /> : <Icons.Pulse />}
                {isValidating ? <span className="text-blue-500">Syncing...</span> : <span className="text-emerald-500">Live System</span>}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Team Portal Feed.
            </h1>
          </div>

          {data && (
            <div className="flex gap-4">
              <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-5 shadow-sm min-w-[150px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Records</p>
                <p className="text-3xl font-black text-slate-800">{data.length}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-5 shadow-sm min-w-[150px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Latest Update</p>
                <p className="text-sm font-bold text-slate-800 mt-2">{data[data.length - 1]?.timestamp.split(' ')[1] || "---"}</p>
              </div>
            </div>
          )}
        </header>

        {/* 💡 メインテーブル（グラスモーフィズム ＆ アクションファースト） */}
        <main className="bg-white/70 backdrop-blur-2xl border border-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto max-h-[70vh]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <tr>
                  <th className="py-5 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">獲得時間</th>
                  <th className="py-5 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">メールアドレス</th>
                  <th className="py-5 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">電話番号</th>
                  <th className="py-5 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">プラン</th>
                  <th className="py-5 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">シンプル割</th>
                  <th className="py-5 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">重説</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!data ? (
                  Array(10).fill(0).map((_, i) => (
                    <tr key={`skeleton-${i}`} className={`animate-pulse ${i % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/50'}`}>
                      <td className="py-5 px-6"><div className="h-3 bg-slate-200 rounded-full w-24"></div></td>
                      <td className="py-5 px-6"><div className="h-4 bg-slate-200 rounded-full w-48"></div></td>
                      <td className="py-5 px-6"><div className="h-4 bg-slate-200 rounded-full w-28"></div></td>
                      <td className="py-5 px-6"><div className="h-5 bg-slate-200 rounded-md w-16"></div></td>
                      <td className="py-5 px-6 flex justify-center"><div className="h-5 bg-slate-200 rounded-full w-20"></div></td>
                      <td className="py-5 px-6"><div className="h-5 bg-slate-200 rounded-full w-12 mx-auto"></div></td>
                    </tr>
                  ))
                ) : (
                  data.map((row: any, index: number) => (
                    <tr 
                      key={index} 
                      // 💡 確実なゼブラ配色 ＆ マイクロインタラクション
                      className={`
                        group relative transition-all duration-200 hover:z-10
                        ${index % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/80'}
                        hover:bg-white hover:shadow-md hover:-translate-y-[1px]
                      `}
                    >
                      {/* 左端のアクセントカラー（ホバー時に出現） */}
                      <td className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></td>
                      
                      <td className="py-4 px-6 text-[11px] text-slate-500 font-mono tracking-tight whitespace-nowrap">
                        {row.timestamp}
                      </td>
                      <td className="py-4 px-6 text-[13px] font-bold text-slate-800">
                        {row.email}
                      </td>
                      <td className="py-4 px-6 text-[12px] text-slate-600 font-mono">
                        {row.phone}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-white border border-slate-200 text-slate-600 uppercase tracking-wider shadow-sm">
                          {row.plan || "---"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {row.simpleWari === "確認しました" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                            確認しました
                          </span>
                        ) : (
                          <span className="text-slate-300 text-[10px] font-bold tracking-wider">---</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black shadow-sm ${
                          row.jusetsu === "はい" 
                          ? "bg-indigo-50 text-indigo-600 border border-indigo-200" 
                          : "bg-white text-slate-400 border border-slate-200"
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