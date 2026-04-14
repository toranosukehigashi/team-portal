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
  
  const [isWarping, setIsWarping] = useState(false);
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
      
      // ✨ 追加：HOME画面に「今ログインしたばかり」と伝えるフラグをセット
      sessionStorage.setItem("just_logged_in", "true");

      setIsWarping(true);

      setTimeout(() => {
        router.push("/");
      }, 1200);
      
    } else {
      setErrorMsg("⚠️ IDまたはパスワードが間違っています。");
    }
  };

  return (
    <div className={`login-wrapper ${isWarping ? "warping" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        .login-wrapper * { box-sizing: border-box; }
        .login-wrapper {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background-color: #0f172a; font-family: 'Inter', 'Noto Sans JP', sans-serif;
          overflow: hidden; position: relative; padding: 20px;
          perspective: 1000px;
        }

        .glow-orb-1 { position: absolute; top: -10%; left: -10%; width: 50vw; height: 50vw; background: #4f46e5; border-radius: 50%; filter: blur(120px); opacity: 0.4; animation: float 20s ease-in-out infinite alternate; transition: all 1s ease; }
        .glow-orb-2 { position: absolute; bottom: -10%; right: -10%; width: 40vw; height: 40vw; background: #ec4899; border-radius: 50%; filter: blur(120px); opacity: 0.3; animation: float 15s ease-in-out infinite alternate-reverse; transition: all 1s ease; }
        @keyframes float { 0% { transform: translate(0, 0); } 100% { transform: translate(10%, 10%); } }

        .login-card {
          width: 100%; max-width: 420px; padding: 50px 40px;
          background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1); border-top: 1px solid rgba(255, 255, 255, 0.2); border-left: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 32px; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
          position: relative; z-index: 10;
          transition: all 1s cubic-bezier(0.8, 0, 0.2, 1);
          transform-style: preserve-3d;
        }

        .warp-tunnel {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0);
          width: 150vw; height: 150vw; border-radius: 50%;
          background: conic-gradient(from 0deg, transparent 0%, rgba(99,102,241,0.6) 25%, transparent 50%, rgba(236,72,153,0.6) 75%, transparent 100%);
          opacity: 0; pointer-events: none; z-index: 20;
          transition: all 1.2s cubic-bezier(0.5, 0, 0.2, 1);
        }
        .screen-flash {
          position: absolute; top: 0; left: 0; width: 100vw; height: 100vh;
          background: #0f172a; opacity: 0; pointer-events: none; z-index: 999;
          transition: opacity 0.8s ease; transition-delay: 0.4s; 
        }

        .login-wrapper.warping .login-card { transform: translateZ(-1000px) scale(0.5); opacity: 0; filter: blur(10px); }
        .login-wrapper.warping .warp-tunnel { transform: translate(-50%, -50%) scale(1); opacity: 1; animation: spin 0.3s linear infinite; }
        .login-wrapper.warping .screen-flash { opacity: 1; }
        @keyframes spin { 100% { transform: translate(-50%, -50%) scale(1.2) rotate(360deg); } }

        .login-logo { text-align: center; margin-bottom: 35px; }
        .logo-symbol { display: inline-block; width: 56px; height: 56px; background: linear-gradient(135deg, #8b5cf6, #3b82f6); border-radius: 16px; margin-bottom: 16px; box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4); border: 1px solid rgba(255,255,255,0.2); }
        .login-title { font-size: 26px; font-weight: 900; color: #fff; letter-spacing: 2px; margin: 0; text-shadow: 0 2px 10px rgba(255,255,255,0.2); }
        .login-subtitle { color: #94a3b8; font-size: 13px; margin-top: 8px; font-weight: 700; letter-spacing: 1px; }

        .input-group { margin-bottom: 24px; width: 100%; position: relative; }
        .input-label { display: block; color: #cbd5e1; font-size: 12px; font-weight: 800; margin-bottom: 8px; letter-spacing: 1px; }
        .login-input { width: 100%; padding: 16px 20px; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; color: #fff; font-size: 15px; outline: none; transition: all 0.3s ease; font-weight: 700; letter-spacing: 1px; }
        .login-input::placeholder { color: #64748b; font-weight: 400; }
        .login-input:focus { border-color: #8b5cf6; background: rgba(0, 0, 0, 0.3); box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15); }
        
        .btn-toggle-pass { position: absolute; right: 15px; bottom: 12px; background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; padding: 4px; transition: 0.2s; border-radius: 50%; }
        .btn-toggle-pass:hover { color: #fff; background: rgba(255,255,255,0.1); }

        .error-message { color: #fca5a5; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 800; text-align: center; margin-bottom: 20px; animation: shake 0.4s ease-in-out; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }

        .btn-login { width: 100%; padding: 18px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; font-size: 16px; font-weight: 900; cursor: pointer; transition: all 0.3s ease; letter-spacing: 2px; box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3); }
        .btn-login:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(99, 102, 241, 0.5); background: linear-gradient(135deg, #4f46e5, #7c3aed); }
        .btn-login:active { transform: translateY(1px); box-shadow: 0 5px 10px rgba(99, 102, 241, 0.3); }

        .system-status { margin-top: 35px; display: flex; justify-content: center; gap: 20px; font-size: 11px; color: #64748b; font-weight: 800; letter-spacing: 1px; }
        .status-item { display: flex; align-items: center; gap: 6px; }
        .status-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 12px #10b981; animation: blink 2s infinite; }
        @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
      `}} />

      <div className="glow-orb-1"></div>
      <div className="glow-orb-2"></div>
      <div className="warp-tunnel"></div>
      <div className="screen-flash"></div>

      <div className="login-card">
        <div className="login-logo">
          <div className="logo-symbol"></div>
          <h1 className="login-title">TEAM PORTAL</h1>
          <p className="login-subtitle">SECURE WORKSPACE</p>
        </div>

        <form onSubmit={handleLogin}>
          {errorMsg && <div className="error-message">{errorMsg}</div>}
          <div className="input-group">
            <label className="input-label">User ID (Email)</label>
            <input type="email" className="login-input" placeholder="xxx@octopusenergy.co.jp" value={userId} onChange={(e) => setUserId(e.target.value)} required disabled={isWarping} />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input type={showPassword ? "text" : "password"} className="login-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isWarping} style={{ paddingRight: "45px" }} />
            <button type="button" className="btn-toggle-pass" onClick={() => setShowPassword(!showPassword)} disabled={isWarping} tabIndex={-1}>
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <button type="submit" className="btn-login" disabled={isWarping}>
            {isWarping ? "LINKING..." : "SYSTEM ENTER"}
          </button>
        </form>

        <div className="system-status">
          <div className="status-item"><span className="status-dot"></span>Secure Connection</div>
          <div className="status-item">v3.1 Active</div>
        </div>
      </div>
    </div>
  );
}