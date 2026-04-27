import { Box } from "@mui/material";
import React, { useMemo } from "react";
import CommonDrawer from "../common/NDE-Drawer";
import GSuitePlan from "./Product-GSuite";
import HostingPlan from "./Product-Hosting";
import AppPlan from "./Product-App";
import PlanCreateForm from "./New-Product-Paln";


const PlanCreate = ({ open, handleClose, initialData, selectedPlan }) => {


  const drawerTitle = useMemo(() => {
    const productTypeMap = {
      app: "App Plan",
      gsuite: "GSuite Plan",
      plesk: "Hosting Plan",
    };

    const baseTitle = productTypeMap[initialData?.productType] || "Plan";
    return selectedPlan?._id ? `Edit ${baseTitle}` : `Create ${baseTitle}`;
  }, [initialData, selectedPlan]);


  const renderForm = () => {
    switch (initialData?.productType) {
      case "app":
        return <AppPlan initialData={selectedPlan} productId={initialData?.id} handleClose={handleClose} />;
      case "plesk":
        return <HostingPlan initialData={selectedPlan} productId={initialData?.id} handleClose={handleClose} />;
      case "gsuite":
        return <GSuitePlan initialData={selectedPlan} productId={initialData?.id} handleClose={handleClose} />;
      default:
        return <PlanCreateForm handleClose={handleClose}/>;
    }
  };

  const drawerWidth = useMemo(() => {
    if (initialData?.productType === "plesk") return 760;
    return 600; 
  }, [initialData]);


  return (
    <Box>
      <CommonDrawer
        open={open}
        onClose={handleClose}
        anchor="right"
        width={drawerWidth}
        title={drawerTitle}
      >
        {/* Form content */}
        <Box>{renderForm()}</Box>
      </CommonDrawer>
    </Box>
  );
};

export default PlanCreate;
