import axiosInstance from '../axios';
import {
  MarkAsReadRequest,
  Notification,
  NotificationResponse,
  UnreadCountResponse,
} from './types';

/**
 * 사용자의 모든 알림 조회 (페이지네이션)
 */
export const getNotifications = async (
  page = 1,
  limit = 10
): Promise<NotificationResponse> => {
  const response = await axiosInstance.get(`/notifications`, {
    params: { page, limit },
  });
  return response.data;
};

/**
 * 사용자의 읽지 않은 알림 개수 조회
 */
export const getUnreadNotificationCount = async (): Promise<number> => {
  const response = await axiosInstance.get<UnreadCountResponse>(
    `/notifications/count-unread`
  );
  return response.data.count;
};

/**
 * 특정 알림 상세 조회
 */
export const getNotification = async (id: number): Promise<Notification> => {
  const response = await axiosInstance.get(`/notifications/${id}`);
  return response.data;
};

/**
 * 알림 읽음 상태 업데이트
 */
export const updateNotification = async (
  id: number,
  isRead: boolean
): Promise<Notification> => {
  const response = await axiosInstance.patch(`/notifications/${id}`, {
    isRead,
  } as MarkAsReadRequest);
  return response.data;
};

/**
 * 모든 알림 읽음 상태로 변경
 */
export const markAllAsRead = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await axiosInstance.post(`/notifications/mark-all-read`);
  return response.data;
};

/**
 * 특정 알림 삭제
 */
export const deleteNotification = async (
  id: number
): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.delete(`/notifications/${id}`);
  return response.data;
};

/**
 * 사용자의 모든 알림 삭제
 */
export const deleteAllNotifications = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await axiosInstance.delete(`/notifications`);
  return response.data;
};
