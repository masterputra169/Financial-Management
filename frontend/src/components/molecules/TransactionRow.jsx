// src/components/molecules/TransactionRow.jsx
const TransactionRow = ({ transaction }) => {
  return (
    <tr className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 border-b border-gray-100">
      {/* Tanggal dengan Icon */}
      <td className="px-6 py-4 text-sm text-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-lg">📅</span>
          <span className="font-medium">{transaction.date}</span>
        </div>
      </td>
      
      {/* Kategori dengan Badge */}
      <td className="px-6 py-4 text-sm">
        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-medium text-xs shadow-sm">
          {transaction.category}
        </span>
      </td>
      
      {/* Deskripsi */}
      <td className="px-6 py-4 text-sm text-gray-600">{transaction.description}</td>
      
      {/* Jumlah dengan Icon Arrow */}
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
      
      {/* Tipe dengan Badge */}
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
  );
};

export default TransactionRow;
