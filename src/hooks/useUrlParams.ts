'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseUrlParamsOptions<T extends Record<string, string>> {
  defaultValues: T;
  onParamChange?: (key: keyof T, value: string) => void;
}

export function useUrlParams<T extends Record<string, string>>({
  defaultValues,
  onParamChange,
}: UseUrlParamsOptions<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pendingUpdate = useRef<T | null>(null);

  // Initialize params from URL or default values
  const [params, setParams] = useState<T>(() => {
    const initialParams = { ...defaultValues };

    // Update with values from URL if they exist
    Object.keys(defaultValues).forEach(key => {
      const paramValue = searchParams.get(key);
      if (paramValue !== null) {
        initialParams[key as keyof T] = paramValue as T[keyof T];
      }
    });

    return initialParams;
  });

  // 비동기적으로 URL 업데이트
  useEffect(() => {
    if (pendingUpdate.current) {
      const newParams = new URLSearchParams();

      Object.entries(pendingUpdate.current).forEach(([key, value]) => {
        if (value && value !== defaultValues[key]) {
          newParams.set(key, value);
        }
      });

      const queryString = newParams.toString();
      const path = window.location.pathname;
      router.push(`${path}${queryString ? `?${queryString}` : ''}`);

      pendingUpdate.current = null;
    }
  }, [params, router, defaultValues]);

  // 업데이트를 스케줄링
  const updateUrl = useCallback((newParams: T) => {
    pendingUpdate.current = newParams;
  }, []);

  // Set a specific param
  const setParam = (key: keyof T, value: string) => {
    setParams(prev => {
      const newParams = { ...prev, [key]: value };
      updateUrl(newParams);
      return newParams;
    });

    onParamChange?.(key, value);
  };

  // Clear all params
  const clearParams = () => {
    setParams({ ...defaultValues });
    router.push(window.location.pathname);
  };

  // Sync from URL changes
  useEffect(() => {
    const newParams = { ...params };
    let hasChanges = false;

    Object.keys(defaultValues).forEach(key => {
      const paramFromUrl = searchParams.get(key) || defaultValues[key];
      if (paramFromUrl !== params[key as keyof T]) {
        newParams[key as keyof T] = paramFromUrl as T[keyof T];
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setParams(newParams);
    }
  }, [searchParams, defaultValues, params]);

  return {
    params,
    setParam,
    clearParams,
  };
}
