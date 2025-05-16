import { StatsMenuItem } from './StatsMenuItem';

// Define the statistics section options
export const statsSections = [
  { id: 'reading', name: '읽기 상태' },
  { id: 'activity', name: '리뷰와 평점' },
  { id: 'community', name: '커뮤니티 활동' },
  { id: 'library', name: '서재' },
  { id: 'etc', name: '기타' },
];

interface StatsTabsProps {
  selectedSection: string;
  onSelectSection: (section: string) => void;
}

export function StatsTabs({
  selectedSection,
  onSelectSection,
}: StatsTabsProps) {
  return (
    <div className="mb-3 flex flex-wrap gap-3 sm:mb-6">
      {statsSections.map(section => (
        <StatsMenuItem
          key={section.id}
          filter={section}
          selectedSection={selectedSection}
          onSelectSection={onSelectSection}
        />
      ))}
    </div>
  );
}
