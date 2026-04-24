"use client";

import { useEffect, useState } from "react";
// 💡 アイコンを使うと一気にアプリ感が出ます！（標準的な絵文字で代用しています）
const IconClock = () => <span>🕒</span>;
const IconMail = () => <span>✉️</span>;
const IconPhone = () => <span>📞</span>;
const IconStar = () => <span>✨</span>;

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

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin text-4xl mb-4">🌀</div>
        <p className="text-gray-500 font-medium">最新データをロード中...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* ヘッダー部分：ここがカッコいいとアプリに見えます */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              リアルタイム獲得フィード
            </h1>
            <p className="text-slate-500 mt-1">スプレッドシートから最新の獲得情報を自動同期しています</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-bold text-slate-600">LIVE: {data.length}件のデータ</span>
          </div>
        </div>

        {/* テーブル部分：スプシの配置を保ちつつWEBアプリ風に */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-sm font-semibold text-slate-600"><div className="flex items-center gap-2"><IconClock /> 獲得時間</div></th>
                  <th className="py-4 px-6 text-sm font-semibold text-slate-600"><div className="flex items-center gap-2"><IconMail /> メールアドレス</div></th>
                  <th className="py-4 px-6 text-sm font-semibold text-slate-600"><div className="flex items-center gap-2"><IconPhone /> 電話番号</div></th>
                  <th className="py-4 px-6 text-sm font-semibold text-slate-600"><div className="flex items-center gap-2"><IconStar /> プラン</div></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row, index) => (
                  <tr key={index} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="py-4 px-6 text-sm text-slate-500 font-mono">
                      {row.timestamp}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {row.email}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      {row.phone}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`
                        inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
                        ${row.plan?.includes('侍') ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}
                      `}>
                        {row.plan || "未設定"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* フッター：さりげない装飾 */}
        <p className="text-center text-slate-400 text-xs mt-8">
          &copy; 2024 Team Portal Two | Data synced with Google Sheets API
        </p>
      </div>
    </div>
  );
}