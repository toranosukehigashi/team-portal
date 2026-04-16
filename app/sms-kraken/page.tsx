"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// ✨ 背景の光の粒
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

export default function SmsKraken() {
  const router = useRouter();

  // 🌟 状態管理
  const [smsType, setSmsType] = useState("重説");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [preview, setPreview] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // ☀️ テーマ管理
  const [isDarkMode, setIsDarkMode] = useState(false);

  const companies = [
    "My賃貸", "春風不動産", "エステートプラス", "アパマンショップ蟹江店",
    "不動産ランドすまいる", "ピタットハウス神宮南", "Access", "ルームコレクション",
    "すまいらんど", "株式会社東栄", "株式会社STYプランニング", "なごやか不動産",
    "楽々不動産", "ひまわりカンパニー", "株式会社Terrace Home本店"
  ];

  useEffect(() => {
    setIsReady(true);
    // スクロール連動トリガー
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    showToast(!isDarkMode ? "🌙 ダークモードに切り替えました" : "☀️ ライトモードに切り替えました", "info");
  };

  const showToast = (msg: string, type: "success" | "info" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  };

  const copyPhone = async () => {
    if (!phone) { showToast("⚠️ 電話番号を入力してください！", "error"); return; }
    const cleaned = phone.replace(/[ー\-‐\s]/g, "").trim();
    const formattedPhone = cleaned.startsWith("0") ? `+81${cleaned.substring(1)}` : cleaned;
    setPreview(`> SYSTEM.DESTINATION = ${formattedPhone}\n> READY TO SEND.`);
    try {
      await navigator.clipboard.writeText(formattedPhone);
      showToast("📱 宛先（電話番号）をコピーしました！", "info");
    } catch (err) { alert("コピーに失敗しました"); }
  };

  const copySmsText = async () => {
    if (smsType === "不出" && !company) { showToast("⚠️ 不動産会社を選択してください！", "error"); return; }
    let smsText = "";
    if (smsType === "重説") {
      smsText = "オクトパスエナジーでございます🐙\n以下のURLより、内容確認とご同意をお願いします。\n\nhttps://forms.gle/hEiC6B61ctNy7F3U6\n\n恐れ入りますが、フォームの入力お願いいたします。\nお急ぎの方やリンクが開けない方は、このメッセージに「確認しました」とご返信ください！";
    } else if (smsType === "不出") {
      smsText = `【ご新居のお申込ありがとうございます】\n\nお世話になっております。\nオクトパスエナジーでございます。\n\nこの度、ご新居のお申込いただいた 【 ${company} 】 様からご依頼ございまして、\nご新居でお使いいただく電気、ガス、水道、インターネット（現金キャッシュバック特典付き！）などのライフラインのお手続きでのご連絡となります。\n\n新生活スタートを不動産会社様、管理会社様と一緒にサポートさせていただきます！\n\n本メールご覧いただけましたら、下記電話番号までご連絡よろしくお願いいたします！\n\n━━━━━━━━━━━━━━━━━━\nライフライン窓口\nmail：toranosuke.higashi@octopusenergy.co.jp\nTEL：0120-402-778（通話無料）\n受付時間: 9:00〜20:00（土日祝もOK）\n━━━━━━━━━━━━━━━━━━`;
    }
    setPreview(`> SYSTEM.TEXT_GENERATED:\n\n${smsText}`);
    try {
      await navigator.clipboard.writeText(smsText);
      showToast(`📝 ${smsType} の本文をコピーしました！`, "success");
    } catch (err) { alert("コピーに失敗しました"); }
  };

  const clearAll = () => {
    if (!confirm("入力内容をすべてリセットしますか？")) return;
    setSmsType("重説"); setCompany(""); setPhone(""); setPreview("");
  };

  return (
    <>
      {/* 🚀 修正：HOMEと同じ背景グラデーションを適用 */}
      <div className={`entrance-bg ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <PixieDust />
      </div>

      <main className={`app-wrapper ${isReady ? "ready" : ""} ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <style dangerouslySetInnerHTML={{ __html: `
          .app-wrapper * { box-sizing: border-box; }

          /* 🎨 ベースはHOMEと同じ青空/夜空。アクセントのみRoseに！ */
          .theme-light {
            --bg-gradient: linear-gradient(180deg, #7dd3fc 0%, #e0f2fe 100%); /* HOMEと同じ青空 */
            --text-main: #1e293b;
            --text-sub: #475569;
            --card-bg: rgba(255, 255, 255, 0.7);
            --card-border: rgba(255, 255, 255, 1);
            --card-hover-border: #f43f5e; /* ローズレッド（アクセント） */
            --card-hover-bg: rgba(255, 255, 255, 0.95);
            --card-shadow: 0 10px 30px rgba(0,0,0,0.05);
            --title-color: #be123c; /* ダークローズ */
            --accent-color: #e11d48; /* プライマリローズ */
            --input-bg: rgba(255, 255, 255, 0.8);
            --input-border: rgba(203, 213, 225, 0.8);
            --svg-color: rgba(225, 29, 72, 0.15); /* 赤いSVG */
            --star-color: #f59e0b; /* HOMEと同じゴールドの星屑 */
            --error-bg: #fff1f2;
            --error-border: #e11d48;
          }
          
          .theme-dark {
            --bg-gradient: radial-gradient(ellipse at bottom, #1e1b4b 0%, #020617 100%); /* HOMEと同じ夜空 */
            --text-main: #f8fafc;
            --text-sub: #cbd5e1;
            --card-bg: rgba(15, 23, 42, 0.7);
            --card-border: rgba(255, 255, 255, 0.15);
            --card-hover-border: #fb7185; /* 発光するローズ（アクセント） */
            --card-hover-bg: rgba(30, 41, 59, 0.9);
            --card-shadow: 0 20px 50px rgba(0,0,0,0.8);
            --title-color: #fda4af; /* 薄いローズ */
            --accent-color: #fb7185;
            --input-bg: rgba(0, 0, 0, 0.4);
            --input-border: rgba(255, 255, 255, 0.2);
            --svg-color: rgba(251, 113, 133, 0.2);
            --star-color: #fef08a; /* HOMEと同じイエローの星屑 */
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
          .magic-svg-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none; opacity: 0.8; }
          .magic-path { fill: none; stroke: var(--svg-color); stroke-width: 3; stroke-dasharray: 3000; stroke-dashoffset: 3000; animation: drawMagic 12s ease-in-out infinite alternate; transition: stroke 0.5s; }
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
          .menu-title { font-size: 13px; font-weight: 900; color: var(--title-color); margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed var(--card-border); letter-spacing: 1px; }

          .side-link { text-decoration: none; padding: 14px 20px; border-radius: 14px; background: var(--input-bg); color: var(--text-main); font-weight: 800; font-size: 14px; border: 1px solid var(--card-border); transition: all 0.2s; display: flex; align-items: center; gap: 12px; }
          .side-link:hover { border-color: var(--card-hover-border); transform: translateX(8px); color: var(--accent-color); }
          .side-link.current-page { background: linear-gradient(135deg, #f43f5e, #be123c); color: #fff; border: none; box-shadow: 0 6px 15px rgba(225, 29, 72, 0.3); pointer-events: none; }

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

          .glass-panel { 
            background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); 
            border-radius: 20px; padding: 24px; box-shadow: var(--card-shadow); 
            transition: transform 0.2s ease-out, box-shadow 0.2s ease-out, border-color 0.2s; 
          }
          .glass-panel:hover { border-color: var(--card-hover-border); transform: translateY(-2px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
          
          .input-group { display: flex; flex-direction: column; margin-bottom: 24px; }
          .input-group label { font-size: 13px; font-weight: 800; color: var(--text-sub); margin-bottom: 8px; border-left: 3px solid var(--accent-color); padding-left: 8px; }
          
          .input-control { width: 100%; padding: 12px 14px; border: 1px solid var(--input-border); border-radius: 10px; font-size: 14px; background: var(--input-bg); color: var(--text-main); transition: 0.3s; font-weight: 700; outline: none; }
          .input-control:focus { border-color: var(--card-hover-border); box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.2); background: var(--card-hover-bg); }
          .input-control:disabled { background: var(--input-border); opacity: 0.5; cursor: not-allowed; }
          .input-control option { background: #0f172a; color: #fff; }
          .theme-light .input-control option { background: #fff; color: #1e293b; }

          /* ラジオボタンエリア */
          .radio-group { display: flex; flex-wrap: wrap; gap: 24px; padding: 16px 20px; border-radius: 10px; background: var(--input-bg); border: 1px solid var(--input-border); }
          .radio-group label { margin: 0; display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; color: var(--text-main); border: none; padding: 0; font-weight: 800; }
          .radio-group input[type="radio"] { width: 18px; height: 18px; accent-color: var(--accent-color); cursor: pointer; margin: 0; }

          .preview-area { width: 100%; height: 250px; padding: 20px; background: var(--input-bg); color: var(--text-main); border-radius: 12px; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.6; border: 2px solid var(--accent-color); outline: none; resize: vertical; box-shadow: inset 0 4px 10px rgba(0,0,0,0.05); }
          
          .footer-bar { position: fixed; bottom: 0; left: 0; width: 100%; padding: 16px 40px; background: var(--card-bg); backdrop-filter: blur(12px); border-top: 1px solid var(--card-border); display: flex; gap: 16px; z-index: 100; justify-content: center; }
          .btn-footer { max-width: 300px; width: 100%; padding: 16px; border-radius: 30px; font-weight: 900; font-size: 15px; border: none; cursor: pointer; transition: 0.3s; letter-spacing: 1px; color: #fff; }
          
          .btn-copy-phone { background: linear-gradient(135deg, #0ea5e9, #0284c7); box-shadow: 0 5px 15px rgba(2, 132, 199, 0.3); }
          .btn-copy-phone:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(2, 132, 199, 0.5); }
          
          .btn-copy-text { background: linear-gradient(135deg, #f43f5e, #be123c); box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3); }
          .btn-copy-text:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(225, 29, 72, 0.5); }
          
          .btn-clear { background: var(--input-bg); color: var(--text-sub); border: 2px solid var(--card-border); }
          .btn-clear:hover { border-color: #ef4444; color: #ef4444; background: rgba(239, 68, 68, 0.1); }

          #toast { visibility: hidden; position: fixed; bottom: 100px; right: 40px; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); padding: 16px 24px; border-radius: 12px; font-weight: 800; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 200; opacity: 0; transition: 0.4s; backdrop-filter: blur(10px); }
          #toast.show { visibility: visible; opacity: 1; transform: translateY(-10px); }
          #toast.error { background: #fee2e2; color: #e11d48; border-color: #f43f5e; box-shadow: 0 10px 30px rgba(225, 29, 72, 0.2); }
          #toast.info { color: #0284c7; border-color: #38bdf8; }
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
          <a href="/bulk-register" className="side-link">📦 一括登録（自己クロ）</a>
          <a href="/net-toss" className="side-link">🌐 ネットトス連携</a>
          <a href="/self-close" className="side-link">🌲 自己クロ連携</a>
          <a href="/sms-kraken" className="side-link current-page">📱 SMS (Kraken)</a>
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
              <div className="glass-nav-active">📱 SMS (Kraken)</div>
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {isDarkMode ? "🎇 NIGHT" : "☀️ DAY"}
            </button>
          </div>
        </div>

        {/* 🌟 メインレイアウト（左：注意事項 / 右：入力フォーム） */}
        <div className="main-layout">
          
          {/* ℹ️ 左カラム：注意事項・備考パネル */}
          <aside className="info-sidebar">
            <div className="info-panel fade-up-element">
              <h3 className="info-title">📌 Kraken連携の注意事項</h3>
              <ul className="info-list">
                <li>「不出」を選択した場合、必ず不動産会社を選択してください。</li>
                <li>宛先（電話番号）をコピーすると、SMS送信システム（Kraken等）の宛先フォーマットに合わせて <b>+81</b> を自動付与し、ハイフンを取り除きます。</li>
                <li>生成された本文はそのままコピーして送信できます。</li>
              </ul>
            </div>
            
            <div className="info-panel fade-up-element" style={{ transitionDelay: "0.1s" }}>
              <h3 className="info-title">🛠️ 運用ステータス</h3>
              <ul className="info-list">
                <li>国際電話番号（+81）変換：有効</li>
                <li>テンプレート展開：正常</li>
              </ul>
            </div>
          </aside>

          {/* 📝 右カラム：メインフォームエリア */}
          <div className="form-main-area">
            
            <section className="glass-panel fade-up-element">
              <div style={{ fontWeight: 900, marginBottom: "20px", color: "var(--title-color)", fontSize: "16px", borderBottom: "2px dashed var(--card-border)", paddingBottom: "15px" }}>💬 メッセージ作成＆宛先変換</div>

              <div className="input-group">
                <label>🎯 種類を選択</label>
                <div className="radio-group">
                  <label>
                    <input type="radio" name="smsType" value="重説" checked={smsType === "重説"} onChange={(e) => setSmsType(e.target.value)} />
                    重説
                  </label>
                  <label>
                    <input type="radio" name="smsType" value="不出" checked={smsType === "不出"} onChange={(e) => setSmsType(e.target.value)} />
                    不出
                  </label>
                </div>
              </div>

              <div className="input-group">
                <label>🏢 不動産会社（「不出」の時のみ使用）</label>
                <select 
                  className="input-control" 
                  value={company} 
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={smsType !== "不出"}
                >
                  <option value="">-- 選択してください --</option>
                  {companies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="input-group">
                <label>📞 顧客電話番号（ハイフンあり・なし どちらでもOK）</label>
                <input 
                  className="input-control" 
                  type="text" 
                  placeholder="例：090-1234-5678" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>
            </section>

            {preview && (
              <section className="glass-panel fade-up-element" style={{ transitionDelay: "0.1s" }}>
                <div style={{ fontWeight: 900, fontSize: "15px", color: "var(--accent-color)", marginBottom: "15px" }}>{`> SYSTEM.PREVIEW // コピー内容確認`}</div>
                <textarea className="preview-area" value={preview} readOnly />
              </section>
            )}

          </div>
        </div>

        {/* 🛠️ フッター操作（ボタンをここに移動） */}
        <div className="footer-bar">
          <button className="btn-footer btn-clear" onClick={clearAll}>🗑️ リセット</button>
          <button className="btn-footer btn-copy-phone" onClick={copyPhone}>📱 宛先(+81)コピー</button>
          <button className="btn-footer btn-copy-text" onClick={copySmsText}>📝 本文コピー</button>
        </div>

        {/* 🍞 通知 */}
        <div id="toast" className={`${toast.show ? "show" : ""} ${toast.type}`}>{toast.msg}</div>
      </main>
    </>
  );
}