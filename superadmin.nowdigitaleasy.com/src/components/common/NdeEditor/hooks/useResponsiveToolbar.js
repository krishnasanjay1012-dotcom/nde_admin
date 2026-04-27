import { useEffect, useRef, useState } from 'react';

export function useResponsiveToolbar(items, getItemWidth) {
  const containerRef = useRef(null);
  const [visibleKeys, setVisibleKeys] = useState(items);
  const [overflowKeys, setOverflowKeys] = useState([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const calculate = () => {
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;

      const moreWidth = 60; // ⋯ button width
      const gap = 6; // same as css gap

      let used = 0;
      const visible = [];
      const overflow = [];

      for (let i = 0; i < items.length; i++) {
        const key = items[i];

        const w = getItemWidth(key);

        const wWithGap = w + (visible.length > 0 ? gap : 0);

        if (used + wWithGap + moreWidth <= containerWidth) {
          visible.push(key);
          used += wWithGap;
        } else {
          overflow.push(key);
        }
      }

      setVisibleKeys(visible);
      setOverflowKeys(overflow);
    };

    const ro = new ResizeObserver(() => calculate());
    ro.observe(containerRef.current);

    calculate();

    return () => ro.disconnect();
  }, [items, getItemWidth]);

  return { containerRef, visibleKeys, overflowKeys };
}
