import {
  Box,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Grid,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import { clearUserSession, getUserSession } from "../../utils/session";

const AccountPanel = ({ onClose }) => {
  const { username, email, userId, organizationId } = getUserSession();

  const handleLogout = () => {
    clearUserSession();
    window.location.replace("/");
  };

  return (
    <Box sx={{ width: 340, p: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            {username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography fontWeight={600}>{username}</Typography>
            <Typography fontSize="0.8rem" color="text.secondary">
              {email}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <Typography sx={{ mt: 1, fontSize: "0.75rem", color: "text.secondary" }}>
        User ID: {userId} • Organization ID: {organizationId}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Actions Grid */}
      <Grid container spacing={2}>
        {[
          "Help Documents",
          "FAQs",
          "Forum",
          "Video Tutorials",
          "Explore Features",
          "API Documents",
        ].map((item) => (
          <Grid item xs={4} key={item}>
            <Box
              sx={{
                textAlign: "center",
                p: 1,
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": { backgroundColor: "action.hover" },
              }}
            >
              <Typography fontSize="0.75rem">{item}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Logout */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{ cursor: "pointer" }}
        onClick={handleLogout}
      >
        <LogoutIcon fontSize="small" />
        <Typography fontSize="0.9rem" color="error.main">
          Sign Out
        </Typography>
      </Box>
    </Box>
  );
};

export default AccountPanel;
