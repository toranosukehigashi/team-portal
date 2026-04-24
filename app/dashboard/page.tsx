"use client";
import { useEffect, useState } from "react";

export default function SheetsDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sheets-data")
      .then((res) => res.json())
      .then((json) => {
        setData(Array.isArray(json) ? json : []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center font-bold text-slate-500">データを同期中...⌛</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tighter">Acquisition Dashboard</h1>
        
        <div className="bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900 text-white text-[10px] uppercase tracking-widest">
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
                  <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-5 text-xs text-slate-400 font-mono">{row.timestamp}</td>
                    <td className="p-5 text-sm font-bold text-slate-700">{row.email}</td>
                    <td className="p-5 text-sm text-slate-500">{row.phone}</td>
                    <td className="p-5">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[11px] font-bold border border-blue-100">
                        {row.plan || "未設定"}
                      </span>
                    </td>
                    <td className="p-5">
                      {row.simpleWari === "確認しました" ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black border border-green-200">
                          ✅ 確認済
                        </span>
                      ) : (
                        <span className="text-slate-300 text-[10px]">{row.simpleWari || "---"}</span>
                      )}
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                        row.jusetsu === "はい" 
                        ? "bg-indigo-100 text-indigo-700 border-indigo-200" 
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