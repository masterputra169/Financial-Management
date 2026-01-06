// controllers/adminController.js
const UserModel = require('../models/userModel');
const TransactionModel = require('../models/transactionModel');
const ActivityModel = require('../models/activityModel');

const AdminController = {
  // GET - Dashboard statistics
  getDashboardStats: async (req, res) => {
    try {
      const userCount = await UserModel.count();
      const transactionCount = await TransactionModel.count();
      const globalSummary = await TransactionModel.getGlobalSummary();
      const todayActivities = await ActivityModel.countToday();
      const recentActivities = await ActivityModel.getRecent(10);
      const userStats = await UserModel.getUserStats();

      res.json({
        success: true,
        data: {
          users: userCount,
          transactions: {
            total: transactionCount,
            ...globalSummary
          },
          todayActivities,
          recentActivities,
          userStats
        }
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil statistik.'
      });
    }
  },

  // GET - All users
  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.getUserStats();

      res.json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data users.'
      });
    }
  },

  // GET - User detail with transactions
  getUserDetail: async (req, res) => {
    try {
      const { id } = req.params;
      
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan.'
        });
      }

      const transactions = await TransactionModel.findByUserId(id);
      const summary = await TransactionModel.getSummaryByUser(id);
      const activities = await ActivityModel.findByUserId(id, 20);

      res.json({
        success: true,
        data: {
          user,
          transactions,
          summary,
          activities
        }
      });
    } catch (error) {
      console.error('Get user detail error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil detail user.'
      });
    }
  },

  // PUT - Toggle user status
  toggleUserStatus: async (req, res) => {
    try {
      const { id } = req.params;
      
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan.'
        });
      }

      if (user.role === 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Tidak dapat mengubah status admin.'
        });
      }

      await UserModel.toggleActive(id);

      // Log activity
      await ActivityModel.create({
        user_id: req.user.id,
        action: 'TOGGLE_USER_STATUS',
        description: `Toggled status for user: ${user.username}`,
        ip_address: req.ip
      });

      const updatedUser = await UserModel.findById(id);

      res.json({
        success: true,
        message: `User ${updatedUser.is_active ? 'diaktifkan' : 'dinonaktifkan'}.`,
        data: updatedUser
      });
    } catch (error) {
      console.error('Toggle user status error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan.'
      });
    }
  },

  // DELETE - Delete user
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan.'
        });
      }

      if (user.role === 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Tidak dapat menghapus admin.'
        });
      }

      await UserModel.delete(id);

      // Log activity
      await ActivityModel.create({
        user_id: req.user.id,
        action: 'DELETE_USER',
        description: `Deleted user: ${user.username}`,
        ip_address: req.ip
      });

      res.json({
        success: true,
        message: 'User berhasil dihapus.'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat menghapus user.'
      });
    }
  },

  // GET - All activities
  getAllActivities: async (req, res) => {
    try {
      const { userId, action, startDate, endDate, limit } = req.query;
      
      const filters = {};
      if (userId) filters.userId = userId;
      if (action) filters.action = action;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (limit) filters.limit = limit;

      const activities = await ActivityModel.findAll(filters);

      res.json({
        success: true,
        count: activities.length,
        data: activities
      });
    } catch (error) {
      console.error('Get activities error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil activity logs.'
      });
    }
  },

  // GET - Activity stats
  getActivityStats: async (req, res) => {
    try {
      const stats = await ActivityModel.getStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get activity stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan.'
      });
    }
  },

  // GET - Daily transaction summary
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

module.exports = AdminController;