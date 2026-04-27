import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useMemo, useState } from "react";
import FlowerLoader from "./NDE-loader";

const CreatableAutocomplete = ({
  label,
  mandatory,
  options = [],
  value,
  onChange,
  placeholder = "Select or type...",
  loading = false,
  disabled = false,
  error = false,
  helperText,
  width = "100%",
  height = 40,
  mt = 1,
  mb = 2,
  sx = {},
  iconColor = "#8A8AA3",
  bottomActionLabel = "",
  onBottomActionClick,
  renderOption: renderOptionProp,
  filterKeys = ["label"],
}) => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const resolvedValue = useMemo(() => {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value === "object") return value;
    const matched = options?.find(
      (o) => o.value === value || o.label === value,
    );
    if (matched) return matched;
    return { label: value, value, _isManual: true };
  }, [value, options]);

  // const handleFilterOptions = (opts, params) => {
  //   const q = params.inputValue.trim().toLowerCase();
  //   if (!q) return opts;

  //   const result = opts
  //     .filter((o) =>
  //       filterKeys.some((key) => o[key]?.toString().toLowerCase().includes(q)),
  //     )
  //     .map((o) => ({
  //       ...o,
  //       _searchLabel: params.inputValue,
  //     }));
  //   console.log(result, "resss");
  //   return result;
  // };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleChange = (_event, newValue) => {
    if (!newValue) {
      onChange(null);
      return;
    }
    if (newValue._isManual && newValue._inputValue) {
      onChange(newValue._inputValue);
      return;
    }
    onChange(newValue);
  };

  const filteredOptions = useMemo(() => {
    const q = debouncedValue.trim().toLowerCase();
    if (!q) return options;

    return options.filter((o) =>
      filterKeys.some((key) => o[key]?.toString().toLowerCase().includes(q)),
    );
  }, [options, debouncedValue]);

  // const getOptionLabel = (option) => {
  //   if (typeof option === "string") return option;
  //   if (option._isManual && option._inputValue) return option._inputValue;
  //   // _searchLabel tricks MUI's internal filter — equals the typed query
  //   // so every option we approved always passes MUI's second pass
  //   if (option._searchLabel) return option._searchLabel;
  //   return option?.label ?? "";
  // };
  const getOptionLabel = (option) => {
    if (typeof option === "string") return option;
    if (option._searchLabel) return option._searchLabel; // trick MUI
    return option?.label ?? "";
  };
  const isOptionEqualToValue = (option, val) => {
    if (!val) return false;
    if (typeof val === "string")
      return option.value === val || option.label === val;
    return option.value === val.value;
  };

  const defaultRenderOption = (props, option) => {
    const { key, ...rest } = props;
    return (
      <li key={key} {...rest}>
        <Box>
          <Typography fontSize={13}>{option.label}</Typography>
          {option.subLabel && (
            <Typography variant="caption" color="text.secondary">
              {option.subLabel}
            </Typography>
          )}
        </Box>
      </li>
    );
  };

  const resolvedRenderOption = renderOptionProp
    ? (props, option) => {
        const { key, ...rest } = props;
        return renderOptionProp({ key, ...rest }, option);
      }
    : defaultRenderOption;

  const PaperComponent = ({ children, ...rest }) => (
    <Paper {...rest}>
      {children}
      {bottomActionLabel && (
        <>
          <Divider />
          <MenuItem
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onBottomActionClick?.()}
            sx={{
              justifyContent: "center",
              fontWeight: 500,
              color: "primary.main",
              height: 36,
              "&:hover": {
                backgroundColor: "primary.main",
                "& .MuiTypography-root": { color: "#fff" },
                color: "#fff",
              },
            }}
          >
            + {bottomActionLabel}
          </MenuItem>
        </>
      )}
    </Paper>
  );

  return (
    <Box display="block" alignItems="initial" gap={0}>
      {label && (
        <FormLabel sx={{ mb: 1, display: "block" }}>
          {label}
          {mandatory && <span style={{ color: "red" }}> *</span>}
        </FormLabel>
      )}

      <Autocomplete
        freeSolo
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        // options={options}
        value={resolvedValue}
        loading={loading}
        disabled={disabled}
        options={filteredOptions} // ✅ use filtered list
        filterOptions={(x) => x} // 🔥 disable MUI filtering
        inputValue={inputValue} // ✅ control input
        onInputChange={(_, v) => setInputValue(v)}
        // filterOptions={handleFilterOptions}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        onChange={handleChange}
        PaperComponent={PaperComponent}
        renderOption={resolvedRenderOption}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
            fullWidth
            disabled={disabled}
            onBlur={(e) => {
              const typed = e.target.value?.trim();
              console.log(typed, "typee");
              if (!typed) return;
              const matched = options.find(
                (o) =>
                  o.label?.toLowerCase() === typed.toLowerCase() ||
                  o.value === typed,
              );
              if (matched) {
                onChange(matched);
              } else {
                onChange(typed);
              }
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <FlowerLoader size={10} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        ListboxProps={{
          sx: {
            p: 0,
            "& .MuiAutocomplete-option": {
              px: 1.5,
              mt: 0.2,
              py: 1,
              borderRadius: "4px",
              mx: 0.5,
              "&:hover": {
                backgroundColor: "primary.main",
                "& .MuiTypography-root": { color: "#fff" },
              },
              '&[aria-selected="true"]': {
                backgroundColor: "primary.main",
                "& .MuiTypography-root": { color: "#fff" },
              },
              '&[aria-selected="true"]:hover': {
                backgroundColor: "primary.main",
              },
            },
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
            backgroundColor: disabled ? "#F5F5F5" : "transparent",
            "&:hover fieldset": { border: "1px solid #BFC3D9" },
          },
          "& .MuiAutocomplete-popupIndicator": { color: iconColor },
          "& .MuiAutocomplete-clearIndicator": { color: iconColor },
          ...sx,
        }}
      />
    </Box>
  );
};

export default CreatableAutocomplete;
