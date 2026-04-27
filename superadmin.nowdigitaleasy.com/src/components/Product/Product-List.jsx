import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  IconButton,
  Link,
  Stack,
  TableCell,
  Typography,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

import ReusableTable from "../../components/common/Table/ReusableTable";
import CommonButton from "../../components/common/NDE-Button";
import CommonDeleteModal from "../../components/common/NDE-DeleteModal";
import Delete from "../../assets/icons/delete.svg";
import Edit from "../../assets/icons/edit.svg";
import {
  useDeleteProduct,
  useProducts,
  useUpdateProductStatus,
} from "../../hooks/products/products-hooks";
import RowActions from "../common/NDE-CustomMenu";
import CommonSearchBar from "../../components/common/fields/NDE-SearchBar";
import { CommonCheckbox } from "../common/fields";
import ActionBar from "../common/NDE-ActionBar";
import CreateSuite from "../Applications/SuitePortion/CreateSuite";
import ProductCreateEdit from "./Product-Create-Edit";
import CommonToggleSwitch from "../common/NDE-CommonToggleSwitch";
import CustomPagination from "../common/Table/TablePagination";
import {
  useCustomerFilterOptions,
  useDeleteCustomView,
  useFilterFields,
  useUpdateCustomViewFavorite,
} from "../../hooks/Custom-view/custom-view-hooks";
import DropdownMenu from "../common/NDE-DropdownFilter";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import ContactInlineFilter from "../common/NDE-DynamicFilter";

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

