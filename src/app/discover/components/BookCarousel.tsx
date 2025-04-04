import { Book } from '@/components/BookCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useEffect, useState } from 'react';

interface BookCarouselProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export function BookCarousel({ books, onSelectBook }: BookCarouselProps) {
  const [slidesPerView, setSlidesPerView] = useState(5); // 기본값

  // 반응형으로 슬라이드당 표시 항목 수 조정
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSlidesPerView(1); // 모바일
      } else if (width < 768) {
        setSlidesPerView(2); // 태블릿 소형
      } else if (width < 1024) {
        setSlidesPerView(3); // 태블릿 대형
      } else if (width < 1280) {
        setSlidesPerView(4); // 데스크탑
      } else {
        setSlidesPerView(5); // 대형 화면
      }
    };

    handleResize(); // 초기 설정
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
        slidesToScroll: slidesPerView,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {books.map(book => (
          <CarouselItem
            key={book.id}
            className="pl-2 sm:basis-1/2 md:basis-1/3 md:pl-4 lg:basis-1/4 xl:basis-1/5"
          >
            <div className="cursor-pointer" onClick={() => onSelectBook(book)}>
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
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4 hidden border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-100 md:flex" />
      <CarouselNext className="-right-4 hidden border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-100 md:flex" />
    </Carousel>
  );
}
