// src/components/organisms/TransactionTable.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../atoms/Button';
import TransactionRow from '../molecules/TransactionRow';

const TransactionTable = ({ transactions }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-2xl font-bold text-gray-800">📊 Daftar Transaksi</h2>
        
        {/* Conditional Button */}
        {isLoggedIn ? (
          <Button onClick={() => navigate('/input')}>
            ➕ Tambah Transaksi
          </Button>
        ) : (
          <Button onClick={() => navigate('/login')}>
            🔐 Login untuk Tambah
          </Button>
        )}
      </div>

      {/* Table Content */}
      {transactions.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <span className="text-6xl mb-4 block">📭</span>
          <p className="text-gray-500 text-lg font-medium">Belum ada transaksi</p>
          <p className="text-gray-400 text-sm mt-2">
            {isLoggedIn 
              ? 'Mulai tambahkan transaksi pertama Anda' 
              : 'Login untuk menambahkan transaksi'}
          </p>
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
              {transactions.map((transaction, index) => (
                <TransactionRow key={index} transaction={transaction} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;