import { cn } from '@/lib/utils';
import { Globe, Lock, LogOut, Shield, User, UserCog } from 'lucide-react';

// 설정 탭 인터페이스 정의
export interface SettingTab {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface SettingsSidebarProps {
  activeTab: string;
  handleTabChange: (tabId: string) => void;
  onLogout: () => void;
}

export const settingTabs: SettingTab[] = [
  {
    id: 'profile',
    label: '프로필 정보',
    icon: User,
  },
  {
    id: 'account',
    label: '계정 관리',
    icon: UserCog,
  },
  {
    id: 'security',
    label: '보안',
    icon: Lock,
  },
  {
    id: 'privacy',
    label: '개인정보 보호',
    icon: Shield,
  },
  {
    id: 'language',
    label: '언어 및 지역',
    icon: Globe,
  },
];

export default function SettingsSidebar({
  activeTab,
  handleTabChange,
  onLogout,
}: SettingsSidebarProps) {
  return (
    <aside className="w-64 shrink-0 bg-white">
      <div className="sticky top-0 h-[calc(100vh-56px)] overflow-y-auto py-4">
        <div className="px-3">
          <ul className="space-y-1">
            {settingTabs.map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors',
                    activeTab === tab.id
                      ? 'bg-gray-100 font-medium text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <tab.icon
                    className={cn(
                      'h-5 w-5',
                      activeTab === tab.id ? 'text-gray-900' : 'text-gray-500'
                    )}
                  />
                  {tab.label}
                </button>
              </li>
            ))}

            {/* Add separator and logout button as part of the menu */}
            <li className="mt-4 border-t border-gray-100 pt-4">
              <button
                onClick={onLogout}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
