import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Link as MuiLink, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Login({ onLogin, isAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard/users');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    onLogin();
    navigate('/dashboard/users');
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
      <Typography variant="h4" gutterBottom>Login</Typography>
      <Box component="form" sx={{ width: 300 }} onSubmit={handleSubmit}>
        <TextField label="Email" type="email" fullWidth margin="normal" required value={email} onChange={e => setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth margin="normal" required value={password} onChange={e => setPassword(e.target.value)} />
        {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} type="submit">Login</Button>
      </Box>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Don't have an account?{' '}
        <MuiLink component={Link} to="/signup">Sign Up</MuiLink>
      </Typography>
    </Box>
  );
}

export default Login; 