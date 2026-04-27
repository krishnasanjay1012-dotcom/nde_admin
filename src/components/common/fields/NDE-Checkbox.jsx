import { Checkbox, FormControlLabel } from "@mui/material";

const CommonCheckbox = ({
  label,
  checked,
  indeterminate,
  onChange,
  name,
  sx,
  disabled,
  height,
  defaultColor = "#D1D1D1",
  mr = -3,
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          disableRipple
          checked={checked}
          indeterminate={indeterminate}
          onChange={onChange}
          name={name}
          disabled={disabled}
          sx={(theme) => {
            const checkedColor = theme.palette.primary.main;

            return {
              backgroundColor: "transparent",

              "&:hover": {
                backgroundColor: "transparent",
              },

              "& .MuiSvgIcon-root": {
                fontSize: 20,
                borderRadius: "6px",
                border: `1.5px solid ${defaultColor}`,
                color: "transparent",
                transition: "all 0.25s ease",
                width: 18,
                height: 18,
              },

              /* Checked */
              "&.Mui-checked .MuiSvgIcon-root": {
                color: checkedColor,
                borderColor: checkedColor,
                boxShadow: `0 0 0 3px ${checkedColor}33`,
              },

              /* Indeterminate */
              "&.MuiCheckbox-indeterminate .MuiSvgIcon-root": {
                color: checkedColor,
                borderColor: checkedColor,
                boxShadow: `0 0 0 3px ${checkedColor}33`,
              },

              /* Hover glow only */
              "&:hover .MuiSvgIcon-root": {
                boxShadow: `0 0 0 3px ${checkedColor}22`,
              },

              /* Disabled */
              "&.Mui-disabled .MuiSvgIcon-root": {
                borderColor: "#E0E0E0",
                boxShadow: "none",
              },
            };
          }}
        />
      }
      label={label}
      sx={{
        ...(height && { height }),
        mr,
        ...sx,
      }}
    />
  );
};

export default CommonCheckbox;