import { Box, Stack, Link, Badge, IconButton } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CommonCheckbox } from "../../common/fields/index";
import ReusableTable from "../../common/Table/ReusableTable";
import CommonButton from "../../common/NDE-Button";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";
import ActionBar from "../../common/NDE-ActionBar";
import CommonSearchBar from "../../common/fields/NDE-SearchBar";
import { useDeletePayment, usePaymentList } from "../../../hooks/payment/payment-hooks";
import CommonDeleteModal from "../../common/NDE-DeleteModal";
import RowActions from "../../common/NDE-CustomMenu";
import CustomPagination from './../../common/Table/TablePagination';
import { useCustomerFilterOptions, useDeleteCustomView, useFilterFields, useUpdateCustomViewFavorite } from "../../../hooks/Custom-view/custom-view-hooks";
import ContactInlineFilter from "../../common/NDE-DynamicFilter";
import DropdownMenu from "../../common/NDE-DropdownFilter";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';




const mapViewsResponse = (response) => {
  if (!response) {
    return { options: [], favorites: [] };
  }

  const {
    default: defaultViews = [],
    custom: customViews = [],
    favorite: favoriteViews = [],
  } = response;

  const mappedDefaults = defaultViews.map((item) => ({
    id: item._id,
    label: item.title,
    group: "public",
    data: item,
  }));

  const mappedCustoms = customViews.map((item) => ({
    id: item._id,
    label: item.title,
    group: "created",
    data: item,
  }));

  return {
    options: [...mappedCustoms, ...mappedDefaults],
    favorites: favoriteViews.map((fav) => fav._id),
  };
};


const statusColorMap = {
  draft: "#9e9e9e",
  authorized: "#2196f3",
  paid: "#4caf50",
  failed: "#f44336",
  refunded: "#607d8b",
  void: "#000000",
  partially_refunded: "#ff9800",
};


