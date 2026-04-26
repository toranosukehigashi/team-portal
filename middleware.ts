import { withAuth } from "next-auth/middleware";

// 省略形を使わず、明確に関数としてエクスポート（Turbopackのパニック対策！）
export default withAuth;

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};