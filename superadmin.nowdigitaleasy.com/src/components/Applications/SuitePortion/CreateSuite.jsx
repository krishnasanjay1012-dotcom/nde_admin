import React, { useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import CommonDialog from "../../common/NDE-Dialog";
import {
  CommonTextField,
  CommonSelect,
  CommonDescriptionField,
  CommonMultiSelect,
  CommonCheckbox,
} from "../../common/fields";

import {
  useCreateProduct,
  useProductById,
  useProducts,
  useUpdateProduct,
} from "../../../hooks/products/products-hooks";
import { toast } from "react-toastify";

const unitOptions = [
  // { label: "License", value: "LICENSE" },
  // { label: "User", value: "USER" },
  // { label: "Seat", value: "SEAT" },
  // { label: "GB", value: "GB" },
  // { label: "Domain", value: "DOMAIN" },
  // { label: "Centimeter", value: "CM" },
  // { label: "Gram", value: "GRAM" },
  { label: "License", value: "LICENSE" },
  { label: "User", value: "USER" },
  { label: "Seat", value: "SEAT" }
];

const CreateSuite = ({
  open,
  setOpen,
  initialData = null,
  selectedProduct = [],
}) => {
  const isEdit = !!initialData?._id;


  const schema = yup.object({
    suitename: yup
      .string()
      .required("Suite name is required")
      .min(3, "Suite name must be at least 3 characters"),

    description: yup
      .string()
      .required("Description is required")
      .min(5, "Description must be at least 5 characters"),

    unit: yup.string().required("Unit is required"),

    hsn_code: yup
      .string()
      .required("HSN Code is required")
      .matches(/^\d+$/, "Only numbers are allowed"),

    suite_products: yup.array().when([], {
      is: () => isEdit,
      then: (schema) =>
        schema
          .min(2, "Please select at least two applications")
          .required("Applications are required"),
      otherwise: (schema) => schema.notRequired(),

      domain_required: yup.boolean().when("productType", {
        is: (val) => ["domain", "gsuite", "hosting"].includes(val),
        then: (schema) => schema.oneOf([true], "Domain Required must be checked"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
  });

  const addSuiteMutation = useCreateProduct();
  const updateSuiteMutation = useUpdateProduct();

  const { data: productResponse } = useProductById(initialData?._id);
  const productData = productResponse?.data;

  const { data: tableData } = useProducts({
    type: "app",
    page: 1,
    limit: 50,
    search: "",
    filter: ""
  });

  const applicationOptions = useMemo(() => {
    if (!tableData?.data) return [];
    return tableData.data.map((item) => ({
      value: item?._id,
      label: item?.product_name,
    }));
  }, [tableData]);

  const transformInitialData = (data) => {
    if (!data) {
      return {
        suitename: "",
        description: "",
        unit: "LICENSE",
        hsn_code: "",
        suite_products: [],
        domain_required: true,
      };
    }

    return {
      suitename: data.productName || data.product_name || "",
      description: data.desc || data.description || "",
      unit: data.unit || "LICENSE",
      hsn_code: data.hsn_code ? String(data.hsn_code) : "",
      domain_required: data?.is_domain_mandatory ?? true, 
      suite_products:
        data.suite_products?.map((item) => item.productId) || [],
    };
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: transformInitialData(productData),
  });

  useEffect(() => {
    reset(transformInitialData(productData));
  }, [productData, open, reset]);

  const handleClose = () => {
    setOpen(false);
    reset(transformInitialData(null));
  };

  const onSubmit = (formValues) => {
    const formData = new FormData();

    formData.append("product_name", formValues.suitename);
    formData.append("description", formValues.description);
    formData.append("unit", formValues.unit);
    formData.append("hsn_code", formValues.hsn_code);
    formData.append("product_type", "bundle");
    formData.append("type", "suite");
    formData.append("is_domain_mandatory", formValues.domain_required);

    if (!isEdit) {
      const mergedProducts = [...new Set(selectedProduct)];

      if (mergedProducts.length < 2) {
        toast.error("Please select at least two applications.");
        return;
      }

      mergedProducts.forEach((productId) => {
        formData.append("suite_products", productId);
      });

      addSuiteMutation.mutate(formData, {
        onSuccess: handleClose,
        onError: (err) => console.error("Error creating suite:", err),
      });
    }

    else {
      formValues.suite_products.forEach((productId) => {
        formData.append("suite_products", productId);
      });

      updateSuiteMutation.mutate(
        {
          id: productData._id,
          formData: formData,
        },
        {
          onSuccess: handleClose,
          onError: (err) => console.error("Error updating suite:", err),
        }
      );
    }
  };

  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title={isEdit ? "Edit Suite" : "Create Suite"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isEdit ? "Update" : "Create"}
        maxWidth="md"
        width={550}
        submitDisabled={!isDirty}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {/* Suite Name */}
          <Controller
            name="suitename"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Product Name"
                mandatory
                error={!!errors.suitename}
                helperText={errors.suitename?.message}
              />
            )}
          />

          {/* HSN Code */}
          <Controller
            name="hsn_code"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="HSN Code"
                mandatory
                error={!!errors.hsn_code}
                helperText={errors.hsn_code?.message}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  field.onChange(value);
                }}
              />
            )}
          />

          {/* Applications — ONLY IN EDIT MODE */}
          {isEdit && (
            <Controller
              name="suite_products"
              control={control}
              render={({ field }) => (
                <CommonMultiSelect
                  {...field}
                  label="Applications"
                  options={applicationOptions}
                  placeholder="Select Applications"
                  height="auto"
                  mandatory
                  error={!!errors.suite_products}
                  helperText={errors.suite_products?.message}
                />
              )}
            />
          )}

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <CommonDescriptionField
                {...field}
                label="Description"
                placeholder="Enter suite description here"
                mandatory
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />

          {/* Unit */}
          <Controller
            name="unit"
            control={control}
            render={({ field }) => (
              <CommonSelect
                {...field}
                label="Unit"
                mandatory
                options={unitOptions}
                error={!!errors.unit}
                helperText={errors.unit?.message}
                mb={0}
              />
            )}
          />

          <Controller
            name="domain_required"
            control={control}
            render={({ field }) => (
              <Box sx={{ mt: 2 }}>
                <CommonCheckbox
                  {...field}
                  checked={field.value}
                  label="Domain Required"
                />
                {errors.domain_required && (
                  <FormHelperText error>
                    {errors.domain_required.message}
                  </FormHelperText>
                )}
              </Box>
            )}
          />
        </Box>
      </CommonDialog>
    </Box>
  );
};

export default CreateSuite;