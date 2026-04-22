"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 💡 ログイン画面だけは誰でも見れないと困るのでパス（通過）させる！
    if (pathname === "/login") {
      setIsAuthorized(true);
      return;
    }

    // 💡 ブラウザの記憶（ローカルストレージ）からログイン証をチェック！
    const user = localStorage.getItem("team_portal_user");
    if (!user) {
      // 🚨 証を持っていなければ、即座にログイン画面へ強制送還！！
      router.replace("/login");
    } else {
      // ✅ 持っていれば閲覧許可！
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  // 💥 認証が完了するまでは、画面を「真っ黒（虚無）」にして1ミリも情報を覗かせない！
  if (!isAuthorized && pathname !== "/login") {
    return (
      <div style={{ width: "100vw", height: "100vh", backgroundColor: "#020617", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#38bdf8", fontWeight: "900", letterSpacing: "2px", fontSize: "14px", animation: "pulse 1.5s infinite" }}>
          <style>{`@keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }`}</style>
          🔐 セキュリティ認証を確認中...
        </div>
      </div>
    );
  }

  // 認証OKなら、要求されたページ（children）を表示する
  return <>{children}</>;
}