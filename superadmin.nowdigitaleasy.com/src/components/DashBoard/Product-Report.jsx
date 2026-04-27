import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import CustomPagination from "../common/Table/TablePagination";
import FilterDatePicker from "../../components/common/NDE-FilterDatePicker";
import { useProductData } from "../../hooks/dashboard/dashboard";

const DomainHostingSales = () => {
  const [dateRange, setDateRange] = useState({ start_date: null, end_date: null });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);


  const { data, isLoading } = useProductData({
    custom: true,
    date_filter: dateRange.start_date && dateRange.end_date ? "custom" : "last_7_days",
    start_date: dateRange.start_date,
    end_date: dateRange.end_date,
    page,
    limit,
  });

  const columns = [
    { accessorKey: "date", header: "Date Wise", cell: info => info.getValue() },
    {
      header: "Domain Sold",
      columns: [
        { accessorKey: "domainUnit", header: "Unit", cell: info => info.getValue() },
        { accessorKey: "domainValue", header: "Value", cell: info => `$${info.getValue()}` },
      ],
    },
    {
      header: "Hosting Sold",
      columns: [
        { accessorKey: "hostingUnit", header: "Unit", cell: info => info.getValue() },
        { accessorKey: "hostingValue", header: "Value", cell: info => `$${info.getValue()}` },
      ],
    },
    {
      header: "G-Suite Sold",
      columns: [
        { accessorKey: "gSuiteUnit", header: "Unit", cell: info => info.getValue() },
        { accessorKey: "gSuiteValue", header: "Value", cell: info => `$${info.getValue()}` },
      ],
    },
  ];

  const table = useReactTable({
    data: data?.products || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: limit, pageIndex: page - 1 } },
  });

  return (
    <Box>
      {/* Header + Date Filter */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6">Product Wise Report</Typography>
        <FilterDatePicker
          dateValue={dateRange}
          onDateChange={range => {
            setDateRange(range);
            setPage(1); // reset page on filter change
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer sx={{ width: "100%", maxHeight: "70vh", overflow: "auto", borderRadius: 1, border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell key={header.id} colSpan={header.colSpan}
                    sx={{
                      backgroundColor: "background.default",
                      fontWeight: 600,
                      fontSize: { xs: "12px", sm: "14px" },
                      color: "text.primary",
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: 7 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}><Skeleton variant="text" sx={{ height: 34 }} /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <CustomPagination
        count={data?.total || 0}
        page={table.getState().pagination.pageIndex}
        rowsPerPage={table.getState().pagination.pageSize}
        onPageChange={(_, newPage) => {
          setPage(newPage + 1);
          table.setPageIndex(newPage);
        }}
        onRowsPerPageChange={e => {
          setLimit(Number(e.target.value));
          table.setPageSize(Number(e.target.value));
        }}
      />
    </Box>
  );
};

export default DomainHostingSales;
