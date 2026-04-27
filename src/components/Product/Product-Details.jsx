import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Button,
    IconButton,
    Chip,
    Badge,
} from "@mui/material";
import { PersonOffOutlined } from "@mui/icons-material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { CommonCheckbox } from "../common/fields";
import CommonDeleteModal from "../common/NDE-DeleteModal";
import FlowerLoader from "../common/NDE-loader";

import Delete from "../../assets/icons/delete.svg";
import Edit from "../../assets/icons/edit.svg";
import CommonButton from "../common/NDE-Button";
import { useDeleteProduct, usePlans, useProductsDetails } from "../../hooks/products/products-hooks";
import ActionBar from "../common/NDE-ActionBar";
import CreateSuite from "../Applications/SuitePortion/CreateSuite";
import ProductCreateEdit from "./Product-Create-Edit";
import PlansSection from "./Product-Plan";
import CouponForm from "./Product-Cupon";
import CommonMoreMenu from "../common/NDE-More-Menu";
import CommonSearchBar from "../common/fields/NDE-SearchBar";
import PlanCreate from "./Product-Plan-New";
import PricingDetailsForm from "./PlanPricingForm";
import DropdownMenu from "../common/NDE-DropdownFilter";
import ContactInlineFilter from "../common/NDE-DynamicFilter";
import { useCustomerFilterOptions, useDeleteCustomView, useFilterFields, useUpdateCustomViewFavorite } from "../../hooks/Custom-view/custom-view-hooks";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import AddIcon from "@mui/icons-material/Add";
import CommonDrawer from "../common/NDE-Drawer";
import ProductSuggestion from "./Suggestion/Suggestion-list";


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

