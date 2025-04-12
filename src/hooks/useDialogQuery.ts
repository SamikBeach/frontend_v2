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

  const id = isOpen ? dialogState?.id : null;

  const open = useCallback(
    (id: number) => {
      setDialogState({ type, id });
      updateQueryParams({ dialog: type, id: id.toString() });
    },
    [type, setDialogState, updateQueryParams]
  );

  const close = useCallback(() => {
    setDialogState({ type: null, id: null });
    updateQueryParams({ dialog: undefined, id: undefined });
  }, [setDialogState, updateQueryParams]);

  return { isOpen, id, open, close };
}
