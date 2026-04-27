import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import FlowerLoader from "../NDE-loader";
import { useCallback, useMemo, useRef } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useUnsavedChanges } from "../../../context/UnsavedChangesContext";

const CommonAutocomplete = ({
  mandatory,
  label,
  value,
  onChange,
  onInputChange,
  options = [],
  placeholder,
  error,
  helperText,
  sx,
  iconColor = "#8A8AA3",
  width = "100%",
  height = 40,
  mt = 1,
  mb = 2,
  loading = false,
  disabled = false,
  ListboxProps = {},
  renderOption,
  bottomActionLabel = "",
  onBottomActionClick,
  invoiceTable = false,
}) => {
  const { registerDirtyInput, unregisterDirtyInput } = useUnsavedChanges();
  const inputRef = useRef(null);

  const handleInputRegistration = (shouldRegister) => {
    const input = inputRef.current;

    if (input) {
      if (shouldRegister) registerDirtyInput(input);
      else unregisterDirtyInput(input);
    }
  };

  const filterOptions = useMemo(
    () =>
      createFilterOptions({
        stringify: (option) =>
          invoiceTable
            ? `${option.dropdownlabel || ""} ${option.planName || ""} ${option.billingCycleLabel || ""}`
            : option.label || "",
      }),
    [invoiceTable],
  );

  const handleFilterOptions = useCallback(
    (options, state) => filterOptions(options, state),
    [filterOptions],
  );

  const PaperComponent = (props) => {
    const { children, ...rest } = props;

    return (
      <Paper {...rest}>
        {children}

        {bottomActionLabel && (
          <>
            <Divider />

            <MenuItem
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onBottomActionClick?.();
              }}
              sx={{
                // justifyContent: "center",
                fontWeight: 500,
                color: "primary.main",
                height: 36,
                "&:hover": {
                  backgroundColor: "primary.main",
                  "& .MuiTypography-root": {
                    color: "icon.light",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "icon.light",
                  },
                  color: "icon.light",
                },
              }}
            >
              <SettingsIcon
                fontSize="small"
                sx={{
                  color: "primary.main",
                }}
              />
              <Typography ml={1}>{bottomActionLabel}</Typography>
            </MenuItem>
          </>
        )}
      </Paper>
    );
  };

  return (
    <Box display={"block"} alignItems={"initial"} gap={0}>
      <FormLabel sx={{ mb: 1 }}>
        {label}
        {mandatory && <span style={{ color: "red" }}> *</span>}
      </FormLabel>

      <Autocomplete
        options={options}
        value={value || null}
        onChange={(e, newValue) => {
          handleInputRegistration(!!newValue);
          onChange(newValue);
        }}
        onInputChange={(e, newInputValue, reason) => {
          if (reason === "input") {
            handleInputRegistration(!!newInputValue.trim());
            onInputChange?.(e, newInputValue, reason);
          } else if (reason === "clear") {
            handleInputRegistration(false);
            onInputChange?.(e, "", reason);
            onChange(null);
          } else if (reason === "reset") {
            onInputChange?.(e, "", reason);
          }
        }}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        getOptionLabel={(option) => option?.label || ""}
        filterOptions={handleFilterOptions}
        PaperComponent={PaperComponent}
        renderOption={
          renderOption
            ? renderOption
            : (props, option) => (
              <li {...props}>
                <Box>
                  <Typography>{option.label}</Typography>
                  {option.subLabel && (
                    <Typography variant="caption" color="textSecondary">
                      {option.subLabel}
                    </Typography>
                  )}
                </Box>
              </li>
            )
        }
        ListboxProps={{
          ...ListboxProps,
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
                "& .MuiTypography-root": {
                  color: "#FFF",
                },
                "& .MuiSvgIcon-root": {
                  color: "#E3E8FF",
                },
              },
              '&[aria-selected="true"]': {
                backgroundColor: "primary.main",
                "& .MuiTypography-root": {
                  color: "#FFF",
                },
              },
              '&[aria-selected="true"]:hover': {
                backgroundColor: "primary.main",
              },
            },
          },
        }}
        loading={loading}
        disabled={disabled}
        clearIcon={<CloseIcon fontSize="small" sx={{ color: 'error.main', fontSize: 16 }} />}
        popupIcon={<KeyboardArrowDownIcon />}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={inputRef}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
            fullWidth
            disabled={disabled}
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
        sx={{
          width,
          mt,
          mb,
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height,
            "& fieldset": {
              border: "1px solid #D1D1D1",
            },
            backgroundColor: disabled ? "#F5F5F5" : "transparent",
            "&:hover fieldset": {
              border: "1px solid #BFC3D9",
            },
            "& input": {
              cursor: "text",
              userSelect: "auto",
            },
          },
          "& .MuiAutocomplete-popupIndicator": { color: iconColor },
          "& .MuiAutocomplete-clearIndicator": {
            visibility: "visible",
            color: "#EF5350",
            marginRight: "4px",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              right: -2,
              top: "50%",
              transform: "translateY(-50%)",
              height: "60%",
              minHeight: "16px",
              borderRight: "1px solid #D1D1D1",
            }
          },
          ...sx,
        }}
      />
    </Box>
  );
};

export default CommonAutocomplete;
