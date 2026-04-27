import React, { useState, useMemo, useCallback } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  TextField,
  ListSubheader,
  FormLabel,
  Box,
  Typography,
  useTheme,
} from "@mui/material";

const CommonDateRangeDropdown = ({
  label = "Date Range",
  options = [],
  value,
  onChange,
  sx,
  mandatory = false,
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  // 🔍 Filter optimized
  const filteredOptions = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return options.filter((opt) => opt?.label?.toLowerCase().includes(search));
  }, [options, searchTerm]);

  // 🔁 Handlers
  const handleChange = useCallback((e) => onChange(e.target.value), [onChange]);

  const handleSearch = useCallback((e) => {
    e.stopPropagation();
    setSearchTerm(e.target.value);
  }, []);

  const renderValue = useCallback(
    (selected) => {
      if (!selected) return "Select...";
      return options.find((o) => o.value === selected)?.label || "Select";
    },
    [options],
  );

  return (
    <FormControl fullWidth size="small" sx={{ minWidth: 200, ...sx }}>
      <Box
        display="flex"
        alignItems="center"
        mb={1}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.shape.borderRadius,
          px: 0.5,
          py: 0.3,

          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Label */}
        <FormLabel
          sx={{
            borderRight: `2px solid ${theme.palette.divider}`,
            pr: 1,
            ml: 0.5,
            mb: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography fontWeight={500}>{label}</Typography>
          {mandatory && (
            <Typography color="error" ml={0.3}>
              *
            </Typography>
          )}
        </FormLabel>

        {/* Select */}
        <Select
          value={value || ""}
          onChange={handleChange}
          displayEmpty
          onClose={() => setSearchTerm("")}
          renderValue={renderValue}
          variant="outlined"
          sx={{
            flex: 1,
            minWidth: 120,

            "&.Mui-focused": {
              boxShadow: "none",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
          MenuProps={{
            autoFocus: false,
            disableAutoFocusItem: true,
            MenuListProps: {
              autoFocusItem: false,
              sx: { p: 0 },
            },

            PaperProps: {
              sx: {
                width: sx?.width || "auto",
                maxHeight: 300,
                borderRadius: theme.shape.borderRadius,
                ml: sx?.width ? "-8px" : "",
                p: 0,
                pb: 0.5,
              },
            },
          }}
        >
          {/* 🔍 Search */}
          <ListSubheader sx={{ p: 1.5, lineHeight: 0 }}>
            <TextField
              size="small"
              autoFocus
              placeholder="Search..."
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: theme.shape.borderRadius,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: theme.shape.borderRadius,
                },
              }}
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={(e) => {
                if (e.key !== "Escape") e.stopPropagation();
              }}
            />
          </ListSubheader>

          {/* 📋 Options */}
          {filteredOptions.length ? (
            filteredOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No results</MenuItem>
          )}
        </Select>
      </Box>
    </FormControl>
  );
};

export default CommonDateRangeDropdown;
