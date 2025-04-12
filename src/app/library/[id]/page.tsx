'use client';

import { Suspense } from 'react';
import { LibraryContent } from './LibraryContent';
import { LibraryDetailSkeleton } from './LibraryDetailSkeleton';
import { LibraryHeader } from './LibraryHeader';
import { LibrarySidebar } from './LibrarySidebar';

function LibraryDetailContent() {
  return (
    <div className="mx-auto max-w-[1600px]">
      <LibraryHeader />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <LibraryContent />
        </div>
        <div className="w-full min-w-[360px]">
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
