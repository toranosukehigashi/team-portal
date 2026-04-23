"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// 🌟 3Dパララックス ＆ オーロラボーダー
const MagicCard = ({ title, attraction, desc, delay, onClick, badge, children, liveData, sparkline }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !innerRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(() => {
      if (innerRef.current) innerRef.current.style.transform = `perspective(1200px) rotateX(${-(y / 25)}deg) rotateY(${x / 25}deg)`;
      if (cardRef.current) {
        cardRef.current.style.setProperty('--mouse-x', `${mouseX}px`);
        cardRef.current.style.setProperty('--mouse-y', `${mouseY}px`);
      }
      if (glareRef.current) glareRef.current.style.transform = `translate(${(x / 25) * 4}px, ${-(y / 25) * 4}px)`;
    });
  };

  const handleMouseLeave = () => {
    if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    if (innerRef.current) innerRef.current.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg)`;
    if (glareRef.current) glareRef.current.style.transform = `translate(0px, 0px)`;
  };

  return (
    <div ref={cardRef} className="magic-card-wrapper fade-up-element fluid-card" style={{ "--delay": `${delay}s` } as React.CSSProperties} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={onClick}>
      <div ref={innerRef} className="magic-card glitch-hover" style={{ transition: "transform 0.1s ease-out" }}>
        <div className="card-aurora-border"></div>
        {sparkline && (
          <svg className="sparkline-bg" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path d="M0,28 Q10,15 20,22 T40,10 T60,18 T80,5 T100,12" fill="none" stroke="var(--accent-color)" strokeWidth="1.5" opacity="0.3" />
            <path d="M0,28 Q10,15 20,22 T40,10 T60,18 T80,5 T100,12 L100,30 L0,30 Z" fill="url(#sparkline-grad)" opacity="0.1" />
            <defs>
              <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.8"/><stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0"/></linearGradient>
            </defs>
          </svg>
        )}
        <div ref={glareRef} className="card-glare" style={{ transition: "transform 0.1s ease-out" }} />
        <div className="card-wave-bg"></div>
        <div className="card-content-3d">
          {badge && <span className="badge-new">{badge}</span>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <div className="attraction-name">{attraction}</div>
            {liveData && <div className="live-badge">{liveData}</div>}
          </div>
          <h2 className="card-title">{title}</h2>
          <p className="card-desc">{desc}</p>
          {children && <div className="card-custom-inner">{children}</div>}
        </div>
      </div>
    </div>
  );
};

// 🌐 案A: ライブ・データメッシュ
const DataMesh = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext("2d"); if (!ctx) return;
    let animationFrameId: number; let particles: { x: number, y: number, vx: number, vy: number, size: number }[] = [];
    const particleCount = 40;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize); resize();
    for (let i = 0; i < particleCount; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 1.0, vy: (Math.random() - 0.5) * 1.0, size: Math.random() * 2 + 1 });
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); const colorRGB = isDarkMode ? "56, 189, 248" : "14, 165, 233"; 
      for (let i = 0; i < particleCount; i++) {
        let p = particles[i]; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1; if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(${colorRGB}, 0.8)`; ctx.fill();
        for (let j = i + 1; j < particleCount; j++) {
          let p2 = particles[j]; let dist = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
          if (dist < 150) { ctx.beginPath(); ctx.strokeStyle = `rgba(${colorRGB}, ${1 - dist / 150})`; ctx.lineWidth = 1; ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animationFrameId); };
  }, [isDarkMode]);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -2, pointerEvents: "none" }} />;
};

// 🌊 案C: 流体ダッシュボード用 Gooey バックグラウンド
const GooeyBackground = () => (
  <>
    <svg style={{ position: 'fixed', width: 0, height: 0, pointerEvents: 'none' }}>
      <filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -15" result="goo" /><feBlend in="SourceGraphic" in2="goo" /></filter>
    </svg>
    <div className="gooey-container">
      <div className="gooey-blob blob-1"></div><div className="gooey-blob blob-2"></div><div className="gooey-blob blob-3"></div>
    </div>
  </>
);

