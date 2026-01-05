// src/pages/FormPage.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';
import TransactionForm from '../components/organisms/TransactionForm';

const FormPage = ({ onAddTransaction }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleAddTransaction = (newTransaction) => {
    onAddTransaction(newTransaction);
    alert('✅ Transaksi berhasil ditambahkan!');
    
    // Navigate berdasarkan status login
    if (isLoggedIn) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Header 
        title="Tambah Transaksi" 
        subtitle={isLoggedIn ? "Tambah transaksi sebagai Admin" : "Tambah transaksi sebagai Guest"}
      />
      
      <main className="container mx-auto px-6 py-10 flex-grow">
        {/* Info untuk Guest */}
        {!isLoggedIn && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 rounded-lg">
            <p className="font-semibold">ℹ️ Mode Guest</p>
            <p className="text-sm">Anda bisa menambah transaksi. Login untuk fitur Edit & Hapus</p>
          </div>
        )}

        <TransactionForm 
          onAddTransaction={handleAddTransaction}
        />
      </main>

      <Footer />
    </div>
  );
};

export default FormPage;