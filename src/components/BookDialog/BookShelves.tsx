import { Badge } from '@/components/ui/badge';
import { BookOpen, Users } from 'lucide-react';
import Link from 'next/link';
import { useBookDetails } from './hooks';

export function BookShelves() {
  const { book, defaultBookshelves } = useBookDetails();

  if (!book) return null;

  const bookshelves = book.bookshelves || defaultBookshelves;

  if (!bookshelves || bookshelves.length === 0) {
    return null;
  }

  // 태그 데이터 샘플 (실제 데이터로 대체 필요)
  const getShelfTags = (id: number) => {
    const tagSets = [
      ['소설', '판타지'],
      ['자기계발', '경제'],
      ['인문학', '철학'],
      ['과학', '기술'],
      ['예술', '문화'],
    ];
    return tagSets[id % tagSets.length];
  };

  // 태그별 파스텔톤 색상 설정
  const getTagColor = (tag: string) => {
    const colorMap: Record<string, string> = {
      소설: 'bg-blue-50',
      판타지: 'bg-purple-50',
      자기계발: 'bg-green-50',
      경제: 'bg-yellow-50',
      인문학: 'bg-pink-50',
      철학: 'bg-indigo-50',
      과학: 'bg-cyan-50',
      기술: 'bg-teal-50',
      예술: 'bg-rose-50',
      문화: 'bg-orange-50',
    };

    return colorMap[tag] || 'bg-gray-100';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900">
          등록된 서재 ({bookshelves.length})
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {bookshelves.map(shelf => (
          <Link key={shelf.id} href={`/library/${shelf.id}`}>
            <div className="flex items-center rounded-xl border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100">
              <div className="flex flex-1 items-center gap-3">
                {shelf.thumbnail ? (
                  <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-200">
                    <img
                      src={shelf.thumbnail}
                      alt={shelf.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
                    <BookOpen className="h-5 w-5 text-gray-500" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{shelf.name}</p>
                    <div className="flex flex-wrap gap-1">
                      {getShelfTags(shelf.id).map((tag, index) => {
                        const bgColor = getTagColor(tag);
                        return (
                          <Badge
                            key={index}
                            className={`rounded-full ${bgColor} border-0 px-2 py-0.5 text-[10px] font-medium text-gray-900`}
                          >
                            {tag}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500">
                    <span>{shelf.owner}</span>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{shelf.bookCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      <span>{shelf.followers}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
