import { TextField, FormLabel } from "@mui/material";

const CommonSmallTextField = ({ label, value, onChange, name, placeholder, error, helperText, sx,mandatory }) => {
  return (
    <>
      <FormLabel>
        {label}
        {mandatory && <span style={{ color: "red" }}> *</span>}
      </FormLabel>
      <TextField
        size="small"
        fullWidth
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        sx={{
          width: "100%",
          mt: 1,
          mb: 2,
          "& .MuiOutlinedInput-root": {
             borderRadius: "6px",
            "& fieldset": { border: "1px solid #D1D1D1" },
          },
          ...sx,
        }}

      />
    </>
  );
};

export default CommonSmallTextField;
