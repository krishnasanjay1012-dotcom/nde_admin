import { Box } from '@mui/material'
import React, { useState } from 'react'
import { CommonDrawer, CommonTab } from '../../common/fields';

const MoreDetailsDrawer = ({ open, setOpen }) => {

    const [activeTab, setActiveTab] = useState(0);

    const handleClose = () => {
        setOpen(false);
        // reset();
    };


    return (
        <Box>
            <CommonDrawer
                open={open}
                onClose={handleClose}
                // title={initialData ? "Edit Application" : "Create Application"}
                // onSubmit={handleSubmit(onSubmit)}
                // submitLabel={initialData ? "Update" : "Save"}
                 width='900px'
               
            >

                <CommonTab
                    tabs={[
                        { label: "Transactions" },
                        { label: "History" }
                    ]}
                    height="100%"
                    activetab={activeTab}
                    // tabHeaderStyle={{
                    //     marginTop: '10px',
                    //     paddingTop: '20px',
                    //     // height: "44px",
                    //     alignItems: "stretch"
                    // }}
                    // tabButtonStyle={{
                    //     height: "100%",
                    //     padding: "0 20px",
                    //     display: "flex",
                    //     alignItems: "center"
                    // }}
                />

            </CommonDrawer>
        </Box>
    )
}

export default MoreDetailsDrawer
