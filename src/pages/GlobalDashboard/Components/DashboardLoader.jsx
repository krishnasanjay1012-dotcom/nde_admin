import { CircularProgress } from "@mui/material";

export const AnalyticsLoader = ({ size = 5 }) => {
  return <CircularProgress size={`${size}vh`} />;
};
