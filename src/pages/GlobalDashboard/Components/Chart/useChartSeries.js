import { useCallback, useMemo, useState } from "react";
import { useChartPalette } from "../utils/ColorGenerator";

export function useChartSeries(rawItems = [], paletteSize = 15) {
  const colors = useChartPalette(paletteSize);

  const [hiddenMap, setHiddenMap] = useState({});

  const toggleItem = useCallback((key) => {
    setHiddenMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const { chartData, seriesKeys, isSingleSeries, colorMap, legendKeys } =
    useMemo(() => {
      if (!rawItems?.length) {
        return {
          chartData: [],
          seriesKeys: [],
          isSingleSeries: true,
          colorMap: {},
          legendKeys: [],
        };
      }

      const isMulti = rawItems[0]?.x1 && rawItems[0]?.x2;

      // ─── SINGLE SERIES (BAR / COLUMN) ─────────────────────────────
      if (!isMulti) {
        const chartData = rawItems.map((d) => ({
          label: d.label,
          value: d.value,
        }));

        const colorMap = {};
        chartData.forEach((d, i) => {
          colorMap[d.label] = colors[i % colors.length];
        });

        return {
          chartData,
          seriesKeys: ["value"],
          isSingleSeries: true,
          colorMap,
          legendKeys: chartData.map((d) => d.label),
        };
      }

      // ─── MULTI SERIES (AREA) ─────────────────────────────────────
      const x1Set = [...new Set(rawItems.map((d) => d.x1))];
      const x2Set = [...new Set(rawItems.map((d) => d.x2))];

      const lookup = {};

      for (const row of rawItems) {
        if (!lookup[row.x1]) lookup[row.x1] = {};
        lookup[row.x1][row.x2] = (lookup[row.x1][row.x2] || 0) + row.value;
      }

      const chartData = x1Set.map((x1) => {
        const point = { label: x1 };
        for (const x2 of x2Set) {
          point[x2] = lookup[x1]?.[x2] ?? 0;
        }
        return point;
      });

      return {
        chartData,
        seriesKeys: x2Set,
        isSingleSeries: false,
        colorMap: {},
        legendKeys: x2Set,
      };
    }, [rawItems, colors]);

  return {
    chartData,
    seriesKeys,
    colors,
    hiddenMap,
    toggleItem,
    isSingleSeries,
    colorMap,
    legendKeys,
  };
}
