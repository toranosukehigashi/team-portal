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
      range: "シンプル獲得（じげん、侍）!A2:F", // A列からF列まで取得
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return NextResponse.json([]);

    // 💡 ご主人様の列構成に合わせて正確にマッピング
    const data = rows.map((row) => ({
      timestamp: row[0] || "",   // A列
      email: row[1] || "",       // B列
      phone: row[2] || "",       // C列
      plan: row[3] || "",        // D列：プラン名
      simpleWari: row[4] || "",  // E列：確認しました
      jusetsu: row[5] || "",     // F列：はい
    }));

    // 新しいデータが「下」に追加される順番（古い順）
    data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "APIエラー", details: error.message }, { status: 500 });
  }
}