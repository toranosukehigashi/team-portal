"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

const MASTER_SHEET_ID = "1gXTpTFfp5f5I83P0FVbJbzX-bEsvgLY_DpNl6YDo9-w";
const CALCULATOR_RANGE = "電卓単価マスタ!A2:I";
const GAS_API_URL = "https://script.google.com/a/macros/octopusenergy.co.jp/s/AKfycbxT82SG21OPZUdP2Ix7RG4PYi9qv3KCJNJ81hF3DgFRZATdkp7EpcxpkRBajGJ7RrJBsw/exec";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
};

// 🌟 BentoCard Component
const BentoCard = ({ title, attraction, desc, delay, onClick, children, size = "medium", isAchieved = false }: any) => {
  return (
    <div className={`bento-slot fade-up-element size-${size} ${isAchieved ? 'achieved-glow' : ''}`} style={{ "--delay": `${delay}s` } as React.CSSProperties} onClick={onClick}>
      <div className="bento-card-inner calm-hover glass-morphism">
        <div className="card-content">
          <div className="card-top">
            <span className="attraction-tag">{attraction}</span>
          </div>
          <h2 className="card-title">{title}</h2>
          {desc && <p className="card-desc">{desc}</p>}
          <div className="card-body-content">{children}</div>
        </div>
      </div>
    </div>
  );
};

// 💠 オリジナルSVGアイコン
const CustomIcon = ({ type }: { type: string }) => {
  const paths: Record<string, React.ReactNode> = {
    vault: <path d="M19 11V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V11M5 11C5 9.89543 5.89543 9 7 9H17C18.1046 9 19 9.89543 19 11M5 11L12 6L19 11M12 12V16M9 14H15" />,
    manual: <path d="M4 19.5V5C4 3.89543 4.89543 3 6 3H19V17C19 18.1046 18.1046 19 17 19H6C4.89543 19 4 18.1046 4 17V19.5ZM4 19.5C4 20.3284 4.67157 21 5.5 21H19" />,
    calc: <path d="M19 5V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5ZM9 7H15M9 11H10M14 11H15M9 15H10M14 15H15" />,
    bookmarks: <path d="M5 3H14L19 8V21H5V3ZM14 3V8H19" />,
    memo: <path d="M11 4H4V20H20V13M20.37 4.91L19.09 3.63C18.7 3.24 18.07 3.24 17.68 3.63L9 12.31V15H11.69L20.37 6.32C20.76 5.93 20.76 5.3 20.37 4.91Z" />,
    theme: <path d="M12 3V4M12 20V21M21 12H20M4 12H3M18.36 5.64L17.65 6.35M6.35 17.65L5.64 18.36M18.36 18.36L17.65 17.65M6.35 6.35L5.64 5.64M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8Z" />,
    zip: <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" />
  };
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>;
};

