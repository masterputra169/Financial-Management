// src/pages/HomePage.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';
import SummaryCards from '../components/organisms/SummaryCards';
import Button from '../components/atoms/Button';

const HomePage = ({ transactions }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Header 
        title="Dashboard Keuangan" 
        subtitle="Kelola transaksi keuangan Anda"
      />
      
      <main className="container mx-auto px-6 py-10 flex-grow">
        {/* Info Alert */}
        {!isLoggedIn ? (
          <div className="mb-6 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 rounded-lg">
            <p className="font-semibold">ℹ️ Mode Guest</p>
            <p className="text-sm">Anda bisa menambah dan melihat transaksi. Login sebagai admin untuk fitur lengkap (Edit & Hapus)</p>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-purple-100 border-l-4 border-purple-500 text-purple-700 rounded-lg">
            <p className="font-semibold">👑 Anda Login sebagai Admin</p>
            <p className="text-sm">Silakan gunakan Admin Dashboard untuk mengelola transaksi dengan fitur lengkap</p>
          </div>
        )}

        <SummaryCards transactions={transactions} />

        {/* Transaction Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-2xl font-bold text-gray-800">📊 Daftar Transaksi</h2>
            
            {/* HANYA Guest yang bisa tambah di HomePage */}
            {!isLoggedIn && (
              <Button onClick={() => navigate('/input')}>
                ➕ Tambah Transaksi
              </Button>
            )}
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tipe
                    </th>
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
                        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-medium text-xs shadow-sm">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{transaction.description}</td>
                      <td className={`px-6 py-4 text-sm text-right font-bold ${
                        transaction.type === 'pemasukan' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <span className="inline-flex items-center">
                          {transaction.type === 'pemasukan' ? '↗️' : '↘️'}
                          <span className="ml-1">
                            Rp {parseFloat(transaction.amount).toLocaleString('id-ID')}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${
                          transaction.type === 'pemasukan' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
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

export default HomePage;