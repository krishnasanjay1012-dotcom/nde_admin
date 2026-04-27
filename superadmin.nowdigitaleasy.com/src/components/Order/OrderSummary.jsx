import React from "react";
import {
  Box,
  Card,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import Delete from "../../assets/icons/delete.svg";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { CommonSelect } from "../common/fields";
import CommonButton from "../common/NDE-Button";

export default function OrderSummary({setActiveStep}) {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
        gap: 3,
      }}
    >
      {/* LEFT: Order Items */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Typography fontWeight={600} mb={3}>
          Order Summary
        </Typography>

        <Card
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography fontWeight={600}>
              iaaxin.in <InfoOutlinedIcon sx={{ fontSize: 14 }} />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              .IN Domain Registration
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
             <CommonSelect
              options={[
                { label: "All", value: "All" },
                { label: "Domain", value: "Domain" },
                { label: "Hosting", value: "Hosting" },
                { label: "Google Workspace", value: "Google Workspace" },
              ]}
              mt={0}
              mb={0}
              height={40}
            />

            <Typography fontWeight={600}>₹225.00</Typography>

            <IconButton>
               <img src={Delete} style={{ height: 20 }} />
            </IconButton>
          </Box>
        </Card>

        <CommonButton
          variant="contained"
          label={"Add More Products"}
          sx={{
            mt: 3,
            px: 3,
            borderRadius: 1.5,
            height:36
          }}
          startIcon={false}
          onClick={() => setActiveStep(1)}
       />
          
      </Card>

      {/* RIGHT: Summary */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography fontWeight={600}>Order summary</Typography>
            <Typography variant="body2" color="text.secondary">
              2 items
            </Typography>
          </Box>

          <IconButton size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2">
            Subtotal <InfoOutlinedIcon sx={{ fontSize: 14 }} />
          </Typography>
          <Typography variant="body2">₹ 225.00</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="body2">
            GST <InfoOutlinedIcon sx={{ fontSize: 14 }} />
          </Typography>
          <Typography variant="body2">₹ 270.00</Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontWeight={600}>Total:</Typography>
          <Typography fontWeight={600}>₹ 495.00</Typography>
        </Box>
      </Card>
    </Box>
  );
}
