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
      <div
        className={`relative ${shouldEnableExpand && isMobile ? 'cursor-pointer' : ''}`}
        onClick={isMobile && shouldEnableExpand ? handleExpand : undefined}
        role={isMobile && shouldEnableExpand ? 'button' : undefined}
        tabIndex={isMobile && shouldEnableExpand ? 0 : undefined}
        aria-expanded={isMobile && shouldEnableExpand ? expanded : undefined}
      >
        <p
          className={`text-[15px] leading-relaxed whitespace-pre-line text-gray-800 ${
            !expanded ? 'line-clamp-7' : ''
          }`}
        >
          {content}
        </p>
        {shouldEnableExpand && (
          <span
            className="mt-2 inline-block cursor-pointer text-sm text-[#A0AEC0] hover:underline"
            onClick={e => {
              e.stopPropagation();
              handleExpand();
            }}
            tabIndex={0}
            role="button"
            aria-expanded={expanded}
          >
            더 보기
          </span>
        )}
      </div>
    </div>
  );
}
