import { Autocomplete, TextField, FormLabel, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const CommonCountryStateCity = ({
  mandatory,
  label,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  helperText,
  sx,
  iconColor = "#8A8AA3",
  width = "100%",
  height = 40,
  getOptionLabel,
  getOptionValue,
  mt = 1,
  mb = 1
}) => {
  const _getOptionLabel = getOptionLabel || ((option) => option?.name || "");
  const _getOptionValue = getOptionValue || ((option) => option?.isoCode || option?.value || option);

  const selectedOption = options.find((opt) => _getOptionValue(opt) === value) || null;

  return (
    <>
      <FormLabel>
        {label}
        {mandatory && <span style={{ color: "red" }}> *</span>}
      </FormLabel>
      <Autocomplete
        options={options}
        value={selectedOption}
        onChange={(e, newValue) => onChange(newValue ? _getOptionValue(newValue) : "")}
        isOptionEqualToValue={(option, val) => _getOptionValue(option) === _getOptionValue(val)}
        getOptionLabel={_getOptionLabel}
        clearIcon={<CloseIcon fontSize="small" sx={{ color: 'error.main', fontSize: 16 }} />}
        popupIcon={<KeyboardArrowDownIcon />}
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
                color: 'icon.light',
                "& .MuiTypography-root": {
                  color: "icon.light",
                },
                "& .MuiSvgIcon-root": {
                  color: "icon.light",
                },
              },
              '&[aria-selected="true"]': {
                backgroundColor: "primary.main",
                color: 'icon.light',
                "& .MuiTypography-root": {
                  color: "icon.light",
                },
              },
              '&[aria-selected="true"]:hover': {
                backgroundColor: "primary.main",
              },
            },
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
            fullWidth
          />
        )}
        sx={{
          width,
          mt,
          mb,
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height: height,
            "& fieldset": { border: "1px solid #D1D1D1" },
            "&:hover fieldset": {
              border: "1px solid #BFC3D9",
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
    </>
  );
};

export default CommonCountryStateCity;
