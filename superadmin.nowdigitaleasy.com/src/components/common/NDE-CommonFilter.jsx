import React, { useState } from "react";
import {
  Menu,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import FilterIcon from "../../assets/icons/filter-icon.svg";

const CommonFilter = ({
  menuOptions = [],
  value = "",
  onChange,
  icon,
  label = "Filter",
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activePath, setActivePath] = useState([]);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setActivePath([]);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActivePath([]);
  };

  const handleSelect = (option, path) => {
    const selectedValue = path.map((p) => p.value).join(":");
    onChange?.(selectedValue);
    handleClose();
  };

  const getCurrentOptions = (path = []) => {
    let options = menuOptions;
    for (let node of path) {
      options = node.children || [];
    }
    return options;
  };

  const normalizedValue = (value || "").replace(/\./g, ":");

  const menuWidth = 220;

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          cursor: "pointer",
          border: "1px solid #D1D1D1",
          borderRadius: 1.5,
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
          height: 40,
          width: "fit-content",
        }}
      >
        {icon ? icon : <img src={FilterIcon} alt="filter" height={16} />}
        {label ? label : <Typography sx={{ fontSize: 13 }}>{label}</Typography>}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "8px",
            maxWidth: menuWidth,
            overflow: "hidden",
            mt: 0.4,
            "& .MuiMenu-list": { paddingTop: 0, paddingBottom: 0 },
          },
        }}
      >
        <Box
          sx={{
            width: menuWidth,
            maxHeight: 254,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: `${(activePath.length + 1) * menuWidth}px`,
              transform: `translateX(-${activePath.length * menuWidth}px)`,
              transition: "transform 0.3s ease-in-out",
            }}
          >
            {/* Root Menu */}
            <Box
              sx={{
                minWidth: menuWidth,
                maxHeight: 254,
                overflowY: "auto",
                px: 1,
              }}
            >
              {activePath.length > 0 && (
                <Box
                  onClick={() => setActivePath((prev) => prev.slice(0, -1))}
                  sx={{
                    py: 1,
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    px: 1,
                  }}
                >
                  <ArrowBackIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                    {activePath[activePath.length - 1].label}
                  </Typography>
                </Box>
              )}

              <List disablePadding>
                {getCurrentOptions([]).map((option) => {
                  const hasChildren = option.children?.length > 0;
                  const optionPathString = option.value;

                  const isActive = normalizedValue.startsWith(
                    optionPathString || "",
                  );

                  return (
                    <ListItemButton
                      key={option.value}
                      onClick={() => {
                        if (hasChildren) setActivePath([...activePath, option]);
                        else handleSelect(option, [option]);
                      }}
                      sx={{
                        mt: 0.5,
                        borderRadius: "6px",
                        height: 32,
                        backgroundColor: isActive
                          ? theme.palette.primary.light + "20"
                          : "transparent",
                        "&:hover": {
                          backgroundColor: theme.palette.primary.light + "30",
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: isActive ? 500 : 400,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              color: isActive
                                ? theme.palette.primary.main
                                : "text.primary",
                            }}
                          >
                            {option.label}
                          </Typography>
                        }
                      />
                      {hasChildren && <KeyboardArrowRightRoundedIcon />}
                    </ListItemButton>
                  );
                })}
              </List>
            </Box>

            {/* Child Menus */}
            {activePath.map((parent, index) => (
              <Box
                key={parent.value}
                sx={{
                  minWidth: menuWidth,
                  maxHeight: 254,
                  overflowY: "auto",
                  px: 1,
                }}
              >
                <Box
                  onClick={() => setActivePath((prev) => prev.slice(0, index))}
                  sx={{
                    py: 1,
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    px: 1,
                  }}
                >
                  <ArrowBackIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                    {parent.label}
                  </Typography>
                </Box>
                <List disablePadding>
                  {getCurrentOptions(activePath.slice(0, index + 1)).map(
                    (option) => {
                      const hasChildren = option.children?.length > 0;
                      const optionPathString = [
                        ...activePath.slice(0, index + 1).map((p) => p.value),
                        option.value,
                      ].join(":");
                      const isActive =
                        normalizedValue.startsWith(optionPathString);

                      return (
                        <ListItemButton
                          key={option.value}
                          onClick={() => {
                            if (hasChildren)
                              setActivePath([
                                ...activePath.slice(0, index + 1),
                                option,
                              ]);
                            else
                              handleSelect(option, [
                                ...activePath.slice(0, index + 1),
                                option,
                              ]);
                          }}
                          sx={{
                            mt: 0.5,
                            borderRadius: "6px",
                            height: 32,
                            backgroundColor: isActive
                              ? theme.palette.primary.light + "20"
                              : "transparent",
                            "&:hover": {
                              backgroundColor:
                                theme.palette.primary.light + "30",
                            },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography
                                sx={{
                                  fontSize: 13,
                                  fontWeight: isActive ? 500 : 400,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  color: isActive
                                    ? theme.palette.primary.main
                                    : "text.primary",
                                }}
                              >
                                {option.label}
                              </Typography>
                            }
                          />
                          {hasChildren && <KeyboardArrowRightRoundedIcon />}
                        </ListItemButton>
                      );
                    },
                  )}
                </List>
              </Box>
            ))}
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export default CommonFilter;
