import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/Upload";
import CommentIcon from "@mui/icons-material/Comment";
import PrintIcon from "@mui/icons-material/Print";

// import InvoiceActionToolbar from "../../../Sales/Invoices/InvoiceActionToolbar";
import InvoiceActionToolbar from "../../Sales/Invoices/InvoiceActionToolbar";

import { Grid } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PaymentIcon from "@mui/icons-material/Payment";
import DownloadIcon from "@mui/icons-material/Download";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Edit from "../../../assets/icons/edit.svg";
// import PaymentReceiptv2 from "./PaymentReceipt";

const PaymentDetailsPanel = ({
  customer,
  onEdit,
  onSend,
  onPdfPrint,
  onRefund,
  onDelete,
  onUploadClick,
  onCommentClick,
}) => {
  if (!customer) return null;
  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "-";

  const actions = [
    {
      label: "Edit",
      icon: <img src={Edit} alt="Edit" style={{ width: 15 }} />,
      // onClick: onEdit,
    },
    {
      label: "Send",
      type: "menu",
      icon: <SendIcon />,
      items: [
        {
          label: "Email",
          icon: <SendIcon fontSize="small" />,
        },
      ],
    },

    {
      label: "PDF / Print",
      type: "menu",
      icon: <PictureAsPdfIcon />,
      items: [
        {
          label: "Download PDF",
          icon: <DownloadIcon fontSize="small" />,
        },
        {
          label: "Print",
          icon: <PrintIcon fontSize="small" />,
        },
      ],
    },
    {
      label: "Refund",
      icon: <PaymentIcon />,
    },
    {
      label: null,
      type: "menu",
      icon: <MoreHorizIcon sx={{ ml: "-10px", fontSize: "50px" }} />,
      items: [
        {
          label: "Delete",
        },
      ],
    },
  ];

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
          mb: -1.8,
        }}
      >
        <Typography sx={{ fontSize: 20, fontWeight: 700, pl: 1 }}>
          {capitalize(customer.name)}
        </Typography>

        <Grid
          container
          alignItems="center"
          justifyContent="flex-end"
          wrap="nowrap"
        >
          {/* Upload */}
          <Grid item>
            <Box
              onClick={onUploadClick}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                mr: 4,
              }}
            >
              <UploadIcon color="primary" sx={{ mr: 1 }} />
              <Typography>Upload files</Typography>
            </Box>
          </Grid>

          <Box
            onClick={onCommentClick}
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              mr: 1,
            }}
          >
            <CommentIcon />
          </Box>

          <IconButton color="error">
            <CloseIcon sx={{ color: "error.main" }} />
          </IconButton>
        </Grid>
      </Box>

      <Box sx={{ mb: 1 }}>
        <InvoiceActionToolbar
          onEdit={onEdit}
          onSend={onSend}
          onPdfPrint={onPdfPrint}
          onRefund={onRefund}
          onDelete={onDelete}
          actions={actions}
        />
      </Box>
      {/* <Box sx={{ overflow: "scroll", maxHeight: "calc(100vh - 80px)", p: 2 }}>
        <PaymentReceiptv2 />
      </Box> */}
    </Box>
  );
};

export default PaymentDetailsPanel;
