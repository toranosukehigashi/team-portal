"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideMenu from "@/app/components/SideMenu"; // 💡 共通メニューを呼び出し！

// --- 🌊 ノイズ完全ゼロ！深海オーロラ背景 ---
const KrakenAuroraBackground = () => (
  <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: -2, backgroundColor: "var(--app-bg)", overflow: "hidden", transition: "background-color 0.3s ease" }}>
    <div className="kraken-gradient grad-1"></div>
    <div className="kraken-gradient grad-2"></div>
    <div className="kraken-gradient grad-3"></div>
    <style>{`
      .kraken-gradient { position: absolute; border-radius: 50%; animation: floatGrad 25s infinite ease-in-out alternate; pointer-events: none; }
      .grad-1 { width: 80vw; height: 80vw; background: radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(56,189,248,0) 70%); top: -20vw; left: -20vw; animation-delay: 0s; }
      .grad-2 { width: 90vw; height: 90vw; background: radial-gradient(circle, rgba(192,132,252,0.15) 0%, rgba(192,132,252,0) 70%); bottom: -20vw; right: -20vw; animation-delay: -7s; }
      .grad-3 { width: 70vw; height: 70vw; background: radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(14,165,233,0) 70%); top: 20vh; left: 15vw; animation-delay: -12s; }
      @keyframes floatGrad { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(5vw, 5vh) scale(1.1); } }
      .theme-light .grad-1 { background: radial-gradient(circle, rgba(56,189,248,0.3) 0%, rgba(56,189,248,0) 70%); }
      .theme-light .grad-2 { background: radial-gradient(circle, rgba(192,132,252,0.3) 0%, rgba(192,132,252,0) 70%); }
      .theme-light .grad-3 { background: radial-gradient(circle, rgba(14,165,233,0.3) 0%, rgba(14,165,233,0) 70%); }
    `}</style>
  </div>
);

// ==========================================
// 💡 TypeScriptの型定義（権限管理を追加！）
// ==========================================
type StepData = {
  step: number;
  title: string;
  content: string;
  imgUrl: string; 
  aiImgDesc?: string; 
};

type ManualSubTab = {
  id: string;
  label: string;
  steps: StepData[];
};

type ManualTab = {
  id: string;
  label: string;
  steps?: StepData[]; 
  subTabs?: ManualSubTab[];
};

type ManualData = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  badge?: string;
  steps?: StepData[]; 
  tabs?: ManualTab[];
  allowedUsers?: string[]; // 💡 追加：閲覧を許可するユーザーIDのリスト！
};

