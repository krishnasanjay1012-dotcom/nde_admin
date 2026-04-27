import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Typography, IconButton, TableCell, Stack } from "@mui/material";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import CustomPagination from "../../../components/common/Table/TablePagination";
import Edit from "../../../assets/icons/edit.svg";
import {
  useBulkMapGSuiteTransactions,
  useGSuiteTransactions,
} from "../../../hooks/payment/payment-hooks";
import GSuiteUpload from "./g-suite-upload";
import CommonSearchBar from "../../common/fields/NDE-SearchBar";
import EditGSuiteDrawer from "./g-suite-tansactions-edit";
import CommonCheckbox from "../../../components/common/fields/NDE-Checkbox";
import ActionBar from "../../../components/common/NDE-ActionBar";
import CommonDialog from "../../../components/common/NDE-Dialog";
import CustomerSelector from "./Customer-Bulk-Move";
import GSuiteHistory from "./g-suite-history";
import CommonSelect from "../../common/fields/NDE-Select";
import CommonDateRange from "../../common/NDE-DateRange";
import { addDays } from "date-fns";
import CommonFilter from "../../common/NDE-CommonFilter";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};


const GSuiteTransactions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 10);
  const [search, setSearch] = useState(searchParams.get("searchTerm") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [historyRow, setHistoryRow] = useState(null);


  const filterType = searchParams.get("filter") || "all";
  const start_date = searchParams.get("start_date") || "";
  const end_date = searchParams.get("end_date") || "";

  const [openFilter, setOpenFilter] = useState(false);
  const [appliedRange, setAppliedRange] = useState(null);
  const [tempRange, setTempRange] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: "selection",
  });

  const { mutate: bulkMapTransactions } = useBulkMapGSuiteTransactions();

  const updateQueryParams = (updates) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([k, v]) => {
      if (v === "" || v === null || v === undefined) params.delete(k);
      else params.set(k, v);
    });

    setSearchParams(params);
  };

  const customerOptions = [
    { label: "All", value: "all" },
    { label: "Unassigned", value: "unassigned" },
    { label: "Assigned", value: "assigned" },
    { label: "Custom Date", value: "custom" },
  ];

  const handleCustomerOptionChange = (val) => {
    if (val === "custom") {
      setOpenFilter(true);
      setTempRange(
        appliedRange || {
          startDate: new Date(),
          endDate: addDays(new Date(), 7),
          key: "selection",
        }
      );
    } else {
      updateQueryParams({
        filter: val,
        page: 1,
        start_date: "",
        end_date: "",
      });
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page || "");
    params.set("limit", limit || "");
    params.set("searchTerm", debouncedSearch || "");
    params.set("sort", sort || "");
    params.set("filter", filterType || "");
    params.set("start_date", start_date || "");
    params.set("end_date", end_date || "");
    setSearchParams(params);
  }, [
    page,
    limit,
    debouncedSearch,
    sort,
    filterType,
    start_date,
    end_date,
    setSearchParams,
  ]);

  const { data, isLoading } = useGSuiteTransactions({
    query: debouncedSearch,
    sort,
    page,
    limit,
    filter: filterType,
    start_date,
    end_date,
  });

  const transactions = data?.data?.docs || [];
  const pagination = data?.data || {};

  const tableData = useMemo(
    () =>
      transactions.map((item) => ({
        _id: item?._id,
        domain: item?.domain_name || "-",
        subscription: item?.subscription || "-",
        description: item?.description || "-",
        interval: item?.interval || "-",
        quantity: item?.quantity || "-",
        customer: `${item?.clientUser?.first_name || ""} ${item?.clientUser?.last_name || ""}`.trim() || "-",
        customerId: item?.customer?._id || "-",
        order: item?.order_name || "-",
        startDate: formatDate(item?.start_date),
        endDate: formatDate(item?.end_date),
        invoiceNumber: item?.invoice_number || "-",
        invoiceDate: formatDate(item?.invoice_date),
        amount: item?.amount || "-",
        original: item,
      })),
    [transactions]
  );


  const toggleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === transactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(transactions.map((row) => row._id));
    }
  };

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setDrawerOpen(true);
  };

  const handleSortChange = (column, direction) => {
    const newSort = direction === "asc" ? column : `-${column}`;
    setSort(newSort);
  };

  const confirmDelete = async () => {
    if (!selectedRow) return;
    try {
      console.log("Delete transaction _id:", selectedRow._id);
    } catch (err) {
      console.error("Error deleting entry:", err);
    } finally {
      setDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };

  const handleBulkMove = () => {
    if (selectedIds.length === 0) return;
    setDialogOpen(true);
  };

  const handleDetails = (row) => {
    setHistoryRow(row);
    setHistoryDrawerOpen(true);
  };

  const columns = [
    {
      id: "select",
      header: () => (
        <CommonCheckbox
          name="selectAll"
          checked={
            selectedIds.length === transactions.length && transactions.length > 0
          }
          indeterminate={
            selectedIds.length > 0 &&
            selectedIds.length < transactions.length
          }
          onChange={toggleSelectAll}
          sx={{ p: 0 }}
        />
      ),
      cell: ({ row }) => (
        <TableCell
          onClick={(e) => e.stopPropagation()}
          sx={{ p: 0, border: "none" }}
        >
          <CommonCheckbox
            name={`row-${row.original._id}`}
            checked={selectedIds.includes(row.original._id)}
            onChange={() => toggleCheckbox(row.original._id)}
            sx={{ p: 0 }}
          />
        </TableCell>
      ),
    },
    {
      accessorKey: "customer",
      header: "customer",
      cell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            maxWidth: 180,
            overflow: "hidden",
          }}
        >
          <Typography
            sx={{
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={row.original.customer}
          >
            {row.original.customer}
          </Typography>
          {selectedIds.length === 0 && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row.original);
              }}
              size="small"
              sx={{
                flexShrink: 0,
                padding: 0.5,
              }}
            >
              <img src={Edit} alt="Edit" style={{ height: 14 }} />
            </IconButton>
          )}
        </Box>
      ),
    },
    { accessorKey: "domain", header: "Domain" },
    { accessorKey: "subscription", header: "Subscription" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "interval", header: "Interval" },
    { accessorKey: "order", header: "Order Name" },
  ];

  const handleBulkMoveSubmit = () => {
    if (!selectedCustomer || selectedIds.length === 0) return;

    const payload = selectedIds.map((transactionId) => ({
      transactionId,
      user: selectedCustomer.value,
    }));

    bulkMapTransactions(payload, {
      onSuccess: () => {
        console.log("Transactions moved successfully");
        setSelectedIds([]);
        setSelectedCustomer(null);
        setDialogOpen(false);
      },
      onError: (err) => {
        console.error("Error moving transactions:", err);
      },
    });
  };

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
          placeholder="Search orders..."
          sx={{ width: 200 }}
          height={40}
          mt={0}
          mb={0}
        />
        <CommonFilter
          menuOptions={customerOptions}
          value={filterType}
          onChange={handleCustomerOptionChange}
        />
      </Stack>

    </Stack>
  );

  return (
    <Box>
      {selectedIds.length > 0 ? (
        <ActionBar
          selectedCount={selectedIds.length}
          actions={[{ label: "Move Customer", onClick: handleBulkMove }]}
          onClose={() => setSelectedIds([])}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            p: 1
          }}
        >
          <Typography variant="h4">
            G-Suite Transactions
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: "auto" }}>
            <GSuiteUpload />
          </Box>
        </Box>
      )}

      {/* Table */}
      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        sortableColumns={["domain", "subscription", "amount", "invoiceDate"]}
        onSortChange={handleSortChange}
        selectedIds={selectedIds}
        onRowClick={(row) => { handleDetails(row) }}
        topComponent={topComponent}

      />

      <CustomPagination
        count={pagination.totalDocs || 0}
        page={(pagination.page || 1) - 1}
        rowsPerPage={limit}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);
        }}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={false}
        itemType="Transaction"
      />

      {/* Edit Drawer */}
      {selectedRow && (
        <EditGSuiteDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          transaction={selectedRow?.original}
          mode="edit"
        />
      )}

      {/* Move Customer */}
      <CommonDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Move Customer"
        submitLabel="Move"
        onSubmit={handleBulkMoveSubmit}
        submitDisabled={selectedIds.length === 0 || !selectedCustomer}
        width={400}
      >
        <CustomerSelector
          value={selectedCustomer?.original}
          onChange={setSelectedCustomer}
        />
      </CommonDialog>

      <GSuiteHistory
        open={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        domain={historyRow?.original?.domain_name}
      />

      <CommonDateRange
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        tempRange={tempRange}
        onChange={(ranges) => setTempRange(ranges.selection)}
        onApply={() => {
          setAppliedRange(tempRange);
          updateQueryParams({
            filter: "custom",
            start_date: tempRange.startDate.toISOString(),
            end_date: tempRange.endDate.toISOString(),
            page: 1,
          });
          setOpenFilter(false);
        }}
      // title="Customer Filter by Date Range"
      />
    </Box>
  );
};

export default GSuiteTransactions;
