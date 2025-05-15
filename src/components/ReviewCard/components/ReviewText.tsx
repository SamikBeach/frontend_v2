interface ReviewTextProps {
  content: string;
  isLongContent: boolean;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export function ReviewText({
  content,
  isLongContent,
  expanded,
  setExpanded,
}: ReviewTextProps) {
  return (
    <div className="mt-2">
      <p className="text-[15px] leading-relaxed whitespace-pre-line text-gray-800">
        {expanded ? content : content.slice(0, 200)}
      </p>
      {isLongContent && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 cursor-pointer text-sm text-gray-500 hover:text-gray-700"
        >
          {expanded ? '접기' : '더보기'}
        </button>
      )}
    </div>
  );
}
