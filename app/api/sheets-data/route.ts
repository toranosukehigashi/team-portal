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
      range: "シンプル獲得（じげん、侍）!A2:F", // 一旦全体を取得（またはA:Fで全行）
    });

    const allRows = response.data.values;
    if (!allRows || allRows.length === 0) return NextResponse.json([]);

    // 💡 【ここがポイント！】下から100個だけを切り取る
    // slice(-100) と書くだけで、常に最新の100件になります！
    const latestRows = allRows.slice(-100);

    const data = latestRows.map((row) => ({
      timestamp: row[0] || "",
      email: row[1] || "",
      phone: row[2] || "",
      plan: row[3] || "",
      simpleWari: row[4] || "",
      jusetsu: row[5] || "",
    }));

    // 💡 並び順は「古い順（新しいのが下）」を維持
    // スプシの並び順（最後100件をそのまま）なので、特に追加のソートなしでも順番通りです
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "APIエラー", details: error.message }, { status: 500 });
  }
}