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
} from "../../../common/fields";
import { useParams } from "react-router-dom";
import { useCreateWriteOff } from "../../../../hooks/sales/invoice-hooks";
import CommonDialog from "../../../common/NDE-Dialog";

const schema = yup.object({
  writeOffDate: yup.string().required("Write Off Date is required"),
  writeOffReason: yup.string().required("Reason is required"),
});

const Label = ({ text, required }) => (
  <Typography
    fontSize={14}
    color={required ? "#d32f2f" : "#000"}
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
      // gap: 2,
      mb: 2.5,
    }}
  >
    <Label text={label} required={required} />
    <Box sx={{ flex: 1 }}>{children}</Box>
  </Box>
);

export default function WriteOffInvoiceModal({ open, onClose }) {
  const { invoiceId } = useParams();
  const { mutateAsync, isPending } = useCreateWriteOff(invoiceId);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      writeOffDate: new Date(),
      writeOffReason: "",
      invoiceId,
    },
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = async (data) => {
    try {
      await mutateAsync(data);
      onClose();
    } catch {
    }
  };

  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      title="Write Off Invoice"
      onSubmit={handleSubmit(handleFormSubmit)}
      submitLabel="Write Off"
      cancelLabel="Cancel"
      loading={isPending}
      submitDisabled={isPending || !isDirty }
      width={500}

    >
      <Box component="form" id="writeoff-form">
        <Controller
          name="writeOffDate"
          control={control}
          render={({ field }) => (
            <FormRow label="Write Off" required>
              <CommonDatePicker
                {...field}
                placeholder="DD/MM/YYYY"
                error={!!errors.writeOffDate}
                helperText={errors.writeOffDate?.message}
                mb={0}
              />
            </FormRow>
          )}
        />

        <Controller
          name="writeOffReason"
          control={control}
          render={({ field }) => (
            <FormRow label="Reason" required>
              <CommonDescriptionField
                {...field}
                rows={3}
                error={!!errors.writeOffReason}
                helperText={errors.writeOffReason?.message}
                mb={-2}
              />
            </FormRow>
          )}
        />
      </Box>
    </CommonDialog>
  );
}
