import { useState, useEffect, useMemo, useRef } from "react";
import { Badge, Box, IconButton, Stack, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReusableTable from "../../components/common/Table/ReusableTable";
import CommonSearchBar from "../../components/common/fields/NDE-SearchBar";
import CustomPagination from "../../components/common/Table/TablePagination";
import CommonDeleteModal from "../../components/common/NDE-DeleteModal";
import { usePurchasedProductList } from "../../hooks/reports/reports-hooks";
import ContactInlineFilter from "../../components/common/NDE-DynamicFilter";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import DropdownMenu from "../../components/common/NDE-DropdownFilter";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import {
  useCustomerFilterOptions,
  useDeleteCustomView,
  useFilterFields,
  useUpdateCustomViewFavorite,
} from "../../hooks/Custom-view/custom-view-hooks";

const mapViewsResponse = (response) => {
  if (!response) return { options: [], favorites: [] };

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

const AppList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showInlineFilter, setShowInlineFilter] = useState(false);


  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    let updated = false;

    if (!params.has("page")) {
      params.set("page", "1");
      updated = true;
    }
    if (!params.has("limit")) {
      params.set("limit", "10");
      updated = true;
    }
    if (!params.has("search")) {
      params.set("search", "");
      updated = true;
    }
    if (!params.has("sort")) {
      params.set("sort", "");
      updated = true;
    }

    if (updated) setSearchParams(params);
  }, [searchParams, setSearchParams]);


  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const searchTerm = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "";
  const filter = searchParams.get("filter") || null;

  const customFiltersFromParams = searchParams.get("customFilters");

  const parsedCustomFilters = useMemo(() => {
    try {
      return customFiltersFromParams ? JSON.parse(customFiltersFromParams) : [];
    } catch {
      return [];
    }
  }, [customFiltersFromParams]);


  const [search, setSearch] = useState(searchTerm);
  const [customFilters, setCustomFilters] = useState(parsedCustomFilters);
  const [favorites, setFavorites] = useState([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);


  const { data: filterCustom } = useCustomerFilterOptions("purchasedProduct");
  const { data: filterFields } = useFilterFields("purchasedProduct");

  const updateFavoriteMutation = useUpdateCustomViewFavorite();
  const { mutate: removeView } = useDeleteCustomView();

  const rawViewResponse = filterCustom?.entity;

  const { options: filterdata, favorites: initialFavorites } = useMemo(() => {
    return mapViewsResponse(rawViewResponse);
  }, [rawViewResponse]);

  useEffect(() => {
    setFavorites(initialFavorites || []);
  }, [initialFavorites]);


  const { data, isLoading } = usePurchasedProductList({
    searchTerm,
    page,
    limit,
    filter,
    customFilters,
  });

  const appData = data?.data || [];
  const headers = data?.headers || [];
  const fields = filterFields?.data || [];


  const updateQueryParams = (params) => {
    const current = Object.fromEntries(searchParams.entries());
    const updated = { ...current, ...params };

    Object.keys(updated).forEach((key) => {
      if (!updated[key]) delete updated[key];
    });

    setSearchParams(updated);
  };


  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      updateQueryParams({
        search: search || "",
        page: 1,
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);


  const handleSortChange = (columnId) => {
    let direction = "asc";

    if (sortParam.replace("-", "") === columnId) {
      direction = sortParam.startsWith("-") ? "asc" : "desc";
    }

    const newSort = direction === "desc" ? `-${columnId}` : columnId;

    updateQueryParams({ sort: newSort });
  };


  const handlePageChange = (_, newPage) => {
    updateQueryParams({
      page: newPage + 1,
    });
  };

  const handleLimitChange = (e) => {
    updateQueryParams({
      limit: e.target.value,
      page: 1,
    });
  };


  const handleInlineFilterApply = (rules) => {
    if (!rules?.length) {
      setCustomFilters([]);
      updateQueryParams({ customFilters: null, page: 1 });
      return;
    }

    const formatted = rules.map((rule) => ({
      field: rule.field?.name,
      operator: rule.operator,
      value: rule.value,
    }));

    setCustomFilters(formatted);

    updateQueryParams({
      customFilters: JSON.stringify(formatted),
      page: 1,
    });
  };

  const handleCustomerOptionChange = (view) => {
    updateQueryParams({
      filter: view,
      page: 1,
    });
  };

  const handleFavoriteToggle = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

    updateFavoriteMutation.mutate({
      module: "purchasedProduct",
      viewId: id,
    });
  };

  const handleEditFilter = (item) => {
    navigate(`/report/purchasedProduct/edit/custom-view/${item?.id}`);
  };

  const handleDeleteFilter = (item) => {
    removeView({
      module: "product",
      viewID: item.id,
    });
  };


  const columns = useMemo(() => {
    if (!headers?.length) return [];

    const capitalize = (str) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "-";

    const statusStyles = {
      Active: { bgcolor: "#E6F4EA", color: "#28A745" },
      Suspend: { bgcolor: "#FFF4E6", color: "#FF7A00" },
      Pending: { bgcolor: "#FFF1F1", color: "#D63636" },
      Trail: { bgcolor: "#E8F0FE", color: "#1A73E8" },
    };

    return headers
      .filter((h) => h.is_visible && h.accessorKey)
      .sort((a, b) => a.display_order - b.display_order)
      .map((col) => ({
        id: col.accessorKey, // ✅ Fix
        accessorKey: col.accessorKey,
        header: col.header,

        cell: ({ row }) => {
          const value = row.original?.[col.accessorKey];

          if (col.accessorKey === "startDate" || col.accessorKey === "endDate") {
            return value ? new Date(value).toLocaleDateString("en-IN") : "-";
          }

          if (col.accessorKey === "status") {
            const statusValue = capitalize(value);
            const style =
              statusStyles[statusValue] || { bgcolor: "#F0F0F0", color: "#000" };

            return (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontWeight: 500,
                  bgcolor: style.bgcolor,
                  color: style.color,
                  textAlign: "center",
                  minWidth: 70,
                }}
              >
                {statusValue}
              </Box>
            );
          }

          return value || "-";
        },
      }));
  }, [headers]);


  const topComponent = (
    <Stack direction="row" spacing={2} alignItems="center">
      <CommonSearchBar
        value={search}
        onChange={setSearch}
        onClear={() => setSearch("")}
        placeholder="Search Product records..."
        sx={{ width: 200 }}
        mt={0}
        mb={0}
      />
    </Stack>
  );


  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <Box
        display="flex"
        width="100%"
        sx={{
          height: "calc(100vh - 110px)",
          overflow: "hidden",
        }}
      >
        {/* Filter Sidebar */}
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

        {/* Table Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box display="flex" alignItems="center" gap={2} sx={{ px: 1, py: 1 }}>
            {!showInlineFilter && (
              <Badge
                variant="dot"
                color="error"
                invisible={!customFilters?.length}
              >
                <IconButton
                  onClick={() => setShowInlineFilter(true)}
                  size="small"
                  sx={{
                    bgcolor: "primary.extraLight",
                    width: 32,
                    height: 32,
                  }}
                >
                  <FilterListRoundedIcon sx={{ color: "primary.main" }} />
                </IconButton>
              </Badge>
            )}

            <DropdownMenu
              options={filterdata}
              selectedKey={filter}
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

          {/* Table */}
          <Box sx={{ flex: 1, minWidth: 0, overflow: "auto" }}>
            <ReusableTable
              columns={columns}
              data={appData}
              isLoading={isLoading}
              sortableColumns={["clientName", "productName", "plan", "status"]}
              onSortChange={handleSortChange}
              topComponent={topComponent}
            />
          </Box>
        </Box>
      </Box>

      {/* Pagination */}
      <CustomPagination
        count={data?.totalDocs || 0}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
      />

      {/* Delete Modal */}
      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={() => { }}
        deleting={false}
        itemType="App Record"
      />
    </Box>
  );
};

export default AppList;