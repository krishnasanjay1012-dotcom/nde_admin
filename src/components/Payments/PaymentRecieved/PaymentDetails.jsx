import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import AddIcon from "@mui/icons-material/Add";

import CommonDrawer from "../../../components/common/NDE-Drawer";
import CommonComments from "../../common/NDE-Comments";

import ActionBar from "../../common/NDE-ActionBar";
import AttachmentPopover from "../../common/AttachmentPopover";
import { CommonCheckbox } from "../../common/fields";
import CommonFilter from "../../common/NDE-CommonFilter";
import PaymentDetailsPanel from "./components/PaymentRightPanel";
import CommonSearchBar from "../../common/fields/NDE-SearchBar";
import { usePaymentDetails } from "../../../hooks/payment/payment-hooks";
import FlowerLoader from "../../common/NDE-loader";
import { Badge, IconButton } from "@mui/material";
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

const statusColorMap = {
  draft: "#9e9e9e",
  authorized: "#2196f3",
  paid: "#4caf50",
  failed: "#f44336",
  refunded: "#607d8b",
  void: "#000000",
  partially_refunded: "#ff9800",
};


const PaymentDetails = () => {
  const { paymentId } = useParams();
  const location = useLocation();
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const paymentFilter = searchParams.get("filter");
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
  const [selectedIds, setSelectedIds] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorforattachment, setAnchorforattachment] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const navigate = useNavigate();
  const [showInlineFilter, setShowInlineFilter] = useState(false);
  const [customFilters, setCustomFilters] = useState(parsedCustomFilters);
  const { data: filterFields } = useFilterFields("payment");
  const fields = filterFields?.data || [];

  const { data: filterCustomer } = useCustomerFilterOptions("payment");
  const updateFavoriteMutation = useUpdateCustomViewFavorite();
  const { mutate: removeView } = useDeleteCustomView();

  const rawViewResponse = filterCustomer?.entity;

  const { options: filterdata, favorites: initialFavorites } = useMemo(() => {
    return mapViewsResponse(rawViewResponse);
  }, [rawViewResponse]);

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(initialFavorites || []);
  }, [initialFavorites]);

  const [page, setPage] = useState(() => {
    return parseInt(searchParams.get("page") || "1", 10);
  }); const limit = parseInt(searchParams.get("limit") || "10", 10);



  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePaymentDetails({
    search: debouncedSearch,
    filter: paymentFilter,
    limit,
    customFilters: customFilters
  });

  const payments = useMemo(() => {
    return data?.pages?.flatMap((page) => page.data) || [];
  }, [data]);




  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(payments.map((c) => c._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectCustomer = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleattachment = (event) => {
    setAnchorforattachment(anchorforattachment ? null : event.currentTarget);
  };

  const isBulkMode = selectedIds.length > 0;

  const handleNew = () => {
    navigate(`/sales/payments/new`);
  };

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "-";


  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 50 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        setSearchParams({ filter: paymentFilter, page: nextPage, limit, search });
        return nextPage;
      });
    }
  };

  useEffect(() => {
    if (paymentId && payments.length > 0) {
      const foundPayment = payments.find(
        (payment) => payment._id === paymentId
      );

      if (foundPayment) {
        setSelectedCustomer(foundPayment);
      }
    }
  }, [paymentId, payments]);


  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleDeleteSuccess = (deletedId) => {
    const updatedPayments = payments.filter(p => p._id !== deletedId);

    if (updatedPayments.length > 0) {
      const index = payments.findIndex(p => p._id === deletedId);
      const newIndex = index < updatedPayments.length ? index : updatedPayments.length - 1;
      const nextPayment = updatedPayments[newIndex];

      setSelectedCustomer(nextPayment);

      navigate(`/sales/payments/details/${nextPayment._id}?filter=${paymentFilter}&page=${page}&limit=${limit}&search=${search}`, { replace: true });
    } else {
      setSelectedCustomer(null);
      navigate(`/sales/payments?filter=${paymentFilter}&page=${page}&limit=${limit}&search=${search}`, { replace: true });
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
      module: "payment",
      viewId: id,
    });
  };

  const handleEditFilter = (item) => {
    navigate(`/sales/payments/edit/custom-view/${item?.id}`);
  };


  const handleDeleteFilter = (item) => {
    removeView(
      { module: "payment", viewID: item.id },
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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
      setSearchParams({ filter: paymentFilter, page: 1, limit, search });
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const isPaymentRoute = location.pathname.includes("paymentrefund");


  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          maxHeight: "calc(100vh - 80px)",
          overflow: "hidden",
          borderRadius: "8px",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: 330 },
            borderRight: { md: "1px solid #EBEBEF" },
            borderBottom: { xs: "1px solid #EBEBEF", md: "none" },
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            maxHeight: { xs: "40vh", md: "100vh" }
          }}
        >
          {/* Header */}
          {isBulkMode ? (
            <ActionBar
              selectedCount={selectedIds.length}
              onClose={() => setSelectedIds([])}
              actions={[
                {
                  label: "Bulk Actions",
                  menuItems: [
                    {
                      label: "Archive",
                      onClick: () => alert("Archive clicked"),
                    },
                    { label: "Move", onClick: () => alert("Move clicked") },
                    {
                      label: "Duplicate",
                      onClick: () => alert("Duplicate clicked"),
                    },
                  ],
                },
              ]}
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                borderBottom: "1px solid #EBEBEF",
                p: 1,
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">

                {/* LEFT SIDE */}
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
                    selectedKey={paymentFilter}
                    onChange={handleCustomerOptionChange}
                    favorites={favorites}
                    onFavoriteToggle={handleFavoriteToggle}
                    width={230}
                    footerAction={{
                      label: "New Custom View",
                      onClick: () => navigate("/sales/payments/new-custom-view"),
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

                {/* RIGHT SIDE */}
                <Box display="flex" alignItems="center" gap={1}>
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
              </Box>

              <Box pt={0.5}>
                <CommonSearchBar
                  value={search}
                  onChange={setSearch}
                  onClear={() => setSearch("")}
                  placeholder="Search payments"
                  height={40}
                  mt={0}
                  mb={0}
                />
              </Box>
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "background.muted",
              px: 2.3,
              py: 0.5,
              flexShrink: 0,
              borderBottom: "1px solid #E9E9F8 ",
            }}
          >
            <CommonCheckbox
              checked={
                selectedIds.length === payments.length && payments.length > 0
              }
              indeterminate={
                selectedIds.length > 0 && selectedIds.length < payments.length
              }
              onChange={handleSelectAll}
              mr={0}
            />

            <Typography
              sx={{
                flexGrow: 1,
                fontWeight: 500,
                textTransform: "uppercase",
              }}
            >
              Payments
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
            <List disablePadding >
              {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 20 }}>
                  <FlowerLoader size={25} />
                </Box>
              ) : payments.length === 0 ? (
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
                    No Payments Available
                  </Typography>
                  {search && (
                    <Typography variant="caption" sx={{ mt: 0.5 }}>
                      Try adjusting your search or filter
                    </Typography>
                  )}
                </Box>
              ) : null}
              {payments.map((customer) => (
                <React.Fragment key={customer._id}>
                  <ListItem
                    sx={{
                      cursor: "pointer",
                      borderBottom: "1px solid #E9E9F8",
                      backgroundColor:
                        selectedCustomer?._id === customer._id
                          ? "background.default"
                          : "transparent",
                      "&:hover": { backgroundColor: "background.default" },
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      const suffix = isPaymentRoute ? "/paymentrefund" : "";
                      navigate(`/sales/payments/details/${customer._id}${suffix}?filter=${paymentFilter}&page=${page}&limit=${limit}&search=${search}`, { replace: true });
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CommonCheckbox
                          checked={selectedIds.includes(customer._id)}
                          onChange={() => handleSelectCustomer(customer._id)}
                        />
                      </ListItemIcon>

                      <Box
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            maxWidth: 200,
                            fontSize: 14,
                            fontWeight: 500,
                            color: "primary.main",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {capitalize(customer.user)}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.8rem", fontWeight: 500 }}
                        >
                          ₹{customer.amount?.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        pl: 4.5,
                        mt: -1,
                      }}
                    >
                      <Typography variant="body1">
                        {customer.PaymentNo || "-"}
                      </Typography>

                      <Typography sx={{ fontSize: "12px", color: "#B3B3C3" }}>
                        •
                      </Typography>

                      <Typography variant="body1"> {formatDate(customer.payment_date)}</Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        pl: 4.5,
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: statusColorMap[customer.status?.name || customer.status],
                          textTransform: "uppercase"
                        }}
                      >
                        {customer.status?.name || customer.status}
                      </Typography>
                      <Typography variant="body1">
                        {customer.paymentModes?.name || customer.paymentModes || "-"}
                      </Typography>
                    </Box>
                  </ListItem>

                  <Divider />
                </React.Fragment>
              ))}
              {isFetchingNextPage && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <FlowerLoader size={20} />
                </Box>
              )}
            </List>
          </Box>
        </Box>

        {/* Right Panel */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {payments?.length === 0 ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                color: "text.secondary",
                height: "100vh",
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  No Payments Yet
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Payments will appear here once created.
                </Typography>
              </Box>
            </Box>
          ) : isPaymentRoute ? (
            <Outlet />
          ) : selectedCustomer ? (
            <PaymentDetailsPanel
              customer={selectedCustomer}
              onEdit={() => console.log("edit")}
              onSend={() => console.log("send")}
              onPdfPrint={() => console.log("print")}
              onRefund={() => console.log("refund")}
              onUploadClick={handleattachment}
              onCommentClick={handleDrawerOpen}
              onDeleteSuccess={handleDeleteSuccess}
            />
          ) : (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "text.secondary",
              }}
            >
              <Typography>Select a payment to view details</Typography>
            </Box>
          )}
        </Box>
      </Box>
      <CommonDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        title="Comment & History"
        width={400}
      >
        <CommonComments user="" />
      </CommonDrawer>

      <AttachmentPopover
        anchorEl={anchorforattachment}
        onClose={() => setAnchorforattachment(null)}
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

    </>
  );
};

export default PaymentDetails;
