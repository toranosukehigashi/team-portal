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
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 💡 フォームデータ
  const [form, setForm] = useState({
    colB: "", colC: "", colD: "", colE: "", colF: "", colG: "", colH: "", colI: "",
    colJ: "", colK: "", colL: "", colM: "", colN: "", colO: "", colP: "",
    tempPropertyType: "", tempEmail: "", 
    colQ: "", colR: "",
    colU: false, colV: false, colW: false, colX: false, colY: false,
    colZ: "", colAA: "", colAB: "", colAC: "", colAD: "", colAE: "", colAF: "", colAG: "",
    colAH: "", colAI: "", colAJ: false, colAK: false, colAL: false,
    colAN: "", colAP: "", colAQ: "", colAR: ""
  });

  useEffect(() => {
    const d = new Date();
    const todayStr = `${d.getMonth() + 1}/${d.getDate()}`;
    setForm(prev => ({ ...prev, colD: todayStr }));

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
    
    setForm(prev => {
      const nextForm = { ...prev, [targetId]: type === "checkbox" ? checked : value };
      if (targetId === "colU" && type === "checkbox" && checked) {
        const d = new Date();
        nextForm.colAH = `${d.getMonth() + 1}/${d.getDate()}`;
      }
      return nextForm;
    });

    if (type !== "checkbox" && value.trim() !== "") {
      setErrors(prevErrors => prevErrors.filter(err => err !== targetId));
    }
  };

  const addPhrase = (targetId: string, text: string) => {
    setForm(prev => {
      const currentValue = prev[targetId as keyof typeof prev] as string;
      const newValue = currentValue ? currentValue + "\n" + text : text;
      return { ...prev, [targetId]: newValue };
    });
    showToast("📝 フレーズを追加しました！", true);
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
  }, [form]);

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
      
      if (listRaw.includes("空室")) {
        newForm.colB = "空室通電";
      } else if (listRaw.includes("WEB") || listRaw.includes("ウェブ")) { 
        newForm.colB = "ウェブクルー";
      } else if (listRaw.includes("その他")) {
        newForm.colB = "引越侍その他"; 
      } else if (listRaw.includes("名古屋")) {
        newForm.colB = "名古屋案件";
      } else if (listRaw.includes("レ点") || listRaw.includes("引越侍")) {
        newForm.colB = "引越侍レ点有";
      } else if (listRaw.includes("SUUMO")) {
        newForm.colB = "SUUMO";
      } else {
        newForm.colB = listRaw; 
      }

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
        colZ: "", colAA: "", colAB: "", colAC: "", colAD: "", colAE: "", colAF: "", colAG: "",
        colAH: "", colAI: "", colAJ: false, colAK: false, colAL: false, colAN: "", colAP: "", colAQ: "", colAR: ""
      });
      setRawText(""); setErrors([]);
    }
  };

  const saveToSheet = () => {
    if (isSubmitting) return;
    const gasUrl = process.env.NEXT_PUBLIC_GAS_URL;
    if (!gasUrl) {
      alert("⚠️ Vercelの環境変数(NEXT_PUBLIC_GAS_URL)が設定されていません！");
      return;
    }

    setIsSubmitting(true);
    showToast("⏳ GASへ送信中...", true);

    const dataArray = [
      form.colB, form.colC, form.colD, form.colE, form.colF, form.colG, form.colH, form.colI,
      form.colJ, form.colK, form.colL, form.colM, form.colN, form.colO, form.colP,
      form.colQ, form.colR, "", "", form.colU ? "TRUE" : "", form.colV ? "TRUE" : "", form.colW ? "TRUE" : "", form.colX ? "TRUE" : "", form.colY ? "TRUE" : "",
      form.colZ, form.colAA, form.colAB, form.colAC, form.colAD, form.colAE, form.colAF, form.colAG,
      form.colAH, form.colAI, form.colAJ ? "TRUE" : "", form.colAK ? "TRUE" : "", form.colAL ? "TRUE" : "", "", form.colAN, "", form.colAP,
      form.colAQ, form.colAR
    ];

    const encodedData = encodeURIComponent(JSON.stringify(dataArray));
    const finalUrl = `${gasUrl}?env=${env}&data=${encodedData}`;

    const newWindow = window.open(finalUrl, "_blank");

    setTimeout(() => {
      if (newWindow) {
        newWindow.close();
      }
      showToast(env === 'test' ? "🧪 テスト送信完了！" : "✅ 本番送信完了！", true, env === 'prod');
      setIsSubmitting(false);
    }, 2500); 
  };

  const copyPlain = async (text: string, successMsg: string) => {
    try { await navigator.clipboard.writeText(text); showToast(successMsg, true); } catch (e) { alert("コピー失敗"); }
  };

  // 💡 QoL爆上がり機能！ワンクリックで個別の値をコピーする専用関数！
  const handleSingleCopy = (text: string, fieldName: string) => {
    if (!text) {
      showToast(`⚠️ ${fieldName} は空っぽです！`, false);
      return;
    }
    copyPlain(text, `📋 ${fieldName} をコピーしました！`);
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

          .app-wrapper { min-height: 100vh; padding: 20px 40px 100px 40px; font-family: 'Inter', 'Noto Sans JP', sans-serif; color: var(--text-main); font-size: 13px; transition: color 0.5s; overflow-x: hidden; position: relative; }
          .entrance-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -2; transition: background 0.8s ease; }
          .entrance-bg.theme-light { background: var(--bg-gradient); }
          .entrance-bg.theme-dark { background: var(--bg-gradient); }
          .particles-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; }
          .star { position: absolute; border-radius: 50%; background: var(--star-color); box-shadow: 0 0 10px var(--star-color); animation: twinkle 4s infinite ease-in-out; transition: background 0.5s, box-shadow 0.5s; }
          @keyframes twinkle { 0% { opacity: 0.1; transform: scale(0.5) translateY(0); } 50% { opacity: 1; transform: scale(1.2) translateY(-20px); } 100% { opacity: 0.1; transform: scale(0.5) translateY(0); } }

          .magic-svg-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none; opacity: 0.7; }
          .magic-path { fill: none; stroke: var(--svg-color); stroke-width: 3; stroke-dasharray: 3000; stroke-dashoffset: 3000; animation: drawMagic 10s ease-in-out infinite alternate; transition: stroke 0.5s; }
          @keyframes drawMagic { 0% { stroke-dashoffset: 3000; } 100% { stroke-dashoffset: 0; } }

          .hamburger-btn { position: fixed; top: 20px; left: 20px; z-index: 1001; background: var(--card-bg); backdrop-filter: blur(15px); border: 1px solid var(--card-border); border-radius: 12px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; gap: 5px; box-shadow: var(--card-shadow); transition: 0.3s; }
          .hamburger-btn:hover { background: var(--card-hover-bg); transform: scale(1.05); }
          .hamburger-line { width: 22px; height: 3px; background: var(--text-sub); border-radius: 3px; transition: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
          .hamburger-btn.open .line1 { transform: translateY(8px) rotate(45deg); background: var(--accent-color); }
          .hamburger-btn.open .line2 { opacity: 0; transform: translateX(-10px); }
          .hamburger-btn.open .line3 { transform: translateY(-8px) rotate(-45deg); background: var(--accent-color); }

          .menu-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(5px); z-index: 999; opacity: 0; pointer-events: none; transition: 0.4s ease; }
          .menu-overlay.open { opacity: 1; pointer-events: auto; }

          .side-menu { position: fixed; top: 0; left: -320px; width: 300px; height: 100vh; background: var(--card-bg); backdrop-filter: blur(30px); border-right: 1px solid var(--card-border); z-index: 1000; box-shadow: var(--card-shadow); transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); padding: 90px 24px 30px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
          .side-menu.open { left: 0; }
          .menu-title { font-size: 13px; font-weight: 900; color: var(--text-sub); margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed var(--card-border); letter-spacing: 1px; }

          .side-link { text-decoration: none; padding: 14px 20px; border-radius: 14px; background: var(--input-bg); color: var(--text-main); font-weight: 800; font-size: 14px; border: 1px solid var(--card-border); transition: all 0.2s; display: flex; align-items: center; gap: 12px; }
          .side-link:hover { border-color: var(--card-hover-border); transform: translateX(8px); }
          .side-link.current-page { background: linear-gradient(135deg, #0284c7, #38bdf8); color: #fff; border: none; box-shadow: 0 6px 15px rgba(2, 132, 199, 0.3); pointer-events: none; }

          .glass-nav-wrapper { display: flex; justify-content: center; margin-bottom: 30px; }
          .glass-nav { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: var(--card-bg); backdrop-filter: blur(16px); border: 1px solid var(--card-border); border-radius: 50px; box-shadow: var(--card-shadow); max-width: 800px; width: 100%; }
          
          .nav-left { display: flex; gap: 12px; align-items: center; }
          .glass-nav-link { text-decoration: none; padding: 10px 20px; border-radius: 30px; font-weight: 800; background: var(--input-bg); color: var(--text-sub); border: 1px solid var(--card-border); transition: 0.2s; font-size: 14px; }
          .glass-nav-link:hover { color: var(--accent-color); border-color: var(--card-hover-border); }
          .glass-nav-active { padding: 10px 20px; border-radius: 30px; font-weight: 900; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); font-size: 14px; }
          
          .env-toggle-container { display: flex; border-radius: 30px; padding: 4px; background: var(--input-bg); border: 1px solid var(--card-border); }
          .env-label { padding: 10px 20px; font-size: 13px; font-weight: 900; border-radius: 26px; cursor: pointer; color: var(--text-sub); transition: 0.3s; text-align: center; }
          input[name="environment"]:checked + .test-label { background: var(--card-hover-bg); color: #0ea5e9; border: 1px solid #38bdf8; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.2); }
          input[name="environment"]:checked + .prod-label { background: #fee2e2; color: #e11d48; border: 1px solid #f43f5e; box-shadow: 0 4px 10px rgba(225, 29, 72, 0.3); }

          .theme-toggle-btn { background: var(--input-bg); border: 1px solid var(--card-border); padding: 10px 20px; border-radius: 30px; cursor: pointer; transition: 0.3s; font-size: 14px; color: var(--text-main); font-weight: 800; }
          .theme-toggle-btn:hover { border-color: var(--card-hover-border); transform: scale(1.05); }

          .main-layout { display: grid; grid-template-columns: 320px 1fr; gap: 30px; max-width: 1200px; margin: 0 auto 50px auto; }
          @media (max-width: 950px) { .main-layout { grid-template-columns: 1fr; } }

          .info-sidebar { display: flex; flex-direction: column; gap: 20px; }
          .info-panel { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 20px; padding: 24px; box-shadow: var(--card-shadow); }
          .info-title { font-size: 15px; font-weight: 900; color: var(--title-color); margin-bottom: 15px; display: flex; align-items: center; gap: 8px; border-bottom: 2px dashed var(--card-border); padding-bottom: 10px; }
          .info-list { padding-left: 20px; margin: 0; color: var(--text-main); font-size: 13px; line-height: 1.8; }
          .info-list li { margin-bottom: 8px; }

          .form-main-area { display: flex; flex-direction: column; gap: 24px; }
          .glass-panel { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 20px; padding: 24px; box-shadow: var(--card-shadow); transition: transform 0.2s ease-out, box-shadow 0.2s ease-out, border-color 0.2s; }
          .glass-panel:hover { border-color: var(--card-hover-border); transform: translateY(-2px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }

          .form-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 15px 20px; }
          @media (max-width: 1100px) { .form-grid-3 { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 600px) { .form-grid-3 { grid-template-columns: 1fr; } }
          
          .input-group { display: flex; flex-direction: column; }
          
          /* 💡 コピーボタン用の新しいCSS（ここがQoL爆上がりポイント！） */
          .label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; border-left: 3px solid var(--accent-color); padding-left: 8px; }
          .label-row label { font-size: 12px; font-weight: 800; color: var(--text-sub); margin: 0; }
          .copy-btn { background: none; border: none; cursor: pointer; font-size: 14px; opacity: 0.5; transition: 0.2s; padding: 0 4px; display: flex; align-items: center; justify-content: center; }
          .copy-btn:hover { opacity: 1; transform: scale(1.2) translateY(-2px); text-shadow: 0 2px 10px rgba(56,189,248,0.5); }
          
          .input-control { width: 100%; padding: 12px 14px; border: 1px solid var(--input-border); border-radius: 10px; font-size: 13px; background: var(--input-bg); color: var(--text-main); transition: 0.3s; font-weight: 700; outline: none; }
          .input-control:focus { border-color: var(--card-hover-border); box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2); background: var(--card-hover-bg); }
          .input-control option { background: #0f172a; color: #fff; }
          .theme-light .input-control option { background: #fff; color: #1e293b; }

          .checkbox-group { display: flex; gap: 15px; flex-wrap: wrap; padding: 12px; background: var(--input-bg); border-radius: 10px; border: 1px solid var(--input-border); }
          .checkbox-group label { display: flex; align-items: center; gap: 6px; margin: 0; border: none; padding: 0; font-size: 13px; font-weight: 700; color: var(--text-main); cursor: pointer; }
          .checkbox-group input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--accent-color); cursor: pointer; }

          .special-box { background: var(--input-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.02); }
          .special-box.theme-pink { border-top: 4px solid #f43f5e; background: rgba(244, 63, 94, 0.05); }
          .special-box.theme-blue { border-top: 4px solid #0ea5e9; background: rgba(14, 165, 233, 0.05); }
          .special-box.theme-purple { border-top: 4px solid #8b5cf6; background: rgba(139, 92, 246, 0.05); }
          .special-title { font-weight: 900; font-size: 15px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; color: var(--title-color); }

          .quick-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
          .tag-btn { background: var(--input-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 6px 14px; font-size: 12px; color: var(--text-main); cursor: pointer; font-weight: 800; transition: 0.2s; }
          .tag-btn:hover { border-color: var(--card-hover-border); color: var(--accent-color); transform: translateY(-1px); }

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
          
          summary { font-weight: 800; cursor: pointer; padding: 16px; background: var(--card-bg); border-radius: 12px; border-left: 4px solid var(--accent-color); list-style: none; transition: 0.3s; border: 1px solid var(--card-border); }
          summary:hover { border-color: var(--card-hover-border); }

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
          <a href="/kpi-detail" className="side-link">📊 獲得進捗・KPI</a>
          <a href="/bulk-register" className="side-link current-page">📦 データ一括登録</a>
          <a href="/net-toss" className="side-link">🌐 ネットトス連携</a>
          <a href="/self-close" className="side-link">🤝 自己クロ連携</a>
          <a href="/sms-kraken" className="side-link">📱 SMS (Kraken)送信</a>
          <a href="/email-template" className="side-link">✉️ メールテンプレート</a>
          <a href="/procedure-wizard" className="side-link">🗺️ Kraken マニュアル</a>
          <a href="/simulator" className="side-link">🆚 料金シミュレーター</a>
          <a href="/trouble-nav" className="side-link">⚡ トラブル解決ナビ</a>
          
          <div className="side-link" style={{ opacity: 0.5, cursor: "not-allowed", background: "transparent", border: "1px dashed var(--card-border)", color: "var(--text-sub)", marginTop: "10px" }}>
            🔒 新ツール（開発中...）
          </div>
        </div>

        {/* 🎈 ナビゲーション & テーマ切り替え */}
        <div className="glass-nav-wrapper fade-up-element" style={{ "--delay": "0s" } as any}>
          <div className="glass-nav">
            <div className="nav-left">
              <a href="/" className="glass-nav-link">← 司令室に戻る</a>
              <div className="glass-nav-active">📦 データ一括登録</div>
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {isDarkMode ? "🎇 NIGHT" : "☀️ DAY"}
            </button>
          </div>
        </div>

        {/* 🌟 メインレイアウト */}
        <div className="main-layout">
          
          {/* ℹ️ 左カラム：注意事項 */}
          <aside className="info-sidebar">
            <div className="info-panel fade-up-element" style={{ padding: "16px", textAlign: "center", borderTop: env === "prod" ? "4px solid #e11d48" : "4px solid #38bdf8" }}>
              <div style={{ fontSize: "13px", fontWeight: 900, marginBottom: "10px", color: "var(--title-color)" }}>🚀 送信先環境の選択</div>
              <div className="env-toggle-container">
                <input type="radio" id="envTest" name="environment" value="test" checked={env === "test"} onChange={(e) => setEnv(e.target.value)} hidden />
                <label htmlFor="envTest" className="env-label test-label">🧪Test</label>
                <input type="radio" id="envProd" name="environment" value="prod" checked={env === "prod"} onChange={(e) => setEnv(e.target.value)} hidden />
                <label htmlFor="envProd" className="env-label prod-label">🚨Production</label>
              </div>
              {env === "prod" && (
                <div style={{ marginTop: "10px", fontSize: "12px", color: "#e11d48", fontWeight: 800 }}>※成約後シートへ直接書き込まれます。ご注意ください。</div>
              )}
            </div>

            <div className="info-panel fade-up-element">
              <h3 className="info-title">📌 入力時の注意事項</h3>
              <ul className="info-list">
                <li>「WarpID」が含まれたテキストをコピーすると、この画面を開いた瞬間に<b>自動でデータが反映</b>されます。</li>
                <li>各項目の右上にある「📋」ボタンを押すと、その内容を<b>一瞬でコピー</b>できます。</li>
                <li>郵便番号を入力すると、自動で住所が検索・補完されます。</li>
                <li>お名前（漢字）を入力すると、自動でカナが推測入力されます。</li>
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

          {/* 📝 右カラム：メインフォーム */}
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
              
              {/* 💡 基本情報のすべての項目に「コピーボタン」を搭載しました！！！ */}
              <div className="form-grid-3">
                <div className="input-group">
                  <div className="label-row"><label>B: リスト種別</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colB, 'リスト種別')} title="コピー">📋</button></div>
                  <select className="input-control" name="colB" value={form.colB} onChange={handleChange} style={getStyle('colB')}><option value="">選択</option><option value="引越侍レ点有">引越侍レ点有</option><option value="SUUMO">SUUMO</option><option value="ウェブクルー">ウェブクルー</option><option value="引越侍その他">引越侍その他</option><option value="名古屋案件">名古屋案件</option><option value="MOMI">MOMI</option><option value="空室通電">空室通電</option><option value="タクト">タクト</option><option value="リスト該当なし">リスト該当なし</option></select>
                </div>
                <div className="input-group">
                  <div className="label-row"><label>C: プラン名</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colC, 'プラン名')} title="コピー">📋</button></div>
                  <select className="input-control" name="colC" value={form.colC} onChange={handleChange} style={getStyle('colC')}><option value="">選択</option><option value="シンプルオクトパス2024-10">シンプルオクトパス2024-10</option><option value="グリーンオクトパス2023-12">グリーンオクトパス2023-12</option><option value="オール電化オクトパス2025-04">オール電化オクトパス2025-04</option><option value="LLオクトパス">LLオクトパス</option><option value="オール電化オクトパスゼロ">オール電化オクトパスゼロ</option></select>
                </div>
                <div className="input-group">
                  <div className="label-row"><label>D: 受付日</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colD, '受付日')} title="コピー">📋</button></div>
                  <input className="input-control" type="text" name="colD" value={form.colD} onChange={handleChange} style={getStyle('colD')} />
                </div>
                <div className="input-group">
                  <div className="label-row"><label>E: 担当者</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colE, '担当者')} title="コピー">📋</button></div>
                  <input className="input-control" type="text" name="colE" value={form.colE} onChange={handleChange} style={getStyle('colE')} />
                </div>
                <div className="input-group">
                  <div className="label-row"><label>F: 電話番号</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colF, '電話番号')} title="コピー">📋</button></div>
                  <input className="input-control" type="text" name="colF" value={form.colF} onChange={handleChange} style={getStyle('colF')} />
                </div>
                <div className="input-group">
                  <div className="label-row"><label>G: アカウント</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colG, 'アカウント')} title="コピー">📋</button></div>
                  <input className="input-control" type="text" name="colG" value={form.colG} onChange={handleChange} style={getStyle('colG')} />
                </div>
                <div className="input-group">
                  <div className="label-row"><label>H: 姓</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colH, '姓')} title="コピー">📋</button></div>
                  <input className="input-control" type="text" name="colH" value={form.colH} onChange={handleChange} onCompositionUpdate={(e) => handleKanaUpdate(e, "colJ")} style={getStyle('colH')} />
                </div>
                <div className="input-group">
                  <div className="label-row"><label>I: 名</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colI, '名')} title="コピー">📋</button></div>
                  <input className="input-control" type="text" name="colI" value={form.colI} onChange={handleChange} onCompositionUpdate={(e) => handleKanaUpdate(e, "colK")} style={getStyle('colI')} />
                </div>
                <div className="input-group">
                  <div className="label-row"><label>J: 姓カナ</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colJ, '姓カナ')} title="コピー">📋</button></div>
                  <input className="input-control" type="text" name="colJ" value={form.colJ} onChange={handleChange} style={getStyle('colJ')} />
                </div>
                <div className="input-group">
                  <div className="label-row"><label>K: 名カナ</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colK, '名カナ')} title="コピー">📋</button></div>
                  <input className="input-control" type="text" name="colK" value={form.colK} onChange={handleChange} style={getStyle('colK')} />
                </div>
                <div className="input-group">
                  <div className="label-row"><label>L: 再点日</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colL, '再点日')} title="コピー">📋</button></div>
                  <input className="input-control" type="text" name="colL" value={form.colL} onChange={handleChange} style={getStyle('colL')} />
                </div>
                <div className="input-group">
                  <div className="label-row"><label>M: 郵便番号</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colM, '郵便番号')} title="コピー">📋</button></div>
                  <input className="input-control" type="text" name="colM" value={form.colM} onChange={handleZipChange} style={getStyle('colM')} />
                </div>
                <div className="input-group">
                  <div className="label-row"><label>N: 都道府県〜番地</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colN, '都道府県〜番地')} title="コピー">📋</button></div>
                  <input className="input-control" type="text" name="colN" value={form.colN} onChange={handleChange} style={getStyle('colN')} />
                </div>
                <div className="input-group">
                  <div className="label-row"><label>O: 建物名・部屋</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colO, '建物名・部屋')} title="コピー">📋</button></div>
                  <input className="input-control" type="text" name="colO" value={form.colO} onChange={handleChange} style={getStyle('colO')} />
                </div>
                <div className="input-group">
                  <div className="label-row"><label>P: 送付先</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colP, '送付先')} title="コピー">📋</button></div>
                  <select className="input-control" name="colP" value={form.colP} onChange={handleChange} style={getStyle('colP')}><option value="">選択</option><option value="引越先">引越先</option><option value="現住所">現住所</option><option value="請求先">請求先</option></select>
                </div>
                <div className="input-group">
                  <div className="label-row"><label>🏠 物件種別</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.tempPropertyType, '物件種別')} title="コピー">📋</button></div>
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
                  <div className="input-group">
                    <div className="label-row"><label>Q: 郵送名義</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colQ, '郵送名義')} title="コピー">📋</button></div>
                    <input className="input-control" type="text" name="colQ" value={form.colQ} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <div className="label-row"><label>R: 連絡先番号</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colR, '連絡先番号')} title="コピー">📋</button></div>
                    <input className="input-control" type="text" name="colR" value={form.colR} onChange={handleChange} />
                  </div>
                </div>
                
                <div style={{ background: "rgba(229,0,126,0.05)", border: "1px dashed rgba(229,0,126,0.4)", padding: "12px", borderRadius: "12px", marginTop: "15px", marginBottom: "20px" }}>
                  <label style={{ color: "#e5007e", fontSize: "13px", fontWeight: 900, borderLeft: "4px solid #e5007e", paddingLeft: "8px", marginBottom: "10px", display: "block" }}>🚨 ガス・ネット関連（※チェック漏れ注意！）</label>
                  <div className="checkbox-group">
                    <label><input type="checkbox" name="colU" checked={form.colU} onChange={handleChange} /> ネット</label>
                    <label><input type="checkbox" name="colV" checked={form.colV} onChange={handleChange} /> TOKAI</label>
                    <label><input type="checkbox" name="colW" checked={form.colW} onChange={handleChange} /> セット</label>
                    <label><input type="checkbox" name="colX" checked={form.colX} onChange={handleChange} /> 東邦</label>
                    <label><input type="checkbox" name="colY" checked={form.colY} onChange={handleChange} /> 西部</label>
                  </div>
                </div>

                <div className="special-box theme-blue">
                  <div className="special-title">🧊 ガス</div>
                  <div className="form-grid-3">
                    <div className="input-group">
                      <div className="label-row"><label>Z: ガス立会日</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colZ, 'ガス立会日')} title="コピー">📋</button></div>
                      <input className="input-control" type="text" name="colZ" value={form.colZ} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <div className="label-row"><label>AA: 希望時間帯</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colAA, '希望時間帯')} title="コピー">📋</button></div>
                      <select className="input-control" name="colAA" value={form.colAA} onChange={handleChange}><option value="">選択</option><option value="1.午前中(9-12)">午前中(9-12)</option><option value="3.13-15">13-15</option><option value="5.15-17">15-17</option><option value="7.17-19(平日)">17-19(平日)</option></select>
                    </div>
                    <div className="input-group">
                      <div className="label-row"><label>AB: 立会者</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colAB, '立会者')} title="コピー">📋</button></div>
                      <input className="input-control" type="text" name="colAB" value={form.colAB} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <div className="label-row"><label>AC: 開栓場所</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colAC, '開栓場所')} title="コピー">📋</button></div>
                      <input className="input-control" type="text" name="colAC" value={form.colAC} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <div className="label-row"><label>AD: 建物区分</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colAD, '建物区分')} title="コピー">📋</button></div>
                      <select className="input-control" name="colAD" value={form.colAD} onChange={handleChange}><option value="">選択</option><option value="戸建て（持家）">戸建て（持家）</option><option value="戸建て（賃貸）">戸建て（賃貸）</option><option value="集合住宅（持家）">集合住宅（持家）</option><option value="集合住宅（賃貸）">集合住宅（賃貸）</option></select>
                    </div>
                    <div className="input-group">
                      <div className="label-row"><label>AE: 新築既設</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colAE, '新築既設')} title="コピー">📋</button></div>
                      <select className="input-control" name="colAE" value={form.colAE} onChange={handleChange}><option value="">選択</option><option value="新築">新築</option><option value="既設">既設</option></select>
                    </div>
                    <div className="input-group">
                      <div className="label-row"><label>AF: 支払い方法</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colAF, '支払い方法')} title="コピー">📋</button></div>
                      <select className="input-control" name="colAF" value={form.colAF} onChange={handleChange}><option value="">選択</option><option value="コンビニ">コンビニ</option><option value="口座">口座</option><option value="クレカ">クレカ</option></select>
                    </div>
                    <div className="input-group" style={{ gridColumn: "1 / -1" }}>
                      <div className="label-row"><label>AG: 不都合時間等</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colAG, '不都合時間等')} title="コピー">📋</button></div>
                      <textarea className="input-control" rows={2} name="colAG" value={form.colAG} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div className="special-box theme-pink">
                  <div className="special-title">💎 ネットトス</div>
                  <div className="form-grid-3">
                    <div className="input-group">
                      <div className="label-row"><label>AH: 獲得日</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colAH, '獲得日')} title="コピー">📋</button></div>
                      <input className="input-control" type="text" name="colAH" value={form.colAH} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <div className="label-row"><label>AI: 対応者</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colAI, '対応者')} title="コピー">📋</button></div>
                      <input className="input-control" type="text" name="colAI" value={form.colAI} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <div className="label-row"><label>AN: 商材</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colAN, '商材')} title="コピー">📋</button></div>
                      <select className="input-control" name="colAN" value={form.colAN} onChange={handleChange}>
                        <option value="">選択</option>
                        <option value="フレッツ光">フレッツ光</option><option value="ドコモ光">ドコモ光</option><option value="Softbank光">Softbank光</option>
                        <option value="auひかり">auひかり</option><option value="NURO光">NURO光</option><option value="Softbank Air">Softbank Air</option>
                        <option value="トス">トス</option><option value="その他">その他</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <label style={{ color: "#f43f5e", fontSize: "12px", fontWeight: 900, borderLeft: "3px solid #f43f5e", paddingLeft: "6px", marginBottom: "8px", display: "block" }}>確認フラグ</label>
                    <div className="checkbox-group">
                      <label><input type="checkbox" name="colAJ" checked={form.colAJ} onChange={handleChange} /> ネットOK</label>
                      <label><input type="checkbox" name="colAK" checked={form.colAK} onChange={handleChange} /> 前確OK</label>
                      <label><input type="checkbox" name="colAL" checked={form.colAL} onChange={handleChange} /> 後確OK</label>
                    </div>
                  </div>
                </div>

                <div className="special-box theme-purple">
                  <div className="special-title">🌟 対応依頼内容</div>
                  
                  <div className="input-group">
                    <div className="label-row"><label>AP: 対応依頼内容</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colAP, '対応依頼内容')} title="コピー">📋</button></div>
                    <div className="quick-tags">
                      <button type="button" className="tag-btn" onClick={() => addPhrase('colAP', 'ガス手配お願いします')}>➕ ガス手配</button>
                      <button type="button" className="tag-btn" onClick={() => addPhrase('colAP', '水道手配お願いします')}>➕ 水道手配</button>
                      <button type="button" className="tag-btn" onClick={() => addPhrase('colAP', 'ガス水道手配お願いします')}>➕ 両方手配</button>
                      <button type="button" className="tag-btn" onClick={() => addPhrase('colAP', 'ガスセット')}>➕ ガスセット</button>
                      <button type="button" className="tag-btn" onClick={() => addPhrase('colAP', '5営業日以内再点です\nSPIN：')}>➕ 5営業日以内</button>
                      <button type="button" className="tag-btn" onClick={() => addPhrase('colAP', 'ダミー再点です\nSPIN：')}>➕ ダミー再点</button>
                      <button type="button" className="tag-btn" onClick={() => addPhrase('colAP', '完了後SMS希望')}>➕ 完了後SMS</button>
                    </div>
                    <textarea className="input-control" style={{ minHeight: "80px", resize: "vertical" }} name="colAP" value={form.colAP} onChange={handleChange} />
                  </div>

                  <div className="form-grid-3" style={{ marginTop: "15px" }}>
                    <div className="input-group">
                      <div className="label-row"><label>AQ: 開始/最終利用日</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colAQ, '開始/最終利用日')} title="コピー">📋</button></div>
                      <input className="input-control" type="text" name="colAQ" value={form.colAQ} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <div className="label-row"><label>AR: 都道府県</label><button type="button" className="copy-btn" onClick={() => handleSingleCopy(form.colAR, '都道府県')} title="コピー">📋</button></div>
                      <input className="input-control" type="text" name="colAR" value={form.colAR} onChange={handleChange} />
                    </div>
                  </div>
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

      </main>
    </>
  );
}