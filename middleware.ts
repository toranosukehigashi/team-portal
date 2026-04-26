// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  // login の除外を消しました！これで全ページに警備員が立ちます！
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};