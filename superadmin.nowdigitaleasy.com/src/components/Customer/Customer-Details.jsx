import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import AddIcon from "@mui/icons-material/Add";
import ActionBar from "../common/NDE-ActionBar";
import CustomerTab from "./Tabs/CustomerTab";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Delete from "../../assets/icons/delete.svg";
import Edit from "../../assets/icons/edit.svg";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

import {
  useBulkDeleteClients,
  useClientCustomView,
  useDeleteClient,
  useGetCustomerInfo,
} from "../../hooks/Customer/Customer-hooks";
import FlowerLoader from "../common/NDE-loader";
import { CommonCheckbox } from "../common/fields";
import CommonDeleteModal from "../common/NDE-DeleteModal";
import { addDays } from "date-fns";
import CommonDateRange from "../common/NDE-DateRange";
import { useSearchParams } from "react-router-dom";
import MoreActionsMenu from "../common/NDE-MoreActionsMenu";
import CommonSearchBar from "../common/fields/NDE-SearchBar";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import DropdownMenu from "../common/NDE-DropdownFilter";
import {
  useCustomerFilterOptions,
  useDeleteCustomView,
  useFilterFields,
  useUpdateCustomViewFavorite,
} from "../../hooks/Custom-view/custom-view-hooks";
import { Badge } from "@mui/material";
import CommonDrawer from "../common/NDE-Drawer";
import ContactInlineFilter from "../common/NDE-DynamicFilter";
import CloseIcon from "@mui/icons-material/Close";



