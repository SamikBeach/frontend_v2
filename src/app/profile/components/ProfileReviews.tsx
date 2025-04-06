import { useRecentReviews } from '@/app/profile/hooks';
import { CalendarDays, Heart, MessageCircle, Star } from 'lucide-react';
import Image from 'next/image';

export default function ProfileReviews() {
  const { recentReviews = [], isLoading } = useRecentReviews();

  if (isLoading) {
    return <div>리뷰를 불러오는 중...</div>;
  }

  return (
    <div className="mt-8 space-y-4">
      {recentReviews.map(review => (
        <div
          key={review.id}
          className="group overflow-hidden rounded-lg bg-gray-50 p-5 transition-colors hover:bg-gray-100"
        >
          <div className="flex gap-5">
            <div className="flex-shrink-0">
              <div className="relative h-[90px] w-[60px] overflow-hidden rounded-md">
                <Image
                  src={review.book.coverImage}
                  alt={review.book.title}
                  fill
                  sizes="60px"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-600">
                  {review.book.title}
                </h3>
                <div className="flex items-center text-xs text-gray-500">
                  <CalendarDays className="mr-1 h-3.5 w-3.5" />
                  {review.date}
                </div>
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                {review.book.author}
              </p>
              <div className="mt-1 flex items-center">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(review.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-1 text-xs text-gray-500">
                  ({review.rating.toFixed(1)})
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700">{review.content}</p>
              <div className="mt-3 flex items-center text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5" />
                  <span>{review.likes}</span>
                </div>
                <div className="mx-3 h-3 border-r border-gray-200" />
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>{review.comments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
