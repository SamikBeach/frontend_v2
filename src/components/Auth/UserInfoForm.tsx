import { signup } from '@/apis/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface UserInfoFormProps {
  email: string;
  onSuccess: () => void;
}

export function UserInfoForm({ email, onSuccess }: UserInfoFormProps) {
  // 상태 관리
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 사용자 이름 입력 핸들러
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError(null);
  };

  // 비밀번호 입력 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  // 비밀번호 확인 입력 핸들러
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setError(null);
  };

  // 비밀번호 표시/숨기기 토글
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // 비밀번호 확인 표시/숨기기 토글
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const signupMutation = useMutation({
    mutationFn: () =>
      signup({
        email,
        password,
        username,
        marketingConsent: false,
      }),
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message ||
          '회원가입에 실패했습니다. 다시 시도해주세요.'
      );
    },
  });

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 유효성 검사
    if (!username) {
      setError('사용자 이름을 입력해주세요.');
      return;
    }

    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    signupMutation.mutate();
  };

  return (
    <div className="flex flex-col space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
          회원 정보 입력
        </h2>
        <p className="text-xs text-gray-500">
          고전산책에서 사용할 정보를 입력해주세요
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="email" className="text-gray-600">
            이메일
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled
            className="h-10 rounded-xl border-gray-200 bg-gray-100 px-4 py-2 text-sm opacity-80"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="username" className="text-gray-600">
            사용자 이름
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="사용자 이름"
            value={username}
            onChange={handleUsernameChange}
            className="h-10 rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2 text-sm transition-colors focus:bg-white focus:shadow-sm"
            autoComplete="name"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-gray-600">
            비밀번호
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호 (8자 이상)"
              value={password}
              onChange={handlePasswordChange}
              className="h-10 rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2 pr-10 text-sm transition-colors focus:bg-white focus:shadow-sm"
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 aspect-square h-full rounded-xl text-gray-400 hover:text-gray-900"
              onClick={toggleShowPassword}
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

        <div className="space-y-1">
          <Label htmlFor="confirmPassword" className="text-gray-600">
            비밀번호 확인
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="h-10 rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2 pr-10 text-sm transition-colors focus:bg-white focus:shadow-sm"
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 aspect-square h-full rounded-xl text-gray-400 hover:text-gray-900"
              onClick={toggleShowConfirmPassword}
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
        </div>

        {error && <p className="text-xs font-medium text-red-500">{error}</p>}

        <Button
          type="submit"
          className="w-full rounded-xl bg-gray-900 font-medium text-white hover:bg-gray-800 focus:ring-offset-0"
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? <Spinner className="mr-2" /> : null}
          다음 단계로
        </Button>
      </form>
    </div>
  );
}
