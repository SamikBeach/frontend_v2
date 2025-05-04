import { useEffect, useState } from 'react';

interface UseIntersectionObserverProps {
  target: React.RefObject<Element>;
  onIntersect: () => void;
  enabled?: boolean;
  threshold?: number;
  rootMargin?: string;
}

export function useIntersectionObserver({
  target,
  onIntersect,
  enabled = true,
  threshold = 0.1,
  rootMargin = '0px',
}: UseIntersectionObserverProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!enabled || !target.current) return;

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);

        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(target.current);

    return () => {
      if (target.current) {
        observer.unobserve(target.current);
      }
    };
  }, [enabled, onIntersect, rootMargin, target, threshold]);

  return { isIntersecting };
}
