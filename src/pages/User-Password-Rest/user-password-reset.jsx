import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { CommonTextField } from "../../components/common/fields";
import CommonDrawer from "../../components/common/NDE-Drawer";
import { useUpdateAdminPassword } from "../../hooks/Customer/Customer-hooks";
import FlowerLoader from "../../components/common/NDE-loader";

const schema = yup.object().shape({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const AdminPasswordDrawer = ({ open, handleClose, defaultValues }) => {

  const userData = defaultValues;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: userData?.email || "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userData) {
      reset({
        email: userData.email || "",
        password: "",
      });
    }
  }, [userData, reset]);

  const { mutate: changePassword, isPending } = useUpdateAdminPassword({
    onSuccess: () => {
      handleClose();
    },
  });

  const handleCreateOrUpdate = (data) => {
    changePassword({
      email: data.email,
      password: data.password,
    });
  };

  const handleDrawerCancel = () => {
    reset({ email: userData?.email || "", password: "" });
    handleClose();
  };

  return (
    <CommonDrawer
      open={open}
      onClose={handleDrawerCancel}
      title="Change Customer Password"
      onSubmit={handleSubmit(handleCreateOrUpdate)}
      topWidth={500}
      anchor="top"
      actions={[
        { label: "Cancel", variant: "outlined", onClick: handleDrawerCancel },
        {
          label: isPending ? <FlowerLoader color="white" size={14} /> : "Save",
          onClick: handleSubmit(handleCreateOrUpdate),
        },
      ]}
    >
      {/* Email Field */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <CommonTextField
            {...field}
            placeholder="Enter Email"
            label="Email"
            startAdornment={<Email sx={{ fontSize: 18, color: "#999" }} />}
            error={!!errors?.email}
            helperText={errors?.email?.message}
            disabled
            sx={{ mb: 2 }}
          />
        )}
      />

      {/* Password Field */}
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <CommonTextField
            {...field}
            placeholder="Enter Password"
            type={showPassword ? "text" : "password"}
            showPasswordChecklist
            label="Password"
            startAdornment={<Lock sx={{ fontSize: 18 }} />}
            endAdornment={
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            }
            error={!!errors?.password}
            helperText={errors?.password?.message}
            sx={{ mb: 2 }}
          />
        )}
      />
    </CommonDrawer>
  );
};

export default AdminPasswordDrawer;
