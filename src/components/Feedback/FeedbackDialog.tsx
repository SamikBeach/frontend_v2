import { submitFeedback } from '@/apis/feedback';
import { FeedbackDto } from '@/apis/feedback/types';
import { useMutation } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '../ui/responsive-dialog';
import { Textarea } from '../ui/textarea';

// 폼 데이터 타입
interface FeedbackFormValues {
  content: string;
}

interface FeedbackDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function FeedbackDialog({ isOpen, onOpenChange }: FeedbackDialogProps) {
  // 폼 초기값 설정
  const { register, handleSubmit, reset } = useForm<FeedbackFormValues>({
    defaultValues: {
      content: '',
    },
  });

  // 피드백 제출 mutation
  const { mutate, isPending } = useMutation({
    mutationFn: (values: FeedbackFormValues) => {
      const feedbackData: FeedbackDto = {
        content: values.content,
      };
      return submitFeedback(feedbackData);
    },
    onSuccess: data => {
      // 성공 시 다이얼로그 닫기 및 폼 초기화
      toast.success(
        data.message || '피드백이 제출되었습니다. 소중한 의견 감사합니다!'
      );
      reset();
      onOpenChange(false);
    },
    onError: error => {
      console.error('피드백 제출 오류:', error);
      toast.error('피드백 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    },
  });

  // 폼 제출 핸들러
  const onSubmit = (values: FeedbackFormValues) => {
    // 내용이 비어있는지 확인
    if (!values.content.trim()) {
      toast.error('피드백 내용을 입력해주세요.');
      return;
    }

    mutate(values);
  };

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent
        className="rounded-2xl border-none p-0 sm:max-w-[425px]"
        drawerClassName="flex h-[100svh] min-h-0 w-full max-w-none flex-col rounded-t-[16px] border-none p-0"
      >
        <ResponsiveDialogHeader className="flex h-14 items-center justify-between rounded-t-2xl bg-white/95 px-5 backdrop-blur-xl">
          <ResponsiveDialogTitle className="text-base font-medium">
            피드백 보내기
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <div className="flex flex-1 flex-col overflow-y-auto px-5">
          <ResponsiveDialogDescription
            drawerClassName="mb-2"
            className="mb-4 text-sm text-gray-600 sm:mb-7 md:mb-6"
          >
            서비스 개선을 위한 의견이나 문제점을 알려주세요.
          </ResponsiveDialogDescription>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-3">
              <Textarea
                id="content"
                placeholder="피드백 내용을 자세히 입력해주세요"
                className="min-h-[180px] resize-none rounded-xl border-gray-200 p-4 text-sm text-[16px] placeholder:text-gray-400 focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
                {...register('content')}
              />
            </div>
          </form>
        </div>

        <ResponsiveDialogFooter
          className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4"
          drawerClassName="flex flex-col-reverse gap-2 border-t border-gray-100 px-5 py-4"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="cursor-pointer rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            취소
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="cursor-pointer rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:bg-green-200"
          >
            {isPending ? (
              <span className="flex items-center">제출 중...</span>
            ) : (
              <span className="flex items-center">
                <Send className="mr-2 h-4 w-4" /> 제출하기
              </span>
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
