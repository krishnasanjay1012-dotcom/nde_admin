import { TextField, FormLabel } from "@mui/material";

const CommonDescriptionField = ({
  label,
  value,
  onChange,
  name,
  placeholder,
  error,
  helperText,
  width = "100%",
  paddingTop,
  mandatory,
  mt = 1,
  height,
  rows = 4,
  mb = 2,
  sx = {},
  maxLength = 300,
}) => {
  return (
    <>
      <FormLabel>
        {label}
        {mandatory && <span style={{ color: "red" }}> *</span>}
      </FormLabel>

      <TextField
        multiline
        rows={rows}
        fullWidth
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        sx={{
          width: width,
          mb: mb,
          mt: mt,
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height: height,
            paddingTop: paddingTop,
            "& fieldset": {
              border: "1px solid #D1D1D1",
            },
          },
          "& textarea": {
            resize: "vertical",
            minHeight: "20px",
          },
          ...sx,
        }}
        inputProps={{
          maxLength: maxLength,
        }}
      />
    </>
  );
};

export default CommonDescriptionField;
