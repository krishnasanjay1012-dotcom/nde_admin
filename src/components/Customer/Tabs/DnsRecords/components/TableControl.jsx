import React, { useState } from "react";
import {
    Box,
    Button,
    Menu,
    MenuItem,
    TextField,
    InputAdornment,
    IconButton,
    Badge,
    Popover,
    Typography,
    Chip,
    Divider
} from "@mui/material";

import {
    Search as SearchIcon,
    Clear as ClearIcon,
    FilterList as FilterListIcon,
    Sort as SortIcon,
    ArrowUpward,
    ViewList,
    ViewModule,
    KeyboardArrowDown,
} from "@mui/icons-material";

export default function DNSPageToolbar() {
    const [typeAnchor, setTypeAnchor] = useState(null);
    const [viewAnchor, setViewAnchor] = useState(null);
    const [filterAnchor, setFilterAnchor] = useState(null);

    const [sortOrder, setSortOrder] = useState("Ascending");
    const [viewType, setViewType] = useState("List view");

    const openType = Boolean(typeAnchor);
    const openView = Boolean(viewAnchor);
    const openFilter = Boolean(filterAnchor);
    return (
        <Box sx={{ p: 1}}>
            <Box
                sx={{
                    p: 1.5,
                    borderRadius: 2,
                    display: "flex",
                    gap: 1.5,
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                {/* SEARCH */}
                <TextField
                    size="small"
                    placeholder="Search here"
                    sx={{
                        width: 280,
                        borderRadius: 1,
                        '&:hover fieldset': {
                            borderColor: '#606060',
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton size="small">
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* FILTER */}
                <Badge badgeContent={2} color="primary">
                    <Button
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        sx={{ 
                            textTransform: "none",
                        }}
                        onClick={(e) => setFilterAnchor(e.currentTarget)}
                    >
                        Filters
                    </Button>
                </Badge>

                <Popover
                    open={openFilter}
                    anchorEl={filterAnchor}
                    onClose={() => setFilterAnchor(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                >
                    <Box sx={{ width: 320, p: 2}}>

                        {/* Record Type */}
                        <Typography sx={{ mb: 1 }}>Record type</Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                            {["A", "CNAME", "MX", "SRV", "TXT"].map((item) => (
                                <Chip key={item} label={item} />
                            ))}
                        </Box>

                        {/* Propagation */}
                        <Typography sx={{ mb: 1 }}>Propagation</Typography>
                        <Chip label="In propagation" sx={{ mb: 2 }} />

                        {/* Conflicts */}
                        <Typography sx={{ mb: 1 }}>Conflicts</Typography>
                        <Chip label="Without conflict" sx={{ mb: 2 }} />

                        <Divider sx={{ my: 2, bgcolor: "#333" }} />

                        {/* Footer Buttons */}
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Button size="small" color="inherit">
                                Clear filters
                            </Button>
                            <Button variant="contained" size="small">
                                Show 7 results
                            </Button>
                        </Box>

                    </Box>
                </Popover>

                {/* TYPE SORT DROPDOWN */}
                <Button
                    variant="outlined"
                    startIcon={<SortIcon />}
                    endIcon={<KeyboardArrowDown />}
                    onClick={(e) => setTypeAnchor(e.currentTarget)}
                    sx={{ textTransform: "none" }}
                >
                    Type
                </Button>

                <Menu
                    anchorEl={typeAnchor}
                    open={openType}
                    onClose={() => setTypeAnchor(null)}
                >
                    <MenuItem
                        onClick={() => {
                            setSortOrder("Ascending");
                            setTypeAnchor(null);
                        }}
                    >
                        <ArrowUpward sx={{ mr: 1 }} /> Ascending
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            setSortOrder("Descending");
                            setTypeAnchor(null);
                        }}
                    >
                        <ArrowUpward sx={{ mr: 1, transform: "rotate(180deg)" }} />
                        Descending
                    </MenuItem>
                </Menu>

                {/* VIEW DROPDOWN */}
                <Button
                    variant="outlined"
                    startIcon={<ViewList />}
                    endIcon={<KeyboardArrowDown />}
                    onClick={(e) => setViewAnchor(e.currentTarget)}
                    sx={{ textTransform: "none" }}
                >
                    {viewType}
                </Button>

                <Menu
                    anchorEl={viewAnchor}
                    open={openView}
                    onClose={() => setViewAnchor(null)}
                >
                    <MenuItem
                        onClick={() => {
                            setViewType("List view");
                            setViewAnchor(null);
                        }}
                    >
                        <ViewList sx={{ mr: 1 }} /> List view
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            setViewType("Grid view");
                            setViewAnchor(null);
                        }}
                    >
                        <ViewModule sx={{ mr: 1 }} /> Grid view
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
}
