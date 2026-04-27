import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Chip, Stack, FormHelperText, Tooltip } from "@mui/material";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CommonTextField, CommonDescriptionField, CommonSelect, CommonAutocomplete, CommonCheckbox } from "../common/fields";
import { useCreateProduct, useProductById, useProductExists, useUpdateProduct } from "../../hooks/products/products-hooks";
import { useGSuite } from "../../hooks/settings/gsuite";
import { usePlesk } from "../../hooks/settings/plesk-hooks";
import CommonFileBoxUpload from "../common/NDE-FileUpload";
import CommonDialog from "../common/NDE-Dialog";
import { useResellers } from "../../hooks/settings/resellers-hooks";

// const schema = yup.object().shape({
//   productName: yup
//     .string()
//     .required("Product Name is required"),
//   hsn_code: yup.number()
//     .typeError("HSN Code must be a number")
//     .required("HSN Code is required"),
//   description: yup.string().required("Description is required"),
//   productType: yup.string().required("Product Type is required"),
//   // product_type: yup.string().required("Product Type is required"),
//   unit: yup.string().required("Unit is required"),
//   // config_id: yup.string().when("productType", {
//   //   is: (val) => ["gsuite", "hosting", "domain"].includes(val),
//   //   then: (schema) => schema.required("Configuration is required"),
//   //   otherwise: (schema) => schema.notRequired(),
//   // }),
// });

const schema = yup.object().shape({
  productName: yup.string().required("Product Name is required"),

  hsn_code: yup
    .number()
    .typeError("HSN Code must be a number")
    .required("HSN Code is required"),

  description: yup.string().required("Description is required"),

  productType: yup.string().required("Product Type is required"),

  unit: yup.string().required("Unit is required"),

  domain_required: yup.boolean().when("productType", {
    is: (val) => ["domain", "gsuite", "hosting"].includes(val),
    then: (schema) => schema.oneOf([true], "Domain Required must be checked"),
    otherwise: (schema) => schema.notRequired(),
  }),
});


const categoryOptions = [
  { label: "App", value: "app" },
  { label: "G Suite", value: "gsuite" },
  { label: "Hosting", value: "hosting" },
  { label: "Domain", value: "domain" },
];

// const unitOptions = [
//   { label: "License", value: "LICENSE" },
//   { label: "User", value: "USER" },
//   { label: "Seat", value: "SEAT" },
//   { label: "GB", value: "GB" },
//   { label: "Domain", value: "DOMAIN" },
//   { label: "Centimeter", value: "CM" },
//   { label: "Gram", value: "GRAM" },
// ];

const unitOptionsByType = {
  app: [
    { label: "License", value: "LICENSE" },
    { label: "User", value: "USER" },
    { label: "Seat", value: "SEAT" },
  ],
  gsuite: [
    { label: "User", value: "USER" },
    { label: "License", value: "LICENSE" },
    { label: "Domain", value: "DOMAIN" },
  ],
  hosting: [
    { label: "Domain", value: "DOMAIN" },
  ],
  domain: [
    { label: "Domain", value: "DOMAIN" },
  ],
};

const productTypeOptions = [
  { label: "Single", value: "single" },
  { label: "Bundle", value: "bundle" },
];

