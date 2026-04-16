"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 🌟 高度技術①＆⑦：ジェネレーティブUI ＆ カームデザイン (メアリー・ブレア風のパステル図形)
const PastelShapes = () => {
  const [shapes, setShapes] = useState<{ id: number; type: string; left: string; top: string; delay: string; duration: string; color: string; size: string }[]>([]);
  
  useEffect(() => {
    const types = ['shape-circle', 'shape-triangle', 'shape-diamond', 'shape-flower'];
    const colors = ['#fbcfe8', '#bae6fd', '#a7f3d0', '#fef08a', '#e9d5ff']; // 優しいパステルパレット
    const newShapes = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      type: types[Math.floor(Math.random() * types.length)],
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 15 + 15}s`, // ゆっくりと平和に動く
      color: colors[Math.floor(Math.random() * colors.length)],
      size: `${Math.random() * 50 + 30}px`
    }));
    setShapes(newShapes);
  }, []);

  return (
    <div className="pastel-shapes-container">
      {shapes.map(s => (
        <div 
          key={s.id} className={`mary-shape ${s.type}`} 
          style={{ 
            left: s.left, top: s.top, width: s.size, height: s.size, 
            backgroundColor: s.color, animationDelay: s.delay, animationDuration: s.duration 
          }} 
        />
      ))}
    </div>
  );
};

export default function EmailTemplate() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // ⚙️ システム状態管理（一切変更なし）
  const [toast, setToast] = useState({ show: false, msg: "", isBlue: false });
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({ name1: "", date: "", listKey: "", name2: "", area: "" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  // ⚙️ システムロジック（一切変更なし）
  const showToast = (msg: string, isBlue = false) => {
    setToast({ show: true, msg, isBlue });
    setTimeout(() => setToast({ show: false, msg: "", isBlue: false }), 3000);
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

    if (!form.listKey) { showToast("⚠️ リストを選択してください！", false); return; }

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
    if (execRichCopy(html)) showToast(`✨ ${form.listKey} の重説メールをコピーしました！`);
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
    if (execRichCopy(html)) showToast(`💎 ${form.area} の魔法の単価表をコピーしました！`, true);
  };

  const clearAll = () => {
    if (!confirm("入力をリセットしますか？")) return;
    setForm({ name1: "", date: "", listKey: "", name2: "", area: "" });
    setPreview("");
    showToast("🗑️ 魔法をリセットしました");
  };

  return (
    <div className={`small-world-theme ${isReady ? "ready" : ""}`}>
      {/* ✨ 究極魔法のCSS（9つのデザイン技術を投入） */}
      <style dangerouslySetInnerHTML={{ __html: `
        .small-world-theme * { box-sizing: border-box; }
        
        /* 🌤️ 1. ジェネレーティブUI & カームデザイン (パステルグラデーション) */
        .small-world-theme { 
          font-family: 'M PLUS Rounded 1c', 'Nunito', 'Varela Round', sans-serif; /* 丸くて優しいフォント */
          padding: 20px 40px 100px 40px; min-height: 100vh; 
          background: linear-gradient(135deg, #fdf4ff 0%, #e0e7ff 50%, #fef08a 100%); 
          background-attachment: fixed; color: #334155; overflow-x: hidden; position: relative; z-index: 1;
        }
        
        /* 🎨 メアリー・ブレア風の図形アニメーション */
        .pastel-shapes-container { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: -1; overflow: hidden; opacity: 0.7; }
        .mary-shape { position: absolute; animation: floatShape linear infinite alternate; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.05)); }
        .shape-circle { border-radius: 50%; }
        .shape-triangle { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }
        .shape-diamond { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
        .shape-flower { clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); }
        @keyframes floatShape { 0% { transform: translateY(0) rotate(0deg); } 100% { transform: translateY(-100px) rotate(180deg); } }

        /* 🕰️ 9. イマーシブ要素（背景の微笑む時計塔/太陽 SVG） */
        .clock-tower-bg { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80vh; height: 80vh; opacity: 0.1; z-index: -2; animation: gentleRock 20s ease-in-out infinite alternate; pointer-events: none; }
        @keyframes gentleRock { 0% { transform: translate(-50%, -50%) rotate(-5deg); } 100% { transform: translate(-50%, -50%) rotate(5deg); } }

        /* 🍔 マイクロインタラクション（ハンバーガーボタン） */
        .hamburger-btn { position: fixed; top: 20px; left: 20px; z-index: 1001; background: rgba(255,255,255,0.8); backdrop-filter: blur(15px); border: 2px solid #fbcfe8; border-radius: 50%; width: 50px; height: 50px; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; box-shadow: 0 5px 15px rgba(244, 114, 182, 0.2); transition: 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .hamburger-btn:hover { background: #fff; box-shadow: 0 8px 25px rgba(244, 114, 182, 0.4); transform: scale(1.1); }
        .hamburger-line { width: 22px; height: 3px; background: #db2777; border-radius: 3px; transition: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .hamburger-btn.open .line1 { transform: translateY(8px) rotate(45deg); background: #2563eb; }
        .hamburger-btn.open .line2 { opacity: 0; transform: translateX(-10px); }
        .hamburger-btn.open .line3 { transform: translateY(-8px) rotate(-45deg); background: #2563eb; }

        /* 🌌 オーバーレイ */
        .menu-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(255, 255, 255, 0.3); backdrop-filter: blur(8px); z-index: 999; opacity: 0; pointer-events: none; transition: 0.4s ease; }
        .menu-overlay.open { opacity: 1; pointer-events: auto; }

        /* 🗄️ サイドメニュー */
        .side-menu { position: fixed; top: 0; left: -320px; width: 300px; height: 100vh; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(30px); border-right: 2px dashed #fbcfe8; z-index: 1000; box-shadow: 20px 0 50px rgba(0,0,0,0.05); transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); padding: 90px 24px 30px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }
        .side-menu.open { left: 0; }
        .menu-title { font-size: 14px; font-weight: 900; color: #db2777; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 3px dotted #fbcfe8; letter-spacing: 2px; }

        .side-link { text-decoration: none; padding: 14px 20px; border-radius: 20px; background: rgba(255, 255, 255, 0.9); color: #475569; font-weight: 800; font-size: 14px; border: 2px solid #f1f5f9; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
        .side-link:hover { background: #fff; border-color: #bae6fd; color: #0284c7; transform: translateX(8px) scale(1.02); box-shadow: 0 8px 20px rgba(2, 132, 199, 0.15); }
        .side-link.current-page { background: linear-gradient(135deg, #fbcfe8, #a7f3d0); color: #0f172a; border: none; box-shadow: 0 8px 25px rgba(167, 243, 208, 0.5); pointer-events: none; }

        /* 🎈 ナビゲーション */
        .glass-nav { position: relative; z-index: 10; display: flex; gap: 12px; padding: 12px; margin-bottom: 30px; margin-left: 60px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); border: 2px solid #fff; border-radius: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .glass-nav-link { text-decoration: none; padding: 10px 24px; border-radius: 18px; font-weight: 800; background: transparent; color: #64748b; transition: 0.3s; }
        .glass-nav-link:hover { background: rgba(255,255,255,0.9); color: #0284c7; box-shadow: 0 4px 10px rgba(2,132,199,0.1); }
        .glass-nav-active { padding: 10px 24px; border-radius: 18px; font-weight: 900; background: #fff; color: #db2777; box-shadow: 0 4px 15px rgba(219, 39, 119, 0.15); border: 2px solid #fbcfe8; }
        
        /* 🔠 5. ダイナミック・タイポグラフィ (パステルの立体タイトル) */
        .page-title { 
          text-align: center; font-size: 38px; font-weight: 900; margin-bottom: 40px; letter-spacing: 3px; color: #fff; 
          text-shadow: 2px 2px 0 #f472b6, 4px 4px 0 #38bdf8, 6px 6px 0 #a7f3d0, 0 10px 20px rgba(0,0,0,0.1);
          animation: gentleBounce 2s infinite alternate ease-in-out;
        }
        @keyframes gentleBounce { to { transform: translateY(-8px); } }

        /* 📦 2. Bento UI (フロストガラスのメインパネル) */
        .glass-panel { 
          background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(25px); 
          border: 3px solid #fff; border-radius: 40px; padding: 40px; margin-bottom: 30px; 
          box-shadow: 0 20px 50px rgba(0,0,0,0.05), inset 0 0 30px rgba(255,255,255,0.8); 
          max-width: 950px; margin-left: auto; margin-right: auto; position: relative;
        }
        
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; }
        @media (max-width: 800px) { .form-grid { grid-template-columns: 1fr; } }

        /* フォームカード (ピンクとブルーのアクセント) */
        .form-card { 
          background: rgba(255, 255, 255, 0.85); border-radius: 30px; padding: 30px; 
          border: 2px solid #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.03); 
          transition: 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .form-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.08); }
        .form-card.pink-card { border-top: 8px solid #fbcfe8; }
        .form-card.blue-card { border-top: 8px solid #bae6fd; }

        .card-header { font-size: 20px; font-weight: 900; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; }
        .pink-card .card-header { color: #db2777; }
        .blue-card .card-header { color: #0284c7; }
        
        /* 🕹️ 4. マイクロインタラクション (入力フォーム) */
        .input-group { display: flex; flex-direction: column; margin-bottom: 24px; }
        .input-group label { font-size: 13px; font-weight: 800; color: #64748b; margin-bottom: 8px; padding-left: 8px; }
        .input-control { 
          width: 100%; padding: 15px 20px; border: 2px solid #e2e8f0; border-radius: 20px; 
          font-size: 15px; font-weight: 800; background: rgba(255, 255, 255, 0.9); color: #1e293b; 
          outline: none; transition: 0.3s; box-shadow: inset 0 2px 5px rgba(0,0,0,0.02); font-family: 'M PLUS Rounded 1c', sans-serif;
        }
        .pink-card .input-control:focus { border-color: #f472b6; background: #fff; box-shadow: 0 0 0 5px rgba(244, 114, 182, 0.2); }
        .blue-card .input-control:focus { border-color: #38bdf8; background: #fff; box-shadow: 0 0 0 5px rgba(56, 189, 248, 0.2); }

        /* 🔘 6. アクションファースト (ピル型コピーボタン) */
        .btn-copy { 
          width: 100%; padding: 18px; border: none; border-radius: 30px; font-weight: 900; font-size: 16px; 
          cursor: pointer; transition: 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); color: #fff; margin-top: 15px; 
          letter-spacing: 1px; display: flex; justify-content: center; align-items: center; gap: 8px;
        }
        .btn-pink { background: linear-gradient(135deg, #f472b6, #e11d48); box-shadow: 0 8px 20px rgba(225, 29, 72, 0.3); }
        .btn-pink:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 25px rgba(225, 29, 72, 0.5); }
        .btn-blue { background: linear-gradient(135deg, #38bdf8, #0284c7); box-shadow: 0 8px 20px rgba(2, 132, 199, 0.3); }
        .btn-blue:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 25px rgba(2, 132, 199, 0.5); }

        /* 📜 魔法のスクロール (プレビューエリア) */
        .preview-area { 
          width: 100%; height: 220px; padding: 25px; 
          background: #1e1b4b; /* 深いナイトパープル */
          color: #e9d5ff; /* 淡いラベンダーテキスト */
          border-radius: 24px; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.7; 
          border: 4px solid #c084fc; outline: none; resize: vertical; 
          box-shadow: inset 0 10px 20px rgba(0,0,0,0.5), 0 10px 30px rgba(192,132,252,0.2); 
        }
        
        .btn-clear { 
          display: block; width: 220px; margin: 0 auto; padding: 15px; 
          background: #fff; color: #94a3b8; border: 3px solid #e2e8f0; border-radius: 30px; 
          font-weight: 900; cursor: pointer; transition: 0.3s; box-shadow: 0 5px 15px rgba(0,0,0,0.05); 
        }
        .btn-clear:hover { background: #fef2f2; color: #e11d48; border-color: #fecdd3; transform: translateY(-2px); }

        /* 🍞 トースト通知 (スプリングアニメーション) */
        #toast { 
          visibility: hidden; position: fixed; bottom: 40px; right: 40px; padding: 18px 28px; border-radius: 20px; 
          font-weight: 900; font-size: 15px; box-shadow: 0 15px 40px rgba(0,0,0,0.3); z-index: 2000; opacity: 0; 
          color: #fff; background: #e11d48; border: 2px solid #fda4af; 
          transform: translateY(50px) scale(0.9); transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); 
        }
        #toast.show { visibility: visible; opacity: 1; transform: translateY(0) scale(1); }
        #toast.blue { background: #0284c7; border-color: #7dd3fc; }
      `}} />

      {/* 🎪 イマーシブ背景 (パステル図形と時計塔) */}
      <PastelShapes />
      <svg className="clock-tower-bg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="#fef08a" />
        <circle cx="75" cy="85" r="10" fill="#fde047" />
        <circle cx="125" cy="85" r="10" fill="#fde047" />
        <path d="M 60 120 Q 100 160 140 120" fill="none" stroke="#fde047" strokeWidth="12" strokeLinecap="round" />
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
        <div className="menu-title">🧭 ATTRACTION MENU</div>
        <a href="/bulk-register" className="side-link">📦 一括登録（自己クロ）</a>
        <a href="/net-toss" className="side-link">🌐 ネットトス連携</a>
        <a href="/self-close" className="side-link">🌲 自己クロ連携</a>
        <a href="/sms-kraken" className="side-link">📱 SMS (Kraken)</a>
        <div className="side-link current-page">✨ メールテンプレート</div>
      </div>

      {/* 🎈 トップナビゲーション */}
      <div className="glass-nav">
        <a href="/" className="glass-nav-link">← パーク入口へ戻る</a>
        <div className="glass-nav-active">✨ メールテンプレート</div>
      </div>

      <h1 className="page-title">IT'S A SMALL WORLD</h1>

      <div className="glass-panel">
        
        <div className="form-grid">
          {/* 🎀 重説メールセクション (ピンク) */}
          <div className="form-card pink-card">
            <h4 className="card-header">💌 重要事項説明</h4>
            <div className="input-group">
              <label>👤 お客様名</label>
              <input className="input-control" type="text" id="name1" placeholder="例：山田 太郎" value={form.name1} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>📅 開始日</label>
              <input className="input-control" type="date" id="date" value={form.date} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>🔑 リスト選択</label>
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
            <button className="btn-copy btn-pink" onClick={copyTemplate}>✨ 重説メールをコピー</button>
          </div>

          {/* 💧 料金単価表セクション (ブルー) */}
          <div className="form-card blue-card">
            <h4 className="card-header">💎 料金単価表</h4>
            <div className="input-group">
              <label>👤 お客様名</label>
              <input className="input-control" type="text" id="name2" placeholder="例：鈴木 一郎" value={form.name2} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>📍 エリア選択</label>
              <select className="input-control" id="area" value={form.area} onChange={handleChange}>
                <option value="">-- お選びください --</option>
                {Object.keys(PRICING_DB).map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div style={{ minHeight: "84px" }}></div> {/* 高さを揃えるためのスペーサー */}
            <button className="btn-copy btn-blue" onClick={copyRate}>🌍 単価表をコピー</button>
          </div>
        </div>
      </div>

      {/* 📜 プレビューエリア */}
      {preview && (
        <div className="glass-panel" style={{ background: "transparent", border: "none", boxShadow: "none", padding: "0" }}>
          <div style={{ fontSize: "16px", fontWeight: 900, color: "#a855f7", marginBottom: "15px", paddingLeft: "10px" }}>
            {`> MAGIC SCROLL (PREVIEW)`}
          </div>
          <textarea className="preview-area" value={preview} readOnly />
        </div>
      )}

      <button className="btn-clear" onClick={clearAll}>🗑️ 魔法をリセット</button>

      {/* 🍞 トースト通知 */}
      <div id="toast" className={`${toast.show ? "show" : ""} ${toast.isBlue ? "blue" : ""}`}>{toast.msg}</div>
    </div>
  );
}