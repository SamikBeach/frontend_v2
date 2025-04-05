import React from 'react';

type AvatarProps = {
  className?: string;
};

// 랜덤 색상 목록
const bgColors = [
  'bg-blue-100',
  'bg-green-100',
  'bg-yellow-100',
  'bg-red-100',
  'bg-purple-100',
  'bg-pink-100',
  'bg-orange-100',
  'bg-teal-100',
];

// 얼굴 타입
type FaceType = 'happy' | 'smile' | 'wink' | 'surprised' | 'cute';

export function Avatar({ className }: AvatarProps) {
  // 컴포넌트 마운트 시 랜덤 속성 선택
  const [attributes] = React.useState(() => {
    const color = bgColors[Math.floor(Math.random() * bgColors.length)];
    const faceType: FaceType = ['happy', 'smile', 'wink', 'surprised', 'cute'][
      Math.floor(Math.random() * 5)
    ] as FaceType;
    const hasHat = Math.random() > 0.5;
    const hasCheeks = Math.random() > 0.3;

    return { color, faceType, hasHat, hasCheeks };
  });

  // 얼굴 표정 렌더링
  const renderFace = () => {
    switch (attributes.faceType) {
      case 'happy':
        return (
          <>
            {/* 눈 */}
            <div className="flex justify-center space-x-4 pt-3">
              <div className="h-2 w-2 rounded-full bg-gray-800"></div>
              <div className="h-2 w-2 rounded-full bg-gray-800"></div>
            </div>
            {/* 입 */}
            <div className="mx-auto mt-3 h-2 w-6 rounded-b-xl bg-gray-800"></div>
          </>
        );
      case 'smile':
        return (
          <>
            {/* 눈 */}
            <div className="flex justify-center space-x-4 pt-3">
              <div className="h-1.5 w-2 rounded-full bg-gray-800"></div>
              <div className="h-1.5 w-2 rounded-full bg-gray-800"></div>
            </div>
            {/* 입 */}
            <div className="mx-auto mt-3 h-2.5 w-5 rounded-b-full border-b-2 border-gray-800"></div>
          </>
        );
      case 'wink':
        return (
          <>
            {/* 눈 */}
            <div className="flex justify-center space-x-4 pt-3">
              <div className="h-1 w-2 rounded-full bg-gray-800"></div>
              <div className="h-2 w-2 rounded-full bg-gray-800"></div>
            </div>
            {/* 입 */}
            <div className="mx-auto mt-3 h-1.5 w-4 rounded-full bg-gray-800"></div>
          </>
        );
      case 'surprised':
        return (
          <>
            {/* 눈 */}
            <div className="flex justify-center space-x-4 pt-3">
              <div className="h-2.5 w-2.5 rounded-full bg-gray-800"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-gray-800"></div>
            </div>
            {/* 입 */}
            <div className="mx-auto mt-3 h-3 w-3 rounded-full bg-gray-800"></div>
          </>
        );
      case 'cute':
        return (
          <>
            {/* 눈 */}
            <div className="flex justify-center space-x-5 pt-3">
              <div className="h-0.5 w-2 rounded-full bg-gray-800"></div>
              <div className="h-0.5 w-2 rounded-full bg-gray-800"></div>
            </div>
            {/* 쉬프트 키 모양의 입 */}
            <div className="mx-auto mt-2 h-3 w-3 rotate-45 transform border-b-2 border-l-2 border-gray-800"></div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* 얼굴 */}
      <div
        className={`relative h-16 w-16 rounded-full ${attributes.color} flex flex-col items-center`}
      >
        {/* 모자 (있을 경우) */}
        {attributes.hasHat && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
            <div className="h-2 w-10 rounded-t-lg bg-red-400"></div>
            <div className="mx-auto h-4 w-6 rounded-t-lg bg-red-400"></div>
          </div>
        )}

        {/* 표정 */}
        {renderFace()}

        {/* 볼 (있을 경우) */}
        {attributes.hasCheeks && (
          <div className="absolute top-6 flex w-full justify-between px-1">
            <div className="h-1.5 w-2 rounded-full bg-red-300 opacity-70"></div>
            <div className="h-1.5 w-2 rounded-full bg-red-300 opacity-70"></div>
          </div>
        )}
      </div>
    </div>
  );
}
