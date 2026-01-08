// src/pages/UserPage.jsx - Dashboard User dengan CRUD & Charts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { transactionAPI } from '../services/api';
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
import { Bar, Doughnut, Line } from 'react-chartjs-2';

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

const UserPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalPemasukan: 0, totalPengeluaran: 0, saldo: 0 });
  const [categorySummary, setCategorySummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', category: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txRes, sumRes, catRes] = await Promise.all([
        transactionAPI.getAll(filter),
        transactionAPI.getSummary(),
        transactionAPI.getCategorySummary()
      ]);
      
      if (txRes.success) setTransactions(txRes.data);
      if (sumRes.success) setSummary(sumRes.data);
      if (catRes.success) setCategorySummary(catRes.data);
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

  // Prepare chart data
  const getPemasukanByCategory = () => {
    return categorySummary.filter(c => c.type === 'pemasukan');
  };

  const getPengeluaranByCategory = () => {
    return categorySummary.filter(c => c.type === 'pengeluaran');
  };

  // Doughnut Chart - Pemasukan vs Pengeluaran
  const balanceChartData = {
    labels: ['Pemasukan', 'Pengeluaran'],
    datasets: [
      {
        data: [summary.totalPemasukan, summary.totalPengeluaran],
        backgroundColor: ['#10B981', '#EF4444'],
        borderColor: ['#059669', '#DC2626'],
        borderWidth: 2,
      },
    ],
  };

  const balanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: '💰 Pemasukan vs Pengeluaran',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };

  // Bar Chart - Kategori Pemasukan
  const pemasukanCategories = getPemasukanByCategory();
  const pemasukanChartData = {
    labels: pemasukanCategories.map(c => c.category),
    datasets: [
      {
        label: 'Pemasukan (Rp)',
        data: pemasukanCategories.map(c => parseFloat(c.total)),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(5, 150, 105, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Bar Chart - Kategori Pengeluaran
  const pengeluaranCategories = getPengeluaranByCategory();
  const pengeluaranChartData = {
    labels: pengeluaranCategories.map(c => c.category),
    datasets: [
      {
        label: 'Pengeluaran (Rp)',
        data: pengeluaranCategories.map(c => parseFloat(c.total)),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(220, 38, 38, 1)',
        borderWidth: 2,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'Rp ' + value.toLocaleString('id-ID');
          }
        }
      }
    }
  };

  // Line Chart - Trend Transaksi (Last 7 days)
  const getLast7DaysTransactions = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTransactions = transactions.filter(tx => 
        tx.date.split('T')[0] === dateStr
      );
      
      const pemasukan = dayTransactions
        .filter(tx => tx.type === 'pemasukan')
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
      
      const pengeluaran = dayTransactions
        .filter(tx => tx.type === 'pengeluaran')
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
      
      last7Days.push({
        date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        pemasukan,
        pengeluaran
      });
    }
    
    return last7Days;
  };

  const trendData = getLast7DaysTransactions();
  const trendChartData = {
    labels: trendData.map(d => d.date),
    datasets: [
      {
        label: 'Pemasukan',
        data: trendData.map(d => d.pemasukan),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Pengeluaran',
        data: trendData.map(d => d.pengeluaran),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '📈 Trend Transaksi 7 Hari Terakhir',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'Rp ' + value.toLocaleString('id-ID');
          }
        }
      }
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Balance Doughnut Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="h-64">
              <Doughnut data={balanceChartData} options={balanceChartOptions} />
            </div>
          </div>

          {/* Pemasukan Bar Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-gray-800 mb-4">📊 Pemasukan per Kategori</h3>
            <div className="h-56">
              {pemasukanCategories.length > 0 ? (
                <Bar data={pemasukanChartData} options={categoryChartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <p>Belum ada data pemasukan</p>
                </div>
              )}
            </div>
          </div>

          {/* Pengeluaran Bar Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-gray-800 mb-4">📊 Pengeluaran per Kategori</h3>
            <div className="h-56">
              {pengeluaranCategories.length > 0 ? (
                <Bar data={pengeluaranChartData} options={categoryChartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <p>Belum ada data pengeluaran</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trend Line Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="h-80">
            <Line data={trendChartData} options={trendChartOptions} />
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