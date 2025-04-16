export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <p className="text-lg font-medium text-red-600">
        데이터를 불러오는 중 오류가 발생했습니다
      </p>
      <p className="mt-1 text-sm text-gray-600">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        다시 시도
      </button>
    </div>
  );
}

// 작은 사이즈의 오류 컴포넌트
export function SimpleErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div className="p-4 text-center">
      <p className="text-sm text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다
      </p>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 cursor-pointer text-xs text-blue-500 hover:underline"
      >
        다시 시도
      </button>
    </div>
  );
}
