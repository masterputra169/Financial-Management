// controllers/authController.js
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const ActivityModel = require('../models/activityModel');

const AuthController = {
  // Login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username dan password harus diisi.'
        });
      }

      const user = await UserModel.findByUsername(username);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Username atau password salah.'
        });
      }

      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'Akun Anda telah dinonaktifkan. Hubungi admin.'
        });
      }

      const isValidPassword = await UserModel.verifyPassword(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Username atau password salah.'
        });
      }

      // Update last login
      await UserModel.updateLastLogin(user.id);

      // Log activity
      await ActivityModel.create({
        user_id: user.id,
        action: 'LOGIN',
        description: `User ${user.username} logged in`,
        ip_address: req.ip
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username,
          email: user.email,
          role: user.role 
        },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.json({
        success: true,
        message: 'Login berhasil!',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server.'
      });
    }
  },

  // Register / Sign Up
  register: async (req, res) => {
    try {
      const { username, email, password, full_name } = req.body;

      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username, email, dan password harus diisi.'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Format email tidak valid.'
        });
      }

      // Validate password length
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password minimal 6 karakter.'
        });
      }

      // Check if username exists
      const existingUsername = await UserModel.findByUsername(username);
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'Username sudah digunakan.'
        });
      }

      // Check if email exists
      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email sudah terdaftar.'
        });
      }

      // Create user
      const newUser = await UserModel.create({ 
        username, 
        email, 
        password, 
        full_name,
        role: 'user' 
      });

      // Log activity
      await ActivityModel.create({
        user_id: newUser.id,
        action: 'REGISTER',
        description: `New user registered: ${username}`,
        ip_address: req.ip
      });

      // Generate token
      const token = jwt.sign(
        { 
          id: newUser.id, 
          username: newUser.username,
          email: newUser.email,
          role: newUser.role 
        },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'Registrasi berhasil!',
        data: {
          user: newUser,
          token
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server.'
      });
    }
  },

  // Get current user profile
  getProfile: async (req, res) => {
    try {
      const user = await UserModel.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan.'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server.'
      });
    }
  },

  // Verify token
  verifyToken: async (req, res) => {
    try {
      res.json({
        success: true,
        message: 'Token valid.',
        data: {
          user: req.user
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server.'
      });
    }
  },

  // Logout
  logout: async (req, res) => {
    try {
      // Log activity
      if (req.user) {
        await ActivityModel.create({
          user_id: req.user.id,
          action: 'LOGOUT',
          description: `User ${req.user.username} logged out`,
          ip_address: req.ip
        });
      }

      res.json({
        success: true,
        message: 'Logout berhasil.'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server.'
      });
    }
  }
};

module.exports = AuthController;