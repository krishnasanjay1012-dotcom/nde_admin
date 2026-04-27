import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import AddIcon from "@mui/icons-material/Add";
import {
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  Outlet,
} from "react-router-dom";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import {
  CommonCheckbox,
} from "../../common/fields";
import CommonDeleteModal from "../../common/NDE-DeleteModal";
import FlowerLoader from "../../common/NDE-loader";
import ActionBar from "../../common/NDE-ActionBar";
import CommonDrawer from "../../common/NDE-Drawer.jsx";
import { useCustomerFilterOptions, useDeleteCustomView, useFilterFields, useUpdateCustomViewFavorite } from "../../../hooks/Custom-view/custom-view-hooks.js";
import DropdownMenu from "../../common/NDE-DropdownFilter.jsx";
import { Badge } from "@mui/material";
import ContactInlineFilter from "../../common/NDE-DynamicFilter.jsx";
import { useDeleteBill, useInfiniteBills } from "../../../hooks/purchased/bills-hooks.js";
import CloseIcon from "@mui/icons-material/Close";
import BillRightsidePanel from "./Bill-Rightside.jsx";
import CommonSearchBar from "../../common/fields/NDE-SearchBar.jsx";


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

const BillDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { billId } = useParams();
  const isPaymentRoute = location.pathname.includes("payment");

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const filter = searchParams.get("filter");
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
  const [selectedBill, setSelectedBill] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showInlineFilter, setShowInlineFilter] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const deleteBillMutation = useDeleteBill();

  const [customFilters, setCustomFilters] = useState(parsedCustomFilters);
  const { data: filterFields } = useFilterFields("bill");
  const fields = filterFields?.data || [];
  const { data: filterCustom } = useCustomerFilterOptions("bill");
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
  } = useInfiniteBills({
    limit: 10,
    filter: filter,
    searchTerm: debouncedSearch,
    customFilters: customFilters,
  });

  const allBills = useMemo(() => {
    return data?.pages?.flatMap((page) => page.data) || [];
  }, [data]);


  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(allBills.map((b) => b._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectBill = (_id) => {
    setSelectedIds((prev) =>
      prev.includes(_id) ? prev.filter((x) => x !== _id) : [...prev, _id],
    );
  };

  const isBulkMode = selectedIds.length > 0;

  useEffect(() => {
    if (!allBills || allBills.length === 0) return;

    if (billId) {
      const foundBill = allBills.find((b) => b._id === billId);
      if (foundBill && foundBill._id !== selectedBill?._id) {
        setSelectedBill(foundBill);
      }
      return;
    }

    if (!selectedBill) {
      const firstBill = allBills[0];
      setSelectedBill(firstBill);
      navigate(
        `/purchased/bills/details/${firstBill._id}?${searchParams.toString()}`,
        { replace: true }
      );
    }
  }, [allBills, billId]);

  useEffect(() => {
    if (billId && allBills.length > 0) {
      const foundBill = allBills.find(
        (bill) => bill._id === billId
      );
      if (foundBill) {
        setSelectedBill(foundBill);
      }
    }
  }, [billId, allBills]);


  const handleNew = () => {
    navigate("/purchased/bills/new");
  };

  const handleEdit = () => {
    navigate(`/purchased/bills/${selectedBill?._id}/edit`);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 50 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
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
      module: "bill",
      viewId: id,
    });
  };

  const handleEditFilter = (item) => {
    navigate(`/purchased/bills/edit/custom-view/${item?.id}`);
  };

  const handleDeleteFilter = (item) => {
    removeView(
      { module: "bill", viewID: item.id },
    );
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
          navigate("/purchased/bills");
        },
      });
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
      updateQueryParams({ page: 1, search });
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

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
                      onClick: () => navigate("/purchased/bills/new-custom-view"),
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
                <CommonSearchBar
                  value={search}
                  onChange={setSearch}
                  onClear={() => setSearch("")}
                  placeholder="Search bills"
                  height={40}
                  mt={0}
                  mb={0}
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
              selectedIds.length === allBills.length &&
              allBills.length > 0
            }
            indeterminate={
              selectedIds.length > 0 &&
              selectedIds.length < allBills.length
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
            Bill Name
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
          {/* Bill List */}
          <List disablePadding >
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 20 }}>
                <FlowerLoader size={25} />
              </Box>
            ) : allBills.length === 0 ? (
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
                  No Bills Available
                </Typography>
              </Box>

            ) : (
              <>
                {allBills.map((bill) => {
                  return (
                    <React.Fragment key={bill._id}>
                      <ListItem
                        sx={{
                          cursor: "pointer",
                          borderBottom: "1px solid #E9E9F8",
                          backgroundColor:
                            selectedBill?._id === bill._id
                              ? "background.default"
                              : "transparent",
                          "&:hover": { backgroundColor: "background.default" },
                        }}
                        onClick={() => {
                          setSelectedBill(bill);
                          const currentTabPath =
                            location.pathname.split(billId)[1] || "";
                          navigate(
                            `/purchased/bills/details/${bill._id}${currentTabPath}?${searchParams.toString()}`,
                            { replace: true },
                          );
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <CommonCheckbox
                            size="small"
                            checked={selectedIds.includes(bill._id)}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() =>
                              handleSelectBill(bill._id)
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
                              {capitalize(bill?.vendor)}
                            </Typography>

                            <Typography fontSize={13}>
                              {bill?.totalAmount}
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
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography fontSize={12} color="grey.1">
                                {bill?.billNo}
                              </Typography>

                              <span style={{ fontSize: 11, lineHeight: 1 }}>•</span>

                              <Typography fontSize={12} color="grey.1">
                                {bill?.billDate
                                  ? new Date(bill.billDate).toLocaleDateString("en-IN")
                                  : "-"}
                              </Typography>
                            </Box>

                            <Typography
                              fontSize={12}
                              sx={{
                                textTransform: "uppercase",
                                color: statusColorMap[bill?.status]
                              }}
                            >
                              {bill?.status?.replaceAll("_", " ")}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>

                      <Divider />
                    </React.Fragment>
                  );
                })}
                {isFetchingNextPage && (data?.pages?.length ?? 0) > 0 && (
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
        {isPaymentRoute ? (

          <Outlet />
        ) : selectedBill ? (
          <>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ p: 1.1625 }}
            >
              <Typography variant="h4">
                {capitalize(selectedBill?.vendor)}
              </Typography>

              <Box display="flex" alignItems="center" gap={1}>
                <IconButton
                  onClick={() => navigate("/purchased/bills")}
                  color="error"
                >
                  <CloseIcon sx={{ color: "error.main" }} />
                </IconButton>
              </Box>
            </Box>

            <Box mt={-2.5}>
              <BillRightsidePanel
                selectedBill={selectedBill}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            No Bill Selected
          </Box>
        )}
      </Box>



      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleteBillMutation.isLoading}
        itemType={
          selectedBill
            ? (selectedBill?.billNo) ||
            "Bill"
            : "Bill"
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

export default BillDetails;