import { Typography, Box } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CommonDrawer from "./NDE-Drawer";

const UnsavedChangesDrawer = ({ open, onStay, onLeave }) => {
  return (
    <CommonDrawer
      open={open}
      onClose={onStay}
      anchor="top"
      topWidth={500}
      actionsJustify="flex-start"
      disableAnimation={false}
      actions={[
        {
          label: "Stay Here",
          onClick: onStay,
          sx: {
            borderRadius: "6px",
          },
        },
        {
          label: "Leave & Discard Changes",
          onClick: onLeave,
          variant: "outlined",
          sx: {
            borderRadius: "6px",
            borderColor: "grey.200",
            color: "text.primary",
            backgroundColor: "background.muted",
          },
        },
      ]}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1.2,
            borderRadius: "12px",
            backgroundColor: "warning.light",
          }}
        >
          <WarningAmberIcon sx={{ color: "warning.main", fontSize: 24 }} />
        </Box>
        <Box>
          <Typography
            fontWeight={400}
            sx={{ fontSize: "1.1rem", color: "text.primary", mb: 1 }}
          >
            Leave this page?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mb: 1}}>
            If you leave, your unsaved changes will be discarded.
          </Typography>
        </Box>
      </Box>
    </CommonDrawer>
  );
};

export default UnsavedChangesDrawer;