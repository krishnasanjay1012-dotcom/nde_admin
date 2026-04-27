import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const NestedMenu = ({ anchorEl, open, onClose, items }) => {
  const [submenuAnchor, setSubmenuAnchor] = useState(null);
  const [submenuItems, setSubmenuItems] = useState([]);

  const handleOpenSubmenu = (event, children) => {
    event.stopPropagation(); // Prevent parent menu close
    setSubmenuAnchor(event.currentTarget);
    setSubmenuItems(children);
  };

  const handleCloseSubmenu = () => {
    setSubmenuAnchor(null);
    setSubmenuItems([]);
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {items.map((item, index) => (
          <MenuItem
            key={index}
            onClick={
              item.children
                ? (e) => handleOpenSubmenu(e, item.children)
                : () => onClose()
            }
          >
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText primary={item.label} />
            {item.children && <ArrowRightIcon fontSize="small" />}
          </MenuItem>
        ))}
      </Menu>

      {/* Submenu */}
      <Menu
        anchorEl={submenuAnchor}
        open={Boolean(submenuAnchor)}
        onClose={handleCloseSubmenu}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {submenuItems.map((subItem, idx) => (
          <MenuItem
            key={idx}
            onClick={() => {
              handleCloseSubmenu();
              onClose(); // Close main menu if desired
            }}
          >
            {subItem.icon && <ListItemIcon>{subItem.icon}</ListItemIcon>}
            <ListItemText primary={subItem.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const CommonMenu = ({ items }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>

      <NestedMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        items={items}
      />
    </div>
  );
};

export default CommonMenu;
