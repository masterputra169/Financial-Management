// src/pages/FormPage.jsx - Add Transaction
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionAPI } from '../services/api';
import Footer from '../components/organisms/Footer';

const FormPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'pengeluaran',
    category: '',
    description: '',
    amount: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categoryOptions = {
    pemasukan: ['Gaji', 'Bonus', 'Investasi', 'Freelance', 'Lainnya'],
    pengeluaran: ['Makanan', 'Transport', 'Belanja', 'Tagihan', 'Hiburan', 'Kesehatan', 'Pendidikan', 'Lainnya']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Reset category when type changes
    if (name === 'type') {
      setFormData(prev => ({ ...prev, type: value, category: '' }));
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await transactionAPI.create(formData);
      if (res.success) {
        alert('✅ Transaksi berhasil ditambahkan!');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Gagal menambahkan transaksi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold">➕ Tambah Transaksi</h1>
          <p className="text-purple-100 mt-2">Catat pemasukan atau pengeluaran baru</p>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8 flex-grow">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">Tanggal *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">Tipe Transaksi *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="pengeluaran">💸 Pengeluaran</option>
                <option value="pemasukan">💵 Pemasukan</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">Kategori *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Pilih Kategori</option>
                {categoryOptions[formData.type].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">Deskripsi</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Contoh: Makan siang di restoran"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Jumlah (Rp) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-white transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 shadow-md'
                }`}
              >
                {loading ? 'Menyimpan...' : '💾 Simpan Transaksi'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all"
              >
                ← Batal
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FormPage;