const customerMenuItems = [
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
    children: [{ label: "Import Customers" }],
  },
  {
    label: "Export",
    icon: <FileUploadOutlinedIcon fontSize="small" />,
    children: [{ label: "Export Customers" }, { label: "Export Current View" }],
  },
  { label: "Preferences", icon: <SettingsOutlinedIcon fontSize="small" /> },
  { label: "Refresh List", icon: <RefreshRoundedIcon fontSize="small" /> },
  {
    label: "Reset Column Width",
    icon: <RestartAltRoundedIcon fontSize="small" />,
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

const CustomerDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerId } = useParams();
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [allCustomers, setAllCustomers] = useState([]);
  const [prevSelectedCustomer, setPrevSelectedCustomer] = useState(null);
  const [showInlineFilter, setShowInlineFilter] = useState(false);
  const [tempRange, setTempRange] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: "selection",
  });
  const [openFilter, setOpenFilter] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(() => {
    const p = Number(searchParams.get("page"));
    return isNaN(p) ? 1 : p;
  });

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const startDateParam = searchParams.get("start_date");
  const endDateParam = searchParams.get("end_date");
  const filterType = searchParams.get("filter");
  const customFiltersParam = searchParams.get("customFilters");

  const parsedCustomFilters = useMemo(() => {
    try {
      return customFiltersParam ? JSON.parse(customFiltersParam) : [];
    } catch {
      return [];
    }
  }, [customFiltersParam]);

  const [customFilters, setCustomFilters] = useState(parsedCustomFilters);
  const { data: filterFields } = useFilterFields("customer");
  const fields = filterFields?.data || [];
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const { data: filterCustomer } = useCustomerFilterOptions("customer");
  const updateFavoriteMutation = useUpdateCustomViewFavorite();

  const rawViewResponse = filterCustomer?.entity;

  const { options: filterdata, favorites: initialFavorites } = useMemo(() => {
    return mapViewsResponse(rawViewResponse);
  }, [rawViewResponse]);

  const deleteClientMutation = useDeleteClient();
  const bulkDeleteMutation = useBulkDeleteClients();
  const { mutate: removeView } = useDeleteCustomView();

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(initialFavorites || []);
  }, [initialFavorites]);

  const handleFavoriteToggle = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );

    updateFavoriteMutation.mutate({
      module: "customer",
      viewId: id,
    });
  };

  const handleEditFilter = (item) => {
    navigate(`/customers/edit/custom-view/${item?.id}`);
  };

  const handleDeleteFilter = (item) => {
    removeView({ module: "customer", viewID: item.id });
  };

  const [appliedRange, setAppliedRange] = useState(
    startDateParam && endDateParam
      ? {
        startDate: isNaN(new Date(startDateParam))
          ? new Date()
          : new Date(startDateParam),
        endDate: isNaN(new Date(endDateParam))
          ? addDays(new Date(), 7)
          : new Date(endDateParam),
        key: "selection",
      }
      : null,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: customerData,
    isLoading: customerLoading,
    isFetching,
  } = useClientCustomView({
    //refetch
    page,
    limit: 10,
    filter: filterType,
    searchTerm: debouncedSearch,
    start_date:
      filterType === "custom" && appliedRange?.startDate
        ? appliedRange.startDate.toISOString()
        : undefined,
    end_date:
      filterType === "custom" && appliedRange?.endDate
        ? appliedRange.endDate.toISOString()
        : undefined,
    sort,
    customFilters: parsedCustomFilters,
  });

  const { data: customerByData, isLoading } = useGetCustomerInfo(
    selectedCustomer?._id,
  );

  const observer = useRef();
  const lastCustomerRef = useCallback(
    (node) => {
      if (isFetching || !customerData?.hasNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && customerData?.data?.length > 0) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetching, customerData],
  );

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(allCustomers.map((c) => c._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectCustomer = (_id) => {
    setSelectedIds((prev) =>
      prev.includes(_id) ? prev.filter((x) => x !== _id) : [...prev, _id],
    );
  };

  const isBulkMode = selectedIds.length > 0;

  useEffect(() => {
    setPage(1);
    setSelectedCustomer(null);
    setSelectedIds([]);
    setAllCustomers([]);
  }, [filterType]);

  useEffect(() => {
    if (!customerData) return;

    if (page === 1) {
      setAllCustomers(customerData.data);
      if (
        customerData.data.length === 0 ||
        !customerData.data.some((c) => c._id === selectedCustomer?._id)
      ) {
        setSelectedCustomer(null);
      }
    } else {
      setAllCustomers((prev) => [...prev, ...customerData.data]);
    }
  }, [customerData, page]);

  useEffect(() => {
    if (!allCustomers || allCustomers?.length === 0) return;
    if (selectedCustomer) return;

    let initialCustomer = customerId
      ? allCustomers.find((c) => c._id === customerId)
      : allCustomers[0];

    if (!initialCustomer) initialCustomer = allCustomers[0];

    setSelectedCustomer(initialCustomer);

    const currentTabPath = location.pathname.split(customerId)[1] || "";
    navigate(`/customers/details/${initialCustomer._id}${currentTabPath}`, {
      replace: true,
    });
  }, [allCustomers, customerId, selectedCustomer, navigate, location.pathname]);


  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const payload = { users: selectedIds };
    bulkDeleteMutation.mutate(payload, {
      onSuccess: () => {
        setSelectedIds([]);
      },
      onError: (err) => console.error(err),
    });
  };

  const confirmDelete = () => {
    if (!selectedCustomer?._id) return;

    deleteClientMutation.mutate(selectedCustomer._id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        const index = allCustomers.findIndex(
          (c) => c._id === selectedCustomer._id,
        );
        const updatedCustomers = allCustomers.filter(
          (c) => c._id !== selectedCustomer._id,
        );
        setAllCustomers(updatedCustomers);
        if (updatedCustomers.length > 0) {
          const newIndex =
            index < updatedCustomers.length
              ? index
              : updatedCustomers.length - 1;
          const newSelection = updatedCustomers[newIndex];
          setSelectedCustomer(newSelection);
          const currentTabPath = location.pathname.split(customerId)[1] || "";
          navigate(`/customers/details/${newSelection._id}${currentTabPath}`, {
            replace: true,
          });
        } else {
          setSelectedCustomer(null);
          navigate(`/customers?page=1&limit=10&filter=`, { replace: true });
        }
      },
    });
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

  const handleEdit = (customer) => {
    navigate(`/customers/${customer._id}/edit`);
  };

  const handleNew = () => {
    navigate("/customers/new");
  };

  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
  };

  useEffect(() => {
    const newParams = {
      filter: filterType,
      page,
      search: debouncedSearch,
      sort: sort,
      customFilters: customFiltersParam,
    };
    setSearchParams(newParams, { replace: true });
  }, [
    filterType,
    page,
    debouncedSearch,
    appliedRange,
    selectedCustomer,
    sort,
    setSearchParams,
    customFiltersParam,
  ]);

  const maxLength = 20;

  // const customerName = selectedCustomer ? selectedCustomer.name : "Customer";
  const customerName = selectedCustomer
    ? `${selectedCustomer.first_name || ""} ${selectedCustomer.last_name || ""}`.trim() ||
    "Customer"
    : "Customer";

  const formattedName =
    customerName?.charAt(0).toUpperCase() +
    customerName?.slice(1).toLowerCase();

  const isTruncated = formattedName?.length > maxLength;

  const displayName = isTruncated
    ? `${formattedName.slice(0, maxLength)}...`
    : formattedName;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

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
        {/* Header */}
        {isBulkMode ? (
          <ActionBar
            selectedCount={selectedIds?.length}
            onClose={() => setSelectedIds([])}
            actions={[
              // { label: "Move", onClick: handleBulkMove, },
              {
                label: "Bulk Delete",
                onClick: handleBulkDelete,
                color: "error",
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
                  selectedKey={filterType}
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

                <MoreActionsMenu
                  items={customerMenuItems}
                  submenuPlacement="right"
                  onChange={(data) => {
                    if (data.type === "child" && data.parent === "Sort by") {
                      handleSortChange(data.value);
                    }
                  }}
                />
              </Box>
            </Box>

            <Box>
              <CommonSearchBar
                value={searchTerm}
                onChange={(value) => {
                  if (!prevSelectedCustomer)
                    setPrevSelectedCustomer(selectedCustomer);

                  setSearchTerm(value);
                  setPage(1);
                  setAllCustomers([]);
                  if (value === "") {
                    const customerToSelect =
                      prevSelectedCustomer || allCustomers[0] || null;
                    setSelectedCustomer(customerToSelect);
                    if (customerToSelect) {
                      const currentTabPath =
                        location.pathname.split(customerId)[1] || "";
                      navigate(
                        `/customers/details/${customerToSelect._id}${currentTabPath}`,
                        { replace: true },
                      );
                    }
                  }
                }}
                onClear={() => {
                  setSearchTerm("");
                  setPage(1);
                  setAllCustomers([]);

                  if (prevSelectedCustomer) {
                    setSelectedCustomer(prevSelectedCustomer);
                    const currentTabPath =
                      location.pathname.split(customerId)[1] || "";
                    navigate(
                      `/customers/details/${prevSelectedCustomer._id}${currentTabPath}`,
                      { replace: true },
                    );
                  } else if (allCustomers.length > 0) {
                    setSelectedCustomer(allCustomers[0]);
                    const currentTabPath =
                      location.pathname.split(customerId)[1] || "";
                    navigate(
                      `/customers/details/${allCustomers[0]._id}${currentTabPath}`,
                      { replace: true },
                    );
                  } else {
                    setSelectedCustomer(null);
                  }
                }}
                placeholder="Search customers..."
                mb={-0.5}
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
            px: 2.3,
            py: 0.5,
            flexShrink: 0,
            borderBottom: "1.5px solid #E9E9F8 ",
          }}
        >
          <CommonCheckbox
            checked={
              selectedIds.length === allCustomers.length &&
              allCustomers.length > 0
            }
            indeterminate={
              selectedIds.length > 0 && selectedIds.length < allCustomers.length
            }
            onChange={handleSelectAll}
          />
          <Typography
            sx={{
              flexGrow: 1,
              fontSize: "14px",
              fontWeight: 400,
              color: "text.primary",
              textTransform: "uppercase",
              ml: 4,
            }}
          >
            Customer Name
          </Typography>
        </Box>

        {/* Customer List */}
        <List disablePadding sx={{ flex: 1, overflowY: "auto" }}>
          {customerLoading && page === 1 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "60vh",
                py: 4,
              }}
            >
              <FlowerLoader size={25} />
            </Box>
          ) : (
            <>
              {allCustomers.map((customer, index) => {
                const isLast = index === allCustomers.length - 1;
                return (
                  <React.Fragment key={customer._id}>
                    <ListItem
                      ref={isLast ? lastCustomerRef : null}
                      sx={{
                        cursor: "pointer",
                        borderBottom: "1px solid #E9EDF5",
                        backgroundColor:
                          selectedCustomer?._id === customer._id
                            ? "background.default"
                            : "transparent",
                        "&:hover": { backgroundColor: "background.default" },
                      }}
                      onClick={() => {
                        if (selectedCustomer?._id === customer._id) return;
                        setSelectedCustomer(customer);
                        const currentTabPath =
                          location.pathname.split(customerId)[1] || "";
                        navigate(
                          `/customers/details/${customer._id}${currentTabPath}`,
                          { replace: true },
                        );
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 34 }}>
                        <CommonCheckbox
                          size="small"
                          checked={selectedIds.includes(customer._id)}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleSelectCustomer(customer._id)}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          `${customer.first_name || ""} ${customer.last_name || ""}`
                            .trim()
                            .toLowerCase()
                            .replace(/\b\w/g, (c) => c.toUpperCase()) || "-"
                        }
                        secondary={customer?.formatted_pending_amount}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontSize: 14,
                          color: "primary.main",
                          mb: 1,
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 300,
                        }}
                        secondaryTypographyProps={{
                          color: "grey.8",
                          fontSize: 12,
                          fontWeight: 400,
                        }}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                );
              })}
              {isFetching && page > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <FlowerLoader size={20} />
                </Box>
              )}
            </>
          )}
        </List>
      </Box>

      {/* Right Panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minWidth: 0,
        }}
      >
        {selectedCustomer ? (
          <>
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              p={1}
              gap={{ xs: 1, sm: 2 }}
              flexWrap="wrap"
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {/* <IconButton onClick={() => navigate("/customers")}>
                  <ArrowBackIosNewRounded fontSize="small" />
                </IconButton> */}
                <Tooltip title={isTruncated ? customerName : ""} arrow>
                  <Typography
                    variant="h4"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                      fontWeight: 400,
                      textTransform: "capitalize",
                    }}
                  >
                    {displayName}
                  </Typography>
                </Tooltip>
              </Box>

              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems="center"
                gap={{ xs: 1, sm: 1 }}
                width={{ xs: "100%", sm: "auto" }}
              >
                <IconButton
                  onClick={() => handleEdit(selectedCustomer)}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    height: 36,
                    width: { xs: "100%", sm: 41 },
                  }}
                >
                  <img src={Edit} style={{ height: 18 }} />
                </IconButton>

                <IconButton
                  onClick={() => setDeleteModalOpen(true)}
                  disabled={isBulkMode}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    height: 36,
                    width: { xs: "100%", sm: 41 },
                  }}
                >
                  <img src={Delete} style={{ height: 20 }} />
                </IconButton>

                <IconButton onClick={() => navigate("/customers")} color="error">
                  <CloseIcon fontSize="small" sx={{ color: 'error.main' }} />
                </IconButton>
              </Box>
            </Box>
            <Box mt={-0.5}>
              <CustomerTab
                userId={selectedCustomer?._id}
                selectedWorkspaceId={customerByData?.workspace?._id}
                customerData={customerByData}
                isLoading={isLoading}
              />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              width: "100%",
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                px: 2,
                gap: 1,
              }}
            >
              <PersonOffOutlinedIcon
                sx={{ fontSize: 50, mb: 2, color: "primary.main" }}
              />
              <Typography variant="h6" mb={1}>
                No Customer Selected
              </Typography>
              <Typography variant="body2" sx={{ color: "#9F9F9F" }}>
                Select a Customer from the left panel to view details
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleteClientMutation.isLoading}
        title={"Customer"}
        itemType={displayName || "Customer"}
      />

      <CommonDateRange
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        tempRange={tempRange}
        onChange={(ranges) => setTempRange(ranges.selection)}
        onApply={() => {
          setAppliedRange(tempRange);
          setOpenFilter(false);
          setPage(1);
        }}
        title="Customer Filter by Date Range"
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

export default CustomerDetails;
