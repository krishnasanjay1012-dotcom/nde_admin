
import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import CommonAutocomplete from "../../components/common/fields/NDE-Autocomplete";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import CommonButton from "../common/NDE-Button";
import AddProduct from "./Add-Product";
import OrderCartTab from "./Cart-Tab";
import CommonDrawer from "../common/NDE-Drawer";

import {
  useCustomerList,
  useWorkspaceList,
} from "../../hooks/Customer/Customer-hooks";
import {
  useAdminCart,
  useMakeOrder,
  useWalletBalance,
} from "../../hooks/order/order-hooks";
import WaveLoader from "../common/NDE-WaveLoader";

const PAYMENT_MODE_OPTIONS = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "upi", label: "UPI" },
  { value: "cash", label: "Cash" },
  { value: "cheque", label: "Cheque" },
  { value: "razorpay", label: "Razorpay" },
];

const schema = yup.object().shape({
  customer: yup.object().nullable().required("Customer is required"),
  workspace: yup.object().nullable().required("Workspace is required"),
  paymentMode: yup.object().nullable().required("Payment Mode is required"),
});

const defaultValues = {
  customer: null,
  workspace: null,
  paymentMode: null,
};

const OrderForm = ({ onCancel }) => {
  const navigate = useNavigate();
  const listRefCustomer = useRef(null);

  const [customerData, setCustomerData] = useState([]);
  const [customerPage, setCustomerPage] = useState(1);
  const [customerHasNext, setCustomerHasNext] = useState(true);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [debouncedCustomerSearch] = useDebounce(customerSearchTerm, 400);
  const [workspaceOptions, setWorkspaceOptions] = useState([]);
  const [isAddProductDisabled, setIsAddProductDisabled] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);


  const {
    data: fetchedCustomers,
    isLoading: customerLoading,
    isFetching: customerFetching,
  } = useCustomerList({
    page: customerPage,
    limit: 50,
    searchTerm: debouncedCustomerSearch,
  });

  const makeOrderMutation = useMakeOrder();

  const isSubmitting = makeOrderMutation.isPending;

  useEffect(() => {
    if (fetchedCustomers?.data) {
      setCustomerData((prev) => {
        const merged =
          customerPage === 1
            ? fetchedCustomers.data
            : [...prev, ...fetchedCustomers.data];
        return merged.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t._id === item._id)
        );
      });
      setCustomerHasNext(fetchedCustomers.data.length === 50);
    }
  }, [fetchedCustomers, customerPage]);

  const handleCustomerScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 20 &&
      !customerLoading &&
      customerHasNext
    ) {
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
  label: `${c.first_name ? c.first_name : ''} ${c.last_name ? c.last_name : ''}`.trim() || c.email,
  fullData: c,
}));


  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm({
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
      const options = workspaceData.workspaces.map((w) => ({
        value: w.id,
        label: w.name,
      }));
      setWorkspaceOptions(options);
    } else {
      setWorkspaceOptions([]);
    }
  }, [workspaceData]);

  const { data: adminCart, refetch: refetchAdminCart } = useAdminCart(
    selectedCustomer?.fullData?._id
  );

  const clientId = selectedCustomer?.fullData?._id;
  const workspace_Id = selectedWorkspace?.value;

  const { data: walletPrice } = useWalletBalance(clientId, workspace_Id);
  const userWallet = walletPrice?.data?.total >= adminCart?.data?.Total;


  useEffect(() => {
    if (selectedCustomer?.fullData?._id) {
      refetchAdminCart();
    }
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

  const onSubmit = (formData) => {
    if (!selectedCustomer?.fullData?._id || !selectedWorkspace?.value) return;

    const payload = {
      clientId: selectedCustomer.fullData._id,
      isWallet: userWallet,
      paymentMethod: formData.paymentMode?.value || null,
      workspaceId: selectedWorkspace.value,
    };

    makeOrderMutation.mutate(payload, {
      onSuccess: (data) => {
        console.log("✅ Order created successfully", data);
        reset(defaultValues);
        setIsAddProductDisabled(true);
      },
      onError: (err) => {
        console.error("❌ Failed to create order:", err);
      },
    });
  };

  const handleCancel = () => {
    reset(defaultValues);
    onCancel?.();
    setIsAddProductDisabled(true);
  };

  const handleAddProductClick = () => {
    setIsDialogOpen(true);
    setIsAddProductDisabled(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsAddProductDisabled(!(selectedCustomer && selectedWorkspace));
  };

  const handleViewCartClick = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <WaveLoader size={60} barCount={6} />
        <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
          Preparing Order Form...
        </Typography>
      </Box>
    );
  }


  return (
    <Box
      sx={{
        maxHeight: "calc(100vh - 88px)",
        overflowY: "auto",
      }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <Box
          sx={{
            p: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #D1D1DB",
          }}
        >
          <Typography variant="h5">Create New Order</Typography>
          <IconButton onClick={() => navigate(-1)} color="error">
            <CloseIcon sx={{ color: "error.main" }} />
          </IconButton>
        </Box>

        {/* Customer & Workspace */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {/* Customer */}
            <Controller
              name="customer"
              control={control}
              render={({ field }) => (
                <CommonAutocomplete
                  {...field}
                  value={field.value || ""}
                  onChange={(val) => field.onChange(val)}
                  onInputChange={handleCustomerInputChange}
                  options={customerOptions}
                  label="Customer Name"
                  placeholder="Search Customer"
                  loading={customerLoading || customerFetching}
                  ListboxProps={{
                    onScroll: handleCustomerScroll,
                    ref: listRefCustomer,
                    style: { maxHeight: 250, overflowY: "auto" },
                  }}
                  height={44}
                  mandatory
                  error={!!errors.customer}
                  helperText={errors.customer?.message}
                  mb={0}
                  mt={0}
                />
              )}
            />

            {/* Workspace */}
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Controller
                name="workspace"
                control={control}
                render={({ field }) => (
                  <CommonAutocomplete
                    {...field}
                    value={field.value || ""}
                    onChange={(val) => field.onChange(val)}
                    options={workspaceOptions}
                    label="Workspace"
                    placeholder="Select Workspace"
                    loading={workspaceLoading}
                    height={44}
                    mandatory
                    error={!!errors.workspace}
                    helperText={errors.workspace?.message}
                    mb={0}
                  />
                )}
              />
            </Box>
          </Box>

          {/* Payment */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
            <Controller
              name="paymentMode"
              control={control}
              render={({ field }) => (
                <CommonAutocomplete
                  {...field}
                  value={field.value || ""}
                  onChange={(val) => field.onChange(val)}
                  options={PAYMENT_MODE_OPTIONS}
                  label="Payment Method"
                  placeholder="Select Payment Method"
                  height={44}
                  mandatory
                  error={!!errors.paymentMode}
                  helperText={errors.paymentMode?.message}
                  mb={0}
                  mt={0}
                />
              )}
            />
          </Box>
        </Box>

        {/* Buttons */}
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-start", gap: 2 }}>
          <CommonButton
            label="Add Cart"
            variant="contained"
            onClick={handleAddProductClick}
            type="button"
            disabled={isAddProductDisabled}
            disabledColor="#D1D1DB"
          />
          <CommonButton
            label="View Cart"
            variant="contained"
            onClick={handleViewCartClick}
            type="button"
            startIcon={<ShoppingCartRoundedIcon sx={{ color: "icon.light" }} />}
            disabled={isAddProductDisabled}
            disabledColor="#D1D1DB"
          />
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #D1D1DB",
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <CommonButton
            label="Cancel"
            variant="outlined"
            onClick={handleCancel}
            type="button"
            startIcon={false}

          />

          <CommonButton
            label={isSubmitting ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={18} color="inherit" />
                Creating...
              </Box>
            ) : (
              "Create Order"
            )
            }
            type="submit"
            disabled={isSubmitting}
          />
        </Box>

        {/* Add Product Dialog */}
        <AddProduct
          isDialogOpen={isDialogOpen}
          handleDialogClose={handleDialogClose}
          adminCart={adminCart}
          selectedCustomer={selectedCustomer}
          selectedWorkspace={selectedWorkspace}
        />

        {/* Drawer for View Cart */}
        <CommonDrawer
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          anchor="right"
          title="Cart Details"
          width={460}
        >
          <OrderCartTab adminCart={adminCart?.data?.products} />
        </CommonDrawer>
      </form>
    </Box>
  );
};

export default OrderForm;
