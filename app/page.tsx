"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// 🌟 3Dパララックス ＆ オーロラボーダー ＆ 流体フロート・カード
const MagicCard = ({ title, attraction, desc, delay, onClick, badge, children, liveData, sparkline }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({ x: -(y / 25), y: x / 25 });

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${mouseX}px`);
    cardRef.current.style.setProperty('--mouse-y', `${mouseY}px`);
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={cardRef}
      className="magic-card-wrapper fade-up-element fluid-card"
      style={{ "--delay": `${delay}s` } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div className="magic-card glitch-hover" style={{ transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        <div className="card-aurora-border"></div>
        {/* 📉 マイクロ・チャート（Sparkline） */}
        {sparkline && (
          <svg className="sparkline-bg" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path d="M0,28 Q10,15 20,22 T40,10 T60,18 T80,5 T100,12" fill="none" stroke="var(--accent-color)" strokeWidth="1.5" opacity="0.3" />
            <path d="M0,28 Q10,15 20,22 T40,10 T60,18 T80,5 T100,12 L100,30 L0,30 Z" fill="url(#sparkline-grad)" opacity="0.1" />
            <defs>
              <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>
        )}
        <div className="card-glare" style={{ transform: `translate(${tilt.y * 4}px, ${-tilt.x * 4}px)` }} />
        <div className="card-wave-bg"></div>
        <div className="card-content-3d">
          {badge && <span className="badge-new">{badge}</span>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div className="attraction-name">{attraction}</div>
            {liveData && <div className="live-badge">{liveData}</div>}
          </div>
          <h2 className="card-title">{title}</h2>
          <p className="card-desc">{desc}</p>
          {children && <div className="card-custom-inner">{children}</div>}
        </div>
      </div>
    </div>
  );
};

// 🌐 案A: ライブ・データメッシュ
const DataMesh = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let animationFrameId: number;
    let particles: { x: number, y: number, vx: number, vy: number, size: number }[] = [];
    const particleCount = 40;
    
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    resize();

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.0, vy: (Math.random() - 0.5) * 1.0,
        size: Math.random() * 2 + 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const colorRGB = isDarkMode ? "56, 189, 248" : "14, 165, 233"; 
      
      for (let i = 0; i < particleCount; i++) {
        let p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorRGB}, 0.8)`; ctx.fill();

        for (let j = i + 1; j < particleCount; j++) {
          let p2 = particles[j];
          let dist = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${colorRGB}, ${1 - dist / 150})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animationFrameId); };
  }, [isDarkMode]);

  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -2, pointerEvents: "none" }} />;
};

// 🌊 案C: 流体ダッシュボード用 Gooey バックグラウンド
const GooeyBackground = () => (
  <>
    <svg style={{ position: 'fixed', width: 0, height: 0, pointerEvents: 'none' }}>
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -15" result="goo" />
        <feBlend in="SourceGraphic" in2="goo" />
      </filter>
    </svg>
    <div className="gooey-container">
      <div className="gooey-blob blob-1"></div>
      <div className="gooey-blob blob-2"></div>
      <div className="gooey-blob blob-3"></div>
    </div>
  </>
);

interface ChatMessage { id: string; user: string; text: string; time: string; }

