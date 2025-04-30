import {
  getUserStatisticsSettings,
  UpdateStatisticsSettingRequest,
  updateUserStatisticsSettings,
} from '@/apis/user';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * 사용자 통계 설정을 조회하고 관리하는 훅
 * @param userId 사용자 ID
 */
export const useStatisticsSettings = (userId: number) => {
  const queryClient = useQueryClient();

  // 통계 설정 조회
  const { data: settings } = useSuspenseQuery({
    queryKey: ['user-statistics-settings', userId],
    queryFn: () => getUserStatisticsSettings(userId),
  });

  // 통계 설정 업데이트
  const { mutate: updateSettings, isPending: isUpdating } = useMutation({
    mutationFn: (data: UpdateStatisticsSettingRequest) =>
      updateUserStatisticsSettings(userId, data),
    onSuccess: () => {
      // 설정이 변경되면 통계 설정 쿼리와 모든 통계 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['user-statistics-settings', userId],
      });
      queryClient.invalidateQueries({ queryKey: ['user-statistics', userId] });
    },
  });

  const handleUpdateSetting = useCallback(
    (key: keyof UpdateStatisticsSettingRequest, value: boolean) => {
      updateSettings({ [key]: value });
    },
    [updateSettings]
  );

  return {
    settings,
    updateSettings,
    handleUpdateSetting,
    isUpdating,
  };
};
