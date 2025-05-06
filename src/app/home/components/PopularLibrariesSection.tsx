import { HomeLibraryPreview } from '@/apis/library/types';
import { LibraryCard } from '@/components/LibraryCard/LibraryCard';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Tag } from '@/utils/tags';
import { BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PopularLibrariesSectionProps {
  libraries: HomeLibraryPreview[];
  isLoading?: boolean;
}

export function PopularLibrariesSection({
  libraries,
  isLoading = false,
}: PopularLibrariesSectionProps) {
  const router = useRouter();

  // 더미 태그 배열 (실제 데이터에서는 서재 태그를 사용해야 함)
  const dummyTags: Tag[] = [];

  return (
    <section className="h-auto p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#3B82F6]" />
          <h2 className="text-xl font-semibold text-gray-900">인기 서재</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
          onClick={() => router.push('/libraries')}
        >
          더보기
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-[200px] items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : libraries.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-sm text-gray-500">인기 서재가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {libraries.slice(0, 2).map(library => (
            <LibraryCard
              key={library.id}
              library={library}
              tags={dummyTags}
              hidePublicTag={true}
            />
          ))}
        </div>
      )}
    </section>
  );
}
