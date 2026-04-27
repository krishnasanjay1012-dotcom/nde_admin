import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Typography,
  Divider,
  Button,
  Paper,
} from "@mui/material";

import CommonDrawer from "../../common/NDE-Drawer";
import CommonTextField from "../../common/fields/NDE-TextField";
import {
  usePlanById,
  useUpdatePlanPricing,
} from "../../../hooks/products/products-hooks";

// Validation schema
const validationSchema = Yup.object().shape({
  register_strike_amount: Yup.number().min(0).required(),
  renewal_strike_amount: Yup.number().min(0).required(),
  transfer_strike_amount: Yup.number().min(0).required(),
  button_label: Yup.string().required("Button title is required"),
  button_color: Yup.string().required(),
  button_text_color: Yup.string().required(),
});

const PlanStrikeAmount = ({
  open,
  onClose,
  selectedBillingCycleId,
  selectedCurrencyId,
  planPricing,
  planId,
}) => {
  const updatePlanPricing = useUpdatePlanPricing();
  const { data: fetchedPlans, refetch } = usePlanById(planId, false);

  useEffect(() => {
    if (open && planId) refetch();
  }, [open, planId, refetch]);

  const PlanData = fetchedPlans?.data;

  const currentEntry =
    planPricing?.price_entries?.find(
      (p) => p.bill_every === selectedBillingCycleId
    ) || {};




  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      register_strike_amount: 0,
      renewal_strike_amount: 0,
      transfer_strike_amount: 0,
      button_label: "SUBSCRIBE",
      button_color: "#F6D27A",
      button_text_color: "#000000",
    },
  });

  // Populate form values when currentEntry changes
  useEffect(() => {
    setValue("register_strike_amount", currentEntry.register_strike_amount || 0);
    setValue("renewal_strike_amount", currentEntry.renewal_strike_amount || 0);
    setValue("transfer_strike_amount", currentEntry.transfer_strike_amount || 0);
    setValue("button_label", currentEntry.button_label || "SUBSCRIBE");
    setValue("button_color", currentEntry.button_color || "#F6D27A");
    setValue("button_text_color", currentEntry.button_text_color || "#000000");
  }, [currentEntry, setValue]);

  const onSubmit = (data) => {
    updatePlanPricing.mutate(
      {
        plan_id: planId,
        currency_id: selectedCurrencyId,
        pricing: [
          {
            _id: currentEntry._id,
            plan_billing_cycle: selectedBillingCycleId,
            register_strike_amount: Number(data.register_strike_amount),
            renewal_strike_amount: Number(data.renewal_strike_amount),
            transfer_strike_amount: Number(data.transfer_strike_amount),
          },
        ],
      },
      { onSuccess: onClose }
    );
  };

  return (
    <CommonDrawer
      open={open}
      anchor="right"
      width={1000}
      title="Strike Amount"
      onClose={onClose}
      actions={[
        { label: "Cancel", variant: "outlined", onClick: onClose },
        {
          label: "Update",
          onClick: handleSubmit(onSubmit),
          disabled: !isDirty,
        },
      ]}
    >
      <Box display="flex" height="100%">
        {/* LEFT SIDE */}
        <Box flex={1} maxWidth={320} sx={{ borderRight: "1px solid #E5E7EB", pr: 2 }}>
          <Typography fontWeight={600} mb={2}>
            Configure Strike Amount
          </Typography>

          <StrikeField
            label="Register Strike"
            price={currentEntry?.register_price}
            name="register_strike_amount"
            control={control}
            error={errors.register_strike_amount}
            currencySymbol={currentEntry?.currencySymbol}
          />

          <StrikeField
            label="Renewal Strike"
            price={currentEntry?.renewal_price}
            name="renewal_strike_amount"
            control={control}
            error={errors.renewal_strike_amount}
            currencySymbol={currentEntry?.currencySymbol}

          />

          <StrikeField
            label="Transfer Strike"
            price={currentEntry?.transfer_price}
            name="transfer_strike_amount"
            control={control}
            error={errors.transfer_strike_amount}
            currencySymbol={currentEntry?.currencySymbol}
          />

          <Divider sx={{ my: 2 }} />

          <Typography fontWeight={600} mb={1}>
            Button Action
          </Typography>
          <Box flex={1}>
            <Controller
              name="button_label"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  {...field}
                  label="Button Title"
                  size="small"
                  error={!!errors.button_label}
                  helperText={errors.button_label?.message}
                  mb={1}
                />
              )}
            />
          </Box>

          <Box display="flex" gap={2}>
            <Box width={140}>
              <Controller
                name="button_color"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    type="color"
                    label="Bg Color"
                    mb={0}
                    sx={{
                      p: 0,
                      "& input": {
                        padding: 0,
                        height: 45,
                        cursor: "pointer",
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Box width={140}>
              <Controller
                name="button_text_color"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    type="color"
                    label="Text Color"
                    mb={0}
                    sx={{
                      p: 0,
                      "& input": {
                        padding: 0,
                        height: 45,
                        cursor: "pointer",
                      },
                    }}
                  />
                )}
              />
            </Box>
          </Box>
        </Box>

        {/* RIGHT SIDE - PREVIEW CARDS */}
        <Box
          flex={1}
          display="grid"
          gridTemplateColumns="repeat(3, 1fr)"
          gap={2}
          px={3}
          alignItems="center"
        >
          <PreviewCard
            PlanData={PlanData}
            strike={watch("register_strike_amount")}
            price={currentEntry?.register_price}
            billing={currentEntry?.plan_billing_cycle?.label}
            buttonLabel={watch("button_label")}
            buttonBgColor={watch("button_color")}
            buttonTextColor={watch("button_text_color")}
            currencySymbol={currentEntry?.currencySymbol}

          />
          <PreviewCard
            PlanData={PlanData}
            strike={watch("renewal_strike_amount")}
            price={currentEntry?.renewal_price}
            billing={currentEntry?.plan_billing_cycle?.label}
            buttonLabel={watch("button_label")}
            buttonBgColor={watch("button_color")}
            buttonTextColor={watch("button_text_color")}
            currencySymbol={currentEntry?.currencySymbol}

          />
          <PreviewCard
            PlanData={PlanData}
            strike={watch("transfer_strike_amount")}
            price={currentEntry?.transfer_price}
            billing={currentEntry?.plan_billing_cycle?.label}
            buttonLabel={watch("button_label")}
            buttonBgColor={watch("button_color")}
            buttonTextColor={watch("button_text_color")}
            currencySymbol={currentEntry?.currencySymbol}

          />
        </Box>
      </Box>
    </CommonDrawer>
  );
};

