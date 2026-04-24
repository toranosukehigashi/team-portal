"use client";
import { useEffect, useState } from "react";

export default function SheetsDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 💡 定期的にデータを更新したい場合は、ここを5分おきとかにリロードする設定も可能です！
  useEffect(() => {
    fetch("/api/sheets-data")
      .then((res) => res.json())
      .then((json) => {
        setData(Array.isArray(json) ? json : []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center font-bold text-slate-500 animate-pulse">最新100件を同期中...🚀</div>;

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Acquisition Dashboard</h1>
          <span className="px-4 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full shadow-lg animate-pulse">
            LIVE: 最新100件を表示中
          </span>
        </div>
        
        <div className="bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[80vh]"> {/* 💡 縦に長くなりすぎないようスクロール設定 */}
            <table className="w-full text-left sticky-header">
              <thead className="sticky top-0 z-10 bg-slate-900 text-white text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="p-5">タイムスタンプ</th>
                  <th className="p-5">メールアドレス</th>
                  <th className="p-5">電話番号</th>
                  <th className="p-5">プラン名</th>
                  <th className="p-5">シンプル割</th>
                  <th className="p-5">重説書</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row, index) => (
                  <tr key={index} className="hover:bg-blue-50/30 transition-colors border-l-4 border-l-transparent hover:border-l-blue-500">
                    <td className="p-5 text-xs text-slate-400 font-mono">{row.timestamp}</td>
                    <td className="p-5 text-sm font-bold text-slate-700">{row.email}</td>
                    <td className="p-5 text-sm text-slate-500">{row.phone}</td>
                    <td className="p-5">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                        {row.plan || "---"}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      {row.simpleWari === "確認しました" ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black">確認済</span>
                      ) : (
                        <span className="text-slate-300 text-[10px] italic">未確認</span>
                      )}
                    </td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                        row.jusetsu === "はい" ? "bg-indigo-100 text-indigo-700" : "bg-slate-50 text-slate-400"
                      }`}>
                        {row.jusetsu}
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