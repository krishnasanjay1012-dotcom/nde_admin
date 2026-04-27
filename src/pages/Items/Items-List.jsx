import { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import { useNavigate, useSearchParams } from "react-router-dom";

import CommonButton from "../../components/common/NDE-Button";
import ReusableTable from "../../components/common/Table/ReusableTable";
import CommonCheckbox from "../../components/common/fields/NDE-Checkbox";
import ActionBar from "../../components/common/NDE-ActionBar";
import CustomPagination from "../../components/common/Table/TablePagination";
import CommonDeleteModal from "../../components/common/NDE-DeleteModal";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

import {
    useBulkDeleteItems,
    useItemCustomView,
    useDeleteItem,
} from "../../hooks/Items/Items-hooks"; 

import Delete from "../../assets/icons/delete.svg";
import Edit from "../../assets/icons/edit.svg";
import CommonSearchBar from "../../components/common/fields/NDE-SearchBar";
import { Badge, IconButton, Stack, Typography } from "@mui/material";
import RowActions from "../../components/common/NDE-CustomMenu";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import DropdownMenu from "../../components/common/NDE-DropdownFilter";
import MoreActionsMenu from "../../components/common/NDE-MoreActionsMenu";
import {
    useCustomerFilterOptions,
    useDeleteCustomView,
    useFilterFields,
    useUpdateCustomViewFavorite,
} from "../../hooks/Custom-view/custom-view-hooks";
import ContactInlineFilter from "../../components/common/NDE-DynamicFilter";

const itemMenuItems = [
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
        children: [{ label: "Import Items" }],
    },
    {
        label: "Export",
        icon: <FileUploadOutlinedIcon fontSize="small" />,
        children: [
            { label: "Export Items" },
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

const ItemList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const { data: filterItems } = useCustomerFilterOptions("item");
    const updateFavoriteMutation = useUpdateCustomViewFavorite();
    const { mutate: removeView } = useDeleteCustomView();
    const [favorites, setFavorites] = useState([]);
    const [customFilters, setCustomFilters] = useState([]);
    const [showInlineFilter, setShowInlineFilter] = useState(false);

    const { data: filterFields } = useFilterFields("item");
    const fields = filterFields?.data || [];
    const rawViewResponse = filterItems?.entity;

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

    const { data, isLoading } = useItemCustomView({
        page,
        limit,
        filter: filterType,
        searchTerm: searchterm,
        sort: sortParam,
        customFilters: parsedCustomFilters,
    });

    const deleteItemMutation = useDeleteItem(); 
    const bulkDeleteMutation = useBulkDeleteItems(); 
    const items = data?.data || []; 
    const headers = data?.headers || [];

    const toggleCheckbox = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds?.length === items?.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map((row) => row._id));
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
            deleteItemMutation.mutate(deleteTarget._id, {
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
            module: "item", 
            viewId: id,
        });
    };

    const handleEditFilter = (item) => {
        navigate(`/items/edit/custom-view/${item?.id}`);
    };

    const handleDeleteFilter = (item) => {
        removeView(
            { module: "item", viewID: item.id }, 
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
                        selectedIds?.length === items?.length && items?.length > 0
                    }
                    indeterminate={
                        selectedIds?.length > 0 && selectedIds?.length < items?.length
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
                header: col.accessorKey === "first_name" ? "Item Name" : col.header,
                cell: ({ row }) => {
                    const value = row.original?.[col.accessorKey];

                    if (col.accessorKey === "name") {
                        const fullName = row.original?.name || "";

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
    }, [headers, items, selectedIds]);

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
                    placeholder="Search Items"
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
                                <CommonButton onClick={handleNew} label="New Item" />
                                <MoreActionsMenu
                                    items={itemMenuItems} 
                                    onChange={(data) => {
                                        if (data.type === "child" && data.parent === "Sort by") {
                                            handleSortChange(data.value);
                                        }
                                        if (data.type === "parent") {
                                            console.log("Parent clicked:", data.label);
                                        }
                                        if (data.type === "child" && data.parent === "Import" && data.label === "Import Items") {
                                            navigate('import');
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                    )}

                    <ReusableTable
                        columns={columns}
                        data={items}
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
                                        icon: <img src={Edit} style={{ height: 15 }} alt="Edit" />,
                                        onClick: handleEdit,
                                    },
                                    {
                                        key: "delete",
                                        label: "Delete",
                                        icon: <img src={Delete} style={{ height: 20 }} alt="Delete" />,
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
                        deleting={deleteItemMutation.isLoading}
                        itemType={
                            deleteTarget
                                ? deleteTarget.name || `${deleteTarget.first_name || ""} ${deleteTarget.last_name || ""}`.trim()
                                : "Item"
                        }
                        title="Item"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default ItemList;