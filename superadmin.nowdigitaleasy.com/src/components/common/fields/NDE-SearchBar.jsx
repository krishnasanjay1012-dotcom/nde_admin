import React, { useState, useEffect } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SerachIon from "../../../assets/icons/search-icon.svg";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const CommonSearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  sx,
  mb = 1,
  mt = 1,
  height = 40,
  autoFocus = false,
  debounceDelay = 500,
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [internalValue, debounceDelay, onChange, value]);

  const handleClear = () => {
    setInternalValue("");
    onChange("");
    if (onClear) onClear();
  };

  const inputRef = React.useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      const timeout = setTimeout(() => {
        inputRef.current.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [autoFocus]);

  return (
    <TextField
      variant="outlined"
      placeholder={placeholder}
      value={internalValue}
      onChange={(e) => setInternalValue(e.target.value)}
      autoComplete="off"
      fullWidth
      inputRef={inputRef}
      inputProps={{ "data-no-dirty": true }}
      sx={{
        "& .MuiOutlinedInput-root": {
          height,
          mb,
          mt,
          borderRadius: "6px",
          "& fieldset": { border: "1px solid #D1D1D1" },
        },
        ...sx,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <img src={SerachIon} alt="Search Icon" />
          </InputAdornment>
        ),
        endAdornment: internalValue && (
          <InputAdornment position="end">
            <CloseRoundedIcon
              sx={{ fontSize: 20, cursor: "pointer",color:'error.main' }}
              onClick={handleClear}
            />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default CommonSearchBar;
