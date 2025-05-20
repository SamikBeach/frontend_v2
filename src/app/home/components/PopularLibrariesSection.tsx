import { LibraryCard } from '@/components/LibraryCard/LibraryCard';
import { LibraryCardSkeleton } from '@/components/LibraryCard/LibraryCardSkeleton';
import { Button } from '@/components/ui/button';
import { Tag } from '@/utils/tags';
import { Library } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useHomePopularLibrariesQuery } from '../hooks';

// 인기 서재 스켈레톤 컴포넌트
export function PopularLibrariesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {[...Array(2)].map((_, index) => (
        <LibraryCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PopularLibrariesSection() {
  const router = useRouter();
  const { libraries, isLoading } = useHomePopularLibrariesQuery();

  // 더미 태그 배열 (실제 데이터에서는 서재 태그를 사용해야 함)
  const dummyTags: Tag[] = [];

  return (
    <section className="h-auto p-2 sm:p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Library className="h-4 w-4 text-rose-500 sm:h-5 sm:w-5" />
          <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
            인기 서재
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer text-xs font-medium text-gray-500 hover:text-gray-900 sm:text-sm"
          onClick={() => router.push('/libraries')}
        >
          더보기
        </Button>
      </div>

      {isLoading ? (
        <PopularLibrariesSkeleton />
      ) : libraries.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-sm text-gray-500">인기 서재가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {libraries.slice(0, 2).map(library => (
            <div key={library.id}>
              <LibraryCard
                library={library}
                tags={dummyTags}
                hidePublicTag={true}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
