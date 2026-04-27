import { useState, useEffect, useMemo } from "react";
import {
  Badge,
  Box,
  IconButton,
  Link,
  Stack,
  TableCell,
  Typography,
} from "@mui/material";
import CommonButton from "../../../components/common/NDE-Button";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonCheckbox from "../../../components/common/fields/NDE-Checkbox";
import CommonSelect from "../../../components/common/fields/NDE-Select";
import CommonSearchBar from "../../../components/common/fields/NDE-SearchBar";
import ActionBar from "../../../components/common/NDE-ActionBar";
import CustomPagination from "../../../components/common/Table/TablePagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useBulkDeleteInvoice,
  useDeleteInvoice,
  useInvoiceOverview,
  useInvoices,
  useOverviewCurrencyList,
} from "../../../hooks/sales/invoice-hooks";
import RowActions from "../../../components/common/NDE-CustomMenu";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import PaymentSummary from "./PaymentSummary";
import ContactInlineFilter from "../../../components/common/NDE-DynamicFilter";
import DropdownMenu from "../../../components/common/NDE-DropdownFilter";
import {
  useCustomerFilterOptions,
  useDeleteCustomView,
  useFilterFields,
  useUpdateCustomViewFavorite,
} from "../../../hooks/Custom-view/custom-view-hooks";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import MoreActionsMenu from "../../../components/common/NDE-MoreActionsMenu"


const statusColorMap = {
  open: "#2196f3",
  draft: "#9e9e9e",
  sent: "#2196f3",
  viewed: "#00bcd4",
  partially_paid: "#ff9800",
  paid: "#4caf50",
  overdue: "#f44336",
  void: "#607d8b",
  deleted: "#000000",
  pending_approval: "#ffc107",
  approved: "#2e7d32",
  written_off: "#795548"
};

const customerMenuItems = [
  {
    label: "Sort by",
    icon: <SortRoundedIcon fontSize="small" />,
    children: [
      { value: "name", label: "Name" },
      { value: "invoiceNo", label: "Invoice No" },
      { value: "invoiceDate", label: "Invoice Date" },
      { value: "totalAmount", label: "Total Amount" },

    ],
  },
  {
    label: "Import",
    icon: <FileDownloadOutlinedIcon fontSize="small" />,
    children: [{ label: "Import Invoice" }],
  },
  {
    label: "Export",
    icon: <FileUploadOutlinedIcon fontSize="small" />,
    children: [
      { label: "Export Invoice" },
    ],
  },
];

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

