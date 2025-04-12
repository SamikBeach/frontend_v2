import { atom } from 'jotai';

export interface DialogState {
  type: 'book' | null;
  id: string | null;
}

export const dialogAtom = atom<DialogState | null>(null);
