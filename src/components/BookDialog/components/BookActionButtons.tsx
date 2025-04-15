import { CreateLibraryDto } from '@/apis/library/types';
import { ReadingStatusType } from '@/apis/reading-status';
import { AuthDialog } from '@/components/Auth/AuthDialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import { BookOpen, ChevronDown, ListPlus, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  useBookDetails,
  useLibrary,
  useReadingStatus,
  useUserLibraries,
} from '../hooks';
import { ConflictAlertDialog } from './ConflictAlertDialog';

export function BookActionButtons() {
  const { book, isbn, userLibraries } = useBookDetails();
  const currentUser = useCurrentUser();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const {
    readingStatus,
    isPending,
    statusTexts,
    statusIcons,
    handleReadingStatusChange,
    getReadingStatusStyle,
  } = useReadingStatus();
  const {
    handleAddToLibrary,
    isPending: isLibraryPending,
    error,
    resetError,
    conflictDialogOpen,
    conflictLibraryName,
    closeConflictDialog,
  } = useLibrary(book, isbn, userLibraries);
  const { isLoggedIn, createLibrary } = useUserLibraries();

  // 새 서재 생성 다이얼로그 상태
  const [isNewLibraryDialogOpen, setIsNewLibraryDialogOpen] = useState(false);
  const [newLibraryName, setNewLibraryName] = useState('');
  const [newLibraryDesc, setNewLibraryDesc] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // 새 서재 생성 핸들러
  const handleCreateNewLibrary = async () => {
    if (!currentUser) {
      setAuthDialogOpen(true);
      return;
    }

    if (!newLibraryName.trim()) {
      toast.error('서재 이름을 입력해주세요.');
      return;
    }

    setIsCreating(true);

    const libraryData: CreateLibraryDto = {
      name: newLibraryName.trim(),
      description: newLibraryDesc.trim() || undefined,
      isPublic,
    };

    try {
      const newLibrary = await createLibrary(libraryData);
      if (newLibrary && book) {
        // 새로 생성된 서재에 책 추가
        // 서재 생성 후 즉시 책 추가하는 대신, 성공 메시지만 표시
        toast.success(`'${newLibrary.name}' 서재가 생성되었습니다.`);
      }
      // 다이얼로그 닫기 및 상태 초기화
      setIsNewLibraryDialogOpen(false);
      setNewLibraryName('');
      setNewLibraryDesc('');
      setIsPublic(true);
    } finally {
      setIsCreating(false);
    }
  };

  // 에러 상태 처리
  useEffect(() => {
    if (error) {
      console.error('서재에 책 추가 중 오류:', error);
      // 오류가 UI에 이미 표시되었으므로 여기서는 로깅만
      return () => resetError();
    }
  }, [error, resetError]);

  // 상태 텍스트 표시
  const displayStatusText = readingStatus
    ? statusTexts[readingStatus]
    : '책 상태 설정';

  // 상태 아이콘 표시
  const displayStatusIcon = readingStatus ? statusIcons[readingStatus] : null;

  // 읽기 상태 변경 핸들러 래퍼 함수
  const onReadingStatusChange = (status: ReadingStatusType) => {
    if (!currentUser) {
      setAuthDialogOpen(true);
      return;
    }

    if (book?.id) {
      handleReadingStatusChange(status);
    } else {
      toast.error('책 정보를 불러오는 중 오류가 발생했습니다.');
    }
  };

  // 서재에 담기 핸들러 래퍼 함수
  const handleAddToLibraryWithAuth = (libraryId: number) => {
    if (!currentUser) {
      setAuthDialogOpen(true);
      return;
    }

    handleAddToLibrary(libraryId);
  };

  // 새 서재 생성 다이얼로그 표시 핸들러
  const handleShowNewLibraryDialog = () => {
    if (!currentUser) {
      setAuthDialogOpen(true);
      return;
    }

    setIsNewLibraryDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full rounded-full border-gray-300 hover:bg-gray-100 hover:text-gray-900',
                readingStatus
                  ? getReadingStatusStyle(readingStatus)
                  : 'bg-gray-50 text-gray-700'
              )}
              disabled={isPending}
            >
              {displayStatusIcon && (
                <span className="mr-1.5">{displayStatusIcon}</span>
              )}
              <span>{displayStatusText}</span>
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 rounded-xl">
            {Object.values(ReadingStatusType).map(status => (
              <DropdownMenuItem
                key={status}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2',
                  readingStatus === status ? 'bg-gray-100' : '',
                  status === ReadingStatusType.WANT_TO_READ &&
                    'hover:bg-purple-50',
                  status === ReadingStatusType.READING && 'hover:bg-blue-50',
                  status === ReadingStatusType.READ && 'hover:bg-green-50'
                )}
                onClick={() => onReadingStatusChange(status)}
                disabled={isPending}
              >
                <span className="text-base">{statusIcons[status]}</span>
                <span
                  className={cn(
                    status === ReadingStatusType.WANT_TO_READ &&
                      'text-purple-600',
                    status === ReadingStatusType.READING && 'text-blue-600',
                    status === ReadingStatusType.READ && 'text-green-600'
                  )}
                >
                  {statusTexts[status]}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full rounded-full border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
            >
              <ListPlus className="mr-1.5 h-4 w-4" />
              <span className="text-sm">서재에 담기</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-48 rounded-xl">
            {userLibraries && userLibraries.length > 0 ? (
              userLibraries.map(library => (
                <DropdownMenuItem
                  key={library.id}
                  className="cursor-pointer rounded-lg py-2"
                  onClick={() => handleAddToLibraryWithAuth(library.id)}
                >
                  {library.name}
                  <span className="ml-1 text-xs text-gray-500">
                    {library.bookCount || 0}
                  </span>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                서재가 없습니다.
              </div>
            )}
            <DropdownMenuItem
              className="cursor-pointer rounded-lg py-2 text-black hover:bg-gray-100"
              onClick={handleShowNewLibraryDialog}
            >
              <Plus className="mr-1.5 h-4 w-4" />새 서재 만들기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 새 서재 생성 다이얼로그 */}
      <Dialog
        open={isNewLibraryDialogOpen}
        onOpenChange={isCreating ? undefined : setIsNewLibraryDialogOpen}
      >
        <DialogContent className="fixed top-1/2 left-1/2 max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border-none p-0 shadow-lg">
          <div className="sticky top-0 z-10 flex h-14 items-center justify-between rounded-t-2xl bg-white/95 px-5 backdrop-blur-xl">
            <DialogTitle className="text-base font-medium">
              새 서재 만들기
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsNewLibraryDialogOpen(false)}
              disabled={isCreating}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="px-5 py-4">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="libraryName"
                  className="text-sm font-medium text-gray-700"
                >
                  서재 이름
                </Label>
                <Input
                  id="libraryName"
                  placeholder="서재 이름을 입력하세요"
                  value={newLibraryName}
                  onChange={e => setNewLibraryName(e.target.value)}
                  className="rounded-xl border-gray-200 focus:border-blue-200 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="libraryDesc"
                  className="text-sm font-medium text-gray-700"
                >
                  서재 설명
                </Label>
                <Textarea
                  id="libraryDesc"
                  placeholder="서재에 대한 간단한 설명을 입력하세요"
                  className="min-h-[120px] resize-none rounded-xl border-gray-200 bg-gray-50 p-4 text-sm placeholder:text-gray-400 focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  value={newLibraryDesc}
                  onChange={e => setNewLibraryDesc(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div className="space-y-1">
                  <Label
                    htmlFor="isPublic"
                    className="text-sm font-medium text-gray-700"
                  >
                    서재를 공개로 설정
                  </Label>
                  <p className="text-xs text-gray-500">
                    공개 서재는 모든 사용자가 볼 수 있습니다
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                  className="data-[state=checked]:bg-gray-900"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsNewLibraryDialogOpen(false)}
              disabled={isCreating}
            >
              취소
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-200"
              onClick={handleCreateNewLibrary}
              disabled={!newLibraryName.trim() || isCreating}
            >
              <BookOpen className="mr-1.5 h-4 w-4" />
              {isCreating ? '생성 중...' : '서재 만들기'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 충돌 알림 다이얼로그 */}
      <ConflictAlertDialog
        open={conflictDialogOpen}
        onOpenChange={closeConflictDialog}
        libraryName={conflictLibraryName}
      />

      {/* 로그인 다이얼로그 */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
}
