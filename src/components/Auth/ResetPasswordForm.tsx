import { useState } from 'react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type ResetPasswordStep = 'email' | 'verify' | 'reset';

interface ResetPasswordFormProps {
  onClickLogin: () => void;
  onSuccess?: () => void;
}

export function ResetPasswordForm({
  onClickLogin,
  onSuccess,
}: ResetPasswordFormProps) {
  // 상태 관리
  const [step, setStep] = useState<ResetPasswordStep>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(180); // 3분

  // 이메일 인풋 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  // 이메일 유효성 검사
  const isValidEmail = (email: string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  };

  // 이메일 폼 제출 핸들러
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setIsLoading(true);

    // 여기서는 로직 구현 없이 UI만 구현 (성공 시뮬레이션)
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify'); // 다음 단계로 이동
    }, 1000);
  };

  // 특정 위치의 코드 변경 핸들러
  const handleCodeChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value.length > 1) return; // 한 글자만 입력 가능

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setError(null);

    // 값이 입력되었고 다음 인풋이 있으면 포커스 이동
    if (value && index < 5 && e.target.nextElementSibling) {
      (e.target.nextElementSibling as HTMLInputElement).focus();
    }
  };

  // 키 입력 핸들러 (백스페이스 처리)
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // 백스페이스 키를 누르고 현재 입력란이 비어있다면 이전 입력란으로 포커스 이동
    if (
      e.key === 'Backspace' &&
      !verificationCode[index] &&
      index > 0 &&
      e.target.previousElementSibling
    ) {
      (e.target.previousElementSibling as HTMLInputElement).focus();
    }
  };

  // 인증 코드 폼 제출 핸들러
  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullCode = verificationCode.join('');
    if (fullCode.length !== 6) {
      setError('6자리 인증 코드를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);

    // 여기서는 로직 구현 없이 UI만 구현 (성공 시뮬레이션)
    setTimeout(() => {
      setIsLoading(false);
      setStep('reset'); // 다음 단계로 이동
    }, 1000);
  };

  // 비밀번호 인풋 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setError(null);
  };

  // 비밀번호 확인 인풋 핸들러
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setError(null);
  };

  // 비밀번호 재설정 폼 제출 핸들러
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword) {
      setError('새 비밀번호를 입력해주세요.');
      return;
    }

    if (newPassword.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    // 여기서는 로직 구현 없이 UI만 구현 (성공 시뮬레이션)
    setTimeout(() => {
      setIsLoading(false);
      onSuccess?.();
    }, 1000);
  };

  // 시간 포맷팅
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
          비밀번호 재설정
        </h2>
        <p className="text-xs text-gray-500">
          {step === 'email' &&
            '가입했던 이메일을 입력하면 인증 코드를 보내드립니다'}
          {step === 'verify' && '이메일로 전송된 인증 코드를 입력해주세요'}
          {step === 'reset' && '새로운 비밀번호를 설정해주세요'}
        </p>
      </div>

      {/* 이메일 입력 단계 */}
      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-gray-600">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일"
              value={email}
              onChange={handleEmailChange}
              className="h-10 rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2 text-sm transition-colors focus:bg-white focus:shadow-sm"
              autoComplete="email"
            />
          </div>

          {error && <p className="text-xs font-medium text-red-500">{error}</p>}

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full rounded-xl bg-gray-900 font-medium text-white hover:bg-gray-800 focus:ring-offset-0"
              disabled={isLoading}
            >
              {isLoading ? '처리 중...' : '인증 코드 전송'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              onClick={onClickLogin}
            >
              로그인으로 돌아가기
            </Button>
          </div>
        </form>
      )}

      {/* 인증 코드 입력 단계 */}
      {step === 'verify' && (
        <form onSubmit={handleVerifySubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="code" className="text-gray-600">
              인증 코드
            </Label>
            <Input
              id="code"
              type="text"
              placeholder="인증 코드 6자리"
              value={verificationCode.join('')}
              onChange={e => handleCodeChange(0, e)}
              onKeyDown={e => handleKeyDown(0, e)}
              className="h-10 rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2 text-sm transition-colors focus:bg-white focus:shadow-sm"
              autoComplete="one-time-code"
            />
          </div>

          <div className="flex items-center justify-center text-xs">
            <p className="text-gray-500">
              남은 시간:{' '}
              <span className="font-medium">{formatTime(countdown)}</span>
            </p>
          </div>

          {error && <p className="text-xs font-medium text-red-500">{error}</p>}

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full rounded-xl bg-gray-900 font-medium text-white hover:bg-gray-800 focus:ring-offset-0"
              disabled={isLoading}
            >
              {isLoading ? '처리 중...' : '인증 코드 확인'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              onClick={() => setStep('email')}
            >
              이전 단계로
            </Button>
          </div>
        </form>
      )}

      {/* 새 비밀번호 설정 단계 */}
      {step === 'reset' && (
        <form onSubmit={handleResetSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="password" className="text-gray-600">
              새 비밀번호
            </Label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="새 비밀번호 (8자 이상)"
              value={newPassword}
              onChange={handlePasswordChange}
              className="h-10 rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2 text-sm transition-colors focus:bg-white focus:shadow-sm"
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword" className="text-gray-600">
              비밀번호 확인
            </Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="h-10 rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2 text-sm transition-colors focus:bg-white focus:shadow-sm"
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-xs font-medium text-red-500">{error}</p>}

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full rounded-xl bg-gray-900 font-medium text-white hover:bg-gray-800 focus:ring-offset-0"
              disabled={isLoading}
            >
              {isLoading ? '처리 중...' : '비밀번호 재설정'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              onClick={() => setStep('verify')}
            >
              이전 단계로
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
