"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Simulator() {
  const router = useRouter();

  // 🌟 入力状態の管理（現状ヒアリング）
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
  
  // ✅ フレッツ光専用の「半年間無料（実質）」オプション
  const [applyFletsFree, setApplyFletsFree] = useState<boolean>(false);

  // 💰 初期費用・解約金の管理（新規追加！）
  const [initialFee, setInitialFee] = useState<number | string>(3300); // 事務手数料
  const [constructionFee, setConstructionFee] = useState<number | string>(22000); // 工事費
  const [cancellationFee, setCancellationFee] = useState<number | string>(0); // 現回線の解約金

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

  // 🌟 フレッツ光以外が選ばれたら、フレッツ専用トグルをOFFにする
  useEffect(() => {
    if (!targetCarrier.startsWith("flets")) {
      setApplyFletsFree(false);
    }
  }, [targetCarrier]);

  // 🧮 セット割判定
  const getSetDiscount = (carrierId: string, mobile: string) => {
    let amount = 0;
    let isApplied = false;
    let desc = "スマホセット割 対象外";

    if ((carrierId.startsWith("sb")) && (mobile === "sb" || mobile === "ymobile")) {
      amount = 1100; isApplied = true; desc = "SB/ワイモバ 割引適用！";
    } else if ((carrierId.startsWith("docomo")) && mobile === "docomo") {
      amount = 1100; isApplied = true; desc = "ドコモ光セット割 適用！";
    } else if ((carrierId === "au_1g" || carrierId === "biglobe_1g") && (mobile === "au" || mobile === "uq")) {
      amount = 1100; isApplied = true; desc = "au/UQ スマートバリュー適用！";
    }
    return { amount, isApplied, desc };
  };

  // 🧮 公式のキャンペーン判定 (キャリアがやってる公式割引)
  const getOfficialPromo = (carrierId: string, baseFee: number) => {
    let promoValue = 0;
    let promoText = "";

    if (carrierId === "sb_1g") {
      promoValue = baseFee * 3;
      promoText = "🎊 SB光公式: 基本料金 3ヶ月間無料";
    } else if (carrierId === "sb_10g") {
      promoValue = baseFee * 6;
      promoText = "🎊 SB光公式: 基本料金 6ヶ月間無料";
    } else if (carrierId === "docomo_10g") {
      promoValue = (baseFee - 500) * 6;
      promoText = "🎊 ドコモ公式: 6ヶ月間 月額500円";
    }
    return { promoValue, promoText };
  };

  // 🧮 全体の料金計算
  const calculateDiscounts = () => {
    const carrier = masterData[targetCarrier];
    const cNet = Number(currentNet) || 0;
    const cPhone = Number(currentPhone) || 0;
    
    // 【現状】年間コスト
    const currentMonthly = cNet + cPhone;
    const currentAnnual = currentMonthly * 12;

    // 【新提案】月額コスト
    const baseFee = carrier[housingType];
    const phoneFee = addPhone ? carrier.phone : 0;
    
    // ✅ 初年度のみ発生する「追加費用」の合算（事務手数料＋工事費＋解約金）
    const firstYearExtraCosts = (Number(initialFee) || 0) + (Number(constructionFee) || 0) + (Number(cancellationFee) || 0);

    // ✅ フレッツ光「完全」実質無料化に必要なトータル額（半年分の月額 ＋ 初期負担すべて）
    const fletsHalfYearCost = targetCarrier.startsWith("flets") ? (baseFee + phoneFee) * 6 : 0;
    const requiredCbForFlets = fletsHalfYearCost + firstYearExtraCosts;

    // セット割＆公式キャンペーンの取得
    const setDiscountInfo = getSetDiscount(targetCarrier, mobileCarrier);
    const officialPromoInfo = getOfficialPromo(targetCarrier, baseFee);

    // 新しい月額と、初年度の年間ベースコスト（月額12ヶ月 ＋ 追加費用）
    const newMonthly = baseFee + phoneFee - setDiscountInfo.amount;
    const newAnnualBase = (newMonthly * 12) + firstYearExtraCosts;
    
    // キャッシュバック＋公式キャンペーン を還元総額とする
    const totalPromoDiscount = (Number(cbAmount) || 0) + officialPromoInfo.promoValue;
    
    // 最終的な初年度トータルコストと、節約額
    const newAnnualTotal = newAnnualBase - totalPromoDiscount;
    const annualSavings = currentAnnual - newAnnualTotal;

    return { 
      baseFee, phoneFee, currentMonthly, newMonthly, 
      currentAnnual, newAnnualBase, newAnnualTotal, annualSavings,
      totalPromoDiscount, carrierName: carrier.name,
      setDiscount: setDiscountInfo, officialPromo: officialPromoInfo,
      fletsHalfYearCost, firstYearExtraCosts, requiredCbForFlets
    };
  };

  const results = calculateDiscounts();
  const currentChartWidth = 100;
  const newChartWidth = results.currentAnnual > 0 ? Math.max(0, Math.min(100, Math.floor((results.newAnnualTotal / results.currentAnnual) * 100))) : 0;

  return (
    <div className="glass-business-theme">
      <style dangerouslySetInnerHTML={{ __html: `
        .glass-business-theme * { box-sizing: border-box; }
        .glass-business-theme { font-family: 'Inter', 'Noto Sans JP', sans-serif; padding: 40px 20px; color: #334155; font-size: 14px; min-height: 100vh; background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 50%, #f8fafc 100%); overflow-x: hidden; }
        .container { max-width: 1100px; margin: 0 auto; }
        .header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; }
        .btn-back { background: rgba(255, 255, 255, 0.6); border: 1px solid rgba(255,255,255,0.9); padding: 10px 20px; border-radius: 12px; font-weight: 800; color: #475569; cursor: pointer; transition: 0.2s; backdrop-filter: blur(4px); }
        .btn-back:hover { background: #fff; transform: translateX(-3px); box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .page-title { font-size: 28px; font-weight: 900; background: linear-gradient(135deg, #0f172a 0%, #4f46e5 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; }
        .sim-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; }
        @media (max-width: 850px) { .sim-layout { grid-template-columns: 1fr; } }
        .glass-panel { background: rgba(255, 255, 255, 0.55); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.9); border-radius: 24px; padding: 30px; box-shadow: 0 10px 30px rgba(31, 38, 135, 0.05); display: flex; flex-direction: column; gap: 20px; }
        .panel-title { font-size: 18px; font-weight: 900; color: #1e293b; margin: 0; display: flex; align-items: center; gap: 10px; border-bottom: 2px dashed #cbd5e1; padding-bottom: 10px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-label { display: flex; justify-content: space-between; font-weight: 800; color: #475569; font-size: 13px; }
        .val-display { color: #ec4899; font-size: 16px; font-weight: 900; }
        .tab-group { display: flex; gap: 10px; background: rgba(255,255,255,0.5); padding: 5px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .tab-btn { flex: 1; padding: 8px; border: none; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; transition: 0.2s; background: transparent; color: #64748b; }
        .tab-btn.active { background: #fff; color: #4f46e5; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .sim-select { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #cbd5e1; background: rgba(255,255,255,0.7); font-size: 14px; font-weight: 800; color: #334155; outline: none; transition: 0.2s; cursor: pointer; }
        .option-box { display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.7); padding: 12px 16px; border-radius: 12px; border: 1px solid #e2e8f0; cursor: pointer; }
        .option-box.active-promo { background: linear-gradient(135deg, #fffbeb, #fef3c7); border-color: #fde68a; cursor: default; }
        .cb-input { background: rgba(255,255,255,0.9); border: 2px solid #fde68a; border-radius: 8px; padding: 8px 12px; width: 130px; font-weight: 900; font-size: 16px; color: #d97706; text-align: right; outline: none; transition: 0.2s; }
        .cb-input:focus { border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,0.2); }
        
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #4f46e5; }
        input:checked + .slider:before { transform: translateX(20px); }

        .result-hero { background: linear-gradient(135deg, #1e293b, #0f172a); color: #fff; padding: 25px; border-radius: 20px; text-align: center; position: relative; overflow: hidden; }
        .hero-amount { font-size: 42px; font-weight: 900; color: #10b981; line-height: 1; margin: 10px 0; }
        .hero-amount.negative { color: #ef4444; }
        .bar-wrap { width: 100%; background: rgba(255,255,255,0.5); border-radius: 10px; height: 16px; border: 1px solid #cbd5e1; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 10px; transition: width 1s ease-in-out; }
        .bar-current { background: #94a3b8; }
        .bar-new { background: linear-gradient(90deg, #3b82f6, #4f46e5); }
        .breakdown-box { background: rgba(255,255,255,0.7); border: 1px dashed #cbd5e1; border-radius: 12px; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; }
        .bd-val { font-size: 16px; font-weight: 900; color: #334155; }
      `}} />

      <div className="container">
        <div className="header-top">
          <button className="btn-back" onClick={() => router.push("/")}>← ホームに戻る</button>
          <h1 className="page-title">🆚 通信費 見直しシミュレーター</h1>
        </div>

        <div className="sim-layout">
          {/* 🗣️ 左側：ヒアリング入力エリア */}
          <div className="glass-panel">
            <h2 className="panel-title">🗣️ 現在のご利用状況</h2>

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
                  <option value="home_router">その他ホームルーター</option>
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

            <div className="input-group">
              <div className="input-label">
                <span>現在のネット代</span>
                <input type="number" value={currentNet} style={{width:"80px", border:"none", background:"none", textAlign:"right", fontWeight:900, color:"#ec4899"}} onChange={(e) => setCurrentNet(e.target.value)} />
                <span className="val-display">円</span>
              </div>
              <input type="range" min="0" max="10000" step="100" className="range-slider" value={Number(currentNet) || 0} onChange={(e) => setCurrentNet(e.target.value)} />
            </div>

            <h2 className="panel-title" style={{ marginTop: "10px" }}>🎯 ご提案プラン</h2>

            <div className="input-group">
              <label className="input-label">提案回線</label>
              <select className="sim-select" value={targetCarrier} onChange={(e) => setTargetCarrier(e.target.value)}>
                {availableTargets.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* ✅ 初期費用・解約金の入力エリアを追加！ */}
            <div className="input-group" style={{marginTop:"5px", background:"rgba(255,255,255,0.4)", padding:"12px", borderRadius:"12px", border:"1px solid #cbd5e1"}}>
              <label className="input-label" style={{marginBottom:"8px"}}>💳 乗り換えにかかる初期費用等 (初年度コストに加算)</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{flex:1}}>
                  <div style={{fontSize:"11px", color:"#64748b", marginBottom:"4px"}}>事務手数料</div>
                  <div style={{display:"flex", alignItems:"center", gap:"4px"}}>
                    <input type="number" className="sim-select" style={{padding:"8px"}} value={initialFee} onChange={(e)=>setInitialFee(e.target.value)} />
                    <span style={{fontSize:"12px"}}>円</span>
                  </div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"11px", color:"#64748b", marginBottom:"4px"}}>工事費</div>
                  <div style={{display:"flex", alignItems:"center", gap:"4px"}}>
                    <input type="number" className="sim-select" style={{padding:"8px"}} value={constructionFee} onChange={(e)=>setConstructionFee(e.target.value)} />
                    <span style={{fontSize:"12px"}}>円</span>
                  </div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"11px", color:"#64748b", marginBottom:"4px"}}>解約金(現回線)</div>
                  <div style={{display:"flex", alignItems:"center", gap:"4px"}}>
                    <input type="number" className="sim-select" style={{padding:"8px", borderColor:"#fca5a5"}} value={cancellationFee} onChange={(e)=>setCancellationFee(e.target.value)} />
                    <span style={{fontSize:"12px"}}>円</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="option-box" onClick={() => setAddPhone(!addPhone)} style={{marginTop:"5px"}}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: 800 }}>📞 ひかり電話を付帯する</span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>セット割条件などに（+550円/月）</span>
              </div>
              <label className="switch" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" checked={addPhone} onChange={() => setAddPhone(!addPhone)} />
                <span className="slider"></span>
              </label>
            </div>

            {/* ✅ フレッツ光を選んだ時だけ出現する「実質無料案内」のトグル */}
            {targetCarrier.startsWith("flets") && (
              <div className="option-box" style={{ background: "rgba(220, 252, 231, 0.6)", borderColor: "#86efac" }} onClick={() => setApplyFletsFree(!applyFletsFree)}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontWeight: 900, color: "#166534" }}>🎁 フレッツ光 半年間「実質無料(全額負担)」を案内</span>
                  <span style={{ fontSize: "11px", color: "#15803d" }}>※CB枠を使って月額料金＋初期費用等をすべてカバーします</span>
                </div>
                <label className="switch" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={applyFletsFree} onChange={() => setApplyFletsFree(!applyFletsFree)} />
                  <span className="slider" style={{ backgroundColor: applyFletsFree ? "#16a34a" : "#cbd5e1" }}></span>
                </label>
              </div>
            )}

            {/* ✅ フレッツ光実質無料ONのときだけ表示される、必要な【合算CB額】のアラート */}
            {targetCarrier.startsWith("flets") && applyFletsFree && (
              <div style={{ background: "#fef2f2", borderLeft: "4px solid #e11d48", padding: "12px", borderRadius: "8px", fontSize: "13px", color: "#9f1239", fontWeight: 800, lineHeight: 1.6 }}>
                💡 お客様負担を「0円」にするには、<br/>
                ・半年分の月額費用【{results.fletsHalfYearCost.toLocaleString()}円】<br/>
                ・初期費用/工事費/解約金【{results.firstYearExtraCosts.toLocaleString()}円】<br/>
                👉 <span style={{fontSize:"16px", fontWeight:900, textDecoration:"underline"}}>合計【{results.requiredCbForFlets.toLocaleString()}円】</span> を下のキャッシュバック額として設定してください。
              </div>
            )}

            <div className="option-box active-promo">
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: 800, color: "#d97706" }}>💰 キャッシュバック（還元額）設定</span>
                <span style={{ fontSize: "11px", color: "#b45309" }}>自由に金額を変更できます</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input 
                  type="number" 
                  className="cb-input" 
                  value={cbAmount} 
                  onChange={(e) => setCbAmount(e.target.value)} 
                />
                <span style={{ fontWeight: 900, color: "#d97706" }}>円</span>
              </div>
            </div>
          </div>

          {/* ✨ 右側：結果 */}
          <div className="glass-panel">
            <h2 className="panel-title">✨ シミュレーション結果</h2>
            <div className="result-hero">
              <div style={{ fontSize: "14px", color: "#94a3b8" }}>初年度トータル節約額</div>
              <div className={`hero-amount ${results.annualSavings < 0 ? "negative" : ""}`}>
                {results.annualSavings >= 0 ? "+" : ""}{Math.floor(results.annualSavings).toLocaleString()} <span style={{fontSize:"24px"}}>円</span>
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>※初年度の特典・初期費用すべてを含む</div>
            </div>

            <div className="comparison-row" style={{marginTop:"15px"}}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 800, marginBottom: "8px" }}>
                <span>現状維持</span>
                <span style={{ marginLeft: "auto" }}>{results.currentAnnual.toLocaleString()} 円</span>
              </div>
              <div className="bar-wrap">
                <div className="bar-fill bar-current" style={{ width: `${currentChartWidth}%` }}></div>
              </div>
            </div>

            <div className="comparison-row">
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 800, marginBottom: "8px" }}>
                <span>乗り換え後（初期費用含む）</span>
                <span style={{ marginLeft: "auto" }}>{results.newAnnualTotal.toLocaleString()} 円</span>
              </div>
              <div className="bar-wrap">
                <div className="bar-fill bar-new" style={{ width: `${newChartWidth}%` }}></div>
              </div>
            </div>

            <h3 style={{ fontSize: "14px", fontWeight: 900, borderLeft: "4px solid #ec4899", paddingLeft: "8px", marginTop: "20px", marginBottom: "12px" }}>
              お支払い目安（月額）
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div className="breakdown-box">
                <span>ネット基本料金</span>
                <span className="bd-val">{results.baseFee.toLocaleString()} 円</span>
              </div>
              {addPhone && (
                <div className="breakdown-box">
                  <span>ひかり電話</span>
                  <span className="bd-val">+{results.phoneFee.toLocaleString()} 円</span>
                </div>
              )}
              {results.setDiscount.isApplied && (
                <div className="breakdown-box" style={{ background: "rgba(224,242,254,0.5)", borderColor: "#bae6fd" }}>
                  <span style={{color:"#0ea5e9"}}>📱 スマホセット割</span>
                  <span className="bd-val" style={{color:"#0ea5e9"}}>-{results.setDiscount.amount.toLocaleString()} 円</span>
                </div>
              )}
              
              {/* ✅ 初期費用等のアラート表示 */}
              {results.firstYearExtraCosts > 0 && (
                <div className="breakdown-box" style={{ background: "rgba(254,226,226,0.5)", borderColor: "#fca5a5", padding: "8px 15px" }}>
                  <span style={{color:"#be123c", fontWeight:800, fontSize:"12px"}}>⚠️ 乗り換え時のみ発生する費用（初期/工事/解約等）</span>
                  <span className="bd-val" style={{color:"#be123c", fontSize:"14px"}}>+{results.firstYearExtraCosts.toLocaleString()} 円</span>
                </div>
              )}

              <div className="breakdown-box" style={{ background: "#fff", border: "2px solid #e2e8f0" }}>
                <span style={{ fontWeight: 800 }}>月々の実質お支払い</span>
                <span className="bd-val" style={{ fontSize: "20px", color: "#ec4899" }}>
                  {results.newMonthly.toLocaleString()} 円
                </span>
              </div>

              {results.officialPromo.promoValue > 0 && (
                <div style={{ textAlign: "right", fontSize: "13px", fontWeight: 900, color: "#ec4899" }}>
                  {results.officialPromo.promoText}
                </div>
              )}
              
              {/* フレッツ光 実質無料の案内表示 */}
              {targetCarrier.startsWith("flets") && applyFletsFree && (
                <div style={{ textAlign: "right", fontSize: "13px", fontWeight: 900, color: "#16a34a", marginTop: "5px" }}>
                  🎁 還元額より、初期負担＋半年間実質無料！
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}