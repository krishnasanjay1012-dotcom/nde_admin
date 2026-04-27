import { Box, Typography, useTheme } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CommonButton from "../../common/NDE-Button";

const BillPayment = ({ onCreateRecordPayment, data }) => {
  const theme = useTheme();

  const status = data?.status?.toLowerCase();

  const statusConfig = {
    open: {
      message: "This bill is in the open status. You can now record payment for this bill.",
      button: "Record Payment",
    },
    draft: {
      message: "Bill has been created. Convert the bill to the open status to record payment.",
      button: "Convert to Open",
    },
    sent: {
      message: "Bill has been sent. Awaiting payment.",
      button: "Record Payment",
    },
    viewed: {
      message: "Bill has been viewed by the vendor. Awaiting payment.",
      button: "Record Payment",
    },
    pending_approval: {
      message: "This bill is pending approval.",
      button: null,
    },
    approved: {
      message: "Bill approved. You can proceed with payment.",
      button: "Record Payment",
    },
    unpaid: {
      message: "Payment is pending. Record the payment now.",
      button: "Record Payment",
    },
    overdue: {
      message:
        "Payment for this bill is overdue. You can record the payment if already paid.",
      button: "Record Payment",
    },
    partially_paid: {
      message: "A partial payment has been recorded against this bill. You can record full payment for this bill if paid already.",
      button: "Record Balance",
    },
    paid: {
      message: "This bill has been fully paid.",
      button: null,
    },
    deleted: {
      message: "This bill has been deleted.",
      button: null,
    },
    written_off: {
      message: "This bill has been written off.",
      button: null,
    },
  };

  const current = statusConfig[status] || {
    message: "No actions available for this bill.",
    button: null,
  };

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        p: 2,
        backgroundColor: "default",
        maxWidth: 800,
        borderLeft: `5px solid ${theme.palette.primary.main}`,
      }}
    >
      <Box display="flex" justifyContent="space-between" gap={2}>
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <AutoAwesomeIcon sx={{ color: "#7c4dff", fontSize: 18 }} />
            <Typography fontWeight={600}>WHAT'S NEXT?</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {current.message}
          </Typography>
        </Box>

        {current.button && (
          <Box display="flex" alignItems="center">
            <CommonButton
              label={current.button}
              onClick={onCreateRecordPayment}
              size="small"
              sx={{
                color: "#fff",
                height: 30,
                borderRadius: 1.5,
                textTransform: "none",
              }}
              startIcon
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BillPayment;