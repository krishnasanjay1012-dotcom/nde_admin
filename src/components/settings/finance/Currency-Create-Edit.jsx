import React, { useEffect } from "react";
import { Box } from "@mui/material";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonCountrySelect from "../../../components/common/fields/NDE-CountrySelect";
import CommonCheckbox from "../../../components/common/fields/NDE-Checkbox";
import CommonDialog from "../../../components/common/NDE-Dialog";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonAutocomplete from "../../common/fields/NDE-Autocomplete";

const schema = yup.object().shape({
  country: yup.object().required("Country is required"),
  countryCode: yup.string().required("Country Code is required"),
  currencyCode: yup.string().required("Currency Code is required"),
  currencySymbol: yup.string().required("Currency Symbol is required"),
  decimalPlaces: yup.number().required("Decimal Places required"),
  language: yup.string().required("Language is required"),
  defaultCurrency: yup.boolean(),
});

const defaultValues = {
  country: null,
  countryCode: "",
  currencyCode: "",
  currencySymbol: "",
  decimalPlaces: 2,
  language: "",
  defaultCurrency: false,
};

const CurrencyDetails = ({ open, setOpen, initialData, onSubmitAction }) => {
  const { handleSubmit, control, formState: { errors, isDirty }, reset, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const selectedCountry = watch("country");

  useEffect(() => {
    if (initialData) {
      const mappedData = {
        country: initialData.country
          ? {
            label: initialData.country,
            code: initialData.countryCode || "",
            currencyCode: initialData.currencyCode || "",
            currencySymbol: initialData.symbol || "",
            languages: initialData.language ? [initialData.language] : [],
            decimalPlaces: initialData.decimalPlaces || 2,
            isdefault: initialData.status || false,
          }
          : null,
        countryCode: initialData.countryCode || "",
        currencyCode: initialData.currencyCode || "",
        currencySymbol: initialData.symbol || "",
        decimalPlaces: initialData.decimalPlaces || 2,
        language: initialData.language || "",
        defaultCurrency: initialData.status || false,
      };
      reset(mappedData);
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (selectedCountry) {
      const countryCode = selectedCountry.code || "";
      const currencyCode = Array.isArray(selectedCountry.currencyCode)
        ? selectedCountry.currencyCode[0] || ""
        : (selectedCountry.currencyCode || "").replace(/"/g, "");
      const currencySymbol = Array.isArray(selectedCountry.currencySymbol)
        ? selectedCountry.currencySymbol[0] || ""
        : (selectedCountry.currencySymbol || "").replace(/"/g, "");
      const language = Array.isArray(selectedCountry.languages) ? selectedCountry.languages[0] || "" : selectedCountry.languages || "";
      const decimalPlaces = selectedCountry.decimalPlaces || 2;
      const isdefault = selectedCountry.isdefault || false;

      setValue("countryCode", countryCode);
      setValue("currencyCode", currencyCode);
      setValue("currencySymbol", currencySymbol);
      setValue("language", language);
      setValue("decimalPlaces", decimalPlaces);
      setValue("defaultCurrency", isdefault);
    } else {
      setValue("countryCode", "");
      setValue("currencyCode", "");
      setValue("currencySymbol", "");
      setValue("language", "");
      setValue("decimalPlaces", 2);
      setValue("defaultCurrency", false);
    }
  }, [selectedCountry, setValue]);

  const handleClose = () => {
    reset(defaultValues);
    setOpen(false);
  };

  const onSubmit = (data) => {
    onSubmitAction(data);
  };

  const languageOptions = (selectedCountry?.languages || []).map((lang) => ({
    label: lang,
    value: lang,
  }));

  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title={initialData ? "Edit Currency" : "Add Additional Currency"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={initialData ? "Update" : "Add"}
        cancelLabel="Cancel"
        submitDisabled={!isDirty}
      >
        {/* Country Select */}
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <CommonCountrySelect
              label="Country"
              value={field.value || null}
              onChange={(val) => field.onChange(val)}
              error={!!errors.country}
              helperText={errors.country?.message}
              mandatory
              sx={{ mb: 2 }}
            />
          )}
        />

        {["countryCode", "currencyCode", "currencySymbol"].map((name) => (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label={name
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                error={!!errors[name]}
                helperText={errors[name]?.message}
                mandatory
                sx={{ mb: 2 }}
                disabled
              />
            )}
          />
        ))}

        {/* Language Autocomplete */}
        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <CommonAutocomplete
              label="Language"
              mandatory
              options={languageOptions}
              value={field.value ? { label: field.value, value: field.value } : null}
              onChange={(val) => field.onChange(val?.value || "")}
              error={!!errors.language}
              helperText={errors.language?.message}
            />
          )}
        />

        {["decimalPlaces"].map((name) => (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label={name
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                error={!!errors[name]}
                helperText={errors[name]?.message}
                mandatory
                type="number"
                sx={{ mb: 2 }}
              />
            )}
          />
        ))}

        {/* Default Currency */}
        <Controller
          name="defaultCurrency"
          control={control}
          render={({ field }) => (
            <CommonCheckbox
              label="Default Currency"
              checked={field.value || false}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
      </CommonDialog>
    </Box>
  );
};

export default CurrencyDetails;