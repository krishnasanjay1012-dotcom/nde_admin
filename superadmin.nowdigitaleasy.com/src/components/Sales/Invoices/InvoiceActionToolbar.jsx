import React, { useState } from "react";
import { Box, Button, Menu, MenuItem, Stack, Typography } from "@mui/material";

const toolbarButtonHover = {
  textTransform: "none",
  fontSize: 13,
  border: "1px solid transparent",
  "&:hover": {
    backgroundColor: "background.paper",
    border: '1px solid #D1D1D1'
  },
};

const menuItemStyle = {
  backgroundColor: "transparent",
  mx: 1,
  my: -0.5,
  px: 1.5,
  borderRadius: "6px",
  fontSize: 12,
  fontWeight: 400,
  transition: "background-color 0.15s ease, color 0.15s ease",
  "&:hover": {
    backgroundColor: "primary.light",
    color: "#FFF",
    "& svg": { color: "#FFF" },
  },
};

const actionWrapper = {
  display: "flex",
  alignItems: "center",
  pr: { xs: 0, sm: 1 },
  mr: { xs: 0, sm: 1 },
  borderRight: { xs: "none", sm: "1px solid #ddd" },
  "&:last-of-type": { borderRight: "none", mr: 0, pr: 0 },
};

const ActionMenu = ({ label, icon, items }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <>
      <Button
        color="inherit"
        size="small"
        startIcon={icon}
        sx={toolbarButtonHover}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        {label}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{ dense: true }}
        PaperProps={{
          sx: {
            borderRadius: "6px",
            py: 0.5,
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          },
        }}
      >
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            sx={menuItemStyle}
            onClick={() => {
              item.onClick?.();
              setAnchorEl(null);
            }}
          >
            {item.icon && (
              <Box
                sx={{
                  mr: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {item.icon}
              </Box>
            )}
            <Typography variant="body1">{item.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const ActionToolbar = ({ actions = [] }) => {
  const renderAction = (action) => {
    if (action.type === "menu") {
      return (
        <ActionMenu
          label={action.label}
          icon={action.icon}
          items={action.items || []}
        />
      );
    }

    return (
      <Button
        color="inherit"
        size="small"
        startIcon={action.icon}
        onClick={action.onClick}
        sx={toolbarButtonHover}
      >
        {action.label}
      </Button>
    );
  };

  return (
    <Box
      sx={{
        border: "1.2px solid #EBEBEF",
        py: 0.4,
        px: 1,
        mt: 2,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : '#f7f7fc',
        overflowX: "auto",
        width: "100%",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="nowrap">
        {actions.map((action, index) => (
          <Box key={index} sx={{ ...actionWrapper, flex: "0 0 auto" }}>
            {renderAction(action)}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default ActionToolbar;
