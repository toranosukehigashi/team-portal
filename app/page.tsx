"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ☀️ デイ・フライトルート（大自然と絶景）
const DAY_SCENES = [
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop", // スイスアルプスの山脈
  "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=2000&auto=format&fit=crop", // 南国の透き通る海
  "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?q=80&w=2000&auto=format&fit=crop", // グランドキャニオン
  "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2000&auto=format&fit=crop", // アフリカのサバンナ
  "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?q=80&w=2000&auto=format&fit=crop", // 壮大な森林と山
];

// 🌌 ナイト・フライトルート（ソアリン仕様：超高高度からの雄大な夜景・自然！）
const NIGHT_SCENES = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop", // 宇宙から見た夜の地球（壮大なスケール）
  "https://images.unsplash.com/photo-1531366936337-77b5c330c5fc?q=80&w=2000&auto=format&fit=crop", // 雪山の上空に輝く巨大なオーロラ
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2000&auto=format&fit=crop", // 雲海を抜けた先にある大都市（シカゴ）の空中パノラマ夜景
  "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=2000&auto=format&fit=crop", // 満天の星空と雄大な山脈
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop", // ドバイの超高層ビル群を見下ろす夜間飛行
];

export default function Home() {
  const router = useRouter();
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [userName, setUserName] = useState<string>("Guest");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showWarpExit, setShowWarpExit] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // ✈️ 現在のフライトシーン
  const [currentScene, setCurrentScene] = useState(0);

  // 🌍 モードに合わせて飛行ルート（写真リスト）を切り替える！
  const activeScenes = isDarkMode ? NIGHT_SCENES : DAY_SCENES;

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

    const savedTheme = localStorage.getItem("team_portal_theme");
    if (savedTheme === "dark") setIsDarkMode(true);
  }, []);

  useEffect(() => {
    // ✈️ フライトエンジン（モードが切り替わったら最初の景色からスタート）
    setCurrentScene(0);
    const flightInterval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % activeScenes.length);
    }, 12000);

    return () => clearInterval(flightInterval);
  }, [isDarkMode, activeScenes.length]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("team_portal_theme", newTheme ? "dark" : "light");
    showToast(newTheme ? "🌌 ミッドナイト・フライト（夜間飛行ルート）へ移行します" : "☀️ デイ・フライト（昼間飛行ルート）へ移行します");
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
      setUtilResult(`🔤 カナ変換APIはバックエンド接続待ちです`);
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
    <>
      {/* ✈️ ソアリン・フライトエンジン（全画面背景マッピング） */}
      <div className={`soaring-container ${isDarkMode ? "dark-sky" : ""}`}>
        {activeScenes.map((sceneUrl, index) => (
          <div
            key={sceneUrl} // URLをキーにすることで、モード切替時に綺麗にフェードします
            className={`soaring-scene ${currentScene === index ? "active" : ""}`}
            style={{ backgroundImage: `url(${sceneUrl})` }}
          />
        ))}
        {/* ダークモード（夜間飛行）用の超強力ディープフィルター */}
        <div className="soaring-overlay"></div>
      </div>

      <main className={`app-wrapper ${showWarpExit ? "animate-warp-arrival" : ""} ${isDarkMode ? "theme-dark" : ""}`}>
        <style dangerouslySetInnerHTML={{ __html: `
          .app-wrapper * { box-sizing: border-box; }
          
          /* ✈️ ソアリン・ダイナミック・モーション魔法 (動きを大幅強化！) */
          .soaring-container { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; overflow: hidden; background: #000; }
          .soaring-scene { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; opacity: 0; transition: opacity 4s ease-in-out; transform: scale(1.0); }
          
          /* 🌟 これが天才AI渾身の「ジェット飛行モーション」です！ */
          .soaring-scene.active { opacity: 1; animation: soaringFlight 12s linear infinite; z-index: 1; }
          
          @keyframes soaringFlight {
            0% { transform: scale(1.05) rotateX(0deg) rotateY(0deg) translate(0, 0); }
            25% { transform: scale(1.12) rotateX(1deg) rotateY(-1.5deg) translate(-1%, -1%); } /* 左へ緩やかに旋回 */
            50% { transform: scale(1.2) rotateX(-1deg) rotateY(0deg) translate(0, 1%); } /* 少し機首を下げて谷へ飛び込む */
            75% { transform: scale(1.28) rotateX(1deg) rotateY(1.5deg) translate(1%, -1%); } /* 右へ緩やかに旋回 */
            100% { transform: scale(1.35) rotateX(0deg) rotateY(0deg) translate(0, 0); } /* ズームイン */
          }
          
          /* 背景の景色を邪魔しない、光と影のフィルター */
          .soaring-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.05); z-index: 2; transition: 0.8s; pointer-events: none; }
          .dark-sky .soaring-overlay { background: rgba(5, 10, 20, 0.6); } /* 夜間飛行用の極上夜景フィルター */

          /* 🌤️ 全体レイアウト（背景透過前提） */
          .app-wrapper { min-height: 100vh; padding: 20px; font-family: "Helvetica Neue", Arial, sans-serif; overflow-x: hidden; position: relative; color: #fff; text-shadow: 0 1px 4px rgba(0,0,0,0.8); }
          .app-wrapper.theme-dark { color: #f8fafc; }

          .app-wrapper.animate-warp-arrival { animation: warpArrivalEffect 1.2s cubic-bezier(0.1, 1, 0.2, 1) forwards; transform-origin: center center; }
          @keyframes warpArrivalEffect { 0% { opacity: 0; filter: blur(50px) brightness(4); transform: scale(0.1) translateZ(-1000px); } 100% { opacity: 1; filter: blur(0) brightness(1); transform: scale(1) translateZ(0); } }

          .dashboard-inner { max-width: 1000px; margin: 0 auto; position: relative; z-index: 10; }

          .top-bar { display: flex; justify-content: flex-end; align-items: center; gap: 15px; margin-bottom: 20px; }
          
          /* ガラスのトグルボタン */
          .theme-toggle-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 8px 12px; border-radius: 20px; cursor: pointer; transition: 0.3s; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); backdrop-filter: blur(5px); color: #fff; }
          .theme-toggle-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.1); }

          /* ガラスのアカウントパネル */
          .user-profile { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.1); padding: 8px 20px 8px 8px; border-radius: 30px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: 0.3s; }
          .avatar-circle { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6, #4f46e5); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 15px; box-shadow: 0 2px 8px rgba(79,70,229,0.3); }
          .greeting-text { font-size: 11px; color: #f1f5f9; font-weight: 800; display: flex; flex-direction: column; line-height: 1.2; text-shadow: 0 1px 3px rgba(0,0,0,0.5); }
          .user-id-text { font-size: 15px; font-weight: 900; color: #fff; letter-spacing: 0.5px; }

          /* 💎 究極透過ガラスヘッダー (背景色たったの8%！) */
          .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 24px 32px; background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); transition: 0.3s; }
          .theme-dark .dashboard-header { background: rgba(15, 23, 42, 0.3); border-color: rgba(255,255,255,0.1); box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
          
          .header-text { display: flex; flex-direction: column; }
          /* 文字はくっきり浮かび上がるように調整 */
          .dashboard-title { font-size: 32px; font-weight: 900; margin: 0 0 8px 0; letter-spacing: 1px; background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0px 4px 15px rgba(255,255,255,0.3); }
          .dashboard-subtitle { color: #f1f5f9; font-size: 15px; margin: 0; font-weight: 800; letter-spacing: 0.5px; text-shadow: 0 1px 3px rgba(0,0,0,0.8); }

          .quick-actions { display: flex; gap: 12px; }
          .btn-qa { padding: 10px 18px; border: none; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
          .btn-clockout { background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; text-shadow: none; }
          .btn-clockout:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(249, 115, 22, 0.5); }
          .btn-sim { background: rgba(255, 255, 255, 0.15); color: #fff; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(5px); }
          .theme-dark .btn-sim { background: rgba(30, 41, 59, 0.5); border-color: rgba(255,255,255,0.1); }
          .btn-sim:hover { background: rgba(255, 255, 255, 0.3); transform: translateY(-2px); }

          /* 透過ニュースティッカー */
          .news-ticker-wrapper { display: flex; align-items: center; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px; margin-bottom: 30px; padding: 8px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); backdrop-filter: blur(10px); transition: 0.3s; }
          .theme-dark .news-ticker-wrapper { background: rgba(15, 23, 42, 0.3); border-color: rgba(255,255,255,0.1); }
          .news-badge { background: #ef4444; color: #fff; font-weight: 900; font-size: 11px; padding: 4px 10px; border-radius: 8px; white-space: nowrap; margin-right: 12px; animation: pulse 2s infinite; text-shadow: none; }
          @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
          .news-scroll-container { flex: 1; overflow: hidden; white-space: nowrap; position: relative; display: flex; align-items: center; }
          .news-text { display: inline-block; padding-left: 100%; animation: marquee 25s linear infinite; font-weight: 800; color: #fff; font-size: 14px; text-shadow: 0 1px 3px rgba(0,0,0,0.8); }
          @keyframes marquee { 0% { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }
          .btn-news-edit { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; cursor: pointer; margin-left: 12px; backdrop-filter: blur(5px); }

          /* 👑 究極透過ガラスカード (景色を主役に！) */
          .grid-layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
          .category-card { padding: 24px; border-radius: 20px; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); position: relative; overflow: hidden; display: flex; flex-direction: column; }
          .theme-dark .category-card { background: rgba(15, 23, 42, 0.3); border-color: rgba(255,255,255,0.1); box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
          .category-card:hover { transform: translateY(-8px); background: rgba(255, 255, 255, 0.15); box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4); border-color: rgba(255,255,255,0.4); }
          .theme-dark .category-card:hover { background: rgba(30, 41, 59, 0.5); border-color: rgba(255,255,255,0.2); }
          
          /* 文字の視認性を強力にサポート */
          .category-title { font-size: 16px; font-weight: 900; color: #fff; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.3); }
          .category-desc { color: #f1f5f9; font-size: 13px; margin: 0; line-height: 1.6; flex-grow: 1; font-weight: 700; text-shadow: 0 1px 3px rgba(0,0,0,0.9); }
          
          .kpi-widget { margin-top: 15px; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(5px); }
          .kpi-numbers { display: flex; align-items: baseline; gap: 5px; margin-bottom: 8px; }
          .kpi-current { font-size: 24px; font-weight: 900; color: #f472b6; line-height: 1; text-shadow: 0 0 10px rgba(244,114,182,0.5); }
          .kpi-target { font-size: 13px; font-weight: 800; color: #cbd5e1; }
          .kpi-bar-bg { width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
          .kpi-bar-fill { height: 100%; background: linear-gradient(90deg, #f472b6, #ec4899); border-radius: 4px; transition: width 1s ease-out; box-shadow: 0 0 10px rgba(236,72,153,0.5); }

          /* ガラスのモーダル */
          .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px); z-index: 1000; display: flex; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: 0.3s; }
          .modal-overlay.open { opacity: 1; pointer-events: auto; }
          .custom-modal { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(20px); width: 90%; padding: 30px; border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); transform: translateY(20px); transition: 0.3s; display: flex; flex-direction: column; color: #fff; }
          .modal-title { font-size: 18px; font-weight: 900; color: #fff; margin-bottom: 20px; text-align: center; text-shadow: 0 0 10px rgba(255,255,255,0.5); }
          .sim-input { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); font-size: 15px; font-weight: 700; color: #fff; outline: none; margin-bottom: 20px; background: rgba(0,0,0,0.3); }
          .result-box { background: rgba(0,0,0,0.3); border-radius: 16px; padding: 15px; display: flex; flex-direction: column; gap: 10px; border: 1px solid rgba(255,255,255,0.1); }
          .result-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed rgba(255,255,255,0.1); }
          .res-label { font-size: 12px; font-weight: 800; color: #cbd5e1; }
          .res-value { font-size: 15px; font-weight: 900; color: #a5b4fc; text-shadow: 0 0 10px rgba(165,180,252,0.5); }
          .btn-close-modal { width: 100%; margin-top: 20px; padding: 12px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; font-weight: 800; cursor: pointer; backdrop-filter: blur(5px); }

          /* ガラスの一時メモ */
          .memo-textarea { flex: 1; min-height: 0; width: 100%; padding: 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); font-size: 15px; line-height: 1.6; outline: none; resize: none; background: rgba(0,0,0,0.3); color: #fff; }
          .memo-actions { display: flex; justify-content: space-between; gap: 10px; margin-top: 15px; }
          .btn-memo-action { flex: 1; padding: 10px; border-radius: 10px; font-weight: 800; border: none; cursor: pointer; text-shadow: none; }

          /* ✨ 浮遊ユーティリティ */
          .quick-utility { position: fixed; bottom: 30px; right: 30px; z-index: 1000; }
          .utility-fab { width: 60px; height: 60px; background: linear-gradient(135deg, #4f46e5, #3b82f6); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 8px 25px rgba(0,0,0,0.4); list-style: none; transition: 0.3s; font-size: 24px; border: 2px solid rgba(255,255,255,0.3); text-shadow: none; }
          .utility-fab:hover { transform: scale(1.05) translateY(-5px); box-shadow: 0 12px 30px rgba(79, 70, 229, 0.6); }
          .utility-content { position: absolute; bottom: 80px; right: 0; width: 320px; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(20px); padding: 24px; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); transition: 0.3s; color: #fff; }
          .util-input { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); font-size: 15px; outline: none; background: rgba(0,0,0,0.3); font-weight: 700; color: #fff; }
          .util-result-box { margin-top: 12px; font-size: 13px; color: #cbd5e1; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); font-weight: 800; line-height: 1.5; text-shadow: 0 1px 2px rgba(0,0,0,0.8); }

          /* トースト */
          #toast { visibility: hidden; position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%) translateY(20px); padding: 12px 24px; background: rgba(255, 255, 255, 0.1); color: #fff; border-radius: 30px; font-weight: 700; font-size: 13px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 2000; opacity: 0; transition: 0.4s; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); text-shadow: none; }
          #toast.show { visibility: visible; opacity: 1; transform: translateX(-50%) translateY(0); }
        `}} />

        <div className="dashboard-inner">
          <div className="top-bar">
            {/* 🌙 トグルボタン */}
            <button className="theme-toggle-btn" onClick={toggleTheme} title="フライトモード切り替え">
              {isDarkMode ? "☀️" : "🌌"}
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
              <button className="btn-qa" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.3)", textShadow:"none" }} onClick={handleLogout}>🚪 ログアウト</button>
            </div>
          </header>

          {/* 📢 ニュースティッカー */}
          <div className="news-ticker-wrapper">
            <div className="news-badge">📢 お知らせ</div>
            <div className="news-scroll-container">
              <div className="news-text">{newsText}</div>
            </div>
            {isAdmin && (
              <button className="btn-news-edit" onClick={() => {
                setTempNews(newsText);
                setIsEditingNews(!isEditingNews);
              }}>
                ✏️ 編集
              </button>
            )}
          </div>

          {/* 👑 東様用 ニュース編集窓 (ガラス仕様) */}
          {isAdmin && isEditingNews && (
            <div className="news-edit-box" style={{display:"flex", gap:"10px", marginBottom:"30px", background:"rgba(0,0,0,0.3)", padding:"15px", borderRadius:"12px", border:"1px dashed rgba(255,255,255,0.2)", backdropFilter:"blur(10px)"}}>
              <input 
                type="text" 
                style={{flex:1, padding:"10px", borderRadius:"8px", border:"1px solid rgba(255,255,255,0.2)", outline:"none", fontWeight:700, fontSize:"14px", background:"rgba(0,0,0,0.3)", color:"#fff"}} 
                value={tempNews} 
                onChange={(e) => setTempNews(e.target.value)} 
                placeholder="ここにお知らせを入力してください..."
              />
              <button style={{background:"#4f46e5", color:"#fff", border:"none", padding:"0 20px", borderRadius:"8px", fontWeight:800, cursor:"pointer", textShadow:"none"}} onClick={handleSaveNews}>保存</button>
            </div>
          )}

          {/* ⏳ 納期シミュレーター モーダル本体 */}
          <div className={`modal-overlay ${isSimOpen ? "open" : ""}`} onClick={() => setIsSimOpen(false)}>
            <div className="custom-modal sim-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-title">⏳ 納期シミュレーター</div>
              <label style={{ fontSize: "11px", fontWeight: 800, color: "#cbd5e1", marginBottom: "5px", display: "block" }}>基準日（受付日）を変更</label>
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
                  <span className="kpi-current" style={{ fontSize: "36px" }}>{mockKpi.current}</span><span className="kpi-target" style={{ color: "#cbd5e1" }}> / 目標 {mockKpi.target}件</span>
                </div>
                <div className="kpi-bar-bg"><div className="kpi-bar-fill" style={{ width: `${progressPercent}%` }}></div></div>
                <div style={{ textAlign: "right", fontSize: "12px", fontWeight: 800, color: "#ec4899", marginTop: "5px" }}>達成率 {progressPercent}%</div>
              </div>
              <div className="member-list">
                <div style={{ fontSize: "12px", fontWeight: 800, color: "#cbd5e1", marginBottom: "8px", marginLeft: "5px" }}>メンバー別 内訳</div>
                {mockKpi.members.map((member, index) => (
                  <div key={index} className="member-row" style={{ background: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.1)" }}>
                    <span className="member-name" style={{ color: "#fff" }}>👤 {member.name}</span>
                    <span className="member-count">{member.count} 件</span>
                  </div>
                ))}
              </div>
              <button className="btn-qa btn-sim" style={{ width: "100%", marginTop: "15px", padding: "12px", justifyContent: "center", fontSize: "14px", background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", color: "#fff", textShadow: "none" }} onClick={() => goToPage("/kpi-detail")}>
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
                <button className="btn-memo-action" style={{background: "rgba(79, 70, 229, 0.2)", color: "#a5b4fc", border: "1px solid rgba(79, 70, 229, 0.5)"}} onClick={handleCopyMemo}>📋 全文コピー</button>
                <button className="btn-memo-action" style={{background: "rgba(225, 29, 72, 0.2)", color: "#fda4af", border: "1px solid rgba(225, 29, 72, 0.5)"}} onClick={handleClearMemo}>🗑️ 全消去</button>
              </div>
              <button className="btn-close-modal" onClick={() => setIsMemoOpen(false)}>閉じる</button>
            </div>
          </div>

          {/*グリッド (究極透過仕様) */}
          <div className="grid-layout">
            <section className="category-card" onClick={() => setIsKpiOpen(true)}>
              <h2 className="category-title">📊 本日の進捗・KPI</h2>
              <p className="category-desc">チーム全体の獲得状況。クリックでメンバー別の詳細を確認できます。</p>
              <div className="kpi-widget">
                <div className="kpi-numbers"><span className="kpi-current">{mockKpi.current}</span><span className="kpi-target">/ {mockKpi.target}件</span></div>
                <div className="kpi-bar-bg"><div className="kpi-bar-fill" style={{ width: `${progressPercent}%` }}></div></div>
              </div>
            </section>

            <section className="category-card" onClick={() => goToPage("/bulk-register")}>
              <h2 className="category-title">📦 データ一括登録システム</h2>
              <p className="category-desc">複数の顧客データを一括で処理し、データベースへ高速登録します。</p>
            </section>

            <section className="category-card" onClick={() => goToPage("/net-toss")}>
              <h2 className="category-title">🌐 ネットトス連携ツール</h2>
              <p className="category-desc">ネット回線のトスアップ用データを生成し、指定シートへ送信します。</p>
            </section>

            <section className="category-card" onClick={() => goToPage("/self-close")}>
              <h2 className="category-title">🤝 自己クロ連携ツール</h2>
              <p className="category-desc">サイバーUI仕様の入力フォーム。成約情報をシームレスに連携します。</p>
            </section>
            
            <section className="category-card" onClick={() => goToPage("/sms-kraken")}>
              <h2 className="category-title">📱 SMS（kraken）作成</h2>
              <p className="category-desc">Kraken連携を用いたSMS送信・テンプレート展開を行います。</p>
            </section>
            
            <section className="category-card" onClick={() => goToPage("/email-template")}>
              <h2 className="category-title">✉️ メールテンプレート</h2>
              <p className="category-desc">用途に応じたメール文面を素早く作成し、ワンクリックでコピーします。</p>
            </section>

            <section className="category-card" onClick={() => goToPage("/procedure-wizard")}>
              <span className="badge-new" style={{ position: "absolute", top: "15px", right: "15px", background: "#8b5cf6", color: "#fff", fontSize: "10px", fontWeight: 800, padding: "4px 8px", borderRadius: "20px", textShadow:"none" }}>NEW</span>
              <h2 className="category-title">🐙 Kraken マニュアル</h2>
              <p className="category-desc">Kraken提出用フォーマットを入力情報から自動生成します。</p>
            </section>

            <section className="category-card" onClick={() => goToPage("/simulator")}>
              <span className="badge-new" style={{ position: "absolute", top: "15px", right: "15px", background: "#f59e0b", color: "#fff", fontSize: "10px", fontWeight: 800, padding: "4px 8px", borderRadius: "20px", textShadow:"none" }}>NEW</span>
              <h2 className="category-title">🆚 通信費 見直しシミュレーター</h2>
              <p className="category-desc">ヒアリング状況から乗り換え時のおトク額を即座に算出します。</p>
            </section>

            <section className="category-card" onClick={() => goToPage("/trouble-nav")}>
              <span className="badge-new" style={{ position: "absolute", top: "15px", right: "15px", background: "#8b5cf6", color: "#fff", fontSize: "10px", fontWeight: 800, padding: "4px 8px", borderRadius: "20px", textShadow:"none" }}>NEW</span>
              <h2 className="category-title">🛠️ トラブル解決ナビゲーター</h2>
              <p className="category-desc">複雑なイレギュラー対応の手順を対話形式でご案内します。</p>
            </section>

            <section className="category-card" onClick={() => setIsMemoOpen(true)}>
              <h2 className="category-title">📝 クイック一時メモ</h2>
              <p className="category-desc">通話中などに一時的に情報を置いておく、自動保存のスクラッチパッド。</p>
              {memoText && <div style={{ marginTop: "10px", padding: "8px 12px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", fontSize: "12px", color: "#cbd5e1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", border: "1px dashed rgba(255,255,255,0.1)" }}>{memoText}</div>}
            </section>
          </div>
        </div>

        {/* ✨ 浮遊ユーティリティ（カナ・住所検索） */}
        <details className="quick-utility">
          <summary className="utility-fab">🔍</summary>
          <div className="utility-content">
            <h4 style={{margin: "0 0 12px 0", fontSize: "15px", fontWeight: 900, color: "#fff", borderBottom: "2px dashed rgba(255,255,255,0.2)", paddingBottom: "8px"}}>🔤 住所クイック検索</h4>
            
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
    </>
  );
}