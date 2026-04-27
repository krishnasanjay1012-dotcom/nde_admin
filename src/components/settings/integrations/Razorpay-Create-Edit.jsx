import { useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonSelect from "../../../components/common/fields/NDE-Select";
import CommonCountrySelect from "../../../components/common/fields/NDE-CountrySelect";
import CommonDialog from "../../../components/common/NDE-Dialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usePaymentTypes } from "../../../hooks/settings/payment-hooks";

// Base schema for payment type
const baseSchema = { paymentType: yup.string().required("Payment Type is required") };

// Razorpay schema with all fields
const razorpaySchema = {
  key: yup.string().required("Key is required"),
  secret: yup.string().required("Secret is required"),
  webhook_secret: yup.string().required("Webhook Secret is required"),
  vendor: yup.string().required("Vendor is required"),
  baseurl: yup.string().required("Base URL is required"),
  redirecturl: yup.string().required("Redirect URL is required"),
  mode: yup.string().required("Mode is required"),
  country: yup.string().required("Country is required"),
  // accno: yup.string().required("Account Number is required"),
  // accname: yup.string().required("Account Name is required"),
  // ifsc: yup.string().required("IFSC is required"),
  // Branch: yup.string().required("Branch is required"),
  // env: yup.string().required("Environment is required"),
};

const defaultPaymentSchema = {
  accno: yup.string().required("Account Number is required"),
  accname: yup.string().required("Account Name is required"),
  ifsc: yup.string().required("IFSC is required"),
  Branch: yup.string().required("Branch is required"),
  country: yup.string().required("Country is required"),
};

const RazorpayDetails = ({ open, setOpen, initialData, onSubmitAction }) => {  
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors ,isDirty },
  } = useForm({
    defaultValues: {
      paymentType: initialData?.type || "",
      key: initialData?.key || "",
      secret: initialData?.secret || "",
      webhook_secret: initialData?.webhook_secret || "",
      vendor: initialData?.vendor || "",
      baseurl: initialData?.baseurl || "",
      redirecturl: initialData?.redirecturl || "",
      mode: initialData?.env ? initialData.env.toLowerCase() : "",
      accno: initialData?.accno || "",
      accname: initialData?.accname || "",
      ifsc: initialData?.ifsc || "",
      Branch: initialData?.Branch || "",
      country: initialData?.country || "",
      env: initialData?.env || "",
    },
    resolver: yupResolver(
      yup.object().shape({
        ...baseSchema,
        ...(initialData?.type === "razorpay" ? razorpaySchema : defaultPaymentSchema),
      })
    ),
  });

  const paymentType = watch("paymentType");
  const { data: paymentTypesData, isLoading } = usePaymentTypes();

  const typeOptions = useMemo(() => {
    if (!paymentTypesData) return [];
    const uniqueTypes = [...new Set(paymentTypesData.map((item) => item.type))];
    return uniqueTypes.map((type) => ({ label: type.charAt(0).toUpperCase() + type.slice(1), value: type }));
  }, [paymentTypesData]);

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          paymentType: initialData.type || "",
          key: initialData.key || "",
          secret: initialData.secret || "",
          webhook_secret: initialData.webhook_secret || "",
          vendor: initialData.vendor || "",
          baseurl: initialData.baseurl || "",
          redirecturl: initialData.redirecturl || "",
          mode: initialData.env ? initialData.env.toLowerCase() : "",
          accno: initialData.accno || "",
          accname: initialData.accname || "",
          ifsc: initialData.ifsc || "",
          Branch: initialData.Branch || "",
          country: initialData.country || "",
          env: initialData.env || "",
        });
      } else {
        reset({
          paymentType: "",
          key: "",
          secret: "",
          webhook_secret: "",
          vendor: "",
          baseurl: "",
          redirecturl: "",
          mode: "",
          accno: "",
          accname: "",
          ifsc: "",
          Branch: "",
          country: "",
          env: "",
        });
      }
    }
  }, [open, initialData, reset]);

  useEffect(() => {
    const resolverSchema =
      paymentType === "razorpay"
        ? yup.object().shape({ ...baseSchema, ...razorpaySchema })
        : yup.object().shape({ ...baseSchema, ...defaultPaymentSchema });
    control._options.resolver = yupResolver(resolverSchema);
  }, [paymentType, control]);

  const onSubmit = (data) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
    );
    onSubmitAction(filteredData);
    // handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleCountryChange = (onChange) => (value) => {
    const countryValue = value && typeof value === "object" ? value.code : value;
    onChange(countryValue);
  };

  const getCountryValueForDisplay = (value) => {
    if (!value) return null;
    if (typeof value === "object") return value;
    return { code: value, label: value };
  };

  const modeOptions = [
    { label: "Live", value: "live" },
    { label: "Test", value: "test" },
  ];

  const fieldLabels = {
    accno: "Account Number",
    accname: "Account Name",
    ifsc: "IFSC",
    Branch: "Branch",
    key: "Key",
    secret: "Secret",
    webhook_secret: "Webhook Secret",
    vendor: "Vendor",
    baseurl: "Base URL",
    redirecturl: "Redirect URL",
    mode: "Mode",
    // env: "Environment",
  };

  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title={initialData ? "Edit Payment" : "Create New Payment"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={initialData ? "Update" : "Submit"}
        cancelLabel="Cancel"
        onCancel={handleClose}
         submitDisabled={!isDirty}
      >
        {/* Payment Type */}
        <Controller
          name="paymentType"
          control={control}
          render={({ field }) => (
            <CommonSelect
              label="Payment Type"
              options={typeOptions}
              value={field.value}
              onChange={field.onChange}
              error={!!errors.paymentType}
              helperText={errors.paymentType?.message}
              mandatory
              sx={{ mb: 2 }}
              loading={isLoading}
              disabled={!!initialData}
            />
          )}
        />

        {/* Conditional Fields */}
        {paymentType === "razorpay" ? (
          <>
            {["key", "secret", "webhook_secret", "vendor", "baseurl", "redirecturl"].map((fieldName) => (
              <Controller
                key={fieldName}
                name={fieldName}
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    label={fieldLabels[fieldName] || fieldName}
                    {...field}
                    error={!!errors[fieldName]}
                    helperText={errors[fieldName]?.message}
                    mandatory
                    sx={{ mb: 2 }}
                  />
                )}
              />
            ))}

            <Controller
              name="mode"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  label="Mode"
                  options={modeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={!!errors.mode}
                  helperText={errors.mode?.message}
                  mandatory
                  sx={{ mb: 2 }}
                />
              )}
            />

            {/* <Controller
              name="env"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  label="Environment"
                  {...field}
                  error={!!errors.env}
                  helperText={errors.env?.message}
                  mandatory
                  sx={{ mb: 2 }}
                />
              )}
            /> */}

            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <CommonCountrySelect
                  label="Country"
                  value={getCountryValueForDisplay(field.value)}
                  onChange={handleCountryChange(field.onChange)}
                  error={!!errors.country}
                  helperText={errors.country?.message}
                  mandatory
                  sx={{ mb: 2 }}
                />
              )}
            />
          </>
        ) : (
          <>
            {["accno", "accname", "ifsc", "Branch"].map((fieldName) => (
              <Controller
                key={fieldName}
                name={fieldName}
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    label={fieldLabels[fieldName]}
                    {...field}
                    error={!!errors[fieldName]}
                    helperText={errors[fieldName]?.message}
                    mandatory
                    sx={{ mb: 2 }}
                  />
                )}
              />
            ))}

            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <CommonCountrySelect
                  label="Country"
                  value={getCountryValueForDisplay(field.value)}
                  onChange={handleCountryChange(field.onChange)}
                  error={!!errors.country}
                  helperText={errors.country?.message}
                  mandatory
                  sx={{ mb: 2 }}
                />
              )}
            />
          </>
        )}
      </CommonDialog>
    </Box>
  );
};

export default RazorpayDetails;