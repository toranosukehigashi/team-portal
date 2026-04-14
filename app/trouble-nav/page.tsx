"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// 🗂️ ナビゲーションのシナリオデータ
type Step = {
  id: string;
  title: string;
  message: string;
  options: { label: string; nextId: string | null }[];
};

const scenarioData: Record<string, Step> = {
  start: {
    id: "start",
    title: "🚨 トラブルの種類を選択してください",
    message: "現在発生しているエラーや、対応したいイレギュラー業務を選択してください。",
    options: [
      { label: "⚙️ SW（スイッチング）エラー", nextId: "sw_error_1" },
      { label: "📧 メアド重複エラー", nextId: "email_dup_1" },
      { label: "❌ 無効化＆BH処理", nextId: "bh_process_1" },
    ],
  },
  // --- SWエラーのシナリオ ---
  sw_error_1: {
    id: "sw_error_1",
    title: "⚙️ SWエラー対応 (1/3)",
    message: "現在の電力会社と、新しく申し込むプランの供給地点特定番号（22桁）は一致していますか？",
    options: [
      { label: "はい、一致しています", nextId: "sw_error_2" },
      { label: "いいえ、間違っていました", nextId: "sw_error_wrong_number" },
    ],
  },
  sw_error_2: {
    id: "sw_error_2",
    title: "⚙️ SWエラー対応 (2/3)",
    message: "名義人は現在契約中の名義と完全に一致していますか？（旧姓や家族名義になっていませんか？）",
    options: [
      { label: "完全に一致しています", nextId: "sw_error_unknown" },
      { label: "名義が異なっていました", nextId: "sw_error_name_fix" },
    ],
  },
  sw_error_wrong_number: {
    id: "sw_error_wrong_number",
    title: "💡 解決策：供給地点特定番号の修正",
    message: "正しい22桁の供給地点特定番号をお客様にご確認いただき、システム上の番号を修正して再度申し込み処理（再連携）を行ってください。",
    options: [{ label: "🏠 最初の画面に戻る", nextId: "start" }],
  },
  sw_error_name_fix: {
    id: "sw_error_name_fix",
    title: "💡 解決策：名義の修正",
    message: "現在の電力会社に登録されている正しい名義（カナ含む）を確認し、システム上の名義を修正して再連携を行ってください。",
    options: [{ label: "🏠 最初の画面に戻る", nextId: "start" }],
  },
  sw_error_unknown: {
    id: "sw_error_unknown",
    title: "💡 解決策：管理者へエスカレーション",
    message: "番号も名義も一致している場合、システムの一時的なエラーや特殊な契約状態の可能性があります。チャットツール等で管理者へエスカレーションしてください。",
    options: [{ label: "🏠 最初の画面に戻る", nextId: "start" }],
  },
  // --- メアド重複のシナリオ ---
  email_dup_1: {
    id: "email_dup_1",
    title: "📧 メアド重複エラー対応",
    message: "登録しようとしたメールアドレスは、過去に別のアカウントで登録されています。お客様は過去のアカウントを現在も利用中ですか？",
    options: [
      { label: "はい、利用中です", nextId: "email_dup_alias" },
      { label: "いいえ、すでに解約済みです", nextId: "email_dup_delete" },
    ],
  },
  email_dup_alias: {
    id: "email_dup_alias",
    title: "💡 解決策：エイリアス（+）の活用",
    message: "Gmail等の場合、既存のアドレスに「+1」などを付けたエイリアスアドレスで登録を案内してください。\n例: example+1@gmail.com",
    options: [{ label: "🏠 最初の画面に戻る", nextId: "start" }],
  },
  email_dup_delete: {
    id: "email_dup_delete",
    title: "💡 解決策：旧アカウントの完全削除依頼",
    message: "旧アカウントの登録情報（メアド・名前・電話番号）をサポート窓口へ連携し、過去アカウントの「完全削除（退会処理）」を依頼してから再登録してください。",
    options: [{ label: "🏠 最初の画面に戻る", nextId: "start" }],
  },
  // --- 無効化処理のシナリオ ---
  bh_process_1: {
    id: "bh_process_1",
    title: "❌ 無効化＆BH処理",
    message: "対象のステータスを「無効」に変更し、BH（ブラックホール）処理用の専用シートへ対象顧客のIDと理由を入力してください。\n入力が完了しましたか？",
    options: [
      { label: "入力完了しました", nextId: "bh_process_done" },
    ],
  },
  bh_process_done: {
    id: "bh_process_done",
    title: "💡 処理完了",
    message: "対応お疲れ様でした。翌日のバッチ処理で自動的にシステムから除外されます。お客様からの問い合わせがあった場合は「キャンセル完了」とお伝え下さい。",
    options: [{ label: "🏠 最初の画面に戻る", nextId: "start" }],
  },
};

