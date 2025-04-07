import { User } from '@/apis/types/auth';
import { atom } from 'jotai';

// 사용자 정보만 저장하는 atom
export const userAtom = atom<User | null>(null);
