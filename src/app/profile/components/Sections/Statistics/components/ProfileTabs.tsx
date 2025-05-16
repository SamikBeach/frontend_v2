import { MenuItem } from './MenuItem';

// Define the statistics section options
export const profileSections = [
  { id: 'reading', name: '읽기 상태' },
  { id: 'activity', name: '리뷰와 평점' },
  { id: 'community', name: '커뮤니티 활동' },
  { id: 'library', name: '서재' },
  { id: 'etc', name: '기타' },
];

interface ProfileTabsProps {
  selectedSection: string;
  onSelectSection: (section: string) => void;
}

export function ProfileTabs({
  selectedSection,
  onSelectSection,
}: ProfileTabsProps) {
  return (
    <div className="mb-4 border-b border-gray-100 pb-4">
      <div className="flex flex-wrap gap-3">
        {profileSections.map(section => (
          <MenuItem
            key={section.id}
            filter={section}
            selectedSection={selectedSection}
            onSelectSection={onSelectSection}
          />
        ))}
      </div>
    </div>
  );
}
