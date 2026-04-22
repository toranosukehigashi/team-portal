"use client";

import React, { useState, useEffect } from "react";

// ✨ 背景の光の粒（静寂なカームデザイン）
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
// 💡 アフィリエイトリンクのデータ構造（B列〜J列を完全網羅！）
// ==========================================
type AgencyLink = {
  id: string;
  name: string;        // B: アフィリエイト名
  url: string;         // C: OBJリンク
  needsExplanation: boolean; // D: 重説確認
  hasGas: boolean;     // E: ガス
  hasWater: boolean;   // F: 水道
  hasNet: boolean;     // G: ネット
  hasWs: boolean;      // H: WS
  area: string;        // I: 対象エリア
  note: string;        // J: 備考
};

// 🚨 B列・C列はご主人様のデータを完全反映！D〜J列はダミーなので、後で本物に書き換えてください！
const AGENCY_DATA: AgencyLink[] = [
  { id: "1", name: "My賃貸", url: "https://octopusenergy.co.jp/affiliate/05-ryosukehirokawa", needsExplanation: true, hasGas: true, hasWater: true, hasNet: false, hasWs: false, area: "全国", note: "入居日確認必須" },
  { id: "2", name: "春風不動産", url: "https://octopusenergy.co.jp/affiliate/03-ryosukehirokawa", needsExplanation: false, hasGas: true, hasWater: false, hasNet: true, hasWs: false, area: "関東・中部", note: "ネットはSoftbankのみ" },
  { id: "3", name: "エステートプラス", url: "https://octopusenergy.co.jp/affiliate/04-ryosukehirokawa", needsExplanation: true, hasGas: false, hasWater: true, hasNet: true, hasWs: true, area: "関西", note: "" },
  { id: "4", name: "アパマンショップ蟹江店", url: "https://octopusenergy.co.jp/affiliate/01-yutainoue", needsExplanation: false, hasGas: true, hasWater: true, hasNet: false, hasWs: false, area: "愛知県", note: "ガスセット提案推奨" },
  { id: "5", name: "不動産ランドすまいる", url: "https://octopusenergy.co.jp/affiliate/04-yutainoue", needsExplanation: true, hasGas: true, hasWater: true, hasNet: true, hasWs: true, area: "全国", note: "フルセット提案" },
  { id: "6", name: "ピタットハウス神宮南", url: "https://octopusenergy.co.jp/affiliate/05-yutainoue", needsExplanation: false, hasGas: true, hasWater: false, hasNet: false, hasWs: false, area: "愛知県", note: "" },
  { id: "7", name: "Access", url: "https://octopusenergy.co.jp/affiliate/06-yutainoue", needsExplanation: true, hasGas: false, hasWater: false, hasNet: true, hasWs: false, area: "全国", note: "ネット単体での獲得が多い" },
  { id: "8", name: "ルームコレクション", url: "https://octopusenergy.co.jp/affiliate/06-ryosukehirokawa", needsExplanation: false, hasGas: true, hasWater: true, hasNet: false, hasWs: false, area: "中部・関西", note: "" },
  { id: "9", name: "すまいらんど", url: "https://octopusenergy.co.jp/affiliate/07-ryosukehirokawa", needsExplanation: false, hasGas: true, hasWater: false, hasNet: true, hasWs: true, area: "全国", note: "WSのキャンペーンあり" },
  { id: "10", name: "株式会社東栄", url: "https://octopusenergy.co.jp/affiliate/08-ryosukehirokawa", needsExplanation: true, hasGas: false, hasWater: true, hasNet: false, hasWs: false, area: "関東", note: "重説の読み合わせ必須" },
  { id: "11", name: "株式会社STYプランニング", url: "https://octopusenergy.co.jp/affiliate/10-ryosukehirokawa", needsExplanation: false, hasGas: true, hasWater: true, hasNet: true, hasWs: false, area: "全国", note: "" },
  { id: "12", name: "なごやか不動産", url: "https://octopusenergy.co.jp/affiliate/05-ryosukehirokawa", needsExplanation: false, hasGas: true, hasWater: false, hasNet: false, hasWs: false, area: "愛知県", note: "" },
  { id: "13", name: "楽々不動産", url: "https://octopusenergy.co.jp/affiliate/03-ryosukehirokawa", needsExplanation: true, hasGas: true, hasWater: true, hasNet: true, hasWs: true, area: "全国", note: "全体的に獲得率高め" },
  { id: "14", name: "ひまわりカンパニー株式会社", url: "https://octopusenergy.co.jp/affiliate/04-ryosukehirokawa", needsExplanation: false, hasGas: false, hasWater: true, hasNet: false, hasWs: false, area: "関東", note: "" },
  { id: "15", name: "Terrace Home本店", url: "https://octopusenergy.co.jp/affiliate/01-yutainoue", needsExplanation: true, hasGas: true, hasWater: false, hasNet: true, hasWs: false, area: "中部", note: "" }
];

