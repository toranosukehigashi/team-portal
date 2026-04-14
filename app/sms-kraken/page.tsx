"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SmsKraken() {
  const router = useRouter();

  // 🌟 状態管理
  const [smsType, setSmsType] = useState("重説");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [preview, setPreview] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
  
  // 🍔 ハンバーガーメニューの開閉状態
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const companies = [
    "My賃貸", "春風不動産", "エステートプラス", "アパマンショップ蟹江店",
    "不動産ランドすまいる", "ピタットハウス神宮南", "Access", "ルームコレクション",
    "すまいらんど", "株式会社東栄", "株式会社STYプランニング", "なごやか不動産",
    "楽々不動産", "ひまわりカンパニー", "株式会社Terrace Home本店"
  ];

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
    <div className="glass-kraken">
      <style dangerouslySetInnerHTML={{ __html: `
        .glass-kraken * { box-sizing: border-box; }
        /* 🌺 背景：淡いローズ＆ピーチのグラデーション */
        .glass-kraken { font-family: 'Inter', 'Noto Sans JP', sans-serif; padding: 20px 40px 100px 40px; min-height: 100vh; background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fce7f3 100%); background-attachment: fixed; color: #1e293b; overflow-x: hidden; }
        
        /* 🍔 ハンバーガーボタン */
        .hamburger-btn { position: fixed; top: 20px; left: 20px; z-index: 1001; background: rgba(255,255,255,0.6); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.9); border-radius: 12px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; gap: 5px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: 0.3s; }
        .hamburger-btn:hover { background: #fff; box-shadow: 0 6px 20px rgba(225, 29, 72, 0.2); transform: scale(1.05); }
        .hamburger-line { width: 22px; height: 3px; background: #475569; border-radius: 3px; transition: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .hamburger-btn.open .line1 { transform: translateY(8px) rotate(45deg); background: #e11d48; }
        .hamburger-btn.open .line2 { opacity: 0; transform: translateX(-10px); }
        .hamburger-btn.open .line3 { transform: translateY(-8px) rotate(-45deg); background: #e11d48; }

        /* 🌌 オーバーレイ */
        .menu-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(76, 5, 25, 0.3); backdrop-filter: blur(5px); z-index: 999; opacity: 0; pointer-events: none; transition: 0.4s ease; }
        .menu-overlay.open { opacity: 1; pointer-events: auto; }

        /* 🗄️ サイドメニュー */
        .side-menu { position: fixed; top: 0; left: -320px; width: 300px; height: 100vh; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); border-right: 1px solid rgba(255, 255, 255, 0.7); z-index: 1000; box-shadow: 20px 0 50px rgba(0,0,0,0.1); transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); padding: 90px 24px 30px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
        .side-menu.open { left: 0; }
        .menu-title { font-size: 13px; font-weight: 900; color: #881337; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed rgba(244, 63, 94, 0.5); letter-spacing: 1px; }

        .side-link { text-decoration: none; padding: 14px 20px; border-radius: 14px; background: rgba(255, 255, 255, 0.7); color: #334155; font-weight: 800; font-size: 14px; border: 1px solid rgba(255,255,255,0.8); transition: all 0.2s; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
        .side-link:hover { background: #fff; border-color: #fda4af; color: #e11d48; transform: translateX(8px); box-shadow: 0 6px 15px rgba(225, 29, 72, 0.15); }
        /* 現在のページ：美しいローズレッドのグラデーション */
        .side-link.current-page { background: linear-gradient(135deg, #f43f5e, #be123c); color: #fff; border: none; box-shadow: 0 6px 20px rgba(225, 29, 72, 0.3); pointer-events: none; }

        /* 🎈 ナビゲーション */
        .glass-nav { position: relative; z-index: 10; display: flex; gap: 12px; padding: 12px; margin-bottom: 24px; margin-left: 60px; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.8); border-radius: 16px; box-shadow: 0 4px 30px rgba(0,0,0,0.03); }
        .glass-nav-link { text-decoration: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; background: rgba(255, 255, 255, 0.6); color: #64748b; transition: 0.2s; border: 1px solid transparent; }
        .glass-nav-link:hover { background: #fff; color: #e11d48; border-color: #fecdd3; }
        .glass-nav-active { padding: 10px 20px; border-radius: 10px; font-weight: 800; background: #fff; color: #e11d48; border: 1px solid #fecdd3; box-shadow: 0 2px 10px rgba(225,29,72,0.1); }
        
        /* 🌟 メインパネル */
        .glass-panel { background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.9); border-top: 4px solid #f43f5e; border-radius: 20px; padding: 30px; margin-bottom: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.04); max-width: 800px; margin-left: auto; margin-right: auto; }
        .section-title { font-size: 18px; font-weight: 900; color: #4c0519; margin-bottom: 24px; border-left: 5px solid #f43f5e; padding-left: 12px; display: flex; align-items: center; gap: 8px; }
        
        /* 🌟 フォーム要素 */
        .input-group { display: flex; flex-direction: column; margin-bottom: 24px; }
        .input-group label { font-size: 13px; font-weight: 800; color: #881337; margin-bottom: 8px; border-left: 3px solid #fb7185; padding-left: 8px; }
        .input-control { width: 100%; padding: 12px 16px; border: 1px solid rgba(251, 113, 133, 0.4); border-radius: 12px; font-size: 14px; background: rgba(255, 255, 255, 0.8); color: #1e293b; outline: none; transition: 0.2s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
        .input-control:focus { border-color: #f43f5e; background: #fff; box-shadow: 0 0 0 4px rgba(244, 63, 94, 0.15); transform: translateY(-1px); }
        .input-control:disabled { background: #fff1f2; opacity: 0.8; cursor: not-allowed; border-color: #fecdd3; }
        
        /* 🌟 ラジオボタンエリア */
        .radio-group { display: flex; flex-wrap: wrap; gap: 30px; padding: 16px 20px; border-radius: 12px; background: rgba(255, 255, 255, 0.7); border: 1px solid rgba(251, 113, 133, 0.4); }
        .radio-group label { margin: 0; display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 15px; font-weight: 800; color: #4c0519; border: none; padding: 0; text-shadow: none; }
        .radio-group input[type="radio"] { width: 20px; height: 20px; accent-color: #e11d48; cursor: pointer; margin: 0; transition: 0.2s; }
        .radio-group input[type="radio"]:checked { filter: drop-shadow(0 0 4px rgba(244, 63, 94, 0.4)); }

        /* 🌟 ボタン類（ローズレッド＆サンセットオレンジ） */
        .button-group { display: flex; gap: 12px; margin-top: 30px; }
        .btn { flex: 1; padding: 14px 20px; border: none; border-radius: 12px; font-weight: 800; font-size: 15px; cursor: pointer; transition: 0.2s; letter-spacing: 0.5px; color: #fff; text-align: center; }
        
        /* 宛先コピー：ローズレッド */
        .btn-phone { background: linear-gradient(135deg, #f43f5e, #be123c); box-shadow: 0 4px 15px rgba(225, 29, 72, 0.2); }
        .btn-phone:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(225, 29, 72, 0.4); }
        
        /* 本文コピー：サンセットオレンジ（アクセント） */
        .btn-text { background: linear-gradient(135deg, #f97316, #c2410c); box-shadow: 0 4px 15px rgba(249, 115, 22, 0.2); }
        .btn-text:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4); }
        
        .btn-clear { flex: 0.5; background: #ffe4e6; color: #881337; border: 1px solid #fecdd3; }
        .btn-clear:hover { background: #fecdd3; color: #4c0519; }

        /* 🌟 プレビュー（ディープ・バーガンディ） */
        .preview-area { width: 100%; height: 200px; padding: 20px; background: #4c0519; color: #fecdd3; border-radius: 15px; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.6; border: none; outline: none; resize: vertical; box-shadow: inset 0 4px 10px rgba(0,0,0,0.4); }
        
        /* 🌟 トースト通知 */
        #toast { visibility: hidden; position: fixed; bottom: 40px; right: 40px; padding: 16px 24px; border-radius: 12px; font-weight: 800; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 2000; opacity: 0; transition: 0.4s; color: #fff; border: 1px solid transparent; }
        #toast.show { visibility: visible; opacity: 1; transform: translateY(-10px); }
        #toast.success { background: #4c0519; border-color: #881337; }
        #toast.info { background: #9a3412; border-color: #c2410c; box-shadow: 0 10px 30px rgba(154, 52, 18, 0.3); }
        #toast.error { background: #7f1d1d; border-color: #ef4444; box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3); }
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
        <a href="/sms-kraken" className="side-link current-page">📱 SMS (Kraken)</a>
        <a href="/email-template" className="side-link">✨ メールテンプレート</a>
        
        <div className="side-link" style={{ opacity: 0.5, cursor: "not-allowed", background: "transparent", border: "1px dashed #fecdd3" }}>
          🔒 新ツール（開発中...）
        </div>
      </div>

      {/* トップナビゲーション（ハンバーガーを避けるため左にマージン追加） */}
      <div className="glass-nav">
        <a href="/" className="glass-nav-link">← 司令室に戻る</a>
        <div className="glass-nav-active">📱 SMS (Kraken)</div>
      </div>

      <div className="glass-panel">
        <div className="section-title">💬 メッセージ作成＆宛先変換</div>

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
            disabled={smsType !== "不出"} // 重説の時はグレーアウトしてロック！
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

        <div className="button-group">
          <button className="btn btn-phone" onClick={copyPhone}>📱 宛先(+81)コピー</button>
          <button className="btn btn-text" onClick={copySmsText}>📝 本文コピー</button>
          <button className="btn btn-clear" onClick={clearAll}>🗑️ リセット</button>
        </div>
      </div>

      {preview && (
        <div className="glass-panel" style={{ background: "rgba(76, 5, 25, 0.95)", border: "none", maxWidth: "800px", margin: "0 auto" }}>
          <div className="section-title" style={{ color: "#fecdd3", borderLeftColor: "#fb7185" }}>{`> SYSTEM.PREVIEW // コピー内容確認`}</div>
          <textarea className="preview-area" value={preview} readOnly />
        </div>
      )}

      {/* 🍞 通知 */}
      <div id="toast" className={`${toast.show ? "show" : ""} ${toast.type}`}>{toast.msg}</div>
    </div>
  );
}