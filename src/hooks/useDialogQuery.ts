'use client';

import { dialogAtom } from '@/atoms/dialog';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useAtom } from 'jotai';
import { useCallback } from 'react';

interface DialogQueryOptions {
  type: 'book';
}

export function useDialogQuery({ type }: DialogQueryOptions) {
  const [dialogState, setDialogState] = useAtom(dialogAtom);
  const { updateQueryParams } = useQueryParams();

  const isOpen = dialogState?.type === type && dialogState?.id !== null;

  const isbn = isOpen ? dialogState?.id : null;

  const open = useCallback(
    (isbn: string) => {
      setDialogState({ type, id: isbn });
      updateQueryParams({ dialog: type, isbn });
    },
    [type, setDialogState, updateQueryParams]
  );

  const close = useCallback(() => {
    setDialogState({ type: null, id: null });
    updateQueryParams({ dialog: undefined, isbn: undefined });
  }, [setDialogState, updateQueryParams]);

  return { isOpen, isbn, open, close };
}
