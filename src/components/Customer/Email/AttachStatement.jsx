import {
  Box,
  Checkbox,
  Typography,
  IconButton,
  Paper,
  InputAdornment,
} from "@mui/material";
import { useController, useFormContext } from "react-hook-form";
import DOMPurify from "dompurify";
import { useState } from "react";
import dayjs from "dayjs";
import { useGetUnpaidInvoice } from "../../../hooks/Customer/Customer-hooks";
import { CommonTextField } from "../../common/fields";
import PreviewModal from "../../Sales/Invoices/Components/PreviewModal";
// Icons
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

export default function AttachStatement({ customerId, customerName = "SelvaB" }) {
  const { control,  } = useFormContext();

  const { field } = useController({
    name: "send_customer_attachment",
    control,
  });

  const [openPreview, setOpenPreview] = useState(false);
  const handleOpenPreview = () => setOpenPreview(true);
  const handleClosePreview = () => setOpenPreview(false);
  
  const value = field.value || {};

  const { data: unPaidInvoice } = useGetUnpaidInvoice(customerId);
  const safeHTML = DOMPurify.sanitize(unPaidInvoice);

  // Formatting dates for display as per your image (DD/MM/YYYY)
  const startDate = dayjs().startOf("month").format("DD/MM/YYYY");
  const endDate = dayjs().endOf("month").format("DD/MM/YYYY");

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          py: 1.5,
          px: 2,
          borderRadius: 1,
         
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                size="small"
                sx={{ p: 0 }}
                checked={!!value.enabled}
                onChange={(e) =>
                  field.onChange({
                    ...value,
                    enabled: e.target.checked,
                  })
                }
              />
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 400 }}>
                Attach Customer Statement
              </Typography>
            </Box>

            {value.enabled && (
              <Box mt={0.5} ml={3.5}>
                <Typography variant="caption" display="block" color="text.secondary">
                  Date Range: {startDate} - {endDate}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  Filter By: <strong>All</strong>
                </Typography>
              </Box>
            )}
          </Box>

          {value.enabled && (
            <Box sx={{ minWidth: "300px" }}>
              <CommonTextField
                fullWidth
                size="small"
                variant="outlined"
                readOnly
                value={`statement_${customerName}`}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    pr: 0,
                    borderRadius: "8px",

                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PictureAsPdfIcon sx={{ color: "error", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={handleOpenPreview}
                        sx={{ 
                          borderLeft: "1px solid", 
                          borderRadius: 0,
                          px: 1.5 
                        }}
                      >
                        <VisibilityOutlinedIcon sx={{ color: "primary.main", fontSize: 20 }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}
        </Box>

        <PreviewModal open={openPreview} onClose={handleClosePreview}>
          <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
        </PreviewModal>
      </Paper>
    </>
  );
}