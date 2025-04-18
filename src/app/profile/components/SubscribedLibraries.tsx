import { LibraryCard } from '@/components/LibraryCard';
import { Tag, getTagColor } from '@/utils/tags';
import { useIsMyProfile } from '../hooks';

// 구독한 서재 샘플 데이터
const subscribedLibraries = [
  {
    id: 101,
    name: '세계 고전 문학',
    description: '세계 각국의 고전 문학 작품을 모아놓은 서재입니다.',
    tagId: 'literature',
    owner: {
      id: 1,
      username: 'literature_lover',
    },
    subscriberCount: 156,
    isPublic: true,
    tags: [
      { id: 'literature', tagId: 1, tagName: '문학' },
      { id: 'classic', tagId: 2, tagName: '고전' },
      { id: 'world', tagId: 3, tagName: '세계문학' },
    ],
    createdAt: new Date('2023-05-15'),
    books: [
      {
        bookId: 101,
        book: {
          title: '돈키호테',
          author: '미겔 데 세르반테스',
          coverImage: 'https://picsum.photos/seed/book101/120/180',
        },
      },
      {
        bookId: 102,
        book: {
          title: '오디세이아',
          author: '호메로스',
          coverImage: 'https://picsum.photos/seed/book102/120/180',
        },
      },
      {
        bookId: 103,
        book: {
          title: '안나 카레니나',
          author: '레프 톨스토이',
          coverImage: 'https://picsum.photos/seed/book103/120/180',
        },
      },
    ],
  },
  {
    id: 102,
    name: '현대 과학 교양',
    description: '현대 과학의 주요 이론과 발견을 쉽게 설명한 교양서 모음',
    tagId: 'science',
    owner: {
      id: 2,
      username: 'science_explorer',
    },
    subscriberCount: 89,
    isPublic: true,
    tags: [
      { id: 'science', tagId: 4, tagName: '과학' },
      { id: 'education', tagId: 5, tagName: '교양' },
      { id: 'modern', tagId: 6, tagName: '현대과학' },
    ],
    createdAt: new Date('2023-06-20'),
    books: [
      {
        bookId: 201,
        book: {
          title: '코스모스',
          author: '칼 세이건',
          coverImage: 'https://picsum.photos/seed/book201/120/180',
        },
      },
      {
        bookId: 202,
        book: {
          title: '시간의 역사',
          author: '스티븐 호킹',
          coverImage: 'https://picsum.photos/seed/book202/120/180',
        },
      },
      {
        bookId: 203,
        book: {
          title: '이기적 유전자',
          author: '리처드 도킨스',
          coverImage: 'https://picsum.photos/seed/book203/120/180',
        },
      },
    ],
  },
  {
    id: 103,
    name: '철학 입문',
    description: '철학에 입문하는 사람들을 위한 필독서 모음',
    tagId: 'philosophy',
    owner: {
      id: 3,
      username: 'philosopher',
    },
    subscriberCount: 72,
    isPublic: true,
    tags: [
      { id: 'philosophy', tagId: 7, tagName: '철학' },
      { id: 'intro', tagId: 8, tagName: '입문' },
      { id: 'thought', tagId: 9, tagName: '사상' },
    ],
    createdAt: new Date('2023-07-05'),
    books: [
      {
        bookId: 301,
        book: {
          title: '소크라테스의 변명',
          author: '플라톤',
          coverImage: 'https://picsum.photos/seed/book301/120/180',
        },
      },
      {
        bookId: 302,
        book: {
          title: '니코마코스 윤리학',
          author: '아리스토텔레스',
          coverImage: 'https://picsum.photos/seed/book302/120/180',
        },
      },
      {
        bookId: 303,
        book: {
          title: '방법서설',
          author: '데카르트',
          coverImage: 'https://picsum.photos/seed/book303/120/180',
        },
      },
    ],
  },
];

// 태그에 색상을 추가하는 함수
function formatLibraryTags(): Tag[] {
  // 모든 라이브러리에서 태그를 추출해 중복을 제거한 후 색상 추가
  const tagMap = new Map<string, Tag>();

  subscribedLibraries.forEach(library => {
    if (!library.tags) return;

    library.tags.forEach((tag, index) => {
      if (!tagMap.has(tag.id)) {
        tagMap.set(tag.id, {
          ...tag,
          color: getTagColor(index),
        });
      }
    });
  });

  return Array.from(tagMap.values());
}

export default function SubscribedLibraries() {
  const isMyProfile = useIsMyProfile();
  const tags = formatLibraryTags();

  return (
    <>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">구독한 서재</h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {subscribedLibraries.map(library => (
          <LibraryCard key={library.id} library={library} tags={tags} />
        ))}
      </div>
    </>
  );
}
