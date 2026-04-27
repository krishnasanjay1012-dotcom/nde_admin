import { Avatar, Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import { CommonDrawerDetails, CommonTab } from '../../../common/fields'
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import DetailsInCustomerDrawer from './DetailsInCustomerDrawer';
import ActivityLogInCustomerDrawer from './ActivityLogInCustomerDrawer';

const CustomerRightSideDrawer = ({ open, setOpen }) => {

  const [activeTab, setActiveTab] = useState(0);

  const handleClose = () => {
    setOpen(false);
  };

  const handlegetactivetab = (index) => {
    setActiveTab(index);
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <DetailsInCustomerDrawer />;
      case 1:
        return <ActivityLogInCustomerDrawer />;
      default:
        return null;
    }
  };



  return (
    <Box>
      <CommonDrawerDetails
        open={open}
        onClose={handleClose}
        header={
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar>A</Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Customer
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                ARSK Exports
              </Typography>
            </Box>
          </Box>
        }
        width='500px'
      >
        <Box sx={{ width: '100%' }}>
          <Box sx={{ padding: "15px 20px", marginBottom: '20px' }}>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <BusinessIcon fontSize="small" color="icon.light" />
              <Typography variant="body2" color="text.secondary">
                A R S K EXPORTS
              </Typography>
            </Box>


            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmailIcon fontSize="small" color="icon.light" />
              <Typography variant="body2" color="text.secondary">
                arskexports@gmail.com
              </Typography>
            </Box>


          </Box>

          <CommonTab
            tabs={[
              { label: "Details" },
              { label: "Activity Log" }
            ]}
            height="100%"
            activetab={handlegetactivetab}
          />


          {renderTabContent()}
        </Box>

      </CommonDrawerDetails>

    </Box>
  )
}

export default CustomerRightSideDrawer