// ==========================================
// 📚 マニュアルのデータ構造
// ==========================================
const MANUAL_DATA: ManualData[] = [
  {
    id: "dup-email",
    icon: "📧",
    title: "メアド重複対処法",
    desc: "「オール電化2025-04＋オール電化ゼロ」申し込み時やアドレス重複時に便利！",
    steps: [
      { step: 1, title: "アカウント画面開く", content: "クラーケンの「メッセージ送信」から「パスワードリセット」を選択。", imgUrl: "/dup-email-1.png" },
      { step: 2, title: "パスワードリセットURLコピー", content: "本文のURLをCommand＋Cではなく、右クリックでコピー。", imgUrl: "/dup-email-2.png" },
      { step: 3, title: "URLをブラウザで検索", content: "初期パスワードを”名前＋電話番号下４桁”などわかりやすいもので変更。（受付時に事前にお客さんに伝えておくとベスト！）", imgUrl: "/dup-email-3.png"},
    ]
  },
  {
    id: "inv-bh",
    icon: "🛑",
    title: "アカウント無効化（申込取消）",
    desc: "既存アカウントが原因でOBJエラーが起きた時などに有効！",
    steps: [
      { step: 1, title: "アカウントの無効化", content: "名前の下にある「取消にする」ボタンを選択します。", imgUrl: "/mukouka-1.png" },
      { step: 2, title: "メアド未所持設定", content: "「ユーザータブ」の「編集」を押し、「お客様がメールアドレスを持っていない」にチェック押す。（警告が出るけど無視して進んでOK!）", imgUrl: "/mukouka-2.png"},
    ]
  },
  {
    id: "plan-cancel",
    icon: "🔄",
    title: "プラン変更",
    desc: "お客様からのプラン変更依頼の処理手順です。",
    steps: [
      { step: 1, title: "契約状況確認", content: "顧客画面から契約タブを選択する。", imgUrl: "/p.henkou-1.png"},
      { step: 2, title: "現電気料金メニュー確認", content: "電気料金メニューにある「料金メニュー変更」を押す。", imgUrl: "/p.henkou-2.png"},
      { step: 3, title: "商材の変更", content: "Productの上にある「全商品を含む」を押す。", imgUrl: "/p.henkou-3.png"},
      { step: 4, title: "変更プラン選択", content: "Product から変更するプランを選ぶ。", imgUrl: "/p.henkou-4.png"},
    ]
  },
  {
    id: "re-ignition",
    icon: "🔥",
    title: "直近再点",
    desc: "当日再点や、明日再点など直近の申込を受け付ける時、「契約中」のSPINだと申し込みできません🐵\nしかし、ステータスが「契約中」なだけで「廃止の申込」がされている地点かもしれません。\nそのため、SPINから「廃止受付年月日」を調べます💡",
    steps: [
      { step: 1, title: "設備情報取得", content: "SPINを調べて設備情報取得で検索する", imgUrl: "/re-ignition1.png"},
      { step: 2, title: "「異動申込受付年月日」確認", content: "「idoMoshikomiUketsukes」までスクロールし、「異動申込受付年月日」に書かれてる日付に再点日を合わせてOBJ。\n「前の契約がなくなるのが〇月〇日なので、翌日から料金発生開始となります。」と伝える。", imgUrl: "/re-ignition1.png" }
    ]
  },
  {
    id: "inv-address",
    icon: "❌",
    title: "無効なアドレス対処法",
    badge: "極秘", 
    desc: "OBJでメアドエラーになったときの対処法です。この方法はOBJ時点では違うアドレスで一旦登録してしまうので自己責任でw",
    allowedUsers: ["admin_higashi", "master_user"], 
    tabs: [
      {
        id: "has-other",
        label: "✅ 既存アカウントあり",
        steps: [
          { step: 1, title: "既存アカウント確認", content: "既存アカウントを開いて、右上の「アカウントのアクション」から「既存アカウントとの紐付け」を押す。", imgUrl: "/has-other1.png" },
          { step: 2, title: "アカウント紐付け", content: "アカウント番号のところに新規アカウントのA番号を入力する（既存のメアドが新規アカウントに紐付けされる）", imgUrl: "/has-other2.png" },
          { step: 3, title: "メール送信", content: "「イベントタブ」から「ご契約内容のメール」を再送してあげる\n※もし、紐付けされていなければ、新規アカウントの「ユーザータブ」の「編集」から正しいメールアドレスに変更\nできなければ、ブラックホールされてるUから始まるアカウントがあるかもしれない。", imgUrl: "/has-other3.png" },
        ]
      },
      {
        id: "no-other",
        label: "❌ 既存アカウントなし（ストレージ容量なし等）",
        steps: [
          { step: 1, title: "架空アドレスの生成", content: "「ユーザータブ」の編集から正しいメールアドレスに変更。(（存在しないアドレスに変更できることを確認済のため何でも入力可能）\n「イベントタブ」から「ご契約内容のメール」を再送してあげる。)", imgUrl: "/no-other1.png" },
        ]
      }
    ]
  },
  {
    id: "addr-spin",
    icon: "📍",
    title: "住所変更＆SPIN入力",
    desc: "供給先住所の変更と、SPIN（供給地点特定番号）の入力手順です。\nお客様の状況（SPINの有無）に合わせてタブを選択してください。",
    tabs: [
      {
        id: "with-spin",
        label: "✅ SPINありの場合",
        subTabs: [
          {
            id: "minor",
            label: "🔹 軽微な修正",
            steps: [
              { step: 1, title: "顧客情報の確認", content: "「プロパティタブ」の「使用場所情報」を押し、「🔧」の「設備情報を編集」を押す", imgUrl: "/with-spin1.png" },
              { step: 2, title: "システムの入力欄へ", content: "「address」「building name」「郵便番号」を編集し「保存」押して終了。", imgUrl: "/with-spin2.png" }
            ]
          },
          {
            id: "major",
            label: "⚠️ 大幅な変更",
            steps: [
              { step: 1, title: "顧客情報の確認", content: "「プロパティタブ」の「使用場所情報」を押し、「🔧」の「設備情報を編集」を押す", imgUrl: "/with-spin1.png" },
              { step: 2, title: "システムの入力欄へ", content: "「address」「building name」「郵便番号」を編集し「保存」押して終了。", imgUrl: "/with-spin2.png" },
              { step: 3, title: "※大幅な住所変更の場合は以下作業も追加で必ず行ってください！（番地入力ミスでなく部屋番号ごと違うとか）", content: "「詳細タブ」の「申請」の「🔧」から「電気再点の作成」を押す。", imgUrl: "/with-spin3.png" },
              { step: 4, title: "変更・修正", content: "正しい「供給地点特定番号」と「Product」を入力。（状況に応じて「接続供給開始年月日」まで）", imgUrl: "/with-spin4.png" }
            ]
          }
        ]
      },
      {
        id: "no-spin",
        label: "❌ SPINなしの場合",
        steps: [
          { step: 1, title: "顧客情報の確認", content: "「詳細タブ」の「申請」の「ID」を押す。", imgUrl: "/no-spin1.png" },
          { step: 2, title: "再点申し込み ユーザー提供の詳細", content: "「再点処理」の「🔧」を押し、「供給地点特定番号を入力する」を押す", imgUrl: "/no-spin2.png" },
          { step: 3, title: "変更・修正", content: "変更したい項目を入力。（SPIN入力もここから一応できます！）", imgUrl: "/no-spin3.png" }
        ]
      }
    ]
  }
];

