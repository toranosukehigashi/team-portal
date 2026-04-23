"use client";

import React, { useState, useRef, useEffect } from "react";

export default function GlobalAddressSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 💡 外側をクリックしたらドロップダウンを閉じる魔法
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setStatus("検索中...");
    setIsOpen(true);
    setResults([]);

    // 🪄 魔法のノーマライザ（旧字体を新字体へ自動変換！）
    const normalizedKw = query
      .replace(/彌/g, '弥').replace(/櫻/g, '桜').replace(/澤/g, '沢')
      .replace(/[邊邉]/g, '辺').replace(/濱/g, '浜').replace(/廣/g, '広')
      .replace(/鐵/g, '鉄').replace(/榮/g, '栄').replace(/萬/g, '万')
      .replace(/壽/g, '寿').replace(/國/g, '国').replace(/區/g, '区')
      .replace(/學/g, '学').replace(/實/g, '実').replace(/[嶋嶌]/g, '島')
      .replace(/ヶ/g, 'ケ');

    try {
      const res = await fetch(`https://geoapi.heartrails.com/api/json?method=suggest&matching=like&keyword=${encodeURIComponent(normalizedKw)}`);
      const data = await res.json();
      const locs = data.response.location;

      if (!locs || locs.length === 0) {
        setStatus("見つかりません");
        return;
      }

      setStatus(`${locs.length}件ヒット`);
      setResults(locs.slice(0, 15)); // 最大15件
    } catch (e) {
      setStatus("通信エラー");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleCopy = (zip: string, pref: string, city: string, town: string) => {
    const text = `〒${zip} ${pref}${city}${town}`;
    navigator.clipboard.writeText(text);
    
    // コピー完了トーストを表示
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    setIsOpen(false); // コピーしたら閉じる
  };

  return (
    <div ref={wrapperRef} style={{
      position: "fixed",
      top: "15px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 99999,
      width: "100%",
      maxWidth: "400px",
      fontFamily: "'Inter', 'Noto Sans JP', sans-serif"
    }}>
      {/* 🌐 グローバル検索バー本体 */}
      <div style={{
        display: "flex",
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        borderRadius: "30px",
        padding: "6px 6px 6px 16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
        transition: "0.3s",
      }}>
        <span style={{ fontSize: "16px", marginRight: "8px", opacity: 0.6 }}>🔍</span>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          placeholder="地名・カナで住所を検索... (Enter)"
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            outline: "none",
            fontSize: "14px",
            fontWeight: 800,
            color: "#334155",
          }}
        />
        <button 
          onClick={handleSearch}
          style={{
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "24px",
            fontWeight: 900,
            fontSize: "12px",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(16, 185, 129, 0.3)",
            transition: "0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          検索
        </button>
      </div>

      {/* 🍱 ドロップダウン検索結果 (Bento UI風) */}
      {isOpen && (
        <div style={{
          marginTop: "8px",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(203, 213, 225, 0.5)",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: "fadeInDown 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)"
        }}>
          <div style={{ padding: "8px 16px", fontSize: "11px", fontWeight: 900, color: "#64748b", background: "rgba(241, 245, 249, 0.5)", borderBottom: "1px solid rgba(203, 213, 225, 0.5)" }}>
            {status}
          </div>
          
          <div style={{ maxHeight: "300px", overflowY: "auto", padding: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {results.map((loc, idx) => {
              const formattedZip = loc.postal.replace(/(\d{3})(\d{4})/, '$1-$2');
              const kana = `${loc.city_kana || ''} ${loc.town_kana || ''}`.trim();
              
              return (
                <div 
                  key={idx} 
                  onClick={() => handleCopy(formattedZip, loc.prefecture, loc.city, loc.town)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#10b981";
                    e.currentTarget.style.background = "rgba(16, 185, 129, 0.05)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ color: "#0f766e", fontWeight: 900, fontSize: "13px" }}>〒{formattedZip}</span>
                  </div>
                  <div style={{ color: "#1e293b", fontWeight: 800, fontSize: "13px" }}>
                    {loc.prefecture}{loc.city}{loc.town}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "10px", marginTop: "2px", fontWeight: 700 }}>
                    ヨミ: {kana}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ✨ コピー完了トースト */}
      <div style={{
        position: "absolute",
        top: "60px",
        left: "50%",
        transform: `translateX(-50%) ${showToast ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.9)'}`,
        opacity: showToast ? 1 : 0,
        visibility: showToast ? "visible" : "hidden",
        background: "#10b981",
        color: "#fff",
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 900,
        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
        transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
        pointerEvents: "none"
      }}>
        ✨ コピー完了！
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* スクロールバーの装飾 */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(203, 213, 225, 0.8); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 1); }
      `}} />
    </div>
  );
}