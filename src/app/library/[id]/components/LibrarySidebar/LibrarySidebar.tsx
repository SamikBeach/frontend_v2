'use client';

import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { useLibraryDetail } from '../../hooks';
import { LibrarySidebarContent } from './LibrarySidebarContent';
import { LibrarySidebarSkeleton } from './LibrarySidebarSkeleton';

export function LibrarySidebar() {
  const params = useParams();
  const libraryId = parseInt(params.id as string, 10);
  const { library, isLoading } = useLibraryDetail(libraryId);

  if (isLoading || !library) {
    return <LibrarySidebarSkeleton />;
  }

  return (
    <Suspense fallback={<LibrarySidebarSkeleton />}>
      <LibrarySidebarContent libraryId={libraryId} />
    </Suspense>
  );
}
