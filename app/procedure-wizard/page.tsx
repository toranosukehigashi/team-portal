"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProcedureWizard() {
  const router = useRouter();

  // 🌟 メニューの全項目定義
  type MenuId = 
    | "plan_change" | "cancel_process" | "status_check" 
    | "email_dup" | "bh_process" | "move_out" 
    | "recent_repoint" | "invalid_address" | "address_spin";

  const [activeTab, setActiveTab] = useState<MenuId>("plan_change");

  const menuItems: { id: MenuId; icon: string; label: string }[] = [
    { id: "plan_change", icon: "📝", label: "プラン変更" },
    { id: "cancel_process", icon: "❌", label: "申込取消" },
    { id: "status_check", icon: "⚡", label: "キャンセル確認" },
    { id: "email_dup", icon: "📧", label: "メアド重複対処法" },
    { id: "bh_process", icon: "🗑️", label: "無効化＆BH処理" },
    { id: "move_out", icon: "📦", label: "MOVE OUT（未完成）" },
    { id: "recent_repoint", icon: "⏱️", label: "直近再点対応" },
    { id: "invalid_address", icon: "🚫", label: "無効なアドレス対処法" },
    { id: "address_spin", icon: "🏠", label: "住所変更＆SPIN入力" }
  ];

  return (
    <div className="wizard-layout">
      <style dangerouslySetInnerHTML={{ __html: `
        .wizard-layout * { box-sizing: border-box; }
        .wizard-layout { 
          font-family: 'Inter', 'Noto Sans JP', sans-serif; 
          color: #334155; 
          min-height: 100vh; 
          background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%); 
          display: flex;
        }

        /* 🗂️ 左サイドメニュー（グラスモーフィズム） */
        .sidebar {
          width: 320px;
          height: 100vh;
          position: sticky;
          top: 0;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.8);
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 5px 0 25px rgba(0,0,0,0.02);
          overflow-y: auto;
        }

        .btn-back {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid #e2e8f0;
          padding: 10px 16px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 13px;
          color: #475569;
          cursor: pointer;
          transition: 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 24px;
        }
        .btn-back:hover { background: #fff; transform: translateX(-3px); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

        .sidebar-title {
          font-size: 18px;
          font-weight: 900;
          color: #1e293b;
          margin: 0 0 20px 0;
          padding-bottom: 10px;
          border-bottom: 2px dashed #c7d2fe;
          letter-spacing: 1px;
        }

        .menu-list { display: flex; flex-direction: column; gap: 8px; }
        
        .menu-item {
          background: transparent;
          border: 1px solid transparent;
          padding: 14px 16px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 14px;
          color: #64748b;
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
        }
        .menu-item:hover { background: rgba(255, 255, 255, 0.6); color: #4f46e5; transform: translateX(4px); }
        .menu-item.active {
          background: #fff;
          color: #4f46e5;
          border-color: #e0e7ff;
          box-shadow: 0 4px 15px rgba(79, 70, 229, 0.1);
        }

        /* 📖 右メインコンテンツエリア */
        .main-content {
          flex: 1;
          padding: 40px 5%;
          max-width: 900px;
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* 📖 辞書カードスタイル */
        .dictionary-card { 
          background: rgba(255, 255, 255, 0.7); 
          backdrop-filter: blur(10px);
          border-radius: 24px; 
          padding: 40px; 
          box-shadow: 0 10px 30px rgba(31, 38, 135, 0.05); 
          border: 1px solid rgba(255, 255, 255, 0.9); 
        }
        .card-title { font-size: 24px; font-weight: 900; color: #1e293b; margin-bottom: 30px; display: flex; align-items: center; gap: 12px; border-bottom: 3px solid #e0e7ff; padding-bottom: 15px; }
        
        .step-list { display: flex; flex-direction: column; gap: 16px; }
        .step-item { display: flex; align-items: flex-start; gap: 16px; padding: 20px; background: #fff; border-radius: 16px; border: 1px solid #f1f5f9; transition: 0.2s; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .step-item:hover { border-color: #c7d2fe; transform: scale(1.01); box-shadow: 0 6px 20px rgba(79,70,229,0.06); }
        
        .step-badge { width: 36px; height: 36px; background: linear-gradient(135deg, #6366f1, #4f46e5); color: #fff; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; flex-shrink: 0; box-shadow: 0 4px 10px rgba(79,70,229,0.3); }
        .step-text { font-size: 15px; font-weight: 700; color: #334155; line-height: 1.6; padding-top: 6px; }
        .step-text b { color: #4f46e5; font-size: 16px; background: linear-gradient(transparent 70%, #e0e7ff 0%); }

        /* 特殊ステータス表示 */
        .status-box { margin-top: 30px; padding: 24px; border-radius: 20px; border: 2px dashed #cbd5e1; background: rgba(255,255,255,0.5); }
        .status-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px; }
        .status-item { padding: 20px; border-radius: 16px; text-align: center; }
        .status-ok { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
        .status-ng { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
        .status-label { font-size: 13px; font-weight: 800; margin-bottom: 8px; opacity: 0.8; }
        .status-val { font-size: 20px; font-weight: 900; }

        .note-tag { display: inline-block; padding: 6px 12px; background: #fefce8; color: #b45309; border: 1px solid #fde68a; border-radius: 8px; font-size: 12px; font-weight: 800; margin-top: 12px; }
      `}} />

      {/* 🗂️ 左サイドバー */}
      <aside className="sidebar">
        <button className="btn-back" onClick={() => router.push("/")}>← 司令室に戻る</button>
        <h2 className="sidebar-title">🐙 Kraken マニュアル</h2>
        <nav className="menu-list">
          {menuItems.map(item => (
            <button 
              key={item.id}
              className={`menu-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* 📖 右メインコンテンツ */}
      <main className="main-content">
        
        {/* --- 📝 プラン変更 --- */}
        {activeTab === "plan_change" && (
          <div className="dictionary-card">
            <h2 className="card-title">📝 プラン変更の手順</h2>
            <div className="step-list">
              <div className="step-item"><div className="step-badge">1</div><div className="step-text">画面内の <b>「契約」</b> タブをクリック</div></div>
              <div className="step-item"><div className="step-badge">2</div><div className="step-text"><b>「料金メニュー変更」</b> ボタンをクリック</div></div>
              <div className="step-item"><div className="step-badge">3</div><div className="step-text"><b>「全商品を含む」</b> のチェックをONにする</div></div>
              <div className="step-item"><div className="step-badge">4</div><div className="step-text">表示された <b>Product</b> のリストから、変更先のプランを選択</div></div>
            </div>
          </div>
        )}

        {/* --- ❌ 申込取消 --- */}
        {activeTab === "cancel_process" && (
          <div className="dictionary-card">
            <h2 className="card-title">❌ 申込取消の手順</h2>
            <div className="step-list">
              <div className="step-item"><div className="step-badge">1</div><div className="step-text">対象アカウントで <b>「取消にする」</b> をクリック</div></div>
              <div className="step-item"><div className="step-badge">2</div><div className="step-text"><b>「ユーザータブ」</b> へ移動し <b>「編集」</b> をクリック</div></div>
              <div className="step-item"><div className="step-badge">3</div><div className="step-text"><b>「お客様がメールアドレスを持っていない」</b> にチェックを入れる</div></div>
              <div className="step-item" style={{ borderColor: "#fde68a", background: "#fffbeb" }}>
                <div className="step-badge" style={{ background: "#f59e0b", boxShadow: "none" }}>!</div>
                <div className="step-text" style={{ color: "#92400e" }}>警告が表示されますが、そのまま <b>「無視」</b> して進めてOKです。</div>
              </div>
            </div>
          </div>
        )}

        {/* --- ⚡ キャンセル確認 --- */}
        {activeTab === "status_check" && (
          <div className="dictionary-card">
            <h2 className="card-title">⚡ キャンセル状況の確認方法</h2>
            <div className="step-list">
              <div className="step-item"><div className="step-badge">1</div><div className="step-text"><b>「インダストリー⚡️」</b> タブから該当地点情報を検索</div></div>
              <div className="step-item"><div className="step-badge">2</div><div className="step-text"><b>「異動申込受付情報」</b> のステータスを確認します</div></div>
            </div>
            <div className="status-box">
              <div style={{ fontSize: "15px", fontWeight: 900, textAlign: "center", color: "#64748b" }}>判定ガイド</div>
              <div className="status-grid">
                <div className="status-item status-ok"><div className="status-label">完了（正常）</div><div className="status-val">None</div></div>
                <div className="status-item status-ng"><div className="status-label">未完了（処理中）</div><div className="status-val">「再点」「申込処理中」</div></div>
              </div>
              <div className="note-tag">※Noneと表示されていれば、キャンセル処理は無事に完了しています。</div>
            </div>
          </div>
        )}

        {/* --- 📧 メアド重複対処法 --- */}
        {activeTab === "email_dup" && (
          <div className="dictionary-card">
            <h2 className="card-title">📧 メアド重複対処法</h2>
            <div className="step-list">
              <div className="step-item"><div className="step-badge">1</div><div className="step-text">重複しているメールアドレスを <b>ユーザー検索</b> で特定する</div></div>
              <div className="step-item"><div className="step-badge">2</div><div className="step-text">過去のアカウントが「有効」か「解約済み」かを確認する</div></div>
              <div className="step-item"><div className="step-badge">3</div><div className="step-text">旧アカウントのメアドの末尾に <b>「.bh」</b> などを付けて無効化する</div></div>
              <div className="step-item"><div className="step-badge">4</div><div className="step-text">新アカウントに正しいメールアドレスを登録し直す</div></div>
            </div>
          </div>
        )}

        {/* --- 🗑️ 無効化＆BH処理 --- */}
        {activeTab === "bh_process" && (
          <div className="dictionary-card">
            <h2 className="card-title">🗑️ 無効化＆BH処理</h2>
            <div className="step-list">
              <div className="step-item"><div className="step-badge">1</div><div className="step-text">ユーザー情報の <b>「編集」</b> を開く</div></div>
              <div className="step-item"><div className="step-badge">2</div><div className="step-text">氏名の後ろ、またはメールアドレスの後ろに <b>「_BH」</b> を追記する</div></div>
              <div className="step-item"><div className="step-badge">3</div><div className="step-text">アカウントのステータスを <b>「無効（Inactive）」</b> に変更して保存</div></div>
            </div>
            <div className="note-tag">※ ブラックホール（BH）処理を行った後は、必ず申し送り事項に記録を残してください。</div>
          </div>
        )}

        {/* --- 📦 MOVE OUT（未完成） --- */}
        {activeTab === "move_out" && (
          <div className="dictionary-card">
            <h2 className="card-title">📦 MOVE OUT（引越退去）処理</h2>
            <div className="step-list">
              <div className="step-item"><div className="step-badge">1</div><div className="step-text">対象物件の <b>「契約情報」</b> タブを開く</div></div>
              <div className="step-item"><div className="step-badge">2</div><div className="step-text"><b>「Move Out（退去）」</b> ボタンをクリックする</div></div>
              <div className="step-item" style={{ borderColor: "#cbd5e1", background: "#f8fafc", opacity: 0.7 }}>
                <div className="step-badge" style={{ background: "#94a3b8" }}>🚧</div>
                <div className="step-text">（※このマニュアルは現在作成中です。追加の手順を後日追記してください。）</div>
              </div>
            </div>
          </div>
        )}

        {/* --- ⏱️ 直近再点対応 --- */}
        {activeTab === "recent_repoint" && (
          <div className="dictionary-card">
            <h2 className="card-title">⏱️ 直近再点対応</h2>
            <div className="step-list">
              <div className="step-item"><div className="step-badge">1</div><div className="step-text">インダストリータブから <b>過去の再点日（スイッチング日）</b> を確認</div></div>
              <div className="step-item"><div className="step-badge">2</div><div className="step-text">前回から「3ヶ月以内」の再点である場合、<b>直近再点アラート</b> を確認</div></div>
              <div className="step-item"><div className="step-badge">3</div><div className="step-text">お客様に状況をヒアリングし、必要に応じて <b>特記事項</b> に理由を記載</div></div>
            </div>
          </div>
        )}

        {/* --- 🚫 無効なアドレス対処法 --- */}
        {activeTab === "invalid_address" && (
          <div className="dictionary-card">
            <h2 className="card-title">🚫 無効なアドレス（住所）対処法</h2>
            <div className="step-list">
              <div className="step-item"><div className="step-badge">1</div><div className="step-text">入力された住所がKraken上で <b>「住所不明エラー」</b> となる場合</div></div>
              <div className="step-item"><div className="step-badge">2</div><div className="step-text">日本郵便のサイト等で <b>正式な郵便番号・丁目・番地</b> を検索する</div></div>
              <div className="step-item"><div className="step-badge">3</div><div className="step-text">「大字（おおあざ）」「字（あざ）」などを除外し、システムが認識できるフォーマットに修正</div></div>
            </div>
          </div>
        )}

        {/* --- 🏠 住所変更＆SPIN入力 --- */}
        {activeTab === "address_spin" && (
          <div className="dictionary-card">
            <h2 className="card-title">🏠 住所変更＆SPIN入力</h2>
            <div className="step-list">
              <div className="step-item"><div className="step-badge">1</div><div className="step-text">ユーザー情報の <b>「プロパティ（物件情報）」</b> を開く</div></div>
              <div className="step-item"><div className="step-badge">2</div><div className="step-text">正しい引越先住所を入力し、保存する</div></div>
              <div className="step-item"><div className="step-badge">3</div><div className="step-text"><b>「SPIN（供給地点特定番号）」</b> が空欄の場合は、一般送配電事業者の検索サイトから取得して入力</div></div>
              <div className="step-item"><div className="step-badge">4</div><div className="step-text"><b>「同期」</b> ボタンを押してステータスが正常になるか確認する</div></div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}