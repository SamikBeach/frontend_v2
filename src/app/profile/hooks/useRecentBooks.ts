import { useEffect, useState } from 'react';
import { Book } from './types';

// 최근 책 목록 데이터를 반환하는 훅
export function useRecentBooks() {
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 실제 구현에서는 API 호출로 대체
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        // 예시 데이터 (실제 API 호출로 대체해야 함)
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockBooks: Book[] = [
          {
            id: 1,
            title: '소크라테스의 변명',
            author: '플라톤',
            coverImage: `https://picsum.photos/seed/book1/240/360`,
            category: '철학',
            subcategory: 'ancient-philosophy',
            rating: 4.8,
            reviews: 128,
            description:
              '플라톤의 대화편으로, 진정한 지혜의 의미를 탐구하는 고전',
            publishDate: '2024-01-15',
            publisher: '고전출판사',
          },
          {
            id: 2,
            title: '죄와 벌',
            author: '표도르 도스토예프스키',
            coverImage: `https://picsum.photos/seed/book2/240/360`,
            category: '문학',
            subcategory: 'russian-literature',
            rating: 4.9,
            reviews: 245,
            description:
              '인간의 죄의식과 구원을 탐구하는 도스토예프스키의 대표작',
            publishDate: '2023-11-20',
            publisher: '세계문학사',
          },
          {
            id: 3,
            title: '니코마코스 윤리학',
            author: '아리스토텔레스',
            coverImage: `https://picsum.photos/seed/book3/240/360`,
            category: '철학',
            subcategory: 'ethics',
            rating: 4.5,
            reviews: 78,
            description:
              '아리스토텔레스의 윤리학에 관한 중요한 저서, 덕과 행복에 대해 논함',
            publishDate: '2023-09-05',
            publisher: '고전출판사',
          },
          {
            id: 4,
            title: '데미안',
            author: '헤르만 헤세',
            coverImage: `https://picsum.photos/seed/book4/240/360`,
            category: '문학',
            subcategory: 'german-literature',
            rating: 4.7,
            reviews: 156,
            description: '자아 발견과 성장에 관한 헤세의 대표적인 성장 소설',
            publishDate: '2023-08-15',
            publisher: '세계문학사',
          },
          {
            id: 5,
            title: '이방인',
            author: '알베르 까뮈',
            coverImage: `https://picsum.photos/seed/book5/240/360`,
            category: '문학',
            subcategory: 'french-literature',
            rating: 4.6,
            reviews: 112,
            description:
              '부조리한 세계 속 인간의 존재를 탐구하는 실존주의 소설',
            publishDate: '2023-07-20',
            publisher: '현대문학',
          },
          {
            id: 6,
            title: '사피엔스',
            author: '유발 하라리',
            coverImage: `https://picsum.photos/seed/book6/240/360`,
            category: '역사',
            subcategory: 'world-history',
            rating: 4.8,
            reviews: 320,
            description:
              '인류의 역사와 문명의 발전 과정을 다룬 세계적 베스트셀러',
            publishDate: '2023-06-10',
            publisher: '지식나무',
          },
        ];

        setRecentBooks(mockBooks);
        setIsLoading(false);
      } catch (err) {
        setError('책 목록을 불러오는데 실패했습니다.');
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return {
    recentBooks,
    isLoading,
    error,
  };
}
