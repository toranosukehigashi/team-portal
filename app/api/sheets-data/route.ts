import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // URLから「どのスプシIDか」「どの範囲か」を受け取る
  const { searchParams } = new URL(request.url);
  const spreadsheetId = searchParams.get("id");
  const range = searchParams.get("range");

  if (!spreadsheetId || !range) {
    return NextResponse.json({ error: "IDと範囲が必要です" }, { status: 400 });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SHEETS_JSON!),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows) return NextResponse.json([]);

    // カラム数に応じて動的にマッピング
    const data = rows.slice(-100).reverse().map((row) => {
      if (range.includes("名古屋")) {
        // 名古屋版（5カラム）
        return {
          timestamp: row[0],
          email: row[1],
          phone: row[2],
          plan: row[3],
          jusetsu: row[4],
          type: "nagoya"
        };
      } else {
        // 通常版（6カラム）
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
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "取得失敗" }, { status: 500 });
  }
}