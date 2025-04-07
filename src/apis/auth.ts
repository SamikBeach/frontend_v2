import api from './axios';
import {
  CheckEmailResponse,
  CompleteRegistrationRequest,
  CompleteRegistrationResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  RequestPasswordResetRequest,
  RequestPasswordResetResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SignupRequest,
  SignupResponse,
  SocialLoginRequest,
  SocialLoginResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  VerifyResetTokenRequest,
  VerifyResetTokenResponse,
} from './types/auth';

/**
 * 사용자 로그인 API
 * @param data 로그인 요청 데이터
 * @returns 로그인 응답 (토큰 및 사용자 정보)
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

/**
 * 리프레시 토큰으로 액세스 토큰 갱신 API
 * @param data 리프레시 토큰 요청 데이터
 * @returns 새로운 액세스 토큰 및 리프레시 토큰
 */
export const refreshToken = async (
  data: RefreshTokenRequest
): Promise<RefreshTokenResponse> => {
  const response = await api.post('/auth/refresh-token', data);
  return response.data;
};

/**
 * 로그아웃 API
 * @returns 로그아웃 성공 메시지
 */
export const logout = async (): Promise<{ message: string }> => {
  const response = await api.post('/auth/logout');
  return response.data;
};

/**
 * 이메일 중복 확인 및 유효성 검사 API (회원가입 1단계)
 * @param email 확인할 이메일 주소
 * @returns 이메일 사용 가능 여부 및 메시지
 */
export const checkEmail = async (
  email: string
): Promise<CheckEmailResponse> => {
  const response = await api.post('/auth/check-email', { email });
  return response.data;
};

/**
 * 회원가입 정보 입력 및 인증 코드 발송 API (회원가입 2단계)
 * @param data 회원가입 요청 데이터
 * @returns 인증 코드 발송 결과
 */
export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

/**
 * 인증 코드 확인 및 회원가입 완료 API (회원가입 3단계)
 * @param data 인증 코드 확인 요청 데이터
 * @returns 회원가입 완료 결과 (토큰 및 사용자 정보)
 */
export const completeRegistration = async (
  data: CompleteRegistrationRequest
): Promise<CompleteRegistrationResponse> => {
  const response = await api.post('/auth/complete-registration', data);
  return response.data;
};

/**
 * 기존 회원가입 API (레거시)
 * @param data 회원가입 요청 데이터
 * @returns 회원가입 결과
 */
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await api.post('/auth/signup', data);
  return response.data;
};

/**
 * 이메일 인증 API (레거시)
 * @param data 이메일 인증 요청 데이터
 * @returns 이메일 인증 결과 (토큰 및 사용자 정보)
 */
export const verifyEmail = async (
  data: VerifyEmailRequest
): Promise<VerifyEmailResponse> => {
  const response = await api.post('/auth/verify-email', data);
  return response.data;
};

/**
 * 인증 코드 재발송 API
 * @param email 인증 코드를 받을 이메일 주소
 * @returns 인증 코드 재발송 결과
 */
export const resendVerificationCode = async (
  email: string
): Promise<VerifyEmailResponse> => {
  const response = await api.post('/auth/resend-verification', { email });
  return response.data;
};

/**
 * 비밀번호 재설정 요청 API
 * @param data 비밀번호 재설정 요청 데이터
 * @returns 비밀번호 재설정 요청 결과
 */
export const requestPasswordReset = async (
  data: RequestPasswordResetRequest
): Promise<RequestPasswordResetResponse> => {
  const response = await api.post('/auth/request-password-reset', data);
  return response.data;
};

/**
 * 비밀번호 재설정 API
 * @param data 새 비밀번호 설정 데이터
 * @returns 비밀번호 재설정 결과
 */
export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const response = await api.post('/auth/reset-password', data);
  return response.data;
};

/**
 * 소셜 로그인 API
 * @param data 소셜 로그인 요청 데이터
 * @returns 소셜 로그인 결과 (토큰 및 사용자 정보)
 */
export const socialLogin = async (
  data: SocialLoginRequest
): Promise<SocialLoginResponse> => {
  const response = await api.post('/auth/social-login', data);
  return response.data;
};

/**
 * 비밀번호 재설정 토큰 검증 API
 * @param data 토큰 검증 요청 데이터
 * @returns 토큰 검증 결과
 */
export const verifyResetToken = async (
  data: VerifyResetTokenRequest
): Promise<VerifyResetTokenResponse> => {
  const response = await api.post('/auth/verify-reset-token', data);
  return response.data;
};
