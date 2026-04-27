import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import React, { useCallback, useRef } from "react";

const ChartLegend = React.memo(
  ({ seriesKeys, colors, hiddenMap, toggleItem }) => {
    const scrollRef = useRef(null);

    const scroll = useCallback((dir) => {
      scrollRef.current?.scrollBy({
        left: dir === "left" ? -160 : 160,
        behavior: "smooth",
      });
    }, []);

    const handleToggle = useCallback(
      (key) => {
        const visibleCount = seriesKeys?.filter((k) => !hiddenMap?.[k])?.length;
        const isLastVisible = visibleCount === 1 && !hiddenMap[key];
        if (isLastVisible) return; // enforce at-least-one
        toggleItem(key);
      },
      [seriesKeys, hiddenMap, toggleItem],
    );

    return (
      <Box display="flex" alignItems="center" gap={0.5} mb={1}>
        <IconButton
          size="small"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <ChevronLeft fontSize="small" />
        </IconButton>

        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            flex: 1,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {seriesKeys?.map((key, i) => {
            const isLastVisible =
              !hiddenMap?.[key] &&
              seriesKeys?.filter((k) => !hiddenMap?.[k])?.length === 1;

            return (
              <Box
                key={key}
                onClick={() => handleToggle(key)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  cursor: isLastVisible ? "not-allowed" : "pointer",
                  opacity: hiddenMap[key] ? 0.35 : 1,
                  userSelect: "none",
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: colors[i] ? colors[i] : colors[0] || "#ccc", // fallback guards index mismatch
                  }}
                />
                <Typography fontSize={13} color="text.secondary" noWrap>
                  {key}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <IconButton
          size="small"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <ChevronRight fontSize="small" />
        </IconButton>
      </Box>
    );
  },
);

ChartLegend.displayName = "ChartLegend";

export default ChartLegend;
