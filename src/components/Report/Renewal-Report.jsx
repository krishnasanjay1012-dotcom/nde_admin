import { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import ReusableTable from "../../components/common/Table/ReusableTable";
import CustomPagination from "../../components/common/Table/TablePagination";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommonDrawer from "../../components/common/NDE-Drawer";
import CommonSelect from "../../components/common/fields/NDE-Select";
import CommonNumberField from "../../components/common/fields/NDE-NumberField";
import RenewalDetails from "./Renewal-Details";
import { useRenewalDataByDate } from "../../hooks/suspension/suspension-hooks";
import DomainRenewal from "../common/Domain-Renewal";

const RenewalReport = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [selectedNumber, setSelectedNumber] = useState(15);

  const [selectedService, setSelectedService] = useState("resellerclub");

  const serviceOptions = [
    { value: "resellerclub", label: "Resellerclub" },
    { value: "gsuite", label: "GSuite" },
    { value: "plesk", label: "Plesk" },
  ];

  const { data, isLoading } = useRenewalDataByDate({
    days: selectedNumber, 
    page,
    limit,
    service: selectedService,
  });

  const reports = data?.data || [];
  const pagination = data?.pagination || {};

  const handleViewClick = (row) => {
    setSelectedRow(row);
    setDrawerOpen(true);
  };

    const handleRowClick = (rowData) => {
    setSelectedProduct(rowData);
    setOpenDialog(true);
  };

  const columns = [
    { accessorKey: "service", header: "Service" },
    { accessorKey: "domainName", header: "Domain" },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell: ({ row }) =>
        row?.original?.expiryDate
          ? new Date(row.original.expiryDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
            })
          : "-",
    },
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
    <Box sx={{ p: 1 }}>
      {/* Header Section */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        // mb={2}
      >
        <Typography variant="h4" gutterBottom noWrap>
          Renewal Report
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          
         <CommonNumberField
            mandatory
            value={selectedNumber}
            onChange={(e) => setSelectedNumber(Number(e.target.value))}
            min={1}
            max={365}
            step={1}
            placeholder="Enter days"
            width="80px"
          />
          <CommonSelect
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            options={serviceOptions}
            
          />
          
        </Box>
      </Box>

      {/* Table */}
      <ReusableTable
        columns={columns}
        data={reports}
        isLoading={isLoading}
        onRowClick={handleRowClick}
      />

      {/* Pagination */}
      <CustomPagination
        count={pagination?.totalDocs || 0}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);
        }}
      />

       <DomainRenewal
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          productId={selectedProduct?.productId}
          userId={selectedProduct?.clientId}
          selectedProduct={selectedProduct}
        />

      {/* Drawer */}
      <CommonDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Domain Details"
        width={400}
        anchor="top"
        actions={[
          {
            label: "Suspend",
            variant: "contained",
            color: "primary",
            onClick: () => console.log("Suspended!"),
          },
          {
            label: "UnSuspend",
            variant: "outlined",
            color: "primary",
            onClick: () => console.log("UnSuspended!"),
          },
          {
            label: "Terminate",
            variant: "outlined",
            color: "error",
            onClick: () => console.log("Terminate!"),
          },
        ]}
      >
        {selectedRow && (
          <RenewalDetails
            domain={selectedRow.domainName}
          />
        )}
      </CommonDrawer>
    </Box>
  );
};

export default RenewalReport;
