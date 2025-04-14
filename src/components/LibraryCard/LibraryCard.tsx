import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { BookOpen, Users } from 'lucide-react';
import Link from 'next/link';

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  coverImage: string;
}

export interface Library {
  id: number;
  title: string;
  description: string;
  category: string;
  owner: UserProfile;
  books: Book[];
  followers: number;
  isPublic: boolean;
  tags: string[];
  timestamp: string;
}

export interface LibraryCardProps {
  library: Library;
  categories?: Category[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export function LibraryCard({ library, categories = [] }: LibraryCardProps) {
  // 카테고리 찾기
  const category = categories.find(cat => cat.id === library.category);

  // 최대 3권의 책만 표시
  const displayBooks = library.books.slice(0, 3);

  return (
    <Link href={`/library/${library.id}`}>
      <Card className="group h-full rounded-xl border-none bg-[#F9FAFB] shadow-none transition-all duration-200 hover:bg-[#F2F4F6]">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-0">
              <AvatarImage
                src={library.owner.avatar}
                alt={library.owner.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gray-100 text-gray-800">
                {library.owner.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-medium text-gray-900 transition-colors duration-150 group-hover:text-[#3182F6]">
                  {library.title}
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
              <p className="text-xs text-gray-500">{library.owner.name}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pt-0 pb-3">
          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
            {library.description}
          </p>
          <div className="flex gap-2">
            {displayBooks.length > 0 ? (
              <div className="grid w-full grid-cols-3 gap-2">
                {displayBooks.map(book => (
                  <BookImage key={book.id} book={book} />
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
              <span>{library.followers.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-gray-400" />
              <span>{library.books.length}권</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

// 책 이미지 컴포넌트
interface BookImageProps {
  book: Book;
}

export function BookImage({ book }: BookImageProps) {
  return (
    <div className="aspect-[5/7] w-full overflow-hidden rounded-lg">
      <img
        src={book.coverImage}
        alt={book.title}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
