import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CommonTextField, CommonSelect, CommonDescriptionField } from "../../common/fields";
import CommonDialog from "../../common/NDE-Dialog";
import { useCreateProduct, useUpdateProduct } from "../../../hooks/products/products-hooks";
import { useGSuite } from "../../../hooks/settings/gsuite";
import { usePlesk } from "../../../hooks/settings/plesk-hooks";
import CommonFileBoxUpload from "../../common/NDE-FileUpload";
import { Chip, Stack, FormHelperText } from "@mui/material";


const schema = yup.object().shape({
  productName: yup.string().required("Product Name is required"),
  hsn_code: yup
    .number()
    .typeError("HSN Code must be a number")
    .required("HSN Code is required"),
  description: yup.string().required("Description is required"),
  productType: yup.string().required("Product Type is required"),
});

const categoryOptions = [
  { label: "App", value: "app" },
  { label: "G Suite", value: "gsuite" },
  { label: "Hosting", value: "plesk" },
];

const HostingCreateEdit = ({ openCreateDialog, setOpenCreateDialog, initialData }) => {

  const { data: gsuiteResponse } = useGSuite();
  const { data: pleskResponse } = usePlesk();
  const gsuiteData = gsuiteResponse?.data || [];
  const pleskData = pleskResponse?.data || [];

  const [logoPreview, setLogoPreview] = useState(
    initialData?.applogo ? URL.createObjectURL(initialData.applogo) : null
  );

  const { control, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      productName: "",
      hsn_code: "",
      description: "",
      productType: "app",
      product_type: "single",
      price_desc: "",
      purchase_desc: "",
      config_id: "",
      config_model: "",
      applogo: null,
      appscreenshot: [],
    },
    resolver: yupResolver(schema),
  });

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const [loading, setLoading] = useState(false);

  const productType = watch("productType");

  useEffect(() => {
    if (initialData) {
      setValue("productName", initialData.product_name || "");
      setValue("hsn_code", initialData.hsn_code || "");
      setValue("description", initialData.desc || "");
      setValue("productType", initialData.type || "app");
      setValue("product_type", initialData.product_type || "single");
      setValue("price_desc", initialData.price_desc || "");
      setValue("purchase_desc", initialData.purchase_desc || "");
      setValue("config_model", initialData.config_model || "");
      setValue("applogo", initialData.product_logo || null);
      setValue("appscreenshot", initialData.sample_image || []);

    } else {
      // Create mode
      reset({
        productName: "",
        hsn_code: "",
        description: "",
        productType: "app",
        product_type: "single",
        price_desc: "",
        purchase_desc: "",
        config_id: "",
        config_model: "",
        applogo: null,
        appscreenshot: [],
      });
      setLogoPreview(null);
    }
  }, [initialData, setValue, reset]);


  useEffect(() => {
    if (!initialData?.config_id) return;

    if (productType === "gsuite" && gsuiteData.length > 0) {
      const exists = gsuiteData.find(item => item._id === initialData.config_id);
      if (exists) setValue("config_id", initialData.config_id);
    } else if (productType === "plesk" && pleskData.length > 0) {
      const exists = pleskData.find(item => item._id === initialData.config_id);
      if (exists) setValue("config_id", initialData.config_id);
    }
  }, [initialData?.config_id, gsuiteData, pleskData, productType, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let payload = {
        product_name: data.productName,
        hsn_code: data.hsn_code,
        desc: data.description,
        type: data.productType,
        product_logo: data.applogo,
        prod_purchase_page_keys: data.appscreenshot,
      };

      if (data.productType === "app") {
        payload = {
          ...payload,
          product_type: "single",
          price_desc: data.price_desc,
          purchase_desc: data.purchase_desc,

        };
      } else if (["gsuite", "plesk"].includes(data.productType)) {
        payload = {
          ...payload,
          // config_id: data.config_id,
          // config_model: data.productType === "gsuite" ? "Gsuite" : "PleskLogin",
          ...(data.productType === "plesk" && { product_type: "Shared Hosting" }),
        };

      }


      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "prod_purchase_page_keys" && Array.isArray(value)) {
            value.forEach(file => formData.append("prod_purchase_page_keys", file));
          } else {
            formData.append(key, value);
          }
        }
      });

      if (initialData?._id) {
        await updateProductMutation.mutateAsync({ id: initialData._id, formData });
      } else {
        await createProductMutation.mutateAsync(formData);
      }

      setLoading(false);
      setOpenCreateDialog(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset(initialData || {});
    setOpenCreateDialog(false);
  };

  return (
    <Box>
      <CommonDialog
        open={openCreateDialog}
        onClose={handleClose}
        title={initialData ? "Edit Product" : "Create New Product"}
        submitLabel={initialData ? "Update" : "Create"}
        onSubmit={handleSubmit(onSubmit)}
        loading={loading}
        width={900}
      >
        <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>

          {/* Product Type */}
          <Controller
            name="productType"
            control={control}
            render={({ field }) => (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Product Type <span style={{ color: "red" }}>*</span>
                </Typography>

                <Stack direction="row" spacing={1}>
                  {categoryOptions.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      clickable
                      color={field.value === option.value ? "primary" : "default"}
                      variant={field.value === option.value ? "filled" : "outlined"}
                      onClick={() => field.onChange(option.value)}
                      disabled={!!initialData}
                    />
                  ))}
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
                          background: "#f0f0f0",
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
                          <CloudUploadIcon sx={{ fontSize: "25px", color: "#919191" }} />
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
            render={({ field }) => <CommonTextField {...field} label="Product Name" fullWidth mandatory error={!!errors.productName} helperText={errors.productName?.message} />}
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

          {/* App Fields */}
          {productType === "app" && (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Controller name="price_desc" control={control} render={({ field }) => <CommonTextField {...field} label="Price Description" fullWidth />} />
              <Controller name="purchase_desc" control={control} render={({ field }) => <CommonTextField {...field} label="Purchase Description" fullWidth />} />
            </Box>
          )}

          {/* Gsuite / Plesk Config */}
          {/* {["gsuite", "plesk"].includes(productType) && (
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
                      : pleskData.map(item => ({ label: item.aliasName || item.serverName, value: item._id }))
                  }
                  fullWidth
                  mandatory
                />
              )}
            />
          )} */}
        </Box>
      </CommonDialog>
    </Box>
  );
};

export default HostingCreateEdit;
