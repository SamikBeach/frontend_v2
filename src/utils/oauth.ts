import { AuthProvider } from '@/apis/auth/types';

/**
 * 소셜 로그인을 위한 팝업 위치 계산
 */
export const calculatePopupPosition = (width: number, height: number) => {
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  return { left, top };
};

/**
 * 현재 환경에 맞는 서버 URL을 반환
 */
export const getServerUrl = (): string => {
  // 브라우저 환경인 경우
  if (typeof window !== 'undefined') {
    // 현재 hostname 확인
    const { hostname } = window.location;

    // 개발 환경이 아닌 경우 현재 도메인 기반 API URL 반환
    if (!hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
      // 프로덕션/스테이징 환경에서는 동일한 도메인 사용
      const protocol = window.location.protocol;
      return `${protocol}//${hostname}/api/v2`;
    }
  }

  // 개발 환경이거나 SSR인 경우 환경 변수 사용
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001/api/v2';
};

/**
 * 소셜 로그인 팝업을 열고 결과를 Promise로 반환
 */
export const openSocialLoginPopup = (
  provider: AuthProvider.GOOGLE | AuthProvider.APPLE
): Promise<{
  accessToken: string;
  refreshToken: string;
  user: any;
}> => {
  return new Promise((resolve, reject) => {
    // 로그인 방식에 따른 URL 설정
    const providerPath = provider === AuthProvider.GOOGLE ? 'google' : 'apple';
    const serverUrl = getServerUrl();
    const authUrl = `${serverUrl}/auth/${providerPath}`;

    // 팝업 설정
    const width = 600;
    const height = 800;
    const { left, top } = calculatePopupPosition(width, height);

    // 팝업 열기
    const popup = window.open(
      authUrl,
      `${providerPath}-oauth`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
    );

    // 팝업이 차단된 경우
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      reject(new Error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.'));
      return;
    }

    // 메시지 이벤트 리스너 설정
    const handleMessage = (event: MessageEvent) => {
      try {
        const { type, data } = event.data;

        if (type === 'social-login-success' && data) {
          window.removeEventListener('message', handleMessage);
          resolve(data);
        } else if (type === 'social-login-error') {
          window.removeEventListener('message', handleMessage);
          reject(new Error(data?.message || '소셜 로그인에 실패했습니다.'));
        }
      } catch (err) {
        console.error('소셜 로그인 메시지 처리 오류:', err);
        reject(new Error('소셜 로그인 처리 중 오류가 발생했습니다.'));
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('message', handleMessage);

    // 팝업 닫힘 감지
    const checkPopupClosed = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopupClosed);
        window.removeEventListener('message', handleMessage);
        reject(
          new Error(
            `${provider === AuthProvider.GOOGLE ? '구글' : '애플'} 로그인이 완료되지 않았습니다.`
          )
        );
      }
    }, 500);
  });
};
