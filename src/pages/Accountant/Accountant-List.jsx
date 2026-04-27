import { useState, useEffect, useMemo, useRef } from "react";
import { Badge, Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReusableTable from "../../components/common/Table/ReusableTable";
import CommonSearchBar from "../../components/common/fields/NDE-SearchBar";
import CustomPagination from "../../components/common/Table/TablePagination";
import CommonDeleteModal from "../../components/common/NDE-DeleteModal";
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
import CommonButton from "../../components/common/NDE-Button";
import AccountantForm from "./Account-Create-Edit";
import { useAccountsCustomList, useDeleteAccount } from "../../hooks/account/account-hooks";
import RowActions from "../../components/common/NDE-CustomMenu";
import Delete from "../../assets/icons/delete.svg";
import Edit from "../../assets/icons/edit.svg";
import LockIcon from "@mui/icons-material/Lock";
import ActionBar from "../../components/common/NDE-ActionBar";
import { CommonCheckbox } from "../../components/common/fields";

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

const Accountant = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [showInlineFilter, setShowInlineFilter] = useState(false);

    const filter = searchParams.get("filter") || null;
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const searchTerm = searchParams.get("search") || "";
    const sortParam = searchParams.get("sort") || "";

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
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);


    const { data: filterCustom } = useCustomerFilterOptions("account");
    const { data: filterFields } = useFilterFields("account");

    const updateFavoriteMutation = useUpdateCustomViewFavorite();
    const { mutate: removeView } = useDeleteCustomView();

    const rawViewResponse = filterCustom?.entity;

    const { options: filterdata, favorites: initialFavorites } = useMemo(() => {
        return mapViewsResponse(rawViewResponse);
    }, [rawViewResponse]);

    useEffect(() => {
        setFavorites(initialFavorites || []);
    }, [initialFavorites]);


    const { data, isLoading } = useAccountsCustomList({
        filter,
        searchTerm,
        page,
        limit,
        customFilters,
    });

    const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

    const appData = data?.data || [];
    const headers = data?.headers || [];
    const fields = filterFields?.data || [];


    const updateQueryParams = (params) => {
        const newParams = new URLSearchParams(searchParams);

        Object.entries(params).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "") {
                newParams.delete(key);
            } else {
                newParams.set(key, value);
            }
        });

        setSearchParams(newParams);
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
            module: "account",
            viewId: id,
        });
    };

    const handleEditFilter = (item) => {
        navigate(`/accountant/accounts/edit/custom-view/${item?.id}`);
    };

    const handleDelete = (row) => {
        setSelectedRow(row);
        setDeleteModalOpen(true);
    };

    const handleEdit = (row) => {
        setSelectedRow(row);
        setOpenCreateDialog(true);
    };

    const handleDeleteAccount = () => {
        deleteAccount(selectedRow?._id, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setSelectedRow(null);
            },
        });
    };

    const handleDeleteFilter = (item) => {
        removeView({
            module: "account",
            viewID: item.id,
        });
    };

    const toggleSelectAll = () => {
        const allSelectableIds = appData.filter(row => !row?.isSystem).map(row => row._id).filter(Boolean);
        if (selectedIds.length === allSelectableIds.length && allSelectableIds.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(allSelectableIds);
        }
    };

    const toggleCheckbox = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };


    const columns = useMemo(() => {
        if (!headers?.length) return [];

        const checkboxColumn = {
            id: "select",
            header: () => {
                const allSelectableIds = appData.filter(row => !row?.isSystem).map(row => row._id).filter(Boolean);
                return (
                    <Box onClick={(e) => e.stopPropagation()}>
                        <CommonCheckbox
                            name="selectAll"
                            checked={selectedIds.length === allSelectableIds.length && allSelectableIds.length > 0}
                            indeterminate={
                                selectedIds.length > 0 && selectedIds.length < allSelectableIds.length
                            }
                            onChange={(e) => {
                                e.stopPropagation();
                                toggleSelectAll();
                            }}
                            sx={{ p: 0 }}
                        />
                    </Box>
                );
            },
            cell: ({ row }) => {
                if (row.original?.isSystem) {
                    return (
                        <Tooltip title="You cannot delete this account. However, you will be able to edit the account details." arrow>
                                <LockIcon
                                    onClick={(e) => e.stopPropagation()}
                                    sx={{
                                        fontSize: 16,
                                        color: "text.disabled",
                                        
                                    }}
                                />
                        </Tooltip>
                    );
                }
                return (
                        <Box onClick={(e) => e.stopPropagation()}>
                            <CommonCheckbox
                                name={`row-${row.original?._id}`}
                                checked={selectedIds.includes(row.original?._id)}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    toggleCheckbox(row.original?._id);
                                }}
                                sx={{ p: 0 }}
                            />
                        </Box>
                );
            },
        };

        const dynamicColumns = headers
            .filter((h) => h.is_visible && h.accessorKey)
            .sort((a, b) => a.display_order - b.display_order)
            .map((col) => {
                if (col.accessorKey === "accountName") {
                    return {
                        id: col.accessorKey,
                        accessorKey: col.accessorKey,
                        header: col.header,
                        cell: ({ row }) => (
                            <Typography color="primary.main" fontSize={14}>
                                {row.original[col.accessorKey] || "-"}
                            </Typography>
                        ),
                    };
                }

                return {
                    id: col.accessorKey,
                    accessorKey: col.accessorKey,
                    header: col.header,
                };
            });

        return [
            checkboxColumn,
            ...dynamicColumns,
        ];
    }, [headers, appData, selectedIds]);


    const topComponent = (
        <Stack direction="row" spacing={2} alignItems="center">
            <CommonSearchBar
                value={search}
                onChange={setSearch}
                onClear={() => setSearch("")}
                placeholder="Search Account records..."
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
                sx={{ overflow: "hidden" }}
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
                    {selectedIds.length > 0 ? (
                        <ActionBar
                            selectedCount={selectedIds.length}
                            actions={[]}
                            onClose={() => setSelectedIds([])}
                        />
                    ) : (
                        <Box display="flex" alignItems="center" gap={2} sx={{ px: 1, py: 1, }}>
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

                            <CommonButton
                                label="Create Account"
                                onClick={() => setOpenCreateDialog(true)}
                                sx={{ ml: "auto" }}
                            />
                        </Box>
                    )}

                    {/* Table */}
                    <Box sx={{ flex: 1, minWidth: 0, overflow: "auto" }}>
                        <ReusableTable
                            columns={columns}
                            data={appData}
                            isLoading={isLoading}
                            sortableColumns={["clientName", "productName", "plan", "status"]}
                            onSortChange={handleSortChange}
                            topComponent={topComponent}
                            onRowClick={(row) => {
                                const currentParams = Object.fromEntries(searchParams.entries());
                                const queryString = new URLSearchParams(currentParams).toString();
                                navigate(`details/${row._id}?${queryString}`);
                            }}
                            HoverComponent={({ row }) => {
                                const isSystem = row.original?.isSystem;

                                const actions = [
                                    {
                                        key: "edit",
                                        label: "Edit",
                                        icon: <img src={Edit} style={{ height: 15 }} />,
                                        onClick: handleEdit,
                                    },
                                    ...(!isSystem
                                        ? [
                                            {
                                                key: "delete",
                                                label: "Delete",
                                                icon: <img src={Delete} style={{ height: 20 }} />,
                                                onClick: handleDelete,
                                            },
                                        ]
                                        : []),
                                ];

                                return <RowActions rowData={row.original} actions={actions} />;
                            }}
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
                onConfirmDelete={handleDeleteAccount}
                deleting={isDeleting}
                itemType="App Record"
            />

            <AccountantForm open={openCreateDialog} setOpen={setOpenCreateDialog} accountId={selectedRow?._id} />
        </Box>
    );
};

export default Accountant;