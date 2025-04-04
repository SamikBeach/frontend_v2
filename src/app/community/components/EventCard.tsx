import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 이벤트가 일주일 이내인지 확인
  const isUpcoming = () => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7일을 밀리초로
    return eventDate.getTime() - today.getTime() < oneWeek;
  };

  return (
    <Card className="overflow-hidden border-gray-200 transition-colors hover:bg-gray-50">
      <Link href={`/community/events/${event.id}`}>
        <CardContent className="p-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={event.image}
                alt={event.title}
                width={80}
                height={80}
                className="h-[80px] w-[80px] object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-start gap-2">
                <h3 className="text-[15px] font-medium text-gray-900">
                  {event.title}
                </h3>
                {isUpcoming() && (
                  <Badge
                    variant="outline"
                    className="h-5 border-gray-200 bg-gray-100 text-[10px] text-gray-900"
                  >
                    곧 시작
                  </Badge>
                )}
              </div>
              <div className="mt-1.5 flex flex-col gap-0.5">
                <p className="flex items-center text-xs text-gray-600">
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-gray-300"></span>
                  {formatDate(event.date)}
                </p>
                <p className="flex items-center text-xs text-gray-600">
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-gray-300"></span>
                  {event.location}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
 