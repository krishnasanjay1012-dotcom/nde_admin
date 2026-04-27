import { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonNumberField from "../../../components/common/fields/NDE-NumberField";
import CommonSelect from "../../../components/common/fields/NDE-Select";
import CommonDrawer from "../../../components/common/NDE-Drawer";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CommonToggleSwitch from "../../common/NDE-CommonToggleSwitch";

const schema = yup.object().shape({
  gatewayName: yup.string().required("Gateway Name is required"),
  username: yup.string().required("Username is required"),
  password: yup.string(),
  fromUser: yup.string(),
  fromDomain: yup
    .string()
    .matches(
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$|^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/i,
      "Please enter a valid domain or IP address"
    ),
  proxy: yup
    .string(),
  // .matches(
  //   /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$|^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/i,
  //   "Please enter a valid proxy domain or IP address"
  // ),
  expireSeconds: yup.number().typeError("Must be a number").min(0, "Must be positive"),
  register: yup.boolean(),
  retrySeconds: yup.number().typeError("Must be a number").min(0, "Must be positive"),
  profile: yup.string().required("Profile is required"),
});

const defaultValues = {
  gatewayName: "",
  username: "",
  password: "",
  fromUser: "",
  fromDomain: "",
  proxy: "",
  expireSeconds: 3600,
  register: true,
  retrySeconds: 30,
  profile: "External",
};

const GatewayDetails = ({ open, setOpen, initialData = null, onSubmitAction }) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initialData) {
      reset({
        gatewayName: initialData.gatewayName || "",
        username: initialData.username || "",
        password: initialData.password || "",
        fromUser: initialData.fromUser || "",
        fromDomain: initialData.fromDomain || "",
        proxy: initialData.proxy || "",
        expireSeconds: initialData.expireSeconds ?? 3600,
        register: initialData.register ?? true,
        retrySeconds: initialData.retrySeconds ?? 30,
        profile: initialData.profile || "External",
      });
    } else {
      reset(defaultValues);
    }
  }, [initialData, open, reset]);

  const handleClose = () => {
    reset(defaultValues);
    setOpen(false);
  };

  const onSubmit = (data) => {
    onSubmitAction(data);
    handleClose();
  };

  return (
    <Box>
      <CommonDrawer
        open={open}
        onClose={handleClose}
        title={initialData ? "Edit Gateway" : "Create New Gateway"}
        width={500}
        actions={[
          {
            label: "Cancel",
            onClick: handleClose,
            variant: "outlined",
            color: "primary",
          },
          {
            label: initialData ? "Update" : "Submit",
            onClick: handleSubmit(onSubmit),
            variant: "contained",
            color: "primary",
            disabled: !isDirty,
          },
        ]}
      >
        <Controller
          name="gatewayName"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Gateway Name"
              placeholder="Enter gateway name"
              error={!!errors.gatewayName}
              helperText={errors.gatewayName?.message}
              mandatory
              sx={{ mb: 2 }}
            />
          )}
        />

        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Username"
              placeholder="Enter username"
              error={!!errors.username}
              helperText={errors.username?.message}
              mandatory
              sx={{ mb: 2 }}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Password"
              type={showPassword ? "text" : "password"}
              showPasswordChecklist
              placeholder="Enter password"
              endAdornment={
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ mb: 2 }}
            />
          )}
        />


        <Controller
          name="fromUser"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="From User"
              placeholder="Enter from user"
              error={!!errors.fromUser}
              helperText={errors.fromUser?.message}
              sx={{ mb: 2 }}
            />
          )}
        />

        <Controller
          name="fromDomain"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="From Domain"
              placeholder="Enter from domain"
              error={!!errors.fromDomain}
              helperText={errors.fromDomain?.message}
              sx={{ mb: 2 }}
            />
          )}
        />

        <Controller
          name="proxy"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Proxy"
              placeholder="Enter proxy"
              error={!!errors.proxy}
              helperText={errors.proxy?.message}
              sx={{ mb: 2 }}
            />
          )}
        />

        <Controller
          name="expireSeconds"
          control={control}
          render={({ field }) => (
            <CommonNumberField
              {...field}
              label="Expire Seconds"
              placeholder="3600"
              error={!!errors.expireSeconds}
              helperText={errors.expireSeconds?.message}
              sx={{ mb: 2 }}
            />
          )}
        />

        <Controller
          name="register"
          control={control}
          render={({ field }) => (
            <CommonToggleSwitch
              label="Register"
              labelPlacement="start"
              checked={field.value || false}
              onChange={(e) => field.onChange(e.target.checked)}
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "110px",
              }}
              title="Set the registration status"
            />
          )}
        />

        <Controller
          name="retrySeconds"
          control={control}
          render={({ field }) => (
            <CommonNumberField
              {...field}
              label="Retry Seconds"
              placeholder="30"
              error={!!errors.retrySeconds}
              helperText={errors.retrySeconds?.message}
              sx={{ mb: 2 }}
            />
          )}
        />

        <Controller
          name="profile"
          control={control}
          render={({ field }) => (
            <CommonSelect
              {...field}
              label="Profile"
              options={[
                { label: "External", value: "External" },
                { label: "Internal", value: "Internal" },
              ]}
              error={!!errors.profile}
              helperText={errors.profile?.message}
              mandatory
              sx={{ mb: 2 }}
            />
          )}
        />
      </CommonDrawer>
    </Box>
  );
};

export default GatewayDetails;
