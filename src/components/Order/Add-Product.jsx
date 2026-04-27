import React, { useState, useEffect } from "react";
import CommonDialog from "../common/NDE-Dialog";
import { Box, IconButton, Typography } from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import CommonAutocomplete from "../common/fields/NDE-Autocomplete";
import CommonTextField from "../common/fields/NDE-TextField";
import {
  useAllProducts,
  useProductsByGroup,
  useAddToAdminCart,
  useDomainCheck,
} from "../../hooks/order/order-hooks";
import { useAppPrice, usePlansByProduct } from "../../hooks/application/application-hooks";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FlowerLoader from "../common/NDE-loader";

const schema = yup.object().shape({
  productGroup: yup.object().nullable().required("Product Group is required"),
  productName: yup.object().nullable().required("Product Name is required"),
  billingCycle: yup.object().nullable().required("Billing Cycle is required"),
  planName: yup
    .object()
    .nullable()
    .when("productGroup", {
      is: (val) => val?.label === "Apps",
      then: (schema) => schema.required("Plan Name is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  domain: yup
    .string()
    .nullable()
    .when("productGroup", {
      is: (val) => val?.label !== "Apps" && val?.label !== "GOOGLE WORKSPACE",
      then: (schema) => schema.required("Domain is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  type: yup
    .object()
    .nullable()
    .when("productGroup", {
      is: (val) => val?.label === "DOMAIN",
      then: (schema) => schema.required("Type is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  eppCode: yup
    .string()
    .nullable()
    .when("type", {
      is: (val) => val?.value === "transfer",
      then: (schema) => schema.required("EPP Code is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .when("productGroup", {
      is: (val) =>
        val?.label === "Apps" || val?.label === "GOOGLE WORKSPACE",
      then: (schema) =>
        schema.required("Quantity is required").min(1, "Minimum 1 required"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

const AddProduct = ({ isDialogOpen, handleDialogClose, selectedCustomer, selectedWorkspace }) => {
  const userId = selectedCustomer?.fullData?._id || null;
  const workspaceId = selectedWorkspace?.value || null;

  const { data: allGroupsData, isLoading: groupLoading } = useAllProducts();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { mutate: addToCart, isLoading: addLoading } = useAddToAdminCart();

  const groupOptions =
    allGroupsData?.data?.map((item) => ({
      label: item.group.productGroupName,
      value: item.group._id,
    })) || [];

  const {
    data: productsData,
    isLoading: productLoading,
    refetch: fetchProductsByGroup,
  } = useProductsByGroup(selectedGroup?.value);

  const productOptions =
    productsData?.data?.map((p) => ({
      label: p.productName,
      value: p._id,
      cycle: p.cycle,
    })) || [];

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productGroup: null,
      productName: null,
      billingCycle: null,
      domain: "",
      planName: null,
      quantity: 0,
      type: null,
      eppCode: "",
    },
    resolver: yupResolver(schema),
  });

  const typeValue = useWatch({ control, name: "type" });
  const domainValue = useWatch({ control, name: "domain" });
  const planValue = useWatch({ control, name: "planName" });

  const { data: priceData, refetch: fetchAppPrice } = useAppPrice({
  plan: planValue?.value,
  product: selectedProduct?.value,
 });
   
  
 useEffect(() => {
  if (planValue?.value && selectedProduct?.value) {
    fetchAppPrice();
  }
}, [planValue, selectedProduct, fetchAppPrice]);

  const [domain, setDomain] = useState("");
  const [verifiedDomain, setVerifiedDomain] = useState(null);
  const { data, isFetching, refetch } = useDomainCheck(domain);

  const canVerify = domain.trim() !== "" && typeValue?.value === "register";

  useEffect(() => {
    setDomain(domainValue || "");
  }, [domainValue]);

  useEffect(() => {
    if (verifiedDomain !== domain) {
      setVerifiedDomain(null);
    }
  }, [domain, verifiedDomain]);

  const handleVerify = async () => {
    const result = await refetch();
    if (result?.data) {
      setVerifiedDomain(domain); 
    }
  };

  const onSubmit = (formData) => {
    if (!userId) return;

    let payload = {};

    if (selectedGroup?.label === "GOOGLE WORKSPACE") {
      payload = {
        userId,
        workspaceId,
        productId: formData.productName?.value,
        domainName: formData.domain,
        period: formData.billingCycle?.value,
        quantity: formData.quantity || 1,
        product: "gsuite",
      };
    } else if (selectedGroup?.label === "DOMAIN") {
      payload = {
        userId,
        workspaceId,
        productId: formData.productName?.value,
        domainName: formData.domain,
        year: formData.billingCycle?.value,
        type: formData.type?.value,
        product: "domain",
        ...(formData.type?.value === "transfer" && { eppCode: formData.eppCode }),
      };
    } else if (selectedGroup?.label === "HOSTING") {
      payload = {
        userId,
        workspaceId,
        productId: formData.productName?.value,
        domainName: formData.domain,
        period: formData.billingCycle?.value,
        product: "hosting",
      };
    } else if (selectedGroup?.label === "Apps") {
      payload = {
        userId,
        workspaceId,
        productId: formData.productName?.value,
        planId:formData.planName?.value,
        period: formData.billingCycle?.value,
        quantity: formData.quantity || 1,
        product: "apps",
      };
    } else {
      payload = {
        userId,
        workspaceId,
        productId: formData.productName?.value,
        domainName: formData.domain,
        period: formData.billingCycle?.value,
        quantity: formData.quantity || 1,
      };
    }
     
    addToCart(payload, {
      onSuccess: () => {
        handleDialogClose();
        reset();
      },
    });
  };

  const handleClose = () => {
    handleDialogClose();
    reset({
      productGroup: null,
      productName: null,
      billingCycle: null,
      domain: "",
      planName: null,
      quantity: 0,
      type: null,
    });
    setSelectedGroup(null);
    setSelectedProduct(null);
    setVerifiedDomain(null);
  };

  const billingCycleOptions =
    selectedProduct?.cycle?.map((c) => ({
      label: c,
      value: c,
    })) || [];

  const { data: plansData, isLoading: plansLoading, refetch: fetchPlans } =
    usePlansByProduct(selectedProduct?.value);

  const planOptions =
    plansData?.data?.map((p) => ({
      label: p.planName,
      value: p._id,
    })) || [];
    

  useEffect(() => {
    if (selectedGroup?.label === "Apps" && selectedProduct) {
      fetchPlans();
    }
  }, [selectedProduct, selectedGroup, fetchPlans]);

  useEffect(() => {
    if (selectedGroup) {
      fetchProductsByGroup();
      setValue("productName", null);
      setSelectedProduct(null);
      setValue("billingCycle", null);
      setValue("planName", null);
      setValue("quantity", 1);
      setValue("domain", "");
      setValue("type", null);
      setVerifiedDomain(null);
    } else {
      reset({
        productGroup: null,
        productName: null,
        billingCycle: null,
        domain: "",
        planName: null,
        quantity: 0,
        type: null,
      });
      setSelectedGroup(null);
      setSelectedProduct(null);
      setVerifiedDomain(null);
    }
  }, [selectedGroup, fetchProductsByGroup, setValue, reset]);

  return (
    <CommonDialog
      open={isDialogOpen}
      onClose={handleClose}
      title="Add Cart"
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={addLoading ? "Adding..." : "Add"}
      cancelLabel="Cancel"
      width="600px"
      submitDisabled={!selectedGroup}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Product Group */}
        <Controller
          name="productGroup"
          control={control}
          render={({ field }) => (
            <CommonAutocomplete
              {...field}
              value={field.value || null}
              onChange={(val) => {
                field.onChange(val);
                setSelectedGroup(val);
              }}
              options={groupOptions}
              label="Product Group"
              placeholder="Select Product Group"
              error={!!errors.productGroup}
              helperText={errors.productGroup?.message}
              loading={groupLoading}
              mandatory
              mt={0}
              mb={0}
            />
          )}
        />

        {/* Product Name */}
        <Controller
          name="productName"
          control={control}
          render={({ field }) => (
            <CommonAutocomplete
              {...field}
              value={field.value || null}
              onChange={(val) => {
                field.onChange(val);
                setSelectedProduct(
                  productOptions.find((p) => p.value === val?.value)
                );
              }}
              options={productOptions}
              label="Product Name"
              placeholder="Select Product Name"
              loading={productLoading}
              mandatory
              disabled={!selectedGroup}
              mt={0}
              mb={0}
              error={!!errors.productName}
              helperText={errors.productName?.message}
            />
          )}
        />

        {/* Plan Name */}
        {selectedGroup?.label === "Apps" && (
          <Controller
            name="planName"
            control={control}
            render={({ field }) => (
              <CommonAutocomplete
                {...field}
                value={field.value || null}
                onChange={(val) => field.onChange(val)}
                options={planOptions}
                label="Plan Name"
                placeholder="Select Plan"
                mandatory
                loading={plansLoading}
                disabled={!selectedProduct}
                mt={0}
                mb={0}
                error={!!errors.planName}
                helperText={errors.planName?.message}
              />
            )}
          />
        )}

        {/* Billing Cycle */}
        <Controller
          name="billingCycle"
          control={control}
          render={({ field }) => (
            <CommonAutocomplete
              {...field}
              value={field.value || null}
              onChange={(val) => field.onChange(val)}
              options={billingCycleOptions}
              label="Billing Cycle"
              placeholder="Select Billing Cycle"
              mandatory
              disabled={!selectedProduct}
              mt={0}
              mb={0}
              error={!!errors.billingCycle}
              helperText={errors.billingCycle?.message}
            />
          )}
        />

        {/* Domain Type */}
        {selectedGroup?.label === "DOMAIN" && (
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <CommonAutocomplete
                {...field}
                value={field.value || null}
                onChange={(val) => field.onChange(val)}
                options={[
                  { label: "Renewal", value: "renewal" },
                  { label: "Register", value: "register" },
                  { label: "Transfer", value: "transfer" },
                ]}
                label="Type"
                placeholder="Select Type"
                mandatory
                mt={0}
                mb={0}
                error={!!errors.type}
                helperText={errors.type?.message}
              />
            )}
          />
        )}

        {/* Domain Input with Verify  &&
          selectedGroup?.label !== "GOOGLE WORKSPACE"*/} 
        {selectedGroup?.label !== "Apps"  && ( 
            <Controller
              name="domain"
              control={control}
              render={({ field }) => (
                <Box>
                  <CommonTextField
                    {...field}
                    label="Domain"
                    placeholder="Enter Domain"
                    mandatory
                    onChange={(e) => {
                      field.onChange(e);
                      setDomain(e.target.value);
                    }}
                    error={!!errors.domain}
                    helperText={errors.domain?.message}
                    mb={0}
                  />

                  {typeValue?.value === "register" && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 1,
                        gap: 1,
                      }}
                    >
                      <Typography>Domain Verify</Typography>
                      <IconButton
                        disabled={!canVerify || isFetching}
                        onClick={handleVerify}
                      >
                        {isFetching ? (
                          <FlowerLoader size={14} />
                        ) : (
                          <CheckCircleOutlineIcon
                            sx={{
                              color:
                                verifiedDomain === domain && data?.message
                                  ? "success.main"
                                  : "primary.main",
                            }}
                          />
                        )}
                      </IconButton>
                      {verifiedDomain === domain && data && (
                        <Typography
                          sx={{
                            mt: 0.2,
                            fontSize: 14,
                            color: data.message ? "success.main" : "error.main",
                          }}
                        >
                          {data.message
                            ? "Domain Available"
                            : "Domain Not Available"}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              )}
            />
          )}

        {/* EPP Code */}
        {typeValue?.value === "transfer" && (
          <Controller
            name="eppCode"
            control={control}
            rules={{ required: "EPP Code is required" }}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="EPP Code"
                placeholder="Enter EPP Code"
                mt={0}
                mb={0}
                error={!!errors.eppCode}
                helperText={errors.eppCode?.message}
                mandatory
              />
            )}
          />
        )}

        {/* Quantity */}
        {(selectedGroup?.label === "Apps" ||
          selectedGroup?.label === "GOOGLE WORKSPACE") && (
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Quantity"
                type="number"
                placeholder="Enter Quantity"
                mt={0}
                mb={0}
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
              />
            )}
          />
        )}
      </Box>
    </CommonDialog>
  );
};

export default AddProduct;
