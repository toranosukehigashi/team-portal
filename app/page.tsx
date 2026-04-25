"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

const MASTER_SHEET_ID = "1gXTpTFfp5f5I83P0FVbJbzX-bEsvgLY_DpNl6YDo9-w";
const CALCULATOR_RANGE = "電卓単価マスタ!A2:I";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
};

// 🌟 BentoCard Component (高輝度ボーダー & 達成エフェクト対応)
const BentoCard = ({ title, attraction, desc, delay, onClick, children, size = "medium", isAchieved = false }: any) => {
  return (
    <div className={`bento-slot fade-up-element size-${size} ${isAchieved ? 'achieved-glow' : ''}`} style={{ "--delay": `${delay}s` } as any} onClick={onClick}>
      <div className="bento-card-inner calm-hover glass-morphism">
        <div className="card-content">
          <div className="card-top">
            <span className="attraction-tag">{attraction}</span>
          </div>
          <h2 className="card-title">{title}</h2>
          <p className="card-desc">{desc}</p>
          <div className="card-body-content">{children}</div>
        </div>
      </div>
    </div>
  );
};

// 💠 オリジナルSVGアイコンコンポーネント (Gemini Design)
const CustomIcon = ({ type }: { type: string }) => {
  const paths: Record<string, JSX.Element> = {
    vault: <path d="M19 11V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V11M5 11C5 9.89543 5.89543 9 7 9H17C18.1046 9 19 9.89543 19 11M5 11L12 6L19 11M12 12V16M9 14H15" />,
    manual: <path d="M4 19.5V5C4 3.89543 4.89543 3 6 3H19V17C19 18.1046 18.1046 19 17 19H6C4.89543 19 4 18.1046 4 17V19.5ZM4 19.5C4 20.3284 4.67157 21 5.5 21H19" />,
    calc: <path d="M19 5V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5ZM9 7H15M9 11H10M14 11H15M9 15H10M14 15H15" />,
    bookmarks: <path d="M5 3H14L19 8V21H5V3ZM14 3V8H19" />,
    memo: <path d="M11 4H4V20H20V13M20.37 4.91L19.09 3.63C18.7 3.24 18.07 3.24 17.68 3.63L9 12.31V15H11.69L20.37 6.32C20.76 5.93 20.76 5.3 20.37 4.91Z" />,
    theme: <path d="M12 3V4M12 20V21M21 12H20M4 12H3M18.36 5.64L17.65 6.35M6.35 17.65L5.64 18.36M18.36 18.36L17.65 17.65M6.35 6.35L5.64 5.64M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8Z" />
  };
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[type]}
    </svg>
  );
};

export default function SaaSIntegratedHome() {
  const router = useRouter();
  const [userName, setUserName] = useState("Guest");
  const [theme, setTheme] = useState<'day' | 'sunset' | 'night'>("night");
  const [activeDockTool, setActiveDockTool] = useState<string | null>(null);
  
  const [copiedHistory, setCopiedHistory] = useState<string[]>([]);
  const [memoText, setMemoText] = useState("");
  const [calcInput, setCalcInput] = useState({ company: "", plan: "", amp: "30", bill: "" });
  const [calcResult, setCalcResult] = useState<number | null>(null);
  const [copiedStatus, setCopiedStatus] = useState<{ id: string, type: 'name' | 'url' } | null>(null);
  const [kpi, setKpi] = useState({ current: 0, target: 20 });
  const dockRef = useRef<HTMLDivElement>(null);

  // ダミーのリスト別獲得状況
  const kpiBreakdown = [
    { label: "シンプル", val: 5, color: "#38bdf8" },
    { label: "名古屋", val: 3, color: "#818cf8" },
    { label: "電気ガス", val: 2, color: "#fbbf24" },
    { label: "その他", val: kpi.current - 10 > 0 ? kpi.current - 10 : 0, color: "#94a3b8" }
  ];

  const callTreeBookmarks = [
    { 
      id: 'b1', icon: '🐙', title: 'OBJ自動入力📝', copyName: '🐙OBJ自動入力📝', 
      copyUrl: `javascript:(function(){navigator.clipboard.readText().then(function(c){p(c);}).catch(function(){var j=prompt('⚠️クリップボードの読み取りがブロックされました！\\n手動で貼り付けてください:','');if(j)p(j);});function p(j){if(!j)return;var d;try{d=JSON.parse(j);}catch(e){alert('データの読み込みに失敗しました！コピーし直してください！');return;}function f(n,v){if(!v)return;var e=document.querySelector('input[name="'+n+'"]');if(!e)return;e.focus();var s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value").set;if(s){s.call(e,v);}else{e.value=v;}e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));e.blur();}var b=d.addressLine1||"";var m=b.match(/(.*?)([0-9０-９一二三四五六七八九十百]+丁目.*|[0-9０-９]+[-ー−].*|[0-9０-９]+)$/);if(m){b=m[2];}var bn=d.buildingName||"";var rn="";var bm=bn.match(/^(.*?)([\\s\\u3000]+.*|[0-9０-９]+[-ー−0-9０-９]*号?[室]?)$/);if(bm){bn=bm[1].trim();rn=bm[2].trim();}var a=(d.propertyType&&d.propertyType.indexOf('集合')!==-1)||bn.length>0;function r(){var q=document.querySelectorAll('input[type="radio"][name="propertyType"]');for(var i=0;i<q.length;i++){var t=q[i].value==='detachedHouse';if((a&&!t)||(!a&&t)){q[i].click();var s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"checked").set;if(s)s.call(q[i],true);q[i].dispatchEvent(new Event('change',{bubbles:true}));}}}r();setTimeout(function(){r();f('moveInDate',d.moveInDate);f('lastName',d.lastName);f('firstName',d.firstName);f('lastNameKatakana',d.lastNameKatakana);f('firstNameKatakana',d.firstNameKatakana);f('mobile',d.mobile);f('email',d.email);f('postcode',d.postcode);f('addressLine1',b);setTimeout(function(){if(a){f('buildingName',bn);f('roomNumber',rn);}alert('✨ Automatic input complete! Please check the contents!🐙');},300);},800);}})();` 
    },
    { id: 'b2', icon: '🌲', title: 'CallTree連携', copyName: '🌲 CallTree連携', copyUrl: `javascript:alert('CallTree連携');` }
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 15) setTheme("day");
    else if (hour >= 15 && hour < 19) setTheme("sunset");
    else setTheme("night");

    const savedUser = localStorage.getItem("team_portal_user");
    if (savedUser) setUserName(savedUser);
    
    const savedKpi = localStorage.getItem("team_portal_kpi");
    if (savedKpi) try { setKpi(JSON.parse(savedKpi)); } catch(e){}

    const savedMemo = localStorage.getItem("team_portal_quick_memo");
    if (savedMemo) setMemoText(savedMemo);

    const savedHistory = localStorage.getItem("clipboard_vault");
    if (savedHistory) setCopiedHistory(JSON.parse(savedHistory));
  }, []);

  const progressPercent = Math.min(100, Math.round((kpi.current / kpi.target) * 100));
  const isAchieved = progressPercent >= 100;
  const { data: masterData } = useSWR(`/api/sheets-data?id=${MASTER_SHEET_ID}&range=${encodeURIComponent(CALCULATOR_RANGE)}`, fetcher);

  const calculateCompare = () => {
    if (!masterData || !calcInput.bill) return;
    const row = masterData.find((r: any) => r[0] === calcInput.company && r[1] === calcInput.plan);
    if (!row) return alert("マスタに該当データがありません");
    
    const bill = Number(calcInput.bill);
    const kwh = (bill - Number(row[3])) / Number(row[4]); 
    const octopusBill = (Number(row[3]) * 0.9) + (kwh * 28); 
    setCalcResult(Math.floor((bill - octopusBill) * 12)); 
  };

  const cycleTheme = () => {
    if (theme === 'day') setTheme('sunset');
    else if (theme === 'sunset') setTheme('night');
    else setTheme('day');
  };

  return (
    <div className={`portal-container theme-${theme}`}>
      
      {/* 🌊 Generative Dynamic Mesh Background */}
      <div className="mesh-bg">
        <div className="mesh-blob blob-1"></div>
        <div className="mesh-blob blob-2"></div>
        <div className="mesh-blob blob-3"></div>
        <div className="mesh-blob blob-4"></div>
      </div>
      <div className="glass-overlay"></div>

      <main className="bento-layout-wrapper">
        <header className="portal-header">
          <div className="operator-badge">
            <span className="pulse-dot"></span>
            System Operator: <span style={{fontWeight: 900, marginLeft: '6px'}}>{userName}</span>
          </div>
          <div className="system-date">NODE STATUS: {isAchieved ? "GOAL REACHED" : "ACTIVE"}</div>
        </header>

        <div className="bento-grid">
          
          {/* Slot A: KPI Dashboard (高機能版) */}
          <BentoCard title="KPI Dashboard" attraction="PERFORMANCE" desc="現在の進捗とリスト別内訳" size="xlarge" isAchieved={isAchieved} onClick={() => router.push("/kpi-detail")}>
            <div className="kpi-enhanced-container">
              <div className="kpi-left">
                <div className="kpi-main-stat">
                  <span className="current-num">{kpi.current}</span>
                  <span className="target-num">/ {kpi.target}</span>
                </div>
                <div className={`progress-track ${isAchieved ? 'animate-shine' : ''}`}>
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className="progress-label">{progressPercent}% Achieved</div>
              </div>
              <div className="kpi-right">
                <div className="breakdown-list">
                  {kpiBreakdown.map(item => (
                    <div key={item.label} className="breakdown-item">
                      <div className="breakdown-info">
                        <span>{item.label}</span>
                        <span style={{color: item.color}}>{item.val}</span>
                      </div>
                      <div className="breakdown-bar-bg">
                        <div className="breakdown-bar-fill" style={{ width: `${(item.val / kpi.target) * 100}%`, background: item.color }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Slot B: Power Action Stack */}
          <div className="bento-slot size-tall fade-up-element" style={{ "--delay": "0.3s" } as any}>
            <div className="bento-card-inner glass-morphism calm-hover action-stack">
              <div className="card-top"><span className="attraction-tag">POWER ACTIONS</span></div>
              <h2 className="card-title">Quick Launch</h2>
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

          <BentoCard title="データ一括登録" attraction="BULK REGISTER" desc="マスターシート同期" delay={0.4} onClick={() => router.push("/bulk-register")} />
          <BentoCard title="アフィリエイト" attraction="LINK CONSOLE" desc="不動産各社のOBJ生成" delay={0.5} onClick={() => router.push("/affiliate-links")} />
          <BentoCard title="メールテンプレ" attraction="TEMPLATES" delay={0.6} onClick={() => router.push("/email-template")} size="small" />
          <BentoCard title="SMS Kraken" attraction="MESSAGING" delay={0.7} onClick={() => router.push("/sms-kraken")} size="small" />
        </div>
      </main>

      {/* 🍏 Utility Dock (Mac / visionOS Style + Custom Icons) */}
      <nav className="mac-dock-wrapper">
        <div className="mac-dock">
          <div className={`mac-dock-item ${activeDockTool === 'vault' ? 'active' : ''}`} onClick={() => setActiveDockTool(activeDockTool === 'vault' ? null : 'vault')} data-tooltip="Clipboard"><CustomIcon type="vault" /></div>
          <div className="mac-dock-item" onClick={() => router.push("/procedure-wizard")} data-tooltip="Manual"><CustomIcon type="manual" /></div>
          <div className="dock-divider"></div>
          <div className={`mac-dock-item ${activeDockTool === 'calc' ? 'active' : ''}`} onClick={() => setActiveDockTool(activeDockTool === 'calc' ? null : 'calc')} data-tooltip="Calculator"><CustomIcon type="calc" /></div>
          <div className={`mac-dock-item ${activeDockTool === 'bookmarks' ? 'active' : ''}`} onClick={() => setActiveDockTool(activeDockTool === 'bookmarks' ? null : 'bookmarks')} data-tooltip="Bookmarks"><CustomIcon type="bookmarks" /></div>
          <div className={`mac-dock-item ${activeDockTool === 'memo' ? 'active' : ''}`} onClick={() => setActiveDockTool(activeDockTool === 'memo' ? null : 'memo')} data-tooltip="Memo"><CustomIcon type="memo" /></div>
          <div className="dock-divider"></div>
          <div className="mac-dock-item theme-cycler" onClick={cycleTheme} data-tooltip={`Theme: ${theme}`}><CustomIcon type="theme" /></div>
        </div>

        {/* Popovers */}
        {activeDockTool === 'vault' && (
          <div className="dock-popover vault-popover">
            <div className="pop-header">Clipboard Vault</div>
            <div className="pop-content">
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
            <div className="pop-content">
              <select className="pop-input" onChange={(e) => setCalcInput({...calcInput, company: e.target.value})}>
                <option value="">電力会社を選択</option>
                <option value="東京電力">東京電力</option>
                <option value="関西電力">関西電力</option>
                <option value="中部電力">中部電力</option>
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
            <div className="pop-content">
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
            <div className="pop-content">
              <textarea 
                className="pop-textarea"
                value={memoText} 
                onChange={(e) => { setMemoText(e.target.value); localStorage.setItem("team_portal_quick_memo", e.target.value); }}
                placeholder="自動保存されます..."
              />
            </div>
          </div>
        )}
      </nav>

      {/* ✨ 最新鋭 CSS: Mesh Gradient & SaaS Typography */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root { 
          --accent: #0ea5e9; 
          --bg-color: #020617;
          --card-bg: rgba(15, 23, 42, 0.65); 
          --border: rgba(255,255,255,0.1);
          --text-main: #f8fafc;
          --text-sub: #94a3b8;
          --dock-bg: rgba(255,255,255,0.05);
          --mesh-1: #0f172a; --mesh-2: #0c4a6e; --mesh-3: #1e1b4b; --mesh-4: #020617;
          --glow: rgba(14, 165, 233, 0.2);
        }
        
        .theme-day {
          --accent: #0284c7; 
          --bg-color: #f8fafc;
          --card-bg: rgba(255, 255, 255, 0.7);
          --border: rgba(0,0,0,0.08);
          --text-main: #0f172a;
          --text-sub: #475569;
          --dock-bg: rgba(0,0,0,0.05);
          --mesh-1: #e0f2fe; --mesh-2: #fffbeb; --mesh-3: #f3e8ff; --mesh-4: #ffffff;
          --glow: rgba(2, 132, 199, 0.1);
        }

        .theme-sunset {
          --accent: #f97316; 
          --bg-color: #431407;
          --card-bg: rgba(67, 20, 7, 0.6);
          --border: rgba(255,255,255,0.2);
          --text-main: #fff7ed;
          --text-sub: #fed7aa;
          --dock-bg: rgba(255,255,255,0.1);
          --mesh-1: #9a3412; --mesh-2: #ea580c; --mesh-3: #431407; --mesh-4: #f97316;
          --glow: rgba(249, 115, 22, 0.3);
        }

        body { background: var(--bg-color); color: var(--text-main); font-family: 'Inter', sans-serif; overflow-x: hidden; transition: 1s ease; }
        
        .portal-container { min-height: 100vh; padding: 40px; position: relative; }
        
        /* 🌊 Mesh Gradient */
        .mesh-bg { position: fixed; inset: 0; z-index: -3; background: var(--bg-color); overflow: hidden; }
        .mesh-blob { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.8; animation: moveMesh 20s infinite alternate; transition: 1.5s ease; }
        .blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: var(--mesh-1); }
        .blob-2 { top: 40%; right: -20%; width: 60vw; height: 60vw; background: var(--mesh-2); }
        .blob-3 { bottom: -20%; left: 20%; width: 70vw; height: 70vw; background: var(--mesh-3); }
        .blob-4 { top: 10%; left: 40%; width: 40vw; height: 40vw; background: var(--mesh-4); }
        @keyframes moveMesh { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(5vw, 5vh) scale(1.1); } }
        
        .glass-overlay { position: fixed; inset: 0; z-index: -2; background-image: radial-gradient(var(--border) 1px, transparent 1px); background-size: 24px 24px; opacity: 0.5; pointer-events: none; }

        .bento-layout-wrapper { max-width: 1200px; margin: 0 auto; z-index: 10; position: relative; }
        .portal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .operator-badge { display: flex; align-items: center; background: var(--card-bg); backdrop-filter: blur(20px); padding: 10px 20px; border-radius: 100px; border: 1px solid var(--border); font-size: 12px; color: var(--text-sub); }
        .pulse-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-right: 10px; box-shadow: 0 0 10px #10b981; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        .system-date { font-size: 10px; font-weight: 900; color: var(--text-sub); letter-spacing: 2px; }
        
        /* 🍱 Bento Grid */
        .bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 160px; gap: 16px; margin-bottom: 100px; }
        .size-xlarge { grid-column: span 2; grid-row: span 2; }
        .size-tall { grid-column: span 1; grid-row: span 3; }
        .size-medium, .size-small { grid-column: span 1; grid-row: span 1; }

        .bento-card-inner { height: 100%; border-radius: 28px; padding: 28px; position: relative; border: 1px solid var(--border); cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .glass-morphism { background: var(--card-bg); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
        
        .calm-hover:hover { transform: translateY(-4px); border-color: var(--accent); box-shadow: var(--glow); }

        /* 🏆 達成エフェクト (Achieved Glow) */
        .achieved-glow .bento-card-inner { border-color: #fbbf24; box-shadow: 0 0 30px rgba(251, 191, 36, 0.3); animation: subtlePulse 4s infinite; }
        @keyframes subtlePulse { 0% { transform: scale(1); } 50% { transform: scale(1.01); } 100% { transform: scale(1); } }

        .attraction-tag { font-size: 10px; font-weight: 900; color: var(--accent); letter-spacing: 1.5px; text-transform: uppercase; }
        .card-title { font-size: 22px; font-weight: 900; margin: 6px 0; color: var(--text-main); }
        .card-desc { font-size: 14px; color: var(--text-sub); line-height: 1.6; font-weight: 600; }

        /* KPI Enhanced Visual */
        .kpi-enhanced-container { display: flex; gap: 30px; margin-top: 10px; flex: 1; align-items: center; }
        .kpi-left { flex: 1; }
        .kpi-right { flex: 1; border-left: 1px solid var(--border); padding-left: 25px; }
        .kpi-main-stat { display: flex; align-items: baseline; gap: 8px; }
        .current-num { font-size: 84px; font-weight: 900; color: var(--text-main); line-height: 1; letter-spacing: -3px; }
        .target-num { font-size: 28px; color: var(--text-sub); font-weight: 800; }
        
        .progress-track { width: 100%; height: 12px; background: var(--border); border-radius: 10px; margin-top: 15px; overflow: hidden; position: relative; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), #a855f7); border-radius: 10px; transition: 1s cubic-bezier(0.16, 1, 0.3, 1); }
        
        /* バーが光るエフェクト */
        .animate-shine .progress-fill { background: linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24); background-size: 200% 100%; animation: shineMove 2s infinite linear; }
        @keyframes shineMove { from { background-position: 200% 0; } to { background-position: -200% 0; } }
        
        .progress-label { font-size: 11px; font-weight: 900; color: var(--text-sub); margin-top: 8px; }

        .breakdown-list { display: flex; flex-direction: column; gap: 10px; }
        .breakdown-item { display: flex; flex-direction: column; gap: 4px; }
        .breakdown-info { display: flex; justify-content: space-between; font-size: 11px; font-weight: 900; }
        .breakdown-bar-bg { width: 100%; height: 4px; background: var(--border); border-radius: 4px; overflow: hidden; }
        .breakdown-bar-fill { height: 100%; border-radius: 4px; }

        /* Action Stack */
        .action-buttons-list { display: flex; flex-direction: column; gap: 10px; margin-top: 15px; }
        .action-row-btn { display: flex; align-items: center; padding: 16px 20px; background: var(--dock-bg); border: 1px solid transparent; border-radius: 18px; transition: 0.2s; color: var(--text-main); cursor: pointer; }
        .action-row-btn:hover { background: rgba(14, 165, 233, 0.1); border-color: var(--accent); transform: translateX(8px); }
        .btn-icon { font-size: 20px; margin-right: 15px; }
        .btn-label { flex: 1; text-align: left; font-weight: 800; font-size: 15px; }
        .btn-arrow { opacity: 0.3; transition: 0.2s; }
        .action-row-btn:hover .btn-arrow { opacity: 1; transform: translateX(4px); }

        /* 🍏 Dock & Custom Icons */
        .mac-dock-wrapper { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 1000; }
        .mac-dock { display: flex; align-items: center; gap: 12px; padding: 12px 18px; background: var(--card-bg); backdrop-filter: blur(40px); border-radius: 32px; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
        .mac-dock-item { width: 52px; height: 52px; border-radius: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s cubic-bezier(0.25, 1, 0.5, 1); position: relative; background: var(--dock-bg); color: var(--text-main); }
        .mac-dock-item:hover { transform: scale(1.3) translateY(-10px); background: var(--card-bg); border: 1px solid var(--accent); }
        .mac-dock-item::before { content: attr(data-tooltip); position: absolute; top: -45px; background: var(--text-main); color: var(--bg-color); font-size: 11px; font-weight: 900; padding: 6px 12px; border-radius: 8px; opacity: 0; pointer-events: none; transition: 0.2s; white-space: nowrap; }
        .mac-dock-item:hover::before { opacity: 1; }
        .mac-dock-item.active::after { content: ''; position: absolute; bottom: -8px; width: 6px; height: 6px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 10px var(--accent); }
        .dock-divider { width: 1px; height: 30px; background: var(--border); }

        /* 💬 Popovers */
        .dock-popover { position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%); width: 330px; background: var(--card-bg); backdrop-filter: blur(50px); border-radius: 30px; border: 1px solid var(--border); padding: 25px; box-shadow: 0 40px 80px rgba(0,0,0,0.4); transform-origin: bottom center; animation: popUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes popUp { from { opacity: 0; transform: translateX(-50%) scale(0.9) translateY(20px); } to { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); } }
        
        .pop-header { font-size: 12px; font-weight: 900; color: var(--text-sub); margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; text-align: center; border-bottom: 1px solid var(--border); padding-bottom: 12px; }
        .pop-row { display: flex; align-items: center; justify-content: space-between; padding: 14px; background: var(--dock-bg); border-radius: 16px; cursor: pointer; transition: 0.2s; border: 1px solid transparent; margin-bottom: 8px; }
        .pop-row:hover { background: var(--card-bg); border-color: var(--accent); transform: translateX(4px); }
        .pop-text { font-size: 12px; font-weight: 800; color: var(--text-main); }
        .text-green { color: #10b981 !important; }

        .pop-input { width: 100%; padding: 14px; border-radius: 14px; border: 1px solid var(--border); background: var(--dock-bg); color: var(--text-main); font-size: 14px; outline: none; margin-bottom: 10px; }
        .pop-btn { width: 100%; padding: 16px; border-radius: 14px; background: var(--accent); color: #fff; font-weight: 900; border: none; cursor: pointer; transition: 0.3s; }
        .pop-btn:hover { filter: brightness(1.2); transform: translateY(-2px); }

        .pop-textarea { width: 100%; height: 180px; padding: 16px; border-radius: 18px; border: 1px solid var(--border); background: var(--dock-bg); color: var(--text-main); font-size: 14px; outline: none; resize: none; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
      `}} />
    </div>
  );
}