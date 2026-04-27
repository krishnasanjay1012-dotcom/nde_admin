import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import CommonSelect from "../../common/fields/NDE-Select";
import CommonTextField from "../../common/fields/NDE-TextField";
import CommonDescriptionField from "../../common/fields/NDE-DescriptionField";
import CommonDialog from "../../common/NDE-Dialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useProducts, useUpdateGSuitePrice } from "../../../hooks/GSuitePrice/GSuitePrice-hooks";

const schema = yup.object().shape({
  groupId: yup.string().required("Group is required"),
  productName: yup.string().required("Product Name is required"),
  description: yup.string().required("Description is required"),
});

const GSuitePriceDetails = ({ open, setOpen, initialData }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      groupId: "",
      productName: "",
      description: "",
    },
  });

  const { data: productsData, isLoading: productsLoading } = useProducts();
  const updateMutation = useUpdateGSuitePrice();

  useEffect(() => {
    if (initialData) {
      reset({
        groupId: initialData.groupId,
        productName: initialData.productName,
        description: initialData.Description,
      });
    }
  }, [initialData, reset]);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    if (!initialData?._id) return;
    const payload = {
      groupId: data.groupId,
      productName: data.productName,
      Description: data.description,
    };
    updateMutation.mutate(
      { id: initialData._id, data: payload },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  const groupOptions = Array.isArray(productsData?.data)
    ? productsData.data.map((p) => ({ label: p.name, value: p._id }))
    : [];

  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title="Edit Product"
        onSubmit={handleSubmit(onSubmit)}
        submitLabel="Update"
        cancelLabel="Cancel"
      >
        {/* GROUP SELECT */}
        <Controller
          name="groupId"
          control={control}
          render={({ field }) =>
            productsLoading ? (
              <CircularProgress size={24} />
            ) : (
              <CommonSelect
                label="Group"
                options={groupOptions}
                value={field.value || ""}
                onChange={(val) => field.onChange(val)}
                error={!!errors.groupId}
                helperText={errors.groupId?.message}
                mandatory
                sx={{ mb: 2 }}
                disabled
              />
            )
          }
        />

        {/* PRODUCT NAME */}
        <Controller
          name="productName"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Product Name"
              error={!!errors.productName}
              helperText={errors.productName?.message}
              mandatory
              sx={{ mb: 2 }}
              
            />
          )}
        />

        {/* DESCRIPTION */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <CommonDescriptionField
              {...field}
              label="Description"
              error={!!errors.description}
              helperText={errors.description?.message}
              mandatory
              sx={{ mb: 2 }}
            />
          )}
        />
      </CommonDialog>
    </Box>
  );
};

export default GSuitePriceDetails;
