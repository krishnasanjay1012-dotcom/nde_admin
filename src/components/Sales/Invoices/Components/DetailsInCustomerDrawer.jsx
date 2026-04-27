import { Box, Divider, Typography } from '@mui/material'
import React from 'react'

const DetailsInCustomerDrawer = () => {
    return (
        <Box sx={{ padding: '20px 20px 0px 20px', bgcolor: 'background.default' }}>
            <Box sx={{ display: 'flex', mb: '20px' }}>
                <div
                    style={{
                        width: "50%",
                        padding: "15px 0",
                        borderRight: "1px solid #ebeaf2",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "5px",
                    }}
                >
                    {/* <img src={Warning} alt="Icon" width="16px" height="16px" style={{ display: "block" }} /> */}
                    <Typography variant="subtitle1">
                        Outstanding Receivables
                    </Typography>
                    <Typography variant="h6">
                        ₹0.00
                    </Typography>
                </div>

                <div
                    style={{
                        width: "50%",
                        padding: "15px 0",
                        borderRight: "1px solid #ebeaf2",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "5px",
                    }}
                >
                    {/* <img src={Success} alt="Icon" width="16px" height="16px" style={{ display: "block" }} /> */}
                    <Typography variant="subtitle1" >
                        Unused Credits
                    </Typography>
                    <Typography variant="h6">
                        ₹0.00
                    </Typography>
                </div>


            </Box>

            <div style={{ border: "1px solid #ebeaf2", backgroundColor: "#fff", borderRadius: '8px' }}>
                <Typography variant="h6">Contact Details</Typography>
                <Divider />

                {/* Individual Fields */}
                <div style={{ padding: '1.25rem' }}>
                    <div style={{ display: "flex", fontSize: "13px", paddingBottom: '10px' }}>
                        <Typography variant="body2" sx={{ flex: '0 0 auto', width: '41.667%' }}>Customer Type:</Typography>
                        <Typography variant="body2">{"N/A"} </Typography>
                    </div>

                    <div style={{ display: "flex", paddingBottom: '10px' }}>
                        <Typography variant="body2" sx={{ flex: '0 0 auto', width: '41.667%' }}>Currency:</Typography>
                        <Typography variant="body2">{"N/A"}</Typography>
                    </div>

                    <div style={{ display: "flex", paddingBottom: '10px' }}>
                        <Typography variant="body2" sx={{ flex: '0 0 auto', width: '41.667%' }}>Payment Terms:</Typography>
                        <Typography variant="body2">{"N/A"}</Typography>
                    </div>

                    <div style={{ display: "flex", paddingBottom: '10px' }}>
                        <Typography variant="body2" sx={{ flex: '0 0 auto', width: '41.667%' }}>Portal Language:</Typography>
                        <Typography variant="body2">{"N/A"}</Typography>
                    </div>

                    <div style={{ display: "flex", paddingBottom: '10px' }}>
                        <Typography variant="body2" sx={{ flex: '0 0 auto', width: '41.667%' }}>PAN:</Typography>
                        <Typography variant="body2" >{"N/A"}</Typography>
                    </div>
                    
                </div>
            </div>





        </Box>
    )
}

export default DetailsInCustomerDrawer
