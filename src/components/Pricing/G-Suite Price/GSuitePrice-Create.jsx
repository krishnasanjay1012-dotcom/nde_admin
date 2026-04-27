import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import CommonSelect from "../../common/fields/NDE-Select";
import CommonTextField from "../../common/fields/NDE-TextField";
import CommonNumberField from "../../common/fields/NDE-NumberField";
import CommonDescriptionField from "../../common/fields/NDE-DescriptionField";
import CommonDialog from "../../common/NDE-Dialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMasters, useProducts, useCreateGSuitePrice } from "../../../hooks/GSuitePrice/GSuitePrice-hooks";

// ✅ Yup validation schema
const schema = yup.object().shape({
  groupId: yup.string().required("Group is required"),
  gsuiteSku: yup.string().required("Plan/Product is required"),
  skuId: yup.string().required("SKU ID is required"),
  productName: yup.string().required("Product Name is required"),
  hsnCode: yup
    .number()
    .typeError("HSN Code must be a number")
    .required("HSN Code is required"),
  description: yup.string().required("Description is required"),
});

const GSuitePriceDetails = ({ open, setOpen, initialData }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      groupId: "",
      gsuiteSku: "",
      skuId: "",
      productName: "",
      hsnCode: "",
      description: "",
    },
  });

  const gsuiteSkuValue = watch("gsuiteSku");
  const { data: mastersData, isLoading: mastersLoading } = useMasters();
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const createMutation = useCreateGSuitePrice();

  useEffect(() => {
    if (initialData) {
      reset({
        groupId: initialData.groupId,
        gsuiteSku: initialData.gsuiteSku,
        skuId: initialData.skuId || "",
        productName: initialData.productName,
        hsnCode: initialData.HsnCode,
        description: initialData.Description,
      });
    } else {
      reset({
        groupId: "",
        gsuiteSku: "",
        skuId: "",
        productName: "",
        hsnCode: "",
        description: "",
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (!gsuiteSkuValue) return;
    const selectedPlan = Array.isArray(mastersData)
      ? mastersData.find((m) => m._id === gsuiteSkuValue)
      : null;
    if (selectedPlan) {
      setValue("skuId", selectedPlan.skuId || "");
      setValue("productName", selectedPlan.productName || "");
    }
  }, [gsuiteSkuValue, mastersData, setValue]);

  useEffect(() => {
    if (
      open && 
      !initialData && 
      Array.isArray(productsData?.data) &&
      productsData.data.length > 0
    ) {
      setValue("groupId", productsData.data[0]._id);
    }
  }, [open, productsData, initialData, setValue]);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    const payload = {
      gsuiteSku: data.gsuiteSku,
      groupId: data.groupId,
      skuId: data.skuId,
      productName: data.productName,
      HsnCode: data.hsnCode,
      Description: data.description,
    };
    createMutation.mutate(payload, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  
  const planOptions = Array.isArray(mastersData)
    ? mastersData.map((m) => ({ label: m.productName, value: m._id }))
    : [];
  const groupOptions = Array.isArray(productsData?.data)
    ? productsData.data.map((p) => ({ label: p.name, value: p._id }))
    : [];

  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title={initialData ? "Edit Product" : "Add Product"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={initialData ? "Update" : "Submit"}
        cancelLabel="Cancel"
      >
      
        {/* GROUP SELECT */}
        <Controller
          name="groupId"
          control={control}
          render={({ field }) =>
            mastersLoading ? (
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
          {/* PLAN/PRODUCT SELECT */}
        <Controller
          name="gsuiteSku"
          control={control}
          render={({ field }) =>
            productsLoading ? (
              <CircularProgress size={24} />
            ) : (
              <CommonSelect
                label="Plan Name"
                options={planOptions}
                value={field.value || ""}
                onChange={(val) => field.onChange(val)}
                error={!!errors.gsuiteSku}
                helperText={errors.gsuiteSku?.message}
                mandatory
                sx={{ mb: 2 }}
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
              disabled
            />
          )}
        />

        {/* SKU ID */}
        <Controller
          name="skuId"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="SKU ID"
              error={!!errors.skuId}
              helperText={errors.skuId?.message}
              mandatory
              sx={{ mb: 2 }}
              disabled
            />
          )}
        />

        {/* HSN CODE */}
        <Controller
          name="hsnCode"
          control={control}
          render={({ field }) => (
            <CommonNumberField
              {...field}
              label="HSN Code"
              error={!!errors.hsnCode}
              helperText={errors.hsnCode?.message}
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