const PaymentList = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const pageFromParams = parseInt(searchParams.get("page") || "1", 10);
  const limitFromParams = parseInt(searchParams.get("limit") || "10", 10);
  const paymentFilterRaw = searchParams.get("filter");
  const paymentFilter = paymentFilterRaw && paymentFilterRaw !== "undefined" ? paymentFilterRaw : null;
  const customFiltersFromParams = searchParams.get("customFilters");
  const parsedCustomFilters = useMemo(() => {
    try {
      return customFiltersFromParams
        ? JSON.parse(customFiltersFromParams)
        : [];
    } catch {
      return [];
    }
  }, [customFiltersFromParams]);


  const { data: filterCustom } = useCustomerFilterOptions("payment");
  const rawViewResponse = filterCustom?.entity;

  const { options: filterdata, favorites: initialFavorites } = useMemo(() => {
    return mapViewsResponse(rawViewResponse);
  }, [rawViewResponse]);


  const [page, setPage] = useState(pageFromParams);
  const [limit, setLimit] = useState(limitFromParams);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showInlineFilter, setShowInlineFilter] = useState(false);
  const { data: filterFields } = useFilterFields("payment");
  const fields = filterFields?.data || [];
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const deletePaymentMutation = useDeletePayment();
  const [customFilters, setCustomFilters] = useState(parsedCustomFilters);
  const { data: paymentsData, isLoading } = usePaymentList(
    { filter: paymentFilter, page, limit, search: debouncedSearch, customFilters: customFilters },
    {
      enabled: !!paymentFilter,
    }
  );

  const updateFavoriteMutation = useUpdateCustomViewFavorite();
  const { mutate: removeView } = useDeleteCustomView();
  const [favorites, setFavorites] = useState([]);

  const payments = paymentsData?.data || [];
  const headers = paymentsData?.headers || [];

  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const newParams = {
      filter: currentParams.filter,
      page: currentParams.page || "1",
      limit: currentParams.limit || "10",
      search: debouncedSearch || "",
      sort: currentParams.sort || "",
      customFilters: searchParams.get("customFilters") || "",
    };

    setSearchParams(newParams, { replace: true });
  }, [debouncedSearch, searchParams, setSearchParams]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleDeleteClick = (row) => {
    setDeleteTarget(row?.original);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget?._id) return;

    deletePaymentMutation.mutate(
      { id: deleteTarget._id },
      {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        },
      }
    );
  };

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === payments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(payments.map((row) => row._id));
    }
  };

  const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "-");

  const handleCreatePaymentReceived = () => navigate("new");

  const handleEditPayment = (rowData) => {
    navigate(`edit/${rowData?.original?._id}`)
  };

  const handlePageChange = (newPage) => {
    const newPageNumber = newPage + 1;
    setPage(newPageNumber);

    updateQueryParams({
      page: newPageNumber,
    });
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
    setSearchParams({ filter: paymentFilter, page: 1, limit: newLimit });
  };
  const updateQueryParams = (params) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const updated = { ...currentParams, ...params };

    Object.keys(updated).forEach((key) => {
      if (
        updated[key] === "" ||
        updated[key] == null ||
        updated[key] === "[]"
      ) {
        delete updated[key];
      }
    });

    setSearchParams(updated);
  };


  const handleInlineFilterApply = (rules) => {
    if (!rules || rules?.length === 0) {
      setCustomFilters([]);
      updateQueryParams({ customFilters: null, page: 1 });
      return;
    }

    const formattedFilters = rules.map((rule) => ({
      field: rule.field?.name,
      operator: rule.operator,
      value: rule.value,
    }));

    const encodedFilters = JSON.stringify(formattedFilters);
    setCustomFilters(formattedFilters);

    updateQueryParams({
      customFilters: encodedFilters,
      page: 1,
    });
  };


  useEffect(() => {
    setFavorites(initialFavorites || []);
  }, [initialFavorites]);

  const handleCustomerOptionChange = (view) => {
    if (!view) return;

    updateQueryParams({
      filter: view,
      page: 1,
    });
  };

  const handleFavoriteToggle = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );

    updateFavoriteMutation.mutate({
      module: "payment",
      viewId: id,
    });
  };

  const handleEditFilter = (item) => {
    navigate(`/sales/payments/edit/custom-view/${item?.id}`);
  };


  const handleDeleteFilter = (item) => {
    removeView(
      { module: "payment", viewID: item.id },
    );
  };


  const columns = useMemo(() => {
    const selectColumn = {
      id: "select",
      header: () => (
        <CommonCheckbox
          checked={selectedIds.length === payments.length && payments.length > 0}
          indeterminate={
            selectedIds.length > 0 &&
            selectedIds.length < payments.length
          }
          onChange={toggleSelectAll}
          sx={{ p: 0 }}
          onClick={(e) => e.stopPropagation()}
        />
      ),
      cell: ({ row }) => (
        <CommonCheckbox
          checked={selectedIds.includes(row.original._id)}
          onChange={() => toggleCheckbox(row.original._id)}
          sx={{ p: 0 }}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    };

    const mappedColumns = headers
      .filter((col) => col.is_visible)
      .sort((a, b) => a.display_order - b.display_order)
      .map((col) => ({
        accessorKey: col.accessorKey,
        header: col.header,
        cell: ({ row }) => {
          const value =
            row.original?.[col.accessorKey] ??
            row.original?.originalData?.[col.accessorKey];

          if (col.accessorKey === "user") {
            return (
              <Link
                target="_blank"
                rel="noreferrer"
                color="primary.main"
                underline="hover"
              >
                {capitalize(value)}
              </Link>
            );
          }
          

          if (col.accessorKey === "payment_date" && value) {
            return dayjs(value).format("DD/MM/YYYY");
          }

          if (col.accessorKey === "status") {
            return (
              <Box
                sx={{
                  color: statusColorMap[value],
                  borderRadius: "16px",
                  fontSize: "14px",
                  display: "inline-block",
                  fontWeight: 400,
                  textTransform: "uppercase"
                }}
              >
                {value}
              </Box>
            );
          }

          if (typeof value === "object" && value !== null) {
            return value.name || value.first_name || "-";
          }

          return value || "-";
        },
      }));

    return [selectColumn, ...mappedColumns];
  }, [paymentsData, selectedIds, payments]);

  const topComponent = (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <CommonSearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch("")}
          placeholder="Search Customers"
          sx={{ width: 200 }}
          height={40}
          mt={0}
          mb={0}
        />
      </Stack>
    </Stack>
  );

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box display="flex" width="100%" sx={{ height: "calc(100vh - 76px)" }}>

        <Box
          sx={{
            width: showInlineFilter ? 300 : 0,
            transition: "width 0.3s ease",
            overflow: "hidden",
            borderRight: showInlineFilter ? "1px solid #eee" : "none",
            flexShrink: 0,
          }}
        >
          {showInlineFilter && (
            <ContactInlineFilter
              initialRules={customFilters}
              onClose={() => setShowInlineFilter(false)}
              onApply={handleInlineFilterApply}
              fields={fields}
            />
          )}
        </Box>
        <Box flex={1} overflow="hidden">
          {selectedIds.length > 0 ? (
            <ActionBar
              selectedCount={selectedIds.length}
              actions={[{ label: "Bulk Delete", color: "error" }]}
              onClose={() => setSelectedIds([])}
            />
          ) : (
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1 }}>
              <Box display="flex" alignItems="center" gap={2}>
                {!showInlineFilter && (
                  <Badge
                    variant="dot"
                    color="error"
                    invisible={!customFilters?.length}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: 9,
                        height: 8,
                        minWidth: 8,
                        padding: "0 4px",
                      },
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        setShowInlineFilter(true);
                      }}
                      size="small"
                      sx={{
                        bgcolor: 'primary.extraLight',
                        width: 32,
                        height: 32,
                        '&:hover': {
                          bgcolor: 'primary.extraLight',
                        },
                      }}
                    >
                      <FilterListRoundedIcon
                        sx={{
                          color: "primary.main",
                          fontSize: 20,
                        }}
                      />
                    </IconButton>
                  </Badge>
                )}

                <DropdownMenu
                  options={filterdata}
                  selectedKey={paymentFilter}
                  onChange={handleCustomerOptionChange}
                  favorites={favorites}
                  onFavoriteToggle={handleFavoriteToggle}
                  width={230}
                  footerAction={{
                    label: "New Custom View",
                    onClick: () => navigate("new-custom-view"),
                    icon: (
                      <AddCircleRoundedIcon
                        fontSize="small"
                        sx={{ color: "primary.main" }}
                      />
                    ),
                  }}
                  onEdit={handleEditFilter}
                  onDelete={handleDeleteFilter}
                />
              </Box>
              <CommonButton label="New Payment" onClick={handleCreatePaymentReceived} />
            </Box>
          )}

          <ReusableTable
            columns={columns}
            data={payments}
            selectedIds={selectedIds}
            topComponent={topComponent}
            onRowClick={(row) => {
              const currentParams = Object.fromEntries(searchParams.entries());
              const queryString = new URLSearchParams(currentParams).toString();
              navigate(`details/${row._id}?${queryString}`);
            }}
            isLoading={isLoading}
            HoverComponent={({ row }) => (
              <RowActions
                rowData={row}
                actions={[
                  {
                    key: "edit",
                    label: "Edit",
                    icon: <img src={Edit} style={{ height: 15 }} />,
                    onClick: handleEditPayment,
                  },
                  {
                    key: "delete",
                    label: "Delete",
                    icon: <img src={Delete} style={{ height: 20 }} />,
                    onClick: handleDeleteClick,
                  },
                ]}
              />
            )}
          />

          <CustomPagination
            count={paymentsData?.totalDocs || 0}
            page={(paymentsData?.page || 1) - 1}
            rowsPerPage={limit}
            onPageChange={(_, newPage) => handlePageChange(newPage)}
            onRowsPerPageChange={(e) => handleLimitChange(Number(e.target.value))}
          />
          <CommonDeleteModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirmDelete={confirmDelete}
            deleting={deletePaymentMutation.isLoading}
            itemType={deleteTarget ? deleteTarget.customername || "Payment" : "Payment"}
            title="Payment"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentList;