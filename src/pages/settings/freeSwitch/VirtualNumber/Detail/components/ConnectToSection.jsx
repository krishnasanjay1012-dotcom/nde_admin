import { useState } from "react";
import { Box, Typography, MenuItem, Select, FormControl } from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CommonButton from "../../../../../../components/common/NDE-Button";
import IVRFlowPicker from "./IVRFlowPicker";
import { CONNECT_TO_OPTIONS } from "../constants";

export default function ConnectToSection({ navigate, numberId, phoneNumber }) {
  const [connectTo, setConnectTo] = useState("");
  const [ivrFlowId, setIvrFlowId] = useState("");

  const handleSave = () => {
    if (connectTo === "IVR Flow" && ivrFlowId) {
      navigate(
        `/settings/freeSwitch/virtual-number/${numberId}/flow/${ivrFlowId}`,
        { state: { phoneNumber: phoneNumber || "" } },
      );
    }
  };

  return (
    <Box>
      <Typography variant="body1" sx={{ mb: 0.75, fontWeight: 500 }}>
        Connect to
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* connect-to dropdown */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={connectTo}
            onChange={(e) => {
              setConnectTo(e.target.value);
              setIvrFlowId("");
            }}
            displayEmpty
            renderValue={(v) => (
              <Typography
                variant="body1"
                sx={{ color: v ? "text.primary" : "text.secondary" }}
              >
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

        {/*IVR Flow picker */}
        {connectTo === "IVR Flow" && (
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <IVRFlowPicker
              value={ivrFlowId}
              onChange={setIvrFlowId}
              onNewFlow={() =>
                navigate(
                  `/settings/freeSwitch/virtual-number/${numberId}/flow/new`,
                  { state: { phoneNumber: phoneNumber || "" } },
                )
              }
            />
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <CommonButton
          label="Save"
          disabled={connectTo === "IVR Flow" ? !ivrFlowId : !connectTo}
          startIcon={<SaveOutlinedIcon sx={{ color: "icon.light" }} />}
          onClick={handleSave}
        />
      </Box>
    </Box>
  );
}
