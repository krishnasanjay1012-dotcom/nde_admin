import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  Divider,
} from "@mui/material";
import ConnectToSection from "../components/ConnectToSection";

export default function IncomingCallsTab({ numberId, navigate, phoneNumber }) {
  return (
    <Box sx={{ maxWidth: 560, pt: 1 }}>
      {/* during business hours */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        During business hours
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 0.75, fontWeight: 500 }}>
          Welcome message
        </Typography>
        <FormControl size="small" fullWidth sx={{ maxWidth: 340 }}>
          <Select defaultValue="none" displayEmpty>
            <MenuItem value="none">
              <Typography variant="body1">
                No message (Connect directly)
              </Typography>
            </MenuItem>
            <MenuItem value="custom">
              <Typography variant="body1">Custom message</Typography>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <ConnectToSection
        navigate={navigate}
        numberId={numberId}
        phoneNumber={phoneNumber}
      />

      <Divider sx={{ my: 3 }} />

      {/* after business hours */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        After business hours
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ mb: 0.75, fontWeight: 500 }}>
          Message
        </Typography>
        <FormControl size="small" fullWidth sx={{ maxWidth: 340 }}>
          <Select defaultValue="none" displayEmpty>
            <MenuItem value="none">
              <Typography variant="body1">No message</Typography>
            </MenuItem>
            <MenuItem value="custom">
              <Typography variant="body1">Custom message</Typography>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
