import { User } from '@/apis/user/types';
import { atom } from 'jotai';

// 사용자 정보만 저장하는 atom
export const userAtom = atom<User | null>(null);
