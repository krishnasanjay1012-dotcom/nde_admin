import React from "react";
import { Box, Stepper, Step, StepLabel, StepConnector } from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.MuiStepConnector-alternativeLabel`]: {
    top: 20,
  },
  [`& .MuiStepConnector-line`]: {
    height: 2,
    border: 0,
    borderRadius: 2,
    backgroundColor: theme.palette.grey[300],
  },
  [`&.Mui-active .MuiStepConnector-line`]: {
    backgroundColor: theme.palette.primary.main,
  },
  [`&.Mui-completed .MuiStepConnector-line`]: {
    backgroundColor: theme.palette.success.main,
  },
}));

const CustomStepIcon = ({ active, completed, icon }) => {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: completed
          ? "success.main"
          : active
          ? "primary.main"
          : "grey.300",
        boxShadow: active ? 3 : 0,
        transition: "all 0.3s",
      }}
    >
      {completed ? <CheckCircleIcon sx={{ color: "#fff" }} /> : icon}
    </Box>
  );
};

const CommonStepper = ({ steps, activeStep }) => {
  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel
      connector={<CustomConnector />}
    >
      {steps.map((step) => (
        <Step key={step.label}>
          <StepLabel
            StepIconComponent={(props) => (
              <CustomStepIcon {...props} icon={step.icon} />
            )}
          >
            {step.label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default CommonStepper;
