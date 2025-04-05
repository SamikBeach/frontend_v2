import { CalendarDays, Users } from 'lucide-react';

import { BookDetails } from './types';

interface ReadingGroupsProps {
  readingGroups: BookDetails['readingGroups'];
}

export function ReadingGroups({ readingGroups = [] }: ReadingGroupsProps) {
  if (readingGroups.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-900">
        이 책을 다루는 모임 ({readingGroups.length})
      </p>
      <div className="grid grid-cols-1 gap-3">
        {readingGroups.map(group => (
          <div
            key={group.id}
            className="cursor-pointer overflow-hidden rounded-xl bg-[#F9FAFB] p-5 transition-all duration-200 hover:bg-[#F2F4F6]"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-lg">
                <img
                  src={group.thumbnail}
                  alt={group.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-[15px] font-medium text-gray-900 transition-colors duration-150 hover:text-[#3182F6]">
                  {group.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users className="h-3 w-3 text-gray-400" />
                  <span>{group.memberCount}명</span>
                </div>
              </div>
            </div>

            {group.description && (
              <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                {group.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                  <span>매주 진행</span>
                </div>
                <span className="text-[#3182F6]">자세히 보기 &rarr;</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
