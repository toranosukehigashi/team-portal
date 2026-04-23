"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GlobalAddressSearch() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 💡 外側をクリックしたらドロップダウンを閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 💡 ページ遷移時にリセット
  useEffect(() => {
    setIsOpen(false);
    setIsFocused(false);
    setQuery("");
  }, [pathname]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setStatus("検索中...");
    setIsOpen(true);
    setResults([]);

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
      setResults(locs.slice(0, 15));
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
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    setIsOpen(false);
    setIsFocused(false);
  };

  return (
    <div 
      ref={wrapperRef} 
      key={pathname}
      style={{
        position: "fixed",
        top: "20px",
        right: "30px",
        zIndex: 99999,
        width: (isFocused || query.length > 0) ? "320px" : "220px", 
        transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)", // Appleライクな超滑らかな広がり
        fontFamily: "'Inter', 'Noto Sans JP', sans-serif",
        animation: "searchBarEnterRight 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards"
      }}
    >
      {/* 🌈 流れるレインボーグラデーションの「外枠」 */}
      <div className={`rainbow-border-wrapper ${isFocused || query.length > 0 ? 'active' : ''}`}>
        
        {/* 🌐 グラスモーフィズムの「内側（検索バー本体）」 */}
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.85)", // 内側は透明感のある白
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "28px", // 外枠より少し小さくしてボーダーを見せる
          padding: "5px 5px 5px 16px",
          width: "100%",
          height: "100%",
          transition: "0.3s",
        }}>
          <span style={{ 
            fontSize: "15px", 
            marginRight: "8px", 
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", 
            transform: isFocused ? "scale(1.1) rotate(-10deg)" : "scale(1) rotate(0deg)",
            filter: isFocused ? "drop-shadow(0 2px 4px rgba(236,72,153,0.4))" : "none"
          }}>
            🔮
          </span>
          
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { 
              setIsFocused(true); 
              if (results.length > 0) setIsOpen(true); 
            }}
            placeholder={isFocused ? "地名・カナを入力... (Enter)" : "魔法の住所検索"}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: "13px",
              fontWeight: 800,
              color: "#1e293b",
              width: "100%",
            }}
          />
          
          {/* 🌈 プレミアム・レインボーボタン */}
          <button 
            className="rainbow-button"
            onClick={handleSearch}
            style={{
              border: "none",
              padding: "9px 16px",
              borderRadius: "24px",
              fontWeight: 900,
              fontSize: "11px",
              letterSpacing: "1px",
              cursor: "pointer",
              color: "#fff",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              opacity: (isFocused || query.length > 0) ? 1 : 0.8,
              transform: (isFocused || query.length > 0) ? "scale(1)" : "scale(0.95)",
            }}
          >
            検索
          </button>
        </div>
      </div>

      {/* 🍱 ドロップダウン検索結果 (Bento UI風 + ホバーレインボー) */}
      {isOpen && (
        <div style={{
          marginTop: "12px",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(25px)",
          border: "1px solid rgba(255, 255, 255, 0.8)",
          borderRadius: "20px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.1), 0 0 0 1px rgba(236,72,153,0.1)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: "fadeInDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>
          <div style={{ padding: "10px 18px", fontSize: "11px", fontWeight: 900, color: "#64748b", background: "linear-gradient(to right, rgba(241, 245, 249, 0.8), rgba(255, 255, 255, 0.5))", borderBottom: "1px solid rgba(203, 213, 225, 0.5)" }}>
            {status}
          </div>
          
          <div style={{ maxHeight: "320px", overflowY: "auto", padding: "8px", display: "flex", flexDirection: "column", gap: "6px" }} className="custom-scroll">
            {results.map((loc, idx) => {
              const formattedZip = loc.postal.replace(/(\d{3})(\d{4})/, '$1-$2');
              const kana = `${loc.city_kana || ''} ${loc.town_kana || ''}`.trim();
              
              return (
                <div 
                  key={idx} 
                  className="rainbow-hover-item"
                  onClick={() => handleCopy(formattedZip, loc.prefecture, loc.city, loc.town)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "14px",
                    background: "#fff",
                    border: "1px solid #f1f5f9",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span className="item-zip">〒{formattedZip}</span>
                  </div>
                  <div style={{ color: "#1e293b", fontWeight: 800, fontSize: "13px", position: "relative", zIndex: 2 }}>
                    {loc.prefecture}{loc.city}{loc.town}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "10px", marginTop: "4px", fontWeight: 700, position: "relative", zIndex: 2 }}>
                    ヨミ: {kana}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ✨ コピー完了トースト（オーロラ仕様） */}
      <div style={{
        position: "absolute",
        top: "60px",
        left: "50%",
        transform: `translateX(-50%) ${showToast ? 'translateY(0) scale(1)' : 'translateY(-15px) scale(0.8)'}`,
        opacity: showToast ? 1 : 0,
        visibility: showToast ? "visible" : "hidden",
        background: "linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6)",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "30px",
        fontSize: "12px",
        fontWeight: 900,
        letterSpacing: "1px",
        boxShadow: "0 10px 25px rgba(139, 92, 246, 0.4)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: "none"
      }}>
        ✨ コピー完了！
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* 🌟 SaaS最高峰！流れるレインボーグラデーション (Generative UI) */
        @keyframes rainbowGlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* 🌈 外枠（普段は半透明、アクティブ時にレインボーが走り出す） */
        .rainbow-border-wrapper {
          padding: 2px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.4);
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .rainbow-border-wrapper.active {
          background: linear-gradient(90deg, #ff0080, #ff8c00, #40e0d0, #10b981, #3b82f6, #8b5cf6, #ff0080);
          background-size: 300% 100%;
          animation: rainbowGlow 4s linear infinite;
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2), 0 0 15px rgba(236, 72, 153, 0.3);
        }

        /* 🌈 ボタン（常に美しく色が流れる） */
        .rainbow-button {
          background: linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #10b981, #ec4899);
          background-size: 300% 100%;
          animation: rainbowGlow 4s linear infinite;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }
        .rainbow-button:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 8px 20px rgba(236, 72, 153, 0.4);
        }

        /* 🍱 リストアイテムのホバーエフェクト（オーロラハイライト） */
        .rainbow-hover-item::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(236,72,153,0.08), rgba(139,92,246,0.08));
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 1;
        }
        .rainbow-hover-item:hover {
          transform: translateY(-2px) scale(1.01);
          border-color: #d8b4fe !important;
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.1);
        }
        .rainbow-hover-item:hover::before {
          opacity: 1;
        }
        .item-zip {
          color: #8b5cf6;
          font-weight: 900;
          font-size: 13px;
          position: relative;
          z-index: 2;
          transition: 0.3s;
        }
        .rainbow-hover-item:hover .item-zip {
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @keyframes searchBarEnterRight {
          0% { opacity: 0; transform: translateY(-20px) scale(0.95); filter: blur(10px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* カスタムスクロールバー */
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(203, 213, 225, 0.6); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.5); }
      `}} />
    </div>
  );
}