import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { useState } from 'react'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PaymentMadeList from './Bill-PaymentMadeLIst';

const BillPaymentMade = ({isLoading, billpaymentData}) => {

    const accordionData = [
        {
            title: "Payments Made",
            content: <PaymentMadeList isLoading={isLoading} data={billpaymentData} />,
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
    return (
        <Box>
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
                                p:0
                            }}
                        >
                            {item.content}
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </Box>
    )
}

export default BillPaymentMade
