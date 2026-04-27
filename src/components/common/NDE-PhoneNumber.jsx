import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

const PhoneNumberField = ({
  name,
  countryCodeName,
  placeholder,
  control,
  errors,
  options,
  textFieldSx = {},
  disabled = false,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          {...rest}
          placeholder={placeholder}
          fullWidth
          autoComplete="off"
          size="small"
          disabled={disabled}
          error={!!errors?.[name]}
          variant="outlined"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          sx={{
            ...textFieldSx,
            "& .MuiOutlinedInput-root": {
              paddingLeft: 0,
              "& .MuiSelect-icon": { color: "#8A8AA3" },
            }
          }}
          onChange={(e) => {
            const onlyNums = e.target.value.replace(/\D/g, "");
            field.onChange(onlyNums);
          }}
          InputProps={{
            startAdornment: (
              <Controller
                name={countryCodeName}
                control={control}
                render={({ field }) => {
                  const selected = options.find((opt) => opt.value === field.value);
                  return (

                    <TextField
                      select
                      disabled={disabled}
                      {...field}
                      size="small"
                      fullWidth
                      variant="outlined"
                      sx={{
                        flex: "1 0 20%",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { border: "none" },
                          "&:hover fieldset": { border: "none" },
                          "&.Mui-focused fieldset": { border: "none" }
                        }
                      }}
                      SelectProps={{
                        renderValue: () =>
                          selected ? (
                            <Box display="flex" alignItems="center">
                              <img
                                src={`https://flagcdn.com/w40/${selected.value.toLowerCase()}.png`}
                                width={20}
                                height={16}
                                style={{ borderRadius: 2, objectFit: "cover" }}
                                alt=""
                              />
                              <span>{selected.phonecode}</span>
                            </Box>
                          ) : null
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: { maxHeight: 300, width: 250 }
                        }
                      }}
                    >
                      {options.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <img
                              src={`https://flagcdn.com/w40/${opt.value.toLowerCase()}.png`}
                              width={24}
                              height={18}
                              style={{ borderRadius: 2, objectFit: "cover" }}
                              alt=""
                            />
                            <span>{opt.labelText}</span>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>

                  );
                }}
              />
            )
          }}
        />
      )}
    />
  );
};

export default PhoneNumberField;
