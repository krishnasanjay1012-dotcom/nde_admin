import { Divider } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import { CommonDatePicker } from "../../../common/fields";
import CommonDialog from "../../../common/NDE-Dialog";

export default function DateRangeModal({ open, onClose }) {
  const { control, trigger, setValue } = useFormContext();

  const handleSave = async () => {
    const valid = await trigger([
      "send_customer_attachment.from_date",
      "send_customer_attachment.to_date",
    ]);

    if (valid) {
      setValue("send_customer_attachment.applied", true, {
        shouldDirty: true,
      });
      onClose();
    }
  };

  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      title="Choose a date range to generate the statement"
      onSubmit={handleSave}
      submitLabel="Save"
      cancelLabel="Cancel"
 
    >

      <Controller
        name="send_customer_attachment.from_date"
        control={control}
        render={({ field, fieldState }) => (
          <CommonDatePicker
            {...field}
            label="Start Date"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="send_customer_attachment.to_date"
        control={control}
        render={({ field, fieldState }) => (
          <CommonDatePicker
            {...field}
            label="End Date"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
    </CommonDialog>
  );
}