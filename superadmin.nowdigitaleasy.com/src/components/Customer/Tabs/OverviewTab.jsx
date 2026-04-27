import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useState } from "react";
import MoveCustomer from "../../auth/Associate-User";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import CustomerReceivables from "../Customer-Receivables";


export default function CustomerOverviewHeader({ customer, userId }) {
  const isMobile = useMediaQuery("(max-width:900px)");
  const navigate = useNavigate();
  const theme = useTheme();

  const [openMoveDialog, setOpenMoveDialog] = useState(false);

  const handleAssociateClick = () => {
    setOpenMoveDialog(true);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 3,
          // p: 0.5,
        }}
      >
        {/* LEFT */}
        <Box sx={{ flex: 1, position: "relative" }}>
          <InfoRow icon={<PersonOutlineIcon />} text={`${customer?.first_name || ""} ${customer?.last_name || ""}`} />
          <InfoRow icon={<CorporateFareIcon />} text={customer?.workspace?.workspace_name || "-"} />
          <InfoRow icon={<EmailOutlinedIcon />} text={customer?.email || "-"} />
          <InfoRow
            icon={<CallOutlinedIcon />}
            text={
              customer?.phone_number
                ? `${customer.phone_number_code || ""} ${customer.phone_number}`
                : "-"
            }
          />
          <InfoRow
            icon={<LocationOnOutlinedIcon />}
            text={
              customer?.billing_address_details
                ? `${customer.billing_address_details?.address || ""}, ${customer.billing_address_details?.city || ""}, ${customer.billing_address_details?.state || ""}, ${customer.billing_address_details?.country || ""} ${customer.billing_address_details?.pincode || ""}`
                : customer?.address
                  ? `${customer.address || ""}, ${customer.city || ""}, ${customer.state || ""}, ${customer.country || ""} ${customer.pincode || ""}`
                  : "No address"
            }
          />
          <InfoRow
            icon={
              <AdminPanelSettingsOutlinedIcon sx={{ color: "#7C3AED" }} />
            }
            text={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <span>
                  {`Associated With ${customer?.adminId?.name ||
                    customer?.adminId?.username ||
                    "-"
                    } • ${customer?.adminId?.role || "Super Admin"}`}
                </span>

                <Tooltip title="Change association">
                  <IconButton
                    size="small"
                    onClick={handleAssociateClick}
                    sx={{ p: 0.25 }}
                  >
                    <EditOutlinedIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </Box>
            }
            textProps={{
              sx: {
                fontWeight: 600,
                color: "#7C3AED",
              },
            }}
          />
        </Box>

        <Box
          sx={{
            minWidth: 260,
            border: `1px dashed ${theme.palette.primary.main}80`,
            borderRadius: 1.5,
            p: 1.5,
            height: "fit-content",
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "primary.main", mb: 1 }}>
            Quick Links
          </Typography>

          <Divider sx={{ mb: 1 }} />

          <List dense disablePadding>
            <QuickLink
              icon={<DescriptionOutlinedIcon />}
              label="Create Invoice"
              onClick={() =>
                navigate(`/sales/invoices/new-invoice?userId=${userId}`)
              }
            />

            <QuickLink
              icon={<PaymentsOutlinedIcon />}
              label="Add Payment"
              onClick={() =>
                navigate(`/sales/payments/add-payment?userId=${userId}`)
              }
            />

            <QuickLink
              icon={<ShoppingCartOutlinedIcon />}
              label="View Orders"
              onClick={() =>
                navigate(`/sales/orders?userId=${userId}`)
              }
            />

            <QuickLink
              icon={<PersonOutlineIcon />}
              label="View Outstanding"
              onClick={() =>
                navigate(`/sales/outstanding?userId=${userId}`)
              }
            />

            <QuickLink
              icon={<AccountBalanceWalletOutlinedIcon />}
              label="Wallet Balance"
              onClick={() =>
                navigate(`/sales/wallet?userId=${userId}`)
              }
            />
          </List>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <CustomerReceivables
        workspaceId={customer?.workspace?._id}
      />


      <MoveCustomer
        openMoveDialog={openMoveDialog}
        setOpenMoveDialog={setOpenMoveDialog}
        selectedIds={customer?.workspace?._id}
        adminId={customer?.adminId?._id}
      />
    </>
  );
}


const InfoRow = ({ icon, text }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
    <Box sx={{ color: "#5A5A7A", height: 24, width: 24 }}>{icon}</Box>
    <Typography
      title={text}
      sx={{
        fontSize: 13,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: 300,
      }}>{text}</Typography>
  </Box>
);

const QuickLink = ({ icon, label, onClick }) => (
  <ListItem
    disableGutters
    onClick={onClick}
    sx={{
      py: 0.5,
      cursor: "pointer",
      "&:hover": { backgroundColor: "rgba(35,48,231,0.04)" },
    }}
  >
    <ListItemIcon sx={{ minWidth: 32 }}>{icon}</ListItemIcon>
    <ListItemText primary={label} primaryTypographyProps={{ fontSize: 13, color: "primary.main" }} />
  </ListItem>
);
