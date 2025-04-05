import { useState } from 'react';

import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { AppleIcon } from './icons/AppleIcon';
import { GoogleIcon } from './icons/GoogleIcon';

interface SignUpFormProps {
  onClickLogin: () => void;
  onEmailVerified: (email: string) => void;
  onSuccess?: () => void;
}

export function SignUpForm({
  onClickLogin,
  onEmailVerified,
  onSuccess,
}: SignUpFormProps) {
  // 상태 관리
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToMarketing, setAgreedToMarketing] = useState(false);

  // 이메일 인풋 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  // 이메일 유효성 검사
  const isValidEmail = (email: string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 유효성 검사
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    if (!agreedToTerms || !agreedToPrivacy) {
      setError('필수 약관에 동의해주세요.');
      return;
    }

    // 여기서는 로직 구현 없이 UI만 구현
    setIsLoading(true);

    // 성공 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
      setIsLoading(false);
      onEmailVerified(email);
    }, 1000);
  };

  // 구글 회원가입 핸들러
  const handleGoogleSignUp = () => {
    if (!agreedToTerms || !agreedToPrivacy) {
      setError('필수 약관에 동의해주세요.');
      return;
    }

    setIsLoading(true);

    // 성공 시뮬레이션 (실제로는 구글 OAuth 인증)
    setTimeout(() => {
      setIsLoading(false);
      onSuccess?.();
    }, 1000);
  };

  // 애플 회원가입 핸들러
  const handleAppleSignUp = () => {
    if (!agreedToTerms || !agreedToPrivacy) {
      setError('필수 약관에 동의해주세요.');
      return;
    }

    setIsLoading(true);

    // 성공 시뮬레이션 (실제로는 애플 OAuth 인증)
    setTimeout(() => {
      setIsLoading(false);
      onSuccess?.();
    }, 1000);
  };

  // 모든 약관 동의 핸들러
  const handleAgreeAll = (checked: boolean) => {
    setAgreedToTerms(checked);
    setAgreedToPrivacy(checked);
    setAgreedToMarketing(checked);
  };

  // 모든 약관에 동의했는지 확인
  const allAgreed = agreedToTerms && agreedToPrivacy && agreedToMarketing;

  return (
    <div className="flex flex-col space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
          회원가입
        </h2>
        <p className="text-xs text-gray-500">
          고전산책의 다양한 서비스를 이용해보세요
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
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

        {/* 약관 동의 */}
        <div className="space-y-2.5 rounded-xl bg-gray-50/70 p-3.5">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms-all"
              checked={allAgreed}
              onCheckedChange={handleAgreeAll}
              className="border-gray-300 text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:text-white"
            />
            <Label
              htmlFor="terms-all"
              className="text-xs font-medium text-gray-700"
            >
              모든 약관에 동의합니다
            </Label>
          </div>

          <Separator className="my-2 bg-gray-200" />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={checked => setAgreedToTerms(checked as boolean)}
              className="border-gray-300 text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:text-white"
            />
            <div className="flex flex-wrap items-center text-xs">
              <Label htmlFor="terms" className="font-medium text-gray-700">
                이용약관 동의
              </Label>
              <span className="ml-1 text-xs text-red-500">(필수)</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="privacy"
              checked={agreedToPrivacy}
              onCheckedChange={checked =>
                setAgreedToPrivacy(checked as boolean)
              }
              className="border-gray-300 text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:text-white"
            />
            <div className="flex flex-wrap items-center text-xs">
              <Label htmlFor="privacy" className="font-medium text-gray-700">
                개인정보 수집 및 이용 동의
              </Label>
              <span className="ml-1 text-xs text-red-500">(필수)</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="marketing"
              checked={agreedToMarketing}
              onCheckedChange={checked =>
                setAgreedToMarketing(checked as boolean)
              }
              className="border-gray-300 text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:text-white"
            />
            <div className="flex items-center text-xs">
              <Label htmlFor="marketing" className="font-medium text-gray-700">
                마케팅 정보 수신 동의
              </Label>
              <span className="ml-1 text-xs text-gray-500">(선택)</span>
            </div>
          </div>
        </div>

        {error && <p className="text-xs font-medium text-red-500">{error}</p>}

        <Button
          type="submit"
          className="w-full rounded-xl bg-gray-900 font-medium text-white hover:bg-gray-800 focus:ring-offset-0"
          disabled={isLoading}
        >
          {isLoading ? '처리 중...' : '이메일로 가입하기'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-2 text-xs text-gray-500">또는</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center rounded-xl border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50/80 hover:text-gray-900"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
        >
          <GoogleIcon className="mr-2 h-4 w-4" />
          Google로 회원가입
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-center rounded-xl border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50/80 hover:text-gray-900"
          onClick={handleAppleSignUp}
          disabled={isLoading}
        >
          <AppleIcon className="mr-2 h-4 w-4" />
          Apple로 회원가입
        </Button>
      </div>

      <div className="text-center text-xs">
        <span className="text-gray-500">이미 계정이 있으신가요?</span>{' '}
        <Button
          variant="link"
          className="h-auto p-0 text-xs font-medium text-gray-700 hover:text-gray-900"
          onClick={onClickLogin}
        >
          로그인
        </Button>
      </div>
    </div>
  );
}
