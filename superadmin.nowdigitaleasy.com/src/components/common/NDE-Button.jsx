import { Button, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FlowerLoader from "./NDE-loader";

const CommonButton = ({
  label,
  onClick,
  variant = "contained",
  color = "primary",
  startIcon = <AddIcon sx={{ color: "icon.light" }} />,
  disabled = false,
  loading = false,
  fullWidth = false,
  hoverColor,
  sx = {},
  size = "medium",
  ...props
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      startIcon={!loading ? startIcon : null}
      onClick={onClick}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      size={size}
      type="submit"
      sx={{
        borderRadius: 1.4,
        textTransform: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        "&:hover": {
          backgroundColor: hoverColor,
        },
        "&.Mui-disabled": {
          backgroundColor: "primary.border",
          color: "primary.contrastText",
        },
        ...sx,
      }}
      {...props}
    >
      {loading ? (
        <FlowerLoader size={18} color="inherit" />
      ) : (
        label
      )}
    </Button>
  );
};

export default CommonButton;
