import React, { useState } from 'react';
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

const CommonOverview = ({ data }) => {
    const theme = useTheme();
    const [expandedPanel, setExpandedPanel] = useState(['contact_persons', 'address']);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpandedPanel((prev) =>
            isExpanded ? [...prev, panel] : prev.filter((p) => p !== panel)
        );
    };

    const isPanelExpanded = (panel) => expandedPanel.includes(panel);

    const renderDetailRow = (label, value) => (
        <Box sx={{ display: 'flex', mb: 1.5, alignItems: 'center' }}>
            <Typography sx={{ width: '160px', fontSize: '13px', color: theme.palette.text.secondary }}>{label}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ 
                    fontSize: '13px', 
                    fontWeight: 500, 
                    color: theme.palette.text.primary 
                }}>
                    {value || '-'}
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ p: 2, bgcolor: theme.palette.background.muted, minHeight: '100%', overflowY: 'auto' }}>
            {/* Top Summary Cards */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{
                    flex: 1,
                    p: 2.5,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '8px',
                    bgcolor: theme.palette.background.paper,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)'
                }}>
                    <WarningAmberIcon sx={{ color: theme.palette.warning.main, mb: 1, fontSize: 24 }} />
                    <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary, mb: 0.5 }}>Outstanding Receivables</Typography>
                    <Typography sx={{ fontSize: '20px', fontWeight: 600, color: theme.palette.text.primary }}>
                        {data?.outstandingReceivables || '0.00'}
                    </Typography>
                </Box>
                <Box sx={{
                    flex: 1,
                    p: 2.5,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '8px',
                    bgcolor: theme.palette.background.paper,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)'
                }}>
                    <CheckCircleOutlineIcon sx={{ color: theme.palette.success.main, mb: 1, fontSize: 24 }} />
                    <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary, mb: 0.5 }}>Unused Credits</Typography>
                    <Typography sx={{ fontSize: '20px', fontWeight: 600, color: theme.palette.text.primary }}>₹0.00</Typography>
                </Box>
            </Box>

            {/* Contact Details Section */}
            <Box sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '8px',
                bgcolor: theme.palette.background.paper,
                mb: 2,
                overflow: 'hidden',
                boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)'
            }}>
                <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500, color: theme.palette.text.primary }}>Contact Details</Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                    {renderDetailRow('Customer Type', data?.customer_type || '-')}
                    {renderDetailRow('Mobile Number',`${data?.phone_number_code} ${data?.phone_number}` || '-')}
                    {renderDetailRow('Currency', data?.currencyCode || '-')}
                    {renderDetailRow('Payment Terms', data?.paymentTermName || '-')}
                    {renderDetailRow('PAN', data?.pan_no || '-')}
                </Box>
            </Box>

            {/* Contact Persons Accordion */}
            <Accordion
                expanded={isPanelExpanded('contact_persons')}
                onChange={handleChange('contact_persons')}
                elevation={0}
                disableGutters
                sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '8px',
                    mb: 2,
                    '&:before': { display: 'none' },
                    overflow: 'hidden',
                    boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)'
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />}
                    sx={{
                        bgcolor: theme.palette.background.paper,
                        px: 2,
                        minHeight: '48px !important',
                        '& .MuiAccordionSummary-content': { display: 'flex', alignItems: 'center', gap: 1, margin: '12px 0 !important' }
                    }}
                >
                    <Typography sx={{ fontSize: '14px', fontWeight: 500, color: theme.palette.text.primary }}>Contact Persons</Typography>
                    <Box sx={{
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#EAECF0',
                        borderRadius: '4px',
                        px: 0.8,
                        py: 0.2,
                        fontSize: '11px',
                        fontWeight: 600,
                        color: theme.palette.text.secondary
                    }}>
                        {data?.contact_persons?.length || 0}
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, borderTop: `1px solid ${theme.palette.divider}` }}>
                    {data?.contact_persons?.length > 0 ? (
                        <Box sx={{ p: 2 }}>
                            {data.contact_persons.map((person, index) => (
                                <Box key={index} sx={{ mb: index === data.contact_persons.length - 1 ? 0 : 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                        <PersonOutlineOutlinedIcon sx={{ fontSize: 18, color: theme.palette.text.secondary, mr: 1 }} />
                                        <Typography sx={{ fontSize: '13px', fontWeight: 500, color: theme.palette.text.primary }}>
                                            {person.name_details ? `${person.name_details.salutation} ${person.name_details.first_name} ${person.name_details.last_name}` : person.email}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary, ml: 3.2 }}>{person.email}</Typography>
                                    <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary, ml: 3.2 }}>{person.phone?.mobile?.code} {person.phone?.mobile?.number}</Typography>
                                    {index !== data.contact_persons.length - 1 && <Divider sx={{ mt: 2 }} />}
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '13px', color: theme.palette.text.disabled || '#98A2B3' }}>No contact persons found.</Typography>
                        </Box>
                    )}
                </AccordionDetails>
            </Accordion>

            {/* Address Accordion */}
            <Accordion
                expanded={isPanelExpanded('address')}
                onChange={handleChange('address')}
                elevation={0}
                disableGutters
                sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '8px',
                    '&:before': { display: 'none' },
                    overflow: 'hidden',
                    boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)'
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />}
                    sx={{
                        bgcolor: theme.palette.background.paper,
                        px: 2,
                        minHeight: '48px !important',
                        '& .MuiAccordionSummary-content': { margin: '12px 0 !important' }
                    }}
                >
                    <Typography sx={{ fontSize: '14px', fontWeight: 500, color: theme.palette.text.primary }}>Address</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    {/* Billing Address */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
                            <InfoOutlinedIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                            <Typography sx={{ fontSize: '13px', color: theme.palette.text.secondary, fontWeight: 500 }}>Billing Address</Typography>
                        </Box>
                        {data?.billing_address_details ? (
                            <Box sx={{ ml: 0.5, borderLeft: `2px solid ${theme.palette.divider}`, pl: 2 }}>
                                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: theme.palette.text.primary, mb: 0.5 }}>
                                    {data.companyName || '-'}
                                </Typography>
                                <Typography sx={{ fontSize: '13px', color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                                    {data.billing_address_details.address}<br />
                                    {data.billing_address_details.city}<br />
                                    {data.billing_address_details.state} {data.billing_address_details.pincode || ''}<br />
                                    {data.billing_address_details.country}
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ ml: 0.5, borderLeft: `2px solid ${theme.palette.divider}`, pl: 2 }}>
                                <Typography sx={{ fontSize: '13px', color: theme.palette.text.disabled || '#98A2B3' }}>No Billing Address</Typography>
                            </Box>
                        )}
                    </Box>

                    <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

                    {/* Shipping Address */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
                            <Typography sx={{ fontSize: '13px', color: theme.palette.text.secondary, fontWeight: 500 }}>Shipping Address</Typography>
                        </Box>
                        {data?.shipping_address_details?.address ? (
                            <Box sx={{ ml: 0.5, borderLeft: `2px solid ${theme.palette.divider}`, pl: 2 }}>
                                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: theme.palette.text.primary, mb: 0.5 }}>
                                    {data.companyName || 'Shipping Location'}
                                </Typography>
                                <Typography sx={{ fontSize: '13px', color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                                    {data.shipping_address_details.address}<br />
                                    {data.shipping_address_details.city}<br />
                                    {data.shipping_address_details.state} {data.shipping_address_details.pincode || ''}<br />
                                    {data.shipping_address_details.country}
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ ml: 0.5, borderLeft: `2px solid ${theme.palette.divider}`, pl: 2, minHeight: '40px', display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ fontSize: '13px', color: theme.palette.text.disabled || '#98A2B3', textAlign: 'center', width: '100%' }}>No Shipping Address</Typography>
                            </Box>
                        )}
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}

export default CommonOverview;