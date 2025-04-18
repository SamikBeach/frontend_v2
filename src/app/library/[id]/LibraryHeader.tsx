'use client';

import { updateLibrary } from '@/apis/library';
import { LibraryTag } from '@/apis/library/types';
import { useLibraryDetail } from '@/app/libraries/hooks/useLibraryDetail';
import { LibraryDialog } from '@/components/Library';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useQueryClient } from '@tanstack/react-query';
import { Bell, Edit, Eye, EyeOff, MoreHorizontal, Trash } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { AddBookDialog } from './components/AddBookDialog';
import { DeleteLibraryDialog } from './components/DeleteLibraryDialog';

// 실제 API에서 오는 태그 타입 (LibraryTag 인터페이스와 일치하지 않는 경우를 위한 추가 타입)
interface ApiTag extends Omit<LibraryTag, 'name' | 'tagName'> {
  name?: string;
  tagName?: string;
}

// 파스텔톤 색상 배열
const pastelColors = [
  '#FFD6E0', // 연한 분홍
  '#FFEFB5', // 연한 노랑
  '#D1F0C2', // 연한 초록
  '#C7CEEA', // 연한 파랑
  '#F0E6EF', // 연한 보라
  '#E2F0CB', // 연한 민트
];

export function LibraryHeader() {
  const params = useParams();
  const libraryId = parseInt(params.id as string, 10);
  const currentUser = useCurrentUser();
  const queryClient = useQueryClient();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddBookDialog, setShowAddBookDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // useLibraryDetail 훅으로 상태와 핸들러 함수 가져오기
  const {
    library,
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
  const handleUpdateLibrary = async (id: number, updateData: any) => {
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white pt-3">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {library?.name}
            </h1>

            {/* 서재 태그 */}
            {hasTags && library?.tags && (
              <div className="flex flex-wrap gap-2">
                {library.tags.map((tag, index) => (
                  <Badge
                    key={tag.id}
                    className="rounded-full border-0 px-4 py-1 text-sm font-medium text-gray-700"
                    style={{
                      backgroundColor:
                        pastelColors[index % pastelColors.length],
                    }}
                  >
                    {(tag as ApiTag).tagName || (tag as ApiTag).name}
                  </Badge>
                ))}
              </div>
            )}

            {/* 공개/비공개 배지는 소유자에게만 표시 */}
            {isOwner && library && (
              <Badge
                variant="outline"
                className={
                  library.isPublic !== undefined
                    ? library.isPublic
                      ? 'border-green-200 bg-green-50 text-green-600'
                      : 'border-yellow-200 bg-yellow-50 text-yellow-600'
                    : 'h-6 border-gray-200 bg-gray-50 px-4'
                }
              >
                {library.isPublic !== undefined &&
                  (library.isPublic ? (
                    <>
                      <Eye className="mr-1 h-3 w-3" />
                      공개
                    </>
                  ) : (
                    <>
                      <EyeOff className="mr-1 h-3 w-3" />
                      비공개
                    </>
                  ))}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">
              {library?.owner?.username}
            </span>
            님의 서재
          </p>
        </div>

        {/* 구독 버튼 또는 관리 버튼 영역 */}
        <div className="flex items-center gap-2">
          {library &&
            (isOwner ? (
              // 소유자인 경우 관리 버튼 표시
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 cursor-pointer rounded-full border-gray-300"
                  >
                    <MoreHorizontal className="h-5 w-5 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() => setShowEditDialog(true)}
                    className="cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    서재 정보 수정
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={handleVisibilityToggle}
                    className="cursor-pointer"
                  >
                    {library.isPublic ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        비공개로 변경
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        공개로 변경
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setShowDeleteDialog(true);
                      setIsDropdownOpen(false);
                    }}
                    className="cursor-pointer text-red-600 hover:bg-red-50"
                  >
                    <Trash className="mr-2 h-4 w-4 text-red-600 group-hover:text-red-600" />
                    <span className="text-red-600 group-hover:text-red-600">
                      서재 삭제
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // 소유자가 아닌 경우 구독 버튼 표시
              <Button
                variant={isSubscribed ? 'outline' : 'default'}
                size="lg"
                onClick={handleSubscriptionToggle}
                className={`relative h-10 w-32 cursor-pointer rounded-full font-medium ${
                  isSubscribed
                    ? 'border-gray-300 text-gray-800 hover:bg-gray-100'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                <span className="absolute left-5">
                  <Bell
                    className={`h-5 w-5 ${isSubscribed ? 'text-gray-800' : 'text-white'}`}
                  />
                </span>
                <span className="ml-7">
                  {isSubscribed ? '구독중' : '구독하기'}
                </span>
              </Button>
            ))}
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
