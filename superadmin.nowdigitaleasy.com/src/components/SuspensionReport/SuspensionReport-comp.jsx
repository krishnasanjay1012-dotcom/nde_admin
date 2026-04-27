import { useState } from "react";
import { Box, TableCell, IconButton, Typography } from "@mui/material";
import ReusableTable from "../../components/common/Table/ReusableTable";
import CustomPagination from "../../components/common/Table/TablePagination";
import { useSuspensionReport } from "../../hooks/suspension/suspension-hooks";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommonDrawer from "../../components/common/NDE-Drawer"; 
import GSuiteDetailsComp from "./SuspensionGSuiteDetails";

const SuspensionReportComp = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data, isLoading } = useSuspensionReport({ page, limit });

  const reports = data?.response || [];
  const pagination = data?.paginatedData || {};



  const handleViewClick = (row) => {
    setSelectedRow(row);
    setDrawerOpen(true);
  };

  const columns = [
    { accessorKey: "productName", header: "Product Name" },
    { accessorKey: "clientName", header: "Customer Name" },
    { accessorKey: "domainName", header: "Domain" },
    {
      accessorKey: "date",
      header: "Suspension Date",
      cell: ({ row }) =>
        row?.original?.date
          ? new Date(row.original.date).toLocaleDateString("en-IN")
          : "-",
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell: ({ row }) =>
        row?.original?.expiryDate
          ? new Date(row.original.expiryDate).toLocaleDateString("en-IN")
          : "-",
    },
    { accessorKey: "reason", header: "Reason" },
    { accessorKey: "remainingDaysToSuspend", header: "Remaining Days" },
    {
      header: "Actions",
      cell: ({ row }) => (
        <IconButton
          size="small"
          color="inherit"
          onClick={(e) => {
            e.stopPropagation(); 
            handleViewClick(row.original);
          }}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 ,mt:2}}>
      <Box sx={{mb:2}}>
      <Typography variant="h4" gutterBottom noWrap>
         Product Suspension Report
        </Typography>
        </Box>
      {/* Table */}
      <ReusableTable
        columns={columns}
        data={reports}
        isLoading={isLoading}
        height={{ xs: 480, sm: 480, md: 480, lg: 480, xl: 500 }}
      />

      {/* Pagination */}
      <CustomPagination
        count={pagination.totalPages || 0}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);
        }}
      />

      {/* Drawer */}
      <CommonDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="G-Suite Details"
        width={400}
        anchor="top"
        actions={[
          {
            label: "Active",
            variant: "contained",
            color: "success",
            onClick: () => console.log("Active clicked!"),
          },
          {
            label: "Transfer",
            variant: "contained",
            color: "secondary",
            onClick: () => console.log("Transfer clicked!"),
          },
        ]}
      >
        {selectedRow && (
          <GSuiteDetailsComp 
            customerId={selectedRow.customerId}  
            skuId={selectedRow.skuId} 
          />
        )}
      </CommonDrawer>
    </Box>
  );
};

export default SuspensionReportComp;
