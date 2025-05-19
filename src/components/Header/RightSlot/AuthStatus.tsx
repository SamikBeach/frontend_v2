'use client';

import { Notification } from './Notification';
import { UserDropdown } from './UserDropdown';

export function AuthStatus() {
  return (
    <div className="flex items-center gap-4">
      <Notification />
      <UserDropdown />
    </div>
  );
}
