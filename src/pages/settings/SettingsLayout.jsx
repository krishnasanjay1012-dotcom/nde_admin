import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";

const SettingsLayout = () => {
  const navigate = useNavigate();

  const renderListItem = (to, label) => (
    <ListItemButton
      onClick={() => navigate(to)}
      sx={{
        borderRadius: 1,
        "&:hover": { bgcolor: "primary.extraLight" },
        "& .hoverIcon": { opacity: 0, transition: "opacity 0.2s ease-in-out" },
        "&:hover .hoverIcon": { opacity: 1 },
      }}
    >
      <ListItemText
        primary={label}
        primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
      />
      <ListItemIcon
        className="hoverIcon"
        sx={{
          minWidth: 30,
          color: "text.secondary",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <ChevronRightIcon fontSize="small" />
      </ListItemIcon>
    </ListItemButton>
  );

  const renderCard = (title, color, icon, items) => (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          {icon}
          <Typography variant="h6" color={`${color}.dark`}>
            {title}
          </Typography>
        </Box>
        <List dense>{items}</List>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        p: 3,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(auto-fit, minmax(300px, 1fr))",
        },
        height: { xs: "90vh", sm: "90vh", md: "90vh", lg: "auto" },
        overflow: "auto",
      }}
    >
      {renderCard(
        "Integrations",
        "primary",
        <IntegrationInstructionsIcon color="primary" />,
        <>
          {renderListItem("/settings/gsuite", "G-suite")}
          {renderListItem("/settings/domain", "Domain")}
          {renderListItem("/settings/plesk", "Plesk")}
          {renderListItem("/settings/razorpay", "Razorpay")}
        </>
      )}

      {renderCard(
        "Communication",
        "warning",
        <ChatIcon color="warning" />,
        <>
          {renderListItem("/settings/email", "Email")}
          {renderListItem("/settings/email-template", "Email Template")}
          {renderListItem("/settings/bulk-email", "Bulk Email")}
        </>
      )}

      {renderCard(
        "General Settings",
        "secondary",
        <SettingsIcon color="secondary" />,
        <>
          {renderListItem("/settings/config-settings", "Config Settings")}
          {renderListItem("/settings/currencies", "Currencies")}
          {renderListItem("/settings/general", "General")}
        </>
      )}
    </Box>
  );
};

export default SettingsLayout;
