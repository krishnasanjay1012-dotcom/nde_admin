import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  useTheme,
  Box,
} from "@mui/material";
import SouthRoundedIcon from "@mui/icons-material/SouthRounded";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const CommonMoreMenu = ({
  menuOptions = [],
  value = "",
  onChange,
  icon,
  label = "More",
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (value) => {
    onChange?.(value);
    handleClose();
  };

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          cursor: "pointer",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 1.2,
          px: 1,
          py: 0.5,
          display: "flex",
          alignItems: "center",
          height: 40,
          width: "fit-content",
          bgcolor: "background.muted"
        }}
      >
        {label}
        {icon ? (
          icon
        ) : (
          <ArrowDropDownIcon />
        )}

      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "6px",
            minWidth: 120,
            boxShadow: (theme) => theme.shadows[3],
            border: (theme) => `1px solid ${theme.palette.divider}`,
            "& .MuiMenu-list": {
              paddingTop: 0,
              paddingBottom: 0,
            },
          },
        }}
      >
        {menuOptions.map((option) => {
          const isSelected = value === option.value;

          return (
            <MenuItem
              key={option.value}
              onClick={() => handleSelect(option.value)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 14,
                borderRadius: "6px",
                mb: 0.4,
                mx: 1,
                "&:hover": {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                },
              }}
            >
              {option.label}

              {option.sortDirection && (
                <ListItemIcon sx={{ minWidth: "auto", ml: 1 }}>
                  <SouthRoundedIcon
                    fontSize="small"
                    sx={{
                      transform:
                        option.sortDirection === "asc"
                          ? "rotate(180deg)"
                          : "none",
                      color: isSelected
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    }}
                  />
                </ListItemIcon>
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default CommonMoreMenu;