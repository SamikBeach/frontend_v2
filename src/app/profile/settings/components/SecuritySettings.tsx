import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

interface SecuritySettingsProps {
  onSave: () => void;
}

export default function SecuritySettings({ onSave }: SecuritySettingsProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  // Wrapper function to handle Switch change
  const handleSwitchChange = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    return (value: boolean) => setter(value);
  };

  return (
    <div className="bg-white p-6">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">보안 설정</h2>

      <div className="mb-8">
        <h3 className="mb-4 text-base font-medium text-gray-900">
          비밀번호 변경
        </h3>
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
            <Label
              htmlFor="current-password"
              className="text-sm font-medium text-gray-700 sm:w-36"
            >
              현재 비밀번호
            </Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="h-10 max-w-md rounded-md border-gray-200 text-sm"
              placeholder="현재 비밀번호 입력"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
            <Label
              htmlFor="new-password"
              className="text-sm font-medium text-gray-700 sm:w-36"
            >
              새 비밀번호
            </Label>
            <div className="w-full max-w-md">
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="h-10 rounded-md border-gray-200 text-sm"
                placeholder="새 비밀번호 입력"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                비밀번호는 최소 8자 이상이어야 하며, 문자, 숫자, 특수문자를
                포함해야 합니다.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
            <Label
              htmlFor="confirm-password"
              className="text-sm font-medium text-gray-700 sm:w-36"
            >
              비밀번호 확인
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="h-10 max-w-md rounded-md border-gray-200 text-sm"
              placeholder="새 비밀번호 확인"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button className="h-10 rounded-md bg-gray-900 px-5 hover:bg-gray-800">
              비밀번호 변경
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="mb-8">
        <h3 className="mb-4 text-base font-medium text-gray-900">2단계 인증</h3>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                2단계 인증 사용
              </h4>
              <p className="text-xs text-gray-500">
                로그인 시 추가 보안 코드를 입력해야 합니다.
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onValueChange={value => setTwoFactorEnabled(value)}
              className="data-[state=checked]:bg-gray-900"
            />
          </div>

          {twoFactorEnabled && (
            <div className="rounded-md bg-gray-50 p-4">
              <p className="text-sm text-gray-700">
                2단계 인증을 설정하려면 아래 버튼을 클릭하세요.
              </p>
              <Button
                variant="outline"
                className="mt-2 h-9 border-gray-300 text-sm"
              >
                2단계 인증 설정
              </Button>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      <div>
        <h3 className="mb-4 text-base font-medium text-gray-900">
          로그인 보안
        </h3>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">로그인 알림</h4>
              <p className="text-xs text-gray-500">
                새로운 기기에서 로그인할 때 이메일 알림을 받습니다.
              </p>
            </div>
            <Switch
              checked={loginNotifications}
              onValueChange={value => setLoginNotifications(value)}
              className="data-[state=checked]:bg-gray-900"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
            <Label
              htmlFor="session-timeout"
              className="text-sm font-medium text-gray-700"
            >
              세션 타임아웃
            </Label>
            <div className="flex w-full max-w-xs items-center gap-2">
              <select
                id="session-timeout"
                value={sessionTimeout}
                onChange={e => setSessionTimeout(e.target.value)}
                className="h-10 w-full cursor-pointer rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-gray-300 focus:ring-0 focus:outline-none"
              >
                <option value="15">15분</option>
                <option value="30">30분</option>
                <option value="60">1시간</option>
                <option value="120">2시간</option>
                <option value="240">4시간</option>
              </select>
              <span className="text-sm text-gray-500">후 자동 로그아웃</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button
          onClick={onSave}
          className="h-10 rounded-md bg-gray-900 px-5 hover:bg-gray-800"
        >
          변경사항 저장
        </Button>
      </div>
    </div>
  );
}
