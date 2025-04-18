'use client';

import {
  CreateLibraryDto,
  Library,
  UpdateLibraryDto,
} from '@/apis/library/types';
import { TagSelector } from '@/app/libraries/components/TagSelector';
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
import { BookOpen, Edit, X } from 'lucide-react';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

interface LibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  className?: string;
  // 생성 모드일 때 필요한 props
  onCreateLibrary?: (library: CreateLibraryDto) => Promise<void>;
  // 편집 모드일 때 필요한 props
  library?: Library;
  onUpdateLibrary?: (id: number, data: UpdateLibraryDto) => Promise<void>;
}

export function LibraryDialog({
  open,
  onOpenChange,
  mode,
  className,
  onCreateLibrary,
  library,
  onUpdateLibrary,
}: LibraryDialogProps) {
  const currentUser = useCurrentUser();
  const [name, setName] = useState(
    mode === 'edit' && library ? library.name : ''
  );
  const [description, setDescription] = useState(
    mode === 'edit' && library ? library.description || '' : ''
  );
  const [isPublic, setIsPublic] = useState(
    mode === 'edit' && library ? library.isPublic : true
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // 태그 상태 추가
  const [selectedTags, setSelectedTags] = useState<string[]>(
    mode === 'edit' && library?.tags
      ? library.tags.map(tag => (tag.tagName || '').toString())
      : []
  );

  // 태그 추가 핸들러
  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => [...prev, tag]);
  };

  // 태그 제거 핸들러
  const handleTagRemove = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  // 서재 생성/수정 핸들러
  const handleSubmit = async () => {
    if (mode === 'create' && !currentUser) {
      setAuthDialogOpen(true);
      return;
    }

    if (!name.trim()) {
      toast.error('서재 이름을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'create' && onCreateLibrary) {
        const libraryData: CreateLibraryDto = {
          name: name.trim(),
          description: description.trim() || undefined,
          isPublic,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
        };

        await onCreateLibrary(libraryData);
        toast.success('새 서재가 생성되었습니다.');
      } else if (mode === 'edit' && library && onUpdateLibrary) {
        const updateData: UpdateLibraryDto = {
          name: name.trim(),
          description: description.trim() || undefined,
          isPublic,
          tags: selectedTags,
        };

        await onUpdateLibrary(library.id, updateData);
        toast.success('서재 정보가 수정되었습니다.');
      }

      // 다이얼로그 닫기 및 상태 초기화
      resetForm();
    } catch (error) {
      console.error(`서재 ${mode === 'create' ? '생성' : '수정'} 오류:`, error);
      toast.error(
        `서재 ${mode === 'create' ? '생성' : '수정'} 중 오류가 발생했습니다`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    onOpenChange(false);
    if (mode === 'create') {
      setName('');
      setDescription('');
      setIsPublic(true);
      setSelectedTags([]);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={isSubmitting ? undefined : onOpenChange}
      >
        <DialogContent className="fixed top-1/2 left-1/2 max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border-none p-0 shadow-lg">
          <div className="sticky top-0 z-10 flex h-14 items-center justify-between rounded-t-2xl bg-white/95 px-5 backdrop-blur-xl">
            <DialogTitle className="text-base font-medium">
              {mode === 'create' ? '새 서재 만들기' : '서재 정보 수정'}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-5 py-4">
            {mode === 'edit' && library && (
              <div className="mb-6 text-sm text-gray-600">
                <span className="font-medium text-gray-800">
                  {library.name}
                </span>
                의 정보를 수정해보세요
              </div>
            )}

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
                  value={name}
                  onChange={e => setName(e.target.value)}
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
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              {/* 태그 선택기 추가 */}
              <div className="space-y-3">
                <Label
                  htmlFor="libraryTags"
                  className="text-sm font-medium text-gray-700"
                >
                  태그 선택
                </Label>
                <ErrorBoundary
                  fallbackRender={() => (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-500">
                      태그 로딩 중 오류가 발생했습니다.
                    </div>
                  )}
                >
                  <Suspense
                    fallback={
                      <div className="animate-pulse space-y-4">
                        <div className="h-10 w-full rounded-md bg-gray-100"></div>
                        <div className="flex flex-wrap gap-2">
                          <div className="h-6 w-16 rounded-full bg-gray-100"></div>
                          <div className="h-6 w-20 rounded-full bg-gray-100"></div>
                        </div>
                      </div>
                    }
                  >
                    <TagSelector
                      selectedTags={selectedTags}
                      onTagSelect={handleTagSelect}
                      onTagRemove={handleTagRemove}
                      maxTags={5}
                    />
                  </Suspense>
                </ErrorBoundary>
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
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-200"
              onClick={handleSubmit}
              disabled={!name.trim() || isSubmitting}
            >
              {mode === 'create' ? (
                <BookOpen className="mr-1.5 h-4 w-4" />
              ) : (
                <Edit className="mr-1.5 h-4 w-4" />
              )}
              {isSubmitting
                ? `${mode === 'create' ? '생성' : '저장'} 중...`
                : mode === 'create'
                  ? '서재 만들기'
                  : '저장하기'}
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
