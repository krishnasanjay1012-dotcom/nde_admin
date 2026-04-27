import { Box, Typography, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonNumberField from "../../../components/common/fields/NDE-NumberField";
import CommonCheckbox from "../../../components/common/fields/NDE-Checkbox";
import CommonDatePicker from "../../../components/common/fields/NDE-DatePicker";
import CommonAutoComplete from "../../../components/common/fields/NDE-Autocomplete";

const salespersonOptions = [
  { label: "John Doe", value: "john" },
  { label: "Jane Smith", value: "jane" },
];

const paymentTermsOptions = [
  { label: "Due on Receipt", value: "due_on_receipt" },
  { label: "Net 15", value: "net_15" },
  { label: "Net 30", value: "net_30" },
];

const SubscriptionTermForm = ({ control, watch, errors, disableNeverExpires, selectedProduct }) => {
  const neverExpires = watch("neverExpires");

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2, pb: 1, borderBottom: "1px solid #ccc" }}>
        <Typography variant="h6" fontWeight={600}>
          Subscription Term
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={1.5}>
        {/* Subscription Number */}
        <Controller
          name="subscriptionNumber"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Subscription Number"
              required
              error={!!errors.subscriptionNumber}
              helperText={errors.subscriptionNumber?.message}
              fullWidth
              mandatory
            />
          )}
        />

        {/* Start Date */}
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <CommonDatePicker
              {...field}
              label="Start Date"
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
              fullWidth
            />
          )}
        />

        {/* Expires After */}
        <Controller
          name="expiresAfter"
          control={control}
          render={({ field }) => (
            <CommonNumberField
              {...field}
              label="Expires After (cycles)"
              disabled={Boolean(neverExpires)}
              error={!!errors.expiresAfter}
              helperText={errors.expiresAfter?.message}
              fullWidth
            />
          )}
        />

        {/* Never Expires */}
        <Controller
          name="neverExpires"
          control={control}
          render={({ field }) => (
            <CommonCheckbox
              checked={Boolean(field.value)}
              onChange={(e) => field.onChange(e.target.checked)}
              label="Never Expires"
              disabled={disableNeverExpires}
            />
          )}
        />

        {/* Reference Number */}
        <Controller
          name="referenceNumber"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Reference Number"
              error={!!errors.referenceNumber}
              helperText={errors.referenceNumber?.message}
              fullWidth
            />
          )}
        />

        {/* Salesperson */}
        <Controller
          name="salesperson"
          control={control}
          render={({ field }) => (
            <CommonAutoComplete
              {...field}
              label="Salesperson"
              options={salespersonOptions}
              getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
              isOptionEqualToValue={(option, value) => option.value === value}
              error={!!errors.salesperson}
              helperText={errors.salesperson?.message}
              fullWidth
            />
          )}
        />

        {/* Payment Mode */}
        <Controller
          name="paymentMode"
          control={control}
          render={({ field }) => (
            <CommonCheckbox
              checked={field.value === "offline"}
              onChange={(e) => field.onChange(e.target.checked ? "offline" : "online")}
              label="Collect payment offline"
            />
          )}
        />

        {/* Payment Terms */}
        <Controller
          name="paymentTerms"
          control={control}
          render={({ field }) => (
            <CommonAutoComplete
              {...field}
              label="Payment Terms"
              options={paymentTermsOptions}
              getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
              isOptionEqualToValue={(option, value) => option.value === value}
              error={!!errors.paymentTerms}
              helperText={errors.paymentTerms?.message}
              fullWidth
            />
          )}
        />

        {/* Dynamic Plan Selection (from selected product) */}
        {selectedProduct?.plans && selectedProduct.plans.length > 0 && (
          <Controller
            name="plan"
            control={control}
            render={({ field }) => (
              <CommonAutoComplete
                {...field}
                label="Select Plan"
                options={selectedProduct.plans.map((p) => ({
                  label: p.planName,
                  value: p._id,
                  fullData: p,
                }))}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value}
                error={!!errors.plan}
                helperText={errors.plan?.message}
                fullWidth
              />
            )}
          />
        )}
      </Box>
    </Box>
  );
};

export default SubscriptionTermForm;
