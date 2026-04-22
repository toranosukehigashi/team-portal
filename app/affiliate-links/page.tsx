"use client";

import React, { useState, useEffect } from "react";

// ✨ 背景の光の粒
const PixieDust = () => {
  const [stars, setStars] = useState<{ id: number; left: string; top: string; delay: string; size: string }[]>([]);
  useEffect(() => {
    const generatedStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i, left: `${Math.random() * 100}vw`, top: `${Math.random() * 100}vh`, delay: `${Math.random() * 5}s`, size: `${Math.random() * 3 + 1}px`
    }));
    setStars(generatedStars);
  }, []);
  return (
    <div className="particles-container">
      {stars.map(star => (
        <div key={star.id} className="star" style={{ left: star.left, top: star.top, width: star.size, height: star.size, animationDelay: star.delay }} />
      ))}
    </div>
  );
};

// ==========================================
// 💡 グループ（リスト）の定義
// ==========================================
type AgencyGroup = {
  id: string;
  name: string;
  themeColor: string;
  explanationLink: string;
};

const AGENCY_GROUPS: AgencyGroup[] = [
  { 
    id: "nagoya", 
    name: "名古屋案件", 
    themeColor: "#0ea5e9", // 鮮やかなブルー
    explanationLink: "https://forms.gle/hEiC6B61ctNy7F3U6" 
  },
  { 
    id: "vacant", 
    name: "空室通電", 
    themeColor: "#10b981", // エメラルドグリーン
    explanationLink: "https://docs.google.com/forms/d/1i7OHDzZxShImK9E3TnjjAs5yIciWk8pZbc5YOjPSY1k/viewform?edit_requested=true" 
  }
];

// ==========================================
// 💡 アフィリエイトリンクのデータ
// ==========================================
type AgencyLink = {
  id: string;
  groupId: string;
  name: string;
  url: string;
  gas: string;
  water: string;
  net: string;
  ws: string;
  area: string;
  note: string;
};

