import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LogOut } from 'lucide-react';

interface AccountSettingsProps {
  onLogout: () => void;
}

export default function AccountSettings({ onLogout }: AccountSettingsProps) {
  return (
    <div className="bg-white p-6">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">계정 관리</h2>

      <div className="mb-8">
        <h3 className="mb-4 text-base font-medium text-gray-900">
          연결된 계정
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4285F4]">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z"
                    fill="white"
                  />
                  <path
                    d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
                    fill="white"
                  />
                  <path
                    d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z"
                    fill="white"
                  />
                  <path
                    d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Google</h4>
                <p className="text-xs text-gray-500">연결됨</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-md border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
            >
              연결 해제
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2]">
                <svg
                  width="10"
                  height="18"
                  viewBox="0 0 10 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.5 0.25H7C5.80653 0.25 4.66193 0.724106 3.81802 1.56802C2.97411 2.41193 2.5 3.55653 2.5 4.75V7.25H0V10.25H2.5V16.25H5.5V10.25H8L8.5 7.25H5.5V4.75C5.5 4.48478 5.60536 4.23043 5.79289 4.04289C5.98043 3.85536 6.23478 3.75 6.5 3.75H9.5V0.25Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Facebook</h4>
                <p className="text-xs text-gray-500">연결되지 않음</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-md border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
            >
              연결하기
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="mb-8">
        <h3 className="mb-4 text-base font-medium text-gray-900">
          데이터 내보내기
        </h3>
        <p className="mb-4 text-sm text-gray-600">
          내 계정 데이터와 활동 내역을 내보낼 수 있습니다.
        </p>
        <Button
          variant="outline"
          className="h-9 rounded-md border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
        >
          데이터 내보내기
        </Button>
      </div>

      <Separator className="my-6" />

      <div>
        <h3 className="mb-4 text-base font-medium text-red-600">위험 영역</h3>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-gray-600">
              계정에서 로그아웃합니다. 다시 로그인하려면 자격 증명이 필요합니다.
            </p>
            <Button
              onClick={onLogout}
              variant="outline"
              className="h-10 w-max rounded-md border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Button>
          </div>

          <Separator />

          <div className="flex flex-col space-y-2">
            <p className="text-sm text-gray-600">
              계정을 비활성화하면 프로필이 숨겨지고 독서 활동이 중단됩니다.
              언제든지 다시 활성화할 수 있습니다.
            </p>
            <Button
              variant="outline"
              className="h-10 w-max rounded-md border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              계정 비활성화
            </Button>
          </div>

          <Separator />

          <div className="flex flex-col space-y-2">
            <p className="text-sm text-gray-600">
              계정을 삭제하면 모든 데이터가 영구적으로 제거됩니다. 이 작업은
              되돌릴 수 없습니다.
            </p>
            <Button
              variant="outline"
              className="h-10 w-max rounded-md border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              계정 삭제
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