export default function ThemeParkEntrance() {
  const router = useRouter();
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [userName, setUserName] = useState<string>("Guest");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [showMacWelcome, setShowMacWelcome] = useState(false);
  const [isInitialLogin, setIsInitialLogin] = useState(false);

  const [newsText, setNewsText] = useState("【お知らせ】本日はお疲れ様です！Team Portalへようこそ！");
  const [isEditingNews, setIsEditingNews] = useState(false);
  const [tempNews, setTempNews] = useState("");

  const [greeting, setGreeting] = useState("Hello");
  const [dynamicBg, setDynamicBg] = useState("");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const [animDelayOffset, setAnimDelayOffset] = useState(0.2);
  const [activeBookmark, setActiveBookmark] = useState<string | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [cmdKQuery, setCmdKQuery] = useState("");

  // ✨ エリア判定ハブのステート
  const [isAreaOpen, setIsAreaOpen] = useState(false);
  const [areaZip, setAreaZip] = useState("");

  const mockKpi = { current: 12, target: 20 };
  const progressPercent = Math.min(100, Math.round((mockKpi.current / mockKpi.target) * 100));

  const callTreeBookmarks = [
    { id: 'b1', icon: '📦', title: 'データ一括取得（Warp）', copyName: 'Warp一括取得', copyUrl: 'javascript:(function(){/* 一括取得のスクリプト */ alert("Warpデータを取得しました");})();' },
    { id: 'b2', icon: '📞', title: '電話番号一括コピー', copyName: '電話番号一括コピー', copyUrl: 'javascript:(function(){/* 電話番号抽出のスクリプト */ alert("電話番号を抽出しました");})();' },
    { id: 'b3', icon: '🌐', title: 'ネットトス自動入力', copyName: 'ネットトス自動入力', copyUrl: 'javascript:(function(){/* 自動入力のスクリプト */ alert("自動入力しました");})();' }
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem("team_portal_user");
    if (savedUser) { setUserName(savedUser); if (savedUser.toLowerCase().trim().includes("toranosuke.higashi")) setIsAdmin(true); }
    
    const justLoggedIn = sessionStorage.getItem("just_logged_in") === "true";
    let welcomeTimeout: NodeJS.Timeout | null = null;
    let readyTimeout: NodeJS.Timeout | null = null;

    if (justLoggedIn) {
      setIsInitialLogin(true); 
      setShowMacWelcome(true);
      sessionStorage.removeItem("just_logged_in");
      welcomeTimeout = setTimeout(() => setShowMacWelcome(false), 3200); 
      readyTimeout = setTimeout(() => setIsReady(true), 2600); 
      setAnimDelayOffset(3.2);
    } else {
      setIsInitialLogin(false); 
      setIsReady(true);
      setAnimDelayOffset(0.2);
    }

    const savedMemo = localStorage.getItem("team_portal_quick_memo"); if (savedMemo) setMemoText(savedMemo);
    const savedNews = localStorage.getItem("team_portal_news"); if (savedNews) setNewsText(savedNews);
    
    const loadChat = () => { const savedChat = localStorage.getItem("team_portal_chat_history"); if (savedChat) setChatMessages(JSON.parse(savedChat)); };
    loadChat();
    const handleStorageChange = (e: StorageEvent) => { if (e.key === "team_portal_chat_history") loadChat(); };
    window.addEventListener("storage", handleStorageChange);
    
    const observerTimer = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
      }, { threshold: 0.05, rootMargin: "0px 0px 50px 0px" });
      document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    }, justLoggedIn ? 3400 : 200);

    const closeBookmark = () => setActiveBookmark(null);
    document.addEventListener('click', closeBookmark);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdKOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    return () => { 
      if (welcomeTimeout) clearTimeout(welcomeTimeout);
      if (readyTimeout) clearTimeout(readyTimeout);
      clearTimeout(observerTimer); 
      window.removeEventListener("storage", handleStorageChange); 
      document.removeEventListener('click', closeBookmark);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning ☀️");
      setDynamicBg(isDarkMode ? "linear-gradient(135deg, #0f172a, #1e1b4b)" : "linear-gradient(135deg, #f0f9ff, #fdf4ff)");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon ☕");
      setDynamicBg(isDarkMode ? "linear-gradient(135deg, #1e1b4b, #312e81)" : "linear-gradient(135deg, #e0f2fe, #e0e7ff)");
    } else if (hour >= 17 && hour < 20) {
      setGreeting("Good Evening 🌇");
      setDynamicBg(isDarkMode ? "linear-gradient(135deg, #31111d, #1e1b4b)" : "linear-gradient(135deg, #ffedd5, #ffe4e6)");
    } else {
      setGreeting("Good Night 🌙");
      setDynamicBg(isDarkMode ? "radial-gradient(ellipse at bottom, #1e1b4b 0%, #020617 100%)" : "linear-gradient(135deg, #312e81, #1e1b4b)");
    }
  }, [isDarkMode]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMessage: ChatMessage = { id: Date.now().toString(), user: userName, text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const updatedMessages = [...chatMessages, newMessage].slice(-50);
    setChatMessages(updatedMessages);
    localStorage.setItem("team_portal_chat_history", JSON.stringify(updatedMessages));
    setChatInput("");
  };

  useEffect(() => { if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight; }, [chatMessages]);

  const toggleTheme = () => { const newTheme = !isDarkMode; setIsDarkMode(newTheme); showToast(newTheme ? "🌙 ダークモードに切り替えました" : "☀️ ライトモードに切り替えました"); };

  const [isSimOpen, setIsSimOpen] = useState(false);
  const [targetDate, setTargetDate] = useState("");
  const [result, setResult] = useState<{ day3: string; day5Before: string; day5After: string } | null>(null);
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [memoText, setMemoText] = useState("");
  const [utilInput, setUtilInput] = useState("");
  const [utilResult, setUtilResult] = useState("郵便番号を入力してエリアを検索します。");

  useEffect(() => {
    const zipCode = utilInput.replace(/[^0-9]/g, "");
    if (zipCode.length === 7) {
      setUtilResult("🔍 検索中...");
      fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`)
        .then(res => res.json())
        .then(data => { if (data.results && data.results.length > 0) setUtilResult(`📍 ${data.results[0].address1} ${data.results[0].address2} ${data.results[0].address3}`); else setUtilResult("⚠️ 該当する住所が見つかりませんでした"); }).catch(() => setUtilResult("⚠️ 通信エラーが発生しました"));
    } else if (utilInput.length > 0 && !utilInput.match(/[0-9]/)) setUtilResult(`🔤 カナ変換APIは現在オフラインです`);
    else if (utilInput.length === 0) setUtilResult("郵便番号を入力してエリアを検索します。");
    else setUtilResult("入力中...");
  }, [utilInput]);

  const showToast = (msg: string) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: "" }), 3000); };
  const handleLogout = () => { localStorage.removeItem("team_portal_user"); router.push("/login"); };
  const handleClockOut = async () => { const now = new Date(); const hours = String(now.getHours()).padStart(2, "0"); const minutes = String(now.getMinutes()).padStart(2, "0"); try { await navigator.clipboard.writeText(`${hours}:${minutes} 退勤いたします`); showToast(`✨ 退勤メッセージをコピーしました！`); } catch (err) { alert("コピーに失敗しました"); } };
  
  const handleTargetCopy = async (e: React.MouseEvent, text: string, label: string) => { 
    e.stopPropagation();
    try { await navigator.clipboard.writeText(text); showToast(`📋 ${label}をコピーしました！`); setActiveBookmark(null); } catch (err) { alert("コピーに失敗しました"); } 
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
  const handleOpenSim = () => { const today = new Date(); const y = today.getFullYear(); const m = String(today.getMonth() + 1).padStart(2, '0'); const d = String(today.getDate()).padStart(2, '0'); const todayStr = `${y}-${m}-${d}`; setTargetDate(todayStr); calculateDeadlines(todayStr); setIsSimOpen(true); };
  const handleSaveNews = () => { setNewsText(tempNews); localStorage.setItem("team_portal_news", tempNews); setIsEditingNews(false); showToast("📢 お知らせを更新しました！"); };
  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { const val = e.target.value; setMemoText(val); localStorage.setItem("team_portal_quick_memo", val); };
  const handleCopyMemo = async () => { if(memoText){ await navigator.clipboard.writeText(memoText); showToast("📋 メモをコピーしました！"); } };
  const handleClearMemo = () => { if(confirm("メモをクリアしますか？")){ setMemoText(""); localStorage.removeItem("team_portal_quick_memo"); } };
  const copyUtilResult = async () => { if (utilResult.includes("📍")) { try { await navigator.clipboard.writeText(utilResult.replace("📍 ", "")); showToast("📋 住所をコピーしました！"); } catch (err) { alert("コピー失敗"); } } };

  const handleCmdKSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = cmdKQuery.toLowerCase();
    if(query.includes("sim") || query.includes("シミュ")) { router.push("/simulator"); }
    else if(query.includes("トス") || query.includes("toss")) { router.push("/net-toss"); }
    else if(query.includes("コール") || query.includes("再架電") || query.includes("タイムライン")) { router.push("/callback-board"); }
    else if(query.includes("エリア") || query.includes("判定") || query.includes("area")) { setIsAreaOpen(true); }
    else { showToast("該当する機能が見つかりません"); }
    setIsCmdKOpen(false);
    setCmdKQuery("");
  };

  // ✨ エリア判定ハブの処理（東西でコピーする形式を変更！）
  const openAreaSite = async (url: string, type: 'east' | 'west' | 'other') => {
    const cleanZip = areaZip.replace(/[^0-9]/g, "");
    if (cleanZip.length < 7 && type !== 'other') {
      showToast("⚠️ 7桁の郵便番号を入力してください");
      return;
    }
    
    let copyText = cleanZip;
    if (type === 'east') {
      // 東日本はハイフン付きでコピー（多くの場合これで入力がスムーズ）
      copyText = `${cleanZip.substring(0, 3)}-${cleanZip.substring(3)}`;
    }
    // 西日本はハイフンなしでコピー
    
    if (type !== 'other') {
      try {
        await navigator.clipboard.writeText(copyText);
        showToast(`📋 ${type === 'east' ? '東日本' : '西日本'}用に「${copyText}」をコピーしました！`);
      } catch (e) {
        console.error("Copy failed", e);
      }
    }
    
    // 公式サイトを別タブで開く
    window.open(url, "_blank");
  };

  const titleString = "Team Portal Workspace";
  const titleChars = titleString.split("");
  const welcomeTextRaw = `Welcome, ${userName}.`;
  const welcomeChars = welcomeTextRaw.split("");

  return (
    <>
      {showMacWelcome && (
        <div className={`mac-welcome-overlay dark-fix-welcome`}>
          <div className="mac-welcome-text-container">
            {welcomeChars.map((char, i) => (
              <span key={i} className="welcome-char-wrapper">
                <span className="welcome-kinetic-char white-fix-char" style={{ animationDelay: `${i * 0.04}s` }}>{char === " " ? "\u00A0" : char}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ⌨️ Cmd + K パレット */}
      <div className={`modal-overlay ${isCmdKOpen ? "open" : ""}`} onClick={() => setIsCmdKOpen(false)} style={{zIndex: 99999}}>
        <div className="custom-modal cmdk-modal" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleCmdKSearch} style={{display: "flex", alignItems: "center", borderBottom: "1px solid var(--card-border)", paddingBottom: "15px", marginBottom: "15px"}}>
            <span style={{fontSize: "24px", marginRight: "15px"}}>🔍</span>
            <input type="text" autoFocus={isCmdKOpen} placeholder="Type a command or search..." className="cmdk-input" value={cmdKQuery} onChange={(e) => setCmdKQuery(e.target.value)} />
            <span className="cmdk-esc" onClick={() => setIsCmdKOpen(false)}>ESC</span>
          </form>
          <div className="cmdk-list">
            <div className="cmdk-label">Quick Links</div>
            <div className="cmdk-item" onClick={() => { router.push("/simulator"); setIsCmdKOpen(false); }}>🆚 料金シミュレーターへ移動</div>
            <div className="cmdk-item" onClick={() => { router.push("/net-toss"); setIsCmdKOpen(false); }}>🌐 ネットトス連携へ移動</div>
            <div className="cmdk-item" onClick={() => { router.push("/callback-board"); setIsCmdKOpen(false); }}>🗓️ 再架電タイムラインを開く</div>
            <div className="cmdk-item" onClick={() => { setIsAreaOpen(true); setIsCmdKOpen(false); }}>🗺️ エリア判定ハブを開く</div>
            <div className="cmdk-item" onClick={() => { setIsMemoOpen(true); setIsCmdKOpen(false); }}>🍯 クイックメモを開く</div>
          </div>
        </div>
      </div>

      <div className={`entrance-bg`} style={{ background: dynamicBg || "var(--bg-gradient)", transition: "background 2s ease" }}>
        <DataMesh isDarkMode={isDarkMode} />
      </div>
      
      <GooeyBackground />

      <svg className="magic-svg-bg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="magic-path" d="M -10,30 Q 30,80 50,50 T 110,40" />
        <path className="magic-path" d="M -10,70 Q 40,20 70,60 T 110,80" style={{animationDelay: "4s", opacity: 0.5}} />
      </svg>

      <main className={`app-wrapper ${isReady ? "ready" : ""} ${isDarkMode ? "theme-dark" : "theme-light"}`} onClick={() => setActiveBookmark(null)}>
        
        <style dangerouslySetInnerHTML={{ __html: `
          .app-wrapper * { box-sizing: border-box; }

          .mac-welcome-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999999; display: flex; align-items: center; justify-content: center; animation: macFadeOut 0.6s cubic-bezier(0.8, 0, 0.2, 1) 2.6s forwards; }
          .mac-welcome-overlay.dark-fix-welcome { background: #000000; }
          .welcome-kinetic-char.white-fix-char { color: #ffffff; }
          .mac-welcome-text-container { font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 300; letter-spacing: 0.05em; display: flex; justify-content: center; flex-wrap: wrap; }
          .welcome-char-wrapper { display: inline-block; overflow: hidden; vertical-align: bottom; line-height: 1.2; padding-bottom: 5px; margin-bottom: -5px; }
          .welcome-kinetic-char { display: inline-block; transform: translateY(100%); opacity: 0; animation: slideUpWelcomeChar 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
          @keyframes slideUpWelcomeChar { to { transform: translateY(0); opacity: 1; } }
          @keyframes macFadeOut { to { opacity: 0; visibility: hidden; } }

          .theme-light { 
            --text-main: #1e293b; --text-sub: #475569; 
            --card-bg: rgba(255, 255, 255, 0.65); --card-border: rgba(255, 255, 255, 1); 
            --card-hover-border: #38bdf8; --card-hover-bg: rgba(255, 255, 255, 0.95); 
            --card-shadow: 0 10px 30px rgba(0,0,0,0.05); 
            --title-color: #0284c7; --accent-color: #0ea5e9; 
            --modal-bg: rgba(255, 255, 255, 0.95); --kpi-bg: rgba(241, 245, 249, 0.8); 
            --input-bg: rgba(255, 255, 255, 0.8); --svg-color: rgba(2, 132, 199, 0.2); 
          }
          .theme-dark { 
            --text-main: #f8fafc; --text-sub: #cbd5e1; 
            --card-bg: rgba(15, 23, 42, 0.6); --card-border: rgba(255, 255, 255, 0.15); 
            --card-hover-border: #fde047; --card-hover-bg: rgba(30, 41, 59, 0.8); 
            --card-shadow: 0 20px 50px rgba(0,0,0,0.8); 
            --title-color: #fde047; --accent-color: #fde047; 
            --modal-bg: rgba(15, 23, 42, 0.9); --kpi-bg: rgba(0, 0, 0, 0.4); 
            --input-bg: rgba(0, 0, 0, 0.4); --svg-color: rgba(255, 255, 255, 0.4); 
          }

          .app-wrapper { 
            min-height: 100vh; padding: 20px; font-family: 'Inter', 'Noto Sans JP', sans-serif; overflow-x: clip; position: relative; color: var(--text-main); z-index: 1; 
            opacity: 0; visibility: hidden; filter: blur(5px); transform: scale(0.98);
            transition: opacity 1.2s cubic-bezier(0.2, 0.8, 0.2, 1), filter 1.2s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1), color 0.5s; 
          }
          .app-wrapper.ready { opacity: 1; visibility: visible; filter: blur(0); transform: scale(1); }
          
          .entrance-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -3; transition: background 2s ease; }
          .gooey-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; pointer-events: none; filter: url(#goo); opacity: 0.4; overflow: hidden; }
          .theme-dark .gooey-container { opacity: 0.15; }
          .gooey-blob { position: absolute; border-radius: 50%; background: var(--accent-color); filter: blur(20px); }
          .blob-1 { width: 300px; height: 300px; top: 20%; left: 20%; animation: floatBlob 15s ease-in-out infinite alternate; }
          .blob-2 { width: 400px; height: 400px; top: 50%; right: 10%; animation: floatBlob 20s ease-in-out infinite alternate-reverse; background: #8b5cf6; }
          .blob-3 { width: 250px; height: 250px; bottom: 10%; left: 40%; animation: floatBlob 12s ease-in-out infinite alternate; background: #38bdf8; }
          @keyframes floatBlob { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(150px, 100px) scale(1.2); } }

          .magic-svg-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; opacity: 0.7; }
          .magic-path { fill: none; stroke: var(--svg-color); stroke-width: 3; stroke-dasharray: 3000; stroke-dashoffset: 3000; animation: drawMagic 10s ease-in-out infinite alternate; transition: stroke 0.5s; }
          @keyframes drawMagic { 0% { stroke-dashoffset: 3000; } 100% { stroke-dashoffset: 0; } }

          .avatar-circle { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #fde047, #f59e0b); display: flex; align-items: center; justify-content: center; color: #451a03; font-weight: 900; font-size: 18px; box-shadow: 0 0 10px rgba(250,204,21,0.5); flex-shrink: 0; }

          .fluid-card { animation: fluidFloat 6s ease-in-out infinite alternate; }
          @keyframes fluidFloat { 0% { transform: translateY(0px); } 100% { transform: translateY(-8px); } }

          .glitch-hover:hover { animation: holoGlitch 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
          .btn-hover-shine:hover { animation: holoGlitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
          @keyframes holoGlitch {
            0% { transform: translate(0); text-shadow: 0 0 0 transparent; }
            20% { transform: translate(-2px, 1px); text-shadow: 2px 0 0 rgba(255,0,0,0.5), -2px 0 0 rgba(0,255,255,0.5); }
            40% { transform: translate(2px, -1px); text-shadow: -2px 0 0 rgba(255,0,0,0.5), 2px 0 0 rgba(0,255,255,0.5); }
            60% { transform: translate(-1px, 2px); text-shadow: 2px 0 0 rgba(255,0,0,0.5), -2px 0 0 rgba(0,255,255,0.5); }
            100% { transform: translate(0); text-shadow: 0 0 0 transparent; }
          }

          .dashboard-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 10; }
          
          .context-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; flex-wrap: wrap; gap: 15px; }
          .context-greeting { font-size: 20px; font-weight: 900; color: var(--title-color); letter-spacing: 1px; display: flex; align-items: center; gap: 12px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); }
          .context-greeting span { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); }

          .cmdk-hint-bar { background: var(--input-bg); border: 1px solid var(--input-border); padding: 8px 15px; border-radius: 20px; display: flex; align-items: center; gap: 30px; font-size: 13px; font-weight: 800; color: var(--text-main); cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.05); backdrop-filter: blur(10px); transition: 0.3s; }
          .cmdk-hint-bar:hover { border-color: var(--card-hover-border); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
          .cmdk-shortcut { display: flex; gap: 4px; }
          .cmdk-shortcut kbd { background: var(--card-bg); border: 1px solid var(--card-border); padding: 2px 6px; border-radius: 4px; font-size: 10px; font-family: monospace; color: var(--text-sub); }

          .context-ticker { background: var(--card-bg); backdrop-filter: blur(15px); padding: 8px 20px; border-radius: 30px; border: 1px solid var(--card-border); font-size: 12px; font-weight: 800; color: var(--text-main); display: flex; gap: 15px; box-shadow: var(--card-shadow); }
          .ticker-item { display: flex; align-items: center; gap: 6px; }
          .ticker-divider { width: 4px; height: 4px; background: var(--card-hover-border); border-radius: 50%; opacity: 0.5; }

          .top-bar-actions { display: flex; gap: 15px; align-items: center; }
          .theme-toggle-btn { background: var(--card-bg); border: 1px solid var(--card-border); padding: 10px 15px; border-radius: 20px; transition: 0.3s; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); backdrop-filter: blur(8px); color: var(--text-main); cursor: pointer; }
          
          .park-title-container { text-align: center; margin-bottom: 50px; }
          .park-main-title { margin: 0 0 15px 0; display: flex; justify-content: center; flex-wrap: wrap; }
          .char-wrapper { display: inline-block; overflow: hidden; vertical-align: bottom; line-height: 1.3; margin-bottom: -10px; padding-bottom: 10px; }
          
          .kinetic-char { display: inline-block; font-size: clamp(40px, 6vw, 65px); font-weight: 900; letter-spacing: 2px; transform: translateY(120%); opacity: 0; background: linear-gradient(to bottom, #0284c7, #2563eb); -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: slideUpChar 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.1)); }
          .theme-dark .kinetic-char { background: linear-gradient(to bottom, #fde047, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .static-char { display: inline-block; font-size: clamp(40px, 6vw, 65px); font-weight: 900; letter-spacing: 2px; background: linear-gradient(to bottom, #0284c7, #2563eb); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.1)); }
          .theme-dark .static-char { background: linear-gradient(to bottom, #fde047, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          @keyframes slideUpChar { to { transform: translateY(0); opacity: 1; } }
          
          .park-sub-title { color: var(--text-sub); font-size: 16px; font-weight: 800; letter-spacing: 8px; text-transform: uppercase; opacity: 0; animation: fadeIn 1s ease forwards; }
          @keyframes fadeIn { to { opacity: 1; } }

          .quick-actions { display: flex; gap: 20px; justify-content: center; margin-top: 30px; }
          .btn-qa { padding: 14px 30px; border: none; border-radius: 30px; font-size: 14px; font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 2px; }
          
          .btn-hover-shine { position: relative; overflow: hidden; transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s; }
          .btn-hover-shine::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); transform: skewX(-20deg); transition: 0s; }
          .btn-hover-shine:hover { transform: translateY(-4px) scale(1.02); }
          .btn-hover-shine:hover::after { left: 200%; transition: left 0.6s ease-out; }

          .btn-clockout { background: linear-gradient(135deg, #ef4444, #9f1239); color: #fff; box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3); }
          .btn-clockout:hover { box-shadow: 0 15px 35px rgba(225, 29, 72, 0.5); }
          .btn-sim { background: var(--card-bg); color: var(--title-color); border: 1px solid var(--card-border); backdrop-filter: blur(10px); box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
          .btn-sim:hover { background: var(--card-hover-bg); border-color: var(--card-hover-border); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
          .btn-logout { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
          .btn-logout:hover { background: rgba(239, 68, 68, 0.2); }

          .news-ticker-wrapper { display: flex; align-items: center; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 20px; margin-bottom: 40px; padding: 12px 25px; box-shadow: var(--card-shadow); backdrop-filter: blur(20px); transition: 0.5s; }
          .news-badge { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; font-weight: 900; font-size: 13px; padding: 8px 18px; border-radius: 12px; white-space: nowrap; margin-right: 25px; box-shadow: 0 0 15px rgba(245,158,11,0.4); letter-spacing: 2px; }
          .news-scroll-container { flex: 1; overflow: hidden; white-space: nowrap; position: relative; display: flex; align-items: center; }
          .news-text { display: inline-block; padding-left: 100%; animation: marquee 30s linear infinite; font-weight: 800; color: var(--text-main); font-size: 15px; letter-spacing: 1px; }
          @keyframes marquee { 0% { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }

          .main-layout { display: flex; gap: 25px; margin-bottom: 50px; align-items: flex-start; }
          .info-sidebar-wrapper { width: 280px; flex-shrink: 0; transition: width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s; overflow: visible; position: relative; z-index: 50; }
          .info-sidebar-wrapper.collapsed { width: 0px; opacity: 0; pointer-events: none; overflow: hidden; }
          @media (max-width: 950px) { .main-layout { flex-direction: column; } .info-sidebar-wrapper { width: 100%; } .info-sidebar-wrapper.collapsed { height: 0; width: 100%; opacity: 0; } }

          .sidebar-toggle-btn { position: absolute; top: -35px; left: 0; background: transparent; border: none; color: var(--text-sub); font-weight: 900; font-size: 11px; cursor: pointer; display: flex; align-items: center; gap: 5px; opacity: 0.6; transition: 0.2s; letter-spacing: 1px; text-transform: uppercase; z-index: 60; }
          .sidebar-toggle-btn:hover { opacity: 1; color: var(--accent-color); }

          .info-sidebar { display: flex; flex-direction: column; gap: 20px; }
          .info-panel { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 20px; padding: 18px; box-shadow: var(--card-shadow); display: flex; flex-direction: column; }
          .info-title { font-size: 13px; font-weight: 900; color: var(--title-color); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; border-bottom: 2px dashed var(--card-border); padding-bottom: 10px; }

          .bookmark-wrapper { position: relative; margin-bottom: 8px; }
          .script-box { background: var(--input-bg); border: 1px solid var(--input-border); border-radius: 12px; padding: 10px 12px; transition: 0.3s; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
          .script-box:hover { border-color: var(--card-hover-border); transform: translateX(5px); box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          .script-title { font-weight: 900; font-size: 11px; color: var(--text-main); display: flex; align-items: center; gap: 6px; }

          .bookmark-popover { position: absolute; top: 50%; left: calc(100% + 15px); transform: translateY(-50%) scale(0.9); transform-origin: left center; background: var(--modal-bg); backdrop-filter: blur(30px); border: 1px solid var(--card-hover-border); border-radius: 16px; padding: 12px; width: 260px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); z-index: 1000; opacity: 0; animation: popoverIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; display: flex; flex-direction: column; gap: 8px; }
          .theme-dark .bookmark-popover { box-shadow: 0 20px 40px rgba(0,0,0,0.8); }
          .bookmark-popover::before { content: ''; position: absolute; top: 50%; left: -6px; transform: translateY(-50%) rotate(45deg); width: 12px; height: 12px; background: var(--modal-bg); border-bottom: 1px solid var(--card-hover-border); border-left: 1px solid var(--card-hover-border); }
          @keyframes popoverIn { to { opacity: 1; transform: translateY(-50%) scale(1); } }

          @media (max-width: 950px) {
            .bookmark-popover { top: calc(100% + 10px); left: 50%; transform: translateX(-50%) scale(0.9); transform-origin: top center; width: 90%; }
            .bookmark-popover::before { top: -6px; left: 50%; transform: translateX(-50%) rotate(45deg); border-bottom: none; border-left: none; border-top: 1px solid var(--card-hover-border); border-left: 1px solid var(--card-hover-border); }
            @keyframes popoverIn { to { opacity: 1; transform: translateX(-50%) scale(1); } }
          }

          .popover-header { font-size: 10px; color: var(--text-sub); font-weight: 900; margin-bottom: 4px; padding-left: 4px; letter-spacing: 1px; }
          .popover-row { display: flex; align-items: center; justify-content: space-between; background: var(--input-bg); border: 1px solid var(--input-border); padding: 8px 10px; border-radius: 10px; cursor: pointer; transition: 0.2s; }
          .popover-row:hover { background: var(--card-hover-bg); border-color: var(--card-hover-border); transform: translateX(2px); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
          .popover-badge { font-size: 10px; font-weight: 900; padding: 2px 6px; border-radius: 6px; white-space: nowrap; }
          .name-badge { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4); }
          .url-badge { background: rgba(14, 165, 233, 0.15); color: #0ea5e9; border: 1px solid rgba(14, 165, 233, 0.4); }
          .popover-text { font-size: 11px; font-weight: 800; color: var(--text-main); flex: 1; margin: 0 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .popover-copy-icon { font-size: 12px; opacity: 0.6; transition: 0.2s; }
          .popover-row:hover .popover-copy-icon { opacity: 1; color: var(--accent-color); transform: scale(1.1); }

          .chat-messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; margin-bottom: 15px; padding-right: 5px; height: 250px; }
          .chat-messages::-webkit-scrollbar { width: 4px; }
          .chat-messages::-webkit-scrollbar-thumb { background: var(--card-border); border-radius: 4px; }
          .chat-bubble-wrap { display: flex; flex-direction: column; max-width: 90%; }
          .chat-bubble-wrap.me { align-self: flex-end; align-items: flex-end; }
          .chat-bubble-wrap.other { align-self: flex-start; align-items: flex-start; }
          .chat-user { font-size: 10px; color: var(--text-sub); font-weight: 800; margin-bottom: 4px; margin-left: 6px; }
          .chat-bubble { padding: 10px 14px; border-radius: 16px; display: flex; align-items: flex-end; gap: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
          .me .chat-bubble { background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: #fff; border-bottom-right-radius: 4px; }
          .other .chat-bubble { background: var(--input-bg); color: var(--text-main); border: 1px solid var(--input-border); border-bottom-left-radius: 4px; }
          .chat-text { font-size: 13px; font-weight: 700; line-height: 1.5; word-break: break-word; }
          .chat-time { font-size: 9px; opacity: 0.8; font-weight: 800; white-space: nowrap; margin-bottom: -2px; }
          .chat-input-area { display: flex; gap: 8px; margin-top: auto; }
          .chat-input { flex: 1; padding: 12px 16px; border-radius: 20px; border: 1px solid var(--input-border); background: var(--input-bg); color: var(--text-main); font-size: 13px; font-weight: 700; outline: none; transition: 0.3s; }
          .chat-input:focus { border-color: var(--card-hover-border); box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15); }
          .chat-send-btn { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: #fff; border: none; font-size: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.3); flex-shrink: 0; }

          .attraction-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 25px; perspective: 1200px; align-content: flex-start; flex: 1; width: 100%; transition: 0.4s; }
          .fade-up-element { opacity: 0; transform: translateY(50px) scale(0.95); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: var(--delay); }
          .fade-up-element.visible { opacity: 1; transform: translateY(0) scale(1); }
          .magic-card-wrapper.visible:hover { transform: translateY(0) scale(1.02); z-index: 10; }

          .magic-card { position: relative; border-radius: 28px; padding: 25px; background: var(--card-bg); backdrop-filter: blur(25px); display: flex; flex-direction: column; gap: 12px; transform-style: preserve-3d; height: 100%; cursor: pointer; box-shadow: var(--card-shadow); overflow: hidden; }
          .card-aurora-border { position: absolute; inset: 0; border-radius: 28px; padding: 2px; background: radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), var(--card-hover-border), transparent 40%); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0.2; transition: opacity 0.3s; pointer-events: none; z-index: 2; }
          .magic-card:hover .card-aurora-border { opacity: 1; }

          .sparkline-bg { position: absolute; bottom: 0; left: 0; width: 100%; height: 50%; pointer-events: none; z-index: 0; }

          .card-glare { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 60%); pointer-events: none; z-index: 1; mix-blend-mode: overlay; transition: 0.5s; }
          .theme-dark .card-glare { background: radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 60%); }
          .card-content-3d { z-index: 2; position: relative; transform: translateZ(30px); transform-style: preserve-3d; display: flex; flex-direction: column; height: 100%; pointer-events: none; }
          
          .attraction-name { font-size: 10px; color: var(--accent-color); font-weight: 900; letter-spacing: 3px; text-transform: uppercase; }
          .card-title { font-size: 18px; font-weight: 900; color: var(--title-color); margin: 0; line-height: 1.4; letter-spacing: 1px; transition: color 0.3s; }
          .card-desc { font-size: 12px; color: var(--text-sub); margin: 8px 0 0 0; line-height: 1.6; font-weight: 700; transform: translateZ(15px); transition: color 0.3s; flex: 1; }
          .card-custom-inner { margin-top: 15px; transform: translateZ(25px); pointer-events: auto; }
          
          .badge-new { position: absolute; top: -10px; right: -10px; background: linear-gradient(135deg, #ef4444, #b91c1c); color: #fff; font-size: 10px; font-weight: 900; padding: 4px 12px; border-radius: 20px; z-index: 3; box-shadow: 0 5px 15px rgba(225,29,72,0.5); letter-spacing: 2px; }

          .live-badge { font-size: 10px; font-weight: 900; background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 4px 8px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.4); display: flex; align-items: center; gap: 4px; animation: pulseGreen 2s infinite; }
          .live-badge::before { content:''; width:6px; height:6px; background:#10b981; border-radius:50%; }
          @keyframes pulseGreen { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }

          .kpi-widget { background: var(--kpi-bg); padding: 12px; border-radius: 16px; border: 1px solid var(--card-border); transition: 0.5s; pointer-events: auto; }
          .kpi-numbers { display: flex; align-items: baseline; gap: 5px; margin-bottom: 6px; }
          .kpi-current { font-size: 24px; font-weight: 900; color: #38bdf8; }
          .kpi-target { font-size: 13px; font-weight: 800; color: var(--text-sub); }
          .kpi-bar-bg { width: 100%; height: 8px; background: rgba(0,0,0,0.1); border-radius: 4px; overflow: hidden; margin-top: 8px; }
          .theme-dark .kpi-bar-bg { background: rgba(255,255,255,0.1); }
          .kpi-bar-fill { height: 100%; background: linear-gradient(90deg, #38bdf8, #818cf8); border-radius: 4px; }

          .quick-utility { position: fixed; bottom: 40px; right: 40px; z-index: 1000; }
          .utility-fab { width: 70px; height: 70px; background: linear-gradient(135deg, #fbbf24, #d97706); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(0,0,0,0.2), inset 0 0 15px rgba(255,255,255,0.6); transition: 0.3s; font-size: 28px; border: 2px solid rgba(255,255,255,0.6); list-style: none; cursor: pointer; flex-direction: column; gap: 2px; }
          .utility-content { position: absolute; bottom: 95px; right: 0; width: 360px; background: var(--modal-bg); backdrop-filter: blur(30px); padding: 30px; border-radius: 28px; box-shadow: 0 30px 70px rgba(0,0,0,0.2); border: 2px solid var(--card-border); color: var(--text-main); transform-origin: bottom right; animation: popIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); transition: 0.5s; }
          @keyframes popIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }

          .util-input { width: 100%; padding: 14px; border-radius: 12px; border: 2px solid var(--card-border); font-size: 15px; outline: none; background: var(--input-bg); font-weight: 800; color: var(--text-main); transition: 0.3s; }
          .util-input:focus { border-color: var(--card-hover-border); }
          .util-result { margin-top: 15px; font-size: 14px; color: var(--text-main); background: var(--kpi-bg); padding: 15px; border-radius: 12px; border: 1px solid var(--card-border); font-weight: 900; transition: 0.3s; cursor: pointer; }

          .cmdk-modal { width: 600px; padding: 25px; top: 15%; transform: translateY(-20px) scale(0.95); position: absolute; }
          .modal-overlay.open .cmdk-modal { transform: translateY(0) scale(1); }
          .cmdk-input { width: 100%; border: none; background: transparent; font-size: 20px; font-weight: 800; color: var(--text-main); outline: none; }
          .cmdk-esc { font-size: 10px; font-weight: 900; background: var(--card-border); padding: 4px 8px; border-radius: 6px; cursor: pointer; }
          .cmdk-list { display: flex; flex-direction: column; gap: 8px; }
          .cmdk-label { font-size: 11px; font-weight: 900; color: var(--text-sub); margin-top: 10px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
          .cmdk-item { padding: 12px 15px; border-radius: 10px; font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 10px; }
          .cmdk-item:hover { background: var(--accent-color); color: #fff; transform: translateX(5px); }

          /* ✨ エリア判定モーダルのボタン用 */
          .area-btn-group { display: flex; flex-direction: column; gap: 10px; margin-top: 15px; }
          .area-btn { padding: 15px; border-radius: 12px; font-weight: 900; font-size: 14px; display: flex; align-items: center; justify-content: space-between; border: 2px solid var(--card-border); background: var(--input-bg); color: var(--text-main); cursor: pointer; transition: 0.3s; }
          .area-btn:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-color: var(--accent-color); }
          .area-btn.east:hover { border-color: #0284c7; color: #0284c7; }
          .area-btn.west:hover { border-color: #ea580c; color: #ea580c; }
          .area-btn.au:hover { border-color: #ea580c; color: #ea580c; }
          .area-btn.nuro:hover { border-color: #10b981; color: #10b981; }

          .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px); z-index: 1000; display: flex; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: 0.3s; }
          .modal-overlay.open { opacity: 1; pointer-events: auto; }
          .custom-modal { background: var(--modal-bg); backdrop-filter: blur(30px); width: 90%; padding: 40px; border-radius: 30px; box-shadow: 0 30px 80px rgba(0,0,0,0.3); border: 2px solid var(--card-border); transform: translateY(40px) scale(0.95); transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); display: flex; flex-direction: column; color: var(--text-main); }
          .modal-overlay.open .custom-modal { transform: translateY(0) scale(1); }
          .modal-title { font-size: 24px; font-weight: 900; text-align: center; margin-bottom: 30px; letter-spacing: 2px; color: var(--title-color); }
          
          .btn-close-modal { width: 100%; margin-top: 30px; padding: 15px; background: var(--kpi-bg); color: var(--text-main); border: 2px solid var(--card-border); border-radius: 15px; font-weight: 900; transition: 0.2s; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; }
          .btn-close-modal:hover { background: var(--card-hover-border); color: #fff; border-color: transparent; }

          #toast { visibility: hidden; position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%) translateY(20px); padding: 16px 32px; background: rgba(15,23,42, 0.95); color: #fde047; border-radius: 30px; font-weight: 900; font-size: 15px; z-index: 2000; opacity: 0; transition: 0.4s; backdrop-filter: blur(20px); border: 2px solid #fde047; box-shadow: 0 20px 50px rgba(0,0,0,0.3); letter-spacing: 1px; }
          #toast.show { visibility: visible; opacity: 1; transform: translateX(-50%) translateY(0); }
        `}} />

        <div className="dashboard-inner">
          
          <div className="context-header fade-up-element" style={{ "--delay": `${animDelayOffset}s` } as any}>
            <div className="context-greeting">
              <div className="avatar-circle">{userName.charAt(0).toUpperCase()}</div>
              {greeting}, <span style={{ color: "var(--accent-color)" }}>{userName}</span>.
            </div>
            
            <div className="top-bar-actions">
              <div className="cmdk-hint-bar btn-hover-shine" onClick={() => setIsCmdKOpen(true)}>
                <span style={{ opacity: 0.6 }}>🔍 Search or jump...</span>
                <div className="cmdk-shortcut"><kbd>⌘</kbd><kbd>K</kbd></div>
              </div>
              <button className="theme-toggle-btn btn-hover-shine" onClick={toggleTheme}>{isDarkMode ? "🎇" : "☀️"}</button>
            </div>
          </div>

          <div className="park-title-container">
            <h1 className="park-main-title">
              {titleChars.map((char, i) => (
                <span key={i} className={isInitialLogin ? "char-wrapper" : ""}>
                  <span className={isInitialLogin ? "kinetic-char" : "static-char"} style={isInitialLogin ? { animationDelay: `${i * 0.03 + animDelayOffset}s` } : {}}>
                    {char === " " ? "\u00A0" : char}
                  </span>
                </span>
              ))}
            </h1>
            <div className="park-sub-title" style={{ animationDelay: `${animDelayOffset + 0.6}s` }}>Central Operation Dashboard</div>
            
            <div className="quick-actions fade-up-element" style={{ "--delay": `${animDelayOffset + 0.3}s` } as any}>
              <button className="btn-qa btn-sim btn-hover-shine" onClick={handleOpenSim}>⏳ 納期確認</button>
              <button className="btn-qa btn-clockout btn-hover-shine" onClick={handleClockOut}>🏃‍♂️ 退勤する</button>
              <button className="btn-qa btn-logout btn-hover-shine" onClick={handleLogout}>🚪 ログアウト</button>
            </div>
          </div>

          <div className="news-ticker-wrapper fade-up-element" style={{ "--delay": `${animDelayOffset + 0.4}s` } as any}>
            <div className="news-badge">📢 インフォメーション</div>
            <div className="news-scroll-container"><div className="news-text">{newsText}</div></div>
            {isAdmin && <button className="btn-hover-shine" style={{background: "var(--card-bg)", border:"1px solid var(--card-border)", color:"var(--text-main)", fontSize:"12px", fontWeight:900, padding:"8px 16px", borderRadius:"12px", marginLeft:"15px", cursor:"pointer"}} onClick={() => { setTempNews(newsText); setIsEditingNews(!isEditingNews); }}>✏️ 編集</button>}
          </div>

          {isAdmin && isEditingNews && (
            <div style={{display:"flex", gap:"10px", marginBottom:"40px", background:"var(--modal-bg)", padding:"20px", borderRadius:"16px", border:"2px dashed var(--card-border)", backdropFilter:"blur(15px)"}}>
              <input type="text" className="util-input" value={tempNews} onChange={(e) => setTempNews(e.target.value)} />
              <button className="btn-hover-shine" style={{background:"linear-gradient(135deg, #0ea5e9, #4f46e5)", color:"#fff", border:"none", padding:"0 25px", borderRadius:"10px", fontWeight:900, cursor:"pointer", boxShadow:"0 4px 15px rgba(2,132,199,0.3)"}} onClick={handleSaveNews}>保存</button>
            </div>
          )}

          <div className="main-layout">
            
            <div className={`info-sidebar-wrapper ${!isSidebarOpen ? "collapsed" : ""}`}>
              <button className="sidebar-toggle-btn" onClick={() => setIsSidebarOpen(false)}>◀ 隠す</button>
              
              <aside className="info-sidebar">
                <div className="info-panel fade-up-element" style={{ "--delay": `${animDelayOffset + 0.5}s` } as any}>
                  <h3 className="info-title">📋 CallTree & ブックマーク管理</h3>
                  <div style={{ fontSize: "11px", color: "var(--text-sub)", fontWeight: 800, marginBottom: "12px", lineHeight: 1.4 }}>
                    クリックして、コピーしたい内容を選択してください。
                  </div>
                  
                  {callTreeBookmarks.map(bm => (
                    <div key={bm.id} className="bookmark-wrapper">
                      <div className="script-box glitch-hover" onClick={(e) => { e.stopPropagation(); setActiveBookmark(activeBookmark === bm.id ? null : bm.id); }}>
                        <span className="script-title"><span className="script-icon">{bm.icon}</span> {bm.title}</span>
                      </div>
                      
                      {activeBookmark === bm.id && (
                        <div className="bookmark-popover" onClick={(e) => e.stopPropagation()}>
                          <div className="popover-header">🔗 コピーする項目</div>
                          
                          <div className="popover-row glitch-hover" onClick={(e) => handleTargetCopy(e, bm.copyName, "ブックマーク名")}>
                            <span className="popover-badge name-badge">名前</span>
                            <span className="popover-text">{bm.copyName}</span>
                            <span className="popover-copy-icon">📋</span>
                          </div>
                          
                          <div className="popover-row glitch-hover" onClick={(e) => handleTargetCopy(e, bm.copyUrl, "URL")}>
                            <span className="popover-badge url-badge">URL</span>
                            <span className="popover-text">{bm.copyUrl.substring(0, 18)}...</span>
                            <span className="popover-copy-icon">📋</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="info-panel fade-up-element" style={{ "--delay": `${animDelayOffset + 0.6}s`, flex: 1, paddingBottom: "20px" } as any}>
                  <h3 className="info-title">💬 チーム内ミニチャット</h3>
                  <div className="chat-messages" ref={chatScrollRef}>
                    {chatMessages.length === 0 ? (
                      <div style={{ textAlign: "center", color: "var(--text-sub)", fontSize: "12px", marginTop: "20px", fontWeight: 800 }}>メッセージはありません</div>
                    ) : (
                      chatMessages.map(msg => {
                        const isMe = msg.user === userName;
                        return (
                          <div key={msg.id} className={`chat-bubble-wrap ${isMe ? "me" : "other"}`}>
                            {!isMe && <div className="chat-user">{msg.user}</div>}
                            <div className="chat-bubble">
                              <div className="chat-text">{msg.text}</div>
                              <div className="chat-time">{msg.time}</div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  <form className="chat-input-area" onSubmit={handleSendMessage}>
                    <input type="text" className="chat-input" placeholder="メッセージ..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
                    <button type="submit" className="chat-send-btn btn-hover-shine">➤</button>
                  </form>
                </div>
              </aside>
            </div>

            {!isSidebarOpen && (
              <button 
                className="btn-hover-shine"
                style={{ background: "var(--card-bg)", backdropFilter: "blur(10px)", border: "1px solid var(--card-border)", color: "var(--accent-color)", fontWeight: 900, padding: "10px 15px", borderRadius: "16px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", zIndex: 50 }} 
                onClick={() => setIsSidebarOpen(true)}
              >
                <span>▶</span><span style={{fontSize:"10px"}}>開く</span>
              </button>
            )}

            <div className="attraction-grid">
              <MagicCard delay={animDelayOffset + 0.5} attraction="KPI DASHBOARD" title="📊 獲得進捗・KPI" desc="本日の目標まであと何件か、リアルタイムで確認。" liveData={`${progressPercent}% Achieved`} sparkline={true} onClick={() => router.push("/kpi-detail")}>
                <div className="kpi-widget">
                  <div className="kpi-numbers"><span className="kpi-current">{mockKpi.current}</span><span className="kpi-target">/ {mockKpi.target}件</span></div>
                  <div className="kpi-bar-bg"><div className="kpi-bar-fill" style={{ width: `${progressPercent}%` }}></div></div>
                </div>
              </MagicCard>

              {/* ✨ ナレッジやトークを削除し、タイムラインとエリア判定を設置！！ */}
              <MagicCard delay={animDelayOffset + 0.6} attraction="CALL BACK TIMELINE" title="🗓️ 再架電タイムライン" badge="NEW" desc="時間軸でコールバック案件を視覚的に管理・通知します。" liveData="3 Tasks" onClick={() => router.push("/callback-board")} />
              <MagicCard delay={animDelayOffset + 0.7} attraction="AREA CHECKER" title="🗺️ 提供エリア判定ハブ" badge="NEW" desc="住所から各事業者の判定ページをワンタップで開きます。" onClick={() => setIsAreaOpen(true)} />
              
              <MagicCard delay={animDelayOffset + 0.8} attraction="BULK REGISTER" title="📦 データ一括登録" desc="顧客データを高速でDBへ転送します。" liveData="Ready" onClick={() => router.push("/bulk-register")} />
              <MagicCard delay={animDelayOffset + 0.9} attraction="NET TOSS" title="🌐 ネットトス連携" desc="回線のトスアップデータを指定シートへ送信。" onClick={() => router.push("/net-toss")} />
              <MagicCard delay={animDelayOffset + 1.0} attraction="SELF CLOSE" title="🤝 自己クロ連携" desc="成約情報を専用フォームからシームレスに連携。" onClick={() => router.push("/self-close")} />
              <MagicCard delay={animDelayOffset + 1.1} attraction="SMS KRAKEN" title="📱 SMS 送信" desc="Krakenを用いたSMS送信とテンプレート展開。" liveData="System Active" onClick={() => router.push("/sms-kraken")} />
              <MagicCard delay={animDelayOffset + 1.2} attraction="COST SIMULATOR" title="🆚 料金シミュレーター" badge="NEW" desc="利用状況から乗り換え節約額を即座に算出します。" liveData="Avg. ¥4,200/mo" onClick={() => router.push("/simulator")} />

              <MagicCard delay={animDelayOffset + 1.3} attraction="QUICK MEMO" title="🍯 クイックメモ" desc="通話中などの一時的な情報を置いておくメモパッド。" onClick={() => setIsMemoOpen(true)}>
                {memoText ? (
                  <div className="util-result" style={{marginTop:0, padding:"10px", fontSize:"11px", opacity: 0.8}}>
                    {memoText.length > 20 ? memoText.substring(0, 20) + "..." : memoText}
                  </div>
                ) : (
                  <div className="util-result" style={{marginTop:0, padding:"10px", fontSize:"11px", opacity: 0.5}}>No active memo.</div>
                )}
              </MagicCard>
            </div>
          </div>
        </div>

        <details className="quick-utility hide-on-mobile fade-up-element" style={{ "--delay": `${animDelayOffset + 1.5}s` } as any}>
          <summary className="utility-fab btn-hover-shine" style={{listStyle:"none", border:"none", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"28px", cursor:"pointer"}}>
            🔍 <span style={{fontSize: "9px", fontWeight: 900, marginTop: "-5px", opacity: 0.8}}>Cmd+K</span>
          </summary>
          <div className="utility-content">
            <h4 style={{margin: "0 0 15px 0", fontSize: "16px", fontWeight: 900, color: "var(--title-color)", borderBottom: "2px dashed var(--card-border)", paddingBottom: "10px"}}>📍 住所クイック検索</h4>
            <input type="text" className="util-input" placeholder="郵便番号を入力 (例: 1000001)" value={utilInput} onChange={(e) => setUtilInput(e.target.value)} />
            <div className="util-result glitch-hover" onClick={copyUtilResult}>{utilResult}</div>
          </div>
        </details>

        {/* 🗺️ エリア判定ハブ モーダル */}
        <div className={`modal-overlay ${isAreaOpen ? "open" : ""}`} onClick={() => setIsAreaOpen(false)}>
          <div className="custom-modal" style={{maxWidth: "500px"}} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">🗺️ エリア判定ハブ</div>
            <p style={{fontSize: "13px", color: "var(--text-sub)", marginBottom: "20px", lineHeight: 1.6, fontWeight: 800}}>
              郵便番号を入力して各事業者のボタンを押すと、<br/>
              <b>最適な形式でクリップボードにコピーされ、判定ページが開きます。</b>
            </p>
            
            <input type="text" className="util-input" style={{marginBottom:"10px", fontSize:"20px", textAlign:"center", letterSpacing:"2px"}} placeholder="郵便番号 (ハイフンなし7桁)" value={areaZip} onChange={(e) => setAreaZip(e.target.value)} />
            
            <div className="area-btn-group">
              <div className="area-btn east" onClick={() => openAreaSite('https://flets.com/app_new/cao/SelectAddress', 'east')}>
                <span>🔵 NTT東日本で判定</span>
                <span style={{fontSize:"11px", fontWeight:800, color:"var(--text-sub)"}}>自動コピー: 123-4567</span>
              </div>
              <div className="area-btn west" onClick={() => openAreaSite('https://flets.ntt-west.co.jp/area/areaSearch?_gl=1*1wzcbm2*_ga*Nzg0MDY3MTc3LjE3NjMxMDM3OTM.*_ga_83NMYZFEHR*czE3NzY0MDgyODQkbzIxOSRnMCR0MTc3NjQwODI4NCRqNjAkbDAkaDA.', 'west')}>
                <span>🟠 NTT西日本で判定</span>
                <span style={{fontSize:"11px", fontWeight:800, color:"var(--text-sub)"}}>自動コピー: 1234567</span>
              </div>
              <div className="area-btn au" onClick={() => openAreaSite('https://bb-application.au.com/auhikari/area-check', 'other')}>
                <span>🟠 auひかりで判定</span>
                <span style={{fontSize:"11px", fontWeight:800, color:"var(--text-sub)"}}>自動コピー: そのまま</span>
              </div>
              <div className="area-btn nuro" onClick={() => openAreaSite('https://nuro.jp/hikari/area/', 'other')}>
                <span>🟢 NURO光で判定</span>
                <span style={{fontSize:"11px", fontWeight:800, color:"var(--text-sub)"}}>自動コピー: そのまま</span>
              </div>
            </div>

            <button className="btn-close-modal btn-hover-shine" onClick={() => setIsAreaOpen(false)}>閉じる</button>
          </div>
        </div>

        <div className={`modal-overlay ${isSimOpen ? "open" : ""}`} onClick={() => setIsSimOpen(false)}>
          <div className="custom-modal" style={{maxWidth: "400px"}} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">⏳ 納期確認</div>
            <label style={{ fontSize: "12px", fontWeight: 900, color: "var(--text-sub)", marginBottom: "8px", display: "block" }}>基準日（受付日）を変更</label>
            <input type="date" className="util-input" style={{marginBottom:"25px"}} value={targetDate} onChange={(e) => { setTargetDate(e.target.value); calculateDeadlines(e.target.value); }} />
            {result && (
              <div className="kpi-widget" style={{display:"flex", flexDirection:"column", gap:"12px"}}>
                <div style={{display:"flex", justifyContent:"space-between", borderBottom:"1px dashed var(--card-border)", paddingBottom:"10px"}}><span style={{fontSize:"13px", fontWeight:800}}>3日後（通常）</span><span style={{fontSize:"16px", fontWeight:900, color:"var(--title-color)"}}>{result.day3}</span></div>
                <div style={{display:"flex", justifyContent:"space-between", borderBottom:"1px dashed var(--card-border)", paddingBottom:"10px"}}><span style={{fontSize:"13px", fontWeight:800}}>5日後（15時前）</span><span style={{fontSize:"16px", fontWeight:900, color:"var(--title-color)"}}>{result.day5Before}</span></div>
                <div style={{display:"flex", justifyContent:"space-between"}}><span style={{fontSize:"13px", fontWeight:800}}>5日後（15時後）</span><span style={{fontSize:"16px", fontWeight:900, color:"var(--title-color)"}}>{result.day5After}</span></div>
              </div>
            )}
            <button className="btn-close-modal btn-hover-shine" onClick={() => { setIsSimOpen(false); setResult(null); setTargetDate(""); }}>閉じる</button>
          </div>
        </div>

        <div className={`modal-overlay ${isMemoOpen ? "open" : ""}`} onClick={() => setIsMemoOpen(false)}>
          <div className="custom-modal" style={{maxWidth: "600px", height: "80vh"}} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">📝 クイックメモ</div>
            <textarea className="util-input" style={{flex:1, resize:"none", lineHeight:1.6}} placeholder="電話中のメモや、一時的なテキストの退避に。&#10;入力した内容は自動でブラウザに保存されます。" value={memoText} onChange={handleMemoChange} />
            <div style={{display:"flex", gap:"15px", marginTop:"20px"}}>
              <button className="btn-hover-shine" style={{flex:1, padding:"14px", borderRadius:"14px", fontWeight:900, border:"2px solid #0ea5e9", background:"rgba(14, 165, 233, 0.1)", color:"#0ea5e9", cursor:"pointer"}} onClick={handleCopyMemo}>📋 全文コピー</button>
              <button className="btn-hover-shine" style={{flex:1, padding:"14px", borderRadius:"14px", fontWeight:900, border:"2px solid #ef4444", background:"rgba(239, 68, 68, 0.1)", color:"#ef4444", cursor:"pointer"}} onClick={handleClearMemo}>🗑️ 全消去</button>
            </div>
            <button className="btn-close-modal btn-hover-shine" onClick={() => setIsMemoOpen(false)}>閉じる</button>
          </div>
        </div>

        <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>
      </main>
    </>
  );
}