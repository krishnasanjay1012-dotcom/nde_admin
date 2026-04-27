import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import CommonDrawer from "../../../common/NDE-Drawer";
import { CommonDescriptionField } from "../../../common/fields";
import { useUnvoidPayment, useVoidPayment } from "../../../../hooks/payment/payment-hooks";

const PaymentVoidUnvoid = ({
  open,
  onClose,
  billId,
  type = "void", 
}) => {
  const [reason, setReason] = useState("");

  const voidBillMutation = useVoidPayment();
  const unvoidBillMutation = useUnvoidPayment();

  const isVoid = type === "void";

  useEffect(() => {
    if (!open) setReason(""); 
  }, [open]);

  const handleConfirm = () => {
    if (!reason.trim()) return;

    if (isVoid) {
      voidBillMutation.mutate(
        { billId, voidReason: reason },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      unvoidBillMutation.mutate(
        { billId, unvoidReason: reason },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  return (
    <CommonDrawer
      open={open}
      onClose={onClose}
      title={
        <Typography>
          {isVoid
            ? "Enter the reason for voiding the payment."
            : "Enter the reason for converting this payment to Draft."}
        </Typography>
      }
      anchor="top"
      actions={[
        {
          label: isVoid ? "Void it" : "Convert to Draft",
          onClick: handleConfirm,
          disabled: !reason.trim() || voidBillMutation.isPending || unvoidBillMutation.isPending,
        },
        {
          label: "Cancel",
          onClick: onClose,
          variant: "outlined",
        },
      ]}
    >
      <Box p={2}>
        <CommonDescriptionField
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          mt={-2}
          mb={-1}
        />
      </Box>
    </CommonDrawer>
  );
};

export default PaymentVoidUnvoid;