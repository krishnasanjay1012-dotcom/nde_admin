import { useState, useEffect, useMemo } from "react";
import {
  TextField,
  Box,
  FormLabel,
  Select,
  MenuItem,
  InputAdornment,
  InputBase,
  Paper,
  ListSubheader,
} from "@mui/material";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

const PhoneNumberField = ({
  mandatory = false,
  label,
  value = { code: "IN", number: "" },
  onChange,
  placeholder = "Enter mobile number",
  error = false,
  helperText = "",
  name = "phone_number",
  disabled = false,
  width = "100%",
  sx,
  initialCode = "IN",
  mb = 2,
  mt = 1,
  ...rest
}) => {
  const countryOptions = useMemo(() => {
    return getCountries().map((code) => ({
      value: code,
      name: new Intl.DisplayNames(["en"], { type: "region" }).of(code),
      callingCode: `+${getCountryCallingCode(code)}`,
    }));
  }, []);

  const [selectedCountry, setSelectedCountry] = useState(
    countryOptions.find((c) => c.value === initialCode)
  );
  const [numberValue, setNumberValue] = useState(value.number || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!value) return;

    setNumberValue(value.number || "");

    const found = countryOptions.find(
      (c) => c.value === value.code || c.callingCode === value.code
    );
    if (found) setSelectedCountry(found);
  }, [value, countryOptions]);

  const handleNumberChange = (e) => {
    const onlyNums = e.target.value.replace(/\D/g, "");
    setNumberValue(onlyNums);
    onChange?.({ code: selectedCountry.callingCode, number: onlyNums });
  };

  const handleCountryChange = (event) => {
    const countryCode = event.target.value;
    const newCountry = countryOptions.find((c) => c.value === countryCode);
    setSelectedCountry(newCountry);
    setNumberValue("");
    onChange?.({ code: newCountry.callingCode, number: "" });
    setOpen(false); // close dropdown after selection
    setSearchTerm(""); // clear search
  };

  // Filter countries based on search term
  const filteredCountries = useMemo(() => {
    return countryOptions.filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.callingCode.includes(searchTerm)
    );
  }, [countryOptions, searchTerm]);

  return (
    <Box width={width}>
      {label && (
        <FormLabel sx={{ mb: 0.5, display: "block" }}>
          {label}
          {mandatory && <span style={{ color: "red" }}> *</span>}
        </FormLabel>
      )}

      <Box display="flex">
        {/* Country Select with Searchable Dropdown */}
        <Select
          value={selectedCountry?.value || ""}
          onChange={handleCountryChange}
          disabled={disabled}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => {
            setOpen(false);
            setSearchTerm("");
          }}
          displayEmpty
          renderValue={(value) => {
            const country = countryOptions.find((c) => c.value === value);
            return (
              <Box display="flex" alignItems="center" gap={1}>
                <img
                  src={`https://flagcdn.com/w20/${country?.value.toLowerCase()}.png`}
                  width={18}
                  height={14}
                  style={{ borderRadius: 2 }}
                  alt={country?.value}
                />
                <span>{country?.callingCode}</span>
              </Box>
            );
          }}
          sx={{
            width: 100,
            height: 40,
            mt,
            borderRadius: "6px 0 0 6px",
            "& .MuiOutlinedInput-root": {
              height: 40,
              borderRadius: "6px 0 0 6px",
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 200 },
            },
            anchorOrigin: { vertical: "bottom", horizontal: "left" },
            transformOrigin: { vertical: "top", horizontal: "left" },
          }}
        >
          <ListSubheader
            sx={{
              bgcolor: "background.paper",
              position: "sticky",
              top: -4,
              zIndex: 1,
              mt:-1,
            }}
          >
            <Paper elevation={0}>
              <InputBase
                placeholder="Search country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                autoFocus
                sx={{ px: 1, py: 0.5, border: "1px solid #ccc", borderRadius: 1 }}
                onClick={(e) => e.stopPropagation()}
              />
            </Paper>
          </ListSubheader>

          {filteredCountries.map((country) => (
            <MenuItem key={country.value} value={country.value} sx={{}}>
              <Box display="flex" alignItems="center" gap={1}>
                <img
                  src={`https://flagcdn.com/w20/${country.value.toLowerCase()}.png`}
                  width={20}
                  height={14}
                  style={{ borderRadius: 2 }}
                  alt={country.value}
                />
                <span>{country.callingCode}</span> – {country.name}
              </Box>
            </MenuItem>
          ))}

          {filteredCountries.length === 0 && (
            <MenuItem disabled>No countries found</MenuItem>
          )}
        </Select>

        {/* Phone number input */}
        <TextField
          {...rest}
          name={name}
          placeholder={placeholder}
          fullWidth
          size="small"
          disabled={disabled}
          value={numberValue}
          onChange={handleNumberChange}
          error={error}
          helperText={helperText}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          sx={{
            mt,
            "& .MuiOutlinedInput-root": {
              height: 40,
              borderRadius: "0 6px 6px 0",
            },
            mb,
            ...sx,
          }}
        />
      </Box>
    </Box>
  );
};

export default PhoneNumberField;