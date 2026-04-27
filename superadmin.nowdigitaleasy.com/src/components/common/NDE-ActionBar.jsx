import { Box, Button, Divider, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ActionBar = ({ actions = [], selectedCount = 0, onClose, showEsc = true }) => {
  const handleClick = (action) => {
    if (action.menuItems && action.menuItems.length > 0) {
      action.menuItems[0].onClick?.();
    } else {
      action.onClick?.();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        p: 1,
        border: "1px solid #E0E0E0",
        borderRadius: "8px",
        backgroundColor: "primary.contrastText",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
        mb: 1,
      }}
    >
      {/* Left Section */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1,
          flex: 1,
          minWidth: 0,
        }}
      >
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "contained"}
            size="medium"
            color={action.color || "primary"}
            onClick={() => handleClick(action)}
            sx={{ height: 40, borderRadius: 2 }}
          >
            {action.label}
          </Button>
        ))}

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Typography variant="body2" noWrap sx={{ flexShrink: 0, color: "text.primary" }}>
          {selectedCount} Selected
        </Typography>
      </Box>

      {/* Right Section */}
      {showEsc && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton color="error" size="small" onClick={onClose}>
            <CloseIcon fontSize="small" sx={{color:'error.main'}}/>
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default ActionBar;
