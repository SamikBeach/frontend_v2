/**
 * 차트 데이터 포맷팅 및 처리 유틸리티
 */
import { TooltipProps } from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

// Recharts 툴팁 컴포넌트를 위한 타입
export type CustomTooltipProps = TooltipProps<ValueType, NameType>;

// Legend 아이템 타입
export interface LegendPayloadItem {
  value: string;
  id?: string;
  type?: string;
  color: string;
  payload?: any;
  dataKey?: string;
}

// 커스텀 범례 컴포넌트를 위한 타입
export interface CustomLegendProps {
  payload?: LegendPayloadItem[];
}

// 파이차트 라벨 렌더링 함수 타입
export interface PieChartLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  value: number;
  name: string;
}

// 데이터 정렬 헬퍼
export const sortDataByDate = <T extends { [key: string]: any }>(
  data: T[],
  dateKey: string,
  ascending: boolean = true
): T[] => {
  if (!data || data.length === 0) return [];

  return [...data].sort((a, b) => {
    const comparison = a[dateKey].localeCompare(b[dateKey]);
    return ascending ? comparison : -comparison;
  });
};

// 배열 중 최소값 찾기
export const findMin = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  return Math.min(...arr);
};

// 배열 중 최대값 찾기
export const findMax = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  return Math.max(...arr);
};

// 숫자 데이터 포맷팅 (천 단위 콤마)
export const formatNumber = (num: number): string => {
  return num.toLocaleString('ko-KR');
};

// 퍼센트 포맷팅
export const formatPercent = (value: number, fixed: number = 1): string => {
  return `${(value * 100).toFixed(fixed)}%`;
};

// 차트 데이터 구간 나누기 (주어진 갯수만큼)
export const divideDataIntoSegments = <T>(
  data: T[],
  segments: number
): T[][] => {
  if (!data || data.length === 0) return [];

  const segmentSize = Math.ceil(data.length / segments);
  const result: T[][] = [];

  for (let i = 0; i < data.length; i += segmentSize) {
    result.push(data.slice(i, i + segmentSize));
  }

  return result;
};

// 차트 데이터 보간 (더 부드러운 라인 차트를 위해)
export const interpolateData = <T extends { [key: string]: any }>(
  data: T[],
  valueKey: string,
  steps: number = 3
): T[] => {
  if (data.length <= 1 || steps <= 1) return data;

  const result: T[] = [];

  for (let i = 0; i < data.length - 1; i++) {
    result.push(data[i]);

    const current = data[i][valueKey];
    const next = data[i + 1][valueKey];
    const diff = next - current;

    for (let j = 1; j < steps; j++) {
      const interpolatedValue = current + (diff * j) / steps;
      result.push({
        ...data[i],
        [valueKey]: interpolatedValue,
        interpolated: true,
      });
    }
  }

  result.push(data[data.length - 1]);
  return result;
};
