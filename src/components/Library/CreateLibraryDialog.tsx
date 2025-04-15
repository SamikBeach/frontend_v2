import { CreateLibraryDto } from '@/apis/library/types';
import { AuthDialog } from '@/components/Auth/AuthDialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useState } from 'react';
import { toast } from 'sonner';

interface CreateLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateLibrary: (library: CreateLibraryDto) => Promise<void>;
  bookId?: number;
  className?: string;
}

export function CreateLibraryDialog({
  open,
  onOpenChange,
  onCreateLibrary,
  className,
}: CreateLibraryDialogProps) {
  const currentUser = useCurrentUser();
  const [newLibraryName, setNewLibraryName] = useState('');
  const [newLibraryDesc, setNewLibraryDesc] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

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

    try {
      const libraryData: CreateLibraryDto = {
        name: newLibraryName.trim(),
        description: newLibraryDesc.trim() || undefined,
        isPublic,
      };

      await onCreateLibrary(libraryData);

      // 다이얼로그 닫기 및 상태 초기화
      resetForm();
    } catch (error) {
      console.error('서재 생성 오류:', error);
      toast.error('서재 생성 중 오류가 발생했습니다');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    onOpenChange(false);
    setNewLibraryName('');
    setNewLibraryDesc('');
    setIsPublic(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`sm:max-w-[425px] ${className}`}>
          <DialogHeader>
            <DialogTitle className="text-xl">새 서재 만들기</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="libraryName">서재 이름</Label>
              <Input
                id="libraryName"
                placeholder="서재 이름을 입력하세요"
                value={newLibraryName}
                onChange={e => setNewLibraryName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="libraryDesc">서재 설명 (선택사항)</Label>
              <Textarea
                id="libraryDesc"
                placeholder="서재에 대한 간단한 설명을 입력하세요"
                className="h-20 resize-none"
                value={newLibraryDesc}
                onChange={e => setNewLibraryDesc(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isPublic" className="text-sm font-medium">
                서재를 공개로 설정
              </Label>
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleCreateNewLibrary}
              disabled={isCreating}
            >
              {isCreating ? '생성 중...' : '서재 만들기'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        initialMode="login"
      />
    </>
  );
}
