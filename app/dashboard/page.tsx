"use client";

import { useEffect, useState } from "react";

export default function SheetsDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sheets-data")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center">データを読み込み中...🚀</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">📊 獲得管理ダッシュボード</h1>
          <p className="text-slate-500 text-sm">最新のデータが一番下に表示されます</p>
        </header>

        <div className="bg-white shadow-xl rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider">タイムスタンプ</th>
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider">メールアドレス</th>
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider">電話番号</th>
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider">プラン名</th>
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider">シンプル割</th>
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider">重要事項説明書</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row, index) => (
                  <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-4 px-4 text-sm text-slate-500">{row.timestamp}</td>
                    <td className="py-4 px-4 text-sm font-semibold text-slate-900">{row.email}</td>
                    <td className="py-4 px-4 text-sm text-slate-600">{row.phone}</td>
                    <td className="py-4 px-4 text-sm">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold text-xs">
                        {row.plan}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {row.discount === "適用" ? (
                        <span className="text-green-600 font-bold">✅ 有り</span>
                      ) : (
                        <span className="text-slate-400">なし</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <span className="text-slate-600 truncate max-w-[150px] inline-block">
                        {row.document}
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
