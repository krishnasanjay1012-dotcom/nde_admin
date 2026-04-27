import { useState, useRef } from "react";
import {
  TextField,
  FormLabel,
  InputAdornment,
  IconButton,
  Box,
  Popper,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import PasswordChecklist from "react-password-checklist";

const CommonTextField = ({
  label,
  value,
  onChange,
  name,
  placeholder,
  startAdornment,
  endAdornment,
  onEndAdornmentClick,
  error,
  width = "100%",
  height = 40,
  helperText,
  sx,
  mandatory = false,
  mt = 1,
  mb = 2,
  disabled = false,
  autoFocus = false,
  showPasswordChecklist = false,
  noLabel = false,
  maxLength = 50,
  type,
  ...rest
}) => {
  const [openChecklist, setOpenChecklist] = useState(false);
  const anchorRef = useRef(null);

  const handleClickAway = (event) => {
    // prevent closing if the click is inside the TextField
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpenChecklist(false);
  };

  return (
    <Box sx={{ width }}>
      {/* Label */}
      {!noLabel && (
        <FormLabel>
          {label}
          {mandatory && <span style={{ color: "red" }}> *</span>}
        </FormLabel>
      )}

      {/* TextField */}
      <TextField
        fullWidth
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        autoComplete="off"
        disabled={disabled}
        autoFocus={autoFocus}
        inputRef={anchorRef}
        onFocus={() => showPasswordChecklist && setOpenChecklist(true)}
        sx={{
          width,
          mt,
          mb,
          ...(noLabel
            ? {
                "&& input": {
                  p: 0,
                },
                "&& .MuiOutlinedInput-root": {
                  height,
                  p: 0,
                  transition: "none",
                  "& fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused": {
                    borderColor: "none",
                    boxShadow: "none",
                  },
                  "&:active": {
                    borderColor: "none",
                    boxShadow: "none",
                  },
                },
              }
            : {
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                  "& fieldset": { border: "1px solid #D1D1D1" },
                  height: height,
                  "&.Mui-disabled": {
                    backgroundColor: "#f9f9fb",
                  },
                  "&.Mui-disabled fieldset": {
                    borderColor: "#D1D1DB",
                  },
                },
              }),
          "& input[type=number]": {
            "-moz-appearance": "textfield",
            "-webkit-appearance": "none",
            appearance: "none",
          },
          "& input[type=number]::-webkit-inner-spin-button": {
            display: "none",
          },
          "& input[type=number]::-webkit-outer-spin-button": {
            display: "none",
          },
          ...sx,
        }}
        inputProps={{
          ...(rest.inputProps || {}),

          maxLength: maxLength,
        }}
        InputProps={{
          ...(startAdornment && {
            startAdornment: (
              <InputAdornment position="start">{startAdornment}</InputAdornment>
            ),
          }),
          ...(endAdornment && {
            endAdornment: (
              <InputAdornment position="end">
                {onEndAdornmentClick ? (
                  <IconButton
                    onClick={() => onEndAdornmentClick(value)}
                    edge="end"
                    size="small"
                  >
                    {endAdornment}
                  </IconButton>
                ) : (
                  endAdornment
                )}
              </InputAdornment>
            ),
          }),
        }}
        {...rest}
      />

      {showPasswordChecklist && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Popper
            open={openChecklist}
            anchorEl={anchorRef.current}
            placement="bottom-start"
            disablePortal={false}
            style={{ zIndex: 1300 }}
          >
            <Paper elevation={3} sx={{ p: 1, mt: 0.1 }}>
              <PasswordChecklist
                rules={[
                  "minLength",
                  "number",
                  "capital",
                  "lowercase",
                  "specialChar",
                ]}
                minLength={8}
                value={value || ""}
                // onChange={(isValid) =>
                //   console.log("Password valid:", isValid)
                // }
                iconSize={12}
                className="password-checklist"
              />
            </Paper>
          </Popper>
        </ClickAwayListener>
      )}
    </Box>
  );
};

export default CommonTextField;
