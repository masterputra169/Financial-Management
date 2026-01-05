// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/organisms/Navbar';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import FormPage from './pages/FormPage';
import EditPage from './pages/EditPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: '2025-11-01',
      type: 'pemasukan',
      category: 'Gaji',
      description: 'Gaji bulan November',
      amount: '5000000'
    },
    {
      id: 2,
      date: '2025-11-02',
      type: 'pengeluaran',
      category: 'Makanan',
      description: 'Makan siang di restoran',
      amount: '50000'
    },
    {
      id: 3,
      date: '2025-11-03',
      type: 'pengeluaran',
      category: 'Transport',
      description: 'Bensin motor',
      amount: '30000'
    }
  ]);

  // CREATE - Tambah transaksi (Guest & Admin)
  const handleAddTransaction = (newTransaction) => {
    const transactionWithId = {
      ...newTransaction,
      id: Date.now() // Generate unique ID
    };
    setTransactions([transactionWithId, ...transactions]);
  };

  // UPDATE - Edit transaksi (Admin only)
  const handleUpdateTransaction = (id, updatedTransaction) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...updatedTransaction, id } : t
    ));
  };

  // DELETE - Hapus transaksi (Admin only)
  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage transactions={transactions} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Form untuk Guest & Admin */}
            <Route 
              path="/input" 
              element={<FormPage onAddTransaction={handleAddTransaction} />} 
            />
            
            {/* Protected Routes - Admin Only */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminPage 
                    transactions={transactions}
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/edit/:id" 
              element={
                <ProtectedRoute>
                  <EditPage 
                    transactions={transactions}
                    onUpdateTransaction={handleUpdateTransaction}
                  />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}