const capitalize = (str = "") =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const ProductDetails = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [selectedIds, setSelectedIds] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [openPlanDrawer, setOpenPlanDrawer] = useState(false);
    const [openPricingDrawer, setOpenPricingDrawer] = useState(false);
    const [suiteopendialog, setSuiteOpendialog] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [openCouponForm, setOpenCouponForm] = useState(false);
    const [opensuggestionForm, setOpenSuggestionForm] = useState(false);
    const [cloneMode, setCloneMode] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const pleskFilter = searchParams.get("filter");
    const limitFromParams = parseInt(searchParams.get("limit") || "10", 10);
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
    const [page, setPage] = useState(() => {
        return parseInt(searchParams.get("page") || "1", 10);
    });

    const limit = limitFromParams;
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
    const [showInlineFilter, setShowInlineFilter] = useState(false);

    const appliedFilter = pleskFilter;


    const [customFilters, setCustomFilters] = useState(parsedCustomFilters);
    const { data: filterFields } = useFilterFields("product");
    const fields = filterFields?.data || [];
    const { data: filterCustom } = useCustomerFilterOptions("product");
    const rawViewResponse = filterCustom?.entity;

    const { options: filterdata, favorites: initialFavorites } = useMemo(() => {
        return mapViewsResponse(rawViewResponse);
    }, [rawViewResponse]);

    const updateFavoriteMutation = useUpdateCustomViewFavorite();
    const { mutate: removeView } = useDeleteCustomView();
    const [favorites, setFavorites] = useState([]);

    const showCheckbox = useMemo(() => {
        const selected = filterdata?.find((item) => item.id === appliedFilter);
        return selected?.data?.value === "Product.App";
    }, [filterdata, appliedFilter]);

    useEffect(() => {
        setFavorites(initialFavorites || []);
    }, [initialFavorites]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useProductsDetails({ filter: appliedFilter, search: debouncedSearch, limit, page });

    const allData = data?.pages?.flatMap(page => page.data) || [];

    const { mutate: handleDeleteProduct, isPending: deleting } = useDeleteProduct();

    const transformedData = (allData || []).map(product => ({
        id: product._id,
        productType: product.type || "N/A",
        productName: product.product_name || "N/A",
        payType: product.product_type || "N/A",
        hsnCode: product.hsn_code || "N/A",
        routePath: `Pricing/${product.product_name || "Unknown"}/${product._id}`,
        ...product
    }));

    const selectedHosting = transformedData.find(p => p.id === productId) || null;

    const { data: fetchedPlans = [], isLoading: planLoading } = usePlans(selectedHosting?.type, selectedHosting?.id);

    useEffect(() => {
        if (!transformedData || transformedData.length === 0) return;
        if (selectedHosting) return;

        const initialHosting = productId
            ? transformedData.find(h => h.id === productId) || transformedData[0]
            : transformedData[0];

        navigate(`/products/details/${initialHosting.id}?filter=${appliedFilter}`, { replace: true });
    }, [transformedData, productId, selectedHosting, navigate, appliedFilter]);

    const handleSelectOne = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleEditHosting = (hosting) => {
        setEditProduct(hosting);

        if (hosting.type === "suite") {
            setSuiteOpendialog(true);
        } else {
            setOpenCreateDialog(true);
        }
    };

    const handleAddPlan = () => {
        setSelectedPlan(null);
        setOpenCreateDialog(true);
    };

    const confirmDelete = () => {
        if (!selectedHosting) return;

        handleDeleteProduct(selectedHosting.id, {
            onSuccess: () => {
                setDeleteModalOpen(false);

                const updatedHostings = transformedData.filter(h => h.id !== selectedHosting.id);

                if (updatedHostings.length > 0) {
                    const index = transformedData.findIndex(h => h.id === selectedHosting.id);
                    const newIndex = index < updatedHostings.length ? index : updatedHostings.length - 1;
                    const nextHosting = updatedHostings[newIndex];

                    navigate(`/products/details/${nextHosting.id}?filter=${appliedFilter}`, { replace: true });
                } else {
                    navigate(`/products?filter=${appliedFilter}`, { replace: true });
                }
            },
        });
    };

    const handleEdit = (plan) => {
        setSelectedPlan(plan);
        setCloneMode(false);
        setOpenPlanDrawer(true);
    };

    const handleClonePlan = (plan) => {
        setSelectedPlan(plan);
        setCloneMode(true);
        setOpenPlanDrawer(true);
    };


    const handleClosePlanDrawer = () => {
        setOpenPlanDrawer(false);
        setCloneMode(false);
        setSelectedPlan(null);
    };


    const handleAdd = () => {
        setSelectedPlan(null);
        setCloneMode(false);
        setOpenPlanDrawer(true);
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

    const handlePrice = (hosting) => {
        setSelectedPlan(hosting);
        setOpenPricingDrawer(true);
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedIds(transformedData.map((c) => c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const isBulkMode = selectedIds.length > 0;

    const handleMenuChange = (value) => {
        setSelectedOption(value);

        if (value === "coupon") {
            setOpenCouponForm(true);
        }
        if (value === "suggestion") {
            setOpenSuggestionForm(true);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const updated = {
            filter: pleskFilter,
            page: page?.toString() || "1",
            limit: limit?.toString() || "10",
            search: debouncedSearch || "",
        };

        if (customFilters && customFilters.length > 0) {
            updated.customFilters = JSON.stringify(customFilters);
        }

        setSearchParams(updated, { replace: true });
    }, [debouncedSearch, customFilters]);


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
            module: "product",
            viewId: id,
        });
    };

    const handleEditFilter = (item) => {
        navigate(`/products/edit/custom-view/${item?.id}`);
    };


    const handleDeleteFilter = (item) => {
        removeView(
            { module: "product", viewID: item.id },
        );
    };


    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight - 50 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
            setPage((prevPage) => {
                const nextPage = prevPage + 1;
                setSearchParams({ filter: pleskFilter, page: nextPage, limit, search: debouncedSearch });
                return nextPage;
            });
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, maxHeight: "calc(100vh - 80px)", overflow: "hidden" }}>
            {/* Left Sidebar */}
            <Box sx={{ width: { xs: "100%", md: 330 }, borderRight: { md: "1px solid #EBEBEF" }, borderBottom: { xs: "1px solid #EBEBEF", md: "none" }, flexShrink: 0, display: "flex", flexDirection: "column", maxHeight: { xs: "40vh", md: "100vh" } }}>
                {/* Header */}
                {isBulkMode ? (
                    <ActionBar selectedCount={selectedIds.length}
                        onClose={() => setSelectedIds([])} actions={[{
                            label: "Create Suite", onClick: () => {
                                setSuiteOpendialog(true);
                            },
                        }]} />
                ) : (
                    <Box sx={{ p: 1 }}>
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
                                    selectedKey={pleskFilter}
                                    onChange={handleCustomerOptionChange}
                                    favorites={favorites}
                                    onFavoriteToggle={handleFavoriteToggle}
                                    width={230}
                                    footerAction={{
                                        label: "New Custom View",
                                        onClick: () => navigate("/products/new-custom-view"),
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
                            <Button
                                onClick={handleAddPlan}
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
                                    "&:hover": { backgroundColor: "primary.main", boxShadow: "none" },
                                }}
                            >
                                <AddIcon fontSize="small" sx={{ color: "icon.light" }} />
                            </Button>

                        </Box>
                        <CommonSearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search products..."
                            onClear={() => setSearchTerm("")}
                            mb={-0.5}
                            mt={0.6}
                            height={40}
                        />
                    </Box>
                )}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.3, py: 1.5, flexShrink: 0, backgroundColor: "background.muted", borderBottom: "1px solid #EBEBEF", borderTop: "1px solid #EBEBEF", }}>
                    {showCheckbox && (
                        <CommonCheckbox
                            checked={selectedIds.length === transformedData.length && transformedData.length > 0}
                            indeterminate={selectedIds.length > 0 && selectedIds.length < transformedData.length}
                            onChange={handleSelectAll}

                        />
                    )}
                    <Typography sx={{ flexGrow: 1, fontSize: "14px", fontWeight: 500, ml: showCheckbox ? 4 : 1 }}>Product Name</Typography>
                </Box>

                <Box
                    onScroll={handleScroll}
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                    }}
                >
                    <List disablePadding>
                        {isLoading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 20 }}>
                                <FlowerLoader size={25} />
                            </Box>
                        ) : allData.length === 0 ? (
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
                                {debouncedSearch && (
                                    <Typography variant="caption" sx={{ mt: 0.5 }}>
                                        Try adjusting your search or filter
                                    </Typography>
                                )}
                            </Box>
                        ) : (
                            transformedData.map((product) => (
                                <React.Fragment key={product.id}>
                                    <ListItem
                                        id={`hosting-${product.id}`}
                                        selected={selectedHosting?.id === product.id}
                                        onClick={() => navigate(`/products/details/${product.id}?filter=${appliedFilter}`)}
                                        sx={{ cursor: "pointer", borderBottom: "1px solid #E9E9F8", backgroundColor: selectedHosting?.id === product.id ? "background.default" : "transparent", "&:hover": { backgroundColor: "background.default" } }}
                                    >
                                        <ListItemIcon sx={{ minWidth: showCheckbox ? 34 : 10 }}>
                                            {showCheckbox && (
                                                <CommonCheckbox
                                                    checked={selectedIds.includes(product?.id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={() => handleSelectOne(product?.id)}
                                                />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                (() => {
                                                    const text = capitalize(product?.productName);
                                                    return text?.length > 30 ? text?.slice(0, 30) + "..." : text;
                                                })()
                                            }
                                            secondary={
                                                (() => {
                                                    const text = `${capitalize(product?.productType)} | ${product?.description || ""}`;
                                                    return text?.length > 30 ? text?.slice(0, 30) + "..." : text;
                                                })()
                                            }
                                            primaryTypographyProps={{
                                                variant: "body2",
                                                fontSize: 14,
                                                color: 'primary.main',
                                                mb: 0.5,
                                            }}
                                            secondaryTypographyProps={{
                                                color: 'grey.6',
                                                fontSize: 12,
                                            }}
                                        />
                                        {product?.planCount > 0 && (
                                            <Typography variant="body1"
                                                sx={{
                                                    backgroundColor: "#E8EDFF",
                                                    padding: "2px 6px",
                                                    borderRadius: "2px",
                                                    display: "inline-block",
                                                    color: 'grey.3',
                                                }}
                                            >
                                                {product?.planCount} {product?.planCount === 1 ? "Plan" : "Plans"}
                                            </Typography>
                                        )}


                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))
                        )}
                    </List>
                </Box>
            </Box>

            {/* Right Panel */}
            <Box sx={{ flex: 1 }}>
                {selectedHosting ? (
                    <>
                        <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
                            <Typography variant="h4" fontWeight={400} >
                                <Box display="inline-flex" alignItems="center" gap={1}>
                                    {capitalize(selectedHosting.productName)}
                                    {selectedHosting?.isActive ? (
                                        <Chip label="Active" color="success" size="small" />
                                    ) : (
                                        <Chip label="Inactive" color="error" size="small" />
                                    )}
                                </Box>
                            </Typography>

                            <Box display="flex" alignItems="center" gap={1.5}>
                                <IconButton onClick={() => handleEditHosting(selectedHosting)} sx={{ border: "1px solid #D1D1DB", borderRadius: 2, height: 41 }}>
                                    <img src={Edit} style={{ height: 18 }} />
                                </IconButton>
                                <IconButton onClick={() => setDeleteModalOpen(true)} sx={{ border: "1px solid #D1D1DB", borderRadius: 2, height: 41 }}>
                                    <img src={Delete} style={{ height: 20 }} />
                                </IconButton>
                                <CommonButton label={"Add Plan"} variant="contained" onClick={handleAdd} />
                                <CommonMoreMenu
                                    menuOptions={[
                                        { label: "Coupon", value: "coupon" },
                                        { label: "Suggestion", value: "suggestion" },
                                    ]}
                                    value={selectedOption}
                                    onChange={handleMenuChange}
                                    label="More"
                                />

                            </Box>
                        </Box>
                        <PlansSection handleEdit={handleEdit} handleClonePlan={handleClonePlan} setOpenPricingDrawer={setOpenPricingDrawer} fetchedPlans={fetchedPlans} planLoading={planLoading} handlePrice={handlePrice} />
                    </>
                ) : (
                    <Box height="90vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        <PersonOffOutlined sx={{ fontSize: 50, mb: 1 }} />
                        <Typography>No Product Selected</Typography>
                    </Box>
                )}
            </Box>

            {/* <ProductCreateEdit initialData={selectedPlanData} openCreateDialog={openCreateDialog} setOpenCreateDialog={setOpenCreateDialog} /> */}
            <CreateSuite
                open={suiteopendialog}
                initialData={editProduct?.type === "suite" ? editProduct : null}
                setOpen={(value) => {
                    setSuiteOpendialog(value);
                    if (!value) {
                        setEditProduct(null);
                        setSelectedIds([]);
                    }
                }}
                selectedProduct={selectedIds}
            />

            <ProductCreateEdit
                initialData={editProduct && editProduct.type !== "suite" ? editProduct : null}
                openCreateDialog={openCreateDialog}
                setOpenCreateDialog={(value) => {
                    setOpenCreateDialog(value);
                    if (!value) setEditProduct(null);
                }}
            />
            <PlanCreate
                open={openPlanDrawer}
                handleClose={handleClosePlanDrawer}
                selectedProduct={selectedHosting}
                initialData={!cloneMode ? selectedPlan : null}
                cloneData={cloneMode ? selectedPlan : null}
            />
            <CouponForm
                open={openCouponForm}
                handleClose={() => setOpenCouponForm(false)}
                selectedCoupon={selectedPlan}
            />

            <ProductSuggestion
                open={opensuggestionForm}
                handleClose={() => setOpenSuggestionForm(false)}
                selectedCoupon={selectedPlan}
            />

            {/* <CreateSuite
                open={suiteopendialog}
                setOpen={setSuiteOpendialog}
                selectedProduct={selectedIds}
            /> */}

            <PricingDetailsForm
                open={openPricingDrawer}
                onClose={() => setOpenPricingDrawer(false)}
                planId={selectedPlan?._id}
                type={selectedHosting?.type}
            />

            <CommonDeleteModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                itemType={selectedHosting?.productName}
                title="Hosting"
                deleting={deleting}
                onConfirmDelete={confirmDelete}
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

export default ProductDetails;