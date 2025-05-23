import { checkEmail } from '@/apis/auth';
import { AuthProvider } from '@/apis/auth/types';
import { authUtils } from '@/apis/axios';
import { userAtom } from '@/atoms/user';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { openSocialLoginPopup } from '@/utils/oauth';
import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AppleIcon, GoogleIcon, KakaoIcon, NaverIcon } from './icons';

interface SignUpFormProps {
  onClickLogin: () => void;
  onEmailVerified: (email: string) => void;
  onSuccess?: () => void;
}

interface FormData {
  email: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
}

export function SignUpForm({
  onClickLogin,
  onEmailVerified,
  onSuccess,
}: SignUpFormProps) {
  const [error, setError] = useState<string | null>(null);
  const setUser = useSetAtom(userAtom);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      termsAgreed: false,
      privacyAgreed: false,
      marketingAgreed: false,
    },
    mode: 'onSubmit',
  });

  const { field: emailField } = useController({
    name: 'email',
    control,
    rules: {
      required: '이메일을 입력해주세요',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        message: '올바른 이메일 형식이 아닙니다',
      },
    },
  });

  const { field: termsAgreedField } = useController({
    name: 'termsAgreed',
    control,
    rules: {
      required: '이용약관에 동의해주세요',
      validate: value => value === true || '이용약관에 동의해주세요',
    },
  });

  const { field: privacyAgreedField } = useController({
    name: 'privacyAgreed',
    control,
    rules: {
      required: '개인정보 수집 및 이용에 동의해주세요',
      validate: value =>
        value === true || '개인정보 수집 및 이용에 동의해주세요',
    },
  });

  const { field: marketingAgreedField } = useController({
    name: 'marketingAgreed',
    control,
  });

  // 현재 체크박스 상태 가져오기
  const termsAgreed = watch('termsAgreed');
  const privacyAgreed = watch('privacyAgreed');
  const marketingAgreed = watch('marketingAgreed');

  // 모든 약관에 동의했는지 확인
  const allAgreed = termsAgreed && privacyAgreed && marketingAgreed;

  // 이메일 확인 API 뮤테이션 (회원가입 1단계)
  const checkEmailMutation = useMutation({
    mutationFn: (email: string) => checkEmail(email),
    onSuccess: data => {
      // 이메일 사용 가능한 경우 다음 단계로 이동
      if (data.isAvailable) {
        onEmailVerified(emailField.value);
      } else {
        setError(data.message || '이메일을 사용할 수 없습니다.');
      }
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message ||
          '이메일 확인에 실패했습니다. 다시 시도해주세요.'
      );
    },
  });

  // 모든 약관 동의 핸들러
  const handleAgreeAll = (checked: boolean) => {
    setValue('termsAgreed', checked);
    setValue('privacyAgreed', checked);
    setValue('marketingAgreed', checked);
  };

  // 폼 제출 핸들러
  const onSubmit = (data: FormData) => {
    setError(null);
    checkEmailMutation.mutate(data.email);
  };

  // 구글 회원가입 핸들러
  const handleGoogleSignUp = async () => {
    setError(null);

    try {
      const { accessToken, refreshToken, user } = await openSocialLoginPopup(
        AuthProvider.GOOGLE
      );

      // 토큰 및 사용자 정보 저장
      authUtils.setTokens(accessToken, refreshToken);
      setUser(user);

      // 성공 콜백
      onSuccess?.();
    } catch (err) {
      console.error('구글 회원가입 오류:', err);
      setError(
        err instanceof Error ? err.message : '구글 회원가입에 실패했습니다.'
      );
    }
  };

  // 애플 회원가입 핸들러
  const handleAppleSignUp = async () => {
    setError(null);

    try {
      const { accessToken, refreshToken, user } = await openSocialLoginPopup(
        AuthProvider.APPLE
      );

      // 토큰 및 사용자 정보 저장
      authUtils.setTokens(accessToken, refreshToken);
      setUser(user);

      // 성공 콜백
      onSuccess?.();
    } catch (err) {
      console.error('애플 회원가입 오류:', err);
      setError(
        err instanceof Error ? err.message : '애플 회원가입에 실패했습니다.'
      );
    }
  };

  // 네이버 회원가입 핸들러 (UI만 구현)
  const handleNaverSignUp = () => {
    setError(null);
    toast.info('네이버 회원가입은 아직 구현되지 않았습니다.');
  };

  // 카카오 회원가입 핸들러 (UI만 구현)
  const handleKakaoSignUp = () => {
    setError(null);
    toast.info('카카오 회원가입은 아직 구현되지 않았습니다.');
  };

  // 로딩 상태 확인
  const isLoading = checkEmailMutation.isPending;

  return (
    <div className="flex flex-col space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
          회원가입
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-1.5">
          <Input
            id="email"
            type="email"
            placeholder="이메일"
            value={emailField.value}
            onChange={emailField.onChange}
            onBlur={emailField.onBlur}
            name={emailField.name}
            className="h-10 rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2 transition-colors focus:bg-white focus:shadow-sm"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-xs font-medium text-red-500">
              {errors.email.message}
            </p>
          )}
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
              checked={termsAgreedField.value}
              onCheckedChange={checked =>
                termsAgreedField.onChange(checked as boolean)
              }
              className="border-gray-300 text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:text-white"
            />
            <div className="flex flex-wrap items-center text-xs">
              <Label htmlFor="terms" className="font-medium text-gray-700">
                이용약관 동의
              </Label>
              <span className="ml-1 text-xs text-red-500">(필수)</span>
            </div>
          </div>
          {errors.termsAgreed && (
            <p className="text-xs font-medium text-red-500">
              {errors.termsAgreed.message}
            </p>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="privacy"
              checked={privacyAgreedField.value}
              onCheckedChange={checked =>
                privacyAgreedField.onChange(checked as boolean)
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
          {errors.privacyAgreed && (
            <p className="text-xs font-medium text-red-500">
              {errors.privacyAgreed.message}
            </p>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="marketing"
              checked={marketingAgreedField.value}
              onCheckedChange={checked =>
                marketingAgreedField.onChange(checked as boolean)
              }
              className="border-gray-300 text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:text-white"
            />
            <div className="flex flex-wrap items-center text-xs">
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
          className="w-full rounded-xl bg-green-600 font-medium text-white hover:bg-green-700 focus:ring-offset-0"
          disabled={isLoading}
        >
          {checkEmailMutation.isPending ? (
            <div className="flex items-center justify-center">
              <Spinner className="mr-2 h-4 w-4" />
              처리 중...
            </div>
          ) : (
            '이메일로 회원가입'
          )}
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

      {/* 소셜 로그인 */}
      <div className="space-y-3">
        <div className="flex justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-gray-200"
            onClick={handleGoogleSignUp}
            aria-label="Google로 회원가입"
          >
            <GoogleIcon className="h-5 w-5 text-gray-700" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-gray-200"
            onClick={handleAppleSignUp}
            aria-label="Apple로 회원가입"
          >
            <AppleIcon className="h-5 w-5 text-gray-700" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-gray-200 bg-[#03C75A] hover:bg-[#03C75A]/90"
            onClick={handleNaverSignUp}
            aria-label="네이버로 회원가입"
          >
            <NaverIcon className="h-5 w-5 text-white" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-gray-200 bg-[#FEE500] hover:bg-[#FEE500]/90"
            onClick={handleKakaoSignUp}
            aria-label="카카오로 회원가입"
          >
            <KakaoIcon className="h-5 w-5 text-[#3A1D1C]" />
          </Button>
        </div>
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
