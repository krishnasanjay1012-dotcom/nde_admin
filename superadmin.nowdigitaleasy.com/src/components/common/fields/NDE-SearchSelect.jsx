import { useState, useRef } from "react";
import {
  TextField,
  Box,
  Popper,
  Paper,
  ClickAwayListener,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";

const CustomSearchableSelect = ({
  value,
  onChange,
  options = [],
  error,
  helperText,
  placeholder = "Select",
  onBottomButtonClick,
  Icon,
  width = "100%",
  buttonLabel,
  valueKey = "value",
  labelKey = "label",
  mb = 2,
  mt = 1,
  height = 40,
  setNavigateType,
}) => {
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedLabel =
    options.find((opt) => opt?.[valueKey] === value)?.[labelKey] || "";

  const filteredOptions = options.filter((opt) =>
    opt?.[labelKey]?.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <Box ref={wrapperRef} sx={{ width: "100%" }}>
      <TextField
        fullWidth
        inputRef={inputRef}
        value={selectedLabel}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        onClick={() => setOpen(true)}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{ display: "flex", alignItems: "center" }}
            >
              {value && (
                <CloseIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                    setSearch("");
                  }}
                  fontSize="small"
                  sx={{ cursor: "pointer", mr: 0.5 }}
                />
              )}
              <KeyboardArrowDownIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          mt,
          mb,
          "& .MuiOutlinedInput-root": {
            height: height,
            width,
            borderRadius: "6px",
            fontSize: 14,
            "& fieldset": {
              border: "1px solid #D1D1D1",
            },
            "&:hover fieldset": {
              borderColor: "#4285f4",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#4285f4",
              borderWidth: 1,
            },
          },
        }}
      />

      <Popper
        open={open}
        anchorEl={inputRef.current}
        placement="bottom-start"
        style={{
          zIndex: 1300,
          width: wrapperRef.current?.clientWidth,
        }}
      >
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Paper elevation={3} sx={{ mt: 0.5, borderRadius: "6px" }}>
            <Box p={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 36,
                    fontSize: 14,
                    borderRadius: "6px",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Options */}
            <List dense sx={{ maxHeight: 220, overflowY: "auto" }}>
              {filteredOptions.map((opt) => {
                const selected = value === opt?.[valueKey];

                return (
                  <ListItemButton
                    key={opt?.[valueKey]}
                    onClick={() => {
                      onChange(opt?.[valueKey]);
                      setOpen(false);
                      setSearch("");
                    }}
                    sx={{
                      mx: 1,
                      my: 0.5,
                      borderRadius: "6px",
                      fontSize: 16,
                      backgroundColor: selected ? "#DADCFB" : "transparent",
                      color: selected ? "#fff" : "#000",
                      "&:hover": {
                        backgroundColor: "primary.light",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        opt?.rate != null
                          ? `${opt?.[labelKey]}-${opt?.rate}%`
                          : `${opt?.[labelKey]}`
                      }
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: selected ? 500 : 400,
                        lineHeight: "20px",
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>

            <Divider />
            <Box
              onClick={() => {
                setOpen(false);
                onBottomButtonClick?.();
                setNavigateType(buttonLabel);
              }}
              sx={{
                px: 1.5,
                py: 1.2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                color: "#4285f4",
                fontSize: 14,
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "#F4F7FE",
                },
              }}
            >
              {Icon}
              <Typography fontSize={14}>{buttonLabel}</Typography>
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default CustomSearchableSelect;
