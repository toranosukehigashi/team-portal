import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const spreadsheetId = searchParams.get("id");
  const range = searchParams.get("range");

  if (!spreadsheetId || !range) {
    return NextResponse.json({ error: "IDと範囲が必要です" }, { status: 400 });
  }

  try {
  // パターンBの場合の認証コード
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

    const sheets = google.sheets({ version: "v4", auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows) return NextResponse.json([]);

    // 💡 どんなにデータが増えても、最新100件だけを切り取る最強ロジック
    const data = rows.slice(-100).reverse().map((row) => {
      if (range.includes("名古屋")) {
        return {
          timestamp: row[0],
          email: row[1],
          phone: row[2],
          plan: row[3],
          jusetsu: row[4],
          type: "nagoya"
        };
      } else {
        return {
          timestamp: row[0],
          email: row[1],
          phone: row[2],
          plan: row[3],
          simpleWari: row[4],
          jusetsu: row[5],
          type: "standard"
        };
      }
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Google APIエラー: " + error.message }, { status: 500 });
  }
}