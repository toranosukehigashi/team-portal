import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
      key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      // 💡 AからFまでしっかり取得します！
      range: "シンプル獲得（じげん、侍）!A2:F", 
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json([]);
    }

    // 💡 6つの項目を正確にマッピング
    const data = rows.map((row) => ({
      timestamp: row[0] || "",
      email: row[1] || "",
      phone: row[2] || "",
      plan: row[3] || "",          // プラン名
      simpleWari: row[4] || "",    // シンプル割（「確認しました」が入る場所）
      jusetsu: row[5] || "",       // 重要事項説明書
    }));

    // 💡 新しいデータが「下」に追加される順番（古い順：昇順）
    // スプシの並び順を維持、または念のためタイムスタンプでソート
    data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "API接続に失敗しました", details: error.message }, { status: 500 });
  }
}