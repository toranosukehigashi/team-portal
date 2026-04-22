"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SideMenu from "@/app/components/SideMenu"; // 💡 共通メニューを呼び出し！

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

export default function SelfClose() {
  const router = useRouter();

  // 🌟 状態管理
  const [rawText, setRawText] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "", isError: false });
  const [emailError, setEmailError] = useState(false);
  const [sameAsMove, setSameAsMove] = useState(false);
  
  // 💡 isMenuOpen の State は SideMenu に移動したので完全に削除済み！
  const [isReady, setIsReady] = useState(false);

  // ☀️ テーマ管理
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [form, setForm] = useState({
    colList: "",
    colSei: "", colMei: "", colSeiKana: "", colMeiKana: "",
    birthYear: "", birthMonth: "", birthDay: "",
    colNewAddress: "", colCurrentAddress: "",
    colPhone: "", colEmail: "",
    colCallNum: "", octopusStatus: "", colIntention: "",
    colProduct: "", colPlan: "", gender: "",
    colMoveDate: "", docSend: "", colKoji: "", kojiFee: "",
    colCurrentLine: "", colHouseType: "", colCarrier: "", newOld: "",
    cbHalfYearFree: false, colCB: ""
  });

  const [preview, setPreview] = useState("");

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1939 }, (_, i) => {
    const y = 1940 + i;
    let wareki = "";
    if (y >= 2019) wareki = `令和${y - 2018 === 1 ? "元" : y - 2018}`;
    else if (y >= 1989) wareki = `平成${y - 1988 === 1 ? "元" : y - 1988}`;
    else wareki = `昭和${y - 1925}`;
    return { value: `${y}年`, label: `${y} (${wareki})年` };
  });

  useEffect(() => {
    setIsReady(true);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nameFormatted = [form.colSei, form.colMei, form.colSeiKana, form.colMeiKana].filter(v => v !== "").join("　");
    const birthStr = (form.birthYear || form.birthMonth || form.birthDay) ? `${form.birthYear}${form.birthMonth}${form.birthDay}` : "";
    
    const displayCb = form.cbHalfYearFree ? "半年間無料分" : form.colCB;
    const cbFormatted = displayCb ? `（${displayCb}＋220）/` : "（＋220）/";

    let kojiFormatted = "";
    if (form.colKoji) {
      const kParts = form.colKoji.split("-");
      if (kParts.length === 3) kojiFormatted = `${parseInt(kParts[1], 10)}/${parseInt(kParts[2], 10)}以降最短`;
    }

    const text = 
      "リスト名：" + (form.colList || "") + "\n" +
      "名義：" + nameFormatted + "\n" +
      "生年月日：" + birthStr + "\n" +
      "新居先：" + (form.colNewAddress || "") + "\n" +
      "現住所：" + (form.colCurrentAddress || "") + "\n" +
      "携帯番号：" + (form.colPhone || "") + "\n" +
      "Email：" + (form.colEmail || "") + "\n" +
      "-------------\n" +
      "注意事項・共有事項\n" +
      "・【架電番号】：" + (form.colCallNum || "") + "\n" +
      "・【オクトパスNG or OK】：" + (form.octopusStatus || "") + "\n" +
      "・【意思取り方法】：" + (form.colIntention || "") + "\n" +
      "-------------\n" +
      "商材名：" + (form.colProduct || "") + "\n" +
      "プラン名：" + (form.colPlan || "") + "\n" +
      "-------------\n" +
      "獲得者：\n" +
      "前確者：\n" +
      "-------------\n" +
      "名義人性別：" + (form.gender || "") + "\n" +
      "-------------\n" +
      "後確処理方法：CL\n" +
      "後確希望時間：\n" +
      "-------------\n" +
      "引越日：" + (form.colMoveDate || "") + "\n" +
      "書類発送先：" + (form.docSend || "") + "\n" +
      "工事希望日：" + kojiFormatted + "\n" +
      "工事費：" + (form.kojiFee || "") + "（フレッツとDocomoのみヒアリング）\n" +
      "現在利用回線：" + (form.colCurrentLine || "") + "\n" +
      "住宅タイプ：" + (form.colHouseType || "") + "\n" +
      "新築既設：" + (form.newOld || "") + "\n" +
      "モバイルキャリア：" + (form.colCarrier || "") + "\n" +
      "-------------\n" +
      "CB：" + cbFormatted + "\n" +
      "支払い方法：口座 or クレジット\n" +
      "光コン有無：不明\n" +
      "OP有無：なし\n" +
      "ルーター：レンタル・お客様準備\n\n" +
      "-------------\n" +
      "キャリアキャンペーン：あり・なし\n" +
      "⇒ありの場合キャンペーン名称：\n" +
      "-------------\n" +
      "セット割：あり・なし\n" +
      "開通前レンタル：あり・なし\n" +
      "-------------\n" +
      "固定電話有無：あり・なし\n" +
      "==========================================";
    
    setPreview(text);
  }, [form]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    showToast(!isDarkMode ? "🌙 ダークモードに切り替えました" : "☀️ ライトモードに切り替えました");
  };

  const showToast = (msg: string, isError = false) => {
    setToast({ show: true, msg, isError });
    setTimeout(() => setToast({ show: false, msg: "", isError: false }), 3000);
  };

  const handleChange = (e: any) => {
    const { id, value, type, checked, name } = e.target;
    const targetId = id || name;
    setForm(prev => ({ ...prev, [targetId]: type === "checkbox" ? checked : value }));

    if (targetId === "colEmail") {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(value !== "" && !regex.test(value));
    }
  };

  const addPhrase = (phrase: string) => {
    setForm(prev => ({
      ...prev,
      colIntention: prev.colIntention ? prev.colIntention + " " + phrase : phrase
    }));
  };

  const baseKana = useRef("");
  const handleKanaUpdate = (e: any, targetKanaId: string) => {
    const text = e.data;
    if (text && !/[\u4E00-\u9FFF]/.test(text)) {
      const kanaStr = text.replace(/[\u3041-\u3096]/g, (match: any) => String.fromCharCode(match.charCodeAt(0) + 0x60));
      setForm(prev => ({ ...prev, [targetKanaId]: baseKana.current + kanaStr }));
    }
  };

  const handleSyncKoji = (e: any) => {
    const checked = e.target.checked;
    setSameAsMove(checked);
    if (checked && form.colMoveDate) {
      const parts = form.colMoveDate.match(/\d+/g);
      if (parts && parts.length >= 2) {
        let y, m, d;
        if (parts.length === 2) {
          y = currentYear; m = parseInt(parts[0], 10) - 1; d = parseInt(parts[1], 10);
        } else {
          y = parseInt(parts[0], 10);
          if (y < 100) y += 2000;
          m = parseInt(parts[1], 10) - 1; d = parseInt(parts[2], 10);
        }
        const targetDate = new Date(y, m, d);
        if (!isNaN(targetDate.getTime())) {
          const yyyy = targetDate.getFullYear();
          const mm = ("0" + (targetDate.getMonth() + 1)).slice(-2);
          const dd = ("0" + targetDate.getDate()).slice(-2);
          setForm(prev => ({ ...prev, colKoji: `${yyyy}-${mm}-${dd}` }));
        }
      }
    }
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
            showToast("🚀 CallTreeからデータを受信！自動入力完了！");
          }
        }
      } catch (err) {}
    };
    window.addEventListener("focus", checkWarpData);
    return () => window.removeEventListener("focus", checkWarpData);
  }, []);

  const doParse = (text: string) => {
    if (!text) { showToast("⚠️ データを貼り付けてください", true); return; }
    const lines = text.split(/\r?\n/).map(line => line.replace(/^[^：:]+[：:]\s*/, '').trim());
    
    if (lines.length >= 14) {
      let newForm = { ...form };
      const raw0 = lines[0] || ""; const raw1 = lines[1] || "";
      let listRaw = (raw0.includes("シンプル") || raw0.includes("グリーン")) ? raw1 : raw0;
      
      let pList = listRaw;
      if (listRaw.includes("レ点") || listRaw.includes("引越侍")) pList = "引越侍レ点有";
      else if (listRaw.includes("SUUMO")) pList = "SUUMO";
      else if (listRaw.includes("ウェブ")) pList = "ウェブクルー";

      newForm.colList = pList;
      newForm.colSei = lines[6] || "";
      newForm.colMei = lines[7] || "";
      newForm.colSeiKana = lines[8] || "";
      newForm.colMeiKana = lines[9] || "";
      newForm.colPhone = lines[4] || "";
      newForm.colMoveDate = lines[10] || "";
      newForm.colNewAddress = (lines[11] || "") + "　" + (lines[12] || "");
      newForm.colEmail = lines[14] || "";
      
      setForm(newForm);
      showToast("✨ 自動入力が完了しました！");
    } else {
      showToast("⚠️ データの行数が足りません！(15行必要です)", true);
    }
  };

  const copyTemplate = async () => {
    if (emailError) { showToast("⚠️ メールアドレスの形式が正しくありません！", true); return; }
    try {
      await navigator.clipboard.writeText(preview);
      showToast("✨ 自己クロテンプレをコピーしました！");
    } catch (err) {
      alert("コピーに失敗しました");
    }
  };

  const clearAll = () => {
    if (!confirm("入力をリセットしますか？")) return;
    setForm({
      colList: "", colSei: "", colMei: "", colSeiKana: "", colMeiKana: "",
      birthYear: "", birthMonth: "", birthDay: "", colNewAddress: "", colCurrentAddress: "",
      colPhone: "", colEmail: "", colCallNum: "", octopusStatus: "", colIntention: "",
      colProduct: "", colPlan: "", gender: "", colMoveDate: "", docSend: "", colKoji: "", kojiFee: "",
      colCurrentLine: "", colHouseType: "", colCarrier: "", newOld: "", cbHalfYearFree: false, colCB: ""
    });
    setRawText(""); setEmailError(false); setSameAsMove(false);
  };

  return (
    <>
      <div className={`entrance-bg ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <PixieDust />
      </div>

      <main className={`app-wrapper ${isReady ? "ready" : ""} ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <style dangerouslySetInnerHTML={{ __html: `
          .app-wrapper * { box-sizing: border-box; }

          /* 🔮 完全なパープル仕様のカラーテーマ */
          .theme-light {
            --bg-gradient: linear-gradient(135deg, #e9d5ff 0%, #f3e8ff 50%, #f8fafc 100%);
            --text-main: #1e293b;
            --text-sub: #475569;
            --card-bg: rgba(255, 255, 255, 0.75);
            --card-border: rgba(255, 255, 255, 1);
            --card-hover-border: #a855f7;
            --card-hover-bg: rgba(255, 255, 255, 0.95);
            --card-shadow: 0 10px 30px rgba(0,0,0,0.05);
            --title-color: #6d28d9;
            --accent-color: #7c3aed;
            --input-bg: rgba(255, 255, 255, 0.9);
            --input-border: rgba(196, 181, 253, 0.8);
            --svg-color: rgba(124, 58, 237, 0.15);
            --star-color: #c084fc;
          }
          
          .theme-dark {
            --bg-gradient: radial-gradient(ellipse at top left, #2e1065 0%, #0f172a 100%);
            --text-main: #f8fafc;
            --text-sub: #cbd5e1;
            --card-bg: rgba(25, 15, 40, 0.65);
            --card-border: rgba(255, 255, 255, 0.1);
            --card-hover-border: #c084fc;
            --card-hover-bg: rgba(40, 20, 60, 0.85);
            --card-shadow: 0 20px 50px rgba(0,0,0,0.6);
            --title-color: #d8b4fe;
            --accent-color: #c084fc;
            --input-bg: rgba(0, 0, 0, 0.4);
            --input-border: rgba(168, 85, 247, 0.3);
            --svg-color: rgba(192, 132, 252, 0.2);
            --star-color: #e9d5ff;
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
          .magic-svg-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none; opacity: 0.8; }
          .magic-path { fill: none; stroke: var(--svg-color); stroke-width: 3; stroke-dasharray: 3000; stroke-dashoffset: 3000; animation: drawMagic 12s ease-in-out infinite alternate; transition: stroke 0.5s; }
          @keyframes drawMagic { 0% { stroke-dashoffset: 3000; } 100% { stroke-dashoffset: 0; } }

          /* 💡 ここにあった古いハンバーガーメニューのCSSを完全に消去しました！ */

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

          /* 🌟 レイアウト：左の注意事項 ＋ 右の入力フォーム */
          .main-layout { display: grid; grid-template-columns: 320px 1fr; gap: 30px; max-width: 1200px; margin: 0 auto 50px auto; }
          @media (max-width: 950px) { .main-layout { grid-template-columns: 1fr; } }

          .info-sidebar { display: flex; flex-direction: column; gap: 20px; }
          .info-panel { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 20px; padding: 24px; box-shadow: var(--card-shadow); }
          .info-title { font-size: 15px; font-weight: 900; color: var(--title-color); margin-bottom: 15px; display: flex; align-items: center; gap: 8px; border-bottom: 2px dashed var(--card-border); padding-bottom: 10px; }
          .info-list { padding-left: 20px; margin: 0; color: var(--text-main); font-size: 13px; line-height: 1.8; }
          .info-list li { margin-bottom: 8px; }

          .form-main-area { display: flex; flex-direction: column; gap: 24px; }
          .section-title { font-weight: 900; font-size: 15px; color: var(--title-color); margin-bottom: 20px; border-bottom: 2px dashed var(--card-border); padding-bottom: 15px; }

          .glass-panel { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 20px; padding: 24px; box-shadow: var(--card-shadow); transition: transform 0.2s ease-out, box-shadow 0.2s ease-out, border-color 0.2s; }
          .glass-panel:hover { border-color: var(--card-hover-border); transform: translateY(-2px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }

          .form-grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 15px 20px; }
          @media (max-width: 800px) { .form-grid-2 { grid-template-columns: 1fr; } }
          
          .input-group { display: flex; flex-direction: column; margin-bottom: 8px; }
          .input-group label { font-size: 12px; font-weight: 800; color: var(--text-sub); margin-bottom: 6px; border-left: 3px solid var(--accent-color); padding-left: 8px; }
          
          .input-control { width: 100%; padding: 12px 14px; border: 1px solid var(--input-border); border-radius: 10px; font-size: 13px; background: var(--input-bg); color: var(--text-main); transition: 0.3s; font-weight: 700; outline: none; }
          .input-control:focus { border-color: var(--card-hover-border); box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2); background: var(--card-hover-bg); }
          .input-control option { background: #0f172a; color: #fff; }
          .theme-light .input-control option { background: #fff; color: #1e293b; }
          .email-error { border-color: #ef4444; background: #fef2f2; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1); }

          .paste-area { width: 100%; height: 100px; padding: 14px; border: 2px dashed var(--card-hover-border); border-radius: 12px; background: var(--input-bg); color: var(--text-main); margin-bottom: 16px; outline: none; transition: 0.3s; font-family: monospace; resize: vertical; }
          .paste-area:focus { background: var(--card-hover-bg); box-shadow: 0 0 15px rgba(139, 92, 246, 0.2); }
          
          .btn-primary { width: 100%; padding: 12px; background: linear-gradient(135deg, #a855f7, #7c3aed); color: #fff; border: none; border-radius: 10px; font-weight: 900; cursor: pointer; transition: 0.3s; font-size: 14px; letter-spacing: 1px; box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3); }
          .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(139, 92, 246, 0.5); }

          /* ラジオボタンとチェックボックス */
          .radio-group { display: flex; flex-wrap: wrap; gap: 16px; padding: 12px 14px; border-radius: 10px; background: var(--input-bg); border: 1px solid var(--input-border); }
          .radio-group label { margin: 0; display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: var(--text-main); border: none; padding: 0; font-weight: 700; }
          .radio-group input[type="radio"], .radio-group input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--accent-color); cursor: pointer; margin: 0; }

          .preview-area { width: 100%; height: 250px; padding: 16px; background: var(--input-bg); color: var(--text-main); border-radius: 12px; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.6; border: 2px solid var(--accent-color); outline: none; resize: vertical; box-shadow: inset 0 4px 10px rgba(0,0,0,0.05); }
          
          .tag-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; margin-bottom: 10px; }
          .tag-btn { padding: 8px 14px; background: var(--input-bg); border: 1px solid var(--card-border); border-radius: 20px; font-size: 12px; font-weight: 800; cursor: pointer; color: var(--text-main); transition: 0.2s; }
          .tag-btn:hover { border-color: var(--card-hover-border); color: var(--accent-color); transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
          
          .footer-bar { position: fixed; bottom: 0; left: 0; width: 100%; padding: 16px 40px; background: var(--card-bg); backdrop-filter: blur(12px); border-top: 1px solid var(--card-border); display: flex; gap: 16px; z-index: 100; justify-content: center; }
          .btn-footer { max-width: 300px; width: 100%; padding: 16px; border-radius: 30px; font-weight: 900; font-size: 15px; border: none; cursor: pointer; transition: 0.3s; letter-spacing: 1px; color: #fff; }
          .btn-copy { background: linear-gradient(135deg, #a855f7, #7c3aed); box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3); }
          .btn-copy:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(139, 92, 246, 0.5); }
          .btn-clear { background: var(--input-bg); color: var(--text-sub); border: 2px solid var(--card-border); }
          .btn-clear:hover { border-color: #ef4444; color: #ef4444; background: rgba(239, 68, 68, 0.1); }

          #toast { visibility: hidden; position: fixed; bottom: 100px; right: 40px; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); padding: 16px 24px; border-radius: 12px; font-weight: 800; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 200; opacity: 0; transition: 0.4s; backdrop-filter: blur(10px); }
          #toast.show { visibility: visible; opacity: 1; transform: translateY(-10px); }
          #toast.error { background: #fee2e2; color: #e11d48; border-color: #f43f5e; box-shadow: 0 10px 30px rgba(225, 29, 72, 0.2); }
          .theme-dark #toast.error { background: rgba(225, 29, 72, 0.2); border-color: #fb7185; }

          /* 🪄 スクロール連動 */
          .fade-up-element { opacity: 0; transform: translateY(40px); transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
          .fade-up-element.visible { opacity: 1; transform: translateY(0); }
        `}} />

        {/* 🌟 SVG魔法の軌跡 */}
        <svg className="magic-svg-bg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path className="magic-path" d="M -10,30 Q 30,80 50,50 T 110,40" />
          <path className="magic-path" d="M -10,70 Q 40,20 70,60 T 110,80" style={{animationDelay: "4s", opacity: 0.5}} />
        </svg>

        {/* 💡 ここに共通化されたメニューコンポーネントをポンと置くだけ！！！ */}
        <SideMenu />

        {/* 🎈 ナビゲーション & テーマ切り替え */}
        <div className="glass-nav-wrapper fade-up-element" style={{ "--delay": "0s" } as any}>
          <div className="glass-nav">
            <div className="nav-left">
              <a href="/" className="glass-nav-link">← 司令室に戻る</a>
              <div className="glass-nav-active">🤝 自己クロ連携</div>
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {isDarkMode ? "🎇 NIGHT" : "☀️ DAY"}
            </button>
          </div>
        </div>

        {/* 🌟 メインレイアウト */}
        <div className="main-layout">
          
          <aside className="info-sidebar">
            <div className="info-panel fade-up-element">
              <h3 className="info-title">📌 入力時の注意事項</h3>
              <ul className="info-list">
                <li>Warpのデータを貼り付けると、自己クロ用のフォーマットに自動でデータが割り当てられます。</li>
                <li>WarpID付きのテキストをコピーした状態でこの画面を開くと、<b>自動でペースト・解析</b>が行われます。</li>
                <li>お客様名（漢字）を入力すると、自動でカナが推測入力されます。（要確認）</li>
                <li>工事希望日は、チェックを入れると「引越日」と自動で同期されます。</li>
              </ul>
            </div>
            
            <div className="info-panel fade-up-element" style={{ transitionDelay: "0.1s" }}>
              <h3 className="info-title">🛠️ 運用ステータス</h3>
              <ul className="info-list">
                <li>自動パース機能：正常（稼働中）</li>
                <li>CallTree連携：有効</li>
                <li>日付同期システム：有効</li>
              </ul>
            </div>
          </aside>

          <div className="form-main-area">
            
            <section className="glass-panel fade-up-element">
              <div style={{ fontWeight: 900, marginBottom: "12px", color: "var(--title-color)", fontSize: "15px" }}>1. データの貼り付けと解析</div>
              <textarea 
                className="paste-area" 
                placeholder="CallTreeのデータをここに貼り付け、または自動受信を待機..." 
                value={rawText} 
                onChange={(e) => setRawText(e.target.value)} 
              />
              <button className="btn-primary" onClick={() => doParse(rawText)}>✨ 一発自動入力（パース）を実行</button>
            </section>

            {/* 👤 基本情報セクション */}
            <section className="glass-panel fade-up-element" style={{ transitionDelay: "0.1s" }}>
              <div style={{ fontWeight: 900, fontSize: "15px", color: "var(--title-color)", marginBottom: "20px", borderBottom: "2px dashed var(--card-border)", paddingBottom: "15px" }}>2. 👤 基本情報</div>
              
              <div className="form-grid-2">
                <div className="input-group" style={{ gridColumn: "span 2" }}>
                  <label>リスト名</label>
                  <input className="input-control" id="colList" value={form.colList} onChange={handleChange} />
                </div>
                
                <div className="input-group"><label>姓</label><input className="input-control" id="colSei" value={form.colSei} onChange={handleChange} onCompositionStart={() => baseKana.current = form.colSeiKana} onCompositionUpdate={(e: any) => handleKanaUpdate(e, "colSeiKana")} onCompositionEnd={() => baseKana.current = form.colSeiKana} /></div>
                <div className="input-group"><label>名</label><input className="input-control" id="colMei" value={form.colMei} onChange={handleChange} onCompositionStart={() => baseKana.current = form.colMeiKana} onCompositionUpdate={(e: any) => handleKanaUpdate(e, "colMeiKana")} onCompositionEnd={() => baseKana.current = form.colMeiKana} /></div>
                <div className="input-group"><label>姓カナ</label><input className="input-control" id="colSeiKana" value={form.colSeiKana} onChange={handleChange} /></div>
                <div className="input-group"><label>名カナ</label><input className="input-control" id="colMeiKana" value={form.colMeiKana} onChange={handleChange} /></div>

                <div className="input-group" style={{ gridColumn: "span 2" }}>
                  <label>生年月日</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "15px" }}>
                    <select className="input-control" id="birthYear" value={form.birthYear} onChange={handleChange}>
                      <option value="">-- 年 --</option>
                      {years.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
                    </select>
                    <select className="input-control" id="birthMonth" value={form.birthMonth} onChange={handleChange}>
                      <option value="">-月-</option>
                      {Array.from({length: 12}, (_, i) => <option key={i+1} value={`${i+1}月`}>{i+1}月</option>)}
                    </select>
                    <select className="input-control" id="birthDay" value={form.birthDay} onChange={handleChange}>
                      <option value="">-日-</option>
                      {Array.from({length: 31}, (_, i) => <option key={i+1} value={`${i+1}日`}>{i+1}日</option>)}
                    </select>
                  </div>
                </div>

                <div className="input-group" style={{ gridColumn: "span 2" }}><label>新居先（自動結合）</label><textarea className="input-control" id="colNewAddress" rows={2} value={form.colNewAddress} onChange={handleChange} style={{resize: 'vertical'}} /></div>
                <div className="input-group" style={{ gridColumn: "span 2" }}><label>現住所</label><textarea className="input-control" id="colCurrentAddress" rows={2} value={form.colCurrentAddress} onChange={handleChange} style={{resize: 'vertical'}} /></div>
                
                <div className="input-group"><label>携帯番号</label><input className="input-control" id="colPhone" value={form.colPhone} onChange={handleChange} /></div>
                <div className="input-group"><label>Email</label><input className={`input-control ${emailError ? "email-error" : ""}`} type="email" id="colEmail" placeholder="abc@example.com" value={form.colEmail} onChange={handleChange} /></div>
              </div>
            </section>

            {/* ⚡ クロージング詳細セクション */}
            <section className="glass-panel fade-up-element" style={{ transitionDelay: "0.2s" }}>
              <div style={{ fontWeight: 900, fontSize: "15px", color: "var(--title-color)", marginBottom: "20px", borderBottom: "2px dashed var(--card-border)", paddingBottom: "15px" }}>3. ⚡ クロージング詳細</div>
              
              <div style={{ fontSize: "12px", fontWeight: "bold", color: "var(--text-sub)", borderBottom: "1px solid var(--svg-color)", marginTop: "10px", marginBottom: "12px", paddingBottom: "6px" }}>注意事項・共有事項</div>
              <div className="form-grid-2">
                <div className="input-group">
                  <label>架電番号</label>
                  <select className="input-control" id="colCallNum" value={form.colCallNum} onChange={handleChange}>
                    <option value="">-- 選択 --</option><option value="新生活ポータル：050-5783-4359">新生活ポータル</option><option value="家計の節約：050-1790-8196">家計の節約</option><option value="Wiz：050-1791-1936">Wiz</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>オクトパスNG or OK</label>
                  <div className="radio-group">
                    <label><input type="radio" name="octopusStatus" value="OK" checked={form.octopusStatus === "OK"} onChange={handleChange} /> OK</label>
                    <label><input type="radio" name="octopusStatus" value="NG" checked={form.octopusStatus === "NG"} onChange={handleChange} /> NG</label>
                  </div>
                </div>
                <div className="input-group" style={{ gridColumn: "span 2" }}>
                  <label>意思取り方法</label>
                  <div className="tag-container">
                    <button className="tag-btn" onClick={() => addPhrase("物件設備で利用でOK！")}>➕ 物件設備</button>
                    <button className="tag-btn" onClick={() => addPhrase("携帯とセットでOK！")}>➕ セット割</button>
                    <button className="tag-btn" onClick={() => addPhrase("半年間無料お試しでOK!")}>➕ 半年間無料</button>
                    <button className="tag-btn" onClick={() => addPhrase("めちゃ得割")}>➕ めちゃ得割</button>
                  </div>
                  <input className="input-control" type="text" id="colIntention" value={form.colIntention} onChange={handleChange} />
                </div>
              </div>

              <div style={{ fontSize: "12px", fontWeight: "bold", color: "var(--text-sub)", borderBottom: "1px solid var(--svg-color)", marginTop: "20px", marginBottom: "12px", paddingBottom: "6px" }}>商材・担当者</div>
              <div className="form-grid-2">
                <div className="input-group">
                  <label>商材名</label>
                  <select className="input-control" id="colProduct" value={form.colProduct} onChange={handleChange}>
                    <option value="">-- 選択 --</option><option value="フレッツ光">フレッツ光</option><option value="ドコモ光">ドコモ光</option><option value="Softbank光">Softbank光</option><option value="auひかり">auひかり</option><option value="NURO光">NURO光</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>プラン名</label>
                  <select className="input-control" id="colPlan" value={form.colPlan} onChange={handleChange}>
                    <option value="">-- 選択 --</option><option value="MS">MS</option><option value="FM">FM</option><option value="10G">10G</option><option value="P1">P1</option><option value="P2">P2</option>
                  </select>
                </div>
                <div className="input-group" style={{ gridColumn: "span 2" }}>
                  <label>名義人性別</label>
                  <div className="radio-group">
                    <label><input type="radio" name="gender" value="男" checked={form.gender === "男"} onChange={handleChange} /> 男</label>
                    <label><input type="radio" name="gender" value="女" checked={form.gender === "女"} onChange={handleChange} /> 女</label>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "12px", fontWeight: "bold", color: "var(--text-sub)", borderBottom: "1px solid var(--svg-color)", marginTop: "20px", marginBottom: "12px", paddingBottom: "6px" }}>工事・設備情報</div>
              <div className="form-grid-2">
                <div className="input-group"><label>引越日</label><input className="input-control" id="colMoveDate" value={form.colMoveDate} onChange={handleChange} /></div>
                <div className="input-group">
                  <label>書類発送先</label>
                  <div className="radio-group">
                    <label><input type="radio" name="docSend" value="新住所" checked={form.docSend === "新住所"} onChange={handleChange} /> 新住所</label>
                    <label><input type="radio" name="docSend" value="現住所" checked={form.docSend === "現住所"} onChange={handleChange} /> 現住所</label>
                  </div>
                </div>
                <div className="input-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label style={{margin: 0}}>工事希望日</label>
                    <label style={{ fontSize: "11px", color: "var(--accent-color)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", margin: 0, fontWeight: 800 }}>
                      <input type="checkbox" id="sameAsMove" checked={sameAsMove} onChange={handleSyncKoji} style={{accentColor: 'var(--accent-color)', width: '15px', height: '15px'}} /> 引越日と同期
                    </label>
                  </div>
                  <input className="input-control" type="date" id="colKoji" value={form.colKoji} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>工事費</label>
                  <div className="radio-group">
                    <label><input type="radio" name="kojiFee" value="一括" checked={form.kojiFee === "一括"} onChange={handleChange} /> 一括</label>
                    <label><input type="radio" name="kojiFee" value="分割" checked={form.kojiFee === "分割"} onChange={handleChange} /> 分割</label>
                  </div>
                </div>
                <div className="input-group">
                  <label>住宅タイプ</label>
                  <select className="input-control" id="colHouseType" value={form.colHouseType} onChange={handleChange}>
                    <option value="">-- 選択 --</option><option value="戸建（持家）">戸建（持家）</option><option value="戸建（賃貸）">戸建（賃貸）</option><option value="集合住宅（持家）">集合住宅（持家）</option><option value="集合住宅（賃貸）">集合住宅（賃貸）</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>キャリア</label>
                  <select className="input-control" id="colCarrier" value={form.colCarrier} onChange={handleChange}>
                    <option value="">-- 選択 --</option><option value="docomo">docomo</option><option value="au">au</option><option value="SoftBank">SoftBank</option><option value="楽天">楽天</option><option value="格安SIM">格安SIM</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>新築・既設</label>
                  <div className="radio-group">
                    <label><input type="radio" name="newOld" value="新築" checked={form.newOld === "新築"} onChange={handleChange} /> 新築</label>
                    <label><input type="radio" name="newOld" value="既設" checked={form.newOld === "既設"} onChange={handleChange} /> 既設</label>
                  </div>
                </div>
                <div className="input-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label style={{ margin: 0 }}>CB（金額のみ入力）</label>
                    <label style={{ fontSize: "11px", cursor: "pointer", color: "var(--accent-color)", margin: 0, display: "flex", alignItems: "center", gap: "6px", fontWeight: 800 }}>
                      <input type="checkbox" id="cbHalfYearFree" checked={form.cbHalfYearFree} onChange={handleChange} style={{accentColor: 'var(--accent-color)', width: '15px', height: '15px'}} /> 半年間無料分
                    </label>
                  </div>
                  <input className="input-control" type="number" id="colCB" placeholder="例：10000" disabled={form.cbHalfYearFree} value={form.colCB} onChange={handleChange} />
                </div>
              </div>
            </section>

            {/* 👀 プレビューエリア */}
            <section className="glass-panel fade-up-element" style={{ transitionDelay: "0.3s" }}>
              <div style={{ fontWeight: 900, fontSize: "15px", color: "var(--accent-color)", marginBottom: "15px" }}>{`> SYSTEM.PREVIEW // コピー内容`}</div>
              <textarea className="preview-area" value={preview} readOnly />
            </section>

          </div>
        </div>

        {/* 🛠️ フッター操作 */}
        <div className="footer-bar">
          <button className="btn-footer btn-clear" onClick={clearAll}>🗑️ リセット</button>
          <button className="btn-footer btn-copy" onClick={copyTemplate}>📋 この内容でFMTをコピー</button>
        </div>

        {/* 🍞 通知 */}
        <div id="toast" className={`${toast.show ? "show" : ""} ${toast.isError ? "error" : ""}`}>{toast.msg}</div>
      </main>
    </>
  );
}