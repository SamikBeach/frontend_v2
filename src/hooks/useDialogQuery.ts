'use client';

import { dialogAtom } from '@/atoms/dialog';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useAtom } from 'jotai';
import { useCallback } from 'react';

interface DialogQueryOptions {
  type: 'book';
  idType?: 'isbn' | 'id';
}

export function useDialogQuery({ type, idType = 'isbn' }: DialogQueryOptions) {
  const [dialogState, setDialogState] = useAtom(dialogAtom);
  const { updateQueryParams } = useQueryParams();

  const isOpen = dialogState?.type === type && dialogState?.id !== null;

  const id = isOpen ? dialogState?.id : null;

  const open = useCallback(
    (value: string) => {
      setDialogState({ type, id: value });

      // URL 쿼리 파라미터 업데이트
      if (idType === 'isbn') {
        updateQueryParams({ dialog: type, isbn: value });
      } else {
        updateQueryParams({ dialog: type, id: value });
      }
    },
    [type, idType, setDialogState, updateQueryParams]
  );

  const close = useCallback(() => {
    setDialogState({ type: null, id: null });

    // idType에 따라 삭제할 파라미터 결정
    if (idType === 'isbn') {
      updateQueryParams({ dialog: undefined, isbn: undefined });
    } else {
      updateQueryParams({ dialog: undefined, id: undefined });
    }
  }, [idType, setDialogState, updateQueryParams]);

  return { isOpen, id, open, close };
}
