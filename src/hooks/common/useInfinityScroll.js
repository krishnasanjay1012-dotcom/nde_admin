import { useCallback, useRef } from "react";

const useIntersectionObserver = ({
  onIntersect,
  isEnabled = true,
  options = {},
}) => {
  const observer = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && isEnabled) {
          onIntersect();
        }
      });
    },
    [onIntersect, isEnabled],
  );

  const ref = useCallback(
    (node) => {
      if (!node || !isEnabled) return;

      const defaultOptions = {
        root: null,
        rootMargin: "300px",
        threshold: 0.1,
      };

      // Clean up previous observer if it exists
      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(handleObserver, {
        ...defaultOptions,
        ...options,
      });

      observer.current.observe(node);
    },
    [handleObserver, isEnabled, options],
  );

  return ref;
};

export default useIntersectionObserver;
