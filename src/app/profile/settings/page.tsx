'use client';

import { changePassword, deleteAccount } from '@/apis/auth';
import { AuthProvider } from '@/apis/auth/types';
import { authUtils } from '@/apis/axios';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// 비밀번호 변경 폼 데이터 타입
interface PasswordChangeFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 계정 삭제 폼 데이터 타입
interface AccountDeleteFormValues {
  password: string;
}

// 서버 오류 응답 타입
interface ServerError {
  message: string;
  error?: string;
  statusCode?: number;
}

export default function ProfileSettingsPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const [isLocalProvider, setIsLocalProvider] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // 비밀번호 변경 폼 초기화
  const passwordChangeForm = useForm<PasswordChangeFormValues>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // 계정 삭제 폼 초기화
  const accountDeleteForm = useForm<AccountDeleteFormValues>({
    defaultValues: {
      password: '',
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
      onSuccess: response => {
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

  // 계정 삭제 mutation
  const { mutate: deleteAccountMutation, isPending: isDeletingAccount } =
    useMutation({
      mutationFn: (data: AccountDeleteFormValues) => {
        return deleteAccount(data);
      },
      onSuccess: () => {
        toast.success('계정이 성공적으로 삭제되었습니다.');
        authUtils.removeTokens();
        router.push('/');
      },
      onError: (error: any) => {
        // 서버 오류 메시지 처리
        if (error.response?.data) {
          const errorData = error.response.data as ServerError;
          accountDeleteForm.setError('password', {
            type: 'server',
            message: errorData.message || '계정 삭제 중 오류가 발생했습니다.',
          });
        } else {
          accountDeleteForm.setError('password', {
            type: 'server',
            message: '계정 삭제 중 오류가 발생했습니다.',
          });
        }
      },
    });

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

  // 계정 삭제 제출 핸들러
  const onAccountDeleteSubmit = (data: AccountDeleteFormValues) => {
    deleteAccountMutation(data);
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <h1 className="mb-8 text-3xl font-bold">계정 설정</h1>

      {/* 비밀번호 변경 섹션 */}
      {isLocalProvider && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>비밀번호 변경</CardTitle>
            <CardDescription>
              안전한 비밀번호로 계정을 보호하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                <div className="rounded-md border border-red-100 bg-red-50 p-2 text-sm text-red-500">
                  {serverError}
                </div>
              )}

              <Button
                type="submit"
                disabled={isChangingPassword}
                className="mt-2"
              >
                {isChangingPassword ? '변경 중...' : '비밀번호 변경'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 계정 삭제 섹션 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>계정 삭제</CardTitle>
          <CardDescription>
            계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은
            되돌릴 수 없습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive">계정 삭제</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  계정을 정말 삭제하시겠습니까?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  이 작업은 되돌릴 수 없습니다. 계정을 삭제하면 모든 데이터가
                  영구적으로 삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <form
                onSubmit={accountDeleteForm.handleSubmit(onAccountDeleteSubmit)}
                className="space-y-4"
              >
                {isLocalProvider && (
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      비밀번호 확인
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      {...accountDeleteForm.register('password', {
                        required: '비밀번호를 입력해주세요',
                        minLength: {
                          value: 8,
                          message: '비밀번호는 최소 8자 이상이어야 합니다',
                        },
                      })}
                    />
                    {accountDeleteForm.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {accountDeleteForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                )}

                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={isDeletingAccount}
                  >
                    {isDeletingAccount ? '삭제 중...' : '삭제'}
                  </Button>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
