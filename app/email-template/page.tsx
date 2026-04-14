"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmailTemplate() {
  const router = useRouter();

  const [toast, setToast] = useState({ show: false, msg: "", isBlue: false });
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({ name1: "", date: "", listKey: "", name2: "", area: "" });

  // 🍔 ハンバーガーメニューの開閉状態
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    if (execRichCopy(html)) showToast(`💰 ${form.area} の料金表をコピーしました！`, true);
  };

  const clearAll = () => {
    if (!confirm("入力をリセットしますか？")) return;
    setForm({ name1: "", date: "", listKey: "", name2: "", area: "" });
    setPreview("");
    showToast("🗑️ データをクリアしました");
  };

  return (
    <div className="glass-email">
      <style dangerouslySetInnerHTML={{ __html: `
        .glass-email * { box-sizing: border-box; }
        /* 💎 背景：シアンとアメジストの透明感あるグラデーション */
        .glass-email { font-family: 'Inter', 'Noto Sans JP', sans-serif; padding: 20px 40px 100px 40px; min-height: 100vh; background: linear-gradient(135deg, #e0f2fe 0%, #fae8ff 50%, #f0fdfa 100%); background-attachment: fixed; color: #1e293b; overflow-x: hidden; }
        
        /* 🍔 ハンバーガーボタン */
        .hamburger-btn { position: fixed; top: 20px; left: 20px; z-index: 1001; background: rgba(255,255,255,0.6); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.9); border-radius: 12px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; gap: 5px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: 0.3s; }
        .hamburger-btn:hover { background: #fff; box-shadow: 0 6px 20px rgba(2, 132, 199, 0.2); transform: scale(1.05); }
        .hamburger-line { width: 22px; height: 3px; background: #475569; border-radius: 3px; transition: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .hamburger-btn.open .line1 { transform: translateY(8px) rotate(45deg); background: #0284c7; }
        .hamburger-btn.open .line2 { opacity: 0; transform: translateX(-10px); }
        .hamburger-btn.open .line3 { transform: translateY(-8px) rotate(-45deg); background: #0284c7; }

        /* 🌌 オーバーレイ */
        .menu-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.2); backdrop-filter: blur(5px); z-index: 999; opacity: 0; pointer-events: none; transition: 0.4s ease; }
        .menu-overlay.open { opacity: 1; pointer-events: auto; }

        /* 🗄️ サイドメニュー */
        .side-menu { position: fixed; top: 0; left: -320px; width: 300px; height: 100vh; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); border-right: 1px solid rgba(255, 255, 255, 0.8); z-index: 1000; box-shadow: 20px 0 50px rgba(0,0,0,0.05); transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); padding: 90px 24px 30px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
        .side-menu.open { left: 0; }
        .menu-title { font-size: 13px; font-weight: 900; color: #0369a1; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed rgba(2, 132, 199, 0.5); letter-spacing: 1px; }

        .side-link { text-decoration: none; padding: 14px 20px; border-radius: 14px; background: rgba(255, 255, 255, 0.7); color: #334155; font-weight: 800; font-size: 14px; border: 1px solid rgba(255,255,255,0.9); transition: all 0.2s; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
        .side-link:hover { background: #fff; border-color: #7dd3fc; color: #0284c7; transform: translateX(8px); box-shadow: 0 6px 15px rgba(2, 132, 199, 0.15); }
        /* 現在のページ：美しいシアンのグラデーション */
        .side-link.current-page { background: linear-gradient(135deg, #38bdf8, #0284c7); color: #fff; border: none; box-shadow: 0 6px 20px rgba(2, 132, 199, 0.3); pointer-events: none; }

        /* 🎈 ナビゲーション */
        .glass-nav { position: relative; z-index: 10; display: flex; gap: 12px; padding: 12px; margin-bottom: 24px; margin-left: 60px; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.8); border-radius: 16px; box-shadow: 0 4px 30px rgba(0,0,0,0.03); }
        .glass-nav-link { text-decoration: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; background: rgba(255, 255, 255, 0.6); color: #64748b; transition: 0.2s; border: 1px solid transparent; }
        .glass-nav-link:hover { background: #fff; color: #0284c7; border-color: #bae6fd; }
        .glass-nav-active { padding: 10px 20px; border-radius: 10px; font-weight: 800; background: #fff; color: #0284c7; border: 1px solid #bae6fd; box-shadow: 0 2px 10px rgba(2,132,199,0.1); }
        
        /* 🌟 メインパネル */
        .glass-panel { background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.9); border-top: 4px solid #38bdf8; border-radius: 20px; padding: 30px; margin-bottom: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.04); max-width: 900px; margin-left: auto; margin-right: auto; }
        .section-title { font-size: 18px; font-weight: 900; color: #0c4a6e; margin-bottom: 24px; border-left: 5px solid #38bdf8; padding-left: 12px; display: flex; align-items: center; gap: 8px; }
        
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }
        .form-card { background: rgba(255, 255, 255, 0.5); border-radius: 15px; padding: 24px; border: 1px solid rgba(255, 255, 255, 0.8); box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        
        .input-group { display: flex; flex-direction: column; margin-bottom: 20px; }
        .input-group label { font-size: 12px; font-weight: 800; color: #475569; margin-bottom: 6px; padding-left: 4px; }
        .input-control { width: 100%; padding: 12px 16px; border: 1px solid rgba(148, 163, 184, 0.4); border-radius: 12px; font-size: 14px; background: rgba(255, 255, 255, 0.8); color: #1e293b; outline: none; transition: 0.2s; }
        .input-control:focus { border-color: #38bdf8; background: #fff; box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.15); }

        .btn-copy { width: 100%; padding: 14px; border: none; border-radius: 12px; font-weight: 800; font-size: 15px; cursor: pointer; transition: 0.2s; color: #fff; margin-top: 10px; }
        /* ピンク（重説用） */
        .btn-pink { background: linear-gradient(135deg, #f472b6, #e11d48); box-shadow: 0 4px 15px rgba(225, 29, 72, 0.2); }
        .btn-pink:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(225, 29, 72, 0.4); }
        
        /* ブルー（単価表用） */
        .btn-blue { background: linear-gradient(135deg, #38bdf8, #0284c7); box-shadow: 0 4px 15px rgba(2, 132, 199, 0.2); }
        .btn-blue:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(2, 132, 199, 0.4); }

        /* 🌟 プレビュー（ディープ・ネイビー） */
        .preview-area { width: 100%; height: 200px; padding: 20px; background: #0f172a; color: #38bdf8; border-radius: 15px; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.6; border: none; outline: none; resize: vertical; box-shadow: inset 0 4px 10px rgba(0,0,0,0.4); }
        
        .btn-clear { display: block; width: 200px; margin: 0 auto; padding: 12px; background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.2s; }
        .btn-clear:hover { background: #e2e8f0; color: #1e293b; }

        /* 🌟 トースト通知 */
        #toast { visibility: hidden; position: fixed; bottom: 40px; right: 40px; padding: 16px 24px; border-radius: 12px; font-weight: 800; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 2000; opacity: 0; transition: 0.4s; color: #fff; background: #e11d48; border: 1px solid transparent; }
        #toast.show { visibility: visible; opacity: 1; transform: translateY(-10px); }
        #toast.blue { background: #0284c7; }
      `}} />

      {/* 🍔 ハンバーガーボタン */}
      <div className={`hamburger-btn ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <div className="hamburger-line line1"></div>
        <div className="hamburger-line line2"></div>
        <div className="hamburger-line line3"></div>
      </div>

      {/* 🌌 メニュー展開時の背景オーバーレイ（クリックで閉じる） */}
      <div className={`menu-overlay ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(false)}></div>

      {/* 🗄️ 左から現れる透け透けサイドメニュー */}
      <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="menu-title">🧭 TOOL MENU</div>
        <a href="/bulk-register" className="side-link">📦 一括登録（自己クロ）</a>
        <a href="/net-toss" className="side-link">🌐 ネットトス連携</a>
        <a href="/self-close" className="side-link">🌲 自己クロ連携</a>
        <a href="/sms-kraken" className="side-link">📱 SMS (Kraken)</a>
        <a href="/email-template" className="side-link current-page">✨ メールテンプレート</a>
        
        <div className="side-link" style={{ opacity: 0.5, cursor: "not-allowed", background: "transparent", border: "1px dashed #bae6fd" }}>
          🔒 新ツール（開発中...）
        </div>
      </div>

      <div className="glass-nav">
        <a href="/" className="glass-nav-link">← 司令室に戻る</a>
        <div className="glass-nav-active">✨ メールテンプレート</div>
      </div>

      <div className="glass-panel">
        <div className="section-title">✉️ メール作成スイート</div>
        
        <div className="form-grid">
          {/* 重説メールセクション */}
          <div className="form-card" style={{ borderTop: "4px solid #f43f5e" }}>
            <h4 style={{ color: "#e11d48", marginTop: 0 }}>📧 重要事項説明</h4>
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
                <option value="">-- 選択 --</option>
                <option value="シンプル">シンプル</option>
                <option value="ガスセット">ガスセット</option>
                <option value="LL">LL</option>
                <option value="グリーン">グリーン</option>
                <option value="タクト">タクト</option>
                <option value="空室通電">空室通電</option>
              </select>
            </div>
            <button className="btn-copy btn-pink" onClick={copyTemplate}>重説メールをコピー</button>
          </div>

          {/* 料金単価表セクション */}
          <div className="form-card" style={{ borderTop: "4px solid #0ea5e9" }}>
            <h4 style={{ color: "#0284c7", marginTop: 0 }}>💰 料金単価表</h4>
            <div className="input-group">
              <label>👤 お客様名</label>
              <input className="input-control" type="text" id="name2" placeholder="例：鈴木 一郎" value={form.name2} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>📍 エリア選択</label>
              <select className="input-control" id="area" value={form.area} onChange={handleChange}>
                <option value="">-- 選択 --</option>
                {Object.keys(PRICING_DB).map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div style={{ minHeight: "68px" }}></div> {/* 高さを揃えるためのスペーサー */}
            <button className="btn-copy btn-blue" onClick={copyRate}>単価表をコピー</button>
          </div>
        </div>
      </div>

      {preview && (
        <div className="glass-panel" style={{ background: "rgba(15, 23, 42, 0.95)", border: "none", maxWidth: "900px", margin: "20px auto" }}>
          <div className="section-title" style={{ color: "#38bdf8", borderLeftColor: "#38bdf8" }}>{`> PREVIEW (PLAIN TEXT)`}</div>
          <textarea className="preview-area" value={preview} readOnly />
        </div>
      )}

      <button className="btn-clear" onClick={clearAll}>🗑️ 入力をクリア</button>

      {/* 🍞 通知 */}
      <div id="toast" className={`${toast.show ? "show" : ""} ${toast.isBlue ? "blue" : ""}`}>{toast.msg}</div>
    </div>
  );
}