import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";
import CommonRadioButton from "../../../components/common/fields/NDE-RadioButton";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonNumberField from "../../../components/common/fields/NDE-NumberField";
import CommonDescriptionField from "../../../components/common/fields/NDE-DescriptionField";
import CommonSelect from "../../../components/common/fields/NDE-Select";

// ✅ Validation schema
const schema = yup.object().shape({
  type: yup.string().required("Type is required"),
  name: yup.string().required("Name is required"),
  unit: yup.string().required("Unit is required"),
  price: yup
    .number()
    .typeError("Selling Price must be a number")
    .required("Selling Price is required"),
  account: yup.string().required("Account is required"),
  description: yup.string().nullable(),
});

// ✅ Select options
const UNIT_OPTIONS = [
  { value: "kg", label: "Kilogram" },
  { value: "pcs", label: "Pieces" },
  { value: "litre", label: "Litre" },
];

const ACCOUNT_OPTIONS = [
  { value: "sales", label: "Sales" },
  { value: "purchase", label: "Purchase" },
  { value: "other", label: "Other" },
];

const NewItemForm = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: "goods",
      name: "",
      unit: "",
      price: "",
      account: "",
      description: "",
    },
  });

  const [files, setFiles] = useState([]);

  // ✅ File upload
  const onDrop = (acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data, "Uploaded Files:", files);
  };

  const getLabel = (fieldName) =>
    fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

  return (
    <Box
      sx={{
        p: { xs: 2, md: 2 },
        maxHeight: { xs: "100vh", md: "auto" },
        overflowY: { xs: "auto", md: "visible" },
      }}
    >
      {/* Title with Close Icon */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          pb: 1,
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        <Typography variant="h4">New Item</Typography>

        <IconButton
          onClick={() => navigate(-1)}
          color="inherit"
          sx={{ ml: 2 }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          {/* Type */}
          <Grid item xs={12} md={6}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <CommonRadioButton
                  {...field}
                  label={getLabel("type")}
                  options={[
                    { value: "goods", label: "Goods" },
                    { value: "service", label: "Service" },
                  ]}
                  error={!!errors.type}
                  helperText={errors.type?.message}
                  mandatory
                />
              )}
            />
          </Grid>

          {/* Name */}
          <Grid item xs={12} md={6}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  {...field}
                  label={getLabel("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  mandatory
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Unit */}
          <Grid item xs={12} md={6}>
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  {...field}
                  label={getLabel("unit")}
                  options={UNIT_OPTIONS}
                  error={!!errors.unit}
                  helperText={errors.unit?.message}
                  mandatory
                  fullWidth
                  sx={{ minWidth: 200 }}
                />
              )}
            />
          </Grid>

          {/* Selling Price */}
          <Grid item xs={12} md={6}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <CommonNumberField
                  {...field}
                  label={getLabel("price")}
                  prefix="INR"
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  mandatory
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Account */}
          <Grid item xs={12} md={6}>
            <Controller
              name="account"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  {...field}
                  label={getLabel("account")}
                  options={ACCOUNT_OPTIONS}
                  error={!!errors.account}
                  helperText={errors.account?.message}
                  mandatory
                  fullWidth
                  sx={{ minWidth: 200 }}
                />
              )}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <CommonDescriptionField
                  {...field}
                  label={getLabel("description")}
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12} md={6}>
            <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed #1976d2",
                borderRadius: 2,
                p: 2,
                textAlign: "center",
                cursor: "pointer",
                minHeight: 140,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: isDragActive ? "action.hover" : "background.paper",
              }}
            >
              <input {...getInputProps()} />
              <Typography variant="body2" color="textSecondary">
                {isDragActive
                  ? "Drop the files here ..."
                  : "Drag & drop image(s) here, or click to browse"}
              </Typography>
            </Box>
            {/* Preview */}
            {files.length > 0 && (
              <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
                {files.map((file) => (
                  <img
                    key={file.name}
                    src={file.preview}
                    alt={file.name}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid #ccc",
                    }}
                  />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Buttons */}
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => reset()}
            sx={{ borderRadius: 2, width: 90, height: 40 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, width: 90, height: 40 }}
          >
            Save
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default NewItemForm;
