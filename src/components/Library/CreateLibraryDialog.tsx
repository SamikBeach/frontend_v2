import { CreateLibraryDto } from '@/apis/library/types';
import { AuthDialog } from '@/components/Auth/AuthDialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { BookOpen, X } from 'lucide-react';
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
      <Dialog open={open} onOpenChange={isCreating ? undefined : onOpenChange}>
        <DialogContent className="fixed top-1/2 left-1/2 max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border-none p-0 shadow-lg">
          <div className="sticky top-0 z-10 flex h-14 items-center justify-between rounded-t-2xl bg-white/95 px-5 backdrop-blur-xl">
            <DialogTitle className="text-base font-medium">
              새 서재 만들기
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
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
              onClick={() => onOpenChange(false)}
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

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        initialMode="login"
      />
    </>
  );
}
