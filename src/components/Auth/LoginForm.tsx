import { login as loginApi } from '@/apis/auth';
import { authUtils } from '@/apis/axios';
import { AuthProvider } from '@/apis/types/auth';
import { userAtom } from '@/atoms/user';
import { openSocialLoginPopup } from '@/utils/oauth';
import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { AppleIcon } from './icons/AppleIcon';
import { GoogleIcon } from './icons/GoogleIcon';

interface LoginFormProps {
  onClickSignUp: () => void;
  onClickResetPassword: () => void;
  onSuccess?: () => void;
}

export function LoginForm({
  onClickSignUp,
  onClickResetPassword,
  onSuccess,
}: LoginFormProps) {
  const setUser = useSetAtom(userAtom);

  // 로그인 mutation
  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return loginApi({ email, password });
    },
    onSuccess: response => {
      setUser(response.user);
      authUtils.setTokens(response.accessToken, response.refreshToken);
    },
  });

  // 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 이메일 인풋 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  // 비밀번호 인풋 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
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

    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: () => {
          setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        },
      }
    );
  };

  // 구글 로그인 핸들러
  const handleGoogleLogin = async () => {
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
      console.error('구글 로그인 오류:', err);
      setError(
        err instanceof Error ? err.message : '구글 로그인에 실패했습니다.'
      );
    }
  };

  // 애플 로그인 핸들러
  const handleAppleLogin = async () => {
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
      console.error('애플 로그인 오류:', err);
      setError(
        err instanceof Error ? err.message : '애플 로그인에 실패했습니다.'
      );
    }
  };

  return (
    <div className="flex flex-col space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
          로그인
        </h2>
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

        <div className="space-y-1.5">
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
              className="h-10 rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2 pr-10 text-sm transition-colors focus:bg-white focus:shadow-sm"
              autoComplete="current-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 aspect-square h-full rounded-xl text-gray-400 hover:text-gray-900"
              onClick={() => setShowPassword(!showPassword)}
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

        {error && <p className="text-xs font-medium text-red-500">{error}</p>}

        <Button
          type="submit"
          className="w-full rounded-xl bg-gray-900 font-medium text-white hover:bg-gray-800 focus:ring-offset-0"
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

      <div className="space-y-2.5">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center rounded-xl border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50/80 hover:text-gray-900"
          onClick={handleGoogleLogin}
        >
          <GoogleIcon className="mr-2 h-4 w-4" />
          Google로 로그인
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-center rounded-xl border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50/80 hover:text-gray-900"
          onClick={handleAppleLogin}
        >
          <AppleIcon className="mr-2 h-4 w-4" />
          Apple로 로그인
        </Button>
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
