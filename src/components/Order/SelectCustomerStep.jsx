import React from "react";
import { Box, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { CommonAutocomplete } from "../common/fields";
import CommonButton from "../common/NDE-Button";

const SelectCustomerStep = ({
  control,
  errors,
  customerOptions,
  customerLoading,
  customerFetching,
  handleCustomerInputChange,
  handleCustomerScroll,
  listRefCustomer,
  workspaceOptions,
  workspaceLoading,
  handleAddProductClick,
  isAddProductDisabled,
}) => {
  return (
    <Box
      sx={{
        mx: { xs: 2, sm: 4, md: 10 }, 
        mt:1
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Select Customer
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "flex-start" },
          gap: { xs: 2, md: 10 }, 
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            maxWidth: { xs: "100%", sm: 400 }, 
          }}
        >
          {/* Customer */}
          <Controller
            name="customer"
            control={control}
            render={({ field }) => (
              <CommonAutocomplete
                {...field}
                value={field.value || ""}
                onChange={(val) => field.onChange(val)}
                onInputChange={handleCustomerInputChange}
                options={customerOptions}
                label="Customer Name"
                placeholder="Search Customer"
                loading={customerLoading || customerFetching}
                ListboxProps={{
                  onScroll: handleCustomerScroll,
                  ref: listRefCustomer,
                  style: { maxHeight: 250, overflowY: "auto" },
                }}
                height={44}
                mandatory
                error={!!errors.customer}
                helperText={errors.customer?.message}
                mb={0.5}
                mt={0}
              />
            )}
          />

          {/* Workspace */}
          <Controller
            name="workspace"
            control={control}
            render={({ field }) => (
              <CommonAutocomplete
                {...field}
                value={field.value || ""}
                onChange={(val) => field.onChange(val)}
                options={workspaceOptions}
                label="Workspace"
                placeholder="Select Workspace"
                loading={workspaceLoading}
                height={44}
                mandatory
                error={!!errors.workspace}
                helperText={errors.workspace?.message}
                mb={0}
                
              />
            )}
          />
        </Box>

        {/* Right Side: Add Cart Button */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "stretch", md: "flex-start" },
            gap: 1,
            mt: { xs: 2, md: 0 },           
          }}
        >
          <Typography variant="body1">
            Click to add products to your cart:
          </Typography>
          <CommonButton
            label="Add Cart"
            variant="contained"
            onClick={handleAddProductClick}
            type="button"
            disabled={isAddProductDisabled}
            disabledColor="#D1D1DB"
            sx={{ borderRadius: 10, width: { xs: "100%", md: "auto" } }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SelectCustomerStep;
