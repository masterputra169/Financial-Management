// src/pages/EditPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';
import FormField from '../components/molecules/FormField';
import Button from '../components/atoms/Button';

const EditPage = ({ transactions, onUpdateTransaction }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const transaction = transactions.find(t => t.id === parseInt(id));
  
  const [formData, setFormData] = useState({
    date: '',
    type: 'pengeluaran',
    category: '',
    description: '',
    amount: ''
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        type: transaction.type,
        category: transaction.category,
        description: transaction.description,
        amount: transaction.amount
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.description || !formData.amount) {
      alert('⚠️ Mohon lengkapi semua field!');
      return;
    }

    onUpdateTransaction(parseInt(id), formData);
    alert('✅ Transaksi berhasil diupdate!');
    navigate('/admin');
  };

  if (!transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Transaksi tidak ditemukan</p>
      </div>
    );
  }

  const categoryOptions = formData.type === 'pemasukan' 
    ? [
        { value: '', label: 'Pilih Kategori' },
        { value: 'Gaji', label: 'Gaji' },
        { value: 'Bonus', label: 'Bonus' },
        { value: 'Investasi', label: 'Investasi' },
        { value: 'Lainnya', label: 'Lainnya' }
      ]
    : [
        { value: '', label: 'Pilih Kategori' },
        { value: 'Makanan', label: 'Makanan' },
        { value: 'Transport', label: 'Transport' },
        { value: 'Belanja', label: 'Belanja' },
        { value: 'Tagihan', label: 'Tagihan' },
        { value: 'Hiburan', label: 'Hiburan' },
        { value: 'Lainnya', label: 'Lainnya' }
      ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Header title="Edit Transaksi" subtitle="Update data transaksi Anda" />
      
      <main className="container mx-auto px-6 py-10 flex-grow">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">✏️ Form Edit Transaksi</h2>
          
          <div>
            <FormField
              label="Tanggal"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <FormField
              type="select"
              label="Tipe Transaksi"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              options={[
                { value: 'pengeluaran', label: 'Pengeluaran' },
                { value: 'pemasukan', label: 'Pemasukan' }
              ]}
            />

            <FormField
              type="select"
              label="Kategori"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              options={categoryOptions}
            />

            <FormField
              label="Deskripsi"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Contoh: Beli groceries di supermarket"
              required
            />

            <FormField
              label="Jumlah (Rp)"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              required
            />

            <div className="flex gap-4 mt-8">
              <Button variant="success" onClick={handleSubmit}>
                💾 Update Transaksi
              </Button>
              <Button variant="secondary" onClick={() => navigate('/admin')}>
                ← Batal
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditPage;