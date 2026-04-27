import { Box, Typography, useTheme } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CommonButton from "../../../common/NDE-Button";

const PaymentStatusBox = ({ onCreateRecordPayment, data }) => {
  const theme = useTheme();

  const status = data?.status?.toLowerCase();

  const statusConfig = {
    open: {
      message: "This payment is in the open status.",
      button: null,
    },
    draft: {
      message: "Mark the payment as Paid to confirm that it has been received",
      button: "Mark as Paid",
    },
    refunded: {
      message: "This payment has been refunded.",
      button: null,
    },
    void: {
      message: "This payment has been voided.",
      button: null,
    },
  };

  const current = statusConfig[status] || {
    message: "No actions available for this payment.",
    button: null,
  };

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        p: 2,
        backgroundColor: "background.paper",
        maxWidth: "100%",
        borderLeft: `5px solid ${theme.palette.primary.main}`,
        mb: 2
      }}
    >
      <Box display="flex" justifyContent="space-between" gap={2}>
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <AutoAwesomeIcon sx={{ color: "#7c4dff", fontSize: 18 }} />
            <Typography fontWeight={600} fontSize={14}>WHAT'S NEXT?</Typography>
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
              startIcon
              size="small"
              sx={{
                color: "icon.light",
                height: 30,
                borderRadius: 1.5,
                textTransform: "none",
                
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PaymentStatusBox;
