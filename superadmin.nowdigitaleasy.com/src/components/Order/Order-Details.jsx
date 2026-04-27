import React, { useCallback, useEffect, useRef, useState } from "react";
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
import OrderTab from "./OrderTab";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Delete from "../../assets/icons/delete.svg";
import CommonDrawer from "../common/NDE-Drawer";
import { CommonCheckbox } from "../common/fields";
import CommonDeleteModal from "../common/NDE-DeleteModal";
import { addDays } from "date-fns";
import CommonDateRange from "../common/NDE-DateRange";
import { useSearchParams } from "react-router-dom";
import DropdownMenu from "../common/NDE-DropdownMenu";
import CommonSearchBar from "../common/fields/NDE-SearchBar";
import CreateWorkspace from "../../pages/WorkSpace/WorkSpace";
import CommonFilter from "../common/NDE-CommonFilter";
import { useAllOrders, useDeleteOrder } from "../../hooks/order/order-hooks";
import FlowerLoader from "../common/NDE-loader";

const orderFilters = [
    { label: "All Orders", value: "all" },
    { label: "Success", value: "success" },
    { label: "Failed", value: "failed" },
    { label: "Pending", value: "pending" },
];

const sortOptions = [
    { key: "name", label: "Name" },
    { key: "createdAt", label: "CreatedAt" },
    { key: "total", label: "Total" },
];

const OrderDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId } = useParams();

    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [allOrders, setAllOrders] = useState([]);
    const [prevSelectedOrder, setPrevSelectedOrder] = useState(null);
    const [tempRange, setTempRange] = useState({
        startDate: new Date(),
        endDate: addDays(new Date(), 7),
        key: "selection",
    });
    const [openFilter, setOpenFilter] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [filter, setFilter] = useState(searchParams.get("filter") || "all");
    const [page, setPage] = useState(Number(searchParams.get("page") || 1));
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const startDateParam = searchParams.get("start_date");
    const endDateParam = searchParams.get("end_date");
    const [sort, setSort] = useState(searchParams.get("sort") || "");
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    const [appliedRange, setAppliedRange] = useState(
        startDateParam && endDateParam
            ? {
                startDate: isNaN(new Date(startDateParam)) ? new Date() : new Date(startDateParam),
                endDate: isNaN(new Date(endDateParam)) ? addDays(new Date(), 7) : new Date(endDateParam),
                key: "selection",
            }
            : null
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data: orderData, isLoading: orderLoading, isFetching } =
        useAllOrders({
            page,
            limit: 10,
            filter: filter === "all" ? "" : filter,
            searchTerm: debouncedSearch,
            start_date: filter === "custom" && appliedRange?.startDate ? appliedRange.startDate.toISOString() : undefined,
            end_date: filter === "custom" && appliedRange?.endDate ? appliedRange.endDate.toISOString() : undefined,
            sort
        });

    const deleteOrderMutation = useDeleteOrder();

    const observer = useRef();
    const lastOrderRef = useCallback(
        (node) => {
            if (isFetching || !orderData?.hasNextPage) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && orderData?.data?.length > 0) {
                    setPage((prev) => prev + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isFetching, orderData]
    );

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedIds(allOrders.map((o) => o._id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOrder = (_id) => {
        setSelectedIds((prev) =>
            prev.includes(_id) ? prev.filter((x) => x !== _id) : [...prev, _id]
        );
    };

    useEffect(() => {
        setPage(1);
        setSelectedOrder(null);
        setSelectedIds([]);
        setAllOrders([]);
    }, [filter]);

    useEffect(() => {
        if (!orderData) return;

        if (page === 1) {
            setAllOrders(orderData.data);
        } else {
            setAllOrders((prev) => [...prev, ...orderData.data]);
        }

        if (orderData.data.length === 0 || !orderData.data.some(o => o._id === selectedOrder?._id)) {
            setSelectedOrder(null);
        }
    }, [orderData, page]);

    useEffect(() => {
        if (!allOrders || allOrders.length === 0) return;
        if (selectedOrder) return;

        let initialOrder = orderId
            ? allOrders.find((o) => o._id === orderId)
            : allOrders[0];

        if (!initialOrder) initialOrder = allOrders[0];

        setSelectedOrder(initialOrder);

        const currentTabPath = location.pathname.split(orderId)[1] || "";
        navigate(`/sales/orders/details/${initialOrder._id}${currentTabPath}`, { replace: true });
    }, [allOrders, orderId, selectedOrder, navigate, location.pathname]);

    const confirmDelete = () => {
        if (!selectedOrder?._id) return;

        deleteOrderMutation.mutate(selectedOrder._id, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                const index = allOrders.findIndex(o => o._id === selectedOrder._id);
                const updatedOrders = allOrders.filter(o => o._id !== selectedOrder._id);
                setAllOrders(updatedOrders);
                if (updatedOrders.length > 0) {
                    const newIndex = index < updatedOrders.length ? index : updatedOrders.length - 1;
                    const newSelection = updatedOrders[newIndex];
                    setSelectedOrder(newSelection);
                    const currentTabPath = location.pathname.split(orderId)[1] || "";
                    navigate(`/sales/orders/details/${newSelection._id}${currentTabPath}`, { replace: true });
                } else {
                    setSelectedOrder(null);
                }
            },
        });
    };

    const handleOrderOptionChange = (val) => {
        if (val === "custom") {
            setOpenFilter(true);
            setTempRange(appliedRange || { startDate: new Date(), endDate: addDays(new Date(), 7), key: "selection" });
        } else {
            setFilter(val);
            setAppliedRange(null);
            setPage(1);
        }
    };

    const getFilterLabel = (value) => {
        const filterObj = orderFilters.find((f) => f.value === value);
        return filterObj ? filterObj.label : "Order";
    };

    const handleSortChange = (value) => {
        setSort(value);
        setPage(1);
    };

    useEffect(() => {
        const newParams = {
            filter,
            page,
            search: debouncedSearch,
            sort: sort,
        };
        setSearchParams(newParams, { replace: true });
    }, [filter, page, debouncedSearch, appliedRange, selectedOrder, sort]);

    const orderName = selectedOrder ? selectedOrder.clientName : "Order";
    const maxLength = 20;

    const formattedName =
        orderName?.charAt(0).toUpperCase() + orderName.slice(1).toLowerCase();

    const isTruncated = formattedName.length > maxLength;

    const displayName = isTruncated
        ? `${formattedName.slice(0, maxLength)}...`
        : formattedName;

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
                    width: { xs: "100%", md: 320 },
                    borderRight: { md: "1px solid #EBEBEF" },
                    borderBottom: { xs: "1px solid #EBEBEF", md: "none" },
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: { xs: "40vh", md: "100vh" },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        borderBottom: "1px solid #EBEBEF",
                        p: 1,
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <CommonFilter
                            menuOptions={orderFilters}
                            value={filter}
                            onChange={handleOrderOptionChange}
                        />
                        <Box display="flex" alignItems="center" gap={1}>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => navigate("/sales/orders/create")}
                                sx={{
                                    minWidth: 0,
                                    borderRadius: "6px",
                                    backgroundColor: "primary.main",
                                    textTransform: "none",
                                    color: "primary.contrastText",
                                    px: 1,
                                    py: 0.5,
                                    boxShadow: "none",
                                    "&:hover": { backgroundColor: "primary.main", boxShadow: "none" },
                                }}
                            >
                                <AddIcon fontSize="small" sx={{ color: 'icon.light' }} />
                            </Button>
                        </Box>
                    </Box>

                    <Box pt={0.5}>
                        <CommonSearchBar
                            value={searchTerm}
                            onChange={(value) => {
                                if (!prevSelectedOrder) setPrevSelectedOrder(selectedOrder);

                                setSearchTerm(value);
                                setPage(1);
                                setAllOrders([]);
                                if (value === "") {
                                    const orderToSelect = prevSelectedOrder || allOrders[0] || null;
                                    setSelectedOrder(orderToSelect);
                                    if (orderToSelect) {
                                        const currentTabPath = location.pathname.split(orderId)[1] || "";
                                        navigate(`/sales/orders/details/${orderToSelect._id}${currentTabPath}`, { replace: true });
                                    }
                                }
                            }}
                            onClear={() => {
                                setSearchTerm("");
                                setPage(1);
                                setAllOrders([]);

                                if (prevSelectedOrder) {
                                    setSelectedOrder(prevSelectedOrder);
                                    const currentTabPath = location.pathname.split(orderId)[1] || "";
                                    navigate(`/sales/orders/details/${prevSelectedOrder._id}${currentTabPath}`, { replace: true });
                                } else if (allOrders.length > 0) {
                                    setSelectedOrder(allOrders[0]);
                                    const currentTabPath = location.pathname.split(orderId)[1] || "";
                                    navigate(`/sales/orders/details/${allOrders[0]._id}${currentTabPath}`, { replace: true });
                                } else {
                                    setSelectedOrder(null);
                                }
                            }}
                            placeholder="Search orders..."
                            mb={0}
                            mt={0.4}
                            height={40}
                        />
                    </Box>
                </Box>
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
                        borderBottom: '1.5px solid #E9E9F8 '
                    }}
                >
                    <CommonCheckbox
                        checked={selectedIds.length === allOrders.length && allOrders.length > 0}
                        indeterminate={selectedIds.length > 0 && selectedIds.length < allOrders.length}
                        onChange={handleSelectAll}
                    />
                    <Typography sx={{ flexGrow: 1, fontSize: "14px", fontWeight: 500, color: "text.primary", textTransform: "uppercase", ml: 4 }}>
                        Orders List
                    </Typography>
                    <DropdownMenu
                        selectedKey={sort.replace("-", "")}
                        menuOptions={sortOptions.map(option => ({
                            ...option,
                            onClick: (field) => {
                                let newSort;
                                if (sort === field) newSort = `-${field}`;
                                else if (sort === `-${field}`) newSort = field;
                                else newSort = field;
                                handleSortChange(newSort);
                            },
                            sortDirection: sort === option.key ? "asc" : sort === `-${option.key}` ? "desc" : null
                        }))}
                    />
                </Box>

                {/* Order List */}
                <List disablePadding sx={{ flex: 1, overflowY: "auto" }}>
                    {orderLoading && page === 1 ? (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", py: 4 }}>
                            <FlowerLoader size={25} />
                        </Box>
                    ) : (
                        <>
                            {allOrders.map((order, index) => {
                                const isLast = index === allOrders.length - 1;
                                return (
                                    <React.Fragment key={order._id}>
                                        <ListItem
                                            ref={isLast ? lastOrderRef : null}
                                            sx={{
                                                cursor: "pointer",
                                                borderBottom: "1px solid #E9EDF5",
                                                backgroundColor: selectedOrder?._id === order._id ? "background.hover" : "transparent",
                                                "&:hover": { backgroundColor: "background.hover" },
                                            }}
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                const currentTabPath = location.pathname.split(orderId)[1] || "";
                                                navigate(`/sales/orders/details/${order._id}${currentTabPath}`, { replace: true });
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 34 }}>
                                                <CommonCheckbox
                                                    size="small"
                                                    checked={selectedIds.includes(order._id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={() => handleSelectOrder(order._id)}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={order.clientName?.charAt(0).toUpperCase() + order.clientName.slice(1).toLowerCase()}
                                                secondary={
                                                    <Typography variant="body2" color="text.secondary">
                                                        <strong>Order Status :</strong> {order.orderStatus}
                                                    </Typography>
                                                }
                                                primaryTypographyProps={{ variant: "body2", fontSize: 14, color: 'primary.main', mb: 0.5 }}
                                                secondaryTypographyProps={{ color: 'grey.6', fontSize: 12 }}
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
                {selectedOrder ? (
                    <>
                        <Box
                            display="flex"
                            flexDirection={{ xs: "column", sm: "row" }}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            justifyContent="space-between"
                            p={1}
                            gap={{ xs: 1, sm: 2 }}
                            flexWrap="wrap"
                            mb={-1}
                        >
                            <Tooltip title={isTruncated ? orderName : ""} arrow>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100%",
                                    }}
                                >
                                    {displayName}
                                </Typography>
                            </Tooltip>

                            <Box
                                display="flex"
                                flexDirection={{ xs: "column", sm: "row" }}
                                alignItems="center"
                                gap={{ xs: 1, sm: 2 }}
                                width={{ xs: "100%", sm: "auto" }}
                            >
                                <IconButton
                                    onClick={() => setDeleteModalOpen(true)}
                                    sx={{
                                        border: "1px solid #D1D1DB",
                                        borderRadius: 2,
                                        height: 41,
                                        width: { xs: "100%", sm: 41 },
                                    }}
                                >
                                    <img src={Delete} style={{ height: 20 }} />
                                </IconButton>
                            </Box>
                        </Box>

                        <OrderTab userId={selectedOrder?._id} />
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
                            <PersonOffOutlinedIcon sx={{ fontSize: 50, mb: 2, color: "primary.main" }} />
                            <Typography variant="h6" mb={1}>
                                No {getFilterLabel(filter)} Selected
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#9F9F9F" }}>
                                Select an order from the left panel to view details
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>

            <CommonDeleteModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirmDelete={confirmDelete}
                deleting={deleteOrderMutation.isLoading}
                title={"Order"}
                itemType={
                    selectedOrder
                        ? selectedOrder?.name || "Order"
                        : "Order"
                }
            />

            <CommonDateRange
                open={openFilter}
                onClose={() => setOpenFilter(false)}
                tempRange={tempRange}
                onChange={(ranges) => setTempRange(ranges.selection)}
                onApply={() => {
                    setAppliedRange(tempRange);
                    setFilter("custom");
                    setOpenFilter(false);
                    setPage(1);
                }}
                title="Order Filter by Date Range"
            />
        </Box>
    );
};

export default OrderDetails;