"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

// 🔐 登録ユーザーのリスト
const VALID_USERS = [
  { id: "toranosuke.higashi@octopusenergy.co.jp", pass: "701005p" },
  { id: "motoki.ota@octopusenergy.co.jp", pass: "701002p" },
];

export default function Login() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const [isEntering, setIsEntering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // 🪄 3Dパララックス用のステートと参照
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || isEntering) return;
    const rect = cardRef.current.getBoundingClientRect();
    // マウス位置から傾きを計算（奥ゆかしい動きにするため係数を小さく）
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({ x: -(y / 40), y: x / 40 });
  };

  const handleMouseLeave = () => {
    if (!isEntering) setTilt({ x: 0, y: 0 });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const isValidUser = VALID_USERS.some(
      (user) => user.id === userId && user.pass === password
    );

    if (isValidUser) {
      const userName = userId.split("@")[0];
      localStorage.setItem("team_portal_user", userName);
      sessionStorage.setItem("just_logged_in", "true");

      // 🪄 ワープアニメーション発動！
      setIsEntering(true);
      setTilt({ x: 45, y: 0 }); // カードが奥に倒れ込む演出

      setTimeout(() => {
        router.push("/");
      }, 1800); // 映画的な演出に合わせて時間を調整
      
    } else {
      setErrorMsg("⚠️ 魔法の鍵（IDまたはパスワード）が間違っています。");
    }
  };

  return (
    <div className={`login-wrapper ${isEntering ? "entering-magic" : ""}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <style dangerouslySetInnerHTML={{ __html: `
        .login-wrapper * { box-sizing: border-box; }
        .login-wrapper {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          /* 🌌 超一流SaaS風：深淵なる宇宙色とデータグリッド */
          background-color: #020617;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          background-position: center center;
          font-family: 'Inter', 'Noto Sans JP', sans-serif;
          overflow: hidden; position: relative; padding: 20px;
          perspective: 1500px;
        }

        /* 🌊 超一流SaaS風：流体オーロラ（Fluid Gradient Blob） */
        .aurora-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 0; pointer-events: none; filter: blur(80px); opacity: 0.6; }
        .aurora-blob { position: absolute; border-radius: 50%; mix-blend-mode: screen; animation: fluid 20s infinite alternate ease-in-out; }
        .blob-1 { width: 60vw; height: 60vw; background: #c084fc; top: -10%; left: -10%; animation-delay: 0s; }
        .blob-2 { width: 50vw; height: 50vw; background: #38bdf8; bottom: -20%; right: -10%; animation-delay: -5s; }
        .blob-3 { width: 40vw; height: 40vw; background: #fde047; top: 30%; left: 40%; animation-delay: -10s; opacity: 0.5; }
        @keyframes fluid {
          0% { transform: translate(0, 0) scale(1); border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          50% { transform: translate(10vw, 5vh) scale(1.1); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          100% { transform: translate(-5vw, 15vh) scale(0.9); border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%; }
        }

        /* 🎇 ログイン成功時のワープライン（ハイパースペース） */
        .warp-lines { position: absolute; top: 50%; left: 50%; width: 200vw; height: 200vw; transform: translate(-50%, -50%) scale(0); border-radius: 50%; background: repeating-radial-gradient(circle at center, transparent 0, transparent 40px, rgba(255,255,255,0.8) 41px, transparent 42px); opacity: 0; pointer-events: none; z-index: 900; }
        .login-wrapper.entering-magic .warp-lines { animation: hyperSpace 1.5s cubic-bezier(0.5, 0, 0.2, 1) forwards; }
        @keyframes hyperSpace { 0% { transform: translate(-50%, -50%) scale(0); opacity: 0; } 50% { opacity: 1; } 100% { transform: translate(-50%, -50%) scale(3); opacity: 0; filter: blur(5px); } }

        /* 真っ白な夢の国へ繋がるホワイトアウト */
        .screen-flash { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #ffffff; opacity: 0; pointer-events: none; z-index: 999; transition: opacity 0.8s ease; transition-delay: 0.8s; }
        .login-wrapper.entering-magic .screen-flash { opacity: 1; }

        /* 🪟 究極のグラスモーフィズム・カード */
        .login-card-container {
          position: relative; z-index: 10; width: 100%; max-width: 440px;
          transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
          transform-style: preserve-3d;
        }

        .login-card {
          width: 100%; padding: 50px 45px;
          background: rgba(15, 23, 42, 0.45); 
          backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.1); 
          border-top: 1px solid rgba(255, 255, 255, 0.3); 
          border-left: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 32px; 
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.8), inset 0 2px 20px rgba(255, 255, 255, 0.05);
          position: relative; overflow: hidden;
        }

        /* カードの表面を走る光の反射（Glare） */
        .card-glare { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 60%); pointer-events: none; z-index: 1; mix-blend-mode: overlay; }

        /* 🏰 魔法発動時：カードが奥に倒れ込みながら光の粒に分解されるような演出 */
        .login-wrapper.entering-magic .login-card-container { transform: translateZ(-500px) rotateX(45deg) scale(0.8) !important; opacity: 0; filter: blur(20px); transition: all 1.2s cubic-bezier(0.5, 0, 0.2, 1); }
        .login-wrapper.entering-magic .login-card { box-shadow: 0 0 100px 50px rgba(192, 132, 252, 0.8); border-color: rgba(255,255,255,0.8); }

        .login-content { position: relative; z-index: 2; transform: translateZ(30px); }

        .login-logo { text-align: center; margin-bottom: 40px; }
        .logo-symbol { font-size: 55px; margin-bottom: 5px; filter: drop-shadow(0 0 20px rgba(56, 189, 248, 0.6)); display: inline-block; animation: floatLogo 4s ease-in-out infinite alternate; }
        @keyframes floatLogo { 0% { transform: translateY(0) rotate(-5deg); filter: drop-shadow(0 0 15px rgba(56, 189, 248, 0.4)); } 100% { transform: translateY(-15px) rotate(5deg); filter: drop-shadow(0 20px 25px rgba(192, 132, 252, 0.8)); } }

        .login-title { font-size: 34px; font-weight: 900; letter-spacing: 1px; margin: 0; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
        .login-subtitle { color: #38bdf8; font-size: 12px; margin-top: 8px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; text-shadow: 0 0 10px rgba(56, 189, 248, 0.4); }

        .input-group { margin-bottom: 25px; width: 100%; position: relative; }
        .input-label { display: block; color: #94a3b8; font-size: 11px; font-weight: 800; margin-bottom: 8px; letter-spacing: 1.5px; text-transform: uppercase; }
        .login-input { width: 100%; padding: 18px 20px; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; color: #fff; font-size: 15px; outline: none; transition: all 0.3s ease; font-weight: 700; letter-spacing: 1px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5); }
        .login-input::placeholder { color: #475569; font-weight: 600; }
        .login-input:focus { border-color: #38bdf8; background: rgba(0, 0, 0, 0.6); box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.15), inset 0 2px 5px rgba(0,0,0,0.5); transform: translateY(-2px); }
        
        /* ✨ SVGアイコン用にスタイルを調整 */
        .btn-toggle-pass { position: absolute; right: 15px; bottom: 16px; background: none; border: none; color: #64748b; cursor: pointer; padding: 4px; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .btn-toggle-pass:hover { color: #fde047; filter: drop-shadow(0 0 8px rgba(253,224,71,0.6)); transform: scale(1.1); }

        .error-message { color: #fecdd3; background: rgba(225, 29, 72, 0.2); border: 1px solid rgba(225, 29, 72, 0.5); padding: 14px; border-radius: 12px; font-size: 13px; font-weight: 800; text-align: center; margin-bottom: 25px; animation: shake 0.4s ease-in-out; backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; gap: 8px; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }

        /* 🪄 プロ仕様の洗練されたボタン */
        .btn-login { width: 100%; padding: 18px; background: #f8fafc; color: #0f172a; border: none; border-radius: 16px; font-size: 14px; font-weight: 900; cursor: pointer; transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); letter-spacing: 2px; text-transform: uppercase; position: relative; overflow: hidden; display: flex; justify-content: center; align-items: center; gap: 10px; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
        .btn-login::before { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); transform: skewX(-20deg); transition: 0s; }
        .btn-login:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(255,255,255,0.2); background: #ffffff; color: #000; }
        .btn-login:hover::before { left: 200%; transition: left 0.6s ease-out; }
        .btn-login:active { transform: translateY(1px); box-shadow: 0 5px 10px rgba(0,0,0,0.5); }
        
        .btn-login.casting { background: linear-gradient(135deg, #c084fc, #38bdf8); color: #fff; box-shadow: 0 0 30px rgba(56, 189, 248, 0.6); pointer-events: none; border: 1px solid rgba(255,255,255,0.5); }

        .system-status { margin-top: 35px; display: flex; justify-content: center; gap: 20px; font-size: 11px; color: #64748b; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; }
        .status-item { display: flex; align-items: center; gap: 6px; }
        .status-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 15px #10b981; animation: blink 2s infinite; }
        @keyframes blink { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
      `}} />

      {/* 🌊 背景：流体オーロラ */}
      <div className="aurora-container">
        <div className="aurora-blob blob-1"></div>
        <div className="aurora-blob blob-2"></div>
        <div className="aurora-blob blob-3"></div>
      </div>
      
      {/* 🎇 ワープ演出 */}
      <div className="warp-lines"></div>
      <div className="screen-flash"></div>

      {/* 🪟 カード本体（マウス追従の3Dパララックス） */}
      <div 
        className="login-card-container" 
        ref={cardRef}
        style={{ transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        <div className="login-card">
          {/* 反射光エフェクト */}
          <div className="card-glare" style={{ transform: `translate(${tilt.y * 2}px, ${-tilt.x * 2}px)` }}></div>
          
          <div className="login-content">
            <div className="login-logo">
              <div className="logo-symbol">✨</div>
              <h1 className="login-title">Team Portal</h1>
              <p className="login-subtitle">Workspace</p>
            </div>

            <form onSubmit={handleLogin}>
              {errorMsg && <div className="error-message"><span>⚠️</span> {errorMsg}</div>}
              
              <div className="input-group">
                <label className="input-label">Cast Member ID</label>
                <input 
                  type="email" 
                  className="login-input" 
                  placeholder="name@octopusenergy.co.jp" 
                  value={userId} 
                  onChange={(e) => setUserId(e.target.value)} 
                  required 
                  disabled={isEntering} 
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Magic Word</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="login-input" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  disabled={isEntering} 
                  style={{ paddingRight: "45px" }} 
                />
                
                {/* ✨ 猿と目の絵文字を廃止し、プロ仕様のSVGアイコンに差し替え！！ */}
                <button 
                  type="button" 
                  className="btn-toggle-pass" 
                  onClick={() => setShowPassword(!showPassword)} 
                  disabled={isEntering} 
                  tabIndex={-1}
                  aria-label="Toggle Password Visibility"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              
              <button type="submit" className={`btn-login ${isEntering ? "casting" : ""}`} disabled={isEntering}>
                {isEntering ? "Initiating Warp..." : "Secure Login ➔"}
              </button>
            </form>

            <div className="system-status">
              <div className="status-item"><span className="status-dot"></span>Secure Connection</div>
              <div className="status-item">v3.1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}