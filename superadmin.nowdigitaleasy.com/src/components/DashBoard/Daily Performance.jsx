import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ReusableTable from "../../components/common/Table/ReusableTable";
import FilterDatePicker from "../../components/common/NDE-FilterDatePicker";
import CustomPagination from "../../components/common/Table/TablePagination";
import { useDailyData } from "../../hooks/dashboard/dashboard";

const DailyPerformance = () => {
  const columns = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "completedOrders", header: "Completed Orders" },
    { accessorKey: "newInvoices", header: "New Invoices" },
    { accessorKey: "paidInvoices", header: "Paid Invoices" },
    { accessorKey: "newSignups", header: "New Signups" },
    { accessorKey: "orderPlaced", header: "Order Placed" },
  ];

  const [dateRange, setDateRange] = useState({ start_date: null, end_date: null });
  const [page, setPage] = useState(1); 
  const [limit, setLimit] = useState(10);

  
  const { data, isLoading } = useDailyData({
    date_filter: dateRange.start_date && dateRange.end_date ? "custom" : "last_7_days",
    start_date: dateRange.start_date,
    end_date: dateRange.end_date,
    page: page, 
    limit: limit,
  });

  const tableData =
    data?.logData?.map((item) => ({
      date: item.date,
      completedOrders: item.ordercompleted,
      newInvoices: item.Invoices,
      paidInvoices: item.PaidInvoices,
      newSignups: item.SignUps,
      orderPlaced: item.OrdersPlaced,
    })) || [];


  return (
    <Box>
      {/* Header + Date Filter */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">Daily Performance Report</Typography>
        <FilterDatePicker
          dateValue={dateRange}
          onDateChange={(range) => {
            setDateRange(range);
            setPage(1); // reset page when filter changes
          }}
        />
      </Box>

      {/* Table */}
      <Box>
        <ReusableTable columns={columns} data={tableData} isLoading={isLoading} />

        {/* Pagination */}
        <CustomPagination
          count={data?.totalDocs || 0}
          page={(data?.currentPage || page) - 1} 
          rowsPerPage={data?.limit || limit} 
          onPageChange={(_, newPage) => setPage(newPage + 1)}
          onRowsPerPageChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1); 
          }}
        />
      </Box>
    </Box>
  );
};

export default DailyPerformance;
