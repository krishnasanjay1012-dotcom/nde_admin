import { Radio, FormControlLabel } from "@mui/material";

const CommonRadioButton = ({
  label,
  checked,
  onChange,
  value,
  name,
  disabled = false,
  size = "small",
  checkedColor = "#2330E7",
  defaultColor = "#D1D1D1",
  sx = {},
}) => {
  return (
    <FormControlLabel
      label={label}
      disabled={disabled}
      sx={{
        m: 0,
        "& .MuiFormControlLabel-label": {
          fontSize: 14,
          color: disabled ? "#A0A0A0" : "#1A1A1A",
        },
        ...sx,
      }}
      control={
        <Radio
          size={size}
          disableRipple
          checked={checked}
          onChange={onChange}
          value={value}
          name={name}
          sx={{
            p: 0.5,
            color: defaultColor,
            "& .MuiSvgIcon-root": {
              color: defaultColor,
            },
            "&.Mui-checked": {
              color: checkedColor,
              "& .MuiSvgIcon-root": {
                color: checkedColor,
              },
            },
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        />
      }
    />
  );
};

export default CommonRadioButton;
