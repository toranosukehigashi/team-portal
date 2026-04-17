"use client";

import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // 🖱 スマホ等タッチデバイスでは発動させない
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // ボタン、リンク、カード、入力欄などに重なった時にクラスを付与
      if (target.closest('button') || target.closest('a') || target.closest('.magic-card') || target.closest('.script-box') || target.closest('summary') || target.closest('input') || target.closest('select') || target.closest('textarea')) {
        cursorRef.current?.classList.add('hover');
      } else {
        cursorRef.current?.classList.remove('hover');
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* 🎯 魔法のカスタムカーソル用のスタイル (PCのみ) 全ページ適用版 */
        @media (pointer: fine) { body * { cursor: none !important; } }
        .hide-on-mobile { display: block; }
        @media (pointer: coarse) { .hide-on-mobile { display: none !important; } }
        
        .custom-cursor {
          position: fixed; top: 0; left: 0; width: 20px; height: 20px;
          margin-top: -10px; margin-left: -10px; border-radius: 50%;
          background: #fff; pointer-events: none; z-index: 999999;
          mix-blend-mode: difference;
          transition: width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), margin 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          will-change: transform;
        }
        .custom-cursor.hover {
          width: 40px; height: 40px; margin-top: -20px; margin-left: -20px;
          background: rgba(255, 255, 255, 1); mix-blend-mode: difference;
        }
      `}} />
      <div ref={cursorRef} className="custom-cursor hide-on-mobile" />
    </>
  );
}