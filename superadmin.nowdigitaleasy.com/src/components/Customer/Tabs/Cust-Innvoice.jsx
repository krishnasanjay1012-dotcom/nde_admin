import { useState, useEffect } from "react";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography } from "@mui/material";
import { DateRange } from "react-date-range";
import ReusableTable from "../../common/Table/ReusableTable";
import CommonSearchBar from "../../common/fields/NDE-SearchBar";
import CustomPagination from "../../common/Table/TablePagination";
import { useInvoicesByClient } from "../../../hooks/Customer/Customer-hooks";
import CommonDeleteModal from "../../common/NDE-DeleteModal";
import CommonFilter from "../../common/NDE-CommonFilter";

const statusColorMap = {
  open: { color: "#2196f3", bg: "#e3f2fd" },
  draft: { color: "#9e9e9e", bg: "#f5f5f5" },
  sent: { color: "#2196f3", bg: "#e3f2fd" },
  viewed: { color: "#00bcd4", bg: "#e0f7fa" },
  partially_paid: { color: "#ff9800", bg: "#fff3e0" },
  paid: { color: "#4caf50", bg: "#e8f5e9" },
  overdue: { color: "#f44336", bg: "#ffebee" },
  void: { color: "#607d8b", bg: "#eceff1" },
  deleted: { color: "#000000", bg: "#e0e0e0" },
  pending_approval: { color: "#ffc107", bg: "#fff8e1" },
  approved: { color: "#2e7d32", bg: "#e8f5e9" },
  written_off: { color: "#795548", bg: "#efebe9" },
  pending: { color: "#ff9800", bg: "#fff3e0" }
};

const Invoice = ({ selectedWorkspaceId }) => {

  const [status, setStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [customRange, setCustomRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const [openModal, setOpenModal] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleCustomSelect = (ranges) => {
    setCustomRange(ranges.selection);
  };

  const handleApply = () => {
    setDateFilter("custom");
    setOpenModal(false);
    setPage(1);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  const { data, isLoading, refetch } = useInvoicesByClient({
    page,
    limit,
    filter: status !== "all" ? status : "all",
    date_filter: dateFilter,
    customStartDate: dateFilter === "custom" ? customRange.startDate.toISOString() : "",
    customEndDate: dateFilter === "custom" ? customRange.endDate.toISOString() : "",
    searchTerm: debouncedSearch,
    workspace_Id: selectedWorkspaceId
  });

  const invoices = data?.data || [];

  const statusOptions = [
    { label: "All Invoice", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Paid", value: "paid" },
    { label: "OverDue", value: "overdue" },
  ];

  useEffect(() => {
    refetch({
      page,
      limit,
      filter: status !== "all" ? status : "all",
      date_filter: dateFilter,
      customStartDate: dateFilter === "custom" ? customRange.startDate.toISOString() : "",
      customEndDate: dateFilter === "custom" ? customRange.endDate.toISOString() : "",
      searchTerm: debouncedSearch,
    });
  }, [status, dateFilter, page, limit, debouncedSearch, customRange, refetch]);



  const confirmDelete = async () => {
    if (!selectedRow) return;
    try {
      // console.log("Deleted invoice:", selectedRow._id);
    } catch (err) {
      console.error("Error deleting invoice:", err);
    } finally {
      setDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };

  const columns = [
  { accessorKey: "invoiceId", header: "Invoice Id" },
  {
    accessorKey: "date",
    header: "Invoice Date",
    cell: ({ row }) =>
      row.original.invoiceDate
        ? new Date(row.original.invoiceDate).toLocaleDateString("en-IN")
        : "-",
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) =>
      row.original.dueDate
        ? new Date(row.original.dueDate).toLocaleDateString("en-IN")
        : "-",
  },
  {
    accessorKey: "paymentmethod",
    header: "Payment Method",
    cell: ({ row }) => row.original.paymentMade ? "Paid" : "Pending",
  },
  { accessorKey: "status", header: "Status", 
    cell: ({ row }) => {
      const rawStatus = row.original?.status || "";
      const statusKey = rawStatus.toLowerCase();
      const styles = statusColorMap[statusKey] || { color: "#000", bg: "#f5f5f5" };

      return (
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: 500,
            textAlign: "center",
            width: "fit-content",
            color: styles.color,
            backgroundColor: styles.bg,
          }}
        >
          {rawStatus.toUpperCase()}
        </Box>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: row.original.currency?.code || "INR",
        minimumFractionDigits: row.original.currency?.decimalPlaces ?? 2,
      }).format(Number(row.original.totalAmount || 0)),
  },
];

  const topComponent = (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
    >
      {/* Left side: Search + Select */}
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Search */}
        <CommonSearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch("")}
          placeholder="Search invoices..."
          sx={{ width: 200 }}
          height={40}
          mt={0}
          mb={0}
        />
        <CommonFilter
          menuOptions={statusOptions}
          value={status}
          onChange={setStatus}
        />
        {/* <CommonFilter
          menuOptions={dateFilterOptions}
          value={dateFilter}
          onChange={(e) => {
            if (e.target.value === "custom") {
              setOpenModal(true);
            } else {
              setDateFilter(e.target.value);
            }
          }}
        /> */}
      </Stack>

    </Stack>
  );


  return (
    <Box >
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1 }}
      >
        <Typography variant="h4" gutterBottom>
          Invoice
        </Typography>
      </Box>
      {/* Table */}
      <ReusableTable columns={columns} data={invoices} isLoading={isLoading} maxHeight="calc(100vh - 280px)" skeletonRowCount={5} topComponent={topComponent} />

      {/* Pagination */}
      <CustomPagination
        count={data?.totalDocs || 0}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);
        }}

      />

      {/* Delete Modal */}
      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={false}
        itemType="Invoice"
      />

      <Dialog open={openModal} onClose={handleCancel}>
        <DialogTitle>Select Date Range</DialogTitle>
        <DialogContent>
          <DateRange
            editableDateInputs={true}
            onChange={handleCustomSelect}
            moveRangeOnFirstSelection={false}
            ranges={[customRange]}
            direction="vertical"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleApply}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Invoice;
