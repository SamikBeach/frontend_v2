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
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../constants';
import { DraggableCategoryProps } from '../types';

export function DraggableCategory({
  category,
  index,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onToggleActive,
  onMove,
  onDrop,
}: DraggableCategoryProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    { id: number; index: number },
    void,
    { handlerId: string | symbol | null }
  >({
    accept: ItemTypes.CATEGORY,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    drop(item: { index: number }) {
      onDrop(item.index, index);
    },
  });

  const [{ isDragging }, drag] = useDrag<
    { id: number; index: number },
    void,
    { isDragging: boolean }
  >({
    type: ItemTypes.CATEGORY,
    item: () => {
      return { id: category.id, index };
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`group flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
        isSelected
          ? category.isActive
            ? 'border-blue-200 bg-blue-50'
            : 'border-blue-200 bg-blue-50'
          : category.isActive
            ? 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
      } ${isDragging ? 'opacity-50' : ''} ${!category.isActive ? 'opacity-75' : ''}`}
      onClick={() => onSelect(category)}
    >
      <GripVertical className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4
            className={`font-medium ${category.isActive ? 'text-gray-900' : 'text-gray-600'}`}
          >
            {category.name}
          </h4>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              category.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {category.isActive ? '활성' : '비활성'}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
          <span>서브카테고리: {category.subCategories?.length || 0}개</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
          onClick={e => e.stopPropagation()}
        >
          <span>활성화</span>
          <Switch
            checked={category.isActive}
            onCheckedChange={checked => {
              onToggleActive(category.id, checked);
            }}
          />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              onEdit(category);
            }}
            className="h-7 w-7 p-0"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={e => e.stopPropagation()}
                className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>카테고리 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  "{category.name}" 카테고리를 삭제하시겠습니까? 이 작업은
                  되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(category.id)}
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
