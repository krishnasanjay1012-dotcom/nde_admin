import React, { useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { Country, State, City } from "country-state-city";
import {
  CommonCountryStateCity,
  CommonDescriptionField,
  CommonTextField,
} from "../common/fields";

const FieldRow = ({ label, children }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "190px 1fr",
      alignItems: "flex-start",
      gap: 2,
      mb: -1,
    }}
  >
    <Typography fontSize={14} fontWeight={400} sx={{ lineHeight: "40px" }}>
      {label}
    </Typography>

    <Box sx={{ width: "22vw" }}>{children}</Box>
  </Box>
);

const AddressFields = ({ control, errors, prefix }) => {
  const selectedCountry = useWatch({ control, name: `${prefix}country` });
  const selectedState = useWatch({ control, name: `${prefix}state` });
  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(
    () => (selectedCountry ? State.getStatesOfCountry(selectedCountry) : []),
    [selectedCountry],
  );
  const cities = useMemo(
    () =>
      selectedCountry && selectedState
        ? City.getCitiesOfState(selectedCountry, selectedState)
        : [],
    [selectedCountry, selectedState],
  );

  return (
    <Box>
      <FieldRow label="Address">
        <Controller
          name={`${prefix}address`}
          control={control}
          render={({ field }) => (
            <CommonDescriptionField
              {...field}
              rows={2}
              fullWidth
              error={!!errors?.[`${prefix}address`]}
              helperText={errors?.[`${prefix}address`]?.message}
            />
          )}
        />
      </FieldRow>

      <FieldRow label="Country / Region">
        <Controller
          name={`${prefix}country`}
          control={control}
          render={({ field }) => (
            <CommonCountryStateCity
              {...field}
              options={countries}
              placeholder="Select"
              getOptionLabel={(opt) => opt.name}
              getOptionValue={(opt) => opt.isoCode}
              fullWidth
              error={!!errors?.[`${prefix}country`]}
              helperText={errors?.[`${prefix}country`]?.message}
            />
          )}
        />
      </FieldRow>

      <FieldRow label="State">
        <Controller
          name={`${prefix}state`}
          control={control}
          render={({ field }) => (
            <CommonCountryStateCity
              {...field}
              options={states}
              placeholder="Select"
              getOptionLabel={(opt) => opt.name}
              getOptionValue={(opt) => opt.isoCode}
              fullWidth
              error={!!errors?.[`${prefix}state`]}
              helperText={errors?.[`${prefix}state`]?.message}
            />
          )}
        />
      </FieldRow>

      <FieldRow label="City">
        <Controller
          name={`${prefix}city`}
          control={control}
          render={({ field }) => (
            <CommonCountryStateCity
              {...field}
              options={cities}
              placeholder="Select"
              getOptionLabel={(opt) => opt.name}
              getOptionValue={(opt) => opt.name}
              fullWidth
              error={!!errors?.[`${prefix}city`]}
              helperText={errors?.[`${prefix}city`]?.message}
            />
          )}
        />
      </FieldRow>

      <FieldRow label="Pin Code">
        <Controller
          name={`${prefix}pinCode`}
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              fullWidth
              error={!!errors?.[`${prefix}pinCode`]}
              helperText={errors?.[`${prefix}pinCode`]?.message}
            />
          )}
        />
      </FieldRow>

      <FieldRow label="Phone">
        <Controller
          name={`${prefix}phone`}
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              fullWidth
              error={!!errors?.[`${prefix}phone`]}
              helperText={errors?.[`${prefix}phone`]?.message}
            />
          )}
        />
      </FieldRow>

      <FieldRow label="Fax Number">
        <Controller
          name={`${prefix}faxNumber`}
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              fullWidth
              error={!!errors?.[`${prefix}faxNumber`]}
              helperText={errors?.[`${prefix}faxNumber`]?.message}
            />
          )}
        />
      </FieldRow>
    </Box>
  );
};

const Address = ({ control, errors, setValue, getValues }) => {
  const handleCopyBillingToShipping = () => {
    const fields = [
      "address",
      "country",
      "state",
      "city",
      "pinCode",
      "phone",
      "faxNumber",
    ];

    fields.forEach((field) => {
      const billingValue = getValues(`billing${field}`);

      setValue(`shipping${field}`, billingValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
    });
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={6}>
          {/* Billing */}
          <Grid item xs={12} md={6}>
            <Typography fontSize={16} fontWeight={600} mb={2}>
              Billing Address
            </Typography>

            <AddressFields control={control} errors={errors} prefix="billing" />
          </Grid>

          {/* Shipping */}
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Typography fontSize={16} fontWeight={600}>
                Shipping Address
              </Typography>

              <Typography
                sx={{
                  fontSize: 14,
                  color: "primary.main",
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={handleCopyBillingToShipping}
              >
                Copy billing address
              </Typography>
            </Box>

            <AddressFields
              control={control}
              errors={errors}
              prefix="shipping"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Note Section */}
      <Box
        p={1}
        sx={{
          backgroundColor: "background.muted",
          border: `1px solid`,
          borderColor: `divider`,
          borderLeft: `4px solid`,
          borderLeftColor: "warning.main",
          mb: 2.5,
          mt: 1,
          borderRadius: 2,
        }}
      >
        <Typography fontWeight={600} variant="body1" mb={0.5}>
          Note:
        </Typography>
        <Box component="ul" sx={{ pl: 2, m: 0 }}>
          <li>
            <Typography variant="body2">
              Add and manage additional addresses from Customers and Vendors
              details.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Customize how addresses appear in PDFs via Settings → Preferences
              → Customers and Vendors.
            </Typography>
          </li>
        </Box>
      </Box>
    </>
  );
};

export default Address;
