"use client";

import { useEffect, useState } from "react";

export default function SheetsDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sheets-data")
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json)) {
          setData(json);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center font-bold">データを同期中...🚀</div>;

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter">TEAM PORTAL FEED</h1>
            <p className="text-slate-500 font-medium italic">Real-time Acquisition Data</p>
          </div>
          <div className="text-right text-xs font-bold text-slate-400 uppercase tracking-widest">
            Total: {data.length} records
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900 text-white text-[10px] uppercase tracking-[0.2em]">
                  <th className="py-5 px-6 font-bold">タイムスタンプ</th>
                  <th className="py-5 px-6 font-bold">メールアドレス</th>
                  <th className="py-5 px-6 font-bold">電話番号</th>
                  <th className="py-5 px-6 font-bold">プラン名</th>
                  <th className="py-5 px-6 font-bold text-center">シンプル割</th>
                  <th className="py-5 px-6 font-bold text-center">重要事項説明書</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row, index) => (
                  <tr key={index} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="py-5 px-6 text-xs text-slate-400 font-mono italic">
                      {row.timestamp}
                    </td>
                    <td className="py-5 px-6 font-bold text-slate-700">
                      {row.email}
                    </td>
                    <td className="py-5 px-6 text-sm text-slate-500 font-medium">
                      {row.phone}
                    </td>
                    <td className="py-5 px-6">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-black uppercase">
                        {row.plan || "---"}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-center">
                      {row.simpleWari === "確認しました" ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black shadow-sm border border-green-200">
                          DONE / 確認済
                        </span>
                      ) : (
                        <span className="text-slate-300 text-[10px]">未確認</span>
                      )}
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                        row.jusetsu === "はい" 
                        ? "bg-blue-100 text-blue-700 border-blue-200" 
                        : "bg-slate-50 text-slate-400 border-slate-100"
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