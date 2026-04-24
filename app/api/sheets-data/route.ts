import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 💡 .env.local に書いた合鍵を使ってログイン！
// 💡 TypeScriptを完全に黙らせる「保険付き」の書き方！
// 💡 TypeScriptも大絶賛する、最新の「名前付き（オブジェクト）」の書き方！
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
      key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    // 💡 スプシBからデータを取得（A2からFの底まで無限に取得！）
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "シンプル獲得（じげん、侍）!A2:F", 
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return NextResponse.json([]);

    // 💡 表示用にデータを整理
    // 【修正✨】 row: any[] と書くことでTypeScriptの赤い波線を黙らせます！
    const formattedData = rows.map((row: any[]) => ({
      timestamp: row[0] || "",
      email: row[1] || "",
      phone: row[2] || "",
      plan: row[3] || "",
    })).reverse(); // 👈 新しいデータが一番上に来るように逆順にする魔法！

    return NextResponse.json(formattedData);
 } catch (error: any) {
    console.error("Sheets API Error:", error);
    // 👇 ここ！ error.message を追加して、Googleの本音を画面に表示させます！
    return NextResponse.json({ 
      error: "API接続に失敗しました", 
      details: error.message 
    }, { status: 500 });
  }
}
