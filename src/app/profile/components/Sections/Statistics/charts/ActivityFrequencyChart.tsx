import { useSuspenseQuery } from '@tanstack/react-query';
import { Activity, Calendar, Clock } from 'lucide-react';

import { getActivityFrequency } from '@/apis/user/user';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { NoDataMessage, PrivateDataMessage } from '../components';
import { PrivacyToggle } from '../components/PrivacyToggle';
import { useStatisticsSettings } from '../hooks/useStatisticsSettings';

interface ActivityFrequencyChartProps {
  userId: number;
}

const ActivityFrequencyChart = ({ userId }: ActivityFrequencyChartProps) => {
  const currentUser = useCurrentUser();
  const isMyProfile = currentUser?.id === userId;
  const { settings, handleUpdateSetting, isUpdating } = isMyProfile
    ? useStatisticsSettings(userId)
    : { settings: null, handleUpdateSetting: () => {}, isUpdating: false };

  const { data, isLoading } = useSuspenseQuery({
    queryKey: ['activityFrequency', userId],
    queryFn: () => getActivityFrequency(userId),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic && !isMyProfile) {
    return (
      <PrivateDataMessage
        message="이 통계는 비공개 설정되어 있습니다."
        title="활동 빈도"
      />
    );
  }

  // 공개/비공개 토글 핸들러
  const handlePrivacyToggle = (isPublic: boolean) => {
    handleUpdateSetting('isActivityFrequencyPublic', isPublic);
  };

  // 설정 로딩 중 또는 설정 업데이트 중인지 확인
  const showLoading = isLoading || isUpdating || (isMyProfile && !settings);

  // 데이터가 없는 경우
  if (
    !data.averageReviewInterval &&
    !data.averageRatingInterval &&
    !data.mostActiveHour &&
    !data.mostActiveDay
  ) {
    return <NoDataMessage message="활동 빈도 데이터가 없습니다." />;
  }

  // 평균 간격에 대한 텍스트 포맷팅
  const formatIntervalText = (days: number) => {
    if (days === 0) return '정보 없음';
    if (days < 1) return `약 ${Math.round(days * 24)}시간마다`;
    if (days < 30) return `약 ${Math.round(days)}일마다`;
    const months = Math.round(days / 30);
    return `약 ${months}개월마다`;
  };

  // 요일 한글 매핑
  const dayMapping: Record<string, string> = {
    monday: '월요일',
    tuesday: '화요일',
    wednesday: '수요일',
    thursday: '목요일',
    friday: '금요일',
    saturday: '토요일',
    sunday: '일요일',
  };

  // 시간 포맷팅
  const formatHour = (hour: string) => {
    if (!hour) return '정보 없음';
    if (hour.includes(':')) return hour;

    try {
      const hourNum = parseInt(hour);
      if (isNaN(hourNum)) return hour;

      if (hourNum < 12) {
        return `오전 ${hourNum}시`;
      } else if (hourNum === 12) {
        return '오후 12시';
      } else {
        return `오후 ${hourNum - 12}시`;
      }
    } catch (e) {
      return hour;
    }
  };

  const translatedDay =
    dayMapping[data.mostActiveDay.toLowerCase()] || data.mostActiveDay;

  return (
    <div className="h-[340px] w-full rounded-lg bg-white p-3">
      <div className="flex h-full flex-col">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-700">활동 빈도</h3>
            <p className="text-xs text-gray-500">
              {data.mostActiveDay && data.mostActiveHour
                ? `가장 활발한 시간대: ${translatedDay} ${formatHour(data.mostActiveHour)}`
                : '아직 충분한 활동 데이터가 없습니다.'}
            </p>
          </div>
          {isMyProfile && (
            <PrivacyToggle
              isPublic={settings?.isActivityFrequencyPublic || false}
              isLoading={showLoading}
              onToggle={handlePrivacyToggle}
            />
          )}
        </div>

        <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-4">
          <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-4 text-center">
            <div className="mb-2 rounded-full bg-blue-100 p-2">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="mb-1 text-sm font-normal">리뷰 작성 주기</h3>
            <p className="text-xs font-normal text-blue-600">
              {formatIntervalText(data.averageReviewInterval)}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-4 text-center">
            <div className="mb-2 rounded-full bg-amber-100 p-2">
              <Activity className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="mb-1 text-sm font-normal">평점 등록 주기</h3>
            <p className="text-xs font-normal text-amber-600">
              {formatIntervalText(data.averageRatingInterval)}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-4 text-center">
            <div className="mb-2 rounded-full bg-purple-100 p-2">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="mb-1 text-sm font-normal">가장 활발한 요일</h3>
            <p className="text-xs font-normal text-purple-600">
              {translatedDay || '정보 없음'}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-4 text-center">
            <div className="mb-2 rounded-full bg-green-100 p-2">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="mb-1 text-sm font-normal">가장 활발한 시간</h3>
            <p className="text-xs font-normal text-green-600">
              {formatHour(data.mostActiveHour)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityFrequencyChart;
