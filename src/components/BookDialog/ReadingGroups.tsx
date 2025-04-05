import { Users } from 'lucide-react';

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
            className="flex cursor-pointer items-center gap-4 rounded-2xl bg-gray-50 p-5 transition-colors hover:bg-gray-100"
          >
            <div className="h-20 w-20 overflow-hidden rounded-lg">
              <img
                src={group.thumbnail}
                alt={group.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-lg font-medium">{group.name}</p>
              <div className="flex items-center text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="mr-0.5 h-3.5 w-3.5" />
                  <span>{group.memberCount}명</span>
                </div>
                {group.description && (
                  <>
                    <span className="mx-1.5">·</span>
                    <p className="line-clamp-1">{group.description}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
