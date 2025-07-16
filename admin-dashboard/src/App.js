import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import Users from './pages/Users';
import Reviews from './pages/Reviews';
import Discussion from './pages/Discussion';
import { AppBar, Tabs, Tab, Toolbar, Box, Button } from '@mui/material';

function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AuthNavTabs() {
  const location = useLocation();
  const tabValue = location.pathname === '/signup' ? 1 : 0;
  return (
    <AppBar position="static" color="default" elevation={1} sx={{ mb: 4 }}>
      <Toolbar>
        <Tabs value={tabValue} textColor="primary" indicatorColor="primary">
          <Tab label="Login" component={Link} to="/login" />
          <Tab label="Sign Up" component={Link} to="/signup" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <Router>
      <Box>
        {!isAuthenticated && <AuthNavTabs />}
        <Box sx={{ p: isAuthenticated ? 0 : 3 }}>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }>
              <Route path="users" element={<Users />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="discussion" element={<Discussion />} />
            </Route>
            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard/users" : "/login"} />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
