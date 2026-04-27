import { Box, Typography } from "@mui/material";
import { useForm, Controller, FormProvider } from "react-hook-form";
import {
  CommonTextField,
  CommonSelect,
  CommonRadioButton,
  CommonDatePicker,
  CommonAutocomplete,
} from "../common/fields";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonDrawer from "../common/NDE-Drawer";
import { useMasters } from "../../hooks/GSuitePrice/GSuitePrice-hooks";
import { useEffect, useMemo } from "react";

// Yup validation
const couponSchema = yup.object().shape({
  couponName: yup.string().trim().required("Coupon Name is required"),
  couponCode: yup
    .string()
    .trim()
    .required("Coupon Code is required")
    .matches(/^[a-zA-Z0-9-_]+$/, "Coupon Code must be alphanumeric"),
  discount: yup
    .number()
    .typeError("Discount must be a number")
    .required("Discount is required")
    .positive("Discount must be greater than 0"),
  discountType: yup.string().required("Select discount type"),
  redemptionType: yup.string().required("Redemption Type is required"),
  associatePlans: yup.string().required("Associate Plans is required"),
  associateAddons: yup.string().required("Associate Addons is required"),
  expirationDate: yup.date().nullable(),
  maxRedemptions: yup.number().typeError("Must be a number").nullable(),
});

// Default values
const defaultValues = {
  couponName: "",
  couponCode: "",
  discount: "",
  discountType: "Flat",
  redemptionType: "one_time",
  associatePlans: "all",
  associateAddons: "all",
  expirationDate: null,
  maxRedemptions: "",
};

const CouponForm = ({ open, handleClose, selectedCoupon }) => {
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(couponSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = methods;

  const { data: mastersData = [] } = useMasters();

  const planOptions = useMemo(
    () =>
      mastersData.map((m) => ({
        label: m.productName,
        value: m._id,
      })),
    [mastersData]
  );

  useEffect(() => {
    if (selectedCoupon) {
      reset({ ...defaultValues, ...selectedCoupon });
    }
  }, [selectedCoupon, reset]);

  const onSubmit = (data) => {
    console.log("FORM DATA", data);
  };

  return (
    <CommonDrawer
      open={open}
      onClose={handleClose}
      anchor="right"
      width={600}
      title={selectedCoupon ? "Edit Coupon" : "Create Coupon"}
      actions={[
        { label: "Cancel", variant: "outlined", onClick: handleClose },
        {
          label: selectedCoupon ? "Update" : "Save",
          onClick: handleSubmit(onSubmit),
          disabled: !isDirty,
        },
      ]}
    >
      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} >
          {/* Coupon Details */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ flex: "1 1 48%" }}>
              <Controller
                name="couponName"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    label="Coupon Name"
                    mandatory
                    error={!!errors.couponName}
                    helperText={errors.couponName?.message}
                    mb={0}
                  />
                )}
              />
            </Box>

            <Box sx={{ flex: "1 1 48%" }}>
              <Controller
                name="couponCode"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    label="Coupon Code"
                    mandatory
                    error={!!errors.couponCode}
                    helperText={errors.couponCode?.message}
                    mb={0}
                  />
                )}
              />
            </Box>
            <Box sx={{ flex: "1 1 100%", md: "1 1 48%" }}>
              <Controller
                name="discount"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    label="Discount"
                    type="number"
                    mandatory
                    error={!!errors.discount}
                    helperText={errors.discount?.message}
                    mb={0}
                    startAdornment={
                      <Controller
                        name="discountType"
                        control={control}
                        render={({ field: typeField }) => (
                          <CommonSelect
                            {...typeField}
                            options={[
                              { label: "Flat", value: "Flat" },
                              { label: "%", value: "Percentage" },
                            ]}
                            sx={{
                              backgroundColor: "#f9f9fb",
                              marginLeft: "-14px",
                              marginTop: "16px",
                              "& .MuiSelect-select": {
                                padding: "5px 8px",
                                fontSize: "12px",
                              },
                            }}
                          />
                        )}
                      />
                    }
                  />
                )}
              />
            </Box>

            <Box sx={{ flex: "1 1 100%" }}>
              <Controller
                name="redemptionType"
                control={control}
                render={({ field }) => (
                  <CommonRadioButton
                    {...field}
                    label="Redemption Type"
                    mandatory
                    options={[
                      { label: "One Time", value: "one_time" },
                      { label: "Unlimited", value: "unlimited" },
                      { label: "Limited number of times", value: "limited" },
                    ]}
                  />
                )}
              />
              <Typography variant="caption" color="text.secondary">
                The number of cycles that this coupon can be redeemed for each subscription.
              </Typography>
            </Box>

            <Box sx={{ flex: "1 1 48%" }}>
              <Controller
                name="associatePlans"
                control={control}
                render={({ field }) => (
                  <CommonAutocomplete
                    {...field}
                    label="Associate Plans"
                    options={[{ label: "All Plans", value: "all" }, ...planOptions]}
                    mb={0}
                  />
                )}
              />
            </Box>

            <Box sx={{ flex: "1 1 48%" }}>
              <Controller
                name="associateAddons"
                control={control}
                render={({ field }) => (
                  <CommonAutocomplete
                    {...field}
                    label="Associate Addons"
                    options={[
                      { label: "All Recurring Addons", value: "all" },
                      // Add more if needed
                    ]}
                    mb={0}
                  />
                )}
              />
            </Box>

            <Box sx={{ flex: "1 1 48%" }}>
              <Controller
                name="expirationDate"
                control={control}
                render={({ field }) => (
                  <CommonDatePicker
                    {...field}
                    label="Expiration Date"
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
            </Box>

            <Box sx={{ flex: "1 1 48%" }}>
              <Controller
                name="maxRedemptions"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    label="Maximum Redemptions"
                    type="number"
                    helperText="The Maximum number of subscriptions that can redeem this coupon."
                    mb={0}
                  />
                )}
              />
            </Box>
          </Box>
        </Box>
      </FormProvider>
    </CommonDrawer>
  );
};

export default CouponForm;
