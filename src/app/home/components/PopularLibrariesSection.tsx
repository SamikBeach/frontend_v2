import { HomeLibraryPreview } from '@/apis/library/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { BookOpen, Users } from 'lucide-react';
import Link from 'next/link';

interface PopularLibrariesSectionProps {
  libraries: HomeLibraryPreview[];
  isLoading?: boolean;
}

export function PopularLibrariesSection({
  libraries,
  isLoading = false,
}: PopularLibrariesSectionProps) {
  return (
    <section className="h-auto p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#3B82F6]" />
          <h2 className="text-xl font-semibold text-gray-900">인기 서재</h2>
        </div>
        <Link href="/libraries">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            더보기
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-[200px] items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : libraries.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-sm text-gray-500">인기 서재가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {libraries.slice(0, 2).map(library => (
            <Card
              key={library.id}
              className="group h-full overflow-hidden rounded-xl border-none bg-[#F9FAFB] shadow-none transition-all duration-200 hover:bg-[#F2F4F6]"
            >
              <Link href={`/library/${library.id}`}>
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border-0">
                      <AvatarImage
                        src={`https://i.pravatar.cc/150?u=${library.id}`}
                        alt={library.ownerName}
                      />
                      <AvatarFallback className="bg-gray-100 text-gray-800">
                        {library.ownerName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-[15px] font-medium text-gray-900 transition-colors duration-150 group-hover:text-[#3182F6]">
                        {library.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {library.ownerName}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <div className="flex w-full gap-2">
                    {library.previewBooks.slice(0, 3).map(book => (
                      <div
                        key={book.id}
                        className="flex-1 overflow-hidden rounded-lg"
                        style={{ aspectRatio: '2/3' }}
                      >
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center gap-4 p-5 pt-0 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{library.subscriberCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{library.bookCount}</span>
                  </div>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
