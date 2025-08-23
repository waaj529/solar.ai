import { useCallback, useRef } from 'react';

interface UseDebouncedAPIOptions {
  delay?: number;
  maxDelay?: number;
}

export function useDebouncedAPI<T extends (...args: any[]) => Promise<any>>(
  apiFunction: T,
  options: UseDebouncedAPIOptions = {}
) {
  const { delay = 300, maxDelay = 1000 } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTimeRef = useRef<number>(0);
  const isExecutingRef = useRef<boolean>(false);

  const debouncedCall = useCallback(
    async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
      // If already executing, don't allow new calls
      if (isExecutingRef.current) {
        return null;
      }

      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // If we've waited long enough, execute immediately
      if (timeSinceLastCall >= maxDelay) {
        lastCallTimeRef.current = now;
        isExecutingRef.current = true;
        try {
          const result = await apiFunction(...args);
          return result;
        } finally {
          isExecutingRef.current = false;
        }
      }

      // Otherwise, debounce the call
      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          lastCallTimeRef.current = Date.now();
          isExecutingRef.current = true;
          try {
            const result = await apiFunction(...args);
            resolve(result);
          } catch (error) {
            resolve(null);
          } finally {
            isExecutingRef.current = false;
          }
        }, delay);
      });
    },
    [apiFunction, delay, maxDelay]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const isExecuting = useCallback(() => isExecutingRef.current, []);

  return {
    debouncedCall,
    cancel,
    isExecuting,
  };
}