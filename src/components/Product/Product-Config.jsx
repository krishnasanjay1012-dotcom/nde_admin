import { Box } from "@mui/material";
import GSuitePlan from "./Product-GSuite";
import HostingPlan from "./Product-Hosting";
import AppPlan from "./Product-App";

const PlanConfigForm = ({ selectedProduct, control, errors }) => {
    
  const renderForm = () => {
    switch (selectedProduct?.type) {
      // case "app":
      //   return <AppPlan control={control} errors={errors} />;
      case "hosting":
        return <HostingPlan control={control} errors={errors} />;
      case "gsuite":
        return <GSuitePlan control={control} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box>{renderForm()}</Box>
    </Box>
  );
};

export default PlanConfigForm;