export default function ThemeParkEntrance() {
  const router = useRouter();
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [userName, setUserName] = useState<string>("Guest");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [showMacWelcome, setShowMacWelcome] = useState(false);
  const [isInitialLogin, setIsInitialLogin] = useState(false);

  const [newsText, setNewsText] = useState("【お知らせ】本日はお疲れ様です！Team Portalへようこそ！");
  const [isEditingNews, setIsEditingNews] = useState(false);
  const [tempNews, setTempNews] = useState("");

  const [greeting, setGreeting] = useState("Hello");
  const [dynamicBg, setDynamicBg] = useState("");
  const [timeTheme, setTimeTheme] = useState("morning");

  const [animDelayOffset, setAnimDelayOffset] = useState(0.2);
  const [activeBookmark, setActiveBookmark] = useState<string | null>(null);

  // 💡 ここが新しい「コピー完了」のアニメーションを管理するStateです！
  const [copiedStatus, setCopiedStatus] = useState<{ id: string, type: 'name' | 'url' } | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // ⌨️ Cmd+K 検索用ステート
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [cmdKQuery, setCmdKQuery] = useState("");

  const [kpiData, setKpiData] = useState({ current: 0, target: 20 });
  const progressPercent = kpiData.target > 0 ? Math.min(100, Math.round((kpiData.current / kpiData.target) * 100)) : 0;

  // 💡 【重要】ここに実際のブックマーク名とURLを設定してください！！！
  // 例：「https://example.com」などのURLを入れると、それをコピーできるようになります！
  // 💡 【ここです！】app/page.tsx の 147行目付近
  const callTreeBookmarks = [
    { 
      id: 'b1', icon: '🐙', title: 'OBJ自動入力📝', 
      copyName: '🐙OBJ自動入力📝', 
      // 👇 このバッククォート( ` )で囲んだ中に、実際のコードをペーストしてください！
      copyUrl: `javascript:(function(){navigator.clipboard.readText().then(function(c){p(c);}).catch(function(){var j=prompt('⚠%EF%B8%8Fクリップボードの読み取りがブロックされました！\n手動で貼り付けてください:','');if(j)p(j);});function p(j){if(!j)return;var d;try{d=JSON.parse(j);}catch(e){alert('データの読み込みに失敗しました！コピーし直してください！');return;}function f(n,v){if(!v)return;var e=document.querySelector('input[name="'+n+'"]');if(!e)return;e.focus();var s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value").set;if(s){s.call(e,v);}else{e.value=v;}e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));e.blur();}var b=d.addressLine1||"";var m=b.match(/(.*?)([0-9０-９一二三四五六七八九十百]+丁目.*|[0-9０-９]+[-ー−].*|[0-9０-９]+)$/);if(m){b=m[2];}var bn=d.buildingName||"";var rn="";var bm=bn.match(/^(.*?)([\s%E3%80%80]+.*|[0-9０-９]+[-ー−0-9０-９]*号?[室]?)$/);if(bm){bn=bm[1].trim();rn=bm[2].trim();}var a=(d.propertyType&&d.propertyType.indexOf(%27集合%27)!==-1)||bn.length>0;function r(){var q=document.querySelectorAll(%27input[type="radio"][name="propertyType"]%27);for(var i=0;i<q.length;i++){var t=q[i].value===%27detachedHouse%27;if((a&&!t)||(!a&&t)){q[i].click();var s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"checked").set;if(s)s.call(q[i],true);q[i].dispatchEvent(new Event(%27change%27,{bubbles:true}));}}}r();setTimeout(function(){r();f(%27moveInDate%27,d.moveInDate);f(%27lastName%27,d.lastName);f(%27firstName%27,d.firstName);f(%27lastNameKatakana%27,d.lastNameKatakana);f(%27firstNameKatakana%27,d.firstNameKatakana);f(%27mobile%27,d.mobile);f(%27email%27,d.email);f(%27postcode%27,d.postcode);f(%27addressLine1%27,b);setTimeout(function(){if(a){f(%27buildingName%27,bn);f(%27roomNumber%27,rn);}alert(%27✨ Automatic input complete! Please check the contents!🐙%27);},300);},800);}})();
  console.log("URLをコピーしました");
})();` 
    },
    { 
      id: 'b2', icon: '🌲', title: 'CallTreeからOBJオープン！', 
      copyName: '🌲 CallTreeからOBJオープン！', 
      // 👇 ここも同じようにバッククォート( ` )で囲みます！
      copyUrl: `javascript:(function(){var d=document;var cln=function(s){return s.replace(/[\s%E3%80%80\(\)（）必須任意]/g,'');};var getCtx=function(){var els=d.querySelectorAll('#cel3NewHis');if(els.length===0)els=d.querySelectorAll('#cel3');if(els.length>0){var t=els[els.length-1].closest('table');if(t)return t.parentElement||t;}return d;};var ctx=getCtx();var gTh=function(w){var ts=ctx.querySelectorAll('th');for(var i=ts.length-1;i>=0;i--){var t=cln(ts[i].innerText);for(var j=0;j<w.length;j++){if(t===w[j]){var n=ts[i].nextElementSibling;if(n&&n.tagName.toLowerCase()==='td'&&n.innerText.trim()!=='')return n.innerText.trim();}}}return '';};var getL=function(q){var els=d.querySelectorAll(q);return els.length>0?els[els.length-1]:null;};var lN=getL('#cInfo_lNameNewHis')||getL('#cInfo_lName');var vL=lN?lN.innerText.trim():'';if(!vL)vL=gTh(['リスト名','リスト種別','リスト','業務名','キャンペーン名']);var tU='https://octopusenergy.co.jp/affiliate/in-house-simple?affiliate=in-house-simple';var mN={"My賃貸":"https://octopusenergy.co.jp/affiliate/05-ryosukehirokawa","春風不動産":"https://octopusenergy.co.jp/affiliate/03-ryosukehirokawa","エステートプラス":"https://octopusenergy.co.jp/affiliate/04-ryosukehirokawa","アパマンショップ蟹江店":"https://octopusenergy.co.jp/affiliate/01-yutainoue","不動産ランドすまいる":"https://octopusenergy.co.jp/affiliate/04-yutainoue","不動産ランド住まいる":"https://octopusenergy.co.jp/affiliate/04-yutainoue","ピタットハウス神宮南":"https://octopusenergy.co.jp/affiliate/05-yutainoue","Access":"https://octopusenergy.co.jp/affiliate/06-yutainoue","ルームコレクション":"https://octopusenergy.co.jp/affiliate/06-ryosukehirokawa","すまいらんど":"https://octopusenergy.co.jp/affiliate/07-ryosukehirokawa","株式会社東栄":"https://octopusenergy.co.jp/affiliate/08-ryosukehirokawa","株式会社STYプランニング":"https://octopusenergy.co.jp/affiliate/10-ryosukehirokawa","株式会社なごやか不動産":"https://octopusenergy.co.jp/affiliate/09-ryosukehirokawa","なごやか不動産":"https://octopusenergy.co.jp/affiliate/09-ryosukehirokawa","楽楽不動産":"https://octopusenergy.co.jp/affiliate/11-ryosukehirokawa?affiliate=11-ryosukehirokawa","楽々不動産":"https://octopusenergy.co.jp/affiliate/11-ryosukehirokawa?affiliate=11-ryosukehirokawa","ひまわりカンパニー":"https://octopusenergy.co.jp/affiliate/12-ryosukehirokawa","株式会社Terrace Home本店":"https://octopusenergy.co.jp/affiliate/14-ryosukehirokawa"};var mK={"芳賀":"https://octopusenergy.co.jp/affiliate/haga?affiliate=haga","アイユーホーム":"https://octopusenergy.co.jp/affiliate/aiy?affiliate=aiy","ニコニコ不動産":"https://octopusenergy.co.jp/affiliate/nikoniko?affiliate=nikoniko","洞口不動産":"https://octopusenergy.co.jp/affiliate/horaguchi2?affiliate=horaguchi2","スリーケー企画":"https://octopusenergy.co.jp/affiliate/3k?affiliate=3k","三世建物管理":"https://octopusenergy.co.jp/affiliate/sansei?affiliate=sansei","ランエステート":"https://octopusenergy.co.jp/affiliate/run?affiliate=run","トライホーム":"https://octopusenergy.co.jp/affiliate/tryhome?affiliate=tryhome","オクムラ":"https://octopusenergy.co.jp/affiliate/okm?affiliate=okm","ウィノベーション":"https://octopusenergy.co.jp/affiliate/win?affiliate=win","めぐみ企画":"https://octopusenergy.co.jp/affiliate/mgm?affiliate=mgm","カンリーコーポ":"https://octopusenergy.co.jp/affiliate/kanry?affiliate=kanry","株式会社フォーディー":"https://octopusenergy.co.jp/affiliate/4d","アンサンブル株式会社":"https://octopusenergy.co.jp/affiliate/ensem?affiliate=ensem","株式会社北総研":"https://octopusenergy.co.jp/affiliate/3k?affiliate=3k","フィリックス株式会社":"https://octopusenergy.co.jp/affiliate/felixchubu?affiliate=felixchubu"};if(vL==='名古屋'){var f=gTh(['不動産会社']);if(f&&mN[f]){tU=mN[f];}else if(f){alert('【注意】不動産会社「'+f+'」のURL設定が見つかりません！');}}else if(vL==='空室通電'){var n=gTh(['名前','お客様名','氏名','漢字名前']);if(!n){var c3List=d.querySelectorAll('#cel3NewHis');var c3=c3List.length>0?c3List[c3List.length-1]:null;if(!c3){var c3o=d.querySelectorAll('#cel3');c3=c3o.length>0?c3o[c3o.length-1]:null;}if(c3)n=c3.innerText.trim();}if(n){var m=n.match(/[（\(](.*?)[）\)]/);if(m&&m[1]){var c=m[1].trim();if(mK[c]){tU=mK[c];}else{alert('【注意】カッコ内の会社名「'+c+'」のURL設定が見つかりません！');}}else{alert('【注意】カッコ内の不動産会社が見つかりません！');}}}window.open(tU,'_blank');})();
  console.log("URLをコピーしました");
})();` 
    },
    { 
      id: 'b3', icon: '🧞‍♂️', title: '出張サイドバー', 
      copyName: '🧞‍♂️ 出張サイドバー', 
      // 👇 同様です！
      copyUrl: `javascript:(function(){var d=document;var sid='my-traveling-sidebar';if(d.getElementById(sid)){d.getElementById(sid).remove();return;}var div=d.createElement('div');div.id=sid;div.style.cssText='position:fixed;bottom:20px;right:20px;width:330px;max-height:95vh;overflow-y:auto;background:linear-gradient(135deg,rgba(224,242,254,0.35),rgba(237,233,254,0.35));backdrop-filter:blur(25px);-webkit-backdrop-filter:blur(25px);border:1px solid rgba(56,189,248,0.5);border-radius:16px;z-index:999999;box-shadow:0 15px 35px rgba(0,0,0,0.15),0 0 20px rgba(56,189,248,0.2);font-family:"Meiryo",sans-serif;color:#1e293b;';var style=d.createElement('style');style.textContent='#my-traveling-sidebar input,#my-traveling-sidebar textarea{box-sizing:border-box;width:100%;padding:10px;border:1px solid rgba(56,189,248,0.4);border-radius:8px;font-size:12px;outline:none;background:rgba(255,255,255,0.6);color:#0f172a;transition:0.2s;box-shadow:inset 0 1px 3px rgba(0,0,0,0.05)}#my-traveling-sidebar input:focus,#my-traveling-sidebar textarea:focus{border-color:#f59e0b;background:rgba(255,255,255,0.9);box-shadow:0 0 0 3px rgba(245,158,11,0.25),inset 0 1px 2px rgba(0,0,0,0.05);transform:translateY(-1px)}#my-traveling-sidebar ::-webkit-scrollbar{width:6px}#my-traveling-sidebar ::-webkit-scrollbar-track{background:transparent}#my-traveling-sidebar ::-webkit-scrollbar-thumb{background:rgba(56,189,248,0.6);border-radius:3px}#my-traveling-sidebar ::-webkit-scrollbar-thumb:hover{background:rgba(2,132,199,0.8)}#my-traveling-sidebar button{transition:0.2s;letter-spacing:1px}#my-traveling-sidebar button:hover{opacity:0.95;transform:translateY(-2px);box-shadow:0 6px 15px rgba(0,0,0,0.2)}#my-traveling-sidebar button:active{transform:translateY(1px);box-shadow:0 2px 4px rgba(0,0,0,0.1)}';d.head.appendChild(style);div.innerHTML='<div id="ts-drag-handle" style="background:linear-gradient(135deg, rgba(2,132,199,0.85), rgba(76,29,149,0.85)); color:white; padding:12px 15px; font-weight:900; font-size:14px; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; cursor:move; border-radius:15px 15px 0 0; border-bottom:1px solid rgba(255,255,255,0.3); backdrop-filter:blur(10px); text-shadow:0 1px 2px rgba(0,0,0,0.3);"><span>🧞%E2%80%8D♂%EF%B8%8F 出張サイドバー</span><span onclick="document.getElementById(\'my-traveling-sidebar\').remove()" style="cursor:pointer; background:rgba(255,255,255,0.2); padding:4px 10px; border-radius:6px; font-size:11px; border:1px solid rgba(255,255,255,0.3); transition:0.2s;" onmouseover="this.style.background=\'rgba(255,255,255,0.3)\'" onmouseout="this.style.background=\'rgba(255,255,255,0.2)\'">✖ 閉じる</span></div><div style="padding:15px; font-size:12px;"><details style="margin-bottom:15px; background:rgba(255,255,255,0.4); padding:10px; border-radius:12px; border:1px dashed rgba(56,189,248,0.5); box-shadow:0 4px 10px rgba(0,0,0,0.02);"><summary style="font-weight:900; color:#0284c7; cursor:pointer; outline:none; border-left:4px solid #0ea5e9; padding-left:8px;">💎 取得データ確認 (開閉)</summary><div style="margin-top:10px; display:flex; flex-direction:column; gap:8px;"><input type="text" id="ts-list" placeholder="リスト名"><input type="text" id="ts-phone" placeholder="電話番号"><div style="display:flex; gap:6px;"><input type="text" id="ts-last" placeholder="姓" style="width:50%;"><input type="text" id="ts-first" placeholder="名" style="width:50%;"></div><div style="display:flex; gap:6px;"><input type="text" id="ts-lastk" placeholder="姓カナ" style="width:50%;"><input type="text" id="ts-firstk" placeholder="名カナ" style="width:50%;"></div><input type="text" id="ts-address" placeholder="住所"></div></details><div style="margin-bottom:15px;"><label style="font-weight:900; color:#b45309; display:block; margin-bottom:8px; border-left:4px solid #f59e0b; padding-left:8px;">📜 魔法の絨毯 (履歴テンプレート)</label><textarea id="ts-template" style="height:200px; font-family:monospace; resize:vertical; background:rgba(255,251,235,0.7); border-color:rgba(245,158,11,0.4); color:#78350f;"></textarea></div><div style="display:flex; gap:10px;"><button id="ts-btn-get" style="flex:1; padding:12px; background:linear-gradient(135deg, #0ea5e9, #0284c7); color:white; border:1px solid rgba(255,255,255,0.3); border-radius:10px; font-weight:900; font-size:13px; cursor:pointer; box-shadow:0 4px 10px rgba(2,132,199,0.3);">🧞%E2%80%8D♂%EF%B8%8F 再取得</button><button id="ts-btn-copy-tpl" style="flex:1; padding:12px; background:linear-gradient(135deg, #f59e0b, #d97706); color:white; border:1px solid rgba(255,255,255,0.3); border-radius:10px; font-weight:900; font-size:13px; cursor:pointer; box-shadow:0 4px 10px rgba(217,119,6,0.3);">✨ コピー</button></div></div>';d.body.appendChild(div);var dragHandle=d.getElementById('ts-drag-handle');var isDragging=false;var startX,startY,initialX,initialY;dragHandle.addEventListener('mousedown',function(e){isDragging=true;startX=e.clientX;startY=e.clientY;var rect=div.getBoundingClientRect();div.style.bottom='';div.style.right='';div.style.left=rect.left+'px';div.style.top=rect.top+'px';initialX=rect.left;initialY=rect.top;d.addEventListener('mousemove',onMouseMove);d.addEventListener('mouseup',onMouseUp);e.preventDefault();});function onMouseMove(e){if(!isDragging)return;var dx=e.clientX-startX;var dy=e.clientY-startY;div.style.left=(initialX+dx)+'px';div.style.top=(initialY+dy)+'px';}function onMouseUp(e){isDragging=false;d.removeEventListener('mousemove',onMouseMove);d.removeEventListener('mouseup',onMouseUp);}var cln=function(s){return s.replace(/[\s\u3000\(\)（）必須任意]/g,'');};var rmC=function(s){var x=s.replace(/[（\(].*?[）\)]/g,' ');return x.replace(/株式会社|有限会社|合同会社|（株）|\(株\)/g,' ').trim();};var getL=function(q){var els=d.querySelectorAll(q);return els.length>0?els[els.length-1]:null;};var getCtx=function(){var els=d.querySelectorAll('#cel3NewHis');if(els.length===0)els=d.querySelectorAll('#cel3');if(els.length>0){var t=els[els.length-1].closest('table');if(t)return t.parentElement||t;}return d;};var gTh=function(w,ctx){var ts=ctx.querySelectorAll('th');for(var i=ts.length-1;i>=0;i--){var t=cln(ts[i].innerText);for(var j=0;j<w.length;j++){if(t===w[j]){var n=ts[i].nextElementSibling;if(n&&n.tagName.toLowerCase()==='td'&&n.innerText.trim()!=='')return n.innerText.trim();}}}return '';};var gAd=function(ctx){var ts=ctx.querySelectorAll('th');var p1='',p2='';for(var i=ts.length-1;i>=0;i--){var t=ts[i].innerText,n=ts[i].nextElementSibling;if(n&&n.tagName.toLowerCase()==='td'){if(t.indexOf('引越先住所1')!==-1&&p1==='')p1=n.innerText.trim();else if(t.indexOf('引越先住所2')!==-1&&p2==='')p2=n.innerText.trim();}}if(p1||p2)return(p1+' '+p2).trim();for(var j=ts.length-1;j>=0;j--){if(ts[j].innerText.indexOf('住所')!==-1){var nx=ts[j].nextElementSibling;if(nx&&nx.tagName.toLowerCase()==='td'&&nx.innerText.trim()!=='')return nx.innerText.trim();}}return '';};var fSp=function(s){var p=s.split(/[\s\u3000・.]+/);if(p.length>1&&p[1]!=='')return{l:p[0],f:p.slice(1).join('')};var x=p[0];if(x.length>2)return{l:x.substring(0,2),f:x.substring(2)};return{l:x,f:''};};var getD=function(id){return d.getElementById(id);};var run=function(){try{var ids=['ts-list','ts-phone','ts-last','ts-first','ts-lastk','ts-firstk','ts-address','ts-template'];for(var i=0;i<ids.length;i++)getD(ids[i]).value='';var ctx=getCtx();var lN=getL('#cInfo_lNameNewHis')||getL('#cInfo_lName');var vL=lN?lN.innerText.trim():'';if(!vL)vL=gTh(['リスト名','リスト種別','リスト','業務名','キャンペーン名'],ctx);getD('ts-list').value=vL;var tl=getL('select.telCel');var vP=tl?tl.value.trim():'';if(!vP)vP=gTh(['電話番号','携帯番号','連絡先'],ctx);getD('ts-phone').value=vP;var vLa='',vFi='',vLk='',vFk='';var rN=gTh(['漢字名前','お客様名','氏名','名前'],ctx);if(!rN){var c3=getL('#cel3NewHis')||getL('#cel3');if(c3)rN=c3.innerText.trim();}if(rN){var sp=fSp(rmC(rN));vLa=sp.l;vFi=sp.f;getD('ts-last').value=vLa;getD('ts-first').value=vFi;}var rK=gTh(['カナ名前','フリガナ','氏名かな','カナ'],ctx);if(rK){var sk=fSp(rmC(rK));vLk=sk.l;vFk=sk.f;getD('ts-lastk').value=vLk;getD('ts-firstk').value=vFk;}var vA=gAd(ctx);getD('ts-address').value=vA;var pM={"レ点アリ":"シンプル","WEBクルー":"シンプル","SUUMO":"シンプル","名古屋":"LL","侍アフィレ点":"シンプル","空室通電":"LL"};var pT=pM[vL]?pM[vL]:gTh(['プラン名','プラン','契約プラン','商材','商材名'],ctx);var aT=gTh(['アカウント番号','お客様番号','アカウント','契約番号'],ctx);var zT=gTh(['郵便番号','郵便'],ctx);var opEl=getL('#leftTopUserName');var opName='';if(opEl){opName=opEl.innerText.replace(/^OP/i,'').trim();}var vMail=gTh(['Email','メールアドレス','Mail','メール','Ｅメール','Eメール','E-mail','メアド'],ctx);var dt=new Date();var mm=("0"+(dt.getMonth()+1)).slice(-2);var dd=("0"+dt.getDate()).slice(-2);var td=mm+'/'+dd;var tpl="リスト種別："+vL+"\nプラン名："+pT+"\n受付日："+td+"\n担当者："+opName+"\n電話番号："+vP+"\nアカウント番号："+aT+"\n姓："+vLa+"\n名："+vFi+"\n姓（カナ）："+vLk+"\n名（カナ）："+vFk+"\n再点日：\n郵便番号："+zT+"\n住所："+vA+"\n送付先：引越先\nEmail："+vMail;getD('ts-template').value=tpl.replace(/\\n/g,'\n');}catch(e){console.log(e);}};run();getD('ts-btn-get').addEventListener('click',function(){run();var t=this.innerText;this.innerText="✨ 取得完了！";setTimeout(()=>{this.innerText=t;},1500);});getD('ts-btn-copy-tpl').addEventListener('click',function(){var t=getD('ts-template').value;var warpId=new Date().getTime();var finalCopyText="[WarpID:"+warpId+"]\n"+t;var ta=d.createElement('textarea');ta.value=finalCopyText;d.body.appendChild(ta);ta.select();d.execCommand('copy');d.body.removeChild(ta);var ot=this.innerText;this.innerText="✨ コピー完了！";this.style.background="linear-gradient(135deg, #10b981, #059669)";setTimeout(()=>{this.innerText=ot;this.style.background="linear-gradient(135deg, #f59e0b, #d97706)";},2000);});})();
      console.log("URLをコピーしました");
})();` 
    },
        { 
      id: 'b4', icon: '👁️', title: '【神の目】CallTree入力漏れチェッカー', 
      copyName: '👁️【神の目】CallTree入力漏れチェッカー', 
      // 👇 同様です！
      copyUrl: `javascript:(function(){var d=document;if(d.getElementById('providence-toast')){return;}var getV=function(q){var els=d.querySelectorAll(q);for(var i=els.length-1;i>=0;i--){if(els[i].offsetParent!==null)return els[i];}return null;};var toast=d.createElement('div');toast.id='providence-toast';toast.style.cssText='position:fixed;top:20px;right:20px;width:280px;padding:12px 16px;background:rgba(255,255,255,0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-left:5px solid #10b981;border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.15);font-family:"Meiryo",sans-serif;font-size:12px;color:#1e293b;z-index:999999;transition:all 0.3s ease;opacity:0;transform:translateY(-10px);pointer-events:none;';d.body.appendChild(toast);function showToast(msg,level){var icon='👁%EF%B8%8F';var color='#059669';var title='神の目システム';var bColor='#10b981';if(level==='error'){icon='🚨';color='#e11d48';title='入力漏れアラート';bColor='#e11d48';}else if(level==='warn'){icon='⚠%EF%B8%8F';color='#d97706';title='注意喚起アラート';bColor='#f59e0b';}toast.innerHTML='<div style="font-weight:900;margin-bottom:4px;display:flex;align-items:center;gap:6px;"><span style="font-size:16px;">'+icon+'</span> <span style="color:'+color+';">'+title+'</span></div><div style="color:#475569;line-height:1.4;">'+msg+'</div>';toast.style.borderLeftColor=bColor;toast.style.opacity='1';toast.style.transform='translateY(0)';}function hideToast(){toast.style.opacity='0';toast.style.transform='translateY(-10px)';}showToast('全方位監視システム（通常/小窓 両対応）を起動しました。','info');setTimeout(hideToast,3000);function setErr(el,isErr){if(!el)return;if(isErr){el.style.boxShadow='0 0 0 3px rgba(225,29,72,0.4)';el.style.borderColor='#e11d48';el.style.backgroundColor='#fff1f2';}else{el.style.boxShadow='';el.style.borderColor='';el.style.backgroundColor='';}}function setWarn(el,isWarn){if(!el)return;if(isWarn){el.style.boxShadow='0 0 0 3px rgba(245,158,11,0.5)';el.style.outline='2px solid #f59e0b';}else{el.style.boxShadow='';el.style.outline='';}}setInterval(function(){var errors=[];var warnings=[];var recallRadio=getV('input[name="radio_callResultNewHis"][value="再コール"], input[name="radio_callResult"][value="再コール"]');var pUser=getV('.PUserNewHis, #PUser');var dateCb=getV('.radio_RCDateTimeNewHis, #radio_RCDateTime');var dateInp=getV('.ShowRCDateNewHis, #ShowRCDate');if(recallRadio&&recallRadio.checked){if(pUser&&(pUser.value==='undefined'||pUser.value==='')){setErr(pUser,true);errors.push('・対応依頼（担当者）');}else{setErr(pUser,false);}if(dateCb&&!dateCb.checked){setErr(dateCb.parentElement,true);errors.push('・再コール日時のチェック');}else{setErr(dateCb.parentElement,false);}if(dateInp&&!dateInp.value){setErr(dateInp,true);errors.push('・再コールの詳細日付');}else{setErr(dateInp,false);}}else{setErr(pUser,false);if(dateCb)setErr(dateCb.parentElement,false);setErr(dateInp,false);}var futsuRadio=getV('input[name="radio_callResultNewHis"][value="不通"], input[name="radio_callResult"][value="不通"]');var latestHistoryTable=getV('#historyTable');var historyCount=latestHistoryTable?latestHistoryTable.querySelectorAll('tr').length:0;if(futsuRadio&&futsuRadio.checked){if(historyCount>=10){setWarn(futsuRadio.parentElement,true);warnings.push('対応履歴がすでに <b>'+historyCount+'件</b> あります！<br>不通での追跡は控えてください。');}else{setWarn(futsuRadio.parentElement,false);}}else{if(futsuRadio)setWarn(futsuRadio.parentElement,false);}var hTitles=d.querySelectorAll('.table1_title');var hTitle=null;for(var i=0;i<hTitles.length;i++){if(hTitles[i].innerText.indexOf('対応履歴')!==-1){hTitle=hTitles[i];break;}}if(hTitle){hTitle.style.position='relative';var bd=hTitle.querySelector('.providence-badge');if(bd){bd.innerText=historyCount+'件';}else{var sp=d.createElement('span');sp.className='providence-badge';sp.style.cssText='position:absolute;right:15px;top:50%;transform:translateY(-50%);background:linear-gradient(135deg, #a855f7, #7c3aed);color:#fff;padding:2px 8px;border-radius:8px;font-size:11px;font-weight:900;box-shadow:0 0 6px rgba(139,92,246,0.6);border:2px solid #7c3aed;white-space:nowrap;line-height:1.2;';sp.innerText=historyCount+'件';hTitle.appendChild(sp);}}if(errors.length>0||warnings.length>0){var msg='';if(errors.length>0)msg+='<span style="color:#e11d48;font-weight:bold;">【再コール設定不備】</span><br>'+errors.join('<br>')+(warnings.length>0?'<br><br>':'');if(warnings.length>0)msg+='<span style="color:#d97706;font-weight:bold;">【不通上限オーバー】</span><br>'+warnings.join('<br>');showToast(msg,errors.length>0?'error':'warn');}else{if(toast.style.opacity==='1'&&(toast.innerHTML.indexOf('🚨')!==-1||toast.innerHTML.indexOf('⚠%EF%B8%8F')!==-1)){hideToast();}}},1500);})();
      console.log("URLをコピーしました");
})();` 
    },
    { 
      id: 'b5', icon: '🚀', title: '【神速エディタ】', 
      copyName: '🚀 【神速エディタ】', 
      // 👇 同様です！
      copyUrl: `javascript:(function(){    var d=document;    if(d.getElementById('godspeed-panel')) return;    /* 手前に表示されている有効な要素を取得 */    var getV = function(q){        var els = d.querySelectorAll(q);        for(var i = els.length - 1; i >= 0; i--){            if(els[i].offsetParent !== null) return els[i];        }        return null;    };    function clickTarget(q){        var el = getV(q);        if(el && !el.disabled){ el.click(); return true; }        return false;    }    /* 📞 電話番号を画面から引っこ抜く魔法 */    function getPhone(){        var tl = getV('select.telCel');        if(tl && tl.value) return tl.value.replace(/[\s-ー]/g,'');        var ths = d.querySelectorAll('th');        for(var i=ths.length-1; i>=0; i--){            if(ths[i].innerText.indexOf('電話番号')!==-1 || ths[i].innerText.indexOf('携帯番号')!==-1 || ths[i].innerText.indexOf('連絡先')!==-1){                var nx = ths[i].nextElementSibling;                if(nx && nx.innerText.trim() !== '') return nx.innerText.replace(/[\s-ー]/g,'');            }        }        return '';    }    /* 🎹 1. マウスゼロ：Mac特化ショートカット神拳 */    if(!window.godspeedInit){        d.addEventListener('keydown', function(e){            /* 💾 Cmd (⌘) + Enter = 保存(通常) または 履歴作成(小窓) */            if(e.metaKey && e.key === 'Enter'){                e.preventDefault();                if(clickTarget('#creatednewbutton, #saveButton')) showCmdEffect('💾 保存/履歴作成を実行！');            }            /* 📴 Option (⌥) + 1 = 不通 */            if(e.altKey && (e.code === 'Digit1' || e.key === '1' || e.key === '¡')){                e.preventDefault();                if(clickTarget('input[name="radio_callResultNewHis"][value="不通"], input[name="radio_callResult"][value="不通"]')) showCmdEffect('📴 不通を選択');            }            /* 🎉 Option (⌥) + 2 = 獲得 */            if(e.altKey && (e.code === 'Digit2' || e.key === '2' || e.key === '™')){                e.preventDefault();                if(clickTarget('input[name="radio_callResultNewHis"][value="獲得"], input[name="radio_callResult"][value="獲得"]')) showCmdEffect('🎉 獲得を選択');            }            /* 🔍 Option (⌥) + S = 影の分身（マルチサーチ フルオート版！） */            if(e.altKey && (e.code === 'KeyS' || e.key === 's' || e.key === 'ß')){                e.preventDefault();                var phone = getPhone();                if(phone){                    /* ★ついに解明されたKraken直通URL！★ */                    var krakenUrl = 'https://support.oejp-kraken.energy/accounts/?q=' + phone;                    window.open(krakenUrl, '_blank');                    showCmdEffect('🔍 Krakenオート検索発動！');                } else {                    alert('電話番号が見つかりませんでした！');                }            }        });        window.godspeedInit = true;    }    /* 🧠 脳汁エフェクト（4%の高さ固定） */    function showCmdEffect(msg){        var el = d.createElement('div');        el.innerText = msg;        el.style.cssText = 'position:fixed;top:0%;left:60%;transform:translateX(-50%);background:rgba(15,23,42,0.85);backdrop-filter:blur(8px);color:#fff;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:bold;letter-spacing:1px;z-index:9999999;pointer-events:none;transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);opacity:0;box-shadow:0 8px 20px rgba(0,0,0,0.2);';        d.body.appendChild(el);        setTimeout(function(){ el.style.opacity = '1'; el.style.top = '4%'; }, 10);        setTimeout(function(){ el.style.opacity = '0'; el.style.top = '0%'; }, 800);        setTimeout(function(){ el.remove(); }, 1200);    }    /* 👆 2. ワンポチ錬成陣 ＆ 時空の跳躍パネル */    var panel = d.createElement('div');    panel.id = 'godspeed-panel';    panel.style.cssText = 'position:fixed;bottom:20px;left:20px;width:320px;background:rgba(255,255,255,0.85);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,0.15);z-index:999998;font-family:"Meiryo",sans-serif;overflow:hidden;border:1px solid #bfdbfe;';        var handle = d.createElement('div');    handle.style.cssText = 'background:linear-gradient(135deg, #3b82f6, #2563eb);color:white;padding:8px 12px;cursor:move;display:flex;justify-content:space-between;align-items:center;user-select:none;';    handle.innerHTML = '<div>⚡ <span style="font-weight:900;font-size:13px;">神速エディタ</span><span style="font-size:10px;margin-left:6px;color:#bfdbfe;">(⌥+S でKraken検索)</span></div>';    var closeBtn = d.createElement('span');    closeBtn.innerText = '✖';    closeBtn.style.cssText = 'cursor:pointer;font-size:12px;padding:2px 6px;background:rgba(255,255,255,0.2);border-radius:4px;transition:0.2s;';    closeBtn.onclick = function(e){ e.stopPropagation(); panel.remove(); };    handle.appendChild(closeBtn);    panel.appendChild(handle);    var content = d.createElement('div');    content.style.padding = '10px 12px';    /* =========================================================       🕒 時空の跳躍（タイム・リーパー）セクション    ========================================================= */    var timeLabel = d.createElement('div');    timeLabel.innerHTML = '<span style="font-weight:bold;color:#f59e0b;font-size:11px;">🕒 再コール一撃セット (08:00)</span>';    timeLabel.style.marginBottom = '4px';    content.appendChild(timeLabel);    var timeContainer = d.createElement('div');    timeContainer.style.display = 'flex';    timeContainer.style.gap = '6px';    timeContainer.style.marginBottom = '10px';    var timeBtns = [        { name: '明日', getD: function(){ var dt=new Date(); dt.setDate(dt.getDate()+1); return dt; } },        { name: '土曜', getD: function(){ var dt=new Date(); var diff = 6 - dt.getDay(); if(diff <= 0) diff += 7; dt.setDate(dt.getDate()+diff); return dt; } },        { name: '日曜', getD: function(){ var dt=new Date(); var diff = 0 - dt.getDay(); if(diff <= 0) diff += 7; dt.setDate(dt.getDate()+diff); return dt; } }    ];    timeBtns.forEach(function(tb){        var btn = d.createElement('button');        btn.innerText = tb.name;        btn.style.cssText = 'flex:1;background:#fffbeb;color:#d97706;border:1px solid #fde68a;border-radius:6px;padding:6px;font-size:11px;font-weight:bold;cursor:pointer;transition:0.2s;box-shadow:0 2px 4px rgba(0,0,0,0.05);';        btn.onclick = function(){            /* 1. 再コールを選択 */            clickTarget('input[name="radio_callResultNewHis"][value="再コール"], input[name="radio_callResult"][value="再コール"]');                        /* 2. 担当者を「OP東」等（左上の文字）に合わせる */            var opNameEl = d.getElementById('leftTopUserName');            if(opNameEl){                var opName = opNameEl.innerText.trim();                var pUserSel = getV('.PUserNewHis, #PUser');                if(pUserSel){                    for(var i=0; i<pUserSel.options.length; i++){                        if(pUserSel.options[i].text === opName){                            pUserSel.value = pUserSel.options[i].value;                            pUserSel.dispatchEvent(new Event('change', {bubbles:true}));                            break;                        }                    }                }            }            /* 3. 日時チェックボックスON */            var cb = getV('.radio_RCDateTimeNewHis, #radio_RCDateTime');            if(cb && !cb.checked){ cb.click(); }            /* 4. 日付の計算とセット (M月D日形式) */            var targetD = tb.getD();            var dateStr = (targetD.getMonth() + 1) + '月' + targetD.getDate() + '日';            var dateInp = getV('.ShowRCDateNewHis, #ShowRCDate');            if(dateInp){                dateInp.value = dateStr;                dateInp.dispatchEvent(new Event('input', {bubbles:true}));            }            /* 5. 時間と分のセット */            var hSel = getV('.RCTimeHNewHis, #RCTimeH');            var mSel = getV('.RCTimeMNewHis, #RCTimeM');            if(hSel){ hSel.value = '08'; hSel.dispatchEvent(new Event('change', {bubbles:true})); }            if(mSel){ mSel.value = '00'; mSel.dispatchEvent(new Event('change', {bubbles:true})); }            showCmdEffect('🕒 ' + tb.name + ' 08:00 にセット！');        };        timeContainer.appendChild(btn);    });    content.appendChild(timeContainer);    /* 📝 ワンポチ錬成陣セクション */    var tagLabel = d.createElement('div');    tagLabel.innerHTML = '<span style="font-weight:bold;color:#2563eb;font-size:11px;">📝 ワンポチ錬成陣</span>';    tagLabel.style.marginBottom = '4px';    content.appendChild(tagLabel);    var tags = ['今いそ', '他社比較検討', '引越日未定', '引越先未確定', '引越先と引越日未確定','重複', 'ガチャ切り', '先方からの連絡のみ', '審査中'];    var tagContainer = d.createElement('div');    tagContainer.style.display = 'flex';    tagContainer.style.flexWrap = 'wrap';    tagContainer.style.gap = '6px';    tags.forEach(function(t){        var btn = d.createElement('button');        btn.innerText = t;        btn.style.cssText = 'background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;border-radius:6px;padding:6px 10px;font-size:11px;cursor:pointer;font-weight:bold;transition:0.2s;box-shadow:0 2px 4px rgba(0,0,0,0.05);';        btn.onclick = function(){            var target = getV('.memoNewHis, #memo');            if(target){                var val = target.value;                var insert = '【' + t + '】';                target.value = val ? val + '\n' + insert : insert;                target.dispatchEvent(new Event('input', {bubbles:true}));                target.focus();                target.scrollTop = target.scrollHeight;            } else { alert('エラー：メモ欄が見つかりません！'); }        };        tagContainer.appendChild(btn);    });    content.appendChild(tagContainer);    panel.appendChild(content);    d.body.appendChild(panel);    /* ドラッグ機能 */    var isDragging = false, startX, startY, initialX, initialY;    handle.addEventListener('mousedown', function(e){        if(e.target === closeBtn) return;        isDragging = true; startX = e.clientX; startY = e.clientY;        var rect = panel.getBoundingClientRect();        panel.style.bottom = ''; panel.style.right = '';        panel.style.left = rect.left + 'px'; panel.style.top = rect.top + 'px';        initialX = rect.left; initialY = rect.top;        d.addEventListener('mousemove', onMouseMove);        d.addEventListener('mouseup', onMouseUp); e.preventDefault();    });    function onMouseMove(e){        if(!isDragging) return;        panel.style.left = (initialX + (e.clientX - startX)) + 'px';        panel.style.top = (initialY + (e.clientY - startY)) + 'px';    }    function onMouseUp(e){ isDragging = false; d.removeEventListener('mousemove', onMouseMove); d.removeEventListener('mouseup', onMouseUp); }})();
      console.log("URLをコピーしました");
})();` 
    }
  ];

  const allCmdKLinks = [
    { id: 'affiliate', name: "🔗 アフィリエイトリンクを開く", desc: "各不動産会社のOBJリンク、重説フォームのコピー", url: "/affiliate-links", search: ["リンク", "アフィリエイト", "affiliate", "link", "obj", "不動産", "重説", "コピー", "ポータル", "空室", "名古屋"] },
    { id: 'sim', name: "🆚 料金シミュレーターへ移動", desc: "乗り換え費用、スマホセット割、違約金の計算", url: "/simulator", search: ["sim", "シミュレーター", "料金", "cost", "見積もり", "比較", "乗り換え", "違約金", "スマホ割", "安く", "解約金", "シミュ", "計算"] },
    { id: 'toss', name: "🌐 ネットトス連携へ移動", desc: "フレッツ・光コラボ等の回線手配・情報送信", url: "/net-toss", search: ["toss", "トス", "ネット", "net", "フレッツ", "ドコモ光", "ソフトバンク光", "光コラボ", "事業者変更", "転用", "新規", "回線", "手配"] },
    { id: 'kraken', name: "🐙 Kraken マニュアルを開く", desc: "SMS送信、テンプレート、手続きの業務手順書", url: "/procedure-wizard", search: ["kraken", "マニュアル", "手順", "manual", "sms", "送信", "雛形", "テンプレ", "案内", "やり方", "ルール", "規定"] },
    { id: 'call', name: "🗓️ 再架電タイムラインを開く", desc: "掛け直し、不在、検討中顧客のスケジュール", url: "/callback-board", search: ["コール", "再架電", "タイムライン", "call", "callback", "不在", "掛け直し", "後確", "予定", "スケジュール", "アポ", "保留"] },
    { id: 'memo', name: "🍯 クイックメモを開く", desc: "通話中の情報一時退避、テキストコピー", action: () => setIsMemoOpen(true), search: ["メモ", "memo", "クイック", "一時保存", "コピペ", "テキスト", "控え", "ノート", "note"] },
  ];

  const filteredCmdKLinks = allCmdKLinks.filter(link => 
    cmdKQuery === "" || link.name.toLowerCase().includes(cmdKQuery.toLowerCase()) || link.search.some(keyword => keyword.includes(cmdKQuery.toLowerCase()))
  );

  useEffect(() => {
    // 💡 ① 日跨ぎチェック（強制ログアウト機能）を追加！！！
    const todayStr = new Date().toDateString(); // 今日の日付（例: "Thu Apr 23 2026"）
    const savedLoginDate = localStorage.getItem("team_portal_login_date");
    const savedUser = localStorage.getItem("team_portal_user");

    // ユーザー情報がある（ログインしている）場合の処理
    if (savedUser) {
      if (!savedLoginDate) {
        // まだ日付が保存されていない場合（今回のアプデ直後など）は今日をセット
        localStorage.setItem("team_portal_login_date", todayStr);
      } else if (savedLoginDate !== todayStr) {
        // 🚨 ログインした日と今日の日付が違う場合 ＝ 日を跨いだ！！！
        alert("📅 日付が変わりました。セキュリティ保護のため自動ログアウトしました！今日も一日頑張りましょう！☕️");
        localStorage.removeItem("team_portal_user");
        localStorage.removeItem("team_portal_login_date");
        router.push("/login");
        return; // これ以上下の処理を実行させない！
      }

      // 日付が一致していれば通常通り名前と権限をセット
      setUserName(savedUser); 
      if (savedUser.toLowerCase().trim().includes("toranosuke.higashi")) setIsAdmin(true); 
    } else {
      // そもそもログインしていない場合はログイン画面へ
      router.push("/login");
      return;
    }
    
    const justLoggedIn = sessionStorage.getItem("just_logged_in") === "true";
    let welcomeTimeout: NodeJS.Timeout | null = null;
    let readyTimeout: NodeJS.Timeout | null = null;

    if (justLoggedIn) {
      setIsInitialLogin(true); setShowMacWelcome(true); sessionStorage.removeItem("just_logged_in");
      welcomeTimeout = setTimeout(() => setShowMacWelcome(false), 3200); readyTimeout = setTimeout(() => setIsReady(true), 2600); setAnimDelayOffset(3.2);
    } else {
      setIsInitialLogin(false); setIsReady(true); setAnimDelayOffset(0.2);
    }

    const savedNews = localStorage.getItem("team_portal_news"); if (savedNews) setNewsText(savedNews);

    const loadKpi = () => {
      const savedKpi = localStorage.getItem("team_portal_kpi");
      if(savedKpi) {
        try {
          const parsed = JSON.parse(savedKpi);
          setKpiData({ current: Number(parsed.current) || 0, target: Number(parsed.target) || 20 });
        } catch(e){}
      }
    };
    loadKpi();

    window.addEventListener("storage", loadKpi);
    
    const observerTimer = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); }); }, { threshold: 0.05, rootMargin: "0px 0px 50px 0px" });
      document.querySelectorAll('.fade-up-element').forEach((el) => observer.observe(el));
    }, justLoggedIn ? 3400 : 200);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsCmdKOpen(prev => !prev); }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    return () => { 
      if (welcomeTimeout) clearTimeout(welcomeTimeout);
      if (readyTimeout) clearTimeout(readyTimeout);
      clearTimeout(observerTimer); 
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener("storage", loadKpi); 
    };
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) { 
      setGreeting("Good Morning ☀️"); 
      setTimeTheme("morning");
      setDynamicBg(isDarkMode ? "linear-gradient(135deg, #0f172a, #1e1b4b)" : "linear-gradient(135deg, #f0f9ff, #fdf4ff)"); 
    }
    else if (hour >= 12 && hour < 17) { 
      setGreeting("Good Afternoon ☕"); 
      setTimeTheme("afternoon");
      setDynamicBg(isDarkMode ? "linear-gradient(135deg, #1e1b4b, #312e81)" : "linear-gradient(135deg, #e0f2fe, #e0e7ff)"); 
    }
    else if (hour >= 17 && hour < 20) { 
      setGreeting("Good Evening 🌇"); 
      setTimeTheme("evening");
      setDynamicBg(isDarkMode ? "linear-gradient(135deg, #2a0a18, #1e1b4b)" : "linear-gradient(135deg, #fff7ed, #ffedd5)"); 
    }
    else { 
      setGreeting("Good Night 🌙"); 
      setTimeTheme("night");
      setDynamicBg(isDarkMode ? "radial-gradient(ellipse at bottom, #1e1b4b 0%, #020617 100%)" : "linear-gradient(135deg, #312e81, #1e1b4b)"); 
    }
  }, [isDarkMode]);

  const toggleTheme = () => { const newTheme = !isDarkMode; setIsDarkMode(newTheme); showToast(newTheme ? "🌙 ダークモードに切り替えました" : "☀️ ライトモードに切り替えました"); };

  const [isSimOpen, setIsSimOpen] = useState(false);
  const [targetDate, setTargetDate] = useState("");
  const [result, setResult] = useState<{ day3: string; day5Before: string; day5After: string } | null>(null);
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [memoText, setMemoText] = useState("");
  const [utilInput, setUtilInput] = useState("");
  const [utilResult, setUtilResult] = useState("郵便番号を入力してエリアを検索します。");

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

  const showToast = (msg: string) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: "" }), 3000); };
  const handleLogout = () => { localStorage.removeItem("team_portal_user"); router.push("/login"); };
  const handleClockOut = async () => { const now = new Date(); const hours = String(now.getHours()).padStart(2, "0"); const minutes = String(now.getMinutes()).padStart(2, "0"); try { await navigator.clipboard.writeText(`${hours}:${minutes} 退勤いたします`); showToast(`✨ 退勤メッセージをコピーしました！`); } catch (err) { alert("コピーに失敗しました"); } };
  
  // 💡 ここが魔法のコピー関数です！
  const handleTargetCopy = async (e: React.MouseEvent, text: string, label: string, id: string, type: 'name' | 'url') => { 
    e.stopPropagation();
    try { 
      await navigator.clipboard.writeText(text); 
      // 1. ポップオーバー内の表示を「✅ コピー完了！」に切り替える
      setCopiedStatus({ id, type });
      
      // 2. 1.2秒後に元に戻し、ポップオーバーをスッと閉じる
      setTimeout(() => {
        setCopiedStatus(null);
        setActiveBookmark(null); 
      }, 1200);

      // (念のため下部のトーストでもお知らせ)
      showToast(`📋 ${label}をコピーしました！`); 
    } catch (err) { 
      alert("コピーに失敗しました"); 
    } 
  };
  
  const calculateDeadlines = (dateStr: string) => {
    if (!dateStr) return;
    const holidays = ["2026/01/01", "2026/01/02", "2026/01/12", "2026/02/11", "2026/02/23", "2026/03/20", "2026/04/29", "2026/05/03", "2026/05/04", "2026/05/05", "2026/05/06"]; 
    const baseDate = new Date(dateStr.replace(/-/g, "/")); baseDate.setHours(0, 0, 0, 0);
    const isRestDay = (date: Date) => { const day = date.getDay(); const formatted = `${date.getFullYear()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${("0" + date.getDate()).slice(-2)}`; return (day === 0 || day === 6) || holidays.includes(formatted); };
    const getDeadline = (days: number, is15AfterForce: boolean) => {
      let current = new Date(baseDate); let count = 0; let targetDays = (isRestDay(baseDate) || is15AfterForce) ? days + 1 : days;
      while (count < targetDays) { current.setDate(current.getDate() + 1); if (!isRestDay(current)) count++; }
      const week = ["日", "月", "火", "水", "木", "金", "土"]; return `${("0" + (current.getMonth() + 1)).slice(-2)}/${("0" + current.getDate()).slice(-2)}(${week[current.getDay()]})`;
    };
    setResult({ day3: getDeadline(3, false), day5Before: getDeadline(5, false), day5After: getDeadline(5, true) });
  };
  const handleOpenSim = () => { const today = new Date(); const y = today.getFullYear(); const m = String(today.getMonth() + 1).padStart(2, '0'); const d = String(today.getDate()).padStart(2, '0'); const todayStr = `${y}-${m}-${d}`; setTargetDate(todayStr); calculateDeadlines(todayStr); setIsSimOpen(true); };
  const handleSaveNews = () => { setNewsText(tempNews); localStorage.setItem("team_portal_news", tempNews); setIsEditingNews(false); showToast("📢 お知らせを更新しました！"); };
  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { const val = e.target.value; setMemoText(val); localStorage.setItem("team_portal_quick_memo", val); };
  const handleCopyMemo = async () => { if(memoText){ await navigator.clipboard.writeText(memoText); showToast("📋 メモをコピーしました！"); } };
  const handleClearMemo = () => { if(confirm("メモをクリアしますか？")){ setMemoText(""); localStorage.removeItem("team_portal_quick_memo"); } };
  const copyUtilResult = async () => { if (utilResult.includes("📍")) { try { await navigator.clipboard.writeText(utilResult.replace("📍 ", "")); showToast("📋 住所をコピーしました！"); } catch (err) { alert("コピー失敗"); } } };

  const handleCmdKSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredCmdKLinks.length > 0) {
      const topLink = filteredCmdKLinks[0];
      if (topLink.url) { router.push(topLink.url); } else if (topLink.action) { topLink.action(); }
      setIsCmdKOpen(false); setCmdKQuery("");
    } else {
      showToast("該当する機能が見つかりません");
    }
  };

  const titleString = "Team Portal Workspace";
  const titleChars = titleString.split("");
  const welcomeTextRaw = `Welcome, ${userName}.`;
  const welcomeChars = welcomeTextRaw.split("");

  return (
    <div className={`global-theme-wrapper ${isDarkMode ? "theme-dark" : "theme-light"}`} onClick={() => setActiveBookmark(null)}>
      
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

      {/* ⌨️ Cmd + K パレット */}
      <div className={`modal-overlay ${isCmdKOpen ? "open" : ""}`} onClick={() => setIsCmdKOpen(false)} style={{zIndex: 99999}}>
        <div className="custom-modal cmdk-modal" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleCmdKSearch} style={{display: "flex", alignItems: "center", borderBottom: "1px solid var(--card-border)", paddingBottom: "15px", marginBottom: "15px"}}>
            <span style={{fontSize: "24px", marginRight: "15px"}}>🔍</span>
            <input type="text" autoFocus={isCmdKOpen} placeholder="例: フレッツ、リンク、メモ..." className="cmdk-input" value={cmdKQuery} onChange={(e) => setCmdKQuery(e.target.value)} />
            <span className="cmdk-esc" onClick={() => setIsCmdKOpen(false)}>ESC</span>
          </form>
          <div className="cmdk-list">
            <div className="cmdk-label">Suggested Links</div>
            {filteredCmdKLinks.length > 0 ? (
              filteredCmdKLinks.map(link => (
                <div key={link.id} className="cmdk-item glitch-hover" onClick={() => { if(link.url) router.push(link.url); else if(link.action) link.action(); setIsCmdKOpen(false); setCmdKQuery(""); }}>
                  <div className="cmdk-item-title">{link.name}</div>
                  <div className="cmdk-item-desc">{link.desc}</div>
                </div>
              ))
            ) : (
              <div style={{fontSize: "13px", color: "var(--text-sub)", padding: "10px", textAlign: "center"}}>一致する機能がありません😭</div>
            )}
          </div>
        </div>
      </div>

      <div className={`entrance-bg`} style={{ background: dynamicBg || "var(--bg-gradient)", transition: "background 2s ease" }}>
        <DataMesh isDarkMode={isDarkMode} />
      </div>
      <GooeyBackground />
      <svg className="magic-svg-bg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="magic-path" d="M -10,30 Q 30,80 50,50 T 110,40" />
        <path className="magic-path" d="M -10,70 Q 40,20 70,60 T 110,80" style={{animationDelay: "4s", opacity: 0.5}} />
      </svg>

      <main className={`app-wrapper ${isReady ? "ready" : ""} time-${timeTheme}`}>
        
        <style dangerouslySetInnerHTML={{ __html: `
          body { background-color: #020617; overflow-x: hidden; }
          .global-theme-wrapper * { box-sizing: border-box; }
          .global-theme-wrapper { width: 100%; min-height: 100vh; position: relative; overflow-x: clip; color: var(--text-main); transition: color 0.5s; font-family: 'Inter', 'Noto Sans JP', sans-serif; }

          .mac-welcome-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999999; display: flex; align-items: center; justify-content: center; animation: macFadeOut 0.6s cubic-bezier(0.8, 0, 0.2, 1) 2.6s forwards; }
          .mac-welcome-overlay.dark-fix-welcome { background: #000000; }
          .welcome-kinetic-char.white-fix-char { color: #ffffff; }
          .mac-welcome-text-container { font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 300; letter-spacing: 0.05em; display: flex; justify-content: center; flex-wrap: wrap; }
          .welcome-char-wrapper { display: inline-block; overflow: hidden; vertical-align: bottom; line-height: 1.2; padding-bottom: 5px; margin-bottom: -5px; }
          .welcome-kinetic-char { display: inline-block; transform: translateY(100%); opacity: 0; animation: slideUpWelcomeChar 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
          @keyframes slideUpWelcomeChar { to { transform: translateY(0); opacity: 1; } }
          @keyframes macFadeOut { to { opacity: 0; visibility: hidden; } }

          /* 🎨 テーマ */
          .theme-light { 
            --text-main: #1e293b; --text-sub: #475569; 
            --card-bg: rgba(255, 255, 255, 0.65); --card-border: rgba(255, 255, 255, 1); 
            --card-hover-border: #38bdf8; --card-hover-bg: rgba(255, 255, 255, 0.95); 
            --card-shadow: 0 10px 30px rgba(0,0,0,0.05); 
            --title-color: #0284c7; --accent-color: #0ea5e9; 
            --modal-bg: rgba(255, 255, 255, 0.95); --kpi-bg: rgba(241, 245, 249, 0.8); 
            --input-bg: rgba(255, 255, 255, 0.8); --svg-color: rgba(2, 132, 199, 0.2); 
          }
          .theme-dark { 
            --text-main: #f8fafc; --text-sub: #cbd5e1; 
            --card-bg: rgba(15, 23, 42, 0.6); --card-border: rgba(255, 255, 255, 0.15); 
            --card-hover-border: #fde047; --card-hover-bg: rgba(30, 41, 59, 0.8); 
            --card-shadow: 0 20px 50px rgba(0,0,0,0.8); 
            --title-color: #fde047; --accent-color: #fde047; 
            --modal-bg: rgba(15, 23, 42, 0.9); --kpi-bg: rgba(0, 0, 0, 0.4); 
            --input-bg: rgba(0, 0, 0, 0.4); --svg-color: rgba(255, 255, 255, 0.4); 
          }

          .app-wrapper { 
            padding: 20px; position: relative; z-index: 1; 
            opacity: 0; visibility: hidden; filter: blur(5px); transform: scale(0.98);
            transition: opacity 1.2s cubic-bezier(0.2, 0.8, 0.2, 1), filter 1.2s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1); 
          }
          .app-wrapper.ready { opacity: 1; visibility: visible; filter: blur(0); transform: scale(1); }
          
          .entrance-bg { position: fixed; top: -20vh; left: -20vw; width: 140vw; height: 140vh; z-index: -3; transition: background 2s ease; }
          .gooey-container { position: fixed; top: -20vh; left: -20vw; width: 140vw; height: 140vh; z-index: -2; pointer-events: none; filter: url(#goo); opacity: 0.4; overflow: hidden; }
          .theme-dark .gooey-container { opacity: 0.15; }
          .gooey-blob { position: absolute; border-radius: 50%; background: var(--accent-color); filter: blur(20px); }
          .blob-1 { width: 60vw; height: 60vw; top: 20%; left: 20%; animation: floatBlob 15s ease-in-out infinite alternate; }
          .blob-2 { width: 70vw; height: 70vw; top: 50%; right: 10%; animation: floatBlob 20s ease-in-out infinite alternate-reverse; background: #8b5cf6; }
          .blob-3 { width: 50vw; height: 50vw; bottom: 10%; left: 40%; animation: floatBlob 12s ease-in-out infinite alternate; background: #38bdf8; }
          @keyframes floatBlob { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(100px, 100px) scale(1.2); } }

          .magic-svg-bg { position: fixed; top: -20vh; left: -20vw; width: 140vw; height: 140vh; z-index: -1; pointer-events: none; opacity: 0.7; }
          .magic-path { fill: none; stroke: var(--svg-color); stroke-width: 3; stroke-dasharray: 3000; stroke-dashoffset: 3000; animation: drawMagic 10s ease-in-out infinite alternate; transition: stroke 0.5s; }
          @keyframes drawMagic { 0% { stroke-dashoffset: 3000; } 100% { stroke-dashoffset: 0; } }

          .avatar-circle { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #fde047, #f59e0b); display: flex; align-items: center; justify-content: center; color: #451a03; font-weight: 900; font-size: 18px; box-shadow: 0 0 10px rgba(250,204,21,0.5); flex-shrink: 0; }

          .magic-card { position: relative; border-radius: 20px; padding: 18px; background: var(--card-bg); backdrop-filter: blur(25px); display: flex; flex-direction: column; gap: 10px; height: 100%; cursor: pointer; box-shadow: var(--card-shadow); overflow: hidden; }
          .card-static-glow { position: absolute; inset: 0; border-radius: 20px; padding: 2px; background: linear-gradient(135deg, transparent, var(--card-hover-border), transparent); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0; transition: opacity 0.3s; pointer-events: none; z-index: 2; }
          .magic-card:hover .card-static-glow { opacity: 1; }

          .fluid-card { animation: fluidFloat 6s ease-in-out infinite alternate; }
          @keyframes fluidFloat { 0% { transform: translateY(0px); } 100% { transform: translateY(-8px); } }

          .glitch-hover:hover { animation: holoGlitch 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
          .btn-hover-shine:hover { animation: holoGlitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
          @keyframes holoGlitch {
            0% { transform: translate(0); text-shadow: 0 0 0 transparent; }
            20% { transform: translate(-2px, 1px); text-shadow: 2px 0 0 rgba(255,0,0,0.5), -2px 0 0 rgba(0,255,255,0.5); }
            40% { transform: translate(2px, -1px); text-shadow: -2px 0 0 rgba(255,0,0,0.5), 2px 0 0 rgba(0,255,255,0.5); }
            60% { transform: translate(-1px, 2px); text-shadow: 2px 0 0 rgba(255,0,0,0.5), -2px 0 0 rgba(0,255,255,0.5); }
            100% { transform: translate(0); text-shadow: 0 0 0 transparent; }
          }

          .dashboard-inner { max-width: 1400px; margin: 0 auto; position: relative; z-index: 10; }
          
          .context-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; flex-wrap: wrap; gap: 15px; }
          .context-greeting { font-size: 20px; font-weight: 900; color: var(--title-color); letter-spacing: 1px; display: flex; align-items: center; gap: 12px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); transition: color 0.5s; }
          .context-greeting span { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); }

          .cmdk-hint-bar { background: var(--input-bg); border: 1px solid var(--input-border); padding: 8px 15px; border-radius: 20px; display: flex; align-items: center; gap: 30px; font-size: 13px; font-weight: 800; color: var(--text-main); cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.05); backdrop-filter: blur(10px); transition: 0.3s; }
          .cmdk-hint-bar:hover { border-color: var(--card-hover-border); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
          .cmdk-shortcut { display: flex; gap: 4px; }
          .cmdk-shortcut kbd { background: var(--card-bg); border: 1px solid var(--card-border); padding: 2px 6px; border-radius: 4px; font-size: 10px; font-family: monospace; color: var(--text-sub); }

          .top-bar-actions { display: flex; gap: 15px; align-items: center; }
          .theme-toggle-btn { background: var(--card-bg); border: 1px solid var(--card-border); padding: 10px 15px; border-radius: 20px; transition: 0.3s; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); backdrop-filter: blur(8px); color: var(--text-main); cursor: pointer; }
          
          .park-title-container { text-align: center; margin-bottom: 50px; }
          .park-main-title { margin: 0 0 15px 0; display: flex; justify-content: center; flex-wrap: wrap; }
          .char-wrapper { display: inline-block; overflow: hidden; vertical-align: bottom; line-height: 1.3; margin-bottom: -10px; padding-bottom: 10px; }
          
          .kinetic-char { display: inline-block; font-size: clamp(40px, 6vw, 65px); font-weight: 900; letter-spacing: 2px; transform: translateY(120%); opacity: 0; background: linear-gradient(to bottom, #0284c7, #2563eb); -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: slideUpChar 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.1)); }
          .theme-dark .kinetic-char { background: linear-gradient(to bottom, #fde047, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .static-char { display: inline-block; font-size: clamp(40px, 6vw, 65px); font-weight: 900; letter-spacing: 2px; background: linear-gradient(to bottom, #0284c7, #2563eb); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.1)); transition: background 0.5s; }
          .theme-dark .static-char { background: linear-gradient(to bottom, #fde047, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          @keyframes slideUpChar { to { transform: translateY(0); opacity: 1; } }
          
          .park-sub-title { color: var(--text-sub); font-size: 16px; font-weight: 800; letter-spacing: 8px; text-transform: uppercase; opacity: 0; animation: fadeIn 1s ease forwards; }
          @keyframes fadeIn { to { opacity: 1; } }

          .quick-actions { display: flex; gap: 20px; justify-content: center; margin-top: 30px; }
          .btn-qa { padding: 14px 30px; border: none; border-radius: 30px; font-size: 14px; font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 2px; }
          
          .btn-hover-shine { position: relative; overflow: hidden; transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s; }
          .btn-hover-shine::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); transform: skewX(-20deg); transition: 0s; }
          .btn-hover-shine:hover { transform: translateY(-4px) scale(1.02); }
          .btn-hover-shine:hover::after { left: 200%; transition: left 0.6s ease-out; }

          .btn-clockout { background: linear-gradient(135deg, #ef4444, #9f1239); color: #fff; box-shadow: 0 5px 15px rgba(225, 29, 72, 0.3); }
          .btn-clockout:hover { box-shadow: 0 15px 35px rgba(225, 29, 72, 0.5); }
          .btn-sim { background: var(--card-bg); color: var(--title-color); border: 1px solid var(--card-border); backdrop-filter: blur(10px); box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
          .btn-sim:hover { background: var(--card-hover-bg); border-color: var(--card-hover-border); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
          .btn-logout { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
          .btn-logout:hover { background: rgba(239, 68, 68, 0.2); }

          .news-ticker-wrapper { display: flex; align-items: center; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 20px; margin-bottom: 40px; padding: 12px 25px; box-shadow: var(--card-shadow); backdrop-filter: blur(20px); transition: 0.5s; }
          .news-badge { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; font-weight: 900; font-size: 13px; padding: 8px 18px; border-radius: 12px; white-space: nowrap; margin-right: 25px; box-shadow: 0 0 15px rgba(245,158,11,0.4); letter-spacing: 2px; }
          .news-scroll-container { flex: 1; overflow: hidden; white-space: nowrap; position: relative; display: flex; align-items: center; }
          .news-text { display: inline-block; padding-left: 100%; animation: marquee 30s linear infinite; font-weight: 800; color: var(--text-main); font-size: 15px; letter-spacing: 1px; }
          @keyframes marquee { 0% { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }

          /* ✨ 3カラムレイアウト */
          .main-layout { display: flex; gap: 20px; margin-bottom: 50px; align-items: flex-start; justify-content: center; }
          .info-sidebar-wrapper { width: 280px; flex-shrink: 0; transition: width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s; overflow: visible; position: relative; z-index: 50; }
          .info-sidebar-wrapper.collapsed { width: 0px; opacity: 0; pointer-events: none; overflow: hidden; }
          
          .timeline-sidebar-wrapper { width: 280px; flex-shrink: 0; position: relative; z-index: 40; }
          .timeline-sidebar { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 20px; padding: 18px; box-shadow: var(--card-shadow); display: flex; flex-direction: column; gap: 12px; }
          .timeline-header { font-size: 14px; font-weight: 900; color: var(--title-color); border-bottom: 2px dashed var(--card-border); padding-bottom: 10px; margin-bottom: 5px; display: flex; justify-content: space-between; align-items: center; }
          .timeline-item { background: var(--input-bg); border: 1px solid var(--input-border); border-radius: 12px; padding: 12px; transition: 0.3s; cursor: pointer; border-left: 4px solid var(--card-border); }
          .timeline-item:hover { transform: translateX(-5px); border-color: var(--card-hover-border); box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
          .timeline-item.upcoming { border-left-color: #ef4444; background: linear-gradient(to right, rgba(239,68,68,0.05), var(--input-bg)); }
          .tl-time { font-size: 18px; font-weight: 900; color: var(--text-main); letter-spacing: 1px; display: flex; justify-content: space-between; }
          .tl-desc { font-size: 11px; font-weight: 800; color: var(--text-sub); margin-top: 4px; }
          .timeline-add-btn { background: rgba(14, 165, 233, 0.1); color: #0ea5e9; border: 1px dashed #0ea5e9; padding: 12px; border-radius: 12px; font-weight: 900; cursor: pointer; transition: 0.2s; text-align: center; }
          .timeline-add-btn:hover { background: #0ea5e9; color: #fff; }

          @media (max-width: 1100px) { .main-layout { flex-direction: column; } .info-sidebar-wrapper, .timeline-sidebar-wrapper { width: 100%; } .info-sidebar-wrapper.collapsed { height: 0; width: 100%; opacity: 0; } }

          .sidebar-toggle-btn { position: absolute; top: -35px; left: 0; background: transparent; border: none; color: var(--text-sub); font-weight: 900; font-size: 11px; cursor: pointer; display: flex; align-items: center; gap: 5px; opacity: 0.6; transition: 0.2s; letter-spacing: 1px; text-transform: uppercase; z-index: 60; }
          .sidebar-toggle-btn:hover { opacity: 1; color: var(--accent-color); }

          .info-sidebar { display: flex; flex-direction: column; gap: 20px; height: 100%; }
          .info-panel { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--card-border); border-radius: 20px; padding: 18px; box-shadow: var(--card-shadow); display: flex; flex-direction: column; }
          .info-title { font-size: 13px; font-weight: 900; color: var(--title-color); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; border-bottom: 2px dashed var(--card-border); padding-bottom: 10px; }

          .bookmark-wrapper { position: relative; margin-bottom: 8px; }
          .script-box { background: var(--input-bg); border: 1px solid var(--input-border); border-radius: 12px; padding: 10px 12px; transition: 0.3s; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
          .script-box:hover { border-color: var(--card-hover-border); transform: translateX(5px); box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          .script-title { font-weight: 900; font-size: 11px; color: var(--text-main); display: flex; align-items: center; gap: 6px; }

          /* 💡 コピー完了アニメーション用の緑色を反映させるCSS！ */
          .copied-success { color: #10b981 !important; font-weight: 900 !important; }

          .bookmark-popover { position: absolute; top: 50%; left: calc(100% + 15px); transform: translateY(-50%) scale(0.9); transform-origin: left center; background: var(--modal-bg); backdrop-filter: blur(30px); border: 1px solid var(--card-hover-border); border-radius: 16px; padding: 12px; width: 260px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); z-index: 9999; opacity: 0; animation: popoverIn 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; display: flex; flex-direction: column; gap: 8px; pointer-events: auto; }
          .theme-dark .bookmark-popover { box-shadow: 0 20px 40px rgba(0,0,0,0.8); }
          .bookmark-popover::before { content: ''; position: absolute; top: 50%; left: -6px; transform: translateY(-50%) rotate(45deg); width: 12px; height: 12px; background: var(--modal-bg); border-bottom: 1px solid var(--card-hover-border); border-left: 1px solid var(--card-hover-border); }
          @keyframes popoverIn { to { opacity: 1; transform: translateY(-50%) scale(1); } }

          @media (max-width: 1100px) {
            .bookmark-popover { top: calc(100% + 10px); left: 50%; transform: translateX(-50%) scale(0.9); transform-origin: top center; width: 90%; }
            .bookmark-popover::before { top: -6px; left: 50%; transform: translateX(-50%) rotate(45deg); border-bottom: none; border-left: none; border-top: 1px solid var(--card-hover-border); border-left: 1px solid var(--card-hover-border); }
            @keyframes popoverIn { to { opacity: 1; transform: translateX(-50%) scale(1); } }
          }

          .popover-header { font-size: 10px; color: var(--text-sub); font-weight: 900; margin-bottom: 4px; padding-left: 4px; letter-spacing: 1px; }
          .popover-row { display: flex; align-items: center; justify-content: space-between; background: var(--input-bg); border: 1px solid var(--input-border); padding: 8px 10px; border-radius: 10px; cursor: pointer; transition: 0.2s; }
          .popover-row:hover { background: var(--card-hover-bg); border-color: var(--card-hover-border); transform: translateX(2px); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
          .popover-badge { font-size: 10px; font-weight: 900; padding: 2px 6px; border-radius: 6px; white-space: nowrap; }
          .name-badge { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4); }
          .url-badge { background: rgba(14, 165, 233, 0.15); color: #0ea5e9; border: 1px solid rgba(14, 165, 233, 0.4); }
          .popover-text { font-size: 11px; font-weight: 800; color: var(--text-main); flex: 1; margin: 0 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.2s; }
          .popover-copy-icon { font-size: 12px; opacity: 0.6; transition: 0.2s; }
          .popover-row:hover .popover-copy-icon { opacity: 1; color: var(--accent-color); transform: scale(1.1); }

          .attraction-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; perspective: 1200px; align-content: flex-start; flex: 1; width: 100%; transition: 0.4s; }
          .fade-up-element { opacity: 0; transform: translateY(50px) scale(0.95); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); transition-delay: var(--delay); }
          .fade-up-element.visible { opacity: 1; transform: translateY(0) scale(1); }
          .magic-card-wrapper.visible:hover { transform: translateY(0) scale(1.02); z-index: 10; }

          .sparkline-bg { position: absolute; bottom: 0; left: 0; width: 100%; height: 50%; pointer-events: none; z-index: 0; }

          .card-glare { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 60%); pointer-events: none; z-index: 1; mix-blend-mode: overlay; transition: 0.5s; }
          .theme-dark .card-glare { background: radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 60%); }
          .card-content-3d { z-index: 2; position: relative; transform: translateZ(30px); transform-style: preserve-3d; display: flex; flex-direction: column; height: 100%; pointer-events: none; }
          
          .attraction-name { font-size: 9px; color: var(--accent-color); font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
          .card-title { font-size: 16px; font-weight: 900; color: var(--title-color); margin: 0; line-height: 1.4; letter-spacing: 1px; transition: color 0.3s; }
          .card-desc { font-size: 11px; color: var(--text-sub); margin: 6px 0 0 0; line-height: 1.5; font-weight: 700; transform: translateZ(15px); transition: color 0.3s; flex: 1; }
          .card-custom-inner { margin-top: 12px; transform: translateZ(25px); pointer-events: auto; }
          
          .badge-new { position: absolute; top: -8px; right: -8px; background: linear-gradient(135deg, #ef4444, #b91c1c); color: #fff; font-size: 9px; font-weight: 900; padding: 4px 10px; border-radius: 20px; z-index: 3; box-shadow: 0 5px 15px rgba(225,29,72,0.5); letter-spacing: 1px; }

          .live-badge { font-size: 9px; font-weight: 900; background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 3px 6px; border-radius: 6px; border: 1px solid rgba(16, 185, 129, 0.4); display: flex; align-items: center; gap: 4px; animation: pulseGreen 2s infinite; }
          .live-badge::before { content:''; width:5px; height:5px; background:#10b981; border-radius:50%; }
          @keyframes pulseGreen { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }

          .kpi-widget { background: var(--kpi-bg); padding: 10px; border-radius: 12px; border: 1px solid var(--card-border); transition: 0.5s; pointer-events: auto; }
          .kpi-numbers { display: flex; align-items: baseline; gap: 5px; margin-bottom: 4px; }
          .kpi-current { font-size: 20px; font-weight: 900; color: #38bdf8; }
          .kpi-target { font-size: 11px; font-weight: 800; color: var(--text-sub); }
          .kpi-bar-bg { width: 100%; height: 6px; background: rgba(0,0,0,0.1); border-radius: 3px; overflow: hidden; margin-top: 6px; }
          .theme-dark .kpi-bar-bg { background: rgba(255,255,255,0.1); }
          .kpi-bar-fill { height: 100%; background: linear-gradient(90deg, #38bdf8, #818cf8); border-radius: 3px; transition: width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }

          .quick-utility { position: fixed; bottom: 40px; right: 40px; z-index: 1000; }
          .utility-fab { width: 70px; height: 70px; background: linear-gradient(135deg, #fbbf24, #d97706); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(0,0,0,0.2), inset 0 0 15px rgba(255,255,255,0.6); transition: 0.3s; font-size: 28px; border: 2px solid rgba(255,255,255,0.6); list-style: none; cursor: pointer; flex-direction: column; gap: 2px; }
          .utility-content { position: absolute; bottom: 95px; right: 0; width: 360px; background: var(--modal-bg); backdrop-filter: blur(30px); padding: 30px; border-radius: 28px; box-shadow: 0 30px 70px rgba(0,0,0,0.2); border: 2px solid var(--card-border); color: var(--text-main); transform-origin: bottom right; animation: popIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); transition: 0.5s; }
          @keyframes popIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }

          .util-input { width: 100%; padding: 14px; border-radius: 12px; border: 2px solid var(--card-border); font-size: 15px; outline: none; background: var(--input-bg); font-weight: 800; color: var(--text-main); transition: 0.3s; }
          .util-input:focus { border-color: var(--card-hover-border); }
          .util-result { margin-top: 15px; font-size: 14px; color: var(--text-main); background: var(--kpi-bg); padding: 15px; border-radius: 12px; border: 1px solid var(--card-border); font-weight: 900; transition: 0.3s; cursor: pointer; }

          .cmdk-modal { width: 600px; padding: 25px; top: 15%; transform: translateY(-20px) scale(0.95); position: absolute; }
          .modal-overlay.open .cmdk-modal { transform: translateY(0) scale(1); }
          .cmdk-input { width: 100%; border: none; background: transparent; font-size: 20px; font-weight: 800; color: var(--text-main); outline: none; }
          .cmdk-esc { font-size: 10px; font-weight: 900; background: var(--card-border); padding: 4px 8px; border-radius: 6px; cursor: pointer; }
          .cmdk-list { display: flex; flex-direction: column; gap: 8px; }
          .cmdk-label { font-size: 11px; font-weight: 900; color: var(--text-sub); margin-top: 10px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
          .cmdk-item { padding: 12px 15px; border-radius: 10px; cursor: pointer; transition: 0.2s; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
          .cmdk-item-title { font-weight: 800; font-size: 14px; color: var(--text-main); }
          .cmdk-item-desc { font-size: 11px; color: var(--text-sub); font-weight: 600; opacity: 0.8; }
          .cmdk-item:hover { background: var(--accent-color); transform: translateX(5px); }
          .cmdk-item:hover .cmdk-item-title, .cmdk-item:hover .cmdk-item-desc { color: #fff; opacity: 1; }

          .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px); z-index: 1000; display: flex; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: 0.3s; }
          .modal-overlay.open { opacity: 1; pointer-events: auto; }
          .custom-modal { background: var(--modal-bg); backdrop-filter: blur(30px); width: 90%; padding: 40px; border-radius: 30px; box-shadow: 0 30px 80px rgba(0,0,0,0.3); border: 2px solid var(--card-border); transform: translateY(40px) scale(0.95); transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); display: flex; flex-direction: column; color: var(--text-main); }
          .modal-overlay.open .custom-modal { transform: translateY(0) scale(1); }
          .modal-title { font-size: 24px; font-weight: 900; text-align: center; margin-bottom: 30px; letter-spacing: 2px; color: var(--title-color); }
          
          .btn-close-modal { width: 100%; margin-top: 30px; padding: 15px; background: var(--kpi-bg); color: var(--text-main); border: 2px solid var(--card-border); border-radius: 15px; font-weight: 900; transition: 0.2s; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; }
          .btn-close-modal:hover { background: var(--card-hover-border); color: #fff; border-color: transparent; }

          #toast { visibility: hidden; position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%) translateY(20px); padding: 16px 32px; background: rgba(15,23,42, 0.95); color: #fde047; border-radius: 30px; font-weight: 900; font-size: 15px; z-index: 2000; opacity: 0; transition: 0.4s; backdrop-filter: blur(20px); border: 2px solid #fde047; box-shadow: 0 20px 50px rgba(0,0,0,0.3); letter-spacing: 1px; }
          #toast.show { visibility: visible; opacity: 1; transform: translateX(-50%) translateY(0); }
        `}} />

        <div className="dashboard-inner">
          
          <div className="context-header fade-up-element" style={{ "--delay": `${animDelayOffset}s` } as any}>
            <div className="context-greeting">
              <div className="avatar-circle">{userName.charAt(0).toUpperCase()}</div>
              {greeting}, <span style={{ color: "var(--accent-color)" }}>{userName}</span>.
            </div>
            
            <div className="top-bar-actions">
              <div className="cmdk-hint-bar btn-hover-shine" onClick={(e) => { e.stopPropagation(); setIsCmdKOpen(true); }}>
                <span style={{ opacity: 0.6 }}>🔍 Search or jump...</span>
                <div className="cmdk-shortcut"><kbd>⌘</kbd><kbd>K</kbd></div>
              </div>
              <button className="theme-toggle-btn btn-hover-shine" onClick={(e) => { e.stopPropagation(); toggleTheme(); }}>{isDarkMode ? "🎇" : "☀️"}</button>
            </div>
          </div>

          <div className="park-title-container">
            <h1 className="park-main-title">
              {titleChars.map((char, i) => (
                <span key={i} className={isInitialLogin ? "char-wrapper" : ""}>
                  <span className={isInitialLogin ? "kinetic-char" : "static-char"} style={isInitialLogin ? { animationDelay: `${i * 0.03 + animDelayOffset}s` } : {}}>
                    {char === " " ? "\u00A0" : char}
                  </span>
                </span>
              ))}
            </h1>
            <div className="park-sub-title" style={{ animationDelay: `${animDelayOffset + 0.6}s` }}>Central Operation Dashboard</div>
            
            <div className="quick-actions fade-up-element" style={{ "--delay": `${animDelayOffset + 0.3}s` } as any}>
              <button className="btn-qa btn-sim btn-hover-shine" onClick={(e) => { e.stopPropagation(); handleOpenSim(); }}>⏳ 納期確認</button>
              <button className="btn-qa btn-clockout btn-hover-shine" onClick={(e) => { e.stopPropagation(); handleClockOut(); }}>🏃‍♂️ 退勤する</button>
              <button className="btn-qa btn-logout btn-hover-shine" onClick={(e) => { e.stopPropagation(); handleLogout(); }}>🚪 ログアウト</button>
            </div>
          </div>

          <div className="news-ticker-wrapper fade-up-element" style={{ "--delay": `${animDelayOffset + 0.4}s` } as any}>
            <div className="news-badge">📢 information</div>
            <div className="news-scroll-container"><div className="news-text">{newsText}</div></div>
            {isAdmin && <button className="btn-hover-shine" style={{background: "var(--card-bg)", border:"1px solid var(--card-border)", color:"var(--text-main)", fontSize:"12px", fontWeight:900, padding:"8px 16px", borderRadius:"12px", marginLeft:"15px", cursor:"pointer"}} onClick={(e) => { e.stopPropagation(); setTempNews(newsText); setIsEditingNews(!isEditingNews); }}>✏️ 編集</button>}
          </div>

          {isAdmin && isEditingNews && (
            <div style={{display:"flex", gap:"10px", marginBottom:"40px", background:"var(--modal-bg)", padding:"20px", borderRadius:"16px", border:"2px dashed var(--card-border)", backdropFilter:"blur(15px)"}} onClick={(e) => e.stopPropagation()}>
              <input type="text" className="util-input" value={tempNews} onChange={(e) => setTempNews(e.target.value)} />
              <button className="btn-hover-shine" style={{background:"linear-gradient(135deg, #0ea5e9, #4f46e5)", color:"#fff", border:"none", padding:"0 25px", borderRadius:"10px", fontWeight:900, cursor:"pointer", boxShadow:"0 4px 15px rgba(2,132,199,0.3)"}} onClick={handleSaveNews}>保存</button>
            </div>
          )}

          <div className="main-layout">
            
            <div className={`info-sidebar-wrapper ${!isSidebarOpen ? "collapsed" : ""}`}>
              <button className="sidebar-toggle-btn" onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(false); }}>◀ 隠す</button>
              
              <aside className="info-sidebar">
                <div className="info-panel fade-up-element" style={{ "--delay": `${animDelayOffset + 0.5}s`, flex: 1 } as any}>
                  <h3 className="info-title">📋 CallTree & ブックマーク管理</h3>
                  <div style={{ fontSize: "11px", color: "var(--text-sub)", fontWeight: 800, marginBottom: "12px", lineHeight: 1.4 }}>
                    クリックして、コピーしたい内容を選択してください。
                  </div>
                  
                  {callTreeBookmarks.map(bm => (
                    <div key={bm.id} className="bookmark-wrapper">
                      <div className="script-box glitch-hover" onClick={(e) => { e.stopPropagation(); setActiveBookmark(activeBookmark === bm.id ? null : bm.id); }}>
                        <span className="script-title"><span className="script-icon">{bm.icon}</span> {bm.title}</span>
                      </div>
                      
                      {activeBookmark === bm.id && (
                        <div className="bookmark-popover" onClick={(e) => e.stopPropagation()}>
                          <div className="popover-header">🔗 コピーする項目</div>
                          
                          <div className="popover-row glitch-hover" onClick={(e) => handleTargetCopy(e, bm.copyName, "ブックマーク名", bm.id, 'name')}>
                            <span className="popover-badge name-badge">名前</span>
                            
                            {/* 💡 コピー完了時は文字が緑色で「✅ コピー完了！」に切り替わります！ */}
                            {copiedStatus?.id === bm.id && copiedStatus?.type === 'name' ? (
                              <span className="popover-text copied-success">✅ コピー完了！</span>
                            ) : (
                              <span className="popover-text">{bm.copyName}</span>
                            )}
                            
                            <span className="popover-copy-icon">
                              {copiedStatus?.id === bm.id && copiedStatus?.type === 'name' ? '✨' : '📋'}
                            </span>
                          </div>
                          
                          <div className="popover-row glitch-hover" onClick={(e) => handleTargetCopy(e, bm.copyUrl, "URL", bm.id, 'url')}>
                            <span className="popover-badge url-badge">URL</span>
                            
                            {/* 💡 こちらもURLコピー完了時に文字が切り替わります！ */}
                            {copiedStatus?.id === bm.id && copiedStatus?.type === 'url' ? (
                              <span className="popover-text copied-success">✅ コピー完了！</span>
                            ) : (
                              <span className="popover-text">{bm.copyUrl.substring(0, 18)}...</span>
                            )}
                            
                            <span className="popover-copy-icon">
                              {copiedStatus?.id === bm.id && copiedStatus?.type === 'url' ? '✨' : '📋'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </aside>
            </div>

            {!isSidebarOpen && (
              <button 
                className="btn-hover-shine"
                style={{ background: "var(--card-bg)", backdropFilter: "blur(10px)", border: "1px solid var(--card-border)", color: "var(--accent-color)", fontWeight: 900, padding: "10px 15px", borderRadius: "16px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", zIndex: 50 }} 
                onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(true); }}
              >
                <span>▶</span><span style={{fontSize:"10px"}}>開く</span>
              </button>
            )}

            <div className="attraction-grid">
              <MagicCard delay={animDelayOffset + 0.5} attraction="AFFILIATE LINKS" badge="NEW" title="🔗 アフィリエイトリンク" desc="各不動産会社のOBJリンクと共通重説フォームを素早くコピー。" onClick={(e: any) => { e.stopPropagation(); router.push("/affiliate-links"); }} />

              <MagicCard delay={animDelayOffset + 0.6} attraction="KPI DASHBOARD" title="📊 獲得進捗・KPI" desc="本日の目標まであと何件か、リアルタイムで確認。" liveData={`${progressPercent}%`} sparkline={true} onClick={(e: any) => { e.stopPropagation(); router.push("/kpi-detail"); }}>
                <div className="kpi-widget">
                  <div className="kpi-numbers"><span className="kpi-current">{kpiData.current}</span><span className="kpi-target">/ {kpiData.target}件</span></div>
                  <div className="kpi-bar-bg"><div className="kpi-bar-fill" style={{ width: `${progressPercent}%` }}></div></div>
                </div>
              </MagicCard>

              <MagicCard delay={animDelayOffset + 0.7} attraction="BULK REGISTER" title="📦 データ一括登録" desc="成約後シートに自動で書き込みます。" liveData="Ready" onClick={(e: any) => { e.stopPropagation(); router.push("/bulk-register"); }} />
              <MagicCard delay={animDelayOffset + 0.8} attraction="NET TOSS" title="🌐 ネットトス連携" desc="ネットトスFMTを作成します。" onClick={(e: any) => { e.stopPropagation(); router.push("/net-toss"); }} />
              <MagicCard delay={animDelayOffset + 0.9} attraction="SELF CLOSE" title="🤝 自己クロ連携" desc="自己クロFMTを作成します。" onClick={(e: any) => { e.stopPropagation(); router.push("/self-close"); }} />
              <MagicCard delay={animDelayOffset + 1.0} attraction="SMS KRAKEN" title="📱 SMS 送信" desc="Krakenを用いたSMS送信とテンプレート展開。" liveData="Active" onClick={(e: any) => { e.stopPropagation(); router.push("/sms-kraken"); }} />
              <MagicCard delay={animDelayOffset + 1.1} attraction="EMAIL TEMPLATE" title="✉️ メールテンプレ" desc="用途に応じたメール文面を素早く作成。" onClick={(e: any) => { e.stopPropagation(); router.push("/email-template"); }} />
              <MagicCard delay={animDelayOffset + 1.2} attraction="KRAKEN MANUAL" title="🐙 Kraken マニュアル" desc="様々なイレギュラーに対応できます。" onClick={(e: any) => { e.stopPropagation(); router.push("/procedure-wizard"); }} />
              <MagicCard delay={animDelayOffset + 1.3} attraction="COST SIMULATOR" title="🆚 料金シミュレーター" desc="利用状況などをもとに、回線を提案します。" liveData="Avg. ¥4,200" onClick={(e: any) => { e.stopPropagation(); router.push("/simulator"); }} />

              <MagicCard delay={animDelayOffset + 1.4} attraction="QUICK MEMO" title="🍯 クイックメモ" desc="通話中などの一時的な情報を置いておくメモパッド。" onClick={(e: any) => { e.stopPropagation(); setIsMemoOpen(true); }}>
                {memoText ? (
                  <div className="util-result" style={{marginTop:0, padding:"10px", fontSize:"11px", opacity: 0.8}}>
                    {memoText.length > 20 ? memoText.substring(0, 20) + "..." : memoText}
                  </div>
                ) : (
                  <div className="util-result" style={{marginTop:0, padding:"10px", fontSize:"11px", opacity: 0.5}}>No active memo.</div>
                )}
              </MagicCard>
            </div>

            <div className="timeline-sidebar-wrapper fade-up-element" style={{ "--delay": `${animDelayOffset + 0.6}s` } as any}>
              <aside className="timeline-sidebar">
                <div className="timeline-header">
                  <span>🗓️ 再架電タイムライン</span>
                  <span style={{background: "#ef4444", color: "#fff", padding: "2px 6px", borderRadius: "10px", fontSize: "10px"}}>3 Tasks</span>
                </div>
                
                <div className="timeline-item upcoming" onClick={(e) => { e.stopPropagation(); router.push("/callback-board"); }}>
                  <div className="tl-time">16:30 <span style={{fontSize:"10px", color:"#ef4444"}}>In 15m</span></div>
                  <div className="tl-desc">山田様 / auひかり検討中</div>
                </div>
                
                <div className="timeline-item" onClick={(e) => { e.stopPropagation(); router.push("/callback-board"); }}>
                  <div className="tl-time">18:00</div>
                  <div className="tl-desc">鈴木様 / 家族に相談後</div>
                </div>

                <div className="timeline-item" onClick={(e) => { e.stopPropagation(); router.push("/callback-board"); }}>
                  <div className="tl-time">19:30</div>
                  <div className="tl-desc">田中様 / 帰宅時間狙い</div>
                </div>
                
                <button className="timeline-add-btn" onClick={(e) => { e.stopPropagation(); router.push("/callback-board"); }}>＋ 新規追加</button>
              </aside>
            </div>

          </div>
        </div>

        <details className="quick-utility hide-on-mobile fade-up-element" style={{ "--delay": `${animDelayOffset + 1.5}s` } as any} onClick={(e) => e.stopPropagation()}>
          <summary className="utility-fab btn-hover-shine" style={{listStyle:"none", border:"none", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"28px", cursor:"pointer"}}>
            🔍 <span style={{fontSize: "9px", fontWeight: 900, marginTop: "-5px", opacity: 0.8}}>Cmd+K</span>
          </summary>
          <div className="utility-content">
            <h4 style={{margin: "0 0 15px 0", fontSize: "16px", fontWeight: 900, color: "var(--title-color)", borderBottom: "2px dashed var(--card-border)", paddingBottom: "10px"}}>📍 住所クイック検索</h4>
            <input type="text" className="util-input" placeholder="郵便番号を入力 (例: 1000001)" value={utilInput} onChange={(e) => setUtilInput(e.target.value)} />
            <div className="util-result glitch-hover" onClick={copyUtilResult}>{utilResult}</div>
          </div>
        </details>

        <div className={`modal-overlay ${isSimOpen ? "open" : ""}`} onClick={() => setIsSimOpen(false)}>
          <div className="custom-modal" style={{maxWidth: "400px"}} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">⏳ 納期確認</div>
            <label style={{ fontSize: "12px", fontWeight: 900, color: "var(--text-sub)", marginBottom: "8px", display: "block" }}>基準日（受付日）を変更</label>
            <input type="date" className="util-input" style={{marginBottom:"25px"}} value={targetDate} onChange={(e) => { setTargetDate(e.target.value); calculateDeadlines(e.target.value); }} />
            {result && (
              <div className="kpi-widget" style={{display:"flex", flexDirection:"column", gap:"12px"}}>
                <div style={{display:"flex", justifyContent:"space-between", borderBottom:"1px dashed var(--card-border)", paddingBottom:"10px"}}><span style={{fontSize:"13px", fontWeight:800}}>3日後（通常）</span><span style={{fontSize:"16px", fontWeight:900, color:"var(--title-color)"}}>{result.day3}</span></div>
                <div style={{display:"flex", justifyContent:"space-between", borderBottom:"1px dashed var(--card-border)", paddingBottom:"10px"}}><span style={{fontSize:"13px", fontWeight:800}}>5日後（15時前）</span><span style={{fontSize:"16px", fontWeight:900, color:"var(--title-color)"}}>{result.day5Before}</span></div>
                <div style={{display:"flex", justifyContent:"space-between"}}><span style={{fontSize:"13px", fontWeight:800}}>5日後（15時後）</span><span style={{fontSize:"16px", fontWeight:900, color:"var(--title-color)"}}>{result.day5After}</span></div>
              </div>
            )}
            <button className="btn-close-modal btn-hover-shine" onClick={() => { setIsSimOpen(false); setResult(null); setTargetDate(""); }}>閉じる</button>
          </div>
        </div>

        <div className={`modal-overlay ${isMemoOpen ? "open" : ""}`} onClick={() => setIsMemoOpen(false)}>
          <div className="custom-modal" style={{maxWidth: "600px", height: "80vh"}} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">📝 クイックメモ</div>
            <textarea className="util-input" style={{flex:1, resize:"none", lineHeight:1.6}} placeholder="電話中のメモや、一時的なテキストの退避に。&#10;入力した内容は自動でブラウザに保存されます。" value={memoText} onChange={handleMemoChange} />
            <div style={{display:"flex", gap:"15px", marginTop:"20px"}}>
              <button className="btn-hover-shine" style={{flex:1, padding:"14px", borderRadius:"14px", fontWeight:900, border:"2px solid #0ea5e9", background:"rgba(14, 165, 233, 0.1)", color:"#0ea5e9", cursor:"pointer"}} onClick={handleCopyMemo}>📋 全文コピー</button>
              <button className="btn-hover-shine" style={{flex:1, padding:"14px", borderRadius:"14px", fontWeight:900, border:"2px solid #ef4444", background:"rgba(239, 68, 68, 0.1)", color:"#ef4444", cursor:"pointer"}} onClick={handleClearMemo}>🗑️ 全消去</button>
            </div>
            <button className="btn-close-modal btn-hover-shine" onClick={() => setIsMemoOpen(false)}>閉じる</button>
          </div>
        </div>

        <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>
      </main>
    </div>
  );
}