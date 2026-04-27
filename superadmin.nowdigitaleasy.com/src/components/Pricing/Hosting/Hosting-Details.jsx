import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { PersonOffOutlined, Add } from "@mui/icons-material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { CommonCheckbox } from "../../common/fields";
import CommonDeleteModal from "../../common/NDE-DeleteModal";
import FlowerLoader from "../../common/NDE-loader";

import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";
import HostingCreateEdit from "./Hosting-Create-Edit";
import CommonButton from "../../common/NDE-Button";
import CreatePlan from "./Hosting-Plan-Add";
import EditHostingPlan from "./Hosting-Edit-Plan";
import HostingPaymentList from "./Payment-List";
import CommonDrawer from "../../common/NDE-Drawer";
import PlansSection from "./Hosting-Plan-List";
import { useDeleteProduct, useProducts } from "../../../hooks/products/products-hooks";
import CommonFilter from "../../common/NDE-CommonFilter";
import ActionBar from "../../common/NDE-ActionBar";
import CreateSuite from "../../Applications/SuitePortion/CreateSuite";

const productFilter = [
    { label: "All", value: "all" },
    { label: "App", value: "app" },
    { label: "G Suite", value: "gsuite" },
    { label: "Plesk", value: "plesk" },
];

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
    const [drawerMode, setDrawerMode] = useState("create");
    const [openPricingDrawer, setOpenPricingDrawer] = useState(false);
    const [suiteopendialog, setSuiteOpendialog] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const pleskFilter = searchParams.get("type");

    useEffect(() => {
        if (!pleskFilter) {
            setSearchParams({ type: "all" }, { replace: true });
        }
    }, [pleskFilter, setSearchParams]);

    const appliedFilter = pleskFilter || "all";
    const showCheckbox = appliedFilter === "app";

    const { data: allData = [], isLoading } = useProducts(appliedFilter);
    const { mutate: handleDeleteProduct, isPending: deleting } = useDeleteProduct();

    const transformedData = allData?.map(product => ({
        id: product._id,
        productType: product.type || "N/A",
        productName: product.product_name || "N/A",
        payType: product.product_type || "N/A",
        hsnCode: product.hsn_code || "N/A",
        routePath: `Pricing/${product.product_name || "Unknown"}/${product._id}`,
        ...product
    })) || [];

    const selectedHosting = transformedData.find(p => p.id === productId) || null;

    useEffect(() => {
        if (!transformedData || transformedData.length === 0) return;
        if (selectedHosting) return;

        const initialHosting = productId
            ? transformedData.find(h => h.id === productId) || transformedData[0]
            : transformedData[0];

        const searchParams = new URLSearchParams(window.location.search);
        navigate(`/products/details/${initialHosting.id}?${searchParams.toString()}`, { replace: true });
    }, [transformedData, productId, selectedHosting, navigate]);


    const handleSelectOne = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleEditHosting = (hosting) => {
        setSelectedPlan(hosting);
        setOpenCreateDialog(true);
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

                    navigate(`/products/details/${nextHosting.id}`, { replace: true });
                } else {
                    navigate(`/products/details`, { replace: true });
                }
            },
        });
    };



    const handleEdit = (hosting) => {
        setSelectedPlan(hosting);
        setDrawerMode("edit");
        setOpenPlanDrawer(true);
    };

    const handleAdd = () => {
        setSelectedPlan(null);
        setDrawerMode("create");
        setOpenPlanDrawer(true);
    };

    const handleFilterChange = (value) => {
        setSearchParams({ type: value });
        // selectedHosting will auto-update via useEffect
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedIds(transformedData.map((c) => c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const isBulkMode = selectedIds.length > 0;

    return (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, maxHeight: "calc(95vh - 70px)", overflow: "hidden" }}>
            {/* Left Sidebar */}
            <Box sx={{ width: { xs: "100%", md: 320 }, borderRight: { md: "1px solid #EBEBEF" }, borderBottom: { xs: "1px solid #EBEBEF", md: "none" }, borderRadius: "8px", background: "#fff", flexShrink: 0, display: "flex", flexDirection: "column", maxHeight: { xs: "40vh", md: "100vh" } }}>
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
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <CommonFilter menuOptions={productFilter} value={pleskFilter} onChange={handleFilterChange} />
                            <Button variant="contained" onClick={handleAddPlan} sx={{ minWidth: 0, borderRadius: "6px", backgroundColor: "primary.main", textTransform: "none", color: "primary.contrastText", px: 1, py: 0.5, boxShadow: "none", "&:hover": { backgroundColor: "primary.main", boxShadow: "none" } }}>
                                <Add sx={{ color: "#FFF" }} />
                            </Button>
                        </Box>
                    </Box>
                )}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.3, py: 1.5, flexShrink: 0, backgroundColor: "background.muted", borderBottom: "2px solid #EBEBEF" }}>
                    {showCheckbox && (
                        <CommonCheckbox
                            checked={selectedIds.length === transformedData.length && transformedData.length > 0}
                            indeterminate={selectedIds.length > 0 && selectedIds.length < transformedData.length}
                            onChange={handleSelectAll}
                        />
                    )}
                    <Typography sx={{ flexGrow: 1, fontSize: "14px", fontWeight: 500, color: "#000334B2", ml: showCheckbox ? 4 : 1 }}>Product Name</Typography>
                </Box>
                <List disablePadding sx={{ flex: 1, overflowY: "auto" }}>
                    {isLoading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 20 }}>
                            <FlowerLoader size={25} />
                        </Box>
                    ) : (
                        transformedData.map((product) => (
                            <React.Fragment key={product.id}>
                                <ListItem
                                    id={`hosting-${product.id}`}
                                    selected={selectedHosting?.id === product.id}
                                    onClick={() => navigate(`/products/details/${product.id}`)}
                                    sx={{ cursor: "pointer", borderBottom: "1px solid #E9E9F8", backgroundColor: selectedHosting?.id === product.id ? "background.default" : "transparent", "&:hover": { backgroundColor: "background.default" } }}
                                >
                                    <ListItemIcon sx={{ minWidth: showCheckbox ? 34 : 10 }}>
                                        {showCheckbox && (
                                            <CommonCheckbox
                                                checked={selectedIds.includes(product.id)}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={() => handleSelectOne(product.id)}
                                            />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={capitalize(product.productName)}
                                        secondary={`${product.productType} | ${product.desc || ""}`}
                                        primaryTypographyProps={{ variant: "body2", fontSize: 14, color: 'primary.main', mb: 0.5 }}
                                        secondaryTypographyProps={{ color: 'grey.6', fontSize: 12 }}
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))
                    )}
                </List>
            </Box>

            {/* Right Panel */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 1 }}>
                {selectedHosting ? (
                    <>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="h4">
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
                            </Box>
                        </Box>
                        <PlansSection selectedHosting={selectedHosting} handleEdit={handleEdit} setOpenPricingDrawer={setOpenPricingDrawer} />
                    </>
                ) : (
                    <Box height="90vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        <PersonOffOutlined sx={{ fontSize: 50, mb: 1 }} />
                        <Typography>No Hosting Selected</Typography>
                    </Box>
                )}

                <HostingCreateEdit initialData={selectedPlan} openCreateDialog={openCreateDialog} setOpenCreateDialog={setOpenCreateDialog} />

                {drawerMode === "create" && <CreatePlan open={openPlanDrawer} handleClose={() => setOpenPlanDrawer(false)} />}
                {drawerMode === "edit" && <EditHostingPlan open={openPlanDrawer} handleClose={() => setOpenPlanDrawer(false)} selectedPlan={selectedPlan} />}
            </Box>
            <CreateSuite
                open={suiteopendialog}
                setOpen={setSuiteOpendialog}
                // initialData={selectedHosting}
                selectedProduct={selectedIds}
            />

            <CommonDeleteModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                itemType={selectedHosting?.productName}
                title="Hosting"
                deleting={deleting}
                onConfirmDelete={confirmDelete}
            />

            <CommonDrawer open={openPricingDrawer} onClose={() => setOpenPricingDrawer(false)} anchor="right" width={900}>
                <HostingPaymentList onClose={() => setOpenPricingDrawer(false)} productName={selectedHosting?.productName} />
            </CommonDrawer>

        </Box>
    );
};

export default ProductDetails;
