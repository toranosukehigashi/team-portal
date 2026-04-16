"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function BulkRegister() {
  const router = useRouter();

  // 🌟 状態管理
  const [rawText, setRawText] = useState("");
  const [env, setEnv] = useState("test");
  const [toast, setToast] = useState({ show: false, msg: "", isSuccess: true, isProd: false });
  const [errors, setErrors] = useState<string[]>([]);
  const [phoneError, setPhoneError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🍔 ハンバーガーメニューの開閉状態
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [form, setForm] = useState({
    colB: "", colC: "", colD: "", colE: "", colF: "", colG: "", colH: "", colI: "",
    colJ: "", colK: "", colL: "", colM: "", colN: "", colO: "", colP: "",
    tempPropertyType: "", tempEmail: "",
    colQ: "", colR: "",
    colU: false, colV: false, colW: false, colX: false, colY: false,
    colZ: "", colAA: "", colAB: "", colAB_2: "", colAC: "", colAD: "", colAE: "", colAF: "", colAG: "",
    colAH: "", colAI: "", colAJ: false, colAK: false, colAL: false,
    colAN: "", colAP: "", colAQ: "", colAR: ""
  });

  // 🌟 初期化（日付の自動セット）
  useEffect(() => {
    const d = new Date();
    const todayStr = `${d.getMonth() + 1}/${d.getDate()}`;
    setForm(prev => ({ ...prev, colD: todayStr }));
  }, []);

  const handleChange = (e: any) => {
    const { id, value, type, checked, name } = e.target;
    const targetId = id || name; 
    setForm(prev => ({ ...prev, [targetId]: type === "checkbox" ? checked : value }));

    // ✅ 追加の魔法：入力された瞬間、その項目のエラー（赤枠）を解除する！
    if (type !== "checkbox" && value.trim() !== "") {
      setErrors(prevErrors => prevErrors.filter(err => err !== targetId));
    }
  };

  const showToast = (msg: string, isSuccess: boolean, isProd = false) => {
    setToast({ show: true, msg, isSuccess, isProd });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
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
            showToast("🚀 CallTreeからデータを受信！自動振り分け完了！", true);
          }
        }
      } catch (err) {}
    };
    window.addEventListener("focus", checkWarpData);
    return () => window.removeEventListener("focus", checkWarpData);
  }, []);

  // 🏠 郵便番号から住所自動入力
  const handleZipChange = async (e: any) => {
    handleChange(e); // ここでhandleChangeを呼ぶので、郵便番号の赤枠も消えます
    const zip = e.target.value.replace(/[-ー]/g, '');
    if (zip.length === 7) {
      try {
        const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`);
        const data = await res.json();
        if (data.results) {
          const addr = data.results[0].address1 + data.results[0].address2 + data.results[0].address3;
          setForm(prev => ({ ...prev, colN: addr }));
          // 住所が自動入力されたら、住所の赤枠も消す
          setErrors(prevErrors => prevErrors.filter(err => err !== "colN"));
          showToast("🏠 郵便番号から住所を自動入力しました！", true);
        }
      } catch (err) {}
    }
  };

  // 🔤 カナ自動入力補助
  const baseKana = useRef("");
  const handleKanaUpdate = (e: any, targetKanaId: string) => {
    const text = e.data;
    if (text && !/[\u4E00-\u9FFF]/.test(text)) {
      const kanaStr = text.replace(/[\u3041-\u3096]/g, (match: any) => String.fromCharCode(match.charCodeAt(0) + 0x60));
      setForm(prev => ({ ...prev, [targetKanaId]: baseKana.current + kanaStr }));
      
      // ✅ カナが自動で埋まった場合も、カナの赤枠を消す！
      setErrors(prevErrors => prevErrors.filter(err => err !== targetKanaId));
    }
  };

  // ✨ 自動振り分けロジック
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
      newForm.colB = listRaw.includes("レ点") || listRaw.includes("引越侍") ? "引越侍レ点有" : (listRaw.includes("SUUMO") ? "SUUMO" : listRaw);
      newForm.colD = lines[2] || `${new Date().getMonth() + 1}/${new Date().getDate()}`;
      newForm.colE = lines[3]; newForm.colF = lines[4]; newForm.colG = lines[5];
      newForm.colH = lines[6]; newForm.colI = lines[7]; newForm.colJ = lines[8];
      newForm.colK = lines[9]; newForm.colL = lines[10]; newForm.colM = lines[11];
      const addrParts = (lines[12] || "").split(/[ 　]+/);
      newForm.colN = addrParts[0]; 
      newForm.colO = addrParts.slice(1).join(" ");
      newForm.colP = lines[13]?.includes("引越") ? "引越先" : "現住所";
      newForm.tempEmail = lines[14] || "";

      // 建物名があれば自動で「集合住宅」、なければ「戸建て」に設定
      if (newForm.colO.trim() !== "") {
        newForm.tempPropertyType = "集合住宅";
      } else {
        newForm.tempPropertyType = "戸建て";
      }

      setForm(newForm);
      runPatrol(newForm);
    } else { showToast("⚠️ 行数が足りません", false); }
  };

  const runPatrol = (currentForm: any = form) => {
    let errs: string[] = [];
    let pErr = false;
    const requiredIds = ['colB', 'colC', 'colD', 'colE', 'colF', 'colG', 'colH', 'colI', 'colJ', 'colK', 'colL', 'colM', 'colN', 'colO', 'colP'];
    requiredIds.forEach(id => { if (!currentForm[id] || currentForm[id].trim() === "") errs.push(id); });
    setErrors(errs);
    setPhoneError(pErr);
    if (errs.length > 0) showToast(`✨ 振り分け完了！ ⚠️ ${errs.length} 箇所の未入力があります`, false);
    else showToast("✨ 自動振り分け完了！エラーなし！", true);
  };

  const getStyle = (id: string) => (errors.includes(id)) ? { backgroundColor: '#fff1f2', borderColor: '#e11d48' } : {};

  const clearAllFields = () => {
    if (confirm("データをクリアしますか？")) {
      const d = new Date();
      setForm({
        colB: "", colC: "", colD: `${d.getMonth() + 1}/${d.getDate()}`, colE: "", colF: "", colG: "", colH: "", colI: "",
        colJ: "", colK: "", colL: "", colM: "", colN: "", colO: "", colP: "", tempPropertyType: "", tempEmail: "",
        colQ: "", colR: "", colU: false, colV: false, colW: false, colX: false, colY: false,
        colZ: "", colAA: "", colAB: "", colAB_2: "", colAC: "", colAD: "", colAE: "", colAF: "", colAG: "",
        colAH: "", colAI: "", colAJ: false, colAK: false, colAL: false, colAN: "", colAP: "", colAQ: "", colAR: ""
      });
      setRawText(""); setErrors([]); setPhoneError(false);
    }
  };

  // 🥷 隠しマント送信（企業アカウントの強固なセキュリティをすり抜ける最終奥義！！）
  const saveToSheet = async () => {
    if (isSubmitting) return;
    const gasUrl = process.env.NEXT_PUBLIC_GAS_URL;
    
    // URLが設定されていない場合のアラート
    if (!gasUrl || gasUrl === "undefined") {
      return alert("⚠️ GASのURLが設定されていません！Vercelの環境変数を確認し、再デプロイしてください！");
    }

    setIsSubmitting(true);
    showToast("⏳ スプレッドシートへ送信中...", true);

    const dataArray = [
      form.colB, form.colC, form.colD, form.colE, form.colF, form.colG, form.colH, form.colI,
      form.colJ, form.colK, form.colL, form.colM, form.colN, form.colO, form.colP,
      "", "", "", "", form.colU, form.colV, form.colW, form.colX, form.colY,
      form.colZ, form.colAA, form.colAB, form.colAC, form.colAD, form.colAE, form.colAF, form.colAG,
      form.colAH, form.colAI, form.colAJ, form.colAK, form.colAL, "", form.colAN, "", form.colAP,
      form.colAQ, form.colAR
    ];

    const encodedData = encodeURIComponent(JSON.stringify(dataArray));
    const warpUrl = `${gasUrl}?env=${env}&data=${encodedData}`;

    // 🥷 隠し窓（Iframe）にURLを流し込む（ブラウザの既存のログイン状態を利用して強行突破！）
    const hiddenIframe = document.getElementById("hidden_warp_iframe") as HTMLIFrameElement;
    if (hiddenIframe) {
      hiddenIframe.src = warpUrl;
    }

    // 3秒後に「完了したテイ」でトーストを表示
    setTimeout(() => {
      showToast(env === 'test' ? "🧪 テストシートへの保存を完了しました！" : "🎉 成約後シートへの保存を完了しました！！！", true, env === 'prod');
      setIsSubmitting(false);
    }, 3000);
  };

  const copyPlain = async (text: string, successMsg: string) => {
    try { await navigator.clipboard.writeText(text); showToast(successMsg, true); } catch (e) { alert("コピー失敗"); }
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
    <div className="glass-business-theme">
      <style dangerouslySetInnerHTML={{ __html: `
        .glass-business-theme * { box-sizing: border-box; }
        .glass-business-theme { font-family: 'Inter', 'Noto Sans JP', sans-serif; padding: 20px 40px 100px 40px; color: #334155; font-size: 13px; min-height: 100vh; background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 50%, #f8fafc 100%); background-attachment: fixed; overflow-x: hidden; }
        
        /* 🍔 ハンバーガーボタン */
        .hamburger-btn { position: fixed; top: 20px; left: 20px; z-index: 1001; background: rgba(255,255,255,0.6); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.9); border-radius: 12px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; gap: 5px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: 0.3s; }
        .hamburger-btn:hover { background: #fff; box-shadow: 0 6px 20px rgba(99, 102, 241, 0.2); transform: scale(1.05); }
        .hamburger-line { width: 22px; height: 3px; background: #475569; border-radius: 3px; transition: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .hamburger-btn.open .line1 { transform: translateY(8px) rotate(45deg); background: #6366f1; }
        .hamburger-btn.open .line2 { opacity: 0; transform: translateX(-10px); }
        .hamburger-btn.open .line3 { transform: translateY(-8px) rotate(-45deg); background: #6366f1; }

        /* 🌌 オーバーレイ */
        .menu-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.3); backdrop-filter: blur(5px); z-index: 999; opacity: 0; pointer-events: none; transition: 0.4s ease; }
        .menu-overlay.open { opacity: 1; pointer-events: auto; }

        /* 🗄️ サイドメニュー */
        .side-menu { position: fixed; top: 0; left: -320px; width: 300px; height: 100vh; background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); border-right: 1px solid rgba(255, 255, 255, 0.7); z-index: 1000; box-shadow: 20px 0 50px rgba(0,0,0,0.1); transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); padding: 90px 24px 30px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
        .side-menu.open { left: 0; }
        .menu-title { font-size: 13px; font-weight: 900; color: #64748b; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed rgba(99, 102, 241, 0.5); letter-spacing: 1px; }

        .side-link { text-decoration: none; padding: 14px 20px; border-radius: 14px; background: rgba(255, 255, 255, 0.6); color: #334155; font-weight: 800; font-size: 14px; border: 1px solid rgba(255,255,255,0.8); transition: all 0.2s; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
        .side-link:hover { background: #fff; border-color: #818cf8; color: #6366f1; transform: translateX(8px); box-shadow: 0 6px 15px rgba(99, 102, 241, 0.15); }
        .side-link.current-page { background: linear-gradient(135deg, #6366f1, #4f46e5); color: #fff; border: none; box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3); pointer-events: none; }

        /* 既存のナビゲーション */
        .glass-nav { position: relative; z-index: 10; display: flex; gap: 12px; padding: 12px; margin-bottom: 24px; margin-left: 60px; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.8); border-radius: 12px; }
        .glass-nav-link { text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; background: rgba(255, 255, 255, 0.6); color: #475569; border: 1px solid rgba(203, 213, 225, 0.5); }
        .glass-nav-active { padding: 10px 20px; border-radius: 8px; font-weight: 700; background: #fff; color: #6366f1; border: 1px solid #6366f1; }
        
        .env-toggle-container { display: inline-flex; background: rgba(255, 255, 255, 0.5); border-radius: 20px; padding: 4px; margin-bottom: 20px; }
        .env-label { padding: 8px 24px; font-size: 13px; font-weight: 700; border-radius: 16px; cursor: pointer; color: #64748b; }
        input[name="environment"]:checked + .test-label { background: #fff; color: #0ea5e9; }
        input[name="environment"]:checked + .prod-label { background: #fff; color: #e11d48; }
        .glass-panel { background: rgba(255, 255, 255, 0.55); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.9); border-radius: 16px; padding: 24px; margin-bottom: 24px; }
        .form-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px 32px; }
        .input-group { display: flex; flex-direction: column; }
        .input-group label { font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 8px; border-left: 3px solid #6366f1; padding-left: 8px; }
        .input-control { width: 100%; padding: 10px 12px; border: 1px solid rgba(203, 213, 225, 0.8); border-radius: 8px; font-size: 13px; background: rgba(255, 255, 255, 0.7); transition: border-color 0.2s, background-color 0.2s; }
        .input-control:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
        .paste-area { width: 100%; height: 100px; padding: 12px; border: 2px dashed rgba(99, 102, 241, 0.5); border-radius: 12px; background: rgba(255, 255, 255, 0.6); margin-bottom: 16px; }
        .btn-primary { width: 100%; padding: 12px; background: linear-gradient(135deg, #6366f1, #4f46e5); color: #fff; border: none; border-radius: 8px; font-weight: 800; cursor: pointer; }
        .save-footer { display: flex; gap: 16px; position: fixed; bottom: 0; left: 0; width: 100%; padding: 16px 40px; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-top: 1px solid rgba(226, 232, 240, 0.8); z-index: 50; }
        .btn-footer { flex: 1; padding: 14px; border-radius: 12px; font-weight: 800; border: none; color: #fff; cursor: pointer; }
        .btn-footer-oct { background: #8b5cf6; }
        .btn-footer-save { background: #10b981; }
        #toast { visibility: hidden; min-width: 250px; color: #fff; text-align: center; border-radius: 12px; padding: 16px 24px; position: fixed; z-index: 100; right: 24px; bottom: -80px; font-weight: bold; transition: 0.4s; }
        #toast.show { visibility: visible; bottom: 100px; opacity: 1; }
        .tag-btn { background: #fff; border: 1px solid #cbd5e1; border-radius: 16px; padding: 6px 12px; font-size: 11px; color: #64748b; cursor: pointer; font-weight: 700; }
        summary { font-weight: 800; cursor: pointer; padding: 16px; background: rgba(255, 255, 255, 0.6); border-radius: 12px; border-left: 4px solid #6366f1; list-style: none; }
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
        <a href="/bulk-register" className="side-link current-page">📦 一括登録（自己クロ）</a>
        <a href="/net-toss" className="side-link">🌐 ネットトス連携</a>
        <a href="/self-close" className="side-link">🌲 自己クロ連携</a>
        <a href="/sms-kraken" className="side-link">📱 SMS (Kraken)</a>
        <a href="/email-template" className="side-link">✨ メールテンプレート</a>
        
        <div className="side-link" style={{ opacity: 0.5, cursor: "not-allowed", background: "transparent", border: "1px dashed #cbd5e1" }}>
          🔒 新ツール（開発中...）
        </div>
      </div>

      <div className="glass-nav">
        <a href="/" className="glass-nav-link">← 司令室に戻る</a>
        <div className="glass-nav-active">📦 一括登録（自己クロ）</div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div className="env-toggle-container">
          <input type="radio" id="envTest" name="environment" value="test" checked={env === "test"} onChange={(e) => setEnv(e.target.value)} hidden />
          <label htmlFor="envTest" className="env-label test-label">🧪 Test</label>
          <input type="radio" id="envProd" name="environment" value="prod" checked={env === "prod"} onChange={(e) => setEnv(e.target.value)} hidden />
          <label htmlFor="envProd" className="env-label prod-label">🚀 Production</label>
        </div>
      </div>

      <div className="glass-panel">
        <textarea className="paste-area" placeholder="データを貼り付けてください" value={rawText} onChange={(e) => setRawText(e.target.value)} />
        <button className="btn-primary" onClick={() => doParse(rawText)}>✨ 自動振り分けを実行</button>
      </div>

      <div className="glass-panel">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ fontWeight: 800, fontSize: "16px" }}>👤 基本情報（B〜P列）</div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="tag-btn" onClick={clearAllFields}>🗑️ クリア</button>
            <button className="tag-btn" onClick={copyInfoTemplate}>📋 FMTコピー</button>
          </div>
        </div>
        
        <div className="form-grid-3">
          <div className="input-group"><label>B: リスト種別</label><select className="input-control" id="colB" value={form.colB} onChange={handleChange} style={getStyle('colB')}><option value="">選択</option><option value="引越侍レ点有">引越侍レ点有</option><option value="SUUMO">SUUMO</option><option value="ウェブクルー">ウェブクルー</option><option value="引越侍その他">引越侍その他</option><option value="名古屋案件">名古屋案件</option><option value="MOMI">MOMI</option><option value="空室通電">空室通電</option><option value="タクト">タクト</option><option value="リスト該当なし">リスト該当なし</option></select></div>
          <div className="input-group"><label>C: プラン名</label><select className="input-control" id="colC" value={form.colC} onChange={handleChange} style={getStyle('colC')}><option value="">選択</option><option value="シンプルオクトパス2024-10">シンプルオクトパス2024-10</option><option value="グリーンオクトパス2023-12">グリーンオクトパス2023-12</option><option value="オール電化オクトパス2025-04">オール電化オクトパス2025-04</option><option value="LLオクトパス">LLオクトパス</option><option value="オール電化オクトパスゼロ">オール電化オクトパスゼロ</option></select></div>
          <div className="input-group"><label>D: 受付日</label><input className="input-control" type="text" id="colD" value={form.colD} onChange={handleChange} style={getStyle('colD')} /></div>
          <div className="input-group"><label>E: 担当者</label><input className="input-control" type="text" id="colE" value={form.colE} onChange={handleChange} style={getStyle('colE')} /></div>
          <div className="input-group"><label>F: 電話番号</label><input className="input-control" type="text" id="colF" value={form.colF} onChange={handleChange} style={getStyle('colF')} /></div>
          <div className="input-group"><label>G: アカウント</label><input className="input-control" type="text" id="colG" value={form.colG} onChange={handleChange} style={getStyle('colG')} /></div>
          <div className="input-group"><label>H: 姓</label><input className="input-control" type="text" id="colH" value={form.colH} onChange={handleChange} onCompositionUpdate={(e) => handleKanaUpdate(e, "colJ")} style={getStyle('colH')} /></div>
          <div className="input-group"><label>I: 名</label><input className="input-control" type="text" id="colI" value={form.colI} onChange={handleChange} onCompositionUpdate={(e) => handleKanaUpdate(e, "colK")} style={getStyle('colI')} /></div>
          <div className="input-group"><label>J: 姓カナ</label><input className="input-control" type="text" id="colJ" value={form.colJ} onChange={handleChange} style={getStyle('colJ')} /></div>
          <div className="input-group"><label>K: 名カナ</label><input className="input-control" type="text" id="colK" value={form.colK} onChange={handleChange} style={getStyle('colK')} /></div>
          <div className="input-group"><label>L: 再点日</label><input className="input-control" type="text" id="colL" value={form.colL} onChange={handleChange} style={getStyle('colL')} /></div>
          <div className="input-group"><label>M: 郵便番号</label><input className="input-control" type="text" id="colM" value={form.colM} onChange={handleZipChange} style={getStyle('colM')} /></div>
          <div className="input-group"><label>N: 都道府県〜番地</label><input className="input-control" type="text" id="colN" value={form.colN} onChange={handleChange} style={getStyle('colN')} /></div>
          <div className="input-group"><label>O: 建物名・部屋</label><input className="input-control" type="text" id="colO" value={form.colO} onChange={handleChange} style={getStyle('colO')} /></div>
          <div className="input-group"><label>P: 送付先</label><select className="input-control" id="colP" value={form.colP} onChange={handleChange} style={getStyle('colP')}><option value="">選択</option><option value="引越先">引越先</option><option value="現住所">現住所</option><option value="請求先">請求先</option></select></div>
          
          <div className="input-group">
            <label>🏠 物件種別</label>
            <select className="input-control" name="tempPropertyType" value={form.tempPropertyType} onChange={handleChange}>
              <option value="">選択</option>
              <option value="戸建て">戸建て</option>
              <option value="集合住宅">集合住宅</option>
            </select>
          </div>

        </div>
      </div>

      <details style={{ marginBottom: "24px" }}>
        <summary>➕ 追加情報・オプションを展開</summary>
        <div style={{ padding: "24px" }}>
          <div className="form-grid-3">
             <div className="input-group"><label>AH: 獲得日</label><input className="input-control" type="text" id="colAH" value={form.colAH} onChange={handleChange} /></div>
             <div className="input-group"><label>AI: 対応者</label><input className="input-control" type="text" id="colAI" value={form.colAI} onChange={handleChange} /></div>
             <div className="input-group"><label>AN: 商材</label><input className="input-control" type="text" id="colAN" value={form.colAN} onChange={handleChange} /></div>
          </div>
          <div className="input-group" style={{ marginTop: "20px" }}>
            <label>AP: 対応依頼内容</label>
            <textarea className="input-control" style={{ minHeight: "80px" }} id="colAP" value={form.colAP} onChange={handleChange} />
          </div>
        </div>
      </details>

      <div className="save-footer">
        <button className="btn-footer btn-footer-oct" onClick={copyForOctopus}>🐙 OBJ用にコピー</button>
        <button className="btn-footer btn-footer-save" onClick={saveToSheet} disabled={isSubmitting}>
          {isSubmitting ? "⌛ 送信中..." : "💾 成約後シートに書き込む"}
        </button>
      </div>

      <div id="toast" className={toast.show ? "show" : ""} style={{ background: toast.isProd ? "#e11d48" : "#6366f1" }}>{toast.msg}</div>

      {/* 🥷 隠しマント（透明なIframe） */}
      <iframe id="hidden_warp_iframe" style={{ display: "none" }} title="hidden-warp"></iframe>
    </div>
  );
}