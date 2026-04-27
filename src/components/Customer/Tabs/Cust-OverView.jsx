import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import OverviewTab from "./OverviewTab";
import FlowerLoader from "../../common/NDE-loader";
import Subscription from "./Customer-Sub";
import CustomerRenewal from "../../../pages/Customers/Cust-OverView-List/Cust-Renewal";
import CustomerPayment from "../../../pages/Customers/Cust-OverView-List/Cust-OutstandingPayments";

const OverView = ({ selectedWorkspaceId, userId, customerData, isLoading }) => {

  const accordionData = [
    {
      title: "Basic Info",
      content: <OverviewTab userId={userId} customer={customerData} />,
    },
    // {
    //   title: "Associate  Customer",
    //   content: <CustomerAssociate/>,
    // },
    {
      title: "Subscription",
      content: <Subscription userId={userId} selectedWorkspaceId={selectedWorkspaceId}
      />,
    },
    {
      title: "Upcoming Renewals",
      content: <CustomerRenewal userId={userId} selectedWorkspaceId={selectedWorkspaceId}
      />,
      showNew: true,
    },
    {
      title: "Payment Outstanding",
      content: <CustomerPayment selectedWorkspaceId={selectedWorkspaceId}/>,
      showNew: true,
    },
  ];

  const [expandedPanel, setExpandedPanel] = useState(
    accordionData.map((_, index) => index)
  );

  const handleChange = (panel) => (event, isExpanded) => {
    setExpandedPanel((prev) =>
      isExpanded ? [...prev, panel] : prev.filter((p) => p !== panel)
    );
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FlowerLoader size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ overflow: "auto", maxHeight: "calc(100vh - 180px)", p: 2 }}>
      {accordionData.map((item, index) => {
        const isExpanded = expandedPanel.includes(index);

        return (
          <Accordion
            key={index}
            expanded={isExpanded}
            onChange={handleChange(index)}
            disableGutters
            elevation={0}
            sx={{
              border: "1px solid #E9EDF5",
              borderRadius: "6px",
              mb: 1,
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
              sx={{
                px: 2,
                borderBottom: isExpanded ? "1px solid #E9EDF5" : "none",
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : '#f9f9fb',
                "& .MuiAccordionSummary-content": {
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  margin: 0,
                },
              }}
            >
              <ExpandMoreIcon
                sx={{
                  fontSize: 20,
                  transition: "all 0.25s ease",
                  transform: isExpanded ? "rotate(180deg)" : "rotate(-90deg)",
                  color: isExpanded ? "primary.main" : "#98A2B3",
                }}
              />

              <Typography fontSize={14} fontWeight={500}>
                {item.title}
              </Typography>
            </AccordionSummary>


            <AccordionDetails
              sx={{
                p:
                  item.title === "Upcoming Renewals" ||
                    item.title === "Payment Outstanding" || item.title === "Associate  Customer"
                    ? 0
                    : 2,
              }}
            >
              {item.content}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default OverView;
