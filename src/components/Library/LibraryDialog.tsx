'use client';

import { getPopularLibraryTags } from '@/apis/library/library-tag';
import {
  CreateLibraryDto,
  Library,
  UpdateLibraryDto,
} from '@/apis/library/types';
import { AuthDialog } from '@/components/Auth/AuthDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { getTagColor } from '@/utils/tags';
import { useSuspenseQuery } from '@tanstack/react-query';
import { BookOpen, Edit, X } from 'lucide-react';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

interface LibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
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

  // 태그 상태 추가 (tagId 기반으로 변경)
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    mode === 'edit' && library?.tags ? library.tags.map(tag => tag.tagId) : []
  );

  // 태그 이름을 저장하기 위한 맵 (UI 표시용)
  const [_, setSelectedTagNames] = useState<Map<number, string>>(
    new Map(
      mode === 'edit' && library?.tags
        ? library.tags.map(tag => [tag.tagId, tag.tagName])
        : []
    )
  );

  // 태그 추가 핸들러
  const handleTagSelect = (tagId: number, tagName: string) => {
    if (selectedTagIds.length >= 5) {
      toast.warning('태그는 최대 5개까지 선택할 수 있습니다.');
      return;
    }
    setSelectedTagIds(prev => [...prev, tagId]);
    setSelectedTagNames(prev => new Map(prev).set(tagId, tagName));
  };

  // 태그 제거 핸들러
  const handleTagRemove = (tagId: number) => {
    setSelectedTagIds(prev => prev.filter(id => id !== tagId));
    setSelectedTagNames(prev => {
      const newMap = new Map(prev);
      newMap.delete(tagId);
      return newMap;
    });
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
          tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
        };

        await onCreateLibrary(libraryData);
      } else if (mode === 'edit' && library && onUpdateLibrary) {
        const updateData: UpdateLibraryDto = {
          name: name.trim(),
          description: description.trim() || undefined,
          isPublic,
          tagIds: selectedTagIds,
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
      setSelectedTagIds([]);
      setSelectedTagNames(new Map());
    }
  };

  // 태그 토글 핸들러
  const toggleTag = (tagId: number, tagName: string) => {
    if (selectedTagIds.includes(tagId)) {
      handleTagRemove(tagId);
    } else {
      handleTagSelect(tagId, tagName);
    }
  };

  return (
    <>
      <ResponsiveDialog
        open={open}
        onOpenChange={isSubmitting ? undefined : onOpenChange}
      >
        <ResponsiveDialogContent
          onOpenAutoFocus={e => e.preventDefault()}
          className="fixed top-1/2 left-1/2 max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border-none p-0 shadow-lg"
          drawerClassName="flex h-[100svh] min-h-0 w-full max-w-none flex-col rounded-t-2xl border-t p-0 z-52"
          drawerOverlayClassName="z-51"
        >
          <div className="sticky top-0 z-10 flex h-14 items-center justify-between rounded-t-2xl bg-white/95 px-5 backdrop-blur-xl">
            <ResponsiveDialogTitle className="text-base font-medium">
              {mode === 'create' ? '새 서재 만들기' : '서재 정보 수정'}
            </ResponsiveDialogTitle>
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

          <div className="overflow-y-auto px-5">
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
                  className="rounded-xl border-gray-200 text-base focus:border-blue-200 focus:ring-2 focus:ring-blue-100 md:text-sm"
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
                  className="min-h-[120px] resize-none rounded-xl border-gray-200 bg-gray-50 p-4 text-base placeholder:text-gray-400 focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100 md:text-sm"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              {/* 태그 선택 섹션 */}
              <div className="space-y-3">
                <Label
                  htmlFor="libraryTags"
                  className="text-sm font-medium text-gray-700"
                >
                  태그 선택 (최대 5개)
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
                        <div className="flex flex-wrap gap-2">
                          {Array.from({ length: 8 }).map((_, index) => (
                            <div
                              key={index}
                              className={`h-6 rounded-full bg-gray-100 ${
                                index % 3 === 0
                                  ? 'w-20'
                                  : index % 3 === 1
                                    ? 'w-24'
                                    : 'w-16'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    }
                  >
                    <div className="space-y-4">
                      {/* 선택된 태그 표시 영역 (보이지 않음) */}
                      <div className="hidden">
                        {selectedTagIds.length > 0
                          ? selectedTagIds.map(tagId => (
                              <span key={tagId}>{tagId}</span>
                            ))
                          : null}
                      </div>

                      {/* 태그 목록 */}
                      <div className="mt-2">
                        <TagList
                          selectedTagIds={selectedTagIds}
                          toggleTag={toggleTag}
                        />
                      </div>
                    </div>
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

          <ResponsiveDialogFooter
            className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4"
            drawerClassName="flex flex-col-reverse gap-2 border-t border-gray-100 px-5 py-4"
          >
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
              className="rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:bg-green-200"
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
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        initialMode="login"
      />
    </>
  );
}

interface TagListProps {
  selectedTagIds: number[];
  toggleTag: (tagId: number, tagName: string) => void;
}

const TagList = ({ selectedTagIds, toggleTag }: TagListProps) => {
  // 인기 태그 불러오기
  const { data: popularTags } = useSuspenseQuery({
    queryKey: ['library', 'tags', 'popular'],
    queryFn: () => getPopularLibraryTags(),
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
  });

  return (
    <div className="flex flex-wrap gap-2">
      {popularTags && popularTags.length > 0 ? (
        popularTags.map((tag, index) => {
          // API 응답 구조에 맞게 tagId를 가져옴
          const tagId = tag.id; // LibraryTagResponseDto는 id 프로퍼티 사용
          const isSelected = selectedTagIds.includes(tagId);
          const tagColor = getTagColor(index % 8);

          return (
            <Badge
              key={`tag-${tagId || index}-${index}`}
              className={`cursor-pointer rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-200 ${
                isSelected
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-opacity-90 hover:bg-opacity-100 text-gray-700'
              }`}
              style={{
                backgroundColor: isSelected ? '#1f2937' : tagColor,
              }}
              onClick={() => toggleTag(tagId, tag.tagName)}
            >
              {tag.tagName}
            </Badge>
          );
        })
      ) : (
        <div className="text-xs text-gray-500">태그를 불러오는 중입니다</div>
      )}
    </div>
  );
};
