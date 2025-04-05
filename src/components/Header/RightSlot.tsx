'use client';

import { useState } from 'react';

import { AuthDialog } from '../Auth/AuthDialog';
import { Button } from '../ui/button';

export function RightSlot() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setAuthDialogOpen(true)}
        className="h-9 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      >
        로그인
      </Button>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
}
