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
  useBulkDeleteVendors,
  useVendorCustomView,
  useDeleteVendor,
} from "../../../hooks/Vendor/Vendor-hooks";

import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";
import CommonSearchBar from "../../common/fields/NDE-SearchBar";
import { Badge, IconButton, Stack, Typography } from "@mui/material";
import RowActions from "../../common/NDE-CustomMenu";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import DropdownMenu from "../../common/NDE-DropdownFilter";
import MoreActionsMenu from "../../common/NDE-MoreActionsMenu"
import ContactInlineFilter from "../../common/NDE-DynamicFilter";

import { useCustomerFilterOptions, useDeleteCustomView, useFilterFields, useUpdateCustomViewFavorite } from "../../../hooks/Custom-view/custom-view-hooks";


const vendorMenuItems = [
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
    children: [{ label: "Import Vendors" }],
  },
  {
    label: "Export",
    icon: <FileUploadOutlinedIcon fontSize="small" />,
    children: [
      { label: "Export Vendors" },
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

const VendorList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: filterVendor } = useCustomerFilterOptions("vendor");
  const updateFavoriteMutation = useUpdateCustomViewFavorite();
  const { mutate: removeView } = useDeleteCustomView();
  const [favorites, setFavorites] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);
  const [showInlineFilter, setShowInlineFilter] = useState(false);

  const { data: filterFields } = useFilterFields("vendor");
  const fields = filterFields?.data || [];
  const rawViewResponse = filterVendor?.entity;

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
      start_date: searchParams.get("start_date") || "",
      end_date: searchParams.get("end_date") || "",
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

  const page = parseInt(searchParams.get("page"));
  const limit = parseInt(searchParams.get("limit"));
  const filterType = searchParams.get("filter");
  const searchterm = searchParams.get("search");
  const sortParam = searchParams.get("sort");
  const start_date = searchParams.get("start_date") || "";
  const end_date = searchParams.get("end_date") || "";
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

  const { data, isLoading } = useVendorCustomView({
    page,
    limit,
    filter: filterType,
    searchTerm: searchterm,
    start_date: start_date || undefined,
    end_date: end_date || undefined,
    sort: sortParam,
    customFilters: parsedCustomFilters
  });

  const deleteVendorMutation = useDeleteVendor();
  const bulkDeleteMutation = useBulkDeleteVendors();
  const vendors = data?.data || [];
  const headers = data?.headers || [];

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds?.length === vendors?.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(vendors.map((row) => row._id));
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
      deleteVendorMutation.mutate(deleteTarget._id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        },
      });
    }
  };


  const handleBulkDelete = () => {
    if (selectedIds?.length === 0) return;
    const payload = { users: selectedIds };
    bulkDeleteMutation.mutate(payload, {
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

  const handleVendorOptionChange = (view) => {
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
      module: "vendor",
      viewId: id,
    });
  };

  const handleEditFilter = (item) => {
    navigate(`/vendors/edit/custom-view/${item?.id}`);
  };

  const handleDeleteFilter = (item) => {
    removeView(
      { module: "vendor", viewID: item.id },
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

  const columns = useMemo(() => {
    const selectionColumn = {
      id: "select",
      header: () => (
        <CommonCheckbox
          name="selectAll"
          checked={
            selectedIds?.length === vendors?.length && vendors?.length > 0
          }
          indeterminate={
            selectedIds?.length > 0 && selectedIds?.length < vendors?.length
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
        header: col.accessorKey === "first_name" ? "Vendor Name" : col.header,
        cell: ({ row }) => {
          const value = row.original?.[col.accessorKey];

          if (col.accessorKey === "first_name") {
            const first = row.original?.first_name || "";
            const last = row.original?.last_name || "";
            const fullName = `${first} ${last}`.trim();

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
                {fullName ? capitalize(fullName) : "-"}
              </Typography>
            );
          }

          return value ?? "-";
        },
      }));

    return [selectionColumn, ...mappedColumns];
  }, [headers, vendors, selectedIds]);

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
          placeholder="Search Vendors"
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
                  onChange={handleVendorOptionChange}
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

              <Box display="flex" alignItems="center" gap={1}>
                <CommonButton onClick={handleNew} label="New Vendor" />
                <MoreActionsMenu
                  items={vendorMenuItems}
                  onChange={(data) => {
                    if (data.type === "child" && data.parent === "Sort by") {
                      handleSortChange(data.value);
                    }
                    if (data.type === "parent") {
                      console.log("Parent clicked:", data.label);
                    }
                    if (data.type === "child" && data.parent === "Import" && data.label === "Import Vendors") {
                      navigate('import');
                    }
                  }}
                />
              </Box>
            </Box>
          )}

          <ReusableTable
            columns={columns}
            data={vendors}
            selectedIds={selectedIds}
            onRowClick={(row) => {
              const currentParams = Object.fromEntries(searchParams.entries());
              const queryString = new URLSearchParams(currentParams).toString();
              navigate(`details/${row._id}?${queryString}`);
            }}
            isLoading={isLoading}
            sortableColumns={
              headers
                ?.filter((h) => h.sort_direction !== null)
                .map((h) => h.accessorKey) || []
            }
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
            deleting={deleteVendorMutation.isLoading}
            itemType={
              deleteTarget
                ? `${deleteTarget.first_name || ""} ${deleteTarget.last_name || ""}`.trim()
                : "Vendor"
            }
            title="Vendor"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default VendorList;