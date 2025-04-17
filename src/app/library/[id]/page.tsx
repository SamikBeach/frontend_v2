'use client';

import { Suspense } from 'react';
import { LibraryContent } from './LibraryContent';
import { LibraryDetailSkeleton } from './LibraryDetailSkeleton';
import { LibraryHeader } from './LibraryHeader';
import { LibrarySidebar } from './LibrarySidebar';

function LibraryDetailContent() {
  return (
    <div className="mx-auto w-full max-w-[1920px] px-4">
      <LibraryHeader />

      <div className="mt-3 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <LibraryContent />
        </div>
        <div className="w-full min-w-[300px]">
          <LibrarySidebar />
        </div>
      </div>
    </div>
  );
}

export default function LibraryDetailPage() {
  return (
    <Suspense fallback={<LibraryDetailSkeleton />}>
      <LibraryDetailContent />
    </Suspense>
  );
}
