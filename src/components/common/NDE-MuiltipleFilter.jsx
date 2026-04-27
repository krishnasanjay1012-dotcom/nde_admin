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

const CommonMultipleFilter = ({
  menuOptions = [],
  selectedFilters = [],
  onChange,
  icon,
  label = "Filter",
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activePath, setActivePath] = useState([]);
  const open = Boolean(anchorEl);
  //   const [tempSelectedFilters, setTempSelectedFilters] = useState([]);

  //   const removeFilter = (value) => {
  //     onChange((prev) => prev.filter((f) => f.value !== value));
  //   };

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

    const newFilter = {
      label: option.label,
      value: selectedValue,
    };

    onChange((prev) => {
      if (prev.some((f) => f.value === selectedValue)) return prev;
      return [...prev, newFilter];
    });
  };

  const getCurrentOptions = (path = []) => {
    let options = menuOptions;
    for (let node of path) {
      options = node.children || [];
    }
    return options;
  };

  //   const normalizedValue = (value || "").replace(/\./g, ":");

  const menuWidth = 220;

  return (
    <>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}
      >
        {/* Filter Button */}
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
          }}
        >
          {icon ? icon : <img src={FilterIcon} alt="filter" height={16} />}
          <Typography sx={{ fontSize: 13 }}>{label}</Typography>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "8px",
            maxWidth: menuWidth,
            mt: 0.4,
            "& .MuiMenu-list": {
              paddingTop: 0,
              paddingBottom: 0,
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        <Box
          sx={{
            width: menuWidth,
            maxHeight: 254,
            position: "relative",
            display: "flex",
            flexDirection: "column",
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

                  //   const isActive = normalizedValue.startsWith(
                  //     optionPathString || "",
                  //   );

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
                        // backgroundColor: isActive
                        //   ? theme.palette.primary.light + "20"
                        //   : "transparent",
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
                              //   fontWeight: isActive ? 500 : 400,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              //   color: isActive
                              //     ? theme.palette.primary.main
                              //     : "text.primary",
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
                      //   const isActive =
                      //     normalizedValue.startsWith(optionPathString);

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
                            // backgroundColor: isActive
                            //   ? theme.palette.primary.light + "20"
                            //   : "transparent",
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
                                  //   fontWeight: isActive ? 500 : 400,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  //   color: isActive
                                  //     ? theme.palette.primary.main
                                  //     : "text.primary",
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
        {/* <Box
          sx={{
            borderTop: "1px solid #eee",
            p: 1,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Typography
            sx={{
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              color: theme.palette.primary.main,
            }}
            onClick={() => {
              onChange(tempSelectedFilters);
              handleClose();
            }}
          >
            Save Filter
          </Typography>
        </Box> */}
      </Menu>
    </>
  );
};

export default CommonMultipleFilter;
