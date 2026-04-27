import { Box } from "@mui/material";
import { Controller } from "react-hook-form";
import CommonSelect from "../common/fields/NDE-Select";

const billingTypeOptions = [
  { label: "FLEXIBLE", value: "FLEXIBLE" },
  { label: "COMMITMENT", value: "COMMITMENT" },
];

const commitmentTermOptions = [
  { label: "MONTHLY", value: "MONTHLY" },
  { label: "ANNUAL", value: "ANNUAL" },
];


const GSuitePlan = ({ control, errors }) => {
  return (
    <Box>
      {/* BILLING TYPE */}
      <Controller
        name="gsuite_billing_type"
        control={control}
        render={({ field }) => (
          <CommonSelect
            {...field}
            label="Billing Type"
            options={billingTypeOptions}
            value={field.value}
            onChange={field.onChange}
            error={!!errors.gsuite_billing_type}
            helperText={errors.gsuite_billing_type?.message}
            mandatory
          />
        )}
      />

      {/* COMMITMENT TERM */}
      <Controller
        name="commitment_term"
        control={control}
        render={({ field }) => (
          <CommonSelect
            {...field}
            label="Commitment Term"
            options={commitmentTermOptions}
            value={field.value}
            onChange={field.onChange}
            error={!!errors.commitment_term}
            helperText={errors.commitment_term?.message}
          />
        )}
      />
    </Box>
  );
};

export default GSuitePlan;
