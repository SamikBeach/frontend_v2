import { atom } from 'jotai';

// 사용자 프로필 타입 정의
export interface UserProfile {
  id: number;
  name: string;
  username: string;
  avatar: string;
  email: string;
  bio?: string;
  joinedAt: string;
  bookCount?: number;
  reviewCount?: number;
  followers?: number;
  following?: number;
}

// 예시 사용자 데이터
const DEMO_USER: UserProfile = {
  id: 1,
  name: '김독서',
  username: 'reader',
  avatar: 'https://i.pravatar.cc/150?u=user1',
  email: 'reader@example.com',
  bio: '고전 문학을 좋아하는 독서가입니다. 플라톤부터 도스토예프스키까지 다양한 작품을 읽고 있습니다.',
  joinedAt: '2023-07-15',
  bookCount: 42,
  reviewCount: 18,
  followers: 128,
  following: 64,
};

// 로그인 상태를 추적하는 atom
export const userAtom = atom<UserProfile | null>(null);

// 로딩 상태를 추적하는 atom
export const isLoadingAtom = atom<boolean>(false);

// 로그인 함수를 제공하는 atom
export const loginAtom = atom(
  null,
  async (
    get,
    set,
    { email, password }: { email: string; password: string }
  ) => {
    set(isLoadingAtom, true);
    try {
      // 실제 구현에서는 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 1000));
      set(userAtom, DEMO_USER);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      set(isLoadingAtom, false);
    }
  }
);

// 소셜 로그인 함수를 제공하는 atom
export const socialLoginAtom = atom(
  null,
  async (get, set, provider: 'google' | 'apple') => {
    set(isLoadingAtom, true);

    try {
      // 실제 구현에서는 소셜 로그인 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 1000));
      set(userAtom, DEMO_USER);
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      throw error;
    } finally {
      set(isLoadingAtom, false);
    }
  }
);

// 로그아웃 함수를 제공하는 atom
export const logoutAtom = atom(null, (get, set) => {
  set(userAtom, null);
});
