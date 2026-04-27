import { Box, Typography } from "@mui/material";

const TwolineHeaders = ({ header, subline }) => {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: "24px",
          fontWeight: 700,
          color: "#000334",
          textAlign: "center",
          lineHeight: "36px",
          fontFamily: "Manrope"
        }}
      >
        {header}
      </Typography>

      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 400,
          color: "#000334B2",
          textAlign: "center",
          lineHeight: "24px"
        }}
      >
        {subline}
      </Typography>
    </Box>
  );
};

export default TwolineHeaders;
