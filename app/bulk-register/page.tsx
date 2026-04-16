"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// ✨ 背景の光の粒（静寂なカームデザイン）
const PixieDust = () => {
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

export default function BulkRegister() {
  const router = useRouter();

  // 🌟 状態管理
  const [rawText, setRawText] = useState("");
  const [env, setEnv] = useState("test");
  const [toast, setToast] = useState({ show: false, msg: "", isSuccess: true, isProd: false });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ☀️ テーマ管理
  const [isDarkMode, setIsDarkMode] = useState(false);

  // フォームデータ
  const [form, setForm] = useState({
    colB: "", colC: "", colD: "", colE: "", colF: "", colG: "", colH: "", colI: "",
    colJ: "", colK: "", colL: "", colM: "", colN: "", colO: "", colP: "",
    tempPropertyType: "", tempEmail: "", colQ: "", colR: "",
    colU: false, colV: false, colW: false, colX: false, colY: false,
    colZ: "", colAA: "", colAB: "", colAB_2: "", colAC: "", colAD: "", colAE: "", colAF: "", colAG: "",
    colAH: "", colAI: "", colAJ: false, colAK: false, colAL: false,
    colAN: "", colAP: "", colAQ: "", colAR: ""
  });

  useEffect(() => {
    const d = new Date();
    const todayStr = `${d.getMonth() + 1}/${d.getDate()}`;
    setForm(prev => ({ ...prev, colD: todayStr }));

    // スクロール連動トリガー
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    showToast(!isDarkMode ? "🌙 ダークモードに切り替えました" : "☀️ ライトモードに切り替えました", true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { id, value, type, name, checked } = target;
    const targetId = id || name;
    
    setForm(prev => ({ 
      ...prev, 
      [targetId]: type === "checkbox" ? checked : value 
    }));

    if (type !== "checkbox" && value.trim() !== "") {
      setErrors(prevErrors => prevErrors.filter(err => err !== targetId));
    }
  };

  const showToast = (msg: string, isSuccess: boolean, isProd = false) => {
    setToast({ show: true, msg, isSuccess, isProd });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const lastWarpId = useRef<string | null>(null);
  useEffect(() => {
    const checkWarpData = async () => {
      try {
        const text = await navigator.clipboard.readText();
        const match = text.match(/\[WarpID:(\d+)\]/);
        if (match) {
          const currentWarpId = match[1];
          if (currentWarpId !== lastWarpId.current) {
            lastWarpId.current = currentWarpId;
            const cleanText = text.replace(/\[WarpID:\d+\]\n?/g, '').trim();
            setRawText(cleanText);
            doParse(cleanText); 
            showToast("🚀 CallTreeからデータを受信！自動振り分け完了！", true);
          }
        }
      } catch (err) {}
    };
    window.addEventListener("focus", checkWarpData);
    return () => window.removeEventListener("focus", checkWarpData);
  }, []);

  const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e); 
    const zip = e.target.value.replace(/[-ー]/g, '');
    if (zip.length === 7) {
      try {
        const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`);
        const data = await res.json();
        if (data.results) {
          const addr = data.results[0].address1 + data.results[0].address2 + data.results[0].address3;
          setForm(prev => ({ ...prev, colN: addr }));
          setErrors(prevErrors => prevErrors.filter(err => err !== "colN"));
          showToast("🏠 郵便番号から住所を自動入力しました！", true);
        }
      } catch (err) {}
    }
  };

  const baseKana = useRef("");
  const handleKanaUpdate = (e: any, targetKanaId: string) => {
    const text = e.data;
    if (text && !/[\u4E00-\u9FFF]/.test(text)) {
      const kanaStr = text.replace(/[\u3041-\u3096]/g, (match: any) => String.fromCharCode(match.charCodeAt(0) + 0x60));
      setForm(prev => ({ ...prev, [targetKanaId]: baseKana.current + kanaStr }));
      setErrors(prevErrors => prevErrors.filter(err => err !== targetKanaId));
    }
  };

  const doParse = (text: string) => {
    if (!text) { showToast("⚠️ データを貼り付けてください！", false); return; }
    let newForm = { ...form };
    const lines = text.split(/\r?\n/).map(line => line.replace(/^[^：:]+[：:]\s*/, '').trim());
    if (lines.length >= 14) {
      const raw0 = lines[0] || ""; const raw1 = lines[1] || "";
      let planRaw = raw0.includes("シンプル") || raw0.includes("グリーン") || raw0.includes("LL") || raw0.includes("電化") || raw0.includes("ゼロ") ? raw0 : raw1;
      let listRaw = planRaw === raw0 ? raw1 : raw0;
      
      if (planRaw.includes("シンプル")) newForm.colC = "シンプルオクトパス2024-10";
      else if (planRaw.includes("グリーン")) newForm.colC = "グリーンオクトパス2023-12";
      else if (planRaw.includes("LL")) newForm.colC = "LLオクトパス";
      else if (planRaw.includes("ゼロ")) newForm.colC = "オール電化オクトパスゼロ";
      else if (planRaw.includes("電化")) newForm.colC = "オール電化オクトパス2025-04";
      
      newForm.colB = listRaw.includes("レ点") || listRaw.includes("引越侍") ? "引越侍レ点有" : (listRaw.includes("SUUMO") ? "SUUMO" : listRaw);
      newForm.colD = lines[2] || `${new Date().getMonth() + 1}/${new Date().getDate()}`;
      newForm.colE = lines[3]; newForm.colF = lines[4]; newForm.colG = lines[5];
      newForm.colH = lines[6]; newForm.colI = lines[7]; newForm.colJ = lines[8];
      newForm.colK = lines[9]; newForm.colL = lines[10]; newForm.colM = lines[11];
      
      const addrParts = (lines[12] || "").split(/[ 　]+/);
      newForm.colN = addrParts[0] || ""; 
      newForm.colO = addrParts.slice(1).join(" ") || "";
      newForm.colP = lines[13]?.includes("引越") ? "引越先" : "現住所";
      newForm.tempEmail = lines[14] || "";

      if (newForm.colO.trim() !== "") newForm.tempPropertyType = "集合住宅";
      else newForm.tempPropertyType = "戸建て";

      setForm(newForm);
      runPatrol(newForm);
    } else { showToast("⚠️ 行数が足りません", false); }
  };

  const runPatrol = (currentForm: any = form) => {
    let errs: string[] = [];
    const requiredIds = ['colB', 'colC', 'colD', 'colE', 'colF', 'colG', 'colH', 'colI', 'colJ', 'colK', 'colL', 'colM', 'colN', 'colO', 'colP'];
    requiredIds.forEach(id => { if (!currentForm[id] || currentForm[id].trim() === "") errs.push(id); });
    setErrors(errs);
    if (errs.length > 0) showToast(`✨ 振り分け完了！ ⚠️ ${errs.length} 箇所の未入力があります`, false);
    else showToast("✨ 自動振り分け完了！エラーなし！", true);
  };

  const getStyle = (id: string) => (errors.includes(id)) ? { backgroundColor: 'var(--error-bg)', borderColor: 'var(--error-border)' } : {};

  const clearAllFields = () => {
    if (confirm("データをクリアしますか？")) {
      const d = new Date();
      setForm({
        colB: "", colC: "", colD: `${d.getMonth() + 1}/${d.getDate()}`, colE: "", colF: "", colG: "", colH: "", colI: "",
        colJ: "", colK: "", colL: "", colM: "", colN: "", colO: "", colP: "", tempPropertyType: "", tempEmail: "",
        colQ: "", colR: "", colU: false, colV: false, colW: false, colX: false, colY: false,
        colZ: "", colAA: "", colAB: "", colAB_2: "", colAC: "", colAD: "", colAE: "", colAF: "", colAG: "",
        colAH: "", colAI: "", colAJ: false, colAK: false, colAL: false, colAN: "", colAP: "", colAQ: "", colAR: ""
      });
      setRawText(""); setErrors([]);
    }
  };

  const saveToSheet = async () => {
    if (isSubmitting) return;
    const gasUrl = process.env.NEXT_PUBLIC_GAS_URL;
    if (!gasUrl || gasUrl === "undefined") return alert("⚠️ GASのURLが設定されていません！");

    setIsSubmitting(true);
    showToast("⏳ スプレッドシートへ送信中...", true);

    const dataArray = [
      form.colB, form.colC, form.colD, form.colE, form.colF, form.colG, form.colH, form.colI,
      form.colJ, form.colK, form.colL, form.colM, form.colN, form.colO, form.colP,
      "", "", "", "", form.colU, form.colV, form.colW, form.colX, form.colY,
      form.colZ, form.colAA, form.colAB, form.colAC, form.colAD, form.colAE, form.colAF, form.colAG,
      form.colAH, form.colAI, form.colAJ, form.colAK, form.colAL, "", form.colAN, "", form.colAP,
      form.colAQ, form.colAR
    ];

    const encodedData = encodeURIComponent(JSON.stringify(dataArray));
    const warpUrl = `${gasUrl}?env=${env}&data=${encodedData}`;

    const hiddenIframe = document.getElementById("hidden_warp_iframe") as HTMLIFrameElement;
    if (hiddenIframe) hiddenIframe.src = warpUrl;

    setTimeout(() => {
      showToast(env === 'test' ? "🧪 テスト環境への保存を完了しました！" : "✅ 本番環境への保存を完了しました！", true, env === 'prod');
      setIsSubmitting(false);
    }, 3000);
  };

  const copyPlain = async (text: string, successMsg: string) => {
    try { await navigator.clipboard.writeText(text); showToast(successMsg, true); } catch (e) { alert("コピー失敗"); }
  };

  const copyForOctopus = () => {
    const normalizeDate = (str: string) => {
      if (!str) return "";
      let s = str.trim().replace(/\//g, "-");
      let parts = s.split("-");
      if (parts.length === 2) return `${new Date().getFullYear()}/${("0"+parts[0]).slice(-2)}/${("0"+parts[1]).slice(-2)}`;
      if (parts.length === 3) return `${parts[0]}/${("0"+parts[1]).slice(-2)}/${("0"+parts[2]).slice(-2)}`;
      return str;
    };
    
    const data = {
      moveInDate: normalizeDate(form.colL), lastName: form.colH, firstName: form.colI, lastNameKatakana: form.colJ,
      firstNameKatakana: form.colK, mobile: form.colF, email: form.tempEmail, postcode: form.colM,
      addressLine1: form.colN, buildingName: form.colO, propertyType: form.tempPropertyType 
    };
    copyPlain(JSON.stringify(data), "🐙 OBJ用データをコピーしました！");
  };

  const copyInfoTemplate = () => {
    const d = new Date();
    const text = `リスト種別：\nプラン名：\n受付日：${d.getMonth() + 1}/${d.getDate()}\n担当者：\n電話番号：\nアカウント番号：\n姓：\n名：\n姓（カナ）：\n名（カナ）：\n再点日：\n郵便番号：\n住所：\n送付先：引越先\nEmail：`;
    copyPlain(text, "📋 FMTコピーしました！");
  };

  return (
    <>
      <div className={`entrance-bg ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <PixieDust />
      </div>

      <main className={`app-wrapper ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <style dangerouslySetInnerHTML={{ __html: `
          .app-wrapper * { box-sizing: border-box; }

          /* 🎨 HOME画面と完全一致するテーマ変数 */
          .theme-light {
            --bg-gradient: linear-gradient(180deg, #7dd3fc 0%, #e0f2fe 100%);
            --text-main: #1e293b;
            --text-sub: #475569;
            --card-bg: rgba(255, 255, 255, 0.7);
            --card-border: rgba(255, 255, 255, 1);
            --card-hover-border: #38bdf8;
            --card-hover-bg: rgba(255, 255, 255, 0.95);
            --card-shadow: 0 10px 30px rgba(0,0,0,0.05);
            --title-color: #0369a1;
            --accent-color: #0284c7;
            --input-bg: rgba(255, 255, 255, 0.8);
            --input-border: rgba(203, 213, 225, 0.8);
            --svg-color: rgba(2, 132, 199, 0.2);
            --star-color: #f59e0b;
            --error-bg: #fff1f2;
            --error-border: #e11d48;
          }
          
          .theme-dark {
            --bg-gradient: radial-gradient(ellipse at bottom, #1e1b4b 0%, #020617 100%);
            --text-main: #f8fafc;
            --text-sub: #cbd5e1;
            --card-bg: rgba(15, 23, 42, 0.7);
            --card-border: rgba(255, 255, 255, 0.15);
            --card-hover-border: #38bdf8;
            --card-hover-bg: rgba(30, 41, 59, 0.9);
            --card-shadow: 0 20px 50px rgba(0,0,0,0.8);
            --title-color: #fde047;
            --accent-color: #38bdf8;
            --input-bg: rgba(0, 0, 0, 0.4);
            --input-border: rgba(255, 255, 255, 0.2);
            --svg-color: rgba(255, 255, 255, 0.4);
            --star-color: #fef08a;
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
          .star { position: absolute; border-radius: 50%; background: var(--star-color); box-shadow: 0 0 10px var(--star-color); animation: twinkle 4s infinite ease-in-out; transition: background 0.5s, box-shadow 0.5s; }
          @keyframes twinkle { 0% { opacity: 0.1; transform: scale(0.5) translateY(0); } 50% { opacity: 1; transform: scale(1.2) translateY(-20px); } 100% { opacity: 0.1; transform: scale(0.5) translateY(0); } }

          /* 🌟 SVGアニメーション背景 */
          .magic-svg-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none; opacity: 0.7; }
          .magic-path { fill: none; stroke: var(--svg-color); stroke-width: 3; stroke-dasharray: 3000; stroke-dashoffset: 3000; animation: drawMagic 10s ease-in-out infinite alternate; transition: stroke 0.5s; }
          @keyframes drawMagic { 0% { stroke-dashoffset: 3000; } 100% { stroke-dashoffset: 0; } }

          /* ハンバーガーボタン */
          .hamburger-btn { position: fixed; top: 20px; left: 20px; z-index: 1001; background: var(--card-bg); backdrop-filter: blur(15px); border: 1px solid var(--card-border); border-radius: 12px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; gap: 5px; box-shadow: var(--card-shadow); transition: 0.3s; }
          .hamburger-btn:hover { background: var(--card-hover-bg); transform: scale(1.05); }
          .hamburger-line { width: 22px; height: 3px; background: var(--text-sub); border-radius: 3px; transition: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
          .hamburger-btn.open .line1 { transform: translateY(8px) rotate(45deg); background: var(--accent-color); }
          .hamburger-btn.open .line2 { opacity: 0; transform: translateX(-10px); }
          .hamburger-btn.open .line3 { transform: translateY(-8px) rotate(-45deg); background: var(--accent-color); }

          /* メニューオーバーレイ */
          .menu-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(5px); z-index: 999; opacity: 0; pointer-events: none; transition: 0.4s ease; }
          .menu-overlay.open { opacity: 1; pointer-events: auto; }

          /* サイドメニュー */
          .side-menu { position: fixed; top: 0; left: -320px; width: 300px; height: 100vh; background: var(--card-bg); backdrop-filter: blur(30px); border-right: 1px solid var(--card-border); z-index: 1000; box-shadow: var(--card-shadow); transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); padding: 90px 24px 30px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
          .side-menu.open { left: 0; }
          .menu-title { font-size: 13px; font-weight: 900; color: var(--text-sub); margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed var(--card-border); letter-spacing: 1px; }

          .side-link { text-decoration: none; padding: 14px 20px; border-radius: 14px; background: var(--input-bg); color: var(--text-main); font-weight: 800; font-size: 14px; border: 1px solid var(--card-border); transition: all 0.2s; display: flex; align-items: center; gap: 12px; }
          .side-link:hover { border-color: var(--card-hover-border); transform: translateX(8px); }
          .side-link.current-page { background: linear-gradient(135deg, #0284c7, #38bdf8); color: #fff; border: none; box-shadow: 0 6px 15px rgba(2, 132, 199, 0.3); pointer-events: none; }

          /* 🎈 トップナビゲーション（中央配置に修正） */
          .glass-nav-wrapper { display: flex; justify-content: center; margin-bottom: 30px; }
          .glass-nav { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: var(--card-bg); backdrop-filter: blur(16px); border: 1px solid var(--card-border); border-radius: 50px; box-shadow: var(--card-shadow); max-width: 800px; width: 100%; }
          
          .nav-left { display: flex; gap: 12px; align-items: center; }
          .glass-nav-link { text-decoration: none; padding: 10px 20px; border-radius: 30px; font-weight: 800; background: var(--input-bg); color: var(--text-sub); border: 1px solid var(--card-border); transition: 0.2s; font-size: 14px; }
          .glass-nav-link:hover { color: var(--accent-color); border-color: var(--card-hover-border); }
          .glass-nav-active { padding: 10px 20px; border-radius: 30px; font-weight: 900; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); font-size: 14px; }
          
          /* 🔧 環境トグル (Test / Prod) - 超・明確化 */
          .env-toggle-container { display: flex; border-radius: 30px; padding: 4px; background: var(--input-bg); border: 1px solid var(--card-border); }
          .env-label { padding: 10px 20px; font-size: 13px; font-weight: 900; border-radius: 26px; cursor: pointer; color: var(--text-sub); transition: 0.3s; text-align: center; }
          
          /* Test 選択時 */
          input[name="environment"]:checked + .test-label { background: var(--card-hover-bg); color: #0ea5e9; border: 1px solid #38bdf8; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.2); }
          
          /* Prod 選択時 (警告の赤) */
          input[name="environment"]:checked + .prod-label { background: #fee2e2; color: #e11d48; border: 1px solid #f43f5e; box-shadow: 0 4px 10px rgba(225, 29, 72, 0.3); }

          /* テーマ切り替えボタン */
          .theme-toggle-btn { background: var(--input-bg); border: 1px solid var(--card-border); padding: 10px 20px; border-radius: 30px; cursor: pointer; transition: 0.3s; font-size: 14px; color: var(--text-main); font-weight: 800; }
          .theme-toggle-btn:hover { border-color: var(--card-hover-border); transform: scale(1.05); }

          /* 🌟 レイアウト：左の注意事項 ＋ 右の入力フォーム */
          .main-layout {
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: 30px;
            max-width: 1200px;
            margin: 0 auto 50px auto;
          }
          @media (max-width: 950px) { .main-layout { grid-template-columns: 1fr; } }

          /* ℹ️ 左側：注意事項パネル */
          .info-sidebar { display: flex; flex-direction: column; gap: 20px; }
          .info-panel {
            background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border);
            border-radius: 20px; padding: 24px; box-shadow: var(--card-shadow);
          }
          .info-title { font-size: 15px; font-weight: 900; color: var(--title-color); margin-bottom: 15px; display: flex; align-items: center; gap: 8px; border-bottom: 2px dashed var(--card-border); padding-bottom: 10px; }
          .info-list { padding-left: 20px; margin: 0; color: var(--text-main); font-size: 13px; line-height: 1.8; }
          .info-list li { margin-bottom: 8px; }

          /* 📝 右側：メインフォームエリア */
          .form-main-area { display: flex; flex-direction: column; gap: 24px; }

          /* パネルとBento UI（傾き廃止） */
          .glass-panel { 
            background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); 
            border-radius: 20px; padding: 24px; box-shadow: var(--card-shadow); 
            transition: transform 0.2s ease-out, box-shadow 0.2s ease-out, border-color 0.2s; 
          }
          .glass-panel:hover { border-color: var(--card-hover-border); transform: translateY(-2px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }

          .form-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 15px 20px; }
          @media (max-width: 1100px) { .form-grid-3 { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 600px) { .form-grid-3 { grid-template-columns: 1fr; } }
          
          .input-group { display: flex; flex-direction: column; }
          .input-group label { font-size: 12px; font-weight: 800; color: var(--text-sub); margin-bottom: 6px; border-left: 3px solid var(--accent-color); padding-left: 8px; }
          
          .input-control { width: 100%; padding: 12px 14px; border: 1px solid var(--input-border); border-radius: 10px; font-size: 13px; background: var(--input-bg); color: var(--text-main); transition: 0.3s; font-weight: 700; outline: none; }
          .input-control:focus { border-color: var(--card-hover-border); box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2); background: var(--card-hover-bg); }
          .input-control option { background: #0f172a; color: #fff; }
          .theme-light .input-control option { background: #fff; color: #1e293b; }

          .paste-area { width: 100%; height: 100px; padding: 14px; border: 2px dashed var(--card-hover-border); border-radius: 12px; background: var(--input-bg); color: var(--text-main); margin-bottom: 16px; outline: none; transition: 0.3s; font-family: monospace; resize: vertical; }
          .paste-area:focus { background: var(--card-hover-bg); box-shadow: 0 0 15px rgba(56, 189, 248, 0.2); }
          
          .btn-primary { width: 100%; padding: 14px; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff; border: none; border-radius: 10px; font-weight: 900; cursor: pointer; transition: 0.3s; font-size: 14px; letter-spacing: 1px; box-shadow: 0 5px 15px rgba(2, 132, 199, 0.3); }
          .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(2, 132, 199, 0.5); }
          
          .save-footer { display: flex; gap: 16px; position: fixed; bottom: 0; left: 0; width: 100%; padding: 16px 40px; background: var(--card-bg); backdrop-filter: blur(12px); border-top: 1px solid var(--card-border); z-index: 50; justify-content: center; }
          .btn-footer { max-width: 400px; width: 100%; padding: 16px; border-radius: 30px; font-weight: 900; border: none; color: #fff; cursor: pointer; transition: 0.3s; font-size: 15px; letter-spacing: 1px; }
          .btn-footer-oct { background: #8b5cf6; box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3); }
          .btn-footer-oct:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(139, 92, 246, 0.5); }
          .btn-footer-save { background: #10b981; box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3); }
          .btn-footer-save:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(16, 185, 129, 0.5); }

          #toast { visibility: hidden; min-width: 250px; color: #fff; text-align: center; border-radius: 12px; padding: 16px 24px; position: fixed; z-index: 100; right: 24px; bottom: -80px; font-weight: bold; transition: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
          #toast.show { visibility: visible; bottom: 100px; opacity: 1; }
          
          .tag-btn { background: var(--input-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 6px 14px; font-size: 12px; color: var(--text-main); cursor: pointer; font-weight: 800; transition: 0.2s; }
          .tag-btn:hover { border-color: var(--card-hover-border); color: var(--accent-color); }
          
          summary { font-weight: 800; cursor: pointer; padding: 16px; background: var(--card-bg); border-radius: 12px; border-left: 4px solid var(--accent-color); list-style: none; transition: 0.3s; border: 1px solid var(--card-border); }
          summary:hover { border-color: var(--card-hover-border); }

          /* 🪄 スクロール連動（フワッと浮かび上がる） */
          .fade-up-element { opacity: 0; transform: translateY(40px); transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
          .fade-up-element.visible { opacity: 1; transform: translateY(0); }
        `}} />

        {/* 🌟 SVG魔法の軌跡 */}
        <svg className="magic-svg-bg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path className="magic-path" d="M -10,30 Q 30,80 50,50 T 110,40" />
          <path className="magic-path" d="M -10,70 Q 40,20 70,60 T 110,80" style={{animationDelay: "4s", opacity: 0.5}} />
        </svg>

        {/* 🍔 ハンバーガーボタン */}
        <div className={`hamburger-btn ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className="hamburger-line line1"></div>
          <div className="hamburger-line line2"></div>
          <div className="hamburger-line line3"></div>
        </div>

        {/* 🌌 メニュー展開時の背景オーバーレイ */}
        <div className={`menu-overlay ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(false)}></div>

        {/* 🗄️ サイドメニュー */}
        <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
          <div className="menu-title">🧭 TOOL MENU</div>
          <a href="/bulk-register" className="side-link current-page">📦 一括登録（自己クロ）</a>
          <a href="/net-toss" className="side-link">🌐 ネットトス連携</a>
          <a href="/self-close" className="side-link">🌲 自己クロ連携</a>
          <a href="/sms-kraken" className="side-link">📱 SMS (Kraken)</a>
          <a href="/email-template" className="side-link">✨ メールテンプレート</a>
          <div className="side-link" style={{ opacity: 0.5, cursor: "not-allowed", background: "transparent", border: "1px dashed var(--card-border)", color: "var(--text-sub)" }}>
            🔒 新ツール（開発中...）
          </div>
        </div>

        {/* 🎈 ナビゲーション & テーマ切り替え（中央配置） */}
        <div className="glass-nav-wrapper fade-up-element" style={{ "--delay": "0s" } as any}>
          <div className="glass-nav">
            <div className="nav-left">
              <a href="/" className="glass-nav-link">← 司令室</a>
              <div className="glass-nav-active">📦 一括登録</div>
            </div>
            
            {/* ☀️/🌙 テーマ切り替えボタン */}
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {isDarkMode ? "🎇 NIGHT" : "☀️ DAY"}
            </button>
          </div>
        </div>

        {/* 🌟 メインレイアウト（左：注意事項 / 右：入力フォーム） */}
        <div className="main-layout">
          
          {/* ℹ️ 左カラム：注意事項・備考パネル */}
          <aside className="info-sidebar">
            
            {/* 🔧 環境トグル (Test / Prod) - 目立つように改善 */}
            <div className="info-panel fade-up-element" style={{ padding: "16px", textAlign: "center", borderTop: env === "prod" ? "4px solid #e11d48" : "4px solid #38bdf8" }}>
              <div style={{ fontSize: "13px", fontWeight: 900, marginBottom: "10px", color: "var(--title-color)" }}>🚀 送信先環境の選択</div>
              <div className="env-toggle-container">
                <input type="radio" id="envTest" name="environment" value="test" checked={env === "test"} onChange={(e) => setEnv(e.target.value)} hidden />
                <label htmlFor="envTest" className="env-label test-label">🧪 練習用 (Test)</label>
                
                <input type="radio" id="envProd" name="environment" value="prod" checked={env === "prod"} onChange={(e) => setEnv(e.target.value)} hidden />
                <label htmlFor="envProd" className="env-label prod-label">🚨 本番用 (Prod)</label>
              </div>
              {env === "prod" && (
                <div style={{ marginTop: "10px", fontSize: "12px", color: "#e11d48", fontWeight: 800 }}>
                  ※本番シートへ直接書き込まれます。ご注意ください。
                </div>
              )}
            </div>

            <div className="info-panel fade-up-element">
              <h3 className="info-title">📌 入力時の注意事項</h3>
              <ul className="info-list">
                <li>「WarpID」が含まれたテキストをコピーすると、この画面を開いた瞬間に<b>自動でデータが反映</b>されます。</li>
                <li>郵便番号を入力すると、ハイフンなしでも自動で住所が検索・補完されます。</li>
                <li>お名前（漢字）を入力すると、自動でカナが推測入力されますが、念のため確認してください。</li>
                <li>赤枠でハイライトされた項目は必須入力です。</li>
              </ul>
            </div>
            
            <div className="info-panel fade-up-element">
              <h3 className="info-title">🛠️ 運用ステータス</h3>
              <ul className="info-list">
                <li>GAS連携：正常（稼働中）</li>
                <li>CallTree自動連携：有効</li>
                <li>郵便番号API：有効</li>
              </ul>
            </div>
          </aside>

          {/* 📝 右カラム：メインフォームエリア */}
          <div className="form-main-area">
            
            <section className="glass-panel fade-up-element">
              <div style={{ fontWeight: 900, marginBottom: "12px", color: "var(--title-color)", fontSize: "15px" }}>1. データの貼り付けと解析</div>
              <textarea className="paste-area" placeholder="Warpからコピーしたデータを貼り付けてください" value={rawText} onChange={(e) => setRawText(e.target.value)} />
              <button className="btn-primary" onClick={() => doParse(rawText)}>✨ 自動振り分けを実行</button>
            </section>

            <section className="glass-panel fade-up-element">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", borderBottom: "2px dashed var(--card-border)", paddingBottom: "15px" }}>
                <div style={{ fontWeight: 900, fontSize: "15px", color: "var(--title-color)" }}>2. 基本情報（B〜P列）</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="tag-btn" onClick={clearAllFields}>🗑️ クリア</button>
                  <button className="tag-btn" onClick={copyInfoTemplate}>📋 FMTコピー</button>
                </div>
              </div>
              
              <div className="form-grid-3">
                <div className="input-group"><label>B: リスト種別</label><select className="input-control" name="colB" value={form.colB} onChange={handleChange} style={getStyle('colB')}><option value="">選択</option><option value="引越侍レ点有">引越侍レ点有</option><option value="SUUMO">SUUMO</option><option value="ウェブクルー">ウェブクルー</option><option value="引越侍その他">引越侍その他</option><option value="名古屋案件">名古屋案件</option><option value="MOMI">MOMI</option><option value="空室通電">空室通電</option><option value="タクト">タクト</option><option value="リスト該当なし">リスト該当なし</option></select></div>
                <div className="input-group"><label>C: プラン名</label><select className="input-control" name="colC" value={form.colC} onChange={handleChange} style={getStyle('colC')}><option value="">選択</option><option value="シンプルオクトパス2024-10">シンプルオクトパス2024-10</option><option value="グリーンオクトパス2023-12">グリーンオクトパス2023-12</option><option value="オール電化オクトパス2025-04">オール電化オクトパス2025-04</option><option value="LLオクトパス">LLオクトパス</option><option value="オール電化オクトパスゼロ">オール電化オクトパスゼロ</option></select></div>
                <div className="input-group"><label>D: 受付日</label><input className="input-control" type="text" name="colD" value={form.colD} onChange={handleChange} style={getStyle('colD')} /></div>
                <div className="input-group"><label>E: 担当者</label><input className="input-control" type="text" name="colE" value={form.colE} onChange={handleChange} style={getStyle('colE')} /></div>
                <div className="input-group"><label>F: 電話番号</label><input className="input-control" type="text" name="colF" value={form.colF} onChange={handleChange} style={getStyle('colF')} /></div>
                <div className="input-group"><label>G: アカウント</label><input className="input-control" type="text" name="colG" value={form.colG} onChange={handleChange} style={getStyle('colG')} /></div>
                <div className="input-group"><label>H: 姓</label><input className="input-control" type="text" name="colH" value={form.colH} onChange={handleChange} onCompositionUpdate={(e) => handleKanaUpdate(e, "colJ")} style={getStyle('colH')} /></div>
                <div className="input-group"><label>I: 名</label><input className="input-control" type="text" name="colI" value={form.colI} onChange={handleChange} onCompositionUpdate={(e) => handleKanaUpdate(e, "colK")} style={getStyle('colI')} /></div>
                <div className="input-group"><label>J: 姓カナ</label><input className="input-control" type="text" name="colJ" value={form.colJ} onChange={handleChange} style={getStyle('colJ')} /></div>
                <div className="input-group"><label>K: 名カナ</label><input className="input-control" type="text" name="colK" value={form.colK} onChange={handleChange} style={getStyle('colK')} /></div>
                <div className="input-group"><label>L: 再点日</label><input className="input-control" type="text" name="colL" value={form.colL} onChange={handleChange} style={getStyle('colL')} /></div>
                <div className="input-group"><label>M: 郵便番号</label><input className="input-control" type="text" name="colM" value={form.colM} onChange={handleZipChange} style={getStyle('colM')} /></div>
                <div className="input-group"><label>N: 都道府県〜番地</label><input className="input-control" type="text" name="colN" value={form.colN} onChange={handleChange} style={getStyle('colN')} /></div>
                <div className="input-group"><label>O: 建物名・部屋</label><input className="input-control" type="text" name="colO" value={form.colO} onChange={handleChange} style={getStyle('colO')} /></div>
                <div className="input-group"><label>P: 送付先</label><select className="input-control" name="colP" value={form.colP} onChange={handleChange} style={getStyle('colP')}><option value="">選択</option><option value="引越先">引越先</option><option value="現住所">現住所</option><option value="請求先">請求先</option></select></div>
                <div className="input-group">
                  <label>🏠 物件種別</label>
                  <select className="input-control" name="tempPropertyType" value={form.tempPropertyType} onChange={handleChange}>
                    <option value="">選択</option><option value="戸建て">戸建て</option><option value="集合住宅">集合住宅</option>
                  </select>
                </div>
              </div>
            </section>

            <details className="fade-up-element">
              <summary>➕ 追加情報・オプションを展開</summary>
              <section className="glass-panel" style={{ marginTop: "15px" }}>
                <div className="form-grid-3">
                   <div className="input-group"><label>AH: 獲得日</label><input className="input-control" type="text" name="colAH" value={form.colAH} onChange={handleChange} /></div>
                   <div className="input-group"><label>AI: 対応者</label><input className="input-control" type="text" name="colAI" value={form.colAI} onChange={handleChange} /></div>
                   <div className="input-group"><label>AN: 商材</label><input className="input-control" type="text" name="colAN" value={form.colAN} onChange={handleChange} /></div>
                </div>
                <div className="input-group" style={{ marginTop: "20px" }}>
                  <label>AP: 対応依頼内容</label>
                  <textarea className="input-control" style={{ minHeight: "80px", resize: "vertical" }} name="colAP" value={form.colAP} onChange={handleChange} />
                </div>
              </section>
            </details>
            
          </div>
        </div>

        {/* 固定フッター（アクションボタン） */}
        <div className="save-footer">
          <button className="btn-footer btn-footer-oct" onClick={copyForOctopus}>🐙 OBJ用にコピー</button>
          <button className="btn-footer btn-footer-save" onClick={saveToSheet} disabled={isSubmitting}>
            {isSubmitting ? "⌛ 送信中..." : "💾 成約後シートに書き込む"}
          </button>
        </div>

        {/* トースト通知 */}
        <div id="toast" className={toast.show ? "show" : ""} style={{ background: toast.isProd ? "var(--error-border)" : "#0284c7" }}>{toast.msg}</div>

        {/* 🥷 隠しマント（透明なIframe） */}
        <iframe id="hidden_warp_iframe" style={{ display: "none" }} title="hidden-warp"></iframe>
      </main>
    </>
  );
}