'use client';

import { logoutAtom, userAtom } from '@/atoms/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  ArrowLeft,
  Bell,
  Globe,
  Key,
  Lock,
  LogOut,
  Settings,
  User,
  UserCog,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProfileSettingsPage() {
  const user = useAtomValue(userAtom);
  const logout = useSetAtom(logoutAtom);
  const router = useRouter();

  // 사용자가 로그인하지 않았으면 홈으로 리다이렉트
  if (!user) {
    router.push('/');
    return null;
  }

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio || '');

  // 설정 탭 목록
  const settingTabs = [
    { id: 'profile', label: '프로필 정보', icon: User },
    { id: 'account', label: '계정 관리', icon: UserCog },
    { id: 'security', label: '보안', icon: Lock },
    { id: 'notifications', label: '알림', icon: Bell },
    { id: 'privacy', label: '개인정보 보호', icon: Key },
    { id: 'language', label: '언어 및 지역', icon: Globe },
  ];

  // 설정 저장 핸들러
  const handleSaveSettings = () => {
    // 실제 구현에서는 API 호출로 변경 사항을 저장
    alert('설정이 저장되었습니다.');
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="bg-gray-50 pb-16">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
            </Link>
            <h1 className="flex items-center text-2xl font-bold text-gray-900">
              <Settings className="mr-2 h-6 w-6 text-blue-600" />
              설정
            </h1>
          </div>
          <p className="mt-1 pl-14 text-sm text-gray-500">
            계정 정보와 개인 설정을 관리하세요.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-8">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* 사이드바 네비게이션 */}
          <div className="w-full md:w-56">
            <nav className="space-y-1">
              {settingTabs.map(tab => (
                <button
                  key={tab.id}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 ${
                    tab.id === 'profile'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
              <Separator className="my-4" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </button>
            </nav>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1 space-y-8">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold text-gray-900">
                프로필 정보
              </h2>

              <div className="space-y-6">
                {/* 프로필 이미지 */}
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
                  <Label className="text-sm font-medium text-gray-700">
                    프로필 이미지
                  </Label>
                  <div className="flex items-end gap-3">
                    <Avatar className="h-16 w-16 border border-gray-200 shadow-sm">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gray-100 text-gray-800">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                      >
                        변경
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs text-gray-500"
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 이름 */}
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700 sm:w-36"
                  >
                    이름
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="h-9 max-w-md border-gray-200 text-sm"
                  />
                </div>

                {/* 사용자명 */}
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
                  <Label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-700 sm:w-36"
                  >
                    사용자명
                  </Label>
                  <div className="max-w-md">
                    <Input
                      id="username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="h-9 border-gray-200 text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      URL에 표시되는 이름입니다: example.com/@{username}
                    </p>
                  </div>
                </div>

                {/* 이메일 */}
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 sm:w-36"
                  >
                    이메일
                  </Label>
                  <div className="max-w-md">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="h-9 border-gray-200 text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      이 이메일은 로그인 및 알림에 사용됩니다.
                    </p>
                  </div>
                </div>

                {/* 소개 */}
                <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
                  <Label
                    htmlFor="bio"
                    className="text-sm font-medium text-gray-700 sm:w-36"
                  >
                    소개
                  </Label>
                  <div className="max-w-md">
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={3}
                    ></textarea>
                    <p className="mt-1 text-xs text-gray-500">
                      간단한 자기소개를 200자 이내로 작성해주세요.
                    </p>
                  </div>
                </div>

                {/* 저장 버튼 */}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveSettings}
                    className="rounded-full bg-blue-600 hover:bg-blue-700"
                  >
                    변경사항 저장
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold text-gray-900">
                계정 연결
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ea4335]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Google
                      </h3>
                      <p className="text-xs text-gray-500">연결됨</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-full text-xs text-gray-500"
                  >
                    연결 해제
                  </Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Apple
                      </h3>
                      <p className="text-xs text-gray-500">연결되지 않음</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-full text-xs"
                  >
                    연결하기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
