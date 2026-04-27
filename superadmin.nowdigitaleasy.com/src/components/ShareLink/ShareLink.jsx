import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Stack,
  Select,
  Button,
  TextField,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import dayjs from "dayjs";

import CommonDrawer from "../common/NDE-Drawer";
import { CommonDatePicker } from "../common/fields";
import { useGenerateInvoiceLink } from "../../hooks/sales/invoice-hooks";

const ShareLink = ({ open, onClose, title, id }) => {
  const getDefaultDate = () => dayjs().add(90, "day");

  const [visibility, setVisibility] = useState("public");
  const [expiryDate, setExpiryDate] = useState(getDefaultDate());
  const [generatedLink, setGeneratedLink] = useState("");

  useEffect(() => {
    if (open) {
      setExpiryDate(getDefaultDate());
      setGeneratedLink(""); // Reset link when drawer opens
    }
  }, [open]);

  const { mutate: generateInvoiceLink, isLoading } = useGenerateInvoiceLink();

  const handleGenerateLink = () => {
    if (!id) return;
    const payload = {
      id,
      linkType: visibility,
      expireDate: dayjs(expiryDate).format("YYYY-MM-DD"),
      transactionType: "invoice",
    };

    generateInvoiceLink(payload, {
      onSuccess: (res) => {
        // Assuming your API returns the full link in res.data.link
        setGeneratedLink(res.data?.link || "");
      },
    });
  };

  return (
    <CommonDrawer
      open={open}
      onClose={onClose}
      title={title || "Share Link"}
      anchor="top"
      actions={[
        {
          label: generatedLink ? "Copy Link" : "Generate Link",
          onClick: () => {
            if (generatedLink) {
              navigator.clipboard.writeText(generatedLink);
              onClose();
            } else {
              handleGenerateLink();
            }
          },
          disabled: isLoading,
        },
      ]}
    >
      <Box>
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <Typography sx={{ fontWeight: 500 }}>Visibility:</Typography>
          <Select
            size="small"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            variant="standard"
            disableUnderline
            disabled
            sx={{
              color: "error.main",
              "& .MuiSelect-icon": { color: "error.main" },
              "&:before, &:after": { display: "none" },
            }}
          >
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="private">Private</MenuItem>
          </Select>
        </Stack>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 3, lineHeight: 1.6 }}
        >
          Select an expiration date and generate the link to share it with your
          customer. Anyone with access to this link can view, print, or download it.
        </Typography>

        <Typography sx={{ color: "error.main", fontWeight: 400 }}>
          Link Expiration Date*
        </Typography>

        <CommonDatePicker
          value={expiryDate}
          onChange={(date) => setExpiryDate(date)}
          disablePast
          fullWidth
          format="DD/MM/YYYY"
          slotProps={{ textField: { placeholder: "DD/MM/YYYY" } }}
          sx={{ mb: 2 }}
        />

        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <InfoOutlinedIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            By default, the link is set to expire 90 days from today.
          </Typography>
        </Stack>

        {generatedLink && (
          <Box
            sx={{
              mt: 2,
              bgcolor: "blue.50",
              p: 1,
              borderRadius: 1,
              maxWidth: 800,
              wordBreak: "break-all"
            }}
          >
            <Typography fontSize={12}>
              {generatedLink}
            </Typography>
          </Box>
        )}
      </Box>
    </CommonDrawer>
  );
};

export default ShareLink;