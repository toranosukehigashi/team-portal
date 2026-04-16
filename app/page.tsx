"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// 🌟 高度技術①＆③＆⑤：超3Dパララックス魔法カード（中身がZ軸方向に浮き出る！）
const MagicCard = ({ title, attraction, desc, delay, onClick, badge, children }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // 深度を考慮した傾きを計算
    setTilt({ x: -(y / 20), y: x / 20 });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={cardRef}
      className="magic-card-wrapper fade-up-element"
      style={{ "--delay": `${delay}s` } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div className="magic-card" style={{ transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        <div className="card-glare" style={{ transform: `translate(${tilt.y * 3}px, ${-tilt.x * 3}px)` }} />
        
        {/* ✨ ここが進化！カード内部の要素をZ軸(手前)に押し出して立体感を出す */}
        <div className="card-content-3d">
          {badge && <span className="badge-new">{badge}</span>}
          <div className="attraction-name">{attraction}</div>
          <h2 className="card-title">{title}</h2>
          <p className="card-desc">{desc}</p>
          {children && <div className="card-custom-inner">{children}</div>}
        </div>
      </div>
    </div>
  );
};

// ✨ 高度技術⑨：イマーシブなピクシーダスト（星屑）
const PixieDust = () => {
  const [stars, setStars] = useState<{ id: number; left: string; top: string; delay: string; size: string }[]>([]);
  useEffect(() => {
    const generatedStars = Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      delay: `${Math.random() * 5}s`,
      size: `${Math.random() * 3 + 1}px`
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

export default function ThemeParkEntrance() {
  const router = useRouter();
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [userName, setUserName] = useState<string>("Guest");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // ✨ 到着フラッシュ
  const [showArrivalFlash, setShowArrivalFlash] = useState(false);

  const [newsText, setNewsText] = useState("【インフォメーション】本日はご来園ありがとうございます！魔法のワークスペースへようこそ！");
  const [isEditingNews, setIsEditingNews] = useState(false);
  const [tempNews, setTempNews] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("team_portal_user");
    if (savedUser) { setUserName(savedUser); if (savedUser.toLowerCase().trim().includes("toranosuke.higashi")) setIsAdmin(true); }
    
    if (sessionStorage.getItem("just_logged_in") === "true") {
      setShowArrivalFlash(true);
      sessionStorage.removeItem("just_logged_in");
      setTimeout(() => setShowArrivalFlash(false), 2000);
    }

    const savedMemo = localStorage.getItem("team_portal_quick_memo"); if (savedMemo) setMemoText(savedMemo);
    const savedNews = localStorage.getItem("team_portal_news"); if (savedNews) setNewsText(savedNews);
    
    setIsReady(true);

    // 🌟 高度技術⑥：スクロール連動トリガー（画面に入った瞬間に魔法陣展開）
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode; setIsDarkMode(newTheme);
    showToast(newTheme ? "🌌 ナイト・スペクタクルに切り替えました" : "🌅 デイライト・パレードに切り替えました");
  };

  const [isSimOpen, setIsSimOpen] = useState(false);
  const [targetDate, setTargetDate] = useState("");
  const [result, setResult] = useState<{ day3: string; day5Before: string; day5After: string } | null>(null);
  
  const [isKpiOpen, setIsKpiOpen] = useState(false);
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [memoText, setMemoText] = useState("");
  
  const [utilInput, setUtilInput] = useState("");
  const [utilResult, setUtilResult] = useState("ここにエリア（住所）の変換結果が表示されます。");

  useEffect(() => {
    const zipCode = utilInput.replace(/[^0-9]/g, "");
    if (zipCode.length === 7) {
      setUtilResult("🔍 魔法陣を展開中...");
      fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`)
        .then(res => res.json())
        .then(data => {
          if (data.results && data.results.length > 0) setUtilResult(`📍 ${data.results[0].address1} ${data.results[0].address2} ${data.results[0].address3}`);
          else setUtilResult("⚠️ 該当するエリアが見つかりませんでした");
        }).catch(() => setUtilResult("⚠️ 通信に乱れが生じています"));
    } else if (utilInput.length > 0 && !utilInput.match(/[0-9]/)) setUtilResult(`🔤 カナ変換魔法はバックエンド接続待ちです`);
    else if (utilInput.length === 0) setUtilResult("ここにエリア（住所）の変換結果が表示されます。");
    else setUtilResult("詠唱中...");
  }, [utilInput]);

  const showToast = (msg: string) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: "" }), 3000); };
  const handleLogout = () => { localStorage.removeItem("team_portal_user"); router.push("/login"); };
  const handleClockOut = async () => {
    const now = new Date(); const hours = String(now.getHours()).padStart(2, "0"); const minutes = String(now.getMinutes()).padStart(2, "0");
    try { await navigator.clipboard.writeText(`${hours}:${minutes} 退勤いたします`); showToast(`✨ 退勤の魔法を唱えました！お疲れ様でした！`); } catch (err) { alert("失敗しました"); }
  };

  const calculateDeadlines = (dateStr: string) => {
    if (!dateStr) return;
    const holidays = ["2026/01/01", "2026/01/02", "2026/01/12", "2026/02/11", "2026/02/23", "2026/03/20", "2026/04/29", "2026/05/03", "2026/05/04", "2026/05/05", "2026/05/06"]; 
    const baseDate = new Date(dateStr.replace(/-/g, "/")); baseDate.setHours(0, 0, 0, 0);
    const isRestDay = (date: Date) => { const day = date.getDay(); const formatted = `${date.getFullYear()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${("0" + date.getDate()).slice(-2)}`; return (day === 0 || day === 6) || holidays.includes(formatted); };
    const getDeadline = (days: number, is15AfterForce: boolean) => {
      let current = new Date(baseDate); let count = 0; let targetDays = (isRestDay(baseDate) || is15AfterForce) ? days + 1 : days;
      while (count < targetDays) { current.setDate(current.getDate() + 1); if (!isRestDay(current)) count++; }
      const week = ["日", "月", "火", "水", "木", "金", "土"]; return `${("0" + (current.getMonth() + 1)).slice(-2)}/${("0" + current.getDate()).slice(-2)}(${week[current.getDay()]})`;
    };
    setResult({ day3: getDeadline(3, false), day5Before: getDeadline(5, false), day5After: getDeadline(5, true) });
  };

  const handleOpenSim = () => {
    const today = new Date(); const y = today.getFullYear(); const m = String(today.getMonth() + 1).padStart(2, '0'); const d = String(today.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`; setTargetDate(todayStr); calculateDeadlines(todayStr); setIsSimOpen(true);
  };

  const handleSaveNews = () => { setNewsText(tempNews); localStorage.setItem("team_portal_news", tempNews); setIsEditingNews(false); showToast("📢 お知らせを更新しました！"); };
  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { const val = e.target.value; setMemoText(val); localStorage.setItem("team_portal_quick_memo", val); };
  const handleCopyMemo = async () => { if(memoText){ await navigator.clipboard.writeText(memoText); showToast("📋 記録を写し取りました！"); } };
  const handleClearMemo = () => { if(confirm("記録を消し去りますか？")){ setMemoText(""); localStorage.removeItem("team_portal_quick_memo"); } };
  const copyUtilResult = async () => { if (utilResult.includes("📍")) { try { await navigator.clipboard.writeText(utilResult.replace("📍 ", "")); showToast("📋 エリアをクリップボードに転送しました！"); } catch (err) { alert("失敗しました"); } } };

  const mockKpi = { current: 12, target: 20, members: [{ name: "山田", count: 5 }, { name: "佐藤", count: 4 }] };
  const progressPercent = Math.min(100, Math.round((mockKpi.current / mockKpi.target) * 100));

  return (
    <>
      {showArrivalFlash && <div className="arrival-flash"></div>}

      <div className={`entrance-bg ${isDarkMode ? "deep-night" : "twilight"}`}>
        <PixieDust />
      </div>

      <main className={`app-wrapper ${isReady ? "ready" : ""}`}>
        <style dangerouslySetInnerHTML={{ __html: `
          .app-wrapper * { box-sizing: border-box; }
          
          .arrival-flash { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #fff; z-index: 9999; pointer-events: none; animation: flashFadeOut 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
          @keyframes flashFadeOut { 0% { opacity: 1; filter: blur(10px); transform: scale(1.05); } 100% { opacity: 0; filter: blur(0); transform: scale(1); } }

          .entrance-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -2; transition: background 2s ease; }
          .entrance-bg.deep-night { background: radial-gradient(ellipse at bottom, #0f172a 0%, #020617 100%); }
          .entrance-bg.twilight { background: radial-gradient(ellipse at bottom, #1e3a8a 0%, #0f172a 100%); }

          .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; }
          .star { position: absolute; background: #fef08a; border-radius: 50%; box-shadow: 0 0 10px #fef08a, 0 0 20px #fef08a; animation: twinkle 4s infinite ease-in-out; }
          @keyframes twinkle { 0% { opacity: 0.1; transform: scale(0.5) translateY(0); } 50% { opacity: 1; transform: scale(1.2) translateY(-20px); } 100% { opacity: 0.1; transform: scale(0.5) translateY(0); } }

          /* 🌟 高度技術④：SVGアニメーション背景（魔法の軌跡） */
          .magic-svg-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none; opacity: 0.7; }
          .magic-path { fill: none; stroke: url(#magicGradient); stroke-width: 3; stroke-dasharray: 3000; stroke-dashoffset: 3000; animation: drawMagic 10s ease-in-out infinite alternate; filter: drop-shadow(0 0 15px rgba(255,255,255,0.8)); }
          @keyframes drawMagic { 0% { stroke-dashoffset: 3000; } 100% { stroke-dashoffset: 0; } }

          .app-wrapper { min-height: 100vh; padding: 20px; font-family: 'Inter', 'Noto Sans JP', sans-serif; overflow-x: hidden; position: relative; color: #fff; }

          .dashboard-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 10; }
          
          /* トップバー */
          .top-bar { display: flex; justify-content: flex-end; align-items: center; gap: 15px; margin-bottom: 30px; }
          .theme-toggle-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,215,0,0.3); padding: 10px 15px; border-radius: 20px; cursor: pointer; transition: 0.3s; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); backdrop-filter: blur(8px); }
          .theme-toggle-btn:hover { background: rgba(255,215,0,0.1); transform: scale(1.1); box-shadow: 0 0 15px rgba(250,204,21,0.4); }

          .user-profile { display: flex; align-items: center; gap: 12px; background: rgba(15,23,42,0.6); padding: 8px 25px 8px 8px; border-radius: 30px; backdrop-filter: blur(15px); border: 1px solid rgba(255,215,0,0.3); box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          .avatar-circle { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #fde047, #f59e0b); display: flex; align-items: center; justify-content: center; color: #451a03; font-weight: 900; font-size: 18px; box-shadow: 0 0 15px rgba(250,204,21,0.5); }
          .greeting-text { font-size: 11px; color: #cbd5e1; font-weight: 800; display: flex; flex-direction: column; line-height: 1.2; text-transform: uppercase; letter-spacing: 2px; }
          .user-id-text { font-size: 15px; font-weight: 900; color: #fde047; letter-spacing: 1px; }

          /* 🌟 高度技術②：クリップパス＆タイポグラフィアニメーション */
          .park-title-container { text-align: center; margin-bottom: 60px; padding: 40px 20px; position: relative; }
          .park-main-title { 
            font-size: 65px; font-weight: 900; letter-spacing: 4px; margin: 0 0 15px 0;
            background: linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
            background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            animation: shine 5s linear infinite; filter: drop-shadow(0 5px 15px rgba(250,204,21,0.2));
          }
          @keyframes shine { to { background-position: 200% center; } }
          
          .park-sub-title { color: #e2e8f0; font-size: 18px; font-weight: 800; letter-spacing: 8px; text-transform: uppercase; text-shadow: 0 2px 10px rgba(0,0,0,0.8); }

          /* アクションボタン（ Action-First） */
          .quick-actions { display: flex; gap: 20px; justify-content: center; margin-top: 40px; }
          .btn-qa { padding: 14px 30px; border: none; border-radius: 30px; font-size: 14px; font-weight: 900; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 2px; position: relative; overflow: hidden; }
          .btn-qa::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transition: 0.5s; }
          .btn-qa:hover::before { left: 100%; }

          .btn-clockout { background: linear-gradient(135deg, #ef4444, #9f1239); color: #fff; box-shadow: 0 10px 25px rgba(225, 29, 72, 0.4); }
          .btn-clockout:hover { transform: translateY(-3px) translateZ(10px); box-shadow: 0 15px 35px rgba(225, 29, 72, 0.6); }
          .btn-sim { background: rgba(30, 41, 59, 0.6); color: #fde047; border: 1px solid rgba(250, 204, 21, 0.5); backdrop-filter: blur(10px); box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          .btn-sim:hover { background: rgba(30, 41, 59, 0.9); transform: translateY(-3px) translateZ(10px); border-color: #fde047; box-shadow: 0 15px 35px rgba(250, 204, 21, 0.3); }

          /* お知らせティッカー */
          .news-ticker-wrapper { display: flex; align-items: center; background: rgba(15,23,42, 0.6); border: 1px solid rgba(255,215,0,0.2); border-radius: 20px; margin-bottom: 60px; padding: 12px 25px; box-shadow: 0 15px 40px rgba(0,0,0,0.6); backdrop-filter: blur(20px); }
          .news-badge { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; font-weight: 900; font-size: 13px; padding: 8px 18px; border-radius: 12px; white-space: nowrap; margin-right: 25px; animation: pulseGold 2s infinite; box-shadow: 0 0 15px rgba(245,158,11,0.4); letter-spacing: 2px; }
          @keyframes pulseGold { 0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(245, 158, 11, 0); } 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); } }
          .news-scroll-container { flex: 1; overflow: hidden; white-space: nowrap; position: relative; display: flex; align-items: center; }
          .news-text { display: inline-block; padding-left: 100%; animation: marquee 30s linear infinite; font-weight: 800; color: #fff; font-size: 16px; letter-spacing: 1px; }
          @keyframes marquee { 0% { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }

          /* 🌟 高度技術⑤＆⑥：アトラクションカード（Bento UI） */
          .attraction-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; perspective: 1200px; }
          
          /* ✨ 要素の浮き出しに関するCSSを安全に分離 */
          .fade-up-element { opacity: 0; transform: translateY(60px) scale(0.9); transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: var(--delay); }
          .fade-up-element.visible { opacity: 1; transform: translateY(0) scale(1); }
          
          /* マウスホバーでラッパー全体が少しだけ手前に来る（3D回転はJSのインラインスタイルで処理） */
          .magic-card-wrapper.visible:hover { transform: translateY(0) scale(1.02); z-index: 10; }

          .magic-card { background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.1); border-top: 1px solid rgba(255,255,255,0.2); border-radius: 28px; padding: 35px 30px; cursor: pointer; position: relative; overflow: hidden; transition: box-shadow 0.4s ease-out, border-color 0.4s; box-shadow: 0 20px 50px rgba(0,0,0,0.8); display: flex; flex-direction: column; gap: 15px; transform-style: preserve-3d; }
          .magic-card-wrapper:hover .magic-card { box-shadow: 0 30px 70px rgba(250, 204, 21, 0.4), inset 0 0 30px rgba(255,215,0,0.1); border-color: rgba(250, 204, 21, 0.6); }

          .card-glare { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 50%); pointer-events: none; z-index: 1; mix-blend-mode: overlay; }
          
          /* ✨ Z軸で中身が浮き出る */
          .card-content-3d { z-index: 2; position: relative; transform: translateZ(50px); transform-style: preserve-3d; }
          
          .attraction-name { font-size: 11px; color: #fde047; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; text-shadow: 0 0 10px rgba(250,204,21,0.5); }
          .card-title { font-size: 20px; font-weight: 900; color: #fff; margin: 0; text-shadow: 0 4px 15px rgba(0,0,0,0.9); line-height: 1.4; letter-spacing: 1px; }
          .card-desc { font-size: 14px; color: #94a3b8; margin: 10px 0 0 0; line-height: 1.6; font-weight: 700; transform: translateZ(20px); }
          .card-custom-inner { margin-top: 15px; transform: translateZ(30px); }
          
          .badge-new { position: absolute; top: -10px; right: -10px; background: linear-gradient(135deg, #ef4444, #b91c1c); color: #fff; font-size: 11px; font-weight: 900; padding: 6px 14px; border-radius: 20px; z-index: 3; box-shadow: 0 5px 15px rgba(225,29,72,0.5); letter-spacing: 2px; }

          /* KPI内部要素 */
          .kpi-widget { background: rgba(0,0,0,0.4); padding: 15px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); }
          .kpi-current { font-size: 28px; font-weight: 900; color: #38bdf8; text-shadow: 0 0 15px rgba(56,189,248,0.5); }
          .kpi-target { font-size: 14px; font-weight: 800; color: #94a3b8; }
          .kpi-bar-bg { width: 100%; height: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden; margin-top: 10px; }
          .kpi-bar-fill { height: 100%; background: linear-gradient(90deg, #38bdf8, #818cf8); border-radius: 5px; box-shadow: 0 0 10px rgba(56,189,248,0.6); }

          /* 浮遊ユーティリティ（魔法の杖） */
          .quick-utility { position: fixed; bottom: 40px; right: 40px; z-index: 1000; }
          .utility-fab { width: 70px; height: 70px; background: linear-gradient(135deg, #fbbf24, #d97706); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 15px 35px rgba(0,0,0,0.6), inset 0 0 15px rgba(255,255,255,0.6); transition: 0.3s; font-size: 28px; border: 2px solid rgba(255,255,255,0.6); list-style: none; }
          .utility-fab:hover { transform: scale(1.1) rotate(-10deg); box-shadow: 0 20px 40px rgba(245,158,11,0.6), 0 0 30px rgba(255,255,255,0.8); }
          .utility-fab::-webkit-details-marker { display: none; }
          .utility-content { position: absolute; bottom: 95px; right: 0; width: 360px; background: rgba(15,23,42, 0.95); backdrop-filter: blur(30px); padding: 30px; border-radius: 28px; box-shadow: 0 30px 70px rgba(0,0,0,0.8); border: 1px solid rgba(250,204,21,0.3); color: #fff; transform-origin: bottom right; animation: popIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
          @keyframes popIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }

          /* モーダル群 */
          .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(15px); z-index: 1000; display: flex; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: 0.3s; }
          .modal-overlay.open { opacity: 1; pointer-events: auto; }
          .custom-modal { background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(30px); width: 90%; padding: 40px; border-radius: 30px; box-shadow: 0 30px 80px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); transform: translateY(40px) scale(0.95); transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); display: flex; flex-direction: column; color: #fff; }
          .modal-overlay.open .custom-modal { transform: translateY(0) scale(1); }
          .modal-title { font-size: 24px; font-weight: 900; text-align: center; text-shadow: 0 0 20px rgba(255,255,255,0.4); margin-bottom: 30px; letter-spacing: 2px; }
          .btn-close-modal { width: 100%; margin-top: 30px; padding: 15px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 15px; font-weight: 900; cursor: pointer; transition: 0.2s; text-transform: uppercase; letter-spacing: 2px; }
          .btn-close-modal:hover { background: rgba(255,255,255,0.2); box-shadow: 0 0 15px rgba(255,255,255,0.2); }

          #toast { visibility: hidden; position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%) translateY(20px); padding: 16px 32px; background: rgba(15,23,42, 0.9); color: #fde047; border-radius: 30px; font-weight: 900; font-size: 15px; z-index: 2000; opacity: 0; transition: 0.4s; backdrop-filter: blur(20px); border: 1px solid rgba(250,204,21,0.4); box-shadow: 0 20px 50px rgba(0,0,0,0.6); letter-spacing: 1px; }
          #toast.show { visibility: visible; opacity: 1; transform: translateX(-50%) translateY(0); }
        `}} />

        {/* 🌟 高度技術④：SVGアニメーション背景（魔法の軌跡） */}
        <svg className="magic-svg-bg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="magicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
          <path className="magic-path" d="M -10,30 Q 30,80 50,50 T 110,40" />
          <path className="magic-path" d="M -10,70 Q 40,20 70,60 T 110,80" style={{animationDelay: "4s", opacity: 0.5}} />
        </svg>

        <div className="dashboard-inner">
          <div className="top-bar">
            <button className="theme-toggle-btn" onClick={toggleTheme} title="魔法の時間を切り替え">{isDarkMode ? "🎇" : "🌅"}</button>
            <div className="user-profile">
              <div className="avatar-circle">{userName.charAt(0).toUpperCase()}</div>
              <div className="greeting-text"><span>Welcome to</span><span className="user-id-text">{userName}'s Park</span></div>
            </div>
          </div>

          <div className="park-title-container fade-up-element" style={{ "--delay": "0s" } as any}>
            <h1 className="park-main-title">Team Portal Workspace</h1>
            <div className="park-sub-title">Where Work Meets Magic</div>
            <div className="quick-actions">
              <button className="btn-qa btn-sim" onClick={handleOpenSim}>⏳ 納期確認</button>
              <button className="btn-qa btn-clockout" onClick={handleClockOut}>🏃‍♂️ 退園する</button>
              <button className="btn-qa" style={{ background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", border: "1px solid rgba(239, 68, 68, 0.4)", textShadow:"none" }} onClick={handleLogout}>🚪 ログアウト</button>
            </div>
          </div>

          <div className="news-ticker-wrapper fade-up-element" style={{ "--delay": "0.1s" } as any}>
            <div className="news-badge">📢 パーク情報</div>
            <div className="news-scroll-container"><div className="news-text">{newsText}</div></div>
            {isAdmin && <button style={{background: "rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.4)", color:"#fff", fontSize:"12px", fontWeight:900, padding:"6px 12px", borderRadius:"8px", cursor:"pointer", marginLeft:"15px", textShadow:"none"}} onClick={() => { setTempNews(newsText); setIsEditingNews(!isEditingNews); }}>✏️ 編集</button>}
          </div>

          {isAdmin && isEditingNews && (
            <div style={{display:"flex", gap:"10px", marginBottom:"40px", background:"rgba(0,0,0,0.5)", padding:"20px", borderRadius:"16px", border:"1px dashed rgba(255,255,255,0.3)", backdropFilter:"blur(15px)"}}>
              <input type="text" style={{flex:1, padding:"12px", borderRadius:"10px", border:"1px solid rgba(255,255,255,0.3)", outline:"none", fontWeight:800, fontSize:"15px", background:"rgba(0,0,0,0.4)", color:"#fff"}} value={tempNews} onChange={(e) => setTempNews(e.target.value)} />
              <button style={{background:"linear-gradient(135deg, #6366f1, #8b5cf6)", color:"#fff", border:"none", padding:"0 25px", borderRadius:"10px", fontWeight:900, cursor:"pointer", textShadow:"none", boxShadow:"0 4px 15px rgba(99,102,241,0.4)"}} onClick={handleSaveNews}>保存</button>
            </div>
          )}

          {/* 🎡 Bento UI グリッド */}
          <div className="attraction-grid">
            {/* 🌟 修正ポイント：onClickの中身を setIsKpiOpen(true) から router.push("/kpi-detail") に変更！ */}
            <MagicCard delay={0.1} attraction="TOY STORY MANIA!" title="📊 獲得進捗・KPI" desc="おもちゃの世界でスコア（件数）を稼ごう！チームの獲得状況やランキングを確認できます。" onClick={() => router.push("/kpi-detail")}>
              <div className="kpi-widget">
                <div className="kpi-numbers"><span className="kpi-current">{mockKpi.current}</span><span className="kpi-target">/ {mockKpi.target}件</span></div>
                <div className="kpi-bar-bg"><div className="kpi-bar-fill" style={{ width: `${progressPercent}%` }}></div></div>
              </div>
            </MagicCard>

            <MagicCard delay={0.2} attraction="SPACE MOUNTAIN" title="📦 データ一括登録" desc="光の速さで宇宙へ！複数の顧客データを一括で処理し、データベースへ高速転送します。" onClick={() => router.push("/bulk-register")} />
            
            <MagicCard delay={0.3} attraction="BIG THUNDER MOUNTAIN" title="🌐 ネットトス連携" desc="荒野を駆け抜けろ！ネット回線のトスアップ用データを生成し、指定のシートへ送信します。" onClick={() => router.push("/net-toss")} />
            
            <MagicCard delay={0.4} attraction="JOURNEY TO THE CENTER" title="🤝 自己クロ連携" desc="地底深くへ潜入し、成約後の情報をサイバーUIでシームレスに連携します。" onClick={() => router.push("/self-close")} />
            
            <MagicCard delay={0.5} attraction="MONSTERS, INC." title="📱 SMS (Kraken) 作成" desc="ライトで照らして狙いを定め、SMS送信・履歴管理・テンプレート展開を行います。" onClick={() => router.push("/sms-kraken")} />
            
            <MagicCard delay={0.6} attraction="IT'S A SMALL WORLD" title="✉️ メールテンプレート" desc="世界中どこでも通じる言葉。用途に応じたメール文面を素早く作成し、コピーします。" onClick={() => router.push("/email-template")} />
            
            <MagicCard delay={0.7} attraction="SOARING: FANTASTIC FLIGHT" title="🗺️ Kraken 魔法の地図" badge="NEW" desc="大空を巡るように、プラン変更や住所変更などの複雑な操作手順を優雅にナビゲートします。" onClick={() => router.push("/procedure-wizard")} />
            
            <MagicCard delay={0.8} attraction="PIRATES OF THE CARIBBEAN" title="🆚 料金シミュレーター" badge="NEW" desc="隠された財宝（節約額）を発見せよ！お客様の利用状況から乗り換え時のトク額を即座に計算します。" onClick={() => router.push("/simulator")} />
            
            <MagicCard delay={0.9} attraction="TOWER OF TERROR" title="⚡ トラブル解決ナビ" badge="NEW" desc="恐怖のエラーから生還せよ！SWエラーやメアド重複などの複雑な対応を安全にナビゲートします。" onClick={() => router.push("/trouble-nav")} />

            <MagicCard delay={1.0} attraction="POOH'S HUNNY HUNT" title="🍯 クイック一時メモ" desc="はちみつのように甘くて便利な、一時的なテキストの退避に。ブラウザ自動保存。" onClick={() => setIsMemoOpen(true)}>
              {memoText && <div style={{padding:"12px", background:"rgba(0,0,0,0.4)", borderRadius:"8px", fontSize:"13px", color:"#fde047", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", border:"1px dashed rgba(250,204,21,0.3)"}}>{memoText}</div>}
            </MagicCard>
          </div>
        </div>

        {/* 🔍 浮遊ユーティリティ（魔法の杖） */}
        <details className="quick-utility">
          <summary className="utility-fab">🪄</summary>
          <div className="utility-content">
            <h4 style={{margin: "0 0 15px 0", fontSize: "16px", fontWeight: 900, color: "#fde047", borderBottom: "2px dashed rgba(250,204,21,0.3)", paddingBottom: "10px"}}>🏰 エリア（住所）クイック検索</h4>
            <input type="text" placeholder="郵便番号を入力 (例: 1000001)" style={{width:"100%", padding:"14px", borderRadius:"12px", border:"2px solid rgba(255,255,255,0.2)", fontSize:"15px", outline:"none", background:"rgba(0,0,0,0.5)", fontWeight:800, color:"#fff"}} value={utilInput} onChange={(e) => setUtilInput(e.target.value)} />
            <div style={{marginTop:"15px", fontSize:"14px", color:"#fff", background:"rgba(255,255,255,0.1)", padding:"15px", borderRadius:"12px", border:"1px solid rgba(250,204,21,0.3)", fontWeight:900, cursor:"pointer", textShadow:"0 2px 4px rgba(0,0,0,0.8)"}} onClick={copyUtilResult}>{utilResult}</div>
          </div>
        </details>

        {/* ⏳ 納期シミュレーター モーダル */}
        <div className={`modal-overlay ${isSimOpen ? "open" : ""}`} onClick={() => setIsSimOpen(false)}>
          <div className="custom-modal" style={{maxWidth: "400px"}} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">⏳ 納期（ファストパス）確認</div>
            <label style={{ fontSize: "12px", fontWeight: 900, color: "#cbd5e1", marginBottom: "8px", display: "block" }}>基準日（受付日）を変更</label>
            <input type="date" style={{width:"100%", padding:"14px", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.3)", fontSize:"16px", fontWeight:900, color:"#fff", outline:"none", marginBottom:"25px", background:"rgba(0,0,0,0.4)"}} value={targetDate} onChange={(e) => { setTargetDate(e.target.value); calculateDeadlines(e.target.value); }} />
            {result && (
              <div style={{background:"rgba(0,0,0,0.4)", borderRadius:"16px", padding:"20px", display:"flex", flexDirection:"column", gap:"12px", border:"1px solid rgba(255,255,255,0.2)"}}>
                <div style={{display:"flex", justifyContent:"space-between", borderBottom:"1px dashed rgba(255,255,255,0.2)", paddingBottom:"10px"}}><span style={{fontSize:"13px", fontWeight:800, color:"#cbd5e1"}}>3日後（通常）</span><span style={{fontSize:"16px", fontWeight:900, color:"#fde047", textShadow:"0 0 10px rgba(253,224,71,0.5)"}}>{result.day3}</span></div>
                <div style={{display:"flex", justifyContent:"space-between", borderBottom:"1px dashed rgba(255,255,255,0.2)", paddingBottom:"10px"}}><span style={{fontSize:"13px", fontWeight:800, color:"#cbd5e1"}}>5日後（15時前）</span><span style={{fontSize:"16px", fontWeight:900, color:"#fde047", textShadow:"0 0 10px rgba(253,224,71,0.5)"}}>{result.day5Before}</span></div>
                <div style={{display:"flex", justifyContent:"space-between"}}><span style={{fontSize:"13px", fontWeight:800, color:"#cbd5e1"}}>5日後（15時後）</span><span style={{fontSize:"16px", fontWeight:900, color:"#fde047", textShadow:"0 0 10px rgba(253,224,71,0.5)"}}>{result.day5After}</span></div>
              </div>
            )}
            <button className="btn-close-modal" onClick={() => { setIsSimOpen(false); setResult(null); setTargetDate(""); }}>閉じる</button>
          </div>
        </div>

        {/* 📝 一時メモ モーダル */}
        <div className={`modal-overlay ${isMemoOpen ? "open" : ""}`} onClick={() => setIsMemoOpen(false)}>
          <div className="custom-modal" style={{maxWidth: "600px", height: "80vh"}} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">🍯 クイック一時メモ</div>
            <textarea style={{flex:1, width:"100%", padding:"20px", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.3)", fontSize:"16px", lineHeight:1.6, outline:"none", resize:"none", background:"rgba(0,0,0,0.4)", color:"#fde047", fontWeight:700}} placeholder="電話中のメモや、一時的なテキストの退避に。&#10;入力した内容は自動でブラウザに保存されます。" value={memoText} onChange={handleMemoChange} />
            <div style={{display:"flex", gap:"15px", marginTop:"20px"}}>
              <button style={{flex:1, padding:"14px", borderRadius:"14px", fontWeight:900, border:"1px solid rgba(250, 204, 21, 0.6)", background:"rgba(250, 204, 21, 0.2)", color:"#fde047", cursor:"pointer", transition:"0.2s"}} onClick={handleCopyMemo}>📋 全文コピー</button>
              <button style={{flex:1, padding:"14px", borderRadius:"14px", fontWeight:900, border:"1px solid rgba(225, 29, 72, 0.6)", background:"rgba(225, 29, 72, 0.3)", color:"#fda4af", cursor:"pointer", transition:"0.2s"}} onClick={handleClearMemo}>🗑️ 全消去</button>
            </div>
            <button className="btn-close-modal" onClick={() => setIsMemoOpen(false)}>閉じる</button>
          </div>
        </div>

        <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>
      </main>
    </>
  );
}