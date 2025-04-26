'use client';

import { Libraries } from './components/Libraries';

// 스크롤바 숨기는 CSS 추가
const noScrollbarStyles = `
  /* 스크롤바 숨김 */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// 메인 페이지 컴포넌트
export default function LibrariesPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      {/* CSS 스타일 추가 */}
      <style dangerouslySetInnerHTML={{ __html: noScrollbarStyles }} />
      <Libraries />
    </div>
  );
}
