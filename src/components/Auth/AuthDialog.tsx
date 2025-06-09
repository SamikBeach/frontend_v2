'use client';

import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog';
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { PrivacyDialog } from './PolicyDialogs/PrivacyDialog';
import { TermsDialog } from './PolicyDialogs/TermsDialog';
import { ResetPasswordForm } from './ResetPasswordForm';
import { SignUpForm } from './SignUpForm';
import { UserInfoForm } from './UserInfoForm';
import { VerifyCodeForm } from './VerifyCodeForm';

// 인증 모드 타입
export type AuthMode =
  | 'login' // 로그인
  | 'signup' // 회원가입 (이메일 입력)
  | 'userInfo' // 회원가입 (사용자 정보 입력)
  | 'verifyCode' // 인증 코드 확인
  | 'resetPassword'; // 비밀번호 재설정

interface AuthDialogProps
  extends React.ComponentPropsWithoutRef<typeof ResponsiveDialog> {
  initialMode?: AuthMode;
}

export function AuthDialog({
  initialMode = 'login',
  ...props
}: AuthDialogProps) {
  // 현재 인증 모드 상태
  const [mode, setMode] = useState<AuthMode>(initialMode);
  // 회원가입 이메일 저장
  const [email, setEmail] = useState<string>('');
  // 이전 모드 저장용 히스토리
  const [modeHistory, setModeHistory] = useState<AuthMode[]>([]);

  // 다이얼로그 외부 클릭 처리 (일부 모드에서는 닫기 방지)
  const handlePointerDownOutside = (e: Event) => {
    if (
      mode === 'userInfo' ||
      mode === 'verifyCode' ||
      mode === 'resetPassword'
    ) {
      e.preventDefault();
    }
  };

  // 모드 변경 함수 (히스토리 추적)
  const changeMode = (newMode: AuthMode) => {
    setModeHistory(prev => [...prev, mode]);
    setMode(newMode);
  };

  // 뒤로가기 함수
  const goBack = () => {
    if (modeHistory.length > 0) {
      const prevMode = modeHistory[modeHistory.length - 1];
      setMode(prevMode);
      setModeHistory(prev => prev.slice(0, -1));
    }
  };

  // 이메일 인증 완료 핸들러
  const handleEmailVerified = (verifiedEmail: string) => {
    setEmail(verifiedEmail);
    changeMode('userInfo');
  };

  // 사용자 정보 입력 완료 핸들러
  const handleUserInfoCompleted = () => {
    changeMode('verifyCode');
  };

  // 회원가입 완료 핸들러
  const handleSignUpSuccess = () => {
    // 바로 다이얼로그 닫기
    props.onOpenChange?.(false);
  };

  // 로그인 성공 핸들러
  const handleLoginSuccess = () => {
    // 바로 다이얼로그 닫기
    props.onOpenChange?.(false);
  };

  // 비밀번호 재설정 성공 핸들러
  const handleResetPasswordSuccess = () => {
    changeMode('login');
  };

  // 현재 모드가 로그인이 아닌지 확인
  const showBackButton = mode !== 'login';

  return (
    <ResponsiveDialog
      {...props}
      onOpenChange={open => {
        // 다이얼로그가 닫힐 때 상태 초기화
        if (!open) {
          setTimeout(() => {
            setMode(initialMode);
            setEmail('');
            setModeHistory([]);
          }, 200);
        }
        props.onOpenChange?.(open);
      }}
      shouldScaleBackground={false}
    >
      <ResponsiveDialogContent
        className="w-[400px] max-w-[90vw] overflow-hidden rounded-2xl border-0 p-0 shadow-xl"
        drawerClassName="w-full max-w-none overflow-hidden rounded-t-[16px] border-0 p-0 shadow-xl"
        onPointerDownOutside={handlePointerDownOutside}
        aria-describedby={undefined}
      >
        {/* 헤더 - 로고와 뒤로가기 버튼 */}
        <ResponsiveDialogHeader
          className="relative flex h-14 items-center border-b border-gray-100 px-6"
          drawerClassName="relative flex h-14 items-center border-b border-gray-100 px-6"
          onClose={() => {
            // 비밀번호 재설정 모드에서는 로그인 모드로 돌아가고, 다른 경우에는 다이얼로그 닫기
            if (mode === 'resetPassword') {
              changeMode('login');
            } else {
              props.onOpenChange?.(false);
            }
          }}
        >
          <ResponsiveDialogTitle className="sr-only" drawerClassName="sr-only">
            로그인 / 회원가입
          </ResponsiveDialogTitle>
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={goBack}
              className="relative z-10 h-8 w-8 rounded-full p-0"
              aria-label="뒤로 가기"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 19L8 12L15 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          )}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Logo />
          </div>
        </ResponsiveDialogHeader>

        {/* 폼 컨테이너 */}
        <div className="pb-safe max-h-[80vh] flex-1 overflow-y-auto px-7 py-6 md:flex-none">
          {/* 로그인 폼 */}
          {mode === 'login' && (
            <LoginForm
              onClickSignUp={() => changeMode('signup')}
              onClickResetPassword={() => changeMode('resetPassword')}
              onSuccess={handleLoginSuccess}
            />
          )}

          {/* 회원가입 폼 (이메일 입력) */}
          {mode === 'signup' && (
            <SignUpForm
              onClickLogin={() => changeMode('login')}
              onEmailVerified={handleEmailVerified}
              onSuccess={handleSignUpSuccess}
            />
          )}

          {/* 회원가입 폼 (사용자 정보 입력) */}
          {mode === 'userInfo' && (
            <UserInfoForm email={email} onSuccess={handleUserInfoCompleted} />
          )}

          {/* 인증 코드 확인 */}
          {mode === 'verifyCode' && (
            <VerifyCodeForm
              email={email}
              onSuccess={handleSignUpSuccess}
              onClose={() => changeMode('login')}
            />
          )}

          {/* 비밀번호 재설정 */}
          {mode === 'resetPassword' && (
            <ResetPasswordForm
              onSuccess={handleResetPasswordSuccess}
              onClose={() => changeMode('login')}
            />
          )}
        </div>

        {/* 약관 및 개인정보처리방침 링크 */}
        <div className="border-t border-gray-100 px-7 py-3 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <TermsDialog
              trigger={
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  이용약관
                </Button>
              }
            />
            <PrivacyDialog
              trigger={
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  개인정보 처리방침
                </Button>
              }
            />
          </div>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

// 트리거 컴포넌트 익스포트
AuthDialog.Trigger = ResponsiveDialogTrigger;
