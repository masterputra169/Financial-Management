// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(verifyToken);

/**
 * @route   GET /api/transactions
 * @desc    Get user's transactions
 * @access  Private (User)
 */
router.get('/', TransactionController.getMyTransactions);

/**
 * @route   GET /api/transactions/summary
 * @desc    Get user's summary
 * @access  Private (User)
 */
router.get('/summary', TransactionController.getMySummary);

/**
 * @route   GET /api/transactions/summary/category
 * @desc    Get user's category summary
 * @access  Private (User)
 */
router.get('/summary/category', TransactionController.getMyCategorySummary);

/**
 * @route   GET /api/transactions/all
 * @desc    Get all transactions (Admin)
 * @access  Private (Admin)
 */
router.get('/all', isAdmin, TransactionController.getAllTransactions);

/**
 * @route   GET /api/transactions/global-summary
 * @desc    Get global summary (Admin)
 * @access  Private (Admin)
 */
router.get('/global-summary', isAdmin, TransactionController.getGlobalSummary);

/**
 * @route   GET /api/transactions/daily-summary
 * @desc    Get daily summary (Admin)
 * @access  Private (Admin)
 */
router.get('/daily-summary', isAdmin, TransactionController.getDailySummary);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get single transaction
 * @access  Private (Owner or Admin)
 */
router.get('/:id', TransactionController.getById);

/**
 * @route   POST /api/transactions
 * @desc    Create transaction
 * @access  Private (User)
 */
router.post('/', TransactionController.create);

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update transaction
 * @access  Private (Owner or Admin)
 */
router.put('/:id', TransactionController.update);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete transaction
 * @access  Private (Owner or Admin)
 */
router.delete('/:id', TransactionController.delete);

module.exports = router;