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

export default function NetToss() {
  const router = useRouter();

  // 🌟 状態管理
  const [rawText, setRawText] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "" });
  
  // 🍔 ここでメニューの開閉状態を管理！
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // ☀️ テーマ管理
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [form, setForm] = useState({
    colList: "",
    colSei: "", colMei: "",
    colSeiKana: "", colMeiKana: "",
    colPhone: "",
    colMail: "",
    colAddress: "",
    colDate: "",
    colType: "",
    colLine: "",
    colCarrier: "",
    colTel: "なし",
    colMemo: ""
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    setIsReady(true);
    // スクロール連動トリガー
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nameParts = [form.colSei, form.colMei, form.colSeiKana, form.colMeiKana].filter(v => v !== "");
    const nameFormatted = nameParts.join("　");

    const text = 
      "ネットトス転送希望\n" +
      "リスト：" + (form.colList || "") + "\n" +
      "名前：" + nameFormatted + "\n" +
      "電話番号：" + (form.colPhone || "") + "\n" +
      "Mail：" + (form.colMail || "") + "\n" +
      "新住所：" + (form.colAddress || "") + "\n" +
      "引越日：" + (form.colDate || "") + "\n" +
      "継続or新規：" + (form.colType || "") + "\n" +
      "現在利用回線：" + (form.colLine || "") + "\n" +
      "携帯キャリア：" + (form.colCarrier || "") + "\n" +
      "固定電話有無：" + form.colTel + "\n" +
      "TGオクトパスエナジー受注：OK!\n" +
      "ーーーーーーーーーーーーーーーーーーーーーー\n" +
      (form.colMemo || "");
    setPreview(text);
  }, [form]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    showToast(!isDarkMode ? "🌙 ダークモードに切り替えました" : "☀️ ライトモードに切り替えました");
  };

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const addPhrase = (phrase: string) => {
    setForm(prev => ({
      ...prev,
      colMemo: prev.colMemo ? prev.colMemo + "\n" + phrase : phrase
    }));
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
            showToast("🚀 CallTreeからデータを受信！");
          }
        }
      } catch (err) {}
    };
    window.addEventListener("focus", checkWarpData);
    return () => window.removeEventListener("focus", checkWarpData);
  }, []);

  const baseKana = useRef("");
  const handleKanaUpdate = (e: any, targetKanaId: string) => {
    const text = e.data;
    if (text && !/[\u4E00-\u9FFF]/.test(text)) {
      const kanaStr = text.replace(/[\u3041-\u3096]/g, (match: any) => String.fromCharCode(match.charCodeAt(0) + 0x60));
      setForm(prev => ({ ...prev, [targetKanaId]: baseKana.current + kanaStr }));
    }
  };

  const doParse = (text: string) => {
    if (!text) { showToast("⚠️ データを貼り付けてください"); return; }
    const lines = text.split(/\r?\n/).map(line => line.replace(/^[^：:]+[：:]\s*/, '').trim());
    
    if (lines.length >= 14) {
      let newForm = { ...form };
      const raw0 = lines[0] || ""; const raw1 = lines[1] || "";
      let planRaw = (raw0.includes("シンプル") || raw0.includes("グリーン") || raw0.includes("LL") || raw0.includes("電化") || raw0.includes("ゼロ")) ? raw0 : raw1;
      let listRaw = planRaw === raw0 ? raw1 : raw0;

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
      newForm.colDate = lines[10] || "";
      newForm.colAddress = (lines[11] || "") + " " + (lines[12] || "");
      newForm.colMail = lines[14] || "";
      
      setForm(newForm);
      showToast("✨ 自動入力完了！");
    } else {
      showToast("⚠️ 行数が足りません");
    }
  };

  const copyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(preview);
      showToast("✨ クリップボードにコピーしました！");
    } catch (err) {
      alert("コピーに失敗しました");
    }
  };

  const clearAll = () => {
    if (!confirm("入力をリセットしますか？")) return;
    setForm({
      colList: "", colSei: "", colMei: "", colSeiKana: "", colMeiKana: "",
      colPhone: "", colMail: "", colAddress: "", colDate: "", colType: "",
      colLine: "", colCarrier: "", colTel: "なし", colMemo: ""
    });
    setRawText("");
  };

  return (
    <>
      <div className={`entrance-bg ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <PixieDust />
      </div>

      <main className={`app-wrapper ${isReady ? "ready" : ""} ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <style dangerouslySetInnerHTML={{ __html: `
          .app-wrapper * { box-sizing: border-box; }

          /* 🎨 新しい洗練されたカラーパレット */
          .theme-light {
            --bg-gradient: linear-gradient(180deg, #d1fae5 0%, #f1f5f9 100%);
            --text-main: #334155;
            --text-sub: #64748b;
            --card-bg: rgba(255, 255, 255, 0.8);
            --card-border: rgba(255, 255, 255, 1);
            --card-hover-border: #10b981;
            --card-hover-bg: rgba(255, 255, 255, 0.95);
            --card-shadow: 0 10px 30px rgba(0,0,0,0.04);
            --title-color: #047857;
            --accent-color: #0f766e;
            --input-bg: rgba(255, 255, 255, 0.9);
            --input-border: rgba(148, 163, 184, 0.4);
            --svg-color: rgba(16, 185, 129, 0.15);
            --star-color: #94a3b8;
          }
          
          .theme-dark {
            --bg-gradient: radial-gradient(ellipse at bottom, #064e3b 0%, #020617 100%);
            --text-main: #f8fafc;
            --text-sub: #94a3b8;
            --card-bg: rgba(15, 23, 42, 0.6);
            --card-border: rgba(255, 255, 255, 0.1);
            --card-hover-border: #2dd4bf;
            --card-hover-bg: rgba(30, 41, 59, 0.8);
            --card-shadow: 0 20px 50px rgba(0,0,0,0.6);
            --title-color: #34d399;
            --accent-color: #2dd4bf;
            --input-bg: rgba(0, 0, 0, 0.3);
            --input-border: rgba(255, 255, 255, 0.15);
            --svg-color: rgba(45, 212, 191, 0.2);
            --star-color: #fde047;
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

          .magic-svg-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none; opacity: 0.8; }
          .magic-path { fill: none; stroke: var(--svg-color); stroke-width: 3; stroke-dasharray: 3000; stroke-dashoffset: 3000; animation: drawMagic 12s ease-in-out infinite alternate; transition: stroke 0.5s; }
          @keyframes drawMagic { 0% { stroke-dashoffset: 3000; } 100% { stroke-dashoffset: 0; } }

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

          /* 🗄️ サイドメニュー（全項目網羅！） */
          .side-menu { position: fixed; top: 0; left: -320px; width: 300px; height: 100vh; background: var(--card-bg); backdrop-filter: blur(30px); border-right: 1px solid var(--card-border); z-index: 1000; box-shadow: var(--card-shadow); transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); padding: 90px 24px 30px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
          .side-menu.open { left: 0; }
          .menu-title { font-size: 13px; font-weight: 900; color: var(--title-color); margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed var(--card-border); letter-spacing: 1px; }

          .side-link { text-decoration: none; padding: 14px 20px; border-radius: 14px; background: var(--input-bg); color: var(--text-main); font-weight: 800; font-size: 14px; border: 1px solid var(--card-border); transition: all 0.2s; display: flex; align-items: center; gap: 12px; }
          .side-link:hover { border-color: var(--card-hover-border); transform: translateX(8px); }
          .side-link.current-page { background: linear-gradient(135deg, #10b981, #059669); color: #fff; border: none; box-shadow: 0 6px 15px rgba(16, 185, 129, 0.3); pointer-events: none; }

          /* 🎈 ナビゲーション & テーマ切り替え */
          .glass-nav-wrapper { display: flex; justify-content: center; margin-bottom: 30px; }
          .glass-nav { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: var(--card-bg); backdrop-filter: blur(16px); border: 1px solid var(--card-border); border-radius: 50px; box-shadow: var(--card-shadow); max-width: 800px; width: 100%; }
          
          .nav-left { display: flex; gap: 12px; align-items: center; }
          .glass-nav-link { text-decoration: none; padding: 10px 20px; border-radius: 30px; font-weight: 800; background: var(--input-bg); color: var(--text-sub); border: 1px solid var(--card-border); transition: 0.2s; font-size: 14px; }
          .glass-nav-link:hover { color: var(--accent-color); border-color: var(--card-hover-border); }
          .glass-nav-active { padding: 10px 20px; border-radius: 30px; font-weight: 900; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); font-size: 14px; }
          
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

          .form-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 15px 20px; }
          @media (max-width: 1100px) { .form-grid-3 { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 600px) { .form-grid-3 { grid-template-columns: 1fr; } }
          
          .input-group { display: flex; flex-direction: column; }
          .input-group label { font-size: 12px; font-weight: 800; color: var(--text-sub); margin-bottom: 6px; border-left: 3px solid var(--accent-color); padding-left: 8px; }
          
          .input-control { width: 100%; padding: 12px 14px; border: 1px solid var(--input-border); border-radius: 10px; font-size: 13px; background: var(--input-bg); color: var(--text-main); transition: 0.3s; font-weight: 700; outline: none; }
          .input-control:focus { border-color: var(--card-hover-border); box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2); background: var(--card-hover-bg); }
          .input-control option { background: #0f172a; color: #fff; }
          .theme-light .input-control option { background: #fff; color: #1e293b; }

          .paste-area { width: 100%; height: 100px; padding: 14px; border: 2px dashed var(--card-hover-border); border-radius: 12px; background: var(--input-bg); color: var(--text-main); margin-bottom: 16px; outline: none; transition: 0.3s; font-family: monospace; resize: vertical; }
          .paste-area:focus { background: var(--card-hover-bg); box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); }
          
          .btn-primary { width: 100%; padding: 12px; background: linear-gradient(135deg, #10b981, #047857); color: #fff; border: none; border-radius: 10px; font-weight: 900; cursor: pointer; transition: 0.3s; font-size: 14px; letter-spacing: 1px; box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3); }
          .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(16, 185, 129, 0.5); }

          .preview-area { width: 100%; height: 200px; padding: 16px; background: var(--input-bg); color: var(--text-main); border-radius: 12px; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.6; border: 2px solid var(--accent-color); outline: none; resize: vertical; box-shadow: inset 0 4px 10px rgba(0,0,0,0.05); }
          
          .tag-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
          .tag-btn { padding: 8px 14px; background: var(--input-bg); border: 1px solid var(--card-border); border-radius: 20px; font-size: 12px; font-weight: 800; cursor: pointer; color: var(--text-main); transition: 0.2s; }
          .tag-btn:hover { border-color: var(--card-hover-border); color: var(--accent-color); transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
          
          .footer-bar { position: fixed; bottom: 0; left: 0; width: 100%; padding: 16px 40px; background: var(--card-bg); backdrop-filter: blur(12px); border-top: 1px solid var(--card-border); display: flex; gap: 16px; z-index: 100; justify-content: center; }
          .btn-footer { max-width: 300px; width: 100%; padding: 16px; border-radius: 30px; font-weight: 900; font-size: 15px; border: none; cursor: pointer; transition: 0.3s; letter-spacing: 1px; }
          .btn-copy { background: linear-gradient(135deg, #10b981, #047857); color: #fff; box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3); }
          .btn-copy:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(16, 185, 129, 0.5); }
          .btn-clear { background: var(--input-bg); color: var(--text-sub); border: 2px solid var(--card-border); }
          .btn-clear:hover { border-color: #ef4444; color: #ef4444; background: rgba(239, 68, 68, 0.1); }

          #toast { visibility: hidden; position: fixed; bottom: 100px; right: 40px; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); padding: 16px 24px; border-radius: 12px; font-weight: 800; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 200; opacity: 0; transition: 0.4s; backdrop-filter: blur(10px); }
          #toast.show { visibility: visible; opacity: 1; transform: translateY(-10px); }

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
          <a href="/bulk-register" className="side-link">📦 データ一括登録</a>
          <a href="/net-toss" className="side-link current-page">🌐 ネットトス連携</a>
          <a href="/self-close" className="side-link">🤝 自己クロ連携</a>
          <a href="/sms-kraken" className="side-link">📱 SMS (Kraken)送信</a>
          <a href="/email-template" className="side-link">✉️ メールテンプレート</a>
          <a href="/procedure-wizard" className="side-link">🗺️ Kraken 手順辞書</a>
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
              <div className="glass-nav-active">🌐 ネットトス連携</div>
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {isDarkMode ? "🎇 NIGHT" : "☀️ DAY"}
            </button>
          </div>
        </div>

        <div className="main-layout">
          
          <aside className="info-sidebar">
            <div className="info-panel fade-up-element">
              <h3 className="info-title">📌 入力時の注意事項</h3>
              <ul className="info-list">
                <li>Warpのデータを貼り付けると、ネットトス用のフォーマットに自動でデータが割り当てられます。</li>
                <li>WarpID付きのテキストをコピーした状態でこの画面を開くと、<b>自動でペースト・解析</b>が行われます。</li>
                <li>お客様名（漢字）を入力すると、自動でカナが推測入力されます。（確認必須）</li>
                <li>備考欄の下にあるボタンを押すと、よく使う定型文がワンクリックで追加されます。</li>
              </ul>
            </div>
            
            <div className="info-panel fade-up-element" style={{ transitionDelay: "0.1s" }}>
              <h3 className="info-title">🛠️ 運用ステータス</h3>
              <ul className="info-list">
                <li>自動パース機能：正常（稼働中）</li>
                <li>CallTree連携：有効</li>
                <li>クリップボード連携：有効</li>
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

            <section className="glass-panel fade-up-element" style={{ transitionDelay: "0.1s" }}>
              <div className="section-title">2. 連携データ詳細</div>
              <div className="form-grid-3">
                <div className="input-group">
                  <label>リスト種別</label>
                  <input className="input-control" id="colList" value={form.colList} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>姓</label>
                  <input className="input-control" id="colSei" value={form.colSei} onChange={handleChange} onCompositionStart={() => baseKana.current = form.colSeiKana} onCompositionUpdate={(e: any) => handleKanaUpdate(e, "colSeiKana")} onCompositionEnd={() => baseKana.current = form.colSeiKana} />
                </div>
                <div className="input-group">
                  <label>名</label>
                  <input className="input-control" id="colMei" value={form.colMei} onChange={handleChange} onCompositionStart={() => baseKana.current = form.colMeiKana} onCompositionUpdate={(e: any) => handleKanaUpdate(e, "colMeiKana")} onCompositionEnd={() => baseKana.current = form.colMeiKana} />
                </div>
                <div className="input-group">
                  <label>姓カナ</label>
                  <input className="input-control" id="colSeiKana" value={form.colSeiKana} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>名カナ</label>
                  <input className="input-control" id="colMeiKana" value={form.colMeiKana} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>電話番号</label>
                  <input className="input-control" id="colPhone" value={form.colPhone} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input className="input-control" id="colMail" value={form.colMail} onChange={handleChange} />
                </div>
                <div className="input-group" style={{ gridColumn: "span 2" }}>
                  <label>新住所</label>
                  <input className="input-control" id="colAddress" value={form.colAddress} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>引越日（再点日）</label>
                  <input className="input-control" id="colDate" value={form.colDate} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>継続or新規</label>
                  <select className="input-control" id="colType" value={form.colType} onChange={handleChange}>
                    <option value="">-- 選択 --</option>
                    <option value="新規">新規</option>
                    <option value="継続">継続</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>現在利用回線</label>
                  <input className="input-control" id="colLine" value={form.colLine} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>携帯キャリア</label>
                  <select className="input-control" id="colCarrier" value={form.colCarrier} onChange={handleChange}>
                    <option value="">-- 選択 --</option>
                    <option value="docomo">docomo</option>
                    <option value="au">au</option>
                    <option value="SoftBank">SoftBank</option>
                    <option value="楽天">楽天</option>
                    <option value="格安SIM">格安SIM</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>固定電話有無</label>
                  <select className="input-control" id="colTel" value={form.colTel} onChange={handleChange}>
                    <option value="なし">なし</option>
                    <option value="あり">あり</option>
                  </select>
                </div>
              </div>

              <div className="input-group" style={{ marginTop: "25px" }}>
                <label>備考欄（特記事項）</label>
                <div className="tag-container">
                  <button className="tag-btn" onClick={() => addPhrase("〇時以降の連絡希望。")}>➕ 〇時以降希望</button>
                  <button className="tag-btn" onClick={() => addPhrase("順次架電お願いします！")}>➕ 順次</button>
                  <button className="tag-btn" onClick={() => addPhrase("設備確認しますと伝えております。")}>➕ 設備確認</button>
                </div>
                <textarea className="input-control" id="colMemo" style={{ marginTop: "12px", minHeight: "80px", resize: "vertical" }} value={form.colMemo} onChange={handleChange} />
              </div>
            </section>

            {/* 👀 プレビューエリア */}
            <section className="glass-panel fade-up-element" style={{ transitionDelay: "0.2s" }}>
              <div className="section-title" style={{ color: "var(--accent-color)" }}>👀 転送用フォーマット・プレビュー</div>
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
        <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>
      </main>
    </>
  );
}