const AGENCY_DATA: AgencyLink[] = [
  // 🟦 名古屋案件 (1~15)
  { id: "1", groupId: "nagoya", name: "My賃貸", url: "https://octopusenergy.co.jp/affiliate/05-ryosukehirokawa", gas: "TOKAI", water: "名古屋市水道局", net: "Wiz", ws: "プレミアムウォーター", area: "中部電力", note: "" },
  { id: "2", groupId: "nagoya", name: "春風不動産", url: "https://octopusenergy.co.jp/affiliate/03-ryosukehirokawa", gas: "東 邦", water: "名古屋市水道局", net: "Wiz", ws: "プレミアムウォーター", area: "中部電力", note: "" },
  { id: "3", groupId: "nagoya", name: "エステートプラス", url: "https://octopusenergy.co.jp/affiliate/04-ryosukehirokawa", gas: "TOKAI", water: "名古屋市水道局", net: "Wiz", ws: "プレミアムウォーター", area: "中部電力", note: "" },
  { id: "4", groupId: "nagoya", name: "アパマンショップ蟹江店", url: "https://octopusenergy.co.jp/affiliate/01-yutainoue", gas: "TOKAI", water: "名古屋市水道局", net: "Wiz", ws: "プレミアムウォーター", area: "中部電力", note: "" },
  { id: "5", groupId: "nagoya", name: "不動産ランドすまいる", url: "https://octopusenergy.co.jp/affiliate/04-yutainoue", gas: "東 邦", water: "名古屋市水道局", net: "希望者のみ", ws: "希望者のみプレミ", area: "中部電力", note: "" },
  { id: "6", groupId: "nagoya", name: "ピタットハウス神宮南", url: "https://octopusenergy.co.jp/affiliate/05-yutainoue", gas: "TOKAI", water: "名古屋市水道局", net: "Wiz", ws: "プレミアムウォーター", area: "中部電力", note: "" },
  { id: "7", groupId: "nagoya", name: "Access", url: "https://octopusenergy.co.jp/affiliate/06-yutainoue", gas: "TOKAI", water: "名古屋市水道局", net: "Wiz", ws: "プレミアムウォーター", area: "中部電力", note: "" },
  { id: "8", groupId: "nagoya", name: "ルームコレクション", url: "https://octopusenergy.co.jp/affiliate/06-ryosukehirokawa", gas: "TOKAI", water: "名古屋市水道局", net: "Wiz", ws: "プレミアムウォーター", area: "中部電力", note: "" },
  { id: "9", groupId: "nagoya", name: "すまいらんど", url: "https://octopusenergy.co.jp/affiliate/07-ryosukehirokawa", gas: "TOKAI", water: "名古屋市水道局", net: "Wiz", ws: "プレミアムウォーター", area: "中部電力", note: "" },
  { id: "10", groupId: "nagoya", name: "株式会社東栄", url: "https://octopusenergy.co.jp/affiliate/08-ryosukehirokawa", gas: "TOKAI", water: "碧南市水道局", net: "Wiz", ws: "プレミアムウォーター", area: "中部電力", note: "" },
  { id: "11", groupId: "nagoya", name: "株式会社STYプランニング", url: "https://octopusenergy.co.jp/affiliate/10-ryosukehirokawa", gas: "TOKAI", water: "名古屋市水道局", net: "Wiz", ws: "プレミアムウォーター", area: "中部電力", note: "" },
  { id: "12", groupId: "nagoya", name: "なごやか不動産", url: "https://octopusenergy.co.jp/affiliate/05-ryosukehirokawa", gas: "TOKAI", water: "名古屋市水道局", net: "Wiz", ws: "プレミアムウォーター", area: "中部電力", note: "" },
  { id: "13", groupId: "nagoya", name: "楽々不動産", url: "https://octopusenergy.co.jp/affiliate/03-ryosukehirokawa", gas: "TOKAI", water: "名古屋市水道局", net: "Wiz", ws: "プレミアムウォーター", area: "中部電力", note: "" },
  { id: "14", groupId: "nagoya", name: "ひまわりカンパニー株式会社", url: "https://octopusenergy.co.jp/affiliate/04-ryosukehirokawa", gas: "TOKAI", water: "名古屋市水道局", net: "Wiz", ws: "プレミアムウォーター", area: "中部電力", note: "" },
  { id: "15", groupId: "nagoya", name: "Terrace Home本店", url: "https://octopusenergy.co.jp/affiliate/01-yutainoue", gas: "なし", water: "なし", net: "Wiz", ws: "プレミアムウォーター", area: "北海道電力", note: "" },

  // 🟩 空室通電 (16~31)
  { id: "16", groupId: "vacant", name: "芳賀", url: "https://octopusenergy.co.jp/affiliate/haga?affiliate=haga", gas: "ー", water: "ー", net: "OK", ws: "OK", area: "九州電力", note: "" },
  { id: "17", groupId: "vacant", name: "アイユーホーム", url: "https://octopusenergy.co.jp/affiliate/aiy?affiliate=aiy", gas: "ー", water: "ー", net: "NO", ws: "NO", area: "九州電力", note: "" },
  { id: "18", groupId: "vacant", name: "ニコニコ不動産", url: "https://octopusenergy.co.jp/affiliate/nikoniko?affiliate=nikoniko", gas: "ー", water: "ー", net: "OK", ws: "OK", area: "九州電力", note: "" },
  { id: "19", groupId: "vacant", name: "洞口不動産", url: "https://octopusenergy.co.jp/affiliate/horaguchi2?affiliate=horaguchi2", gas: "ー", water: "ー", net: "NO", ws: "NO", area: "中部電力", note: "" },
  { id: "20", groupId: "vacant", name: "スリーケー企画", url: "https://octopusenergy.co.jp/affiliate/3k?affiliate=3k", gas: "ー", water: "ー", net: "NO", ws: "NO", area: "北海道電力", note: "" },
  { id: "21", groupId: "vacant", name: "三世建物管理", url: "https://octopusenergy.co.jp/affiliate/sansei?affiliate=sansei", gas: "ー", water: "ー", net: "NO", ws: "NO", area: "北海道電力", note: "" },
  { id: "22", groupId: "vacant", name: "ランエステート", url: "https://octopusenergy.co.jp/affiliate/run?affiliate=run", gas: "ー", water: "ー", net: "NO", ws: "NO", area: "北海道電力", note: "" },
  { id: "23", groupId: "vacant", name: "トライホーム", url: "https://octopusenergy.co.jp/affiliate/tryhome?affiliate=tryhome", gas: "ー", water: "ー", net: "NO", ws: "NO", area: "北海道電力", note: "" },
  { id: "24", groupId: "vacant", name: "オクムラ", url: "https://octopusenergy.co.jp/affiliate/okm?affiliate=okm", gas: "ー", water: "ー", net: "NO", ws: "NO", area: "北海道電力", note: "" },
  { id: "25", groupId: "vacant", name: "ウィノベーション", url: "https://octopusenergy.co.jp/affiliate/win?affiliate=win", gas: "ー", water: "ー", net: "NO", ws: "NO", area: "北海道電力", note: "" },
  { id: "26", groupId: "vacant", name: "めぐみ企画", url: "https://octopusenergy.co.jp/affiliate/mgm?affiliate=mgm", gas: "ー", water: "ー", net: "NO", ws: "NO", area: "北海道電力", note: "" },
  { id: "27", groupId: "vacant", name: "カンリーコーポ", url: "https://octopusenergy.co.jp/affiliate/kanry?affiliate=kanry", gas: "ー", water: "ー", net: "NO", ws: "NO", area: "北海道電力", note: "" },
  { id: "28", groupId: "vacant", name: "株式会社フォーディー", url: "https://octopusenergy.co.jp/affiliate/4d", gas: "ー", water: "ー", net: "NO", ws: "NO", area: "北海道電力", note: "" },
  { id: "29", groupId: "vacant", name: "アンサンブル株式会社", url: "https://octopusenergy.co.jp/affiliate/ensem?affiliate=ensem", gas: "ー", water: "ー", net: "NO", ws: "NO", area: "北海道電力", note: "" },
  { id: "30", groupId: "vacant", name: "株式会社北総研", url: "https://octopusenergy.co.jp/affiliate/3k?affiliate=3k", gas: "ー", water: "ー", net: "NO", ws: "NO", area: "北海道電力", note: "" },
  { id: "31", groupId: "vacant", name: "フィリックス株式会社", url: "https://octopusenergy.co.jp/affiliate/felixchubu?affiliate=felixchubu", gas: "ー", water: "ー", net: "OK", ws: "OK", area: "中部電力", note: "" }
];

