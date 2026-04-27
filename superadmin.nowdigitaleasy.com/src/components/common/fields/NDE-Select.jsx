
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  CircularProgress,
  Divider,
  FormLabel,
  IconButton,
  ListSubheader,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import CommonSearchBar from "./NDE-SearchBar";
import ClearIcon from "@mui/icons-material/Clear";

const CommonSelect = ({
  mandatory,
  label,
  value,
  onChange,
  name,
  options = [],
  error,
  helperText,
  sx,
  width = "100%",
  height = 40,
  mt = 1,
  mb = 2,
  disabled = false,
  disabledBorderColor = "#D1D1DB",
  searchable = false,
  labelKey = "label",
  valueKey = "value",
  subLabelKey = "subLabel",
  bottomLabel,
  onBottomonClick,
  loading,
  clearable = true,
  placeholder = "Select"
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filter options by search
  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter((opt) =>
      String(opt?.[labelKey]).toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, options, labelKey]);

  // Group options if "group" key exists
  const groupedOptions = useMemo(() => {
    const groups = {};
    filteredOptions.forEach((opt) => {
      const group = opt.group;
      if (!groups[group ?? ""]) groups[group ?? ""] = [];
      groups[group ?? ""].push(opt);
    });
    return groups;
  }, [filteredOptions]);

  const hasGroups = Object.keys(groupedOptions).some((g) => g);

  const handleClear = (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    onChange?.({ target: { name, value: "" } });
    setOpen(false);
    setSearch("");
  };

  return (
    <>
      {label && (
        <FormLabel>
          {label}
          {mandatory && <span style={{ color: "red" }}> *</span>}
        </FormLabel>
      )}

      <TextField
        select
        fullWidth
        name={name}
        value={value ?? ""}
        onChange={onChange}
        error={error}
        helperText={helperText}
        disabled={disabled}
        SelectProps={{
          displayEmpty: true,

          open: disabled ? false : open,
          onOpen: () => !disabled && setOpen(true),
          onClose: () => {
            setOpen(false);
            setSearch("");
          },
          IconComponent: () => {
            if (loading) {
              return (
                <Box
                  sx={{
                    pr: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress size={"2vh"} />
                </Box>
              );
            }
            return (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  pr: 1,
                  mt: 0.5,
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
              >
                {clearable && (value !== undefined && value !== null && value !== "") && (
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    onMouseDown={(e) => e.stopPropagation()}
                    sx={{
                      "&:hover": { backgroundColor: "transparent" },
                    }}
                  >
                    <ClearIcon sx={{ color: "error.main", fontSize: 17 }} />
                  </IconButton>
                )}
                {clearable && (value !== undefined && value !== null && value !== "") && (
                  <Divider orientation="vertical" sx={{ height: "3vh" }} />
                )}
                <Box
                  display="flex"
                  onClick={() => !disabled && setOpen((prev) => !prev)}
                >
                  {open ? (
                    <ExpandLessRoundedIcon fontSize="small" />
                  ) : (
                    <ExpandMoreRoundedIcon fontSize="small" />
                  )}
                </Box>
              </Box>
            );
          },
          MenuProps: {
            PaperProps: { sx: { maxHeight: 300, maxWidth: width, p: 0 } },
          },
          renderValue: (selected) => {
            if (
              selected === undefined ||
              selected === null ||
              selected === ""
            ) {
              return <Typography color="text.disabled">{placeholder}</Typography>;
            }
            const selectedOption = options.find(
              (opt) => String(opt?.[valueKey]) === String(selected),
            );
            return <Typography>{selectedOption?.[labelKey] || ""}</Typography>;
          },
        }}
        sx={{
          width,
          mt,
          mb,
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height,
            "& fieldset": { border: "1px solid #D1D1D1" },
            "&.Mui-disabled fieldset": { borderColor: disabledBorderColor },
            "&.Mui-disabled": { backgroundColor: "#f9f9fb" },
            "& .MuiSelect-icon": { display: "none" },
          },
          ...sx,
        }}
      >
        {searchable && (
          <ListSubheader
            sx={{
              px: 1,
              position: "sticky",
              top: 0,
              zIndex: 1,
              bgcolor: "background.paper",
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <CommonSearchBar
              value={search}
              onChange={setSearch}
              onClear={() => setSearch("")}
              placeholder="Search..."
              autoFocus
              height={36}
              mt={0}
              mb={0}
              sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
              }}
            />
          </ListSubheader>
        )}

        {filteredOptions.length > 0 ? (
          hasGroups ? (
            // Render grouped options
            Object.keys(groupedOptions).map((group) => (
              <React.Fragment key={group || "ungrouped"}>
                {group && (
                  <ListSubheader
                    sx={{
                      px: 1,
                      py: 0,
                      lineHeight: 3,
                      bgcolor: "background.muted",
                      fontWeight: 600,
                      fontSize: "13px",
                      minHeight: "auto",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {group.charAt(0).toUpperCase() + group.slice(1)}
                  </ListSubheader>
                )}
                {groupedOptions[group].map((opt) => (
                  <MenuItem
                    key={opt[valueKey]}
                    value={opt[valueKey]}
                    selected={String(opt[valueKey]) === String(value)}
                    onClick={() => {
                      onChange?.({ target: { name, value: opt[valueKey] } });
                      setOpen(false);
                    }}
                    sx={{
                      mx: 0.5,
                      mt: 0.2,
                      minHeight: 32,
                      borderRadius: 1,
                      "&.Mui-selected": {
                        backgroundColor: "primary.light",
                        "& .MuiTypography-root": { color: "#FFF" },
                        "&:hover": { backgroundColor: "primary.light" },
                      },
                      "&:hover": {
                        backgroundColor: "primary.light",
                        "& .MuiTypography-root": { color: "#FFF" },
                      },
                    }}
                  >
                    <Box>
                      <Typography
                        title={opt[labelKey]}
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 210,
                        }}
                      >
                        {opt[labelKey]}
                      </Typography>
                      {opt[subLabelKey] && (
                        <Typography variant="caption" color="textSecondary" sx={{ display: "block", lineHeight: 1.2 }}>
                          {opt[subLabelKey]}
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </React.Fragment>
            ))
          ) : (
            // Render ungrouped options
            filteredOptions.map((opt) => (
              <MenuItem
                key={opt[valueKey]}
                value={opt[valueKey]}
                onClick={() => {
                  onChange?.({ target: { name, value: opt[valueKey] } });
                  setOpen(false);
                }}
                sx={{
                  mx: 0.5,
                  mt: 0.2,
                  minHeight: 30,
                  borderRadius: 1,
                  "&.Mui-selected": {
                    backgroundColor: "primary.light",
                    "& .MuiTypography-root": { color: "#FFF" },
                    "&:hover": { backgroundColor: "primary.light" },
                  },
                  "&:hover": {
                    backgroundColor: "primary.light",
                    "& .MuiTypography-root": { color: "#FFF" },
                  },
                }}
              >
                <Box>
                  <Typography
                    title={opt[labelKey]}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: width || 210,
                    }}
                  >
                    {opt[labelKey]}
                  </Typography>
                  {opt[subLabelKey] && (
                    <Typography variant="caption" color="textSecondary" sx={{ display: "block", lineHeight: 1.2 }}>
                      {opt[subLabelKey]}
                    </Typography>
                  )}
                </Box>
              </MenuItem>
            ))
          )
        ) : (
          <MenuItem disabled sx={{ justifyContent: "center" }}>
            No results found
          </MenuItem>
        )}
        {bottomLabel && (
          <Box
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(false);
              onBottomonClick?.();
            }}
            sx={{
              borderTop: "1px solid #eee",
              p: 1,
              bgcolor: "background.paper",
              position: "sticky",
              bottom: -0.5,
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
          >
            <SettingsIcon
              fontSize="small"
              sx={{
                color: "primary.main",
              }}
            />
            <Typography>{bottomLabel}</Typography>
          </Box>
        )}
      </TextField>
    </>
  );
};

export default CommonSelect;
