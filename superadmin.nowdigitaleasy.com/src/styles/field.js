export const selectStyles = {
  height: 41,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "divider",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "primary.main",
  },
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    color: "text.primary",
  },
  "& .MuiSelect-icon": {
    color: "icon.main",
  },
  borderRadius: "6px",
};

export const commonTextFieldSx = {
  width: "100%",
  mt: 1,
  mb: 1,
  "& .MuiOutlinedInput-root": {
    borderRadius: "4px",
    height: 44,
    backgroundColor: "background.paper",
    "& fieldset": {
      borderColor: "divider",
    },
    "&:hover fieldset": {
      borderColor: "primary.light",
    },
    "&.Mui-focused fieldset": {
      borderColor: "primary.main",
      boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}1A`,
    },
    "&.Mui-error fieldset": {
      borderColor: "error.main",
      backgroundColor: (theme) => theme.palette.mode === 'dark' ? "error.extraLight" : "#FFF6F6",
      animation: "shake 0.3s ease-in-out",
    },
    "&.Mui-success fieldset": {
      borderColor: "success.main",
      backgroundColor: (theme) => theme.palette.mode === 'dark' ? "success.extraLight" : "#F1FAF5",
    },
    "&.Mui-disabled": {
      backgroundColor: "action.disabledBackground",
    },
    "&.Mui-disabled fieldset": {
      borderColor: "divider",
    },
  },

  "& .MuiInputLabel-root": {
    color: "text.secondary",
    "&.Mui-focused": {
      color: "primary.main",
    },
    "&.Mui-error": {
      color: "error.main",
    },
  },

  "& .MuiFormHelperText-root": {
    color: "text.secondary",
    "&.Mui-error": {
      color: "error.main",
    },
    "&.Mui-disabled": {
      color: "text.disabled",
    },
  },

  "@keyframes shake": {
    "0%": { transform: "translateX(0)" },
    "20%": { transform: "translateX(-4px)" },
    "40%": { transform: "translateX(4px)" },
    "60%": { transform: "translateX(-4px)" },
    "80%": { transform: "translateX(4px)" },
    "100%": { transform: "translateX(0)" },
  },
};
