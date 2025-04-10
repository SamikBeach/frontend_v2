import { atomWithStorage } from 'jotai/utils';

export const sidebarExpandedAtom = atomWithStorage<boolean>(
  'sidebar-expanded',
  true
);
