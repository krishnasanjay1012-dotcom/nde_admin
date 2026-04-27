import { useState, useEffect } from "react";
import {
    Box,
    Menu,
    MenuItem,
    Badge,
    Popover,
    Typography,
    Chip,
    Divider,
    ToggleButtonGroup,
    ToggleButton
} from "@mui/material";

import {
    FilterList as FilterListIcon,
    Sort as SortIcon,
    ArrowUpward,
    ViewList,
    ViewModule,
    KeyboardArrowDown,
} from "@mui/icons-material";
import CommonSearchBar from "../../../../common/fields/NDE-SearchBar";
import CommonButton from "../../../../common/NDE-Button";
import DropdownMenu from "../../../../common/NDE-DropdownMenu";

export default function DNSPageToolbar({ filters = {}, setFilters, totalRecords = 0, viewType = "List view", setViewType }) {
    const [typeAnchor, setTypeAnchor] = useState(null);
    const [filterAnchor, setFilterAnchor] = useState(null);

    const [sortOrder, setSortOrder] = useState("Ascending");

    const [searchTerm, setSearchTerm] = useState(filters.search || "");

    const [tempRecordTypes, setTempRecordTypes] = useState(
        filters.recordType ? filters.recordType.split(",") : []
    );

    // Debounce search input
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchTerm !== filters.search) {
                setFilters(prev => ({
                    ...prev,
                    search: searchTerm,
                    page: 1
                }));
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchTerm]);

    useEffect(() => {
        if (filterAnchor) {
            setTempRecordTypes(filters.recordType ? filters.recordType.split(",") : []);
        }
    }, [filterAnchor]);

    const activeFiltersCount = tempRecordTypes.length;

    const openType = Boolean(typeAnchor);
    const openFilter = Boolean(filterAnchor);
    const recordTypes = ["A", "CNAME", "MX", "NS", "SRV", "TXT"];

    return (
        <Box sx={{ p: 1 }}>
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
                <CommonSearchBar
                    size="small"
                    placeholder="Search Value here"
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onClear={() => setSearchTerm("")}
                    sx={{
                        width: 280,
                        borderRadius: 1,
                        '&:hover fieldset': {
                            borderColor: '#606060',
                        },
                    }}
                    mb={0}
                    mt={0}
                    height={34}
                />

                {/* FILTER */}
                <Badge badgeContent={activeFiltersCount} color="primary" invisible={activeFiltersCount === 0}>
                    <CommonButton
                        label={"Filters"}
                        variant="outlined"
                        color="default"
                        startIcon={<FilterListIcon sx={{ color: "primary.main" }} />}
                        sx={{
                            textTransform: "none",
                        }}
                        onClick={(e) => setFilterAnchor(e.currentTarget)}
                    />
                </Badge>

                <Popover
                    open={openFilter}
                    anchorEl={filterAnchor}
                    onClose={() => setFilterAnchor(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                >
                    <Box sx={{ width: 320, p: 2 }}>

                        {/* Record Type */}
                        <Typography sx={{ mb: 1 }}>Record type</Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                            {recordTypes.map((item) => {
                                // const selectedTypes = filters.recordType ? filters.recordType.split(',') : [];
                                // const isSelected = selectedTypes.includes(item);
                                const isSelected = tempRecordTypes.includes(item);
                                return (
                                    <Chip
                                        key={item}
                                        label={item}
                                        color={isSelected ? "primary" : "default"}
                                        variant={isSelected ? "filled" : "outlined"}
                                        onClick={() => {
                                            let newTypes = [...tempRecordTypes];

                                            if (isSelected) {
                                                newTypes = newTypes.filter(t => t !== item);
                                            } else {
                                                newTypes.push(item);
                                            }
                                            setTempRecordTypes(newTypes);
                                        }}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                );
                            })}
                        </Box>

                        {/* Propagation */}
                        {/* <Typography sx={{ mb: 1 }}>Propagation</Typography>
                        <Chip label="In propagation" sx={{ mb: 2 }} /> */}

                        {/* Conflicts */}
                        {/* <Typography sx={{ mb: 1 }}>Conflicts</Typography>
                        <Chip label="Without conflict" sx={{ mb: 2 }} /> */}

                        <Divider sx={{ my: 2, bgcolor: "#333" }} />

                        {/* Footer Buttons */}
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <CommonButton
                                label={"Clear filters"}
                                variant="outlined"
                                size="small"
                                color="inherit"
                                startIcon={null}
                                onClick={() => {
                                    setTempRecordTypes([]);
                                    setFilters && setFilters(prev => ({ ...prev, recordType: '', page: 1 }))
                                    setFilterAnchor(null)
                                }}
                            />
                            <CommonButton
                                label={"Show results"}
                                variant="contained"
                                size="small"
                                startIcon={null}
                                onClick={() => {
                                    setFilters(prev => ({
                                        ...prev,
                                        recordType: tempRecordTypes.join(","),
                                        page: 1
                                    }));
                                    setFilterAnchor(null);
                                }}
                            />
                        </Box>

                    </Box>
                </Popover>

                {/* TYPE SORT DROPDOWN */}
                <CommonButton
                    label={filters.sortOrder === "desc" ? "Descending" : "Ascending"}
                    variant="outlined"
                    color="default"
                    startIcon={<SortIcon sx={{ color: "primary.main" }} />}
                    endIcon={<KeyboardArrowDown sx={{ color: "icon.default" }} />}
                    onClick={(e) => setTypeAnchor(e.currentTarget)}
                    sx={{ textTransform: "none" }}
                />
                <Menu
                    anchorEl={typeAnchor}
                    open={openType}
                    onClose={() => setTypeAnchor(null)}
                >
                    <MenuItem
                        selected={filters.sortOrder === "asc"}
                        onClick={() => {
                            if (setFilters) setFilters(prev => ({ ...prev, sortOrder: "asc", page: 1 }));
                            setTypeAnchor(null);
                        }}
                    >
                        <ArrowUpward sx={{ mr: 1, color: "icon.default", fontSize: "18px" }} /> Ascending
                    </MenuItem>

                    <MenuItem
                        selected={filters.sortOrder === "desc"}
                        onClick={() => {
                            if (setFilters) setFilters(prev => ({ ...prev, sortOrder: "desc", page: 1 }));
                            setTypeAnchor(null);
                        }}
                    >
                        <ArrowUpward sx={{ mr: 1, transform: "rotate(180deg)", color: "icon.default", fontSize: "18px" }} />
                        Descending
                    </MenuItem>
                </Menu>

                <ToggleButtonGroup
                    value={viewType}
                    exclusive
                    onChange={(e, newView) => {
                        if (newView !== null && setViewType) {
                            setViewType(newView);
                        }
                    }}
                    size="small"
                    aria-label="view mode"
                    sx={{ height: 36 }}
                >
                    <ToggleButton value="List view" aria-label="list view">
                        <ViewList sx={{ mr: 1, fontSize: "18px", color: "primary.main" }} />
                        <Typography variant="body3" sx={{ textTransform: "none" }}>List View</Typography>
                    </ToggleButton>
                    <ToggleButton value="Preset view" aria-label="preset view">
                        <ViewModule sx={{ mr: 1, fontSize: "18px", color: "primary.main" }} />
                        <Typography variant="body3" sx={{ textTransform: "none" }}>Preset View</Typography>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Box>
    );
}
