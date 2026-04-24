"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

// ⚡️ 【超高精度版】全国の電力会社マッピング（市区町村レベルで判定！）
const getPowerCompany = (pref: string, city: string) => {
  // --------------------------------------------------
  // ⚠️ 厄介な境界線エリアの【市区町村】個別判定フィルター
  // --------------------------------------------------
  
  // 🗻 静岡県（富士川の東西問題）
  if (pref === '静岡県') {
    const tepcoCities = ['熱海市', '伊豆市', '伊東市', '三島市', '沼津市', '下田市', '裾野市', '御殿場市', '賀茂郡', '田方郡', '駿東郡'];
    if (tepcoCities.some(c => city.includes(c))) return { name: '東京電力', isMixed: false };
    if (city.includes('富士市') || city.includes('富士宮市')) return { name: '東電 / 中部電力', isMixed: true, note: '富士川を境に混在' }; // 富士市などは川で割れるため警告残し
    return { name: '中部電力', isMixed: false }; // それ以外の静岡は中電
  }

  // 🦞 三重県（南部は関西電力）
  if (pref === '三重県') {
    const kepcoCities = ['熊野市', '南牟婁郡', '御浜町', '紀宝町'];
    if (kepcoCities.some(c => city.includes(c))) return { name: '関西電力', isMixed: false };
    return { name: '中部電力', isMixed: false }; // それ以外の三重は中電
  }

  // 🦀 福井県（若狭地方は関西電力）
  if (pref === '福井県') {
    const kepcoCities = ['小浜市', '敦賀市', '三方郡', '三方上中郡', '大飯郡', '美浜町', '高浜町', 'おおい町', '若狭町'];
    if (kepcoCities.some(c => city.includes(c))) return { name: '関西電力', isMixed: false };
    return { name: '北陸電力', isMixed: false }; // それ以外の福井は北陸電力
  }

  // 🏯 兵庫県（赤穂周辺の一部が中国電力）
  if (pref === '兵庫県') {
    if (city.includes('赤穂市') || city.includes('赤穂郡')) return { name: '関西 / 中国電力', isMixed: true, note: '一部中国電力エリア' };
    return { name: '関西電力', isMixed: false };
  }

  // ⛷️ 長野県・新潟県・岐阜県（一部の端っこエリア）
  if (pref === '長野県') {
    if (city.includes('軽井沢町')) return { name: '東京電力', isMixed: false };
    return { name: '中部電力', isMixed: false }; // 大半は中電
  }
  if (pref === '新潟県') {
    if (city.includes('糸魚川市') || city.includes('妙高市')) return { name: '東北 / 中部電力', isMixed: true, note: '一部中部電力エリア' };
    return { name: '東北電力', isMixed: false };
  }
  if (pref === '岐阜県') {
    if (city.includes('関ケ原町')) return { name: '中部 / 関西電力', isMixed: true, note: '一部関西電力エリア' };
    return { name: '中部電力', isMixed: false };
  }


  // --------------------------------------------------
  // 🟢 通常の都道府県レベル判定（混在がないエリア）
  // --------------------------------------------------
  if (pref === '北海道') return { name: '北海道電力', isMixed: false };
  if (['青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'].includes(pref)) return { name: '東北電力', isMixed: false };
  if (['茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県', '山梨県'].includes(pref)) return { name: '東京電力', isMixed: false };
  if (pref === '愛知県') return { name: '中部電力', isMixed: false };
  if (['富山県', '石川県'].includes(pref)) return { name: '北陸電力', isMixed: false };
  if (['滋賀県', '京都府', '大阪府', '奈良県', '和歌山県'].includes(pref)) return { name: '関西電力', isMixed: false };
  if (['鳥取県', '島根県', '岡山県', '広島県', '山口県'].includes(pref)) return { name: '中国電力', isMixed: false };
  if (['徳島県', '香川県', '愛媛県', '高知県'].includes(pref)) return { name: '四国電力', isMixed: false };
  if (['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県'].includes(pref)) return { name: '九州電力', isMixed: false };
  if (pref === '沖縄県') return { name: '沖縄電力', isMixed: false };

  return { name: '要確認', isMixed: true, note: 'エリアを確認してください' };
};

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
      setResults(locs.slice(0, 50));
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

  // 🛡️ ログイン画面では検索バーを隠す
  if (pathname === '/login') {
    return null;
  }

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
        transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)", 
        fontFamily: "'Inter', 'Noto Sans JP', sans-serif",
        animation: "searchBarEnterRight 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards"
      }}
    >
      {/* 🌈 流れるレインボーグラデーションの外枠 */}
      <div className={`rainbow-border-wrapper ${isFocused || query.length > 0 ? 'active' : ''}`}>
        
        {/* 🌐 グラスモーフィズムの内側（検索バー本体） */}
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "28px", 
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
            placeholder={isFocused ? "地名・カナを入力... (Enter)" : "住所&地域電力検索"}
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

      {/* 🍱 ドロップダウン検索結果 */}
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
              
              // ⚡️ 判定ロジックに【都道府県】と【市区町村】の両方を投げて、超正確に判定させる！
              const powerInfo = getPowerCompany(loc.prefecture, loc.city); 
              
              return (
                <div 
                  key={idx} 
                  className="rainbow-hover-item"
                  onClick={() => handleCopy(formattedZip, loc.prefecture, loc.city, loc.town)}
                  style={{
                    flexShrink: 0,
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span className="item-zip">〒{formattedZip}</span>
                    
                    {/* ⚡️ 電力会社バッジの表示 */}
                    <span style={{
                      fontSize: "9px",
                      fontWeight: 900,
                      padding: "3px 8px",
                      borderRadius: "12px",
                      background: powerInfo.isMixed ? "rgba(245, 158, 11, 0.1)" : "rgba(59, 130, 246, 0.1)",
                      color: powerInfo.isMixed ? "#d97706" : "#2563eb",
                      border: `1px solid ${powerInfo.isMixed ? "rgba(245, 158, 11, 0.3)" : "rgba(59, 130, 246, 0.3)"}`,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      ⚡️ {powerInfo.name}
                    </span>
                  </div>
                  
                  <div style={{ color: "#1e293b", fontWeight: 800, fontSize: "13px", position: "relative", zIndex: 2 }}>
                    {loc.prefecture}{loc.city}{loc.town}
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "4px", position: "relative", zIndex: 2 }}>
                    <div style={{ color: "#64748b", fontSize: "10px", fontWeight: 700 }}>
                      ヨミ: {kana}
                    </div>
                    {/* ⚡️ どうしても判定しきれない境界線の時だけ警告 */}
                    {powerInfo.isMixed && (
                      <div style={{ color: "#ef4444", fontSize: "9px", fontWeight: 800, background: "rgba(239, 68, 68, 0.05)", padding: "2px 6px", borderRadius: "4px" }}>
                        ⚠️ {powerInfo.note}
                      </div>
                    )}
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
        pointerEvents: "none",
        whiteSpace: "nowrap" // 💥 これを追加！絶対に1行で表示させる最強の魔法！
      }}>
        ✨ コピー完了！
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rainbowGlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

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

        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(203, 213, 225, 0.6); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.5); }
      `}} />
    </div>
  );
}