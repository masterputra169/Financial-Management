// src/components/organisms/AdminAnalytics.jsx
const AdminAnalytics = ({ transactions }) => {
  // Statistik
  const totalTransactions = transactions.length;
  const totalPemasukan = transactions
    .filter(t => t.type === 'pemasukan')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalPengeluaran = transactions
    .filter(t => t.type === 'pengeluaran')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const saldo = totalPemasukan - totalPengeluaran;

  // Transaksi per kategori
  const categoryStats = transactions.reduce((acc, t) => {
    const category = t.category;
    if (!acc[category]) {
      acc[category] = { count: 0, total: 0 };
    }
    acc[category].count += 1;
    acc[category].total += parseFloat(t.amount);
    return acc;
  }, {});

  // Rata-rata transaksi
  const avgPemasukan = transactions.filter(t => t.type === 'pemasukan').length > 0
    ? totalPemasukan / transactions.filter(t => t.type === 'pemasukan').length
    : 0;
  
  const avgPengeluaran = transactions.filter(t => t.type === 'pengeluaran').length > 0
    ? totalPengeluaran / transactions.filter(t => t.type === 'pengeluaran').length
    : 0;

  // Persentase
  const percentagePemasukan = totalPemasukan + totalPengeluaran > 0
    ? (totalPemasukan / (totalPemasukan + totalPengeluaran)) * 100
    : 0;

  return (
    <div className="mb-8 space-y-6">
      {/* Header Analytics */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-xl shadow-lg text-white">
        <h3 className="text-2xl font-bold mb-2">📊 Analytics Dashboard</h3>
        <p className="text-purple-100">Analisis lengkap transaksi keuangan Anda</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-600">Total Transaksi</h4>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{totalTransactions}</p>
          <p className="text-xs text-gray-500 mt-2">Semua transaksi</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-600">Transaksi Masuk</h4>
            <span className="text-2xl">💵</span>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {transactions.filter(t => t.type === 'pemasukan').length}
          </p>
          <p className="text-xs text-gray-500 mt-2">Pemasukan</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-600">Transaksi Keluar</h4>
            <span className="text-2xl">💸</span>
          </div>
          <p className="text-3xl font-bold text-red-600">
            {transactions.filter(t => t.type === 'pengeluaran').length}
          </p>
          <p className="text-xs text-gray-500 mt-2">Pengeluaran</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-600">Rasio Pemasukan</h4>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-3xl font-bold text-purple-600">{percentagePemasukan.toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-2">Dari total transaksi</p>
        </div>
      </div>

      {/* Average Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">💰</span>
            Rata-rata Transaksi
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Rata-rata Pemasukan</span>
              <span className="text-lg font-bold text-green-600">
                Rp {avgPemasukan.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Rata-rata Pengeluaran</span>
              <span className="text-lg font-bold text-red-600">
                Rp {avgPengeluaran.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">📋</span>
            Transaksi per Kategori
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {Object.entries(categoryStats).map(([category, stats]) => (
              <div key={category} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">{category}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {stats.count}x
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    Rp {stats.total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Progress Bars */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-2xl mr-2">📊</span>
          Visualisasi Keuangan
        </h4>
        
        {/* Pemasukan Bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Pemasukan</span>
            <span className="text-sm font-bold text-green-600">
              Rp {totalPemasukan.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${percentagePemasukan}%` }}
            ></div>
          </div>
        </div>

        {/* Pengeluaran Bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Pengeluaran</span>
            <span className="text-sm font-bold text-red-600">
              Rp {totalPengeluaran.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-red-400 to-red-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${100 - percentagePemasukan}%` }}
            ></div>
          </div>
        </div>

        {/* Saldo Net */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Saldo Bersih</span>
            <span className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              Rp {saldo.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;