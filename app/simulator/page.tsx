"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// ✨ 背景の光の粒（アンバーテーマに合わせたカームデザイン）
const FlowParticles = () => {
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; delay: string; size: string }[]>([]);
  useEffect(() => {
    const generatedParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      delay: `${Math.random() * 5}s`,
      size: `${Math.random() * 3 + 1}px`
    }));
    setParticles(generatedParticles);
  }, []);
  return (
    <div className="particles-container">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDelay: p.delay }} />
      ))}
    </div>
  );
};

export default function Simulator() {
  const router = useRouter();

  // 🌟 メニューとテーマ状態
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  // 🌟 入力状態の管理
  const [housingType, setHousingType] = useState<"family" | "mansion">("family");
  const [currentLine, setCurrentLine] = useState<string>("sb_hikari");
  const [currentPlan, setCurrentPlan] = useState<string>("1g");
  const [currentNet, setCurrentNet] = useState<number | string>(5720);
  const [currentPhone, setCurrentPhone] = useState<number | string>(500);
  const [mobileCarrier, setMobileCarrier] = useState<string>("sb");

  // 🌟 提案内容の管理
  const [targetCarrier, setTargetCarrier] = useState<string>("sb_10g");
  const [addPhone, setAddPhone] = useState<boolean>(true);
  const [cbAmount, setCbAmount] = useState<number | string>(30000);
  
  // ✅ フレッツ光専用オプション
  const [applyFletsFree, setApplyFletsFree] = useState<boolean>(false);

  // 💰 初期費用・解約金の管理
  const [initialFee, setInitialFee] = useState<number | string>(3300);
  const [constructionFee, setConstructionFee] = useState<number | string>(22000);
  const [cancellationFee, setCancellationFee] = useState<number | string>(0);

  // 🗂️ キャリア別マスタデータ
  const masterData: Record<string, any> = {
    sb_1g: { name: "ソフトバンク光 1G", family: 5720, mansion: 4180, phone: 550 },
    sb_10g: { name: "ソフトバンク光 10G", family: 6380, mansion: 6380, phone: 550 },
    docomo_1g: { name: "ドコモ光 1G", family: 5720, mansion: 4400, phone: 550 },
    docomo_10g: { name: "ドコモ光 10G", family: 6380, mansion: 6380, phone: 550 },
    au_1g: { name: "auひかり 1G", family: 5610, mansion: 4180, phone: 550 },
    biglobe_1g: { name: "ビッグローブ光 1G", family: 5478, mansion: 4378, phone: 550 },
    flets_ms_p2: { name: "フレッツ光 MS P2", family: 3500, mansion: 3500, phone: 550 },
    flets_ms_p1: { name: "フレッツ光 MS P1", family: 4000, mansion: 4000, phone: 550 },
    flets_ms_mini: { name: "フレッツ光 MS ミニ", family: 4500, mansion: 4500, phone: 550 },
    flets_fm_1g: { name: "フレッツ光 FM 1G", family: 6050, mansion: 6050, phone: 550 },
  };

  useEffect(() => {
    setIsReady(true);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    showToast(!isDarkMode ? "🌙 ダークモードに切り替えました" : "☀️ ライトモードに切り替えました");
  };

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  // 🎯 提案可能プランのフィルタリング
  const getAvailableTargets = () => {
    const targets = [
      { id: "sb_1g", label: "ソフトバンク光 1G" },
      { id: "sb_10g", label: "ソフトバンク光 10G" },
      { id: "docomo_1g", label: "ドコモ光 1G" },
      { id: "docomo_10g", label: "ドコモ光 10G" },
      { id: "au_1g", label: "auひかり 1G" },
      { id: "biglobe_1g", label: "ビッグローブ光 1G" },
      { id: "flets_ms_p2", label: "フレッツ光 MS P2" },
      { id: "flets_ms_p1", label: "フレッツ光 MS P1" },
      { id: "flets_ms_mini", label: "フレッツ光 MS ミニ" },
      { id: "flets_fm_1g", label: "フレッツ光 FM 1G" }
    ];
    return targets.filter(t => {
      if (currentLine === "sb_hikari" && currentPlan === "1g" && t.id === "sb_1g") return false;
      if (currentLine === "sb_air" && t.id === "sb_1g") return false;
      return true;
    });
  };

  const availableTargets = getAvailableTargets();

  useEffect(() => {
    const isValid = availableTargets.some(t => t.id === targetCarrier);
    if (!isValid) setTargetCarrier(availableTargets[0].id);
  }, [currentLine, currentPlan, availableTargets, targetCarrier]);

  useEffect(() => {
    if (currentLine === "sb_air" || currentLine === "home_router") setCurrentPlan("router");
    else if (currentPlan === "router") setCurrentPlan("1g");
  }, [currentLine]);

  useEffect(() => {
    if (!targetCarrier.startsWith("flets")) {
      setApplyFletsFree(false);
    }
  }, [targetCarrier]);

  // 🧮 セット割＆プロモ計算
  const getSetDiscount = (carrierId: string, mobile: string) => {
    let amount = 0; let isApplied = false; let desc = "スマホセット割 対象外";
    if ((carrierId.startsWith("sb")) && (mobile === "sb" || mobile === "ymobile")) { amount = 1100; isApplied = true; desc = "SB/ワイモバ 割引適用！"; } 
    else if ((carrierId.startsWith("docomo")) && mobile === "docomo") { amount = 1100; isApplied = true; desc = "ドコモ光セット割 適用！"; } 
    else if ((carrierId === "au_1g" || carrierId === "biglobe_1g") && (mobile === "au" || mobile === "uq")) { amount = 1100; isApplied = true; desc = "au/UQ スマートバリュー適用！"; }
    return { amount, isApplied, desc };
  };

  const getOfficialPromo = (carrierId: string, baseFee: number) => {
    let promoValue = 0; let promoText = "";
    if (carrierId === "sb_1g") { promoValue = baseFee * 3; promoText = "🎊 SB光公式: 基本料金 3ヶ月間無料"; } 
    else if (carrierId === "sb_10g") { promoValue = baseFee * 6; promoText = "🎊 SB光公式: 基本料金 6ヶ月間無料"; } 
    else if (carrierId === "docomo_10g") { promoValue = (baseFee - 500) * 6; promoText = "🎊 ドコモ公式: 6ヶ月間 月額500円"; }
    return { promoValue, promoText };
  };

  const calculateDiscounts = () => {
    const carrier = masterData[targetCarrier];
    const cNet = Number(currentNet) || 0;
    const cPhone = Number(currentPhone) || 0;
    const currentMonthly = cNet + cPhone;
    const currentAnnual = currentMonthly * 12;
    const baseFee = carrier[housingType];
    const phoneFee = addPhone ? carrier.phone : 0;
    const firstYearExtraCosts = (Number(initialFee) || 0) + (Number(constructionFee) || 0) + (Number(cancellationFee) || 0);
    const fletsHalfYearCost = targetCarrier.startsWith("flets") ? (baseFee + phoneFee) * 6 : 0;
    const requiredCbForFlets = fletsHalfYearCost + firstYearExtraCosts;
    const setDiscountInfo = getSetDiscount(targetCarrier, mobileCarrier);
    const officialPromoInfo = getOfficialPromo(targetCarrier, baseFee);
    const newMonthly = baseFee + phoneFee - setDiscountInfo.amount;
    const newAnnualBase = (newMonthly * 12) + firstYearExtraCosts;
    const totalPromoDiscount = (Number(cbAmount) || 0) + officialPromoInfo.promoValue;
    const newAnnualTotal = newAnnualBase - totalPromoDiscount;
    const annualSavings = currentAnnual - newAnnualTotal;

    return { 
      baseFee, phoneFee, currentMonthly, newMonthly, currentAnnual, newAnnualBase, newAnnualTotal, annualSavings,
      totalPromoDiscount, carrierName: carrier.name, setDiscount: setDiscountInfo, officialPromo: officialPromoInfo,
      fletsHalfYearCost, firstYearExtraCosts, requiredCbForFlets
    };
  };

  const results = calculateDiscounts();
  const currentChartWidth = 100;
  const newChartWidth = results.currentAnnual > 0 ? Math.max(0, Math.min(100, Math.floor((results.newAnnualTotal / results.currentAnnual) * 100))) : 0;

  return (
    <>
      <div className={`entrance-bg ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <FlowParticles />
      </div>

      <main className={`app-wrapper ${isReady ? "ready" : ""} ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <style dangerouslySetInnerHTML={{ __html: `
          .app-wrapper * { box-sizing: border-box; }

          /* 🎨 新しい洗練されたカラーパレット：アンバー（琥珀）＆サンセット */
          .theme-light {
            --bg-gradient: linear-gradient(135deg, #fffbeb 0%, #ffedd5 50%, #fef2f2 100%);
            --text-main: #334155;
            --text-sub: #64748b;
            --card-bg: rgba(255, 255, 255, 0.85);
            --card-border: rgba(255, 255, 255, 1);
            --card-hover-border: #f59e0b;
            --card-hover-bg: rgba(255, 255, 255, 0.95);
            --card-shadow: 0 10px 30px rgba(0,0,0,0.04);
            --title-color: #d97706;
            --accent-color: #ea580c;
            --input-bg: rgba(255, 255, 255, 0.9);
            --input-border: rgba(253, 186, 116, 0.5);
            --svg-color: rgba(245, 158, 11, 0.2);
            --particle-color: #fcd34d;
            --error-bg: #fff1f2;
            --error-border: #e11d48;
          }
          
          .theme-dark {
            --bg-gradient: radial-gradient(ellipse at top left, #451a03 0%, #0f172a 100%);
            --text-main: #f8fafc;
            --text-sub: #cbd5e1;
            --card-bg: rgba(30, 20, 15, 0.65);
            --card-border: rgba(255, 255, 255, 0.1);
            --card-hover-border: #fbbf24;
            --card-hover-bg: rgba(60, 30, 15, 0.85);
            --card-shadow: 0 20px 50px rgba(0,0,0,0.8);
            --title-color: #fcd34d; 
            --accent-color: #fbbf24;
            --input-bg: rgba(0, 0, 0, 0.4);
            --input-border: rgba(245, 158, 11, 0.3);
            --svg-color: rgba(251, 191, 36, 0.15);
            --particle-color: #fef3c7;
            --error-bg: rgba(225, 29, 72, 0.2);
            --error-border: #fb7185;
          }

          .app-wrapper { 
            min-height: 100vh; padding: 20px 40px 100px 40px; 
            font-family: 'Inter', 'Noto Sans JP', sans-serif; 
            color: var(--text-main); font-size: 13px; 
            transition: color 0.5s; overflow-x: hidden; position: relative;
          }

          .entrance-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -2; transition: background 0.8s ease; }
          .entrance-bg.theme-light { background: var(--bg-gradient); }
          .entrance-bg.theme-dark { background: var(--bg-gradient); }

          .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; }
          .particle { position: absolute; border-radius: 50%; background: var(--particle-color); box-shadow: 0 0 10px var(--particle-color); animation: flowUp 8s infinite ease-in-out; transition: background 0.5s, box-shadow 0.5s; }
          @keyframes flowUp { 0% { opacity: 0; transform: translateY(20px) scale(0.5); } 50% { opacity: 0.8; transform: translateY(-50px) scale(1.2); } 100% { opacity: 0; transform: translateY(-100px) scale(0.5); } }

          /* 🌟 SVGデータフロー背景（海賊からアナリティクスへ） */
          .data-svg-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none; opacity: 0.8; }
          .data-path { fill: none; stroke: var(--svg-color); stroke-width: 2; stroke-dasharray: 1500; stroke-dashoffset: 1500; animation: drawDataFlow 15s linear infinite; transition: stroke 0.5s; }
          @keyframes drawDataFlow { 0% { stroke-dashoffset: 1500; } 100% { stroke-dashoffset: -1500; } }

          /* 🍔 ハンバーガーボタン */
          .hamburger-btn { position: fixed; top: 20px; left: 20px; z-index: 1001; background: var(--card-bg); backdrop-filter: blur(15px); border: 1px solid var(--card-border); border-radius: 12px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; gap: 5px; box-shadow: var(--card-shadow); transition: 0.3s; }
          .hamburger-btn:hover { background: var(--card-hover-bg); transform: scale(1.05); }
          .hamburger-line { width: 22px; height: 3px; background: var(--text-sub); border-radius: 3px; transition: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
          .hamburger-btn.open .line1 { transform: translateY(8px) rotate(45deg); background: var(--accent-color); }
          .hamburger-btn.open .line2 { opacity: 0; transform: translateX(-10px); }
          .hamburger-btn.open .line3 { transform: translateY(-8px) rotate(-45deg); background: var(--accent-color); }

          /* 🌌 メニューオーバーレイ */
          .menu-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(5px); z-index: 999; opacity: 0; pointer-events: none; transition: 0.4s ease; }
          .menu-overlay.open { opacity: 1; pointer-events: auto; }

          /* 🗄️ サイドメニュー */
          .side-menu { position: fixed; top: 0; left: -320px; width: 300px; height: 100vh; background: var(--card-bg); backdrop-filter: blur(30px); border-right: 1px solid var(--card-border); z-index: 1000; box-shadow: var(--card-shadow); transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); padding: 90px 24px 30px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
          .side-menu.open { left: 0; }
          .menu-title { font-size: 13px; font-weight: 900; color: var(--title-color); margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed var(--card-border); letter-spacing: 1px; }

          .side-link { text-decoration: none; padding: 14px 20px; border-radius: 14px; background: var(--input-bg); color: var(--text-main); font-weight: 800; font-size: 14px; border: 1px solid var(--card-border); transition: all 0.2s; display: flex; align-items: center; gap: 12px; }
          .side-link:hover { border-color: var(--card-hover-border); transform: translateX(8px); color: var(--accent-color); }
          .side-link.current-page { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; border: none; box-shadow: 0 6px 15px rgba(245, 158, 11, 0.3); pointer-events: none; }

          /* 🎈 ナビゲーション（中央配置） */
          .glass-nav-wrapper { display: flex; justify-content: center; margin-bottom: 30px; }
          .glass-nav { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: var(--card-bg); backdrop-filter: blur(16px); border: 1px solid var(--card-border); border-radius: 50px; box-shadow: var(--card-shadow); max-width: 800px; width: 100%; }
          
          .nav-left { display: flex; gap: 12px; align-items: center; }
          .glass-nav-link { text-decoration: none; padding: 10px 20px; border-radius: 30px; font-weight: 800; background: var(--input-bg); color: var(--text-sub); border: 1px solid var(--card-border); transition: 0.2s; font-size: 14px; }
          .glass-nav-link:hover { color: var(--accent-color); border-color: var(--card-hover-border); }
          .glass-nav-active { padding: 10px 20px; border-radius: 30px; font-weight: 900; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); font-size: 14px; }

          /* テーマ切り替えボタン */
          .theme-toggle-btn { background: var(--input-bg); border: 1px solid var(--card-border); padding: 10px 20px; border-radius: 30px; cursor: pointer; transition: 0.3s; font-size: 14px; color: var(--text-main); font-weight: 800; }
          .theme-toggle-btn:hover { border-color: var(--card-hover-border); transform: scale(1.05); }

          /* 🌟 レイアウト：Bento UI可変グリッド */
          .sim-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; max-width: 1200px; margin: 0 auto; perspective: 1000px; }
          @media (max-width: 950px) { .sim-layout { grid-template-columns: 1fr; } }

          /* 🗃️ Bento UI（パネル） */
          .glass-panel { 
            background: var(--card-bg); backdrop-filter: blur(25px); 
            border: 1px solid var(--card-border); border-radius: 24px; padding: 35px; 
            box-shadow: var(--card-shadow); display: flex; flex-direction: column; gap: 24px; 
            transform-style: preserve-3d; transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.2s;
          }
          .glass-panel:hover { transform: translateY(-5px); box-shadow: 0 30px 60px rgba(0,0,0,0.1); border-color: var(--card-hover-border); }
          .theme-dark .glass-panel:hover { box-shadow: 0 30px 60px rgba(0,0,0,0.8); }
          
          .panel-title { font-size: 18px; font-weight: 900; color: var(--title-color); margin: 0; display: flex; align-items: center; gap: 12px; border-bottom: 2px dashed var(--card-border); padding-bottom: 15px; letter-spacing: 1px; transform: translateZ(20px); }

          /* 入力項目群 */
          .input-group { display: flex; flex-direction: column; gap: 10px; transform: translateZ(10px); }
          .input-label { display: flex; justify-content: space-between; font-weight: 800; color: var(--text-sub); font-size: 13px; letter-spacing: 0.5px; border-left: 3px solid var(--accent-color); padding-left: 8px; }
          .val-display { color: var(--accent-color); font-size: 16px; font-weight: 900; }
          
          .tab-group { display: flex; gap: 8px; background: var(--input-bg); padding: 6px; border-radius: 12px; border: 1px solid var(--input-border); }
          .tab-btn { flex: 1; padding: 10px; border: none; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; transition: 0.3s; background: transparent; color: var(--text-sub); }
          .tab-btn.active { background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); box-shadow: 0 4px 10px rgba(245,158,11,0.2); }

          .sim-select, .sim-input { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid var(--input-border); background: var(--input-bg); font-size: 14px; font-weight: 800; color: var(--text-main); outline: none; transition: 0.3s; cursor: pointer; }
          .sim-select:focus, .sim-input:focus { border-color: var(--card-hover-border); box-shadow: 0 0 0 4px rgba(245,158,11,0.2); background: var(--card-hover-bg); }
          .sim-select option { background: #fffbeb; color: #334155; }
          .theme-dark .sim-select option { background: #0f172a; color: #f8fafc; }

          .range-slider { -webkit-appearance: none; width: 100%; height: 8px; background: var(--input-border); border-radius: 5px; outline: none; transition: 0.2s; }
          .range-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: var(--accent-color); cursor: pointer; box-shadow: 0 4px 10px rgba(245,158,11,0.4); }

          /* 🔘 6. Action-First（重要オプションとトグル） */
          .option-box { display: flex; align-items: center; justify-content: space-between; background: var(--input-bg); padding: 16px 20px; border-radius: 16px; border: 1px solid var(--input-border); cursor: pointer; transition: 0.3s; transform: translateZ(15px); }
          .option-box:hover { background: var(--card-hover-bg); border-color: var(--card-hover-border); box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          
          .active-promo { background: radial-gradient(circle at right, rgba(245,158,11,0.1) 0%, var(--input-bg) 100%); border: 1px solid var(--card-hover-border); cursor: default; }
          .cb-input { background: var(--card-bg); border: 2px solid var(--card-hover-border); border-radius: 10px; padding: 10px 15px; width: 140px; font-weight: 900; font-size: 18px; color: var(--accent-color); text-align: right; outline: none; transition: 0.3s; }
          .cb-input:focus { box-shadow: 0 0 0 4px rgba(245,158,11,0.2); background: var(--card-hover-bg); }
          
          .switch { position: relative; display: inline-block; width: 50px; height: 28px; }
          .switch input { opacity: 0; width: 0; height: 0; }
          .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--input-border); transition: .4s; border-radius: 34px; border: 1px solid var(--card-border); }
          .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: var(--text-sub); transition: .4s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
          input:checked + .slider { background-color: rgba(245,158,11,0.2); border-color: var(--card-hover-border); }
          input:checked + .slider:before { transform: translateX(22px); background-color: var(--accent-color); box-shadow: 0 0 10px var(--accent-color); }

          /* 💎 データアナリティクス・結果エリア */
          .result-hero { background: radial-gradient(ellipse at center, rgba(245,158,11,0.15) 0%, var(--input-bg) 100%); border: 1px solid var(--card-hover-border); padding: 35px 20px; border-radius: 20px; text-align: center; position: relative; overflow: hidden; transform: translateZ(30px); }
          
          .hero-amount { font-size: 56px; font-weight: 900; line-height: 1; margin: 15px 0; letter-spacing: -2px; color: var(--title-color); filter: drop-shadow(0 4px 10px rgba(245,158,11,0.2)); animation: pulseTreasure 2s infinite alternate; }
          .hero-amount.negative { color: #e11d48; filter: drop-shadow(0 4px 10px rgba(225,29,72,0.2)); }
          @keyframes pulseTreasure { 0% { transform: scale(1); filter: drop-shadow(0 4px 10px rgba(245,158,11,0.2)); } 100% { transform: scale(1.02); filter: drop-shadow(0 8px 20px rgba(245,158,11,0.4)); } }
          
          /* Bento UI: 内訳ボックス */
          .bar-wrap { width: 100%; background: var(--input-border); border-radius: 8px; height: 12px; border: 1px solid var(--card-border); overflow: hidden; }
          .bar-fill { height: 100%; border-radius: 8px; transition: width 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
          .bar-current { background: var(--text-sub); }
          .bar-new { background: linear-gradient(90deg, #fbbf24, #ea580c); }
          
          .breakdown-box { background: var(--input-bg); border: 1px solid var(--input-border); border-radius: 12px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; transition: 0.3s; }
          .breakdown-box:hover { background: var(--card-hover-bg); border-color: var(--card-hover-border); transform: translateX(5px); }
          .bd-val { font-size: 16px; font-weight: 900; color: var(--text-main); }
          
          /* 🚨 アラートとプロモ */
          .alert-box { background: rgba(225, 29, 72, 0.1); border: 1px solid rgba(225, 29, 72, 0.3); padding: 12px 18px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
          .promo-box { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 12px 18px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }

          #toast { visibility: hidden; position: fixed; bottom: 40px; right: 40px; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); padding: 16px 24px; border-radius: 12px; font-weight: 800; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 200; opacity: 0; transition: 0.4s; backdrop-filter: blur(10px); }
          #toast.show { visibility: visible; opacity: 1; transform: translateY(-10px); }

          /* 🪄 スクロール連動 */
          .fade-up-element { opacity: 0; transform: translateY(40px); transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
          .fade-up-element.visible { opacity: 1; transform: translateY(0); }
        `}} />

        {/* 🌟 SVGデータフロー背景 */}
        <svg className="data-svg-bg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path className="data-path" d="M -10,20 L 30,20 L 40,50 L 80,50 L 110,20" />
          <path className="data-path" d="M -10,80 L 40,80 L 60,30 L 90,30 L 110,80" style={{animationDelay: "3s", opacity: 0.5}} />
        </svg>

        {/* 🍔 ハンバーガーボタン */}
        <div className={`hamburger-btn ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className="hamburger-line line1"></div>
          <div className="hamburger-line line2"></div>
          <div className="hamburger-line line3"></div>
        </div>

        {/* 🌌 メニュー展開時の背景オーバーレイ */}
        <div className={`menu-overlay ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(false)}></div>

        {/* 🗄️ サイドメニュー（全ツール網羅） */}
        <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
          <div className="menu-title">🧭 TOOL MENU</div>
          <a href="/kpi-detail" className="side-link">📊 獲得進捗・KPI</a>
          <a href="/bulk-register" className="side-link">📦 データ一括登録</a>
          <a href="/net-toss" className="side-link">🌐 ネットトス連携</a>
          <a href="/self-close" className="side-link">🤝 自己クロ連携</a>
          <a href="/sms-kraken" className="side-link">📱 SMS (Kraken)送信</a>
          <a href="/email-template" className="side-link">✉️ メールテンプレート</a>
          <a href="/procedure-wizard" className="side-link">🗺️ Kraken 手順辞書</a>
          <a href="/simulator" className="side-link current-page">🆚 料金シミュレーター</a>
          <a href="/trouble-nav" className="side-link">⚡ トラブル解決ナビ</a>
        </div>

        {/* 🎈 ナビゲーション & テーマ切り替え */}
        <div className="glass-nav-wrapper fade-up-element" style={{ "--delay": "0s" } as any}>
          <div className="glass-nav">
            <div className="nav-left">
              <a href="/" className="glass-nav-link">← 司令室に戻る</a>
              <div className="glass-nav-active">🆚 料金シミュレーター</div>
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {isDarkMode ? "🎇 NIGHT" : "☀️ DAY"}
            </button>
          </div>
        </div>

        {/* 📱 8. バーティカルUI（可変グリッド） */}
        <div className="sim-layout">
          
          {/* 🏴‍☠️ 左側パネル：ヒアリング（入力） */}
          <div className="glass-panel fade-up-element">
            <h2 className="panel-title">🗺️ 現在のご利用状況</h2>

            <div className="input-group">
              <label className="input-label">建物のタイプ</label>
              <div className="tab-group">
                <button className={`tab-btn ${housingType === "family" ? "active" : ""}`} onClick={() => setHousingType("family")}>🏠 戸建て</button>
                <button className={`tab-btn ${housingType === "mansion" ? "active" : ""}`} onClick={() => setHousingType("mansion")}>🏢 集合住宅</button>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">📱 スマホキャリア</label>
              <select className="sim-select" value={mobileCarrier} onChange={(e) => setMobileCarrier(e.target.value)}>
                <option value="sb">ソフトバンク</option>
                <option value="ymobile">ワイモバイル</option>
                <option value="docomo">ドコモ</option>
                <option value="au">au</option>
                <option value="uq">UQモバイル</option>
                <option value="other">その他・格安SIMなど</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">現在の回線</label>
                <select className="sim-select" value={currentLine} onChange={(e) => setCurrentLine(e.target.value)}>
                  <option value="sb_hikari">ソフトバンク光</option>
                  <option value="sb_air">SoftBank Air</option>
                  <option value="docomo_hikari">ドコモ光</option>
                  <option value="au_hikari">auひかり</option>
                  <option value="home_router">ホームルーター</option>
                  <option value="other">その他・未契約</option>
                </select>
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">プラン</label>
                <select className="sim-select" value={currentPlan} onChange={(e) => setCurrentPlan(e.target.value)}>
                  {currentLine === "sb_air" || currentLine === "home_router" ? (
                    <option value="router">ルーター</option>
                  ) : (
                    <>
                      <option value="1g">1G</option>
                      <option value="10g">10G</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: "20px" }}>
              <div className="input-label" style={{alignItems:"center"}}>
                <span>現在のネット代</span>
                <div style={{display:"flex", alignItems:"center", gap:"5px"}}>
                  <input type="number" value={currentNet} style={{width:"80px", border:"none", background:"none", textAlign:"right", fontWeight:900, color:"var(--accent-color)", fontSize:"18px", outline:"none"}} onChange={(e) => setCurrentNet(e.target.value)} />
                  <span className="val-display" style={{fontSize:"14px", color:"var(--text-sub)"}}>円</span>
                </div>
              </div>
              <input type="range" min="0" max="10000" step="100" className="range-slider" value={Number(currentNet) || 0} onChange={(e) => setCurrentNet(e.target.value)} />
            </div>

            <h2 className="panel-title" style={{ marginTop: "10px" }}>⚓ ご提案プラン</h2>

            <div className="input-group">
              <label className="input-label">提案回線</label>
              <select className="sim-select" value={targetCarrier} onChange={(e) => setTargetCarrier(e.target.value)}>
                {availableTargets.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* 初期費用（Bento UIレイアウト） */}
            <div className="input-group" style={{background:"var(--input-bg)", padding:"16px", borderRadius:"16px", border:"1px solid var(--input-border)"}}>
              <label className="input-label" style={{marginBottom:"12px"}}>💳 乗り換えにかかる初期費用等</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{flex:1}}>
                  <div style={{fontSize:"11px", color:"var(--text-sub)", marginBottom:"6px"}}>事務手数料</div>
                  <input type="number" className="sim-input" style={{padding:"10px", fontSize:"14px"}} value={initialFee} onChange={(e)=>setInitialFee(e.target.value)} />
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"11px", color:"var(--text-sub)", marginBottom:"6px"}}>工事費</div>
                  <input type="number" className="sim-input" style={{padding:"10px", fontSize:"14px"}} value={constructionFee} onChange={(e)=>setConstructionFee(e.target.value)} />
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"11px", color:"var(--text-sub)", marginBottom:"6px"}}>現回線の解約金</div>
                  <input type="number" className="sim-input" style={{padding:"10px", fontSize:"14px", borderColor: Number(cancellationFee) > 0 ? "#fca5a5" : ""}} value={cancellationFee} onChange={(e)=>setCancellationFee(e.target.value)} />
                </div>
              </div>
            </div>

            {/* 🔘 6. Action-First（操作性の高いトグル群） */}
            <div className="option-box" onClick={() => setAddPhone(!addPhone)}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: 800, color:"var(--text-main)" }}>📞 ひかり電話を付帯する</span>
                <span style={{ fontSize: "11px", color: "var(--text-sub)" }}>セット割の条件などに（+550円/月）</span>
              </div>
              <label className="switch" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" checked={addPhone} onChange={() => setAddPhone(!addPhone)} />
                <span className="slider"></span>
              </label>
            </div>

            {targetCarrier.startsWith("flets") && (
              <div className="option-box" style={{ background: "rgba(16, 185, 129, 0.1)", borderColor: "rgba(16, 185, 129, 0.4)" }} onClick={() => setApplyFletsFree(!applyFletsFree)}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontWeight: 900, color: "#10b981" }}>🎁 究極魔法：半年間「全額実質無料」</span>
                  <span style={{ fontSize: "11px", color: "var(--text-sub)" }}>CB枠を使って初期負担を完全に相殺します</span>
                </div>
                <label className="switch" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={applyFletsFree} onChange={() => setApplyFletsFree(!applyFletsFree)} />
                  <span className="slider" style={{ backgroundColor: applyFletsFree ? "#10b981" : "var(--input-border)", borderColor: applyFletsFree ? "#34d399" : "" }}></span>
                </label>
              </div>
            )}

            {targetCarrier.startsWith("flets") && applyFletsFree && (
              <div style={{ background: "rgba(225, 29, 72, 0.1)", borderLeft: "4px solid #e11d48", padding: "16px", borderRadius: "8px", fontSize: "13px", color: "#e11d48", fontWeight: 800, lineHeight: 1.6 }}>
                💡 お客様負担を「0円」にするための条件<br/>
                ・半年分の月額費用【{results.fletsHalfYearCost.toLocaleString()}円】<br/>
                ・初期費用/工事費/解約金【{results.firstYearExtraCosts.toLocaleString()}円】<br/>
                👉 <span style={{fontSize:"16px", fontWeight:900, color:"var(--text-main)"}}>合計【{results.requiredCbForFlets.toLocaleString()}円】</span> を下のキャッシュバック額にセットせよ。
              </div>
            )}

            <div className="option-box active-promo">
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: 800, color: "var(--title-color)" }}>💰 還元（キャッシュバック）設定</span>
                <span style={{ fontSize: "11px", color: "var(--accent-color)" }}>自由に金額を変更できます</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input type="number" className="cb-input" value={cbAmount} onChange={(e) => setCbAmount(e.target.value)} />
                <span style={{ fontWeight: 900, color: "var(--accent-color)" }}>円</span>
              </div>
            </div>
          </div>

          {/* ✨ 右側：データアナリティクス（結果）パネル */}
          <div className="glass-panel fade-up-element" style={{ transitionDelay: "0.2s" }}>
            <h2 className="panel-title">💎 シミュレーション結果</h2>
            
            <div className="result-hero">
              <div style={{ fontSize: "14px", color: "var(--text-sub)", fontWeight: 800, letterSpacing:"1px", textTransform:"uppercase" }}>初年度トータル節約額</div>
              <div className={`hero-amount ${results.annualSavings < 0 ? "negative" : ""}`}>
                {results.annualSavings >= 0 ? "+" : ""}{Math.floor(results.annualSavings).toLocaleString()} <span style={{fontSize:"24px", letterSpacing:"0"}}>円</span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-sub)" }}>※初年度の特典・初期費用すべてを含む</div>
            </div>

            <div style={{marginTop:"20px", display:"flex", flexDirection:"column", gap:"15px", fontFamily:"'Inter', sans-serif"}}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 800, marginBottom: "6px", color:"var(--text-sub)" }}>
                  <span>現状維持</span>
                  <span>{results.currentAnnual.toLocaleString()} 円</span>
                </div>
                <div className="bar-wrap">
                  <div className="bar-fill bar-current" style={{ width: `${currentChartWidth}%` }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 800, marginBottom: "6px", color:"var(--accent-color)" }}>
                  <span>乗り換え後（初期費用含む）</span>
                  <span>{results.newAnnualTotal.toLocaleString()} 円</span>
                </div>
                <div className="bar-wrap">
                  <div className="bar-fill bar-new" style={{ width: `${newChartWidth}%` }}></div>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: "15px", fontWeight: 900, color:"var(--title-color)", borderLeft: "4px solid var(--accent-color)", paddingLeft: "10px", marginTop: "25px", marginBottom: "15px", letterSpacing:"1px" }}>
              月額・お支払い内訳
            </h3>

            {/* 🗃️ 2. Bento UI（計算結果のモジュール群） */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="breakdown-box">
                <span style={{color:"var(--text-sub)", fontSize:"13px", fontWeight:800}}>ネット基本料金</span>
                <span className="bd-val">{results.baseFee.toLocaleString()} 円</span>
              </div>
              {addPhone && (
                <div className="breakdown-box">
                  <span style={{color:"var(--text-sub)", fontSize:"13px", fontWeight:800}}>ひかり電話</span>
                  <span className="bd-val">+{results.phoneFee.toLocaleString()} 円</span>
                </div>
              )}
              {results.setDiscount.isApplied && (
                <div className="promo-box">
                  <span style={{color:"#10b981", fontSize:"13px", fontWeight:900}}>📱 スマホセット割</span>
                  <span className="bd-val" style={{color:"#10b981"}}>-{results.setDiscount.amount.toLocaleString()} 円</span>
                </div>
              )}
              
              {results.firstYearExtraCosts > 0 && (
                <div className="alert-box">
                  <span style={{color:"#e11d48", fontWeight:800, fontSize:"12px"}}>⚠️ 乗り換え時のみ発生（初期/工事/解約等）</span>
                  <span className="bd-val" style={{color:"#e11d48", fontSize:"15px"}}>+{results.firstYearExtraCosts.toLocaleString()} 円</span>
                </div>
              )}

              <div className="breakdown-box" style={{ background: "var(--input-bg)", border: "2px solid var(--card-hover-border)", marginTop: "5px", padding: "20px" }}>
                <span style={{ fontWeight: 900, color:"var(--title-color)", fontSize:"14px" }}>月々の実質お支払い</span>
                <span className="bd-val" style={{ fontSize: "24px", color: "var(--accent-color)" }}>
                  {results.newMonthly.toLocaleString()} <span style={{fontSize:"14px"}}>円</span>
                </span>
              </div>

              {results.officialPromo.promoValue > 0 && (
                <div style={{ textAlign: "right", fontSize: "12px", fontWeight: 900, color: "#0ea5e9", marginTop:"5px" }}>
                  {results.officialPromo.promoText}
                </div>
              )}
              
              {targetCarrier.startsWith("flets") && applyFletsFree && (
                <div style={{ textAlign: "right", fontSize: "12px", fontWeight: 900, color: "#10b981", marginTop: "2px" }}>
                  🎁 還元額より、初期負担＋半年間実質無料を補填！
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 🍞 通知 */}
        <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>
      </main>
    </>
  );
}