// Strike amount input field
const StrikeField = ({ label, price, name, control, error, currencySymbol}) => (
  <Box display="flex" justifyContent="space-between" mb={1.5}>
    <Typography fontSize={13} color="text.secondary">
      {label} <span style={{ color: "#6B7280" }}>Amount ({currencySymbol}{price})</span>
    </Typography>

    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <CommonTextField
          {...field}
          type="number"
          size="small"
          sx={{ width: 140 }}
          error={!!error}
          helperText={error?.message}
          mb={-1}
          mt={0}
        />
      )}
    />
  </Box>
);

const PreviewCard = ({
  strike,
  price,
  billing,
  buttonLabel,
  buttonBgColor,
  buttonTextColor,
  PlanData,
  currencySymbol
}) => (


  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 2,
      border: "1px solid #E6E8EC",
      textAlign: "center",
    }}
  >
    <Typography mb={1} mt={-1.5}>
      {PlanData?.plan_name}
    </Typography>

    <Divider sx={{ mb: 2 }} />

    {strike > 0 && (
      <Typography
        sx={{
          textDecoration: "line-through",
          color: "text.secondary",
          mb: 1.5,
        }}
      >
        {currencySymbol}{strike}
      </Typography>
    )}

    <Typography fontSize={30}>{currencySymbol}{price}</Typography>

    <Typography fontSize={13} color="text.secondary" mt={1}>
      Billed {billing}
    </Typography>

    <Button
      fullWidth
      variant="contained"
      sx={{
        mt: 1.5,
        height: 40,
        backgroundColor: buttonBgColor,
        color: buttonTextColor,
        "&:hover": { backgroundColor: buttonBgColor },
      }}
    >
      {buttonLabel}
    </Button>
  </Paper>
);

export default PlanStrikeAmount;
