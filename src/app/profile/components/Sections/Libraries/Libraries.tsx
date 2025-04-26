import { createLibrary } from '@/apis/library/library';
import { CreateLibraryDto } from '@/apis/library/types';
import { LibraryPreviewDto } from '@/apis/user/types';
import { LibraryDialog } from '@/components/Library';
import { LibraryCard } from '@/components/LibraryCard';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Tag, getTagColor } from '@/utils/tags';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useIsMyProfile, useUserLibraries } from '../../../hooks';
import { LibrariesSkeleton } from './LibrariesSkeleton';

// 샘플 서재 데이터 (LibraryCard에 맞게 수정)
const userLibraries: any[] = [
  {
    id: 1,
    name: '철학 고전',
    description: '플라톤부터 니체까지, 철학 관련 고전 모음',
    category: 'philosophy',
    owner: {
      id: 1,
      name: '내 서재',
      username: 'mybooks',
      email: 'user@example.com',
    },
    subscriberCount: 42,
    isPublic: true,
    tags: [
      { tagId: 1, tagName: '철학' },
      { tagId: 2, tagName: '고전' },
      { tagId: 3, tagName: '서양철학' },
    ],
    bookCount: 4,
    previewBooks: [
      {
        id: 1,
        title: '국가',
        author: '플라톤',
        coverImage: 'https://picsum.photos/seed/book1/120/180',
      },
      {
        id: 2,
        title: '니코마코스 윤리학',
        author: '아리스토텔레스',
        coverImage: 'https://picsum.photos/seed/book2/120/180',
      },
      {
        id: 3,
        title: '도덕경',
        author: '노자',
        coverImage: 'https://picsum.photos/seed/book3/120/180',
      },
    ],
    createdAt: new Date('2023-01-15'),
  },
  {
    id: 2,
    name: '현대 문학',
    description: '20세기 이후 주요 문학 작품 모음',
    category: 'literature',
    owner: {
      id: 1,
      name: '내 서재',
      username: 'mybooks',
      email: 'user@example.com',
    },
    subscriberCount: 35,
    isPublic: true,
    tags: [
      { tagId: 4, tagName: '문학' },
      { tagId: 5, tagName: '소설' },
      { tagId: 6, tagName: '현대문학' },
    ],
    bookCount: 4,
    previewBooks: [
      {
        id: 5,
        title: '노인과 바다',
        author: '헤밍웨이',
        coverImage: 'https://picsum.photos/seed/book5/120/180',
      },
      {
        id: 6,
        title: '카프카 단편선',
        author: '프란츠 카프카',
        coverImage: 'https://picsum.photos/seed/book6/120/180',
      },
      {
        id: 7,
        title: '백년의 고독',
        author: '가브리엘 가르시아 마르케스',
        coverImage: 'https://picsum.photos/seed/book7/120/180',
      },
    ],
    createdAt: new Date('2023-02-20'),
  },
  {
    id: 3,
    name: '과학 교양',
    description: '일반인을 위한 과학 교양서 모음',
    category: 'science',
    owner: {
      id: 1,
      name: '내 서재',
      username: 'mybooks',
      email: 'user@example.com',
    },
    subscriberCount: 27,
    isPublic: true,
    tags: [
      { tagId: 7, tagName: '과학' },
      { tagId: 8, tagName: '교양' },
      { tagId: 9, tagName: '물리학' },
    ],
    bookCount: 4,
    previewBooks: [
      {
        id: 9,
        title: '시간의 역사',
        author: '스티븐 호킹',
        coverImage: 'https://picsum.photos/seed/book9/120/180',
      },
      {
        id: 10,
        title: '코스모스',
        author: '칼 세이건',
        coverImage: 'https://picsum.photos/seed/book10/120/180',
      },
      {
        id: 11,
        title: '이기적 유전자',
        author: '리처드 도킨스',
        coverImage: 'https://picsum.photos/seed/book11/120/180',
      },
    ],
    createdAt: new Date('2023-03-10'),
  },
];

// 라이브러리 생성 API 호출 함수 (실제 API와 연결)
async function createLibraryApi(data: CreateLibraryDto): Promise<any> {
  // 실제 API 연결 - 현재는 임시 구현
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 10000),
        ...data,
      });
    }, 500);
  });
}

