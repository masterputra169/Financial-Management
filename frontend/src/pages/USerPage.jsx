// src/pages/UserPage.jsx - Dashboard User dengan CRUD
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { transactionAPI } from '../services/api';
import Footer from '../components/organisms/Footer';

const UserPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalPemasukan: 0, totalPengeluaran: 0, saldo: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', category: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txRes, sumRes] = await Promise.all([
        transactionAPI.getAll(filter),
        transactionAPI.getSummary()
      ]);
      
      if (txRes.success) setTransactions(txRes.data);
      if (sumRes.success) setSummary(sumRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus transaksi ini?')) return;
    
    try {
      const res = await transactionAPI.delete(id);
      if (res.success) {
        alert('✅ Transaksi berhasil dihapus!');
        fetchData();
      }
    } catch (error) {
      alert('❌ Gagal menghapus: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold">👋 Halo, {user?.full_name || user?.username}!</h1>
          <p className="text-blue-100 mt-2">Kelola transaksi keuangan Anda di sini</p>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8 flex-grow">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-xl text-white shadow-lg">
            <p className="text-green-100 text-sm font-medium">Total Pemasukan</p>
            <p className="text-3xl font-bold mt-2">Rp {summary.totalPemasukan.toLocaleString('id-ID')}</p>
            <p className="text-green-200 text-sm mt-2">💵 Income</p>
          </div>
          
          <div className="bg-gradient-to-br from-red-400 to-red-600 p-6 rounded-xl text-white shadow-lg">
            <p className="text-red-100 text-sm font-medium">Total Pengeluaran</p>
            <p className="text-3xl font-bold mt-2">Rp {summary.totalPengeluaran.toLocaleString('id-ID')}</p>
            <p className="text-red-200 text-sm mt-2">💸 Expense</p>
          </div>
          
          <div className={`bg-gradient-to-br ${summary.saldo >= 0 ? 'from-blue-400 to-blue-600' : 'from-gray-400 to-gray-600'} p-6 rounded-xl text-white shadow-lg`}>
            <p className="text-blue-100 text-sm font-medium">Saldo</p>
            <p className="text-3xl font-bold mt-2">Rp {summary.saldo.toLocaleString('id-ID')}</p>
            <p className="text-blue-200 text-sm mt-2">💰 Balance</p>
          </div>
        </div>

        {/* Action & Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Tipe</option>
                <option value="pemasukan">Pemasukan</option>
                <option value="pengeluaran">Pengeluaran</option>
              </select>
            </div>
            
            <button
              onClick={() => navigate('/transactions/add')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition-all"
            >
              ➕ Tambah Transaksi
            </button>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">📊 Daftar Transaksi ({transactions.length})</h2>
          </div>

          {transactions.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-6xl">📭</span>
              <p className="text-gray-500 mt-4 text-lg">Belum ada transaksi</p>
              <button
                onClick={() => navigate('/transactions/add')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                Tambah Transaksi Pertama
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Kategori</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Deskripsi</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Jumlah</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Tipe</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        📅 {new Date(tx.date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{tx.description || '-'}</td>
                      <td className={`px-6 py-4 text-sm text-right font-bold ${
                        tx.type === 'pemasukan' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'pemasukan' ? '+' : '-'} Rp {parseFloat(tx.amount).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          tx.type === 'pemasukan' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => navigate(`/transactions/edit/${tx.id}`)}
                            className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs font-medium"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium"
                          >
                            🗑️ Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserPage;