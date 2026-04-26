// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        // 🚨 【超重要：ゼロトラストの壁】
        // ここを会社のドメイン（例: "@zyuusetu-simple.com"）に変更すると、
        // 個人のGmailなどでログインしようとしても「アクセス拒否」になります！
        // ※テスト中は "@gmail.com" やご自身のメールアドレスを指定してもOKです！
        return profile?.email?.endsWith("@octopusenergy.co.jp") ?? false;
      }
      return true;
    },
  },
  pages: {
    // カスタムログインページがある場合はここを指定しますが、
    // まずはNextAuthデフォルトの安全なログイン画面を使います。
    // signIn: '/login', 
  },
});

export { handler as GET, handler as POST };