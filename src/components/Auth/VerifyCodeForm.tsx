import { useState } from 'react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface VerifyCodeFormProps {
  email: string;
  onSuccess?: () => void;
}

export function VerifyCodeForm({ email, onSuccess }: VerifyCodeFormProps) {
  // 상태 관리
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(180); // 3분 (초 단위)

  // 인증코드 인풋 핸들러
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 6) {
      setCode(value);
      setError(null);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 유효성 검사
    if (!code) {
      setError('인증코드를 입력해주세요.');
      return;
    }

    if (code.length !== 6) {
      setError('인증코드는 6자리여야 합니다.');
      return;
    }

    // 여기서는 로직 구현 없이 UI만 구현
    setIsLoading(true);

    // 성공 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
      setIsLoading(false);
      onSuccess?.();
    }, 1000);
  };

  // 인증코드 재발송 핸들러
  const handleResendCode = () => {
    setIsLoading(true);

    // 성공 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
      setIsLoading(false);
      setCountdown(180); // 카운트다운 초기화
      // 재발송 성공 메시지 (옵션)
    }, 1000);
  };

  // 시간 포맷팅 (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="code" className="text-gray-600">
            인증코드
          </Label>
          <Input
            id="code"
            type="text"
            placeholder="6자리 인증코드"
            value={code}
            onChange={handleCodeChange}
            className="h-10 rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2 text-sm transition-colors focus:bg-white focus:shadow-sm"
            maxLength={6}
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            남은 시간:{' '}
            <span className="font-medium">{formatTime(countdown)}</span>
          </p>
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={handleResendCode}
            disabled={isLoading || countdown > 0}
            className="h-auto p-0 text-xs font-medium text-gray-700 hover:text-gray-900"
          >
            인증코드 재발송
          </Button>
        </div>

        {error && <p className="text-xs font-medium text-red-500">{error}</p>}

        <Button
          type="submit"
          className="w-full rounded-xl bg-gray-900 font-medium text-white hover:bg-gray-800 focus:ring-offset-0"
          disabled={isLoading}
        >
          {isLoading ? '처리 중...' : '인증 완료'}
        </Button>
      </form>
    </div>
  );
}
