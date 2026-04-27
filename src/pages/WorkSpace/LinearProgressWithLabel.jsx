import { Box, LinearProgress, linearProgressClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomLinearProgress = styled(LinearProgress)(() => ({
  height: 5,
  borderRadius: 0,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#E0E0E0"
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#000334B2"
  }
}));

const LinearProgressWithLabel = ({ value }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <CustomLinearProgress variant="determinate" value={value} />
    </Box>
  );
};

export default LinearProgressWithLabel;
