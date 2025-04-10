import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ReadingGroup } from '../types';

interface ReadingGroupCardProps {
  group: ReadingGroup;
}

export function ReadingGroupCard({ group }: ReadingGroupCardProps) {
  return (
    <Card className="overflow-hidden border-gray-200 transition-colors hover:bg-gray-50">
      <Link href={`/community/groups/${group.id}`}>
        <CardContent className="p-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={group.image}
                alt={group.name}
                width={80}
                height={80}
                className="h-[80px] w-[80px] object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[15px] font-medium text-gray-900">
                {group.name}
              </h3>
              <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                {group.description}
              </p>
              <div className="mt-auto flex items-center gap-1 text-xs text-gray-500">
                <Users className="h-3.5 w-3.5" />
                <span>{group.members}명의 회원</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
 