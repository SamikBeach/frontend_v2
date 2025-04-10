import { resendVerificationCode, verifyEmail } from '@/apis/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useController, useForm } from 'react-hook-form';

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
    mode: 'onBlur',
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
    mutationFn: (code: string) => verifyEmail({ email, code }),
    onSuccess: () => {
      onSuccess?.();
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
    verifyMutation.mutate(data.code, {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: error => {
        setError('code', {
          message:
            (error as any).response?.data?.message ||
            '인증에 실패했습니다. 코드를 확인해주세요.',
        });
      },
    });
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
            className="h-10 rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2 text-sm transition-colors focus:bg-white focus:shadow-sm"
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

        {successMessage && (
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
    </div>
  );
}