const ProductCreateEdit = ({ openCreateDialog, setOpenCreateDialog, initialData }) => {
  const { data: gsuiteResponse } = useGSuite();
  const { data: pleskResponse } = usePlesk();
  const { data: resellersData } = useResellers();
  const { data: productResponse } = useProductById(initialData?._id);
  const { data: productExist } = useProductExists({ type: 'all', enabled: openCreateDialog });

  const productData = productResponse?.data;
  const productExistData = productExist?.data;

  const gsuiteData = gsuiteResponse?.data || [];
  const pleskData = pleskResponse || [];
  const domainData = resellersData?.data || [];

  const [logoPreview, setLogoPreview] = useState(null);

  const defaultValues = {
    productName: productData?.product_name || "",
    hsn_code: productData?.hsn_code || "",
    description: productData?.description || productData?.desc || "",
    productType: productData?.type || categoryOptions[0]?.value || "",
    product_type: productData?.product_type || productTypeOptions[0]?.value || "",
    domain_required: productData?.is_domain_mandatory ?? true,
    unit: productData?.unit,
    price_desc: productData?.price_desc || "",
    purchase_desc: productData?.purchase_desc || "",
    config_id: productData?.configRefernceId || "",
    config_model: productData?.configReferenceModel || "",
    applogo: productData?.product_logo || null,
    appscreenshot: Array.isArray(productData?.prod_purchase_page_keys)
      ? productData.prod_purchase_page_keys.map(file => file.url)
      : [],
  };

  const { control, handleSubmit, setValue, watch, formState: { errors, isDirty }, reset } =
    useForm({
      defaultValues,
      resolver: yupResolver(schema),
    });

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const productType = watch("productType");

  const unitOptions = unitOptionsByType[productType] || [];

  useEffect(() => {
    reset({
      ...defaultValues,
      appscreenshot: Array.isArray(productData?.prod_purchase_page_keys)
        ? productData.prod_purchase_page_keys.map(file => file.url)
        : [],
    });
    setLogoPreview(productData?.product_logo || null);
  }, [productData, reset]);

  useEffect(() => {
    if (!productData?.configRefernceId) return;

    if (productType === "gsuite" && gsuiteData.length > 0) {
      const exists = gsuiteData.find(item => item._id === productData.configRefernceId);
      if (exists) setValue("config_id", productData.configRefernceId);
    } else if (productType === "hosting" && pleskData.length > 0) {
      const exists = pleskData.find(item => item._id === productData.configRefernceId);
      if (exists) setValue("config_id", productData.configRefernceId);
    } else if (productType === "domain" && domainData.length > 0) {
      const exists = domainData.find(item => item._id === productData.configRefernceId);
      if (exists) setValue("config_id", productData.configRefernceId);
    }
  }, [productData?.configRefernceId, gsuiteData, pleskData, domainData, productType, setValue]);

  const handleClose = () => {
    reset(defaultValues);
    setLogoPreview(defaultValues.applogo || null);
    setOpenCreateDialog(false);
  };

  const onSubmit = async (data) => {

    let payload = {
      product_name: data.productName,
      hsn_code: data.hsn_code,
      description: data.description,
      type: data.productType,
      product_type: "single",
      unit: data.unit,
      product_logo: data.applogo,
      prod_purchase_page_keys: data.appscreenshot,
      is_domain_mandatory: data.domain_required,
    };

    // if (["gsuite", "hosting", "domain"].includes(data.productType)) {
    //   payload = {
    //     ...payload,
    //     configRefernceId: data.config_id,
    //   };
    // }

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "prod_purchase_page_keys" && Array.isArray(value)) {
          value.forEach(file => {
            formData.append("prod_purchase_page_keys", file);
          });
        } else {
          formData.append(key, value);
        }
      }
    });

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    if (productData?._id) {
      await updateProductMutation.mutateAsync({ id: productData._id, formData });
    } else {
      await createProductMutation.mutateAsync(formData);
    }

    handleClose();
  };


  useEffect(() => {
    if (unitOptions.length > 0) {
      setValue("unit", unitOptions[0].value);
    }
  }, [productType]);

  return (
    <Box>
      <CommonDialog
        open={openCreateDialog}
        onClose={handleClose}
        title={productData ? "Edit Product" : "Create New Product"}
        submitLabel={productData ? "Update" : "Create"}
        onSubmit={handleSubmit(onSubmit)}
        submitDisabled={!isDirty ||updateProductMutation.isPending ||createProductMutation?.isPending}
        width={900}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>

          {/* Product Type Chips */}
          <Controller
            name="productType"
            control={control}
            render={({ field }) => (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Product Type <span style={{ color: "red" }}>*</span>
                </Typography>
                <Stack direction="row" spacing={1}>
                  {/* {categoryOptions.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      clickable
                      color={field.value === option.value ? "primary" : "default"}
                      variant={field.value === option.value ? "filled" : "outlined"}
                      onClick={() => field.onChange(option.value)}
                      disabled={!!productData}
                    />
                  ))} */}
                  <Stack direction="row" spacing={1}>
                    {categoryOptions.map((option) => {
                      const isDisabled = productExistData?.[option.value] && !productData;
                      return (
                        <Tooltip
                          key={option.value}
                          title={isDisabled ? "Only one product allowed for this type" : ""}
                          arrow
                        >
                          <span>
                            <Chip
                              label={option.label}
                              clickable
                              color={field.value === option.value ? "primary" : "default"}
                              variant={field.value === option.value ? "filled" : "outlined"}
                              onClick={() => field.onChange(option.value)}
                              disabled={isDisabled || !!productData}
                            />
                          </span>
                        </Tooltip>
                      );
                    })}
                  </Stack>
                </Stack>
                {errors.productType && (
                  <FormHelperText error sx={{ mt: 0.5 }}>
                    {errors.productType.message}
                  </FormHelperText>
                )}
              </Box>
            )}
          />

          {/* Upload App Logo */}
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ flex: "0 0 100px", display: "flex", flexDirection: "column", alignItems: "center", mb: 6 }}>
              <Typography variant="body1">Product Logo</Typography>
              <Controller
                name="applogo"
                control={control}
                render={({ field: { onChange } }) => (
                  <>
                    <input
                      accept="image/*"
                      type="file"
                      id="upload-logo-input"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                          setLogoPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                    <label htmlFor="upload-logo-input">
                      <Box
                        sx={{
                          position: "relative",
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          border: "2px solid #ccc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                              ? "background.muted"
                              : "#f9f9fb"
                          ,
                          mt: 1
                        }}
                      >
                        {logoPreview ? (
                          <Avatar src={logoPreview} sx={{ width: "100%", height: "100%" }} variant="circular" />
                        ) : (
                          <PhotoCameraBackIcon sx={{ fontSize: 30, color: "#888" }} />
                        )}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            bgcolor: "rgba(0,0,0,0.6)",
                            borderRadius: "50%",
                            width: 26,
                            height: 26,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            cursor: "pointer",
                          }}
                        >
                          <CameraAltRoundedIcon sx={{ fontSize: 18 }} />
                        </Box>
                      </Box>
                    </label>
                  </>
                )}
              />
            </Box>

            {/* Upload App Screenshots */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body1">Upload Product Screenshot or Images</Typography>
              <Controller
                name="appscreenshot"
                control={control}
                render={({ field }) => {
                  const filesArray = Array.isArray(field.value) ? field.value : field.value ? [field.value] : [];

                  const handleRemove = (index) => {
                    const updatedFiles = filesArray.filter((_, idx) => idx !== index);
                    field.onChange(updatedFiles);
                  };

                  return (
                    <>
                      <CommonFileBoxUpload
                        border="1px dashed #999"
                        borderRadius="10px"
                        onChange={(files) => {
                          const newFiles = Array.from(files);
                          field.onChange([...filesArray, ...newFiles]);
                        }}
                        multiple
                        accept="image/*"
                      >
                        <div style={{ padding: "12px 4px", textAlign: "center" }}>
                          <CloudUploadIcon sx={{ fontSize: "25px" }} />
                          <Typography variant="body1">Browse and choose the files you want to upload from your computer</Typography>
                        </div>
                      </CommonFileBoxUpload>

                      {filesArray.length > 0 && (
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", maxHeight: 76, overflowY: "auto", padding: 1, border: "1px solid #eee", borderRadius: 1 }}>
                          {filesArray.map((file, idx) => {
                            const fileUrl = typeof file === "string" ? file : URL.createObjectURL(file);
                            return (
                              <Box
                                key={idx}
                                sx={{ position: "relative", width: 60, height: 60, borderRadius: 2, overflow: "hidden", border: "1px solid #ccc", cursor: "pointer" }}
                              >
                                <img src={fileUrl} alt="screenshot" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                <Box
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(idx);
                                  }}
                                  sx={{ position: "absolute", top: 2, right: 2, width: 18, height: 18, borderRadius: "50%", backgroundColor: "#ff4d4f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer" }}
                                >
                                  ×
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      )}
                    </>
                  );
                }}
              />
            </Box>
          </Box>

          {/* Common Fields */}
          <Controller
            name="productName"
            control={control}
            render={({ field }) =>
            (

              <CommonTextField {...field} label="Product Name" fullWidth mandatory error={!!errors.productName} helperText={errors.productName?.message} />)}
          />
          <Controller
            name="hsn_code"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="HSN Code"
                fullWidth
                mandatory
                error={!!errors.hsn_code}
                helperText={errors.hsn_code?.message}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  field.onChange(value);
                }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => <CommonDescriptionField {...field} label="Description" fullWidth mandatory rows={4} error={!!errors.description} helperText={errors.description?.message} />}
          />

          <Controller
            name="unit"
            control={control}
            render={({ field }) => (
              <CommonSelect {...field} label="Unit" fullWidth mandatory options={unitOptions} error={!!errors.unit} helperText={errors.unit?.message} mb={0} />
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

          {/* <Controller
            name="product_type"
            control={control}
            render={({ field }) => (
              <CommonSelect {...field} label="Product Type" fullWidth mandatory options={productTypeOptions} error={!!errors.product_type} helperText={errors.product_type?.message} />
            )}
          /> */}

          {/* Gsuite / hosting / domain Config */}
          {/* {["gsuite", "hosting", "domain"].includes(productType) && (
            <Controller
              name="config_id"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  {...field}
                  label="Configuration"
                  options={
                    productType === "gsuite"
                      ? gsuiteData.map(item => ({ label: item.aliasName, value: item._id }))
                      : productType === "hosting"
                        ? pleskData.map(item => ({ label: item.serverName, value: item._id }))
                        : domainData.map(item => ({ label: item.domainName || item.aliasName, value: item._id }))
                  }
                  fullWidth
                  mandatory
                  error={!!errors.config_id}
                  helperText={errors.config_id?.message}
                />
              )}
            />
          )} */}
        </Box>
      </CommonDialog>
    </Box>
  );
};

export default ProductCreateEdit;
