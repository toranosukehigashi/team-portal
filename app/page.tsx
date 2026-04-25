"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

// 📊 比較電卓用の定数 (スプレッドシートの「電卓単価マスタ」タブを読み込む設定)
const MASTER_SHEET_ID = "1gXTpTFfp5f5I83P0FVbJbzX-bEsvgLY_DpNl6YDo9-w";
const CALCULATOR_RANGE = "電卓単価マスタ!A2:I";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
};

// 🌟 MagicCard Component (3D視差 & 深度表現)
const BentoCard = ({ title, attraction, desc, delay, onClick, badge, children, liveData, size = "medium" }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !innerRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    innerRef.current.style.transform = `perspective(1000px) rotateX(${-(y / 30)}deg) rotateY(${x / 30}deg)`;
  };

  const handleMouseLeave = () => {
    if (innerRef.current) innerRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  };

  return (
    <div ref={cardRef} className="bento-slot fade-up-element" style={{ "--delay": `${delay}s` } as any} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={onClick}>
      <div ref={innerRef} className={`bento-card-inner glass-morphism glitch-hover size-${size}`}>
        <div className="card-aurora-glow"></div>
        <div className="card-content">
          <div className="card-top">
            <span className="attraction-tag">{attraction}</span>
            {liveData && <span className="live-status-pulse">{liveData}</span>}
          </div>
          <h2 className="card-title">{title}</h2>
          <p className="card-desc">{desc}</p>
          {children}
          {badge && <span className="card-badge">{badge}</span>}
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
  const [copiedHistory, setCopiedHistory] = useState<string[]>([]);
  const [memoText, setMemoText] = useState("");

  // 🧮 比較電卓用ステート
  const [calcInput, setCalcInput] = useState({ company: "", plan: "", amp: "30", bill: "" });
  const [calcResult, setCalcResult] = useState<number | null>(null);

  // 📊 KPIデータ取得 (Local Storage)
  const [kpi, setKpi] = useState({ current: 0, target: 20 });

  useEffect(() => {
    const savedUser = localStorage.getItem("team_portal_user");
    if (savedUser) setUserName(savedUser);
    else router.push("/login");

    const savedKpi = localStorage.getItem("team_portal_kpi");
    if (savedKpi) try { setKpi(JSON.parse(savedKpi)); } catch(e){}

    const savedMemo = localStorage.getItem("team_portal_quick_memo");
    if (savedMemo) setMemoText(savedMemo);

    // クリップボード履歴の初期化
    const savedHistory = localStorage.getItem("clipboard_vault");
    if (savedHistory) setCopiedHistory(JSON.parse(savedHistory));
  }, []);

  const progressPercent = Math.min(100, Math.round((kpi.current / kpi.target) * 100));

  // 🧮 電卓単価マスタデータの取得
  const { data: masterData } = useSWR(`/api/sheets-data?id=${MASTER_SHEET_ID}&range=${encodeURIComponent(CALCULATOR_RANGE)}`, fetcher);

  const calculateCompare = () => {
    if (!masterData || !calcInput.bill) return;
    const row = masterData.find((r: any) => r[0] === calcInput.company && r[1] === calcInput.plan);
    if (!row) return alert("マスタに該当データがありません");
    
    // 💡 超簡易逆算ロジック (詳細は現場に合わせて修正可能)
    const bill = Number(calcInput.bill);
    const kwh = (bill - Number(row[3])) / Number(row[4]); // 大まかな使用量を算出
    const octopusBill = (Number(row[3]) * 0.9) + (kwh * 28); // 自社想定ロジック
    setCalcResult(Math.floor((bill - octopusBill) * 12)); // 年間差額
  };

  const addToVault = async (text: string) => {
    const newHistory = [text, ...copiedHistory.filter(i => i !== text)].slice(0, 5);
    setCopiedHistory(newHistory);
    localStorage.setItem("clipboard_vault", JSON.stringify(newHistory));
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className={`portal-container ${isDarkMode ? "dark-theme" : "light-theme"}`}>
      {/* 🌌 動的背景要素 */}
      <div className="cyber-aurora"></div>
      <div className="matrix-grid"></div>

      <main className="bento-layout-wrapper">
        <header className="portal-header">
          <div className="greeting-stack">
            <span className="pre-title">Welcome back,</span>
            <h1 className="user-name">{userName} <span className="hand-wave">👋</span></h1>
          </div>
          <div className="system-status">
            <div className="status-item"><span className="dot online"></span> API Connected</div>
            <div className="status-item"><span className="dot secure"></span> Secure Node</div>
          </div>
        </header>

        <div className="bento-grid">
          {/* Slot A: KPI Dashboard (特大・横長) */}
          <div className="slot-a-wrapper">
            <BentoCard title="Performance Hub" attraction="KPI DASHBOARD" desc="本日の獲得進捗と目標達成率をリアルタイム解析" size="xlarge" onClick={() => router.push("/kpi-detail")}>
              <div className="kpi-visualization">
                <div className="kpi-main-stat">
                  <span className="current-num">{kpi.current}</span>
                  <span className="divider">/</span>
                  <span className="target-num">{kpi.target}</span>
                  <span className="unit">CONTRACTS</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }}>
                    <div className="progress-glow"></div>
                  </div>
                </div>
                <div className="kpi-footer">
                  <span>達成率 {progressPercent}%</span>
                  <span>残り {kpi.target - kpi.current} 件</span>
                </div>
              </div>
            </BentoCard>
          </div>

          {/* Slot B: Power Action Stack (特大・縦長) */}
          <div className="slot-b-wrapper">
            <div className="bento-card-inner glass-morphism size-tall action-stack">
              <div className="stack-header">
                <span className="attraction-tag">POWER ACTIONS</span>
                <h2>⚡️ Quick Launch</h2>
              </div>
              <div className="action-buttons-list">
                {[
                  { name: "ネットトス連携", url: "/net-toss", icon: "🌐", key: "⌘N" },
                  { name: "自己クロ連携", url: "/self-close", icon: "🤝", key: "⌘S" },
                  { name: "料金シミュレーター", url: "/simulator", icon: "🆚", key: "⌘C" },
                  { name: "顧客検索コンソール", url: "/procedure-wizard", icon: "🔍", key: "⌘F" },
                ].map(action => (
                  <button key={action.name} className="action-row-btn" onClick={() => router.push(action.url)}>
                    <span className="btn-icon">{action.icon}</span>
                    <span className="btn-label">{action.name}</span>
                    <span className="btn-shortcut">{action.key}</span>
                  </button>
                ))}
                {/* 拡張用空きスロット */}
                <div className="empty-slot-dashed">＋ ADD TOOL</div>
              </div>
            </div>
          </div>

          {/* Slot C: Data Register (中) */}
          <div className="slot-c-wrapper">
            <BentoCard title="📦 データ一括登録" attraction="BULK REGISTER" desc="成約後データをマスターシートへ一撃同期" onClick={() => router.push("/bulk-register")} />
          </div>

          {/* Slot D: Affiliate Links (中) */}
          <div className="slot-d-wrapper">
            <BentoCard title="🔗 アフィリエイト" attraction="LINK CONSOLE" desc="不動産各社のOBJリンクと重説フォームを生成" onClick={() => router.push("/affiliate-links")} />
          </div>

          {/* Slot E: Email Template (小) */}
          <div className="slot-e-wrapper">
            <BentoCard title="✉️ メールテンプレ" attraction="TEMPLATES" desc="状況に応じたサンクスメール等の作成" onClick={() => router.push("/email-template")} />
          </div>

          {/* Slot F: SMS Kraken (小) */}
          <div className="slot-f-wrapper">
            <BentoCard title="📱 SMS Kraken" attraction="MESSAGING" desc="Krakenを使用したSMS送信・履歴管理" onClick={() => router.push("/sms-kraken")} />
          </div>
        </div>
      </main>

      {/* 💻 Utility Dock (画面下部固定) */}
      <nav className="utility-dock-wrapper">
        <div className="utility-dock-glass">
          <div className="dock-item" onClick={() => setActiveDockTool(activeDockTool === 'vault' ? null : 'vault')} data-label="クリップボード">
            <span className="dock-icon">📋</span>
          </div>
          <div className="dock-item" onClick={() => router.push("/procedure-wizard")} data-label="マニュアル">
            <span className="dock-icon">🐙</span>
          </div>
          <div className="dock-divider"></div>
          <div className="dock-item action-primary" onClick={() => setActiveDockTool(activeDockTool === 'calc' ? null : 'calc')} data-label="比較電卓">
            <span className="dock-icon">🧮</span>
          </div>
          <div className="dock-divider"></div>
          <div className="dock-item" onClick={() => setActiveDockTool(activeDockTool === 'bookmarks' ? null : 'bookmarks')} data-label="ブックマーク">
            <span className="dock-icon">📌</span>
          </div>
          <div className="dock-item" onClick={() => setActiveDockTool(activeDockTool === 'memo' ? null : 'memo')} data-label="クイックメモ">
            <span className="dock-icon">🍯</span>
          </div>
          <div className="dock-item" onClick={() => setIsDarkMode(!isDarkMode)} data-label="テーマ">
            <span className="dock-icon">{isDarkMode ? "☀️" : "🌙"}</span>
          </div>
        </div>

        {/* 📋 Clipboard Vault Popover */}
        {activeDockTool === 'vault' && (
          <div className="dock-popover vault-popover animate-pop-in">
            <h3>Clipboard Vault</h3>
            <div className="vault-list">
              {copiedHistory.map((text, i) => (
                <div key={i} className="vault-item" onClick={() => addToVault(text)}>
                  <span className="vault-text">{text}</span>
                  <span className="vault-copy">Copy</span>
                </div>
              ))}
              {copiedHistory.length === 0 && <div className="empty-msg">履歴がありません</div>}
            </div>
          </div>
        )}

        {/* 🧮 秒速・比較電卓 Popover */}
        {activeDockTool === 'calc' && (
          <div className="dock-popover calc-popover animate-pop-in">
            <div className="pop-header">⚡️ 秒速・比較電卓</div>
            <div className="calc-form">
              <select onChange={(e) => setCalcInput({...calcInput, company: e.target.value})}>
                <option value="">電力会社を選択</option>
                <option value="東京電力">東京電力</option>
                <option value="関西電力">関西電力</option>
                <option value="中部電力">中部電力</option>
              </select>
              <input type="text" placeholder="現在のプラン (例: 従量電灯B)" onChange={(e) => setCalcInput({...calcInput, plan: e.target.value})} />
              <input type="number" placeholder="先月の電気代 (円)" onChange={(e) => setCalcInput({...calcInput, bill: e.target.value})} />
              <button className="calc-submit-btn" onClick={calculateCompare}>一瞬で計算する</button>
              {calcResult !== null && (
                <div className="calc-result-area">
                  <p className="result-label">年間節約想定額</p>
                  <p className="result-value">約 <span>¥{calcResult.toLocaleString()}</span> おトク！</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 📌 Bookmark Manager Popover (以前のサイドバー内容) */}
        {activeDockTool === 'bookmarks' && (
          <div className="dock-popover bookmark-popover animate-pop-in">
            <h3>Bookmarks & Scripts</h3>
            <div className="bookmark-grid">
              <button className="bm-btn" onClick={() => alert('OBJ自動入力を実行します')}>🐙 OBJ自動入力</button>
              <button className="bm-btn" onClick={() => alert('CallTree連携を実行します')}>🌲 CallTree連携</button>
              <button className="bm-btn" onClick={() => alert('神の目を起動します')}>👁️ 神の目システム</button>
            </div>
          </div>
        )}

        {/* 🍯 Quick Memo Popover */}
        {activeDockTool === 'memo' && (
          <div className="dock-popover memo-popover animate-pop-in">
            <textarea 
              value={memoText} 
              onChange={(e) => { setMemoText(e.target.value); localStorage.setItem("team_portal_quick_memo", e.target.value); }}
              placeholder="ここに自由にメモを残せます。自動保存されます。"
            />
          </div>
        )}
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        :root { --accent: #0ea5e9; --card-bg: rgba(15, 23, 42, 0.65); --border: rgba(255,255,255,0.1); }
        body { background: #020617; color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; }
        
        .portal-container { min-height: 100vh; padding: 40px; position: relative; }
        .cyber-aurora { position: fixed; inset: 0; background: radial-gradient(circle at 0% 0%, #1e1b4b 0%, transparent 50%), radial-gradient(circle at 100% 100%, #0c4a6e 0%, transparent 50%); z-index: -2; opacity: 0.5; }
        .matrix-grid { position: fixed; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 40px 40px; z-index: -1; mask-image: radial-gradient(ellipse at center, black, transparent 80%); }

        .bento-layout-wrapper { max-width: 1400px; margin: 0 auto; z-index: 10; position: relative; }
        .portal-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 60px; }
        .user-name { font-size: 3.5rem; font-weight: 900; letter-spacing: -2px; }
        .pre-title { font-size: 0.9rem; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 4px; }
        
        .bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 140px; gap: 24px; }
        .slot-a-wrapper { grid-column: span 2; grid-row: span 3; }
        .slot-b-wrapper { grid-column: span 1; grid-row: span 6; }
        .slot-c-wrapper, .slot-d-wrapper { grid-column: span 1; grid-row: span 3; }
        .slot-e-wrapper, .slot-f-wrapper { grid-column: span 1; grid-row: span 1; }

        .bento-card-inner { height: 100%; border-radius: 32px; padding: 32px; position: relative; overflow: hidden; border: 1px solid var(--border); transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); cursor: pointer; }
        .glass-morphism { background: var(--card-bg); backdrop-filter: blur(24px); }
        .bento-card-inner:hover { border-color: var(--accent); box-shadow: 0 0 40px rgba(14, 165, 233, 0.2); }

        .attraction-tag { font-size: 10px; font-weight: 900; color: var(--accent); letter-spacing: 2px; }
        .card-title { font-size: 20px; font-weight: 900; margin: 8px 0; }
        .card-desc { font-size: 13px; opacity: 0.6; line-height: 1.6; }

        /* KPI Visual */
        .kpi-main-stat { display: flex; align-items: baseline; gap: 10px; margin: 20px 0; }
        .current-num { font-size: 80px; font-weight: 900; color: #fff; line-height: 1; }
        .target-num { font-size: 24px; opacity: 0.4; }
        .progress-track { width: 100%; height: 12px; background: rgba(255,255,255,0.05); border-radius: 100px; overflow: hidden; position: relative; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #0ea5e9, #818cf8); border-radius: 100px; position: relative; }
        .progress-glow { position: absolute; right: 0; top: 0; bottom: 0; width: 20px; box-shadow: 0 0 20px #0ea5e9; }

        /* Action Stack (Slot B) */
        .action-stack { display: flex; flex-direction: column; gap: 20px; }
        .action-buttons-list { display: flex; flex-direction: column; gap: 12px; }
        .action-row-btn { display: flex; align-items: center; padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid transparent; border-radius: 20px; transition: 0.2s; color: #fff; cursor: pointer; }
        .action-row-btn:hover { background: rgba(255,255,255,0.08); transform: translateX(8px); border-color: var(--border); }
        .btn-icon { font-size: 20px; margin-right: 15px; }
        .btn-label { flex: 1; text-align: left; font-weight: 700; font-size: 14px; }
        .btn-shortcut { font-size: 10px; opacity: 0.3; font-family: monospace; }
        .empty-slot-dashed { border: 2px dashed rgba(255,255,255,0.1); border-radius: 20px; padding: 20px; text-align: center; font-size: 11px; font-weight: 900; opacity: 0.3; }

        /* Utility Dock */
        .utility-dock-wrapper { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); z-index: 1000; }
        .utility-dock-glass { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(32px); border-radius: 24px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .dock-item { width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s cubic-bezier(0.2, 0.8, 0.2, 1.2); position: relative; }
        .dock-item:hover { background: rgba(255,255,255,0.1); transform: translateY(-10px) scale(1.1); }
        .dock-item:active { transform: scale(0.9); }
        .dock-item::after { content: attr(data-label); position: absolute; bottom: -30px; font-size: 10px; font-weight: 800; opacity: 0; transition: 0.2s; white-space: nowrap; }
        .dock-item:hover::after { opacity: 1; bottom: -25px; }
        .dock-icon { font-size: 22px; }
        .dock-divider { width: 1px; height: 24px; background: rgba(255,255,255,0.1); }
        .action-primary { background: var(--accent); box-shadow: 0 0 20px rgba(14, 165, 233, 0.4); }

        /* Popovers */
        .dock-popover { position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%); width: 320px; background: rgba(30, 41, 59, 0.95); backdrop-filter: blur(20px); border-radius: 24px; border: 1px solid var(--accent); padding: 24px; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
        .animate-pop-in { animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes popIn { from { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.9); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }

        /* Calc Styles */
        .calc-form { display: flex; flex-direction: column; gap: 12px; margin-top: 15px; }
        .calc-form input, .calc-form select { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; color: #fff; outline: none; }
        .calc-submit-btn { background: var(--accent); border: none; padding: 14px; border-radius: 12px; font-weight: 900; color: #fff; cursor: pointer; }
        .calc-result-area { margin-top: 15px; text-align: center; background: rgba(16, 185, 129, 0.1); padding: 15px; border-radius: 16px; border: 1px solid rgba(16, 185, 129, 0.3); }
        .result-value { font-size: 20px; font-weight: 900; color: #10b981; }

        /* Vault Styles */
        .vault-list { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
        .vault-item { padding: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; font-size: 12px; display: flex; justify-content: space-between; cursor: pointer; }
        .vault-item:hover { background: rgba(255,255,255,0.1); }
        .vault-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
      `}} />
    </div>
  );
}