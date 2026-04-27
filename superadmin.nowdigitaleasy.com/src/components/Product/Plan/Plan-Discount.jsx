import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";

import CommonDialog from "../../common/NDE-Dialog";
import {
  usePlanPriceDiscount,
  useUpdatePlanPriceDiscount,
} from "../../../hooks/products/products-hooks";
import { CommonNumberField } from "../../common/fields";

const validationSchema = Yup.object().shape({
  offer_duration_months: Yup.number()
    .typeError("Duration must be a number")
    .required("Offer duration is required")
    .positive("Must be greater than 0"),

  max_users: Yup.number()
    .typeError("Max users must be a number")
    .required("Max users is required")
    .positive("Must be greater than 0"),

  offer_price: Yup.number()
    .typeError("Offer price must be a number")
    .required("Offer price is required")
    .min(0, "Price cannot be negative"),
});

const PlanDiscount = ({
  open,
  onClose,
  planId,
  selectedBillingCycleId,
  selectedCurrencyId,
}) => {
  const { data } = usePlanPriceDiscount({
    plan_id: planId,
    currency_id: selectedCurrencyId,
    billing: selectedBillingCycleId,
  });

  const discountData = data?.data;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      offer_duration_months: undefined,
      max_users: undefined,
      offer_price: undefined,
    },
  });

  const { mutate: updatePriceDiscount, isLoading } =
    useUpdatePlanPriceDiscount();

  useEffect(() => {
    if (discountData) {
      reset({
        offer_duration_months:
          discountData.offer_duration_months ?? undefined,
        max_users: discountData.max_users ?? undefined,
        offer_price: discountData.offer_price ?? undefined,
      });
    }
  }, [discountData, reset]);

  const onSubmit = (formData) => {
    const payload = {
      plan_id: planId,
      currency_id: selectedCurrencyId,
      billing_cycle: selectedBillingCycleId,
      offer_price: formData.offer_price,
      max_users: formData.max_users,
      offer_duration_months: formData.offer_duration_months,
      is_active: true,
    };

    updatePriceDiscount(payload, {
      onSuccess: () => onClose(),
      onError: (err) =>
        console.error("Failed to update plan discount:", err),
    });
  };

  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      title="Update Offer"
      onSubmit={handleSubmit(onSubmit)}
      submitLabel="Update"
      cancelLabel="Cancel"
      submitDisabled={!isDirty || isLoading}
    >
      <Box display="flex" flexDirection="column">
        {/* Offer Duration */}
        <Controller
          name="offer_duration_months"
          control={control}
          render={({ field }) => (
            <CommonNumberField
              label="Offer Duration (Months)"
              size="small"
              type="number"
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === ""
                    ? undefined
                    : Number(e.target.value)
                )
              }
              error={!!errors.offer_duration_months}
              helperText={errors.offer_duration_months?.message}
              mandatory
            />
          )}
        />

        {/* Max Users */}
        <Controller
          name="max_users"
          control={control}
          render={({ field }) => (
            <CommonNumberField
              label="Max Users"
              size="small"
              type="number"
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === ""
                    ? undefined
                    : Number(e.target.value)
                )
              }
              error={!!errors.max_users}
              helperText={errors.max_users?.message}
              mandatory
            />
          )}
        />

        {/* Offer Price */}
        <Controller
          name="offer_price"
          control={control}
          render={({ field }) => (
            <CommonNumberField
              label="Offer Price"
              size="small"
              type="number"
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === ""
                    ? undefined
                    : Number(e.target.value)
                )
              }
              error={!!errors.offer_price}
              helperText={errors.offer_price?.message}
              mandatory
              mb={0}
            />
          )}
        />
      </Box>
    </CommonDialog>
  );
};

export default PlanDiscount;
