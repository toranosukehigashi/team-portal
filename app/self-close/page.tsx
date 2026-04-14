"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SelfClose() {
  const router = useRouter();

  // 🌟 状態管理（ロジックは一切変更なし）
  const [rawText, setRawText] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "", isError: false });
  const [emailError, setEmailError] = useState(false);
  const [sameAsMove, setSameAsMove] = useState(false);

  // 🍔 ハンバーガーメニューの開閉状態を追加
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // 🌟 生年月日用の年リスト生成
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1939 }, (_, i) => {
    const y = 1940 + i;
    let wareki = "";
    if (y >= 2019) wareki = `令和${y - 2018 === 1 ? "元" : y - 2018}`;
    else if (y >= 1989) wareki = `平成${y - 1988 === 1 ? "元" : y - 1988}`;
    else wareki = `昭和${y - 1925}`;
    return { value: `${y}年`, label: `${y} (${wareki})年` };
  });

  // 🌟 プレビュー文字列の自動生成 (リアルタイム反映)
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

  // 🌟 トースト通知
  const showToast = (msg: string, isError = false) => {
    setToast({ show: true, msg, isError });
    setTimeout(() => setToast({ show: false, msg: "", isError: false }), 3000);
  };

  // 🌟 汎用入力ハンドラ
  const handleChange = (e: any) => {
    const { id, value, type, checked, name } = e.target;
    const targetId = id || name;
    
    setForm(prev => ({ ...prev, [targetId]: type === "checkbox" ? checked : value }));

    // メールバリデーション
    if (targetId === "colEmail") {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(value !== "" && !regex.test(value));
    }
  };

  // 🌟 意思取り方法のタグ追加
  const addPhrase = (phrase: string) => {
    setForm(prev => ({
      ...prev,
      colIntention: prev.colIntention ? prev.colIntention + " " + phrase : phrase
    }));
  };

  // 🌟 カナ自動入力補助
  const baseKana = useRef("");
  const handleKanaUpdate = (e: any, targetKanaId: string) => {
    const text = e.data;
    if (text && !/[\u4E00-\u9FFF]/.test(text)) {
      const kanaStr = text.replace(/[\u3041-\u3096]/g, (match: any) => String.fromCharCode(match.charCodeAt(0) + 0x60));
      setForm(prev => ({ ...prev, [targetKanaId]: baseKana.current + kanaStr }));
    }
  };

  // 🌟 工事日を引越日と同期
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

  // 🌟 WarpID 自動感知（CallTree連携）
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

  // ✨ 自動振り分けロジック
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
    <div className="glass-self-close">
      <style dangerouslySetInnerHTML={{ __html: `
        .glass-self-close * { box-sizing: border-box; }
        .glass-self-close { font-family: 'Inter', 'Noto Sans JP', sans-serif; padding: 20px 40px 100px 40px; min-height: 100vh; background: linear-gradient(135deg, #e0e7ff 0%, #fef9c3 50%, #f8fafc 100%); background-attachment: fixed; color: #1e293b; overflow-x: hidden; }
        
        /* 🍔 ハンバーガーボタン */
        .hamburger-btn { position: fixed; top: 20px; left: 20px; z-index: 1001; background: rgba(255,255,255,0.6); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.9); border-radius: 12px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; gap: 5px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: 0.3s; }
        .hamburger-btn:hover { background: #fff; box-shadow: 0 6px 20px rgba(132, 204, 22, 0.2); transform: scale(1.05); }
        .hamburger-line { width: 22px; height: 3px; background: #475569; border-radius: 3px; transition: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .hamburger-btn.open .line1 { transform: translateY(8px) rotate(45deg); background: #84cc16; }
        .hamburger-btn.open .line2 { opacity: 0; transform: translateX(-10px); }
        .hamburger-btn.open .line3 { transform: translateY(-8px) rotate(-45deg); background: #84cc16; }

        /* 🌌 オーバーレイ */
        .menu-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.3); backdrop-filter: blur(5px); z-index: 999; opacity: 0; pointer-events: none; transition: 0.4s ease; }
        .menu-overlay.open { opacity: 1; pointer-events: auto; }

        /* 🗄️ サイドメニュー */
        .side-menu { position: fixed; top: 0; left: -320px; width: 300px; height: 100vh; background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); border-right: 1px solid rgba(255, 255, 255, 0.7); z-index: 1000; box-shadow: 20px 0 50px rgba(0,0,0,0.1); transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); padding: 90px 24px 30px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
        .side-menu.open { left: 0; }
        .menu-title { font-size: 13px; font-weight: 900; color: #64748b; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed rgba(132, 204, 22, 0.5); letter-spacing: 1px; }

        .side-link { text-decoration: none; padding: 14px 20px; border-radius: 14px; background: rgba(255, 255, 255, 0.6); color: #334155; font-weight: 800; font-size: 14px; border: 1px solid rgba(255,255,255,0.8); transition: all 0.2s; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
        .side-link:hover { background: #fff; border-color: #bef264; color: #84cc16; transform: translateX(8px); box-shadow: 0 6px 15px rgba(132, 204, 22, 0.15); }
        .side-link.current-page { background: linear-gradient(135deg, #84cc16, #15803d); color: #fff; border: none; box-shadow: 0 6px 20px rgba(132, 204, 22, 0.3); pointer-events: none; }

        /* 🎈 ナビゲーション（ハンバーガー回避でmargin-left追加） */
        .glass-nav { position: relative; z-index: 10; display: flex; gap: 12px; padding: 12px; margin-bottom: 24px; margin-left: 60px; background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.7); border-radius: 16px; box-shadow: 0 4px 30px rgba(0,0,0,0.03); }
        .glass-nav-link { text-decoration: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; background: rgba(255, 255, 255, 0.6); color: #64748b; transition: 0.2s; border: 1px solid transparent; }
        .glass-nav-link:hover { background: #fff; color: #84cc16; border-color: #bef264; }
        .glass-nav-active { padding: 10px 20px; border-radius: 10px; font-weight: 800; background: #fff; color: #84cc16; border: 1px solid #bef264; box-shadow: 0 2px 10px rgba(132,204,22,0.1); }
        
        /* 🌟 メインパネル */
        .glass-panel { background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.8); border-top: 4px solid #84cc16; border-radius: 20px; padding: 24px; margin-bottom: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.04); }
        .section-title { font-size: 16px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-left: 5px solid #84cc16; padding-left: 12px; display: flex; align-items: center; gap: 8px; }
        .sub-title { font-size: 12px; font-weight: bold; color: #64748b; border-bottom: 1px solid rgba(132, 204, 22, 0.3); margin-top: 20px; margin-bottom: 12px; padding-bottom: 6px; }
        
        .form-grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0px 24px; }
        
        /* 🔥 スマート・フォーカス */
        .input-group { display: flex; flex-direction: column; margin-bottom: 8px; }
        .input-group label { font-size: 11px; font-weight: 800; color: #64748b; margin-bottom: 6px; border-left: 3px solid #84cc16; padding-left: 8px; }
        
        .input-control { width: 100%; padding: 8px 14px; border: 1px solid rgba(203, 213, 225, 0.6); border-radius: 10px; font-size: 13px; background: rgba(255, 255, 255, 0.8); color: #1e293b; outline: none; transition: 0.2s; }
        .input-control:focus { border-color: #84cc16; background: #fff; box-shadow: 0 0 0 4px rgba(132, 204, 22, 0.1); transform: translateY(-1px); }
        .input-control:disabled { background: #f1f5f9; opacity: 0.7; cursor: not-allowed; border-color: #e2e8f0; }
        .email-error { border-color: #ef4444; background: #fef2f2; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1); }
        
        .paste-area { width: 100%; height: 90px; padding: 14px; border: 2px dashed rgba(132, 204, 22, 0.4); border-radius: 15px; background: rgba(255, 255, 255, 0.5); font-size: 13px; margin-bottom: 12px; outline: none; transition: 0.2s; color: #475569; resize: none; }
        .paste-area:focus { border-color: #84cc16; background: rgba(255, 255, 255, 0.8); box-shadow: 0 8px 20px rgba(132, 204, 22, 0.1); }
        
        .btn-parse { width: 100%; padding: 12px; background: #1e293b; color: #bef264; border: none; border-radius: 12px; font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.2s; letter-spacing: 1px; }
        .btn-parse:hover { background: #0f172a; transform: translateY(-1px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }

        /* 🌟 ラジオボタンエリア */
        .radio-group { display: flex; flex-wrap: wrap; gap: 16px; padding: 10px 14px; border-radius: 10px; background: rgba(255, 255, 255, 0.6); border: 1px solid rgba(203, 213, 225, 0.6); }
        .radio-group label { margin: 0; display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: #1e293b; border: none; padding: 0; text-shadow: none; font-weight: normal; }
        .radio-group input[type="radio"] { width: 18px; height: 18px; accent-color: #84cc16; cursor: pointer; margin: 0; }

        /* 🌟 クイックタグ */
        .tag-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; margin-bottom: 10px; }
        .tag-btn { padding: 6px 14px; background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; font-size: 11px; font-weight: 700; cursor: pointer; color: #64748b; transition: 0.2s; }
        .tag-btn:hover { border-color: #bef264; color: #84cc16; background: #fefce8; transform: translateY(-1px); }

        /* 🌟 プレビュー */
        .preview-area { width: 100%; height: 320px; padding: 18px; background: #1e293b; color: #bef264; border-radius: 15px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.6; border: none; outline: none; resize: vertical; box-shadow: inset 0 4px 10px rgba(0,0,0,0.2); }
        
        /* 🌟 フッター */
        .footer-bar { position: fixed; bottom: 0; left: 0; width: 100%; padding: 16px 40px; background: rgba(255,255,255,0.7); backdrop-filter: blur(15px); border-top: 1px solid rgba(255,255,255,0.8); display: flex; gap: 16px; z-index: 100; }
        .btn-footer { flex: 1; padding: 14px; border-radius: 14px; font-weight: 800; font-size: 15px; border: none; cursor: pointer; transition: 0.2s; letter-spacing: 0.5px; color: #fff; }
        .btn-copy { background: linear-gradient(135deg, #a3e635, #65a30d); box-shadow: 0 4px 15px rgba(132, 204, 22, 0.2); border: 1px solid #bef264; flex: 2; }
        .btn-copy:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(132, 204, 22, 0.3); }
        .btn-clear { background: #f1f5f9; color: #64748b; flex: 0.6; }
        .btn-clear:hover { background: #e2e8f0; color: #1e293b; }

        /* 🌟 トースト通知 */
        #toast { visibility: hidden; position: fixed; bottom: 100px; right: 40px; background: #1e293b; color: #fff; padding: 16px 24px; border-radius: 12px; font-weight: 800; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 200; opacity: 0; transition: 0.4s; border: 1px solid #334155; }
        #toast.show { visibility: visible; opacity: 1; transform: translateY(-10px); }
        #toast.error { background: #ef4444; color: #fff; border-color: #f87171; box-shadow: 0 10px 30px rgba(239, 68, 68, 0.2); }
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
        <a href="/self-close" className="side-link current-page">🌲 自己クロ連携</a>
        <a href="/sms-kraken" className="side-link">📱 SMS (Kraken)</a>
        <a href="/email-template" className="side-link">✨ メールテンプレート</a>
        
        <div className="side-link" style={{ opacity: 0.5, cursor: "not-allowed", background: "transparent", border: "1px dashed #cbd5e1" }}>
          🔒 新ツール（開発中...）
        </div>
      </div>

      <div className="glass-nav">
        <a href="/" className="glass-nav-link">← 司令室に戻る</a>
        <div className="glass-nav-active">🌲 自己クロ連携</div>
      </div>

      <div className="glass-panel">
        <textarea className="paste-area" placeholder="CallTreeのデータを貼り付け、または自動受信を待機..." value={rawText} onChange={(e) => setRawText(e.target.value)} />
        <button className="btn-parse" onClick={() => doParse(rawText)}>✨ 一発自動入力（パース）を実行</button>
      </div>

      <div className="form-grid-2">
        {/* 左カラム：基本情報 */}
        <div className="glass-panel">
          <div className="section-title">👤 基本情報</div>
          <div className="input-group"><label>リスト名</label><input className="input-control" id="colList" value={form.colList} onChange={handleChange} /></div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="input-group"><label>姓</label><input className="input-control" id="colSei" value={form.colSei} onChange={handleChange} onCompositionStart={() => baseKana.current = form.colSeiKana} onCompositionUpdate={(e: any) => handleKanaUpdate(e, "colSeiKana")} onCompositionEnd={() => baseKana.current = form.colSeiKana} /></div>
            <div className="input-group"><label>名</label><input className="input-control" id="colMei" value={form.colMei} onChange={handleChange} onCompositionStart={() => baseKana.current = form.colMeiKana} onCompositionUpdate={(e: any) => handleKanaUpdate(e, "colMeiKana")} onCompositionEnd={() => baseKana.current = form.colMeiKana} /></div>
            <div className="input-group"><label>姓カナ</label><input className="input-control" id="colSeiKana" value={form.colSeiKana} onChange={handleChange} /></div>
            <div className="input-group"><label>名カナ</label><input className="input-control" id="colMeiKana" value={form.colMeiKana} onChange={handleChange} /></div>
          </div>

          <div className="input-group">
            <label>生年月日</label>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "10px" }}>
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

          <div className="input-group"><label>新居先（自動結合）</label><textarea className="input-control" id="colNewAddress" rows={2} value={form.colNewAddress} onChange={handleChange} style={{resize: 'none'}} /></div>
          <div className="input-group"><label>現住所</label><textarea className="input-control" id="colCurrentAddress" rows={2} value={form.colCurrentAddress} onChange={handleChange} style={{resize: 'none'}} /></div>
          <div className="input-group"><label>携帯番号</label><input className="input-control" id="colPhone" value={form.colPhone} onChange={handleChange} /></div>
          <div className="input-group"><label>Email</label><input className={`input-control ${emailError ? "email-error" : ""}`} type="email" id="colEmail" placeholder="abc@example.com" value={form.colEmail} onChange={handleChange} /></div>
        </div>

        {/* 右カラム：クロージング詳細 */}
        <div className="glass-panel">
          <div className="section-title">⚡ クロージング詳細</div>
          
          <div className="sub-title">注意事項・共有事項</div>
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
          <div className="input-group">
            <label>意思取り方法</label>
            <div className="tag-container">
              <button className="tag-btn" onClick={() => addPhrase("物件設備で利用でOK！")}>➕ 物件設備</button>
              <button className="tag-btn" onClick={() => addPhrase("携帯とセットでOK！")}>➕ セット割</button>
              <button className="tag-btn" onClick={() => addPhrase("半年間無料お試しでOK!")}>➕ 半年間無料</button>
              <button className="tag-btn" onClick={() => addPhrase("めちゃ得割")}>➕ めちゃ得割</button>
            </div>
            <input className="input-control" type="text" id="colIntention" value={form.colIntention} onChange={handleChange} />
          </div>

          <div className="sub-title">商材・担当者</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
          </div>
          <div className="input-group">
            <label>名義人性別</label>
            <div className="radio-group">
              <label><input type="radio" name="gender" value="男" checked={form.gender === "男"} onChange={handleChange} /> 男</label>
              <label><input type="radio" name="gender" value="女" checked={form.gender === "女"} onChange={handleChange} /> 女</label>
            </div>
          </div>

          <div className="sub-title">工事・設備情報</div>
          <div className="input-group"><label>引越日</label><input className="input-control" id="colMoveDate" value={form.colMoveDate} onChange={handleChange} /></div>
          <div className="input-group">
            <label>書類発送先</label>
            <div className="radio-group">
              <label><input type="radio" name="docSend" value="新住所" checked={form.docSend === "新住所"} onChange={handleChange} /> 新住所</label>
              <label><input type="radio" name="docSend" value="現住所" checked={form.docSend === "現住所"} onChange={handleChange} /> 現住所</label>
            </div>
          </div>
          <div className="input-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <label style={{margin: 0}}>工事希望日</label>
              <label style={{ fontSize: "11px", color: "#65a30d", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", margin: 0 }}>
                <input type="checkbox" id="sameAsMove" checked={sameAsMove} onChange={handleSyncKoji} style={{accentColor: '#84cc16', width: '15px', height: '15px'}} /> 引越日と同じにする
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
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
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
              <label style={{ fontSize: "11px", cursor: "pointer", color: "#65a30d", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                <input type="checkbox" id="cbHalfYearFree" checked={form.cbHalfYearFree} onChange={handleChange} style={{accentColor: '#84cc16', width: '15px', height: '15px'}} /> 半年間無料分
              </label>
            </div>
            <input className="input-control" type="number" id="colCB" placeholder="例：10000" disabled={form.cbHalfYearFree} value={form.colCB} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* 👀 プレビューエリア（落ち着いたダークグレー） */}
      <div className="glass-panel" style={{ background: "rgba(30, 41, 59, 0.95)", border: "none" }}>
        <div className="section-title" style={{ color: "#bef264", borderLeftColor: "#bef264" }}>{`> SYSTEM.PREVIEW // コピー内容`}</div>
        <textarea className="preview-area" value={preview} readOnly />
      </div>

      {/* 🛠️ フッター操作（ダークグラス） */}
      <div className="footer-bar">
        <button className="btn-footer btn-clear" onClick={clearAll}>🗑️ リセット</button>
        <button className="btn-footer btn-copy" onClick={copyTemplate}>📋 この内容でFMTをコピー</button>
      </div>

      {/* 🍞 通知 */}
      <div id="toast" className={`${toast.show ? "show" : ""} ${toast.isError ? "error" : ""}`}>{toast.msg}</div>
    </div>
  );
}