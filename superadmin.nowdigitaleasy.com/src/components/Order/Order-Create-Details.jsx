import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Typography,
    StepConnector,
    IconButton,
    Fade,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

import {
    useCustomerList,
    useWorkspaceList,
} from "../../hooks/Customer/Customer-hooks";
import {
    useAdminCart,
    useMakeOrder,
    useWalletBalance,
} from "../../hooks/order/order-hooks";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import CommonButton from "../common/NDE-Button";
import AddProduct from "./Add-Product";
import OrderPayment from "./Order-Payment";
import SelectCustomerStep from "./SelectCustomerStep";
import ProductSelector from "./ProductSelector";
import OrderSummary from "./OrderSummary";
import { useNavigate } from "react-router-dom";

const steps = [
    { label: "Select Customer", icon: <PersonOutlineIcon sx={{ color: "#fff" }} /> },
    { label: "Choose Product", icon: <ShoppingBagOutlinedIcon sx={{ color: "#fff" }} /> },
    { label: "Order Summary", icon: <ReceiptLongOutlinedIcon sx={{ color: "#fff" }} /> },
    { label: "Payment", icon: <CreditCardOutlinedIcon sx={{ color: "#fff" }} /> },
];

const CustomConnector = styled(StepConnector)(({ theme }) => ({
    [`&.MuiStepConnector-alternativeLabel`]: { top: 20 },
    [`& .MuiStepConnector-line`]: {
        height: 2,
        border: 0,
        borderRadius: 2,
        backgroundColor: theme.palette.grey[300],
    },
    [`&.Mui-active .MuiStepConnector-line`]: { backgroundColor: theme.palette.primary.main },
    [`&.Mui-completed .MuiStepConnector-line`]: { backgroundColor: theme.palette.success.main },
}));

const schema = yup.object().shape({
    customer: yup.object().nullable().required("Customer is required"),
    workspace: yup.object().nullable().required("Workspace is required"),
});

const defaultValues = { customer: null, workspace: null };

const CustomStepIcon = ({ active, completed, icon }) => (
    <Box
        sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: completed ? "success.main" : active ? "primary.main" : "grey.300",
            boxShadow: active ? 3 : 0,
            transition: "all 0.3s",
        }}
    >
        {completed ? <CheckCircleIcon sx={{ color: "#fff" }} /> : icon}
    </Box>
);

