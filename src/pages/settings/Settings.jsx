import SettingsLayout from '../settings/SettingsLayout'; // adjust the path if needed
import { Box, Typography } from '@mui/material';

const Settings = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4">
        Organization Settings
      </Typography>
      <SettingsLayout />
    </Box>
  );
};

export default Settings;
