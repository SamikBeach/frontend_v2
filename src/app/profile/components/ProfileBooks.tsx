import { BookOpen, Users } from 'lucide-react';

// 샘플 서재 데이터
const userLibraries = [
  {
    id: 1,
    title: '철학 고전',
    description: '플라톤부터 니체까지, 철학 관련 고전 모음',
    category: 'philosophy',
    owner: {
      name: '내 서재',
      avatar: '/path/to/avatar.jpg',
    },
    followers: 42,
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
      avatar: '/path/to/avatar.jpg',
    },
    followers: 35,
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
      avatar: '/path/to/avatar.jpg',
    },
    followers: 27,
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
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {userLibraries.map(library => (
        <div key={library.id} className="group cursor-pointer">
          <div className="group h-full rounded-xl bg-[#F9FAFB] transition-all duration-200 hover:bg-[#F2F4F6]">
            <div className="p-5 pb-3">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-medium text-gray-900 transition-colors duration-150 group-hover:text-[#3182F6]">
                      {library.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 pt-0 pb-3">
              <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                {library.description}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {library.books.map(book => (
                  <div
                    key={book.id}
                    className="aspect-[2/3] overflow-hidden rounded-md"
                  >
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-gray-400" />
                  <span>{library.followers.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                  <span>{library.books.length}권</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
