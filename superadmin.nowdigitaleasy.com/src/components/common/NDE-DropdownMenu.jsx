import React, { useState } from "react";
import {
    Menu,
    MenuItem,
    IconButton,
    ListItemIcon,
    useTheme,
    Divider,
} from "@mui/material";
import SouthRoundedIcon from "@mui/icons-material/SouthRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';

const DropdownMenu = ({ menuOptions, selectedKey }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <>
            <IconButton
                onClick={handleClick}
                sx={{
                    height: 30,
                    width: 35,
                    borderRadius: 1.5,
                }}
            >
                <FilterListRoundedIcon/>
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
                {menuOptions.map((option) => {
                    const isSelected = selectedKey === option.key;

                    return (
                        <MenuItem
                            key={option.key}
                            onClick={() => {
                                option.onClick(option.key);
                                handleClose();
                            }}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontSize: "14px",
                                fontWeight: 400,
                                borderRadius: "6px",
                                mb: 0.4,
                                mx: 1,
                                color: isSelected
                                    ? theme.palette.primary.main
                                    : theme.palette.text.primary,
                                backgroundColor: isSelected
                                    ? theme.palette.primary.extraLight
                                    : "transparent",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    backgroundColor: theme.palette.primary.light,
                                    color: theme.palette.primary.contrastText,
                                    "& .MuiSvgIcon-root": {
                                        color: theme.palette.primary.contrastText,
                                    },
                                },
                            }}
                        >
                            {option.label}

                            {option.sortDirection && (
                                <ListItemIcon sx={{ minWidth: "auto", ml: 1 }}>
                                    <SouthRoundedIcon
                                        fontSize="small"
                                        sx={{
                                            color: isSelected
                                                ? theme.palette.primary.main
                                                : theme.palette.text.secondary,
                                            transform:
                                                option.sortDirection === "asc"
                                                    ? "rotate(180deg)"
                                                    : "none",
                                        }}
                                    />
                                </ListItemIcon>
                            )}
                        </MenuItem>
                    );
                })}

                <Divider/>

                <MenuItem
                    onClick={() => {
                        if (menuOptions[0]?.onClick) menuOptions[0].onClick("");
                        handleClose();
                    }}
                    disabled={selectedKey === ""} 
                    sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        fontWeight: 400,
                        borderRadius: "8px",
                        mx: 1,
                        cursor: selectedKey === "" ? "not-allowed" : "pointer", 
                        color: selectedKey === "" ? theme.palette.text.disabled : theme.palette.error.main,
                        "&:hover": {
                            backgroundColor: selectedKey === "" ? "transparent" : theme.palette.error.main,
                            color: selectedKey === "" ? theme.palette.text.disabled : theme.palette.error.contrastText,
                            "& .MuiSvgIcon-root": {
                                color: selectedKey === "" ? theme.palette.text.disabled : theme.palette.error.contrastText,
                            },
                        },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: "auto" }}>
                        <RestartAltRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    Reset Filter
                </MenuItem>

            </Menu>
        </>
    );
};

export default DropdownMenu;
