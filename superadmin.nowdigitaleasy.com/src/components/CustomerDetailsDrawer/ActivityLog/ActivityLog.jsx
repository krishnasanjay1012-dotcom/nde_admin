import React from "react";
import { Box, Divider, Link } from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useActivityLog } from "../../../hooks/dashboard/dashboard";
import ActivityItem from "./ActivityItem";

export default function ActivityLog({ customerId }) {
  const parentRef = React.useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useActivityLog({ userId: customerId });

  const allItems = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.logData) || [];
  }, [data]);
  
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allItems.length + 1 : allItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    measureElement: (el) => el.getBoundingClientRect().height,
    overscan: 5,
  });

  React.useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems();
    const lastItem = virtualItems[virtualItems.length - 1];

    if (!lastItem) return;

    if (
      lastItem.index >= allItems.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    rowVirtualizer.getVirtualItems(),
    allItems.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  return (
    <Box
      ref={parentRef}
      sx={{
        height: 500,
        overflow: "auto",
        px: 3,
        pt: 2,
      }}
    >
      <Box
        sx={{
          height: rowVirtualizer.getTotalSize(),
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const isLoaderRow = virtualRow.index > allItems.length - 1;
          const item = allItems[virtualRow.index];

          return (
            <Box
              key={virtualRow.key}
              ref={rowVirtualizer.measureElement}
              data-index={virtualRow.index}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {isLoaderRow ? (
                hasNextPage ? (
                  "Loading more..."
                ) : (
                  "No more activities"
                )
              ) : (
                <ActivityItem {...item} />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
