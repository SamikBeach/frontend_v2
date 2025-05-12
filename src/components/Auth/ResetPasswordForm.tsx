'use client';

import {
  requestPasswordReset,
  resetPassword,
  verifyResetToken,
} from '@/apis/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ResetPasswordFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

interface RequestResetFormData {
  email: string;
}

interface VerifyTokenFormData {
  token: string;
}

interface ResetPasswordFormData {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export function ResetPasswordForm({
  onSuccess,
  onClose,
}: ResetPasswordFormProps) {
  const [step, setStep] = useState<'request' | 'verify' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 요청 단계 폼
  const requestForm = useForm<RequestResetFormData>({
    defaultValues: {
      email: '',
    },
  });

  // 인증 코드 확인 단계 폼
  const verifyForm = useForm<VerifyTokenFormData>({
    defaultValues: {
      token: '',
    },
  });

  // 재설정 단계 폼
  const resetForm = useForm<ResetPasswordFormData>({
    defaultValues: {
      email: '',
      token: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // 비밀번호 재설정 요청 mutation
  const requestResetMutation = useMutation({
    mutationFn: (data: RequestResetFormData) =>
      requestPasswordReset({ email: data.email }),
    onSuccess: (_, variables) => {
      setEmail(variables.email);
      setStep('verify');
      toast.success(`인증 코드가 ${variables.email}로 발송되었습니다`);
    },
    onError: (error: any) => {
      requestForm.setError('email', {
        message: error.message || '비밀번호 재설정 요청에 실패했습니다.',
      });
    },
  });

  // 인증 코드 확인 mutation
  const verifyTokenMutation = useMutation({
    mutationFn: (data: VerifyTokenFormData) =>
      verifyResetToken({ email, token: data.token }),
    onSuccess: (_, variables) => {
      // 재설정 폼에 이메일과 토큰 자동 설정
      resetForm.setValue('email', email);
      resetForm.setValue('token', variables.token);
      setStep('reset');
      // 성공 시 토스트 메시지 표시
      toast.success('인증이 완료되었습니다');
    },
    onError: (error: any) => {
      verifyForm.setError('token', {
        message: error.message || '유효하지 않은 인증 코드입니다.',
      });
    },
  });

  // 인증 코드 확인 핸들러
  const handleVerifyToken = (data: VerifyTokenFormData) => {
    verifyTokenMutation.mutate(data);
  };

  // 비밀번호 재설정 mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordFormData) =>
      resetPassword({
        email: data.email,
        token: data.token,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      toast.success('비밀번호가 성공적으로 재설정되었습니다');
      onSuccess?.();
    },
    onError: (error: any) => {
      if (error.message?.includes('token')) {
        // 토큰 에러가 발생하면 인증 단계로 돌아가기
        setStep('verify');
        verifyForm.setError('token', {
          message: '유효하지 않은 인증 코드입니다.',
        });
      } else {
        resetForm.setError('newPassword', {
          message: error.message || '비밀번호 재설정에 실패했습니다.',
        });
      }
    },
  });

  // 요청 단계 제출 핸들러
  const onRequestSubmit = (data: RequestResetFormData) => {
    requestResetMutation.mutate(data);
  };

  // 재설정 단계 제출 핸들러
  const onResetSubmit = (data: ResetPasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      resetForm.setError('confirmPassword', {
        message: '비밀번호가 일치하지 않습니다.',
      });
      return;
    }
    resetPasswordMutation.mutate(data);
  };

  // 단계 표시자 렌더링
  const renderStepIndicator = () => (
    <div className="mb-4 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <div
          className={`h-2.5 w-2.5 rounded-full ${
            step === 'request' ? 'bg-gray-900' : 'bg-gray-300'
          }`}
        />
        <div
          className={`h-2.5 w-2.5 rounded-full ${
            step === 'verify' ? 'bg-gray-900' : 'bg-gray-300'
          }`}
        />
        <div
          className={`h-2.5 w-2.5 rounded-full ${
            step === 'reset' ? 'bg-gray-900' : 'bg-gray-300'
          }`}
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
          비밀번호 재설정
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {renderStepIndicator()}

      {step === 'request' && (
        <form
          onSubmit={requestForm.handleSubmit(onRequestSubmit)}
          className="space-y-4"
        >
          <div>
            <p className="mb-4 text-sm text-gray-600">
              가입한 이메일 주소를 입력하시면 비밀번호 재설정 인증 코드를
              보내드립니다.
            </p>
            <Input
              {...requestForm.register('email', {
                required: '이메일을 입력해주세요',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: '올바른 이메일을 입력해주세요',
                },
              })}
              type="email"
              placeholder="이메일 주소"
              className="h-12"
            />
            {requestForm.formState.errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {requestForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={requestResetMutation.isPending}
          >
            {requestResetMutation.isPending && <Spinner className="mr-2" />}
            인증 코드 받기
          </Button>
        </form>
      )}

      {step === 'verify' && (
        <form
          onSubmit={verifyForm.handleSubmit(handleVerifyToken)}
          className="space-y-4"
        >
          <div>
            <p className="mb-4 text-sm text-gray-600">
              {email}로 전송된 6자리 인증 코드를 입력해주세요.
            </p>

            <div className="mb-4">
              <Input
                {...verifyForm.register('token', {
                  required: '인증 코드를 입력해주세요',
                  minLength: {
                    value: 6,
                    message: '인증 코드는 6자리여야 합니다',
                  },
                  maxLength: {
                    value: 6,
                    message: '인증 코드는 6자리여야 합니다',
                  },
                })}
                type="text"
                placeholder="6자리 인증 코드"
                className="h-12"
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
              {verifyForm.formState.errors.token && (
                <p className="mt-1 text-sm text-red-500">
                  {verifyForm.formState.errors.token.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={verifyTokenMutation.isPending}
          >
            {verifyTokenMutation.isPending && <Spinner className="mr-2" />}
            다음
          </Button>
        </form>
      )}

      {step === 'reset' && (
        <form
          onSubmit={resetForm.handleSubmit(onResetSubmit)}
          className="space-y-4"
        >
          <div>
            <p className="mb-4 text-sm text-gray-600">
              새로운 비밀번호를 입력해주세요.
            </p>

            <div className="mb-4">
              <div className="relative">
                <Input
                  {...resetForm.register('newPassword', {
                    required: '새 비밀번호를 입력해주세요',
                    minLength: {
                      value: 8,
                      message: '비밀번호는 8자 이상이어야 합니다',
                    },
                  })}
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="새 비밀번호"
                  className="h-12 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 aspect-square h-full text-gray-400 hover:text-gray-900"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  tabIndex={-1}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showNewPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                  </span>
                </Button>
              </div>
              {resetForm.formState.errors.newPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {resetForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <Input
                  {...resetForm.register('confirmPassword', {
                    required: '비밀번호를 다시 입력해주세요',
                    validate: value =>
                      value === resetForm.getValues('newPassword') ||
                      '비밀번호가 일치하지 않습니다',
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="새 비밀번호 확인"
                  className="h-12 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 aspect-square h-full text-gray-400 hover:text-gray-900"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                  </span>
                </Button>
              </div>
              {resetForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {resetForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending && <Spinner className="mr-2" />}
            비밀번호 변경
          </Button>
        </form>
      )}
    </div>
  );
}
