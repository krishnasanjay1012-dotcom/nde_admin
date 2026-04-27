import React, { useEffect } from "react";
import { Typography, Box, Link } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CommonTextField } from "../../../common/fields";
import { useConfigurePaymentId } from "../../../../hooks/sales/invoice-hooks";
import CommonDialog from "../../../common/NDE-Dialog";

const MAX_TOTAL_LENGTH = 50;

const schema = yup.object().shape({
  mode: yup.string().required(),

  prefixString: yup.string().when("mode", {
    is: (val) => val === "auto" || val === "manual",
    then: (schema) => schema.required("Prefix is required"),
  }),

  nextNumber: yup.string().when("mode", {
    is: "auto",
    then: (schema) =>
      schema
        .required("Next Number is required")
        .matches(/^\d+$/, "Must be a number")
        .test(
          "combined-length",
          `Prefix + Next Number must not exceed ${MAX_TOTAL_LENGTH} characters`,
          function (value) {
            const { prefixString } = this.parent;
            const total = (prefixString?.length || 0) + (value?.length || 0);
            return total <= MAX_TOTAL_LENGTH;
          },
        ),
  }),

  manualNumber: yup.string().when("mode", {
    is: "manual",
    then: (schema) =>
      schema
        .required("Payment Number is required")
        .matches(/^\d+$/, "Must be a number")
        .test(
          "combined-length",
          `Prefix + Payment Number must not exceed ${MAX_TOTAL_LENGTH} characters`,
          function (value) {
            const { prefixString } = this.parent;
            const total = (prefixString?.length || 0) + (value?.length || 0);
            return total <= MAX_TOTAL_LENGTH;
          },
        ),
  }),
});

const ConfigurePaymentDialog = ({
  open,
  onClose,
  nextNumber,
  prefix,
  uniqueId,
  invoiceId,
  onUpdate = () => {},
  module = "Payment",
  handleToOpenConfirmation,
}) => {
  const { mutateAsync, isPending } = useConfigurePaymentId(invoiceId, module);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      mode: "auto",
      prefixString: prefix,
      nextNumber: nextNumber,
      manualNumber: "",
    },
    resolver: yupResolver(schema),
  });

  const mode = watch("mode");

  const onSubmit = async (data) => {
    try {
      const numberToSend =
        mode === "auto" ? data.nextNumber : data.manualNumber;

      await mutateAsync({
        nextNumber: numberToSend,
        prefixString: data.prefixString,
        _id: uniqueId,
      });

      onUpdate(data.prefixString, numberToSend);
      onClose();
    } catch {
      console.warn("");
    }
  };

  useEffect(() => {
    setValue("nextNumber", nextNumber);
    setValue("prefixString", prefix);
  }, [nextNumber, prefix, setValue]);

  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      title={`Configure ${module} Number Preferences`}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel="Save"
      maxWidth="md"
      submitDisabled={isPending}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          borderRadius: 1,
          mb: 3,
        }}
      >
        <InfoOutlinedIcon color="action" />
        <Typography variant="body2" sx={{ flex: 1 }}>
          Configure multiple transaction number series to auto-generate
          transaction numbers with unique prefixes according to your business
          needs.
        </Typography>
        <Link component="button" onClick={handleToOpenConfirmation}>
          Configure →
        </Link>
      </Box>

      <Typography sx={{ mb: 2 }}>
        Auto-generating payment numbers can save your time. Would you like to
        change your current setting?
      </Typography>

      {/* AUTO MODE */}
      {mode === "auto" && (
        <Box sx={{ display: "flex", gap: 2, ml: 1, mt: 1 }}>
          <Controller
            name="prefixString"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Prefix"
                size="small"
                error={!!errors.prefixString}
                helperText={errors.prefixString?.message}
                maxLength={50}
              />
            )}
          />

          <Controller
            name="nextNumber"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Next Number"
                size="small"
                error={!!errors.nextNumber}
                helperText={errors.nextNumber?.message}
                maxLength={50}
              />
            )}
          />
        </Box>
      )}

      {/* MANUAL MODE */}
      {mode === "manual" && (
        <Box sx={{ display: "flex", gap: 2, ml: 1, mt: 1 }}>
          <Controller
            name="prefixString"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Prefix"
                size="small"
                error={!!errors.prefixString}
                helperText={errors.prefixString?.message}
                maxLength={50}
              />
            )}
          />

          <Controller
            name="manualNumber"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Payment Number"
                size="small"
                error={!!errors.manualNumber}
                helperText={errors.manualNumber?.message}
                maxLength={50}
              />
            )}
          />
        </Box>
      )}
    </CommonDialog>
  );
};

export default ConfigurePaymentDialog;
