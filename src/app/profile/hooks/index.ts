import { Book } from '@/components/BookCard';
import { useEffect, useState } from 'react';

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
            title: '로마제국 쇠망사',
            author: '에드워드 기번',
            coverImage: `https://picsum.photos/seed/book3/240/360`,
            category: '역사',
            subcategory: 'ancient-history',
            rating: 4.7,
            reviews: 96,
            description: '로마 제국의 번영과 쇠락을 다룬 역사서',
            publishDate: '2023-09-05',
            publisher: '역사연구소',
          },
          {
            id: 4,
            title: '국부론',
            author: '애덤 스미스',
            coverImage: `https://picsum.photos/seed/book7/240/360`,
            category: '경제',
            subcategory: 'economics',
            rating: 4.6,
            reviews: 156,
            description: '근대 경제학의 기초를 세운 애덤 스미스의 대표작',
            publishDate: '2023-08-12',
            publisher: '경제연구소',
          },
          {
            id: 5,
            title: '프로테스탄트 윤리와 자본주의 정신',
            author: '막스 베버',
            coverImage: `https://picsum.photos/seed/book8/240/360`,
            category: '사회학',
            subcategory: 'sociology',
            rating: 4.5,
            reviews: 110,
            description:
              '자본주의 발전에 종교가 미친 영향을 분석한 사회학 고전',
            publishDate: '2023-10-08',
            publisher: '사회과학출판',
          },
        ];

        setRecentBooks(mockBooks);
      } catch (error) {
        setError('책 목록을 불러오는데 실패했습니다.');
        console.error('Failed to fetch books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return { recentBooks, isLoading, error };
}

// 리뷰 인터페이스
interface Review {
  id: number;
  book: {
    title: string;
    author: string;
    coverImage: string;
  };
  rating: number;
  content: string;
  date: string;
  likes: number;
  comments: number;
}

// 최근 리뷰 목록 데이터를 반환하는 훅
export function useRecentReviews() {
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 실제 구현에서는 API 호출로 대체
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        // 예시 데이터 (실제 API 호출로 대체해야 함)
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockReviews: Review[] = [
          {
            id: 1,
            book: {
              title: '소크라테스의 변명',
              author: '플라톤',
              coverImage: `https://picsum.photos/seed/book1/240/360`,
            },
            rating: 4.5,
            content:
              '소크라테스의 변명은 플라톤의 초기 작품 중 하나로, 소크라테스의 재판 과정에서의 변론을 담고 있습니다. 소크라테스의 철학적 태도와 지혜에 대한 깊은 통찰을 제공하는 훌륭한 작품입니다.',
            date: '2024-03-15',
            likes: 24,
            comments: 8,
          },
          {
            id: 2,
            book: {
              title: '죄와 벌',
              author: '표도르 도스토예프스키',
              coverImage: `https://picsum.photos/seed/book2/240/360`,
            },
            rating: 5,
            content:
              '도스토예프스키의 걸작으로, 라스콜리니코프의 내적 갈등과 심리적 고뇌를 완벽하게 묘사한 소설입니다. 범죄, 처벌, 구원에 대한 깊은 탐구가 인상적이었습니다.',
            date: '2024-02-28',
            likes: 32,
            comments: 12,
          },
          {
            id: 3,
            book: {
              title: '로마제국 쇠망사',
              author: '에드워드 기번',
              coverImage: `https://picsum.photos/seed/book3/240/360`,
            },
            rating: 4,
            content:
              '방대한 역사를 다루는 규모와 깊이에 감탄했습니다. 로마 제국의 흥망성쇠를 상세하게 기록한 역작이지만, 분량이 너무 많아 완독하는데 시간이 꽤 걸렸습니다.',
            date: '2024-01-20',
            likes: 15,
            comments: 5,
          },
        ];

        setRecentReviews(mockReviews);
      } catch (error) {
        setError('리뷰 목록을 불러오는데 실패했습니다.');
        console.error('Failed to fetch reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return { recentReviews, isLoading, error };
}
