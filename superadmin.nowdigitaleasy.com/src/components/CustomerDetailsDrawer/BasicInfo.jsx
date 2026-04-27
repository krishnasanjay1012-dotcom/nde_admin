import { Box, Typography } from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";

function BasicInfoRow({ icon, text="" }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        color: "#6B7280",
        mb: 1,
      }}
    >
      {icon}
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 400,
        }}
      >
        {text === "" ? "--" : text}
      </Typography>
    </Box>
  );
}

export default function BasicInfo({ email, website }) {
  return (
    <Box py={1.5} px={1.5}>
      <BasicInfoRow
        icon={<BusinessOutlinedIcon sx={{ fontSize: 16 }} />}
        text={website}
      />

      <BasicInfoRow
        icon={<EmailOutlinedIcon sx={{ fontSize: 16 }} />}
        text={email}
      />
    </Box>
  );
}
