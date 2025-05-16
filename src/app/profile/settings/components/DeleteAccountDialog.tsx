'use client';

import { deleteAccount } from '@/apis/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ResponsiveAlertDialog,
  ResponsiveAlertDialogAction,
  ResponsiveAlertDialogCancel,
  ResponsiveAlertDialogContent,
  ResponsiveAlertDialogDescription,
  ResponsiveAlertDialogFooter,
  ResponsiveAlertDialogHeader,
  ResponsiveAlertDialogTitle,
  ResponsiveAlertDialogTrigger,
} from '@/components/ui/responsive-alert-dialog';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// 계정 삭제 폼 데이터 타입
interface AccountDeleteFormValues {
  password: string;
}

interface DeleteAccountDialogProps {
  isLocalProvider: boolean;
  userId: number;
  onSuccess?: () => void;
}

export function DeleteAccountDialog({
  isLocalProvider,
  userId,
  onSuccess,
}: DeleteAccountDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // 계정 삭제 폼 초기화
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<AccountDeleteFormValues>({
    defaultValues: {
      password: '',
    },
  });

  // 계정 삭제 mutation
  const { mutate: deleteAccountMutation, isPending: isDeletingAccount } =
    useMutation({
      mutationFn: (data: AccountDeleteFormValues) => {
        return deleteAccount(data);
      },
      onSuccess: () => {
        toast.success('계정이 성공적으로 삭제되었습니다.');
        setIsOpen(false);
        if (onSuccess) {
          onSuccess();
        } else {
          // 기본 동작: 홈페이지로 리디렉션
          router.push('/');
        }
      },
      onError: (error: any) => {
        // 서버 오류 메시지 처리
        if (error.response?.data) {
          const errorData = error.response?.data;
          setError('password', {
            type: 'server',
            message: errorData.message || '계정 삭제 중 오류가 발생했습니다.',
          });
        } else {
          setError('password', {
            type: 'server',
            message: '계정 삭제 중 오류가 발생했습니다.',
          });
        }
      },
    });

  // 다이얼로그 열기/닫기 핸들러
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // 다이얼로그가 닫힐 때 폼 초기화
      reset();
    }
  };

  // 계정 삭제 제출 핸들러
  const onAccountDeleteSubmit = (data: AccountDeleteFormValues) => {
    deleteAccountMutation(data);
  };

  return (
    <ResponsiveAlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <ResponsiveAlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="h-11 w-full cursor-pointer rounded-lg bg-red-500 text-white hover:bg-red-600 sm:w-auto"
        >
          계정 삭제
        </Button>
      </ResponsiveAlertDialogTrigger>
      <ResponsiveAlertDialogContent className="max-w-md border-none bg-white p-0 sm:max-w-lg">
        <ResponsiveAlertDialogHeader className="px-5 pt-4 sm:px-6 sm:pt-5">
          <ResponsiveAlertDialogTitle className="text-lg font-semibold sm:text-xl">
            계정을 정말 삭제하시겠습니까?
          </ResponsiveAlertDialogTitle>
          <ResponsiveAlertDialogDescription className="mt-2 text-sm text-gray-500">
            이 작업은 되돌릴 수 없습니다. 계정을 삭제하면 모든 데이터가
            영구적으로 삭제됩니다.
          </ResponsiveAlertDialogDescription>
        </ResponsiveAlertDialogHeader>
        <form
          onSubmit={handleSubmit(onAccountDeleteSubmit)}
          className="pb-4 sm:px-6"
        >
          {isLocalProvider && (
            <div className="mb-6 space-y-2">
              <label htmlFor="password" className="mb-1 text-sm font-medium">
                비밀번호 확인
              </label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                {...register('password', {
                  required: '비밀번호를 입력해주세요',
                  minLength: {
                    value: 8,
                    message: '비밀번호는 최소 8자 이상이어야 합니다',
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}

          <ResponsiveAlertDialogFooter
            className="flex items-center justify-end gap-3 px-0"
            drawerClassName="flex flex-col-reverse gap-3"
          >
            <ResponsiveAlertDialogCancel className="h-11 cursor-pointer rounded-lg border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
              취소
            </ResponsiveAlertDialogCancel>
            <ResponsiveAlertDialogAction
              type="submit"
              disabled={isDeletingAccount}
              className={cn(
                'h-11 cursor-pointer rounded-lg bg-red-500 text-white hover:bg-red-600',
                isDeletingAccount && 'opacity-70'
              )}
              drawerClassName="h-11 cursor-pointer rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              {isDeletingAccount ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  삭제 중...
                </>
              ) : (
                '삭제'
              )}
            </ResponsiveAlertDialogAction>
          </ResponsiveAlertDialogFooter>
        </form>
      </ResponsiveAlertDialogContent>
    </ResponsiveAlertDialog>
  );
}
