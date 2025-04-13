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

  // 기존 bookshelf 데이터를 CompactLibraryProps 형식으로 변환
  const formattedLibraries: CompactLibraryProps[] = bookshelves.map(shelf => ({
    id: shelf.id,
    name: shelf.name,
    owner: {
      id: 1, // 실제 API에서는 owner의 id 값이 필요
      username: shelf.owner.split(' ').join('').toLowerCase(),
      name: shelf.owner,
      avatar: shelf.thumbnail, // 서재 썸네일을 유저 아바타로 재사용
    },
    description: '', // 필요하다면 API에서 가져온 데이터 사용
    thumbnail: shelf.thumbnail,
    subscriberCount: shelf.followers,
    bookCount: shelf.bookCount,
    tags: [], // 필요하다면 API에서 가져온 데이터 사용
  }));

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-900">
        이 책이 등록된 서재 ({bookshelves.length})
      </p>
      <div className="grid grid-cols-1 gap-3">
        {formattedLibraries.map(library => (
          <CompactLibraryCard key={library.id} library={library} />
        ))}
      </div>
    </div>
  );
}
