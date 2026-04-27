import { Box, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

const CustomerNameHeader = ({
  selectedCustomer = {},
  title = "",
  customer_name = "",
}) => {
  const navigate = useNavigate();
  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const customerName =
    customer_name ||
    `${capitalize(selectedCustomer?.contact?.first_name || "")} ${capitalize(
      selectedCustomer?.contact?.last_name || "",
    )}`.trim() ||
    "Customer";


  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        mb: -3,
        mt:-1
      }}
    >
      <Typography
        noWrap
        title={customerName}
        variant="h4"
        sx={{
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          
        }}
      >
        {title} {customerName}
      </Typography>
      <Box>
        <IconButton  onClick={() => navigate("/sales/invoices")} color="error">
          <CloseIcon  sx={{ color: "error.main" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CustomerNameHeader;
