import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { useCallback } from 'react';
import { SubCategoryFormProps } from '../types';

export function SubCategoryForm({
  subCategoryForm,
  setSubCategoryForm,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: SubCategoryFormProps) {
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit();
    },
    [onSubmit]
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSubCategoryForm(prev => ({ ...prev, name: e.target.value }));
    },
    [setSubCategoryForm]
  );

  const handleActiveChange = useCallback(
    (checked: boolean) => {
      setSubCategoryForm(prev => ({ ...prev, isActive: checked }));
    },
    [setSubCategoryForm]
  );

  const isSubmitDisabled = !subCategoryForm.name.trim() || isLoading;
  const buttonText = mode === 'create' ? '생성' : '수정';

  return (
    <div className="mb-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subCategoryName" className="text-sm font-medium">
            서브카테고리명
          </Label>
          <Input
            id="subCategoryName"
            type="text"
            value={subCategoryForm.name}
            onChange={handleNameChange}
            placeholder="서브카테고리명을 입력하세요"
            className="h-9"
            autoFocus
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="subCategoryActive"
            checked={subCategoryForm.isActive}
            onCheckedChange={handleActiveChange}
          />
          <Label htmlFor="subCategoryActive" className="text-sm">
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