const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const paymentFilterRaw = searchParams.get("filter");
  const pleskFilter =
    paymentFilterRaw && paymentFilterRaw !== "undefined"
      ? paymentFilterRaw
      : null;

  const { data: filterCustom } = useCustomerFilterOptions("product");
  const rawViewResponse = filterCustom?.entity;

  const { options: filterdata, favorites: initialFavorites } = useMemo(() => {
    return mapViewsResponse(rawViewResponse);
  }, [rawViewResponse]);

  useEffect(() => {
    setFavorites(initialFavorites || []);
  }, [initialFavorites]);

  const pageFromParams = parseInt(searchParams.get("page") || "1", 10);
  const limitFromParams = parseInt(searchParams.get("limit") || "10", 10);
  const customFiltersFromParams = searchParams.get("customFilters");
  const parsedCustomFilters = useMemo(() => {
    try {
      return customFiltersFromParams ? JSON.parse(customFiltersFromParams) : [];
    } catch {
      return [];
    }
  }, [customFiltersFromParams]);

  const [page, setPage] = useState(pageFromParams);
  const [limit, setLimit] = useState(limitFromParams);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [showInlineFilter, setShowInlineFilter] = useState(false);
  const { data: filterFields } = useFilterFields("product");
  const fields = filterFields?.data || [];
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [customFilters, setCustomFilters] = useState(parsedCustomFilters);
  const updateFavoriteMutation = useUpdateCustomViewFavorite();
  const { mutate: removeView } = useDeleteCustomView();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const newParams = {
      filter: currentParams.filter,
      page: currentParams.page || "1",
      limit: currentParams.limit || "10",
      search: debouncedSearch || "",
      customFilters: searchParams.get("customFilters") || "",
    };

    setSearchParams(newParams, { replace: true });
  }, [debouncedSearch, searchParams, setSearchParams]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const appliedFilter = pleskFilter;

  const showCheckbox = useMemo(() => {
    const selected = filterdata?.find((item) => item.id === appliedFilter);
    return selected?.data?.value === "Product.App";
  }, [filterdata, appliedFilter]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedProductData, setSelectedProductData] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [suiteopendialog, setSuiteOpendialog] = useState(false);

  const { data: tableData, isLoading } = useProducts(
    {
      filter: appliedFilter,
      page,
      limit,
      search: debouncedSearch,
      type: "",
      customFilters: customFilters,
    },
    {
      enabled: !!appliedFilter,
    },
  );

  const products = tableData?.data || [];
  const headers = tableData?.headers || [];
  const { mutate: handleDeleteProduct, isPending: deleting } =
    useDeleteProduct();
  const { mutate: changeProductStatus, isPending: updateProductLoading } =
    useUpdateProductStatus();

  useEffect(() => {
    if (!showCheckbox) setSelectedIds([]);
  }, [showCheckbox]);

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "-";

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((row) => row._id));
    }
  };

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleToggle = (row) => {
    const payload = { _id: row?._id, isActive: !row?.isActive };
    changeProductStatus(payload);
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
      module: "product",
      viewId: id,
    });
  };

  const handleEditFilter = (item) => {
    navigate(`/products/edit/custom-view/${item?.id}`);
  };

  const handleDeleteFilter = (item) => {
    removeView({ module: "product", viewID: item.id });
  };

  const columns = useMemo(() => {
    const checkboxColumn = {
      id: "select",
      header: () => {
        const allIds = products.map((row) => row._id).filter(Boolean);

        return (
          <CommonCheckbox
            name="selectAll"
            checked={selectedIds.length === allIds.length && allIds.length > 0}
            indeterminate={
              selectedIds.length > 0 && selectedIds.length < allIds.length
            }
            onChange={(e) => {
              e.stopPropagation();
              toggleSelectAll();
            }}
            sx={{ p: 0 }}
          />
        );
      },
      cell: ({ row }) => (
        <TableCell
          onClick={(e) => e.stopPropagation()}
          sx={{ p: 0, border: "none" }}
        >
          <CommonCheckbox
            name={`row-${row.original?._id}`}
            checked={selectedIds.includes(row.original?._id)}
            onChange={(e) => {
              e.stopPropagation();
              toggleCheckbox(row.original?._id);
            }}
            sx={{ p: 0 }}
          />
        </TableCell>
      ),
    };

    const dynamicColumns = headers
      .filter((col) => col.is_visible)
      .sort((a, b) => a.display_order - b.display_order)
      .map((col) => {
        if (col.accessorKey === "isActive") {
          return {
            accessorKey: col.accessorKey,
            header: col.header,
            cell: ({ row }) => (
              <TableCell
                onClick={(e) => e.stopPropagation()}
                sx={{ p: 0, border: "none" }}
              >
                <Box ml={2}>
                  <CommonToggleSwitch
                    checked={row.original.isActive}
                    onChange={() => handleToggle(row.original)}
                    disabled={updateProductLoading}
                  />
                </Box>
              </TableCell>
            ),
          };
        }

        return {
          accessorKey: col.accessorKey,
          header: col.header,
          cell: ({ row }) => {
            const value = row.original[col.accessorKey];

            if (col.accessorKey === "product_name") {
              return (
                <Link
                  href={row.original.link}
                  target="_blank"
                  rel="noreferrer"
                  color="primary.main"
                  underline="hover"
                  // onClick={(e) => e.stopPropagation()}
                >
                  {typeof value === "string" ? capitalize(value) : value || "-"}
                </Link>
              );
            }

            return typeof value === "string"
              ? capitalize(value)
              : (value ?? "-");
          },
        };
      });

    return [...(showCheckbox ? [checkboxColumn] : []), ...dynamicColumns];
  }, [headers, showCheckbox, updateProductLoading, products, selectedIds]);

  const handleDelete = (row) => {
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedProductData(row);

    if (row.type === "suite") {
      setSuiteOpendialog(true);
    } else {
      setOpenCreateDialog(true);
    }
  };

  const confirmDelete = () => {
    if (!selectedRow) return;
    handleDeleteProduct(selectedRow._id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedRow(null);
      },
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
    setSearchParams({ filter: appliedFilter, page: newPage + 1, limit });
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

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);

    updateQueryParams({
      filter: appliedFilter,
      page: 1,
      limit: newLimit,
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
          placeholder="Search products..."
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
              actions={[
                {
                  label: "Create Suite",
                  onClick: () => setSuiteOpendialog(true),
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
                  selectedKey={pleskFilter}
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
              <CommonButton
                label="Create Products"
                onClick={() => {
                  setSelectedProductData(null);
                  setOpenCreateDialog(true);
                }}
              />
            </Box>
          )}

          <ReusableTable
            columns={columns}
            data={products}
            isLoading={isLoading}
            topComponent={topComponent}
            onRowClick={(row) => {
              const currentParams = Object.fromEntries(searchParams.entries());
              const queryString = new URLSearchParams(currentParams).toString();
              navigate(`/products/details/${row._id}?${queryString}`);
            }}
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
            count={tableData?.totalDocs || 0}
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
            deleting={deleting}
            itemType={selectedRow?.product_name}
            title="Product"
          />

          <CreateSuite
            open={suiteopendialog}
            initialData={
              selectedProductData?.type === "suite" ? selectedProductData : null
            }
            setOpen={(value) => {
              setSuiteOpendialog(value);
              if (!value) {
                setSelectedProductData(null);
                setSelectedIds([]);
              }
            }}
            selectedProduct={selectedIds}
          />

          <ProductCreateEdit
            initialData={
              selectedProductData && selectedProductData.type !== "suite"
                ? selectedProductData
                : null
            }
            openCreateDialog={openCreateDialog}
            setOpenCreateDialog={(value) => {
              setOpenCreateDialog(value);
              if (!value) setSelectedProductData(null);
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Products;
