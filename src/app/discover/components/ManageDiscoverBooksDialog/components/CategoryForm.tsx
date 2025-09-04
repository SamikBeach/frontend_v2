import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { useCallback } from 'react';
import { CategoryFormProps } from '../types';

export function CategoryForm({
  categoryForm,
  setCategoryForm,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: CategoryFormProps) {
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit();
    },
    [onSubmit]
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCategoryForm(prev => ({ ...prev, name: e.target.value }));
    },
    [setCategoryForm]
  );

  const handleActiveChange = useCallback(
    (checked: boolean) => {
      setCategoryForm(prev => ({ ...prev, isActive: checked }));
    },
    [setCategoryForm]
  );

  const isSubmitDisabled = !categoryForm.name.trim() || isLoading;
  const buttonText = mode === 'create' ? '생성' : '수정';

  return (
    <div className="mb-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="categoryName" className="text-sm font-medium">
            카테고리명
          </Label>
          <Input
            id="categoryName"
            type="text"
            value={categoryForm.name}
            onChange={handleNameChange}
            placeholder="카테고리명을 입력하세요"
            className="h-9"
            autoFocus
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="categoryActive"
            checked={categoryForm.isActive}
            onCheckedChange={handleActiveChange}
          />
          <Label htmlFor="categoryActive" className="text-sm">
            활성화
          </Label>
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitDisabled}
            className="flex items-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {buttonText}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
