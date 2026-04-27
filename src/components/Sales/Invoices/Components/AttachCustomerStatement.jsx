import {
  Box,
  Checkbox,
  Typography,
  IconButton,
  Link,
  Paper,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useController, useFormContext } from "react-hook-form";
import DOMPurify from "dompurify";
import { useState } from "react";
import DateRangeModal from "./DateRangeModal";
import { useTransactionStatement } from "../../../../hooks/sales/invoice-hooks";
import dayjs from "dayjs";
import PreviewModal from "./PreviewModal";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function AttachCustomerStatement({
  userId,
  workSpaceId,
  invoiceId,
}) {
  const { control, setValue, watch } = useFormContext();

  const { field } = useController({
    name: "send_customer_attachment",
    control,
  });

  const [open, setOpen] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const handleOpenPreview = () => setOpenPreview(true);
  const handleClosePreview = () => setOpenPreview(false);
  const value = field.value || {};

  const start_date = watch("send_customer_attachment.from_date");
  const end_date = watch("send_customer_attachment.to_date");
  const applied = watch("send_customer_attachment.applied");

  const { data, isFetching } = useTransactionStatement({
    workSpaceId,
    userId,
    invoiceId,
    start_date,
    end_date,
    applied,
    onAppliedReset: () => {
      setValue("send_customer_attachment.applied", false, {
        shouldDirty: false,
        shouldTouch: false,
      });
    },
  });

  const safeHTML = DOMPurify.sanitize(data?.html);
console.log("start_date",start_date,end_date)
  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          py: 2,
          px: 1,
          borderRadius: 2,
          backgroundColor: "#f7fbff",
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Box display="flex" alignItems="center" gap={0.5}>
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
              <Typography fontWeight={500}>
                Attach Customer Statement
              </Typography>
            </Box>

            {value.enabled && (
              <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                <Typography variant="body2" color="text.secondary">
                  Date Range:
                <strong>
  {start_date
    ? dayjs(start_date, "DD/MM/YYYY").format("DD/MM/YYYY")
    : "--"}{" "}
  –{" "}
  {end_date
    ? dayjs(end_date, "DD/MM/YYYY").format("DD/MM/YYYY")
    : "--"}
</strong>
                </Typography>

                <IconButton
                  size="small"
                  sx={{ p: 0 }}
                  onClick={() => setOpen(true)}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>

          {value.enabled && (
            <Link
              component="button"
              underline="none"
              disabled={isFetching}
              onClick={handleOpenPreview}
            >
              Preview
            </Link>
          )}
        </Box>
        <PreviewModal open={openPreview} onClose={handleClosePreview}>
          <div
            style={{ color: "black" }}
            dangerouslySetInnerHTML={{ __html: safeHTML }}
          />
        </PreviewModal>
      </Paper>

      <DateRangeModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
