import { Box, Typography, useTheme } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CommonButton from "../../common/NDE-Button";
import { useNavigate } from "react-router-dom";
import { useSentInvoice } from "../../../hooks/sales/invoice-hooks";

const invoiceStatusConfig = {
  draft: {
    message: "Send this Invoice to your customer or mark it as Sent.",
    button: "Send Invoice",
    extraButton: "Mark as Sent",
  },
  sent: {
    message: "Invoice has been sent. Waiting for customer payment.",
    button: "Record Payment",
  },
  viewed: {
    message: "Customer has viewed the invoice. Awaiting payment.",
    button: "Record Payment",
  },
  unpaid: {
    message: "Payment is pending. Record the payment once received.",
    button: "Record Payment",
  },
  overdue: {
    message: "This invoice is overdue. Send a reminder or record payment.",
    button: "Record Payment",
  },
  partially_paid: {
    message: "Partial payment received. Collect remaining balance.",
    button: "Record Balance",
  },
  paid: {
    message: "This invoice has been fully paid.",
    button: null,
  },
  void: {
    message: "This invoice has been voided.",
    button: null,
  },
  deleted: {
    message: "This invoice has been deleted.",
    button: null,
  },
};

const CreditsCard = ({ selectedInvoiceData, onCreateRecordPayment }) => {
  const invoiceId = selectedInvoiceData?._id;

  const theme = useTheme();


  const { mutate: sentInvoiceMutate } = useSentInvoice();

  const handleSentInvoice = () => {
    sentInvoiceMutate(invoiceId);
  };

  const navigate = useNavigate();

  const handleSendEmail = () => {
    navigate(`/sales/invoices/${invoiceId}/email`);
  };

  const status = selectedInvoiceData?.status || "draft";
  const config = invoiceStatusConfig[status] || invoiceStatusConfig["draft"];

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        p: 2,
        maxWidth: 800,
        borderLeft: `5px solid ${theme.palette.primary.main}`,
        backgroundColor: "#fff",
      }}
    >
      <Box display="flex" justifyContent="space-between" gap={2}>
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <AutoAwesomeIcon sx={{ color: "#7c4dff", fontSize: 18 }} />
            <Typography fontWeight={600}>WHAT'S NEXT?</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {config.message}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          {config.button && (
            <CommonButton
              label={config.button}
              onClick={status === "draft" ? handleSendEmail : onCreateRecordPayment}
              startIcon
              size="small"
              sx={{
                color: "#fff",
                height: 30,
                borderRadius: 1.5,
                textTransform: "none",
                // px: 2,
              }}
            />
          )}

          {status === "draft" && config.extraButton && (
            <CommonButton
              label={config.extraButton}
              onClick={handleSentInvoice}
              variant="outlined"
              size="small"
              startIcon
              sx={{
                height: 30,
                borderRadius: 1.5,
                textTransform: "none",
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CreditsCard;