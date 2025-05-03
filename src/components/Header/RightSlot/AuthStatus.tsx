'use client';

import { useCurrentUser } from '@/hooks';
import { LoginButton } from './LoginButton';
import { NotificationDropdown } from './Notification';
import { UserDropdown } from './UserDropdown';

export function AuthStatus() {
  const user = useCurrentUser();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <NotificationDropdown />
        <UserDropdown user={user} />
      </div>
    );
  }

  return <LoginButton />;
}
