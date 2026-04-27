import { useState, useEffect } from "react";
import { Box, IconButton, Link, Stack, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReusableTable from "../../components/common/Table/ReusableTable";
import CommonSelect from "../../components/common/fields/NDE-Select";
import CommonSearchBar from "../../components/common/fields/NDE-SearchBar";
import CustomPagination from "../../components/common/Table/TablePagination";
import { useAllOrders, useDeleteOrder } from "../../hooks/order/order-hooks";
import CommonDeleteModal from "../../components/common/NDE-DeleteModal";
import CommonButton from "../common/NDE-Button";
import CommonDateRange from "../common/NDE-DateRange";
import { addDays } from "date-fns";
import CommonDrawer from "../common/NDE-Drawer";
import OrderDeatils from "../../pages/Order/Order-Deatils";
import Delete from "../../assets/icons/delete.svg";
import CommonFilter from "../common/NDE-CommonFilter";
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import RowActions from "../common/NDE-CustomMenu";



const OrdersList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [status, setStatus] = useState(searchParams.get("filter") || "success");
  const [dateFilter, setDateFilter] = useState(searchParams.get("date_filter") || "all");
  const [customRange, setCustomRange] = useState({
    startDate: searchParams.get("start_date")
      ? new Date(searchParams.get("start_date"))
      : new Date(),
    endDate: searchParams.get("end_date")
      ? new Date(searchParams.get("end_date"))
      : addDays(new Date(), 7),
    key: "selection",
  });
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 10);
  const [search, setSearch] = useState(searchParams.get("searchTerm") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sort, setSort] = useState(searchParams.get("sort") || "");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const deleteOrderMutation = useDeleteOrder();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const params = {
      page,
      limit,
      searchTerm: debouncedSearch,
      filter: status,
      date_filter: dateFilter,
      sort,
    };
    if (dateFilter === "custom") {
      params.start_date = customRange.startDate.toISOString();
      params.end_date = customRange.endDate.toISOString();
    }
    setSearchParams(params);
  }, [page, limit, debouncedSearch, status, dateFilter, customRange, sort, setSearchParams]);

  const { data, isLoading, refetch } = useAllOrders({
    page,
    limit,
    searchTerm: debouncedSearch,
    filter: status,
    date_filter: dateFilter,
    sort,
    start_date: dateFilter === "custom" ? customRange.startDate.toISOString() : "",
    end_date: dateFilter === "custom" ? customRange.endDate.toISOString() : "",
  });

  const orders = data?.data || [];

  useEffect(() => {
    refetch();
  }, [status, dateFilter, page, limit, debouncedSearch, customRange, sort, refetch]);

  const handleDelete = (row) => {
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedRow) {
      deleteOrderMutation.mutate(selectedRow._id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedRow(null);
        },
      });
    }
  };

  const handleDetails = (row) => {
    setSelectedOrderId(row._id);
    setViewOpen(true);
  };

  const handleCustomSelect = (ranges) => {
    setCustomRange(ranges.selection);
  };

  const handleApply = () => {
    setDateFilter("custom");
    setOpenModal(false);
    setPage(1);
  };

  const handleCancel = () => setOpenModal(false);

  const handleCreateNewOrder = () => navigate("/sales/orders/create");

  const handleSortChange = (column) => {
    if (sort === column) {
      setSort(`-${column}`);
    } else if (sort === `-${column}`) {
      setSort("");
    } else {
      setSort(column);
    }
    setPage(1);
  };
  const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "-");

  const columns = [
    {
      accessorKey: "clientName",
      header: "Client Name",
      cell: ({ row }) => (
         <Link
          href={row.original.link}
          target="_blank"
          rel="noreferrer"
          color="primary.main"
          underline="hover"
        >
          {capitalize(row.original?.clientName)}
        </Link>
      ),
    },
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => row.original.id || "-",
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString("en-IN")
          : "-",
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment Status",
      cell: ({ row }) => row.original.paymentStatus || "-",
    },
    {
      accessorKey: "orderStatus",
      header: "Status",
      cell: ({ row }) => row.original.orderStatus || "-",
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) =>
        row.original.total
          ? new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
          }).format(Number(row.original.total))
          : "-",
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
          placeholder="Search orders..."
          height={40}
          mt={0}
          mb={0}
        />
        <CommonFilter
          menuOptions={[
            { label: "All Orders", value: "all" },
            { label: "Success", value: "success" },
            { label: "Failed", value: "failed" },
            { label: "Pending", value: "pending" },
          ]}
          value={status}
          onChange={setStatus}
          mb={1}
        />
      </Stack>

      {/* Right side: Calendar */}
      <Box display="flex" alignItems="center" gap={1}>
        <CommonFilter
          icon={<CalendarMonthRoundedIcon fontSize="small" />}
          menuOptions={[
            { label: "This Month", value: "this_month" },
            { label: "Last Month", value: "last_month" },
            { label: "Last Week", value: "last_week" },
            { label: "All", value: "all" },
            { label: "Custom", value: "custom" },
          ]}
          label="Date Range"
          value={dateFilter}
          onChange={(value) => {
            if (value === "custom") {
              setOpenModal(true);
            } else {
              setDateFilter(value);
            }
          }}

        />
      </Box>

    </Stack>
  );

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1 }}>
        <Typography variant="h4">
          Orders
        </Typography>
        <CommonButton label="Create New Order" onClick={handleCreateNewOrder} />
      </Box>

      {/* Table */}
      <ReusableTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        sortableColumns={["name", "createdAt", "total"]}
        sortBy={sort}
        onSortChange={handleSortChange}
        // onRowClick={(row) => handleDetails(row)}
        onRowClick={(row) => {
          const currentParams = Object.fromEntries(searchParams.entries());
          const paramsWithId = { ...currentParams };
          const queryString = new URLSearchParams(paramsWithId).toString();
          navigate(`/sales/orders/details/${row._id}?${queryString}`);
        }}
        topComponent={topComponent}
        HoverComponent={({ row }) => (
          <RowActions
            rowData={row.original}
            actions={[
              { key: "delete", label: "Delete", icon: <img src={Delete} style={{ height: 20 }} />, onClick: handleDelete },
            ]}
          />
        )}
      />

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
        itemType={selectedRow?.name}
        title={"Order"}
      />

      {/* Date Range Picker */}
      <CommonDateRange
        open={openModal}
        onClose={handleCancel}
        onApply={handleApply}
        tempRange={customRange}
        onChange={handleCustomSelect}
        title="Select Date Range"
      />

      {/* View Drawer */}
      <CommonDrawer
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        anchor="right"
        title="Order Details"
        width={900}
      >
        <OrderDeatils orderId={selectedOrderId} />
      </CommonDrawer>
    </Box>
  );
};

export default OrdersList;
