import { useCallback, useRef } from 'react';

interface UseFocusManagementOptions {
  delay?: number;
  maxAttempts?: number;
  monitorDuration?: number;
  debugPrefix?: string;
}

export function useFocusManagement(options: UseFocusManagementOptions = {}) {
  const {
    delay = 150,
    maxAttempts = 15,
    monitorDuration = 3000,
    debugPrefix = 'Focus',
  } = options;

  const elementRef = useRef<HTMLTextAreaElement>(null);
  const focusIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const ensureFocus = useCallback(() => {
    let attempts = 0;

    const tryFocus = () => {
      attempts++;
      console.log(
        `${debugPrefix} 포커스 시도 ${attempts}/${maxAttempts}:`,
        elementRef.current,
        'activeElement:',
        document.activeElement
      );

      if (elementRef.current && document.contains(elementRef.current)) {
        elementRef.current.focus();

        // 포커스가 실제로 설정되었는지 확인
        if (document.activeElement === elementRef.current) {
          console.log(`${debugPrefix} 포커스 설정 성공!`);

          // 커서를 텍스트의 맨 뒤로 이동
          const textLength = elementRef.current.value.length;
          elementRef.current.setSelectionRange(textLength, textLength);

          // 기존 모니터링 인터벌이 있다면 정리
          if (focusIntervalRef.current) {
            clearInterval(focusIntervalRef.current);
          }

          // 포커스 유지를 위한 지속적인 모니터링
          let monitorCount = 0;
          const maxMonitorCount = monitorDuration / 50; // 50ms 간격으로 모니터링

          focusIntervalRef.current = setInterval(() => {
            monitorCount++;
            if (
              document.activeElement !== elementRef.current &&
              elementRef.current &&
              document.contains(elementRef.current)
            ) {
              console.log(`${debugPrefix} 포커스가 풀림 - 다시 설정`);
              elementRef.current.focus();
              // 다시 포커스할 때도 커서를 맨 뒤로
              const textLength = elementRef.current.value.length;
              elementRef.current.setSelectionRange(textLength, textLength);
            }

            if (monitorCount >= maxMonitorCount) {
              console.log(`${debugPrefix} 포커스 모니터링 종료`);
              if (focusIntervalRef.current) {
                clearInterval(focusIntervalRef.current);
                focusIntervalRef.current = null;
              }
            }
          }, 50);

          return;
        }
      }

      // 최대 시도 횟수에 도달하지 않았으면 다시 시도
      if (attempts < maxAttempts) {
        setTimeout(tryFocus, 50);
      } else {
        console.log(`${debugPrefix} 포커스 설정 실패 - 최대 시도 횟수 초과`);
      }
    };

    // 지정된 지연 후 시작
    setTimeout(tryFocus, delay);
  }, [delay, maxAttempts, monitorDuration, debugPrefix]);

  const stopFocusMonitoring = useCallback(() => {
    if (focusIntervalRef.current) {
      clearInterval(focusIntervalRef.current);
      focusIntervalRef.current = null;
    }
  }, []);

  return {
    elementRef,
    ensureFocus,
    stopFocusMonitoring,
  };
}
