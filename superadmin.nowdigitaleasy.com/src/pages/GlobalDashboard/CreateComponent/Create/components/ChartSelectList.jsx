import { Box, Typography } from "@mui/material";
import { CHARTS } from "./data/configureData";

const RenderBox = (child, text, onClick) => (
  <Box
    onClick={onClick}
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 1,
      alignItems: "center",
      cursor: onClick ? "pointer" : "default",
    }}
  >
    {child}
    <Typography
      sx={(theme) => ({
        fontSize: "0.9rem",
        fontWeight: 450,
        color: theme.palette.text.secondary,
      })}
    >
      {text}
    </Typography>
  </Box>
);

export default function ChartSelectList({ setComponentCreateData }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        borderRadius: 2,

        bgcolor: "background.default",
        height: "100%",
        overflowY: "auto",
        flexWrap: "wrap",
        alignContent: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      {CHARTS.map((item) => {
        const Component = item.component;

        return RenderBox(
          <Component key={item.key} {...item?.props} />,
          item?.props?.data?.metric?.label,
          () =>
            setComponentCreateData({
              key: item.key,
              name: "",
              module: "",
            }),
        );
      })}
    </Box>
  );
}
