import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Typography } from "@mui/material"; 
import CommonDrawer from "../../../common/NDE-Drawer";
import { CommonDescriptionField } from "../../../common/fields";
import { useParams } from "react-router-dom";
import { useMakeVoidInvoice } from "../../../../hooks/sales/invoice-hooks";

const schema = yup.object().shape({
  reason: yup
    .string()
    .required("Reason is required")
    .max(500, "Reason cannot exceed 500 characters"),
});

const MakeVoid = ({ open, onClose, isVoid }) => {
  const { invoiceId } = useParams();
  const { mutateAsync, isPending } = useMakeVoidInvoice(invoiceId);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      reason: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const payload = {
      invoiceId,
    };

    if (isVoid) {
      payload.unvoidReason = data.reason;
    } else {
      payload.voidReason = data.reason;
    }

    try {
      await mutateAsync({ isVoid, data: payload });
      onClose();
      reset();
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <CommonDrawer
      open={open}
      onClose={onClose}
      title={
        <Typography>
          Enter a reason for marking this transaction as{" "}
          {isVoid ? "Unvoid" : "Void"}.
        </Typography>
      }
      anchor="top"
      actions={[
        {
          label: isVoid ? "Unvoid it" : "Void it",
          onClick: handleSubmit(onSubmit),
          disabled: isPending,
        },
        {
          label: "Cancel",
          onClick: onClose,
          variant: "outlined",
        },
      ]}
    >
      <Controller
        name="reason"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <CommonDescriptionField
            {...field}
            multiline
            rows={3}
            fullWidth
            margin="normal"
            mt={0}
            error={!!error}
            helperText={error ? error.message : ""}
          />
        )}
      />
    </CommonDrawer>
  );
};

export default MakeVoid;