export default function ProcedureWizard() {
  const router = useRouter();

  // 💡 【重要】現在のログインユーザーID
  const CURRENT_USER_ID = "admin_higashi"; 

  // 💡 ユーザーの権限に合わせてマニュアルを絞り込む
  const visibleManuals = MANUAL_DATA.filter(manual => {
    if (!manual.allowedUsers) return true;
    return manual.allowedUsers.includes(CURRENT_USER_ID); 
  });

  const [isReady, setIsReady] = useState(false);
  const [activeManualId, setActiveManualId] = useState(visibleManuals[0]?.id || "");
  const [expandedSteps, setExpandedSteps] = useState<number[]>([1]); 
  
  const [activeTabId, setActiveTabId] = useState<string>("");
  const [activeSubTabId, setActiveSubTabId] = useState<string>(""); 

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  const activeManual = MANUAL_DATA.find(m => m.id === activeManualId) || visibleManuals[0];

  useEffect(() => {
    if (activeManual?.tabs && activeManual.tabs.length > 0) {
      const firstTab = activeManual.tabs[0];
      setActiveTabId(firstTab.id);
      if(firstTab.subTabs && firstTab.subTabs.length > 0) {
        setActiveSubTabId(firstTab.subTabs[0].id);
      } else {
        setActiveSubTabId("");
      }
    } else {
      setActiveTabId("");
      setActiveSubTabId("");
    }
    setExpandedSteps([1]);
  }, [activeManualId, activeManual]);

  const currentTab = activeManual?.tabs?.find(t => t.id === activeTabId);
  const currentSteps = currentTab?.subTabs
    ? currentTab.subTabs.find(st => st.id === activeSubTabId)?.steps || []
    : currentTab?.steps || activeManual?.steps || [];

  useEffect(() => {
    setIsReady(true);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    
    const timeoutId = setTimeout(() => {
      document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [activeManualId, activeTabId, activeSubTabId]);

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps(prev => 
      prev.includes(stepNumber) ? prev.filter(s => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    showToast(!isDarkMode ? "🌙 ダークモードに切り替えました" : "☀️ ライトモードに切り替えました", "info");
  };

  const showToast = (msg: string, type: "success" | "info" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  };

  if (!activeManual) return <div style={{color: "white", padding: "50px"}}>表示できるマニュアルがありません。</div>;

  return (
    <div className={`procedure-wrapper ${isDarkMode ? "theme-dark" : "theme-light"}`} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", color: "var(--text-main)", zIndex: 9999, overflowX: "hidden", overflowY: "auto", margin: 0, padding: 0, fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}>
      <KrakenAuroraBackground />
      
      <style dangerouslySetInnerHTML={{ __html: `
        .procedure-wrapper * { box-sizing: border-box; }

        .theme-light {
          --app-bg: #f0f9ff;
          --text-main: #0f172a;
          --text-sub: #334155;
          --card-bg: rgba(255, 255, 255, 0.7);
          --card-border: rgba(255, 255, 255, 1);
          --card-hover-border: #38bdf8;
          --card-hover-bg: rgba(255, 255, 255, 0.95);
          --card-shadow: 0 10px 30px rgba(2, 132, 199, 0.05);
          --title-color: #0284c7; 
          --accent-color: #0ea5e9; 
          --input-bg: rgba(255, 255, 255, 0.9);
          --accordion-text-bg: rgba(2, 132, 199, 0.05);
          --toast-bg: #ffffff;
        }
        
        .theme-dark {
          --app-bg: #020617;
          --text-main: #f8fafc;
          --text-sub: #94a3b8;
          --card-bg: rgba(15, 23, 42, 0.65);
          --card-border: rgba(255, 255, 255, 0.1);
          --card-hover-border: #38bdf8;
          --card-hover-bg: rgba(30, 41, 59, 0.85);
          --card-shadow: 0 20px 50px rgba(0,0,0,0.8);
          --title-color: #38bdf8; 
          --accent-color: #38bdf8;
          --input-bg: rgba(0, 0, 0, 0.4);
          --accordion-text-bg: rgba(0, 0, 0, 0.3);
          --toast-bg: rgba(30, 41, 59, 0.85);
        }

        .app-wrapper { padding: 20px 40px 100px 40px; position: relative; z-index: 10; opacity: 0; transition: opacity 0.8s ease; max-width: 1400px; margin: 0 auto; }
        .app-wrapper.ready { opacity: 1; }

        .glass-nav-wrapper { display: flex; justify-content: center; margin-bottom: 40px; margin-top: 10px; }
        .glass-nav { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: var(--card-bg); backdrop-filter: blur(16px); border: 1px solid var(--card-border); border-radius: 50px; box-shadow: var(--card-shadow); max-width: 800px; width: 100%; }
        
        .nav-left { display: flex; gap: 12px; align-items: center; }
        .glass-nav-link { text-decoration: none; padding: 10px 20px; border-radius: 30px; font-weight: 800; background: var(--input-bg); color: var(--text-sub); border: 1px solid var(--card-border); transition: 0.2s; font-size: 14px; }
        .glass-nav-link:hover { color: var(--accent-color); border-color: var(--card-hover-border); }
        .glass-nav-active { padding: 10px 20px; border-radius: 30px; font-weight: 900; background: var(--card-hover-bg); color: var(--accent-color); border: 1px solid var(--card-hover-border); font-size: 14px; }

        .theme-toggle-btn { background: var(--input-bg); border: 1px solid var(--card-border); padding: 10px 20px; border-radius: 30px; cursor: pointer; transition: 0.3s; font-size: 14px; color: var(--text-main); font-weight: 800; }
        .theme-toggle-btn:hover { border-color: var(--card-hover-border); transform: scale(1.05); }

        .layout-grid { display: grid; grid-template-columns: 320px 1fr; gap: 30px; align-items: start; }
        @media (max-width: 950px) { .layout-grid { grid-template-columns: 1fr; } }
        
        /* 💡 カテゴリ一覧のCSSを、絶対に他と被らない独自のクラス名に完全変更しました！ */
        .categories-menu { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 24px; padding: 20px; box-shadow: var(--card-shadow); display: flex; flex-direction: column; gap: 8px; position: sticky; top: 100px; }
        
        .cat-item { padding: 16px 20px; border-radius: 16px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 12px; border: 1px solid transparent; background: var(--input-bg); color: var(--text-main); font-weight: 800; }
        .cat-item:hover { border-color: var(--card-hover-border); transform: translateX(5px); }
        .cat-item.active { background: var(--card-hover-bg); border-color: var(--card-hover-border); color: var(--accent-color); box-shadow: 0 0 20px rgba(56,189,248,0.1); }
        
        .cat-icon { font-size: 20px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.1); border-radius: 10px; }
        .cat-item.active .cat-title { color: var(--accent-color); font-weight: 900; }
        .cat-title { font-weight: 800; font-size: 14px; flex: 1; }
        
        .badge { background: #ef4444; color: #fff; font-size: 9px; padding: 2px 6px; border-radius: 10px; font-weight: 900; letter-spacing: 1px; }

        .content-panel { display: flex; flex-direction: column; gap: 20px; }
        .manual-header { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 24px; padding: 30px; box-shadow: var(--card-shadow); }
        .m-title { font-size: 28px; font-weight: 900; color: var(--title-color); margin: 0 0 10px 0; display: flex; align-items: center; gap: 12px; }
        .m-desc { color: var(--text-sub); font-size: 14px; font-weight: 700; line-height: 1.6; margin: 0; white-space: pre-wrap; }

        .tab-switcher { display: flex; gap: 10px; background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); padding: 8px; border-radius: 16px; box-shadow: var(--card-shadow); margin-bottom: 5px; }
        .tab-btn { flex: 1; padding: 14px; border-radius: 12px; border: none; background: transparent; color: var(--text-sub); font-weight: 900; font-size: 15px; cursor: pointer; transition: 0.3s; display: flex; justify-content: center; align-items: center; gap: 8px; }
        .tab-btn:hover { background: rgba(255,255,255,0.05); color: var(--accent-color); }
        .tab-btn.active { background: var(--accent-color); color: #fff; box-shadow: 0 5px 15px rgba(0,0,0,0.2); pointer-events: none; }

        .sub-tab-switcher { display: flex; gap: 10px; margin-bottom: 15px; background: rgba(0,0,0,0.2); padding: 6px; border-radius: 12px; }
        .theme-light .sub-tab-switcher { background: rgba(0,0,0,0.05); }
        .sub-tab-btn { flex: 1; padding: 10px; border-radius: 8px; border: none; background: transparent; color: var(--text-sub); font-weight: 800; font-size: 13px; cursor: pointer; transition: 0.3s; text-align: center; }
        .sub-tab-btn:hover { color: var(--accent-color); }
        .sub-tab-btn.active { background: var(--card-bg); color: var(--accent-color); box-shadow: 0 2px 10px rgba(0,0,0,0.1); border: 1px solid var(--card-border); pointer-events: none; }

        .accordion-item { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 20px; overflow: hidden; transition: 0.3s; }
        .accordion-item.open { border-color: var(--card-hover-border); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        
        .accordion-header { padding: 20px 30px; display: flex; align-items: center; cursor: pointer; background: transparent; transition: 0.3s; }
        .accordion-header:hover { background: var(--card-hover-bg); }
        .step-badge { background: linear-gradient(135deg, #0ea5e9, #4f46e5); color: #fff; font-size: 12px; font-weight: 900; padding: 6px 12px; border-radius: 12px; margin-right: 15px; letter-spacing: 1px; }
        .accordion-title { font-size: 16px; font-weight: 900; color: var(--text-main); flex: 1; }
        .chevron { font-size: 14px; color: var(--text-sub); transition: 0.3s; }
        .accordion-item.open .chevron { transform: rotate(180deg); color: var(--accent-color); }

        .accordion-body { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .accordion-item.open .accordion-body { max-height: 2000px; } 
        
        .accordion-content { padding: 0 30px 30px 30px; display: flex; flex-direction: column; gap: 20px; }
        .accordion-text { color: var(--text-main); font-size: 14px; font-weight: 700; line-height: 1.8; background: var(--accordion-text-bg); padding: 20px; border-radius: 16px; border-left: 4px solid var(--accent-color); white-space: pre-wrap; }
        
        .actual-image-container { width: 100%; border-radius: 16px; overflow: hidden; border: 1px solid var(--card-border); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .actual-image-container img { width: 100%; height: auto; display: block; }
        
        .image-placeholder { width: 100%; border: 2px dashed var(--card-border); border-radius: 16px; background: var(--accordion-text-bg); display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-sub); font-weight: 800; font-size: 12px; padding: 30px; text-align: center; gap: 10px;}
        .image-placeholder span { display: block; }

        #toast { visibility: hidden; position: fixed; bottom: 40px; right: 40px; background: var(--toast-bg); color: var(--accent-color); border: 1px solid var(--accent-color); padding: 16px 24px; border-radius: 12px; font-weight: 800; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 20000; opacity: 0; transition: 0.4s; backdrop-filter: blur(10px); }
        #toast.show { visibility: visible; opacity: 1; transform: translateY(-10px); }

        .fade-up-element { opacity: 0; transform: translateY(40px); transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .fade-up-element.visible { opacity: 1; transform: translateY(0); }
      `}} />

      {/* 💡 ここに共通化されたメニューコンポーネントをポンと置くだけ！！！ */}
      <SideMenu />

      <main className={`app-wrapper ${isReady ? "ready" : ""}`}>
        
        <div className="glass-nav-wrapper fade-up-element">
          <div className="glass-nav">
            <div className="nav-left">
              <a href="/" className="glass-nav-link">← 司令室に戻る</a>
              <div className="glass-nav-active">🗺️ Kraken 手順辞書</div>
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {isDarkMode ? "🎇 NIGHT" : "☀️ DAY"}
            </button>
          </div>
        </div>

        <div className="layout-grid">
          
          <div className="categories-menu fade-up-element" style={{ transitionDelay: "0.1s" }}>
            <h3 style={{fontSize:"11px", color:"var(--text-sub)", fontWeight:900, letterSpacing:"2px", margin:"0 0 10px 10px"}}>CATEGORIES</h3>
            {visibleManuals.map(manual => (
              <div 
                key={manual.id} 
                /* 💡 クラス名を cat-item に完全変更し、CSS競合を防ぎました！ */
                className={`cat-item ${activeManualId === manual.id ? "active" : ""}`}
                onClick={() => { setActiveManualId(manual.id); setExpandedSteps([1]); }}
              >
                <div className="cat-icon">{manual.icon}</div>
                <div className="cat-title">{manual.title}</div>
                {manual.badge && <span className="badge">{manual.badge}</span>}
              </div>
            ))}
          </div>

          <div className="content-panel">
            <div className="manual-header fade-up-element" style={{ transitionDelay: "0.2s" }}>
              <h2 className="m-title"><span style={{fontSize: "32px"}}>{activeManual.icon}</span> {activeManual.title}</h2>
              <p className="m-desc">{activeManual.desc}</p>
            </div>

            {activeManual.tabs && (
              <div className="tab-switcher fade-up-element" style={{ transitionDelay: "0.25s" }}>
                {activeManual.tabs.map(tab => (
                  <button 
                    key={tab.id}
                    className={`tab-btn ${activeTabId === tab.id ? "active" : ""}`}
                    onClick={() => { 
                      setActiveTabId(tab.id); 
                      if(tab.subTabs && tab.subTabs.length > 0){
                        setActiveSubTabId(tab.subTabs[0].id);
                      } else {
                        setActiveSubTabId("");
                      }
                      setExpandedSteps([1]); 
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {currentTab?.subTabs && (
              <div className="sub-tab-switcher fade-up-element" style={{ transitionDelay: "0.28s" }}>
                {currentTab.subTabs.map(subTab => (
                  <button 
                    key={subTab.id}
                    className={`sub-tab-btn ${activeSubTabId === subTab.id ? "active" : ""}`}
                    onClick={() => { setActiveSubTabId(subTab.id); setExpandedSteps([1]); }}
                  >
                    {subTab.label}
                  </button>
                ))}
              </div>
            )}

            {currentSteps.map((step, index) => {
              const isOpen = expandedSteps.includes(step.step);
              return (
                <div key={step.step} className="fade-up-element" style={{ transitionDelay: `${0.3 + (index * 0.1)}s` }}>
                  <div className={`accordion-item ${isOpen ? "open" : ""}`}>
                    
                    <div className="accordion-header" onClick={() => toggleStep(step.step)}>
                      <div className="step-badge">STEP {step.step}</div>
                      <div className="accordion-title">{step.title}</div>
                      <div className="chevron">▼</div>
                    </div>

                    <div className="accordion-body">
                      <div className="accordion-content">
                        <div className="accordion-text">{step.content}</div>
                        
                        {step.imgUrl ? (
                          <div className="actual-image-container">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={step.imgUrl} alt={step.title} />
                          </div>
                        ) : (
                          <div className="image-placeholder">
                            <span style={{fontSize: "24px"}}>📸</span>
                            <span>ここに画像が入ります！</span>
                            {step.aiImgDesc && <span style={{color: "var(--accent-color)", opacity: 0.8}}>{step.aiImgDesc}</span>}
                            <span style={{fontSize: "10px", opacity: 0.7}}>publicフォルダに画像を保存し、コード内のimgUrlを設定してください</span>
                          </div>
                        )}
                        
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>

      {/* 🍞 通知トースト */}
      <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>
    </div>
  );
}