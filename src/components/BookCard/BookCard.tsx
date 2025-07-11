'use client';
import { Book } from '@/apis/book/types';
import { cn } from '@/lib/utils';
import { MessageSquare, Star } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
  horizontal?: boolean;
}
export const BookCard = React.memo(
  ({ book, onClick, horizontal = false }: BookCardProps) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const coverImage =
      book.coverImage || `https://picsum.photos/seed/${book.id}/240/360`;

    const imageWidth = book.coverImageWidth || 240;
    const imageHeight = book.coverImageHeight || 360;

    const horizontalSize = {
      width: 128,
      height: Math.round((128 * imageHeight) / imageWidth),
    };
    const normalSize = { width: imageWidth, height: imageHeight };

    const rating =
      typeof book.rating === 'string'
        ? parseFloat(book.rating)
        : book.rating || 0;
    const reviews =
      typeof book.reviews === 'string'
        ? parseInt(book.reviews)
        : book.reviews || 0;
    const totalRatings = (book as any).totalRatings;

    const handleBookClick = () => {
      if (onClick) onClick(book);
    };
    return (
      <div
        className={cn(
          'cursor-pointer overflow-hidden',
          horizontal ? 'flex w-full' : 'flex h-full w-full flex-col'
        )}
        onClick={handleBookClick}
      >
        <div
          className={cn(
            'group w-full transition-all',
            horizontal ? 'flex h-auto items-start' : 'h-full bg-white'
          )}
        >
          <div
            className={cn(
              'relative flex flex-col items-center justify-end overflow-hidden rounded-md bg-white',
              horizontal ? 'w-32 flex-shrink-0' : 'aspect-[3/4.5] w-full'
            )}
          >
            {horizontal ? (
              <div
                className="relative w-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
                style={{ height: `${horizontalSize.height}px` }}
              >
                {!imageLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-gray-200" />
                )}
                <Image
                  src={coverImage}
                  alt={book.title}
                  width={horizontalSize.width}
                  height={horizontalSize.height}
                  className={cn(
                    'h-full w-full rounded-md object-cover transition-all duration-300 group-hover:scale-[1.02]',
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  )}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjM2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQwIiBoZWlnaHQ9IjM2MCIgZmlsbD0iI2Y5ZmFmYiIvPgo8L3N2Zz4="
                  sizes="128px"
                  onLoad={() => setImageLoaded(true)}
                  onError={e => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = `https://placehold.co/240x360/f3f4f6/9ca3af?text=${encodeURIComponent(book.title.slice(0, 10))}`;
                    setImageLoaded(true);
                  }}
                />
              </div>
            ) : (
              <div className="w-full overflow-hidden rounded-md border border-gray-200">
                <Image
                  src={coverImage}
                  alt={book.title}
                  width={normalSize.width}
                  height={normalSize.height}
                  className={cn(
                    'h-auto w-full rounded-md object-cover transition-transform group-hover:scale-[1.02]'
                  )}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjM2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQwIiBoZWlnaHQ9IjM2MCIgZmlsbD0iI2Y5ZmFmYiIvPgo8L3N2Zz4="
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  onError={e => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = `https://placehold.co/240x360/f3f4f6/9ca3af?text=${encodeURIComponent(book.title.slice(0, 10))}`;
                  }}
                />
              </div>
            )}
          </div>
          <div
            className={cn(
              horizontal
                ? 'flex h-full flex-1 flex-col justify-between px-2 py-0.5'
                : 'px-2.5 pt-2.5 pb-2.5'
            )}
          >
            <div>
              <h3
                className={cn(
                  'line-clamp-2 font-medium text-gray-900',
                  horizontal
                    ? 'text-base sm:text-[15px]'
                    : 'text-base sm:text-[15px]'
                )}
              >
                {book.title}
              </h3>
              <p
                className={cn(
                  'mt-0.5 line-clamp-2 text-gray-500',
                  horizontal
                    ? 'text-sm sm:text-[13px]'
                    : 'text-sm sm:text-[13px]'
                )}
              >
                {book.author}
              </p>
            </div>
            <div
              className={cn(
                'flex items-center gap-2 pt-1 text-gray-600',
                horizontal
                  ? 'text-[15px] sm:text-[13px]'
                  : 'text-[15px] sm:text-[13px]'
              )}
            >
              <div className="flex items-center gap-1">
                <Star className="h-[18px] w-[18px] text-[#FFAB00] sm:h-3.5 sm:w-3.5" />
                <span>
                  {rating.toFixed(1)}{' '}
                  {totalRatings !== undefined && `(${totalRatings})`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-[18px] w-[18px] sm:h-3.5 sm:w-3.5" />
                <span>{reviews}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
BookCard.displayName = 'BookCard';
