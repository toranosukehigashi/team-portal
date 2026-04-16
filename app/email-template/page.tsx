"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ✨ 背景の光の粒（ビジネスライクなデータパーティクルへ変更）
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

export default function EmailTemplate() {
  const router = useRouter();

  // 🌟 状態管理
  const [toast, setToast] = useState({ show: false, msg: "", isError: false });
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({ name1: "", date: "", listKey: "", name2: "", area: "" });
  
  // 🍔 メニュー開閉状態
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // ☀️ テーマ管理
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsReady(true);
    // 🪄 スクロール連動トリガー
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

  const showToast = (msg: string, isError = false) => {
    setToast({ show: true, msg, isError });
    setTimeout(() => setToast({ show: false, msg: "", isError: false }), 3000);
  };

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const execRichCopy = (html: string) => {
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.left = "-9999px";
    div.innerHTML = `<div style="background-color: #ffffff; color: #333333; padding: 10px; font-family: sans-serif;">${html}</div>`;
    document.body.appendChild(div);

    const range = document.createRange();
    range.selectNodeContents(div);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
      try { document.execCommand("copy"); selection.removeAllRanges(); document.body.removeChild(div); return true; } 
      catch (err) { console.error("Copy failed", err); }
    }
    document.body.removeChild(div);
    return false;
  };

  const copyTemplate = () => {
    const nameVal = form.name1 || "〇〇";
    let dateVal = "〇/〇";
    if (form.date) {
      const d = new Date(form.date);
      dateVal = `${d.getMonth() + 1}/${d.getDate()}`;
    }

    if (!form.listKey) { showToast("⚠️ リストを選択してください！", true); return; }

    const urlMap: { [key: string]: string } = {
      "シンプル": "https://docs.google.com/forms/d/e/1FAIpQLScruqFuNqvbiaBQ-1gmHZCE9Gb5Q-OqrmRJM0HPXlSkITcg9g/viewform",
      "ガスセット": "▼ 電気\nhttps://forms.gle/Mja5NeE5WF7zbLkT6\n\n▼ ガス\nhttps://forms.gle/NYLAbyEgRncX83XdA",
      "LL": "https://forms.gle/hEiC6B61ctNy7F3U6",
      "グリーン": "https://docs.google.com/forms/d/1RyCHJFv-FP7Cp_wRYmCgrNFMHLSjL1-L80Jv92tNCb0/edit",
      "タクト": "https://docs.google.com/forms/d/e/1FAIpQLSee6e5iljCeou42twY37QE1e2HnYTPn5Uqr5sFCrCVTo0J7wQ/viewform",
      "空室通電": "https://docs.google.com/forms/d/1i7OHDzZxShImK9E3TnjjAs5yIciWk8pZbc5YOjPSY1k/viewform?edit_requested=true"
    };

    const linkUrl = urlMap[form.listKey];
    const html = `${nameVal} 様<br><br>開始日：<b>${dateVal}</b><br><br>` +
                 "ただいまお電話でお話をさせていただいております、オクトパスエナジーです。<br><br>" +
                 "下記リンクよりご連絡先ご利用同意と内容ご確認お願いします。<br><br>" +
                 linkUrl.replace(/\n/g, "<br>") + "<br><br><br>" +
                 "お急ぎの方は、このメールに「<b>確認しました</b>」とだけご返信ください！<br><br>" +
                 "============================<br>TGオクトパスエナジー株式会社<br>TEL：0120-975-230<br>https://octopusenergy.co.jp/about-us<br>============================";

    setPreview(html.replace(/<br>/g, "\n").replace(/<[^>]+>/g, ""));
    if (execRichCopy(html)) showToast(`✉️ ${form.listKey} の重説メールをコピーしました！`);
  };

  const PRICING_DB: Record<string, any> = {
    "北海道": { company: "北海道", simpleBase: "0", simpleRate: "31.60", octBase: "902", oct1: "20.62", oct2: "25.29", oct3: "27.44", localBase: "935", local1: "29.80", local2: "36.40", local3: "40.49" },
    "東北":   { company: "東北",   simpleBase: "0", simpleRate: "31.60", octBase: "902", oct1: "20.62", oct2: "25.29", oct3: "27.44", localBase: "935", local1: "29.80", local2: "36.40", local3: "40.49" },
    "東京":   { company: "東京",   simpleBase: "0", simpleRate: "31.60", octBase: "902", oct1: "20.62", oct2: "25.29", oct3: "27.44", localBase: "935", local1: "29.80", local2: "36.40", local3: "40.49" },
    "北陸":   { company: "北陸",   simpleBase: "0", simpleRate: "31.60", octBase: "902", oct1: "20.62", oct2: "25.29", oct3: "27.44", localBase: "935", local1: "29.80", local2: "36.40", local3: "40.49" },
    "中部":   { company: "中部",   simpleBase: "0", simpleRate: "31.60", octBase: "902", oct1: "20.62", oct2: "25.29", oct3: "27.44", localBase: "935", local1: "29.80", local2: "36.40", local3: "40.49" },
    "関西":   { company: "関西",   simpleBase: "0", simpleRate: "31.60", octBase: "902", oct1: "20.62", oct2: "25.29", oct3: "27.44", localBase: "935", local1: "29.80", local2: "36.40", local3: "40.49" },
    "中国":   { company: "中国",   simpleBase: "0", simpleRate: "31.60", octBase: "902", oct1: "20.62", oct2: "25.29", oct3: "27.44", localBase: "935", local1: "29.80", local2: "36.40", local3: "40.49" },
    "四国":   { company: "四国",   simpleBase: "0", simpleRate: "31.60", octBase: "902", oct1: "20.62", oct2: "25.29", oct3: "27.44", localBase: "935", local1: "29.80", local2: "36.40", local3: "40.49" },
    "九州":   { company: "九州",   simpleBase: "0", simpleRate: "31.60", octBase: "902", oct1: "20.62", oct2: "25.29", oct3: "27.44", localBase: "935", local1: "29.80", local2: "36.40", local3: "40.49" },
  };

  const copyRate = () => {
    const nameVal = form.name2 || "〇〇";
    if (!form.area) { showToast("⚠️ エリアを選択してください！", true); return; }

    const data = PRICING_DB[form.area];

    const html = [
      `${nameVal} 様`, "<br>", 
      "お世話になっております。オクトパスエナジーです。", 
      "ご検討いただいております、電力料金単価表をお送りいたします。<br>",
      "<span style='color: #e5007e; font-weight: bold; font-size: 16px;'>シンプルオクトパス</span>は基本料金と燃料費調整額が<span style='color: #ff0000; font-weight: bold; font-size: 18px;'>１年間無料！</span>（景気に左右されません！）",
      "(2年目以降は自動的にグリーンオクトパスに切り替わります！)<br>",
      "============================", 
      "<b>【シンプルオクトパス 料金単価】</b>", 
      `・基本料金：<span style='color: red; font-weight: bold;'>${data.simpleBase}円</span>`,
      `・電力量料金（一律）：${data.simpleRate}円`, 
      "============================",
      "============================",
      "<b>【グリーンオクトパス 料金単価】</b>", 
      `・基本料金（30Aの場合）：${data.octBase}円`, 
      `・電力量料金（120kWhまで）：${data.oct1}円`, 
      `・電力量料金（121〜300kWh）：${data.oct2}円`, 
      `・電力量料金（301kWh以上）：${data.oct3}円`,
      "============================<br>",
      `以下は、ご地域の電力会社様（${data.company}電力様）の単価になります⬇️`,
      "============================",
      `【${data.company}電力様 料金単価】`,
      `・基本料金（30Aの場合）：${data.localBase}円`,
      `・電力量料金（120kWhまで）：${data.local1}円`,
      `・電力量料金（121〜300kWh）：${data.local2}円`, 
      `・電力量料金（301kWh以上）：${data.local3}円`,
      "============================<br>",
      "ご不明な点がございましたら、お気軽にお問い合わせくださいませ。", 
      "引き続きよろしくお願いいたします。"
    ].join("<br>");

    setPreview(html.replace(/<br>/g, "\n").replace(/<[^>]+>/g, ""));
    if (execRichCopy(html)) showToast(`📊 ${form.area} の単価表をコピーしました！`);
  };

  const clearAll = () => {
    if (!confirm("入力をリセットしますか？")) return;
    setForm({ name1: "", date: "", listKey: "", name2: "", area: "" });
    setPreview("");
    showToast("🗑️ 入力内容をリセットしました");
  };

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
            --bg-gradient: linear-gradient(135deg, #fffbeb 0%, #ffedd5 50%, #fef2f2 100%); /* アンバーからピーチ */
            --text-main: #334155;
            --text-sub: #64748b;
            --card-bg: rgba(255, 255, 255, 0.85);
            --card-border: rgba(255, 255, 255, 1);
            --card-hover-border: #f59e0b; /* アンバー500 */
            --card-hover-bg: rgba(255, 255, 255, 0.95);
            --card-shadow: 0 10px 30px rgba(0,0,0,0.04);
            --title-color: #d97706; /* アンバー600 */
            --accent-color: #ea580c; /* オレンジ600 */
            --input-bg: rgba(255, 255, 255, 0.9);
            --input-border: rgba(253, 186, 116, 0.5); /* オレンジ調のボーダー */
            --svg-color: rgba(245, 158, 11, 0.2);
            --particle-color: #fcd34d; /* ゴールドのパーティクル */
            --error-bg: #fff1f2;
            --error-border: #e11d48;
          }
          
          .theme-dark {
            --bg-gradient: radial-gradient(ellipse at top left, #451a03 0%, #0f172a 100%); /* ディープブラウン〜ミッドナイト */
            --text-main: #f8fafc;
            --text-sub: #cbd5e1;
            --card-bg: rgba(30, 20, 15, 0.65); /* 暗いアンバーグラス */
            --card-border: rgba(255, 255, 255, 0.1);
            --card-hover-border: #fbbf24; /* 発光するアンバー */
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

          /* 🌟 SVGデータフロー背景 */
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

          /* 🌟 レイアウト：左の注意事項 ＋ 右のメインフォーム */
          .main-layout { display: grid; grid-template-columns: 320px 1fr; gap: 30px; max-width: 1200px; margin: 0 auto 50px auto; }
          @media (max-width: 950px) { .main-layout { grid-template-columns: 1fr; } }

          /* ℹ️ 左側：注意事項パネル */
          .info-sidebar { display: flex; flex-direction: column; gap: 20px; }
          .info-panel { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 20px; padding: 24px; box-shadow: var(--card-shadow); }
          .info-title { font-size: 15px; font-weight: 900; color: var(--title-color); margin-bottom: 15px; display: flex; align-items: center; gap: 8px; border-bottom: 2px dashed var(--card-border); padding-bottom: 10px; }
          .info-list { padding-left: 20px; margin: 0; color: var(--text-main); font-size: 13px; line-height: 1.8; }
          .info-list li { margin-bottom: 8px; }

          /* 📝 右側：メインフォームエリア */
          .form-main-area { display: flex; flex-direction: column; gap: 24px; }

          /* Bento UIカード */
          .glass-panel { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 20px; padding: 30px; box-shadow: var(--card-shadow); transition: transform 0.2s ease-out, box-shadow 0.2s ease-out, border-color 0.2s; position: relative; overflow: hidden; }
          .glass-panel:hover { border-color: var(--card-hover-border); transform: translateY(-2px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
          .glass-panel::before { content: ''; position: absolute; top: 0; left: 0; width: 6px; height: 100%; background: linear-gradient(180deg, #f59e0b, #ea580c); opacity: 0.8; }

          .section-title { font-weight: 900; font-size: 18px; color: var(--title-color); margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }

          .form-grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 15px 20px; }
          @media (max-width: 800px) { .form-grid-2 { grid-template-columns: 1fr; } }
          
          .input-group { display: flex; flex-direction: column; margin-bottom: 15px; }
          .input-group label { font-size: 13px; font-weight: 800; color: var(--text-sub); margin-bottom: 8px; border-left: 3px solid var(--accent-color); padding-left: 8px; }
          
          .input-control { width: 100%; padding: 14px 16px; border: 1px solid var(--input-border); border-radius: 12px; font-size: 14px; background: var(--input-bg); color: var(--text-main); transition: 0.3s; font-weight: 700; outline: none; }
          .input-control:focus { border-color: var(--card-hover-border); box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2); background: var(--card-hover-bg); }
          .input-control option { background: #fffbeb; color: #334155; }
          .theme-dark .input-control option { background: #0f172a; color: #f8fafc; }

          /* アンバーのボタン */
          .btn-primary { width: 100%; padding: 14px; background: linear-gradient(135deg, #f59e0b, #ea580c); color: #fff; border: none; border-radius: 12px; font-weight: 900; cursor: pointer; transition: 0.3s; font-size: 15px; letter-spacing: 1px; box-shadow: 0 5px 15px rgba(234, 88, 12, 0.3); display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 10px; }
          .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(234, 88, 12, 0.5); }

          .preview-area { width: 100%; height: 220px; padding: 20px; background: var(--input-bg); color: var(--text-main); border-radius: 12px; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.6; border: 2px dashed var(--accent-color); outline: none; resize: vertical; box-shadow: inset 0 4px 10px rgba(0,0,0,0.05); }
          
          /* 固定フッター */
          .footer-bar { position: fixed; bottom: 0; left: 0; width: 100%; padding: 16px 40px; background: var(--card-bg); backdrop-filter: blur(12px); border-top: 1px solid var(--card-border); display: flex; gap: 16px; z-index: 100; justify-content: center; }
          .btn-footer { max-width: 300px; width: 100%; padding: 16px; border-radius: 30px; font-weight: 900; font-size: 15px; border: none; cursor: pointer; transition: 0.3s; letter-spacing: 1px; color: #fff; }
          .btn-clear { background: var(--input-bg); color: var(--text-sub); border: 2px solid var(--card-border); }
          .btn-clear:hover { border-color: #ef4444; color: #ef4444; background: rgba(239, 68, 68, 0.1); }

          /* トースト通知 */
          #toast { visibility: hidden; position: fixed; bottom: 100px; right: 40px; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); padding: 16px 24px; border-radius: 12px; font-weight: 800; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 200; opacity: 0; transition: 0.4s; backdrop-filter: blur(10px); }
          #toast.show { visibility: visible; opacity: 1; transform: translateY(-10px); }
          #toast.error { background: #fee2e2; color: #e11d48; border-color: #f43f5e; box-shadow: 0 10px 30px rgba(225, 29, 72, 0.2); }
          .theme-dark #toast.error { background: rgba(225, 29, 72, 0.2); border-color: #fb7185; }

          /* 🪄 スクロール連動 */
          .fade-up-element { opacity: 0; transform: translateY(40px); transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
          .fade-up-element.visible { opacity: 1; transform: translateY(0); }
        `}} />

        {/* 🌟 SVGデータフロー背景（ティンカーベルを廃止し、直線的でクールなデータフローへ） */}
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
          <a href="/email-template" className="side-link current-page">✉️ メールテンプレート</a>
          <a href="/procedure-wizard" className="side-link">🗺️ Kraken 手順辞書</a>
          <a href="/simulator" className="side-link">🆚 料金シミュレーター</a>
          <a href="/trouble-nav" className="side-link">⚡ トラブル解決ナビ</a>
        </div>

        {/* 🎈 ナビゲーション & テーマ切り替え */}
        <div className="glass-nav-wrapper fade-up-element" style={{ "--delay": "0s" } as any}>
          <div className="glass-nav">
            <div className="nav-left">
              <a href="/" className="glass-nav-link">← 司令室に戻る</a>
              <div className="glass-nav-active">✉️ メールテンプレート</div>
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
              <h3 className="info-title">📌 使用時の注意事項</h3>
              <ul className="info-list">
                <li>重説メールは「リスト選択」が必須です。選択に応じて自動的にURLが切り替わります。</li>
                <li>料金単価表は「エリア選択」が必須です。最新の単価が自動で計算・反映されます。</li>
                <li>生成されたテキストは、クリップボードに「リッチテキスト（太字などの装飾付き）」でコピーされます。そのままGmail等に貼り付けて送信してください。</li>
              </ul>
            </div>
            
            <div className="info-panel fade-up-element" style={{ transitionDelay: "0.1s" }}>
              <h3 className="info-title">🛠️ 運用ステータス</h3>
              <ul className="info-list">
                <li>リッチテキストコピー：有効</li>
                <li>単価DB（v3.1）：最新</li>
              </ul>
            </div>
          </aside>

          {/* 📝 右カラム：メインフォームエリア */}
          <div className="form-main-area">
            
            {/* 🎀 重説メールセクション */}
            <section className="glass-panel fade-up-element">
              <h4 className="section-title">✉️ 重要事項説明メール作成</h4>
              <div className="form-grid-2">
                <div className="input-group">
                  <label>👤 お客様名</label>
                  <input className="input-control" type="text" id="name1" placeholder="例：山田 太郎" value={form.name1} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>📅 開始日</label>
                  <input className="input-control" type="date" id="date" value={form.date} onChange={handleChange} />
                </div>
                <div className="input-group" style={{ gridColumn: "span 2" }}>
                  <label>🔑 リスト選択（必須）</label>
                  <select className="input-control" id="listKey" value={form.listKey} onChange={handleChange}>
                    <option value="">-- お選びください --</option>
                    <option value="シンプル">シンプル</option>
                    <option value="ガスセット">ガスセット</option>
                    <option value="LL">LL</option>
                    <option value="グリーン">グリーン</option>
                    <option value="タクト">タクト</option>
                    <option value="空室通電">空室通電</option>
                  </select>
                </div>
              </div>
              <button className="btn-primary" onClick={copyTemplate}>📋 重説メールをコピー</button>
            </section>

            {/* 💎 料金単価表セクション */}
            <section className="glass-panel fade-up-element" style={{ transitionDelay: "0.1s" }}>
              <h4 className="section-title">📊 料金単価表 作成</h4>
              <div className="form-grid-2">
                <div className="input-group">
                  <label>👤 お客様名</label>
                  <input className="input-control" type="text" id="name2" placeholder="例：鈴木 一郎" value={form.name2} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>📍 エリア選択（必須）</label>
                  <select className="input-control" id="area" value={form.area} onChange={handleChange}>
                    <option value="">-- お選びください --</option>
                    {Object.keys(PRICING_DB).map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="btn-primary" onClick={copyRate}>📋 単価表をコピー</button>
            </section>

            {/* 👀 プレビューエリア */}
            {preview && (
              <section className="glass-panel fade-up-element" style={{ transitionDelay: "0.2s" }}>
                <div style={{ fontWeight: 900, fontSize: "15px", color: "var(--accent-color)", marginBottom: "15px" }}>{`> SYSTEM.PREVIEW // コピー内容確認`}</div>
                <textarea className="preview-area" value={preview} readOnly />
              </section>
            )}

          </div>
        </div>

        {/* 🛠️ フッター操作 */}
        <div className="footer-bar">
          <button className="btn-footer btn-clear" onClick={clearAll}>🗑️ フォームをリセット</button>
        </div>

        {/* 🍞 通知 */}
        <div id="toast" className={`${toast.show ? "show" : ""} ${toast.isError ? "error" : ""}`}>{toast.msg}</div>
      </main>
    </>
  );
}