export default function SaaSIntegratedHome() {
  const router = useRouter();
  const dockRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const [userName, setUserName] = useState("Guest");
  const [isReady, setIsReady] = useState(false);
  const [showMacWelcome, setShowMacWelcome] = useState(false);
  const [animDelayOffset, setAnimDelayOffset] = useState(0.2);

  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [cmdKQuery, setCmdKQuery] = useState("");

  const allCmdKLinks = [
    { id: 'affiliate', name: "🔗 アフィリエイトリンクを開く", desc: "各不動産会社のOBJリンク、重説フォームのコピー", url: "/affiliate-links", search: ["リンク", "アフィリエイト", "affiliate", "link", "obj", "不動産", "重説"] },
    { id: 'sim', name: "🆚 料金シミュレーターへ移動", desc: "乗り換え費用、スマホセット割、違約金の計算", url: "/simulator", search: ["sim", "シミュレーター", "料金", "cost", "見積もり", "比較", "乗り換え"] },
    { id: 'toss', name: "🌐 ネットトス連携へ移動", desc: "フレッツ・光コラボ等の回線手配・情報送信", url: "/net-toss", search: ["toss", "トス", "ネット", "net", "フレッツ", "回線", "手配"] },
    { id: 'kraken', name: "🐙 Kraken マニュアルを開く", desc: "SMS送信、テンプレート、手続きの業務手順書", url: "/procedure-wizard", search: ["kraken", "マニュアル", "手順", "manual", "sms"] },
    { id: 'call', name: "🗓️ 再架電タイムラインを開く", desc: "掛け直し、不在、検討中顧客のスケジュール", url: "/callback-board", search: ["コール", "再架電", "タイムライン", "call", "不在", "予定"] },
    { id: 'memo', name: "🍯 クイックメモを開く", desc: "通話中の情報一時退避、テキストコピー", action: () => setActiveDockTool('memo'), search: ["メモ", "memo", "クイック", "一時保存"] },
  ];
  const filteredCmdKLinks = allCmdKLinks.filter(link => cmdKQuery === "" || link.name.toLowerCase().includes(cmdKQuery.toLowerCase()) || link.search.some(keyword => keyword.includes(cmdKQuery.toLowerCase())));

  const [theme, setTheme] = useState<'day' | 'sunset' | 'night'>("night");
  const [activeDockTool, setActiveDockTool] = useState<string | null>(null);
  const [utilInput, setUtilInput] = useState("");
  const [utilResult, setUtilResult] = useState("郵便番号を入力してエリアを検索します。");

  const [copiedHistory, setCopiedHistory] = useState<string[]>([]);
  const [memoText, setMemoText] = useState("");
  const [calcInput, setCalcInput] = useState({ company: "", plan: "", amp: "30", bill: "" });
  const [calcResult, setCalcResult] = useState<number | null>(null);
  const [copiedStatus, setCopiedStatus] = useState<{ id: string, type: 'name' | 'url' } | null>(null);

  // 📊 KPIデータとカラー定義
  const [kpiStats, setKpiStats] = useState<{ total: number, target: number, lists: {name: string, value: number}[] }>({ total: 0, target: 20, lists: [] });
  const [isKpiLoading, setIsKpiLoading] = useState(true);

  const colorPalette = ["#0ea5e9", "#8b5cf6", "#f59e0b", "#10b981", "#ec4899", "#f43f5e", "#14b8a6"];
  const listConfigs: Record<string, { color: string }> = {
    "引越侍レ点有": { color: "#38bdf8" },
    "SUUMO": { color: "#4ade80" },
    "WEBクルー": { color: "#fbbf24" },
    "名古屋案件": { color: "#818cf8" },
    "その他": { color: "#94a3b8" }
  };

  const callTreeBookmarks = [
    { 
      id: 'b1', icon: '🐙', title: 'OBJ自動入力📝', copyName: '🐙OBJ自動入力📝', 
      copyUrl: `javascript:(function(){navigator.clipboard.readText().then(function(c){p(c);}).catch(function(){var j=prompt('⚠️クリップボードの読み取りがブロックされました！\\n手動で貼り付けてください:','');if(j)p(j);});function p(j){if(!j)return;var d;try{d=JSON.parse(j);}catch(e){alert('データの読み込みに失敗しました！コピーし直してください！');return;}function f(n,v){if(!v)return;var e=document.querySelector('input[name="'+n+'"]');if(!e)return;e.focus();var s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value").set;if(s){s.call(e,v);}else{e.value=v;}e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));e.blur();}var b=d.addressLine1||"";var m=b.match(/(.*?)([0-9０-９一二三四五六七八九十百]+丁目.*|[0-9０-９]+[-ー−].*|[0-9０-９]+)$/);if(m){b=m[2];}var bn=d.buildingName||"";var rn="";var bm=bn.match(/^(.*?)([\\s\\u3000]+.*|[0-9０-９]+[-ー−0-9０-９]*号?[室]?)$/);if(bm){bn=bm[1].trim();rn=bm[2].trim();}var a=(d.propertyType&&d.propertyType.indexOf('集合')!==-1)||bn.length>0;function r(){var q=document.querySelectorAll('input[type="radio"][name="propertyType"]');for(var i=0;i<q.length;i++){var t=q[i].value==='detachedHouse';if((a&&!t)||(!a&&t)){q[i].click();var s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"checked").set;if(s)s.call(q[i],true);q[i].dispatchEvent(new Event('change',{bubbles:true}));}}}r();setTimeout(function(){r();f('moveInDate',d.moveInDate);f('lastName',d.lastName);f('firstName',d.firstName);f('lastNameKatakana',d.lastNameKatakana);f('firstNameKatakana',d.firstNameKatakana);f('mobile',d.mobile);f('email',d.email);f('postcode',d.postcode);f('addressLine1',b);setTimeout(function(){if(a){f('buildingName',bn);f('roomNumber',rn);}alert('✨ Automatic input complete! Please check the contents!🐙');},300);},800);}})();` 
    },
    { 
      id: 'b2', icon: '🌲', title: 'CallTree連携', copyName: '🌲 CallTree連携', 
      copyUrl: `javascript:(function(){var d=document;var cln=function(s){return s.replace(/[\\s\\u3000\\(\\)\\（\\）必須任意]/g,'');};var getCtx=function(){var els=d.querySelectorAll('#cel3NewHis');if(els.length===0)els=d.querySelectorAll('#cel3');if(els.length>0){var t=els[els.length-1].closest('table');if(t)return t.parentElement||t;}return d;};var ctx=getCtx();var gTh=function(w){var ts=ctx.querySelectorAll('th');for(var i=ts.length-1;i>=0;i--){var t=cln(ts[i].innerText);for(var j=0;j<w.length;j++){if(t===w[j]){var n=ts[i].nextElementSibling;if(n&&n.tagName.toLowerCase()==='td'&&n.innerText.trim()!=='')return n.innerText.trim();}}}return '';};var getL=function(q){var els=d.querySelectorAll(q);return els.length>0?els[els.length-1]:null;};var lN=getL('#cInfo_lNameNewHis')||getL('#cInfo_lName');var vL=lN?lN.innerText.trim():'';if(!vL)vL=gTh(['リスト名','リスト種別','リスト','業務名','キャンペーン名']);var tU='https://octopusenergy.co.jp/affiliate/in-house-simple?affiliate=in-house-simple';var mN={"My賃貸":"https://octopusenergy.co.jp/affiliate/05-ryosukehirokawa","春風不動産":"https://octopusenergy.co.jp/affiliate/03-ryosukehirokawa"};if(vL==='名古屋'){var f=gTh(['不動産会社']);if(f&&mN[f]){tU=mN[f];}else if(f){alert('【注意】不動産会社「'+f+'」のURL設定が見つかりません！');}}window.open(tU,'_blank');})();` 
    },
    { id: 'b3', icon: '🧞‍♂️', title: '出張サイドバー', copyName: '🧞‍♂️ 出張サイドバー', copyUrl: `javascript:(function(){alert('出張サイドバー機能');})();` },
    { id: 'b4', icon: '👁️', title: '【神の目】チェッカー', copyName: '👁️【神の目】チェッカー', copyUrl: `javascript:(function(){alert('神の目システム起動');})();` },
    { id: 'b5', icon: '🚀', title: '【神速エディタ】', copyName: '🚀 【神速エディタ】', copyUrl: `javascript:(function(){alert('神速エディタ起動');})();` }
  ];

  useEffect(() => {
    const todayStr = new Date().toDateString();
    const savedLoginDate = localStorage.getItem("team_portal_login_date");
    const savedUser = localStorage.getItem("team_portal_user");

    if (savedUser) {
      if (!savedLoginDate) {
        localStorage.setItem("team_portal_login_date", todayStr);
      } else if (savedLoginDate !== todayStr) {
        alert("📅 日付が変わりました。自動ログアウトしました！今日も一日頑張りましょう！☕️");
        localStorage.removeItem("team_portal_user");
        localStorage.removeItem("team_portal_login_date");
        router.push("/login");
        return;
      }
      setUserName(savedUser); 
    } else {
      router.push("/login");
      return;
    }

    const justLoggedIn = sessionStorage.getItem("just_logged_in") === "true";
    let welcomeTimeout: NodeJS.Timeout | null = null;
    let readyTimeout: NodeJS.Timeout | null = null;

    if (justLoggedIn) {
      setShowMacWelcome(true); sessionStorage.removeItem("just_logged_in");
      welcomeTimeout = setTimeout(() => setShowMacWelcome(false), 3200); 
      readyTimeout = setTimeout(() => setIsReady(true), 2600); 
      setAnimDelayOffset(3.2);
    } else {
      setIsReady(true); setAnimDelayOffset(0.2);
    }

    const savedMemo = localStorage.getItem("team_portal_quick_memo");
    if (savedMemo) setMemoText(savedMemo);

    const savedHistory = localStorage.getItem("clipboard_vault");
    if (savedHistory) setCopiedHistory(JSON.parse(savedHistory));

    const hour = new Date().getHours();
    if (hour >= 6 && hour < 16) setTheme("day");
    else if (hour >= 16 && hour < 19) setTheme("sunset");
    else setTheme("night");

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsCmdKOpen(prev => !prev); }
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleClickOutside = (event: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(event.target as Node)) setActiveDockTool(null);
    };
    document.addEventListener("mousedown", handleClickOutside);

    const fetchKPI = () => {
      const callbackName = 'jsonpCallbackHome_' + Date.now();
      (window as any)[callbackName] = (jsonData: any) => {
        if(jsonData.success && jsonData.daily) { 
          setKpiStats({ total: jsonData.daily.total, target: jsonData.daily.target, lists: jsonData.daily.lists || [] });
        }
        setIsKpiLoading(false);
        delete (window as any)[callbackName];
      };
      const script = document.createElement('script');
      script.src = `${GAS_API_URL}?callback=${callbackName}`;
      script.onerror = () => setIsKpiLoading(false);
      document.body.appendChild(script);
    };
    fetchKPI();

    return () => {
      if (welcomeTimeout) clearTimeout(welcomeTimeout);
      if (readyTimeout) clearTimeout(readyTimeout);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const zipCode = utilInput.replace(/[^0-9]/g, "");
    if (zipCode.length === 7) {
      setUtilResult("🔍 検索中...");
      fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`)
        .then(res => res.json())
        .then(data => { if (data.results && data.results.length > 0) setUtilResult(`📍 ${data.results[0].address1} ${data.results[0].address2} ${data.results[0].address3}`); else setUtilResult("⚠️ 該当する住所が見つかりませんでした"); }).catch(() => setUtilResult("⚠️ 通信エラーが発生しました"));
    } else if (utilInput.length > 0 && !utilInput.match(/[0-9]/)) setUtilResult(`🔤 カナ変換APIは現在オフラインです`);
    else if (utilInput.length === 0) setUtilResult("郵便番号を入力してエリアを検索します。");
    else setUtilResult("入力中...");
  }, [utilInput]);

  const showToastMsg = (msg: string) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: "" }), 3000); };
  
  const handleLogout = () => { localStorage.removeItem("team_portal_user"); router.push("/login"); };
  const handleClockOut = async () => { const now = new Date(); const h = String(now.getHours()).padStart(2, "0"); const m = String(now.getMinutes()).padStart(2, "0"); try { await navigator.clipboard.writeText(`${h}:${m} 退勤いたします`); showToastMsg(`✨ 退勤メッセージをコピーしました！`); } catch (err) { alert("コピー失敗"); } };
  const copyUtilResult = async () => { if (utilResult.includes("📍")) { try { await navigator.clipboard.writeText(utilResult.replace("📍 ", "")); showToastMsg("📋 住所をコピーしました！"); } catch (err) {} } };

  const handleCmdKSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredCmdKLinks.length > 0) {
      const topLink = filteredCmdKLinks[0];
      if (topLink.url) { router.push(topLink.url); } else if (topLink.action) { topLink.action(); }
      setIsCmdKOpen(false); setCmdKQuery("");
    }
  };

  const progressPercent = Math.min(100, Math.round((kpiStats.total / (kpiStats.target || 1)) * 100)) || 0;
  const isAchieved = progressPercent >= 100;
  const { data: masterData } = useSWR(`/api/sheets-data?id=${MASTER_SHEET_ID}&range=${encodeURIComponent(CALCULATOR_RANGE)}`, fetcher);

  async function handleTargetCopy(e: React.MouseEvent, text: string, id: string, type: 'name' | 'url') {
    e.stopPropagation();
    try { 
      await navigator.clipboard.writeText(text); 
      setCopiedStatus({ id, type });
      setTimeout(() => setCopiedStatus(null), 1200);
      const newHistory = [text, ...copiedHistory.filter(i => i !== text)].slice(0, 5);
      setCopiedHistory(newHistory);
      localStorage.setItem("clipboard_vault", JSON.stringify(newHistory));
    } catch (err) { alert("コピーに失敗しました"); } 
  }

  const calculateCompare = () => {
    if (!masterData || !calcInput.bill) return;
    const row = masterData.find((r: any) => r[0] === calcInput.company && r[1] === calcInput.plan);
    if (!row) return alert("マスタに該当データがありません");
    const bill = Number(calcInput.bill);
    const kwh = (bill - Number(row[3])) / Number(row[4]); 
    const octopusBill = (Number(row[3]) * 0.9) + (kwh * 28); 
    setCalcResult(Math.floor((bill - octopusBill) * 12)); 
  };

  const welcomeTextRaw = `Welcome, ${userName}.`;
  const welcomeChars = welcomeTextRaw.split("");

  return (
    <div className={`portal-container theme-${theme}`}>
      
      {/* Mac Welcome Overlay */}
      {showMacWelcome && (
        <div className={`mac-welcome-overlay dark-fix-welcome`}>
          <div className="mac-welcome-text-container">
            {welcomeChars.map((char, i) => (
              <span key={i} className="welcome-char-wrapper">
                <span className="welcome-kinetic-char white-fix-char" style={{ animationDelay: `${i * 0.04}s` }}>{char === " " ? "\u00A0" : char}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Cmd + K パレット */}
      <div className={`modal-overlay ${isCmdKOpen ? "open" : ""}`} onClick={() => setIsCmdKOpen(false)} style={{zIndex: 99999}}>
        <div className="custom-modal cmdk-modal" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleCmdKSearch} style={{display: "flex", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "15px", marginBottom: "15px"}}>
            <span style={{fontSize: "24px", marginRight: "15px"}}>🔍</span>
            <input type="text" autoFocus={isCmdKOpen} placeholder="例: フレッツ、リンク、メモ..." className="cmdk-input" value={cmdKQuery} onChange={(e) => setCmdKQuery(e.target.value)} />
            <span className="cmdk-esc" onClick={() => setIsCmdKOpen(false)}>ESC</span>
          </form>
          <div className="cmdk-list">
            <div className="cmdk-label">Suggested Links</div>
            {filteredCmdKLinks.length > 0 ? (
              filteredCmdKLinks.map(link => (
                <div key={link.id} className="cmdk-item" onClick={() => { if(link.url) router.push(link.url); else if(link.action) link.action(); setIsCmdKOpen(false); setCmdKQuery(""); }}>
                  <div className="cmdk-item-title">{link.name}</div>
                  <div className="cmdk-item-desc">{link.desc}</div>
                </div>
              ))
            ) : (<div style={{fontSize: "13px", color: "var(--text-sub)", padding: "10px", textAlign: "center"}}>一致する機能がありません😭</div>)}
          </div>
        </div>
      </div>

      {/* Generative Background */}
      <div className="mesh-bg">
        <div className="mesh-blob blob-1"></div>
        <div className="mesh-blob blob-2"></div>
        <div className="mesh-blob blob-3"></div>
        <div className="mesh-blob blob-4"></div>
      </div>
      <div className="glass-overlay"></div>

      <main className={`bento-layout-wrapper ${isReady ? "ready" : ""}`}>
        <header className="portal-header">
          <div className="header-left">
            <div className="operator-badge">
              <span className="pulse-dot"></span>
              System Operator: <span style={{fontWeight: 900, marginLeft: '6px'}}>{userName}</span>
            </div>
          </div>
          <div className="header-right">
            <div className="cmdk-hint-bar" onClick={() => setIsCmdKOpen(true)}>
              <span style={{ opacity: 0.6 }}>🔍 Search or jump...</span>
              <div className="cmdk-shortcut"><kbd>⌘</kbd><kbd>K</kbd></div>
            </div>
            <button className="util-action-btn clockout-btn" onClick={handleClockOut}>🏃‍♂️ 退勤</button>
            <button className="util-action-btn logout-btn" onClick={handleLogout}>🚪</button>
          </div>
        </header>

        <div className="bento-grid">
          
          {/* 🎯 Slot A: KPI Dashboard (完全2カラム・見切れ防止版) */}
          <BentoCard title="Performance Center" attraction="DAILY KPI" size="xlarge" isAchieved={isAchieved} delay={animDelayOffset + 0.1} onClick={() => router.push("/kpi-detail")}>
            <div className="kpi-enhanced-container">
              <div className="kpi-left">
                <div className="kpi-main-stat">
                  <span className="current-num">{kpiStats.total}</span>
                  <span className="target-num">/ {kpiStats.target}</span>
                </div>
                <div className={`progress-track ${isAchieved ? 'animate-shine' : ''}`}>
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className="progress-label">{progressPercent}% COMPLETED</div>
              </div>
              
              <div className="kpi-right">
                <div className="panel-title-small">📦 LIST BREAKDOWN</div>
                <div className="breakdown-grid custom-scrollbar">
                  {isKpiLoading ? (
                    <div className="matrix-loader">MAPPING REALTIME DATA...</div>
                  ) : (
                    kpiStats.lists.map((l: any, i: number) => {
                      const config = listConfigs[l.name] || { color: colorPalette[i % colorPalette.length] };
                      const percent = Math.min(100, Math.round((l.value / (kpiStats.target || 1)) * 100));
                      return (
                        <div key={i} className="breakdown-item">
                          <div className="breakdown-info">
                            <span className="list-name-tag">{l.name}</span>
                            <span className="list-count" style={{ color: config.color }}>{l.value} <span style={{fontSize:"9px", opacity:0.6}}>件</span></span>
                          </div>
                          <div className="breakdown-bar-bg">
                            <div className="breakdown-bar-fill" style={{ width: `${percent}%`, background: config.color }}></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  {kpiStats.lists.length === 0 && !isKpiLoading && (
                    <div style={{fontSize: "11px", opacity: 0.5, gridColumn: "span 2", textAlign: "center", marginTop: "10px"}}>本日、まだ獲得データはありません。</div>
                  )}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Slot B: Power Action Stack */}
          <div className="bento-slot size-tall fade-up-element" style={{ "--delay": `${animDelayOffset + 0.2}s` } as React.CSSProperties}>
            <div className="bento-card-inner glass-morphism calm-hover action-stack">
              <div className="card-top"><span className="attraction-tag">QUICK LAUNCH</span></div>
              <h2 className="card-title">Launchpad</h2>
              <div className="action-buttons-list custom-scrollbar">
                {[
                  { name: "ネットトス連携", url: "/net-toss", icon: "🌐" },
                  { name: "自己クロ連携", url: "/self-close", icon: "🤝" },
                  { name: "料金シミュレーター", url: "/simulator", icon: "🆚" },
                ].map(action => (
                  <button key={action.name} className="action-row-btn" onClick={() => router.push(action.url)}>
                    <span className="btn-icon">{action.icon}</span>
                    <span className="btn-label">{action.name}</span>
                    <span className="btn-arrow">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <BentoCard title="データ一括登録" attraction="BULK SYNC" desc="成約後シート同期" delay={animDelayOffset + 0.3} onClick={() => router.push("/bulk-register")} />
          <BentoCard title="アフィリエイト" attraction="OBJ LINKS" desc="リストごとのリンク" delay={animDelayOffset + 0.4} onClick={() => router.push("/affiliate-links")} />
          <BentoCard title="メールテンプレ" attraction="MAIL FMT"  desc="重説、料金比較作成"  delay={animDelayOffset + 0.5} onClick={() => router.push("/email-template")} size="small" />
          <BentoCard title="SMS Kraken" attraction="SMS DISPATCH" desc="SMSテンプレ作成"  delay={animDelayOffset + 0.6} onClick={() => router.push("/sms-kraken")} size="small" />
        </div>
      </main>

      {/* 🍏 Utility Dock */}
      <nav className="mac-dock-wrapper" ref={dockRef}>
        <div className="mac-dock">
          <div className={`mac-dock-item ${activeDockTool === 'vault' ? 'active' : ''}`} onClick={() => setActiveDockTool(activeDockTool === 'vault' ? null : 'vault')} data-tooltip="Clipboard"><CustomIcon type="vault" /></div>
          <div className="mac-dock-item" onClick={() => router.push("/procedure-wizard")} data-tooltip="Manual"><CustomIcon type="manual" /></div>
          <div className="dock-divider"></div>
          <div className={`mac-dock-item ${activeDockTool === 'calc' ? 'active' : ''}`} onClick={() => setActiveDockTool(activeDockTool === 'calc' ? null : 'calc')} data-tooltip="Calculator"><CustomIcon type="calc" /></div>
          <div className={`mac-dock-item ${activeDockTool === 'bookmarks' ? 'active' : ''}`} onClick={() => setActiveDockTool(activeDockTool === 'bookmarks' ? null : 'bookmarks')} data-tooltip="Bookmarks"><CustomIcon type="bookmarks" /></div>
          <div className={`mac-dock-item ${activeDockTool === 'memo' ? 'active' : ''}`} onClick={() => setActiveDockTool(activeDockTool === 'memo' ? null : 'memo')} data-tooltip="Memo"><CustomIcon type="memo" /></div>
          
          <div className="dock-divider"></div>
          <div className={`mac-dock-item ${activeDockTool === 'zip' ? 'active' : ''}`} onClick={() => setActiveDockTool(activeDockTool === 'zip' ? null : 'zip')} data-tooltip="Address Search"><CustomIcon type="zip" /></div>

          <div className="dock-divider"></div>
          <div className="mac-dock-item theme-cycler" onClick={() => setTheme(theme === 'day' ? 'sunset' : theme === 'sunset' ? 'night' : 'day')} data-tooltip={`Theme: ${theme}`}><CustomIcon type="theme" /></div>
        </div>

        {/* Popovers */}
        {activeDockTool === 'vault' && (
          <div className="dock-popover vault-popover">
            <div className="pop-header">Clipboard Vault</div>
            <div className="pop-content custom-scrollbar">
              {copiedHistory.map((text, i) => (
                <div key={i} className="pop-row" onClick={() => navigator.clipboard.writeText(text)}>
                  <span className="pop-text">{text}</span>
                  <span className="pop-icon">📋</span>
                </div>
              ))}
              {copiedHistory.length === 0 && <div className="pop-empty">履歴がありません</div>}
            </div>
          </div>
        )}

        {activeDockTool === 'calc' && (
          <div className="dock-popover calc-popover">
            <div className="pop-header">⚡️ 秒速・比較電卓</div>
            <div className="pop-content custom-scrollbar">
              <select className="pop-input" onChange={(e) => setCalcInput({...calcInput, company: e.target.value})}>
                <option value="">電力会社を選択</option><option value="東京電力">東京電力</option><option value="関西電力">関西電力</option><option value="中部電力">中部電力</option>
              </select>
              <input type="text" className="pop-input" placeholder="プラン (例: 従量電灯B)" onChange={(e) => setCalcInput({...calcInput, plan: e.target.value})} />
              <input type="number" className="pop-input" placeholder="月の電気代 (円)" onChange={(e) => setCalcInput({...calcInput, bill: e.target.value})} />
              <button className="pop-btn" onClick={calculateCompare}>一瞬で計算する</button>
              {calcResult !== null && (
                <div className="calc-result-area">
                  <p className="result-label">年間節約想定額</p>
                  <p className="result-value">約 <span>¥{calcResult.toLocaleString()}</span> おトク！</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeDockTool === 'bookmarks' && (
          <div className="dock-popover bookmark-popover">
            <div className="pop-header">Bookmarks & Scripts</div>
            <div className="pop-content custom-scrollbar">
              {callTreeBookmarks.map(bm => (
                <div key={bm.id} className="bookmark-group">
                  <div className="bm-title">{bm.icon} {bm.title}</div>
                  <div className="pop-row" onClick={(e) => handleTargetCopy(e, bm.copyName, bm.id, 'name')}>
                    <span className="pop-badge bg-orange">Name</span>
                    <span className={`pop-text ${copiedStatus?.id === bm.id && copiedStatus?.type === 'name' ? 'text-green' : ''}`}>
                      {copiedStatus?.id === bm.id && copiedStatus?.type === 'name' ? '✅ コピー完了！' : bm.copyName}
                    </span>
                  </div>
                  <div className="pop-row" onClick={(e) => handleTargetCopy(e, bm.copyUrl, bm.id, 'url')}>
                    <span className="pop-badge bg-blue">URL</span>
                    <span className={`pop-text ${copiedStatus?.id === bm.id && copiedStatus?.type === 'url' ? 'text-green' : ''}`}>
                      {copiedStatus?.id === bm.id && copiedStatus?.type === 'url' ? '✅ コピー完了！' : bm.copyUrl.substring(0, 15) + '...'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeDockTool === 'memo' && (
          <div className="dock-popover memo-popover">
            <div className="pop-header">Quick Memo</div>
            <div className="pop-content custom-scrollbar">
              <textarea className="pop-textarea custom-scrollbar" value={memoText} onChange={(e) => { setMemoText(e.target.value); localStorage.setItem("team_portal_quick_memo", e.target.value); }} placeholder="自動保存されます..." />
            </div>
          </div>
        )}

        {activeDockTool === 'zip' && (
          <div className="dock-popover zip-popover">
            <div className="pop-header">📍 住所クイック検索</div>
            <div className="pop-content custom-scrollbar">
              <input type="text" className="pop-input" placeholder="郵便番号を入力 (例: 1000001)" value={utilInput} onChange={(e) => setUtilInput(e.target.value)} />
              <div className="calc-result-area" style={{cursor: 'pointer'}} onClick={copyUtilResult}>
                <p className="result-label" style={{marginBottom: 0, fontWeight: 900}}>{utilResult}</p>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>

      <style dangerouslySetInnerHTML={{ __html: `
        :root { 
          --accent: #0ea5e9; --bg-color: #020617; --card-bg: rgba(15, 23, 42, 0.65); --border: rgba(255,255,255,0.1);
          --text-main: #f8fafc; --text-sub: #94a3b8; --dock-bg: rgba(255,255,255,0.05);
          --mesh-1: #0f172a; --mesh-2: #0c4a6e; --mesh-3: #1e1b4b; --mesh-4: #020617; --glow: rgba(14, 165, 233, 0.2);
        }
        .theme-day {
          --accent: #0284c7; --bg-color: #f8fafc; --card-bg: rgba(255, 255, 255, 0.7); --border: rgba(0,0,0,0.08);
          --text-main: #0f172a; --text-sub: #475569; --dock-bg: rgba(0,0,0,0.05);
          --mesh-1: #e0f2fe; --mesh-2: #fffbeb; --mesh-3: #f3e8ff; --mesh-4: #ffffff; --glow: rgba(2, 132, 199, 0.1);
        }
        .theme-sunset {
          --accent: #f59e0b; --bg-color: #fffbf5; --card-bg: rgba(255, 250, 245, 0.75); --border: rgba(245, 158, 11, 0.2);
          --text-main: #451a03; --text-sub: #92400e; --dock-bg: rgba(255, 255, 255, 0.6);
          --mesh-1: #fef3c7; --mesh-2: #ffedd5; --mesh-3: #fce7f3; --mesh-4: #fff7ed; --glow: rgba(245, 158, 11, 0.2);
        }

        body { background: var(--bg-color); color: var(--text-main); font-family: 'Inter', sans-serif; overflow-x: hidden; transition: 1s ease; }
        .portal-container { min-height: 100vh; padding: 30px; position: relative; }
        
        .mesh-bg { position: fixed; inset: 0; z-index: -3; background: var(--bg-color); overflow: hidden; }
        .mesh-blob { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.8; animation: moveMesh 20s infinite alternate; transition: 1.5s ease; }
        .blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: var(--mesh-1); }
        .blob-2 { top: 40%; right: -20%; width: 60vw; height: 60vw; background: var(--mesh-2); }
        .blob-3 { bottom: -20%; left: 20%; width: 70vw; height: 70vw; background: var(--mesh-3); }
        .blob-4 { top: 10%; left: 40%; width: 40vw; height: 40vw; background: var(--mesh-4); }
        @keyframes moveMesh { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(5vw, 5vh) scale(1.1); } }
        .glass-overlay { position: fixed; inset: 0; z-index: -2; background-image: radial-gradient(var(--border) 1px, transparent 1px); background-size: 24px 24px; opacity: 0.5; pointer-events: none; }

        .bento-layout-wrapper { max-width: 1200px; margin: 0 auto; z-index: 10; position: relative; opacity: 0; transition: opacity 0.8s; }
        .bento-layout-wrapper.ready { opacity: 1; }

        /* 💡 ヘッダーのレイアウト */
        .portal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; position: relative; z-index: 10000; }
        .header-right { display: flex; gap: 15px; align-items: center; }
        .operator-badge { display: flex; align-items: center; background: var(--card-bg); backdrop-filter: blur(20px); padding: 10px 20px; border-radius: 100px; border: 1px solid var(--border); font-size: 12px; color: var(--text-sub); }
        .pulse-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-right: 10px; box-shadow: 0 0 10px #10b981; animation: pulse 2s infinite; }
        
        .util-action-btn { padding: 8px 16px; border-radius: 12px; font-weight: 900; font-size: 12px; cursor: pointer; border: 1px solid var(--border); transition: 0.2s; background: var(--card-bg); color: var(--text-main); }
        .util-action-btn:hover { border-color: var(--accent); transform: translateY(-2px); }
        .clockout-btn { color: #ef4444; border-color: rgba(239, 68, 68, 0.3); }
        .clockout-btn:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

        .cmdk-hint-bar { background: var(--dock-bg); border: 1px solid var(--border); padding: 8px 15px; border-radius: 14px; display: flex; align-items: center; gap: 30px; font-size: 12px; font-weight: 800; cursor: pointer; transition: 0.2s; backdrop-filter: blur(10px); }
        .cmdk-hint-bar:hover { border-color: var(--accent); }
        .cmdk-shortcut { display: flex; gap: 4px; }
        .cmdk-shortcut kbd { background: var(--card-bg); border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px; font-size: 10px; font-family: monospace; }

        /* 💡 修正：Dock被り防止のために margin-bottom を 140px に拡張 */
        .bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 160px; gap: 16px; margin-bottom: 140px; }
        .size-xlarge { grid-column: span 2; grid-row: span 2; }
        .size-tall { grid-column: span 1; grid-row: span 3; }
        .size-medium, .size-small { grid-column: span 1; grid-row: span 1; }

        .bento-card-inner { height: 100%; border-radius: 28px; padding: 28px; position: relative; border: 1px solid var(--border); cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .glass-morphism { background: var(--card-bg); backdrop-filter: blur(24px); }
        .calm-hover:hover { transform: translateY(-4px); border-color: var(--accent); box-shadow: var(--glow); }

        .achieved-glow .bento-card-inner { border-color: #fbbf24; box-shadow: 0 0 30px rgba(251, 191, 36, 0.3); animation: subtlePulse 4s infinite; }
        @keyframes subtlePulse { 0% { transform: scale(1); } 50% { transform: scale(1.01); } 100% { transform: scale(1); } }

        .attraction-tag { font-size: 10px; font-weight: 900; color: var(--accent); letter-spacing: 1.5px; text-transform: uppercase; }
        .card-title { font-size: 22px; font-weight: 900; margin: 6px 0; color: var(--text-main); }
        .card-desc { font-size: 14px; color: var(--text-sub); line-height: 1.6; font-weight: 600; margin-bottom: 0; }
        .card-body-content { flex: 1; overflow: hidden; display: flex; flex-direction: column; }

        /* 💡 KPI Visual (固定の高さを撤廃し、スクロール可能に) */
        .kpi-enhanced-container { display: flex; gap: 30px; margin-top: 10px; flex: 1; align-items: stretch; }
        .kpi-left { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .kpi-right { flex: 1.2; border-left: 1px solid var(--border); padding-left: 25px; overflow-y: auto; display: flex; flex-direction: column; }
        .current-num { font-size: 84px; font-weight: 900; color: var(--text-main); line-height: 1; letter-spacing: -3px; }
        .target-num { font-size: 28px; color: var(--text-sub); font-weight: 800; }
        .progress-track { width: 100%; height: 12px; background: var(--border); border-radius: 10px; margin-top: 15px; overflow: hidden; position: relative; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), #a855f7); border-radius: 10px; transition: 1s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-shine .progress-fill { background: linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24); background-size: 200% 100%; animation: shineMove 2s infinite linear; }
        .progress-label { font-size: 11px; font-weight: 900; color: var(--text-sub); margin-top: 8px; letter-spacing: 1px; }

        .panel-title-small { font-size: 10px; font-weight: 900; color: var(--text-sub); letter-spacing: 1px; margin-bottom: 12px; flex-shrink: 0; }
        .breakdown-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 20px; overflow-y: auto; padding-right: 4px; align-content: start; }
        .breakdown-item { display: flex; flex-direction: column; gap: 6px; }
        .breakdown-info { display: flex; justify-content: space-between; align-items: flex-end; }
        .list-name-tag { font-size: 11px; font-weight: 900; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90px; }
        .list-count { font-size: 14px; font-weight: 900; line-height: 1; }
        .breakdown-bar-bg { width: 100%; height: 5px; background: var(--border); border-radius: 4px; overflow: hidden; }
        .breakdown-bar-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }
        .matrix-loader { font-size: 10px; opacity: 0.5; font-weight: 900; letter-spacing: 2px; grid-column: span 2; text-align: center; margin-top: 20px; }

        /* Action Stack (💡 上揃え) */
        .action-stack { justify-content: flex-start !important; }
        .action-buttons-list { display: flex; flex-direction: column; gap: 10px; margin-top: 15px; overflow-y: auto; padding-right: 4px; }
        .action-row-btn { display: flex; align-items: center; padding: 16px 20px; background: var(--dock-bg); border: 1px solid transparent; border-radius: 18px; transition: 0.2s; color: var(--text-main); cursor: pointer; flex-shrink: 0; }
        .action-row-btn:hover { background: rgba(14, 165, 233, 0.1); border-color: var(--accent); transform: translateX(8px); }
        .btn-icon { font-size: 20px; margin-right: 15px; }
        .btn-label { flex: 1; text-align: left; font-weight: 800; font-size: 15px; }
        .btn-arrow { opacity: 0.3; transition: 0.2s; }
        .action-row-btn:hover .btn-arrow { opacity: 1; transform: translateX(4px); }

        /* Dock */
        .mac-dock-wrapper { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 1000; }
        .mac-dock { display: flex; align-items: center; gap: 12px; padding: 12px 18px; background: var(--card-bg); backdrop-filter: blur(40px); border-radius: 32px; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
        .mac-dock-item { width: 52px; height: 52px; border-radius: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s cubic-bezier(0.25, 1, 0.5, 1); position: relative; background: var(--dock-bg); color: var(--text-main); border: 1px solid transparent; }
        .mac-dock-item:hover { transform: scale(1.3) translateY(-10px); background: var(--card-bg); border-color: var(--accent); }
        .mac-dock-item::before { content: attr(data-tooltip); position: absolute; top: -45px; background: var(--text-main); color: var(--bg-color); font-size: 11px; font-weight: 900; padding: 6px 12px; border-radius: 8px; opacity: 0; pointer-events: none; transition: 0.2s; white-space: nowrap; }
        .mac-dock-item:hover::before { opacity: 1; }
        .mac-dock-item.active::after { content: ''; position: absolute; bottom: -8px; width: 6px; height: 6px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 10px var(--accent); }
        .dock-divider { width: 1px; height: 30px; background: var(--border); }

        /* Popovers */
        .dock-popover { position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%); width: 330px; background: var(--card-bg); backdrop-filter: blur(50px); border-radius: 30px; border: 1px solid var(--border); padding: 25px; box-shadow: 0 40px 80px rgba(0,0,0,0.4); transform-origin: bottom center; animation: popUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes popUp { from { opacity: 0; transform: translateX(-50%) scale(0.9) translateY(20px); } to { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); } }
        .pop-header { font-size: 12px; font-weight: 900; color: var(--text-sub); margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; text-align: center; border-bottom: 1px solid var(--border); padding-bottom: 12px; }
        .pop-content { max-height: 320px; overflow-y: auto; padding-right: 6px; }
        .pop-row { display: flex; align-items: center; justify-content: space-between; padding: 14px; background: var(--dock-bg); border-radius: 16px; cursor: pointer; transition: 0.2s; border: 1px solid transparent; margin-bottom: 8px; flex-shrink: 0; }
        .pop-row:hover { background: var(--card-bg); border-color: var(--accent); transform: translateX(4px); }
        .pop-text { font-size: 12px; font-weight: 800; color: var(--text-main); }
        .text-green { color: #10b981 !important; }

        .pop-input { width: 100%; padding: 14px; border-radius: 14px; border: 1px solid var(--border); background: var(--dock-bg); color: var(--text-main); font-size: 14px; outline: none; margin-bottom: 10px; transition: 0.2s; }
        .pop-input:focus { border-color: var(--accent); background: var(--card-bg); }
        .pop-btn { width: 100%; padding: 16px; border-radius: 14px; background: var(--accent); color: #fff; font-weight: 900; border: none; cursor: pointer; transition: 0.3s; }
        .pop-btn:hover { filter: brightness(1.2); transform: translateY(-2px); }
        .calc-result-area { margin-top: 16px; padding: 18px; background: rgba(16, 185, 129, 0.1); border-radius: 16px; text-align: center; border: 1px solid rgba(16, 185, 129, 0.3); }
        .result-label { font-size: 11px; color: var(--text-sub); font-weight: 800; margin: 0 0 6px 0; }
        .result-value { font-size: 20px; color: #10b981; font-weight: 900; margin: 0; }
        .pop-textarea { width: 100%; height: 180px; padding: 16px; border-radius: 18px; border: 1px solid var(--border); background: var(--dock-bg); color: var(--text-main); font-size: 14px; outline: none; resize: none; transition: 0.2s; }
        .pop-textarea:focus { border-color: var(--accent); background: var(--card-bg); }
        
        /* Mac Welcome & CmdK Modal */
        .mac-welcome-overlay { position: fixed; inset: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: #000; animation: macFadeOut 0.6s cubic-bezier(0.8, 0, 0.2, 1) 2.6s forwards; }
        .mac-welcome-text-container { font-size: 3rem; font-weight: 300; display: flex; flex-wrap: wrap; color: #fff; }
        .welcome-char-wrapper { display: inline-block; overflow: hidden; padding-bottom: 5px; }
        .welcome-kinetic-char { display: inline-block; transform: translateY(100%); opacity: 0; animation: slideUpWelcomeChar 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes slideUpWelcomeChar { to { transform: translateY(0); opacity: 1; } }
        @keyframes macFadeOut { to { opacity: 0; visibility: hidden; } }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(10px); z-index: 1000; display: flex; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: 0.3s; }
        .modal-overlay.open { opacity: 1; pointer-events: auto; }
        .custom-modal { background: var(--card-bg); backdrop-filter: blur(30px); width: 90%; max-width: 600px; padding: 30px; border-radius: 24px; border: 1px solid var(--border); transform: translateY(20px) scale(0.95); transition: 0.4s; color: var(--text-main); }
        .modal-overlay.open .custom-modal { transform: translateY(0) scale(1); }
        .cmdk-input { width: 100%; border: none; background: transparent; font-size: 20px; font-weight: 800; color: var(--text-main); outline: none; }
        .cmdk-esc { font-size: 10px; font-weight: 900; background: var(--dock-bg); padding: 4px 8px; border-radius: 6px; cursor: pointer; border: 1px solid var(--border); }
        .cmdk-list { display: flex; flex-direction: column; gap: 8px; margin-top: 15px; }
        .cmdk-label { font-size: 11px; font-weight: 900; color: var(--text-sub); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
        .cmdk-item { padding: 14px; border-radius: 12px; cursor: pointer; transition: 0.2s; background: var(--dock-bg); border: 1px solid transparent; }
        .cmdk-item-title { font-weight: 800; font-size: 14px; color: var(--text-main); margin-bottom: 4px; }
        .cmdk-item-desc { font-size: 11px; color: var(--text-sub); }
        .cmdk-item:hover { background: var(--card-bg); border-color: var(--accent); transform: translateX(5px); }
        .cmdk-item:hover .cmdk-item-title { color: var(--accent); }

        #toast { visibility: hidden; position: fixed; bottom: 120px; left: 50%; transform: translateX(-50%) translateY(20px); padding: 12px 24px; background: var(--accent); color: #fff; border-radius: 20px; font-weight: 900; font-size: 13px; z-index: 2000; opacity: 0; transition: 0.4s; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        #toast.show { visibility: visible; opacity: 1; transform: translateX(-50%) translateY(0); }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        
        .fade-up-element { opacity: 0; transform: translateY(20px); animation: fadeUp 0.6s forwards; animation-delay: var(--delay); }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}