interface ReviewImageProps {
  imageUrl: string;
  onClick: () => void;
}

export function ReviewImage({ imageUrl, onClick }: ReviewImageProps) {
  return (
    <div className="mt-4">
      <img
        src={imageUrl}
        alt="리뷰 이미지"
        className="h-auto w-full cursor-pointer rounded-lg"
        onClick={onClick}
      />
    </div>
  );
}
