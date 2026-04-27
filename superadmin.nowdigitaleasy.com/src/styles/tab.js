export const tabsSx = {
  "& .MuiTabs-flexContainer": {
    flexWrap: "nowrap",
  },
  "& .MuiTab-root": {
    textTransform: "none",
    color: "grey.6",
    fontWeight: 400,
    whiteSpace: "nowrap",
    minWidth: 0,
    paddingRight: 1,

    "&.Mui-selected": {
      color: "primary.main", fontWeight: 500,
    },
  },

  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: "primary.main",
    borderRadius: "3px",
    ml: 1,
  },
}