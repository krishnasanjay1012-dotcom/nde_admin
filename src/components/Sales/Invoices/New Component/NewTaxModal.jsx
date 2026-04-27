import React, { useEffect } from "react";
import CommonDialog from "../../../common/NDE-Dialog";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, InputAdornment } from "@mui/material";
import { CommonSelect, CommonTextField } from "../../../common/fields";
import {
  useCreateGSTTax,
  useUpdateGstTaxes,
} from "../../../../hooks/tax/tax-hooks";

const schema = yup.object().shape({
  tax_name: yup.string().required("Tax Name is required"),
  rate: yup
    .number()
    .typeError("Rate must be a number")
    .required("Rate is required")
    .min(0, "Rate cannot be negative"),
  tax_type: yup.string().required("Tax Type is required"),
});

const TAX_TYPES = [
  { label: "CGST", value: "cgst" },
  { label: "SGST", value: "sgst" },
  { label: "IGST", value: "igst" },
  { label: "UTGST", value: "utgst" },
  { label: "Cess", value: "cess" },
];

const NewTaxModal = ({ open, onClose, initialData, edit, setEdit }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tax_name: "",
      rate: "",
      tax_type: "",
    },
  });

  const { mutate: createTax, isPending } = useCreateGSTTax();
  const { mutate: updateTax } = useUpdateGstTaxes();

  useEffect(() => {
    if (edit) {
      reset({
        tax_name: initialData?.taxName,
        rate: initialData?.taxRate,
        tax_type: initialData?.tax_type,
      });
    }
  }, [initialData]);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      tax_group: "taxable",
    };

    if (edit) {
      updateTax(
        { data: data, id: initialData?.id },
        {
          onSuccess: () => {
            reset({
              tax_name: "",
              rate: "",
              tax_type: "",
            });
            setEdit(false);
            onClose();
          },
          onError: (err) => {
            console.log("failed to update", err);
          },
        },
      );
    } else {
      createTax(payload, {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          console.error("Failed to create tax:", error);
        },
      });
    }
  };

  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      title="New Tax"
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      width={500}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Controller
          name="tax_name"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Tax Name"
              mandatory
              placeholder="Enter tax name"
              error={!!errors.tax_name}
              helperText={errors.tax_name?.message}
            />
          )}
        />

        <Controller
          name="rate"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Rate (%)"
              mandatory
              placeholder="Enter rate"
              type="number"
              error={!!errors.rate}
              helperText={errors.rate?.message}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          )}
        />

        <Controller
          name="tax_type"
          control={control}
          render={({ field }) => {
            return (
              <CommonSelect
                label="Tax Type"
                name={field.name}
                options={TAX_TYPES}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors.tax_type}
                helperText={errors.tax_type?.message}
                searchable={true}
                mb={0}
              />
            );
          }}
        />
      </Box>
    </CommonDialog>
  );
};

export default NewTaxModal;
