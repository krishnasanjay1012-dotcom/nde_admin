import { Box } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import CallIcon from "@mui/icons-material/Call";
import BadgeIcon from "@mui/icons-material/Badge";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

export const inputAdornmentMap = {
  currency: (
    <Box
      sx={{
        width: 45,
        backgroundColor: "#f9f9fb",
        borderRight: "1px solid #ddd",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "13px",
        color: "#555",
      }}
    >
      <CurrencyRupeeIcon sx={{ color: "#666", fontSize: 20 }}/>
    </Box>
  ),

  website: <LanguageIcon sx={{ color: "#666", fontSize: 20 }} />,

  x: (
    <Box sx={{ color: "#000", fontSize: 18, fontWeight: "bold" }}>
      X
    </Box>
  ),

  skype: <CallIcon sx={{ color: "#00aff0", fontSize: 20 }} />,

  facebook: (
    <Box sx={{ color: "#1877f2", fontSize: 20, fontWeight: "bold" }}>
      f
    </Box>
  ),

  pan: <BadgeIcon sx={{ color: "#666", fontSize: 20 }} />,
};
