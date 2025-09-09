import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, GripVertical, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../constants';
import { DraggableSubCategoryProps } from '../types';

export function DraggableSubCategory({
  subCategory,
  index,
  onEdit,
  onDelete,
  onToggleActive,
  onMove,
  onDrop,
}: DraggableSubCategoryProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleHover = useCallback(
    (item: { index: number }, monitor: any) => {
      if (!ref.current || item.index === index) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      const dragIndex = item.index;
      const shouldSkip =
        (dragIndex < index && hoverClientY < hoverMiddleY) ||
        (dragIndex > index && hoverClientY > hoverMiddleY);

      if (shouldSkip) return;

      onMove(dragIndex, index);
      item.index = index;
    },
    [index, onMove]
  );

  const handleDrop = useCallback(
    (item: { index: number }) => {
      onDrop(item.index, index);
    },
    [index, onDrop]
  );

  const [{ handlerId }, drop] = useDrop<
    { id: number; index: number },
    void,
    { handlerId: string | symbol | null }
  >({
    accept: ItemTypes.SUBCATEGORY,
    collect: monitor => ({ handlerId: monitor.getHandlerId() }),
    hover: handleHover,
    drop: handleDrop,
  });

  const dragItem = useMemo(
    () => ({ id: subCategory.id, index }),
    [subCategory.id, index]
  );

  const [{ isDragging }, drag] = useDrag<
    { id: number; index: number },
    void,
    { isDragging: boolean }
  >({
    type: ItemTypes.SUBCATEGORY,
    item: () => dragItem,
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  const handleEdit = useCallback(() => {
    onEdit(subCategory);
  }, [onEdit, subCategory]);

  const handleDelete = useCallback(() => {
    onDelete(subCategory.id);
  }, [onDelete, subCategory.id]);

  const handleToggleActive = useCallback(
    (checked: boolean) => {
      onToggleActive(subCategory.id, checked);
    },
    [onToggleActive, subCategory.id]
  );

  const handleStopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // 스타일 계산
  const containerClassName = useMemo(() => {
    const baseStyle =
      'group flex items-center gap-3 rounded-lg border p-3 transition-all';
    const activeStyle = subCategory.isActive
      ? 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
      : 'border-gray-300 bg-gray-50 opacity-75 hover:border-gray-400 hover:bg-gray-100';
    const draggingStyle = isDragging ? 'opacity-50' : '';
    return [baseStyle, activeStyle, draggingStyle].filter(Boolean).join(' ');
  }, [subCategory.isActive, isDragging]);

  const titleClassName = useMemo(
    () =>
      `font-medium ${subCategory.isActive ? 'text-gray-800' : 'text-gray-600'}`,
    [subCategory.isActive]
  );

  const statusBadgeClassName = useMemo(
    () =>
      `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        subCategory.isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`,
    [subCategory.isActive]
  );

  const statusText = subCategory.isActive ? '활성' : '비활성';

  return (
    <div ref={ref} data-handler-id={handlerId} className={containerClassName}>
      <GripVertical className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h5 className={titleClassName}>{subCategory.name}</h5>
          <span className={statusBadgeClassName}>{statusText}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
          onClick={handleStopPropagation}
        >
          <span>활성화</span>
          <Switch
            checked={subCategory.isActive}
            onCheckedChange={handleToggleActive}
          />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-7 w-7 p-0"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>서브카테고리 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  &quot;{subCategory.name}&quot; 서브카테고리를
                  삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
