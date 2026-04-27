import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import CommonDrawer from "../../common/NDE-Drawer";
import { CommonDescriptionField } from "../../common/fields";
import { useVoidBill, useUnvoidBill } from "../../../hooks/purchased/bills-hooks";

const BillVoidUnvoid = ({
  open,
  onClose,
  billId,
  type = "void", 
}) => {
  const [reason, setReason] = useState("");

  const voidBillMutation = useVoidBill();
  const unvoidBillMutation = useUnvoidBill();

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
            ? "Enter a reason for marking this transaction as Void."
            : "Note down the reason as to why you want to undo a void transaction."}
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

export default BillVoidUnvoid;