const OrderCreateDetails = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [customerData, setCustomerData] = useState([]);
    const [customerPage, setCustomerPage] = useState(1);
    const [customerHasNext, setCustomerHasNext] = useState(true);
    const [customerSearchTerm, setCustomerSearchTerm] = useState("");
    const [workspaceOptions, setWorkspaceOptions] = useState([]);
    const [isAddProductDisabled, setIsAddProductDisabled] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const listRefCustomer = useRef(null);
    const navigate = useNavigate();

    const [debouncedCustomerSearch] = useDebounce(customerSearchTerm, 400);

    const { data: fetchedCustomers, isLoading: customerLoading, isFetching: customerFetching } =
        useCustomerList({ page: customerPage, limit: 50, searchTerm: debouncedCustomerSearch });

    const makeOrderMutation = useMakeOrder();
    const isSubmitting = makeOrderMutation.isPending;

    useEffect(() => {
        if (fetchedCustomers?.data) {
            setCustomerData((prev) => {
                const merged =
                    customerPage === 1 ? fetchedCustomers.data : [...prev, ...fetchedCustomers.data];
                return merged.filter((item, index, self) => index === self.findIndex((t) => t._id === item._id));
            });
            setCustomerHasNext(fetchedCustomers.data.length === 50);
        }
    }, [fetchedCustomers, customerPage]);

    const handleCustomerScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 20 && !customerLoading && customerHasNext) {
            setCustomerPage((prev) => prev + 1);
        }
    };

    const handleCustomerInputChange = (_, value, reason) => {
        setCustomerSearchTerm(value);
        if (reason === "input") {
            setCustomerData([]);
            setWorkspaceOptions([]);
            setCustomerPage(1);
            setCustomerHasNext(true);
        }
    };

    const customerOptions = customerData.map((c) => ({
        value: c._id,
        label: c.name.trim() || c.email,
        fullData: c,
    }));

    const { handleSubmit, control, formState: { errors }, reset, watch, trigger } = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });

    const selectedCustomer = watch("customer");
    const selectedWorkspace = watch("workspace");

    const { data: workspaceData, isLoading: workspaceLoading } = useWorkspaceList(
        selectedCustomer?.fullData?._id,
        { enabled: !!selectedCustomer?.fullData?._id }
    );

    useEffect(() => {
        if (workspaceData?.workspaces) {
            setWorkspaceOptions(workspaceData.workspaces.map((w) => ({ value: w.id, label: w.name })));
        } else setWorkspaceOptions([]);
    }, [workspaceData]);

    const { data: adminCart, refetch: refetchAdminCart } = useAdminCart(selectedCustomer?.fullData?._id);

    const clientId = selectedCustomer?.fullData?._id;
    const workspace_Id = selectedWorkspace?.value;
    const { data: walletPrice } = useWalletBalance(clientId, workspace_Id);
    const userWallet = walletPrice?.data?.total >= adminCart?.data?.Total;

    useEffect(() => {
        if (selectedCustomer?.fullData?._id) refetchAdminCart();
    }, [selectedCustomer?.fullData?._id]);

    useEffect(() => {
        setIsAddProductDisabled(!(selectedCustomer && selectedWorkspace));
    }, [selectedCustomer, selectedWorkspace]);

    useEffect(() => {
        if (!selectedCustomer) {
            reset({ ...watch(), workspace: null });
            setWorkspaceOptions([]);
        }
    }, [selectedCustomer]);

    const onSubmit = async () => {
        if (!selectedCustomer?.fullData?._id || !selectedWorkspace?.value) return;

        const payload = { clientId: selectedCustomer.fullData._id, isWallet: userWallet, workspaceId: selectedWorkspace.value };

        try {
            await makeOrderMutation.mutateAsync(payload);
            reset(defaultValues);
            setIsAddProductDisabled(true);
            setPaymentSuccess(true);
            handleClose();
        } catch (error) {
            console.error("❌ Failed to create order:", error);
            setPaymentSuccess(false);
        }
    };

    const handleNext = async () => {
        if (activeStep === 0) {
            const valid = await trigger(["customer", "workspace"]);
            if (!valid) return;
        } else if (activeStep === steps.length - 1) {
            handleSubmit(onSubmit)();
            return;
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleAddProductClick = () => { setIsDialogOpen(true); setIsAddProductDisabled(true); };
    const handleDialogClose = () => { setIsDialogOpen(false); setIsAddProductDisabled(!(selectedCustomer && selectedWorkspace)); };
    const handleViewCartClick = () => { setIsDrawerOpen(true); };
    const handleDrawerClose = () => { setIsDrawerOpen(false); };
    const handleBack = () => { setActiveStep((prev) => prev - 1); };
    const handleClose = () => { navigate(-1); };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ p: 0.5, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #D1D1DB" }}>
                <Typography variant="h4">Order Details</Typography>
                <IconButton onClick={handleClose} size="large" color="error">
                    <CloseIcon fontSize="medium" sx={{ color: 'error.main' }} />
                </IconButton>
            </Box>

            {/* Stepper */}
            <Stepper activeStep={activeStep} alternativeLabel connector={<CustomConnector />} sx={{ mt: 2 }}>
                {steps.map((step) => (
                    <Step key={step.label}>
                        <StepLabel StepIconComponent={(props) => <CustomStepIcon {...props} icon={step.icon} />}>
                            {step.label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* Step Content with smooth fade transition */}
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3, mx: "auto", maxHeight: "calc(80vh - 200px)", overflowY: "auto", position: "relative" }}>
                {[0, 1, 2, 3].map((step) => (
                    <Fade key={step} in={activeStep === step} timeout={300} unmountOnExit>
                        <Box sx={{ position: activeStep === step ? "relative" : "absolute", width: "100%" }}>
                            {step === 0 && (
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <SelectCustomerStep
                                        control={control}
                                        errors={errors}
                                        customerOptions={customerOptions}
                                        customerLoading={customerLoading}
                                        customerFetching={customerFetching}
                                        handleCustomerInputChange={handleCustomerInputChange}
                                        handleCustomerScroll={handleCustomerScroll}
                                        listRefCustomer={listRefCustomer}
                                        workspaceOptions={workspaceOptions}
                                        workspaceLoading={workspaceLoading}
                                        handleAddProductClick={handleAddProductClick}
                                        isAddProductDisabled={isAddProductDisabled}
                                    />
                                </form>
                            )}
                            {step === 1 && <ProductSelector adminCart={adminCart?.data?.products} />}
                            {step === 2 && <OrderSummary setActiveStep={setActiveStep} />}
                            {step === 3 && <OrderPayment adminCart={adminCart} walletPrice={walletPrice} userWallet={userWallet} paymentSuccess={paymentSuccess} selectedCustomer={selectedCustomer} />}
                        </Box>
                    </Fade>
                ))}
            </Box>

            {/* Footer Buttons */}
            <Box sx={{ position: "sticky", bottom: 14, left: 0, right: 0, display: "flex", justifyContent: "flex-end", backgroundColor: "#fff", borderTop: "1px solid #e0e0e0", gap: 2, p: 1, zIndex: 10, mt: 20 }}>
                <CommonButton label="Cancel" startIcon disabled={activeStep === 0} onClick={handleBack} variant="outlined" sx={{ width: 100 }} />
                <CommonButton
                    label={activeStep === steps.length - 1 ? (isSubmitting ? "Processing..." : "Pay") : activeStep === 2 ? "Confirm Order" : "Next"}
                    onClick={handleNext}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    sx={{ width: 120 }}
                    startIcon
                />
            </Box>

            <AddProduct
                isDialogOpen={isDialogOpen}
                handleDialogClose={handleDialogClose}
                adminCart={adminCart}
                selectedCustomer={selectedCustomer}
                selectedWorkspace={selectedWorkspace}
            />
        </Box>
    );
};

export default OrderCreateDetails;
