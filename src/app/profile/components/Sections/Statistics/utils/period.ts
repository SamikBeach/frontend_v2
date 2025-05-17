import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 기간 관련 타입과 유틸리티 함수
 */

// 기간별 날짜 포맷팅 타입
export type PeriodType =
  | 'all'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'keywords';

// 기간 옵션 타입
export interface PeriodOption {
  id: PeriodType;
  name: string;
}

// 기간 옵션 생성 유틸리티 (모든 기간)
export const getAllPeriodOptions = (): PeriodOption[] => [
  { id: 'all', name: '전체' },
  { id: 'daily', name: '일별' },
  { id: 'weekly', name: '주별' },
  { id: 'monthly', name: '월별' },
  { id: 'yearly', name: '연도별' },
];

// 기간 옵션 생성 유틸리티 (keywords 포함)
export const getSearchPeriodOptions = (): PeriodOption[] => [
  { id: 'keywords', name: '키워드' },
  { id: 'daily', name: '일별' },
  { id: 'weekly', name: '주별' },
  { id: 'monthly', name: '월별' },
  { id: 'yearly', name: '연도별' },
];

// 기본 기간 옵션 생성 유틸리티
export const getStandardPeriodOptions = (): PeriodOption[] => [
  { id: 'daily', name: '일별' },
  { id: 'weekly', name: '주별' },
  { id: 'monthly', name: '월별' },
  { id: 'yearly', name: '연도별' },
];

// 특정 기간 옵션 제외하고 가져오기
export const getPeriodOptionsExcept = (
  excludeIds: PeriodType[]
): PeriodOption[] => {
  return getAllPeriodOptions().filter(
    option => !excludeIds.includes(option.id)
  );
};

// 툴팁에 표시될 날짜 포맷터
export const formatTooltipDate = (
  label: string,
  periodType: PeriodType
): string => {
  if (periodType === 'yearly') {
    return `${label}년`;
  } else if (periodType === 'monthly') {
    try {
      const [year, month] = label.split('-');
      const monthNum = parseInt(month);
      return `${year}년 ${monthNum}월`;
    } catch {
      return label;
    }
  } else if (periodType === 'weekly') {
    // 예: '5월 2째주' 형식
    return label;
  } else if (periodType === 'daily') {
    try {
      const date = new Date(label);
      return format(date, 'yyyy년 MM월 dd일', { locale: ko });
    } catch {
      return label;
    }
  }
  return label;
};

// X축 레이블 포맷터
export const formatXAxisLabel = (
  label: string,
  periodType: PeriodType
): string => {
  if (periodType === 'yearly') {
    return label;
  } else if (periodType === 'monthly') {
    const [_, month] = label.split('-');
    return `${parseInt(month)}월`;
  } else if (periodType === 'weekly') {
    // 주별 데이터는 그대로 표시 (이미 '5월 1째주' 형식)
    return label;
  } else if (periodType === 'daily') {
    const [_, month, day] = label.split('-');
    return `${parseInt(month)}/${parseInt(day)}`;
  }
  return label;
};
