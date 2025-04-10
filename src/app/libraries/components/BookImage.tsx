import { BookImageProps } from '../types';

export function BookImage({ book }: BookImageProps) {
  return (
    <div className="relative aspect-[2/3] overflow-hidden rounded-md">
      <img
        src={book.coverImage}
        alt={book.title}
        className="h-full w-full object-cover transition-opacity duration-200 ease-in-out"
        loading="lazy"
      />
    </div>
  );
}
