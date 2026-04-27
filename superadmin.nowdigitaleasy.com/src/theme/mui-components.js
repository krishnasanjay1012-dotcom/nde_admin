export const components = {
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        backgroundColor: theme.palette.primary.light,
        color: "#fff",
        fontSize: "12px",
        padding: "6px 10px",
        borderRadius: "6px",
        boxShadow: theme.shadows[2],
      }),
      arrow: ({ theme }) => ({
        color: theme.palette.primary.light,
      }),
    },
    defaultProps: {
      arrow: true,
      placement: "top",
    },
  },
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      "::selection": {
        backgroundColor: theme.palette.primary.main,
        color: "#fff",
      },
      "::-moz-selection": {
        backgroundColor: theme.palette.primary.main,
        color: "#fff",
      },

      'img[src*=".svg"]': {
        filter:
          theme.palette.mode === "dark" ? "invert(1) brightness(1.5)" : "none",
        transition: "filter 0.3s ease",
      },

      'img[src*="edit"]': {
        filter:
          theme.palette.mode === "dark"
            ? "invert(65%) sepia(50%) saturate(500%) hue-rotate(80deg) brightness(1.2)"
            : "none",
      },

      'img[src*="delete"]': {
        filter:
          theme.palette.mode === "dark"
            ? "invert(40%) sepia(80%) saturate(1000%) hue-rotate(340deg) brightness(1.2)"
            : "none",
      },

      'img[src*="logo"], img[src*="banner"]': {
        filter: "none !important",
      },
    }),
  },
  MuiTextField: {
    defaultProps: {
      autoComplete: "new-password",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        "& .MuiOutlinedInput-root": {
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          "&.Mui-focused": {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 8px ${theme.palette.primary.main}4D`,
          },
          "&:active": {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 8px ${theme.palette.primary.main}4D`,
          },
        },
      }),
    },
  },
  MuiSkeleton: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.grey
            : theme.palette.primary.extraLight,
      }),
    },
  },

  MuiInputBase: {
    defaultProps: {
      autoComplete: "new-password",
    },
  },
  MuiOutlinedInput: {
    defaultProps: {
      autoComplete: "new-password",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
        "&.Mui-focused": {
          boxShadow: `0 0 8px ${theme.palette.primary.main}4D`,
        },
        "&:active .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
        "&:active": {
          boxShadow: `0 0 8px ${theme.palette.primary.main}4D`,
        },
      }),
    },
  },
  MuiAutocomplete: {
    defaultProps: {
      autoComplete: "new-password",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        "& .MuiOutlinedInput-root": {
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          "&.Mui-focused": {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 8px ${theme.palette.primary.main}4D`,
          },
          "&:active": {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 8px ${theme.palette.primary.main}4D`,
          },
        },
      }),
      paper: ({ theme }) => ({
        borderRadius: "6px",
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[3],
        marginTop: "4px",
        backgroundColor: theme.palette.background.paper,
      }),
      option: ({ theme }) => ({
        fontSize: "14px",
        color: theme.palette.text.primary,
        padding: "8px 16px",
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.action.hover
              : theme.palette.primary.extraLight,
        },
        '&[aria-selected="true"]': {
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.action.selected
              : theme.palette.primary.extraLight,
          fontWeight: 500,
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.action.selected
                : theme.palette.primary.extraLight,
          },
        },
      }),
      listbox: {
        padding: "4px 0",
      },
      popper: {
        zIndex: 1300,
      },
    },
  },
  MuiSvgIcon: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.icon?.main || theme.palette.text.secondary,
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "12px",
        backgroundColor: theme.palette.background.paper,
      }),
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: "6px",
        boxShadow: theme.shadows[3],
        border: `1px solid ${theme.palette.divider}`,
        marginTop: "4px",
        padding: "4px 0",
        backgroundColor: theme.palette.background.paper,
      }),
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: "14px",
        color: theme.palette.text.primary,
        padding: "8px 16px",
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.action.hover
              : theme.palette.primary.extraLight,
        },
        "&.Mui-selected": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.action.selected
              : theme.palette.primary.extraLight,
          fontWeight: 500,
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.action.selected
                : theme.palette.primary.extraLight,
          },
        },
      }),
    },
  },
};
