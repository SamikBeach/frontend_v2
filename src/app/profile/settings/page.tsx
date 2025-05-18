'use client';

import { changePassword } from '@/apis/auth';
import { AuthProvider } from '@/apis/auth/types';
import { authUtils } from '@/apis/axios';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCurrentUser } from '@/hooks';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { DeleteAccountDialog } from './components';

// 비밀번호 변경 폼 데이터 타입
interface PasswordChangeFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 서버 오류 응답 타입
interface ServerError {
  message: string;
  error?: string;
  statusCode?: number;
}

export default function ProfileSettingsPage() {
  const user = useCurrentUser();
  const [isLocalProvider, setIsLocalProvider] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // 비밀번호 변경 폼 초기화
  const passwordChangeForm = useForm<PasswordChangeFormValues>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // 사용자 정보 로드 시 provider 체크
  useEffect(() => {
    if (user) {
      setIsLocalProvider(user.provider === AuthProvider.LOCAL);
    }
  }, [user]);

  // 비밀번호 변경 mutation
  const { mutate: changePasswordMutation, isPending: isChangingPassword } =
    useMutation({
      mutationFn: (data: { currentPassword: string; newPassword: string }) => {
        return changePassword(data);
      },
      onSuccess: () => {
        passwordChangeForm.reset();
        setServerError(null);
        toast.success('비밀번호가 성공적으로 변경되었습니다.');
      },
      onError: (error: any) => {
        // 서버 오류 메시지 처리
        if (error.response?.data) {
          const errorData = error.response.data as ServerError;
          setServerError(
            errorData.message || '비밀번호 변경 중 오류가 발생했습니다.'
          );
        } else {
          setServerError('비밀번호 변경 중 오류가 발생했습니다.');
        }
      },
    });

  // 계정 삭제 성공 시 핸들러
  const handleDeleteSuccess = () => {
    authUtils.removeTokens();
  };

  // 비밀번호 변경 제출 핸들러
  const onPasswordChangeSubmit = (data: PasswordChangeFormValues) => {
    // 비밀번호 일치 여부 확인
    if (data.newPassword !== data.confirmPassword) {
      passwordChangeForm.setError('confirmPassword', {
        type: 'validate',
        message: '새 비밀번호가 일치하지 않습니다',
      });
      return;
    }

    // 서버 에러 초기화
    setServerError(null);

    // API 호출
    changePasswordMutation({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <div className="w-full bg-white px-4 py-6 sm:container sm:mx-auto sm:max-w-3xl sm:p-6">
      <h1 className="mb-6 text-xl font-bold sm:mb-8 sm:text-3xl">계정 설정</h1>

      {/* 비밀번호 변경 섹션 */}
      {isLocalProvider && (
        <Card className="mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm sm:mb-8">
          <CardHeader className="bg-white px-4 py-4 sm:px-6 sm:py-6">
            <CardTitle className="text-lg font-semibold sm:text-xl">
              비밀번호 변경
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-500">
              안전한 비밀번호로 계정을 보호하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 py-4 sm:px-6 sm:py-6">
            <form
              onSubmit={passwordChangeForm.handleSubmit(onPasswordChangeSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label
                  htmlFor="currentPassword"
                  className="text-sm font-medium"
                >
                  현재 비밀번호
                </label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="현재 비밀번호"
                  className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  {...passwordChangeForm.register('currentPassword', {
                    required: '현재 비밀번호를 입력해주세요',
                    minLength: {
                      value: 8,
                      message: '비밀번호는 최소 8자 이상이어야 합니다',
                    },
                  })}
                />
                {passwordChangeForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-500">
                    {
                      passwordChangeForm.formState.errors.currentPassword
                        .message
                    }
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  새 비밀번호
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="새 비밀번호"
                  className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  {...passwordChangeForm.register('newPassword', {
                    required: '새 비밀번호를 입력해주세요',
                    minLength: {
                      value: 8,
                      message: '새 비밀번호는 최소 8자 이상이어야 합니다',
                    },
                  })}
                />
                {passwordChangeForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-500">
                    {passwordChangeForm.formState.errors.newPassword.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  새 비밀번호는 최소 8자 이상이어야 합니다.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  새 비밀번호 확인
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="새 비밀번호 확인"
                  className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  {...passwordChangeForm.register('confirmPassword', {
                    required: '새 비밀번호 확인을 입력해주세요',
                    minLength: {
                      value: 8,
                      message: '비밀번호는 최소 8자 이상이어야 합니다',
                    },
                  })}
                />
                {passwordChangeForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {
                      passwordChangeForm.formState.errors.confirmPassword
                        .message
                    }
                  </p>
                )}
              </div>

              {serverError && (
                <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                  {serverError}
                </div>
              )}

              <Button
                type="submit"
                disabled={isChangingPassword}
                className={cn(
                  'mt-4 h-11 w-full cursor-pointer rounded-lg bg-gray-900 text-white transition-colors hover:bg-gray-800 sm:w-auto',
                  isChangingPassword && 'opacity-70'
                )}
              >
                {isChangingPassword ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    변경 중...
                  </>
                ) : (
                  '비밀번호 변경'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 계정 삭제 섹션 */}
      <Card className="mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm sm:mb-8">
        <CardHeader className="bg-white px-4 py-4 sm:px-6 sm:py-6">
          <CardTitle className="text-lg font-semibold sm:text-xl">
            계정 삭제
          </CardTitle>
          <CardDescription className="mt-1 text-sm text-gray-500">
            계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은
            되돌릴 수 없습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 py-4 sm:px-6 sm:py-6">
          <DeleteAccountDialog
            isLocalProvider={isLocalProvider}
            onSuccess={handleDeleteSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}
