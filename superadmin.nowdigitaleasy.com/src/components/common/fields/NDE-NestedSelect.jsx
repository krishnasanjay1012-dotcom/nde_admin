import { useState, useMemo } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  FormLabel,
  Box,
  Typography,
  ListSubheader,
  FormHelperText,
} from "@mui/material";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import CommonSearchBar from "./NDE-SearchBar";

const CommonNestedSelect = ({
  mandatory,
  label,
  value,
  onChange,
  name,
  options = {},
  error,
  helperText,
  width = "100%",
  height = 40,
  mt = 1,
  mb = 2,
  disabled = false,
  searchable = false,
  labelKey = "name",
  valueKey = "id",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const flatOptions = useMemo(() => {
    if (!options || typeof options !== "object") return [];
    return Object.values(options).flat();
  }, [options]);

  const menuItems = useMemo(() => {
    if (!options || typeof options !== "object") return [];

    return Object.entries(options).flatMap(([category, accountList]) => {
      const filtered = accountList.filter((acc) =>
        acc[labelKey]?.toLowerCase().includes(search.toLowerCase()),
      );

      if (!filtered.length) return [];

      return [
        <ListSubheader
          key={`header-${category}`}
          sx={{
            fontWeight: 600,
            fontSize: 13,
            color: "text.secondary",
          }}
        >
          {category}
        </ListSubheader>,

        ...filtered.map((opt) => (
          <MenuItem key={opt[valueKey]} value={opt[valueKey]}>
            {opt[labelKey]}
          </MenuItem>
        )),
      ];
    });
  }, [options, search, labelKey, valueKey]);

  return (
    <>
      {label && (
        <FormLabel>
          {label}
          {mandatory && <span style={{ color: "red" }}> *</span>}
        </FormLabel>
      )}
<FormControl
  fullWidth
  error={error}
  disabled={disabled}
  sx={{
    width,
    mt,
    mb,
    minWidth: 0,
    boxSizing: "border-box",
  }}
>
        <Select
          name={name}
          value={value ?? ""}
          open={open}
          onOpen={() => !disabled && setOpen(true)}
          onClose={() => {
            setOpen(false);
            setSearch("");
          }}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          sx={{
            borderRadius: 1,
            height,
            width: "100%",
            minWidth: 0,

            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              paddingRight: "32px",
            },
          }}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return <Typography color="text.disabled">Select</Typography>;
            }

            const selectedOption = flatOptions.find(
              (opt) => String(opt[valueKey]) === String(selected),
            );

            return (
              <Typography
                noWrap
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "99%",
                }}
              >
                {selectedOption?.[labelKey] || ""}
              </Typography>
            );
          }}
          IconComponent={() => (
            <Box
              pr={1}
              sx={{ cursor: disabled ? "not-allowed" : "pointer", mt: 1 }}
              onClick={() => !disabled && setOpen((prev) => !prev)}
            >
              {open ? (
                <ExpandLessRoundedIcon fontSize="small" />
              ) : (
                <ExpandMoreRoundedIcon fontSize="small" />
              )}
            </Box>
          )}
          MenuProps={{
            PaperProps: { sx: { maxHeight: 300 } },
          }}
        >
          {searchable && (
            <ListSubheader
              sx={{ px: 1 }}
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
              />
            </ListSubheader>
          )}

          {menuItems.length > 0 ? (
            menuItems
          ) : (
            <MenuItem disabled sx={{ justifyContent: "center" }}>
              No results found
            </MenuItem>
          )}
        </Select>

        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </>
  );
};

export default CommonNestedSelect;
