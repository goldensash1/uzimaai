import React from 'react';
import { TextField, Button, Typography, Box, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

function SignUp() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
      <Typography variant="h4" gutterBottom>Sign Up</Typography>
      <Box component="form" sx={{ width: 300 }}>
        <TextField label="Name" fullWidth margin="normal" required />
        <TextField label="Email" type="email" fullWidth margin="normal" required />
        <TextField label="Password" type="password" fullWidth margin="normal" required />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Sign Up</Button>
      </Box>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account?{' '}
        <MuiLink component={Link} to="/login">Login</MuiLink>
      </Typography>
    </Box>
  );
}

export default SignUp; 