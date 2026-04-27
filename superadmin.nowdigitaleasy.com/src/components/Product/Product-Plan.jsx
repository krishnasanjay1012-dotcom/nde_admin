import { Box, Typography } from "@mui/material";
import PlansList from "./Plan/Plan-List";


const PlansSection = ({ fetchedPlans = [], planLoading, handlePrice, handleEdit,handleClonePlan }) => {

  const plansList = fetchedPlans?.data || [];


  return (
    <Box >
      {/* Header */}
      <Box sx={{ backgroundColor: "background.muted", display: "flex", padding: 1.4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h3">{plansList.length}</Typography>
          <Typography variant="body1" color="text.secondary">
            Plans
          </Typography>
        </Box>
      </Box>
      <Box sx={{overflowY: "auto",flex: 1,maxHeight: "calc(100vh - 200px)"}}>
        <PlansList
          fetchedPlans={fetchedPlans}
          planLoading={planLoading}
          handlePrice={handlePrice}
          handleEdit={handleEdit}
          handleClonePlan={handleClonePlan}
        />
      </Box>
    </Box>
  );
};

export default PlansSection;
