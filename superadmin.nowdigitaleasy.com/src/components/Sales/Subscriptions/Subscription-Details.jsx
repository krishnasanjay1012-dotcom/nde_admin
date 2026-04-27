import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CommonFilter from "../../common/NDE-CommonFilter.jsx";

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
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import {
  CommonCheckbox,
  CommonTextField,
} from "../../common/fields";
import CommonDeleteModal from "../../common/NDE-DeleteModal";
import FlowerLoader from "../../common/NDE-loader";
import ActionBar from "../../common/NDE-ActionBar";
import SubcriptionTab from "./tab/SubscriptionTab";
import { useInfiniteSubscriptions } from "../../../hooks/subscriptions/subscriptions-hooks";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";
import CommonDrawer from "../../common/NDE-Drawer.jsx";
import { useCustomerFilterOptions, useDeleteCustomView, useFilterFields, useUpdateCustomViewFavorite } from "../../../hooks/Custom-view/custom-view-hooks.js";
import DropdownMenu from "../../common/NDE-DropdownFilter.jsx";
import { Badge } from "@mui/material";
import ContactInlineFilter from "../../common/NDE-DynamicFilter.jsx";
import Subscription from './../../Customer/Tabs/Customer-Sub';



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


const SubscriptionDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subscriptionId } = useParams();
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
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showInlineFilter, setShowInlineFilter] = useState(false);

  const [customFilters, setCustomFilters] = useState(parsedCustomFilters);
  const { data: filterFields } = useFilterFields("subscription");
  const fields = filterFields?.data || [];
  const { data: filterCustom } = useCustomerFilterOptions("subscription");
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
  } = useInfiniteSubscriptions({
    limit: 10,
    filter,
    searchTerm,
    customFilters: parsedCustomFilters,
  });

  const allSubscriptions = useMemo(() => {
    return data?.pages?.flatMap((page) => page.data) || [];
  }, [data]);


  const updateURLParams = () => {
    const params = {
      filter,
      search: searchTerm,
      page,
    };
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });
    setSearchParams(params);
  };


  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(allSubscriptions.map((s) => s._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectSubscription = (_id) => {
    setSelectedIds((prev) =>
      prev.includes(_id) ? prev.filter((x) => x !== _id) : [...prev, _id],
    );
  };

  const isBulkMode = selectedIds.length > 0;



  useEffect(() => {
    if (!allSubscriptions || allSubscriptions.length === 0) return;
    if (selectedSubscription) return;

    let initialSubscription = subscriptionId
      ? allSubscriptions.find((s) => s._id === subscriptionId)
      : allSubscriptions[0];
    if (!initialSubscription) initialSubscription = allSubscriptions[0];

    setSelectedSubscription(initialSubscription);

    const currentTabPath = location.pathname.split(subscriptionId)[1] || "";
    navigate(
      `/sales/subscriptions/details/${initialSubscription._id}${currentTabPath}`,
      { replace: true },
    );
  }, [
    allSubscriptions,
    subscriptionId,
    selectedSubscription,
    navigate,
    location.pathname,
  ]);


  useEffect(() => {
    if (subscriptionId && allSubscriptions.length > 0) {
      const foundPayment = allSubscriptions.find(
        (payment) => payment._id === subscriptionId
      );

      if (foundPayment) {
        setSelectedSubscription(foundPayment);
      }
    }
  }, [subscriptionId, allSubscriptions]);


  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
    updateURLParams({ search: value, page: 1 });
  };


  const handleNew = () => {

  };

  const handleEdit = () => {

  };


  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 50 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        setSearchParams({ filter: filter, page: nextPage, searchTerm });
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
      module: "subscription",
      viewId: id,
    });
  };

  const handleEditFilter = (item) => {
    navigate(`/products/edit/custom-view/${item?.id}`);
  };


  const handleDeleteFilter = (item) => {
    removeView(
      { module: "subscription", viewID: item.id },
    );
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
                display="flex"c
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
                      onClick: () => navigate("/customers/new-custom-view"),
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
                  placeholder="Search subscriptions..."
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
              selectedIds.length === allSubscriptions.length &&
              allSubscriptions.length > 0
            }
            indeterminate={
              selectedIds.length > 0 &&
              selectedIds.length < allSubscriptions.length
            }
            onChange={handleSelectAll}
          />
          <Typography
            sx={{
              flexGrow: 1,
              fontSize: "14px",
              fontWeight: 500,
              ml: 4,
            }}
          >
            Subscription Name
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
          {/* Subscription List */}
          <List disablePadding >
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 20 }}>
                <FlowerLoader size={25} />
              </Box>
            ) : allSubscriptions.length === 0 ? (
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
                  No Subscription Available
                </Typography>
              </Box>

            ) : (
              <>
                {allSubscriptions.map((subscription) => {
                  return (
                    <React.Fragment key={subscription._id}>
                      <ListItem
                        sx={{
                          cursor: "pointer",
                          borderBottom: "1px solid #E9E9F8",
                          backgroundColor:
                            selectedSubscription?._id === subscription._id
                              ? "background.default"
                              : "transparent",
                          "&:hover": { backgroundColor: "background.default" },
                        }}
                        onClick={() => {
                          setSelectedSubscription(subscription);
                          const currentTabPath =
                            location.pathname.split(subscriptionId)[1] || "";
                          navigate(
                            `/sales/subscriptions/details/${subscription._id}${currentTabPath}?${searchParams.toString()}`,
                            { replace: true },
                          );
                        }}
                      >


                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <CommonCheckbox
                            size="small"
                            checked={selectedIds.includes(subscription._id)}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() =>
                              handleSelectSubscription(subscription._id)
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
                              {capitalize(subscription?.name)}
                            </Typography>

                            <Typography fontSize={13}>
                              ₹{Number(subscription?.totalAmount).toLocaleString()}
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
                                {subscription?.invoiceNo}
                              </Typography>

                              <Typography fontSize={12} color="grey.1">
                                {subscription?.productId}
                              </Typography>
                            </Box>

                            <Typography
                              fontSize={11}
                              sx={{
                                textTransform: "capitalize",
                              }}
                            >
                              {subscription?.status}
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
        {selectedSubscription ? (
          <>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ p: 1.1625 }}
            >
              <Typography variant="h4">{`${capitalize(selectedSubscription.name)}`}</Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <IconButton
                  onClick={() => handleEdit(selectedSubscription)}
                  disabled={isBulkMode}
                  sx={{
                    border: "1px solid #D1D1DB",
                    borderRadius: 2,
                    height: 41,
                  }}
                >
                  <img src={Edit} style={{ height: 18 }} />
                </IconButton>
                <IconButton
                  onClick={() => setDeleteModalOpen(true)}
                  disabled={isBulkMode}
                  sx={{
                    border: "1px solid #D1D1DB",
                    borderRadius: 2,
                    height: 41,
                  }}
                >
                  <img src={Delete} style={{ height: 20 }} />
                </IconButton>
              </Box>
            </Box>
            <SubcriptionTab selectedSubscription={selectedSubscription} />
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
              No Subscription Selected
            </Typography>
          </Box>
        )}
      </Box>

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        itemType={
          selectedSubscription
            ? `${capitalize(selectedSubscription.first_name)} ${capitalize(selectedSubscription.last_name)}`.trim() ||
            "Subscription"
            : "Subscription"
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

export default SubscriptionDetails;
