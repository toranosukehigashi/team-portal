"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// 🔐 登録ユーザーのリスト
const VALID_USERS = [
  { id: "toranosuke.higashi@octopusenergy.co.jp", pass: "701005p" },
];

export default function Login() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const [isEntering, setIsEntering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const isValidUser = VALID_USERS.some(
      (user) => user.id === userId && user.pass === password
    );

    if (isValidUser) {
      const userName = userId.split("@")[0];
      localStorage.setItem("team_portal_user", userName);
      
      // ✨ HOME画面に「今ログインしたばかり」と伝えるフラグをセット
      sessionStorage.setItem("just_logged_in", "true");

      // 魔法のゲートが開くアニメーションをトリガー！
      setIsEntering(true);

      // 魔法の光に包まれてホワイトアウトした瞬間にHOMEへ遷移！
      setTimeout(() => {
        router.push("/");
      }, 1500); // アニメーションの尺に合わせて少し延長
      
    } else {
      setErrorMsg("⚠️ 魔法の鍵（IDまたはパスワード）が間違っています。");
    }
  };

  return (
    <div className={`login-wrapper ${isEntering ? "entering-magic" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        .login-wrapper * { box-sizing: border-box; }
        .login-wrapper {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          /* 🌌 HOME画面の夜空エントランスと同じグラデーションを採用 */
          background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
          font-family: 'Inter', 'Noto Sans JP', sans-serif;
          overflow: hidden; position: relative; padding: 20px;
          perspective: 1200px;
        }

        /* ✨ 魔法のオーブ（ピクシーダストの色） */
        .glow-orb-1 { position: absolute; top: -10%; left: -10%; width: 50vw; height: 50vw; background: #fde047; border-radius: 50%; filter: blur(120px); opacity: 0.15; animation: float 20s ease-in-out infinite alternate; transition: all 1s ease; }
        .glow-orb-2 { position: absolute; bottom: -10%; right: -10%; width: 40vw; height: 40vw; background: #c084fc; border-radius: 50%; filter: blur(120px); opacity: 0.2; animation: float 15s ease-in-out infinite alternate-reverse; transition: all 1s ease; }
        @keyframes float { 0% { transform: translate(0, 0); } 100% { transform: translate(10%, 10%); } }

        .login-card {
          width: 100%; max-width: 420px; padding: 50px 40px;
          background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.15); border-top: 1px solid rgba(255, 255, 255, 0.3); border-left: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 32px; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
          position: relative; z-index: 10;
          transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }

        /* 🎇 魔法のゲートが開く光のバーストエフェクト */
        .magic-burst {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0);
          width: 200vw; height: 200vw; border-radius: 50%;
          background: radial-gradient(circle, rgba(253,224,71,0.9) 0%, rgba(255,255,255,1) 30%, transparent 70%);
          opacity: 0; pointer-events: none; z-index: 20;
          transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s ease;
        }

        /* 真っ白な夢の国へ繋がるホワイトアウト */
        .screen-flash {
          position: absolute; top: 0; left: 0; width: 100vw; height: 100vh;
          background: #fff; opacity: 0; pointer-events: none; z-index: 999;
          transition: opacity 1s ease; transition-delay: 0.5s; 
        }

        /* 🏰 魔法発動時のアニメーション（カードがフワッと浮き上がって消える） */
        .login-wrapper.entering-magic .login-card { transform: translateY(-60px) scale(1.1); opacity: 0; filter: blur(20px); box-shadow: 0 50px 100px rgba(253, 224, 71, 0.5); }
        .login-wrapper.entering-magic .magic-burst { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        .login-wrapper.entering-magic .screen-flash { opacity: 1; }

        .login-logo { text-align: center; margin-bottom: 35px; }
        .logo-symbol { font-size: 50px; margin-bottom: 10px; filter: drop-shadow(0 0 15px rgba(253,224,71,0.6)); animation: floatLogo 3s ease-in-out infinite alternate; display: inline-block; }
        @keyframes floatLogo { 0% { transform: translateY(0); } 100% { transform: translateY(-10px); } }

        .login-title { font-size: 32px; font-weight: 900; letter-spacing: 2px; margin: 0; background: linear-gradient(to right, #fde047, #fbcfe8, #38bdf8, #fde047); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shine 4s linear infinite; }
        @keyframes shine { to { background-position: 200% center; } }
        .login-subtitle { color: #cbd5e1; font-size: 13px; margin-top: 8px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }

        .input-group { margin-bottom: 24px; width: 100%; position: relative; }
        .input-label { display: block; color: #f8fafc; font-size: 12px; font-weight: 800; margin-bottom: 8px; letter-spacing: 1px; text-shadow: 0 1px 3px rgba(0,0,0,0.8); }
        .login-input { width: 100%; padding: 16px 20px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px; color: #fff; font-size: 15px; outline: none; transition: all 0.3s ease; font-weight: 700; letter-spacing: 1px; box-shadow: inset 0 2px 5px rgba(0,0,0,0.3); }
        .login-input::placeholder { color: #64748b; font-weight: 600; }
        .login-input:focus { border-color: #fde047; background: rgba(0, 0, 0, 0.5); box-shadow: 0 0 0 4px rgba(253, 224, 71, 0.2), inset 0 2px 5px rgba(0,0,0,0.5); }
        
        .btn-toggle-pass { position: absolute; right: 15px; bottom: 12px; background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; padding: 4px; transition: 0.2s; border-radius: 50%; }
        .btn-toggle-pass:hover { color: #fff; filter: drop-shadow(0 0 5px #fff); }

        .error-message { color: #fff; background: linear-gradient(135deg, #e11d48, #be123c); border: 1px solid #f43f5e; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 900; text-align: center; margin-bottom: 20px; animation: shake 0.4s ease-in-out; box-shadow: 0 4px 15px rgba(225, 29, 72, 0.4); text-shadow: 0 1px 2px rgba(0,0,0,0.4); }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }

        /* 🪄 ボタンも魔法仕様に */
        .btn-login { width: 100%; padding: 18px; background: linear-gradient(135deg, #c084fc, #38bdf8); color: #fff; border: 1px solid rgba(255,255,255,0.4); border-radius: 16px; font-size: 15px; font-weight: 900; cursor: pointer; transition: all 0.3s ease; letter-spacing: 3px; box-shadow: 0 10px 25px rgba(56, 189, 248, 0.4); text-transform: uppercase; position: relative; overflow: hidden; }
        .btn-login::before { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent); transform: skewX(-20deg); transition: 0.5s; }
        .btn-login:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(56, 189, 248, 0.6); background: linear-gradient(135deg, #a855f7, #0ea5e9); }
        .btn-login:hover::before { left: 150%; }
        .btn-login:active { transform: translateY(1px); box-shadow: 0 5px 10px rgba(56, 189, 248, 0.4); }

        .system-status { margin-top: 35px; display: flex; justify-content: center; gap: 20px; font-size: 12px; color: #cbd5e1; font-weight: 800; letter-spacing: 1px; text-shadow: 0 1px 2px rgba(0,0,0,0.8); }
        .status-item { display: flex; align-items: center; gap: 6px; }
        .status-dot { width: 8px; height: 8px; background: #fde047; border-radius: 50%; box-shadow: 0 0 15px #fde047; animation: blink 2s infinite; }
        @keyframes blink { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
      `}} />

      {/* 背景の魔法の光 */}
      <div className="glow-orb-1"></div>
      <div className="glow-orb-2"></div>
      
      {/* 魔法発動時の光のバーストとホワイトアウト */}
      <div className="magic-burst"></div>
      <div className="screen-flash"></div>

      <div className="login-card">
        <div className="login-logo">
          <div className="logo-symbol">✨</div>
          <h1 className="login-title">Team Portal</h1>
          <p className="login-subtitle">Where Work Meets Magic</p>
        </div>

        <form onSubmit={handleLogin}>
          {errorMsg && <div className="error-message">{errorMsg}</div>}
          <div className="input-group">
            <label className="input-label">Cast Member ID (Email)</label>
            <input type="email" className="login-input" placeholder="xxx@octopusenergy.co.jp" value={userId} onChange={(e) => setUserId(e.target.value)} required disabled={isEntering} />
          </div>
          <div className="input-group">
            <label className="input-label">Magic Word (Password)</label>
            <input type={showPassword ? "text" : "password"} className="login-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isEntering} style={{ paddingRight: "45px" }} />
            <button type="button" className="btn-toggle-pass" onClick={() => setShowPassword(!showPassword)} disabled={isEntering} tabIndex={-1}>
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <button type="submit" className="btn-login" disabled={isEntering}>
            {isEntering ? "CASTING MAGIC..." : "ENTER THE PARK"}
          </button>
        </form>

        <div className="system-status">
          <div className="status-item"><span className="status-dot"></span>Magic Engine Ready</div>
          <div className="status-item">v3.1 Active</div>
        </div>
      </div>
    </div>
  );
}