import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CommonDialog from "../../../components/common/NDE-Dialog";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonCheckbox from "../../../components/common/fields/NDE-Checkbox";

const schema = yup.object().shape({
  termName: yup
    .string()
    .required("Term name is required"),

  numberOfDays: yup
    .number()
    .typeError("Number of days must be a number")
    .required("Number of days is required"),

  isDefault: yup.boolean()
});

const PaymentTermCreateEdit = ({
  open,
  setOpen,
  initialData,
  onSubmitAction
}) => {

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      termName: "",
      numberOfDays: "",
      isDefault: false
    }
  });

  useEffect(() => {

    if (initialData) {
      reset({
        termName: initialData.termName || "",
        numberOfDays: initialData.numberOfDays || "",
        isDefault: initialData.isDefault || false
      });
    } else {
      reset({
        termName: "",
        numberOfDays: "",
        isDefault: false
      });
    }

  }, [initialData, reset]);

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data) => {

    const payload = {
      termName: data.termName,
      numberOfDays: Number(data.numberOfDays) || 0,
      isDefault: Boolean(data.isDefault)
    };

    onSubmitAction(payload);
  };

  return (
    <CommonDialog
      open={open}
      onClose={handleClose}
      title={initialData ? "Edit Payment Term" : "Add Payment Term"}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={initialData ? "Update" : "Add"}
      cancelLabel="Cancel"
      submitDisabled={!isDirty}
      maxWidth="md"
      width="40dvw"
    >

      <Box sx={{ display: "flex", flexDirection: "column"}}>

        {/* Term Name */}
        <Controller
          name="termName"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Term Name"
              error={!!errors.termName}
              helperText={errors.termName?.message}
              mandatory
            />
          )}
        />

        {/* Number of Days */}
        <Controller
          name="numberOfDays"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Number Of Days"
              type="number"
              error={!!errors.numberOfDays}
              helperText={errors.numberOfDays?.message}
            />
          )}
        />

        {/* Default Checkbox */}
        <Controller
          name="isDefault"
          control={control}
          render={({ field }) => (
            <CommonCheckbox
              {...field}
              checked={field.value}
              label="Set as Default"
            />
          )}
        />

      </Box>

    </CommonDialog>
  );
};

export default PaymentTermCreateEdit;