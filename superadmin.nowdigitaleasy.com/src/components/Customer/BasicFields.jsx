import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Email, Visibility, VisibilityOff } from "@mui/icons-material";
import { CommonSelect, CommonTextField } from "../common/fields/index";
import PhoneNumberField from "../common/fields/NDE-MobileNumberCode";

const BasicFields = ({
  control,
  errors,
  isEdit = false,
  groupOptions,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const defaultOption = groupOptions.find(
    (o) => o.label.toLowerCase() === "customer"
  );

  return (
    <Box display="flex" flexDirection="column">
      {/* Row 1: Name + Email */}
      <Box display="flex" gap={2} flexWrap="wrap">
        <Box flexBasis={{ xs: "100%", sm: "48%" }} flexGrow={1}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Name"
                mandatory
                placeholder="Enter Your Name"
                error={!!errors?.name}
                helperText={errors?.name?.message}
                disabled={isEdit}
                fullWidth
              />
            )}
          />
        </Box>

        <Box flexBasis={{ xs: "100%", sm: "48%" }} flexGrow={1}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Email Address"
                mandatory
                placeholder="Enter Email"
                error={!!errors?.email}
                helperText={errors?.email?.message}
                startAdornment={<Email sx={{ fontSize: 18, color: "#999" }} />}
                disabled={isEdit}
                fullWidth
              />
            )}
          />
        </Box>
      </Box>

      {/* Row 2: Mobile Number + Password */}
      <Box display="flex" gap={2} flexWrap="wrap">
        <Box flexBasis={{ xs: "100%", sm: "48%" }} flexGrow={1}>
          <Controller
            name="phone_number"
            control={control}
            render={({ field }) => (
              <PhoneNumberField
                {...field}
                value={field.value || { code: "+91", number: "" }} 
                onChange={(val) => field.onChange(val)}
                label="Mobile Number"
                error={!!errors?.phone_number}
                helperText={errors?.phone_number?.message}
                mandatory
                disabled={isEdit}
                mb={0}
              />
            )}
          />
        </Box>

        {!isEdit && (
          <Box flexBasis={{ xs: "100%", sm: "48%" }} flexGrow={1}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  {...field}
                  label="Password"
                  mandatory
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a Password"
                  error={!!errors?.password}
                  helperText={errors?.password?.message}
                  fullWidth
                  showPasswordChecklist
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ fontSize: 20, color: "#666" }} />
                        ) : (
                          <Visibility sx={{ fontSize: 20, color: "#666" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              )}
            />
          </Box>
        )}
      </Box>

      {/* Row 3: User Type */}
      <Box display="flex" gap={2} flexWrap="wrap">
        <Box flexBasis={{ xs: "100%", sm: "48%" }} flexGrow={1}>
          <Controller
            name="groupId"
            control={control}
            render={({ field }) => (
              <CommonSelect
                {...field}
                label="User Type"
                placeholder="Select User Type"
                options={groupOptions}
                value={field.value ?? defaultOption?.value ?? ""}
                onChange={field.onChange}
                fullWidth
              />
            )}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BasicFields;