// 태그에 색상을 추가하는 함수
function formatLibraryTags(libraries: LibraryPreviewDto[]): Tag[] {
  // 모든 라이브러리에서 태그를 추출해 중복을 제거한 후 색상 추가
  const tagMap = new Map<string, Tag>();

  libraries.forEach(library => {
    if (!library.tags) return;

    library.tags.forEach((tag, index) => {
      if (!tagMap.has(String(tag.tagId))) {
        tagMap.set(String(tag.tagId), {
          id: String(tag.tagId),
          name: tag.tagName,
          color: getTagColor(index),
        });
      }
    });
  });

  return Array.from(tagMap.values());
}

export default function Libraries() {
  const params = useParams();
  const userId = Number(params.id as string);
  const isMyProfile = useIsMyProfile();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showLibraryDialog, setShowLibraryDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // 서재 목록 가져오기
  const { libraries, totalLibraries, totalPages, isLoading } = useUserLibraries(
    {
      userId,
      initialPage: currentPage,
      pageSize,
    }
  );

  // 페이지 변경 시 스크롤 위치 초기화
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // 태그 리스트 생성
  const tags = formatLibraryTags(libraries);

  // 새 서재 생성 mutation
  const { mutateAsync: createLibraryMutation } = useMutation({
    mutationFn: (data: CreateLibraryDto) => createLibrary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-libraries', userId],
      });

      toast.success('새 서재가 생성되었습니다.');

      setShowLibraryDialog(false);
    },
  });

  // 새 서재 만들기 클릭 핸들러
  const handleCreateLibrary = () => {
    setShowLibraryDialog(true);
  };

  // 새 서재 생성 처리 함수
  const handleCreateNewLibrary = async (libraryData: CreateLibraryDto) => {
    try {
      await createLibraryMutation(libraryData);
    } catch (error) {
      console.error('서재 생성 오류:', error);
      toast.error('서재 생성에 실패했습니다.');
      throw error;
    }
  };

  // 서재가 로딩 중인 경우
  if (isLoading) {
    return <LibrariesSkeleton />;
  }

  // 서재가 없는 경우
  if (libraries.length === 0) {
    return (
      <>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">
              아직 등록된 서재가 없습니다.
            </p>
          </div>
          {isMyProfile && (
            <Button
              onClick={handleCreateLibrary}
              className="flex items-center gap-1.5 rounded-full border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              variant="outline"
            >
              <Plus className="h-4 w-4" />새 서재 만들기
            </Button>
          )}
        </div>

        <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <p className="mt-4 text-base font-medium text-gray-600">
            서재가 없습니다
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {isMyProfile
              ? '첫 번째 서재를 만들어보세요!'
              : '이 사용자는 아직 서재를 만들지 않았습니다.'}
          </p>
          {isMyProfile && (
            <Button
              onClick={handleCreateLibrary}
              variant="default"
              className="mt-4 rounded-full bg-gray-900 px-5 text-sm hover:bg-gray-800"
            >
              <Plus className="mr-1.5 h-4 w-4" />새 서재 만들기
            </Button>
          )}
        </div>
      </>
    );
  }

  // 전체 책 수 계산
  const totalBooks = libraries.reduce(
    (sum, library) => sum + (library.bookCount || 0),
    0
  );

  // 전체 구독자 수 계산
  const totalFollowers = libraries.reduce(
    (sum, library) => sum + (library.subscriberCount || 0),
    0
  );

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 rounded-md bg-gray-50 px-3 py-1.5 select-none">
              <span className="text-xs font-medium text-gray-500">서재</span>
              <span className="text-sm font-semibold text-gray-900">
                {totalLibraries}
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-gray-50 px-3 py-1.5 select-none">
              <span className="text-xs font-medium text-gray-500">책</span>
              <span className="text-sm font-semibold text-gray-900">
                {totalBooks}
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-gray-50 px-3 py-1.5 select-none">
              <span className="text-xs font-medium text-gray-500">구독자</span>
              <span className="text-sm font-semibold text-gray-900">
                {totalFollowers}
              </span>
            </div>
          </div>
        </div>
        {isMyProfile && (
          <Button
            onClick={handleCreateLibrary}
            className="flex items-center gap-1.5 rounded-full border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            variant="outline"
          >
            <Plus className="h-4 w-4" />새 서재 만들기
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {libraries.map(library => (
          <LibraryCard key={library.id} library={library} tags={tags} />
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* 새 서재 만들기 다이얼로그 */}
      {showLibraryDialog && (
        <LibraryDialog
          open={showLibraryDialog}
          onOpenChange={setShowLibraryDialog}
          mode="create"
          onCreateLibrary={handleCreateNewLibrary}
        />
      )}
    </>
  );
}
