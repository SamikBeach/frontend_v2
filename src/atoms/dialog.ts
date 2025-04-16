import { atom } from 'jotai';

export interface DialogState {
  type: 'book' | null;
  id: string | null;
}

export const dialogAtom = atom<DialogState | null>(null);

// 로그인 다이얼로그 상태를 위한 atom
export const loginDialogOpenAtom = atom<boolean>(false);