export default function AffiliateLinks() {
  const [searchTerm, setSearchTerm] = useState("");
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
  }, [searchTerm, filterGas, filterWater, filterNet, filterWs]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    showToast(!isDarkMode ? "🌙 ダークモードに切り替えました" : "☀️ ライトモードに切り替えました");
  };

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  const copyToClipboard = async (text: string, name: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`📋 ${name} のOBJリンクをコピーしました！`);
    } catch (err) {
      alert("コピーに失敗しました");
    }
  };

  // 💡 高度な絞り込みロジック
  const filteredData = AGENCY_DATA.filter(item => {
    // 検索ワード判定（不動産名・エリア・備考でヒットさせる）
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = item.name.toLowerCase().includes(searchLower) || 
                        item.area.toLowerCase().includes(searchLower) ||
                        item.note.toLowerCase().includes(searchLower);
    
    // チェックボックスフィルター判定（チェックを入れた商材を扱っているか）
    const matchGas = filterGas ? item.hasGas : true;
    const matchWater = filterWater ? item.hasWater : true;
    const matchNet = filterNet ? item.hasNet : true;
    const matchWs = filterWs ? item.hasWs : true;

    return matchSearch && matchGas && matchWater && matchNet && matchWs;
  });

  return (
    <>
      <div className={`entrance-bg ${isDarkMode ? "theme-dark" : "theme-light"}`}><PixieDust /></div>

      <main className={`app-wrapper ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <style dangerouslySetInnerHTML={{ __html: `
          .app-wrapper * { box-sizing: border-box; }
          .theme-light { --bg-gradient: linear-gradient(180deg, #7dd3fc 0%, #e0f2fe 100%); --text-main: #1e293b; --text-sub: #475569; --card-bg: rgba(255, 255, 255, 0.7); --card-border: rgba(255, 255, 255, 1); --card-hover-border: #38bdf8; --card-hover-bg: rgba(255, 255, 255, 0.95); --card-shadow: 0 10px 30px rgba(0,0,0,0.05); --title-color: #0369a1; --accent-color: #0ea5e9; --input-bg: rgba(255, 255, 255, 0.9); --input-border: rgba(203, 213, 225, 0.8); --star-color: #f59e0b; }
          .theme-dark { --bg-gradient: radial-gradient(ellipse at bottom, #1e1b4b 0%, #020617 100%); --text-main: #f8fafc; --text-sub: #cbd5e1; --card-bg: rgba(15, 23, 42, 0.7); --card-border: rgba(255, 255, 255, 0.15); --card-hover-border: #38bdf8; --card-hover-bg: rgba(30, 41, 59, 0.9); --card-shadow: 0 20px 50px rgba(0,0,0,0.8); --title-color: #fde047; --accent-color: #38bdf8; --input-bg: rgba(0, 0, 0, 0.4); --input-border: rgba(255, 255, 255, 0.2); --star-color: #fef08a; }
          .app-wrapper { min-height: 100vh; padding: 20px 40px 100px 40px; font-family: 'Inter', sans-serif; color: var(--text-main); font-size: 13px; position: relative; }
          .entrance-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -2; background: var(--bg-gradient); }
          .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; }
          .star { position: absolute; border-radius: 50%; background: var(--star-color); box-shadow: 0 0 10px var(--star-color); animation: twinkle 4s infinite ease-in-out; }
          @keyframes twinkle { 0% { opacity: 0.1; transform: scale(0.5) translateY(0); } 50% { opacity: 1; transform: scale(1.2) translateY(-20px); } 100% { opacity: 0.1; transform: scale(0.5) translateY(0); } }

          /* ナビ＆メニュー等 */
          .hamburger-btn { position: fixed; top: 20px; left: 20px; z-index: 1001; background: var(--card-bg); backdrop-filter: blur(15px); border: 1px solid var(--card-border); border-radius: 12px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; gap: 5px; box-shadow: var(--card-shadow); transition: 0.3s; }
          .hamburger-line { width: 22px; height: 3px; background: var(--text-sub); border-radius: 3px; transition: 0.4s; }
          .hamburger-btn.open .line1 { transform: translateY(8px) rotate(45deg); background: var(--accent-color); }
          .hamburger-btn.open .line2 { opacity: 0; }
          .hamburger-btn.open .line3 { transform: translateY(-8px) rotate(-45deg); background: var(--accent-color); }
          .menu-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(5px); z-index: 999; opacity: 0; pointer-events: none; transition: 0.4s ease; }
          .menu-overlay.open { opacity: 1; pointer-events: auto; }
          .side-menu { position: fixed; top: 0; left: -320px; width: 300px; height: 100vh; background: var(--card-bg); backdrop-filter: blur(30px); border-right: 1px solid var(--card-border); z-index: 1000; box-shadow: var(--card-shadow); transition: 0.5s; padding: 90px 24px 30px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
          .side-menu.open { left: 0; }
          .menu-title { font-size: 13px; font-weight: 900; color: var(--text-sub); margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed var(--card-border); letter-spacing: 1px; }
          .side-link { text-decoration: none; padding: 14px 20px; border-radius: 14px; background: var(--input-bg); color: var(--text-main); font-weight: 800; border: 1px solid var(--card-border); transition: 0.2s; display: flex; align-items: center; gap: 12px; }
          .side-link.current-page { background: linear-gradient(135deg, #0ea5e9, #4f46e5); color: #fff; border: none; pointer-events: none; }
          .glass-nav-wrapper { display: flex; justify-content: center; margin-bottom: 30px; }
          .glass-nav { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: var(--card-bg); backdrop-filter: blur(16px); border: 1px solid var(--card-border); border-radius: 50px; box-shadow: var(--card-shadow); max-width: 800px; width: 100%; }
          .glass-nav-link { text-decoration: none; padding: 10px 20px; border-radius: 30px; font-weight: 800; background: var(--input-bg); color: var(--text-sub); border: 1px solid var(--card-border); font-size: 14px; }
          .glass-nav-active { padding: 10px 20px; border-radius: 30px; font-weight: 900; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); font-size: 14px; }
          .theme-toggle-btn { background: var(--input-bg); border: 1px solid var(--card-border); padding: 10px 20px; border-radius: 30px; cursor: pointer; font-weight: 800; color: var(--text-main); transition: 0.3s; }

          /* 💡 SaaS型ポータル特化UI */
          .main-container { max-width: 1200px; margin: 0 auto; }
          
          /* 検索・絞り込みパネル */
          .control-panel { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 20px; padding: 24px; box-shadow: var(--card-shadow); margin-bottom: 30px; display: flex; flex-direction: column; gap: 20px; }
          .search-input { width: 100%; padding: 16px 24px; font-size: 16px; border: 2px solid var(--input-border); border-radius: 16px; background: var(--input-bg); color: var(--text-main); font-weight: 700; outline: none; transition: 0.3s; }
          .search-input:focus { border-color: var(--accent-color); box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.2); }
          
          .filter-group { display: flex; gap: 15px; align-items: center; flex-wrap: wrap; background: var(--input-bg); padding: 12px 20px; border-radius: 16px; border: 1px dashed var(--input-border); }
          .filter-label { font-weight: 900; color: var(--title-color); margin-right: 10px; font-size: 14px; }
          .filter-checkbox { display: flex; align-items: center; gap: 6px; cursor: pointer; font-weight: 800; color: var(--text-sub); }
          .filter-checkbox input { width: 18px; height: 18px; accent-color: var(--accent-color); cursor: pointer; }

          /* カードグリッド */
          .links-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
          
          .agency-card { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 24px; padding: 24px; box-shadow: var(--card-shadow); display: flex; flex-direction: column; gap: 16px; transition: 0.3s; position: relative; overflow: hidden; }
          .agency-card:hover { transform: translateY(-4px); border-color: var(--card-hover-border); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
          
          .card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
          .agency-name { font-size: 18px; font-weight: 900; color: var(--title-color); margin: 0; line-height: 1.4; }
          
          .alert-badge { font-size: 11px; font-weight: 900; color: #fff; background: #ef4444; padding: 4px 10px; border-radius: 8px; white-space: nowrap; box-shadow: 0 2px 5px rgba(239, 68, 68, 0.4); animation: pulse 2s infinite; }
          @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }

          .service-tags { display: flex; gap: 8px; flex-wrap: wrap; }
          .tag { font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; background: rgba(148, 163, 184, 0.1); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.2); }
          .tag.active-gas { background: rgba(245, 158, 11, 0.1); color: #d97706; border-color: rgba(245, 158, 11, 0.3); }
          .theme-dark .tag.active-gas { color: #fcd34d; }
          .tag.active-water { background: rgba(14, 165, 233, 0.1); color: #0284c7; border-color: rgba(14, 165, 233, 0.3); }
          .theme-dark .tag.active-water { color: #38bdf8; }
          .tag.active-net { background: rgba(139, 92, 246, 0.1); color: #7c3aed; border-color: rgba(139, 92, 246, 0.3); }
          .theme-dark .tag.active-net { color: #a78bfa; }
          .tag.active-ws { background: rgba(16, 185, 129, 0.1); color: #059669; border-color: rgba(16, 185, 129, 0.3); }
          .theme-dark .tag.active-ws { color: #34d399; }

          .info-row { display: flex; flex-direction: column; gap: 4px; font-size: 13px; font-weight: 700; color: var(--text-sub); }
          .info-label { font-size: 11px; color: var(--text-sub); opacity: 0.8; }
          .info-value { color: var(--text-main); }

          .action-area { margin-top: auto; padding-top: 16px; border-top: 1px dashed var(--input-border); }
          .copy-btn { width: 100%; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff; border: none; border-radius: 12px; padding: 14px; font-weight: 900; font-size: 14px; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3); display: flex; align-items: center; justify-content: center; gap: 8px; }
          .copy-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(14, 165, 233, 0.5); }
          
          .empty-state { grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-sub); font-size: 16px; font-weight: 800; background: var(--card-bg); border-radius: 20px; border: 2px dashed var(--card-border); }

          #toast { visibility: hidden; min-width: 250px; background: #10b981; color: #fff; text-align: center; border-radius: 12px; padding: 16px 24px; position: fixed; z-index: 100; right: 24px; bottom: 40px; font-weight: bold; transition: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 10px 30px rgba(0,0,0,0.2); opacity: 0; transform: translateY(20px); }
          #toast.show { visibility: visible; opacity: 1; transform: translateY(0); }

          .fade-up-element { opacity: 0; transform: translateY(30px); transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
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
              placeholder="🔍 不動産名、エリア、備考から検索..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {/* 商材による絞り込み機能！ */}
            <div className="filter-group">
              <div className="filter-label">💡 取扱い商材で絞り込む：</div>
              <label className="filter-checkbox"><input type="checkbox" checked={filterGas} onChange={(e)=>setFilterGas(e.target.checked)} /> ガス</label>
              <label className="filter-checkbox"><input type="checkbox" checked={filterWater} onChange={(e)=>setFilterWater(e.target.checked)} /> 水道</label>
              <label className="filter-checkbox"><input type="checkbox" checked={filterNet} onChange={(e)=>setFilterNet(e.target.checked)} /> ネット</label>
              <label className="filter-checkbox"><input type="checkbox" checked={filterWs} onChange={(e)=>setFilterWs(e.target.checked)} /> WS</label>
            </div>
          </div>

          <div className="links-grid">
            {filteredData.length > 0 ? (
              filteredData.map((agency, index) => (
                <div key={agency.id} className="agency-card fade-up-element" style={{ transitionDelay: `${index * 0.05}s` }}>
                  
                  <div className="card-header">
                    <h3 className="agency-name">{agency.name}</h3>
                    {/* 重説確認がtrueなら目立つバッジを表示！ */}
                    {agency.needsExplanation && <span className="alert-badge">🚨 重説確認 必須</span>}
                  </div>
                  
                  {/* 取扱い商材タグ（直感的にわかるように色分け） */}
                  <div className="service-tags">
                    <span className={`tag ${agency.hasGas ? 'active-gas' : ''}`}>ガス</span>
                    <span className={`tag ${agency.hasWater ? 'active-water' : ''}`}>水道</span>
                    <span className={`tag ${agency.hasNet ? 'active-net' : ''}`}>ネット</span>
                    <span className={`tag ${agency.hasWs ? 'active-ws' : ''}`}>WS</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">📍 対象エリア</span>
                    <span className="info-value">{agency.area || "未設定"}</span>
                  </div>

                  {agency.note && (
                    <div className="info-row">
                      <span className="info-label">📝 備考</span>
                      <span className="info-value">{agency.note}</span>
                    </div>
                  )}

                  <div className="action-area">
                    <button className="copy-btn" onClick={() => copyToClipboard(agency.url, agency.name)}>
                      📋 OBJリンクをコピー
                    </button>
                  </div>

                </div>
              ))
            ) : (
              <div className="empty-state fade-up-element">
                👻 該当する不動産会社が見つかりませんでした。
              </div>
            )}
          </div>
        </div>

        <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>
      </main>
    </>
  );
}