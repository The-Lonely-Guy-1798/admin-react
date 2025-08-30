import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';

const SettingsPage = () => {
  // State for the Change Password form
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  // State for the API Key form
  const [apiKey, setApiKey] = useState('YOUR-MOCK-API-KEY-HERE');
  // State for the Feature toggles
  const [features, setFeatures] = useState({
    maintenanceMode: false,
    userRegistration: true,
  });

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };
  
  const handleFeatureChange = (e) => {
    setFeatures({ ...features, [e.target.name]: e.target.checked });
  };

  // Mock submission handlers
  const handleUpdatePassword = () => {
    // In a real app, you'd add validation and make an API call
    console.log('Updating password with:', passwords);
    alert('Password update submitted! (Check console)');
  };
  const handleSaveApiKey = () => {
    console.log('Saving API Key:', apiKey);
    alert('API Key saved! (Check console)');
  };
  const handleSaveFeatures = () => {
    console.log('Saving features:', features);
    alert('Feature settings saved! (Check console)');
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Global Settings
      </Typography>

      <Box sx={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: 3, mx: 'auto' }}>
        {/* Change Password Card */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Change Admin Password</Typography>
          <TextField name="current" label="Current Password" type="password" value={passwords.current} onChange={handlePasswordChange} fullWidth sx={{ mb: 2 }} />
          <TextField name="new" label="New Password" type="password" value={passwords.new} onChange={handlePasswordChange} fullWidth sx={{ mb: 2 }} />
          <TextField name="confirm" label="Confirm New Password" type="password" value={passwords.confirm} onChange={handlePasswordChange} fullWidth sx={{ mb: 2 }} />
          <Button variant="contained" onClick={handleUpdatePassword}>Update Password</Button>
        </Paper>

        {/* API Keys Card */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>API Keys</Typography>
          <TextField label="Crypto API Service Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} fullWidth />
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSaveApiKey}>Save API Keys</Button>
        </Paper>

        {/* App-wide Features Card */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>App-wide Features</Typography>
          <Box>
            <FormControlLabel
              control={<Switch name="maintenanceMode" checked={features.maintenanceMode} onChange={handleFeatureChange} />}
              label="Enable Maintenance Mode"
            />
            <Typography variant="body2" color="text.secondary" sx={{ml: 4}}>
              Puts the app into maintenance mode, showing a notification to users.
            </Typography>
          </Box>
          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
          <Box>
            <FormControlLabel
              control={<Switch name="userRegistration" checked={features.userRegistration} onChange={handleFeatureChange} />}
              label="New User Registrations"
            />
             <Typography variant="body2" color="text.secondary" sx={{ml: 4}}>
              Allow or disallow new users to sign up.
            </Typography>
          </Box>
           <Button variant="contained" sx={{ mt: 2 }} onClick={handleSaveFeatures}>Save Feature Settings</Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default SettingsPage;