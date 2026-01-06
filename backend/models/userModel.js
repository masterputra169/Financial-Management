// models/userModel.js
const db = require('../config/database');
const bcrypt = require('bcryptjs');

const UserModel = {
  // Find user by username
  findByUsername: async (username) => {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Find user by email
  findByEmail: async (email) => {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Find user by ID
  findById: async (id) => {
    try {
      const [rows] = await db.execute(
        'SELECT id, username, email, full_name, role, is_active, last_login, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Create new user (Sign Up)
  create: async (userData) => {
    try {
      const { username, email, password, full_name, role = 'user' } = userData;
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const [result] = await db.execute(
        'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, full_name || username, role]
      );

      return {
        id: result.insertId,
        username,
        email,
        full_name: full_name || username,
        role
      };
    } catch (error) {
      throw error;
    }
  },

  // Verify password
  verifyPassword: async (plainPassword, hashedPassword) => {
    // Untuk demo, cek plain text dulu
    if (plainPassword === hashedPassword) {
      return true;
    }
    // Kemudian cek bcrypt
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  // Update last login
  updateLastLogin: async (id) => {
    try {
      await db.execute(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );
    } catch (error) {
      throw error;
    }
  },

  // Get all users (admin only)
  findAll: async () => {
    try {
      const [rows] = await db.execute(
        `SELECT id, username, email, full_name, role, is_active, last_login, created_at 
         FROM users ORDER BY created_at DESC`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get user statistics (admin only)
  getUserStats: async () => {
    try {
      const [rows] = await db.execute('SELECT * FROM v_user_stats');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Update user
  update: async (id, userData) => {
    try {
      const { username, email, full_name, is_active } = userData;
      const [result] = await db.execute(
        'UPDATE users SET username = ?, email = ?, full_name = ?, is_active = ? WHERE id = ?',
        [username, email, full_name, is_active, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // Delete user
  delete: async (id) => {
    try {
      const [result] = await db.execute(
        'DELETE FROM users WHERE id = ? AND role != "admin"',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // Toggle user active status
  toggleActive: async (id) => {
    try {
      const [result] = await db.execute(
        'UPDATE users SET is_active = NOT is_active WHERE id = ? AND role != "admin"',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // Count users
  count: async () => {
    try {
      const [rows] = await db.execute(
        'SELECT COUNT(*) as total, SUM(CASE WHEN role = "admin" THEN 1 ELSE 0 END) as admins, SUM(CASE WHEN role = "user" THEN 1 ELSE 0 END) as users FROM users'
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
};

module.exports = UserModel;