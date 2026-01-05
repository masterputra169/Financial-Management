// src/pages/AdminPage.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';
import SummaryCards from '../components/organisms/SummaryCards';
import AdminAnalytics from '../components/organisms/AdminAnalytics';
import Button from '../components/atoms/Button';

const AdminPage = ({ transactions, onDeleteTransaction }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus transaksi ini?')) {
      onDeleteTransaction(id);
      alert('✅ Transaksi berhasil dihapus!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Header 
        title={`Dashboard Admin - ${user?.username}`}
        subtitle="Kelola semua transaksi keuangan dengan fitur lengkap"
      />
      
      <main className="container mx-auto px-6 py-10 flex-grow">
        {/* Admin Welcome */}
        <div className="mb-6 p-6 bg-gradient-to-r from-green-100 to-emerald-100 border-l-4 border-green-500 rounded-lg shadow-md">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">👑</span>
            <div>
              <p className="font-bold text-green-800 text-lg">Selamat datang, Admin!</p>
              <p className="text-sm text-green-700">Anda memiliki akses penuh: CREATE, READ, UPDATE, DELETE</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards transactions={transactions} />

        {/* Analytics Dashboard */}
        <AdminAnalytics transactions={transactions} />

        {/* Transaction Table dengan CRUD */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-2xl font-bold text-gray-800">📊 Kelola Transaksi</h2>
            <Button onClick={() => navigate('/input')}>
              ➕ Tambah Transaksi
            </Button>
          </div>

          {transactions.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <span className="text-6xl mb-4 block">📭</span>
              <p className="text-gray-500 text-lg font-medium">Belum ada transaksi</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Kategori</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Deskripsi</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Jumlah</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Tipe</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">📅</span>
                          <span className="font-medium">{transaction.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-medium text-xs">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{transaction.description}</td>
                      <td className={`px-6 py-4 text-sm text-right font-bold ${
                        transaction.type === 'pemasukan' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'pemasukan' ? '↗️' : '↘️'}
                        Rp {parseFloat(transaction.amount).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          transaction.type === 'pemasukan' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => navigate(`/edit/${transaction.id}`)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-all"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-all"
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

export default AdminPage;