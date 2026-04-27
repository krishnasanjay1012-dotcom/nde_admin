import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonDialog from "../../../components/common/NDE-Dialog";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMigrateResellers } from "../../../hooks/Customer/Customer-hooks";
import { CommonAutocomplete } from "../../common/fields";
import {
  usePlanBillingCycles,
  usePlans,
  useProducts,
} from "../../../hooks/products/products-hooks";

const schema = yup.object().shape({
  productId: yup.string().required("Product Name is required"),
  planId: yup.string().required("Plan Name is required"),
  domain: yup.string().required("Domain Name is required"),
  billingCycleId: yup.string().required("Registration Period is required"),
});

const DomainDetails = ({
  open,
  setOpen,
  initialData,
  clientId,
  selectedWorkspaceId,
}) => {
  const [submitting, setSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      productId: "",
      planId: "",
      domain: "",
      billingCycleId: "",
    },
  });

  const migrateResellerMutation = useMigrateResellers();

  /* ------------------ PRODUCTS ------------------ */

  const { data: productData } = useProducts({
    type: "domain",
    search: "",
    filter: "",
  });

  const productOptions = useMemo(() => {
    return (
      productData?.data?.map((p) => ({
        label: p.product_name,
        value: p._id,
      })) || []
    );
  }, [productData]);

  /* ------------------ WATCH PRODUCT ------------------ */

  const selectedProductId = useWatch({
    control,
    name: "productId",
  });

  /* ------------------ PLANS ------------------ */

  const { data: plansData } = usePlans("domain", selectedProductId, {
    enabled: !!selectedProductId,
  });

  const planOptions = useMemo(
    () =>
      plansData?.data?.map((plan) => ({
        label: plan.plan_name,
        value: plan._id,
      })) || [],
    [plansData]
  );

  /* ------------------ BILLING CYCLES ------------------ */

  const { data: billingCycleResponse = [] } = usePlanBillingCycles({
    type: "domain",
    enabled: open,
  });

  const billingOptions = useMemo(
    () =>
      billingCycleResponse?.map((c) => ({
        label: c.label,
        value: c._id,
      })) || [],
    [billingCycleResponse]
  );

  /* ------------------ RESET FORM ------------------ */

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        productId: "",
        planId: "",
        domain: "",
        billingCycleId: "",
      });
    }
  }, [initialData, reset]);

  /* ------------------ RESET PLAN WHEN PRODUCT CHANGES ------------------ */

  useEffect(() => {
    setValue("planId", "");
  }, [selectedProductId, setValue]);

  const handleClose = () => {
    setOpen(false);

    reset({
      productId: "",
      planId: "",
      domain: "",
      billingCycleId: "",
    });
  };

  /* ------------------ SUBMIT ------------------ */

  const onSubmit = (formData) => {
    setSubmitting(true);

    const payload = {
      domain: formData.domain,
      productId: formData.productId,
      planId: formData.planId,
      billingCycleId: formData.billingCycleId,
      clientId: clientId,
      workspace_id: selectedWorkspaceId,
    };

    migrateResellerMutation.mutate(payload, {
      onSuccess: () => {
        setSubmitting(false);
        handleClose();
      },
      onError: (err) => {
        setSubmitting(false);
        console.error("Domain migration failed:", err);
      },
    });
  };

  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title={initialData ? "Edit Domain" : "Add Domain"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={initialData ? "Update" : "Submit"}
        cancelLabel="Cancel"
        loading={submitting}
        submitDisabled={!isDirty || migrateResellerMutation.isPending}
      >
        <Box>
          {/* Product Name */}

          <Controller
            name="productId"
            control={control}
            render={({ field }) => (
              <CommonAutocomplete
                label="Product Name"
                options={productOptions}
                value={
                  productOptions.find((opt) => opt.value === field.value) ||
                  null
                }
                onChange={(val) => field.onChange(val?.value || "")}
                error={!!errors.productId}
                helperText={errors.productId?.message}
                mandatory
              />
            )}
          />

          {/* Plan Name */}

          <Controller
            name="planId"
            control={control}
            render={({ field }) => (
              <CommonAutocomplete
                label="Plan Name"
                options={planOptions}
                value={
                  planOptions.find((opt) => opt.value === field.value) || null
                }
                disabled={!selectedProductId}
                onChange={(val) => field.onChange(val?.value || "")}
                error={!!errors.planId}
                helperText={errors.planId?.message}
                mandatory
                sx={{ mb: 2 }}
              />
            )}
          />

          {/* Domain Name */}

          <Controller
            name="domain"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Domain Name"
                type="text"
                error={!!errors.domain}
                helperText={errors.domain?.message}
                mandatory
                sx={{ mb: 2 }}
              />
            )}
          />

          {/* Billing Cycle */}

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
        </Box>
      </CommonDialog>
    </Box>
  );
};

export default DomainDetails;