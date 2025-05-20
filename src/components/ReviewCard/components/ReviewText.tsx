import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  const handleExpand = () => {
    if (!expanded) setExpanded(true);
  };

  const shouldEnableExpand = isLongContent && !expanded;

  return (
    <div className="mt-2">
      <p
        className={`text-[15px] leading-relaxed whitespace-pre-line text-gray-800 ${!expanded ? 'line-clamp-7' : ''}`}
        {...(isMobile && shouldEnableExpand
          ? {
              onClick: handleExpand,
              role: 'button',
              tabIndex: 0,
              'aria-expanded': expanded,
              style: { cursor: 'pointer' },
            }
          : {})}
      >
        {content}
      </p>
      {shouldEnableExpand && (
        <span
          className="mt-2 inline-block cursor-pointer text-sm text-[#A0AEC0] hover:underline"
          onClick={handleExpand}
          tabIndex={0}
          role="button"
          aria-expanded={expanded}
        >
          더 보기
        </span>
      )}
    </div>
  );
}
