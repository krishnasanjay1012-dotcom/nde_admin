import { Box } from "@mui/material";
import { Controller } from "react-hook-form";
import CommonNumberField from "../common/fields/NDE-NumberField";
import CommonSelect from "../common/fields/NDE-Select";

const AppPlan = ({ control, errors }) => {

  return (
    <Box>
      <Controller
        name="hasTrialPlan"
        control={control}
        render={({ field }) => (
          <CommonSelect
            {...field}
            label="Has Trial Plan"
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
            value={field.value}
          />
        )}
      />
      <>
        <Controller
          name="trialUsers"
          control={control}
          render={({ field }) => (
            <CommonNumberField
              {...field}
              label="Trial Plan Users"
              mandatory
              error={!!errors.trialUsers}
              helperText={errors.trialUsers?.message}
            />
          )}
        />
      </>
    </Box>
  );
};

export default AppPlan;
