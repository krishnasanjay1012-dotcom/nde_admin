import React, { useEffect, useState } from "react";
import CommonStepper from "../common/NDE-CommonStepper";
import CommonDrawer from "../common/NDE-Drawer";
import CreateWorkspace from "../../pages/WorkSpace/WorkSpace";
import CustomerForm from "./Customer-Create-Edit";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";

const steps = [
    { label: "Customer", icon: <PersonIcon sx={{ color: '#FFF' }} /> },
    { label: "Workspace", icon: <WorkIcon sx={{ color: '#FFF' }} /> },
];

const CustomerStepper = ({ open, onClose, initialData }) => {

    const [activeStep, setActiveStep] = useState(0);
    const [customerData, setCustomerData] = useState(initialData || null);

    useEffect(() => {
        if (initialData?.workspace !== undefined) {
            // Invert logic if needed: workspace true => 0, false => 1
            setActiveStep(initialData.workspace ? 0 : 1);
        }
    }, [initialData]);
    

    return (
        <CommonDrawer open={open} onClose={onClose} anchor="right" width={activeStep === 0 ? 600 : 850}>
            <CommonStepper steps={steps} activeStep={activeStep} />

            {activeStep === 0 && (
                <CustomerForm
                    onSuccess={(response) => {
                        setCustomerData(response?.data);
                        setActiveStep(1);
                    }}
                    initialData={initialData}
                    onClose={onClose}
                    activeStep={activeStep}
                    steps={steps}
                />
            )}

            {activeStep === 1 && (
                <CreateWorkspace
                    customer={customerData || initialData}
                    onBack={() => setActiveStep(0)}
                    handleClose={onClose}
                    userId={customerData?._id || initialData?._id}
                    activeStep={activeStep}
                />
            )}
        </CommonDrawer>
    );
};

export default CustomerStepper;
