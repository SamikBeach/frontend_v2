/**
 * Axios 인스턴스 및 인터셉터 설정
 *
 * 모든 API 요청에 대한 기본 설정과 인터셉터를 정의합니다.
 * - 요청 인터셉터: 헤더에 인증 토큰 추가
 * - 응답 인터셉터: 401 에러 발생 시 토큰 갱신 시도
 */

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// localStorage에서 토큰을 가져오는 헬퍼 함수
const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
};

// 토큰을 localStorage에 저장하는 헬퍼 함수
const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

// 토큰을 localStorage에서 제거하는 헬퍼 함수
const removeTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// axios 인스턴스 생성
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Version': 'v2',
  },
});

// 실패한 요청들의 대기열
interface QueueItem {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: InternalAxiosRequestConfig;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

// 대기열 처리 함수
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.config.headers['Authorization'] = `Bearer ${token}`;
      prom.resolve(api(prom.config));
    }
  });

  failedQueue = [];
};

// 요청 인터셉터 - 토큰이 있으면 헤더에 추가
api.interceptors.request.use(
  config => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 응답 인터셉터 - 401 에러 발생 시 토큰 갱신 시도
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 에러가 아니거나 이미 재시도한 요청이면 에러 반환
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (!originalRequest._retry && typeof window !== 'undefined') {
      originalRequest._retry = true;

      // 이미 토큰 갱신 진행 중이면 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        // 리프레시 토큰으로 새 토큰 발급 요청
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          processQueue(new Error('리프레시 토큰이 없습니다'));
          return Promise.reject(error);
        }

        const { data } = await axios.post(
          `${API_URL}/auth/refresh-token`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        // 새 토큰 저장
        setTokens(data.accessToken, data.refreshToken);

        // 대기 중인 요청 모두 처리
        processQueue(null, data.accessToken);

        // 원래 요청 재시도
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신에 실패하면 로그아웃 처리
        removeTokens();
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// API client 헬퍼 함수
export const authUtils = {
  getAccessToken,
  getRefreshToken,
  setTokens,
  removeTokens,
  isAuthenticated: () => !!getAccessToken(),
};

export default api;
