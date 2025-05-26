'use client';

import { getBookVideos, YouTubeVideoResult } from '@/apis/youtube';
import { useBookDetails } from '@/components/BookDialog/hooks';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { VideoPlayer } from './VideoPlayer';

// HTML 엔티티 디코딩 함수
function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

export function BookVideos() {
  const { book } = useBookDetails();
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideoResult | null>(
    null
  );

  const { data: videosData } = useSuspenseQuery({
    queryKey: ['book-videos', book?.id, book?.isbn],
    queryFn: () =>
      getBookVideos({
        bookId: book?.id ?? 0,
        maxResults: 10,
        ...(book?.id === -1 && book?.isbn && { isbn: book.isbn }),
      }),
  });

  const videos = videosData.data;

  const handleVideoClick = (video: YouTubeVideoResult) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  if (videos.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-sm text-gray-500">이 책과 관련된 영상이 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 px-1 md:space-y-6 md:px-2">
        {videos.map(video => (
          <div
            key={video.id}
            className="group cursor-pointer"
            onClick={() => handleVideoClick(video)}
          >
            <div className="flex gap-4">
              <div className="relative flex-shrink-0">
                <img
                  src={video.thumbnailUrl}
                  alt={decodeHtmlEntities(video.title)}
                  className="h-24 w-40 rounded-xl object-cover transition-opacity duration-200 group-hover:opacity-90 md:h-32 md:w-56"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <h4 className="line-clamp-2 text-sm leading-tight font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
                  {decodeHtmlEntities(video.title)}
                </h4>
                <p className="text-xs font-medium text-gray-600">
                  {decodeHtmlEntities(video.channelTitle)}
                </p>
                <p className="line-clamp-1 text-xs leading-relaxed text-gray-500 md:line-clamp-2">
                  {decodeHtmlEntities(video.description)}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(video.publishedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={handleCloseVideo}
          open={!!selectedVideo}
        />
      )}
    </>
  );
}
