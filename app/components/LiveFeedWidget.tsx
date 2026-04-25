"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import useSWR from "swr";

const MASTER_SHEET_ID = "1gXTpTFfp5f5I83P0FVbJbzX-bEsvgLY_DpNl6YDo9-w";

const SHEET_CONFIGS = [
  { name: "シンプル獲得（侍、その他）", id: MASTER_SHEET_ID, range: "シンプル獲得（じげん、侍）!A2:F" },
  { name: "名古屋同意", id: MASTER_SHEET_ID, range: "名古屋オフィス同意!A2:E" },
  { name: "名古屋FF同意", id: MASTER_SHEET_ID, range: "名古屋オフィスFF同意!A2:E" },
  { name: "電気ガスセット割", id: MASTER_SHEET_ID, range: "電気ガスセット割!A2:F" },
  { name: "デンワde割", id: MASTER_SHEET_ID, range: "グリーン　デンワde割!A2:E" },
  { name: "空室通電", id: MASTER_SHEET_ID, range: "空室通電!A2:E" }
];

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
};

export default function LiveFeedWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSheet, setActiveSheet] = useState(SHEET_CONFIGS[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isValidating } = useSWR(
    `/api/sheets-data?id=${activeSheet.id}&range=${encodeURIComponent(activeSheet.range)}`, 
    fetcher, 
    { refreshInterval: 7000 }
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ダッシュボード画面では非表示にする
  if (pathname === "/dashboard") return null;

  return (
    // 💡 修正ポイント：top-[85px] right-[30px] にして、住所検索バーの真下に配置！
    // z-[9998] にすることで、住所検索のドロップダウン（99999）の下に綺麗に潜り込みます
    <div className="fixed top-[85px] right-[30px] z-[9998]" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-300 backdrop-blur-xl shadow-lg hover:scale-105 active:scale-95"
        style={{ 
          background: isOpen ? "rgba(14, 165, 233, 0.9)" : "rgba(15, 23, 42, 0.6)", 
          borderColor: isOpen ? "#0ea5e9" : "rgba(255,255,255,0.1)",
          color: isOpen ? "#ffffff" : "#f8fafc"
        }}
      >
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpen ? "bg-white" : "bg-sky-400"}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isOpen ? "bg-white" : "bg-sky-500"}`}></span>
        </span>
        <span style={{ fontSize: "11px", fontWeight: 900, letterSpacing: "1px" }}>LIVE FEED</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-80 rounded-3xl shadow-2xl border backdrop-blur-3xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300" style={{ background: "rgba(15, 23, 42, 0.85)", borderColor: "rgba(255,255,255,0.1)" }}>
          
          <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}>
            <select 
              className="bg-transparent text-[11px] font-black outline-none cursor-pointer text-sky-400" 
              value={activeSheet.name}
              onChange={(e) => setActiveSheet(SHEET_CONFIGS.find(s => s.name === e.target.value) || SHEET_CONFIGS[0])}
            >
              {SHEET_CONFIGS.map(sheet => <option key={sheet.name} value={sheet.name} className="bg-slate-900 text-white">{sheet.name}</option>)}
            </select>
            {isValidating && <span className="text-[10px] text-sky-500 font-bold animate-pulse">Syncing...</span>}
          </div>

          <div className="p-3 flex flex-col gap-2 max-h-[350px] overflow-y-auto">
            {!data ? (
              <div className="p-6 text-center text-[10px] text-slate-400 font-bold animate-pulse">Loading Matrix...</div>
            ) : data.length === 0 ? (
              <div className="p-6 text-center text-[10px] text-slate-500 font-bold">No Records Found.</div>
            ) : (
              data.slice(0, 3).map((row: any, i: number) => (
                <div key={i} className="p-3.5 rounded-2xl border transition-all hover:bg-slate-800/50" style={{ background: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.05)" }}>
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[9px] font-mono text-slate-400">{row.timestamp?.split(' ')[1] || row.timestamp}</span>
                    {row.plan && <span className="text-[8px] font-black px-2 py-0.5 rounded-md border border-slate-700 bg-slate-800 text-slate-300">{row.plan}</span>}
                  </div>
                  <div className="text-[13px] font-bold truncate mb-2 text-slate-100">
                    {row.name || row.email}
                  </div>
                  <div className="flex gap-2">
                    {row.jusetsu && <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${row.jusetsu === "はい" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-500/20 text-slate-400"}`}>{row.jusetsu}</span>}
                    {row.simpleWari === "確認しました" && <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">割</span>}
                    {row.gasSet && <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">ガス</span>}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 border-t text-center transition-colors hover:bg-slate-800/50" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}>
            <a href="/dashboard" className="text-[10px] font-black text-sky-400 hover:text-sky-300 flex items-center justify-center gap-1">
              Growth Matrixを開く <span className="text-[14px]">→</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}