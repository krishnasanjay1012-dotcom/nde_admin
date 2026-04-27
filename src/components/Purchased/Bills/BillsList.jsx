import { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import { useNavigate, useSearchParams } from "react-router-dom";

import CommonButton from "../../common/NDE-Button";
import ReusableTable from "../../common/Table/ReusableTable";
import CommonCheckbox from "../../common/fields/NDE-Checkbox";
import ActionBar from "../../common/NDE-ActionBar";
import CustomPagination from "../../common/Table/TablePagination";
import CommonDeleteModal from "../../common/NDE-DeleteModal";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';

import {
  useBulkDeleteBills,
  useBillsCustomView,
  useDeleteBill,
  useBillCalendarView,
} from "../../../hooks/purchased/bills-hooks";
import dayjs from "dayjs";

import ViewListIcon from "@mui/icons-material/ViewList";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";
import { Badge, IconButton, Stack, Typography, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import RowActions from "../../common/NDE-CustomMenu";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import DropdownMenu from "../../common/NDE-DropdownFilter";
import MoreActionsMenu from "../../common/NDE-MoreActionsMenu"
import ContactInlineFilter from "../../common/NDE-DynamicFilter";

import { useCustomerFilterOptions, useDeleteCustomView, useFilterFields, useUpdateCustomViewFavorite } from "../../../hooks/Custom-view/custom-view-hooks";
import CommonSearchBar from "../../common/fields/NDE-SearchBar";
import CommonCalendar from "../../common/NDE-Calender";
import BillDetailsModal from "./BillDetailsModal";
import BillDetailsPopover from "./BillDetailsModal";
import CommonSelect from "../../common/fields/NDE-Select";
import { useOverviewCurrencyList } from "../../../hooks/sales/invoice-hooks";


const billMenuItems = [
  {
    label: "Sort by",
    icon: <SortRoundedIcon fontSize="small" />,
    children: [
      { value: "name", label: "Name" },
      { value: "email", label: "Email" },
    ],
  },
  {
    label: "Import",
    icon: <FileDownloadOutlinedIcon fontSize="small" />,
    children: [{ label: "Import Bills" }],
  },
  {
    label: "Export",
    icon: <FileUploadOutlinedIcon fontSize="small" />,
    children: [
      { label: "Export Bills" },
      { label: "Export Current View" },
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

const BillsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: filterBills } = useCustomerFilterOptions("bill");
  const updateFavoriteMutation = useUpdateCustomViewFavorite();
  const { mutate: removeView } = useDeleteCustomView();
  const [favorites, setFavorites] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);
  const [showInlineFilter, setShowInlineFilter] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [viewMode, setViewMode] = useState("list");
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const { data: filterFields } = useFilterFields("bill");
  const fields = filterFields?.data || [];
  const rawViewResponse = filterBills?.entity;

  const { options: filterdata, favorites: initialFavorites } = useMemo(() => {
    return mapViewsResponse(rawViewResponse);
  }, [rawViewResponse]);

  useEffect(() => {
    const defaults = {
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 10,
      filter: searchParams.get("filter"),
      search: searchParams.get("search") || "",
      sort: searchParams.get("sort") || "",
      customFilters: searchParams.get("customFilters") || "",
    };

    const missingParams = Object.entries(defaults).some(
      ([key]) => searchParams.get(key) === null
    );

    if (missingParams) {
      setSearchParams(defaults);
    }
  }, [searchParams, setSearchParams]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("");

  const page = parseInt(searchParams.get("page"));
  const limit = parseInt(searchParams.get("limit"));
  const filterType = searchParams.get("filter");
  const searchterm = searchParams.get("search");
  const sortParam = searchParams.get("sort");
  const customFiltersParam = searchParams.get("customFilters");

  const parsedCustomFilters = useMemo(() => {
    try {
      return customFiltersParam
        ? JSON.parse(customFiltersParam)
        : [];
    } catch {
      return [];
    }
  }, [customFiltersParam]);

  useEffect(() => {
    setCustomFilters(parsedCustomFilters);
  }, [parsedCustomFilters]);

  const { data, isLoading } = useBillsCustomView({
    page,
    limit,
    filter: filterType,
    searchTerm: searchterm,
    sort: sortParam,
    customFilters: parsedCustomFilters
  });

  const { data: calendarData } = useBillCalendarView({
    month: currentMonth.month(),
    year: currentMonth.year(),
    filter: "dueDate",
    currency: selectedCurrency,
  });

  const calenderList = calendarData?.dates || [];



  const deleteBillMutation = useDeleteBill();
  const bulkDeleteBillsMutation = useBulkDeleteBills();
  const bills = data?.data || [];
  const headers = data?.headers || [];
  const { data: currencyResponse } = useOverviewCurrencyList();



  const currencyOptions =
    currencyResponse?.data?.map((item) => ({
      label: item.code,
      value: item._id,
      isDefault: item.isdefault,
    })) || [];

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds?.length === bills?.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(bills.map((row) => row._id));
    }
  };

  const handleNew = () => {
    navigate('new');
  };

  const handleEdit = (row) => {
    navigate(`${row._id}/edit`);
  };

  const handleDelete = (row) => {
    setDeleteTarget(row);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteBillMutation.mutate(deleteTarget._id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        },
      });
    }
  };


  const handleBulkDelete = () => {
    if (selectedIds?.length === 0) return;
    const payload = { bills: selectedIds };
    bulkDeleteBillsMutation.mutate(payload, {
      onSuccess: () => setSelectedIds([]),
      onError: (err) => console.error(err),
    });
  };

  const capitalize = (str) =>
    str ? str?.charAt(0).toUpperCase() + str?.slice(1) : "-";

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

  const handleBillOptionChange = (view) => {
    if (!view) return;

    updateQueryParams({
      filter: view,
      page: 1,
    });
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

  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
  };

  useEffect(() => {
    setFavorites(initialFavorites || []);
  }, [initialFavorites]);

  const handleFavoriteToggle = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );

    updateFavoriteMutation.mutate({
      module: "bill",
      viewId: id,
    });
  };

  const handleEditFilter = (item) => {
    navigate(`/bills/edit/custom-view/${item?.id}`);
  };

  const handleDeleteFilter = (item) => {
    removeView(
      { module: "bill", viewID: item.id },
    );
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

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };
useEffect(() => {
  if (currencyOptions.length > 0 && !selectedCurrency) {
    const defaultCurrency = currencyOptions.find(
      (opt) => opt.isDefault === true
    )?.value;

    if (defaultCurrency) {
      setSelectedCurrency(defaultCurrency);
    }
  }
}, [currencyOptions, selectedCurrency]);

  const columns = useMemo(() => {
    const selectionColumn = {
      id: "select",
      header: () => (
        <CommonCheckbox
          name="selectAll"
          checked={
            selectedIds?.length === bills?.length && bills?.length > 0
          }
          indeterminate={
            selectedIds?.length > 0 && selectedIds?.length < bills?.length
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
    };


    const mappedColumns = headers
      .filter((col) => col.is_visible && col.accessorKey !== "last_name")
      .sort((a, b) => a.display_order - b.display_order)
      .map((col) => ({
        accessorKey: col.accessorKey,
        header: col.header,
        cell: ({ row }) => {
          const value = row.original?.[col.accessorKey];

          if (col.accessorKey === "vendor") {
            const vendor = row.original?.vendor || "";


            return (
              <Typography
                sx={{
                  textTransform: "none",
                  fontWeight: 400,
                  color: "primary.main",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 180,
                  letterSpacing: 0.5,
                  "&:hover": {
                    background: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                {capitalize(vendor)}
              </Typography>
            );
          }
          if (col.accessorKey === "dueDate" || col.accessorKey === "billDate") {
            return formatDate(value);
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

          return value ?? "-";
        },

      }));

    return [selectionColumn, ...mappedColumns];
  }, [headers, bills, selectedIds]);

  const topComponent = (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Search */}
        <CommonSearchBar
          value={searchterm}
          onChange={handleSearchChange}
          onClear={() => handleSearchChange("")}
          placeholder="Search Bills"
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

          {selectedIds?.length > 0 ? (
            <ActionBar
              selectedCount={selectedIds?.length}
              actions={[
                // { label: "Move", onClick: handleBulkMove },
                { label: "Bulk Delete", onClick: handleBulkDelete, color: "error" },
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
                width: "100%",
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                {viewMode === "list" ? (
                  <>
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
                      selectedKey={filterType}
                      onChange={handleBillOptionChange}
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
                  </>
                ) : (
                  <Typography variant="h3">Bills</Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {viewMode === "calendar" && (
                  <CommonSelect
                    options={currencyOptions}
                    mb={0}
                    mt={0}
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                    width="100px"
                    height={36}
                    clearable={false}
                  />
                )}
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, newView) => {
                    if (newView !== null) setViewMode(newView);
                  }}
                  size="small"
                  aria-label="view mode"
                  sx={{ height: 36 }}
                >
                  <Tooltip title="List View" placement="bottom">
                    <ToggleButton value="list" aria-label="list view">
                      <ViewListIcon />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="Calendar View" placement="bottom">
                    <ToggleButton value="calendar" aria-label="calendar view">
                      <CalendarMonthIcon />
                    </ToggleButton>
                  </Tooltip>
                </ToggleButtonGroup>

                <CommonButton onClick={handleNew} label="New Bill" />

                {viewMode === "list" ? (
                  <MoreActionsMenu
                    items={billMenuItems}
                    onChange={(data) => {
                      if (data.type === "child" && data.parent === "Sort by") {
                        handleSortChange(data.value);
                      }
                      if (data.type === "parent") {
                        console.log("Parent clicked:", data.label);
                      }
                      if (data.type === "child" && data.parent === "Import" && data.label === "Import Bills") {
                        navigate('import');
                      }
                    }}
                  />
                ) : (
                  null
                )}
              </Box>
            </Box>
          )}
          {viewMode === "list" ? (
            <>
              <ReusableTable
                columns={columns}
                data={bills}
                selectedIds={selectedIds}
                onRowClick={(row) => {
                  const currentParams = Object.fromEntries(searchParams.entries());
                  const queryString = new URLSearchParams(currentParams).toString();
                  navigate(`details/${row._id}?${queryString}`);
                }}
                isLoading={isLoading}
                sortableColumns={headers
                  ?.filter((h) => h.sort_direction !== null)
                  .map((h) => h.accessorKey) || []}
                onSortChange={handleSortChange}
                topComponent={topComponent}
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
                    ]} />
                )} />
              <CustomPagination
                count={data?.totalDocs || 0}
                page={page - 1}
                rowsPerPage={limit}
                onPageChange={(_, newPage) => handlePageChange(newPage)}
                onRowsPerPageChange={(e) => handleLimitChange(Number(e.target.value))} />
            </>
          ) : (
            <Box sx={{ mt: 1, mx: 1 }}>
              <Box>
                <CommonCalendar
                  value={currentMonth}
                  onChange={(newDate) => setCurrentMonth(newDate)}
                  calendarList={calenderList}
                  renderDayContent={(day) => {
                    const formatted = day.format("M/D/YYYY");

                    const daySummary = calenderList.find(
                      item => item.formattedDate === formatted
                    );

                    return (
                      <Stack spacing={0.5} sx={{ width: '100%', mt: 1, px: 0.5, alignItems: 'flex-start' }}>
                        {daySummary && daySummary?.bills?.length > 0 ? (
                          <Tooltip
                            title={
                              <Box>
                                <Typography fontSize={12}>
                                  Total Count : {daySummary.bills.length}
                                </Typography>
                              </Box>
                            }
                            arrow
                            placement="top"
                          >
                            <Box
                              onClick={(e) => {
                                setAnchorEl(e.currentTarget);
                                setSelectedDayData(daySummary);
                              }}
                              sx={{
                                fontSize: '0.7rem',
                                p: 0.5,
                                borderRadius: 1,
                                width: '100%',
                                textAlign: 'left',
                                cursor: 'pointer',
                                color: '#FF5A3C',
                                '&:hover': { opacity: 0.8 },
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Typography variant="body1" fontSize={14}>
                                {daySummary.dateFormattedAmount}
                              </Typography>
                            </Box>
                          </Tooltip>
                        ) : null}

                      </Stack>
                    );
                  }}
                />
              </Box>
            </Box>
          )}

          <CommonDeleteModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirmDelete={confirmDelete}
            deleting={deleteBillMutation.isLoading}
            itemType={
              deleteTarget
                ? `${deleteTarget.first_name || ""} ${deleteTarget.last_name || ""}`.trim()
                : "Bill"
            }
            title="Bill"
          />

          <BillDetailsPopover
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            data={selectedDayData}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BillsList;