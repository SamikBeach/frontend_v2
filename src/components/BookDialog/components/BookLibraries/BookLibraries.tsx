import { CreateLibraryDto } from '@/apis/library/types';
import { LibraryDialog } from '@/components/Library';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';
import { useBookDetails } from '../../hooks';
import { useUserLibraries } from '../../hooks/useUserLibraries';
import { LibrariesList } from './LibrariesList';
import { LibrariesError, LibrariesLoading } from './LibrariesLoading';

export function BookLibraries() {
  const { book } = useBookDetails();
  const { isLoggedIn, createLibrary } = useUserLibraries();
  const [isNewLibraryDialogOpen, setIsNewLibraryDialogOpen] = useState(false);

  // 새 서재 생성 및 책 추가 핸들러
  const handleCreateLibraryWithBook = async (libraryData: CreateLibraryDto) => {
    try {
      const newLibrary = await createLibrary(libraryData);
      if (newLibrary && book) {
        toast.success(`'${newLibrary.name}' 서재가 생성되었습니다.`);
      }
    } catch (error) {
      toast.error('서재 생성 중 오류가 발생했습니다');
    }
  };

  if (!book) return null;

  return (
    <>
      <ErrorBoundary FallbackComponent={LibrariesError}>
        <Suspense fallback={<LibrariesLoading />}>
          <LibrariesList />
        </Suspense>
      </ErrorBoundary>

      {/* 서재 생성 다이얼로그 */}
      {isLoggedIn && (
        <LibraryDialog
          open={isNewLibraryDialogOpen}
          onOpenChange={setIsNewLibraryDialogOpen}
          mode="create"
          onCreateLibrary={handleCreateLibraryWithBook}
        />
      )}
    </>
  );
}
