'use client';

import { dialogAtom } from '@/atoms/dialog';
import { BookDialog } from '@/components/BookDialog';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [, setDialogState] = useAtom(dialogAtom);
  const { searchParams } = useQueryParams();

  useEffect(() => {
    const dialog = searchParams.get('dialog');
    const urlId = searchParams.get('id');

    if (dialog === 'book' && urlId) {
      setDialogState({ type: 'book', id: Number(urlId) });
    } else {
      setDialogState(null);
    }
  }, [searchParams, setDialogState]);

  return (
    <>
      {children}
      <BookDialog />
    </>
  );
}
