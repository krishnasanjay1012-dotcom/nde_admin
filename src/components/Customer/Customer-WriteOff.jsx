import {
  Box,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CommonDatePicker,
  CommonDescriptionField,
} from "../common/fields";
import { useParams } from "react-router-dom";
import CommonDialog from "../common/NDE-Dialog";
import { useWriteOffOpeningBalance } from "../../hooks/Customer/Customer-hooks";

const schema = yup.object({
  date: yup.string().required("Write Off Date is required"),
  reason: yup.string().required("Reason is required"),
});

const Label = ({ text, required }) => (
  <Typography
    fontSize={14}
    color={required ? "error.main" : "text.primary"}
    sx={{ minWidth: 120 }}
  >
    {text}
    {required && " *"}
  </Typography>
);

const FormRow = ({ label, required, children }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      mb: 2.5,
    }}
  >
    <Label text={label} required={required} />
    <Box sx={{ flex: 1 }}>{children}</Box>
  </Box>
);

export default function CustomerWriteOff({ open, onClose, handleClose, workspaceId }) {
  const { customerId } = useParams();
  const { mutateAsync: writeOffOpeningBalance, isPending } = useWriteOffOpeningBalance();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      date: new Date(),
      reason: "",
      workspaceId,
      userId: customerId,
    },
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = async (data) => {
    try {
      await writeOffOpeningBalance(data);
      onClose();
      handleClose();
    } catch {
      console.warn("");
    }
  };

  const handleDialogClose = () => {
    reset();
    onClose();
  };

  return (
    <CommonDialog
      open={open}
      onClose={handleDialogClose}
      title="Write Off Invoice"
      onSubmit={handleSubmit(handleFormSubmit)}
      submitLabel="Write Off"
      cancelLabel="Cancel"
      loading={isPending}
      submitDisabled={isPending || !isDirty}
      width={500}

    >
      <Box component="form" id="writeoff-form">
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <FormRow label="Write Off" required>
              <CommonDatePicker
                {...field}
                placeholder="DD/MM/YYYY"
                error={!!errors.date}
                helperText={errors.date?.message}
                mb={0}
              />
            </FormRow>
          )}
        />

        <Controller
          name="reason"
          control={control}
          render={({ field }) => (
            <FormRow label="Reason" required>
              <CommonDescriptionField
                {...field}
                rows={3}
                error={!!errors.reason}
                helperText={errors.reason?.message}
                placeholder="Why are you writing off this opening balance?"
                mb={-2}
              />
            </FormRow>
          )}
        />
      </Box>
    </CommonDialog>
  );
}
