import {
  Autocomplete,
  FormLabel,
  Avatar,
  Box,
  Typography,
  Chip,
  TextField,
  MenuItem,
} from "@mui/material";
import { useUnsavedChanges } from "../../../context/UnsavedChangesContext";

const CommonMultiSelect = ({
  label,
  value = [],
  onChange,
  mandatory,
  name,
  options = [],
  error,
  helperText,
  sx,
  width = "100%",
  height,
  iconColor = "#8A8AA3",
  mt = 1,
  mb = 2,
  renderValue,
  placeholder,
}) => {
  const { registerDirtyInput, unregisterDirtyInput } = useUnsavedChanges();

  const handleInputRegistration = (e, isDirty) => {
    if (!e || !e.target) return;
    const input = e.target.tagName === 'INPUT'
      ? e.target
      : e.target.closest && e.target.closest('.MuiAutocomplete-root')?.querySelector('input');

    if (input) {
      if (isDirty) {
        input.setAttribute("data-multi-value", "dirty");
        registerDirtyInput(input);
      } else {
        input.removeAttribute("data-multi-value");
        if (!input.value.trim()) unregisterDirtyInput(input);
      }
    }
  };

  return (
    <>
      {label && (
        <FormLabel>
          {label}
          {mandatory && <span style={{ color: "red" }}> *</span>}
        </FormLabel>
      )}

      <Autocomplete
        multiple
        disableCloseOnSelect
        options={options}
        value={options.filter((opt) => value.includes(opt.value))}
        getOptionLabel={(option) => option.heading || option.label || ""}
        onChange={(e, newValue) => {
          handleInputRegistration(e, !!(newValue && newValue.length > 0));
          onChange({
            target: { name, value: newValue.map((opt) => opt.value) },
          });
        }}
        onInputChange={(e, newInputValue, reason) => {
          if (reason === "input") {
            const isDirty = !!newInputValue.trim() || value.length > 0;
            // Only need to register if typing makes it dirty, we don't unset here to avoid losing chip state
            if (isDirty) {
              const input = e.target.tagName === 'INPUT'
                ? e.target
                : e.target.closest && e.target.closest('.MuiAutocomplete-root')?.querySelector('input');
              if (input) registerDirtyInput(input);
            }
          } else if (reason === "clear") {
            handleInputRegistration(e, false);
          }
        }}
        renderValue={
          renderValue
            ? renderValue
            : (selected, getItemProps) =>
              selected.map((opt, index) => (
                <Chip
                  {...getItemProps({ index })}
                  key={opt.value}
                  label={
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      {opt.avatar && (
                        <Avatar
                          sx={{
                            bgcolor: "#dbe0ff",
                            width: 20,
                            height: 20,
                          }}
                        >
                          {typeof opt.avatar === "string" ? (
                            <img
                              src={opt.avatar}
                              alt={opt.heading || opt.label}
                              style={{ width: "100%", height: "100%" }}
                            />
                          ) : (
                            opt.avatar
                          )}
                        </Avatar>
                      )}
                      <Typography variant="body2">
                        {opt.heading || opt.label}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    borderRadius: "6px",
                    border: "1px solid #D1D1D1",
                    "& .MuiChip-deleteIcon": {
                      color: "#666",
                    },
                  }}
                />
              ))
        }
        renderOption={(props, opt) => (
          <MenuItem
            {...props}
            key={opt.value}
            sx={{
              // force custom hover
              "&.MuiMenuItem-root:hover": {
                backgroundColor: "#e5e5e5 !important",
              },
              // if you also want selected state custom
              "&.Mui-selected": {
                backgroundColor: "#e0e0e0 !important",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {opt.avatar && (
                <Avatar sx={{ bgcolor: "#dbe0ff", width: 28, height: 28 }}>
                  {typeof opt.avatar === "string" ? (
                    <img
                      src={opt.avatar}
                      alt={opt.heading || opt.label}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    opt.avatar
                  )}
                </Avatar>
              )}
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {opt.heading || opt.label}
                </Typography>
                {opt.description && (
                  <Typography variant="subtitle2" color="text.secondary">
                    {opt.description}
                  </Typography>
                )}
              </Box>
            </Box>
          </MenuItem>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            placeholder={value?.length ? "" : placeholder}
            helperText={helperText}
            sx={{
              width,
              mt,
              mb,
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
                height: height,
                "& fieldset": { border: "1px solid #D1D1D1" },
                "& .MuiAutocomplete-endAdornment": { color: iconColor },
              },
              ...sx,
            }}
          />
        )}
      />
    </>
  );
};

export default CommonMultiSelect;
