'use client';

import { updateLibrary } from '@/apis/library';
import { UpdateLibraryDto } from '@/apis/library/types';
import { LibraryDialog } from '@/components/Library';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLibraryDetail } from '../../hooks';
import { AddBookDialog } from '../AddBookDialog';
import { DeleteLibraryDialog } from '../DeleteLibraryDialog';
import { LibraryHeaderActions } from './LibraryHeaderActions';
import { LibraryHeaderOwnerInfo } from './LibraryHeaderOwnerInfo';
import { LibraryHeaderSkeleton } from './LibraryHeaderSkeleton';
import { LibraryHeaderTitle } from './LibraryHeaderTitle';

export function LibraryHeader() {
  const params = useParams();
  const libraryId = parseInt(params.id as string, 10);
  const currentUser = useCurrentUser();
  const queryClient = useQueryClient();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddBookDialog, setShowAddBookDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    library,
    isLoading,
    isSubscribed,
    handleSubscriptionToggle,
    updateLibraryVisibility,
  } = useLibraryDetail(libraryId);

  // 현재 사용자가 서재 소유자인지 확인
  const isOwner = currentUser?.id === library?.owner?.id;

  // 태그가 있는지 확인
  const hasTags = library?.tags && library?.tags.length > 0;

  // 공개/비공개 상태 변경 핸들러
  const handleVisibilityToggle = async () => {
    if (!library) return;
    await updateLibraryVisibility(library.id, !library.isPublic);
  };

  // 서재 정보 수정 핸들러
  const handleUpdateLibrary = async (
    id: number,
    updateData: UpdateLibraryDto
  ) => {
    if (!library) return;
    try {
      await updateLibrary(id, updateData);
      // 서재 정보 갱신
      queryClient.invalidateQueries({ queryKey: ['library', id] });
      toast.success('서재 정보가 수정되었습니다.');
    } catch (error) {
      console.error('서재 정보 수정 중 오류:', error);
      throw error;
    }
  };

  if (isLoading || !library) {
    return <LibraryHeaderSkeleton />;
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white pt-3">
        <div className="flex-1">
          <LibraryHeaderTitle
            library={library}
            isOwner={isOwner}
            hasTags={hasTags}
          />
          <LibraryHeaderOwnerInfo owner={library.owner} />
        </div>

        {/* 구독 버튼 또는 관리 버튼 영역 */}
        <div className="flex items-center gap-2">
          {library && (
            <LibraryHeaderActions
              library={library}
              isOwner={isOwner}
              isSubscribed={isSubscribed}
              handleSubscriptionToggle={handleSubscriptionToggle}
              handleVisibilityToggle={handleVisibilityToggle}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              setShowEditDialog={setShowEditDialog}
              setShowDeleteDialog={setShowDeleteDialog}
            />
          )}
        </div>
      </div>

      {/* 다이얼로그 표시 */}
      {showEditDialog && library && (
        <LibraryDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          mode="edit"
          library={library}
          onUpdateLibrary={handleUpdateLibrary}
        />
      )}

      {showAddBookDialog && (
        <AddBookDialog
          isOpen={showAddBookDialog}
          onOpenChange={setShowAddBookDialog}
          libraryId={libraryId}
        />
      )}

      {showDeleteDialog && library && (
        <DeleteLibraryDialog
          isOpen={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          library={library}
        />
      )}
    </>
  );
}
