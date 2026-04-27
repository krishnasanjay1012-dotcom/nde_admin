import React, { useState } from "react";
import { IconButton, Menu, MenuItem, ListItemIcon } from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

const RowActions = ({ actions, rowData }) => { 
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <MoreVertRoundedIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            border: "1px solid #E9E9F8",
          },
        }}
      >
        {actions.map((action) => (
          <MenuItem
            key={action.key}
            onClick={() => {
              action.onClick(rowData); 
              handleClose();
            }}
          >
            {action.icon && <ListItemIcon sx={{ minWidth: 30 }}>{action.icon}</ListItemIcon>}
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default RowActions;
