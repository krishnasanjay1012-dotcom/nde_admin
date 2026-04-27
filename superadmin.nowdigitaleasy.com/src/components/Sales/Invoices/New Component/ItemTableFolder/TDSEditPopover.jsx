import { Box, Popover, Typography } from "@mui/material";
import { CommonTextField } from "../../../../common/fields";
import CommonButton from "../../../../common/NDE-Button";

export default function TDSEditPopover({
  anchorEl,
  onClose,
  editAmount,
  setEditAmount,
  onUpdate,
}) {
  const open = Boolean(anchorEl);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Box sx={{ p: 2, width: 240 }}>
        <Typography fontSize={13} mb={1}>
          Flat Amount
        </Typography>
        <CommonTextField
          value={editAmount}
          onChange={(e) => setEditAmount(e.target.value)}
          startAdornment="₹"
          noLabel
          height={36}
          mt={0}
          mb={0}
          autoFocus
        />
        <CommonButton
          label="Update"
          fullWidth
          sx={{ mt: 2, height: 32 }}
          startIcon={null}
          onClick={onUpdate}
        />
      </Box>
    </Popover>
  );
}
