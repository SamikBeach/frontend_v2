import { login as loginApi } from '@/apis/auth';
import { AuthProvider } from '@/apis/auth/types';
import { authUtils } from '@/apis/axios';
import { userAtom } from '@/atoms/user';
import { openSocialLoginPopup } from '@/utils/oauth';
import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { AppleIcon, GoogleIcon, KakaoIcon, NaverIcon } from './icons';

interface LoginFormProps {
  onClickSignUp: () => void;
  onClickResetPassword: () => void;
  onSuccess?: () => void;
}

interface FormData {
  email: string;
  password: string;
}

export function LoginForm({
  onClickSignUp,
  onClickResetPassword,
  onSuccess,
}: LoginFormProps) {
  const setUser = useSetAtom(userAtom);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    clearErrors,
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit', // 폼이 제출될 때만 유효성 검사 실행
  });

  // 이메일 필드 컨트롤러
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

  // 비밀번호 필드 컨트롤러
  const { field: passwordField } = useController({
    name: 'password',
    control,
    rules: {
      required: '비밀번호를 입력해주세요',
    },
  });

  // 로그인 mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: FormData) => {
      return loginApi({ email, password });
    },
    onSuccess: response => {
      setUser(response.user);
      authUtils.setTokens(response.accessToken, response.refreshToken);
      toast.success(`${response.user.username}님, 환영합니다!`);
      onSuccess?.(); // 로그인 성공 콜백
    },
    onError: () => {
      setFormError('root', {
        type: 'manual',
        message: '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.',
      });
    },
  });

  // 폼 제출 핸들러
  const onSubmit = (data: FormData) => {
    clearErrors();
    loginMutation.mutate(data);
  };

  // 구글 로그인 핸들러
  const handleGoogleLogin = async () => {
    clearErrors();

    try {
      const { accessToken, refreshToken, user } = await openSocialLoginPopup(
        AuthProvider.GOOGLE
      );

      // 토큰 및 사용자 정보 저장
      authUtils.setTokens(accessToken, refreshToken);
      setUser(user);

      // 성공 토스트 메시지
      toast.success(`${user.username}님, 환영합니다!`);

      // 성공 콜백
      onSuccess?.();
    } catch (err) {
      console.error('구글 로그인 오류:', err);
      setFormError('root', {
        type: 'manual',
        message:
          err instanceof Error ? err.message : '구글 로그인에 실패했습니다.',
      });
    }
  };

  // 애플 로그인 핸들러
  const handleAppleLogin = async () => {
    clearErrors();

    try {
      const { accessToken, refreshToken, user } = await openSocialLoginPopup(
        AuthProvider.APPLE
      );

      // 토큰 및 사용자 정보 저장
      authUtils.setTokens(accessToken, refreshToken);
      setUser(user);

      // 성공 토스트 메시지
      toast.success(`${user.username}님, 환영합니다!`);

      // 성공 콜백
      onSuccess?.();
    } catch (err) {
      console.error('애플 로그인 오류:', err);
      setFormError('root', {
        type: 'manual',
        message:
          err instanceof Error ? err.message : '애플 로그인에 실패했습니다.',
      });
    }
  };

  // 네이버 로그인 핸들러
  const handleNaverLogin = async () => {
    clearErrors();

    try {
      const { accessToken, refreshToken, user } = await openSocialLoginPopup(
        AuthProvider.NAVER
      );

      // 토큰 및 사용자 정보 저장
      authUtils.setTokens(accessToken, refreshToken);
      setUser(user);

      // 성공 토스트 메시지
      toast.success(`${user.username}님, 환영합니다!`);

      // 성공 콜백
      onSuccess?.();
    } catch (err) {
      console.error('네이버 로그인 오류:', err);
      setFormError('root', {
        type: 'manual',
        message:
          err instanceof Error ? err.message : '네이버 로그인에 실패했습니다.',
      });
    }
  };

  // 카카오 로그인 핸들러 (UI만 구현)
  const handleKakaoLogin = () => {
    toast.info('카카오 로그인은 아직 구현되지 않았습니다.');
  };

  return (
    <div className="flex flex-col space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
          로그인
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-1.5">
          <Input
            id="email"
            type="email"
            placeholder="이메일"
            {...emailField}
            className="h-10 rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2 transition-colors focus:bg-white focus:shadow-sm"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-xs font-medium text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호"
              {...passwordField}
              className="h-10 rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2 pr-10 transition-colors focus:bg-white focus:shadow-sm"
              autoComplete="current-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 aspect-square h-full rounded-xl text-gray-400 hover:text-gray-900"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
              </span>
            </Button>
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="text-end">
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs font-medium text-gray-500 hover:text-gray-900"
            onClick={onClickResetPassword}
          >
            비밀번호를 잊으셨나요?
          </Button>
        </div>

        {errors.root && (
          <p className="text-xs font-medium text-red-500">
            {errors.root.message}
          </p>
        )}

        <Button
          type="submit"
          className="w-full rounded-xl bg-green-600 font-medium text-white hover:bg-green-700 focus:ring-offset-0"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <div className="flex items-center justify-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span className="ml-2">로그인</span>
            </div>
          ) : (
            '로그인'
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

      {/* 소셜 로그인 영역 */}
      <div className="space-y-3">
        <div className="flex justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-gray-200"
            onClick={handleGoogleLogin}
            aria-label="Google로 로그인"
          >
            <GoogleIcon className="h-5 w-5 text-gray-700" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-gray-200"
            onClick={handleAppleLogin}
            aria-label="Apple로 로그인"
          >
            <AppleIcon className="h-5 w-5 text-gray-700" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-gray-200 bg-[#03C75A] hover:bg-[#03C75A]/90"
            onClick={handleNaverLogin}
            aria-label="네이버로 로그인"
          >
            <NaverIcon className="h-5 w-5 text-white" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-gray-200 bg-[#FEE500] hover:bg-[#FEE500]/90"
            onClick={handleKakaoLogin}
            aria-label="카카오로 로그인"
          >
            <KakaoIcon className="h-5 w-5 text-[#3A1D1C]" />
          </Button>
        </div>
      </div>

      <div className="text-center text-xs">
        <span className="text-gray-500">계정이 없으신가요?</span>{' '}
        <Button
          variant="link"
          className="h-auto p-0 text-xs font-medium text-gray-700 hover:text-gray-900"
          onClick={onClickSignUp}
        >
          회원가입
        </Button>
      </div>
    </div>
  );
}
