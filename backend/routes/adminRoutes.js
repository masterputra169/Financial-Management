// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// All routes require admin authentication
router.use(verifyToken);
router.use(isAdmin);

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get dashboard statistics
 * @access  Admin
 */
router.get('/dashboard', AdminController.getDashboardStats);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with stats
 * @access  Admin
 */
router.get('/users', AdminController.getAllUsers);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user detail with transactions
 * @access  Admin
 */
router.get('/users/:id', AdminController.getUserDetail);

/**
 * @route   PUT /api/admin/users/:id/toggle-status
 * @desc    Toggle user active status
 * @access  Admin
 */
router.put('/users/:id/toggle-status', AdminController.toggleUserStatus);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Admin
 */
router.delete('/users/:id', AdminController.deleteUser);

/**
 * @route   GET /api/admin/activities
 * @desc    Get all activity logs
 * @access  Admin
 */
router.get('/activities', AdminController.getAllActivities);

/**
 * @route   GET /api/admin/activities/stats
 * @desc    Get activity statistics
 * @access  Admin
 */
router.get('/activities/stats', AdminController.getActivityStats);

/**
 * @route   GET /api/admin/summary/daily
 * @desc    Get daily transaction summary
 * @access  Admin
 */
router.get('/summary/daily', AdminController.getDailySummary);

module.exports = router;