const Invoice = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedIds, setSelectedIds] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const paymentFilterRaw = searchParams.get("filter");
  const status =
    paymentFilterRaw &&
      paymentFilterRaw !== "undefined" &&
      paymentFilterRaw !== "null"
      ? paymentFilterRaw
      : null;
  const search = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "";
  const customFiltersFromParams = searchParams.get("customFilters");
  const parsedCustomFilters = useMemo(() => {
    try {
      return customFiltersFromParams ? JSON.parse(customFiltersFromParams) : [];
    } catch {
      return [];
    }
  }, [customFiltersFromParams]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [showInlineFilter, setShowInlineFilter] = useState(false);
  const [customFilters, setCustomFilters] = useState(parsedCustomFilters);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, refetch } = useInvoices(
    {
      filter: status,
      searchTerm: debouncedSearch,
      page,
      limit,
      sort: sortParam,
      customFilters: customFilters,
    },
    {
      enabled: !!status,
    },
  );

  const { data: currencyResponse } = useOverviewCurrencyList();
  const { data: selectedInvoiceData } = useInvoiceOverview(selectedCurrency);

  const { data: filterCustom } = useCustomerFilterOptions("invoice");
  const rawViewResponse = filterCustom?.entity;

  const { options: filterdata, favorites: initialFavorites } = useMemo(() => {
    return mapViewsResponse(rawViewResponse);
  }, [rawViewResponse]);

  const { data: filterFields } = useFilterFields("invoice");
  const fields = filterFields?.data || [];

  const CurrencyOptions =
    currencyResponse?.data?.map((item) => ({
      label: item.code,
      value: item._id,
      isDefault: item.isdefault,
    })) || [];

  const headers = data?.headers || [];
  const invoices = data?.data || [];

  useEffect(() => {
    const defaults = {
      page,
      limit,
      filter: status,
      search,
      sort: sortParam,
    };
    const missingParams = Object.entries(defaults).some(
      ([key]) => !searchParams.get(key),
    );
    if (missingParams) setSearchParams(defaults);
  }, []);

  useEffect(() => {
    if (!status) return;

    refetch({
      filter: status,
      search: debouncedSearch,
      page,
      limit,
      sort: sortParam,
    });
  }, [status, page, limit, debouncedSearch, sortParam, refetch]);

  const deleteMutation = useDeleteInvoice();

  const bulkDeleteMutation = useBulkDeleteInvoice();

  const updateFavoriteMutation = useUpdateCustomViewFavorite();
  const { mutate: removeView } = useDeleteCustomView();
  const [favorites, setFavorites] = useState([]);

  const handleRowClick = (row) => {
    if (!row?._id) return;
    const currentParams = Object.fromEntries(searchParams.entries());
    const paramsWithId = { ...currentParams };
    const queryString = new URLSearchParams(paramsWithId).toString();
    navigate(`/sales/invoices/details/${row._id}?${queryString}`);
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

  const handleSearchChange = (value) =>
    updateQueryParams({ search: value, page: 1 });

  const handlePageChange = (newPage) =>
    updateQueryParams({ page: newPage + 1 });
  const handleLimitChange = (newLimit) =>
    updateQueryParams({ limit: newLimit, page: 1 });

  const handleSortChange = (columnId) => {
    let direction = "asc";
    if (sortParam.replace("-", "") === columnId)
      direction = sortParam.startsWith("-") ? "asc" : "desc";
    const newSort = direction === "desc" ? `-${columnId}` : columnId;
    updateQueryParams({ sort: newSort });
  };

  const handleEdit = (row) => {
    navigate(`/sales/invoices/edit/${row._id}`);
  };

  const handleDelete = (row) => {
    setDeleteTarget(row);
    setDeleteModalOpen(true);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const payload = { invoices: selectedIds };
    bulkDeleteMutation.mutate(payload, {
      onSuccess: () => setSelectedIds([]),
      onError: (err) => console.error(err),
    });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget._id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        },
      });
    }
  };

  const toggleCheckbox = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === invoices.length
        ? []
        : invoices.map((row) => row._id),
    );
  };

  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
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
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );

    updateFavoriteMutation.mutate({
      module: "invoice",
      viewId: id,
    });
  };

  const handleEditFilter = (item) => {
    navigate(`/sales/invoices/edit/custom-view/${item?.id}`);
  };

  const handleDeleteFilter = (item) => {
    removeView({ module: "invoice", viewID: item.id });
  };

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "-";

  useEffect(() => {
    if (CurrencyOptions.length > 0 && !selectedCurrency) {
      const defaultCurrency = CurrencyOptions.find(
        (opt) => opt.isDefault === true
      )?.value;

      if (defaultCurrency) {
        setSelectedCurrency(defaultCurrency);
      }
    }
  }, [CurrencyOptions, selectedCurrency]);

  const columns = useMemo(() => {
    const dynamicColumns = headers
      .filter((col) => col.is_visible)
      .sort((a, b) => a.display_order - b.display_order)
      .map((col) => ({
        accessorKey: col.accessorKey,
        header: col.header,
        cell: ({ row }) => {
          const value = row.original?.[col.accessorKey];
          if (col.accessorKey === "name") {
            return (
              <Link
                href={row.original?.link}
                target="_blank"
                rel="noreferrer"
                color="primary.main"
                underline="hover"
              >
                {value ? capitalize(value) : "-"}
              </Link>
            );
          }

          if (col.accessorKey === "invoiceDate") {
            return value ? new Date(value).toLocaleDateString("en-IN") : "-";
          }

          if (col.accessorKey === "status") {
            const status = row.original?.status;

            return (
              <Typography
                sx={{
                  borderRadius: 1,
                  fontSize: 12,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  color: statusColorMap[status] || "#e0e0e0",
                  display: "inline-block",
                  minWidth: 80,
                }}
              >
                {status?.replaceAll("_", " ") || "-"}
              </Typography>
            );
          }

          return value || "-";
        },
      }));

    return [
      {
        id: "select",
        header: () => (
          <CommonCheckbox
            checked={
              invoices.length > 0 &&
              invoices.every((row) => selectedIds.includes(row._id))
            }
            indeterminate={
              invoices.some((row) => selectedIds.includes(row._id)) &&
              !invoices.every((row) => selectedIds.includes(row._id))
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
              checked={selectedIds.includes(row.original._id)}
              onChange={() => toggleCheckbox(row.original._id)}
              sx={{ p: 0 }}
            />
          </TableCell>
        ),
      },
      ...dynamicColumns,
    ];
  }, [headers, invoices, selectedIds]);

  // const topComponent = (
  //   <Stack
  //     direction={{ xs: "column", sm: "row" }}
  //     spacing={2}
  //     alignItems="center"
  //     justifyContent="space-between"
  //   >
  //     {/* Left side: Search + Select */}
  //     <Stack direction="row" spacing={2} alignItems="center">
  //       {/* Search */}
  //       <CommonSearchBar
  //         value={search}
  //         onChange={handleSearchChange}
  //         onClear={() => handleSearchChange("")}
  //         placeholder="Search invoices..."
  //         sx={{ width: 200 }}
  //         height={40}
  //         mt={0}
  //         mb={0}
  //       />
  //     </Stack>
  //   </Stack>
  // );

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
              actions={[
                {
                  label: "Delete",
                  onClick: handleBulkDelete,
                  color: "error",
                },
              ]}
              onClose={() => setSelectedIds([])}
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
              }}
            >
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
                        bgcolor: "primary.extraLight",
                        width: 32,
                        height: 32,
                        "&:hover": {
                          bgcolor: "primary.extraLight",
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
                  selectedKey={status}
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CommonSearchBar
                  value={search}
                  onChange={handleSearchChange}
                  onClear={() => handleSearchChange("")}
                  placeholder="Search invoices..."
                  sx={{ width: 200 }}
                  height={36}
                  mt={0}
                  mb={0}
                />
                <CommonSelect
                  options={CurrencyOptions}
                  mb={0}
                  mt={0}
                  value={selectedCurrency}
                  onChange={handleCurrencyChange}
                  width="100px"
                  height={36}
                  clearable={false}
                />
                {/* <InvoiceUpload /> */}
                <CommonButton
                  label="Create New Invoice"
                  onClick={() => navigate("new-invoice")}
                />
                <MoreActionsMenu
                  items={customerMenuItems}
                  onChange={(data) => {
                    if (data.type === "child" && data.parent === "Sort by") {
                      handleSortChange(data.value);
                    }
                    if (data.type === "parent") {
                      console.log("Parent clicked:", data.label);
                    }
                    if (data.type === "child" && data.parent === "Import" && data.label === "Import Invoice") {
                      navigate('import');
                    }
                  }}
                />
              </Box>
            </Box>
          )}
          <PaymentSummary data={selectedInvoiceData} />
          <ReusableTable
            columns={columns}
            data={invoices}
            selectedIds={selectedIds}
            onRowClick={handleRowClick}
            isLoading={isLoading}
            sortableColumns={["name", "invoiceDate", "totalAmount", "invoiceNo"]}
            onSortChange={handleSortChange}
            // topComponent={topComponent}
            maxHeight="calc(100vh - 280px)"
            HoverComponent={({ row }) => (
              <RowActions
                rowData={row.original}
                actions={[
                  {
                    key: "edit",
                    label: "Edit",
                    icon: <img src={Edit} style={{ height: 15 }} />,
                    onClick: handleEdit,
                  },
                  {
                    key: "delete",
                    label: "Delete",
                    icon: <img src={Delete} style={{ height: 20 }} />,
                    onClick: handleDelete,
                  },
                ]}
              />
            )}
          />

          <CustomPagination
            count={data?.totalDocs || 0}
            page={page - 1}
            rowsPerPage={limit}
            onPageChange={(_, newPage) => handlePageChange(newPage)}
            onRowsPerPageChange={(e) =>
              handleLimitChange(Number(e.target.value))
            }
          />

          <CommonDeleteModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirmDelete={confirmDelete}
            deleting={deleteMutation.isLoading}
            itemType={deleteTarget ? `${deleteTarget?.name}`.trim() : "Invoice"}
            title="Invoice"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Invoice;
