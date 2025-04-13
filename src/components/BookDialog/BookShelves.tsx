import {
  CompactLibraryCard,
  CompactLibraryProps,
} from '@/components/LibraryCard';
import { BookDetails } from './types';

interface BookShelvesProps {
  bookshelves: BookDetails['bookshelves'];
}

export function BookShelves({ bookshelves = [] }: BookShelvesProps) {
  if (bookshelves.length === 0) return null;

  // 태그 데이터 - 실제로는 API에서 받아와야 함
  const getSampleTags = (id: number) => {
    const tagSets = [
      ['소설', '판타지', '베스트셀러'],
      ['자기계발', '심리학', '경제'],
      ['인문학', '역사', '철학'],
      ['과학', '기술', '미래'],
    ];

    return tagSets[id % tagSets.length];
  };

  // 설명 데이터 - 실제로는 API에서 받아와야 함
  const getSampleDescription = (id: number) => {
    const descriptions = [
      '좋아하는 소설과 판타지 작품을 모은 컬렉션입니다.',
      '자기계발과 교양 서적을 모은 서재입니다.',
      '인문학적 사고를 넓혀주는 다양한 책을 모았습니다.',
      '과학과 기술에 관한 교양서를 모은 서재입니다.',
    ];

    return descriptions[id % descriptions.length];
  };

  // 데이터 변환
  const formattedLibraries: CompactLibraryProps[] = bookshelves.map(shelf => ({
    id: shelf.id,
    name: shelf.name,
    owner: {
      id: 1,
      username: shelf.owner.split(' ').join('').toLowerCase(),
      name: shelf.owner,
      avatar: shelf.thumbnail,
    },
    description: getSampleDescription(shelf.id),
    thumbnail: shelf.thumbnail,
    subscriberCount: shelf.followers,
    bookCount: shelf.bookCount,
    tags: getSampleTags(shelf.id),
  }));

  // 2개 이상일 때 그리드 레이아웃 적용
  const useGrid = formattedLibraries.length >= 2;

  return (
    <div className="space-y-2.5">
      <p className="text-sm font-medium text-gray-900">
        이 책이 등록된 서재 ({bookshelves.length})
      </p>
      <div className={useGrid ? 'grid grid-cols-1 gap-2.5 lg:grid-cols-2' : ''}>
        {formattedLibraries.map(library => (
          <CompactLibraryCard
            key={library.id}
            library={library}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
}
