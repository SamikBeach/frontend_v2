'use client';

import { authUtils } from '@/apis/axios';
import { User } from '@/apis/types/auth';
import { getCurrentUser } from '@/apis/user';
import { useEffect, useState } from 'react';

/**
 * 소셜 로그인 콜백 처리 페이지
 * 백엔드에서 리다이렉트한 후 토큰을 추출하여 부모 창으로 전달합니다.
 */
export default function SocialCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // URL 쿼리 파라미터에서 토큰 추출
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('token');
        const refreshToken = urlParams.get('refreshToken');

        if (!accessToken || !refreshToken) {
          throw new Error('인증 정보가 제공되지 않았습니다.');
        }

        // 사용자 정보 가져오기
        let user: User | null = null;
        const userEncoded = urlParams.get('user');

        if (userEncoded) {
          try {
            // URL에 사용자 정보가 포함된 경우 디코딩
            user = JSON.parse(decodeURIComponent(userEncoded));
          } catch (decodeError) {
            console.error('사용자 정보 디코딩 오류:', decodeError);
            // 디코딩 실패 시 API로 가져오기 시도
            authUtils.setTokens(accessToken, refreshToken);
            const userResponse = await getCurrentUser();
            user = userResponse;
            authUtils.removeTokens();
          }
        } else {
          // 사용자 정보가 없는 경우 API로 가져오기
          authUtils.setTokens(accessToken, refreshToken);
          const userResponse = await getCurrentUser();
          user = userResponse;
          authUtils.removeTokens();
        }

        if (!user) {
          throw new Error('사용자 정보를 가져올 수 없습니다.');
        }

        // 부모 창으로 성공 메시지 전달
        window.opener.postMessage(
          {
            type: 'social-login-success',
            data: {
              accessToken,
              refreshToken,
              user,
            },
          },
          window.location.origin
        );

        setStatus('success');

        // 3초 후 창 닫기
        setTimeout(() => {
          window.close();
        }, 1000);
      } catch (error) {
        console.error('소셜 로그인 콜백 처리 오류:', error);

        // 부모 창으로 오류 메시지 전달
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'social-login-error',
              data: {
                message:
                  error instanceof Error
                    ? error.message
                    : '알 수 없는 오류가 발생했습니다.',
              },
            },
            window.location.origin
          );
        }

        setError(
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.'
        );
        setStatus('error');

        // 3초 후 창 닫기
        setTimeout(() => {
          window.close();
        }, 3000);
      }
    };

    processCallback();
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white">
      {status === 'loading' && (
        <>
          <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">로그인 처리 중...</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            로그인 성공!
          </h2>
          <p className="mt-1 text-gray-600">창이 자동으로 닫힙니다.</p>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            로그인 실패
          </h2>
          <p className="mt-1 text-center text-gray-600">
            {error || '알 수 없는 오류가 발생했습니다.'}
          </p>
          <button
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
            onClick={() => window.close()}
          >
            창 닫기
          </button>
        </>
      )}
    </div>
  );
}
