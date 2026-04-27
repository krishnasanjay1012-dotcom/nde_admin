import { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReusableTable from "../../components/common/Table/ReusableTable";
import CustomPagination from "../../components/common/Table/TablePagination";
import { useSuspensionReport } from "../../hooks/suspension/suspension-hooks";
import CommonDrawer from "../../components/common/NDE-Drawer";
import CommonSelect from "../../components/common/fields/NDE-Select";
import GSuiteDetailsComp from "../../components/SuspensionReport/SuspensionGSuiteDetails";
import DomainRenewal from "../../components/common/Domain-Renewal";

const TotalServiceList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit")) || 10);
  const [filterType, setFilterType] = useState(searchParams.get("filter") || "suspended");
  const [sortParam, setSortParam] = useState(searchParams.get("sort") || "");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    setSearchParams({
      page,
      limit,
      filter: filterType,
      sort: sortParam,
    });
  }, [page, limit, filterType, sortParam, setSearchParams]);

  const { data, isLoading } = useSuspensionReport({
    page,
    limit,
    filter: filterType,
    sort: sortParam,
  });

  const reports = data?.response || [];
  const pagination = data?.pagination || {};

  const customerOptions = [
    { label: "Expired", value: "expired" },
    { label: "Suspended", value: "suspended" },
    { label: "Risk Report", value: "risk-report" },
    { label: "Due Soon Report", value: "due-soon-report" },
    { label: "Not Due Report", value: "not-due-report" },
  ];

  const handleCustomerOptionChange = (value) => {
    setFilterType(value);
    setPage(1);
  };

  const handleSortChange = (column) => {
    let newSort;
    if (sortParam === column) {
      newSort = `-${column}`;
    } else if (sortParam === `-${column}`) {
      newSort = column;
    } else {
      newSort = column;
    }
    setSortParam(newSort);
    setPage(1);
  };

  const handleViewClick = (row) => {
    setSelectedRow(row);
    setDrawerOpen(true);
  };


  const handleRowClick = (rowData) => {
    setSelectedProduct(rowData);
    setOpenDialog(true);
  };
  const columns = [
    {
      accessorKey: "productName",
      header: "Product Name",
      cell: ({ row }) => row.original.productName || "-",
    },
    {
      accessorKey: "clientName",
      header: "Customer Name",
      cell: ({ row }) => {
        const name = row.original.clientName || "-";
        return (
          <Box
            sx={{
              maxWidth: 180,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "default",
            }}
            title={name !== "-" ? name : ""}
          >
            {name}
          </Box>
        );
      },
    },
    {
      accessorKey: "domainName",
      header: "Domain",
      cell: ({ row }) => row.original.domainName || "-",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) =>
        row.original.date
          ? new Date(row.original.date).toLocaleDateString("en-IN")
          : "-",
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell: ({ row }) =>
        row.original.expiryDate
          ? new Date(row.original.expiryDate).toLocaleDateString("en-IN")
          : "-",
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => row.original.reason || "-",
    },
    {
      accessorKey: "remainingDaysToSuspend",
      header: "Remaining Days",
      cell: ({ row }) =>
        row.original.remainingDaysToSuspend ?? "-",
    },
    ...(filterType === "suspended"
      ? [
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
      ]
      : []),
  ];



  return (
    <Box sx={{ p: 1 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <CommonSelect
          options={customerOptions}
          value={filterType}
          onChange={(e) => handleCustomerOptionChange(e.target.value)}
          width="150px"
        />
        <Typography variant="h4" gutterBottom noWrap mr={3}>
          Total Service
        </Typography>
      </Box>

      {/* Table */}
      <ReusableTable
        columns={columns}
        data={reports}
        isLoading={isLoading}
        sortableColumns={["productName", "clientName", "domainName", "expiryDate"]}
        onSortChange={handleSortChange}
        currentSort={sortParam}
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

      <DomainRenewal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        productId={selectedProduct?.productId}
        userId={selectedProduct?.clientId}
        selectedProduct={selectedProduct}
      />
    </Box>
  );
};

export default TotalServiceList;
