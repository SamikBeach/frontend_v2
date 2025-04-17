import { Library as ApiLibrary } from '@/apis/library/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { BookOpen, Users } from 'lucide-react';
import Link from 'next/link';

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface LibraryCardProps {
  library: ApiLibrary;
  categories?: Category[];
}

export function LibraryCard({ library, categories = [] }: LibraryCardProps) {
  // 카테고리 찾기 (카테고리 ID가 있는 경우)
  const category = library.category
    ? categories.find(cat => cat.id === library.category)
    : null;

  // 책 데이터 - previewBooks가 있으면 사용, 없으면 books에서 가져옴
  const displayBooks =
    library.previewBooks ||
    (library.books
      ? library.books.map(book => ({
          id: book.bookId,
          title: book.book.title,
          author: book.book.author,
          coverImage: book.book.coverImage,
        }))
      : []
    ).slice(0, 3);

  // 소유자 정보
  const ownerName = library.owner.username;
  const ownerAvatar = library.owner.id
    ? `https://i.pravatar.cc/150?u=${library.owner.id}`
    : '';

  // 책 개수 - bookCount가 있으면 사용, 없으면 books 배열에서 계산
  const booksCount =
    library.bookCount !== undefined
      ? library.bookCount
      : library.books?.length || 0;

  return (
    <Link href={`/library/${library.id}`}>
      <Card className="group h-full rounded-xl border-none bg-[#F9FAFB] shadow-none transition-all duration-200 hover:bg-[#F2F4F6]">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-0">
              <AvatarImage
                src={ownerAvatar}
                alt={ownerName}
                className="object-cover"
              />
              <AvatarFallback className="bg-gray-100 text-gray-800">
                {ownerName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-medium text-gray-900 transition-colors duration-150 group-hover:text-[#3182F6]">
                  {library.name}
                </h3>
                {category && (
                  <span
                    className="ml-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-gray-700"
                    style={{
                      backgroundColor: category.color,
                    }}
                  >
                    {category.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{ownerName}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pt-0 pb-3">
          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
            {library.description || ''}
          </p>
          <div className="flex gap-2">
            {displayBooks && displayBooks.length > 0 ? (
              <div className="grid w-full grid-cols-3 gap-2">
                {displayBooks.map(book => (
                  <div
                    key={book.id}
                    className="aspect-[5/7] w-full overflow-hidden rounded-lg"
                  >
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[150px] w-full items-center justify-center rounded-lg bg-gray-100">
                <p className="text-sm text-gray-400">책이 없습니다</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between px-5 py-3 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-gray-400" />
              <span>{library.subscriberCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-gray-400" />
              <span>{booksCount}권</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
