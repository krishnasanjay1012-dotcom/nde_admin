import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from "@mui/material";
import { format } from "date-fns";


export default function PaymentReceipt({ paymentDetails }) {

  const invoice = paymentDetails?.invoice;
  const formatDate = (date) => date ? format(new Date(date), "dd/MM/yyyy") : "-";

  const PAYMENT_STATUS = {
    color: "#2e7d32",
    bgColor: "#e8f5e9",
  };

  const ribbonInnerSx = {
    position: "absolute",
    top: "20px",
    left: "-45px",
    width: "160px",
    py: "6px",
    px: 5,
    textAlign: "center",

    color: "#fff",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",

    transform: "rotate(-45deg)",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
  };


  return (
    <Box
      sx={{
        width: "100%",
        py: 5,

        boxShadow: 5,
        position: "relative",
        backgroundColor: "background.paper",

      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "120px",
          height: "120px",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <Box sx={{ ...ribbonInnerSx, bgcolor: PAYMENT_STATUS.color }}>
          {paymentDetails?.status?.name || paymentDetails?.status}
        </Box>
      </Box>
      <Box
        sx={{
          width: "90%",
          // width: "8.27in",
          margin: "20px auto",
          backgroundColor: "background.paper",
          padding: 2,
          border: "1px solid #9e9e9e",
        }}
      >
        {/* HEADER */}
        <Box mb={4}>
          <Typography fontSize={20} fontWeight={600}>
            {paymentDetails.workspaceId?.workspace_name}
          </Typography>
          {/* <Typography color="#999" fontSize={14}>
            {paymentDetails.address.state}
          </Typography>
          <Typography color="#999" fontSize={14}>
            {paymentDetails.address.country}
          </Typography> */}
          <Typography color="#999" fontSize={14}>
            {paymentDetails.workspaceId?.email}
          </Typography>
        </Box>

        <Divider />

        {/* TITLE */}
        <Box textAlign="center" py={5}>
          <Typography
            sx={{
              borderBottom: "2px solid #eee",
              display: "inline-block",
              fontSize: 18,
            }}
          >
            PAYMENT RECEIPT
          </Typography>
        </Box>

        {/* PAYMENT META */}
        <Box display="flex" justifyContent="space-between">
          {/* LEFT */}
          <Box width="70%">
            {[
              [
                "Payment Date",
                formatDate(paymentDetails.payment_date)
              ],
              ["Reference Number", paymentDetails.reference],
              ["Payment Mode", paymentDetails.paymentModes?.name],
              ["Amount Received In Words", paymentDetails.amount],
            ].map(([label, value]) => (
              <Box key={label} mb={2} display="flex">
                <Typography width="35%" color="#777" fontSize={14}>
                  {label}
                </Typography>
                <Typography
                  width="65%"
                  borderBottom="1px solid #eee"
                  fontSize={12}
                  fontWeight={600}
                >
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* AMOUNT BOX */}
          <Box
            sx={{
              width: "25%",
              backgroundColor: "#78ae54",
              color: "#fff",
              textAlign: "center",
              padding: "30px 10px",
              height: "fit-content",
            }}
          >
            <Typography>Amount Received</Typography>
            <Typography fontSize={18} fontWeight={700}>
              {paymentDetails.amount}
            </Typography>
          </Box>
        </Box>

        {/* RECEIVED FROM */}
        <Box mt={4}>
          <Table>
            <TableRow>
              <TableCell>
                <Typography color="#777" fontSize={16} fontWeight={600}>
                  Received From
                </Typography>
                <Typography color="#408dfb" fontWeight={600}>
                  {paymentDetails.user?.first_name}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="#777">Authorized Signature</Typography>
                <Box
                  sx={{
                    width: 200,
                    borderBottom: "1px solid #999",
                    mt: 6,
                    ml: "auto",
                  }}
                />
              </TableCell>
            </TableRow>
          </Table>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* OVER PAYMENT */}
        <Box>
          <Typography color="#777">Over payment</Typography>
          <Typography>{paymentDetails.amount}</Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* PAYMENT FOR */}
        {invoice && (
          <Box>
            <Typography fontSize={20} mb={2}>
              Payment for
            </Typography>

            <Table>
              <TableHead sx={{ backgroundColor: "#eff0f1" }}>
                <TableRow>
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>Invoice Date</TableCell>
                  <TableCell align="right">Invoice Amount</TableCell>
                  <TableCell align="right">Payment Amount</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell>{invoice.invoiceNo}</TableCell>
                  <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                  <TableCell align="right">₹{invoice.totalAmount?.toLocaleString()}</TableCell>
                  <TableCell align="right">₹{invoice.paymentMade?.toLocaleString()}</TableCell>
                  <TableCell>{(invoice.status?.name || invoice.status || "").toUpperCase()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
}
