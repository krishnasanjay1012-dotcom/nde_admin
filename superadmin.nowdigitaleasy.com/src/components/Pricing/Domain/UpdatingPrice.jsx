import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import CommonDialog from "../../common/NDE-Dialog";
import CommonTextField from "../../common/fields/NDE-TextField";
import CommonDescription from "../../common/fields/NDE-DescriptionField";

const UpdateDiscount = ({
  open,
  onClose,
  updateProps,     
  setUpdateProps,
  updateDomaine,   
}) => {
  const validationSchema = Yup.object().shape({
    Discount: Yup.string().required("Discount is required"),
    Description: Yup.string().required("Description is required"),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      Discount: updateProps?.Discount || "",
      Description: updateProps?.Description || "",
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    if (!updateProps) return; 

    const updatedDomain = { ...updateProps, ...data };
    setUpdateProps(updatedDomain);
    updateDomaine(updatedDomain);
    onClose();
  };

  useEffect(() => {
    setValue("Discount", updateProps?.Discount || "");
    setValue("Description", updateProps?.Description || "");
  }, [updateProps, setValue]);

  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      title="Discount Update"
      onSubmit={handleSubmit(onSubmit)}
      submitLabel="Update"
      cancelLabel="Cancel"
      submitDisabled={!isDirty}
    >
      <Box display="flex" flexDirection="column">
        <Controller
          name="Discount"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Discount"
              size="small"
              error={!!errors.Discount}
              helperText={errors.Discount?.message}
              mandatory
            />
          )}
        />
        <Controller
          name="Description"
          control={control}
          render={({ field }) => (
            <CommonDescription
              {...field}
              label="Description"
              rows={4}
              error={!!errors.Description}
              helperText={errors.Description?.message}
              mandatory
            />
          )}
        />
      </Box>
    </CommonDialog>
  );
};

export default UpdateDiscount;
