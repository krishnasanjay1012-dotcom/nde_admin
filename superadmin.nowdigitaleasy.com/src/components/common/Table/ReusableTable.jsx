import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import TableHeader from "./TableHeader";
import TableBodyComponent from "./TableBody";
import {
  Box,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
} from "@mui/material";

const TOP_HEIGHT = 54;

const ReusableTable = ({
  columns,
  data,
  isLoading = false,
  selectedIds,
  onRowClick,
  onCellClick,
  skeletonRowCount = 8,
  maxHeight = "calc(100vh - 170px)",
  sortableColumns = [],
  onSortChange,
  topComponent,
  HoverComponent,
}) => {
  const columnsMemo = useMemo(() => columns, [columns]);
  // const dataMemo = useMemo(() => data, [data]);
  const dataMemo = useMemo(() => data ?? [], [data]);

  const table = useReactTable({
    data: dataMemo,
    columns: columnsMemo,
    getCoreRowModel: getCoreRowModel(),
  });

  const renderSkeleton = () => (
    <TableBody>
      {Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {columns.map((_, colIndex) => (
            <TableCell key={colIndex} sx={{ py: 0.4 }}>
              <Skeleton width="100%" height={34} variant="text"
                animation="wave"
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <TableContainer
        sx={{
          maxHeight,
          overflowY: "auto",
          position: "relative",
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        {topComponent && (
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 3,
              height: TOP_HEIGHT,
              p: 0.8,
              bgcolor: "background.paper",
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            {topComponent}
          </Box>
        )}

        <Table stickyHeader>
          <TableHeader
            table={table}
            sortableColumns={sortableColumns}
            onSortChange={onSortChange}
            topOffset={topComponent ? TOP_HEIGHT : 0}
          />

          {isLoading ? (
            renderSkeleton()
          ) : (
            <TableBodyComponent
              table={table}
              selectedIds={selectedIds}
              onRowClick={onRowClick}
              onCellClick={onCellClick}
              HoverComponent={HoverComponent}
            />
          )}
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReusableTable;
