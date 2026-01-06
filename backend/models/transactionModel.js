// models/transactionModel.js
const db = require('../config/database');

const TransactionModel = {
  // Get transactions by user ID
  findByUserId: async (userId, filters = {}) => {
    try {
      let query = 'SELECT * FROM transactions WHERE user_id = ?';
      const params = [userId];

      if (filters.type) {
        query += ' AND type = ?';
        params.push(filters.type);
      }

      if (filters.category) {
        query += ' AND category = ?';
        params.push(filters.category);
      }

      if (filters.startDate) {
        query += ' AND date >= ?';
        params.push(filters.startDate);
      }

      if (filters.endDate) {
        query += ' AND date <= ?';
        params.push(filters.endDate);
      }

      query += ' ORDER BY date DESC, created_at DESC';

      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get all transactions (admin only)
  findAll: async (filters = {}) => {
    try {
      let query = `
        SELECT t.*, u.username, u.full_name 
        FROM transactions t 
        JOIN users u ON t.user_id = u.id
      `;
      const params = [];
      const conditions = [];

      if (filters.userId) {
        conditions.push('t.user_id = ?');
        params.push(filters.userId);
      }

      if (filters.type) {
        conditions.push('t.type = ?');
        params.push(filters.type);
      }

      if (filters.category) {
        conditions.push('t.category = ?');
        params.push(filters.category);
      }

      if (filters.startDate) {
        conditions.push('t.date >= ?');
        params.push(filters.startDate);
      }

      if (filters.endDate) {
        conditions.push('t.date <= ?');
        params.push(filters.endDate);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY t.date DESC, t.created_at DESC';

      if (filters.limit) {
        query += ' LIMIT ?';
        params.push(parseInt(filters.limit));
      }

      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Find by ID
  findById: async (id) => {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM transactions WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Create transaction
  create: async (transactionData) => {
    try {
      const { user_id, date, type, category, description, amount } = transactionData;

      const [result] = await db.execute(
        `INSERT INTO transactions (user_id, date, type, category, description, amount) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, date, type, category, description || '', amount]
      );

      return {
        id: result.insertId,
        user_id,
        date,
        type,
        category,
        description,
        amount
      };
    } catch (error) {
      throw error;
    }
  },

  // Update transaction
  update: async (id, transactionData) => {
    try {
      const { date, type, category, description, amount } = transactionData;

      const [result] = await db.execute(
        `UPDATE transactions 
         SET date = ?, type = ?, category = ?, description = ?, amount = ?
         WHERE id = ?`,
        [date, type, category, description || '', amount, id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // Delete transaction
  delete: async (id) => {
    try {
      const [result] = await db.execute(
        'DELETE FROM transactions WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // Get summary by user
  getSummaryByUser: async (userId) => {
    try {
      const [rows] = await db.execute(`
        SELECT 
          COALESCE(SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE 0 END), 0) as totalPemasukan,
          COALESCE(SUM(CASE WHEN type = 'pengeluaran' THEN amount ELSE 0 END), 0) as totalPengeluaran,
          COALESCE(SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE -amount END), 0) as saldo,
          COUNT(*) as totalTransactions
        FROM transactions
        WHERE user_id = ?
      `, [userId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Get global summary (admin)
  getGlobalSummary: async () => {
    try {
      const [rows] = await db.execute(`
        SELECT 
          COALESCE(SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE 0 END), 0) as totalPemasukan,
          COALESCE(SUM(CASE WHEN type = 'pengeluaran' THEN amount ELSE 0 END), 0) as totalPengeluaran,
          COUNT(*) as totalTransactions,
          COUNT(DISTINCT user_id) as totalUsers
        FROM transactions
      `);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Get summary by category for user
  getSummaryByCategory: async (userId) => {
    try {
      const [rows] = await db.execute(`
        SELECT 
          category,
          type,
          COUNT(*) as count,
          SUM(amount) as total
        FROM transactions
        WHERE user_id = ?
        GROUP BY category, type
        ORDER BY type, total DESC
      `, [userId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get daily summary (admin)
  getDailySummary: async (days = 30) => {
    try {
      const [rows] = await db.execute(`
        SELECT 
          DATE(date) as date,
          COUNT(*) as total_transactions,
          SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE 0 END) as pemasukan,
          SUM(CASE WHEN type = 'pengeluaran' THEN amount ELSE 0 END) as pengeluaran
        FROM transactions
        WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        GROUP BY DATE(date)
        ORDER BY date DESC
      `, [days]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Count transactions
  count: async () => {
    try {
      const [rows] = await db.execute(
        'SELECT COUNT(*) as total FROM transactions'
      );
      return rows[0].total;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = TransactionModel;