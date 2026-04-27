import {
  Box,
  Checkbox,
  Typography,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useFormContext, Controller } from "react-hook-form";

const AttachInvoice = () => {
  const { control, watch } = useFormContext();

  const enabled = watch("send_invoice_attachment");

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1,
        borderRadius: 2,
        backgroundColor: "#f7fbff",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Box display="flex" alignItems="center" gap={0.4}>
        <Controller
          name="send_invoice_attachment"
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              checked={field.value}
              size="small"
              sx={{ padding: 0 }}
            />
          )}
        />

        <Typography fontWeight={500}>Attach Invoice PDF</Typography>
      </Box>

      {enabled && (
        <Controller
          name="invoice_name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              size="small"
              placeholder="Enter invoice name"
              sx={{
                width: 250,
                backgroundColor: "#fff",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PictureAsPdfIcon color="error" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      )}
    </Paper>
  );
};

export default AttachInvoice;
