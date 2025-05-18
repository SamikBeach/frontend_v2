'use client';

import { dialogAtom } from '@/atoms/dialog';
import { BookDialog } from '@/components/BookDialog';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useAtom } from 'jotai';
import { Suspense, useEffect } from 'react';

function DialogProviderInner({ children }: { children: React.ReactNode }) {
  const [, setDialogState] = useAtom(dialogAtom);
  const { searchParams } = useQueryParams();

  useEffect(() => {
    const dialog = searchParams.get('dialog');
    const isbn = searchParams.get('isbn');
    const id = searchParams.get('id');

    if (dialog === 'book') {
      // isbn이 있으면 isbn을 우선적으로 사용하고, 없으면 id 사용
      if (isbn) {
        setDialogState({ type: 'book', id: isbn });
      } else if (id) {
        setDialogState({ type: 'book', id });
      }
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

export function DialogProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <DialogProviderInner>{children}</DialogProviderInner>
    </Suspense>
  );
}
