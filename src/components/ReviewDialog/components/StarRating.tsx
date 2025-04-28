import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const sizeMap = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-9 w-9',
};

export function StarRating({
  rating,
  onRatingChange,
  size = 'lg',
  disabled = false,
}: StarRatingProps) {
  return (
    <div className="relative flex w-full items-center justify-center">
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`${sizeMap[size]} ${
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            } ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
            onClick={() => !disabled && onRatingChange(star)}
          />
        ))}
      </div>
    </div>
  );
}
