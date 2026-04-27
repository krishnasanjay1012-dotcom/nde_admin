import { useEffect } from "react";
import { Box } from "@mui/material";
import { CommonTextField } from "../../common/fields";
import CommonDrawer from "../../common/NDE-Drawer";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  host: yup.string()
    .required("Host is required")
    .matches(
      /^(?:\d{1,3}\.){3}\d{1,3}$|^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Enter a valid IP address or hostname"
    ),
  port: yup.number()
    .typeError("Port must be a number")
    .required("Port is required")
    .min(1, "Port must be between 1 and 65535")
    .max(65535, "Port must be between 1 and 65535"),
  password: yup.string()
    .required("Password is required"),
});

const defaultValues = {
  host: "",
  port: "",
  password: "",
};

const FreeSwitchDetails = ({ open, setOpen, initialData = null, onSubmitAction }) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      reset({
        host: initialData.host || "",
        port: initialData.port || "",
        password: "",
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
  };

  return (
    <Box>
      <CommonDrawer
        open={open}
        onClose={handleClose}
        title={initialData ? "Update FreeSwitch" : "Create FreeSwitch"}
        width={500}
        actions={[
          {
            label: "Cancel",
            onClick: handleClose,
            variant: "outlined",
            color: "primary",
          },
          {
            label: initialData ? "Update" : "Connect",
            onClick: handleSubmit(onSubmit),
            variant: "contained",
            color: "primary",
            disabled: !isDirty && initialData,
          },
        ]}
      >
        <Box mt={2}>
          <Controller
            name="host"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Host"
                placeholder="Enter Host (IP or domain)"
                mandatory
                error={!!errors.host}
                helperText={errors.host?.message}
                mb={2}
                width="100%"
              />
            )}
          />
          <Controller
            name="port"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Port"
                placeholder="Enter Port"
                mandatory
                error={!!errors.port}
                helperText={errors.port?.message}
                mb={2}
                width="100%"
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
                placeholder="Enter Password"
                mandatory
                error={!!errors.password}
                helperText={errors.password?.message}
                mb={2}
                width="100%"
              />
            )}
          />
        </Box>
      </CommonDrawer>
    </Box>
  );
};

export default FreeSwitchDetails;
