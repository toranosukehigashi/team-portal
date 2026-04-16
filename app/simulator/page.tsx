"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Simulator() {
  const router = useRouter();

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
    <div className="pirates-theme">
      {/* ✨ 究極魔法のCSS（9つのデザイン技術を投入） */}
      <style dangerouslySetInnerHTML={{ __html: `
        .pirates-theme * { box-sizing: border-box; }
        
        /* 🌊 1. ジェネレーティブUI & カームデザイン (深海の波紋と霧) */
        .pirates-theme { 
          font-family: 'Georgia', 'Noto Serif JP', serif; 
          min-height: 100vh; 
          background: radial-gradient(circle at center, #1e293b 0%, #020617 100%);
          color: #e2e8f0; padding: 40px 20px; overflow-x: hidden; position: relative; z-index: 1;
        }
        .abyss-fog {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none; opacity: 0.15; mix-blend-mode: screen;
          background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" /><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0" /></filter><rect width="100%" height="100%" filter="url(%23f)" /></svg>');
          animation: driftFog 60s linear infinite;
        }
        @keyframes driftFog { 0% { transform: scale(1.1) translateX(0); } 100% { transform: scale(1.1) translateX(-20%); } }

        /* 🧭 9. イマーシブ要素（背景の巨大な羅針盤の透かし） */
        .compass-watermark {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 80vh; height: 80vh; border: 2px dashed rgba(251, 191, 36, 0.05); border-radius: 50%; z-index: -1; pointer-events: none;
          display: flex; align-items: center; justify-content: center; animation: slowSpin 120s linear infinite;
        }
        .compass-watermark::before, .compass-watermark::after { content: ''; position: absolute; background: rgba(251, 191, 36, 0.03); }
        .compass-watermark::before { width: 2px; height: 100%; } .compass-watermark::after { width: 100%; height: 2px; }
        @keyframes slowSpin { to { transform: translate(-50%, -50%) rotate(360deg); } }

        .container { max-width: 1200px; margin: 0 auto; position: relative; }
        
        .header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
        .btn-back { background: rgba(15,23,42,0.8); border: 1px solid rgba(251, 191, 36, 0.3); padding: 12px 24px; border-radius: 30px; font-weight: 800; color: #fbbf24; cursor: pointer; transition: 0.3s; backdrop-filter: blur(10px); font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
        .btn-back:hover { background: rgba(251, 191, 36, 0.1); border-color: #fbbf24; transform: translateX(-5px); box-shadow: 0 0 20px rgba(251, 191, 36, 0.3); }

        /* 👑 5. ダイナミック・タイポグラフィ（黄金の輝き） */
        .page-title { 
          font-size: 32px; font-weight: 900; margin: 0; letter-spacing: 3px;
          background: linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
          background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: goldShine 4s linear infinite; filter: drop-shadow(0 4px 10px rgba(251,191,36,0.3));
        }
        @keyframes goldShine { to { background-position: 200% center; } }

        /* 📱 8. バーティカルUI対応（レスポンシブなBentoグリッド） */
        .sim-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; perspective: 1000px; }
        @media (max-width: 950px) { .sim-layout { grid-template-columns: 1fr; } }

        /* 🏴‍☠️ 4. マイクロインタラクション＆深度（宝の地図パネル） */
        .glass-panel { 
          background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(25px); 
          border: 1px solid rgba(255,255,255,0.05); border-top: 1px solid rgba(251, 191, 36, 0.3); border-bottom: 1px solid rgba(251, 191, 36, 0.1);
          border-radius: 24px; padding: 35px; box-shadow: 0 25px 50px rgba(0,0,0,0.7), inset 0 0 30px rgba(0,0,0,0.4); 
          display: flex; flex-direction: column; gap: 24px; transform-style: preserve-3d; transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .glass-panel:hover { transform: translateY(-5px) rotateX(1deg); box-shadow: 0 30px 60px rgba(0,0,0,0.9), inset 0 0 40px rgba(251,191,36,0.05); }
        
        .panel-title { font-size: 20px; font-weight: 900; color: #fbbf24; margin: 0; display: flex; align-items: center; gap: 12px; border-bottom: 1px dashed rgba(251, 191, 36, 0.3); padding-bottom: 15px; letter-spacing: 1px; text-shadow: 0 2px 5px rgba(0,0,0,0.8); transform: translateZ(20px); }

        /* 🗃️ 2. Bento UI（入力項目群） */
        .input-group { display: flex; flex-direction: column; gap: 10px; transform: translateZ(10px); }
        .input-label { display: flex; justify-content: space-between; font-weight: 800; color: #94a3b8; font-size: 13px; font-family: 'Inter', sans-serif; letter-spacing: 0.5px; }
        .val-display { color: #fde047; font-size: 16px; font-weight: 900; text-shadow: 0 0 10px rgba(253,224,71,0.4); }
        
        .tab-group { display: flex; gap: 8px; background: rgba(0,0,0,0.4); padding: 6px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
        .tab-btn { flex: 1; padding: 10px; border: none; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; transition: 0.3s; background: transparent; color: #64748b; font-family: 'Inter', sans-serif; }
        .tab-btn.active { background: rgba(251, 191, 36, 0.15); color: #fde047; border: 1px solid rgba(251, 191, 36, 0.4); box-shadow: 0 0 15px rgba(251,191,36,0.2); }

        .sim-select, .sim-input { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.5); font-size: 15px; font-weight: 800; color: #fff; outline: none; transition: 0.3s; cursor: pointer; font-family: 'Inter', sans-serif; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5); }
        .sim-select:focus, .sim-input:focus { border-color: #fbbf24; box-shadow: 0 0 0 3px rgba(251,191,36,0.15), inset 0 2px 5px rgba(0,0,0,0.5); background: rgba(0,0,0,0.7); }
        .sim-select option { background: #0f172a; color: #fff; }

        .range-slider { -webkit-appearance: none; width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 5px; outline: none; transition: 0.2s; }
        .range-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #fbbf24; cursor: pointer; box-shadow: 0 0 10px rgba(251,191,36,0.6); }

        /* 🔘 6. Action-First（重要オプションとトグル） */
        .option-box { display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.3); padding: 16px 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: 0.3s; transform: translateZ(15px); font-family: 'Inter', sans-serif; }
        .option-box:hover { background: rgba(0,0,0,0.5); border-color: rgba(255,255,255,0.15); }
        
        .active-promo { background: radial-gradient(circle at right, rgba(251,191,36,0.1) 0%, rgba(0,0,0,0.5) 100%); border: 1px solid rgba(251,191,36,0.4); box-shadow: inset 0 0 20px rgba(251,191,36,0.05); cursor: default; }
        .cb-input { background: rgba(0,0,0,0.8); border: 2px solid #fbbf24; border-radius: 10px; padding: 10px 15px; width: 140px; font-weight: 900; font-size: 18px; color: #fde047; text-align: right; outline: none; transition: 0.3s; box-shadow: 0 0 15px rgba(251,191,36,0.1); }
        .cb-input:focus { box-shadow: 0 0 20px rgba(251,191,36,0.4), inset 0 0 10px rgba(251,191,36,0.2); }
        
        .switch { position: relative; display: inline-block; width: 50px; height: 28px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255,255,255,0.1); transition: .4s; border-radius: 34px; border: 1px solid rgba(255,255,255,0.2); box-shadow: inset 0 2px 5px rgba(0,0,0,0.5); }
        .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: #94a3b8; transition: .4s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.5); }
        input:checked + .slider { background-color: rgba(251,191,36,0.2); border-color: #fbbf24; }
        input:checked + .slider:before { transform: translateX(22px); background-color: #fbbf24; box-shadow: 0 0 10px #fbbf24; }

        /* 💎 お宝発見エリア（右側パネル） */
        .result-hero { background: radial-gradient(ellipse at center, rgba(251,191,36,0.15) 0%, rgba(0,0,0,0.6) 100%); border: 1px solid rgba(251,191,36,0.3); color: #fff; padding: 35px 20px; border-radius: 20px; text-align: center; position: relative; overflow: hidden; box-shadow: inset 0 0 40px rgba(0,0,0,0.8); transform: translateZ(30px); }
        
        /* 息づく黄金の数字 */
        .hero-amount { font-size: 56px; font-weight: 900; line-height: 1; margin: 15px 0; font-family: 'Inter', sans-serif; letter-spacing: -2px; background: linear-gradient(to bottom, #fef08a, #f59e0b, #b45309); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 5px 15px rgba(245,158,11,0.5)); animation: pulseTreasure 2s infinite alternate; }
        .hero-amount.negative { background: linear-gradient(to bottom, #fca5a5, #ef4444, #9f1239); -webkit-text-fill-color: transparent; filter: drop-shadow(0 5px 15px rgba(225,29,72,0.5)); }
        @keyframes pulseTreasure { 0% { transform: scale(1); filter: drop-shadow(0 5px 15px rgba(245,158,11,0.4)); } 100% { transform: scale(1.05); filter: drop-shadow(0 10px 25px rgba(245,158,11,0.8)); } }
        
        /* Bento UI: 内訳ボックス */
        .bar-wrap { width: 100%; background: rgba(0,0,0,0.5); border-radius: 8px; height: 12px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; box-shadow: inset 0 2px 5px rgba(0,0,0,0.8); }
        .bar-fill { height: 100%; border-radius: 8px; transition: width 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .bar-current { background: #64748b; }
        .bar-new { background: linear-gradient(90deg, #fbbf24, #f59e0b); box-shadow: 0 0 10px rgba(251,191,36,0.6); }
        
        .breakdown-box { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; font-family: 'Inter', sans-serif; transition: 0.3s; }
        .breakdown-box:hover { background: rgba(0,0,0,0.5); border-color: rgba(255,255,255,0.15); transform: translateX(5px); }
        .bd-val { font-size: 16px; font-weight: 900; color: #e2e8f0; }
        
        /* 🚨 赤字アラートと緑字プロモ */
        .alert-box { background: rgba(159, 18, 57, 0.2); border: 1px solid rgba(225, 29, 72, 0.4); padding: 12px 18px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
        .promo-box { background: rgba(6, 78, 59, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); padding: 12px 18px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
      `}} />

      {/* 🌫️ 1. ジェネレーティブUI（深海の波紋） */}
      <div className="abyss-fog"></div>
      {/* 🧭 9. イマーシブ背景（羅針盤透かし） */}
      <div className="compass-watermark"></div>

      <div className="container">
        <div className="header-top">
          <button className="btn-back" onClick={() => router.push("/")}>← 港へ戻る (Home)</button>
          <h1 className="page-title">カリブの海賊: 通信費シミュレーター</h1>
        </div>

        {/* 📱 8. バーティカルUI（可変グリッド） */}
        <div className="sim-layout">
          
          {/* 🏴‍☠️ 左側パネル：海図（ヒアリング） */}
          <div className="glass-panel">
            <h2 className="panel-title">🗺️ 現在の航路（ご利用状況）</h2>

            <div className="input-group">
              <label className="input-label">建物のタイプ</label>
              <div className="tab-group">
                <button className={`tab-btn ${housingType === "family" ? "active" : ""}`} onClick={() => setHousingType("family")}>🏠 戸建て</button>
                <button className={`tab-btn ${housingType === "mansion" ? "active" : ""}`} onClick={() => setHousingType("mansion")}>🏢 集合住宅</button>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">📱 ご利用中のスマホキャリア</label>
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
                  <input type="number" value={currentNet} style={{width:"80px", border:"none", background:"none", textAlign:"right", fontWeight:900, color:"#fde047", fontSize:"18px", outline:"none", textShadow:"0 0 10px rgba(253,224,71,0.5)"}} onChange={(e) => setCurrentNet(e.target.value)} />
                  <span className="val-display" style={{fontSize:"14px", color:"#94a3b8"}}>円</span>
                </div>
              </div>
              <input type="range" min="0" max="10000" step="100" className="range-slider" value={Number(currentNet) || 0} onChange={(e) => setCurrentNet(e.target.value)} />
            </div>

            <h2 className="panel-title" style={{ marginTop: "10px" }}>⚓ 新たな航路（ご提案プラン）</h2>

            <div className="input-group">
              <label className="input-label">提案回線</label>
              <select className="sim-select" value={targetCarrier} onChange={(e) => setTargetCarrier(e.target.value)}>
                {availableTargets.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* 初期費用（Bento UI風レイアウト） */}
            <div className="input-group" style={{background:"rgba(0,0,0,0.3)", padding:"16px", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.05)"}}>
              <label className="input-label" style={{marginBottom:"12px"}}>💳 乗り換えにかかる初期費用等</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{flex:1}}>
                  <div style={{fontSize:"11px", color:"#64748b", marginBottom:"6px"}}>事務手数料</div>
                  <input type="number" className="sim-input" style={{padding:"10px", fontSize:"14px"}} value={initialFee} onChange={(e)=>setInitialFee(e.target.value)} />
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"11px", color:"#64748b", marginBottom:"6px"}}>工事費</div>
                  <input type="number" className="sim-input" style={{padding:"10px", fontSize:"14px"}} value={constructionFee} onChange={(e)=>setConstructionFee(e.target.value)} />
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"11px", color:"#64748b", marginBottom:"6px"}}>現回線の解約金</div>
                  {/* ✨ ここが修正箇所！ Number() をかませて確実に数字として比較する */}
                  <input type="number" className="sim-input" style={{padding:"10px", fontSize:"14px", borderColor: Number(cancellationFee) > 0 ? "#fca5a5" : ""}} value={cancellationFee} onChange={(e)=>setCancellationFee(e.target.value)} />
                </div>
              </div>
            </div>

            {/* 🔘 6. Action-First（操作性の高いトグル群） */}
            <div className="option-box" onClick={() => setAddPhone(!addPhone)}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: 800, color:"#e2e8f0" }}>📞 ひかり電話を付帯する</span>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>セット割の条件などに（+550円/月）</span>
              </div>
              <label className="switch" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" checked={addPhone} onChange={() => setAddPhone(!addPhone)} />
                <span className="slider"></span>
              </label>
            </div>

            {targetCarrier.startsWith("flets") && (
              <div className="option-box" style={{ background: "rgba(6, 78, 59, 0.3)", borderColor: "rgba(16, 185, 129, 0.4)" }} onClick={() => setApplyFletsFree(!applyFletsFree)}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontWeight: 900, color: "#34d399" }}>🎁 究極魔法：半年間「全額実質無料」</span>
                  <span style={{ fontSize: "11px", color: "#a7f3d0" }}>CB枠を使って初期負担を完全に相殺します</span>
                </div>
                <label className="switch" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={applyFletsFree} onChange={() => setApplyFletsFree(!applyFletsFree)} />
                  <span className="slider" style={{ backgroundColor: applyFletsFree ? "#10b981" : "rgba(255,255,255,0.1)", borderColor: applyFletsFree ? "#34d399" : "" }}></span>
                </label>
              </div>
            )}

            {targetCarrier.startsWith("flets") && applyFletsFree && (
              <div style={{ background: "rgba(159, 18, 57, 0.2)", borderLeft: "4px solid #e11d48", padding: "16px", borderRadius: "8px", fontSize: "13px", color: "#fda4af", fontWeight: 800, lineHeight: 1.6 }}>
                💡 お客様負担を「0円」にするための生贄（条件）<br/>
                ・半年分の月額費用【{results.fletsHalfYearCost.toLocaleString()}円】<br/>
                ・初期費用/工事費/解約金【{results.firstYearExtraCosts.toLocaleString()}円】<br/>
                👉 <span style={{fontSize:"16px", fontWeight:900, color:"#fff"}}>合計【{results.requiredCbForFlets.toLocaleString()}円】</span> を下のキャッシュバック額にセットせよ。
              </div>
            )}

            <div className="option-box active-promo">
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: 800, color: "#fde047" }}>💰 財宝（キャッシュバック）設定</span>
                <span style={{ fontSize: "11px", color: "#fbbf24" }}>自由に金額を変更できます</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input type="number" className="cb-input" value={cbAmount} onChange={(e) => setCbAmount(e.target.value)} />
                <span style={{ fontWeight: 900, color: "#fbbf24" }}>円</span>
              </div>
            </div>
          </div>

          {/* ✨ 右側：発見された財宝（結果）パネル */}
          <div className="glass-panel">
            <h2 className="panel-title">💎 発見された財宝（シミュレーション結果）</h2>
            
            <div className="result-hero">
              <div style={{ fontSize: "14px", color: "#cbd5e1", fontWeight: 800, letterSpacing:"1px", textTransform:"uppercase" }}>初年度トータル節約額</div>
              <div className={`hero-amount ${results.annualSavings < 0 ? "negative" : ""}`}>
                {results.annualSavings >= 0 ? "+" : ""}{Math.floor(results.annualSavings).toLocaleString()} <span style={{fontSize:"24px", letterSpacing:"0"}}>円</span>
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>※初年度の特典・初期費用すべてを含む</div>
            </div>

            <div style={{marginTop:"20px", display:"flex", flexDirection:"column", gap:"15px", fontFamily:"'Inter', sans-serif"}}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 800, marginBottom: "6px", color:"#cbd5e1" }}>
                  <span>現状維持</span>
                  <span>{results.currentAnnual.toLocaleString()} 円</span>
                </div>
                <div className="bar-wrap">
                  <div className="bar-fill bar-current" style={{ width: `${currentChartWidth}%` }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 800, marginBottom: "6px", color:"#fbbf24" }}>
                  <span>乗り換え後（初期費用含む）</span>
                  <span>{results.newAnnualTotal.toLocaleString()} 円</span>
                </div>
                <div className="bar-wrap">
                  <div className="bar-fill bar-new" style={{ width: `${newChartWidth}%` }}></div>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: "15px", fontWeight: 900, color:"#fde047", borderLeft: "4px solid #f59e0b", paddingLeft: "10px", marginTop: "25px", marginBottom: "15px", letterSpacing:"1px" }}>
              月額・お支払い内訳
            </h3>

            {/* 🗃️ 2. Bento UI（計算結果のモジュール群） */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="breakdown-box">
                <span style={{color:"#94a3b8", fontSize:"13px", fontWeight:800}}>ネット基本料金</span>
                <span className="bd-val">{results.baseFee.toLocaleString()} 円</span>
              </div>
              {addPhone && (
                <div className="breakdown-box">
                  <span style={{color:"#94a3b8", fontSize:"13px", fontWeight:800}}>ひかり電話</span>
                  <span className="bd-val">+{results.phoneFee.toLocaleString()} 円</span>
                </div>
              )}
              {results.setDiscount.isApplied && (
                <div className="promo-box">
                  <span style={{color:"#34d399", fontSize:"13px", fontWeight:900}}>📱 スマホセット割</span>
                  <span className="bd-val" style={{color:"#34d399"}}>-{results.setDiscount.amount.toLocaleString()} 円</span>
                </div>
              )}
              
              {results.firstYearExtraCosts > 0 && (
                <div className="alert-box">
                  <span style={{color:"#fb7185", fontWeight:800, fontSize:"12px"}}>⚠️ 乗り換え時のみ発生（初期/工事/解約等）</span>
                  <span className="bd-val" style={{color:"#fb7185", fontSize:"15px"}}>+{results.firstYearExtraCosts.toLocaleString()} 円</span>
                </div>
              )}

              <div className="breakdown-box" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(251,191,36,0.5)", marginTop: "5px", padding: "20px" }}>
                <span style={{ fontWeight: 900, color:"#fde047", fontSize:"14px" }}>月々の実質お支払い</span>
                <span className="bd-val" style={{ fontSize: "24px", color: "#fbbf24", textShadow:"0 0 10px rgba(251,191,36,0.4)" }}>
                  {results.newMonthly.toLocaleString()} <span style={{fontSize:"14px"}}>円</span>
                </span>
              </div>

              {results.officialPromo.promoValue > 0 && (
                <div style={{ textAlign: "right", fontSize: "12px", fontWeight: 900, color: "#38bdf8", marginTop:"5px" }}>
                  {results.officialPromo.promoText}
                </div>
              )}
              
              {targetCarrier.startsWith("flets") && applyFletsFree && (
                <div style={{ textAlign: "right", fontSize: "12px", fontWeight: 900, color: "#34d399", marginTop: "2px" }}>
                  🎁 還元額より、初期負担＋半年間実質無料を補填！
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}