export default function TroubleNavigator() {
  const router = useRouter();
  const [history, setHistory] = useState<string[]>(["start"]); // 辿ってきたルートを記憶
  
  const currentStepId = history[history.length - 1];
  const currentStep = scenarioData[currentStepId];

  const handleNext = (nextId: string | null) => {
    if (nextId && scenarioData[nextId]) {
      if (nextId === "start") {
        setHistory(["start"]); // 最初に戻る場合は履歴をリセット
      } else {
        setHistory([...history, nextId]);
      }
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
    }
  };

  return (
    <div className="glass-business-theme">
      <style dangerouslySetInnerHTML={{ __html: `
        .glass-business-theme * { box-sizing: border-box; }
        .glass-business-theme { font-family: 'Inter', 'Noto Sans JP', sans-serif; padding: 40px 20px; color: #334155; font-size: 14px; min-height: 100vh; background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 50%, #f8fafc 100%); overflow-x: hidden; display: flex; justify-content: center; align-items: center; }
        
        .container { width: 100%; max-width: 600px; position: relative; }
        
        .btn-home { position: absolute; top: -60px; left: 0; background: rgba(255, 255, 255, 0.6); border: 1px solid rgba(255,255,255,0.9); padding: 10px 20px; border-radius: 12px; font-weight: 800; color: #475569; cursor: pointer; transition: 0.2s; backdrop-filter: blur(4px); }
        .btn-home:hover { background: #fff; transform: translateX(-3px); box-shadow: 0 4px 15px rgba(0,0,0,0.05); }

        .glass-card { background: rgba(255, 255, 255, 0.65); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.9); border-radius: 24px; padding: 40px; box-shadow: 0 15px 40px rgba(31, 38, 135, 0.08); text-align: center; transition: all 0.3s ease; }
        
        .step-title { font-size: 22px; font-weight: 900; color: #1e293b; margin: 0 0 20px 0; border-bottom: 2px dashed #cbd5e1; padding-bottom: 15px; }
        .step-message { font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 30px; font-weight: 700; white-space: pre-wrap; }

        .options-container { display: flex; flex-direction: column; gap: 12px; }
        
        .btn-option { padding: 16px 24px; background: #fff; border: 2px solid #e2e8f0; border-radius: 16px; font-size: 15px; font-weight: 800; color: #4f46e5; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
        .btn-option:hover { border-color: #6366f1; background: #e0e7ff; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(79,70,229,0.15); }
        
        /* 解決策の表示用スタイル */
        .solution-card { background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 2px solid #86efac; }
        .solution-title { color: #15803d; border-bottom-color: #bbf7d0; }
        .solution-message { color: #166534; font-weight: 800; }

        .btn-back-step { margin-top: 25px; background: transparent; border: none; color: #94a3b8; font-weight: 800; font-size: 13px; cursor: pointer; text-decoration: underline; transition: 0.2s; }
        .btn-back-step:hover { color: #475569; }
      `}} />

      <div className="container">
        <button className="btn-home" onClick={() => router.push("/")}>← ホームに戻る</button>

        <div className={`glass-card ${currentStepId.includes("solution") || currentStepId.includes("fix") || currentStepId.includes("done") || currentStepId.includes("alias") || currentStepId.includes("delete") || currentStepId.includes("unknown") ? "solution-card" : ""}`}>
          <h2 className={`step-title ${currentStepId.includes("solution") || currentStepId.includes("fix") || currentStepId.includes("done") || currentStepId.includes("alias") || currentStepId.includes("delete") || currentStepId.includes("unknown") ? "solution-title" : ""}`}>
            {currentStep.title}
          </h2>
          <p className={`step-message ${currentStepId.includes("solution") || currentStepId.includes("fix") || currentStepId.includes("done") || currentStepId.includes("alias") || currentStepId.includes("delete") || currentStepId.includes("unknown") ? "solution-message" : ""}`}>
            {currentStep.message}
          </p>

          <div className="options-container">
            {currentStep.options.map((option, idx) => (
              <button 
                key={idx} 
                className="btn-option" 
                onClick={() => handleNext(option.nextId)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {history.length > 1 && (
            <button className="btn-back-step" onClick={handleBack}>
              ↩ ひとつ前の質問に戻る
            </button>
          )}
        </div>

      </div>
    </div>
  );
}