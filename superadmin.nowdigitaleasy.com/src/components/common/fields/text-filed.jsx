import { TextField, FormLabel } from "@mui/material";

const CommonTextField = ({ label, ...rest }) => {
  return (
    <>
     {label ? <FormLabel>{label}</FormLabel>:null} 
      <TextField
        fullWidth
        sx={{
          width: "100%",
          mt: 1,
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            "& fieldset": { border: "1px solid #D1D1D1" },
          },
        }}
        {...rest}
      />
    </>
  );
};

export default CommonTextField;
