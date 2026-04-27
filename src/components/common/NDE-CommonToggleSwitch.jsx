import React from "react";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import styled from "@emotion/styled";

const AntSwitch = styled(Switch)(() => ({
  width: 40,
  height: 20,
  padding: 0,
  display: "flex",

  "& .MuiSwitch-switchBase": {
    padding: 2,

    "&.Mui-checked": {
      transform: "translateX(18px)",
      color: "#ffffff",

      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#3CB043",
      },
    },
  },

  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 16,
    height: 15,
    borderRadius: 10,
    transition: "width 200ms",
  },

  "& .MuiSwitch-track": {
    borderRadius: 12,
    opacity: 1,
    backgroundColor: "#9CD3BF",
    boxSizing: "border-box",
  },
}));

const CommonToggleSwitch = ({
  checked = false,
  onChange,
  disabled = false,
  label = "",
}) => {

  
  return (
    <FormControlLabel
      control={
        <AntSwitch
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
      }
      label={label}
    />
  );
};

export default CommonToggleSwitch;
