import { useForm, Controller } from "react-hook-form";
import { Box, IconButton, InputAdornment } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import CommonDrawer from "../common/NDE-Drawer";
import PhoneNumberField from "../common/fields/NDE-MobileNumberCode";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Email from "@mui/icons-material/Email";

import { useAdminSignUp, useUpdateAdmin } from "../../hooks/auth/login";
import { CommonTextField, CommonSelect } from "../common/fields";
import { getUserSession } from "../../utils/session";

const roleOptions = [
  { label: "Super Admin", value: "super_admin" },
  { label: "Admin", value: "admin" },
  { label: "Sales", value: "sales" },
  { label: "Accounts”", value: "accounts”" },
  { label: "Support", value: "support" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Suspend", value: "suspend" },
];

const UserCreateForm = ({ initialData, open, onClose }) => {

  const { role } = getUserSession();

  const access = role === "super_admin"

  const displayedRoleOptions = access ? roleOptions : roleOptions.filter(option => option.value !== "super_admin");

  const userId = initialData?._id;
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: createUser } = useAdminSignUp();
  const { mutate: updateUser } = useUpdateAdmin();

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),

    phone_number: yup.object({
      code: yup.string().required(),
      number: yup
        .string()
        .required("Phone number is required")
        .test("is-valid-phone", "Invalid phone number", (value, ctx) => {
          try {
            const phone = parsePhoneNumberFromString(
              `${ctx.parent.code}${value}`,
              "IN"
            );
            return phone?.isValid();
          } catch {
            return false
          }
        }),
    }),

    designation: yup.string().required("Role is required"),

    password: userId
      ? yup.string().notRequired()
      : yup.string().required("Password is required").min(6),

    isSuspended: yup
      .string()
      .oneOf(["active", "suspend"])
      .required("Status is required"),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone_number: {
        code: "+91",
        number: "",
      },
      designation: "",
      password: "",
      isSuspended: "active",
    },
  });

  useEffect(() => {
    if (open && initialData) {
      reset({
        name: initialData.name || "",
        username: initialData.username || "",
        email: initialData.emailId || "",
        phone_number: {
          code: "+91",
          number: initialData.phone || "",
        },
        designation: initialData.role,
        isSuspended: initialData.isSuspended === true ? "suspend" : "active",
        password: "",
      });
    }

    if (open && !initialData) {
      reset({
        name: "",
        username: "",
        email: "",
        phone_number: { code: "+91", number: "" },
        designation: "",
        password: "",
        isSuspended: "active",
      });
    }
  }, [open, initialData, reset]);

  const onSubmit = (data) => {
    const payload = {
      ...(userId ? { id: userId } : {}),
      name: data.name,
      username: data.username,
      emailId: data.email,
      phone: data.phone_number.number,
      role: data.designation,
      isSuspended: data.isSuspended === "suspend" ? true : false,
      ...(data.password ? { password: data.password } : {}),
    };

    if (userId) {
      updateUser(payload, { onSuccess: onClose });
    } else {
      createUser(payload, { onSuccess: onClose });
    }
  };

  return (
    <CommonDrawer
      open={open}
      onClose={onClose}
      width={550}
      anchor="right"
      title={userId ? "Edit User" : "Create User"}
      onSubmit={handleSubmit(onSubmit)}
      actions={[
        { label: "Cancel", variant: "outlined", onClick: onClose },
        { label: userId ? "Update" : "Save", onClick: handleSubmit(onSubmit), disabled: !isDirty, },
      ]}

    >
      <form style={{ width: "100%" }}>
        <Box display="flex" gap={2}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Full Name"
                mandatory
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
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
                mandatory
                error={!!errors.username}
                helperText={errors.username?.message}
                fullWidth
              />
            )}
          />
        </Box>

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Email"
              mandatory
              error={!!errors.email}
              helperText={errors.email?.message}
              startAdornment={<Email sx={{ fontSize: 18 }} />}
              fullWidth
            />
          )}
        />

        <Controller
          name="phone_number"
          control={control}
          render={({ field }) => (
            <PhoneNumberField
              {...field}
              label="Phone Number"
              mandatory
              error={!!errors.phone_number}
              helperText={errors.phone_number?.number?.message}
            />
          )}
        />

        <Controller
          name="designation"
          control={control}
          render={({ field }) => (
            <CommonSelect
              {...field}
              label="Role"
              mandatory
              options={displayedRoleOptions}
              error={!!errors.designation}
              helperText={errors.designation?.message}
              fullWidth
              disabled={!access && initialData}
            />
          )}
        />

        {userId && (
          <Controller
            name="isSuspended"
            control={control}
            render={({ field }) => (
              <CommonSelect
                {...field}
                label="Status"
                mandatory
                options={statusOptions}
                error={!!errors.isSuspended}
                helperText={errors.isSuspended?.message}
                fullWidth
                disabled={!access && initialData}
              />
            )}
          />
        )}

        {!userId && (
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Password"
                type={showPassword ? "text" : "password"}
                mandatory={userId ? false : true}
                error={!!errors.password}
                helperText={errors.password?.message}
                showPasswordChecklist
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                fullWidth
              />
            )}
          />
        )}
      </form>
    </CommonDrawer>
  );
};

export default UserCreateForm;
