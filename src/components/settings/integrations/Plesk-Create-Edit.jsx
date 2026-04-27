import { useEffect, useState } from "react";
import { Box, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonDialog from "../../../components/common/NDE-Dialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  aliasName: yup.string().required(" Name is required"),
  serverName: yup
    .string()
    .required("Server Name / IP is required"),
  username: yup.string().required("User Name is required"),
  password: yup.string().required("Password is required"),
  location: yup.string().required("Location is required"),
});

const PleskDetails = ({ open, setOpen, initialData, onSubmitAction }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      aliasName: "",
      serverName: "",
      username: "",
      password: "",
      location: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        aliasName: initialData.aliasName || "",
        serverName: initialData.serverName || "",
        username: initialData.username || "",
        password: initialData.password || "",
        location: initialData.location || "",
      });
    } else {
      reset({
        aliasName: "",
        serverName: "",
        username: "",
        password: "",
        location: "",
      });
    }
  }, [initialData, reset]);

  const handleClose = () => {
    setOpen(false);
    reset();
    setShowPassword(false);
  };

const onSubmit = async (data) => {
  try {
    await onSubmitAction({ ...data });
    // handleClose(); 
  } catch (err) {
    console.error(err);
  }
};


  const fields = [
    { name: "aliasName", label: "Name" },
    { name: "serverName", label: "Server Name / IpAddress" },
    { name: "username", label: "Username" },
    { name: "password", label: "Password" },
    { name: "location", label: "Location" },
  ];

  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title={initialData ? "Edit Plesk Login" : "Create Plesk Login"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={initialData ? "Update" : "Submit"}
        cancelLabel="Cancel"
        submitDisabled={!isDirty}
      >
        <Box>
          {fields.map((field) => (
            <Controller
              key={field.name}
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <CommonTextField
                  {...controllerField}
                  label={field.label}
                  type={
                    field.name === "password"
                      ? showPassword
                        ? "text"
                        : "password"
                      : "text"
                  }
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                  mandatory
                  sx={{ mb: 1 }}
                  InputProps={
                    field.name === "password"
                      ? {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  setShowPassword((prev) => !prev)
                                }
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }
                      : {}
                  }
                />
              )}
            />
          ))}
        </Box>
      </CommonDialog>
    </Box>
  );
};

export default PleskDetails;
