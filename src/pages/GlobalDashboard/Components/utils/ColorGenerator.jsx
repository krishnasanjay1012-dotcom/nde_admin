import { useTheme } from "@mui/material";
import { useMemo } from "react";

// ─── Utils ────────────────────────────────────────────────────────────────────

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return [0, 0, l * 100];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  else if (max === g) h = ((b - r) / d + 2) * 60;
  else h = ((r - g) / d + 4) * 60;

  return [h, s * 100, l * 100];
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const BASE_COLORS = [
  "#3B6FD4", // Indigo
  "#14B8A6", // Teal
  "#F59E0B", // Amber
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#EC4899", // Pink
  "#F97316", // Orange
  "#64748B", // Slate
];

const LIGHTNESS_STEPS_LIGHT = [35, 65, 25, 75]; // darker → lighter variants
const LIGHTNESS_STEPS_DARK = [70, 45, 80, 35]; // lighter → darker variants
const SATURATION_CLAMP = { min: 50, max: 85 };
const LIGHTNESS_SIMILARITY_THRESHOLD = 5;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useChartPalette(count) {
  const {
    palette: { mode },
  } = useTheme();

  return useMemo(() => {
    if (!count || count <= 0) return [];

    const result = [];
    const used = new Set();
    const steps =
      mode === "dark" ? LIGHTNESS_STEPS_DARK : LIGHTNESS_STEPS_LIGHT;

    const push = (color) => {
      if (!used.has(color)) {
        result.push(color);
        used.add(color);
      }
    };

    // Step 1 — base colors
    for (const color of BASE_COLORS) {
      push(color);
      if (result.length >= count) return result;
    }

    // Step 2 — lightness variants (skip near-base lightness to avoid perceptual dupes)
    for (const base of BASE_COLORS) {
      const [h, s, baseLightness] = hexToHsl(base);
      const clampedS = Math.min(
        Math.max(s, SATURATION_CLAMP.min),
        SATURATION_CLAMP.max,
      );

      for (const l of steps) {
        if (Math.abs(l - baseLightness) < LIGHTNESS_SIMILARITY_THRESHOLD)
          continue;
        push(hslToHex(h, clampedS, l));
        if (result.length >= count) return result;
      }
    }

    // Step 3 — hue-shift fallback (30° increments across bases)
    let i = 0;
    while (result.length < count) {
      const base = BASE_COLORS[i % BASE_COLORS.length];
      const [h, s, l] = hexToHsl(base);
      push(hslToHex((h + Math.ceil(i / BASE_COLORS.length) * 30) % 360, s, l));
      i++;
    }

    return result;
  }, [count, mode]);
}
