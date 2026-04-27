import React, { useState, useRef } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Box,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CheckIcon from "@mui/icons-material/Check";

const CommonNestedMenu = ({
  items = [],
  onChange,
  triggerIcon = <MoreHorizRoundedIcon fontSize="small" />,
  triggerSx = {},
  menuWidth = 200,
  menuOffsetX = 5,
  submenuOffsetX = 1,
  submenuPlacement = "left",
  // New props for selection
  selectedValue = null, // Can be string or object {parent: string, child: string}
  selectedColor = "primary.main",
  showCheckmark = true,
  selectionType = "single", // 'single', 'parent-only', or 'child-only'
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [submenuAnchor, setSubmenuAnchor] = useState(null);
  const [submenuItems, setSubmenuItems] = useState([]);
  const timerRef = useRef(null);

  

  // Check if a parent item is selected
  const isParentSelected = (parentItem) => {
    if (!selectedValue) return false;
    
    if (selectionType === "parent-only") {
      return selectedValue === parentItem.value;
    }
    
    if (typeof selectedValue === "object" && selectedValue.parent) {
      return selectedValue.parent === parentItem.value;
    }
    
    return false;
  };

  // Check if a child item is selected
  const isChildSelected = (childItem, parentLabel) => {
    if (!selectedValue) return false;
    
    if (selectionType === "child-only") {
      return selectedValue === childItem.value;
    }
    
    if (typeof selectedValue === "object") {
      return (
        selectedValue.parent === parentLabel && 
        selectedValue.value === childItem.value
      );
    }
    
    return false;
  };

  const openMenu = (e) => setAnchorEl(e.currentTarget);

  const closeMenu = () => {
    setAnchorEl(null);
    closeSubmenu();
  };

  const openSubmenu = (event, children, parentLabel) => {
    event.stopPropagation();
    if (timerRef.current) clearTimeout(timerRef.current);

    setSubmenuAnchor(event.currentTarget);
    setSubmenuItems(
      children.map((c) => ({
        ...c,
        parentLabel,
      }))
    );
  };

  const closeSubmenu = () => {
    setSubmenuAnchor(null);
    setSubmenuItems([]);
  };

  const handleMainMenuLeave = () => {
    timerRef.current = setTimeout(closeSubmenu, 120);
  };

  const handleSubmenuEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const isSubmenuRight = submenuPlacement === "right";

  return (
    <>
      {/* Trigger Button */}
      <IconButton
        onClick={openMenu}
        sx={{
          border: "1px solid #ddd",
          borderRadius: 1,
          height: 36,
          width: 36,
          ...triggerSx,
        }}
      >
        {triggerIcon}
      </IconButton>

      {/* Main Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          onMouseLeave: handleMainMenuLeave,
          sx: {
            borderRadius: "10px",
            border: "1px solid #E9E9F8",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            ml: menuOffsetX,
            minWidth: menuWidth,
          },
        }}
      >
        {items.map((item, index) => {
          const isSelected = isParentSelected(item);
          
          return (
            <MenuItem
              key={index}
              onClick={() => {
                if (!item.children) {
                  onChange?.({
                    type: "parent",
                    label: item.label,
                    value: item.value,
                  });
                  item.onClick?.();
                  closeMenu();
                }
              }}
              onMouseEnter={(e) => {
                if (item.children) openSubmenu(e, item.children, item.label);
                else closeSubmenu();
              }}
              sx={{
                justifyContent: "space-between",
                mx: 0.5,
                borderRadius: 1,
                mt: -0.5,
                mb: -0.5,
                bgcolor: isSelected ? `${selectedColor}20` : "transparent", // 20 is opacity
                color: isSelected ? selectedColor : "inherit",
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "& .MuiListItemIcon-root, & .MuiTypography-root, & .MuiSvgIcon-root":
                    {
                      color: "primary.contrastText",
                    },
                },
              }}
            >
              <Box display="flex" alignItems="center">
                {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                <ListItemText 
                  primary={item.label} 
                  sx={{
                    color: isSelected ? selectedColor : "inherit",
                  }}
                />
              </Box>
              
              <Box display="flex" alignItems="center" gap={0.5}>
                {isSelected && showCheckmark && !item.children && (
                  <CheckIcon 
                    fontSize="small" 
                    sx={{ color: selectedColor }}
                  />
                )}
                {item.children && (
                  <ArrowRightIcon
                    fontSize="small"
                    sx={{
                      transform: isSubmenuRight ? "none" : "rotate(180deg)",
                      color: isSelected ? selectedColor : "inherit",
                    }}
                  />
                )}
              </Box>
            </MenuItem>
          );
        })}
      </Menu>

      {/* Sub Menu */}
      <Menu
        anchorEl={submenuAnchor}
        open={Boolean(submenuAnchor)}
        onClose={closeSubmenu}
        anchorOrigin={{
          vertical: "top",
          horizontal: isSubmenuRight ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: isSubmenuRight ? "left" : "right",
        }}
        disableAutoFocusItem
        autoFocus={false}
        disableEnforceFocus
        hideBackdrop
        style={{ pointerEvents: "none" }}
        PaperProps={{
          onMouseEnter: handleSubmenuEnter,
          onMouseLeave: closeSubmenu,
          sx: {
            pointerEvents: "auto",
            borderRadius: "10px",
            border: "1px solid #E9E9F8",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            mt: -0.5,
            minWidth: menuWidth,
            ...(isSubmenuRight
              ? { ml: submenuOffsetX }
              : { mr: submenuOffsetX }),
          },
        }}
      >
        {submenuItems.map((subItem, idx) => {
          const isSelected = isChildSelected(subItem, subItem.parentLabel);
          
          return (
            <MenuItem
              key={idx}
              onClick={() => {
                onChange?.({
                  type: "child",
                  label: subItem.label,
                  value: subItem.value,
                  parent: subItem.parentLabel,
                });
                subItem.onClick?.();
                closeMenu();
              }}
              sx={{
                mx: 0.5,
                borderRadius: 1,
                mt: -0.5,
                mb: -0.5,
                bgcolor: isSelected ? `${selectedColor}20` : "transparent",
                color: isSelected ? selectedColor : "inherit",
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "& .MuiListItemIcon-root, & .MuiTypography-root, & .MuiSvgIcon-root":
                    {
                      color: "primary.contrastText",
                    },
                },
              }}
            >
              <Box display="flex" alignItems="center" width="100%">
                {subItem.icon && <ListItemIcon>{subItem.icon}</ListItemIcon>}
                <ListItemText 
                  primary={subItem.label}
                  sx={{
                    color: isSelected ? selectedColor : "inherit",
                  }}
                />
                {isSelected && showCheckmark && (
                  <CheckIcon 
                    fontSize="small" 
                    sx={{ 
                      color: selectedColor,
                      ml: 1 
                    }}
                  />
                )}
              </Box>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default CommonNestedMenu;