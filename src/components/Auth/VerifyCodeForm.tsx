import { resendVerificationCode, verifyEmail } from '@/apis/auth';
import { VerifyEmailResponse } from '@/apis/auth/types';
import { authUtils } from '@/apis/axios';
import { userAtom } from '@/atoms/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface VerifyCodeFormProps {
  email: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

interface FormData {
  code: string;
}

export function VerifyCodeForm({ email, onSuccess }: VerifyCodeFormProps) {
  const [countdown, setCountdown] = useState(180); // 3분
  const [isResending, setIsResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // 사용자 상태 설정 함수
  const setUser = useSetAtom(userAtom);

  // 타이머 효과
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    defaultValues: {
      code: '',
    },
    mode: 'onTouched',
  });

  const { field: codeField } = useController({
    name: 'code',
    control,
    rules: {
      required: '인증코드를 입력해주세요',
      minLength: {
        value: 6,
        message: '인증코드는 6자리여야 합니다',
      },
      maxLength: {
        value: 6,
        message: '인증코드는 6자리여야 합니다',
      },
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (code: string) =>
      verifyEmail({ email, code }) as Promise<VerifyEmailResponse>,
    onSuccess: response => {
      setVerificationSuccess(true);
      setSuccessMessage('이메일 인증이 완료되었습니다.');

      // 로그인 처리: 토큰 저장 및 사용자 정보 설정
      authUtils.setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);

      // 토스트 메시지 - 환영 메시지 표시
      toast.success(
        `${response.user.username}님, 환영합니다! 회원가입이 완료되었습니다.`
      );

      // 2초 후에 다이얼로그 닫기
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    },
    onError: (error: any) => {
      setError('code', {
        message:
          error.response?.data?.message ||
          '인증에 실패했습니다. 코드를 확인해주세요.',
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => resendVerificationCode(email),
    onSuccess: () => {
      setCountdown(180);
      setIsResending(false);
      setSuccessMessage('인증코드가 재전송되었습니다.');
      // 3초 후 성공 메시지 제거
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    },
    onError: (error: any) => {
      setError('code', {
        message:
          error.response?.data?.message || '인증코드 재발송에 실패했습니다.',
      });
      setIsResending(false);
    },
  });

  const onSubmit = (data: FormData) => {
    verifyMutation.mutate(data.code);
  };

  const handleResendCode = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    resendMutation.mutate();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
          이메일 인증
        </h2>
        <p className="text-xs text-gray-500">
          {email}로 전송된 인증코드를 입력해주세요
        </p>
      </div>

      {verificationSuccess ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 13L9 17L19 7"
                stroke="#10B981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">인증 완료!</h3>
          <p className="text-center text-sm text-gray-600">
            이메일 인증이 완료되었습니다. 회원가입을 완료합니다.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="code" className="text-gray-600">
              인증코드
            </Label>
            <Input
              id="code"
              type="text"
              placeholder="6자리 인증코드"
              value={codeField.value}
              onChange={codeField.onChange}
              onBlur={codeField.onBlur}
              name={codeField.name}
              ref={codeField.ref}
              className="h-10 rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2 text-base transition-colors focus:bg-white focus:shadow-sm md:text-sm"
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
            {errors.code && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.code.message}
              </p>
            )}
          </div>

          {successMessage && !verificationSuccess && (
            <p className="mt-1 text-xs font-medium text-green-600">
              {successMessage}
            </p>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              남은 시간:{' '}
              <span className="font-medium">{formatTime(countdown)}</span>
            </p>
            {countdown === 0 && (
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={handleResendCode}
                disabled={isResending}
                className="h-auto p-0 text-xs font-medium text-gray-700 hover:text-gray-900"
              >
                {isResending ? (
                  <>
                    <Spinner className="mr-1 h-3 w-3" />
                    재전송 중...
                  </>
                ) : (
                  '인증코드 재전송'
                )}
              </Button>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl bg-gray-900 font-medium text-white hover:bg-gray-800 focus:ring-offset-0"
            disabled={verifyMutation.isPending}
          >
            {verifyMutation.isPending ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : null}
            인증 완료
          </Button>
        </form>
      )}
    </div>
  );
}
