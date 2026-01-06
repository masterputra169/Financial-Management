// controllers/transactionController.js
const TransactionModel = require('../models/transactionModel');
const ActivityModel = require('../models/activityModel');

const TransactionController = {
  // GET - Get user's transactions
  getMyTransactions: async (req, res) => {
    try {
      const userId = req.user.id;
      const { type, category, startDate, endDate } = req.query;
      
      const filters = {};
      if (type) filters.type = type;
      if (category) filters.category = category;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      const transactions = await TransactionModel.findByUserId(userId, filters);

      res.json({
        success: true,
        count: transactions.length,
        data: transactions
      });
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data transaksi.'
      });
    }
  },

  // GET - Get all transactions (Admin only)
  getAllTransactions: async (req, res) => {
    try {
      const { type, category, startDate, endDate, userId, limit } = req.query;
      
      const filters = {};
      if (type) filters.type = type;
      if (category) filters.category = category;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (userId) filters.userId = userId;
      if (limit) filters.limit = limit;

      const transactions = await TransactionModel.findAll(filters);

      res.json({
        success: true,
        count: transactions.length,
        data: transactions
      });
    } catch (error) {
      console.error('Get all transactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data transaksi.'
      });
    }
  },

  // GET - Get single transaction
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await TransactionModel.findById(id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaksi tidak ditemukan.'
        });
      }

      // Check ownership (unless admin)
      if (req.user.role !== 'admin' && transaction.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Anda tidak memiliki akses ke transaksi ini.'
        });
      }

      res.json({
        success: true,
        data: transaction
      });
    } catch (error) {
      console.error('Get transaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data transaksi.'
      });
    }
  },

  // POST - Create transaction
  create: async (req, res) => {
    try {
      const { date, type, category, description, amount } = req.body;
      const userId = req.user.id;

      // Validate
      if (!date || !type || !category || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Field date, type, category, dan amount harus diisi.'
        });
      }

      if (!['pemasukan', 'pengeluaran'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Type harus berupa "pemasukan" atau "pengeluaran".'
        });
      }

      if (isNaN(amount) || parseFloat(amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount harus berupa angka positif.'
        });
      }

      const transactionData = {
        user_id: userId,
        date,
        type,
        category,
        description: description || '',
        amount: parseFloat(amount)
      };

      const newTransaction = await TransactionModel.create(transactionData);

      // Log activity
      await ActivityModel.create({
        user_id: userId,
        action: 'CREATE_TRANSACTION',
        description: `Created ${type}: ${category} - Rp ${amount}`,
        ip_address: req.ip
      });

      res.status(201).json({
        success: true,
        message: 'Transaksi berhasil ditambahkan.',
        data: newTransaction
      });
    } catch (error) {
      console.error('Create transaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat menambahkan transaksi.'
      });
    }
  },

  // PUT - Update transaction
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { date, type, category, description, amount } = req.body;

      const existingTransaction = await TransactionModel.findById(id);
      
      if (!existingTransaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaksi tidak ditemukan.'
        });
      }

      // Check ownership
      if (req.user.role !== 'admin' && existingTransaction.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Anda tidak memiliki akses untuk mengubah transaksi ini.'
        });
      }

      // Validate
      if (!date || !type || !category || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Field date, type, category, dan amount harus diisi.'
        });
      }

      const transactionData = {
        date,
        type,
        category,
        description: description || '',
        amount: parseFloat(amount)
      };

      await TransactionModel.update(id, transactionData);

      // Log activity
      await ActivityModel.create({
        user_id: req.user.id,
        action: 'UPDATE_TRANSACTION',
        description: `Updated transaction ID: ${id}`,
        ip_address: req.ip
      });

      const updatedTransaction = await TransactionModel.findById(id);

      res.json({
        success: true,
        message: 'Transaksi berhasil diupdate.',
        data: updatedTransaction
      });
    } catch (error) {
      console.error('Update transaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengupdate transaksi.'
      });
    }
  },

  // DELETE - Delete transaction
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const existingTransaction = await TransactionModel.findById(id);
      
      if (!existingTransaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaksi tidak ditemukan.'
        });
      }

      // Check ownership
      if (req.user.role !== 'admin' && existingTransaction.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Anda tidak memiliki akses untuk menghapus transaksi ini.'
        });
      }

      await TransactionModel.delete(id);

      // Log activity
      await ActivityModel.create({
        user_id: req.user.id,
        action: 'DELETE_TRANSACTION',
        description: `Deleted transaction: ${existingTransaction.category} - Rp ${existingTransaction.amount}`,
        ip_address: req.ip
      });

      res.json({
        success: true,
        message: 'Transaksi berhasil dihapus.'
      });
    } catch (error) {
      console.error('Delete transaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat menghapus transaksi.'
      });
    }
  },

  // GET - Get user's summary
  getMySummary: async (req, res) => {
    try {
      const userId = req.user.id;
      const summary = await TransactionModel.getSummaryByUser(userId);

      res.json({
        success: true,
        data: {
          totalPemasukan: parseFloat(summary.totalPemasukan),
          totalPengeluaran: parseFloat(summary.totalPengeluaran),
          saldo: parseFloat(summary.saldo),
          totalTransactions: summary.totalTransactions
        }
      });
    } catch (error) {
      console.error('Get summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil ringkasan.'
      });
    }
  },

  // GET - Get user's category summary
  getMyCategorySummary: async (req, res) => {
    try {
      const userId = req.user.id;
      const summary = await TransactionModel.getSummaryByCategory(userId);

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Get category summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil ringkasan kategori.'
      });
    }
  },

  // GET - Global summary (Admin)
  getGlobalSummary: async (req, res) => {
    try {
      const summary = await TransactionModel.getGlobalSummary();

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Get global summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil ringkasan global.'
      });
    }
  },

  // GET - Daily summary (Admin)
  getDailySummary: async (req, res) => {
    try {
      const { days } = req.query;
      const summary = await TransactionModel.getDailySummary(days || 30);

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Get daily summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan.'
      });
    }
  }
};

module.exports = TransactionController;