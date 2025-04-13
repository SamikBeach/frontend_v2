import { Library, LibraryCard } from '@/components/LibraryCard';
import { useIsMyProfile } from '../hooks';

// 구독한 서재 샘플 데이터
const subscribedLibraries: Library[] = [
  {
    id: 101,
    title: '세계 고전 문학',
    description: '세계 각국의 고전 문학 작품을 모아놓은 서재입니다.',
    category: 'literature',
    owner: {
      name: '문학애호가',
      username: 'literature_lover',
      avatar: 'https://i.pravatar.cc/150?u=literature_lover',
    },
    followers: 156,
    isPublic: true,
    tags: ['문학', '고전', '세계문학'],
    timestamp: '2023-05-15',
    books: [
      {
        id: 101,
        title: '돈키호테',
        author: '미겔 데 세르반테스',
        coverImage: 'https://picsum.photos/seed/book101/120/180',
      },
      {
        id: 102,
        title: '오디세이아',
        author: '호메로스',
        coverImage: 'https://picsum.photos/seed/book102/120/180',
      },
      {
        id: 103,
        title: '안나 카레니나',
        author: '레프 톨스토이',
        coverImage: 'https://picsum.photos/seed/book103/120/180',
      },
      {
        id: 104,
        title: '젊은 베르테르의 슬픔',
        author: '괴테',
        coverImage: 'https://picsum.photos/seed/book104/120/180',
      },
    ],
  },
  {
    id: 102,
    title: '현대 과학 교양',
    description: '현대 과학의 주요 이론과 발견을 쉽게 설명한 교양서 모음',
    category: 'science',
    owner: {
      name: '과학탐험가',
      username: 'science_explorer',
      avatar: 'https://i.pravatar.cc/150?u=science_explorer',
    },
    followers: 89,
    isPublic: true,
    tags: ['과학', '교양', '현대과학'],
    timestamp: '2023-06-20',
    books: [
      {
        id: 201,
        title: '코스모스',
        author: '칼 세이건',
        coverImage: 'https://picsum.photos/seed/book201/120/180',
      },
      {
        id: 202,
        title: '시간의 역사',
        author: '스티븐 호킹',
        coverImage: 'https://picsum.photos/seed/book202/120/180',
      },
      {
        id: 203,
        title: '이기적 유전자',
        author: '리처드 도킨스',
        coverImage: 'https://picsum.photos/seed/book203/120/180',
      },
      {
        id: 204,
        title: '코스믹 커넥션',
        author: '칼 세이건',
        coverImage: 'https://picsum.photos/seed/book204/120/180',
      },
    ],
  },
  {
    id: 103,
    title: '철학 입문',
    description: '철학에 입문하는 사람들을 위한 필독서 모음',
    category: 'philosophy',
    owner: {
      name: '철학자',
      username: 'philosopher',
      avatar: 'https://i.pravatar.cc/150?u=philosopher',
    },
    followers: 72,
    isPublic: true,
    tags: ['철학', '입문', '사상'],
    timestamp: '2023-07-05',
    books: [
      {
        id: 301,
        title: '소크라테스의 변명',
        author: '플라톤',
        coverImage: 'https://picsum.photos/seed/book301/120/180',
      },
      {
        id: 302,
        title: '니코마코스 윤리학',
        author: '아리스토텔레스',
        coverImage: 'https://picsum.photos/seed/book302/120/180',
      },
      {
        id: 303,
        title: '방법서설',
        author: '데카르트',
        coverImage: 'https://picsum.photos/seed/book303/120/180',
      },
      {
        id: 304,
        title: '순수이성비판',
        author: '임마누엘 칸트',
        coverImage: 'https://picsum.photos/seed/book304/120/180',
      },
    ],
  },
];

export default function SubscribedLibraries() {
  const isMyProfile = useIsMyProfile();

  return (
    <>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">구독한 서재</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subscribedLibraries.map(library => (
          <LibraryCard key={library.id} library={library} />
        ))}
      </div>
    </>
  );
}
