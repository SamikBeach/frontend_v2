import { Book } from '@/components/BookCard';

interface BookGridProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export function BookGrid({ books, onSelectBook }: BookGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {books.map(book => (
        <div
          key={book.id}
          className="cursor-pointer"
          onClick={() => onSelectBook(book)}
        >
          <div className="group h-full rounded-xl bg-[#F9FAFB] transition-all hover:bg-[#F2F4F6]">
            <div className="relative aspect-[2/3] overflow-hidden rounded-t-xl">
              <img
                src={`https://picsum.photos/seed/${book.id}/240/360`}
                alt={book.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <h3 className="line-clamp-1 text-[15px] font-medium text-gray-900 group-hover:text-[#3182F6]">
                {book.title}
              </h3>
              <p className="mt-0.5 line-clamp-1 text-[13px] text-gray-500">
                {book.author}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
