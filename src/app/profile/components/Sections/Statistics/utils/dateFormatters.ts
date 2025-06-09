import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 다양한 날짜 포맷 유틸리티
 */

// 기본 날짜 포맷터
export const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return format(date, 'PPP', { locale: ko });
  } catch {
    return dateStr;
  }
};

// 날짜/시간 포맷터 (댓글용)
export const formatDateTime = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return format(date, 'PPP p', { locale: ko });
  } catch {
    return dateStr;
  }
};

// 시간만 포맷터
export const formatTimeOnly = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return format(date, 'p', { locale: ko });
  } catch {
    return dateStr;
  }
};

// 기간별 날짜 포맷팅 타입
export type PeriodType =
  | 'all'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'keywords';

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

// 기간 옵션 생성 유틸리티 (모든 기간)
export const getAllPeriodOptions = () => [
  { id: 'all' as PeriodType, name: '전체' },
  { id: 'daily' as PeriodType, name: '일별' },
  { id: 'weekly' as PeriodType, name: '주별' },
  { id: 'monthly' as PeriodType, name: '월별' },
  { id: 'yearly' as PeriodType, name: '연도별' },
];

// 기간 옵션 생성 유틸리티 (keywords 포함)
export const getSearchPeriodOptions = () => [
  { id: 'keywords' as PeriodType, name: '키워드' },
  { id: 'daily' as PeriodType, name: '일별' },
  { id: 'weekly' as PeriodType, name: '주별' },
  { id: 'monthly' as PeriodType, name: '월별' },
  { id: 'yearly' as PeriodType, name: '연도별' },
];

// 기본 기간 옵션 생성 유틸리티
export const getStandardPeriodOptions = () => [
  { id: 'daily' as PeriodType, name: '일별' },
  { id: 'weekly' as PeriodType, name: '주별' },
  { id: 'monthly' as PeriodType, name: '월별' },
  { id: 'yearly' as PeriodType, name: '연도별' },
];
