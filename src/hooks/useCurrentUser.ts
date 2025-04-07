'use client';

import { User } from '@/apis/types/auth';
import { userAtom } from '@/atoms/user';
import { useAtomValue } from 'jotai';

/**
 * 현재 로그인한 사용자 정보를 반환하는 훅
 * @returns 현재 사용자 정보 (로그인하지 않은 경우 null)
 */
export function useCurrentUser(): User | null {
  const user = useAtomValue(userAtom);
  return user;
}
