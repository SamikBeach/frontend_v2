import { LibraryTag } from '@/apis/library/types';
import { useLibraryDetail } from '@/app/libraries/hooks/useLibraryDetail';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useParams } from 'next/navigation';

// 실제 API에서 오는 태그 타입 (LibraryTag 인터페이스와 일치하지 않는 경우를 위한 추가 타입)
interface ApiTag extends Omit<LibraryTag, 'name' | 'tagName'> {
  name?: string;
  tagName?: string;
}

// 파스텔톤 색상 배열
const pastelColors = [
  '#FFD6E0', // 연한 분홍
  '#FFEFB5', // 연한 노랑
  '#D1F0C2', // 연한 초록
  '#C7CEEA', // 연한 파랑
  '#F0E6EF', // 연한 보라
  '#E2F0CB', // 연한 민트
];

export function LibraryHeader() {
  const params = useParams();
  const libraryId = parseInt(params.id as string, 10);

  // useLibraryDetail 훅으로 상태와 핸들러 함수 가져오기
  const { library, isSubscribed, handleSubscriptionToggle } =
    useLibraryDetail(libraryId);

  if (!library) {
    return null;
  }

  // 태그가 있는지 확인
  const hasTags = library.tags && library.tags.length > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white pt-3">
      <div className="flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{library.name}</h1>
          {hasTags && library.tags && (
            <div className="flex flex-wrap gap-2">
              {library.tags.map((tag, index) => (
                <Badge
                  key={tag.id}
                  className="rounded-full border-0 px-4 py-1 text-sm font-medium text-gray-700"
                  style={{
                    backgroundColor: pastelColors[index % pastelColors.length],
                  }}
                >
                  {(tag as ApiTag).tagName || (tag as ApiTag).name}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">
            {library.owner.username}
          </span>
          님의 서재
        </p>
      </div>

      {/* 구독 버튼 영역 */}
      <div className="flex items-center">
        <Button
          variant={isSubscribed ? 'outline' : 'default'}
          size="lg"
          onClick={handleSubscriptionToggle}
          className={`relative h-10 w-32 rounded-full font-medium ${
            isSubscribed
              ? 'border-gray-300 text-gray-800 hover:bg-gray-100'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          <span className="absolute left-5">
            <Bell
              className={`h-5 w-5 ${isSubscribed ? 'text-gray-800' : 'text-white'}`}
            />
          </span>
          <span className="ml-7">{isSubscribed ? '구독중' : '구독하기'}</span>
        </Button>
      </div>
    </div>
  );
}