export default function AffiliateLinks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeGroupFilter, setActiveGroupFilter] = useState<string>("all");
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 絞り込みフィルター用
  const [filterGas, setFilterGas] = useState(false);
  const [filterWater, setFilterWater] = useState(false);
  const [filterNet, setFilterNet] = useState(false);
  const [filterWs, setFilterWs] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [searchTerm, filterGas, filterWater, filterNet, filterWs, activeGroupFilter]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    showToast(!isDarkMode ? "🌙 ダークモードに切り替えました" : "☀️ ライトモードに切り替えました");
  };

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  const copyToClipboard = async (text: string, successMsg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`📋 ${successMsg}`);
    } catch (err) {
      alert("コピーに失敗しました");
    }
  };

  const isNone = (val: string) => {
    return val === "なし" || val === "ー" || val === "NO" || val === "";
  };

  // 高度な絞り込みロジック
  const filteredData = AGENCY_DATA.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = item.name.toLowerCase().includes(searchLower) || 
                        item.area.toLowerCase().includes(searchLower) ||
                        item.gas.toLowerCase().includes(searchLower) ||
                        item.net.toLowerCase().includes(searchLower);
    
    const matchGroup = activeGroupFilter === "all" || item.groupId === activeGroupFilter;

    const matchGas = filterGas ? !isNone(item.gas) : true;
    const matchWater = filterWater ? !isNone(item.water) : true;
    const matchNet = filterNet ? !isNone(item.net) : true;
    const matchWs = filterWs ? !isNone(item.ws) : true;

    return matchSearch && matchGroup && matchGas && matchWater && matchNet && matchWs;
  });

  return (
    <>
      <div className={`entrance-bg ${isDarkMode ? "theme-dark" : "theme-light"}`}><PixieDust /></div>

      <main className={`app-wrapper ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <style dangerouslySetInnerHTML={{ __html: `
          .app-wrapper * { box-sizing: border-box; }
          .theme-light { --bg-gradient: linear-gradient(180deg, #7dd3fc 0%, #e0f2fe 100%); --text-main: #1e293b; --text-sub: #475569; --card-bg: rgba(255, 255, 255, 0.7); --card-border: rgba(255, 255, 255, 1); --card-hover-border: #38bdf8; --card-hover-bg: rgba(255, 255, 255, 0.95); --card-shadow: 0 10px 30px rgba(0,0,0,0.05); --title-color: #0369a1; --accent-color: #0ea5e9; --input-bg: rgba(255, 255, 255, 0.9); --input-border: rgba(203, 213, 225, 0.8); --star-color: #f59e0b; }
          .theme-dark { --bg-gradient: radial-gradient(ellipse at bottom, #1e1b4b 0%, #020617 100%); --text-main: #f8fafc; --text-sub: #cbd5e1; --card-bg: rgba(15, 23, 42, 0.7); --card-border: rgba(255, 255, 255, 0.15); --card-hover-border: #38bdf8; --card-hover-bg: rgba(30, 41, 59, 0.9); --card-shadow: 0 20px 50px rgba(0,0,0,0.8); --title-color: #fde047; --accent-color: #38bdf8; --input-bg: rgba(0, 0, 0, 0.4); --input-border: rgba(255, 255, 255, 0.2); --star-color: #fef08a; }
          .app-wrapper { min-height: 100vh; padding: 20px 30px 80px 30px; font-family: 'Inter', sans-serif; color: var(--text-main); font-size: 13px; position: relative; }
          .entrance-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -2; background: var(--bg-gradient); transition: 0.5s; }
          .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; }
          .star { position: absolute; border-radius: 50%; background: var(--star-color); box-shadow: 0 0 10px var(--star-color); animation: twinkle 4s infinite ease-in-out; }
          @keyframes twinkle { 0% { opacity: 0.1; transform: scale(0.5) translateY(0); } 50% { opacity: 1; transform: scale(1.2) translateY(-20px); } 100% { opacity: 0.1; transform: scale(0.5) translateY(0); } }

          /* ナビ＆メニュー */
          .hamburger-btn { position: fixed; top: 20px; left: 20px; z-index: 1001; background: var(--card-bg); backdrop-filter: blur(15px); border: 1px solid var(--card-border); border-radius: 10px; padding: 10px; cursor: pointer; display: flex; flex-direction: column; gap: 4px; box-shadow: var(--card-shadow); transition: 0.3s; }
          .hamburger-btn:hover { background: var(--card-hover-bg); transform: scale(1.05); }
          .hamburger-line { width: 20px; height: 2px; background: var(--text-sub); border-radius: 2px; transition: 0.4s; }
          .hamburger-btn.open .line1 { transform: translateY(6px) rotate(45deg); background: var(--accent-color); }
          .hamburger-btn.open .line2 { opacity: 0; }
          .hamburger-btn.open .line3 { transform: translateY(-6px) rotate(-45deg); background: var(--accent-color); }
          .menu-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(5px); z-index: 999; opacity: 0; pointer-events: none; transition: 0.4s ease; }
          .menu-overlay.open { opacity: 1; pointer-events: auto; }
          .side-menu { position: fixed; top: 0; left: -300px; width: 280px; height: 100vh; background: var(--card-bg); backdrop-filter: blur(30px); border-right: 1px solid var(--card-border); z-index: 1000; box-shadow: var(--card-shadow); transition: 0.5s; padding: 80px 20px 30px; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; }
          .side-menu.open { left: 0; }
          .menu-title { font-size: 12px; font-weight: 900; color: var(--text-sub); margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px dashed var(--card-border); letter-spacing: 1px; }
          .side-link { text-decoration: none; padding: 12px 16px; border-radius: 10px; background: var(--input-bg); color: var(--text-main); font-weight: 800; border: 1px solid var(--card-border); transition: 0.2s; display: flex; align-items: center; gap: 10px; font-size: 13px;}
          .side-link.current-page { background: linear-gradient(135deg, #0ea5e9, #4f46e5); color: #fff; border: none; pointer-events: none; }
          .glass-nav-wrapper { display: flex; justify-content: center; margin-bottom: 20px; }
          .glass-nav { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: var(--card-bg); backdrop-filter: blur(16px); border: 1px solid var(--card-border); border-radius: 50px; box-shadow: var(--card-shadow); max-width: 800px; width: 100%; }
          .glass-nav-link { text-decoration: none; padding: 8px 16px; border-radius: 30px; font-weight: 800; background: var(--input-bg); color: var(--text-sub); border: 1px solid var(--card-border); font-size: 13px; transition: 0.2s; }
          .glass-nav-link:hover { color: var(--accent-color); border-color: var(--card-hover-border); }
          .glass-nav-active { padding: 8px 16px; border-radius: 30px; font-weight: 900; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); font-size: 13px; }
          .theme-toggle-btn { background: var(--input-bg); border: 1px solid var(--card-border); padding: 8px 16px; border-radius: 30px; cursor: pointer; font-weight: 800; font-size: 13px; color: var(--text-main); transition: 0.3s; }

          /* メインレイアウト */
          .main-container { max-width: 1300px; margin: 0 auto; }
          
          /* 検索パネル */
          .control-panel { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 16px; padding: 16px; box-shadow: var(--card-shadow); margin-bottom: 20px; display: flex; flex-direction: column; gap: 12px; }
          .search-input { width: 100%; padding: 12px 16px; font-size: 14px; border: 2px solid var(--input-border); border-radius: 12px; background: var(--input-bg); color: var(--text-main); font-weight: 700; outline: none; transition: 0.3s; }
          .search-input:focus { border-color: var(--accent-color); box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2); }
          
          .controls-row { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
          .group-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
          .group-tab-btn { padding: 8px 16px; border-radius: 20px; font-weight: 800; font-size: 12px; cursor: pointer; border: 1px solid var(--input-border); background: var(--input-bg); color: var(--text-sub); transition: 0.3s; }
          .group-tab-btn:hover { border-color: var(--accent-color); color: var(--accent-color); transform: translateY(-1px); }
          .group-tab-btn.active { background: var(--accent-color); color: #fff; border-color: var(--accent-color); box-shadow: 0 4px 10px rgba(14, 165, 233, 0.3); pointer-events: none; }
          
          .filter-group { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; background: var(--input-bg); padding: 8px 16px; border-radius: 20px; border: 1px dashed var(--input-border); }
          .filter-label { font-weight: 900; color: var(--text-sub); margin-right: 2px; font-size: 12px; }
          .filter-checkbox { display: flex; align-items: center; gap: 4px; cursor: pointer; font-weight: 800; font-size: 12px; color: var(--text-sub); }
          .filter-checkbox input { width: 14px; height: 14px; accent-color: var(--accent-color); cursor: pointer; }

          /* 💡 グループセクション（ここに重説リンクを移動！） */
          .group-section { margin-bottom: 30px; }
          .group-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px dashed var(--card-border); padding-bottom: 8px; flex-wrap: wrap; gap: 10px; }
          .group-section-title { font-size: 16px; font-weight: 900; display: flex; align-items: center; gap: 8px; color: var(--title-color); margin: 0; }
          .group-color-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px currentColor; }
          
          /* グループ共通の重説リンクボタン（開く） */
          .group-terms-btn { background: linear-gradient(135deg, #10b981, #059669); color: #fff; text-decoration: none; padding: 8px 16px; border-radius: 12px; font-weight: 900; font-size: 12px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3); transition: 0.2s; }
          .group-terms-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(16, 185, 129, 0.5); }

          /* カードグリッド */
          .links-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
          
          .agency-card { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 12px; padding: 14px; box-shadow: var(--card-shadow); display: flex; flex-direction: column; gap: 10px; transition: 0.2s; }
          .agency-card:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); border-color: var(--card-hover-border); }
          
          .card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
          .agency-name { font-size: 15px; font-weight: 900; color: var(--title-color); margin: 0; line-height: 1.3; }

          .area-badge { font-size: 10px; font-weight: 800; background: var(--card-hover-bg); color: var(--accent-color); padding: 2px 8px; border-radius: 12px; border: 1px solid var(--card-hover-border); display: inline-flex; align-items: center; gap: 2px; white-space: nowrap; }

          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 2px 0; background: rgba(0,0,0,0.02); padding: 8px 10px; border-radius: 8px; border: 1px solid var(--input-border); }
          .theme-dark .details-grid { background: rgba(255,255,255,0.03); }
          
          .detail-item { display: flex; align-items: center; gap: 6px; font-size: 11px; }
          .detail-icon { font-size: 12px; opacity: 0.8; }
          .detail-value { font-weight: 900; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .detail-value.none { color: var(--text-sub); opacity: 0.4; font-weight: 600; text-decoration: line-through; }

          /* アクションボタン - OBJリンクを全幅に！ */
          .action-area { margin-top: auto; padding-top: 10px; border-top: 1px dashed var(--input-border); }
          .copy-btn { width: 100%; border: none; border-radius: 8px; padding: 10px; font-weight: 900; font-size: 12px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
          .copy-btn:hover { transform: translateY(-1px); }
          .btn-obj { background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff; }
          .btn-obj:hover { box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4); }
          
          .empty-state { grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--text-sub); font-size: 14px; font-weight: 800; background: var(--card-bg); border-radius: 16px; border: 2px dashed var(--card-border); }

          #toast { visibility: hidden; min-width: 250px; background: #10b981; color: #fff; text-align: center; border-radius: 10px; padding: 12px 20px; position: fixed; z-index: 100; right: 24px; bottom: 30px; font-size: 13px; font-weight: bold; transition: 0.3s; box-shadow: 0 8px 20px rgba(0,0,0,0.2); opacity: 0; transform: translateY(20px); }
          #toast.show { visibility: visible; opacity: 1; transform: translateY(0); }

          .fade-up-element { opacity: 0; transform: translateY(20px); transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
          .fade-up-element.visible { opacity: 1; transform: translateY(0); }
        `}} />

        <div className={`hamburger-btn ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className="hamburger-line line1"></div><div className="hamburger-line line2"></div><div className="hamburger-line line3"></div>
        </div>
        <div className={`menu-overlay ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(false)}></div>
        
        <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
          <div className="menu-title">🧭 TOOL MENU</div>
          <a href="/kpi-detail" className="side-link">📊 獲得進捗・KPI</a>
          <a href="/bulk-register" className="side-link">📦 データ一括登録</a>
          <a href="/net-toss" className="side-link">🌐 ネットトス連携</a>
          <a href="/self-close" className="side-link">🤝 自己クロ連携</a>
          <a href="/sms-kraken" className="side-link">📱 SMS送信</a>
          <a href="/procedure-wizard" className="side-link">🗺️ 手順辞書</a>
          <a href="/affiliate-links" className="side-link current-page">🔗 OBJリンクポータル</a>
        </div>

        <div className="glass-nav-wrapper fade-up-element">
          <div className="glass-nav">
            <div className="nav-left">
              <a href="/" className="glass-nav-link">← 司令室に戻る</a>
              <div className="glass-nav-active">🔗 OBJリンクポータル</div>
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {isDarkMode ? "🎇 NIGHT" : "☀️ DAY"}
            </button>
          </div>
        </div>

        <div className="main-container">
          
          <div className="control-panel fade-up-element">
            <input 
              type="text" 
              className="search-input" 
              placeholder="🔍 不動産名、業者名(TOKAI等)、エリアから検索..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="controls-row">
              <div className="group-tabs">
                <button 
                  className={`group-tab-btn ${activeGroupFilter === "all" ? "active" : ""}`}
                  onClick={() => setActiveGroupFilter("all")}
                >
                  すべて
                </button>
                {AGENCY_GROUPS.map(group => (
                  <button 
                    key={group.id}
                    className={`group-tab-btn ${activeGroupFilter === group.id ? "active" : ""}`}
                    onClick={() => setActiveGroupFilter(group.id)}
                  >
                    {group.name}
                  </button>
                ))}
              </div>

              <div className="filter-group">
                <div className="filter-label">💡 取扱いありで絞る：</div>
                <label className="filter-checkbox"><input type="checkbox" checked={filterGas} onChange={(e)=>setFilterGas(e.target.checked)} /> ガス</label>
                <label className="filter-checkbox"><input type="checkbox" checked={filterWater} onChange={(e)=>setFilterWater(e.target.checked)} /> 水道</label>
                <label className="filter-checkbox"><input type="checkbox" checked={filterNet} onChange={(e)=>setFilterNet(e.target.checked)} /> ネット</label>
                <label className="filter-checkbox"><input type="checkbox" checked={filterWs} onChange={(e)=>setFilterWs(e.target.checked)} /> WS</label>
              </div>
            </div>
          </div>

          {AGENCY_GROUPS.map(group => {
            if (activeGroupFilter !== "all" && activeGroupFilter !== group.id) return null;

            const groupAgencies = filteredData.filter(agency => agency.groupId === group.id);
            if (groupAgencies.length === 0) return null;

            return (
              <div key={group.id} className="group-section">
                
                {/* 💡 グループタイトルの横に「共通重説フォーム」を開くリンクを配置！ */}
                <div className="group-header-row fade-up-element">
                  <h2 className="group-section-title">
                    <span className="group-color-dot" style={{ color: group.themeColor, backgroundColor: group.themeColor }}></span>
                    {group.name}
                  </h2>
                  {group.explanationLink && (
                    <a 
                      href={group.explanationLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="group-terms-btn"
                    >
                      🚨 共通重説フォームを開く
                    </a>
                  )}
                </div>
                
                <div className="links-grid">
                  {groupAgencies.map((agency, index) => (
                    <div 
                      key={agency.id} 
                      className="agency-card fade-up-element" 
                      style={{ borderTop: `3px solid ${group.themeColor}`, transitionDelay: `${index * 0.03}s` }}
                    >
                      <div className="card-header">
                        <h3 className="agency-name">{agency.name}</h3>
                        <span className="area-badge">📍 {agency.area}</span>
                      </div>
                      
                      <div className="details-grid">
                        <div className="detail-item">
                          <span className="detail-icon">🔥</span>
                          <span className={`detail-value ${isNone(agency.gas) ? "none" : ""}`}>{agency.gas}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">💧</span>
                          <span className={`detail-value ${isNone(agency.water) ? "none" : ""}`}>{agency.water}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">🌐</span>
                          <span className={`detail-value ${isNone(agency.net) ? "none" : ""}`}>{agency.net}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">🚰</span>
                          <span className={`detail-value ${isNone(agency.ws) ? "none" : ""}`}>{agency.ws}</span>
                        </div>
                      </div>

                      {agency.note && (
                        <div className="info-row">
                          <span className="info-label">📝 備考</span>
                          <span className="info-value">{agency.note}</span>
                        </div>
                      )}

                      {/* 💡 ボタンは「OBJリンク」専用になり、超押しやすい全幅サイズに！ */}
                      <div className="action-area">
                        <button 
                          className="copy-btn btn-obj" 
                          onClick={() => copyToClipboard(agency.url, `${agency.name}のOBJリンク`)}
                        >
                          📋 OBJリンクをコピー
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredData.length === 0 && (
            <div className="empty-state fade-up-element">
              👻 該当する不動産会社が見つかりませんでした。
            </div>
          )}
        </div>

        <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>
      </main>
    </>
  );
}