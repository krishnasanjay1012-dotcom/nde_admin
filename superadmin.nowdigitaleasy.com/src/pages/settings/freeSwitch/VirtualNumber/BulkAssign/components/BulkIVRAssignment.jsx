import { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Divider,
  useTheme,
} from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import CommonButton from "../../../../../../components/common/NDE-Button";
import { CONNECT_TO_OPTIONS, IVR_FLOWS } from "../../Detail/constants";

export default function BulkIVRAssignment({ selectedIds, numberId, navigate, phoneNumber }) {
  const theme = useTheme();
  const [incomingConnectTo, setIncomingConnectTo] = useState("");
  const [incomingIvrFlowId, setIncomingIvrFlowId] = useState("");
  const [outgoingConnectTo, setOutgoingConnectTo] = useState("");

  const canAssign = selectedIds.length > 0 && (incomingConnectTo || outgoingConnectTo);

  const handleNewFlow = () => {
    navigate(`/settings/freeSwitch/virtual-number/${numberId}/flow/new`, {
      state: { phoneNumber, selectedUserIds: selectedIds },
    });
  };

  const handleAssign = () => {
    navigate(`/settings/freeSwitch/virtual-number/${numberId}`);
  };

  const SectionLabel = ({ text }) => (
    <Typography variant="body1" sx={{ fontWeight: 500, mb: theme.spacing(0.75) }}>
      {text}
    </Typography>
  );

  const ConnectDropdown = ({ value, onChange, label }) => (
    <Box sx={{ mb: theme.spacing(2) }}>
      <SectionLabel text={label} />
      <FormControl size="small" sx={{ minWidth: theme.spacing(22) }}>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          displayEmpty
          renderValue={(v) => (
            <Typography variant="body1" sx={{ color: v ? "text.primary" : "text.secondary" }}>
              {v || "Select..."}
            </Typography>
          )}
        >
          {CONNECT_TO_OPTIONS.map((opt) => (
            <MenuItem key={opt} value={opt}>
              <Typography variant="body1">{opt}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${theme.shape.borderRadius * 1.5}px`,
        p: theme.spacing(2.5),
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
      }}
    >
      {/* Header */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Assign Configuration
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mt: theme.spacing(0.5) }}>
          {selectedIds.length > 0
            ? `Applies to ${selectedIds.length} selected user${selectedIds.length > 1 ? "s" : ""}`
            : "Select users on the left to begin"}
        </Typography>
      </Box>

      <Divider />

      {/* Incoming Calls */}
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: theme.spacing(1.5) }}>
          Incoming Calls
        </Typography>
        <ConnectDropdown value={incomingConnectTo} onChange={setIncomingConnectTo} label="Connect to" />

        {incomingConnectTo === "IVR Flow" && (
          <Box sx={{ mb: theme.spacing(2) }}>
            <SectionLabel text="Select IVR Flow" />
            <Box sx={{ display: "flex", gap: theme.spacing(1.5), flexWrap: "wrap", alignItems: "center" }}>
              <FormControl size="small" sx={{ minWidth: theme.spacing(22) }}>
                <Select
                  value={incomingIvrFlowId}
                  onChange={(e) => setIncomingIvrFlowId(e.target.value)}
                  displayEmpty
                  renderValue={(v) => {
                    const flow = IVR_FLOWS.find((f) => f.id === v);
                    return (
                      <Typography variant="body1" sx={{ color: v ? "text.primary" : "text.secondary" }}>
                        {flow?.name || "Select Flow..."}
                      </Typography>
                    );
                  }}
                >
                  {IVR_FLOWS.map((flow) => (
                    <MenuItem key={flow.id} value={flow.id}>
                      <Typography variant="body1">{flow.name}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <CommonButton
                label="New Flow"
                variant="outlined"
                size="small"
                startIcon={
                  <AccountTreeOutlinedIcon
                    sx={{ fontSize: "1rem", transform: "rotate(90deg)", color: "primary.main" }}
                  />
                }
                sx={{
                  color: "primary.main",
                  borderColor: "primary.border",
                  bgcolor: "primary.extraLight",
                  "&:hover": { bgcolor: "background.hover" },
                }}
                onClick={handleNewFlow}
              />
            </Box>
          </Box>
        )}
      </Box>

      <Divider />

      {/* Outgoing Calls */}
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: theme.spacing(1.5) }}>
          Outgoing Calls
        </Typography>
        <ConnectDropdown value={outgoingConnectTo} onChange={setOutgoingConnectTo} label="Connect to" />
      </Box>

      <Divider />

      {/* Assign Button */}
      <Box>
        <CommonButton
          label="Assign to Selected Users"
          disabled={!canAssign}
          startIcon={<SaveOutlinedIcon sx={{ color: "icon.light" }} />}
          onClick={handleAssign}
        />
      </Box>
    </Box>
  );
}
