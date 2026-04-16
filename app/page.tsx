"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// 🌟 高度技術①＆③：3Dパララックス魔法カード（中身は元のテキスト！）
const MagicCard = ({ title, desc, delay, onClick, badge, children }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({ x: -(y / 15), y: x / 15 });
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
      <div className="magic-card" style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1, 1, 1)` }}>
        <div className="card-glare" style={{ transform: `translate(${tilt.y * 2}px, ${-tilt.x * 2}px)` }} />
        {badge && <span className="badge-new">{badge}</span>}
        <h2 className="card-title">{title}</h2>
        <p className="card-desc">{desc}</p>
        {children && <div className="card-content-inner">{children}</div>}
      </div>
    </div>
  );
};

// ✨ 背景の魔法の星屑（パーティクル）
const MagicParticles = () => {
  const [stars, setStars] = useState<{ id: number; left: string; top: string; delay: string; size: string }[]>([]);
  useEffect(() => {
    const generatedStars = Array.from({ length: 50 }).map((_, i) => ({
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
  const [showWarpExit, setShowWarpExit] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(true);

  const [newsText, setNewsText] = useState("【お知らせ】新システム「Team Portal」稼働開始！本日はご来園ありがとうございます！");
  const [isEditingNews, setIsEditingNews] = useState(false);
  const [tempNews, setTempNews] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("team_portal_user");
    if (savedUser) { setUserName(savedUser); if (savedUser.toLowerCase().trim().includes("toranosuke.higashi")) setIsAdmin(true); }
    if (sessionStorage.getItem("just_logged_in") === "true") { setShowWarpExit(true); sessionStorage.removeItem("just_logged_in"); }
    const savedMemo = localStorage.getItem("team_portal_quick_memo"); if (savedMemo) setMemoText(savedMemo);
    const savedNews = localStorage.getItem("team_portal_news"); if (savedNews) setNewsText(savedNews);
    
    setIsReady(true);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode; setIsDarkMode(newTheme);
    showToast(newTheme ? "🎇 エレクトリカル・ナイトに切り替えました" : "🌅 トワイライト・イブニングに切り替えました");
  };

  const [isSimOpen, setIsSimOpen] = useState(false);
  const [targetDate, setTargetDate] = useState("");
  const [result, setResult] = useState<{ day3: string; day5Before: string; day5After: string } | null>(null);
  const [isKpiOpen, setIsKpiOpen] = useState(false);
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [memoText, setMemoText] = useState("");
  const [utilInput, setUtilInput] = useState("");
  const [utilResult, setUtilResult] = useState("ここに変換結果や住所が表示されます。");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const zipCode = utilInput.replace(/[^0-9]/g, "");
    if (zipCode.length === 7) {
      setIsSearching(true); setUtilResult("🔍 検索中...");
      fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`)
        .then(res => res.json())
        .then(data => {
          if (data.results && data.results.length > 0) setUtilResult(`📍 ${data.results[0].address1} ${data.results[0].address2} ${data.results[0].address3}`);
          else setUtilResult("⚠️ 該当する住所が見つかりませんでした");
        }).catch(() => setUtilResult("⚠️ 通信エラーが発生しました")).finally(() => setIsSearching(false));
    } else if (utilInput.length > 0 && !utilInput.match(/[0-9]/)) setUtilResult(`🔤 カナ変換APIはバックエンド接続待ちです`);
    else if (utilInput.length === 0) setUtilResult("ここに変換結果や住所が表示されます。");
    else setUtilResult("入力中...");
  }, [utilInput]);

  const showToast = (msg: string) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: "" }), 3000); };
  const handleLogout = () => { localStorage.removeItem("team_portal_user"); router.push("/login"); };
  const handleClockOut = async () => {
    const now = new Date(); const hours = String(now.getHours()).padStart(2, "0"); const minutes = String(now.getMinutes()).padStart(2, "0");
    try { await navigator.clipboard.writeText(`${hours}:${minutes} 退勤いたします`); showToast(`✨ 退勤メッセージをコピーしました！`); } catch (err) { alert("コピー失敗"); }
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

  const handleSaveNews = () => { setNewsText(tempNews); localStorage.setItem("team_portal_news", tempNews); setIsEditingNews(false); showToast("📢 お知らせを更新しました！"); };
  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { const val = e.target.value; setMemoText(val); localStorage.setItem("team_portal_quick_memo", val); };
  const handleCopyMemo = async () => { if(memoText){ await navigator.clipboard.writeText(memoText); showToast("📋 メモをコピーしました！"); } };
  const handleClearMemo = () => { if(confirm("メモを消去しますか？")){ setMemoText(""); localStorage.removeItem("team_portal_quick_memo"); } };
  const copyUtilResult = async () => { if (utilResult.includes("📍")) { try { await navigator.clipboard.writeText(utilResult.replace("📍 ", "")); showToast("📋 住所をコピーしました！"); } catch (err) { alert("コピー失敗"); } } };

  const mockKpi = { current: 12, target: 20, members: [{ name: "山田", count: 5 }, { name: "佐藤", count: 4 }] };
  const progressPercent = Math.min(100, Math.round((mockKpi.current / mockKpi.target) * 100));

  return (
    <>
      <div className={`entrance-bg ${isDarkMode ? "deep-night" : "twilight"}`}>
        <MagicParticles />
      </div>

      <main className={`app-wrapper ${showWarpExit ? "animate-warp-arrival" : ""} ${isReady ? "ready" : ""}`}>
        <style dangerouslySetInnerHTML={{ __html: `
          .app-wrapper * { box-sizing: border-box; }
          
          .entrance-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -2; transition: background 1.5s ease; }
          .entrance-bg.deep-night { background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%); }
          .entrance-bg.twilight { background: radial-gradient(ellipse at bottom, #2d1b4e 0%, #0f172a 100%); }

          .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; }
          .star { position: absolute; background: #fff; border-radius: 50%; box-shadow: 0 0 10px #fff, 0 0 20px #fff; animation: twinkle 4s infinite ease-in-out; }
          @keyframes twinkle { 0% { opacity: 0.1; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1.2); } 100% { opacity: 0.1; transform: scale(0.5); } }

          .magic-svg-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none; opacity: 0.7; }
          .magic-path { fill: none; stroke: url(#magicGradient); stroke-width: 3; stroke-dasharray: 3000; stroke-dashoffset: 3000; animation: drawMagic 8s ease-in-out infinite alternate; filter: drop-shadow(0 0 12px rgba(255,255,255,0.8)); }
          @keyframes drawMagic { 0% { stroke-dashoffset: 3000; } 100% { stroke-dashoffset: 0; } }

          .app-wrapper { min-height: 100vh; padding: 20px; font-family: "Helvetica Neue", Arial, sans-serif; overflow-x: hidden; position: relative; color: #fff; }
          .app-wrapper.animate-warp-arrival { animation: warpArrivalEffect 1.2s cubic-bezier(0.1, 1, 0.2, 1) forwards; transform-origin: center center; }
          @keyframes warpArrivalEffect { 0% { opacity: 0; filter: blur(50px) brightness(4); transform: scale(0.1) translateZ(-1000px); } 100% { opacity: 1; filter: blur(0) brightness(1); transform: scale(1) translateZ(0); } }

          .dashboard-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 10; }
          .top-bar { display: flex; justify-content: flex-end; align-items: center; gap: 15px; margin-bottom: 20px; }
          
          .theme-toggle-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); padding: 8px 12px; border-radius: 20px; cursor: pointer; transition: 0.3s; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); backdrop-filter: blur(8px); color: #fff; }
          .theme-toggle-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.1) rotate(10deg); }

          .user-profile { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.1); padding: 8px 20px 8px 8px; border-radius: 30px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: 0.3s; }
          .avatar-circle { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #fcd34d, #f43f5e); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 15px; box-shadow: 0 2px 10px rgba(244,63,94,0.6); }
          .greeting-text { font-size: 11px; color: #cbd5e1; font-weight: 800; display: flex; flex-direction: column; line-height: 1.2; text-transform: uppercase; letter-spacing: 1px; }
          .user-id-text { font-size: 15px; font-weight: 900; color: #fff; letter-spacing: 0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }

          .park-title-container { text-align: center; margin-bottom: 50px; position: relative; padding: 40px 20px; }
          .park-main-title { font-size: 60px; font-weight: 900; letter-spacing: 3px; background: linear-gradient(to right, #fde047, #fbcfe8, #38bdf8, #fde047); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shine 4s linear infinite; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); margin: 0 0 15px 0; filter: drop-shadow(0 4px 10px rgba(253,224,71,0.3)); }
          @keyframes shine { to { background-position: 200% center; } }
          .park-sub-title { color: #f8fafc; font-size: 16px; font-weight: 800; letter-spacing: 5px; text-transform: uppercase; text-shadow: 0 2px 10px rgba(255,255,255,0.5); }

          .quick-actions { display: flex; gap: 15px; justify-content: center; margin-top: 30px; }
          .btn-qa { padding: 12px 24px; border: none; border-radius: 30px; font-size: 14px; font-weight: 900; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.4); text-transform: uppercase; letter-spacing: 1px; }
          .btn-clockout { background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; }
          .btn-clockout:hover { transform: translateY(-3px) scale(1.05); box-shadow: 0 10px 25px rgba(249, 115, 22, 0.6); }
          .btn-sim { background: rgba(255, 255, 255, 0.1); color: #fff; border: 1px solid rgba(255,255,255,0.4); backdrop-filter: blur(8px); }
          .btn-sim:hover { background: rgba(255, 255, 255, 0.2); transform: translateY(-3px) scale(1.05); box-shadow: 0 10px 25px rgba(255, 255, 255, 0.2); }

          .news-ticker-wrapper { display: flex; align-items: center; background: rgba(0,0,0, 0.4); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 20px; margin-bottom: 50px; padding: 12px 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(15px); }
          .news-badge { background: linear-gradient(135deg, #ec4899, #f43f5e); color: #fff; font-weight: 900; font-size: 12px; padding: 6px 14px; border-radius: 12px; white-space: nowrap; margin-right: 20px; animation: pulse 2s infinite; box-shadow: 0 0 15px rgba(244,63,94,0.6); letter-spacing: 1px; }
          @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.6); } 70% { box-shadow: 0 0 0 10px rgba(244, 63, 94, 0); } 100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); } }
          .news-scroll-container { flex: 1; overflow: hidden; white-space: nowrap; position: relative; display: flex; align-items: center; }
          .news-text { display: inline-block; padding-left: 100%; animation: marquee 25s linear infinite; font-weight: 800; color: #fff; font-size: 15px; text-shadow: 0 2px 5px rgba(0,0,0,0.8); }
          @keyframes marquee { 0% { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }

          /* 🌟 高度技術①・③：魔法のカード（テキストは完全維持！） */
          .attraction-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
          
          .magic-card-wrapper { perspective: 1200px; opacity: 0; transform: translateY(60px); transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: var(--delay); }
          .magic-card-wrapper.visible { opacity: 1; transform: translateY(0); }

          .magic-card { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 24px; padding: 30px 25px; cursor: pointer; position: relative; overflow: hidden; transition: transform 0.1s ease-out, box-shadow 0.2s ease-out, border-color 0.2s; box-shadow: 0 15px 35px rgba(0,0,0,0.6); display: flex; flex-direction: column; gap: 12px; }
          
          .magic-card-wrapper:hover .magic-card { box-shadow: 0 30px 60px rgba(139, 92, 246, 0.6), inset 0 0 30px rgba(255,255,255,0.1); border-color: rgba(167, 139, 250, 0.8); }

          .card-glare { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 60%); pointer-events: none; transition: transform 0.1s ease-out; z-index: 1; mix-blend-mode: overlay; }
          
          .card-title { font-size: 18px; font-weight: 900; color: #fff; margin: 0; z-index: 2; position: relative; text-shadow: 0 2px 5px rgba(0,0,0,0.9); line-height: 1.4; letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px; }
          .card-desc { font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.6; z-index: 2; position: relative; font-weight: 700; text-shadow: 0 1px 3px rgba(0,0,0,0.9); }
          .card-content-inner { z-index: 2; position: relative; margin-top: 5px; }
          .badge-new { position: absolute; top: 15px; right: 15px; background: linear-gradient(135deg, #f43f5e, #e11d48); color: #fff; font-size: 10px; font-weight: 900; padding: 4px 10px; border-radius: 20px; z-index: 3; box-shadow: 0 4px 10px rgba(225,29,72,0.6); text-shadow: none; letter-spacing: 1px; }

          /* 内部要素（KPI・メモ） */
          .kpi-widget { background: rgba(0,0,0,0.3); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
          .kpi-numbers { display: flex; align-items: baseline; gap: 5px; margin-bottom: 8px; }
          .kpi-current { font-size: 24px; font-weight: 900; color: #f472b6; line-height: 1; text-shadow: 0 0 10px rgba(244,114,182,0.5); }
          .kpi-target { font-size: 13px; font-weight: 800; color: #cbd5e1; }
          .kpi-bar-bg { width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
          .kpi-bar-fill { height: 100%; background: linear-gradient(90deg, #f472b6, #ec4899); border-radius: 4px; transition: width 1s ease-out; box-shadow: 0 0 10px rgba(236,72,153,0.5); }
          .memo-preview { padding: 8px 12px; background: rgba(0,0,0,0.3); border-radius: 8px; font-size: 12px; color: #cbd5e1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border: 1px dashed rgba(255,255,255,0.2); }

          /* モーダル群 */
          .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(15px); z-index: 1000; display: flex; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: 0.3s; }
          .modal-overlay.open { opacity: 1; pointer-events: auto; }
          .custom-modal { background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(30px); width: 90%; padding: 40px; border-radius: 30px; box-shadow: 0 30px 80px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); transform: translateY(40px) scale(0.95); transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); display: flex; flex-direction: column; color: #fff; }
          .modal-overlay.open .custom-modal { transform: translateY(0) scale(1); }
          .modal-title { font-size: 24px; font-weight: 900; text-align: center; text-shadow: 0 0 20px rgba(255,255,255,0.4); margin-bottom: 30px; letter-spacing: 2px; }
          .btn-close-modal { width: 100%; margin-top: 30px; padding: 15px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 15px; font-weight: 900; cursor: pointer; transition: 0.2s; text-transform: uppercase; letter-spacing: 2px; }
          .btn-close-modal:hover { background: rgba(255,255,255,0.2); box-shadow: 0 0 15px rgba(255,255,255,0.2); }
          
          /* 浮遊ユーティリティ */
          .quick-utility { position: fixed; bottom: 40px; right: 40px; z-index: 1000; }
          .utility-fab { width: 65px; height: 65px; background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 0 10px rgba(255,255,255,0.5); transition: 0.3s; font-size: 26px; border: 2px solid rgba(255,255,255,0.4); text-shadow: none; list-style: none; }
          .utility-fab:hover { transform: scale(1.15) translateY(-5px); box-shadow: 0 15px 40px rgba(139, 92, 246, 0.8), 0 0 20px rgba(255,255,255,0.5); }
          .utility-fab::-webkit-details-marker { display: none; }
          .utility-content { position: absolute; bottom: 90px; right: 0; width: 340px; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(25px); padding: 25px; border-radius: 24px; box-shadow: 0 25px 60px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); color: #fff; }
          
          #toast { visibility: hidden; position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%) translateY(20px); padding: 14px 28px; background: rgba(255, 255, 255, 0.15); color: #fff; border-radius: 30px; font-weight: 900; font-size: 14px; z-index: 2000; opacity: 0; transition: 0.4s; backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.3); box-shadow: 0 15px 40px rgba(0,0,0,0.5); text-shadow: none; }
          #toast.show { visibility: visible; opacity: 1; transform: translateX(-50%) translateY(0); }
        `}} />

        {/* 🌟 SVG魔法の軌跡 */}
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
              <button className="btn-qa btn-sim" onClick={() => setIsSimOpen(true)}>⏳ 納期確認</button>
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

          {/* 🎡 各項目：見た目は魔法カード、名前と説明文は1ミリも変えずに完全復元！！ */}
          <div className="attraction-grid">
            <MagicCard delay={0.1} title="📊 本日の進捗・KPI" desc="チーム全体の獲得状況。クリックでメンバー別の詳細やランキングを確認できます。" onClick={() => setIsKpiOpen(true)}>
              <div className="kpi-widget">
                <div className="kpi-numbers"><span className="kpi-current">{mockKpi.current}</span><span className="kpi-target">/ {mockKpi.target}件</span></div>
                <div className="kpi-bar-bg"><div className="kpi-bar-fill" style={{ width: `${progressPercent}%` }}></div></div>
              </div>
            </MagicCard>

            <MagicCard delay={0.2} title="📦 データ一括登録システム" desc="複数の顧客データを一括で処理し、データベースへ高速登録します。" onClick={() => router.push("/bulk-register")} />

            <MagicCard delay={0.3} title="🌐 ネットトス連携ツール" desc="ネット回線のトスアップ用データを生成し、指定のシートへ送信します。" onClick={() => router.push("/net-toss")} />

            <MagicCard delay={0.4} title="🤝 自己クロ連携ツール" desc="サイバーUI仕様の入力フォーム。成約後の情報をシームレスに連携します。" onClick={() => router.push("/self-close")} />
            
            <MagicCard delay={0.5} title="📱 SMS（kraken）作成" desc="Kraken連携を用いたSMS送信・履歴管理・テンプレート展開を行います。" onClick={() => router.push("/sms-kraken")} />
            
            <MagicCard delay={0.6} title="✉️ メールテンプレート" desc="用途に応じたメール文面を素早く作成し、ワンクリックでコピーします。" onClick={() => router.push("/email-template")} />

            {/* この「Krakenマニュアル」を開いた先で、あの「ソアリン・フライト」を爆発させます！🦅 */}
            <MagicCard delay={0.7} title="🐙 Kraken マニュアル" badge="NEW" desc="プラン変更や住所変更など、各手続きに必要な情報を入力し、Kraken提出用フォーマットを自動生成します。" onClick={() => router.push("/procedure-wizard")} />

            <MagicCard delay={0.8} title="🆚 通信費 見直しシミュレーター" badge="NEW" desc="現在の利用状況をヒアリングし、乗り換え時のおトク額（実質無料など）を即座に算出します。" onClick={() => router.push("/simulator")} />

            <MagicCard delay={0.9} title="🛠️ トラブル解決ナビゲーター" badge="NEW" desc="SWエラーやメアド重複など、複雑なイレギュラー対応の手順を対話形式でご案内します。" onClick={() => router.push("/trouble-nav")} />

            <MagicCard delay={1.0} title="📝 クイック一時メモ" desc="通話中などに一時的に情報を置いておく、ブラウザ自動保存のスクラッチパッド。" onClick={() => setIsMemoOpen(true)}>
              {memoText && <div className="memo-preview">{memoText}</div>}
            </MagicCard>
          </div>
        </div>

        {/* 🔍 浮遊ユーティリティ */}
        <details className="quick-utility">
          <summary className="utility-fab">🔍</summary>
          <div className="utility-content">
            <h4 style={{margin: "0 0 15px 0", fontSize: "16px", fontWeight: 900, color: "#fff", borderBottom: "2px dashed rgba(255,255,255,0.3)", paddingBottom: "10px"}}>🔤 住所クイック検索</h4>
            <input type="text" placeholder="郵便番号 (例: 1000001)" style={{width:"100%", padding:"14px", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.3)", fontSize:"15px", outline:"none", background:"rgba(0,0,0,0.4)", fontWeight:800, color:"#fff"}} value={utilInput} onChange={(e) => setUtilInput(e.target.value)} />
            <div style={{marginTop:"15px", fontSize:"14px", color:"#cbd5e1", background:"rgba(0,0,0,0.4)", padding:"15px", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.2)", fontWeight:900, cursor:"pointer", textShadow:"0 1px 3px rgba(0,0,0,0.8)"}} onClick={copyUtilResult}>{utilResult}</div>
          </div>
        </details>

        {/* モーダル群 (KPI・メモ等の中身は今まで通り維持) */}
        {/* ⏳ 納期シミュレーター */}
        <div className={`modal-overlay ${isSimOpen ? "open" : ""}`} onClick={() => setIsSimOpen(false)}>
          <div className="custom-modal" style={{maxWidth: "400px"}} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">⏳ 納期シミュレーター</div>
            <label style={{ fontSize: "12px", fontWeight: 900, color: "#cbd5e1", marginBottom: "8px", display: "block" }}>基準日（受付日）を変更</label>
            <input type="date" style={{width:"100%", padding:"14px", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.3)", fontSize:"16px", fontWeight:900, color:"#fff", outline:"none", marginBottom:"25px", background:"rgba(0,0,0,0.4)"}} value={targetDate} onChange={(e) => { setTargetDate(e.target.value); calculateDeadlines(e.target.value); }} />
            {result && (
              <div style={{background:"rgba(0,0,0,0.4)", borderRadius:"16px", padding:"20px", display:"flex", flexDirection:"column", gap:"12px", border:"1px solid rgba(255,255,255,0.2)"}}>
                <div style={{display:"flex", justifyContent:"space-between", borderBottom:"1px dashed rgba(255,255,255,0.2)", paddingBottom:"10px"}}><span style={{fontSize:"13px", fontWeight:800, color:"#cbd5e1"}}>3日後（通常）</span><span style={{fontSize:"16px", fontWeight:900, color:"#a5b4fc", textShadow:"0 0 10px rgba(165,180,252,0.5)"}}>{result.day3}</span></div>
                <div style={{display:"flex", justifyContent:"space-between", borderBottom:"1px dashed rgba(255,255,255,0.2)", paddingBottom:"10px"}}><span style={{fontSize:"13px", fontWeight:800, color:"#cbd5e1"}}>5日後（15時前）</span><span style={{fontSize:"16px", fontWeight:900, color:"#a5b4fc", textShadow:"0 0 10px rgba(165,180,252,0.5)"}}>{result.day5Before}</span></div>
                <div style={{display:"flex", justifyContent:"space-between"}}><span style={{fontSize:"13px", fontWeight:800, color:"#cbd5e1"}}>5日後（15時後）</span><span style={{fontSize:"16px", fontWeight:900, color:"#a5b4fc", textShadow:"0 0 10px rgba(165,180,252,0.5)"}}>{result.day5After}</span></div>
              </div>
            )}
            <button className="btn-close-modal" onClick={() => { setIsSimOpen(false); setResult(null); setTargetDate(""); }}>閉じる</button>
          </div>
        </div>

        {/* 📊 KPI モーダル */}
        <div className={`modal-overlay ${isKpiOpen ? "open" : ""}`} onClick={() => setIsKpiOpen(false)}>
          <div className="custom-modal" style={{maxWidth: "450px"}} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">📊 本日の進捗詳細</div>
            <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "15px", border: "1px solid rgba(255,255,255,0.2)" }}>
              <div style={{ textAlign: "center", marginBottom: "5px" }}>
                <span style={{ fontSize: "40px", fontWeight: 900, color: "#f472b6", textShadow: "0 0 15px rgba(244,114,182,0.6)" }}>{mockKpi.current}</span><span style={{ color: "#cbd5e1", fontSize: "14px", fontWeight: 800 }}> / 目標 {mockKpi.target}件</span>
              </div>
              <div style={{ width: "100%", height: "10px", background: "rgba(255,255,255,0.15)", borderRadius: "5px", overflow: "hidden" }}><div style={{ height: "100%", width: `${progressPercent}%`, background: "linear-gradient(90deg, #f472b6, #ec4899)", transition: "width 1s ease-out", boxShadow: "0 0 10px rgba(236,72,153,0.6)" }}></div></div>
              <div style={{ textAlign: "right", fontSize: "13px", fontWeight: 900, color: "#ec4899" }}>達成率 {progressPercent}%</div>
            </div>
            <div style={{ marginTop: "20px" }}>
              <div style={{ fontSize: "13px", fontWeight: 900, color: "#cbd5e1", marginBottom: "10px", marginLeft: "5px" }}>メンバー別 内訳</div>
              {mockKpi.members.map((member, index) => (
                <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "12px 20px", background: "rgba(0,0,0,0.4)", borderRadius: "12px", marginBottom: "10px", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <span style={{ color: "#fff", fontWeight: 800 }}>👤 {member.name}</span><span style={{ fontWeight: 900, color: "#ec4899" }}>{member.count} 件</span>
                </div>
              ))}
            </div>
            <button className="btn-close-modal" onClick={() => setIsKpiOpen(false)}>閉じる</button>
          </div>
        </div>

        {/* 📝 一時メモ モーダル */}
        <div className={`modal-overlay ${isMemoOpen ? "open" : ""}`} onClick={() => setIsMemoOpen(false)}>
          <div className="custom-modal" style={{maxWidth: "600px", height: "80vh"}} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">📝 クイック一時メモ</div>
            <textarea style={{flex:1, width:"100%", padding:"20px", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.3)", fontSize:"16px", lineHeight:1.6, outline:"none", resize:"none", background:"rgba(0,0,0,0.4)", color:"#fff", fontWeight:700}} placeholder="電話中のメモや、一時的なテキストの退避に。&#10;入力した内容は自動でブラウザに保存されます。" value={memoText} onChange={handleMemoChange} />
            <div style={{display:"flex", gap:"15px", marginTop:"20px"}}>
              <button style={{flex:1, padding:"14px", borderRadius:"14px", fontWeight:900, border:"1px solid rgba(79, 70, 229, 0.6)", background:"rgba(79, 70, 229, 0.3)", color:"#a5b4fc", cursor:"pointer", transition:"0.2s"}} onClick={handleCopyMemo}>📋 全文コピー</button>
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