import { Box, Typography } from "@mui/material";
import nde from "../../assets/log/nde.gif";

const NdeLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "#fff",
      }}
    >
      <Box
        component="img"
        src={nde}
        alt="loading..."
        sx={{
          height: 90,
          width: 90,
          objectFit: "contain",
          mb: 2,
        }}
      />
      <Typography variant="subtitle2">
        Please wait while we make everything perfect for you...
      </Typography>
    </Box>
  );
};

export default NdeLoader;
