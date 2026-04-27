import { Avatar, Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CommonDialog from "../../common/NDE-Dialog";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  CommonDescriptionField,
  CommonSelect,
  CommonTextField,
} from "../../common/fields";
import CommonFileBoxUpload from "../../common/NDE-FileUpload";
import {
  useProductGroups,
  useCreateApp,
  useUpdateApp,
} from "../../../hooks/application/application-hooks";
import CommonImagePreview from "../../common/NDE-ImagePreview";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";

const schema = yup.object().shape({
  appname: yup.string().required("App Name is required"),
  appcategory: yup.string().required("App Category is required"),
  appdescription: yup.string().required("App Description is required"),
});

const CreateApplication = ({ open, setOpen, initialData = null }) => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      applogo: null,
      appname: "",
      appcategory: "",
      appdescription: "",
      appscreenshot: [],
    },
  });

  const { data: productGroupsResponse, isLoading } = useProductGroups();
  const categoryOptions = (productGroupsResponse?.data || []).map((group) => ({
    label: group.name,
    value: group._id,
  }));
  const appsCategory = (productGroupsResponse?.data || []).find(
    (group) => group.name === "Apps",
  );

  const [logoPreview, setLogoPreview] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);

  const createAppMutation = useCreateApp();
  const updateAppMutation = useUpdateApp();

  useEffect(() => {
    reset(
      initialData || {
        applogo: null,
        appname: "",
        appcategory: appsCategory?._id || "",
        appdescription: "",
        appscreenshot: [],
      },
    );
    if (appsCategory) setValue("appcategory", appsCategory._id);
    if (initialData?.applogo) setLogoPreview(initialData.applogo);
    else setLogoPreview(null);
  }, [initialData, open, reset, appsCategory, setValue]);

  const watchedLogo = watch("applogo");
  useEffect(() => {
    if (watchedLogo && typeof watchedLogo !== "string") {
      const url = URL.createObjectURL(watchedLogo);
      setLogoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setLogoPreview(watchedLogo || null);
    }
  }, [watchedLogo]);

  const handleClose = () => {
    setOpen(false);
    reset();
    setLogoPreview(null);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("productName", data.appname);
      formData.append("desc", data.appdescription);
      formData.append("groupId", data.appcategory);

      if (data.applogo instanceof File) {
        formData.append("productLogo", data.applogo);
      } else if (typeof data.applogo === "string") {
        formData.append("existingLogo", data.applogo);
      }

      const screenshots = Array.isArray(data.appscreenshot)
        ? data.appscreenshot
        : data.appscreenshot
          ? [data.appscreenshot]
          : [];

      screenshots.forEach((file) => {
        if (file instanceof File) formData.append("productImage", file);
        else if (typeof file === "string")
          formData.append("existingImage", file);
      });

      const appId = initialData?.appId;
      if (appId) {
        await updateAppMutation.mutateAsync({ appId, data: formData });
      } else {
        await createAppMutation.mutateAsync(formData);
      }
      handleClose();
    } catch (error) {
      console.error("❌ Failed to save app", error);
    }
  };

  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title={initialData ? "Edit Application" : "Create Application"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={initialData ? "Update" : "Save"}
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": { width: "800px", maxHeight: "90vh" },
          "& .MuiDialogContent-root": {
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            overflowY: "auto",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="body1">Upload App Logo</Typography>
            <Controller
              name="applogo"
              control={control}
              render={({ field: { onChange } }) => (
                <>
                  <input
                    accept="image/*"
                    type="file"
                    id="upload-input"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onChange(file);
                    }}
                  />
                  <label htmlFor="upload-input">
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
                        // background: initialData?.appscreenshot?.length ? "#6C75EF" : "transparent",
                      }}
                    >
                      {logoPreview ? (
                        <Avatar
                          src={logoPreview}
                          sx={{ width: "100%", height: "100%" }}
                          variant="circular"
                          onClick={(e) => {
                            e.preventDefault();
                            setPreviewSrc(logoPreview);
                            setPreviewOpen(true);
                          }}
                        />
                      ) : (
                        <PhotoCameraBackIcon
                          sx={{ fontSize: 30, color: "#888" }}
                        />
                      )}

                      {/* Camera Icon Overlay */}
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
        </Box>

        {/* App Name & Category */}
        <Box sx={{ display: "flex", gap: "50px", alignItems: "center", mb: 1 }}>
          <Box sx={{ gap: "5px" }}>
            <Typography variant="body1">
              App Name <span style={{ color: "red" }}> *</span>
            </Typography>
            <Controller
              name="appname"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  {...field}
                  placeholder="Enter your app name here"
                  width="350px"
                  height="40px"
                  sx={{ mb: 0 }}
                  error={!!errors.appname}
                  helperText={errors.appname?.message}
                />
              )}
            />
          </Box>

          <Box sx={{ gap: "5px" }}>
            <Typography variant="body1">
              App Category <span style={{ color: "red" }}> *</span>
            </Typography>
            <Controller
              name="appcategory"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  {...field}
                  placeholder={
                    isLoading ? "Loading categories..." : "Select Category"
                  }
                  options={categoryOptions}
                  width="350px"
                  height="40px"
                  sx={{ mb: 0 }}
                  disabled={!!appsCategory}
                />
              )}
            />
          </Box>
        </Box>

        {/* App Description & Screenshots */}
        <Box sx={{ display: "flex", gap: "50px", alignItems: "flex-start" }}>
          <Box sx={{ gap: "5px" }}>
            <Typography variant="body1">
              App Description <span style={{ color: "red" }}> *</span>
            </Typography>
            <Controller
              name="appdescription"
              control={control}
              render={({ field, fieldState }) => (
                <CommonDescriptionField
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  placeholder="Write some content about your app"
                  width="350px"
                  height="100px"
                  sx={{ mb: 0 }}
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body1">
              Upload App Screenshot or Images
            </Typography>
            <Controller
              name="appscreenshot"
              control={control}
              render={({ field }) => {
                const filesArray = Array.isArray(field.value)
                  ? field.value
                  : field.value
                    ? [field.value]
                    : [];

                const handleRemove = (index) => {
                  const updatedFiles = filesArray.filter(
                    (_, idx) => idx !== index,
                  );
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
                        <CloudUploadIcon
                          sx={{ fontSize: "25px", color: "#919191" }}
                        />
                        <Typography variant="body1">
                          Browse and choose the files you want to upload from
                          your computer
                        </Typography>
                      </div>
                    </CommonFileBoxUpload>

                    {filesArray.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                          maxHeight: 76,
                          overflowY: "auto",
                          padding: 1,
                          border: "1px solid #eee",
                          borderRadius: 1,
                        }}
                      >
                        {filesArray.map((file, idx) => {
                          const fileUrl =
                            typeof file === "string"
                              ? file
                              : URL.createObjectURL(file);

                          return (
                            <Box
                              key={idx}
                              sx={{
                                position: "relative",
                                width: 60,
                                height: 60,
                                borderRadius: 2,
                                overflow: "hidden",
                                border: "1px solid #ccc",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setPreviewSrc(fileUrl);
                                setPreviewOpen(true);
                              }}
                            >
                              <img
                                src={fileUrl}
                                alt="screenshot"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              <Box
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemove(idx);
                                }}
                                sx={{
                                  position: "absolute",
                                  top: 2,
                                  right: 2,
                                  width: 18,
                                  height: 18,
                                  borderRadius: "50%",
                                  backgroundColor: "#ff4d4f",
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 12,
                                  cursor: "pointer",
                                }}
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
      </CommonDialog>

      {/* Image Preview */}
      <CommonImagePreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        src={previewSrc}
      />
    </Box>
  );
};

export default CreateApplication;
