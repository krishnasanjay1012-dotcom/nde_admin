import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonDrawer from "../../../components/common/NDE-Drawer";
import { CommonTextField } from "../../../components/common/fields";
import { useUpdateSmsConfig } from "../../../hooks/settings/sms-hooks";

const schema = yup.object().shape({
  name: yup.string().trim().required("Provider name is required"),
  apiKey: yup.string().trim().required("API key is required"),
  senderId: yup.string().trim().required("Sender ID is required"),
  apiSecret: yup.string().trim(),
});

const EditSmsConfig = ({ open, handleClose, selectedRow }) => {
  const { mutate: updateConfig, isLoading } = useUpdateSmsConfig();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: { name: "", apiKey: "", senderId: "", apiSecret: "" },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (selectedRow) {
      reset({
        name: selectedRow.name || "",
        apiKey: selectedRow.apiKey || "",
        senderId: selectedRow.senderId || "",
        apiSecret: selectedRow.apiSecret || "",
      });
    }
  }, [selectedRow, reset]);

  const onSubmit = (data) => {
    updateConfig(
      { id: selectedRow?.id, data },
      {
        onSuccess: () => {
          reset();
          handleClose();
        },
      }
    );
  };

  const handleDrawerClose = () => {
    reset();
    handleClose();
  };

  return (
    <CommonDrawer
      open={open}
      onClose={handleDrawerClose}
      title="Edit SMS Config"
      anchor="right"
      width={500}
      actions={[
        { label: "Cancel", variant: "outlined", onClick: handleDrawerClose },
        {
          label: isLoading ? "Saving..." : "Update",
          onClick: handleSubmit(onSubmit),
        },
      ]}
      disabled={!isDirty}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Provider Name"
              placeholder="e.g. Twilio, MSG91"
              mandatory
              mb={0}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />
        <Controller
          name="apiKey"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="API Key"
              placeholder="Enter API key"
              mandatory
              mb={0}
              error={!!errors.apiKey}
              helperText={errors.apiKey?.message}
            />
          )}
        />
        <Controller
          name="apiSecret"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="API Secret"
              placeholder="Enter API secret (optional)"
              mb={0}
              error={!!errors.apiSecret}
              helperText={errors.apiSecret?.message}
            />
          )}
        />
        <Controller
          name="senderId"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Sender ID"
              placeholder="e.g. MYAPP"
              mandatory
              mb={0}
              error={!!errors.senderId}
              helperText={errors.senderId?.message}
            />
          )}
        />
      </Box>
    </CommonDrawer>
  );
};

export default EditSmsConfig;
