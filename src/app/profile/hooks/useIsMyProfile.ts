import { useCurrentUser } from '@/hooks';
import { usePathname } from 'next/navigation';

/**
 * 현재 보고 있는 프로필이 자신의 프로필인지 확인하는 훅
 * @returns boolean - 자신의 프로필인 경우 true, 아닌 경우 false
 */
export function useIsMyProfile(): boolean {
  const currentUser = useCurrentUser();
  const pathname = usePathname();

  // /profile/123 형식의 경로에서 ID 추출
  const match = pathname.match(/^\/profile\/(\d+)$/);
  const profileId = match ? match[1] : null;

  // 로그인한 사용자가 없거나 프로필 ID가 없는 경우 false 반환
  if (!currentUser || !profileId) {
    return false;
  }

  // 현재 사용자 ID와 프로필 ID 비교
  return currentUser.id.toString() === profileId;
}
