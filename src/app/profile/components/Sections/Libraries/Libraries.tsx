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
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useIsMyProfile, useUserLibraries } from '../../../hooks';
import { LibrariesSkeleton } from '../../Skeletons';

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
