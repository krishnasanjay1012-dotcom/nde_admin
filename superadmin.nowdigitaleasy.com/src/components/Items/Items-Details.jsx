import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import {
  CommonCheckbox,
  CommonTextField,
} from "../common/fields";
import CommonDeleteModal from "../common/NDE-DeleteModal";
import FlowerLoader from "../common/NDE-loader";
import ActionBar from "../common/NDE-ActionBar";
import Delete from "../../assets/icons/delete.svg";
import Edit from "../../assets/icons/edit.svg";
import CommonDrawer from "../common/NDE-Drawer.jsx";
import {
  useCustomerFilterOptions,
  useDeleteCustomView,
  useFilterFields,
  useUpdateCustomViewFavorite,
} from "../../hooks/Custom-view/custom-view-hooks";
import DropdownMenu from "../common/NDE-DropdownFilter";
import { Badge } from "@mui/material";
import ContactInlineFilter from "../common/NDE-DynamicFilter";
import { useDeleteItem, useInfiniteItems } from "../../hooks/Items/Items-hooks";
import ItemTab from "./ItemTab/ItemTab.jsx";
import CloseIcon from "@mui/icons-material/Close";


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

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

const ItemDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const filter = searchParams.get("filter");
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
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
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showInlineFilter, setShowInlineFilter] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const deleteItemMutation = useDeleteItem();

  const [customFilters, setCustomFilters] = useState(parsedCustomFilters);
  const { data: filterFields } = useFilterFields("item");
  const fields = filterFields?.data || [];
  const { data: filterCustom } = useCustomerFilterOptions("item");
  const rawViewResponse = filterCustom?.entity;

  const { options: filterdata, favorites: initialFavorites } = useMemo(() => {
    return mapViewsResponse(rawViewResponse);
  }, [rawViewResponse]);

  const updateFavoriteMutation = useUpdateCustomViewFavorite();
  const { mutate: removeView } = useDeleteCustomView();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(initialFavorites || []);
  }, [initialFavorites]);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteItems({
    limit: 10,
    filter,
    searchTerm,
    customFilters: parsedCustomFilters,
  });

  const allItems = useMemo(() => {
    return data?.pages?.flatMap((page) => page.data) || [];
  }, [data]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(allItems.map((v) => v._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (_id) => {
    setSelectedIds((prev) =>
      prev.includes(_id) ? prev.filter((x) => x !== _id) : [...prev, _id],
    );
  };

  const isBulkMode = selectedIds.length > 0;

  useEffect(() => {
  if (!allItems || allItems.length === 0) return;
  if (itemId) {
    const foundVendor = allItems.find((v) => v._id === itemId);
    if (foundVendor && foundVendor._id !== selectedItem?._id) {
      setSelectedItem(foundVendor);
    }
    return;
  }

  if (!selectedItem) {
    const initialItem = allItems[0];
    setSelectedItem(initialItem);
    const currentTabPath = location.pathname.split(itemId)[1] || "";
    navigate(
      `/items/details/${initialItem._id}${currentTabPath}`,
      { replace: true }
    );
  }
}, [allItems, itemId]); 

  useEffect(() => {
    if (itemId && allItems.length > 0) {
      const foundItem = allItems.find(
        (item) => item._id === itemId
      );
      if (foundItem) {
        setSelectedItem(foundItem);
      }
    }
  }, [itemId, allItems]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
    updateQueryParams({ search: value, page: 1 });
  };

  const handleNew = () => {
    navigate("/items/new");
  };

  const handleEdit = () => {
    navigate(`/items/${selectedItem?._id}/edit`);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 50 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        setSearchParams({ filter: filter, page: nextPage, search: searchTerm });
        return nextPage;
      });
    }
  };

  const updateQueryParams = (params) => {
    const updated = { ...Object.fromEntries(searchParams.entries()) };

    Object.keys(params).forEach((key) => {
      if (params[key] === null || params[key] === undefined) {
        delete updated[key];
      } else {
        updated[key] = params[key];
      }
    });

    setSearchParams(updated, { replace: true });
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
      module: "item", // Updated module
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        maxHeight: "calc(100vh - 80px)",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: "100%", md: 330 },
          borderRight: { md: "1px solid #EBEBEF" },
          borderBottom: { xs: "1px solid #EBEBEF", md: "none" },
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          maxHeight: { xs: "40vh", md: "100vh" },
        }}
      >
        {/* Header */}
        {isBulkMode ? (
          <ActionBar
            selectedCount={selectedIds.length}
            onClose={() => setSelectedIds([])}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              borderBottom: "1px solid #EBEBEF",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 1,
              }}
            >
              {/* ROW 1: Filter + Add */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center" gap={1}>
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

                  <DropdownMenu
                    options={filterdata}
                    selectedKey={filter}
                    onChange={handleCustomerOptionChange}
                    favorites={favorites}
                    onFavoriteToggle={handleFavoriteToggle}
                    width={230}
                    footerAction={{
                      label: "New Custom View",
                      onClick: () => navigate("/items/new-custom-view"), // Updated path
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

                <Button
                  onClick={handleNew}
                  variant="contained"
                  size="small"
                  sx={{
                    minWidth: 0,
                    borderRadius: "6px",
                    backgroundColor: "primary.main",
                    textTransform: "none",
                    color: "primary.contrastText",
                    px: 1,
                    py: 0.5,
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "primary.main",
                      boxShadow: "none",
                    },
                  }}
                >
                  <AddIcon fontSize="small" sx={{ color: "icon.light" }} />
                </Button>
              </Box>

              {/* ROW 2: Search */}
              <Box pt={0.5}>
                <CommonTextField
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  startAdornment={
                    <SearchIcon fontSize="small" sx={{ color: "icon.main" }} />
                  }
                  width="100%"
                  mb={0}
                  mt={0.4}
                />
              </Box>
            </Box>
          </Box>
        )}

        {/* Checkbox header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.3,
            py: 0.5,
            flexShrink: 0,
            backgroundColor: "background.muted",
            borderBottom: "1px solid #E9E9F8",
          }}
        >
          <CommonCheckbox
            size="small"
            checked={
              selectedIds.length === allItems.length &&
              allItems.length > 0
            }
            indeterminate={
              selectedIds.length > 0 &&
              selectedIds.length < allItems.length
            }
            onChange={handleSelectAll}
          />
          <Typography
            sx={{
              flexGrow: 1,
              fontSize: "14px",
              fontWeight: 400,
              ml: 4,
            }}
          >
            Item Name
          </Typography>
        </Box>
        <Box
          onScroll={handleScroll}
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {/* Item List */}
          <List disablePadding>
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 20 }}>
                <FlowerLoader size={25} />
              </Box>
            ) : allItems.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 10,
                  color: "text.secondary",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  No Items Available
                </Typography>
              </Box>
            ) : (
              <>
                {allItems.map((item) => {
                  return (
                    <React.Fragment key={item._id}>
                      <ListItem
                        sx={{
                          cursor: "pointer",
                          borderBottom: "1px solid #E9E9F8",
                          backgroundColor:
                            selectedItem?._id === item._id
                              ? "background.default"
                              : "transparent",
                          "&:hover": { backgroundColor: "background.default" },
                        }}
                        onClick={() => {
                          setSelectedItem(item);
                          const currentTabPath =
                            location.pathname.split(itemId)[1] || "";
                          navigate(
                            `/items/details/${item._id}${currentTabPath}?${searchParams.toString()}`,
                            { replace: true },
                          );
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <CommonCheckbox
                            size="small"
                            checked={selectedIds.includes(item._id)}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() =>
                              handleSelectItem(item._id)
                            }
                          />
                        </ListItemIcon>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: 0.3,
                          }}
                        >
                          {/* Row 1 */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{
                                maxWidth: 160,
                                fontSize: 14,
                                color: "primary.main",
                              }}
                            >
                              {capitalize(item?.name)}
                            </Typography>

                            <Typography fontSize={13}>
                              {item?.rate}
                            </Typography>
                          </Box>

                          {/* Row 2 */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <Box sx={{ display: "flex" }}>
                              <Typography fontSize={12} color="grey.1">
                                {item?.purchaseDescription}
                              </Typography>
                            </Box>

                            <Typography
                              fontSize={11}
                              sx={{
                                textTransform: "capitalize",
                              }}
                            >
                              {item?.unit}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>

                      <Divider />
                    </React.Fragment>
                  );
                })}
                {isFetchingNextPage && page > 1 && (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <FlowerLoader size={20} />
                  </Box>
                )}
              </>
            )}
          </List>
        </Box>
      </Box>

      {/* Right Panel */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedItem ? (
          <>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ p: 1.1625 }}
            >
              <Typography variant="h4">
                {capitalize(selectedItem?.name)} {/* Adjust name field */}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton
                  onClick={() => handleEdit(selectedItem)}
                  disabled={isBulkMode}
                  sx={{
                    border: "1px solid #D1D1DB",
                    borderRadius: 2,
                    height: 36,
                  }}
                >
                  <img src={Edit} style={{ height: 18 }} alt="Edit" />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(selectedItem)}
                  disabled={isBulkMode}
                  sx={{
                    border: "1px solid #D1D1DB",
                    borderRadius: 2,
                    height: 36,
                  }}
                >
                  <img src={Delete} style={{ height: 20 }} alt="Delete" />
                </IconButton>
                <IconButton onClick={()=> navigate("/items")} color="error">
                  <CloseIcon sx={{ color: "error.main" }} />
                </IconButton>
              </Box>
            </Box>
            <Box mt={-1.5}>
              <ItemTab selectedItem={selectedItem} />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <PersonOffOutlinedIcon
              sx={{ fontSize: 50, mb: 2, color: "primary.main" }}
            />
            <Typography variant="h6" mb={1}>
              No Item Selected {/* Updated message */}
            </Typography>
          </Box>
        )}
      </Box>

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleteItemMutation.isLoading}
        itemType={
          selectedItem
            ? `${capitalize(selectedItem.first_name)} ${capitalize(selectedItem.last_name)}`.trim() ||
            "Item"
            : "Item"
        }
      />

      <CommonDrawer
        open={showInlineFilter}
        onClose={() => setShowInlineFilter(false)}
        p={0}
      >
        {showInlineFilter && (
          <ContactInlineFilter
            initialRules={customFilters}
            onClose={() => setShowInlineFilter(false)}
            onApply={handleInlineFilterApply}
            p={0}
            fields={fields}
          />
        )}
      </CommonDrawer>
    </Box>
  );
};

export default ItemDetails;