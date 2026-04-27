import { useState, useEffect, useMemo } from "react";
import { Box, TableCell, IconButton, Stack, Typography, Link, Badge } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import CommonButton from "../../common/NDE-Button";
import ReusableTable from "../../common/Table/ReusableTable";
import CommonCheckbox from "../../common/fields/NDE-Checkbox";
import ActionBar from "../../common/NDE-ActionBar";
import CustomPagination from "../../common/Table/TablePagination";
import CommonDateRange from "../../common/NDE-DateRange";
import CommonDeleteModal from "../../common/NDE-DeleteModal";
import SubscriptionForm from "./Subscription-Create-Edit";
import { useSubscriptions } from "../../../hooks/subscriptions/subscriptions-hooks";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";
import CommonFilter from "../../common/NDE-CommonFilter";
import CommonSearchBar from "../../common/fields/NDE-SearchBar";
import RowActions from "../../common/NDE-CustomMenu";
import { useCustomerFilterOptions, useDeleteCustomView, useFilterFields, useUpdateCustomViewFavorite } from "../../../hooks/Custom-view/custom-view-hooks";
import DropdownMenu from "../../common/NDE-DropdownFilter";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ContactInlineFilter from "../../common/NDE-DynamicFilter";

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

const SubscriptionList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedIds, setSelectedIds] = useState([]);
  const filterRaw = searchParams.get("filter");
  const filterType = filterRaw && filterRaw !== "undefined" ? filterRaw : null;
  const [searchterm, setSearchterm] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit")) || 10);
  const [sort, setSort] = useState(searchParams.get("sort") || "");
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

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showInlineFilter, setShowInlineFilter] = useState(false);
  const [customFilters, setCustomFilters] = useState(parsedCustomFilters);
  const [favorites, setFavorites] = useState([]);
  const { data: filterCustomer } = useCustomerFilterOptions("subscription");
  const { mutate: removeView } = useDeleteCustomView();
  const updateFavoriteMutation = useUpdateCustomViewFavorite();

  const { data: filterFields } = useFilterFields("subscription");
  const fields = filterFields?.data || [];
  const rawViewResponse = filterCustomer?.entity;

  const { options: filterdata, favorites: initialFavorites } = useMemo(() => {
    return mapViewsResponse(rawViewResponse);
  }, [rawViewResponse]);


  useEffect(() => {
    setFavorites(initialFavorites || []);
  }, [initialFavorites]);

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

  const { data, isLoading } = useSubscriptions({
    filter: filterType,
    page,
    limit,
    searchTerm: searchterm,
    sort,
    customFilters: customFilters
  },
    {
      enabled: !!filterType,
    }

  );

  const subscriptions = data?.data || [];
  const headers = data?.headers || [];


  const toggleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const toggleSelectAll = () => {
    if (selectedIds.length === subscriptions.length) setSelectedIds([]);
    else setSelectedIds(subscriptions.map((row) => row._id));
  };

  const handleNew = () => {
    navigate("new")
  };
  const handleEdit = () => {

  };

  const handleDelete = (row) => {
    setDeleteTarget(row);
    setDeleteModalOpen(true);
  };

  const handleSortChange = (columnId) => {
    let direction = "asc";
    if (sort.replace("-", "") === columnId)
      direction = sort.startsWith("-") ? "asc" : "desc";
    const newSort = direction === "desc" ? `-${columnId}` : columnId;
    setSort(newSort);
    updateQueryParams({ sort: newSort });
  };


  const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "-");

  const handleFavoriteToggle = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );

    updateFavoriteMutation.mutate({
      module: "subscription",
      viewId: id,
    });
  };

  const handleEditFilter = (item) => {
    navigate(`/sales/subscriptions/edit/custom-view/${item?.id}`);
  };


  const handleDeleteFilter = (item) => {
    removeView(
      { module: "subscription", viewID: item.id },
    );
  };


  const handleCustomerOptionChange = (view) => {
    if (!view) return;

    updateQueryParams({
      filter: view,
      page: 1,
    });
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

  const columns = useMemo(() => {
    // Checkbox column
    const selectionColumn = {
      id: "select",
      header: () => (
        <CommonCheckbox
          name="selectAll"
          checked={selectedIds?.length === subscriptions?.length && subscriptions?.length > 0}
          indeterminate={selectedIds?.length > 0 && selectedIds?.length < subscriptions?.length}
          onChange={toggleSelectAll}
          sx={{ p: 0 }}
        />
      ),
      cell: ({ row }) => (
        <TableCell onClick={(e) => e.stopPropagation()} sx={{ p: 0, border: "none" }}>
          <CommonCheckbox
            checked={selectedIds.includes(row.original._id)}
            onChange={() => toggleCheckbox(row.original._id)}
            sx={{ p: 0 }}
          />
        </TableCell>
      ),
    };

    const mappedColumns = headers
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

          if (col.accessorKey === "totalAmount") {
            return new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(value ?? 0);
          }

          if (col.accessorKey === "startDate" || col.accessorKey === "endDate") {
            return value ? new Date(value).toLocaleDateString() : "-";
          }
          return value ?? "-";
        },
      }));

    return [selectionColumn, ...mappedColumns];
  }, [headers, subscriptions, selectedIds]);

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
          onChange={setSearchterm}
          onClear={() => setSearchterm("")}
          placeholder="Search subscription..."
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
            <ActionBar selectedCount={selectedIds.length} onClose={() => setSelectedIds([])} />
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
                p: 1
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
                  selectedKey={filterType}
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
              <CommonButton onClick={handleNew} label="New Subscription" />
            </Box>
          )}

          <ReusableTable
            columns={columns}
            data={subscriptions}
            selectedIds={selectedIds}
            onRowClick={(row) => {
              const currentParams = Object.fromEntries(searchParams.entries());
              const queryString = new URLSearchParams(currentParams).toString();
              navigate(`/sales/subscriptions/details/${row._id}?${queryString}`);
            }}
            isLoading={isLoading}
            sortableColumns={["billing_cycle", "status", "price", "start_date", "end_date", "name", "planName"]}
            onSortChange={handleSortChange}
            topComponent={topComponent}
            HoverComponent={({ row }) => (
              <RowActions
                rowData={row.original}
                actions={[
                  { key: "edit", label: "Edit", icon: <img src={Edit} style={{ height: 15 }} />, onClick: handleEdit },
                  { key: "delete", label: "Delete", icon: <img src={Delete} style={{ height: 20 }} />, onClick: handleDelete },
                ]}
              />
            )}
          />

          <CustomPagination
            count={data?.totalDocs || 0}
            page={page - 1}
            rowsPerPage={limit}
            onPageChange={(_, newPage) => {
              const updatedPage = newPage + 1;
              setPage(updatedPage);
              updateQueryParams({ page: updatedPage });
            }}
            onRowsPerPageChange={(e) => {
              const newLimit = Number(e.target.value);
              setLimit(newLimit);
              setPage(1);
              updateQueryParams({ limit: newLimit, page: 1 });
            }}
          />


          <CommonDeleteModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            itemType={deleteTarget ? `${deleteTarget.name}` : "Subscription"}
            title="Subscription"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SubscriptionList;
