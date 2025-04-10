import { useEffect, useState } from 'react';
import { Review } from './types';

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
              title: '사피엔스',
              author: '유발 하라리',
              coverImage: `https://picsum.photos/seed/book6/240/360`,
            },
            rating: 4.5,
            content:
              '인류의 역사를 거시적인 관점에서 살펴본 통찰력 있는 책입니다. 농업혁명부터 과학혁명까지 인류 역사의 주요 전환점을 흥미롭게 다루고 있습니다.',
            date: '2024-02-10',
            likes: 45,
            comments: 15,
          },
        ];

        setRecentReviews(mockReviews);
        setIsLoading(false);
      } catch {
        setError('리뷰 목록을 불러오는데 실패했습니다.');
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return {
    recentReviews,
    isLoading,
    error,
  };
}
