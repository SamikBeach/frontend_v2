import { LibraryCard } from '@/components/LibraryCard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useIsMyProfile } from '../hooks';

// 샘플 서재 데이터 (LibraryCard에 맞게 수정)
const userLibraries: any[] = [
  {
    id: 1,
    title: '철학 고전',
    description: '플라톤부터 니체까지, 철학 관련 고전 모음',
    category: 'philosophy',
    owner: {
      name: '내 서재',
      username: 'mybooks',
      avatar: 'https://i.pravatar.cc/150?u=mybooks1',
    },
    followers: 42,
    isPublic: true,
    tags: ['철학', '고전', '서양철학'],
    timestamp: '2023-01-15',
    books: [
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
      {
        id: 4,
        title: '차라투스트라는 이렇게 말했다',
        author: '니체',
        coverImage: 'https://picsum.photos/seed/book4/120/180',
      },
    ],
  },
  {
    id: 2,
    title: '현대 문학',
    description: '20세기 이후 주요 문학 작품 모음',
    category: 'literature',
    owner: {
      name: '내 서재',
      username: 'mybooks',
      avatar: 'https://i.pravatar.cc/150?u=mybooks2',
    },
    followers: 35,
    isPublic: true,
    tags: ['문학', '소설', '현대문학'],
    timestamp: '2023-02-20',
    books: [
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
      {
        id: 8,
        title: '변신',
        author: '프란츠 카프카',
        coverImage: 'https://picsum.photos/seed/book8/120/180',
      },
    ],
  },
  {
    id: 3,
    title: '과학 교양',
    description: '일반인을 위한 과학 교양서 모음',
    category: 'science',
    owner: {
      name: '내 서재',
      username: 'mybooks',
      avatar: 'https://i.pravatar.cc/150?u=mybooks3',
    },
    followers: 27,
    isPublic: true,
    tags: ['과학', '교양', '물리학'],
    timestamp: '2023-03-10',
    books: [
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
      {
        id: 12,
        title: '사피엔스',
        author: '유발 하라리',
        coverImage: 'https://picsum.photos/seed/book12/120/180',
      },
    ],
  },
];

export default function ProfileBooks() {
  const isMyProfile = useIsMyProfile();
  const router = useRouter();

  // 새 서재 만들기 클릭 핸들러
  const handleCreateLibrary = () => {
    // TODO: 새 서재 만들기 페이지로 이동
    router.push('/library/new');
  };

  // 전체 책 수 계산
  const totalBooks = userLibraries.reduce(
    (sum, library) => sum + library.books.length,
    0
  );

  // 전체 구독자 수 계산
  const totalFollowers = userLibraries.reduce(
    (sum, library) => sum + library.followers,
    0
  );

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">내 서재</h2>
          <p className="text-sm text-gray-500">
            총 {userLibraries.length}개의 서재, {totalBooks}권의 책,{' '}
            {totalFollowers}명의 구독자
          </p>
        </div>
        {isMyProfile && (
          <Button
            onClick={handleCreateLibrary}
            className="flex items-center gap-1.5 rounded-full bg-gray-900 text-white hover:bg-gray-800"
          >
            <PlusCircle className="h-4 w-4" />새 서재 만들기
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {userLibraries.map(library => (
          <LibraryCard key={library.id} library={library} />
        ))}
      </div>
    </>
  );
}
