import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Globe, Loader2, Lock } from 'lucide-react';

interface PrivacyToggleProps {
  /**
   * 현재 공개 설정 상태
   */
  isPublic: boolean;
  /**
   * 로딩 상태
   */
  isLoading: boolean;
  /**
   * 공개/비공개 상태가 변경될 때 호출되는 콜백
   */
  onToggle: (isPublic: boolean) => void;
  /**
   * 토글 비활성화 여부
   */
  disabled?: boolean;
  /**
   * 추가 스타일 클래스
   */
  className?: string;
}

/**
 * 차트 카드에서 사용되는 공개/비공개 설정 토글 컴포넌트
 */
export function PrivacyToggle({
  isPublic,
  isLoading,
  onToggle,
  disabled = false,
  className,
}: PrivacyToggleProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-full border px-1.5 py-0.5',
        'border-gray-100 bg-gray-50',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
      ) : (
        <span className="text-xs text-gray-500">
          {isPublic ? (
            <Globe className="h-3 w-3 text-gray-400" />
          ) : (
            <Lock className="h-3 w-3 text-gray-400" />
          )}
        </span>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <Switch
                checked={isPublic}
                onCheckedChange={onToggle}
                disabled={disabled}
                className="scale-70 data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200"
                aria-label="공개 설정"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            <p>{isPublic ? '공개 설정됨' : '비공개 설정됨'}</p>
            <p className="text-gray-500">클릭하여 설정 변경</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
