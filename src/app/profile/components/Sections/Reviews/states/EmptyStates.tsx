// 빈 상태 컴포넌트 - 리뷰
export function EmptyReviewState() {
  return (
    <div className="mt-8 flex items-center justify-center rounded-lg bg-gray-50 py-16">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">
          작성한 책 리뷰가 없습니다
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          아직 작성한 책 리뷰가 없습니다. 책을 읽고 리뷰를 작성해보세요.
        </p>
      </div>
    </div>
  );
}

// 빈 상태 컴포넌트 - 별점
export function EmptyRatingState() {
  return (
    <div className="mt-8 flex items-center justify-center rounded-lg bg-gray-50 py-16">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">
          작성한 별점이 없습니다
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          아직 작성한 별점이 없습니다. 책을 읽고 별점을 남겨보세요.
        </p>
      </div>
    </div>
  );
}

// 빈 상태 컴포넌트 - 전체(리뷰와 별점)
export function EmptyAllState() {
  return (
    <div className="mt-8 flex items-center justify-center rounded-lg bg-gray-50 py-16">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">
          작성한 리뷰와 별점이 없습니다
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          아직 작성한 리뷰와 별점이 없습니다. 책을 읽고 리뷰나 별점을
          남겨보세요.
        </p>
      </div>
    </div>
  );
}
