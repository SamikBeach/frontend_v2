import { Skeleton } from '@/components/ui/skeleton';
import { statsSections } from './StatsTabs';

export function StatsTabsSkeleton() {
  // 각 섹션의 이름에 대략적인 너비 매핑 (글자 길이에 비례)
  const widths = {
    '읽기 상태': 'w-[90px]',
    '리뷰와 평점': 'w-[110px]',
    '커뮤니티 활동': 'w-[120px]',
    서재: 'w-[70px]',
    기타: 'w-[60px]',
  };

  return (
    <div className="mb-3 flex flex-wrap gap-3 sm:mb-6">
      {statsSections.map((section, index) => (
        <Skeleton
          key={index}
          className={`h-8 rounded-full ${widths[section.name] || 'w-24'}`}
        />
      ))}
    </div>
  );
}
