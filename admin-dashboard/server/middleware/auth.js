const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Verify admin exists in database
    const [admin] = await pool.execute(
      'SELECT adminId, adminUsername, adminEmail, adminStatus FROM admin WHERE adminId = ? AND adminStatus = "active"',
      [decoded.adminId]
    );

    if (admin.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid token. Admin not found or inactive.' 
      });
    }

    req.admin = admin[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired.' 
      });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      error: 'Internal server error during authentication.' 
    });
  }
};

const isSuperAdmin = async (req, res, next) => {
  try {
    if (req.admin.adminStatus !== 'super_admin') {
      return res.status(403).json({ 
        error: 'Access denied. Super admin privileges required.' 
      });
    }
    next();
  } catch (error) {
    console.error('Super admin middleware error:', error);
    res.status(500).json({ 
      error: 'Internal server error during authorization.' 
    });
  }
};

module.exports = {
  authenticateToken,
  isSuperAdmin
}; 