"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [userName, setUserName] = useState<string>("Guest");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showWarpExit, setShowWarpExit] = useState(false);

  // 🌙 ダークモード用の状態（初期値はfalse）
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [newsText, setNewsText] = useState("【お知らせ】新システム「Team Portal」稼働開始！操作方法やバグの報告は管理者までお願いいたします！");
  const [isEditingNews, setIsEditingNews] = useState(false);
  const [tempNews, setTempNews] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("team_portal_user");
    if (savedUser) {
      setUserName(savedUser);
      const cleanUser = savedUser.toLowerCase().trim();
      if (cleanUser.includes("toranosuke.higashi")) setIsAdmin(true);
    }

    if (sessionStorage.getItem("just_logged_in") === "true") {
      setShowWarpExit(true);
      sessionStorage.removeItem("just_logged_in");
    }
    
    const savedMemo = localStorage.getItem("team_portal_quick_memo");
    if (savedMemo) setMemoText(savedMemo);

    const savedNews = localStorage.getItem("team_portal_news");
    if (savedNews) setNewsText(savedNews);

    // 🌙 ダークモードの設定を読み込む
    const savedTheme = localStorage.getItem("team_portal_theme");
    if (savedTheme === "dark") setIsDarkMode(true);
  }, []);

  // 🌙 ダークモード切り替え処理
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("team_portal_theme", newTheme ? "dark" : "light");
    showToast(newTheme ? "🌙 ダークモードに変更しました！" : "☀️ ライトモードに変更しました！");
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
      setIsSearching(true);
      setUtilResult("🔍 検索中...");
      fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`)
        .then(res => res.json())
        .then(data => {
          if (data.results && data.results.length > 0) {
            const addr = data.results[0];
            setUtilResult(`📍 ${addr.address1} ${addr.address2} ${addr.address3}`);
          } else setUtilResult("⚠️ 該当する住所が見つかりませんでした");
        })
        .catch(() => setUtilResult("⚠️ 通信エラーが発生しました"))
        .finally(() => setIsSearching(false));
    } else if (utilInput.length > 0 && !utilInput.match(/[0-9]/)) {
      setUtilResult(`🔤 カナ変換APIは現在バックエンド接続待ちです`);
    } else if (utilInput.length === 0) {
      setUtilResult("ここに変換結果や住所が表示されます。");
    } else {
      setUtilResult("入力中...");
    }
  }, [utilInput]);

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("team_portal_user");
    router.push("/login");
  };

  const handleClockOut = async () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    try {
      await navigator.clipboard.writeText(`${hours}:${minutes} 退勤いたします`);
      showToast(`✨ 退勤メッセージをコピーしました！お疲れ様でした！`);
    } catch (err) { alert("コピーに失敗しました"); }
  };

  const calculateDeadlines = (dateStr: string) => {
    if (!dateStr) return;
    const holidays = ["2026/01/01", "2026/01/02", "2026/01/12", "2026/02/11", "2026/02/23", "2026/03/20", "2026/04/29", "2026/05/03", "2026/05/04", "2026/05/05", "2026/05/06", "2026/07/20", "2026/08/11", "2026/09/21", "2026/09/22", "2026/09/23", "2026/10/12", "2026/11/03", "2026/11/23", "2027/01/01", "2027/01/11", "2027/02/11", "2027/02/23", "2027/03/21", "2027/03/22", "2027/04/29", "2027/05/03", "2027/05/04", "2027/05/05", "2027/07/19", "2027/08/11", "2027/09/20", "2027/09/23", "2027/10/11", "2027/11/03", "2027/11/23"]; 
    const baseDate = new Date(dateStr.replace(/-/g, "/"));
    baseDate.setHours(0, 0, 0, 0);
    const isRestDay = (date: Date) => { const day = date.getDay(); const formatted = `${date.getFullYear()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${("0" + date.getDate()).slice(-2)}`; return (day === 0 || day === 6) || holidays.includes(formatted); };
    const getDeadline = (days: number, is15AfterForce: boolean) => {
      let current = new Date(baseDate); let count = 0;
      let targetDays = (isRestDay(baseDate) || is15AfterForce) ? days + 1 : days;
      while (count < targetDays) { current.setDate(current.getDate() + 1); if (!isRestDay(current)) count++; }
      const week = ["日", "月", "火", "水", "木", "金", "土"];
      return `${("0" + (current.getMonth() + 1)).slice(-2)}/${("0" + current.getDate()).slice(-2)}(${week[current.getDay()]})`;
    };
    setResult({ day3: getDeadline(3, false), day5Before: getDeadline(5, false), day5After: getDeadline(5, true) });
  };

  const handleOpenSim = () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    setTargetDate(todayStr);
    calculateDeadlines(todayStr);
    setIsSimOpen(true);
  };

  const goToPage = (path: string) => router.push(path);

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value; setMemoText(val); localStorage.setItem("team_portal_quick_memo", val);
  };
  const handleCopyMemo = async () => { if(memoText){ await navigator.clipboard.writeText(memoText); showToast("📋 メモをコピーしました！"); } };
  const handleClearMemo = () => { if(confirm("メモを消去しますか？")){ setMemoText(""); localStorage.removeItem("team_portal_quick_memo"); } };

  const mockKpi = { current: 12, target: 20, members: [{ name: "山田", count: 5 }, { name: "佐藤", count: 4 }] };
  const progressPercent = Math.min(100, Math.round((mockKpi.current / mockKpi.target) * 100));

  const copyUtilResult = async () => {
    if (utilResult.includes("📍")) {
      const cleanAddr = utilResult.replace("📍 ", "");
      try {
        await navigator.clipboard.writeText(cleanAddr);
        showToast("📋 住所をコピーしました！");
      } catch (err) { alert("コピーに失敗しました"); }
    }
  };

  const handleSaveNews = () => {
    setNewsText(tempNews);
    localStorage.setItem("team_portal_news", tempNews);
    setIsEditingNews(false);
    showToast("📢 お知らせを更新しました！");
  };

  return (
    <main className={`app-wrapper ${showWarpExit ? "animate-warp-arrival" : ""} ${isDarkMode ? "theme-dark" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        .app-wrapper * { box-sizing: border-box; }
        
        /* ☀️ ライトモード (基本設定) */
        .app-wrapper { 
          min-height: 100vh; 
          background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 50%, #f3e8ff 100%); 
          padding: 20px; 
          font-family: "Helvetica Neue", Arial, sans-serif; 
          overflow-x: hidden; 
          position: relative; 
          transition: background 0.5s ease, color 0.3s ease;
        }

        /* 🌙 ダークモード (極上ミッドナイトブルー仕様) */
        .app-wrapper.theme-dark {
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #020617 100%);
          color: #f8fafc;
        }

        .app-wrapper.animate-warp-arrival { animation: warpArrivalEffect 1.2s cubic-bezier(0.1, 1, 0.2, 1) forwards; transform-origin: center center; }
        @keyframes warpArrivalEffect { 0% { opacity: 0; filter: blur(50px) brightness(4); transform: scale(0.1) translateZ(-1000px); } 100% { opacity: 1; filter: blur(0) brightness(1); transform: scale(1) translateZ(0); } }

        .dashboard-inner { max-width: 1000px; margin: 0 auto; position: relative; }

        .top-bar { display: flex; justify-content: flex-end; align-items: center; gap: 15px; margin-bottom: 20px; }
        
        /* 🌙 ダークモードトグルボタン */
        .theme-toggle-btn { background: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.9); padding: 8px 12px; border-radius: 20px; cursor: pointer; transition: 0.3s; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .theme-toggle-btn:hover { transform: scale(1.1); }
        .theme-dark .theme-toggle-btn { background: rgba(30, 41, 59, 0.8); border-color: rgba(255,255,255,0.2); box-shadow: 0 4px 15px rgba(0,0,0,0.3); }

        .user-profile { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.7); padding: 8px 20px 8px 8px; border-radius: 30px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.9); box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: 0.3s; }
        .theme-dark .user-profile { background: rgba(30, 41, 59, 0.6); border-color: rgba(255,255,255,0.1); }
        
        .avatar-circle { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6, #4f46e5); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 15px; box-shadow: 0 2px 8px rgba(79,70,229,0.3); }
        .greeting-text { font-size: 11px; color: #64748b; font-weight: 800; display: flex; flex-direction: column; line-height: 1.2; transition: 0.3s; }
        .theme-dark .greeting-text { color: #94a3b8; }
        .user-id-text { font-size: 15px; font-weight: 900; color: #1e293b; letter-spacing: 0.5px; transition: 0.3s; }
        .theme-dark .user-id-text { color: #f8fafc; }

        .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 24px 32px; background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.6); border-radius: 20px; box-shadow: 0 8px 32px rgba(31, 38, 135, 0.05); transition: 0.3s; }
        .theme-dark .dashboard-header { background: rgba(30, 41, 59, 0.4); border-color: rgba(255,255,255,0.1); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
        
        .header-text { display: flex; flex-direction: column; }
        .dashboard-title { font-size: 32px; font-weight: 900; margin: 0 0 8px 0; letter-spacing: 1px; background: linear-gradient(135deg, #0f172a 0%, #4f46e5 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0px 4px 15px rgba(79, 70, 229, 0.15); transition: 0.3s; }
        .theme-dark .dashboard-title { background: linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0px 4px 15px rgba(165, 180, 252, 0.2); }
        .dashboard-subtitle { color: #475569; font-size: 15px; margin: 0; font-weight: 700; letter-spacing: 0.5px; transition: 0.3s; }
        .theme-dark .dashboard-subtitle { color: #cbd5e1; }

        .quick-actions { display: flex; gap: 12px; }
        .btn-qa { padding: 10px 18px; border: none; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .btn-clockout { background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; }
        .btn-clockout:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(249, 115, 22, 0.3); }
        .btn-sim { background: rgba(255, 255, 255, 0.7); color: #4f46e5; border: 1px solid rgba(255,255,255,0.8); backdrop-filter: blur(4px); }
        .theme-dark .btn-sim { background: rgba(30, 41, 59, 0.6); color: #818cf8; border-color: rgba(255,255,255,0.2); }
        .btn-sim:hover { background: #fff; transform: translateY(-2px); }
        .theme-dark .btn-sim:hover { background: rgba(30, 41, 59, 0.9); }

        .news-ticker-wrapper { display: flex; align-items: center; background: rgba(255, 255, 255, 0.6); border: 1px solid rgba(255, 255, 255, 0.9); border-radius: 12px; margin-bottom: 30px; padding: 8px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); backdrop-filter: blur(10px); transition: 0.3s; }
        .theme-dark .news-ticker-wrapper { background: rgba(30, 41, 59, 0.6); border-color: rgba(255,255,255,0.1); }
        .news-badge { background: #ef4444; color: #fff; font-weight: 900; font-size: 11px; padding: 4px 10px; border-radius: 8px; white-space: nowrap; margin-right: 12px; letter-spacing: 0.5px; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
        .news-scroll-container { flex: 1; overflow: hidden; white-space: nowrap; position: relative; display: flex; align-items: center; }
        .news-text { display: inline-block; padding-left: 100%; animation: marquee 25s linear infinite; font-weight: 700; color: #1e293b; font-size: 14px; transition: 0.3s; }
        .theme-dark .news-text { color: #f8fafc; }
        @keyframes marquee { 0% { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }
        
        .btn-news-edit { background: transparent; border: 1px solid #cbd5e1; color: #64748b; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; cursor: pointer; margin-left: 12px; white-space: nowrap; transition: 0.2s; }
        .theme-dark .btn-news-edit { border-color: #475569; color: #94a3b8; }
        .btn-news-edit:hover { background: #f8fafc; color: #4f46e5; border-color: #a5b4fc; }
        .theme-dark .btn-news-edit:hover { background: rgba(255,255,255,0.1); color: #818cf8; }

        .news-edit-box { display: flex; gap: 10px; margin-bottom: 30px; background: rgba(255,255,255,0.8); padding: 15px; border-radius: 12px; border: 1px dashed #a5b4fc; animation: fadeIn 0.3s; transition: 0.3s; }
        .theme-dark .news-edit-box { background: rgba(30, 41, 59, 0.8); border-color: #4f46e5; }
        .news-input { flex: 1; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; font-weight: 700; font-size: 14px; transition: 0.3s; }
        .theme-dark .news-input { background: rgba(15, 23, 42, 0.6); color: #f8fafc; border-color: #334155; }
        .news-input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
        .btn-news-save { background: #4f46e5; color: #fff; border: none; padding: 0 20px; border-radius: 8px; font-weight: 800; cursor: pointer; }

        .grid-layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .category-card { padding: 24px; border-radius: 20px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); background: rgba(255, 255, 255, 0.45); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.7); box-shadow: 0 8px 32px rgba(31, 38, 135, 0.03); position: relative; overflow: hidden; display: flex; flex-direction: column; }
        .theme-dark .category-card { background: rgba(30, 41, 59, 0.5); border-color: rgba(255,255,255,0.05); box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
        .category-card:hover { transform: translateY(-5px); background: rgba(255, 255, 255, 0.7); box-shadow: 0 12px 40px rgba(31, 38, 135, 0.08); border-color: rgba(255, 255, 255, 0.9); }
        .theme-dark .category-card:hover { background: rgba(30, 41, 59, 0.8); border-color: rgba(255,255,255,0.15); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
        
        .category-title { font-size: 16px; font-weight: 800; color: #334155; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px; transition: 0.3s; }
        .theme-dark .category-title { color: #f8fafc; }
        .category-desc { color: #64748b; font-size: 13px; margin: 0; line-height: 1.6; flex-grow: 1; transition: 0.3s; }
        .theme-dark .category-desc { color: #94a3b8; }
        
        .kpi-widget { margin-top: 15px; background: rgba(255,255,255,0.5); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.8); transition: 0.3s; }
        .theme-dark .kpi-widget { background: rgba(15, 23, 42, 0.5); border-color: rgba(255,255,255,0.05); }
        .kpi-numbers { display: flex; align-items: baseline; gap: 5px; margin-bottom: 8px; }
        .kpi-current { font-size: 24px; font-weight: 900; color: #ec4899; line-height: 1; }
        .kpi-target { font-size: 13px; font-weight: 700; color: #64748b; transition: 0.3s; }
        .theme-dark .kpi-target { color: #cbd5e1; }
        .kpi-bar-bg { width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; transition: 0.3s; }
        .theme-dark .kpi-bar-bg { background: #334155; }
        .kpi-bar-fill { height: 100%; background: linear-gradient(90deg, #f472b6, #ec4899); border-radius: 4px; transition: width 1s ease-out; }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.3); backdrop-filter: blur(6px); z-index: 1000; display: flex; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: 0.3s; }
        .modal-overlay.open { opacity: 1; pointer-events: auto; }
        .custom-modal { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); width: 90%; padding: 30px; border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.8); transform: translateY(20px); transition: 0.3s; display: flex; flex-direction: column; }
        .theme-dark .custom-modal { background: rgba(30, 41, 59, 0.9); border-color: rgba(255,255,255,0.1); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .modal-overlay.open .custom-modal { transform: translateY(0); }
        .sim-modal { max-width: 380px; }
        .kpi-modal-box { max-width: 450px; }
        .memo-modal-box { max-width: 600px; height: 80vh; max-height: 600px; }
        
        .modal-title { font-size: 18px; font-weight: 900; color: #1e293b; margin-bottom: 20px; text-align: center; transition: 0.3s; }
        .theme-dark .modal-title { color: #f8fafc; }
        .sim-input { width: 100%; padding: 12px; border-radius: 12px; border: 2px solid #e2e8f0; font-size: 15px; font-weight: 700; color: #1e293b; outline: none; margin-bottom: 20px; background: rgba(255,255,255,0.5); transition: 0.3s; }
        .theme-dark .sim-input { background: rgba(15, 23, 42, 0.6); color: #f8fafc; border-color: #334155; }
        
        .result-box { background: rgba(255,255,255,0.6); border-radius: 16px; padding: 15px; display: flex; flex-direction: column; gap: 10px; border: 1px solid #e2e8f0; transition: 0.3s; }
        .theme-dark .result-box { background: rgba(15, 23, 42, 0.6); border-color: rgba(255,255,255,0.05); }
        .result-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed #cbd5e1; transition: 0.3s; }
        .theme-dark .result-item { border-color: #334155; }
        .result-item:last-child { border: none; }
        .res-label { font-size: 12px; font-weight: 800; color: #64748b; transition: 0.3s; }
        .theme-dark .res-label { color: #94a3b8; }
        .res-value { font-size: 15px; font-weight: 900; color: #4f46e5; transition: 0.3s; }
        .theme-dark .res-value { color: #818cf8; }
        .btn-close-modal { width: 100%; margin-top: 20px; padding: 12px; background: #1e293b; color: #fff; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.2s; }
        
        .member-list { margin-top: 15px; }
        .member-row { display: flex; justify-content: space-between; padding: 10px 15px; background: #fff; border-radius: 10px; margin-bottom: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); border: 1px solid #f1f5f9; transition: 0.3s; }
        .theme-dark .member-row { background: rgba(15, 23, 42, 0.6); border-color: rgba(255,255,255,0.05); }
        .member-name { font-weight: 700; color: #334155; transition: 0.3s; }
        .theme-dark .member-name { color: #e2e8f0; }
        .member-count { font-weight: 900; color: #ec4899; }

        .memo-textarea { flex: 1; min-height: 0; width: 100%; padding: 16px; border-radius: 16px; border: 2px solid #e2e8f0; font-size: 15px; line-height: 1.6; outline: none; resize: none; background: rgba(255,255,255,0.7); transition: 0.3s; }
        .theme-dark .memo-textarea { background: rgba(15, 23, 42, 0.6); color: #f8fafc; border-color: #334155; }
        .memo-actions { display: flex; justify-content: space-between; gap: 10px; margin-top: 15px; }
        .btn-memo-action { flex: 1; padding: 10px; border-radius: 10px; font-weight: 800; border: none; cursor: pointer; }

        /* ✨ 浮遊ユーティリティ（カナ・住所検索） */
        .quick-utility { position: fixed; bottom: 30px; right: 30px; z-index: 1000; }
        .utility-fab { width: 60px; height: 60px; background: linear-gradient(135deg, #4f46e5, #3b82f6); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4); list-style: none; transition: 0.3s; font-size: 24px; border: 2px solid rgba(255,255,255,0.2); }
        .utility-fab:hover { transform: scale(1.05) translateY(-5px); box-shadow: 0 12px 30px rgba(79, 70, 229, 0.6); }
        .utility-fab::-webkit-details-marker { display: none; }
        .utility-content { position: absolute; bottom: 80px; right: 0; width: 320px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); padding: 24px; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.9); transition: 0.3s; }
        .theme-dark .utility-content { background: rgba(30, 41, 59, 0.95); border-color: rgba(255,255,255,0.1); box-shadow: 0 20px 50px rgba(0,0,0,0.4); }
        .utility-content h4 { transition: 0.3s; }
        .theme-dark .utility-content h4 { color: #f8fafc !important; border-color: #334155 !important; }
        .util-input { width: 100%; padding: 14px; border-radius: 12px; border: 2px solid #e2e8f0; font-size: 15px; outline: none; transition: 0.2s; font-weight: 700; color: #1e293b; }
        .theme-dark .util-input { background: rgba(15, 23, 42, 0.6); color: #f8fafc; border-color: #334155; }
        .util-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
        .util-result-box { margin-top: 12px; font-size: 13px; color: #475569; background: #f8fafc; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; min-height: 40px; display: flex; align-items: center; cursor: pointer; transition: 0.2s; font-weight: 800; line-height: 1.5; }
        .theme-dark .util-result-box { background: rgba(15, 23, 42, 0.6); color: #cbd5e1; border-color: #334155; }
        .util-result-box:hover { background: #f1f5f9; border-color: #cbd5e1; }
        .theme-dark .util-result-box:hover { background: rgba(30, 41, 59, 0.8); border-color: #475569; }
        .util-loading { animation: pulse 1.5s infinite; }

        #toast { visibility: hidden; position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%) translateY(20px); padding: 12px 24px; background: #334155; color: #fff; border-radius: 30px; font-weight: 700; font-size: 13px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 2000; opacity: 0; transition: 0.4s; }
        #toast.show { visibility: visible; opacity: 1; transform: translateX(-50%) translateY(0); }
      `}} />

      <div className="dashboard-inner">
        <div className="top-bar">
          {/* ☀️/🌙 ダークモード切替ボタン */}
          <button className="theme-toggle-btn" onClick={toggleTheme} title="テーマ切り替え">
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          
          <div className="user-profile">
            <div className="avatar-circle">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="greeting-text">
              <span>SYSTEM LOGIN OK,</span>
              <span className="user-id-text">{userName} さん</span>
            </div>
          </div>
        </div>

        <header className="dashboard-header">
          <div className="header-text">
            <h1 className="dashboard-title">Team Portal Workspace</h1>
            <p className="dashboard-subtitle">業務を加速させる、次世代の統合システム</p>
          </div>
          <div className="quick-actions">
            <button className="btn-qa btn-sim" onClick={handleOpenSim}>⏳ 納期確認</button>
            <button className="btn-qa btn-clockout" onClick={handleClockOut}>🏃‍♂️ 退勤する</button>
            <button className="btn-qa" style={{ background: "transparent", color: "#ef4444", border: "1px solid #fca5a5" }} onClick={handleLogout}>🚪 ログアウト</button>
          </div>
        </header>

        {/* 📢 ニュースティッカー表示エリア */}
        <div className="news-ticker-wrapper">
          <div className="news-badge">📢 お知らせ</div>
          <div className="news-scroll-container">
            <div className="news-text">{newsText}</div>
          </div>
          {/* 👑 東様のみ「編集ボタン」が見える！ */}
          {isAdmin && (
            <button className="btn-news-edit" onClick={() => {
              setTempNews(newsText);
              setIsEditingNews(!isEditingNews);
            }}>
              ✏️ 編集
            </button>
          )}
        </div>

        {/* 👑 東様用 ニュース編集窓 */}
        {isAdmin && isEditingNews && (
          <div className="news-edit-box">
            <input 
              type="text" 
              className="news-input" 
              value={tempNews} 
              onChange={(e) => setTempNews(e.target.value)} 
              placeholder="ここにお知らせを入力してください..."
            />
            <button className="btn-news-save" onClick={handleSaveNews}>保存</button>
          </div>
        )}

        {/* ⏳ 納期シミュレーター モーダル本体 */}
        <div className={`modal-overlay ${isSimOpen ? "open" : ""}`} onClick={() => setIsSimOpen(false)}>
          <div className="custom-modal sim-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">⏳ 納期シミュレーター</div>
            <label style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", marginBottom: "5px", display: "block" }}>基準日（受付日）を変更</label>
            <input type="date" className="sim-input" value={targetDate} onChange={(e) => { setTargetDate(e.target.value); calculateDeadlines(e.target.value); }} />
            {result && (
              <div className="result-box">
                <div className="result-item"><span className="res-label">3日後（通常）</span><span className="res-value">{result.day3}</span></div>
                <div className="result-item"><span className="res-label">5日後（15時前）</span><span className="res-value">{result.day5Before}</span></div>
                <div className="result-item"><span className="res-label">5日後（15時後）</span><span className="res-value">{result.day5After}</span></div>
              </div>
            )}
            <button className="btn-close-modal" onClick={() => { setIsSimOpen(false); setResult(null); setTargetDate(""); }}>閉じる</button>
          </div>
        </div>

        {/* 📊 KPI モーダル */}
        <div className={`modal-overlay ${isKpiOpen ? "open" : ""}`} onClick={() => setIsKpiOpen(false)}>
          <div className="custom-modal kpi-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">📊 本日の進捗詳細</div>
            <div className="result-box" style={{ border: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
              <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <span className="kpi-current" style={{ fontSize: "36px" }}>{mockKpi.current}</span><span className="kpi-target"> / 目標 {mockKpi.target}件</span>
              </div>
              <div className="kpi-bar-bg"><div className="kpi-bar-fill" style={{ width: `${progressPercent}%` }}></div></div>
              <div style={{ textAlign: "right", fontSize: "12px", fontWeight: 800, color: "#ec4899", marginTop: "5px" }}>達成率 {progressPercent}%</div>
            </div>
            <div className="member-list">
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#64748b", marginBottom: "8px", marginLeft: "5px" }}>メンバー別 内訳</div>
              {mockKpi.members.map((member, index) => (
                <div key={index} className="member-row">
                  <span className="member-name">👤 {member.name}</span>
                  <span className="member-count">{member.count} 件</span>
                </div>
              ))}
            </div>
            <button className="btn-qa btn-sim" style={{ width: "100%", marginTop: "15px", padding: "12px", justifyContent: "center", fontSize: "14px", background: "linear-gradient(135deg, #e0e7ff, #ede9fe)", borderColor: "#c7d2fe" }} onClick={() => goToPage("/kpi-detail")}>
              🏆 もっと詳しいランキングと目標を見る
            </button>
            <button className="btn-close-modal" onClick={() => setIsKpiOpen(false)}>閉じる</button>
          </div>
        </div>

        {/* 📝 クイックメモ モーダル */}
        <div className={`modal-overlay ${isMemoOpen ? "open" : ""}`} onClick={() => setIsMemoOpen(false)}>
          <div className="custom-modal memo-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">📝 クイック一時メモ</div>
            <textarea className="memo-textarea" placeholder="電話中のメモや、一時的なテキストの退避に。&#10;入力した内容は自動でブラウザに保存されます。" value={memoText} onChange={handleMemoChange} />
            <div className="memo-actions">
              <button className="btn-memo-action" style={{background: "#e0e7ff", color: "#4f46e5"}} onClick={handleCopyMemo}>📋 全文コピー</button>
              <button className="btn-memo-action" style={{background: "#ffe4e6", color: "#e11d48"}} onClick={handleClearMemo}>🗑️ 全消去</button>
            </div>
            <button className="btn-close-modal" onClick={() => setIsMemoOpen(false)}>閉じる</button>
          </div>
        </div>

        {/* 🗂️ ツールリンクグリッド (順番変更済) */}
        <div className="grid-layout">
          {/* 1. 本日の進捗・KPI */}
          <section className="category-card" onClick={() => setIsKpiOpen(true)}>
            <h2 className="category-title">📊 本日の進捗・KPI</h2>
            <p className="category-desc">チーム全体の獲得状況。クリックでメンバー別の詳細やランキングを確認できます。</p>
            <div className="kpi-widget">
              <div className="kpi-numbers"><span className="kpi-current">{mockKpi.current}</span><span className="kpi-target">/ {mockKpi.target}件</span></div>
              <div className="kpi-bar-bg"><div className="kpi-bar-fill" style={{ width: `${progressPercent}%` }}></div></div>
            </div>
          </section>

          {/* 2. データ一括登録システム */}
          <section className="category-card" onClick={() => goToPage("/bulk-register")}>
            <h2 className="category-title">📦 データ一括登録システム</h2>
            <p className="category-desc">複数の顧客データを一括で処理し、データベースへ高速登録します。</p>
          </section>

          {/* 3. ネットトス連携ツール */}
          <section className="category-card" onClick={() => goToPage("/net-toss")}>
            <h2 className="category-title">🌐 ネットトス連携ツール</h2>
            <p className="category-desc">ネット回線のトスアップ用データを生成し、指定のシートへ送信します。</p>
          </section>

          {/* 4. 自己クロ連携ツール */}
          <section className="category-card" onClick={() => goToPage("/self-close")}>
            <h2 className="category-title">🤝 自己クロ連携ツール</h2>
            <p className="category-desc">サイバーUI仕様の入力フォーム。成約後の情報をシームレスに連携します。</p>
          </section>
          
          {/* 5. SMS（kraken）作成 */}
          <section className="category-card" onClick={() => goToPage("/sms-kraken")}>
            <h2 className="category-title">📱 SMS（kraken）作成</h2>
            <p className="category-desc">Kraken連携を用いたSMS送信・履歴管理・テンプレート展開を行います。</p>
          </section>
          
          {/* 6. メールテンプレート */}
          <section className="category-card" onClick={() => goToPage("/email-template")}>
            <h2 className="category-title">✉️ メールテンプレート</h2>
            <p className="category-desc">用途に応じたメール文面を素早く作成し、ワンクリックでコピーします。</p>
          </section>

          {/* 7. Kraken マニュアル */}
          <section className="category-card" onClick={() => goToPage("/procedure-wizard")}>
            <span className="badge-new" style={{ position: "absolute", top: "15px", right: "15px", background: "#8b5cf6", color: "#fff", fontSize: "10px", fontWeight: 800, padding: "4px 8px", borderRadius: "20px" }}>NEW</span>
            <h2 className="category-title">🐙 Kraken マニュアル</h2>
            <p className="category-desc">プラン変更や住所変更など、各手続きに必要な情報を入力し、Kraken提出用フォーマットを自動生成します。</p>
          </section>

          {/* 8. 通信費 見直しシミュレーター */}
          <section className="category-card" onClick={() => goToPage("/simulator")}>
            <span className="badge-new" style={{ position: "absolute", top: "15px", right: "15px", background: "#f59e0b", color: "#fff", fontSize: "10px", fontWeight: 800, padding: "4px 8px", borderRadius: "20px" }}>NEW</span>
            <h2 className="category-title">🆚 通信費 見直しシミュレーター</h2>
            <p className="category-desc">現在の利用状況をヒアリングし、乗り換え時のおトク額（実質無料など）を即座に算出します。</p>
          </section>

          {/* 9. トラブル解決ナビゲーター */}
          <section className="category-card" onClick={() => goToPage("/trouble-nav")}>
            <span className="badge-new" style={{ position: "absolute", top: "15px", right: "15px", background: "#8b5cf6", color: "#fff", fontSize: "10px", fontWeight: 800, padding: "4px 8px", borderRadius: "20px" }}>NEW</span>
            <h2 className="category-title">🛠️ トラブル解決ナビゲーター</h2>
            <p className="category-desc">SWエラーやメアド重複など、複雑なイレギュラー対応の手順を対話形式でご案内します。</p>
          </section>

          {/* 10. クイック一時メモ */}
          <section className="category-card" onClick={() => setIsMemoOpen(true)}>
            <h2 className="category-title">📝 クイック一時メモ</h2>
            <p className="category-desc">通話中などに一時的に情報を置いておく、ブラウザ自動保存のスクラッチパッド。</p>
            {memoText && <div style={{ marginTop: "10px", padding: "8px 12px", background: "rgba(255,255,255,0.6)", borderRadius: "8px", fontSize: "12px", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", border: "1px dashed #cbd5e1" }}>{memoText}</div>}
          </section>
        </div>
      </div>

      {/* ✨ 浮遊ユーティリティ（カナ・住所検索） */}
      <details className="quick-utility">
        <summary className="utility-fab">🔍</summary>
        <div className="utility-content">
          <h4 style={{margin: "0 0 12px 0", fontSize: "15px", fontWeight: 900, color: "#1e293b", borderBottom: "2px dashed #cbd5e1", paddingBottom: "8px"}}>🔤 住所クイック検索</h4>
          
          <input 
            type="text" 
            placeholder="郵便番号を入力 (例: 1000001)" 
            className="util-input" 
            value={utilInput}
            onChange={(e) => setUtilInput(e.target.value)}
          />
          
          <div 
            className={`util-result-box ${isSearching ? 'util-loading' : ''}`}
            onClick={copyUtilResult}
            title={utilResult.includes("📍") ? "クリックでコピー" : ""}
          >
            {utilResult}
          </div>
        </div>
      </details>

      <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>
    </main>
  );
}