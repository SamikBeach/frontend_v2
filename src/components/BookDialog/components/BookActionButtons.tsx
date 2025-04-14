import { CreateLibraryDto } from '@/apis/library/types';
import { ReadingStatusType } from '@/apis/reading-status';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
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
import { cn } from '@/lib/utils';
import { ChevronDown, ListPlus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  useBookDetails,
  useBookshelf,
  useReadingStatus,
  useUserLibraries,
} from '../hooks';

export function BookActionButtons() {
  const { book, isbn, userLibraries } = useBookDetails();
  const {
    readingStatus,
    isPending,
    statusTexts,
    statusIcons,
    handleReadingStatusChange,
    getReadingStatusStyle,
  } = useReadingStatus();
  const {
    handleAddToBookshelf,
    isPending: isBookshelfPending,
    error,
    resetError,
  } = useBookshelf(book, isbn, userLibraries);
  const { isLoggedIn, createLibrary } = useUserLibraries();

  // 새 서재 생성 다이얼로그 상태
  const [isNewLibraryDialogOpen, setIsNewLibraryDialogOpen] = useState(false);
  const [newLibraryName, setNewLibraryName] = useState('');
  const [newLibraryDesc, setNewLibraryDesc] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // 새 서재 생성 핸들러
  const handleCreateNewLibrary = async () => {
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
        handleAddToBookshelf(newLibrary.id);
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
    if (book?.id) {
      handleReadingStatusChange(status);
    } else {
      toast.error('책 정보를 불러오는 중 오류가 발생했습니다.');
    }
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
                  readingStatus === status && 'bg-gray-100'
                )}
                onClick={() => onReadingStatusChange(status)}
                disabled={isPending}
              >
                <span className="text-base">{statusIcons[status]}</span>
                <span>{statusTexts[status]}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full rounded-full border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              disabled={isBookshelfPending || !isLoggedIn}
            >
              <ListPlus className="mr-1.5 h-4 w-4" />
              <span className="text-sm">
                {isBookshelfPending
                  ? '처리 중...'
                  : !isLoggedIn
                    ? '로그인 필요'
                    : '서재에 담기'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60 rounded-xl">
            {userLibraries && userLibraries.length > 0 ? (
              userLibraries.map(library => (
                <DropdownMenuItem
                  key={library.id}
                  className="cursor-pointer rounded-lg py-2"
                  onClick={() => handleAddToBookshelf(library.id)}
                  disabled={isBookshelfPending}
                >
                  {library.name}
                  <span className="ml-2 text-xs text-gray-500">
                    ({library.bookCount || 0}권)
                  </span>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                서재가 없습니다.
              </div>
            )}
            <DropdownMenuItem
              className="cursor-pointer rounded-lg py-2 text-blue-600 hover:text-blue-700"
              onClick={() => setIsNewLibraryDialogOpen(true)}
            >
              <Plus className="mr-1.5 h-4 w-4" />새 서재 만들기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 새 서재 생성 다이얼로그 */}
      <Dialog
        open={isNewLibraryDialogOpen}
        onOpenChange={setIsNewLibraryDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">새 서재 만들기</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">서재 이름</Label>
              <Input
                id="name"
                value={newLibraryName}
                onChange={e => setNewLibraryName(e.target.value)}
                placeholder="서재 이름을 입력하세요"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">설명 (선택사항)</Label>
              <Textarea
                id="description"
                value={newLibraryDesc}
                onChange={e => setNewLibraryDesc(e.target.value)}
                placeholder="서재에 대한 설명을 입력하세요"
                className="resize-none"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="public">공개 서재로 설정</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewLibraryDialogOpen(false)}
              disabled={isCreating}
            >
              취소
            </Button>
            <Button
              onClick={handleCreateNewLibrary}
              disabled={!newLibraryName.trim() || isCreating}
            >
              {isCreating ? '생성 중...' : '만들기'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
