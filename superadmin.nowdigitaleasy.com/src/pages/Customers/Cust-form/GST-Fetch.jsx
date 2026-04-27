import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Business } from "@mui/icons-material";
import CommonDrawer from "../../../components/common/NDE-Drawer";
import { CommonTextField } from "../../../components/common/fields";

const GSTIN_REGEX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const schema = yup.object().shape({
  gstin: yup
    .string()
    .required("GSTIN / UIN is required")
    .matches(GSTIN_REGEX, "Enter a valid GSTIN / UIN"),
});

const GSTPrefillDrawer = ({ open, handleClose }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      gstin: "",
    },
    resolver: yupResolver(schema),
  });

  // const { mutate: fetchGST, isPending } = useFetchGSTDetails()

  const handleFetchGSTDetails = (data) => {
    console.log("GSTIN Submitted:", data.gstin);

  };

  const handleDrawerCancel = () => {
    reset({ gstin: "" });
    handleClose();
  };

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <CommonDrawer
      open={open}
      onClose={handleDrawerCancel}
      title="Prefill Customer Details From the GST Portal"
      onSubmit={handleSubmit(handleFetchGSTDetails)}
      topWidth={500}
      anchor="top"
      actions={[
        {
          label: "Cancel",
          variant: "outlined",
          onClick: handleDrawerCancel,
        },
        {
          label:"Fetch",
          onClick: handleSubmit(handleFetchGSTDetails),
        },
      ]}
    >
      <Controller
        name="gstin"
        control={control}
        render={({ field }) => (
          <CommonTextField
            {...field}
            label="GSTIN / UIN"
            placeholder="Enter GSTIN / UIN"
            startAdornment={<Business sx={{ fontSize: 18 }} />}
            error={!!errors?.gstin}
            helperText={errors?.gstin?.message}
            inputProps={{ maxLength: 15 }}
            sx={{ mb: 2 }}
            mandatory
          />
        )}
      />
    </CommonDrawer>
  );
};

export default GSTPrefillDrawer;
