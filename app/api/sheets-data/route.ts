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
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
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

    const data = rows.slice(-100).reverse().map((row) => {
      
      // 🎯 電気ガスセット割
      if (range.includes("電気ガスセット割")) {
        return {
          timestamp: row[0], email: row[1], phone: row[2], plan: row[3], gasSet: row[4], jusetsu: row[5]
        };
      }

      // 🎯 グリーン デンワde割
      if (range.includes("デンワde割")) {
        return {
          timestamp: row[0], email: row[1], phone: row[2], jusetsu: row[3], sakutto: row[4]
        };
      }

      // 🚀 修正完了：名古屋オフィス ＆ フォームの回答1 (半角)
      if (range.includes("名古屋") || range.includes("フォームの回答1")) {
        return {
          timestamp: row[0], email: row[1], phone: row[2], plan: row[3], jusetsu: row[4]
        };
      }

      // 🎯 デフォルト：シンプル獲得（侍、その他）
      return {
        timestamp: row[0], email: row[1], phone: row[2], plan: row[3], simpleWari: row[4], jusetsu: row[5]
      };
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ 
      error: `Google APIエラー: ${error.message}` 
    }, { status: 500 });
  }
}