'use client';

import { FeedbackButton } from '@/components/Feedback';
import { AuthStatus } from './RightSlot/AuthStatus';

export function RightSlot() {
  return (
    <div className="flex items-center gap-2">
      <FeedbackButton />
      <AuthStatus />
    </div>
  );
}
