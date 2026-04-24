"use client";

import useSWR from "swr";
import { useState } from "react";

// 💡 データを取ってくる「運び屋」の設定
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SheetsDashboard() {
  // 💡 SWRの魔法：7秒（7000ms）ごとに勝手にAPIを叩いて、データが変わったら画面を更新する
  const { data, error, isValidating } = useSWR("/api/sheets-data", fetcher, {
    refreshInterval: 7000, // ここを7秒に設定！
    revalidateOnFocus: true, // 別のタブから戻ってきた瞬間に更新！
  });

  if (error) return <div className="p-10 text-red-500 font-bold">通信エラーが発生しました 😭</div>;
  if (!data) return <div className="p-10 text-center font-bold text-slate-500 animate-pulse">初期データをロード中...🚀</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* SaaS風ヘッダー */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tighter">TEAM PORTAL FEED</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Live Syncing Every 7s</p>
            </div>
          </div>

          {/* 💡 SaaSアプリによくある「同期中」の小さなサイン */}
          <div className={`transition-opacity duration-300 ${isValidating ? "opacity-100" : "opacity-0"}`}>
             <div className="flex items-center gap-2 text-blue-500 text-[10px] font-bold">
               <div className="animate-spin text-sm">🔄</div>
               SYNCING...
             </div>
          </div>
        </div>

        {/* データ表示部分 */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto max-h-[75vh]">
            <table className="w-full text-left">
              <thead className="sticky top-0 z-10 bg-slate-900 text-white text-[10px] uppercase tracking-[0.2em]">
                <tr>
                  <th className="py-5 px-6 font-bold">獲得時間</th>
                  <th className="py-5 px-6 font-bold">メールアドレス</th>
                  <th className="py-5 px-6 font-bold">電話番号</th>
                  <th className="py-5 px-6 font-bold">プラン名</th>
                  <th className="py-5 px-6 font-bold text-center">シンプル割</th>
                  <th className="py-5 px-6 font-bold text-center">重説</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row: any, index: number) => (
                  <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-5 px-6 text-[11px] text-slate-400 font-mono">{row.timestamp}</td>
                    <td className="py-5 px-6 text-sm font-bold text-slate-700">{row.email}</td>
                    <td className="py-5 px-6 text-sm text-slate-500">{row.phone}</td>
                    <td className="py-5 px-6">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase">
                        {row.plan || "---"}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-center">
                      {row.simpleWari === "確認しました" ? (
                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black border border-green-100">DONE</span>
                      ) : (
                        <span className="text-slate-300 text-[10px] italic">WATING</span>
                      )}
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                        row.jusetsu === "はい" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "bg-slate-50 text-slate-400"
                      }`}>
                        {row.jusetsu || "---"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}