import Accordion from "@mui/material/Accordion";
import Box from "@mui/material/Box";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Avatar from "@mui/material/Avatar";
import PaymentTable from "./PaymentTable";
import { useState } from "react";
import PaymentRefundDialog from "./PaymentRefundDialog";

const InvoicePayment = ({ paymentData = [] }) => {
  const [menuState, setMenuState] = useState({
    anchorEl: null,
    row: null,
  });

  const [openRefund, setOpenRefund] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); 

  const handleOpenRefund = () => setOpenRefund(true);
  const handleCloseRefund = () => setOpenRefund(false);

  return (
    <Box pb={0.8} mb={1}>
      <Accordion
        expanded={isExpanded} 
        onChange={(e, expanded) => setIsExpanded(expanded)} 
        sx={{
          border: "1px solid #E9EDF5",
          borderRadius: "6px",
          overflow: "hidden",

          "&::before": { display: "none" },
          "&:not(.Mui-expanded)": {
            borderRadius: "6px",
          },
          "&.Mui-expanded": {
            borderRadius: "6px",
            margin: 0,
            mb: 2,
          },
        }}
      >
        <AccordionSummary
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "background.paper"
                : "#f9f9fb",
            alignItems: "center",
          }}
        >
          <ExpandMoreIcon
            sx={{
              fontSize: 20,
              transition: "all 0.25s ease",
              transform: isExpanded
                ? "rotate(180deg)"
                : "rotate(-90deg)", 
              color: isExpanded ? "primary.main" : "#98A2B3",
            }}
          />

          <Typography fontSize={14} fontWeight={500}>
            Payments Received
          </Typography>

          <Avatar
            sx={{
              ml: 0.5,
              width: 18,
              height: 18,
              fontSize: "smaller",
              color: "text.primary",
              backgroundColor: "background.default",
            }}
          >
            {paymentData.length}
          </Avatar>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0 }}>
          <PaymentTable
            paymentData={paymentData}
            setMenuState={setMenuState}
            menuState={menuState}
            handleOpenRefund={handleOpenRefund}
          />
        </AccordionDetails>
      </Accordion>

      <PaymentRefundDialog
        open={openRefund}
        onClose={handleCloseRefund}
        refundId={menuState?.row}
      />
    </Box>
  );
};

export default InvoicePayment;