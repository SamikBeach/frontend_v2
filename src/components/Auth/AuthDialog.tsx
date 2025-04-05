import { X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '../Logo';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { LoginForm } from './LoginForm';
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
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
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

  // 이메일 인증 완료 핸들러
  const handleEmailVerified = (verifiedEmail: string) => {
    setEmail(verifiedEmail);
    setMode('userInfo');
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

  return (
    <Dialog
      {...props}
      onOpenChange={open => {
        // 다이얼로그가 닫힐 때 상태 초기화
        if (!open) {
          setTimeout(() => setMode(initialMode), 200);
        }
        props.onOpenChange?.(open);
      }}
    >
      <DialogContent
        className="absolute top-1/2 left-1/2 w-[400px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border-0 p-0 shadow-xl"
        onPointerDownOutside={handlePointerDownOutside}
      >
        {/* 헤더 - 로고만 남기고 타이틀 제거 */}
        <DialogHeader className="relative flex h-14 items-center justify-center border-b border-gray-100 px-6">
          <DialogTitle className="sr-only">로그인 / 회원가입</DialogTitle>
          <Logo className="absolute left-6" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-3 h-8 w-8 -translate-y-1/2 rounded-full text-gray-400 hover:text-gray-900"
            onClick={() => props.onOpenChange?.(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">닫기</span>
          </Button>
        </DialogHeader>

        {/* 폼 컨테이너 */}
        <div className="max-h-[80vh] overflow-y-auto px-7 py-6">
          {/* 로그인 폼 */}
          {mode === 'login' && (
            <LoginForm
              onClickSignUp={() => setMode('signup')}
              onClickResetPassword={() => setMode('resetPassword')}
              onSuccess={handleLoginSuccess}
            />
          )}

          {/* 회원가입 폼 (이메일 입력) */}
          {mode === 'signup' && (
            <SignUpForm
              onClickLogin={() => setMode('login')}
              onEmailVerified={handleEmailVerified}
              onSuccess={handleSignUpSuccess}
            />
          )}

          {/* 회원가입 폼 (사용자 정보 입력) */}
          {mode === 'userInfo' && (
            <UserInfoForm
              email={email}
              onSuccess={() => setMode('verifyCode')}
            />
          )}

          {/* 인증 코드 확인 */}
          {mode === 'verifyCode' && (
            <VerifyCodeForm email={email} onSuccess={handleSignUpSuccess} />
          )}

          {/* 비밀번호 재설정 */}
          {mode === 'resetPassword' && (
            <ResetPasswordForm
              onClickLogin={() => setMode('login')}
              onSuccess={() => {
                setMode('login');
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 트리거 컴포넌트 익스포트
AuthDialog.Trigger = DialogTrigger;
