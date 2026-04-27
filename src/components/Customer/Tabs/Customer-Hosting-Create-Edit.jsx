import { useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonDatePicker from "../../../components/common/fields/NDE-DatePicker";
import CommonDialog from "../../../components/common/NDE-Dialog";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMigratePlesk } from "../../../hooks/Customer/Customer-hooks";
import { usePlanBillingCycles, usePlans, useProducts } from "../../../hooks/products/products-hooks";
import { CommonAutocomplete } from "../../common/fields";

const schema = yup.object().shape({
  domain: yup.string().required("Domain is required"),
  productName: yup.string().required("Product Name is required"),
  planName: yup.string().required("Plan Name is required"),
  orderDate: yup.date().required("Order Date is required"),
  billingCycleId: yup.string().required("Billing Cycle is required"),

});

const HostingDetails = ({
  open,
  setOpen,
  initialData,
  clientId,
  selectedWorkspaceId,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      domain: "",
      productName: "",
      planName: "",
      orderDate: null,
    },
  });

  const migratePleskMutation = useMigratePlesk();

  const { data: tableData } = useProducts({
    type: "hosting",
    search: "",
    filter: ''
  });

  const productOptions = useMemo(
    () =>
      tableData?.data?.map((m) => ({
        label: m.product_name,
        value: m._id,
      })) || [],
    [tableData]
  );

  const selectedProductId = useWatch({
    control,
    name: "productName",
  });


  const { data: billingCycleResponse = [] } = usePlanBillingCycles({ type: "hosting", enabled: open });
  const billingCycles = billingCycleResponse || [];
  const { data: plansData } = usePlans("hosting", selectedProductId);

  const planOptions = useMemo(
    () =>
      plansData?.data?.map((plan) => ({
        label: plan.plan_name,
        value: plan._id,
      })) || [],
    [plansData]
  );

  const billingOptions = useMemo(
    () =>
      billingCycles?.map((c) => ({
        label: c.label,
        value: c._id,
      })) || [],
    [billingCycles]
  );

  useEffect(() => {
    setValue("planName", "");
  }, [selectedProductId, setValue]);


  useEffect(() => {
    if (!open) return;

    if (initialData) {
      reset(initialData);
    } else {
      reset({
        domain: "",
        productName: "",
        planName: "",
        orderDate: null,
      });
    }
  }, [open, initialData, reset]);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    const payload = {
      workspace_id: selectedWorkspaceId,
      planId: data.planName,
      domain:data.domain,
      productName: data.productName,
      orderDate: data.orderDate,
      billingCycleId: data.billingCycleId,
      clientId,
    };

    migratePleskMutation.mutate(payload, {
      onSuccess: handleClose,
      onError: (err) =>
        console.error("Plesk migration failed:", err),
    });
  };

  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title={initialData ? "Edit Hosting" : "Add Hosting"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={initialData ? "Update" : "Submit"}
        cancelLabel="Cancel"
        loading={migratePleskMutation.isLoading}
        submitDisabled={!isDirty || migratePleskMutation.isPending}
      >
        <Box>

          {/* DOMAIN */}
          <Controller
            name="domain"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Domain"
                type="text"
                error={!!errors.domain}
                helperText={errors.domain?.message}
                mandatory
                sx={{ mb: 2 }}
              />
            )}
          />

          {/* PRODUCT (Autocomplete) */}
          <Controller
            name="productName"
            control={control}
            render={({ field }) => {
              const selectedProduct =
                productOptions.find(
                  (opt) => opt.value === field.value
                ) || null;

              return (
                <CommonAutocomplete
                  label="Product Name"
                  options={productOptions}
                  value={selectedProduct}
                  onChange={(newValue) =>
                    field.onChange(
                      newValue ? newValue.value : ""
                    )
                  }
                  error={!!errors.productName}
                  helperText={errors.productName?.message}
                  mandatory
                  sx={{ mb: 2 }}
                />
              );
            }}
          />

          {/* PLAN (Autocomplete) */}
          <Controller
            name="planName"
            control={control}
            render={({ field }) => {
              const selectedPlan =
                planOptions.find(
                  (opt) => opt.value === field.value
                ) || null;

              return (
                <CommonAutocomplete
                  label="Plan Name"
                  options={planOptions}
                  value={selectedPlan}
                  onChange={(newValue) =>
                    field.onChange(
                      newValue ? newValue.value : ""
                    )
                  }
                  disabled={!selectedProductId}
                  error={!!errors.planName}
                  helperText={errors.planName?.message}
                  mandatory
                  sx={{ mb: 2 }}
                />
              );
            }}
          />
          <Controller
            name="billingCycleId"
            control={control}
            render={({ field }) => {
              const selectedOption =
                billingOptions.find((opt) => opt.value === field.value) || null;

              return (
                <CommonAutocomplete
                  label="Billing Cycle"
                  options={billingOptions}
                  value={selectedOption}
                  onChange={(newValue) =>
                    field.onChange(newValue ? newValue.value : "")
                  }
                  error={!!errors.billingCycleId}
                  helperText={errors.billingCycleId?.message}
                  mandatory
                />
              );
            }}
          />

          {/* ORDER DATE */}
          <Controller
            name="orderDate"
            control={control}
            render={({ field }) => (
              <CommonDatePicker
                {...field}
                label="Order Date"
                error={!!errors.orderDate}
                helperText={errors.orderDate?.message}
                mandatory
                mb={0}
              />
            )}
          />
        </Box>
      </CommonDialog>
    </Box>
  );
};

export default HostingDetails;
