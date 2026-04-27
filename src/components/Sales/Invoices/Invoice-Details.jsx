import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Divider,
  Button,
  Badge,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Outlet } from "react-router-dom";

import ActionBar from "../../../components/common/NDE-ActionBar";
import CommonDrawer from "../../../components/common/NDE-Drawer";
import CommonComments from "../../common/NDE-Comments";
import {
  useInvoices,
  useInvoiceById,
} from "../../../hooks/sales/invoice-hooks";
import FlowerLoader from "../../common/NDE-loader";
import CommonSearchBar from "../../common/fields/NDE-SearchBar";
import { CommonCheckbox } from "../../common/fields";
import WriteOffInvoiceModal from "./Components/WriteOffInvoiceModal";
import MakeVoid from "./Components/MakeVoid";
import DropdownMenu from "../../common/NDE-DropdownFilter";
import { useCustomerFilterOptions, useDeleteCustomView, useFilterFields, useUpdateCustomViewFavorite } from "../../../hooks/Custom-view/custom-view-hooks";
import ContactInlineFilter from "../../common/NDE-DynamicFilter";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';


const statusStyle = {
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


const InvoiceDetails = () => {
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const observer = useRef();

  const filter = searchParams.get("filter");
  const searchTerm = searchParams.get("search") || "";
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
  const [allInvoices, setAllInvoices] = useState([]);
  const [writeOffOpen, setWriteOffOpen] = useState(false);
  const [openVoid, setOpenVoid] = useState(false);

  const handleVoidOpen = () => setOpenVoid(true);
  const handleVoidClose = () => setOpenVoid(false);
  const handleWriteOffClose = () => setWriteOffOpen(false);

  const handleWriteOffOpen = () => setWriteOffOpen(true);
  const [page, setPage] = useState(1);

  const [showInlineFilter, setShowInlineFilter] = useState(false);
  const [customFilters, setCustomFilters] = useState(parsedCustomFilters);
  const { data: filterFields } = useFilterFields("invoice");
  const fields = filterFields?.data || [];

  const { data: filterCustomer } = useCustomerFilterOptions("invoice");
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

  useEffect(() => {
    setPage(1);
    setSearchParams({ ...Object.fromEntries(searchParams.entries()), page: 1 });
  }, []);

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
  const handleSearchChange = (value) => {
    setPage(1);
    updateQueryParams({ search: value, page: 1 });
    setAllInvoices([]);
  };

  const loadNextPage = () => {
    setPage((prev) => prev + 1);
    updateQueryParams({ page: page + 1 });
  };

  const {
    data: invoicesData,
    isLoading: invoicesLoading,
    isFetching,
    refetch,
  } = useInvoices({
    page,
    limit: 15,
    filter,
    searchTerm,
    customFilters: customFilters
  });

  const { data: selectedInvoiceData, isLoading: invoiceLoading } =
    useInvoiceById(invoiceId);

  const invoices = invoicesData?.data || [];

  const selectedCustomer =
    selectedInvoiceData?.data ||
    allInvoices.find((c) => c._id === invoiceId) ||
    allInvoices[0] ||
    null;

  const isVoid = selectedInvoiceData?.data?.status?.toLowerCase() === "void";

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(allInvoices.map((c) => c._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectCustomer = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const isBulkMode = selectedIds.length > 0;

  const handleBack = () => navigate(`/sales/invoices`);
  const handleDebitNote = () =>
    navigate(`/sales/invoices/${invoiceId}/debit-note`);

  const lastInvoiceRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isFetching && invoices?.length > 0) {
          loadNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetching, invoices, page],
  );

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
      module: "invoice",
      viewId: id,
    });
  };

  const handleEditFilter = (item) => {
    navigate(`/sales/payments/edit/custom-view/${item?.id}`);
  };


  const handleDeleteFilter = (item) => {
    removeView(
      { module: "invoice", viewID: item.id },
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
    if (invoices?.length) {
      setAllInvoices((prev) => {
        if (page === 1) return invoices;
        const ids = new Set(prev.map((c) => c._id));
        const newOnes = invoices.filter((c) => !ids.has(c._id));
        return [...prev, ...newOnes];
      });
    } else if (page === 1) {
      setAllInvoices([]);
    }
  }, [invoices, page]);

  useEffect(() => {
    if (filter && allInvoices?.length > 0 && page === 1 && !invoiceId) {
      navigate(
        `/sales/invoices/details/${allInvoices[0]._id}?filter=${filter}&page=1&search=${searchTerm}`,
      );
    }
  }, [filter, allInvoices]);

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "-";

  useEffect(() => {
    refetch();
  }, [filter, searchTerm, page]);

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
          maxHeight: { xs: "40vh", md: "100vh" },
        }}
      >
        {isBulkMode ? (
          <ActionBar
            selectedCount={selectedIds.length}
            onClose={() => setSelectedIds([])}
            actions={[
              {
                label: "Bulk Actions",
                menuItems: [
                  { label: "Archive", onClick: () => alert("Archive clicked") },
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
                    onClick: () => navigate("/sales/invoices/new-custom-view"),
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
                onClick={() => navigate("/sales/invoices/new-invoice")}
                variant="contained"
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

            <Box pt={0.5}>
              <CommonSearchBar
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={handleSearchChange}
                onClear={() => handleSearchChange("")}
                width="100%"
                autoFocus
                mb={0}
                mt={0.5}
                height={40}
              />
            </Box>
          </Box>
        )}

        {/* Checkbox header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "background.muted",
            px: 2,
            py: 0.5,
            flexShrink: 0,
            borderBottom: "2px solid #E9E9F8",
          }}
        >
          <CommonCheckbox
            checked={
              selectedIds.length === allInvoices.length &&
              allInvoices.length > 0
            }
            indeterminate={
              selectedIds.length > 0 && selectedIds.length < allInvoices.length
            }
            onChange={handleSelectAll}
          />
          <Typography
            sx={{
              flexGrow: 1,
              fontSize: "14px",
              fontWeight: 500,
              color: "text.primary",
              ml: 4,
            }}
          >
            Invoice Name
          </Typography>
        </Box>

        {/* Invoices List */}
        {invoicesLoading && page === 1 ? (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
              width: "100%",
            }}
          >
            <FlowerLoader size={20} />
          </Box>
        ) : allInvoices.length === 0 ? (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
              height: "60vh",
              width: "100%",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No invoices found
            </Typography>
          </Box>
        ) : (
          <List disablePadding sx={{ flexGrow: 1, overflowY: "auto" }}>
            {allInvoices.map((customer, index) => {
              const isLast = index === allInvoices.length - 1;
              return (
                <React.Fragment key={customer._id}>
                  <ListItem
                    ref={isLast ? lastInvoiceRef : null}
                    disablePadding
                    sx={{
                      cursor: "pointer",
                      borderBottom: "1px solid #E9E9F8",
                      backgroundColor:
                        selectedCustomer?._id === customer._id
                          ? "background.default"
                          : "transparent",
                      "&:hover": { backgroundColor: "background.default" },
                      flexDirection: "column",
                      alignItems: "stretch",
                      px: 1,
                      py: 0.7,
                    }}
                    onClick={() =>
                      navigate(
                        `/sales/invoices/details/${customer._id}?filter=${filter}&page=${page}&search=${searchTerm}`,
                      )
                    }
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, ml: 1 }}>
                        <CommonCheckbox
                          size="small"
                          checked={selectedIds.includes(customer._id)}
                          onChange={() => handleSelectCustomer(customer._id)}
                        />
                      </ListItemIcon>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexGrow: 1,
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
                          {capitalize(customer?.name)}
                        </Typography>

                        <Typography fontSize={13}>
                          {customer.totalAmount}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        pl: "44px",
                        mt: -0.6,
                        gap: 1,
                      }}
                    >
                      <Typography fontSize={12} color="grey.1">
                        {customer.invoiceNo}
                      </Typography>

                      <Typography fontSize={12} color="grey.1">
                        {new Date(customer.invoiceDate).toLocaleDateString()}
                      </Typography>

                      <Box
                        sx={{
                          ml: "auto",
                          px: 1,
                          py: 0.25,
                          borderRadius: 0.75,
                        }}
                      >
                        <Typography
                          fontSize={11}
                          sx={{
                             color: statusStyle[customer?.status],
                            textTransform: "uppercase",
                          }}
                        >
                          {customer.status}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>

                  <Divider />
                </React.Fragment>
              );
            })}

            {isFetching && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <FlowerLoader size={20} />
              </Box>
            )}
          </List>
        )}
      </Box>

      {/* Right Panel */}
      <Box sx={{ flexGrow: 1 }}>
        {invoiceId && invoiceLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <FlowerLoader size={30} />
          </Box>
        ) : (
          <Outlet
            context={{
              selectedCustomer,
              selectedInvoiceData,
              drawerOpen,
              setDrawerOpen,
              handleBack,
              handleWriteOffOpen,
              handleDebitNote,
              handleVoidOpen,
            }}
          />
        )}
      </Box>

      <CommonDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Comment & History"
        width={400}
      >
        <CommonComments user="" />
      </CommonDrawer>

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

      <WriteOffInvoiceModal open={writeOffOpen} onClose={handleWriteOffClose} />
      <MakeVoid open={openVoid} onClose={handleVoidClose} isVoid={isVoid} />
    </Box>
  );
};

export default InvoiceDetails;
