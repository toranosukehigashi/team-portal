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

// 🌟 BentoCard Component (3D傾き廃止 -> 上品な浮遊とBorder Glow)
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

export default function SaaSIntegratedHome() {
  const router = useRouter();
  const [userName, setUserName] = useState("Guest");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeDockTool, setActiveDockTool] = useState<string | null>(null);
  
  // Dockツール用ステート
  const [copiedHistory, setCopiedHistory] = useState<string[]>([]);
  const [memoText, setMemoText] = useState("");
  const [calcInput, setCalcInput] = useState({ company: "", plan: "", amp: "30", bill: "" });
  const [calcResult, setCalcResult] = useState<number | null>(null);
  
  // ブックマークステート
  const [copiedStatus, setCopiedStatus] = useState<{ id: string, type: 'name' | 'url' } | null>(null);

  const [kpi, setKpi] = useState({ current: 0, target: 20 });

  // 💡 以前の強力なブックマークデータを完全復元
  const callTreeBookmarks = [
    { 
      id: 'b1', icon: '🐙', title: 'OBJ自動入力📝', copyName: '🐙OBJ自動入力📝', 
      copyUrl: `javascript:(function(){navigator.clipboard.readText().then(function(c){p(c);}).catch(function(){var j=prompt('⚠️クリップボードの読み取りがブロックされました！\\n手動で貼り付けてください:','');if(j)p(j);});function p(j){if(!j)return;var d;try{d=JSON.parse(j);}catch(e){alert('データの読み込みに失敗しました！コピーし直してください！');return;}function f(n,v){if(!v)return;var e=document.querySelector('input[name="'+n+'"]');if(!e)return;e.focus();var s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value").set;if(s){s.call(e,v);}else{e.value=v;}e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));e.blur();}var b=d.addressLine1||"";var m=b.match(/(.*?)([0-9０-９一二三四五六七八九十百]+丁目.*|[0-9０-９]+[-ー−].*|[0-9０-９]+)$/);if(m){b=m[2];}var bn=d.buildingName||"";var rn="";var bm=bn.match(/^(.*?)([\\s\\u3000]+.*|[0-9０-９]+[-ー−0-9０-９]*号?[室]?)$/);if(bm){bn=bm[1].trim();rn=bm[2].trim();}var a=(d.propertyType&&d.propertyType.indexOf('集合')!==-1)||bn.length>0;function r(){var q=document.querySelectorAll('input[type="radio"][name="propertyType"]');for(var i=0;i<q.length;i++){var t=q[i].value==='detachedHouse';if((a&&!t)||(!a&&t)){q[i].click();var s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"checked").set;if(s)s.call(q[i],true);q[i].dispatchEvent(new Event('change',{bubbles:true}));}}}r();setTimeout(function(){r();f('moveInDate',d.moveInDate);f('lastName',d.lastName);f('firstName',d.firstName);f('lastNameKatakana',d.lastNameKatakana);f('firstNameKatakana',d.firstNameKatakana);f('mobile',d.mobile);f('email',d.email);f('postcode',d.postcode);f('addressLine1',b);setTimeout(function(){if(a){f('buildingName',bn);f('roomNumber',rn);}alert('✨ Automatic input complete! Please check the contents!🐙');},300);},800);}})();` 
    },
    { 
      id: 'b2', icon: '🌲', title: 'CallTreeからOBJオープン！', copyName: '🌲 CallTreeからOBJオープン！', 
      copyUrl: `javascript:(function(){var d=document;var cln=function(s){return s.replace(/[\\s\\u3000\\(\\)\\（\\）必須任意]/g,'');};var getCtx=function(){var els=d.querySelectorAll('#cel3NewHis');if(els.length===0)els=d.querySelectorAll('#cel3');if(els.length>0){var t=els[els.length-1].closest('table');if(t)return t.parentElement||t;}return d;};var ctx=getCtx();var gTh=function(w){var ts=ctx.querySelectorAll('th');for(var i=ts.length-1;i>=0;i--){var t=cln(ts[i].innerText);for(var j=0;j<w.length;j++){if(t===w[j]){var n=ts[i].nextElementSibling;if(n&&n.tagName.toLowerCase()==='td'&&n.innerText.trim()!=='')return n.innerText.trim();}}}return '';};var getL=function(q){var els=d.querySelectorAll(q);return els.length>0?els[els.length-1]:null;};var lN=getL('#cInfo_lNameNewHis')||getL('#cInfo_lName');var vL=lN?lN.innerText.trim():'';if(!vL)vL=gTh(['リスト名','リスト種別','リスト','業務名','キャンペーン名']);var tU='https://octopusenergy.co.jp/affiliate/in-house-simple?affiliate=in-house-simple';var mN={"My賃貸":"https://octopusenergy.co.jp/affiliate/05-ryosukehirokawa","春風不動産":"https://octopusenergy.co.jp/affiliate/03-ryosukehirokawa","エステートプラス":"https://octopusenergy.co.jp/affiliate/04-ryosukehirokawa","アパマンショップ蟹江店":"https://octopusenergy.co.jp/affiliate/01-yutainoue","不動産ランドすまいる":"https://octopusenergy.co.jp/affiliate/04-yutainoue","不動産ランド住まいる":"https://octopusenergy.co.jp/affiliate/04-yutainoue","ピタットハウス神宮南":"https://octopusenergy.co.jp/affiliate/05-yutainoue","Access":"https://octopusenergy.co.jp/affiliate/06-yutainoue","ルームコレクション":"https://octopusenergy.co.jp/affiliate/06-ryosukehirokawa","すまいらんど":"https://octopusenergy.co.jp/affiliate/07-ryosukehirokawa","株式会社東栄":"https://octopusenergy.co.jp/affiliate/08-ryosukehirokawa","株式会社STYプランニング":"https://octopusenergy.co.jp/affiliate/10-ryosukehirokawa","株式会社なごやか不動産":"https://octopusenergy.co.jp/affiliate/09-ryosukehirokawa","なごやか不動産":"https://octopusenergy.co.jp/affiliate/09-ryosukehirokawa","楽楽不動産":"https://octopusenergy.co.jp/affiliate/11-ryosukehirokawa?affiliate=11-ryosukehirokawa","楽々不動産":"https://octopusenergy.co.jp/affiliate/11-ryosukehirokawa?affiliate=11-ryosukehirokawa","ひまわりカンパニー":"https://octopusenergy.co.jp/affiliate/12-ryosukehirokawa","株式会社Terrace Home本店":"https://octopusenergy.co.jp/affiliate/14-ryosukehirokawa"};var mK={"芳賀":"https://octopusenergy.co.jp/affiliate/haga?affiliate=haga","アイユーホーム":"https://octopusenergy.co.jp/affiliate/aiy?affiliate=aiy","ニコニコ不動産":"https://octopusenergy.co.jp/affiliate/nikoniko?affiliate=nikoniko","洞口不動産":"https://octopusenergy.co.jp/affiliate/horaguchi2?affiliate=horaguchi2","スリーケー企画":"https://octopusenergy.co.jp/affiliate/3k?affiliate=3k","三世建物管理":"https://octopusenergy.co.jp/affiliate/sansei?affiliate=sansei","ランエステート":"https://octopusenergy.co.jp/affiliate/run?affiliate=run","トライホーム":"https://octopusenergy.co.jp/affiliate/tryhome?affiliate=tryhome","オクムラ":"https://octopusenergy.co.jp/affiliate/okm?affiliate=okm","ウィノベーション":"https://octopusenergy.co.jp/affiliate/win?affiliate=win","めぐみ企画":"https://octopusenergy.co.jp/affiliate/mgm?affiliate=mgm","カンリーコーポ":"https://octopusenergy.co.jp/affiliate/kanry?affiliate=kanry","株式会社フォーディー":"https://octopusenergy.co.jp/affiliate/4d","アンサンブル株式会社":"https://octopusenergy.co.jp/affiliate/ensem?affiliate=ensem","株式会社北総研":"https://octopusenergy.co.jp/affiliate/3k?affiliate=3k","フィリックス株式会社":"https://octopusenergy.co.jp/affiliate/felixchubu?affiliate=felixchubu"};if(vL==='名古屋'){var f=gTh(['不動産会社']);if(f&&mN[f]){tU=mN[f];}else if(f){alert('【注意】不動産会社「'+f+'」のURL設定が見つかりません！');}}else if(vL==='空室通電'){var n=gTh(['名前','お客様名','氏名','漢字名前']);if(!n){var c3List=d.querySelectorAll('#cel3NewHis');var c3=c3List.length>0?c3List[c3List.length-1]:null;if(!c3){var c3o=d.querySelectorAll('#cel3');c3=c3o.length>0?c3o[c3o.length-1]:null;}if(c3)n=c3.innerText.trim();}if(n){var m=n.match(/[（\\(](.*?)[）\\)]/);if(m&&m[1]){var c=m[1].trim();if(mK[c]){tU=mK[c];}else{alert('【注意】カッコ内の会社名「'+c+'」のURL設定が見つかりません！');}}else{alert('【注意】カッコ内の不動産会社が見つかりません！');}}}window.open(tU,'_blank');})();` 
    },
    { 
      id: 'b3', icon: '🧞‍♂️', title: '出張サイドバー', copyName: '🧞‍♂️ 出張サイドバー', 
      copyUrl: `javascript:(function(){var d=document;var sid='my-traveling-sidebar';if(d.getElementById(sid)){d.getElementById(sid).remove();return;}var div=d.createElement('div');div.id=sid;div.style.cssText='position:fixed;bottom:20px;right:20px;width:330px;max-height:95vh;overflow-y:auto;background:linear-gradient(135deg,rgba(224,242,254,0.35),rgba(237,233,254,0.35));backdrop-filter:blur(25px);-webkit-backdrop-filter:blur(25px);border:1px solid rgba(56,189,248,0.5);border-radius:16px;z-index:999999;box-shadow:0 15px 35px rgba(0,0,0,0.15),0 0 20px rgba(56,189,248,0.2);font-family:"Meiryo",sans-serif;color:#1e293b;';var style=d.createElement('style');style.textContent='#my-traveling-sidebar input,#my-traveling-sidebar textarea{box-sizing:border-box;width:100%;padding:10px;border:1px solid rgba(56,189,248,0.4);border-radius:8px;font-size:12px;outline:none;background:rgba(255,255,255,0.6);color:#0f172a;transition:0.2s;box-shadow:inset 0 1px 3px rgba(0,0,0,0.05)}#my-traveling-sidebar input:focus,#my-traveling-sidebar textarea:focus{border-color:#f59e0b;background:rgba(255,255,255,0.9);box-shadow:0 0 0 3px rgba(245,158,11,0.25),inset 0 1px 2px rgba(0,0,0,0.05);transform:translateY(-1px)}#my-traveling-sidebar ::-webkit-scrollbar{width:6px}#my-traveling-sidebar ::-webkit-scrollbar-track{background:transparent}#my-traveling-sidebar ::-webkit-scrollbar-thumb{background:rgba(56,189,248,0.6);border-radius:3px}#my-traveling-sidebar ::-webkit-scrollbar-thumb:hover{background:rgba(2,132,199,0.8)}#my-traveling-sidebar button{transition:0.2s;letter-spacing:1px}#my-traveling-sidebar button:hover{opacity:0.95;transform:translateY(-2px);box-shadow:0 6px 15px rgba(0,0,0,0.2)}#my-traveling-sidebar button:active{transform:translateY(1px);box-shadow:0 2px 4px rgba(0,0,0,0.1)}';d.head.appendChild(style);div.innerHTML='<div id="ts-drag-handle" style="background:linear-gradient(135deg, rgba(2,132,199,0.85), rgba(76,29,149,0.85)); color:white; padding:12px 15px; font-weight:900; font-size:14px; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; cursor:move; border-radius:15px 15px 0 0; border-bottom:1px solid rgba(255,255,255,0.3); backdrop-filter:blur(10px); text-shadow:0 1px 2px rgba(0,0,0,0.3);"><span>🧞‍♂️ 出張サイドバー</span><span onclick="document.getElementById(\\'my-traveling-sidebar\\').remove()" style="cursor:pointer; background:rgba(255,255,255,0.2); padding:4px 10px; border-radius:6px; font-size:11px; border:1px solid rgba(255,255,255,0.3); transition:0.2s;" onmouseover="this.style.background=\\'rgba(255,255,255,0.3)\\'" onmouseout="this.style.background=\\'rgba(255,255,255,0.2)\\'">✖ 閉じる</span></div><div style="padding:15px; font-size:12px;"><details style="margin-bottom:15px; background:rgba(255,255,255,0.4); padding:10px; border-radius:12px; border:1px dashed rgba(56,189,248,0.5); box-shadow:0 4px 10px rgba(0,0,0,0.02);"><summary style="font-weight:900; color:#0284c7; cursor:pointer; outline:none; border-left:4px solid #0ea5e9; padding-left:8px;">💎 取得データ確認 (開閉)</summary><div style="margin-top:10px; display:flex; flex-direction:column; gap:8px;"><input type="text" id="ts-list" placeholder="リスト名"><input type="text" id="ts-phone" placeholder="電話番号"><div style="display:flex; gap:6px;"><input type="text" id="ts-last" placeholder="姓" style="width:50%;"><input type="text" id="ts-first" placeholder="名" style="width:50%;"></div><div style="display:flex; gap:6px;"><input type="text" id="ts-lastk" placeholder="姓カナ" style="width:50%;"><input type="text" id="ts-firstk" placeholder="名カナ" style="width:50%;"></div><input type="text" id="ts-address" placeholder="住所"></div></details><div style="margin-bottom:15px;"><label style="font-weight:900; color:#b45309; display:block; margin-bottom:8px; border-left:4px solid #f59e0b; padding-left:8px;">📜 魔法の絨毯 (履歴テンプレート)</label><textarea id="ts-template" style="height:200px; font-family:monospace; resize:vertical; background:rgba(255,251,235,0.7); border-color:rgba(245,158,11,0.4); color:#78350f;"></textarea></div><div style="display:flex; gap:10px;"><button id="ts-btn-get" style="flex:1; padding:12px; background:linear-gradient(135deg, #0ea5e9, #0284c7); color:white; border:1px solid rgba(255,255,255,0.3); border-radius:10px; font-weight:900; font-size:13px; cursor:pointer; box-shadow:0 4px 10px rgba(2,132,199,0.3);">🧞‍♂️ 再取得</button><button id="ts-btn-copy-tpl" style="flex:1; padding:12px; background:linear-gradient(135deg, #f59e0b, #d97706); color:white; border:1px solid rgba(255,255,255,0.3); border-radius:10px; font-weight:900; font-size:13px; cursor:pointer; box-shadow:0 4px 10px rgba(217,119,6,0.3);">✨ コピー</button></div></div>';d.body.appendChild(div);var dragHandle=d.getElementById('ts-drag-handle');var isDragging=false;var startX,startY,initialX,initialY;dragHandle.addEventListener('mousedown',function(e){isDragging=true;startX=e.clientX;startY=e.clientY;var rect=div.getBoundingClientRect();div.style.bottom='';div.style.right='';div.style.left=rect.left+'px';div.style.top=rect.top+'px';initialX=rect.left;initialY=rect.top;d.addEventListener('mousemove',onMouseMove);d.addEventListener('mouseup',onMouseUp);e.preventDefault();});function onMouseMove(e){if(!isDragging)return;var dx=e.clientX-startX;var dy=e.clientY-startY;div.style.left=(initialX+dx)+'px';div.style.top=(initialY+dy)+'px';}function onMouseUp(e){isDragging=false;d.removeEventListener('mousemove',onMouseMove);d.removeEventListener('mouseup',onMouseUp);}var cln=function(s){return s.replace(/[\\s\\u3000\\(\\)\\（\\）必須任意]/g,'');};var rmC=function(s){var x=s.replace(/[（\\(].*?[）\\)]/g,' ');return x.replace(/株式会社|有限会社|合同会社|（株）|\\(株\\)/g,' ').trim();};var getL=function(q){var els=d.querySelectorAll(q);return els.length>0?els[els.length-1]:null;};var getCtx=function(){var els=d.querySelectorAll('#cel3NewHis');if(els.length===0)els=d.querySelectorAll('#cel3');if(els.length>0){var t=els[els.length-1].closest('table');if(t)return t.parentElement||t;}return d;};var gTh=function(w,ctx){var ts=ctx.querySelectorAll('th');for(var i=ts.length-1;i>=0;i--){var t=cln(ts[i].innerText);for(var j=0;j<w.length;j++){if(t===w[j]){var n=ts[i].nextElementSibling;if(n&&n.tagName.toLowerCase()==='td'&&n.innerText.trim()!=='')return n.innerText.trim();}}}return '';};var gAd=function(ctx){var ts=ctx.querySelectorAll('th');var p1='',p2='';for(var i=ts.length-1;i>=0;i--){var t=ts[i].innerText,n=ts[i].nextElementSibling;if(n&&n.tagName.toLowerCase()==='td'){if(t.indexOf('引越先住所1')!==-1&&p1==='')p1=n.innerText.trim();else if(t.indexOf('引越先住所2')!==-1&&p2==='')p2=n.innerText.trim();}}if(p1||p2)return(p1+' '+p2).trim();for(var j=ts.length-1;j>=0;j--){if(ts[j].innerText.indexOf('住所')!==-1){var nx=ts[j].nextElementSibling;if(nx&&nx.tagName.toLowerCase()==='td'&&nx.innerText.trim()!=='')return nx.innerText.trim();}}return '';};var fSp=function(s){var p=s.split(/[\\s\\u3000・.]+/);if(p.length>1&&p[1]!=='')return{l:p[0],f:p.slice(1).join('')};var x=p[0];if(x.length>2)return{l:x.substring(0,2),f:x.substring(2)};return{l:x,f:''};};var getD=function(id){return d.getElementById(id);};var run=function(){try{var ids=['ts-list','ts-phone','ts-last','ts-first','ts-lastk','ts-firstk','ts-address','ts-template'];for(var i=0;i<ids.length;i++)getD(ids[i]).value='';var ctx=getCtx();var lN=getL('#cInfo_lNameNewHis')||getL('#cInfo_lName');var vL=lN?lN.innerText.trim():'';if(!vL)vL=gTh(['リスト名','リスト種別','リスト','業務名','キャンペーン名'],ctx);getD('ts-list').value=vL;var tl=getL('select.telCel');var vP=tl?tl.value.trim():'';if(!vP)vP=gTh(['電話番号','携帯番号','連絡先'],ctx);getD('ts-phone').value=vP;var vLa='',vFi='',vLk='',vFk='';var rN=gTh(['漢字名前','お客様名','氏名','名前'],ctx);if(!rN){var c3=getL('#cel3NewHis')||getL('#cel3');if(c3)rN=c3.innerText.trim();}if(rN){var sp=fSp(rmC(rN));vLa=sp.l;vFi=sp.f;getD('ts-last').value=vLa;getD('ts-first').value=vFi;}var rK=gTh(['カナ名前','フリガナ','氏名かな','カナ'],ctx);if(rK){var sk=fSp(rmC(rK));vLk=sk.l;vFk=sk.f;getD('ts-lastk').value=vLk;getD('ts-firstk').value=vFk;}var vA=gAd(ctx);if(vL.indexOf('名古屋')!==-1&&vA.indexOf('県')===-1&&vA!==''){vA='愛知県'+vA;}getD('ts-address').value=vA;var pM={"レ点アリ":"シンプル","WEBクルー":"シンプル","SUUMO":"シンプル","名古屋":"LL","侍アフィレ点":"シンプル","空室通電":"LL"};var pT=pM[vL]?pM[vL]:gTh(['プラン名','プラン','契約プラン','商材','商材名'],ctx);var aT=gTh(['アカウント番号','お客様番号','アカウント','契約番号'],ctx);var zT=gTh(['郵便番号','郵便'],ctx);var opEl=getL('#leftTopUserName');var opName='';if(opEl){opName=opEl.innerText.replace(/^OP/i,'').trim();}var vMail=gTh(['Email','メールアドレス','Mail','メール','Ｅメール','Eメール','E-mail','メアド'],ctx);var dt=new Date();var mm=("0"+(dt.getMonth()+1)).slice(-2);var dd=("0"+dt.getDate()).slice(-2);var td=mm+'/'+dd;var tpl="リスト種別："+vL+"\\nプラン名："+pT+"\\n受付日："+td+"\\n担当者："+opName+"\\n電話番号："+vP+"\\nアカウント番号："+aT+"\\n姓："+vLa+"\\n名："+vFi+"\\n姓（カナ）："+vLk+"\\n名（カナ）："+vFk+"\\n再点日：\\n郵便番号："+zT+"\\n住所："+vA+"\\n送付先：引越先\\nEmail："+vMail;getD('ts-template').value=tpl.replace(/\\\\n/g,'\\n');}catch(e){console.log(e);}};run();getD('ts-btn-get').addEventListener('click',function(){run();var t=this.innerText;this.innerText="✨ 取得完了！";setTimeout(()=>{this.innerText=t;},1500);});getD('ts-btn-copy-tpl').addEventListener('click',function(){var t=getD('ts-template').value;var warpId=new Date().getTime();var finalCopyText="[WarpID:"+warpId+"]\\n"+t;var ta=d.createElement('textarea');ta.value=finalCopyText;d.body.appendChild(ta);ta.select();d.execCommand('copy');d.body.removeChild(ta);var ot=this.innerText;this.innerText="✨ コピー完了！";this.style.background="linear-gradient(135deg, #10b981, #059669)";setTimeout(()=>{this.innerText=ot;this.style.background="linear-gradient(135deg, #f59e0b, #d97706)";},2000);});})();` 
    },
    { 
      id: 'b4', icon: '👁️', title: '【神の目】チェッカー', copyName: '👁️【神の目】チェッカー', 
      copyUrl: `javascript:(function(){var d=document;if(d.getElementById('providence-toast')){return;}var getV=function(q){var els=d.querySelectorAll(q);for(var i=els.length-1;i>=0;i--){if(els[i].offsetParent!==null)return els[i];}return null;};var toast=d.createElement('div');toast.id='providence-toast';toast.style.cssText='position:fixed;top:20px;right:20px;width:280px;padding:12px 16px;background:rgba(255,255,255,0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-left:5px solid #10b981;border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.15);font-family:"Meiryo",sans-serif;font-size:12px;color:#1e293b;z-index:999999;transition:all 0.3s ease;opacity:0;transform:translateY(-10px);pointer-events:none;';d.body.appendChild(toast);function showToast(msg,level){var icon='👁️';var color='#059669';var title='神の目システム';var bColor='#10b981';if(level==='error'){icon='🚨';color='#e11d48';title='入力漏れアラート';bColor='#e11d48';}else if(level==='warn'){icon='⚠️';color='#d97706';title='注意喚起アラート';bColor='#f59e0b';}toast.innerHTML='<div style="font-weight:900;margin-bottom:4px;display:flex;align-items:center;gap:6px;"><span style="font-size:16px;">'+icon+'</span> <span style="color:'+color+';">'+title+'</span></div><div style="color:#475569;line-height:1.4;">'+msg+'</div>';toast.style.borderLeftColor=bColor;toast.style.opacity='1';toast.style.transform='translateY(0)';}function hideToast(){toast.style.opacity='0';toast.style.transform='translateY(-10px)';}showToast('全方位監視システム（通常/小窓 両対応）を起動しました。','info');setTimeout(hideToast,3000);function setErr(el,isErr){if(!el)return;if(isErr){el.style.boxShadow='0 0 0 3px rgba(225,29,72,0.4)';el.style.borderColor='#e11d48';el.style.backgroundColor='#fff1f2';}else{el.style.boxShadow='';el.style.borderColor='';el.style.backgroundColor='';}}function setWarn(el,isWarn){if(!el)return;if(isWarn){el.style.boxShadow='0 0 0 3px rgba(245,158,11,0.5)';el.style.outline='2px solid #f59e0b';}else{el.style.boxShadow='';el.style.outline='';}}setInterval(function(){var errors=[];var warnings=[];var recallRadio=getV('input[name="radio_callResultNewHis"][value="再コール"], input[name="radio_callResult"][value="再コール"]');var pUser=getV('.PUserNewHis, #PUser');var dateCb=getV('.radio_RCDateTimeNewHis, #radio_RCDateTime');var dateInp=getV('.ShowRCDateNewHis, #ShowRCDate');if(recallRadio&&recallRadio.checked){if(pUser&&(pUser.value==='undefined'||pUser.value==='')){setErr(pUser,true);errors.push('・対応依頼（担当者）');}else{setErr(pUser,false);}if(dateCb&&!dateCb.checked){setErr(dateCb.parentElement,true);errors.push('・再コール日時のチェック');}else{setErr(dateCb.parentElement,false);}if(dateInp&&!dateInp.value){setErr(dateInp,true);errors.push('・再コールの詳細日付');}else{setErr(dateInp,false);}}else{setErr(pUser,false);if(dateCb)setErr(dateCb.parentElement,false);setErr(dateInp,false);}var futsuRadio=getV('input[name="radio_callResultNewHis"][value="不通"], input[name="radio_callResult"][value="不通"]');var latestHistoryTable=getV('#historyTable');var historyCount=latestHistoryTable?latestHistoryTable.querySelectorAll('tr').length:0;if(futsuRadio&&futsuRadio.checked){if(historyCount>=10){setWarn(futsuRadio.parentElement,true);warnings.push('対応履歴がすでに <b>'+historyCount+'件</b> あります！<br>不通での追跡は控えてください。');}else{setWarn(futsuRadio.parentElement,false);}}else{if(futsuRadio)setWarn(futsuRadio.parentElement,false);}var hTitles=d.querySelectorAll('.table1_title');var hTitle=null;for(var i=0;i<hTitles.length;i++){if(hTitles[i].innerText.indexOf('対応履歴')!==-1){hTitle=hTitles[i];break;}}if(hTitle){hTitle.style.position='relative';var bd=hTitle.querySelector('.providence-badge');if(bd){bd.innerText=historyCount+'件';}else{var sp=d.createElement('span');sp.className='providence-badge';sp.style.cssText='position:absolute;right:15px;top:50%;transform:translateY(-50%);background:linear-gradient(135deg, #a855f7, #7c3aed);color:#fff;padding:2px 8px;border-radius:8px;font-size:11px;font-weight:900;box-shadow:0 0 6px rgba(139,92,246,0.6);border:2px solid #7c3aed;white-space:nowrap;line-height:1.2;';sp.innerText=historyCount+'件';hTitle.appendChild(sp);}}if(errors.length>0||warnings.length>0){var msg='';if(errors.length>0)msg+='<span style="color:#e11d48;font-weight:bold;">【再コール設定不備】</span><br>'+errors.join('<br>')+(warnings.length>0?'<br><br>':'');if(warnings.length>0)msg+='<span style="color:#d97706;font-weight:bold;">【不通上限オーバー】</span><br>'+warnings.join('<br>');showToast(msg,errors.length>0?'error':'warn');}else{if(toast.style.opacity==='1'&&(toast.innerHTML.indexOf('🚨')!==-1||toast.innerHTML.indexOf('⚠️')!==-1)){hideToast();}}},1500);})();` 
    },
    { 
      id: 'b5', icon: '🚀', title: '【神速エディタ】', copyName: '🚀 【神速エディタ】', 
      copyUrl: `javascript:(function(){var d=document;if(d.getElementById('godspeed-panel')) return;var getV = function(q){var els = d.querySelectorAll(q);for(var i = els.length - 1; i >= 0; i--){if(els[i].offsetParent !== null) return els[i];}return null;};function clickTarget(q){var el = getV(q);if(el && !el.disabled){ el.click(); return true; }return false;}function getPhone(){var tl = getV('select.telCel');if(tl && tl.value) return tl.value.replace(/[\\s-ー]/g,'');var ths = d.querySelectorAll('th');for(var i=ths.length-1; i>=0; i--){if(ths[i].innerText.indexOf('電話番号')!==-1 || ths[i].innerText.indexOf('携帯番号')!==-1 || ths[i].innerText.indexOf('連絡先')!==-1){var nx = ths[i].nextElementSibling;if(nx && nx.innerText.trim() !== '') return nx.innerText.replace(/[\\s-ー]/g,'');}}return '';}if(!window.godspeedInit){d.addEventListener('keydown', function(e){if(e.metaKey && e.key === 'Enter'){e.preventDefault();if(clickTarget('#creatednewbutton, #saveButton')) showCmdEffect('💾 保存/履歴作成を実行！');}if(e.altKey && (e.code === 'Digit1' || e.key === '1' || e.key === '¡')){e.preventDefault();if(clickTarget('input[name="radio_callResultNewHis"][value="不通"], input[name="radio_callResult"][value="不通"]')) showCmdEffect('📴 不通を選択');}if(e.altKey && (e.code === 'Digit2' || e.key === '2' || e.key === '™')){e.preventDefault();if(clickTarget('input[name="radio_callResultNewHis"][value="獲得"], input[name="radio_callResult"][value="獲得"]')) showCmdEffect('🎉 獲得を選択');}if(e.altKey && (e.code === 'KeyS' || e.key === 's' || e.key === 'ß')){e.preventDefault();var phone = getPhone();if(phone){var krakenUrl = 'https://support.oejp-kraken.energy/accounts/?q=' + phone;window.open(krakenUrl, '_blank');showCmdEffect('🔍 Krakenオート検索発動！');} else {alert('電話番号が見つかりませんでした！');}}});window.godspeedInit = true;}function showCmdEffect(msg){var el = d.createElement('div');el.innerText = msg;el.style.cssText = 'position:fixed;top:0%;left:60%;transform:translateX(-50%);background:rgba(15,23,42,0.85);backdrop-filter:blur(8px);color:#fff;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:bold;letter-spacing:1px;z-index:9999999;pointer-events:none;transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);opacity:0;box-shadow:0 8px 20px rgba(0,0,0,0.2);';d.body.appendChild(el);setTimeout(function(){ el.style.opacity = '1'; el.style.top = '4%'; }, 10);setTimeout(function(){ el.style.opacity = '0'; el.style.top = '0%'; }, 800);setTimeout(function(){ el.remove(); }, 1200);}var panel = d.createElement('div');panel.id = 'godspeed-panel';panel.style.cssText = 'position:fixed;bottom:20px;left:20px;width:320px;background:rgba(255,255,255,0.85);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,0.15);z-index:999998;font-family:"Meiryo",sans-serif;overflow:hidden;border:1px solid #bfdbfe;';var handle = d.createElement('div');handle.style.cssText = 'background:linear-gradient(135deg, #3b82f6, #2563eb);color:white;padding:8px 12px;cursor:move;display:flex;justify-content:space-between;align-items:center;user-select:none;';handle.innerHTML = '<div>⚡ <span style="font-weight:900;font-size:13px;">神速エディタ</span><span style="font-size:10px;margin-left:6px;color:#bfdbfe;">(⌥+S でKraken検索)</span></div>';var closeBtn = d.createElement('span');closeBtn.innerText = '✖';closeBtn.style.cssText = 'cursor:pointer;font-size:12px;padding:2px 6px;background:rgba(255,255,255,0.2);border-radius:4px;transition:0.2s;';closeBtn.onclick = function(e){ e.stopPropagation(); panel.remove(); };handle.appendChild(closeBtn);panel.appendChild(handle);var content = d.createElement('div');content.style.padding = '10px 12px';var timeLabel = d.createElement('div');timeLabel.innerHTML = '<span style="font-weight:bold;color:#f59e0b;font-size:11px;">🕒 再コール一撃セット (08:00)</span>';timeLabel.style.marginBottom = '4px';content.appendChild(timeLabel);var timeContainer = d.createElement('div');timeContainer.style.display = 'flex';timeContainer.style.gap = '6px';timeContainer.style.marginBottom = '10px';var timeBtns = [{ name: '明日', getD: function(){ var dt=new Date(); dt.setDate(dt.getDate()+1); return dt; } },{ name: '土曜', getD: function(){ var dt=new Date(); var diff = 6 - dt.getDay(); if(diff <= 0) diff += 7; dt.setDate(dt.getDate()+diff); return dt; } },{ name: '日曜', getD: function(){ var dt=new Date(); var diff = 0 - dt.getDay(); if(diff <= 0) diff += 7; dt.setDate(dt.getDate()+diff); return dt; } }];timeBtns.forEach(function(tb){var btn = d.createElement('button');btn.innerText = tb.name;btn.style.cssText = 'flex:1;background:#fffbeb;color:#d97706;border:1px solid #fde68a;border-radius:6px;padding:6px;font-size:11px;font-weight:bold;cursor:pointer;transition:0.2s;box-shadow:0 2px 4px rgba(0,0,0,0.05);';btn.onclick = function(){clickTarget('input[name="radio_callResultNewHis"][value="再コール"], input[name="radio_callResult"][value="再コール"]');var opNameEl = d.getElementById('leftTopUserName');if(opNameEl){var opName = opNameEl.innerText.trim();var pUserSel = getV('.PUserNewHis, #PUser');if(pUserSel){for(var i=0; i<pUserSel.options.length; i++){if(pUserSel.options[i].text === opName){pUserSel.value = pUserSel.options[i].value;pUserSel.dispatchEvent(new Event('change', {bubbles:true}));break;}}}}var cb = getV('.radio_RCDateTimeNewHis, #radio_RCDateTime');if(cb && !cb.checked){ cb.click(); }var targetD = tb.getD();var dateStr = (targetD.getMonth() + 1) + '月' + targetD.getDate() + '日';var dateInp = getV('.ShowRCDateNewHis, #ShowRCDate');if(dateInp){dateInp.value = dateStr;dateInp.dispatchEvent(new Event('input', {bubbles:true}));}var hSel = getV('.RCTimeHNewHis, #RCTimeH');var mSel = getV('.RCTimeMNewHis, #RCTimeM');if(hSel){ hSel.value = '08'; hSel.dispatchEvent(new Event('change', {bubbles:true})); }if(mSel){ mSel.value = '00'; mSel.dispatchEvent(new Event('change', {bubbles:true})); }showCmdEffect('🕒 ' + tb.name + ' 08:00 にセット！');};timeContainer.appendChild(btn);});content.appendChild(timeContainer);var tagLabel = d.createElement('div');tagLabel.innerHTML = '<span style="font-weight:bold;color:#2563eb;font-size:11px;">📝 ワンポチ錬成陣</span>';tagLabel.style.marginBottom = '4px';content.appendChild(tagLabel);var tags = ['今いそ', '他社比較検討', '引越日未定', '引越先未確定', '引越先と引越日未確定','重複', 'ガチャ切り', '先方からの連絡のみ', '審査中'];var tagContainer = d.createElement('div');tagContainer.style.display = 'flex';tagContainer.style.flexWrap = 'wrap';tagContainer.style.gap = '6px';tags.forEach(function(t){var btn = d.createElement('button');btn.innerText = t;btn.style.cssText = 'background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;border-radius:6px;padding:6px 10px;font-size:11px;cursor:pointer;font-weight:bold;transition:0.2s;box-shadow:0 2px 4px rgba(0,0,0,0.05);';btn.onclick = function(){var target = getV('.memoNewHis, #memo');if(target){var val = target.value;var insert = '【' + t + '】';target.value = val ? val + '\\n' + insert : insert;target.dispatchEvent(new Event('input', {bubbles:true}));target.focus();target.scrollTop = target.scrollHeight;} else { alert('エラー：メモ欄が見つかりません！'); }};tagContainer.appendChild(btn);});content.appendChild(tagContainer);panel.appendChild(content);d.body.appendChild(panel);var isDragging = false, startX, startY, initialX, initialY;handle.addEventListener('mousedown', function(e){if(e.target === closeBtn) return;isDragging = true; startX = e.clientX; startY = e.clientY;var rect = panel.getBoundingClientRect();panel.style.bottom = ''; panel.style.right = '';panel.style.left = rect.left + 'px'; panel.style.top = rect.top + 'px';initialX = rect.left; initialY = rect.top;d.addEventListener('mousemove', onMouseMove);d.addEventListener('mouseup', onMouseUp); e.preventDefault();});function onMouseMove(e){if(!isDragging) return;panel.style.left = (initialX + (e.clientX - startX)) + 'px';panel.style.top = (initialY + (e.clientY - startY)) + 'px';}function onMouseUp(e){ isDragging = false; d.removeEventListener('mousemove', onMouseMove); d.removeEventListener('mouseup', onMouseUp); }})();` 
    }
  ];

  useEffect(() => {
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
  const { data: masterData } = useSWR(`/api/sheets-data?id=${MASTER_SHEET_ID}&range=${encodeURIComponent(CALCULATOR_RANGE)}`, fetcher);

  const handleTargetCopy = async (e: React.MouseEvent, text: string, id: string, type: 'name' | 'url') => { 
    e.stopPropagation();
    try { 
      await navigator.clipboard.writeText(text); 
      setCopiedStatus({ id, type });
      setTimeout(() => setCopiedStatus(null), 1200);
      
      // 📋 コピー履歴にも自動追加
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

  // Dockの外部クリックで閉じる処理
  const dockRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(event.target as Node)) setActiveDockTool(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`portal-container ${isDarkMode ? "theme-dark" : "theme-light"}`}>
      {/* 🌌 動的背景要素 (確実に描画され、操作を邪魔しない) */}
      <div className="cyber-aurora"></div>
      <div className="matrix-grid"></div>

      <main className="bento-layout-wrapper">
        <header className="portal-header">
          {/* 🟢 ダサいと言われた挨拶をプロ仕様のバッジに昇華 */}
          <div className="operator-badge">
            <span className="pulse-dot"></span>
            System Operator: <span style={{fontWeight: 900, marginLeft: '6px'}}>{userName}</span>
          </div>
          <div className="system-date">NODE ACTIVE</div>
        </header>

        {/* 🍱 Bento Grid (隙間を16pxに縮め、美しい一体感を演出) */}
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

          {/* Slot B: Power Action Stack (FMT通り: ネットトス、自己クロ、料金シュミレーター等) */}
          <div className="bento-slot size-tall fade-up-element" style={{ "--delay": "0.3s" } as any}>
            <div className="bento-card-inner glass-morphism calm-hover action-stack">
              <div className="card-top"><span className="attraction-tag">POWER ACTIONS</span></div>
              <h2 className="card-title">Quick Launch</h2>
              <div className="action-buttons-list custom-scrollbar">
                {[
                  { name: "ネットトス連携", url: "/net-toss", icon: "🌐" },
                  { name: "自己クロ連携", url: "/self-close", icon: "🤝" },
                  { name: "料金シミュレーター", url: "/simulator", icon: "🆚" },
                  // 拡張可能: 将来ここに増やすだけ
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

          {/* Slot C: データ一括登録 */}
          <BentoCard title="データ一括登録" attraction="BULK REGISTER" desc="成約後データをマスターシートへ同期" delay={0.4} onClick={() => router.push("/bulk-register")} />

          {/* Slot D: アフィリエイトリンク */}
          <BentoCard title="アフィリエイト" attraction="LINK CONSOLE" desc="不動産各社のOBJリンクと重説フォーム" delay={0.5} onClick={() => router.push("/affiliate-links")} />

          {/* Slot E: メールテンプレ */}
          <BentoCard title="メールテンプレ" attraction="TEMPLATES" delay={0.6} onClick={() => router.push("/email-template")} size="small" />

          {/* Slot F: SMS Kraken */}
          <BentoCard title="SMS Kraken" attraction="MESSAGING" delay={0.7} onClick={() => router.push("/sms-kraken")} size="small" />
        </div>
      </main>

      {/* 🍏 Utility Dock (Mac / visionOS 級の滑らかさとデザイン) */}
      <nav className="mac-dock-wrapper" ref={dockRef}>
        <div className="mac-dock">
          
          <div className={`mac-dock-item ${activeDockTool === 'vault' ? 'active' : ''}`} onClick={() => setActiveDockTool(activeDockTool === 'vault' ? null : 'vault')} data-tooltip="Clipboard">
            📋
          </div>
          
          <div className="mac-dock-item" onClick={() => router.push("/procedure-wizard")} data-tooltip="Manual">
            🐙
          </div>
          
          <div className="dock-divider"></div>
          
          <div className={`mac-dock-item ${activeDockTool === 'calc' ? 'active' : ''}`} onClick={() => setActiveDockTool(activeDockTool === 'calc' ? null : 'calc')} data-tooltip="Calculator">
            🧮
          </div>
          
          <div className={`mac-dock-item ${activeDockTool === 'bookmarks' ? 'active' : ''}`} onClick={() => setActiveDockTool(activeDockTool === 'bookmarks' ? null : 'bookmarks')} data-tooltip="Bookmarks">
            📌
          </div>
          
          <div className={`mac-dock-item ${activeDockTool === 'memo' ? 'active' : ''}`} onClick={() => setActiveDockTool(activeDockTool === 'memo' ? null : 'memo')} data-tooltip="Memo">
            🍯
          </div>

          <div className="dock-divider"></div>

          {/* ☀️/🌙 テーマ切替 (デザインの感動を約束) */}
          <div className="mac-dock-item" onClick={() => setIsDarkMode(!isDarkMode)} data-tooltip="Theme">
            {isDarkMode ? "☀️" : "🌙"}
          </div>
        </div>

        {/* ---------------- ポップオーバー群 (ガラスの質感を極限まで向上) ---------------- */}
        
        {/* 📋 Clipboard Vault Popover */}
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

        {/* 🧮 秒速・比較電卓 Popover */}
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

        {/* 📌 Bookmark Manager Popover (以前の強力なスクリプトを復元) */}
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

        {/* 🍯 Quick Memo Popover */}
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

      {/* ✨ 最高級のCSSスタイル定義 (ライト/ダーク完全対応) */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root { 
          --accent: #0ea5e9; 
          --bg-color: #020617;
          --card-bg: rgba(15, 23, 42, 0.65); 
          --border: rgba(255,255,255,0.1);
          --text-main: #f8fafc;
          --text-sub: #94a3b8;
          --dock-bg: rgba(255,255,255,0.05);
          --glow-shadow: 0 0 40px rgba(14, 165, 233, 0.15);
        }
        
        .theme-light {
          --bg-color: #f8fafc;
          --card-bg: rgba(255, 255, 255, 0.7);
          --border: rgba(0,0,0,0.08);
          --text-main: #0f172a;
          --text-sub: #475569;
          --dock-bg: rgba(0,0,0,0.05);
          --glow-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        body { background: var(--bg-color); color: var(--text-main); font-family: 'Inter', sans-serif; overflow-x: hidden; transition: background 0.5s; }
        
        .portal-container { min-height: 100vh; padding: 40px; position: relative; }
        
        /* 🌌 背景オーロラ & グリッド (ライト・ダークで美しく変化) */
        .cyber-aurora { position: fixed; inset: 0; background: radial-gradient(circle at 20% 30%, rgba(14, 165, 233, 0.12) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.12) 0%, transparent 50%); z-index: -2; pointer-events: none; animation: floatAurora 20s ease-in-out infinite alternate; }
        .theme-dark .cyber-aurora { background: radial-gradient(circle at 20% 30%, rgba(14, 165, 233, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.2) 0%, transparent 50%); }
        @keyframes floatAurora { 0% { transform: scale(1); } 100% { transform: scale(1.1) translate(20px, 20px); } }
        
        .matrix-grid { position: fixed; inset: 0; background-image: radial-gradient(var(--border) 1px, transparent 1px); background-size: 30px 30px; z-index: -1; mask-image: radial-gradient(ellipse at center, black 10%, transparent 70%); -webkit-mask-image: radial-gradient(ellipse at center, black 10%, transparent 70%); pointer-events: none; }

        .bento-layout-wrapper { max-width: 1200px; margin: 0 auto; z-index: 10; position: relative; }
        
        /* 💼 洗練されたヘッダー */
        .portal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .operator-badge { display: flex; align-items: center; background: var(--card-bg); backdrop-filter: blur(10px); padding: 8px 16px; border-radius: 100px; border: 1px solid var(--border); font-size: 11px; color: var(--text-sub); box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .pulse-dot { width: 6px; height: 6px; background: #10b981; border-radius: 50%; margin-right: 8px; box-shadow: 0 0 8px #10b981; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        .system-date { font-size: 10px; font-weight: 900; color: var(--text-sub); letter-spacing: 2px; }
        
        /* 🍱 Bento Grid (黄金比の 16px Gap) */
        .bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 160px; gap: 16px; margin-bottom: 100px; }
        .size-xlarge { grid-column: span 2; grid-row: span 2; }
        .size-tall { grid-column: span 1; grid-row: span 3; }
        .size-medium { grid-column: span 1; grid-row: span 1; }
        .size-small { grid-column: span 1; grid-row: span 1; }

        .bento-card-inner { height: 100%; border-radius: 28px; padding: 24px; position: relative; border: 1px solid var(--border); cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
        .glass-morphism { background: var(--card-bg); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        
        /* ✨ Calm Hover (Border Glow & Elevate) */
        .calm-hover { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .calm-hover:hover { transform: translateY(-4px); border-color: var(--accent); box-shadow: var(--glow-shadow), inset 0 0 20px rgba(14, 165, 233, 0.05); }

        .card-top { display: flex; justify-content: space-between; }
        .attraction-tag { font-size: 9px; font-weight: 900; color: var(--accent); letter-spacing: 1px; text-transform: uppercase; }
        .card-title { font-size: 18px; font-weight: 900; margin: 4px 0; color: var(--text-main); transition: 0.3s; }
        .calm-hover:hover .card-title { color: var(--accent); }
        .card-desc { font-size: 12px; color: var(--text-sub); line-height: 1.5; margin: 0; }

        /* KPI Visual */
        .kpi-main-stat { display: flex; align-items: baseline; gap: 8px; margin-top: 10px; }
        .current-num { font-size: 64px; font-weight: 900; color: var(--text-main); line-height: 1; letter-spacing: -2px; }
        .target-num { font-size: 20px; color: var(--text-sub); font-weight: 800; }
        .progress-track { width: 100%; height: 8px; background: var(--border); border-radius: 10px; margin-top: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #0ea5e9, #818cf8); border-radius: 10px; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1); }

        /* Action Stack (Slot B) */
        .action-stack { gap: 16px; justify-content: flex-start; }
        .action-buttons-list { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; overflow-y: auto; padding-right: 4px; }
        .action-row-btn { display: flex; align-items: center; padding: 14px 16px; background: var(--dock-bg); border: 1px solid transparent; border-radius: 16px; transition: 0.2s; color: var(--text-main); cursor: pointer; }
        .action-row-btn:hover { background: rgba(14, 165, 233, 0.1); border-color: rgba(14, 165, 233, 0.3); transform: translateX(4px); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .btn-icon { font-size: 16px; margin-right: 12px; }
        .btn-label { flex: 1; text-align: left; font-weight: 800; font-size: 13px; }
        .btn-arrow { opacity: 0.3; font-weight: 900; transition: 0.2s; }
        .action-row-btn:hover .btn-arrow { opacity: 1; color: var(--accent); transform: translateX(2px); }

        /* 🍏 究極の Mac/visionOS Style Dock */
        .mac-dock-wrapper { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 1000; }
        .mac-dock { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--card-bg); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); border-radius: 28px; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1); }
        
        .mac-dock-item { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 20px; transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1); position: relative; transform-origin: bottom; background: var(--dock-bg); color: var(--text-main); border: 1px solid transparent; }
        .mac-dock-item:hover { transform: scale(1.3) translateY(-8px); background: var(--card-bg); box-shadow: 0 15px 30px rgba(0,0,0,0.2); z-index: 10; border-color: var(--accent); }
        
        /* 美しいツールチップ */
        .mac-dock-item::before { content: attr(data-tooltip); position: absolute; top: -35px; background: var(--text-main); color: var(--bg-color); font-size: 10px; font-weight: 800; padding: 6px 10px; border-radius: 8px; opacity: 0; pointer-events: none; transition: 0.2s; white-space: nowrap; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transform: translateY(5px); }
        .mac-dock-item:hover::before { opacity: 1; transform: translateY(0); }
        
        /* アクティブインジケーター */
        .mac-dock-item.active::after { content: ''; position: absolute; bottom: -6px; width: 4px; height: 4px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 5px var(--accent); }

        .dock-divider { width: 1px; height: 24px; background: var(--border); }

        /* 💬 Popovers (ガラスの質感を極限まで向上) */
        .dock-popover { position: absolute; bottom: 85px; left: 50%; transform: translateX(-50%); width: 300px; background: var(--card-bg); backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); border-radius: 24px; border: 1px solid var(--border); padding: 20px; box-shadow: 0 30px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1); transform-origin: bottom center; }
        .animate-pop-in { animation: popUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes popUp { from { opacity: 0; transform: translateX(-50%) scale(0.9) translateY(10px); } to { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); } }
        
        .pop-header { font-size: 11px; font-weight: 900; color: var(--text-sub); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; text-align: center; border-bottom: 1px solid var(--border); padding-bottom: 10px; }
        .pop-content { display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto; padding-right: 4px; }
        
        .pop-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: var(--dock-bg); border-radius: 12px; cursor: pointer; transition: 0.2s; border: 1px solid transparent; }
        .pop-row:hover { background: var(--card-bg); border-color: var(--border); transform: translateX(2px); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .pop-text { font-size: 11px; font-weight: 800; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; transition: color 0.2s; }
        .pop-icon { font-size: 12px; opacity: 0.5; transition: 0.2s; }
        .pop-row:hover .pop-icon { opacity: 1; color: var(--accent); }
        .pop-empty { text-align: center; font-size: 11px; color: var(--text-sub); padding: 20px 0; }

        /* Bookmarks specific */
        .bookmark-group { margin-bottom: 12px; }
        .bm-title { font-size: 11px; font-weight: 900; color: var(--text-main); margin-bottom: 6px; margin-top: 8px; }
        .pop-badge { font-size: 9px; font-weight: 900; padding: 2px 6px; border-radius: 4px; margin-right: 8px; }
        .bg-orange { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }
        .bg-blue { background: rgba(14, 165, 233, 0.15); color: #0ea5e9; border: 1px solid rgba(14, 165, 233, 0.3); }
        .text-green { color: #10b981 !important; }

        /* Calc specific */
        .pop-input { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid var(--border); background: var(--dock-bg); color: var(--text-main); font-size: 12px; font-weight: 800; outline: none; margin-bottom: 8px; transition: 0.2s; }
        .pop-input:focus { border-color: var(--accent); background: var(--card-bg); }
        .pop-btn { width: 100%; padding: 14px; border-radius: 12px; background: var(--accent); color: #fff; font-weight: 900; border: none; cursor: pointer; margin-top: 4px; transition: 0.2s; }
        .pop-btn:hover { background: #0284c7; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(14, 165, 233, 0.3); }
        .calc-result-area { margin-top: 12px; padding: 16px; background: rgba(16, 185, 129, 0.1); border-radius: 16px; text-align: center; border: 1px solid rgba(16, 185, 129, 0.3); animation: popUp 0.3s; }
        .result-label { font-size: 10px; color: var(--text-sub); font-weight: 800; margin: 0 0 4px 0; }
        .result-value { font-size: 18px; color: #10b981; font-weight: 900; margin: 0; }

        /* Memo specific */
        .pop-textarea { width: 100%; height: 140px; padding: 14px; border-radius: 16px; border: 1px solid var(--border); background: var(--dock-bg); color: var(--text-main); font-size: 12px; font-weight: 800; outline: none; resize: none; transition: 0.2s; }
        .pop-textarea:focus { border-color: var(--accent); background: var(--card-bg); }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar, ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
      `}} />
    </div>
  );
}