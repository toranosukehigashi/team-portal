"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true); // 💡 「チェック中」という状態を追加！

  useEffect(() => {
    // ログイン画面はスルー
    if (pathname === "/login") {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    // ブラウザの記憶からログイン証をチェック！
    const user = localStorage.getItem("team_portal_user");
    if (!user) {
      router.replace("/login"); // 持ってなければログイン画面へ
    } else {
      setIsAuthorized(true); // 持ってればOK
    }
    
    setIsChecking(false); // 💡 0.01秒のチェック完了！
  }, [pathname, router]);

  // 💥 ここが最大のポイント！
  // チェック中の 0.01秒間 は、黒い画面を出すのではなく「null（透明・無）」を返す！
  // これにより、更新しても一切画面がチラつかず、シームレスにページが表示されます！！
  if (isChecking) {
    return null; 
  }

  // 弾き飛ばされる際も無表示にする
  if (!isAuthorized && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}