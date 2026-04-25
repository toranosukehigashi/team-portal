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

// 🌟 BentoCard Component
const BentoCard = ({ title, attraction, desc, delay, onClick, children, size = "medium" }: any) => {
  return (
    <div className={`bento-slot fade-up-element size-${size}`} style={{ "--delay": `${delay}s` } as any} onClick={onClick}>
      <div className="bento-card-inner calm-hover glass-morphism">
        <div className="card-content">
          <div className="card-top">
            <span className="attraction-tag">{attraction}</span>
          </div>
          <h2 className="card-title">{title}</h2>
          <p className="card-desc">{desc}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

type ThemeType = 'day' | 'sunset' | 'night';

export default function SaaSIntegratedHome() {
  const router = useRouter();
  const [userName, setUserName] = useState("Guest");
  const [theme, setTheme] = useState<ThemeType>("night");
  const [activeDockTool, setActiveDockTool] = useState<string | null>(null);
  
  const [copiedHistory, setCopiedHistory] = useState<string[]>([]);
  const [memoText, setMemoText] = useState("");
  const [calcInput, setCalcInput] = useState({ company: "", plan: "", amp: "30", bill: "" });
  const [calcResult, setCalcResult] = useState<number | null>(null);
  const [copiedStatus, setCopiedStatus] = useState<{ id: string, type: 'name' | 'url' } | null>(null);
  const [kpi, setKpi] = useState({ current: 0, target: 20 });
  const dockRef = useRef<HTMLDivElement>(null);

  const callTreeBookmarks = [
    { 
      id: 'b1', icon: '🐙', title: 'OBJ自動入力📝', copyName: '🐙OBJ自動入力📝', 
      copyUrl: `javascript:(function(){navigator.clipboard.readText().then(function(c){p(c);}).catch(function(){var j=prompt('⚠️クリップボードの読み取りがブロックされました！\\n手動で貼り付けてください:','');if(j)p(j);});function p(j){if(!j)return;var d;try{d=JSON.parse(j);}catch(e){alert('データの読み込みに失敗しました！コピーし直してください！');return;}function f(n,v){if(!v)return;var e=document.querySelector('input[name="'+n+'"]');if(!e)return;e.focus();var s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value").set;if(s){s.call(e,v);}else{e.value=v;}e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));e.blur();}var b=d.addressLine1||"";var m=b.match(/(.*?)([0-9０-９一二三四五六七八九十百]+丁目.*|[0-9０-９]+[-ー−].*|[0-9０-９]+)$/);if(m){b=m[2];}var bn=d.buildingName||"";var rn="";var bm=bn.match(/^(.*?)([\\s\\u3000]+.*|[0-9０-９]+[-ー−0-9０-９]*号?[室]?)$/);if(bm){bn=bm[1].trim();rn=bm[2].trim();}var a=(d.propertyType&&d.propertyType.indexOf('集合')!==-1)||bn.length>0;function r(){var q=document.querySelectorAll('input[type="radio"][name="propertyType"]');for(var i=0;i<q.length;i++){var t=q[i].value==='detachedHouse';if((a&&!t)||(!a&&t)){q[i].click();var s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"checked").set;if(s)s.call(q[i],true);q[i].dispatchEvent(new Event('change',{bubbles:true}));}}}r();setTimeout(function(){r();f('moveInDate',d.moveInDate);f('lastName',d.lastName);f('firstName',d.firstName);f('lastNameKatakana',d.lastNameKatakana);f('firstNameKatakana',d.firstNameKatakana);f('mobile',d.mobile);f('email',d.email);f('postcode',d.postcode);f('addressLine1',b);setTimeout(function(){if(a){f('buildingName',bn);f('roomNumber',rn);}alert('✨ Automatic input complete! Please check the contents!🐙');},300);},800);}})();` 
    },
    { 
      id: 'b2', icon: '🌲', title: 'CallTreeからOBJオープン！', copyName: '🌲 CallTreeからOBJオープン！', 
      copyUrl: `javascript:(function(){var d=document;var cln=function(s){return s.replace(/[\\s\\u3000\\(\\)\\（\\）必須任意]/g,'');};var getCtx=function(){var els=d.querySelectorAll('#cel3NewHis');if(els.length===0)els=d.querySelectorAll('#cel3');if(els.length>0){var t=els[els.length-1].closest('table');if(t)return t.parentElement||t;}return d;};var ctx=getCtx();var gTh=function(w){var ts=ctx.querySelectorAll('th');for(var i=ts.length-1;i>=0;i--){var t=cln(ts[i].innerText);for(var j=0;j<w.length;j++){if(t===w[j]){var n=ts[i].nextElementSibling;if(n&&n.tagName.toLowerCase()==='td'&&n.innerText.trim()!=='')return n.innerText.trim();}}}return '';};var getL=function(q){var els=d.querySelectorAll(q);return els.length>0?els[els.length-1]:null;};var lN=getL('#cInfo_lNameNewHis')||getL('#cInfo_lName');var vL=lN?lN.innerText.trim():'';if(!vL)vL=gTh(['リスト名','リスト種別','リスト','業務名','キャンペーン名']);var tU='https://octopusenergy.co.jp/affiliate/in-house-simple?affiliate=in-house-simple';var mN={"My賃貸":"https://octopusenergy.co.jp/affiliate/05-ryosukehirokawa","春風不動産":"https://octopusenergy.co.jp/affiliate/03-ryosukehirokawa","エステートプラス":"https://octopusenergy.co.jp/affiliate/04-ryosukehirokawa","アパマンショップ蟹江店":"https://octopusenergy.co.jp/affiliate/01-yutainoue","不動産ランドすまいる":"https://octopusenergy.co.jp/affiliate/04-yutainoue","不動産ランド住まいる":"https://octopusenergy.co.jp/affiliate/04-yutainoue","ピタットハウス神宮南":"https://octopusenergy.co.jp/affiliate/05-yutainoue","Access":"https://octopusenergy.co.jp/affiliate/06-yutainoue","ルームコレクション":"https://octopusenergy.co.jp/affiliate/06-ryosukehirokawa","すまいらんど":"https://octopusenergy.co.jp/affiliate/07-ryosukehirokawa","株式会社東栄":"https://octopusenergy.co.jp/affiliate/08-ryosukehirokawa","株式会社STYプランニング":"https://octopusenergy.co.jp/affiliate/10-ryosukehirokawa","株式会社なごやか不動産":"https://octopusenergy.co.jp/affiliate/09-ryosukehirokawa","なごやか不動産":"https://octopusenergy.co.jp/affiliate/09-ryosukehirokawa","楽楽不動産":"https://octopusenergy.co.jp/affiliate/11-ryosukehirokawa?affiliate=11-ryosukehirokawa","楽々不動産":"https://octopusenergy.co.jp/affiliate/11-ryosukehirokawa?affiliate=11-ryosukehirokawa","ひまわりカンパニー":"https://octopusenergy.co.jp/affiliate/12-ryosukehirokawa","株式会社Terrace Home本店":"https://octopusenergy.co.jp/affiliate/14-ryosukehirokawa"};var mK={"芳賀":"https://octopusenergy.co.jp/affiliate/haga?affiliate=haga","アイユーホーム":"https://octopusenergy.co.jp/affiliate/aiy?affiliate=aiy","ニコニコ不動産":"https://octopusenergy.co.jp/affiliate/nikoniko?affiliate=nikoniko","洞口不動産":"https://octopusenergy.co.jp/affiliate/horaguchi2?affiliate=horaguchi2","スリーケー企画":"https://octopusenergy.co.jp/affiliate/3k?affiliate=3k","三世建物管理":"https://octopusenergy.co.jp/affiliate/sansei?affiliate=sansei","ランエステート":"https://octopusenergy.co.jp/affiliate/run?affiliate=run","トライホーム":"https://octopusenergy.co.jp/affiliate/tryhome?affiliate=tryhome","オクムラ":"https://octopusenergy.co.jp/affiliate/okm?affiliate=okm","ウィノベーション":"https://octopusenergy.co.jp/affiliate/win?affiliate=win","めぐみ企画":"https://octopusenergy.co.jp/affiliate/mgm?affiliate=mgm","カンリーコーポ":"https://octopusenergy.co.jp/affiliate/kanry?affiliate=kanry","株式会社フォーディー":"https://octopusenergy.co.jp/affiliate/4d","アンサンブル株式会社":"https://octopusenergy.co.jp/affiliate/ensem?affiliate=ensem","株式会社北総研":"https://octopusenergy.co.jp/affiliate/3k?affiliate=3k","フィリックス株式会社":"https://octopusenergy.co.jp/affiliate/felixchubu?affiliate=felixchubu"};if(vL==='名古屋'){var f=gTh(['不動産会社']);if(f&&mN[f]){tU=mN[f];}else if(f){alert('【注意】不動産会社「'+f+'」のURL設定が見つかりません！');}}else if(vL==='空室通電'){var n=gTh(['名前','お客様名','氏名','漢字名前']);if(!n){var c3List=d.querySelectorAll('#cel3NewHis');var c3=c3List.length>0?c3List[c3List.length-1]:null;if(!c3){var c3o=d.querySelectorAll('#cel3');c3=c3o.length>0?c3o[c3o.length-1]:null;}if(c3)n=c3.innerText.trim();}if(n){var m=n.match(/[（\\(](.*?)[）\\)]/);if(m&&m[1]){var c=m[1].trim();if(mK[c]){tU=mK[c];}else{alert('【注意】カッコ内の会社名「'+c+'」のURL設定が見つかりません！');}}else{alert('【注意】カッコ内の不動産会社が見つかりません！');}}}window.open(tU,'_blank');})();` 
    },
    { id: 'b3', icon: '🧞‍♂️', title: '出張サイドバー', copyName: '🧞‍♂️ 出張サイドバー', copyUrl: `javascript:(function(){alert('出張サイドバー機能');})();` },
    { id: 'b4', icon: '👁️', title: '【神の目】チェッカー', copyName: '👁️【神の目】チェッカー', copyUrl: `javascript:(function(){alert('神の目システム起動');})();` },
    { id: 'b5', icon: '🚀', title: '【神速エディタ】', copyName: '🚀 【神速エディタ】', copyUrl: `javascript:(function(){alert('神速エディタ起動');})();` }
  ];

  useEffect(() => {
    // 時間による自動テーマ設定
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 16) setTheme("day");
    else if (hour >= 16 && hour < 19) setTheme("sunset");
    else setTheme("night");

    const savedUser = localStorage.getItem("team_portal_user");
    if (savedUser) setUserName(savedUser);
    
    const savedKpi = localStorage.getItem("team_portal_kpi");
    if (savedKpi) try { setKpi(JSON.parse(savedKpi)); } catch(e){}

    const savedMemo = localStorage.getItem("team_portal_quick_memo");
    if (savedMemo) setMemoText(savedMemo);

    const savedHistory = localStorage.getItem("clipboard_vault");
    if (savedHistory) setCopiedHistory(JSON.parse(savedHistory));

    const handleClickOutside = (event: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(event.target as Node)) setActiveDockTool(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const progressPercent = Math.min(100, Math.round((kpi.current / kpi.target) * 100));
  const { data: masterData } = useSWR(`/api/sheets-data?id=${MASTER_SHEET_ID}&range=${encodeURIComponent(CALCULATOR_RANGE)}`, fetcher);

  const handleTargetCopy = async (e: React.MouseEvent, text: string, id: string, type: 'name' | 'url') => { 
    e.stopPropagation();
    try { 
      await navigator.clipboard.writeText(text); 
      setCopiedStatus({ id, type });
      setTimeout(() => setCopiedStatus(null), 1200);
      
      const newHistory = [text, ...copiedHistory.filter(i => i !== text)].slice(0, 5);
      setCopiedHistory(newHistory);
      localStorage.setItem("clipboard_vault", JSON.stringify(newHistory));
    } catch (err) { alert("コピーに失敗しました"); } 
  };

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

  const themeIcon = theme === 'day' ? '☀️' : theme === 'sunset' ? '🌇' : '🌙';
  const themeLabel = theme === 'day' ? 'Day' : theme === 'sunset' ? 'Sunset' : 'Night';

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
          <div className="system-date">NODE ACTIVE</div>
        </header>

        <div className="bento-grid">
          {/* Slot A: KPI Dashboard */}
          <BentoCard title="KPI Dashboard" attraction="PERFORMANCE" desc="本日の獲得進捗と目標達成率" size="xlarge" onClick={() => router.push("/kpi-detail")}>
            <div className="kpi-visualization">
              <div className="kpi-main-stat">
                <span className="current-num">{kpi.current}</span>
                <span className="divider">/</span>
                <span className="target-num">{kpi.target}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
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

          <BentoCard title="データ一括登録" attraction="BULK REGISTER" desc="成約後データをマスターシートへ同期" delay={0.4} onClick={() => router.push("/bulk-register")} />
          <BentoCard title="アフィリエイト" attraction="LINK CONSOLE" desc="不動産各社のOBJリンクと重説フォーム" delay={0.5} onClick={() => router.push("/affiliate-links")} />
          <BentoCard title="メールテンプレ" attraction="TEMPLATES" delay={0.6} onClick={() => router.push("/email-template")} size="small" />
          <BentoCard title="SMS Kraken" attraction="MESSAGING" delay={0.7} onClick={() => router.push("/sms-kraken")} size="small" />
        </div>
      </main>

      {/* 🍏 Utility Dock */}
      <nav className="mac-dock-wrapper" ref={dockRef}>
        <div className="mac-dock">
          <div className={`mac-dock-item ${activeDockTool === 'vault' ? 'active' : ''}`} onClick={() => setActiveDockTool(activeDockTool === 'vault' ? null : 'vault')} data-tooltip="Clipboard">📋</div>
          <div className="mac-dock-item" onClick={() => router.push("/procedure-wizard")} data-tooltip="Manual">🐙</div>
          <div className="dock-divider"></div>
          <div className={`mac-dock-item ${activeDockTool === 'calc' ? 'active' : ''}`} onClick={() => setActiveDockTool(activeDockTool === 'calc' ? null : 'calc')} data-tooltip="Calculator">🧮</div>
          <div className={`mac-dock-item ${activeDockTool === 'bookmarks' ? 'active' : ''}`} onClick={() => setActiveDockTool(activeDockTool === 'bookmarks' ? null : 'bookmarks')} data-tooltip="Bookmarks">📌</div>
          <div className={`mac-dock-item ${activeDockTool === 'memo' ? 'active' : ''}`} onClick={() => setActiveDockTool(activeDockTool === 'memo' ? null : 'memo')} data-tooltip="Memo">🍯</div>
          <div className="dock-divider"></div>
          
          {/* ☀️/🌇/🌙 3テーマ切替 */}
          <div className="mac-dock-item theme-cycler" onClick={cycleTheme} data-tooltip={`Theme: ${themeLabel}`}>
            {themeIcon}
          </div>
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
              <input type="text" className="pop-input" placeholder="現在のプラン (例: 従量電灯B)" onChange={(e) => setCalcInput({...calcInput, plan: e.target.value})} />
              <input type="number" className="pop-input" placeholder="先月の電気代 (円)" onChange={(e) => setCalcInput({...calcInput, bill: e.target.value})} />
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
                placeholder="ここに自由にメモを残せます。自動保存されます。"
              />
            </div>
          </div>
        )}
      </nav>

      {/* ✨ 最高級 CSS: Mesh Gradient & Typography */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root { 
          /* Night Theme Defaults */
          --accent: #0ea5e9; 
          --bg-color: #020617;
          --card-bg: rgba(15, 23, 42, 0.65); 
          --border: rgba(255,255,255,0.1);
          --text-main: #f8fafc;
          --text-sub: #94a3b8;
          --dock-bg: rgba(255,255,255,0.05);
          --glow-shadow: 0 0 40px rgba(14, 165, 233, 0.2);
          --mesh-1: #0f172a; --mesh-2: #082f49; --mesh-3: #1e1b4b; --mesh-4: #020617;
        }
        
        .theme-day {
          --accent: #0284c7; 
          --bg-color: #f8fafc;
          --card-bg: rgba(255, 255, 255, 0.65);
          --border: rgba(0,0,0,0.08);
          --text-main: #0f172a;
          --text-sub: #475569;
          --dock-bg: rgba(0,0,0,0.05);
          --glow-shadow: 0 10px 30px rgba(2, 132, 199, 0.15);
          --mesh-1: #e0f2fe; --mesh-2: #fffbeb; --mesh-3: #f3e8ff; --mesh-4: #f8fafc;
        }

        .theme-sunset {
          --accent: #f43f5e; 
          --bg-color: #2a0a18;
          --card-bg: rgba(40, 10, 24, 0.65);
          --border: rgba(255,255,255,0.15);
          --text-main: #fff1f2;
          --text-sub: #fda4af;
          --dock-bg: rgba(255,255,255,0.08);
          --glow-shadow: 0 0 40px rgba(244, 63, 94, 0.2);
          --mesh-1: #4c0519; --mesh-2: #7c2d12; --mesh-3: #4a044e; --mesh-4: #2a0a18;
        }

        body { background: var(--bg-color); color: var(--text-main); font-family: 'Inter', sans-serif; overflow-x: hidden; transition: background 1s ease, color 0.5s ease; }
        
        .portal-container { min-height: 100vh; padding: 40px; position: relative; }
        
        /* 🌊 Dynamic Mesh Gradient Background */
        .mesh-bg { position: fixed; inset: 0; z-index: -3; background: var(--bg-color); overflow: hidden; transition: background 1s ease; }
        .mesh-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.8; animation: moveMesh 25s infinite alternate ease-in-out; transition: background 1s ease; }
        .blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: var(--mesh-1); animation-delay: 0s; }
        .blob-2 { top: 40%; right: -20%; width: 60vw; height: 60vw; background: var(--mesh-2); animation-delay: -5s; }
        .blob-3 { bottom: -20%; left: 20%; width: 70vw; height: 70vw; background: var(--mesh-3); animation-delay: -10s; }
        .blob-4 { top: 10%; left: 40%; width: 40vw; height: 40vw; background: var(--mesh-4); animation-delay: -15s; }
        @keyframes moveMesh { 0% { transform: translate(0, 0) scale(1); } 50% { transform: translate(5vw, 10vh) scale(1.1); } 100% { transform: translate(-5vw, -5vh) scale(0.9); } }
        
        /* Glass Texture Overlay */
        .glass-overlay { position: fixed; inset: 0; z-index: -2; background-image: radial-gradient(var(--border) 1px, transparent 1px); background-size: 24px 24px; opacity: 0.5; pointer-events: none; }

        .bento-layout-wrapper { max-width: 1200px; margin: 0 auto; z-index: 10; position: relative; }
        
        .portal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .operator-badge { display: flex; align-items: center; background: var(--card-bg); backdrop-filter: blur(16px); padding: 10px 20px; border-radius: 100px; border: 1px solid var(--border); font-size: 12px; color: var(--text-sub); box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: 0.5s; }
        .pulse-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-right: 10px; box-shadow: 0 0 10px #10b981; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        .system-date { font-size: 11px; font-weight: 900; color: var(--text-sub); letter-spacing: 2px; }
        
        /* 🍱 Bento Grid */
        .bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 160px; gap: 16px; margin-bottom: 100px; }
        .size-xlarge { grid-column: span 2; grid-row: span 2; }
        .size-tall { grid-column: span 1; grid-row: span 3; }
        .size-medium { grid-column: span 1; grid-row: span 1; }
        .size-small { grid-column: span 1; grid-row: span 1; }

        .bento-card-inner { height: 100%; border-radius: 28px; padding: 28px; position: relative; border: 1px solid var(--border); cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
        .glass-morphism { background: var(--card-bg); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); transition: background 0.5s, border-color 0.5s; }
        
        /* ✨ Calm Hover (Border Glow) */
        .calm-hover { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .calm-hover:hover { transform: translateY(-4px); border-color: var(--accent); box-shadow: var(--glow-shadow); }

        .card-top { display: flex; justify-content: space-between; }
        .attraction-tag { font-size: 10px; font-weight: 900; color: var(--accent); letter-spacing: 1.5px; text-transform: uppercase; }
        /* 📝 文字サイズを拡大！ */
        .card-title { font-size: 22px; font-weight: 900; margin: 6px 0; color: var(--text-main); transition: 0.3s; letter-spacing: 0.5px; }
        .calm-hover:hover .card-title { color: var(--accent); }
        .card-desc { font-size: 14px; color: var(--text-sub); line-height: 1.6; margin: 0; font-weight: 600; }

        /* KPI Visual (サイズ拡大) */
        .kpi-main-stat { display: flex; align-items: baseline; gap: 8px; margin-top: 10px; }
        .current-num { font-size: 72px; font-weight: 900; color: var(--text-main); line-height: 1; letter-spacing: -2px; }
        .target-num { font-size: 24px; color: var(--text-sub); font-weight: 800; }
        .progress-track { width: 100%; height: 10px; background: var(--border); border-radius: 10px; margin-top: 15px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), #818cf8); border-radius: 10px; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1); }

        /* Action Stack */
        .action-stack { gap: 16px; justify-content: flex-start; }
        .action-buttons-list { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; overflow-y: auto; padding-right: 4px; }
        .action-row-btn { display: flex; align-items: center; padding: 16px 20px; background: var(--dock-bg); border: 1px solid transparent; border-radius: 16px; transition: 0.2s; color: var(--text-main); cursor: pointer; }
        .action-row-btn:hover { background: rgba(14, 165, 233, 0.1); border-color: rgba(14, 165, 233, 0.3); transform: translateX(6px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .btn-icon { font-size: 18px; margin-right: 14px; }
        .btn-label { flex: 1; text-align: left; font-weight: 800; font-size: 15px; }
        .btn-arrow { opacity: 0.3; font-weight: 900; transition: 0.2s; font-size: 16px; }
        .action-row-btn:hover .btn-arrow { opacity: 1; color: var(--accent); transform: translateX(4px); }

        /* 🍏 Mac/visionOS Style Dock */
        .mac-dock-wrapper { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 1000; }
        .mac-dock { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--card-bg); backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); border-radius: 30px; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1); transition: background 0.5s, border-color 0.5s; }
        
        .mac-dock-item { width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 22px; transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1); position: relative; transform-origin: bottom; background: var(--dock-bg); color: var(--text-main); border: 1px solid transparent; }
        .mac-dock-item:hover { transform: scale(1.3) translateY(-8px); background: var(--card-bg); box-shadow: 0 15px 30px rgba(0,0,0,0.2); z-index: 10; border-color: var(--accent); }
        
        .mac-dock-item::before { content: attr(data-tooltip); position: absolute; top: -40px; background: var(--text-main); color: var(--bg-color); font-size: 11px; font-weight: 800; padding: 6px 12px; border-radius: 8px; opacity: 0; pointer-events: none; transition: 0.2s; white-space: nowrap; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transform: translateY(5px); }
        .mac-dock-item:hover::before { opacity: 1; transform: translateY(0); }
        
        .mac-dock-item.active::after { content: ''; position: absolute; bottom: -8px; width: 5px; height: 5px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 6px var(--accent); }
        .dock-divider { width: 1px; height: 28px; background: var(--border); }

        /* 💬 Popovers */
        .dock-popover { position: absolute; bottom: 95px; left: 50%; transform: translateX(-50%); width: 320px; background: var(--card-bg); backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); border-radius: 28px; border: 1px solid var(--border); padding: 24px; box-shadow: 0 30px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1); transform-origin: bottom center; animation: popUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); transition: background 0.5s; }
        @keyframes popUp { from { opacity: 0; transform: translateX(-50%) scale(0.9) translateY(10px); } to { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); } }
        
        .pop-header { font-size: 12px; font-weight: 900; color: var(--text-sub); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; text-align: center; border-bottom: 1px solid var(--border); padding-bottom: 12px; }
        .pop-content { display: flex; flex-direction: column; gap: 10px; max-height: 320px; overflow-y: auto; padding-right: 4px; }
        
        .pop-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: var(--dock-bg); border-radius: 14px; cursor: pointer; transition: 0.2s; border: 1px solid transparent; }
        .pop-row:hover { background: var(--card-bg); border-color: var(--border); transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .pop-text { font-size: 12px; font-weight: 800; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 190px; }
        .pop-icon { font-size: 14px; opacity: 0.5; transition: 0.2s; }
        .pop-row:hover .pop-icon { opacity: 1; color: var(--accent); }
        .pop-empty { text-align: center; font-size: 12px; color: var(--text-sub); padding: 20px 0; }

        .bookmark-group { margin-bottom: 16px; }
        .bm-title { font-size: 12px; font-weight: 900; color: var(--text-main); margin-bottom: 8px; margin-top: 10px; }
        .pop-badge { font-size: 10px; font-weight: 900; padding: 3px 8px; border-radius: 6px; margin-right: 10px; }
        .bg-orange { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }
        .bg-blue { background: rgba(14, 165, 233, 0.15); color: #0ea5e9; border: 1px solid rgba(14, 165, 233, 0.3); }
        .text-green { color: #10b981 !important; }

        .pop-input { width: 100%; padding: 14px; border-radius: 14px; border: 1px solid var(--border); background: var(--dock-bg); color: var(--text-main); font-size: 13px; font-weight: 800; outline: none; margin-bottom: 10px; transition: 0.2s; }
        .pop-input:focus { border-color: var(--accent); background: var(--card-bg); }
        .pop-btn { width: 100%; padding: 16px; border-radius: 14px; background: var(--accent); color: #fff; font-weight: 900; border: none; cursor: pointer; margin-top: 6px; transition: 0.2s; font-size: 14px; }
        .pop-btn:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3); }
        .calc-result-area { margin-top: 16px; padding: 18px; background: rgba(16, 185, 129, 0.1); border-radius: 16px; text-align: center; border: 1px solid rgba(16, 185, 129, 0.3); }
        .result-label { font-size: 11px; color: var(--text-sub); font-weight: 800; margin: 0 0 6px 0; }
        .result-value { font-size: 20px; color: #10b981; font-weight: 900; margin: 0; }

        .pop-textarea { width: 100%; height: 160px; padding: 16px; border-radius: 16px; border: 1px solid var(--border); background: var(--dock-bg); color: var(--text-main); font-size: 13px; font-weight: 800; outline: none; resize: none; transition: 0.2s; }
        .pop-textarea:focus { border-color: var(--accent); background: var(--card-bg); }

        .custom-scrollbar::-webkit-scrollbar, ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
      `}} />
    </div>
  );
}