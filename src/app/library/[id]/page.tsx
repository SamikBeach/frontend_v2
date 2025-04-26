'use client';

import { Suspense } from 'react';
import { LibraryContent } from './components/LibraryContent';
import { LibraryDetailSkeleton } from './components/LibraryDetailSkeleton';
import { LibraryHeader } from './components/LibraryHeader';
import { LibrarySidebar } from './components/LibrarySidebar';

function LibraryDetailContent() {
  return (
    <div className="mx-auto w-full max-w-[1920px] px-4">
      <LibraryHeader />

      <div className="mt-3 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        <div>
          <LibraryContent />
        </div>
        <div className="w-full min-w-[400px]">
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
