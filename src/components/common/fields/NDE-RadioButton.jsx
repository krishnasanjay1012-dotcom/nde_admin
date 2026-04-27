import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import { FormLabel } from "@mui/material";

const ReusableRadioGroup = ({
  value,
  onChange,
  label,
  mandatory = false,
  name,
  options = [],
  row = true,
  defaultColor = "#D1D1D1",
  sxLabel = {},
  mt = 1,
  mb = 1,
  ...rest
}) => {
  return (
    <>
      <FormLabel>
        {label}
        {mandatory && <span style={{ color: "red" }}> *</span>}
      </FormLabel>
      <RadioGroup
        name={name}
        value={value ?? ""}
        onChange={onChange}
        row={row}
        {...rest}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                size="small"
                sx={{
                  mt,
                  mb,
                  color: defaultColor,
                  "& .MuiSvgIcon-root": { color: defaultColor },
                  "&.Mui-checked": {
                    color: "primary.main",
                    "& .MuiSvgIcon-root": { color: "primary.main" },
                  },
                  "&:hover": { backgroundColor: "transparent" },
                }}
              />
            }
            label={
              <Typography sx={{ fontSize: "14px", ...sxLabel }}>
                {option.label}
              </Typography>
            }
          />
        ))}
      </RadioGroup>
    </>
  );
};

export default ReusableRadioGroup;