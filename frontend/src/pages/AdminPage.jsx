// src/pages/AdminPage.jsx - Admin Dashboard with Charts
import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import Footer from '../components/organisms/Footer';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AdminPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, usersRes, actRes, txRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getUsers(),
        adminAPI.getActivities({ limit: 50 }),
        adminAPI.getAllTransactions({ limit: 100 })
      ]);

      if (dashRes.success) setDashboard(dashRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (actRes.success) setActivities(actRes.data);
      if (txRes.success) setAllTransactions(txRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleUser = async (id) => {
    if (!window.confirm('Yakin ingin mengubah status user ini?')) return;
    try {
      await adminAPI.toggleUserStatus(id);
      fetchData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Yakin ingin menghapus user ini? Semua data transaksi user akan ikut terhapus!')) return;
    try {
      await adminAPI.deleteUser(id);
      alert('✅ User berhasil dihapus!');
      fetchData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // Chart Data Preparation
  const getUserActivityChart = () => {
    const activeUsers = users.filter(u => u.is_active).length;
    const inactiveUsers = users.filter(u => !u.is_active).length;

    return {
      labels: ['Active Users', 'Inactive Users'],
      datasets: [
        {
          data: [activeUsers, inactiveUsers],
          backgroundColor: ['#10B981', '#EF4444'],
          borderColor: ['#059669', '#DC2626'],
          borderWidth: 2,
        },
      ],
    };
  };

  const getTransactionTypeChart = () => {
    const pemasukan = allTransactions.filter(tx => tx.type === 'pemasukan').length;
    const pengeluaran = allTransactions.filter(tx => tx.type === 'pengeluaran').length;

    return {
      labels: ['Pemasukan', 'Pengeluaran'],
      datasets: [
        {
          data: [pemasukan, pengeluaran],
          backgroundColor: ['#3B82F6', '#F59E0B'],
          borderColor: ['#2563EB', '#D97706'],
          borderWidth: 2,
        },
      ],
    };
  };

  const getTopUsersChart = () => {
    const topUsers = users
      .sort((a, b) => b.total_transactions - a.total_transactions)
      .slice(0, 5);

    return {
      labels: topUsers.map(u => u.username),
      datasets: [
        {
          label: 'Total Transaksi',
          data: topUsers.map(u => u.total_transactions),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(37, 99, 235, 1)',
          borderWidth: 2,
        },
      ],
    };
  };

  const getActivityTrendChart = () => {
    const activityCounts = activities.reduce((acc, act) => {
      const action = act.action;
      acc[action] = (acc[action] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(activityCounts),
      datasets: [
        {
          label: 'Jumlah Aktivitas',
          data: Object.values(activityCounts),
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(168, 85, 247, 0.8)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const getMoneyFlowChart = () => {
    const totalPemasukan = parseFloat(dashboard?.transactions?.totalPemasukan || 0);
    const totalPengeluaran = allTransactions
      .filter(tx => tx.type === 'pengeluaran')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    return {
      labels: ['Pemasukan', 'Pengeluaran'],
      datasets: [
        {
          label: 'Jumlah (Rp)',
          data: [totalPemasukan, totalPengeluaran],
          backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
          borderColor: ['rgba(5, 150, 105, 1)', 'rgba(220, 38, 38, 1)'],
          borderWidth: 2,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 10,
          font: {
            size: 11,
            weight: 'bold'
          }
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const moneyBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'Rp ' + (value / 1000000).toFixed(1) + 'M';
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-8">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold">👑 Admin Dashboard</h1>
          <p className="text-red-100 mt-2">Monitoring semua user dan aktivitas sistem</p>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8 flex-grow">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-3xl font-bold text-blue-600">{dashboard?.users?.total || 0}</p>
            <p className="text-xs text-gray-400 mt-1">👤 {dashboard?.users?.users || 0} user, 👑 {dashboard?.users?.admins || 0} admin</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">Total Transaksi</p>
            <p className="text-3xl font-bold text-green-600">{dashboard?.transactions?.total || 0}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
            <p className="text-gray-500 text-sm">Total Pemasukan</p>
            <p className="text-2xl font-bold text-purple-600">
              Rp {parseFloat(dashboard?.transactions?.totalPemasukan || 0).toLocaleString('id-ID')}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
            <p className="text-gray-500 text-sm">Aktivitas Hari Ini</p>
            <p className="text-3xl font-bold text-orange-600">{dashboard?.todayActivities || 0}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Activity Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-gray-800 mb-4">👥 Status User</h3>
            <div className="h-56">
              <Doughnut data={getUserActivityChart()} options={chartOptions} />
            </div>
          </div>

          {/* Transaction Type Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-gray-800 mb-4">📊 Tipe Transaksi</h3>
            <div className="h-56">
              <Pie data={getTransactionTypeChart()} options={chartOptions} />
            </div>
          </div>

          {/* Activity Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-gray-800 mb-4">📋 Distribusi Aktivitas</h3>
            <div className="h-56">
              <Doughnut data={getActivityTrendChart()} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Users Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-gray-800 mb-4">🏆 Top 5 User Teraktif</h3>
            <div className="h-64">
              <Bar data={getTopUsersChart()} options={barChartOptions} />
            </div>
          </div>

          {/* Money Flow Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-gray-800 mb-4">💰 Arus Keuangan Global</h3>
            <div className="h-64">
              <Bar data={getMoneyFlowChart()} options={moneyBarOptions} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b">
            {['overview', 'users', 'transactions', 'activities'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'overview' && '📊 '}
                {tab === 'users' && '👥 '}
                {tab === 'transactions' && '💰 '}
                {tab === 'activities' && '📋 '}
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-4">📋 Aktivitas Terbaru</h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {dashboard?.recentActivities?.map((act, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-white rounded-lg">
                        <span className="text-2xl">
                          {act.action === 'LOGIN' && '🔐'}
                          {act.action === 'LOGOUT' && '🚪'}
                          {act.action === 'REGISTER' && '✨'}
                          {act.action.includes('TRANSACTION') && '💰'}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{act.username}</p>
                          <p className="text-xs text-gray-500">{act.action}</p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(act.created_at).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Stats */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-4">👥 Statistik User</h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {dashboard?.userStats?.slice(0, 10).map((u, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            u.role === 'admin' ? 'bg-yellow-100' : 'bg-blue-100'
                          }`}>
                            {u.role === 'admin' ? '👑' : '👤'}
                          </div>
                          <div>
                            <p className="font-medium">{u.username}</p>
                            <p className="text-xs text-gray-500">{u.total_transactions} transaksi</p>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${u.is_active ? 'text-green-600' : 'text-red-600'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-4">👥 Daftar Semua User</h3>
                <div className="space-y-3 max-h-[480px] overflow-y-auto">
                  {users.map((u) => (
                    <div key={u.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                            u.role === 'admin' ? 'bg-yellow-100' : 'bg-blue-100'
                          }`}>
                            {u.role === 'admin' ? '👑' : '👤'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-gray-800">{u.full_name}</p>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                u.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {u.role}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {u.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">@{u.username} • {u.email}</p>
                            <div className="flex gap-4 mt-2">
                              <span className="text-xs text-gray-600">💰 {u.total_transactions} transaksi</span>
                              <span className="text-xs text-green-600 font-medium">
                                ↑ Rp {parseFloat(u.total_pemasukan).toLocaleString('id-ID')}
                              </span>
                              <span className="text-xs text-red-600 font-medium">
                                ↓ Rp {parseFloat(u.total_pengeluaran).toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                        </div>
                        {u.role !== 'admin' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleUser(u.id)}
                              className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              {u.is_active ? '🚫 Nonaktifkan' : '✅ Aktifkan'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              🗑️ Hapus
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-4">💰 Semua Transaksi User</h3>
                <div className="space-y-3 max-h-[480px] overflow-y-auto">
                  {allTransactions.map((tx) => (
                    <div key={tx.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                            tx.type === 'pemasukan' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {tx.type === 'pemasukan' ? '💰' : '💸'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-gray-800">{tx.full_name || tx.username}</p>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                {tx.category}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                tx.type === 'pemasukan' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {tx.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{tx.description || 'Tidak ada deskripsi'}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              📅 {new Date(tx.date).toLocaleDateString('id-ID', { 
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${tx.type === 'pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                            {tx.type === 'pemasukan' ? '+' : '-'} Rp {parseFloat(tx.amount).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-4">📋 Log Aktivitas Sistem</h3>
                <div className="space-y-3 max-h-[480px] overflow-y-auto">
                  {activities.map((act) => (
                    <div key={act.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                          act.action === 'LOGIN' ? 'bg-green-100' :
                          act.action === 'LOGOUT' ? 'bg-gray-100' :
                          act.action === 'REGISTER' ? 'bg-blue-100' :
                          act.action.includes('CREATE') ? 'bg-purple-100' :
                          act.action.includes('UPDATE') ? 'bg-yellow-100' :
                          act.action.includes('DELETE') ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          {act.action === 'LOGIN' && '🔐'}
                          {act.action === 'LOGOUT' && '🚪'}
                          {act.action === 'REGISTER' && '✨'}
                          {act.action.includes('CREATE') && '➕'}
                          {act.action.includes('UPDATE') && '✏️'}
                          {act.action.includes('DELETE') && '🗑️'}
                          {!['LOGIN', 'LOGOUT', 'REGISTER'].includes(act.action) && 
                           !act.action.includes('CREATE') && 
                           !act.action.includes('UPDATE') && 
                           !act.action.includes('DELETE') && '📝'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-800">{act.full_name || act.username}</p>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                              act.action === 'LOGIN' ? 'bg-green-100 text-green-700' :
                              act.action === 'LOGOUT' ? 'bg-gray-100 text-gray-700' :
                              act.action === 'REGISTER' ? 'bg-blue-100 text-blue-700' :
                              act.action.includes('CREATE') ? 'bg-purple-100 text-purple-700' :
                              act.action.includes('UPDATE') ? 'bg-yellow-100 text-yellow-700' :
                              act.action.includes('DELETE') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {act.action}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{act.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            🕐 {new Date(act.created_at).toLocaleString('id-ID', {
                              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                              hour: '2-digit', minute: '2-digit', second: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;