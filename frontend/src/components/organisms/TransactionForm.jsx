// src/components/organisms/TransactionForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';

const TransactionForm = ({ onAddTransaction }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'pengeluaran',
    category: '',
    description: '',
    amount: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi
    if (!formData.category || !formData.description || !formData.amount) {
      alert('⚠️ Mohon lengkapi semua field!');
      return;
    }

    // Kirim data ke parent
    onAddTransaction(formData);

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'pengeluaran',
      category: '',
      description: '',
      amount: ''
    });
  };

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
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Form Input Transaksi</h2>
      
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
            💾 Simpan Transaksi
          </Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            ← Kembali
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;