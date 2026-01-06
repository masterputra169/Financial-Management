// src/pages/AdminPage.jsx - Admin Monitoring Dashboard
import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import Footer from '../components/organisms/Footer';

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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">User</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Role</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Transaksi</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Total Pemasukan</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Total Pengeluaran</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span>{u.role === 'admin' ? '👑' : '👤'}</span>
                            <div>
                              <p className="font-medium">{u.full_name}</p>
                              <p className="text-xs text-gray-500">@{u.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{u.email}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            u.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-medium">{u.total_transactions}</td>
                        <td className="px-4 py-3 text-right text-green-600 font-medium">
                          Rp {parseFloat(u.total_pemasukan).toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3 text-right text-red-600 font-medium">
                          Rp {parseFloat(u.total_pengeluaran).toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs ${
                            u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {u.role !== 'admin' && (
                            <div className="flex justify-center gap-1">
                              <button
                                onClick={() => handleToggleUser(u.id)}
                                className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs"
                              >
                                {u.is_active ? '🚫' : '✅'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                              >
                                🗑️
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">User</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Tanggal</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Kategori</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Deskripsi</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Jumlah</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Tipe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {allTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          <span className="font-medium">{tx.full_name || tx.username}</span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {new Date(tx.date).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {tx.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{tx.description || '-'}</td>
                        <td className={`px-4 py-3 text-sm text-right font-bold ${
                          tx.type === 'pemasukan' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          Rp {parseFloat(tx.amount).toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            tx.type === 'pemasukan' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Waktu</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">User</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Deskripsi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {activities.map((act) => (
                      <tr key={act.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(act.created_at).toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium">{act.full_name || act.username}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            act.action === 'LOGIN' ? 'bg-green-100 text-green-700' :
                            act.action === 'LOGOUT' ? 'bg-gray-100 text-gray-700' :
                            act.action === 'REGISTER' ? 'bg-blue-100 text-blue-700' :
                            act.action.includes('CREATE') ? 'bg-purple-100 text-purple-700' :
                            act.action.includes('UPDATE') ? 'bg-yellow-100 text-yellow-700' :
                            act.action.includes('DELETE') ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {act.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{act.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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