// 빈 상태 컴포넌트 - 리뷰
export function EmptyReviewState() {
  return (
    <div className="mt-4 flex items-center justify-center rounded-lg bg-gray-50 py-8 sm:mt-8 sm:py-16">
      <div className="px-4 text-center sm:px-6">
        <h3 className="text-base font-medium text-gray-900 sm:text-lg">
          작성한 책 리뷰가 없습니다
        </h3>
        <p className="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-sm">
          아직 작성한 책 리뷰가 없습니다. 책을 읽고 리뷰를 작성해보세요.
        </p>
      </div>
    </div>
  );
}

// 빈 상태 컴포넌트 - 별점
export function EmptyRatingState() {
  return (
    <div className="mt-4 flex items-center justify-center rounded-lg bg-gray-50 py-8 sm:mt-8 sm:py-16">
      <div className="px-4 text-center sm:px-6">
        <h3 className="text-base font-medium text-gray-900 sm:text-lg">
          작성한 별점이 없습니다
        </h3>
        <p className="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-sm">
          아직 작성한 별점이 없습니다. 책을 읽고 별점을 남겨보세요.
        </p>
      </div>
    </div>
  );
}

// 빈 상태 컴포넌트 - 전체(리뷰와 별점)
export function EmptyAllState() {
  return (
    <div className="mt-4 flex items-center justify-center rounded-lg bg-gray-50 py-8 sm:mt-8 sm:py-16">
      <div className="px-4 text-center sm:px-6">
        <h3 className="text-base font-medium text-gray-900 sm:text-lg">
          작성한 리뷰와 별점이 없습니다
        </h3>
        <p className="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-sm">
          아직 작성한 리뷰와 별점이 없습니다. 책을 읽고 리뷰나 별점을
          남겨보세요.
        </p>
      </div>
    </div>
  );
}
