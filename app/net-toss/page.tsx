"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function NetToss() {
  const router = useRouter();

  // 🌟 状態管理
  const [rawText, setRawText] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "" });
  
  // 🍔 ハンバーガーメニューの開閉状態を追加
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // 🌟 プレビュー文字列の自動生成
  const [preview, setPreview] = useState("");

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

  // 🌟 トースト表示
  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  // 🌟 入力変更ハンドラ
  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  // 🌟 定型文追加
  const addPhrase = (phrase: string) => {
    setForm(prev => ({
      ...prev,
      colMemo: prev.colMemo ? prev.colMemo + "\n" + phrase : phrase
    }));
  };

  // 🌟 WarpID 感知 (CallTree連携)
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

  // 🔤 カナ自動入力補助
  const baseKana = useRef("");
  const handleKanaUpdate = (e: any, targetKanaId: string) => {
    const text = e.data;
    if (text && !/[\u4E00-\u9FFF]/.test(text)) {
      const kanaStr = text.replace(/[\u3041-\u3096]/g, (match: any) => String.fromCharCode(match.charCodeAt(0) + 0x60));
      setForm(prev => ({ ...prev, [targetKanaId]: baseKana.current + kanaStr }));
    }
  };

  // ✨ 自動振り分けロジック (元ツールのロジックを継承)
  const doParse = (text: string) => {
    if (!text) { showToast("⚠️ データを貼り付けてください"); return; }
    const lines = text.split(/\r?\n/).map(line => line.replace(/^[^：:]+[：:]\s*/, '').trim());
    
    if (lines.length >= 14) {
      let newForm = { ...form };
      const raw0 = lines[0] || ""; const raw1 = lines[1] || "";
      let planRaw = (raw0.includes("シンプル") || raw0.includes("グリーン") || raw0.includes("LL") || raw0.includes("電化") || raw0.includes("ゼロ")) ? raw0 : raw1;
      let listRaw = planRaw === raw0 ? raw1 : raw0;

      // リスト名変換
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

  // 📋 コピー機能
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
    <div className="glass-net-toss">
      <style dangerouslySetInnerHTML={{ __html: `
        .glass-net-toss * { box-sizing: border-box; }
        .glass-net-toss { font-family: 'Inter', 'Noto Sans JP', sans-serif; padding: 20px 40px 100px 40px; min-height: 100vh; background: linear-gradient(135deg, #e0e7ff 0%, #fef9c3 50%, #f8fafc 100%); background-attachment: fixed; color: #1e293b; overflow-x: hidden; }
        
        /* 🍔 ハンバーガーボタン */
        .hamburger-btn { position: fixed; top: 20px; left: 20px; z-index: 1001; background: rgba(255,255,255,0.6); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.9); border-radius: 12px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; gap: 5px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: 0.3s; }
        .hamburger-btn:hover { background: #fff; box-shadow: 0 6px 20px rgba(234, 179, 8, 0.2); transform: scale(1.05); }
        .hamburger-line { width: 22px; height: 3px; background: #475569; border-radius: 3px; transition: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .hamburger-btn.open .line1 { transform: translateY(8px) rotate(45deg); background: #eab308; }
        .hamburger-btn.open .line2 { opacity: 0; transform: translateX(-10px); }
        .hamburger-btn.open .line3 { transform: translateY(-8px) rotate(-45deg); background: #eab308; }

        /* 🌌 オーバーレイ */
        .menu-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.3); backdrop-filter: blur(5px); z-index: 999; opacity: 0; pointer-events: none; transition: 0.4s ease; }
        .menu-overlay.open { opacity: 1; pointer-events: auto; }

        /* 🗄️ サイドメニュー */
        .side-menu { position: fixed; top: 0; left: -320px; width: 300px; height: 100vh; background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); border-right: 1px solid rgba(255, 255, 255, 0.7); z-index: 1000; box-shadow: 20px 0 50px rgba(0,0,0,0.1); transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); padding: 90px 24px 30px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
        .side-menu.open { left: 0; }
        .menu-title { font-size: 13px; font-weight: 900; color: #64748b; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed rgba(234, 179, 8, 0.5); letter-spacing: 1px; }

        .side-link { text-decoration: none; padding: 14px 20px; border-radius: 14px; background: rgba(255, 255, 255, 0.6); color: #334155; font-weight: 800; font-size: 14px; border: 1px solid rgba(255,255,255,0.8); transition: all 0.2s; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
        .side-link:hover { background: #fff; border-color: #fde047; color: #eab308; transform: translateX(8px); box-shadow: 0 6px 15px rgba(234, 179, 8, 0.15); }
        .side-link.current-page { background: linear-gradient(135deg, #facc15, #eab308); color: #422006; border: none; box-shadow: 0 6px 20px rgba(234, 179, 8, 0.3); pointer-events: none; }

        /* 🎈 ナビゲーション（ハンバーガー回避でmargin-left追加） */
        .glass-nav { position: relative; z-index: 10; display: flex; gap: 12px; padding: 12px; margin-bottom: 24px; margin-left: 60px; background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.7); border-radius: 16px; box-shadow: 0 4px 30px rgba(0,0,0,0.03); }
        .glass-nav-link { text-decoration: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; background: rgba(255, 255, 255, 0.6); color: #64748b; transition: 0.2s; border: 1px solid transparent; }
        .glass-nav-link:hover { background: #fff; color: #eab308; border-color: #fef08a; }
        .glass-nav-active { padding: 10px 20px; border-radius: 10px; font-weight: 800; background: #fff; color: #eab308; border: 1px solid #fef08a; box-shadow: 0 2px 10px rgba(234,179,8,0.1); }
        
        .glass-panel { background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.8); border-radius: 20px; padding: 24px; margin-bottom: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.04); }
        .section-title { font-size: 16px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-left: 5px solid #eab308; padding-left: 12px; display: flex; align-items: center; gap: 8px; }
        
        .form-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px 24px; }
        .input-group { display: flex; flex-direction: column; }
        .input-group label { font-size: 11px; font-weight: 800; color: #64748b; margin-bottom: 6px; margin-left: 4px; }
        .input-control { width: 100%; padding: 10px 14px; border: 1px solid rgba(203, 213, 225, 0.6); border-radius: 10px; font-size: 13px; background: rgba(255, 255, 255, 0.8); outline: none; transition: 0.2s; }
        .input-control:focus { border-color: #eab308; background: #fff; box-shadow: 0 0 0 4px rgba(234, 179, 8, 0.1); transform: translateY(-1px); }
        
        .paste-area { width: 100%; height: 90px; padding: 14px; border: 2px dashed rgba(234, 179, 8, 0.4); border-radius: 15px; background: rgba(255, 255, 255, 0.5); font-size: 13px; margin-bottom: 12px; outline: none; transition: 0.2s; }
        .paste-area:focus { border-color: #eab308; background: rgba(255, 255, 255, 0.8); box-shadow: 0 8px 20px rgba(234, 179, 8, 0.1); }
        
        .btn-parse { width: 100%; padding: 12px; background: #1e293b; color: #fef08a; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.2s; }
        .btn-parse:hover { background: #0f172a; transform: scale(1.01); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }

        .preview-area { width: 100%; height: 180px; padding: 16px; background: #1e293b; color: #fef08a; border-radius: 15px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.5; border: none; outline: none; resize: none; box-shadow: inset 0 4px 10px rgba(0,0,0,0.2); }
        
        .tag-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
        .tag-btn { padding: 6px 12px; background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; font-size: 11px; font-weight: 700; cursor: pointer; color: #64748b; transition: 0.2s; }
        .tag-btn:hover { border-color: #eab308; color: #eab308; background: #fefce8; }

        .footer-bar { position: fixed; bottom: 0; left: 0; width: 100%; padding: 16px 40px; background: rgba(255,255,255,0.7); backdrop-filter: blur(15px); border-top: 1px solid rgba(255,255,255,0.8); display: flex; gap: 16px; z-index: 100; }
        .btn-footer { flex: 1; padding: 14px; border-radius: 14px; font-weight: 800; font-size: 15px; border: none; cursor: pointer; transition: 0.2s; }
        .btn-copy { background: linear-gradient(135deg, #facc15, #eab308); color: #422006; box-shadow: 0 4px 15px rgba(234, 179, 8, 0.3); }
        .btn-copy:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(234, 179, 8, 0.4); }
        .btn-clear { background: #f1f5f9; color: #64748b; flex: 0.3; }

        #toast { visibility: hidden; position: fixed; bottom: 100px; right: 40px; background: #1e293b; color: #fff; padding: 16px 24px; border-radius: 12px; font-weight: 800; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 200; opacity: 0; transition: 0.4s; }
        #toast.show { visibility: visible; opacity: 1; transform: translateY(-10px); }
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
        <a href="/net-toss" className="side-link current-page">🌐 ネットトス連携</a>
        <a href="/self-close" className="side-link">🌲 自己クロ連携</a>
        <a href="/sms-kraken" className="side-link">📱 SMS (Kraken)</a>
        <a href="/email-template" className="side-link">✨ メールテンプレート</a>
        
        <div className="side-link" style={{ opacity: 0.5, cursor: "not-allowed", background: "transparent", border: "1px dashed #cbd5e1" }}>
          🔒 新ツール（開発中...）
        </div>
      </div>

      <div className="glass-nav">
        <a href="/" className="glass-nav-link">← 司令室に戻る</a>
        <div className="glass-nav-active">🌐 ネットトス連携</div>
      </div>

      {/* 🚀 貼り付けエリア */}
      <div className="glass-panel">
        <textarea 
          className="paste-area" 
          placeholder="CallTreeのデータをここに貼り付け、または自動受信を待機..." 
          value={rawText} 
          onChange={(e) => setRawText(e.target.value)} 
        />
        <button className="btn-parse" onClick={() => doParse(rawText)}>✨ 一発自動入力（パース）を実行</button>
      </div>

      {/* 📝 入力フォーム */}
      <div className="glass-panel">
        <div className="section-title">📝 連携データ詳細</div>
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

        <div className="input-group" style={{ marginTop: "20px" }}>
          <label>備考欄（特記事項）</label>
          <div className="tag-container">
            <button className="tag-btn" onClick={() => addPhrase("〇時以降の連絡希望。")}>➕ 〇時以降希望</button>
            <button className="tag-btn" onClick={() => addPhrase("順次架電お願いします！")}>➕ 順次</button>
            <button className="tag-btn" onClick={() => addPhrase("設備確認しますと伝えております。")}>➕ 設備確認</button>
          </div>
          <textarea className="input-control" id="colMemo" style={{ marginTop: "10px", minHeight: "80px" }} value={form.colMemo} onChange={handleChange} />
        </div>
      </div>

      {/* 👀 プレビューエリア */}
      <div className="glass-panel" style={{ background: "rgba(15, 23, 42, 0.9)", border: "none" }}>
        <div className="section-title" style={{ color: "#fef08a", borderLeftColor: "#facc15" }}>👀 転送用フォーマット・プレビュー</div>
        <textarea className="preview-area" value={preview} readOnly />
      </div>

      {/* 🛠️ フッター操作 */}
      <div className="footer-bar">
        <button className="btn-footer btn-clear" onClick={clearAll}>🗑️ リセット</button>
        <button className="btn-footer btn-copy" onClick={copyTemplate}>📋 この内容でFMTをコピー</button>
      </div>

      {/* 🍞 通知 */}
      <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>
    </div>
  );
}