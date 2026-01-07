// models/activityModel.js
const db = require('../config/database');

const ActivityModel = {
  // Create activity log
  create: async (activityData) => {
    try {
      const { user_id, action, description, ip_address } = activityData;

      const [result] = await db.execute(
        `INSERT INTO activity_logs (user_id, action, description, ip_address) 
         VALUES (?, ?, ?, ?)`,
        [user_id, action, description || '', ip_address || null]
      );

      return {
        id: result.insertId,
        user_id,
        action,
        description,
        ip_address
      };
    } catch (error) {
      throw error;
    }
  },

  // Get all activities (admin)
  findAll: async (filters = {}) => {
    try {
      let query = `
        SELECT a.*, u.username, u.full_name 
        FROM activity_logs a 
        JOIN users u ON a.user_id = u.id
      `;
      const params = [];
      const conditions = [];

      if (filters.userId) {
        conditions.push('a.user_id = ?');
        params.push(filters.userId);
      }

      if (filters.action) {
        conditions.push('a.action = ?');
        params.push(filters.action);
      }

      if (filters.startDate) {
        conditions.push('DATE(a.created_at) >= ?');
        params.push(filters.startDate);
      }

      if (filters.endDate) {
        conditions.push('DATE(a.created_at) <= ?');
        params.push(filters.endDate);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY a.created_at DESC';

      // FIXED: Gunakan template literal untuk LIMIT
      if (filters.limit) {
        const limitNum = parseInt(filters.limit, 10);
        query += ` LIMIT ${limitNum}`;
      }

      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get activities by user
  findByUserId: async (userId, limit = 50) => {
    try {
      const limitNum = parseInt(limit, 10) || 50;
      
      const [rows] = await db.execute(`
        SELECT * FROM activity_logs 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ${limitNum}
      `, [userId]);
      
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // FIXED: Gunakan db bukan pool
  getRecent: async (limit = 10) => {
    try {
      const limitNum = parseInt(limit, 10) || 10;
      
      const [rows] = await db.execute(`
        SELECT a.*, u.username, u.full_name 
        FROM activity_logs a 
        JOIN users u ON a.user_id = u.id
        ORDER BY a.created_at DESC 
        LIMIT ${limitNum}
      `);
      
      return rows;
    } catch (error) {
      console.error('Get recent activity error:', error);
      throw error;
    }
  },

  // Get activity stats
  getStats: async () => {
    try {
      const [rows] = await db.execute(`
        SELECT 
          action,
          COUNT(*) as count
        FROM activity_logs
        GROUP BY action
        ORDER BY count DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Count activities today
  countToday: async () => {
    try {
      const [rows] = await db.execute(
        'SELECT COUNT(*) as total FROM activity_logs WHERE DATE(created_at) = CURDATE()'
      );
      return rows[0].total;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = ActivityModel;