// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Terjadi kesalahan');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ==================== AUTH API ====================
export const authAPI = {
  login: async (username, password) => {
    const response = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  register: async (userData) => {
    const response = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: () => fetchAPI('/auth/profile'),
  verifyToken: () => fetchAPI('/auth/verify'),
  isAuthenticated: () => !!getToken(),
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// ==================== TRANSACTION API (User) ====================
export const transactionAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const query = params.toString();
    return fetchAPI(`/transactions${query ? `?${query}` : ''}`);
  },

  getById: (id) => fetchAPI(`/transactions/${id}`),

  create: (data) => fetchAPI('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id, data) => fetchAPI(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id) => fetchAPI(`/transactions/${id}`, { method: 'DELETE' }),

  getSummary: () => fetchAPI('/transactions/summary'),
  getCategorySummary: () => fetchAPI('/transactions/summary/category'),
};

// ==================== ADMIN API ====================
export const adminAPI = {
  getDashboard: () => fetchAPI('/admin/dashboard'),
  
  getUsers: () => fetchAPI('/admin/users'),
  getUserDetail: (id) => fetchAPI(`/admin/users/${id}`),
  toggleUserStatus: (id) => fetchAPI(`/admin/users/${id}/toggle-status`, { method: 'PUT' }),
  deleteUser: (id) => fetchAPI(`/admin/users/${id}`, { method: 'DELETE' }),
  
  getActivities: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const query = params.toString();
    return fetchAPI(`/admin/activities${query ? `?${query}` : ''}`);
  },
  
  getActivityStats: () => fetchAPI('/admin/activities/stats'),
  getAllTransactions: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const query = params.toString();
    return fetchAPI(`/transactions/all${query ? `?${query}` : ''}`);
  },
  getGlobalSummary: () => fetchAPI('/transactions/global-summary'),
  getDailySummary: (days) => fetchAPI(`/admin/summary/daily${days ? `?days=${days}` : ''}`),
};

export default { authAPI, transactionAPI, adminAPI };