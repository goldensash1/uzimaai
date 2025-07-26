import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

/**
 * @desc Get all users
 * @route GET /api/admin/users
 * @access Private
 */
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT userid, username, useremail, phone, emergencyphone, userstatus FROM users ORDER BY userid DESC'
    );

    res.json({
      success: true,
      users: rows
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Get user by ID
 * @route GET /api/admin/users/:id
 * @access Private
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      'SELECT userid, username, useremail, phone, emergencyphone, userstatus FROM users WHERE userid = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: rows[0]
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Create new user
 * @route POST /api/admin/users
 * @access Private
 */
export const createUser = async (req, res) => {
  try {
    const { username, useremail, phone, emergencyphone, userpassword, userstatus = 'active' } = req.body;

    // Validate required fields
    if (!username || !useremail || !userpassword) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    // Check if user already exists
    const [existingRows] = await pool.execute(
      'SELECT userid FROM users WHERE username = ? OR useremail = ?',
      [username, useremail]
    );

    if (existingRows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userpassword, saltRounds);

    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO users (username, useremail, phone, emergencyphone, userpassword, userstatus) VALUES (?, ?, ?, ?, ?, ?)',
      [username, useremail, phone, emergencyphone, hashedPassword, userstatus]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        userid: result.insertId,
        username,
        useremail,
        phone,
        emergencyphone,
        userstatus
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Update user
 * @route PUT /api/admin/users/:id
 * @access Private
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, useremail, phone, emergencyphone, userpassword, userstatus } = req.body;

    // Check if user exists
    const [existingUser] = await pool.execute(
      'SELECT userid FROM users WHERE userid = ?',
      [id]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if username or email already exists for other users
    const [duplicateRows] = await pool.execute(
      'SELECT userid FROM users WHERE (username = ? OR useremail = ?) AND userid != ?',
      [username, useremail, id]
    );

    if (duplicateRows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    // Prepare update query
    let updateQuery = 'UPDATE users SET username = ?, useremail = ?, phone = ?, emergencyphone = ?, userstatus = ?';
    let params = [username, useremail, phone, emergencyphone, userstatus];

    // Add password to update if provided
    if (userpassword) {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userpassword, saltRounds);
      updateQuery += ', userpassword = ?';
      params.push(hashedPassword);
    }

    updateQuery += ' WHERE userid = ?';
    params.push(id);

    await pool.execute(updateQuery, params);

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Delete user
 * @route DELETE /api/admin/users/:id
 * @access Private
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [existingUser] = await pool.execute(
      'SELECT userid FROM users WHERE userid = ?',
      [id]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user
    await pool.execute('DELETE FROM users WHERE userid = ?', [id]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @desc Get users count
 * @route GET /api/admin/users/count
 * @access Private
 */
export const getUsersCount = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM users');
    
    res.json({
      success: true,
      count: rows[0].count
    });
  } catch (error) {
    console.error('Get users count error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 